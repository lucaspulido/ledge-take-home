import { PipelineStage }
from '../types';

import { PipelineContext }
from '../types';

import {
  checkConsistency
}
from '../../../domain/rules/consistency.rule';

export class ConsistencyCheckStage
implements PipelineStage {

  async execute(
    context:PipelineContext
  ):Promise<void>{

    context.logger.info(
      'Starting consistency-check stage'
    );

    for(
      const order of context.orders
    ){

      const exceptions=
        checkConsistency(order);

      if(
        exceptions.length > 0
      ){

        order.hasExceptions=
          true;

        context.exceptions.push(
          ...exceptions
        );

      }

    }

    context.logger.info({

      exceptions:
        context.exceptions.length

    }, 'Consistency-check stage completed');

  }

}