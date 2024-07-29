/**
 * Controller for handling media operations.
 * @file media Controller
 * @module media Controller
 * @category controllers
 * @subcategory media
 */

import { authFetch } from "../ApiCalls/authFetch.js";
import db from "../models/index.js"
import logger from "../utils/logger.util.js";

const { Order } = db;

/**
 * get user info.
 * @controller media microservice
 * @auth true
 * @purpose microservice-communication
 * @route POST  
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while media microservice.
 */

export async function getOrderInfo(request, reply) {
    try {
        const order = await Order.findOne({ where: { id: request.params.id } })
        if (!order) {
            return reply.status(404).send({ error: "order not found" })
        }
        return reply.status(200).send(order)
    } catch (error) {
        logger.error(`user.microservice.controller.getUserInfo ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}

export async function getUserByReferralCode(request, reply) {
    try {
        const user = await User.findOne({ where: { referral_code: request.params.code } })
        if (!user) {
            return reply.status(404).send({ error: "User not found" })
        }
        return reply.status(200).send(user)
    } catch (error) {
        logger.error(`user.microservice.controller.getUserInfo ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}


export async function updateUserAvatar(request, reply) {
    try {
        const { media_id, media_url } = request.body
        let user = await User.findOne({ where: { id: request.params.id } })
        user.avatar = {
            id: media_id || null,
            url: media_url || "",
        }
        await user.save();
        return reply.status(200).send({ message: "Success" })
    } catch (error) {
        logger.error(`user.microservice.controller.getUserInfo ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}






