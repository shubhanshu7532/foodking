/**
 * Middleware for JWT authentication.
 * Provides JWT authentication middleware for Fastify.
 * @file JWT Authentication Plugin
 * @module JWT Authentication Plugin
 * @category plugins
 * @subcategory authentication
 */

import fastifyPlugin from "fastify-plugin";
import fastifyJWT from "@fastify/jwt";
import db from "../models";
// import { logger } from "../app.js";
import logger from "../utils/logger.util.js";

const { Restaurant } = db;

export default fastifyPlugin(async function (fastify, opts) {
    fastify.register(fastifyJWT, {
        secret: process.env.JWT_SECRET,
        sign: {
            expiresIn: "30d",
        },
        verify: {
            maxAge: "30d",
            extractToken: function (request, reply) {
                let token = null;
                if (request?.cookies?.token) {
                    token = request.cookies.token;
                }
                if (request?.headers?.authorization) {
                    token = request.headers.authorization;
                }
                return token;
            },
        },
    });

    fastify.decorate("authenticate", async function (request, reply) {
        try {
            // Step 1: Verify JWT
            const decoded = await request.jwtVerify();
            const restaurantId = decoded?.id || null;
            if (!restaurantId) {
                return reply.status(401).send({ error: "Unauthorized " });
            }

            // Step 2: Find User
            const restaurant = await Restaurant.findByPk(restaurantId);
            if (!restaurant) {
                return reply.status(401).send({ error: "Unauthorized" });
            }

            // Step 3: Check if restaurant is banned
            if (restaurant.is_banned) {
                reply.clearCookie("token");
                return reply.status(403).send({ error: "Your account has been banned. If you believe this is a mistake, please contact us." });
            }

            const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip

            await restaurant.update({
                user_agent: request.headers["user-agent"],
            });

            // 6. Add the user to the request object
            request.user = restaurant;
        } catch (err) {
            // reply.send(err);
            console.log(err);
            logger.error(`JWT Error authenticating user: ${err.message}`);
            return reply.status(401).send(new Error("Unauthorized"));
        }
    });
});


