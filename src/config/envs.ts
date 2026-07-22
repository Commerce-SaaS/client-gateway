import { z } from 'zod';
import 'dotenv/config';

const envSchema = z
  .object({
    PORT: z.coerce.number().default(4000),
    JWT_SECRET_ACCESS: z.string(),
    RABBITMQ_URL: z
      .string()
      .url()
      .refine((val) => val.startsWith('amqp://'), {
        message: 'RABBITMQ_URL must be a valid amqp:// URL',
      }),
    STRIPE_WEBHOOK_SECRET: z.string(),
    STRIPE_CONNECT_WEBHOOK_SECRET: z.string(),
    STRIPE_SECRET: z.string(),
    RABBITMQ_QUEUE: z.string().min(1, 'RABBITMQ_QUEUE cannot be empty'),
    RABBITMQ_QUEUE_EVENTS_PAYMENTS: z
      .string()
      .min(1, 'RABBITMQ_QUEUE_EVENTS_PAYMENTS cannot be empty'),
    RMQ_EVENTS_QUEUE_ORGANIZATION: z
      .string()
      .min(1, 'RMQ_EVENTS_QUEUE_ORGANIZATION cannot be empty'),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.coerce.number().default(6379),
    REDIS_PASS: z.string(),
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
  rabbitmqPaymentEventQueue: parsedEnv.data.RABBITMQ_QUEUE_EVENTS_PAYMENTS,
  rabbitmqOrganizationEventQueue: parsedEnv.data.RMQ_EVENTS_QUEUE_ORGANIZATION,
  stripeWebhookSecret: parsedEnv.data.STRIPE_WEBHOOK_SECRET,
  stripeConnectWebhookSecret: parsedEnv.data.STRIPE_CONNECT_WEBHOOK_SECRET,
  stripeSecret: parsedEnv.data.STRIPE_SECRET,
  redisHost: parsedEnv.data.REDIS_HOST,
  redisPort: parsedEnv.data.REDIS_PORT,
  redisPass: parsedEnv.data.REDIS_PASS
};
