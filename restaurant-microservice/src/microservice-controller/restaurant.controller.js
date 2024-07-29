/**
 * Controller for handling restaurant operations.
 * @file restaurant Controller
 * @module restaurant Controller
 * @category controllers
 * @subcategory restaurant
 */

import { authFetch } from "../ApiCalls/authFetch.js";
import db from "../models/index.js"
import logger from "../utils/logger.util.js";

const { Restaurant, Menu } = db;

/**
 * get restaurant info.
 * @controller restaurant microservice
 * @auth true
 * @purpose microservice-communication
 * @route POST  
 * @param {Object} request - The request object.
 * @param {Object} reply - The reply object.
 * @throws {Error} If an error occurs while getting restaurant.
 */

export async function getRestaurantInfo(request, reply) {
    try {
        //1. Finding restaurant by id
        const restaurant = await Restaurant.findOne({ where: { id: request.params.id } })
        if (!restaurant) {
            return reply.status(404).send({ error: "User not found" })
        }
        return reply.status(200).send(restaurant)
    } catch (error) {
        logger.error(`restaurant.microservice.controller.getRestaurantInfo ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}
/**
 * get restaurant and restaurant food by restaurant_id and food_id
 * @returns restaurant and food object
 */

export async function getRestaurantAndFood(request, reply) {
    try {
        const { restaurant_id, food_id } = request.query
        //1. finding restaurant restaurant by restaurant id
        const restaurant = await Restaurant.findOne({
            where: {
                id: parseInt(restaurant_id)
            }
        })
        if (!restaurant) {
            return reply.status(403).send({ error: "Restaurant not found" })
        }

        //2. finding food by food id
        const food = await Menu.findOne({ where: { id: parseInt(food_id) } })
        if (!food) {
            return reply.status(403).send({ error: "Food not found" })
        }

        //3. if food doesn't belong to restaurant then send error in response
        if (restaurant.id !== food.restaurant_id) {
            return reply.status(403).send({ error: "Restaurant not found" })
        }
        return reply.status(200).send({ restaurant, food })
    } catch (error) {
        logger.error(`restaurant.microservice.controller.getRestaurantAndFood ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}

/**
 * Update success delivery time ,calculating avg time and incresing successDelivery count of restaurant
 * @returns success response in object
 */

export async function successDeliveryTime(request, reply) {
    try {
        const { restaurant_id, delivery_time } = request.body
        //1. Finding restaurant by restaurant id
        const restaurant = await Restaurant.findOne({ where: { id: parseInt(restaurant_id) } })
        if (!restaurant) {
            return reply.status(404).send({ error: "restaurant not found" })
        }

        //2.Increasing success delivery count
        if (restaurant.successDeliveryCount === null) {
            restaurant.successDeliveryCount = 1
        } else {
            restaurant.successDeliveryCount += 1
        }

        //3.Increasing success delivery totaltime
        if (restaurant.totalTime === null) {
            restaurant.totalTime = parseInt(delivery_time)
        } else {
            restaurant.totalTime += parseInt(delivery_time)
        }

        //4.calulating average time
        restaurant.avgTime = parseInt(parseInt(restaurant.totalTime) / parseInt(restaurant.successDeliveryCount))

        //5. updating all these changes
        await restaurant.save()
        return reply.status(200).send({ message: "success" })
    } catch (error) {
        logger.error(`restaurant.microservice.controller.getUserInfo ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}

/**
 * Update restaurant rating and calculating average rating of restaurant
 * @returns success response in object
 */
export async function updateRating(request, reply) {
    try {
        const { restaurant_rating } = request.body
        const { restaurant_id } = request.query

        //1. Finding restaurant by id
        const restaurant = await Restaurant.findOne({ id: parseInt(restaurant_id) })
        if (!restaurant) {
            return reply.status(404).send({ error: "Restaurant not found" })
        }

        //2. Increasing total rating
        if (restaurant.totalRating === null) {
            restaurant.totalRating = parseInt(restaurant_rating)
        } else {
            restaurant.totalRating += parseInt(restaurant_rating)
        }

        //3. Calculating average rating
        restaurant.avgRating = parseInt(parseInt(restaurant.totalRating) / parseInt(restaurant.successDeliveryCount))

        //4. Updating restaurant 
        await restaurant.save()
        return reply.status(200).send({ message: "success" })
    } catch (error) {
        logger.error(`user.microservice.controller.updateUserIpAndLastActive ${error.message}`)
        return reply.status(500).send({ error: "Internal server error" })
    }
}

