
/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Get processed orders
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of orders
 */
import { Router }
from 'express';

import {

  OrdersController

}
from '../controllers/orders.controller';

import {

  OrdersRepository

}
from '../../persistence/repositories/orders.repository';

const router=
  Router();

const controller=
  new OrdersController(

    new OrdersRepository()

  );

router.get(
  '/',
  controller.findAll.bind(
    controller
  )
);

router.get(
  '/:id',
  controller.findByNorthwindId.bind(
    controller
  )
);

export {

  router as ordersRoutes

};