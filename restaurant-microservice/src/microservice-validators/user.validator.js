/**
 * Validators for user routes
 * @file User Validator
 * @module User Validator
 * @category validators
 * @subcategory user 
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


