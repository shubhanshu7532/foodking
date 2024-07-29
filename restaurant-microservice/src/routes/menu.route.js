/**
 * Router for menu-related endpoints.
 * @file menu Routes
 * @module menu Routes
 * @category routes
 * @subcategory menu
 */

import Controller from "../controllers"
import { userAuthenticate } from "../plugins/authenticate";
import Validator from "../validators";

const { Menu: validator } = Validator;

const { Menu: menu } = Controller;

const routes = async (route, options) => { // route = fastify instance
    /**
     * Route creating restaurant menu.
     * requires restaurant authentication
     */
    route.post('/create', {
        onRequest: [
            route.authenticate, // authentication middlewares
        ],
        schema: validator.createMenu,
        handler: menu.createMenu,
    });

    /**
    * Route for getting all menu on restaurant side.
    * Authenticates the restuarant using the token.
    */
    route.get('/:restaurant_id', {
        onRequest: [
            route.authenticate,
            route.redisMiddleware  // redis caching
        ],
        handler: menu.getallMenu,
    });

    /**
    * Route for getting all menu on user side.
    * Authenticates the user using the token.
    */
    route.get('/user/:restaurant_id', {
        onRequest: [
            userAuthenticate,
            route.redisMiddleware //redis caching
        ],
        handler: menu.getMenuForuser,
    });
};

export default routes;
