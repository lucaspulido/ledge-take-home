// src/domain/models/order.ts

import { OrderLine } from './order-line';
import { ProcessingException } from './processing-exception';

export class Order {

  northwindId!: number;

  fingerprint!: string;

  customerId!: string;

  orderDate!: Date;

  requiredDate?: Date;

  shippedDate?: Date;

  freight!: number;

  totalAmount!: number;

  hasExceptions: boolean = false;

  createdAt?:Date;

  updatedAt?:Date;

  lines: OrderLine[] = [];

  exceptions: ProcessingException[] = [];

  constructor(
    partial?: Partial<Order>
  ) {

    Object.assign(
      this,
      partial
    );

  }

  addLine(
    line: OrderLine
  ): void {

    this.lines.push(line);

  }

  addException(

    exception: Omit<
      ProcessingException,
      'createdAt'
    >

  ): void {

    this.exceptions.push({

      ...exception,

      createdAt: new Date()

    });

    this.hasExceptions = true;

  }

  calculateLinesTotal(): number {

    return this.lines.reduce(

      (sum, line) =>
        sum + line.lineTotal,

      0

    );

  }

  calculateExpectedTotal(): number {

    return (

      this.calculateLinesTotal()
      +
      this.freight

    );

  }

}