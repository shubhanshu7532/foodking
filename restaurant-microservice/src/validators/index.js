/** Entrypoint for validators that registers all validators in the folder and exports Validator object. 
 * @module Validator
 * @category validators
 * @subcategory validator
 */

import * as Restaurant from "./restaurant/restaurant.validator.js"
import * as Menu from "./restaurant/menu.validator.js"

const Validator = {
    Restaurant,
    Menu,
};

export default Validator;