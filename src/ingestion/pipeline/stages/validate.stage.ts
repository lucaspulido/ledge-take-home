import {PipelineStage}
from '../types';

import {PipelineContext}
from '../types';

import {
  validateDiscounts
} from '../../../domain/rules/discount.rule';

import {
  validateShippingDates
} from '../../../domain/rules/shipping-date.rule';

export class ValidateStage
implements PipelineStage{

  async execute(
    context:PipelineContext
  ):Promise<void>{

    context.logger.info(
      'Starting validate stage'
    );

    for(const order of context.orders){

      const discountExceptions=
        validateDiscounts(order);

      const shippingExceptions=
        validateShippingDates(order);

      order.exceptions.push(
        ...discountExceptions,
        ...shippingExceptions
      );

      context.exceptions.push(
        ...discountExceptions,
        ...shippingExceptions
      );

    }

    context.logger.info({

      exceptions:
        context.exceptions.length

    },'Validate stage completed');

  }

}