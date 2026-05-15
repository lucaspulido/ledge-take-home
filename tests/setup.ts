import { prisma }
from '../src/persistence/prisma/prisma-client';

afterAll(
  async ()=>{

    await prisma.$disconnect();

  },
  30000
);