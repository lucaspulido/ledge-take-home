import express
from 'express';

import cors
from 'cors';

import helmet
from 'helmet';

import swaggerUi
from 'swagger-ui-express';

import {
  swaggerSpec
}
from './api/swagger/swagger';

import pipelineRoutes
from './api/routes/pipeline.routes';

import {

  apiRoutes

}
from './api/routes';

import {

  apiKeyMiddleware

}
from './api/middleware/api-key.middleware';

const app=
  express();

app.use(
  express.json()
);

app.use(
  cors()
);

app.use(
  helmet()
);

  app.use(

    '/api/docs',

    swaggerUi.serve,

    swaggerUi.setup(
      swaggerSpec
    )

  );


/*
  Protected API routes
*/

app.use(
  apiKeyMiddleware
);

app.use(
  '/api',
  apiRoutes
);

app.use(
  '/api/pipeline',
  pipelineRoutes
);

const PORT=
  process.env.PORT || 3000;

app.listen(
  PORT,
  ()=>{

    console.log(
      `Server running on port ${PORT}`
    );

  }
);