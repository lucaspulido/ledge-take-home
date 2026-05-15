import { Router }
from 'express';

import {
  PipelineRunsRepository
}
from '../../persistence/repositories/pipeline-runs.repository';

import {
  PipelineController
}
from '../controllers/pipeline.controller';

import {
  PipelineRunner
}
from '../../ingestion/pipeline/pipeline-runner';

import {
  IngestStage
}
from '../../ingestion/pipeline/stages/ingest.stage';

import {
  ValidateStage
}
from '../../ingestion/pipeline/stages/validate.stage';

import {
  NormalizeStage
}
from '../../ingestion/pipeline/stages/normalize.stage';

import {
  DedupeStage
}
from '../../ingestion/pipeline/stages/dedupe.stage';

import {
  ConsistencyCheckStage
}
from '../../ingestion/pipeline/stages/consistency-check.stage';

import {
  PersistStage
}
from '../../ingestion/pipeline/stages/persist.stage';

import {
  NorthwindReader
}
from '../../ingestion/northwind/sqlite-reader';

import {
  NormalizationService
}
from '../../domain/services/normalization.service';

import {
  DedupeService
}
from '../../domain/services/dedupe.service';

import {
  OrdersRepository
}
from '../../persistence/repositories/orders.repository';

import {
  ExceptionsRepository
}
from '../../persistence/repositories/exceptions.repository';

const router=
  Router();

const pipelineRunsRepository=
  new PipelineRunsRepository();

const ordersRepository=
  new OrdersRepository();

const exceptionsRepository=
  new ExceptionsRepository();

const pipelineRunner=
  new PipelineRunner(

    [

      new IngestStage(

        new NorthwindReader()

      ),

      new ValidateStage(),

      new NormalizeStage(

        new NormalizationService()

      ),

      new DedupeStage(

        new DedupeService(
          ordersRepository
        )

      ),

      new ConsistencyCheckStage(),

      new PersistStage(

        ordersRepository,
        exceptionsRepository

      )

    ],

    pipelineRunsRepository

  );

const controller=
  new PipelineController(
    pipelineRunner
  );

/**
 * @openapi
 * /api/pipeline/run:
 *   post:
 *     summary: Run ingestion pipeline
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Pipeline execution completed
 */

router.post(
  '/run',
  controller.run
);

export default router;