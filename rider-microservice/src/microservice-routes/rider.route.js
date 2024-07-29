/**
 * Router for rider related endpoints for internal communication.
 * @file Rider internal communication Routes
 * @module Rider internal communication Routes
 * @category routes
 * @subcategory Rider internal communication
 */

import Controller from "../microservice-controller"


const { Rider: rider } = Controller;

const routes = async (route, options) => { // route = fastify instance
    /**
     * Route for getting rider info.
     */
    route.get('/rider-info/:id', {
        //  schema: validator.userInfo,
        handler: rider.getRiderInfo,
    });

    /**
     * Route for assigning order to rider
     */
    route.get('/assign-order/:id', {
        handler: rider.assignOrder
    })
    /**
     * Route for making order delivered
     */

    route.get('/order-delivered/:id', {
        handler: rider.orderDelivered
    })
    /**
     * Route for updating ratings
     */
    route.post('/update-rating/:id', {
        handler: rider.updateRating
    })


};

export default routes;
