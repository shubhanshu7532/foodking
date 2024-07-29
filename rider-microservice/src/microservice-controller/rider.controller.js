/**
 * Controller for handling rider related internal communication operations.
 * @file Rider internal communication Controller
 * @module Rider internal communication Controller
 * @category controllers
 * @subcategory Rider internal communication
 */

import db from "../models/index.js"
import logger from "../utils/logger.util.js";

const { Rider } = db;

/**
 * get rider info.
 * @purpose microservice-communication
 * @route POST  
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while getting rider info microservice.
 */

export async function getRiderInfo(request, reply) {
    try {
        const user = await Rider.findOne({ where: { id: request.params.id } })
        if (!user) {
            return reply.status(404).send({ error: "User not found" })
        }
        return reply.status(200).send(user)
    } catch (error) {
        logger.error(`rider.microservice.controller.getRiderInfo ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}

/**
 * assign order.
 * @purpose microservice-communication
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while assigning order info microservice.
 */

export async function assignOrder(request, reply) {
    try {
        const { id } = request.params
        const rider = await Rider.findOne({ where: { id: parseInt(id) } })
        if (rider.is_busy) {
            return reply.status(403).send({ error: "rider is busy" })
        }
        rider.is_busy = true
        await rider.save()
        return reply.status(200).send({ error: "Success" })
    } catch (error) {
        logger.error(`rider.microservice.controller.assignOrder ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}

/**
 * order delivered.
 * @purpose microservice-communication
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while microservice.
 */
export async function orderDelivered(request, reply) {
    try {
        const { id } = request.params
        const rider = await Rider.findOne({ where: { id: parseInt(id) } })
        if (!rider.is_busy) {
            return reply.status(403).send({ error: "rider is not busy" })
        }
        //1.increasing the count of order successfully delivered
        if (rider.delivery_count === null) {
            rider.delivery_count = 1
        } else {
            rider.delivery_count += 1

        }
        //2. Now rider can take another order so i am making is_busy false
        rider.is_busy = false

        await rider.save()
        return reply.status(200).send({ error: "Success" })
    } catch (error) {
        logger.error(`rider.microservice.controller.orderDelivered ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}
/**
 * route for updating rating.
 * @purpose microservice-communication
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while assigning order info microservice.
 */

export async function updateRating(request, reply) {
    try {
        const { id } = request.params
        const { delivery_rating } = request.body
        const rider = await Rider.findOne({ where: { id: parseInt(id) } })
        if (!rider) {
            return reply.status(404).send({ error: "Rider not found" })
        }
        //1. upating the total rating because it will help us to find out the actuall average rating if the rider
        if (rider.totalRating === null) {
            rider.totalRating = delivery_rating
        } else {
            rider.totalRating += delivery_rating
        }
        //2. finding average rating of the rider
        rider.avgRating = parseInt(rider.totalRating) / rider.delivery_count
        await rider.save()
        return reply.status(200).send({ error: "Success" })
    } catch (error) {
        logger.error(`rider.microservice.controller.updateRating ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}