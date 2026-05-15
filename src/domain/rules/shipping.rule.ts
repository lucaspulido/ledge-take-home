// src/domain/rules/shipping.rule.ts

import { Order } from '../models/order';

import { PipelineStage } from '../models/pipeline-stage';

import { ProcessingException } from '../models/processing-exception';

import { ExceptionReasonCode } from '../models/exception-reason-code';

export function validateShippingDates(
  order: Order
): ProcessingException[] {

  if (!order.shippedDate) {

    return [];

  }

  if (

    order.orderDate <=
    order.shippedDate

  ) {

    return [];

  }

  return [

    {

      orderNorthwindId:
        order.northwindId,

      stage:
        PipelineStage.CONSISTENCY_CHECK,

      reasonCode:
   ExceptionReasonCode.INVALID_DATE,

      message:
        'Order date cannot be after shipped date',

      metadata: {

        orderDate:
          order.orderDate,

        shippedDate:
          order.shippedDate

      }

    }

  ];

}