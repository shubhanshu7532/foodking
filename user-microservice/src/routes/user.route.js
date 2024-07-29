/**
 * Router for user-related endpoints.
 * Handles user authentication, registration, and profile operations.
 * @file User Routes
 * @module User Routes
 * @category routes
 * @subcategory user
 */

import Controller from "../controllers"
import Validator from "../validators";

const { User: validator } = Validator;

const { User: user } = Controller;

const routes = async (route, options) => { // route = fastify instance
  /**
   * Route for generating OTP.
   * Generates and sends an OTP to the provided phone number.
   */
  route.post('/otp', {
    schema: validator.otp,
    handler: user.otp,
  });

  /**
  * Route for user login.
  * Authenticates the user using the provided phone number and OTP.
  */
  route.post('/login', {
    schema: validator.login,
    handler: user.login,
  });
  /**
  * Route for user logout.
  * Handles the user logout functionality.
  * Requires authentication.
  */
  route.get("/logout", {
    onRequest: [
      route.authenticate, // authentication middleware
      // async function (request, reply) {
      //   request.accessRoles = ["user"]; // allowed role for this route
      // },
      // route.rbam // RBAM middleware
    ],
    schema: validator.logout,
    handler: user.logout,
  });


  /**
  * Route for getting user profile.
  * Retrieves the profile information of the authenticated user.
  * Requires authentication.
  */
  route.get("/profile", {
    onRequest: [
      route.authenticate, // authentication middleware
      // async function (request, reply) {
      //   request.accessRoles = ["user"]; // allowed role for this route
      // },
      // route.rbam // RBAM middleware
    ],
    // schema: validator.getProfile,
    handler: user.getProfile,
  });

  /**
   * Route for updating user profile.
   * Updates the profile information of the authenticated user.
   * Requires authentication.
   */
  route.put("/profile", {
    onRequest: [
      route.authenticate, // authentication middleware
      // async function (request, reply) {
      //   request.accessRoles = ["user", "admin"]; // allowed role for this route
      //   request.accessFields = ["user"];// allowed access fields for this route
      // },
      // route.rbam // RBAM middleware
    ],
    // schema: validator.updateProfile,
    handler: user.updateProfile,
  });




};

export default routes;
