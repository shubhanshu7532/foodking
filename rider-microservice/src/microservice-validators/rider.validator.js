/**
 * Validators for Rider routes
 * @file Rider Validator
 * @module Rider Validator
 * @category validators
 * @subcategory Rider 
 */
import commonSchemas from './common.validator.js';

export const userInfo = {
    params: {
        type: 'object',
        properties: {
            id: { type: 'integer' },
        },
        required: ['id'],
    },
    response: {
        200: {
            type: 'object',
            // properties: {
            //     message: { type: 'string' },
            // },
            additionalProperties: true
        },
        ...commonSchemas.errorResponse
    },
}


