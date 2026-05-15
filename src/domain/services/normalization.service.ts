// src/domain/services/normalization.service.ts

import { Order } from '../models/order';

export class NormalizationService {

  normalize(
    order: Order
  ): Order {

    order.customerId =
      order.customerId
        .trim()
        .toUpperCase();

    return order;

  }

}