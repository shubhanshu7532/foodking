/**
 * Main entry point for the /api/v1 routes.
 * @file Index Routes
 * @module Index Routes
 * @category routes
 */
import orderRoute from "./order.route.js"


const routes = async (route, options) => { // route = fastify instance
    route.register(orderRoute, { prefix: "/order" }) //Media for users
};

export default routes;

