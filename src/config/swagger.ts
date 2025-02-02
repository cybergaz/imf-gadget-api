import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application, Express } from 'express';
import { loginDoc } from '../routes/auth';
import { gadgetsDoc } from '../routes/gadgets';
import { unprotectedDocs } from '../routes/unprotected';

const swaggerSpec = {
    openapi: '3.0.0',
    info: {
        title: 'Phoenix : IMF Gadget API',
        version: '1.0.0',
        description: 'API documentation for IMF Gadget Assignment',
    },
    servers: [
        {
            url: 'http://localhost:3000',
        },
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
    },
    security: [
        {
            BearerAuth: [],
        },
    ],
    paths: {
        ...loginDoc,
        ...gadgetsDoc,
        ...unprotectedDocs,
    },
};

const setupSwaggerDocs = (app: Express, port: number): void => {
    app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    console.log(`Swagger Docs available at http://localhost:${port}`);
};

export { setupSwaggerDocs };

