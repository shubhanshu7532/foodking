/**
 * Controller for handling restaurant operations.
 * @file Restaurant Controller
 * @module Restaurant Controller
 * @category controllers
 * @subcategory Restaurant
 */

import db from "../../models/index.js"
import cache from "../../utils/cache.util.js"
import { Op } from "sequelize"
import Sequelize from "sequelize"
import logger from "../../utils/logger.util.js"
import * as restaurantService from "../../services/restaurant.service.js"

const is_prod = process.env.NODE_ENV === "production" ? true : false


const { Restaurant, sequelize } = db


// async function findNearbyRestaurants(latitude, longitude, radius) {
//     const restaurants = await Sequelize.query(
//         `
//       SELECT 
//         restaurant_name, latitude, longitude,
//         ST_Distance(
//           ST_MakePoint(longitude, latitude),
//           ST_MakePoint(:longitude, :latitude)
//         ) AS distance
//       FROM restaurants
//       WHERE ST_Distance(
//           ST_MakePoint(longitude, latitude),
//           ST_MakePoint(:longitude, :latitude)
//       ) <= :radius
//       ORDER BY distance;
//       `,
//         {
//             replacements: {
//                 latitude,
//                 longitude,
//                 radius
//             },
//             type: Sequelize.QueryTypes.SELECT
//         }
//     );

//     return restaurants;
// }

async function getNearbyRestaurants(latitude, longitude, limit = 10) {
    const distanceQuery = `
        SELECT *, (
            6371 * acos (
            cos ( radians(:latitude) )
            * cos( radians( ST_Y(coordinates) ) )
            * cos( radians( ST_X(coordinates) ) - radians(:longitude) )
            + sin ( radians(:latitude) )
            * sin( radians( ST_Y(coordinates) ) )
            )
        ) AS distance
        FROM "restaurants"
        ORDER BY distance
        LIMIT :limit;
    `;

    const restaurants = await sequelize.query(distanceQuery, {
        replacements: { latitude, longitude, limit },
        type: Sequelize.QueryTypes.SELECT
    });

    return restaurants;
}
/**
  * Sends an OTP (One-Time Password) to the restaurant's phone number.
  * @controller restaurant
  * @route POST /api/v1/restaurant/otp
  * @param {Object} request - The request object containing the restaurant's phone number.
  * @param {Object} reply - The reply object used to send the response.
  * @body {string} phone.required - The restaurant's phone number.
  * @returns {Promise<Object>} - A promise that resolves to a success message upon successful OTP generation and sending.
  * @throws {Error} - If the OTP limit is reached, the restaurant is banned, the OTP generation or sending fails, or there is an error during the process.
*/

export async function otp(request, reply) {
    try {
        const { phone } = request.body
        const restaurant = await getNearbyRestaurants(40.7128, -74.0060)//findNearbyRestaurants(40.7128, -74.0060, 5000)
        console.log(restaurant)

        const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip;
        const cache_key = `otp_request_count_${ip}_${phone}`;
        const cache_val = (await cache.get(cache_key)) || 0;
        if (cache_val && cache_val >= 5 && is_prod) {
            return reply.status(429).send({
                error: "Otp limit reached. Please try again after 30 mins",
            });
        }
        const user = await Restaurant.findOne({ where: { phone } })
        if (user && user.is_banned) {
            return reply.status(403).send({
                error: "You're banned from using our services. If you think this is a mistake, please contact us.",
            });
        }

        const otp = await restaurantService.generateOTP(phone)

        if (is_prod) {
            await restaurantService.sendOtp(phone, otp) // send otp via sms
            cache.set(cache_key, cache_val + 1, 60 * 30) // set cache for 30 mins to limit otp requests from same ip (in production)
            return reply.status(200).send({ message: "Otp sent" }) // send success response
        } else {
            console.log(otp)
            return reply.status(200).send({ message: otp }) // in development, send otp in response
        }
    } catch (error) {
        logger.error(`restaurant.controller.otp: ${error}`)
        if (is_prod) {
            return reply.status(500).send({ error: "Your request couldn't be processed, Please try after some time" })
        } else {
            return reply.status(500).send({ error: error.message })
        }
    }
}

/**
 * Logs in a restaurant with a phone number and OTP.
 * @controller restaurant
 * @route POST /api/v1/restaurant/login
 * @param {object} request - The request object.
 * @param {object} reply - The reply object.
 * @body {string} phone.required - The restaurant's phone number.
 * @body {string} otp.required - The OTP sent to the restaurant's phone number.
 * @body {string} referral_code - The referral code of the restaurant who referred the new restaurant.
 * @returns {object} The response object containing a success message and token.
 * @throws {Error} - If the restaurant is banned, the OTP is invalid, or there is an error during the process.
 */
export async function login(request, reply) {
    try {

        const { phone, otp, first_name = null, last_name = null, state = null, country = null, city = null, location = null, longitude = null, latitude = null, restaurant_name = null, restaurant_address = null, category = null } = request.body

        const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip

        const cache_key = `login_request_count_${ip}`
        const cache_val = (await cache.get(cache_key)) || 0;

        if (is_prod && cache_val && cache_val >= 10) {
            return reply.status(429).send({
                error: "Login limit reached. Please try again after 30 mins",
            });
        }

        await cache.set(cache_key, cache_val + 1, 60 * 30)
        const user = await restaurantService.loginWithOTP(phone, otp, first_name, last_name, state, country, city, location, restaurant_name, restaurant_address, category, longitude, latitude)

        const token = await reply.jwtSign({
            id: user.id,
            username: user.username,
        })

        await user.save();
        return reply.status(200).send({ message: "Logged in", token, validity: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) })
    } catch (error) {
        logger.error(`restaurant.controller.login: ${error}`)

        return reply.status(500).send({ error: error.message })

    }
}


/**
 * Logs out a restaurant by clearing the token cookie.
 * @controller restaurant
 * @role restaurant
 * @route GET /api/v1/restaurant/logout
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
        logger.error(`restaurants.controller.logout: ${error}`)
        if (is_prod) {
            return reply.status(500).send({ error: "Your request couldn't be processed, Please try after some time" })
        } else {

        }
    }
}

/**
 * Retrieves the profile of the authenticated restaurant.
 * @controller restaurant
 * @role restaurant
 * @route GET /api/v1/restaurant/profile
 * @returns {Object} The response object containing the restaurant profile information.
 * @throws {Error} If an error occurs while retrieving the restaurant profile.
 */
export async function getProfile(request, reply) {
    try {
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
        logger.error(`restaurant.controller.getProfile: ${error}`)
        if (is_prod) {
            return reply.status(500).send({ error: "Your request couldn't be processed, Please try after some time" })

        } else {
            return reply.status(500).send({ error: error.message })
        }
    }
}


/**
 * Updates the profile of the authenticated restaurant.
 * @controller restaurant
 * @role restaurant, admin
 * @route PUT /api/v1/restaurant/profile
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while updating the restaurant profile.
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
            const usernameExist = await Restaurant.findOne({ where: { username } })
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
        logger.error(`restaurant.controller.updateProfile: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}

/**
 * user can get all restaurant near to him according category and avg timer.
 * @controller restaurant
 * @role user
 * @route Get /api/v1/restaurant/getAllForUser
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while getting all nearby restaurant.
 */

export async function getAllRestaurantsToUser(request, reply) {
    try {
        // const { category = 'all', limit = 10, skip = 0, time = 40 } = request.query;
        // const avgTime = parseInt(time);
        // const city = request.user.city;
        // const state = request.user.state;
        // const country = request.user.country;

        // // Construct the where conditions
        // let whereConditions = {
        //     avgTime: { [Op.lte]: avgTime }, // average time less than or equal to provided time
        //     city,
        //     state,
        //     country,
        // };

        // // If a specific category is provided and it's not 'all', add the category to the conditions
        // if (category !== 'all') {
        //     whereConditions.category = category;
        // }

        // console.log(whereConditions)


        // // Execute the query
        // const restaurants = await Restaurant.findAll({
        //     where: whereConditions,
        //     limit: parseInt(limit),
        //     offset: parseInt(skip),
        //     order: [['avgTime', 'ASC']]
        // });

        // // Send the response
        // reply.status(200).send(restaurants)

        const user = request.user
        if (!user || !user.coordinates) {
            throw new Error('User not found or coordinates not set');
        }
        const longitude = parseFloat(user.coordinates.coordinates[0]);
        const latitude = parseFloat(user.coordinates.coordinates[1]);
        const userCoordinates = Sequelize.literal(`ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`);

        // Query for restaurants within 3 km radius
        const nearbyRestaurants = await Restaurant.findAll({
            where: Sequelize.where(
                Sequelize.fn(
                    'ST_DWithin',
                    Sequelize.col('coordinates'), // make sure this matches your column name in the database
                    userCoordinates,
                    3000  // 3000 meters = 3 km
                ),
                true
            ),
            order: Sequelize.literal(`ST_DistanceSphere(coordinates, ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)) ASC`)
        });
        reply.status(200).send(nearbyRestaurants);
    } catch (error) {
        return reply.status(500).send({ error: error.message })
    }
}