/**
 * Main entry point for the /api/v1 routes.
 * @file Index Routes
 * @module Index Routes
 * @category routes
 */
import riderRoute from "./rider.route.js"


const routes = async (route, options) => { // route = fastify instance
    route.register(riderRoute, { prefix: "/rider" }) //Media for users
};

export default routes;

