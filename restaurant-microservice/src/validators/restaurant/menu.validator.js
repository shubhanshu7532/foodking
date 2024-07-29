/**
 * Validators for Menu  routes
 * @file Menu Validator
 * @module Menu Validator
 * @category validators
 * @subcategory Menu
 */
import commonSchemas from '../common.validator.js';

export const createMenu = {
    body: {
        type: 'object',
        properties: {
            food_name: { type: 'string', minLength: 5, maxLength: 50 },
            description: { type: 'string', minLength: 15, maxLength: 50 },
            price: { type: 'number' },
            quantity: { type: ['integer', 'null'] },

        },
    },
}


