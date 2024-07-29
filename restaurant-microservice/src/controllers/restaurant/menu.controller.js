/**
 * Controller for handling Menu-related operations.
 * @file Menu Controller
 * @module Menu Controller
 * @category controllers
 * @subcategory Menu
 */

import db from "../../models/index.js"
import logger from "../../utils/logger.util.js"


const { Restaurant, Menu } = db

/**
 * Controller for creating menu
 * @param {object} request food_name, price, description, quantity = null
 * @param {object} reply success response
 * @returns 
 */
export async function createMenu(request, reply) {
    try {
        const { food_name, price, description, quantity = null } = request.body
        const restaurant_id = request.user.id
        await Menu.create({
            food_name, price, description, quantity, restaurant_id
        })
        return reply.status(200).send({ message: "Success" })
    } catch (error) {
        logger.error(`menu.controller.createMenu: ${error}`)
        return reply.status(500).send({ error: error.message })

    }

}

/**
 * Route to get all menu of a particular restaurant
 * @param {object} request params-restaurant_id,query-limit,skip
 * @param {*} reply 
 * @returns array of menu
 */
export async function getallMenu(request, reply) {
    try {

        const { limit = 10, skip = 0 } = request.query
        const all_menu = await Menu.findAll({
            where: {
                restaurant_id: request.user.id
            },
            include: [{ model: Restaurant, as: 'restaurant' }],
            limit: parseInt(limit),
            offset: parseInt(skip)
        })

        return reply.status(200).send(all_menu)

    } catch (error) {
        logger.error(`user.controller.login: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}


/**
 * Route to get all menu of a particular restaurant
 * @param {object} request params-restaurant_id,query-limit,skip
 * @param {*} reply 
 * @returns array of menu
 */

export async function getMenuForuser(request, reply) {
    try {
        const { restaurant_id } = request.params
        const { limit = 10, skip = 0 } = request.query
        const restaurant = await Restaurant.findOne({
            where: {
                id: restaurant_id
            }
        })
        if (!restaurant) return reply.status(200).send({ error: "Restaurant not found" })

        const all_menu = await Menu.findAll({
            where: {
                restaurant_id: restaurant_id
            },
            include: [{ model: Restaurant, as: 'restaurant' }],
            limit: parseInt(limit),
            offset: parseInt(skip)
        })

        return reply.status(200).send(all_menu)

    } catch (error) {
        logger.error(`user.controller.login: ${error}`)
        return reply.status(500).send({ error: error.message })
    }
}