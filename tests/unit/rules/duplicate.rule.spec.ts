import {

  generateFingerprint,

  checkPossibleDuplicate

}
from '../../../src/domain/rules/duplicate.rule';

import { Order }
from '../../../src/domain/models/order';

describe('duplicate.rule', ()=>{

  describe('generateFingerprint', ()=>{

    it('should generate deterministic fingerprint', ()=>{

      const order=
        new Order({

          customerId:'ALFKI',

          orderDate:
            new Date('2024-01-01'),

          totalAmount:100,

          freight:10

        });

      const fp1=
        generateFingerprint(order);

      const fp2=
        generateFingerprint(order);

      expect(fp1)
        .toBe(fp2);

    });

  });

  describe('checkPossibleDuplicate', ()=>{

    it('should detect possible duplicate', ()=>{

      const order=
        new Order({

          customerId:'ALFKI',

          orderDate:
            new Date('2024-01-01'),

          totalAmount:100,

          freight:10

        });

      const result=
        checkPossibleDuplicate(

          order,

          [

            {

              customerId:'ALFKI',

              orderDate:
                new Date('2024-01-03'),

              totalAmount:100,

              fingerprint:'abc'

            }

          ]

        );

      expect(result)
        .toBeDefined();

    });

    it('should return undefined when no match exists', ()=>{

      const order=
        new Order({

          customerId:'ALFKI',

          orderDate:
            new Date('2024-01-01'),

          totalAmount:100,

          freight:10

        });

      const result=
        checkPossibleDuplicate(

          order,

          [

            {

              customerId:'BONAP',

              orderDate:
                new Date('2024-02-01'),

              totalAmount:500,

              fingerprint:'xyz'

            }

          ]

        );

      expect(result)
        .toBeNull();

    });

  });

});