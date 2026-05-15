import { Router }
from 'express';

import {

  ordersRoutes

}
from './orders.routes';

import {

  exceptionsRoutes

}
from './exceptions.routes';

import pipelineRoutes from './pipeline.routes';

const router=
  Router();

router.use(
  '/orders',
  ordersRoutes
);

router.use(
  '/exceptions',
  exceptionsRoutes
);

router.use(
  '/pipeline',
  pipelineRoutes
);

export {

  router as apiRoutes

};