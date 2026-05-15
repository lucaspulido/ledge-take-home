import {PipelineStage}
from '../types';

import {PipelineContext}
from '../types';

import {
    validateTotalConsistency
} from '../../../domain/rules/total-consistency.rule';

export class ConsistencyCheckStage
implements PipelineStage{

  async execute(
    context:PipelineContext
  ):Promise<void>{

    context.logger.info(
      'Starting consistency-check stage'
    );

    for(const order of context.orders){

      const exceptions=
        validateTotalConsistency(
          order
        );

      order.exceptions.push(
        ...exceptions
      );

      context.exceptions.push(
        ...exceptions
      );

    }

    context.logger.info({

      exceptions:
        context.exceptions.length

    },'Consistency-check stage completed');

  }

}