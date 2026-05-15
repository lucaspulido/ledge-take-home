import {

  validateTotalConsistency

}
from '../../../src/domain/rules/total-consistency.rule';

import { Order }
from '../../../src/domain/models/order';

import { OrderLine }
from '../../../src/domain/models/order-line';

describe('total-consistency.rule', ()=>{

  it('should validate matching totals', ()=>{

    const order=
      new Order({

        northwindId:1,

        freight:10,

        totalAmount:110

      });

    order.lines=[

      new OrderLine({

        quantity:1,

        unitPrice:100,

        discountRate:0,

        lineTotal:100

      })

    ];

    const exceptions=
      validateTotalConsistency(
        order
      );

    expect(exceptions)
      .toHaveLength(0);

  });

  it('should detect total mismatch', ()=>{

    const order=
      new Order({

        northwindId:1,

        freight:10,

        totalAmount:999

      });

    order.lines=[

      new OrderLine({

        quantity:1,

        unitPrice:100,

        discountRate:0,

        lineTotal:100

      })

    ];

    const exceptions=
      validateTotalConsistency(
        order
      );

    expect(exceptions)
      .toHaveLength(1);

  });

});