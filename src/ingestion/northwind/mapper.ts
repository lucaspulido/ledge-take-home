import { Order }
from '../../domain/models/order';

import { OrderLine }
from '../../domain/models/order-line';

import {
  RawNorthwindOrder
} from './models/raw-northwind-order';

import {
  RawNorthwindOrderLine
} from './models/raw-northwind-order-line';

export function mapNorthwindOrders(

  rawOrders:RawNorthwindOrder[],

  rawOrderLines:RawNorthwindOrderLine[]

):Order[]{

  /*
    Pre-group lines by orderId
    to avoid O(n²) filtering.
  */

  const linesByOrderId=
    new Map<
      number,
      RawNorthwindOrderLine[]
    >();

  for(const line of rawOrderLines){

    const existing=

      linesByOrderId.get(
        line.orderId
      ) ?? [];

    existing.push(line);

    linesByOrderId.set(
      line.orderId,
      existing
    );

  }

  return rawOrders.map(rawOrder=>{

    const rawLines=

      linesByOrderId.get(
        rawOrder.orderId
      ) ?? [];

    const lines=
      rawLines.map(line=>{

        const lineTotal=

          line.quantity
          *
          line.unitPrice
          *
          (1-line.discount);

        return new OrderLine({

          productId:
            line.productId,

          productName:
            line.productName,

          quantity:
            line.quantity,

          unitPrice:
            Number(line.unitPrice),

          discountRate:
            Number(line.discount),

          lineTotal:
            Number(
              lineTotal.toFixed(2)
            )

        });

      });

    const order=
      new Order({

        northwindId:
          rawOrder.orderId,

        customerId:
          rawOrder.customerId,

        orderDate:
          new Date(
            rawOrder.orderDate
          ),

        requiredDate:
          rawOrder.requiredDate
            ?new Date(
              rawOrder.requiredDate
            )
            :undefined,

        shippedDate:
          rawOrder.shippedDate
            ?new Date(
              rawOrder.shippedDate
            )
            :undefined,

        freight:
          Number(
            rawOrder.freight ?? 0
          ),

        totalAmount:0,

        lines

      });

    order.totalAmount=
      order.calculateExpectedTotal();

    return order;

  });

}