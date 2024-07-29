/**
 * Validators for Order  routes
 * @file Order Validator
 * @module Order Validator
 * @category validators
 * @subcategory Order
 */
import commonSchemas from '../common.validator.js';

export const createOrder = {
    body: {
        type: 'object',
        properties: {
            delivery_address: { type: 'string', minLength: 10, maxLength: 100 },
            restaurant_id: { type: 'integer' },
            food_id: { type: 'integer' },
            coupon_id: { type: 'integer' }
        },
    },
}


export const acceptOrder = {
    params: {
        type: 'object',
        properties: {
            order_id: { type: 'integer' }
        },
        required: ["order_id"]
    },
    body: {
        type: 'object',
        properties: {
            status: { type: 'string', enum: ["accepted"] },
            estimatedDeliveryTime: { type: 'integer' },
            remark: { type: 'string', minLength: 6, maxLength: 80 },
        },
    },

}


export const changeStatusOfOrder = {
    params: {
        type: 'object',
        properties: {
            order_id: { type: 'integer' }
        },
        required: ["order_id"]
    },
    body: {
        type: 'object',
        properties: {
            status: { type: 'string', enum: ["preparing", "prepared"] },
            remark: { type: 'string', minLength: 6, maxLength: 80 },
        },
    },

}
