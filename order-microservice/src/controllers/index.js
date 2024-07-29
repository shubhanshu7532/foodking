/** Entrypoint for controllers that registers all controllers in the folder and exports Controller object. 
 * @module Controller
 * @category controllers
 * @subcategory controller
 */
import * as Order from "./order.controller.js"
import * as Coupon from "./coupon.controller.js"
const Controller = {
    Order,
    Coupon
}

export default Controller