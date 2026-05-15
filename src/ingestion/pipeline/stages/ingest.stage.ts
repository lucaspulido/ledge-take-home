import { PipelineStage }
from '../types';

import { PipelineContext }
from '../types';

import {
  NorthwindReader
} from '../../northwind/sqlite-reader';

import {
  mapNorthwindOrders
} from '../../northwind/mapper';

import { Order }
from '../../../domain/models/order';

export class IngestStage
implements PipelineStage {

  constructor(

    private readonly northwindReader:NorthwindReader

  ) {}

  async execute(
    context:PipelineContext
  ):Promise<void>{

    context.logger.info(
      'Starting ingest stage'
    );

    context.rawOrders=
      await this.northwindReader
      .readOrders();

    context.rawOrderLines=
      await this.northwindReader
      .readOrderLines();

    context.orders=
      mapNorthwindOrders(

        context.rawOrders,

        context.rawOrderLines

      );

    if(
      process.env.NODE_ENV===
      'development'
    ){

      this.injectTestInconsistencies(
        context.orders
      );

    }

    context.metrics.recordsRead=
      context.orders.length;

    context.logger.info({

      recordsRead:
        context.metrics.recordsRead

    }, 'Ingest stage completed');

  }

  private injectTestInconsistencies(
    orders:Order[]
  ):void{

    const freightOrder=
      orders.find(
        order=>
          order.northwindId===10248
      );

    if(freightOrder){

      freightOrder.freight=
        freightOrder.totalAmount+1000;

    }

    const shippingOrder=
      orders.find(
        order=>
          order.northwindId===10249
      );

    if(
      shippingOrder &&
      shippingOrder.orderDate
    ){

      shippingOrder.shippedDate=
        new Date(

          shippingOrder.orderDate
          .getTime()-86400000

        );

    }

    const discountOrder=
      orders.find(
        order=>
          order.northwindId===10250
      );

    if(
      discountOrder &&
      discountOrder.lines.length>0
    ){

      discountOrder.lines[0]
      .discountRate=0.9;

    }

  }

}