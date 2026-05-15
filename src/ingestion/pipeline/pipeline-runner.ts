import { randomUUID }
from 'crypto';

import {
  createPipelineLogger
}
from '../../common/logger';

import { PipelineContext }
from './types';

import { PipelineStage }
from './types';

import { PipelineRun }
from '../../domain/models/pipeline-run';

import { PipelineRunStatus }
from '../../domain/models/pipeline-run-status';

import {
  PipelineRunsRepository
} from '../../persistence/repositories/pipeline-runs.repository';

export class PipelineRunner {

  constructor(

    private readonly stages:PipelineStage[],

    private readonly pipelineRunsRepository:
    PipelineRunsRepository

  ) {}

  async run():Promise<{ correlationId: string; metrics: any }>{

    const correlationId=
      randomUUID();

    const pipelineRun=
      new PipelineRun({

        correlationId,

        startedAt:new Date(),

        status:
          PipelineRunStatus.FULLCOMPLETED,

        recordsRead:0,

        recordsProcessed:0,

        recordsFailed:0,

        duplicatesSkipped:0

      });

    await this.pipelineRunsRepository
    .create(pipelineRun);

    const context:PipelineContext={

        correlationId,

        logger:
            createPipelineLogger(
            correlationId
            ),

        pipelineRun,

        rawOrders:[],

        rawOrderLines:[],

        orders:[],

        exceptions:[],

        metrics:{

            recordsRead:0,

            recordsProcessed:0,

            recordsFailed:0,

            duplicatesSkipped:0

        }

        };

    try{

      for(const stage of this.stages){

        await stage.execute(
          context
        );

      }

      if(context.metrics.recordsFailed>0){

        pipelineRun.status=
          PipelineRunStatus
          .PARTIALLYCOMPLETED;

      }

    }catch(error){

      pipelineRun.status=
        PipelineRunStatus.FAILED;

      context.logger.error({

        error

      }, 'Pipeline execution failed');

      throw error;

    }finally{

      pipelineRun.finishedAt=
        new Date();

      pipelineRun.recordsRead=
        context.metrics.recordsRead;

      pipelineRun.recordsProcessed=
        context.metrics.recordsProcessed;

      pipelineRun.recordsFailed=
        context.metrics.recordsFailed;

      pipelineRun.duplicatesSkipped=
        context.metrics.duplicatesSkipped;

      await this.pipelineRunsRepository
      .update(pipelineRun);

    }
    return {

    correlationId:
        context.correlationId,

    metrics:
        context.metrics

    };

  }

}