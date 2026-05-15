import sqlite3 from 'sqlite3';

import { open }
from 'sqlite';

import path from 'path';

import {
  RawNorthwindOrder
} from './models/raw-northwind-order';

import {
  RawNorthwindOrderLine
} from './models/raw-northwind-order-line';

export class NorthwindReader {

  private readonly dbPath=
    path.resolve(
      'data/northwind.db'
    );

  async readOrders():
  Promise<RawNorthwindOrder[]>{

    const db=
      await open({

        filename:this.dbPath,

        driver:sqlite3.Database

      });

    const orders=
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

    await db.close();

    return orders;

  }

  async readOrderLines():
  Promise<RawNorthwindOrderLine[]>{

    const db=
      await open({

        filename:this.dbPath,

        driver:sqlite3.Database

      });

    const orderLines=
      await db.all<RawNorthwindOrderLine[]>(`

        SELECT
          od.OrderID as orderId,
          od.ProductID as productId,
          p.ProductName as productName,
          od.UnitPrice as unitPrice,
          od.Quantity as quantity,
          od.Discount as discount
        FROM "Order Details" od
        JOIN Products p
          ON p.ProductID=od.ProductID

      `);

    await db.close();

    return orderLines;

  }

}