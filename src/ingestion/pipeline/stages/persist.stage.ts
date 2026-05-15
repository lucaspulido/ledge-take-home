import { PipelineStage }
from '../types';

import { PipelineContext }
from '../types';

import {
  OrdersRepository
} from '../../../persistence/repositories/orders.repository';

import {
  ExceptionsRepository
} from '../../../persistence/repositories/exceptions.repository';

export class PersistStage
implements PipelineStage {

  constructor(

    private readonly ordersRepository:OrdersRepository,

    private readonly exceptionsRepository:ExceptionsRepository

  ) {}

  async execute(
    context:PipelineContext
  ):Promise<void>{

    context.logger.info(
      'Starting persist stage'
    );

    for(const order of context.orders){

      const persistedOrder=
        await this.ordersRepository
        .create(order);

      for(const exception of order.exceptions){

        await this.exceptionsRepository
        .create(

          persistedOrder.id!,
          exception

        );

      }

    }

    context.metrics.recordsProcessed=
      context.orders.length;

    context.metrics.recordsFailed=
      context.exceptions.length;

    context.logger.info({

      processed:
        context.metrics.recordsProcessed,

      failed:
        context.metrics.recordsFailed

    }, 'Persist stage completed');

  }

}