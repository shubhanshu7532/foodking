/**
 * Main entry point for the /api/v1 routes.
 * @file Index Routes
 * @module Index Routes
 * @category routes
 */

import orderRoute from "./order.route.js"
import couponRoute from "./coupon.route.js"





const routes = async (route, options) => { // route = fastify instance
    route.register(orderRoute, { prefix: "/order" })
    route.register(couponRoute, { prefix: "/coupon" })
};

export default routes;

