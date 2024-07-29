/**
 * Router for user-related endpoints.
 * Handles user authentication, registration, and profile operations.
 * @file User Routes
 * @module User Routes
 * @category routes
 * @subcategory user
 */

import Controller from "../microservice-controller"
import Validator from "../microservice-validators";

const { User: validator } = Validator;

const { User: user } = Controller;

const routes = async (route, options) => { // route = fastify instance
    /**
     * Route for generating OTP.
     * Generates and sends an OTP to the provided phone number.
     */
    route.get('/user-info/:id', {
        schema: validator.userInfo,
        handler: user.getUserInfo,
    });

};

export default routes;
