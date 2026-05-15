import {

  validateDiscounts

}
from '../../../src/domain/rules/discount.rule';

import { Order }
from '../../../src/domain/models/order';

import { OrderLine }
from '../../../src/domain/models/order-line';

describe('discount.rule', ()=>{

  it('should accept valid discounts', ()=>{

    const order=
      new Order({

        northwindId:1

      });

    order.lines=[

      new OrderLine({

        discountRate:0.2

      })

    ];

    const exceptions=
      validateDiscounts(order);

    expect(exceptions)
      .toHaveLength(0);

  });

  it('should reject invalid discounts', ()=>{

    const order=
      new Order({

        northwindId:1

      });

    order.lines=[

      new OrderLine({

        productId:1,

        discountRate:2

      })

    ];

    const exceptions=
      validateDiscounts(order);

    expect(exceptions)
      .toHaveLength(1);

  });

});