import { prisma }
from '../prisma/prisma-client';

import { PipelineRun }
from '../../domain/models/pipeline-run';

export class PipelineRunsRepository {

  async create(
    pipelineRun:PipelineRun
  ):Promise<void>{

    await prisma.pipelineRun.create({

      data:{

        correlationId:
          pipelineRun.correlationId,

        startedAt:
          pipelineRun.startedAt,

        finishedAt:
          pipelineRun.finishedAt,

        status:
          pipelineRun.status,

        recordsRead:
          pipelineRun.recordsRead,

        recordsProcessed:
          pipelineRun.recordsProcessed,

        recordsFailed:
          pipelineRun.recordsFailed,

        duplicatesSkipped:
          pipelineRun.duplicatesSkipped

      }

    });

  }

  async update(
    pipelineRun:PipelineRun
  ):Promise<void>{

    await prisma.pipelineRun.update({

      where:{

        correlationId:
          pipelineRun.correlationId

      },

      data:{

        finishedAt:
          pipelineRun.finishedAt,

        status:
          pipelineRun.status,

        recordsRead:
          pipelineRun.recordsRead,

        recordsProcessed:
          pipelineRun.recordsProcessed,

        recordsFailed:
          pipelineRun.recordsFailed,

        duplicatesSkipped:
          pipelineRun.duplicatesSkipped

      }

    });

  }

}