/** Entrypoint for controllers that registers all controllers in the folder and exports Controller object. 
 * @module Controller
 * @category controllers
 * @subcategory controller
 */
import * as Rider from "./user/rider.controller.js"
import * as Location from "./user/location.controller.js"
const Controller = {
    Rider,
    Location
}

export default Controller