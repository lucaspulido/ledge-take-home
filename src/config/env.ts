import dotenv from 'dotenv';

import { z } from 'zod';

dotenv.config();

const envSchema = z.object({

  NODE_ENV: z.enum([
    'development',
    'test',
    'production'
  ]),

  PORT: z.coerce.number(),

  DATABASE_URL: z.string(),

  DOCKER_DATABASE_URL: z.string(),

  API_KEY: z.string(),

  LOG_LEVEL: z.enum([
    'debug',
    'info',
    'warn',
    'error'
  ])

});

export const env =
  envSchema.parse(process.env);