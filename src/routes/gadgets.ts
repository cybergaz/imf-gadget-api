import express from 'express';
import { addGadget, deleteGadget, getGadgets, patchGadget, selfDestruct } from '../controllers/gadget';
import { authenticateJWT } from '../middleware/auth';

const router = express.Router()

// gadget routes
router.get('/gadgets', authenticateJWT, getGadgets)
router.post('/gadgets', authenticateJWT, addGadget)
router.patch('/gadgets/:id', authenticateJWT, patchGadget)
router.delete('/gadgets/:id', authenticateJWT, deleteGadget)
router.post('/gadgets/:id/self-destruct', authenticateJWT, selfDestruct)

export default router;


// -----------------------------------------------------------------------------------------------------
// swagger docs
// -----------------------------------------------------------------------------------------------------

export const gadgetsDoc = {
    '/api/gadgets': {
        get: {
            summary: 'Retrieve a list of gadgets',
            description: 'Retrieve a list of all gadgets, optionally filtered by status. Each gadget includes a randomly generated mission success probability.',
            tags: ['Gadgets'],
            security: [
                {
                    BearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'status',
                    in: 'query',
                    description: 'Filter gadgets by status',
                    required: false,
                    schema: {
                        type: 'string',
                        enum: ['Available', 'Deployed', 'Destroyed', 'Decommissioned'],
                    },
                },
            ],
            responses: {
                200: {
                    description: 'A list of gadgets',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    id: {
                                        type: 'integer',
                                        description: 'The unique ID of the gadget',
                                    },
                                    name: {
                                        type: 'string',
                                        description: 'The name of the gadget',
                                    },
                                    description: {
                                        type: 'string',
                                        description: 'A description of the gadget',
                                    },
                                    status: {
                                        type: 'string',
                                        enum: ['Available', 'Deployed', 'Destroyed', 'Decommissioned'],
                                        description: 'The status of the gadget',
                                    },
                                    missionSuccessProbability: {
                                        type: 'string',
                                        description: 'The randomly generated mission success probability',
                                    },
                                },
                            },
                        },
                    },
                },
                400: {
                    description: 'Invalid status value provided',
                },
                401: {
                    description: 'Unauthorized (missing or invalid JWT token)',
                },
                500: {
                    description: 'Internal server error',
                },
            },
        },
        post: {
            summary: 'Add a new gadget',
            description: 'Add a new gadget to the inventory. A unique codename is automatically generated.',
            tags: ['Gadgets'],
            security: [
                {
                    BearerAuth: [],
                },
            ],
            responses: {
                201: {
                    description: 'Gadget created successfully',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        description: 'A message indicating the gadget was created successfully',
                                    },
                                    gadget: {
                                        name: {
                                            type: 'string',
                                            description: 'The name of the gadget',
                                        },
                                        status: {
                                            type: 'string',
                                            enum: ['Available', 'Deployed', 'Destroyed', 'Decommissioned'],
                                            description: 'The status of the gadget',
                                        },
                                    },
                                },
                            },
                        },
                    },

                    401: {
                        description: 'Unauthorized (missing or invalid JWT token)',
                    },
                    500: {
                        description: 'Internal server error',
                    },
                },
            },
        },
    },
    '/api/gadgets/{id}': {
        patch: {
            summary: 'Update a gadget',
            description: 'Update an existing gadget\'s information.',
            tags: ['Gadgets'],
            security: [
                {
                    BearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID of the gadget to update',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string',
                                    description: 'The updated name of the gadget.',
                                    required: false,
                                },
                                status: {
                                    type: 'string',
                                    enum: ['Available', 'Deployed', 'Destroyed', 'Decommissioned'],
                                    description: 'The updated status of the gadget.',
                                    required: false,
                                },
                            },
                        },
                    },
                },
            },
            responses: {
                200: {
                    description: 'Gadget updated successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Gadget',
                            },
                        },
                    },
                },
                400: {
                    description: 'Invalid status',
                },
                401: {
                    description: 'Unauthorized (missing or invalid JWT token)',
                },
                404: {
                    description: 'Gadget not found',
                },
                500: {
                    description: 'Internal server error',
                },
            },
        },
        delete: {
            summary: 'Decommission a gadget',
            description: 'Mark a gadget as "Decommissioned" and add a timestamp for when it was decommissioned.',
            tags: ['Gadgets'],
            security: [
                {
                    BearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID of the gadget to decommission',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'Gadget decommissioned successfully',
                    content: {
                        'application/json': {
                            schema: {
                                $ref: '#/components/schemas/Gadget',
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized (missing or invalid JWT token)',
                },
                404: {
                    description: 'Gadget not found',
                },
                500: {
                    description: 'Internal server error',
                },
            },
        },
    },
    '/api/gadgets/{id}/self-destruct': {
        post: {
            summary: 'Trigger self-destruct sequence',
            description: 'Trigger the self-destruct sequence for a specific gadget. A randomly generated confirmation code is returned.',
            tags: ['Gadgets'],
            security: [
                {
                    BearerAuth: [],
                },
            ],
            parameters: [
                {
                    name: 'id',
                    in: 'path',
                    description: 'ID of the gadget to self-destruct',
                    required: true,
                    schema: {
                        type: 'integer',
                    },
                },
            ],
            responses: {
                200: {
                    description: 'Self-destruct sequence initiated',
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                properties: {
                                    message: {
                                        type: 'string',
                                        example: 'Self-destruct sequence initiated',
                                    },
                                    confirmationCode: {
                                        type: 'string',
                                        example: 'ABC123',
                                    },
                                    instructions: {
                                        type: 'string',
                                        example: 'Enter this code to confirm destruction',
                                    },
                                },
                            },
                        },
                    },
                },
                401: {
                    description: 'Unauthorized (missing or invalid JWT token)',
                },
                404: {
                    description: 'Gadget not found',
                },
                500: {
                    description: 'Internal server error',
                },
            },
        },
    },
}
