import { authFetch } from "../ApiCalls/authFetch";
import logger from "../utils/logger.util.js";
import db from "../models/index.js"
const { Rider } = db

/**
 * Authenticator functions to authenticate user ,restaurant,rider
 */
export async function userAuthenticate(request, reply) {
    try {
        // Step 1: Verify JWT
        const decoded = await request.jwtVerify();
        const userId = decoded?.id || null;
        if (!userId) {
            return reply.status(401).send({ error: "Unauthorized " });
        }

        // Step 2: Find User
        const user = await authFetch.get(`${process.env.USER_MS_BASE_URL}/user/microservice/user/user-info/${userId}`)
        if (!user) {
            return reply.status(401).send({ error: "Unauthorized" });
        }

        console.log("user", user)
        // Step 3: Check if user is banned
        if (user.is_banned) {
            reply.clearCookie("token");
            return reply.status(403).send({ error: "Your account has been banned. If you believe this is a mistake, please contact us." });
        }

        const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip

        // await user.update({
        //     user_agent: request.headers["user-agent"],
        // });

        // 6. Add the user to the request object
        request.user = user;
    } catch (err) {
        // reply.send(err);
        console.log(err);
        logger.error(`JWT Error authenticating user: ${err.message}`);
        return reply.status(401).send(new Error("Unauthorized"));
    }
}


export async function restaurantAuthenticate(request, reply) {
    try {
        // Step 1: Verify JWT
        const decoded = await request.jwtVerify();
        const userId = decoded?.id || null;
        console.log("coming inside this")
        if (!userId) {
            return reply.status(401).send({ error: "Unauthorized " });
        }

        // Step 2: Find User
        const user = await authFetch.get(`${process.env.RESTAURANT_MS_BASE_URL}/restaurant/microservice/restaurant/restaurant-info/${userId}`)
        // console.log("this is user", user)
        if (!user) {
            return reply.status(401).send({ error: "Unauthorized" });
        }

        // Step 3: Check if user is banned
        if (user.is_banned) {
            reply.clearCookie("token");
            return reply.status(403).send({ error: "Your account has been banned. If you believe this is a mistake, please contact us." });
        }

        const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip

        // await user.update({
        //     user_agent: request.headers["user-agent"],
        // });

        // 6. Add the user to the request object
        request.user = user;
    } catch (err) {
        // reply.send(err);
        console.log(err);
        logger.error(`JWT Error authenticating user: ${err.message}`);
        return reply.status(401).send(new Error("Unauthorized"));
    }
}


export async function locationAuthenticate(request, reply) {
    try {
        // Step 1: Verify JWT
        const decoded = await request.jwtVerify();
        const role = request.query.role
        if (role === 'rider') {
            // Step 1: Verify JWT
            const decoded = await request.jwtVerify();
            const userId = decoded?.id || null;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized " });
            }

            // Step 2: Find User
            const user = await Rider.findByPk(userId);
            if (!user) {
                return reply.status(401).send({ error: "Unauthorized" });
            }

            // Step 3: Check if user is banned
            if (user.is_banned) {
                reply.clearCookie("token");
                return reply.status(403).send({ error: "Your account has been banned. If you believe this is a mistake, please contact us." });
            }

            const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip

            // await user.update({
            //     user_agent: request.headers["user-agent"],
            // });
            // 6. Add the user to the request object
            request.user = user;
            console.log("coming to this point", user)
        } else if (role === 'restaurant') {
            const order_id = request.query.order_id
            if (!order_id) return reply.status(401).send({ error: "Unauthorized " });

            const decoded = await request.jwtVerify();
            const userId = decoded?.id || null;
            console.log("coming inside this")
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized " });
            }

            // Step 2: Find User
            const user = await authFetch.get(`${process.env.RESTAURANT_MS_BASE_URL}/restaurant/microservice/restaurant/restaurant-info/${userId}`)
            // console.log("this is user", user)
            if (!user) {
                return reply.status(401).send({ error: "Unauthorized" });
            }

            // Step 3: Check if user is banned
            if (user.is_banned) {
                reply.clearCookie("token");
                return reply.status(403).send({ error: "Your account has been banned. If you believe this is a mistake, please contact us." });
            }

            const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip

            // await user.update({
            //     user_agent: request.headers["user-agent"],
            // });

            // 6. Add the user to the request object
            request.user = user;

            const order = await authFetch.get(`${process.env.ORDER_MS_BASE_URL}/order/microservice/order/order-info/${order_id}`)
            if (!order) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            request.order = order
        } else if (role === 'user') {
            const order_id = request.query.order_id

            if (!order_id) {
                return reply.status(401).send({ error: "Unauthorized " });
            }
            const decoded = await request.jwtVerify();
            const userId = decoded?.id || null;
            if (!userId) {
                return reply.status(401).send({ error: "Unauthorized " });
            }

            // Step 2: Find User
            const user = await authFetch.get(`${process.env.USER_MS_BASE_URL}/user/microservice/user/user-info/${userId}`)
            if (!user) {
                return reply.status(401).send({ error: "Unauthorized" });
            }

            console.log("user", user)
            // Step 3: Check if user is banned
            if (user.is_banned) {
                console.log("comign to this point 1")
                reply.clearCookie("token");
                return reply.status(403).send({ error: "Your account has been banned. If you believe this is a mistake, please contact us." });
            }
            console.log("comign to this point 2")

            const ip = request.headers["x-forwarded-for"]?.split(",")[0] || request.headers["x-forwarded-for"] || request.ip

            // await user.update({
            //     user_agent: request.headers["user-agent"],
            // });

            // 6. Add the user to the request object
            console.log("comign to this point 3")
            request.user = user;

            console.log("comign to this point 4")
            const order = await authFetch.get(`${process.env.ORDER_MS_BASE_URL}/order/microservice/order/order-info/${order_id}`)
            console.log("this is order", order)
            if (!order) {
                return reply.status(401).send({ error: "Unauthorized" });
            }
            request.order = order
        } else {
            return reply.status(401).send({ error: "Unauthorized" });
        }
    } catch (err) {
        // reply.send(err);
        console.log(err);
        logger.error(`JWT Error authenticating user: ${err.message}`);
        return reply.status(401).send(new Error("Unauthorized"));
    }
}