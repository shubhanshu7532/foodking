import { authFetch } from "../ApiCalls/authFetch";
import logger from "../utils/logger.util.js";


/**
 * Functions to authenticate user,restaurant,rider
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


export async function riderAuthenticate(request, reply) {
    try {
        // Step 1: Verify JWT
        const decoded = await request.jwtVerify();
        const userId = decoded?.id || null;
        if (!userId) {
            return reply.status(401).send({ error: "Unauthorized " });
        }

        // Step 2: Find User
        const user = await authFetch.get(`${process.env.RIDER_MS_BASE_URL}/rider/microservice/rider/rider-info/${userId}`)
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


export async function restaurantAuthenticate(request, reply) {
    try {
        // Step 1: Verify JWT
        const decoded = await request.jwtVerify();
        const userId = decoded?.id || null;
        if (!userId) {
            return reply.status(401).send({ error: "Unauthorized " });
        }

        // Step 2: Find User
        const user = await authFetch.get(`${process.env.RESTAURANT_MS_BASE_URL}/restaurant/microservice/restaurant/restaurant-info/${userId}`)
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