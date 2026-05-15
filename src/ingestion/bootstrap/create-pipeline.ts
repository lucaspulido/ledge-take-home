import { PipelineRunner }
from '../pipeline/pipeline-runner';

import { IngestStage }
from '../pipeline/stages/ingest.stage';

import { ValidateStage }
from '../pipeline/stages/validate.stage';

import { NormalizeStage }
from '../pipeline/stages/normalize.stage';

import { DedupeStage }
from '../pipeline/stages/dedupe.stage';

import { ConsistencyCheckStage }
from '../pipeline/stages/consistency-check.stage';

import { PersistStage }
from '../pipeline/stages/persist.stage';

import {
  NorthwindReader
} from '../northwind/sqlite-reader';

import {
  OrdersRepository
} from '../../persistence/repositories/orders.repository';

import {
  ExceptionsRepository
} from '../../persistence/repositories/exceptions.repository';

import {
  PipelineRunsRepository
} from '../../persistence/repositories/pipeline-runs.repository';

import {
  DedupeService
} from '../../domain/services/dedupe.service';

import {
  NormalizationService
} from '../../domain/services/normalization.service';

export function createPipeline(){

  const northwindReader=
    new NorthwindReader();

  const ordersRepository=
    new OrdersRepository();

  const exceptionsRepository=
    new ExceptionsRepository();

  const pipelineRunsRepository=
    new PipelineRunsRepository();

  const dedupeService=
    new DedupeService(
      ordersRepository
    );

  const normalizationService=
    new NormalizationService();

  const stages=[

    new IngestStage(
      northwindReader
    ),

    new ValidateStage(),

    new NormalizeStage(
      normalizationService
    ),

    new DedupeStage(
      dedupeService
    ),

    new ConsistencyCheckStage(),

    new PersistStage(

      ordersRepository,

      exceptionsRepository

    )

  ];

  return new PipelineRunner(

    stages,

    pipelineRunsRepository

  );

}