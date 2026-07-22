import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { envs } from './config';
import { HttpExceptionFilter, RpcCustomExceptionFilter } from './common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import Redis from 'ioredis';
import { OrganizationDomainsService } from './organization-ms/organization_domains/organization_domains.service';
import { CustomerModule } from './auth-ms/customer-auth/customer.module';
import { ProductsModule } from './product-ms/products/products.module';
import { CategoriesModule } from './product-ms/categories/categories.module';
import { IngredientsModule } from './product-ms/ingredients/ingredients.module';
import { ExtrasModule } from './product-ms/extras/extras.module';
import { TagsModule } from './product-ms/tags/tags.module';
import { OrdersModule } from './orders-ms/orders/orders.module';
import { PaymentModule } from './payments-ms/payment/payment.module';
import { OrganizationDomainsModule } from './organization-ms/organization_domains/organization_domains.module';

const HTTP_METHODS = [
  'get',
  'post',
  'put',
  'patch',
  'delete',
  'head',
  'options',
  'trace',
];

async function bootstrap() {
  const logger = new Logger('Main-Gateway');
  const isDev = process.env.NODE_ENV !== 'production';
  logger.log('Starting Client Gateway...');

  const app = await NestFactory.create(AppModule, { rawBody: true });
  app.use(helmet({ contentSecurityPolicy: false })); // ← M-1

  const redis = app.get<Redis>('REDIS_CLIENT');
  const orgDomainsService = app.get(OrganizationDomainsService);

  app.enableCors({
    origin: async (origin: string, callback: Function) => {
      if (!origin) return callback(null, true);

      if (
        isDev &&
        (origin.includes('localhost') || origin.includes('127.0.0.1'))
      ) {
        return callback(null, true);
      }

      try {
        const hostname = new URL(origin).hostname.toLowerCase();

        const cacheKey = `tenant:domain:${hostname}`;
        const cached = await redis.get(cacheKey);
        if (cached) return callback(null, true);

        const result = await orgDomainsService.findOne(hostname);
        if (result?.organizationId) {
          await redis.set(cacheKey, result.organizationId, 'EX', 300);
          return callback(null, true);
        }

        callback(new Error(`Origin ${origin} not allowed by CORS`));
      } catch {
        callback(new Error('CORS validation failed'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'x-organization-id',
      'x-frontend-origin',
      'x-client-type',
    ],
  });

  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalFilters(new RpcCustomExceptionFilter(), new HttpExceptionFilter());

  // ─── Dashboard API (/api/docs) ───────────────────────────────────────────────
  const dashboardConfig = new DocumentBuilder()
    .setTitle('Commerce API — Dashboard')
    .setDescription('Internal API for organization management.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter your access token (mobile clients)',
      },
      'jwt',
    )
    .addCookieAuth('accessToken', {
      type: 'apiKey',
      in: 'cookie',
      description: 'Access token cookie (web clients)',
    })
    .build();

  SwaggerModule.setup(
    'api/docs',
    app,
    () => SwaggerModule.createDocument(app, dashboardConfig),
    {
      swaggerOptions: {
        withCredentials: true,
        tagsSorter: 'alpha',
        operationsSorter: 'method',
      },
    },
  );

  // ─── Public / Storefront API (/api/public) ───────────────────────────────────
  const publicConfigBuilder = new DocumentBuilder()
    .setTitle('Commerce API — Storefront')
    .setDescription('Public API for connecting your storefront to Commerce.')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'customer-jwt',
    );

  if (process.env.API_URL) {
    publicConfigBuilder.addServer(process.env.API_URL);
  }

  const publicConfig = publicConfigBuilder.build();

  // Build the document scoped to modules that contain public endpoints.
  const publicDocument = SwaggerModule.createDocument(app, publicConfig, {
    include: [
      CustomerModule,
      ProductsModule,
      CategoriesModule,
      IngredientsModule,
      ExtrasModule,
      TagsModule,
      OrdersModule,
      PaymentModule,
      OrganizationDomainsModule,
    ],
  });

  // Allowlist: paths that are NOT under /customer/* but still belong to the
  // public API. The value is the subset of HTTP methods to expose.
  const publicPathAllowlist: Record<string, string[]> = {
    '/products': ['get'],
    '/products/{id}': ['get'],
    '/categories': ['get'],
    '/categories/{id}': ['get'],
    '/extras': ['get'],
    '/extras/{id}': ['get'],
    '/ingredients': ['get'],
    '/ingredients/{id}': ['get'],
    '/tags': ['get'],
    '/tags/{id}': ['get'],
    '/orders': ['post'],
    '/orders/me': ['get'],
    '/orders/me/{id}': ['get'],
    '/payments/create-session': ['post'],
    '/payments/me': ['get'],
    '/payments/me/{id}': ['get'],
    '/organization-domains/{domain}': ['get'],
  };

  const filteredPaths: Record<string, any> = {};

  for (const [path, pathItem] of Object.entries(publicDocument.paths ?? {})) {
    if (path.startsWith('/customer')) {
      // All customer auth routes are public
      filteredPaths[path] = pathItem;
      continue;
    }

    if (!publicPathAllowlist[path]) continue;

    // Preserve path-level properties (e.g. `parameters`, `summary`) and only
    // include the explicitly allowed HTTP method operations.
    const allowed = publicPathAllowlist[path];
    const filteredItem: Record<string, any> = {};

    for (const [key, value] of Object.entries(
      pathItem as Record<string, any>,
    )) {
      if (!HTTP_METHODS.includes(key)) {
        filteredItem[key] = value;
      }
    }

    for (const method of allowed) {
      if ((pathItem as any)[method]) {
        filteredItem[method] = (pathItem as any)[method];
      }
    }

    const hasOperation = Object.keys(filteredItem).some((k) =>
      HTTP_METHODS.includes(k),
    );
    if (hasOperation) {
      filteredPaths[path] = filteredItem;
    }
  }

  publicDocument.paths = filteredPaths;

  SwaggerModule.setup('api/public', app, publicDocument, {
    swaggerOptions: {
      withCredentials: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  });

  await app.listen(envs.port);

  logger.log(`Client Gateway is running on port ${envs.port}`);
}
bootstrap();
