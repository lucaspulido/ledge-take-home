import { Order }
from '../models/order';
import { PipelineStage } from '../models/pipeline-stage';

import {
  ProcessingException
}
from '../models/processing-exception';

export function checkConsistency(
  order:Order
):ProcessingException[]{

  const exceptions:
    ProcessingException[]=[];

  if(
    order.freight >
    order.totalAmount
  ){

    exceptions.push({

      orderNorthwindId:
        order.northwindId,

      stage:
        PipelineStage.CONSISTENCY_CHECK,

      reasonCode:
        'FREIGHT_EXCEEDS_TOTAL',

      message:
        'Freight exceeds total amount'

    });

  }

  if(

    order.shippedDate &&
    order.shippedDate <
    order.orderDate

  ){

    exceptions.push({

      orderNorthwindId:
        order.northwindId,

      stage:
        PipelineStage.CONSISTENCY_CHECK,

      reasonCode:
        'INVALID_SHIPPING_SEQUENCE',

      message:
        'Order shipped before order date'

    });

  }

  for(
    const line of order.lines
  ){

    if(
      line.discountRate > 0.5
    ){

      exceptions.push({

        orderNorthwindId:
          order.northwindId,

        stage:
          PipelineStage.CONSISTENCY_CHECK,

        reasonCode:
          'INVALID_DISCOUNT',

        message:
          'Discount exceeds allowed threshold',

        metadata:{

          discountRate:
            line.discountRate

        }

      });

    }

    if(
      line.quantity > 1000
    ){

      exceptions.push({

        orderNorthwindId:
          order.northwindId,

        stage:
          PipelineStage.CONSISTENCY_CHECK,

        reasonCode:
          'EXCESSIVE_QUANTITY',

        message:
          'Line quantity unusually large',

        metadata:{

          quantity:
            line.quantity

        }

      });

    }

  }

  return exceptions;

}