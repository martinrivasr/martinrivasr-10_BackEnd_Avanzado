// swaggerConfig.js
import swaggerJsdoc from 'swagger-jsdoc';

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de Nodepop',
            version: '1.0.0',
            description: 'Documentación de la API para Nodepop',
        },
        servers: [
            { url: 'http://localhost:3000' }
        ]
    },
    apis: ['./app.js'], // Archivos donde están los endpoints
};

const specs = swaggerJsdoc(swaggerOptions);

export { specs };
