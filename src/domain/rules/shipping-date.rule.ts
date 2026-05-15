import {Order} from '../models/order';

import {
  PipelineStage
} from '../models/pipeline-stage';

import {
  ProcessingException
} from '../models/processing-exception';

import {
  ExceptionReasonCode
} from '../models/exception-reason-code';

import {
  ExceptionFactory
} from '../services/exception.factory';

export function validateShippingDates(
  order:Order
):ProcessingException[]{

  if(!order.shippedDate){

    return [];

  }

  if(

    order.orderDate <=
    order.shippedDate

  ){

    return [];

  }

  return [

    ExceptionFactory.create(

      order.northwindId,

      PipelineStage.CONSISTENCY_CHECK,

      ExceptionReasonCode.INVALID_DATE,

      'Order date cannot be after shipped date',

      {

        orderDate:
          order.orderDate,

        shippedDate:
          order.shippedDate

      }

    )

  ];

}