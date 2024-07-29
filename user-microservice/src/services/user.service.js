/**
 * Service for handling user-related operations.
 * @file User Service
 * @module User Service
 * @category services
 * @subcategory user
 */
import { sendSms } from "../utils/sms.util.js"
import logger from "../utils/logger.util.js"
import db from "../models/index.js"
import { uniqueUsernameGenerator } from "../utils/username.util.js"
import { Op } from "sequelize"
const { Otp, User } = db;

/**
 * Generates a one-time password (OTP) for the given phone number.
 * @param {string} phone - The phone number for which to generate the OTP.
 * @returns {Promise<string>} - A promise that resolves to the generated OTP.
 * @throws {Error} - If there is an error while generating the OTP.
*/
export async function generateOTP(phone) {
    try {
        let otp;

        const last_otp = await Otp.findOne({
            where: {
                phone,
                createdAt: {
                    [Op.gte]: new Date(new Date() - 5 * 60 * 1000), // created within 5 mins
                },
            },
        });

        // if otp is already generated (within 5 mins) then return that otp, else generate new otp
        if (last_otp) {
            otp = last_otp.otp;
        } else {
            otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digit otp (string)
            await Otp.create({ phone, otp });
        }

        return otp;
    } catch (err) {
        logger.error(`generateOTP: ${err}`);
        throw err;
    }
}

/**
 * Sends an OTP (One-Time Password) to the specified phone number.
 * @param {string} number - The phone number to send the OTP to.
 * @param {string} otp - The OTP (One-Time Password) to be sent.
 * @returns {Promise<boolean>} - A promise that resolves to true if the OTP is successfully sent.
 * @throws {Error} - If there is an error while sending the OTP.
*/
export async function sendOtp(number, otp) {
    try {
        const message = `Your Application verification code is ${otp} IBITTS `;
        const response = await sendSms([number], message);
        return true;
    } catch (err) {
        logger.error(`sendOtp: ${err}`);
        throw err;
    }
}


/**
 * Logs in a user with the provided phone number and OTP (One-Time Password).
 * @param {string} phone - The phone number of the user.
 * @param {string} otp - The OTP (One-Time Password) entered by the user.
 * @param {string} referral_code - The referral code entered by the user.
 * @returns {Promise<Object>} - A promise that resolves to the user object upon successful login.
 * @throws {Error} - If the provided OTP or phone number is incorrect, or an error occurs during the login process.
*/
export async function loginWithOTP(phone, otp) {
    try {
        // 1. Check if otp is valid
        const activeOtp = await Otp.findOne({
            where: {
                phone,
                otp,
                sent_at: {
                    [db.Sequelize.Op.gte]: new Date(new Date() - 5 * 60 * 1000), // 5 minutes
                },
            },
        });

        if (!activeOtp) throw new Error("Incorrect Otp or Phone Number");


        // 2. Continue with the login process. If user exists, return user, else create new user
        let user = await User.findOne({
            where: { phone },
        });
        if (!user) {
            const username = await uniqueUsernameGenerator();
            user = await User.create({ phone, username, verified_phone: true, coordinates: { type: 'Point', coordinates: [26.922164830231715, 75.77523502167494] } }); // create new user

            user.country = "India"
            user.state = "Rajasthan"
            user.city = "Jaipur"
            await user.save()
        }
        // 3. destroy all otps for this phone number
        await Otp.destroy({
            where: { phone },
        });
        // 5. getting geoip and storing user's geo location in user model
        // const result = await getGeoIpLocation(ip)
        // if (result) {
        //     user.ip_state_code = result?.region_iso_code
        //     user.ip_country_code = result?.country_code
        //     user.ip_city = result?.city
        //     user.ip_state = result?.region
        //     user.ip_country = result?.country
        // }
        return user;
    } catch (err) {
        logger.error(`loginWithOTP: ${err}`);
        throw err;
    }
}



