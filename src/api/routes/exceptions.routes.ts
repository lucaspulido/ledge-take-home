
/**
 * @openapi
 * /api/exceptions:
 *   get:
 *     summary: Get processed exceptions
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: List of exceptions
 */

import { Router }
from 'express';

import {

  ExceptionsController

}
from '../controllers/exceptions.controller';

import {

  ExceptionsRepository

}
from '../../persistence/repositories/exceptions.repository';

const router=
  Router();

const controller=
  new ExceptionsController(

    new ExceptionsRepository()

  );

router.get(
  '/',
  controller.findAll.bind(
    controller
  )
);

export {

  router as exceptionsRoutes

};