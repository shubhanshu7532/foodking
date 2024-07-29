/**
 * Router for user-related endpoints.
 * Handles user authentication, registration, and profile operations.
 * @file User Routes
 * @module User Routes
 * @category routes
 * @subcategory user
 */

import Controller from "../controllers/index.js"
import { restaurantAuthenticate, riderAuthenticate, userAuthenticate } from "../plugins/authenticate.js";
import Validator from "../validators/index.js";

const { Order: validator } = Validator;

const { Order: order } = Controller;

const routes = async (route, options) => { // route = fastify instance

  /**
  * Route for create order.
  * Authenticates the user.
  */
  route.post('/create', {
    onRequest: [
      userAuthenticate
    ],
    schema: validator.createOrder,
    handler: order.createOrder,
  });
  /**
  * Route for accepting order.
  * Handles the accept order functionality.
  * Requires authentication.
  */
  route.post("/accept-order/:order_id", {
    onRequest: [
      restaurantAuthenticate
    ],
    schema: validator.acceptOrder,
    handler: order.acceptOrder,
  });

  /**
 * Route for changing status of order from restaurant side.
 * Handles the change status of order functionality.
 * Requires authentication.
 */
  route.post("/change-status/:order_id", {
    onRequest: [
      restaurantAuthenticate,
    ],
    schema: validator.changeStatusOfOrder,
    handler: order.changeStatusOfOrder,
  });


  /**
* Route to get all order of a user.
* Requires authentication.
*/
  route.get("/user", {
    onRequest: [
      userAuthenticate,
      route.redisMiddleware
    ],
    handler: order.getAllOrderForUser,
  });


  /**
* Route to get all order of a rider.
* Handles the change status of order functionality.
* Requires authentication.
*/
  route.get("/rider", {
    onRequest: [
      riderAuthenticate,
      route.redisMiddleware
    ],
    handler: order.getAllOrderForRider,
  });


  /**
* Route to get all order of a restaurant.
* Requires authentication.
*/
  route.get("/restaurant", {
    onRequest: [
      restaurantAuthenticate
    ],
    handler: order.getAllOrderForRestaurant,
  });


  /**
* Route for making order delivered.
* Requires authentication.
*/
  route.get("/delivered/:order_id", {
    onRequest: [
      riderAuthenticate
    ],
    handler: order.orderDelivered,
  });


  /**
* Route for cancelling the order.
* Requires authentication.
*/
  route.get("/cancel/:order_id", {
    onRequest: [
      userAuthenticate
    ],
    handler: order.orderCancel,
  });

  /**
* Route for assign order to any of delivery boy.
* Requires authentication.
*/
  route.post("/assign-order", {
    onRequest: [
      restaurantAuthenticate
    ],
    handler: order.assignOrder,
  });

  /**
* Route for creating rating on order.
* Requires authentication.
*/
  route.post("/create-rating/:order_id", {
    onRequest: [
      userAuthenticate
    ],
    handler: order.createRating,
  });



};

export default routes;
