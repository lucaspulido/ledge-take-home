import {

  NormalizationService

}
from '../../../src/domain/services/normalization.service';

import { Order }
from '../../../src/domain/models/order';

import { OrderLine }
from '../../../src/domain/models/order-line';

describe('NormalizationService', ()=>{

  const service=
    new NormalizationService();

  it('should normalize customerId', ()=>{

    const order=
      new Order({

        customerId:'  alfki  ',

        freight:0,

        totalAmount:0


      });

    const normalized=
      service.normalizeOrder(
        order
      );

    expect(
      normalized.customerId
    ).toBe('ALFKI');

  });

  it('should normalize money precision', ()=>{

    const order=
        new Order({

        customerId:'ALFKI',

        freight:10.12345,

        totalAmount:100.99999

        });

    const normalized=
        service.normalizeOrder(
        order
        );

    expect(
        normalized.freight
    ).toBe(10.12);

    expect(
        normalized.totalAmount
    ).toBe(101);

    });

  it('should normalize line values', ()=>{

    const order=
      new Order({

        customerId:'ALFKI',

        freight:0,

        totalAmount:0

      });

    order.lines=[

      new OrderLine({

        unitPrice:10.9999,

        discountRate:0.123456,

        lineTotal:50.9999

      })

    ];

    const normalized=
      service.normalizeOrder(
        order
      );

    const line=
      normalized.lines[0];

    expect(line.unitPrice)
      .toBe(11);

    expect(line.discountRate)
      .toBe(0.1235);

    expect(line.lineTotal)
      .toBe(51);

  });

});