/**
 * Router for restaruant internal communication related endpoints.
 * @file restaurant Routes
 * @module restaurant Routes
 * @category routes
 * @subcategory restaurant
 */

import Controller from "../microservice-controller"


const { Restaurant: restaurant } = Controller;

const routes = async (route, options) => { // route = fastify instance
    /**
     * Route for getting restaurant-info.
     */
    route.get('/restaurant-info/:id', {
        handler: restaurant.getRestaurantInfo,
    });

    /**
         * Route for getting restaurant and food data.
         */
    route.get('/restaurant-and-food', {
        handler: restaurant.getRestaurantAndFood

    })

    /**
     * route for setting success delivery Time
     */
    route.post('/delivery-time', {
        handler: restaurant.successDeliveryTime
    })

    /**
    * route for update rating of restaurant
    */
    route.post('/update-rating', {
        handler: restaurant.updateRating
    })


};

export default routes;
