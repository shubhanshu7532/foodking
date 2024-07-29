/**
 * Controller for handling user-related operations.
 * @file User Controller
 * @module User Controller
 * @category controllers
 * @subcategory user
 */

import db from "../../models"
import cache from "../../utils/cache.util.js"
import logger from "../../utils/logger.util.js"
import * as userService from "../../services/user.service.js"

const is_prod = process.env.NODE_ENV === "production" ? true : false



const { User } = db


/**
  * Sends an OTP (One-Time Password) to the user's phone number.
  * @controller user
  * @route POST /api/v1/user/otp
  * @param {Object} request - The request object containing the user's phone number.
  * @param {Object} reply - The reply object used to send the response.
  * @body {string} phone.required - The user's phone number.
  * @returns {Promise<Object>} - A promise that resolves to a success message upon successful OTP generation and sending.
  * @throws {Error} - If the OTP limit is reached, the user is banned, the OTP generation or sending fails, or there is an error during the process.
*/

export async function otp(request, reply) {
    try {
        const { phone } = request.body

        const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip;
        const cache_key = `otp_request_count_${ip}_${phone}`;
        const cache_val = (await cache.get(cache_key)) || 0;
        if (cache_val && cache_val >= 5 && is_prod) {
            return reply.status(429).send({
                error: "Otp limit reached. Please try again after 30 mins",
            });
        }
        const user = await User.findOne({ where: { phone } })
        if (user && user.is_banned) {
            return reply.status(403).send({
                error: "You're banned from using our services. If you think this is a mistake, please contact us.",
            });
        }

        const otp = await userService.generateOTP(phone)

        if (is_prod) {
            await userService.sendOtp(phone, otp) // send otp via sms
            cache.set(cache_key, cache_val + 1, 60 * 30) // set cache for 30 mins to limit otp requests from same ip (in production)
            return reply.status(200).send({ message: "Otp sent" }) // send success response
        } else {
            console.log(otp)
            return reply.status(200).send({ message: otp }) // in development, send otp in response
        }
    } catch (error) {
        logger.error(`users.controller.otp: ${error}`)
        if (is_prod) {
            return reply.status(500).send({ error: "Your request couldn't be processed, Please try after some time" })
        } else {
            return reply.status(500).send({ error: error.message })
        }

    }
}

/**
 * Logs in a user with a phone number and OTP.
 * @controller user
 * @route POST /api/v1/user/login
 * @param {object} request - The request object.
 * @param {object} reply - The reply object.
 * @body {string} phone.required - The user's phone number.
 * @body {string} otp.required - The OTP sent to the user's phone number.
 * @body {string} referral_code - The referral code of the user who referred the new user.
 * @returns {object} The response object containing a success message and token.
 * @throws {Error} - If the user is banned, the OTP is invalid, or there is an error during the process.
 */
export async function login(request, reply) {
    try {

        const { phone, otp } = request.body

        const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip


        const cache_key = `login_request_count_${ip}`
        const cache_val = (await cache.get(cache_key)) || 0;

        if (is_prod && cache_val && cache_val >= 10) {
            return reply.status(429).send({
                error: "Login limit reached. Please try again after 30 mins",
            });
        }

        await cache.set(cache_key, cache_val + 1, 60 * 30)
        const user = await userService.loginWithOTP(phone, otp)

        const token = await reply.jwtSign({
            id: user.id,
            role: user.role,
            username: user.username,
        })

        // user.country = "India"
        // user.state = "Rajasthan"
        // user.city = "Jaipur"
        await user.save();
        return reply.status(200).send({ message: "Logged in", token, validity: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
    } catch (error) {
        logger.error(`user.controller.login: ${error}`)
        if (is_prod) {
            return reply.status(500).send({ error: "Your request couldn't be processed, Please try after some time" })

        } else {
            return reply.status(500).send({ error: error.message })
        }
    }
}


/**
 * Logs out a user by clearing the token cookie.
 * @controller user
 * @role user
 * @route GET /api/v1/user/logout
 * @param {object} request - The request object.
 * @param {object} reply - The reply object.
 * @returns {object} The response object containing a success message.
 * @throws {Error} - If there is an error during the process.
 */
export async function logout(request, reply) {
    try {
        // reply.clearCookie("token");
        return reply.status(200).send({ message: "Logged out" })
    } catch (error) {
        logger.error(`users.controller.logout: ${error}`)
        if (is_prod) {
            return reply.status(500).send({ error: "Your request couldn't be processed, Please try after some time" })
        } else {

        }
    }
}

/**
 * Retrieves the profile of the authenticated user.
 * @controller user
 * @role user
 * @route GET /api/v1/user/profile
 * @returns {Object} The response object containing the user profile information.
 * @throws {Error} If an error occurs while retrieving the user profile.
 */
export async function getProfile(request, reply) {
    try {
        console.log("coming this request here")
        const user = request.user;
        if (!user) return reply.status(401).send({ error: "Unauthorized" });
        return reply.status(200).send({
            id: user?.id,
            createdAt: user?.createdAt,
            updatedAt: user?.updatedAt,
            phone: user?.phone || "",
            first_name: user?.first_name || "",
            last_name: user?.last_name || "",
            username: user?.username || "",
            country: user?.country || "",
            state: user?.state || "",
            city: user?.city || "",
        })

    } catch (error) {
        logger.error(`user.controller.getProfile: ${error}`)
        if (is_prod) {
            return reply.status(500).send({ error: "Your request couldn't be processed, Please try after some time" })

        } else {
            return reply.status(500).send({ error: error.message })
        }
    }
}


/**
 * Updates the profile of the authenticated user.
 * @controller user
 * @role user, admin
 * @route PUT /api/v1/user/profile
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while updating the user profile.
 */
export async function updateProfile(request, reply) {
    try {
        const {
            first_name,
            last_name,
            username,
            city,
            state,
        } = request.body
        let user;
        user = request.user
        if (username) {
            const usernameExist = await User.findOne({ where: { username } })
            if (usernameExist && usernameExist.id !== user.id) return reply.status(400).send({ error: "Username already belongs to another user" })
        }
        if (username !== user.username) user.username = username
        if (first_name !== user.first_name) user.first_name = first_name
        if (last_name !== user.last_name) user.last_name = last_name
        user.city = city
        user.state = state
        await user.save()
        reply.status(200).send({ user })
    } catch (error) {
        logger.error(`user.controller.updateProfile: ${error}`)
        if (is_prod) {
            return reply.status(500).send({ error: "Your request couldn't be processed, Please try after some time" })
        } else {
            return reply.status(500).send({ error: error.message })
        }
    }
}

