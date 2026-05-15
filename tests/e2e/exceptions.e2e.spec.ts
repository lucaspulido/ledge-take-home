import request
from 'supertest';

import app
from '../../src/server';

describe(
  'Exceptions API',
  ()=>{

    it(
      'should return 200',
      async ()=>{

        const response=
          await request(app)
          .get('/api/exceptions')
          .set(
            'X-API-KEY',
            process.env.API_KEY ||
            'ledge-local-development-key'
          );

        expect(
          response.status
        ).toBe(200);

        expect(
          Array.isArray(
            response.body
          )
        ).toBe(true);

      }
    );

  }
);