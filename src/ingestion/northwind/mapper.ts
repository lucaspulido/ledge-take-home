import {Order} from '../../domain/models/order';

import {OrderLine}
from '../../domain/models/order-line';

import {
  generateFingerprint
} from '../../domain/rules/duplicate.rule';

import {
  RawNorthwindOrder
} from './models/raw-northwind-order';

import {
  RawNorthwindOrderLine
} from './models/raw-northwind-order-line';

export function mapRawOrderToDomain(

  rawOrder:RawNorthwindOrder,

  rawLines:RawNorthwindOrderLine[]

):Order{

  const lines=
    rawLines.map(line=>

      new OrderLine({

        productId:
          line.productId,

        productName:
          line.productName,

        quantity:
          line.quantity,

        unitPrice:
          line.unitPrice,

        discountRate:
          line.discount,

        lineTotal:
          line.quantity*
          line.unitPrice*
          (1-line.discount)

      })

    );

  const totalAmount=
    lines.reduce(
      (sum,line)=>
        sum+line.lineTotal,
      0
    );

  const order=
    new Order({

      northwindId:
        rawOrder.orderId,

      customerId:
        rawOrder.customerId,

      orderDate:
        new Date(
          rawOrder.orderDate!
        ),

      requiredDate:
        rawOrder.requiredDate
          ?new Date(rawOrder.requiredDate)
          :undefined,

      shippedDate:
        rawOrder.shippedDate
          ?new Date(rawOrder.shippedDate)
          :undefined,

      freight:
        rawOrder.freight ?? 0,

      totalAmount,

      lines

    });

  order.fingerprint=
    generateFingerprint(order);

  return order;

}