/**
 * Router for restaurant-related endpoints.
 * @file restaurant Routes
 * @module restaurant Routes
 * @category routes
 * @subcategory restaurant
 */

import Controller from "../controllers"
import { userAuthenticate } from "../plugins/authenticate";
import Validator from "../validators";

const { Restaurant: validator } = Validator;

const { Restaurant: restaruant } = Controller;

const routes = async (route, options) => { // route = fastify instance
  /**
   * Route for generating OTP.
   * Generates and sends an OTP to the provided phone number.
   */
  route.post('/otp', {
    schema: validator.otp,
    handler: restaruant.otp,
  });

  /**
  * Route for restauarant login.
  * Authenticates the restaurant using the provided phone number and OTP.
  */
  route.post('/login', {
    schema: validator.login,
    handler: restaruant.login,
  });
  /**
  * Route for user logout.
  * Handles the user logout functionality.
  * Requires authentication.
  */
  route.get("/logout", {
    onRequest: [
      route.authenticate, // authentication middleware
    ],
    schema: validator.logout,
    handler: restaruant.logout,
  });



  /**
 * Route for user side to get all restaurants.
 * Updates the profile information of the authenticated user.
 * Requires authentication.
 */
  route.get("/getAllForUser", {
    onRequest: [
      userAuthenticate // authentication middleware
    ],
    handler: restaruant.getAllRestaurantsToUser,
  });

  // /**
  // * Route for getting restaurant profile.
  // * Retrieves the profile information of the authenticated user.
  // * Requires authentication.
  // */
  // route.get("/profile", {
  //   onRequest: [
  //     route.authenticate, // authentication middleware
  //   ],
  //   // schema: validator.getProfile,
  //   handler: user.getProfile,
  // });

  // /**
  //  * Route for updating restaurant profile.
  //  * Updates the profile information of the authenticated user.
  //  * Requires authentication.
  //  */
  // route.put("/profile", {
  //   onRequest: [
  //     route.authenticate, // authentication middleware
  //     // async function (request, reply) {
  //     //   request.accessRoles = ["user", "admin"]; // allowed role for this route
  //     //   request.accessFields = ["user"];// allowed access fields for this route
  //     // },
  //     // route.rbam // RBAM middleware
  //   ],
  //   // schema: validator.updateProfile,
  //   handler: user.updateProfile,
  // });





};

export default routes;
