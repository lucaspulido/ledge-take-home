import {
  Order as PrismaOrder,
  OrderLine as PrismaOrderLine,
  ProcessingException as PrismaProcessingException,
} from '@prisma/client';

import { Order } from '../../domain/models/order';

import { OrderLine } from '../../domain/models/order-line';

import { ProcessingException }
  from '../../domain/models/processing-exception';

export class OrderMapper {

  static toDomain(
    prismaOrder: PrismaOrder & {
      lines?: PrismaOrderLine[];
      exceptions?: PrismaProcessingException[];
    }
  ): Order {

    const order = new Order({
      id: prismaOrder.id,
      northwindId: prismaOrder.northwindId,
      customerId: prismaOrder.customerId,
      orderDate: prismaOrder.orderDate,
      requiredDate: prismaOrder.requiredDate ?? undefined,
      shippedDate: prismaOrder.shippedDate ?? undefined,
      freight: Number(prismaOrder.freight),
      totalAmount: Number(prismaOrder.totalAmount),
    });

    order.fingerprint =
      prismaOrder.fingerprint;

    order.hasExceptions =
      prismaOrder.hasExceptions;

    order.createdAt =
      prismaOrder.createdAt;

    order.updatedAt =
      prismaOrder.updatedAt;

    if (prismaOrder.lines) {

      order.lines =
        prismaOrder.lines.map(line =>
          new OrderLine({
            productId: line.productId,
            productName: line.productName ?? undefined,
            quantity: line.quantity,
            unitPrice: Number(line.unitPrice),
            discountRate: Number(line.discountRate),
          })
        );

    }

    if (prismaOrder.exceptions) {

      order.exceptions =
        prismaOrder.exceptions.map(exception => ({

          orderNorthwindId:
            prismaOrder.northwindId,

          stage:
            exception.stage as any,

          reasonCode:
            exception.reasonCode,

          message:
            exception.message,

          metadata:
            exception.metadata as Record<string, unknown>,

        }));

    }

    return order;
  }

}