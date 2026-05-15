import {

  Request,
  Response

}
from 'express';

import {

  OrdersRepository

}
from '../../persistence/repositories/orders.repository';

export class OrdersController {

  constructor(

    private readonly ordersRepository: OrdersRepository

  ) {}

  async findAll(
    request: Request,
    response: Response
  ) {

    const orders =
      await this.ordersRepository
        .findAll();

    return response.json(
      orders
    );

  }

  async findByNorthwindId(
    request: Request,
    response: Response
  ) {

    const northwindId =
      Number(
        request.params.id
      );

    const order =
      await this.ordersRepository
        .findByNorthwindId(
          northwindId
        );

    if (!order) {

      return response
        .status(404)
        .json({

          message:
            'Order not found'

        });

    }

    return response.json(
      order
    );

  }

}