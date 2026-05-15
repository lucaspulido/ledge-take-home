import {Order} from '../models/order';

export class NormalizationService {

  normalizeOrder(
    order:Order
  ):Order{

    order.customerId=
      this.normalizeCustomerId(
        order.customerId
      );

    order.freight=
      this.normalizeMoney(
        order.freight
      );

    order.totalAmount=
      this.normalizeMoney(
        order.totalAmount
      );

    order.lines=
      order.lines.map(line=>{

        line.unitPrice=
          this.normalizeMoney(
            line.unitPrice
          );

        line.discountRate=
          this.normalizeDiscount(
            line.discountRate
          );

        line.lineTotal=
          this.normalizeMoney(
            line.lineTotal
          );

        return line;

      });

    return order;

  }

  private normalizeCustomerId(
    customerId:string
  ):string{

    return customerId
      .trim()
      .toUpperCase();

  }

  private normalizeMoney(
    value:number
  ):number{

    return Number(
      value.toFixed(2)
    );

  }

  private normalizeDiscount(
    value:number
  ):number{

    return Number(
      value.toFixed(4)
    );

  }

}