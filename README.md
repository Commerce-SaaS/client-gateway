# 🌐 Client Gateway

> NestJS API Gateway responsible for exposing the public HTTP API of the Commerce App Launcher platform and orchestrating communication between frontend clients and backend microservices through RabbitMQ.

---

# 📌 Purpose

`client-gateway` is the **single HTTP entry point** for the platform.

It receives requests from:

- 🏢 SaaS dashboard users
- 👤 End customers
- 🛒 Storefront clients

The gateway is responsible for:

- HTTP request handling
- Authentication and authorization
- Tenant resolution
- Request validation
- Rate limiting
- API documentation
- Stripe webhook processing
- Communication with backend microservices

Backend services are accessed exclusively through **RabbitMQ RPC messaging**.

---

# ✨ Main Responsibilities

## Authentication

- JWT validation
- Session validation
- Role-based authorization
- Organization membership validation
- SaaS/customer audience separation

## Multi-Tenancy

- Resolve organization from domain
- Resolve organization from headers
- Cache tenant information using Redis

## API Gateway

- Aggregate microservice responses
- Transform external API requests into internal messages
- Handle errors from downstream services

## Payments

- Stripe API integration
- Stripe Checkout
- Stripe Connect
- Webhook signature verification

---

# 🏗️ Architecture

```
                         Clients
                            │
                            │ HTTP / REST
                            ▼

              ┌─────────────────────────┐
              │     Client Gateway      │
              │                         │
              │       NestJS API        │
              │                         │
              └──────────┬──────────────┘
                         │
                         │ RabbitMQ RPC
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼

    auth-ms       products-ms       orders-ms

        │                │                │

        ▼                ▼                ▼

 organization-ms   payments-ms     media-ms
```

---

# 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| NestJS 11 | API framework |
| TypeScript 5.7 | Programming language |
| RabbitMQ | Microservice communication |
| `@nestjs/microservices` | RMQ transport |
| PostgreSQL | Managed by downstream services |
| Redis | Tenant/session cache |
| JWT | Authentication |
| Stripe SDK | Payments |
| Helmet | Security headers |
| Throttler | Rate limiting |
| Swagger | API documentation |
| Zod | Environment validation |
| Jest + Supertest | Testing |

---

# 📦 Installation

```bash
npm install
```

Create environment file:

```bash
cp .env.example .env
```

Fill required values before running.

---

# ▶️ Running Locally

## Development

```bash
npm run start:dev
```

## Debug

```bash
npm run start:debug
```

## Production

```bash
npm run build

npm run start:prod
```

---

# 🐳 Docker

Two Dockerfiles are available.

---

## Development image

File:

```
dockerfile
```

Features:

```
node base image
npm install
EXPOSE 4000
```

No CMD is defined.

The container command is expected to be provided externally.

---

## Production image

File:

```
dockerfile.prod
```

Features:

✅ Multi-stage build  
✅ Production dependencies only  
✅ Non-root Node user  
✅ Optimized image  

Runs:

```dockerfile
CMD ["node", "dist/main.js"]
```

Build:

```bash
docker build -f dockerfile.prod -t client-gateway .
```

Run:

```bash
docker run -p 4000:4000 client-gateway
```

---

# 🌐 HTTP API

Unlike the internal microservices, the gateway exposes an HTTP API.

Application bootstrap:

```
src/main.ts
```

HTTP server:

```
Express + NestJS
```

Default port:

```env
PORT=4000
```

---

# 🧪 Testing

Available scripts:

```bash
npm run test
```

```bash
npm run test:watch
```

```bash
npm run test:cov
```

```bash
npm run test:debug
```

```bash
npm run test:e2e
```

---

## Current status

Unit tests exist:

```
src/**/*.spec.ts
```

E2E tests:

```
❌ No test directory
❌ No jest-e2e.json
```

`npm run test:e2e` currently requires missing configuration.

---

# 🔐 Environment Variables

Validated with:

```
src/config/envs.ts
```

The application will fail during startup if required variables are missing.

| Variable | Required | Description |
|---|---|---|
| `PORT` | ❌ | HTTP server port |
| `JWT_SECRET_ACCESS` | ✅ | JWT verification secret |
| `RABBITMQ_URL` | ✅ | RabbitMQ connection |
| `RABBITMQ_QUEUE` | ⚠️ | Declared but unused |
| `RABBITMQ_QUEUE_EVENTS_PAYMENTS` | ✅ | Payment events queue |
| `RMQ_EVENTS_QUEUE_ORGANIZATION` | ✅ | Organization events queue |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Platform webhook secret |
| `STRIPE_CONNECT_WEBHOOK_SECRET` | ✅ | Connect webhook secret |
| `STRIPE_SECRET` | ✅ | Stripe API key |
| `REDIS_HOST` | ✅ | Redis hostname |
| `REDIS_PORT` | ❌ | Redis port |
| `REDIS_PASS` | ✅ | Redis password |

---

# Example `.env`

```env
PORT=4000

JWT_SECRET_ACCESS=my-secret

RABBITMQ_URL=amqp://localhost:5672

RABBITMQ_QUEUE=client_gateway_queue

RABBITMQ_QUEUE_EVENTS_PAYMENTS=payments_events

RMQ_EVENTS_QUEUE_ORGANIZATION=organization_events

STRIPE_SECRET=sk_test_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_xxxxx

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=password
```

---

# 🐇 RabbitMQ Communication

The gateway communicates with backend services using:

```
Transport.RMQ
```

All services are accessed through:

```
ClientProxy
```

No direct HTTP communication exists between services.

---

# 🔌 Connected Microservices

Defined in:

```
src/config/services.ts
```

| Client Token | Service |
|---|---|
| `AUTH_SERVICE` | auth-ms |
| `ORGANIZATION_SERVICE` | organization-ms |
| `PRODUCTS_SERVICE` | products-ms |
| `ORDERS_SERVICE` | orders-ms |
| `PAYMENT_SERVICE` | payments-ms |
| `MEDIA_SERVICE` | media-ms |
