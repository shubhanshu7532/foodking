/**
 * Validators for Restaurant routes
 * @file Restaurant Validator
 * @module Restaurant Validator
 * @category validators
 * @subcategory Restaurant 
 */
import commonSchemas from '../common.validator.js';

export const otp = {
    body: {
        type: 'object',
        properties: {
            phone: { type: 'string', pattern: '^[0-9]{10}$' },
        },
        required: ['phone'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        ...commonSchemas.errorResponse
    },
}

export const login = {
    body: {
        type: 'object',
        properties: {
            phone: { type: 'string', pattern: '^[0-9]{10,20}$' },
            otp: { type: 'string', minLength: 4, maxLength: 4 },
            first_name: { type: 'string', minLength: 2, maxLength: 20 },
            last_name: { type: 'string', minLength: 2, maxLength: 20 },
            state: { type: 'string' },
            city: { type: 'string' },
            country: { type: 'string' },
            longitude: { type: 'number' },
            latitude: { type: 'number' },
            category: { type: 'string' },
            restaurant_name: {
                type: 'string',
                minLength: 5, maxLength: 50
            },
            restaurant_address: {
                type: 'string',
                minLength: 5, maxLength: 50
            }
        },
        required: ['phone', 'otp'],
    },
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
                token: { type: 'string' },
                validity: { type: 'string', format: 'date-time' },
            },
        },
        ...commonSchemas.errorResponse
    },
}
export const logout = {
    response: {
        200: {
            type: 'object',
            properties: {
                message: { type: 'string' },
            },
        },
        ...commonSchemas.errorResponse
    },
}









