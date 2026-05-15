import {PipelineStage}
from '../types';

import {PipelineContext}
from '../types';

import {
  openNorthwindConnection
} from '../../northwind/sqlite-reader';

import {
  mapRawOrderToDomain
} from '../../northwind/mapper';

import {
  RawNorthwindOrder
} from '../../northwind/models/raw-northwind-order';

import {
  RawNorthwindOrderLine
} from '../../northwind/models/raw-northwind-order-line';

export class IngestStage
implements PipelineStage{

  async execute(
    context:PipelineContext
  ):Promise<void>{

    context.logger.info(
      'Starting ingest stage'
    );

    const db=
      await openNorthwindConnection();

    const rawOrders=
      await db.all<RawNorthwindOrder[]>(`

        SELECT
          OrderID as orderId,
          CustomerID as customerId,
          OrderDate as orderDate,
          RequiredDate as requiredDate,
          ShippedDate as shippedDate,
          Freight as freight
        FROM Orders

      `);

    const rawOrderLines=
      await db.all<RawNorthwindOrderLine[]>(`

        SELECT
          od.OrderID as orderId,
          od.ProductID as productId,
          p.ProductName as productName,
          od.Quantity as quantity,
          od.UnitPrice as unitPrice,
          od.Discount as discount
        FROM "Order Details" od
        INNER JOIN Products p
          ON p.ProductID=od.ProductID

      `);

    context.rawOrders=
      rawOrders;

    context.rawOrderLines=
      rawOrderLines;

    context.orders=
      rawOrders.map(order=>{

        const lines=
          rawOrderLines.filter(

            line=>
              line.orderId===
              order.orderId

          );

        return mapRawOrderToDomain(
          order,
          lines
        );

      });

    context.metrics.recordsRead=
      context.orders.length;

    context.logger.info({

      recordsRead:
        context.metrics.recordsRead

    },'Ingest stage completed');

    await db.close();

  }

}