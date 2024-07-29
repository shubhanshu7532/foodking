/**
 * Controller for handling user internal communication operations.
 * @file user internal communication Controller
 * @module user internal communication Controller
 * @category controllers
 * @subcategory user internal communication
 */

import { authFetch } from "../ApiCalls/authFetch.js";
import db from "../models/index.js"
import logger from "../utils/logger.util.js";

const { User } = db;

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

export async function getUserInfo(request, reply) {
    try {
        const user = await User.findOne({ where: { id: request.params.id } })
        if (!user) {
            return reply.status(404).send({ error: "User not found" })
        }
        return reply.status(200).send(user)
    } catch (error) {
        logger.error(`user.microservice.controller.getUserInfo ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}

