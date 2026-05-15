// src/domain/services/validation.service.ts

import { Order } from '../models/order';

import {
  validateDiscounts
} from '../rules/discount.rule';

import {
  validateShippingDates
} from '../rules/shipping-date.rule';

import {
  validateTotalConsistency
} from '../rules/total-consistency.rule';

export class ValidationService {

  validate(
    order: Order
  ): void {

    const exceptions = [

      ...validateDiscounts(order),

      ...validateShippingDates(order),

      ...validateTotalConsistency(order)

    ];

    for (const exception of exceptions) {

      order.addException(exception);

    }

  }

}