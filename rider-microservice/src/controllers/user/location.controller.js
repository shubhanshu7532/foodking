/**
 * Controller for handling location-related operations.
 * @file location Controller
 * @module location Controller
 * @category controllers
 * @subcategory location
 */

import db from "../../models/index.js"
import logger from "../../utils/logger.util.js";
import { publishMsg, updateRiderLocation, getRiderDetailsByRiderId, } from "../../services/location.service.js";

const { } = db
/**
 * location connect using socket
 */
export const connect = async (connection /* SocketStream */, req /* FastifyRequest */) => {
    connection.setEncoding('utf8') // set encoding
    let riderId
    if (req.query.role === "rider") {
        riderId = req?.user?.id
    } else {
        riderId = req?.order?.rider_id
    }

    const { socket } = connection;
    if (!riderId) throw new Error("")

    const initialRider = await getRiderDetailsByRiderId(riderId)
    socket.riderId = riderId
    sendMessage(socket, {
        type: "new_connection",
        data: "connected successfully",
        sender: req.user.id,
        status: 200,
        initialRider
    })

    // Handle incoming messages
    socket.on('message', async (message) => {
        const msg = JSON.parse(message.toString());
        let response;
        switch (msg.type) {
            case 'ping':
                sendMessage(socket, { type: 'pong' }); // Respond to the ping with a pong. This is used to check if the connection is still alive.
                return;
            case 'update-location':
                const rider = await updateRiderLocation(msg.riderId, msg.location)
                response = {
                    data: rider
                }
                sendMessage(socket, response);
                break
            default:
                response = {
                    type: "unknown",
                    data: "method not found",
                    sender: riderId,
                    status: 400,
                };
                sendMessage(socket, response);
                return;
        }
        publishMsg(response, riderId) // publishing rider location to every person
    });

    // Handle disconnection
    socket.on('close', async () => {
        console.log(`User ${userId} disconnected`);
    });

    function sendMessage(target, data) {
        target.send(JSON.stringify(data));
    }
};























