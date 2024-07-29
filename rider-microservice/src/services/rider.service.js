/**
 * Service for handling rider-related operations.
 * @file rider Service
 * @module rider Service
 * @category services
 * @subcategory rider
 */
import { sendSms } from "../utils/sms.util.js"
import logger from "../utils/logger.util.js"
import db from "../models/index.js"
import { uniqueUsernameGenerator } from "../utils/username.util.js"
import { Op } from "sequelize"
const { Otp, Rider } = db;

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
 * @returns {Promise<Object>} - A promise that resolves to the user object upon successful login.
 * @throws {Error} - If the provided OTP or phone number is incorrect, or an error occurs during the login process.
*/
export async function loginWithOTP(phone, otp, first_name, last_name, state, country, city, location, vehicle_no, longitude, latitude) {
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


        // 3. Continue with the login process. If rider exists, return rider, else create new rider
        let user = await Rider.findOne({
            where: { phone },
        });
        if (!user) {
            const username = await uniqueUsernameGenerator();

            //4.  Applying validation on some user input
            if (!first_name) throw new Error('First name is required');
            if (first_name.length < 2 || first_name.length > 50) throw new Error('First name must be between 2 and 50 characters');
            if (!last_name) throw new Error('Last name is required');
            if (last_name.length < 2 || last_name.length > 50) throw new Error('Last name must be between 2 and 50 characters');
            if (!state) throw new Error('State is required');
            // if (!state.length < 2 || !state.length > 50) throw new Error('State must be between 2 and 50 characters');
            if (!country) throw new Error('Country is required');
            //  if (!country.length < 2 || !country.length > 50) throw new Error('Country must be between 2 and 50 characters');
            if (!city) throw new Error('City is required');
            // if (!city.length < 2 || !city.length > 50) throw new Error('City must be between 2 and 50 characters');
            if (!vehicle_no) throw new Error('Vehicle number is required');
            // if (vehicle_no.length < 5 || vehicle_no.length > 20) throw new Error('Vehicle number must be between 5 and 20 characters');
            if (typeof latitude !== 'number') throw new Error('Valid latitude is required');
            if (typeof longitude !== 'number') throw new Error('Valid longitude is required');
            user = await Rider.create({ phone, username, first_name, last_name, state, country, city, location, vehicle_no, longitude, latitude, coordinates: { type: 'Point', coordinates: [longitude, latitude] }, }); // create new user
        }
        // 4. destroy all otps for this phone number
        await Otp.destroy({
            where: { phone },
        });

        return user;
    } catch (err) {
        logger.error(`loginWithOTP: ${err}`);
        throw err;
    }
}



