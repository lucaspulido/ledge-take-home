import { PipelineStage }
from '../types';

import { PipelineContext }
from '../types';

import {
  DedupeService
} from '../../../domain/services/dedupe.service';

export class DedupeStage
implements PipelineStage {

  constructor(

    private readonly dedupeService:DedupeService

  ) {}

  async execute(
    context:PipelineContext
  ):Promise<void>{

    context.logger.info(
      'Starting dedupe stage'
    );

    const validOrders=[];

    let duplicatesSkipped=0;

    for(const order of context.orders){

      const result=
        await this.dedupeService.process(
          order
        );

      if(result.skip){

        duplicatesSkipped++;

        continue;

      }

      validOrders.push(order);

      context.exceptions.push(
        ...order.exceptions
      );

    }

    context.orders=
      validOrders;

    context.metrics.duplicatesSkipped=
      duplicatesSkipped;

    context.logger.info({

      duplicatesSkipped

    }, 'Dedupe stage completed');

  }

}