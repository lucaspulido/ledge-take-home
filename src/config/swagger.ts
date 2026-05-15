// src/config/swagger.ts

import swaggerJsdoc
from 'swagger-jsdoc';

const options = {

  definition: {

    openapi: '3.0.0',

    info: {

      title:
        'Ledge Take Home API',

      version:
        '1.0.0',

      description:
        'Northwind ingestion and validation pipeline API'

    },

    components: {

      securitySchemes: {

        ApiKeyAuth: {

          type: 'apiKey',

          in: 'header',

          name: 'x-api-key'

        }

      }

    },

    security: [

      {

        ApiKeyAuth: []

      }

    ]

  },

  apis: [

    './src/api/routes/*.ts'

  ]

};

export const swaggerSpec =
  swaggerJsdoc(options);