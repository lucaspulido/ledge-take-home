// src/domain/rules/total-consistency.rule.ts

import { Order } from '../models/order';

import { PipelineStage } from '../models/pipeline-stage';

import { ProcessingException } from '../models/processing-exception';

import { ExceptionReasonCode } from '../models/exception-reason-code';

export function validateTotalConsistency(
  order: Order
): ProcessingException[] {

  const expected =
    order.calculateExpectedTotal();

  const matches =

    Math.abs(
      expected - order.totalAmount
    ) < 0.01;

  if (matches) {

    return [];

  }

  return [

    {

      orderNorthwindId:
        order.northwindId,

      stage:
        PipelineStage.CONSISTENCY_CHECK,

      reasonCode:
        ExceptionReasonCode.TOTAL_MISMATCH,

      message:
        'Order total does not match lines + freight',

      metadata: {

        expected,

        actual:
          order.totalAmount

      }

    }

  ];

}