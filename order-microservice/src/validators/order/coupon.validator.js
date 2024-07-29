/**
 * Validators for Coupon  routes
 * @file Coupon Validator
 * @module Coupon Validator
 * @category validators
 * @subcategory Coupon
 */
import commonSchemas from '../common.validator.js';

export const createCoupon = {
    body: {
        type: 'object',
        properties: {
            coupon_code: { type: 'string', minLength: 10, maxLength: 10 },
            percentage: { type: 'integer' },
            max_credit: { type: 'integer' },
            valid_till: { type: 'string' }
        },
    },
}


export const couponValid = {
    params: {
        type: 'object',
        properties: {
            coupon_code: { type: 'string', minLength: 10, maxLength: 10 }
        },
        required: ["coupon_code"]
    },
}
