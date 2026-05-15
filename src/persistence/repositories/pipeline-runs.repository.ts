import { prisma } from '../prisma/prisma-client';

import { PipelineRun }
  from '../../domain/models/pipeline-run';

export class PipelineRunsRepository {

  async create(
    run: PipelineRun
  ) {

    return prisma.pipelineRun.create({

      data: {

        correlationId:
          run.correlationId,

        startedAt:
          run.startedAt,

        finishedAt:
          run.finishedAt,

        status:
          run.status,

        recordsRead:
          run.recordsRead,

        recordsProcessed:
          run.recordsProcessed,

        recordsFailed:
          run.recordsFailed,

        duplicatesSkipped:
          run.duplicatesSkipped,

      },

    });

  }

  async update(
    run: PipelineRun
  ) {

    return prisma.pipelineRun.update({

      where: {
        correlationId:
          run.correlationId,
      },

      data: {

        finishedAt:
          run.finishedAt,

        status:
          run.status,

        recordsRead:
          run.recordsRead,

        recordsProcessed:
          run.recordsProcessed,

        recordsFailed:
          run.recordsFailed,

        duplicatesSkipped:
          run.duplicatesSkipped,

      },

    });

  }

  async findLatest() {

    return prisma.pipelineRun.findFirst({

      orderBy: {
        startedAt: 'desc',
      },

    });

  }

}