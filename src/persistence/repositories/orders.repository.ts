import { prisma } from '../prisma/prisma-client';

import { Order } from '../../domain/models/order';

import { OrderLine } from '../../domain/models/order-line';

import { OrderMapper }
  from '../mappers/order.mapper';

export class OrdersRepository {

  async findFingerprint(
    fingerprint: string
  ): Promise<boolean> {

    const order =
      await prisma.order.findUnique({

        where: {
          fingerprint,
        },

      });

    return !!order;
  }

  async findSimilarOrders(
    customerId: string,
    totalAmount: number,
    orderDate: Date
  ) {

    const startDate = new Date(
      orderDate.getTime()
      - 7 * 24 * 60 * 60 * 1000
    );

    const endDate = new Date(
      orderDate.getTime()
      + 7 * 24 * 60 * 60 * 1000
    );

    const orders =
      await prisma.order.findMany({

        where: {

          customerId,

          totalAmount: {
            gte: totalAmount - 0.01,
            lte: totalAmount + 0.01,
          },

          orderDate: {
            gte: startDate,
            lte: endDate,
          },

        },

      });

    return orders.map((order:any) => ({
      customerId: order.customerId,
      orderDate: order.orderDate,
      totalAmount: Number(order.totalAmount),
      fingerprint: order.fingerprint,
    }));
  }

  async create(
    order: Order
  ): Promise<Order> {

    const createdOrder =
      await prisma.$transaction(async (tx:any) => {

        const prismaOrder =
          await tx.order.create({

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
                  order.lines.map(
                    (line: OrderLine) => ({

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
                        line.lineTotal,

                    })
                  ),

              },

            },

            include: {
              lines: true,
              exceptions: true,
            },

          });

        return tx.order.findUniqueOrThrow({

          where: {
            id: prismaOrder.id,
          },

          include: {
            lines: true,
            exceptions: true,
          },

        });

      });

    return OrderMapper.toDomain(
      createdOrder
    );

  }

  async findAll(): Promise<Order[]> {

    const orders =
      await prisma.order.findMany({

        include: {
          lines: true,
          exceptions: true,
        },

        orderBy: {
          orderDate: 'desc',
        },

      });

    return orders.map(
      OrderMapper.toDomain
    );

  }

  async findByNorthwindId(
    northwindId: number
  ): Promise<Order | null> {

    const order =
      await prisma.order.findUnique({

        where: {
          northwindId,
        },

        include: {
          lines: true,
          exceptions: true,
        },

      });

    if (!order) {
      return null;
    }

    return OrderMapper.toDomain(
      order
    );

  }

}