import {

  DedupeService

}
from '../../../src/domain/services/dedupe.service';

import { Order }
from '../../../src/domain/models/order';

describe('DedupeService', ()=>{

  const mockRepository={

    findFingerprint:jest.fn(),

    findSimilarOrders:jest.fn()

  };

  const service=
    new DedupeService(
      mockRepository as any
    );

  beforeEach(()=>{

    jest.clearAllMocks();

  });

  it('should skip exact duplicates', async ()=>{

    const order=
      new Order({

        northwindId:1,

        customerId:'ALFKI',

        orderDate:
          new Date('2024-01-01'),

        freight:10,

        totalAmount:100

      });

    mockRepository
      .findFingerprint
      .mockResolvedValue(true);

    const result=
      await service.process(
        order
      );

    expect(result.skip)
      .toBe(true);

  });

  it('should continue processing non-duplicates', async ()=>{

    const order=
      new Order({

        northwindId:1,

        customerId:'ALFKI',

        orderDate:
          new Date('2024-01-01'),

        freight:10,

        totalAmount:100

      });

    mockRepository
      .findFingerprint
      .mockResolvedValue(false);

    mockRepository
      .findSimilarOrders
      .mockResolvedValue([]);

    const result=
      await service.process(
        order
      );

    expect(result.skip)
      .toBe(false);

  });

  it('should register possible duplicate exception', async ()=>{

    const order=
      new Order({

        northwindId:1,

        customerId:'ALFKI',

        orderDate:
          new Date('2024-01-01'),

        freight:10,

        totalAmount:100

      });

    mockRepository
      .findFingerprint
      .mockResolvedValue(false);

    mockRepository
      .findSimilarOrders
      .mockResolvedValue([

        {

          customerId:'ALFKI',

          orderDate:
            new Date('2024-01-02'),

          totalAmount:100,

          fingerprint:'abc123'

        }

      ]);

    const result=
      await service.process(
        order
      );

    expect(result.skip)
      .toBe(false);

    expect(
      order.exceptions.length
    ).toBe(1);

  });

});