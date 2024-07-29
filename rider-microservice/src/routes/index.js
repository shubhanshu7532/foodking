/**
 * Main entry point for the /api/v1 routes.
 * @file Index Routes
 * @module Index Routes
 * @category routes
 */

import rideRoute from "./ride.route.js"
import locationRoute from "./location.route.js"


const routes = async (route, options) => { // route = fastify instance
    route.register(rideRoute, { prefix: "/rider" })
    route.register(locationRoute, { prefix: "/location" })
};

export default routes;

