/**
 * Validators for user routes
 * @file User Validator
 * @module User Validator
 * @category validators
 * @subcategory user 
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
            vehicle_no: {
                type: 'string',
                minLength: 6, maxLength: 20
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

// export const getProfile = {
//     response: {
//         200: {
//             type: 'object',
//             properties: {
//                 id: { type: 'integer' },
//                 createdAt: { type: 'string', format: 'date-time' },
//                 updatedAt: { type: 'string', format: 'date-time' },
//                 phone: { type: 'string' },
//                 first_name: { type: 'string' },
//                 last_name: { type: 'string' },
//                 username: { type: 'string' },
//                 skill_score: { type: 'integer' },
//                 referral_code: { type: 'string' },
//                 referred_by: { type: 'string' },
//                 avatar: {
//                     oneOf: [
//                         {
//                             type: 'object',
//                             properties: {
//                                 id: { type: 'integer' },
//                                 url: { type: 'string' },
//                             },
//                             additionalProperties: false,
//                         },
//                         {},
//                     ],
//                 },
//                 email: { type: 'string' },
//                 date_of_birth: { type: 'string' },
//                 gender: { type: 'string' },
//                 app_language: { type: 'string' },
//                 follower_count: { type: 'integer' },
//                 following_count: { type: 'integer' },
//                 balance: { type: 'number' },
//                 bonus: { type: 'number' },
//                 winning: { type: 'number' },
//                 unsettled: { type: 'number' },
//                 country: { type: 'string' },
//                 state: { type: 'string' },
//                 city: { type: 'string' },
//                 address: {
//                     oneOf: [
//                         {
//                             type: 'object',
//                             properties: {
//                                 user_id: { type: 'number' },
//                                 street: { type: 'string' },
//                                 city: { type: 'string' },
//                                 pin_code: { type: 'string' },
//                                 state: { type: 'string' },
//                                 country: { type: 'string' },
//                             }
//                         },
//                         {},
//                     ],
//                 }
//             },
//         },
//         ...commonSchemas.errorResponse
//     },
// }


// export const updateProfile = {
//     body: {
//         type: 'object',
//         properties: {
//             //  email: { type: 'string', format: 'email', pattern: '^\\S+@\\S+\\.\\S+$', maxLength: 256 },
//             first_name: { type: 'string', maxLength: 40 },
//             last_name: { type: 'string', maxLength: 40 },
//             date_of_birth: { type: 'string', pattern: '^\\d{4}-\\d{2}-\\d{2}$' },
//             gender: { type: 'string', maxLength: 20 },
//             app_language: { type: 'string', minLength: 2, maxLength: 20 },
//             //user_id: { type: 'number' },
//             street: { type: 'string', maxLength: 30 },
//             city: { type: 'string', maxLength: 30 },
//             pin_code: { type: 'string', maxLength: 8 },
//             state: { type: 'string', maxLength: 30 },
//             country: { type: 'string', maxLength: 30 },
//         },
//     },
//     response: {
//         200: {
//             type: 'object',
//             properties: {
//                 user: {
//                     type: 'object',
//                     // Define the properties of the user object here
//                     properties: {
//                         id: { type: 'number' },
//                         createdAt: { type: 'string', format: 'date-time' },
//                         updatedAt: { type: 'string', format: 'date-time' },
//                         phone: { type: 'string' },
//                         email: { type: 'string' },
//                         username: { type: 'string' },
//                         first_name: { type: 'string' },
//                         last_name: { type: 'string' },
//                         date_of_birth: { type: 'string' },
//                         gender: { type: 'string' },
//                         app_language: { type: 'string' },
//                         role: { type: 'string' },
//                         status: { type: 'string' },
//                         last_active: { type: 'string' },
//                         avatar: {
//                             oneOf: [
//                                 {
//                                     type: 'object',
//                                     properties: {
//                                         id: { type: 'integer' },
//                                         url: { type: 'string' },
//                                     },
//                                     additionalProperties: false,
//                                 },
//                                 {},
//                             ],
//                         },
//                         ip: { type: 'string' },
//                         user_agent: { type: 'string' },
//                         // token: { type: 'string' },
//                     }
//                 },
//                 address: {
//                     type: 'object',
//                     properties: {
//                         id: { type: 'number' },
//                         createdAt: { type: 'string', format: 'date-time' },
//                         updatedAt: { type: 'string', format: 'date-time' },
//                         user_id: { type: 'number' },
//                         street: { type: 'string' },
//                         city: { type: 'string' },
//                         pin_code: { type: 'string' },
//                         state: { type: 'string' },
//                         country: { type: 'string' },
//                     }
//                 },
//             },
//         },
//         ...commonSchemas.errorResponse
//     },
// }


// export const getSetting = {
//     response: {
//         200: {
//             type: "object",
//             properties: {
//                 id: { type: "integer" },
//                 user_id: { type: "integer" },
//                 allow_whatsapp_messages: { type: "boolean" },
//                 display_full_name: { type: "boolean" },
//                 show_my_previous_teams: { type: "boolean" },
//                 show_which_contest_i_join: { type: "boolean" },
//                 allow_challenges: { type: "boolean" },
//             },
//         },
//         ...commonSchemas.errorResponse
//     },
// }


// export const updateSetting = {
//     body: {
//         type: "object",
//         properties: {
//             allow_whatsapp_messages: { type: "boolean" },
//             display_full_name: { type: "boolean" },
//             show_my_previous_teams: { type: "boolean" },
//             show_which_contest_i_join: { type: "boolean" },
//             allow_challenges: { type: "boolean" },
//         },
//         required: ["allow_whatsapp_messages", "display_full_name", "show_my_previous_teams", "show_which_contest_i_join", "allow_challenges",],
//     },
//     response: {
//         200: {
//             type: "object",
//             properties: {
//                 usersetting: {
//                     type: "object",
//                     properties: {
//                         // Define the properties of the UserSetting model here
//                         // For example:
//                         id: { type: "integer" },
//                         user_id: { type: "integer" },
//                         allow_whatsapp_messages: { type: 'boolean' },
//                         display_full_name: { type: 'boolean' },
//                         show_my_previous_teams: { type: 'boolean' },
//                         show_which_contest_i_join: { type: 'boolean' },
//                         allow_challenges: { type: 'boolean' },
//                     },
//                 },
//             },
//         },
//         ...commonSchemas.errorResponse
//     },
// }

// export const getUsers = {
//     querystring: {
//         type: 'object',
//         properties: {
//             search: { type: 'string' },
//             skip: { type: 'string', minLength: 0 },
//             limit: { type: 'string', minLength: 1, maxLength: 100 }
//         },
//     },
//     response: {
//         200: {
//             type: 'object',
//             properties: {
//                 users: {
//                     type: 'array',
//                     items: {
//                         type: 'object',
//                         properties: {
//                             // Define the properties of the User model here
//                             id: { type: 'number' },
//                             createdAt: { type: 'string', format: 'date-time' },
//                             updatedAt: { type: 'string', format: 'date-time' },
//                             phone: { type: 'string' },
//                             email: { type: 'string' },
//                             username: { type: 'string' },
//                             first_name: { type: 'string' },
//                             last_name: { type: 'string' },
//                             date_of_birth: { type: 'string' },
//                             gender: { type: 'string' },
//                             app_language: { type: 'string' },
//                             role: { type: 'string' },
//                             status: { type: 'string' },
//                             city: { type: ['string', 'null'] },
//                             state: { type: ['string', 'null'] },
//                             country: { type: ['string', 'null'] },
//                             avatar: {
//                                 oneOf: [
//                                     {
//                                         type: 'object',
//                                         properties: {
//                                             id: { type: 'integer' },
//                                             url: { type: 'string' },
//                                         },
//                                         additionalProperties: false,
//                                     },
//                                     {},
//                                 ],
//                             },
//                             last_active: { type: 'string' },
//                             referral_code: { type: 'string' },
//                             ip: { type: 'string' },
//                             user_agent: { type: 'string' },
//                             is_banned: { type: 'boolean' }
//                             // token: { type: 'string' },
//                         },
//                     },
//                 },
//                 cached: { type: 'boolean' }, // true if the response was cached
//             },
//         },
//         ...commonSchemas.errorResponse
//     },
// }


// export const getUser = {
//     params: {
//         type: 'object',
//         properties: {
//             id: { type: 'string' },
//         },
//         required: ['id'],
//     },
//     response: {
//         200: {
//             type: 'object',
//             properties: {
//                 // Define the properties of the user object in the response
//                 id: { type: 'number' },
//                 createdAt: { type: 'string', format: 'date-time' },
//                 updatedAt: { type: 'string', format: 'date-time' },
//                 phone: { type: 'string' },
//                 email: { type: 'string' },
//                 username: { type: 'string' },
//                 first_name: { type: 'string' },
//                 last_name: { type: 'string' },
//                 date_of_birth: { type: 'string' },
//                 gender: { type: 'string' },
//                 app_language: { type: 'string' },
//                 role: { type: 'string' },
//                 status: { type: 'string' },
//                 last_active: { type: 'string' },
//                 referral_code: { type: 'string' },
//                 is_banned: { type: 'boolean' },
//                 city: { type: ['string', 'null'] },
//                 state: { type: ['string', 'null'] },
//                 country: { type: ['string', 'null'] },
//                 avatar: {
//                     oneOf: [
//                         {
//                             type: 'object',
//                             properties: {
//                                 id: { type: 'integer' },
//                                 url: { type: 'string' },
//                             },
//                             additionalProperties: false,
//                         },
//                         {},
//                     ],
//                 },
//                 ip: { type: 'string' },
//                 user_agent: { type: 'string' },
//                 wallet: {
//                     type: 'object',
//                     properties: {
//                         id: { type: 'integer' },
//                         user_id: { type: 'integer' },
//                         balance: { type: ['number', 'null'] },
//                         bonus: { type: ['number', 'null'] },
//                         winning: { type: ['number', 'null'] }
//                     }
//                 },
//                 address: {
//                     type: 'object',
//                     properties: {
//                         id: { type: 'number' },
//                         user_id: { type: 'number' },
//                         street: { type: 'string' },
//                         city: { type: 'string' },
//                         pin_code: { type: 'string' },
//                         state: { type: 'string' },
//                         country: { type: 'string' }
//                     }
//                 }
//             },
//         },
//         ...commonSchemas.errorResponse
//     }
// }

