import express from 'express';
import { handleLogin, handleSignup } from '../controllers/auth';

const router = express.Router()

// gadget routes
router.post('/register', handleSignup)
router.post('/login', handleLogin)

export default router;


// -----------------------------------------------------------------------------------------------------
// swagger docs
// -----------------------------------------------------------------------------------------------------

export const loginDoc = {
    '/auth/register': {
        post: {
            summary: "register a new user",
            description: 'this endpoint is used to register a new user',
            tags: ['Authentication'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                    description: 'user email',
                                },
                                password: {
                                    type: 'string',
                                    description: 'user password',
                                },
                            },
                            required: ['email', 'password'],
                        },
                    },
                },
            },
            responses: {
                201: {
                    description: 'New user registered successfully',
                },
                500: {
                    description: 'Internal server error, failed to redirect to OAuth consent screen.',
                },
            },
        },
    },

    // ---------------------------------------------------------------------------------------------------------
    '/auth/login': {
        post: {
            summary: "login a user",
            description: 'this endpoint is used to login a user',
            tags: ['Authentication'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                email: {
                                    type: 'string',
                                    description: 'user email',
                                },
                                password: {
                                    type: 'string',
                                    description: 'user password',
                                },
                            },
                            required: ['email', 'password'],
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'successful login, copy your jwt for subsequent api calls',
                },
                400: {
                    description: 'Email and password are not provided in the body',
                },
                401: {
                    description: 'Invalid email or password',
                },
                500: {
                    description: 'Internal server error, failed to redirect to OAuth consent screen.',
                },
            },
        },
    }
}
