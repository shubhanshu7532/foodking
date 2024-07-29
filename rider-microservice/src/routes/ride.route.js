/**
 * Router for rider-related endpoints.
 * @file Rider Routes
 * @module Rider Routes
 * @category routes
 * @subcategory Rider
 */

import Controller from "../controllers"
import { restaurantAuthenticate, userAuthenticate } from "../plugins/authenticate.js";
import Validator from "../validators";

const { Rider: validator } = Validator;

const { Rider: rider } = Controller;

const routes = async (route, options) => { // route = fastify instance
  /**
   * Route for generating OTP.
   * Generates and sends an OTP to the provided phone number.
   */
  route.post('/otp', {
    schema: validator.otp,
    handler: rider.otp,
  });

  /**
  * Route for user login.
  * Authenticates the user using the provided phone number and OTP.
  */
  route.post('/login', {
    schema: validator.login,
    handler: rider.login,
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
    handler: rider.logout,
  });


  /**
  * Route for getting rider profile.
  * Retrieves the profile information of the authenticated user.
  * Requires authentication.
  */
  route.get("/profile", {
    onRequest: [
      route.authenticate, // authentication middleware
    ],
    handler: rider.getProfile,
  });

  /**
   * Route for updating rider profile.
   * Updates the profile information of the authenticated user.
   * Requires authentication.
   */
  route.put("/profile", {
    onRequest: [
      route.authenticate, // authentication middleware
    ],
    handler: rider.updateProfile,
  });



  /**
   * Route for updating rider profile.
   * Updates the profile information of the authenticated user.
   * Requires authentication.
   */
  route.get("/restaurant", {
    onRequest: [
      restaurantAuthenticate
    ],
    handler: rider.gerRiders,
  });




};

export default routes;
