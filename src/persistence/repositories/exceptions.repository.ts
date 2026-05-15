import { prisma } from '../prisma/prisma-client';

import { Prisma } from '@prisma/client';

import {
  ProcessingException
} from '../../domain/models/processing-exception';

export class ExceptionsRepository {

  async create(
    orderId: number,
    exception: ProcessingException
  ) {

    return prisma.processingException.create({

      data: {

        orderId,

        stage:
          exception.stage,

        reasonCode:
          exception.reasonCode,

        message:
          exception.message,

        metadata:
          exception.metadata as Prisma.InputJsonValue,

      },

    });

  }

  async findAll() {

    return prisma.processingException.findMany({

      orderBy: {
        createdAt: 'desc',
      },

    });

  }

}