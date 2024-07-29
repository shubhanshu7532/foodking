/**
 * Router for order internal communication related endpoints.
 * @file order Routes
 * @module order Routes
 * @category routes
 * @subcategory order
 */

import Controller from "../microservice-controller"


const { Order: order } = Controller;

const routes = async (route, options) => { // route = fastify instance
    /**
     * Route to get order info.
     * Generates and sends an OTP to the provided phone number.
     */
    route.get('/order-info/:id', {
        handler: order.getOrderInfo,
    });

};

export default routes;
