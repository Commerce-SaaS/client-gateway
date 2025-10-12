import { z } from 'zod';
import 'dotenv/config';

const envSchema = z
  .object({
    PORT: z.coerce.number().default(3000),
    JWT_SECRET_ACCESS: z.string(),
    RABBITMQ_URL: z
      .string()
      .url()
      .refine((val) => val.startsWith('amqp://'), {
        message: 'RABBITMQ_URL must be a valid amqp:// URL',
      }),

    RABBITMQ_QUEUE: z.string().min(1, 'RABBITMQ_QUEUE cannot be empty'),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number().default(6379),
  })
  .required();

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:',
    parsedEnv.error.flatten().fieldErrors,
  );
  throw new Error('Invalid environment variables');
}

export const envs = {
  port: parsedEnv.data.PORT,
  accessTokensecret: parsedEnv.data.JWT_SECRET_ACCESS,
  rabbitmqUrl: parsedEnv.data.RABBITMQ_URL,
  rabbitmqQueue: parsedEnv.data.RABBITMQ_QUEUE,
  redisHost: parsedEnv.data.REDIS_HOST,
  redisPort: parsedEnv.data.REDIS_PORT,
};
