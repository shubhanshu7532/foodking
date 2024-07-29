/** Entrypoint for controllers that registers all controllers in the folder and exports Controller object. 
 * @module Controller
 * @category controllers
 * @subcategory controller
 */
import * as Restaurant from "./restaurant/restaurant.controller.js"
import * as Menu from "./restaurant/menu.controller.js"
const Controller = {
    Restaurant,
    Menu
}

export default Controller