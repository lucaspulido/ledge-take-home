// src/domain/services/dedupe.service.ts

import { Order } from '../models/order';

import {
  generateFingerprint,
  checkPossibleDuplicate
} from '../rules/duplicate.rule';

import { OrdersRepository } from '../../persistence/repositories/orders.repository';

import { PipelineStage } from '../models/pipeline-stage';
import { ExceptionReasonCode } from '../models/exception-reason-code';

export interface DedupeResult {
  skip: boolean;
}

export class DedupeService {

  constructor(
    private readonly ordersRepository: OrdersRepository
  ) {}

  async process(
    order: Order
  ): Promise<DedupeResult> {

    /*
      Generate deterministic fingerprint
      used for true idempotency
    */
    order.fingerprint =
      generateFingerprint(order);

    /*
      Exact duplicate:
      same fingerprint already exists
      → skip silently
    */
    const existing =
      await this.ordersRepository
        .findFingerprint(
          order.fingerprint
        );

    if (existing) {

      return {
        skip: true
      };

    }

    /*
      Similar records:
      same customer +
      similar amount +
      nearby dates
    */

    const dbOrders =
      await this.ordersRepository
        .findSimilarOrders(
          order.customerId,
          order.totalAmount
        );

    /*
      Prisma returns Decimal.
      Convert persistence model
      into domain model.
    */

    const existingOrders =
      dbOrders.map(order => ({
        customerId:
          order.customerId,

        orderDate:
          order.orderDate,

        totalAmount:
          Number(order.totalAmount),

        fingerprint:
          order.fingerprint
      }));


    const possibleDuplicate =
      checkPossibleDuplicate(
        order,
        existingOrders
      );


    /*
      Not exact duplicate:
      keep processing.

      But if similarity found,
      store exception.
    */

    if (possibleDuplicate) {

      order.addException({

        orderNorthwindId:
          order.northwindId,

        stage:
          PipelineStage.DEDUPE,

        reasonCode:
            ExceptionReasonCode.POSSIBLE_DUPLICATE,

        message:
          `Possible duplicate detected`,

        metadata: {

          matchedFingerprint:
            possibleDuplicate.fingerprint

        }

      });

    }

    return {

      skip: false

    };

  }

}