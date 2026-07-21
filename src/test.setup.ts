// Minimal env-var stubs required so that config/envs.ts does not throw
// during module loading in unit tests. No real services are needed.
process.env.JWT_SECRET_ACCESS = 'test-jwt-secret';
process.env.RABBITMQ_URL = 'amqp://localhost:5672';
process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
process.env.STRIPE_CONNECT_WEBHOOK_SECRET = 'whsec_connect_test';
process.env.STRIPE_SECRET = 'sk_test_placeholder';
process.env.RABBITMQ_QUEUE = 'test-queue';
process.env.RABBITMQ_QUEUE_EVENTS_PAYMENTS = 'test-payments-events';
process.env.RMQ_EVENTS_QUEUE_ORGANIZATION = 'test-org-events';
process.env.REDIS_HOST = '127.0.0.1';
process.env.REDIS_PASS = 'test-redis-pass';
