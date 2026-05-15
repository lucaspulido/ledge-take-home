import {

  createPipeline

}
from '../../src/ingestion/bootstrap/create-pipeline';

import { prisma }
from '../../src/persistence/prisma/prisma-client';

describe('Pipeline Integration', ()=>{

  beforeAll(async ()=>{

    await prisma.processingException
      .deleteMany();

    await prisma.orderLine
      .deleteMany();

    await prisma.order
      .deleteMany();

    await prisma.pipelineRun
      .deleteMany();

  });

  afterAll(async ()=>{

    await prisma.$disconnect();

  });

  it(

    'should persist orders',

    async ()=>{

      const pipeline=
        createPipeline();

      await pipeline.run();

      const count=
        await prisma.order.count();

      expect(count)
        .toBeGreaterThan(0);

    },

    300000

  );

  it(

    'should be idempotent',

    async ()=>{

      const before=
        await prisma.order.count();

      const pipeline=
        createPipeline();

      await pipeline.run();

      const after=
        await prisma.order.count();

      expect(after)
        .toBe(before);

    },

    300000

  );

});