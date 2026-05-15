import swaggerJsdoc
from 'swagger-jsdoc';

import {
  Options
}
from 'swagger-jsdoc';

const options:Options={

  definition:{

    openapi:'3.0.0',

    info:{

      title:
        'Northwind Processing API',

      version:
        '1.0.0',

      description:
        'Pipeline ingestion and querying API'

    },

    components:{

      securitySchemes:{

        ApiKeyAuth:{

          type:'apiKey',

          in:'header',

          name:'X-API-KEY'

        }

      }

    },

    security:[

      {

        ApiKeyAuth:[]

      }

    ]

  },

  apis:[

    './src/api/routes/*.ts'

  ]

};

export const swaggerSpec=
  swaggerJsdoc(options);