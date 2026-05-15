// src/domain/rules/discount.rule.ts

import { Order } from '../models/order';

import { PipelineStage } from '../models/pipeline-stage';

import { ExceptionReasonCode } from '../models/exception-reason-code';

import { ProcessingException } from '../models/processing-exception';

export function validateDiscounts(
  order: Order
): ProcessingException[] {

  const exceptions: ProcessingException[] = [];

  for (const line of order.lines) {

    if (

      line.discountRate < 0 ||

      line.discountRate > 1

    ) {

      exceptions.push({

        orderNorthwindId:
          order.northwindId,

        stage:
          PipelineStage.VALIDATE,

        reasonCode:
          ExceptionReasonCode.INVALID_DISCOUNT,

        message:
          `Invalid discount rate: ${line.discountRate}`,

        metadata: {

          productId:
            line.productId

        }

      });

    }

  }

  return exceptions;

}