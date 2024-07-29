/** Entrypoint for validators that registers all validators in the folder and exports Validator object. 
 * @module Validator
 * @category validators
 * @subcategory validator
 */

import * as Order from "./order/order.validator.js"
import * as Coupon from "./order/coupon.validator.js"
const Validator = {
    Order,
    Coupon
};

export default Validator;