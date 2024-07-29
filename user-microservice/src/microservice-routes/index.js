/**
 * Main entry point for the /api/v1 routes.
 * @file Index Routes
 * @module Index Routes
 * @category routes
 */
import userRoute from "./user.route.js"


//All these routes are microservice routes for internal communication

const routes = async (route, options) => { // route = fastify instance
    route.register(userRoute, { prefix: "/user" })
};

export default routes;

