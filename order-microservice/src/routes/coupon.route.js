/**
 * Router for coupon-related endpoints.
 * @file Coupon Routes
 * @module Coupon Routes
 * @category routes
 * @subcategory Coupon
 */

import Controller from "../controllers"
import { restaurantAuthenticate, riderAuthenticate, userAuthenticate } from "../plugins/authenticate.js";
import Validator from "../validators";

const { Coupon: validator } = Validator;

const { Coupon: coupon } = Controller;

const routes = async (route, options) => { // route = fastify instance

    /**
    * Route for create coupon.
    * Authenticates restaurant.
    */
    route.post('/create', {
        onRequest: [
            restaurantAuthenticate
        ],
        schema: validator.createCoupon,
        handler: coupon.createCoupon,
    });

    /**
    * Route to check coupon valid or not.
    * Authenticates the user.
    */
    route.get('/valid/:coupon_code', {
        onRequest: [
            userAuthenticate
        ],
        schema: validator.couponValid,
        handler: coupon.couponValid,
    })

    /**
    * Route to check coupon valid or not.
    * Authenticates the user.
    */
    route.get('/:restaurant_id', {
        onRequest: [
            userAuthenticate
        ],
        // schema: validator.couponValid,
        handler: coupon.getAllCoupons,
    })

};

export default routes;
