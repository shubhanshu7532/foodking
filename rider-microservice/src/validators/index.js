/** Entrypoint for validators that registers all validators in the folder and exports Validator object. 
 * @module Validator
 * @category validators
 * @subcategory validator
 */

import * as Rider from "./rider/rider.validator.js"

const Validator = {
    Rider
};

export default Validator;