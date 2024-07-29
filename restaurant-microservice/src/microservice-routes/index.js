/**
 * Main entry point for the /api/v1 routes.
 * @file Index Routes
 * @module Index Routes
 * @category routes
 */
import restaurantRoute from "./restaurant.route.js"


const routes = async (route, options) => { // route = fastify instance
    route.register(restaurantRoute, { prefix: "/restaurant" }) //Media for users
};

export default routes;

