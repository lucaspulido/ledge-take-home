import {

  validateShippingDates

}
from '../../../src/domain/rules/shipping-date.rule';

import { Order }
from '../../../src/domain/models/order';

describe('shipping-date.rule', ()=>{

  it('should accept valid shipping dates', ()=>{

    const order=
      new Order({

        northwindId:1,

        orderDate:
          new Date('2024-01-01'),

        shippedDate:
          new Date('2024-01-05')

      });

    const exceptions=
      validateShippingDates(
        order
      );

    expect(exceptions)
      .toHaveLength(0);

  });

  it('should reject invalid shipping dates', ()=>{

    const order=
      new Order({

        northwindId:1,

        orderDate:
          new Date('2024-01-10'),

        shippedDate:
          new Date('2024-01-01')

      });

    const exceptions=
      validateShippingDates(
        order
      );

    expect(exceptions)
      .toHaveLength(1);

  });

});