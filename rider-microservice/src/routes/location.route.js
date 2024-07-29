/**
 * Router for chat-related endpoints.
 * @file Chat Routes
 * @module Chat Routes
 * @category routes
 * @subcategory chat
 */

import Controller from "../controllers"
import { locationAuthenticate } from "../plugins/authenticate.js";

const { Location: location } = Controller;

const routes = async (route, options) => {

    /**
     * Route for connecting to the socket to get rider location and to update rider location
     */
    route.get('/connect', {
        websocket: true,
        onRequest: [
            locationAuthenticate // authentication middleware
        ],
        handler: location.connect,

    })
}

export default routes;
