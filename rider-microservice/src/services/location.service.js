import logger from "../utils/logger.util.js";
import { server } from "../app.js";
import db from "../models/index.js"
import { Op } from "sequelize";
import cache from "../utils/cache.util.js";
const { Rider } = db;

// broadcast to all connected clients the online when new user joins the list
cache.on("set", (key, value, duration) => {
    if (key === "online_users") {
        broadcastUserStatus()
    }
})

cache.on("del", (key) => {
    if (key === "online_users") {
        broadcastUserStatus()
    }
})

const broadcastUserStatus = () => {
    try {
        const online_users = cache.get("online_users") || []
        broadcast({
            type: "user_status",
            data: online_users,
            sender: "",
            status: 200,
        });
    } catch (error) {

    }
}

/**
 * Add user to online users list
 */
export const addToOnlineUsers = async (id) => {
    try {
        const online_users = await cache.get("online_users") || []
        if (!online_users.includes(id)) {
            online_users.push(id)
            await cache.set("online_users", online_users, 5) // set cache for 5 seconds
        }
    } catch (error) {

    }
}

/**
 * Remove user from online users list
 */
export const removeFromOnlineUsers = async (id) => {
    try {
        const online_users = await cache.get("online_users") || []
        if (online_users.includes(id)) {
            const index = online_users.indexOf(id)
            online_users.splice(index, 1)
            await cache.set("online_users", online_users, 5) // set cache for 5 seconds
        }
    } catch (error) {

    }
}

/**
 * Get rider location by rider id
 * @param {string} id
 * @param {object} location
 * @returns rider location
 */


export const updateRiderLocation = async (riderId, location) => {
    try {
        const { latitude, longitude } = location

        if (typeof latitude !== 'number' || typeof longitude !== 'number') {
            throw new Error('Latitude and longitude must be numbers');
        }

        // Update the coordinates field
        await Rider.update(
            {
                latitude: latitude,
                longitude: longitude,
                coordinates: {
                    type: 'Point',
                    coordinates: [longitude, latitude], // Longitude first, then latitude
                }
            },
            {
                where: { id: riderId }
            }
        );

        return { riderId, longitude, latitude }


    } catch (error) {
        logger.error(`location.service.updateRiderLocation: ${error}`);
        throw error;
    }
}

/**
 * provide rider details
 * @param {integer} riderId 
 * @returns rider details
 */

export const getRiderDetailsByRiderId = async (riderId) => {
    try {
        const rider = await Rider.findOne({ where: { id: parseInt(riderId) } })
        if (!rider) throw new Error("Rider not found")

        return rider


    } catch (error) {
        logger.error(`chat.service.getRiderDetailsByRiderId: ${error}`)
        throw error
    }
}



/**
 * Publish new msg to "channel: message"
 * @param {object} data
 * @param {integer} riderId
 */
export const publishMsg = (data, chatId) => {
    try {
        const redis = server.redis;
        const publishData = JSON.stringify({ data, chatId })
        redis.publish("channel: message", publishData)
    } catch (error) {
        logger.error(`chat.service.publishMsg: ${error.message}`)
        console.error(error);
    }

}

/**
 * Broadcast a message to all connected clients
 * @param {any} data
 * @param {integer} riderId
 * @returns void
 */
export const broadcast = (data, riderId = "") => {
    const wsServer = server.websocketServer; // server = fastify instance

    for (const client of wsServer.clients) {
        // if chat id exists, broadcast to all clients connected to that chat
        if (riderId) {
            if (client.riderId === riderId) {
                client.send(JSON.stringify(data));
            }
            continue;
        }
        client.send(JSON.stringify(data));
    }
}

