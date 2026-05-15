import { prisma } from '../prisma/client';

import { Order } from '../../domain/models/order';

export class OrdersRepository {

  async findFingerprint(
    fingerprint: string
  ) {

    return prisma.order.findUnique({
      where: {
        fingerprint
      }
    });

  }


  async findSimilarOrders(
    customerId: string,
    totalAmount: number
  ) {

    return prisma.order.findMany({

      where: {

        customerId,

        totalAmount: {

          gte: totalAmount - 0.01,

          lte: totalAmount + 0.01

        }

      }

    });

  }


  async create(
    data: any
  ) {

    return prisma.order.create({
      data
    });

  }


  async save(
    order: Order
  ) {

    return prisma.order.create({

      data: {

        northwindId:
          order.northwindId,

        fingerprint:
          order.fingerprint,

        customerId:
          order.customerId,

        orderDate:
          order.orderDate,

        requiredDate:
          order.requiredDate,

        shippedDate:
          order.shippedDate,

        freight:
          order.freight,

        totalAmount:
          order.totalAmount,

        hasExceptions:
          order.hasExceptions,

        lines: {

          create:

          order.lines.map(line => ({

            productId:
              line.productId,

            productName:
              line.productName,

            quantity:
              line.quantity,

            unitPrice:
              line.unitPrice,

            discountRate:
              line.discountRate,

            lineTotal:
              line.lineTotal

          }))

        }

      }

    });

  }

}