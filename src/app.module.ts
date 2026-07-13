import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RabbitMQModule } from './transports/rabbitmq.module';
import { AUTH_SERVICE, envs } from './config';
import { RedisModule } from './redis/redis.module';
import {
  MEDIA_SERVICE,
  ORDERS_SERVICE,
  ORGANIZATION_EVENTS_CLIENT,
  ORGANIZATION_SERVICE,
  PAYMENT_SERVICE,
  PAYMENTS_EVENTS_CLIENT,
  PRODUCTS_SERVICE,
} from './config/services';
import { SubscriptionModule } from './payments-ms/subscription/subscription.module';
import { PaymentModule } from './payments-ms/payment/payment.module';
import { WebhooksModule } from './payments-ms/webhooks/webhooks.module';
import { OrganizationModule } from './organization-ms/organization/organization.module';
import { UserOrganizationModule } from './organization-ms/user_organization/user_organization.module';
import { MediaModule } from './media-ms/media/media.module';
import { OrganizationDomainsModule } from './organization-ms/organization_domains/organization_domains.module';
import { TagsModule } from './product-ms/tags/tags.module';
import { ExtrasModule } from './product-ms/extras/extras.module';
import { IngredientsModule } from './product-ms/ingredients/ingredients.module';
import { CategoriesModule } from './product-ms/categories/categories.module';
import { ProductsModule } from './product-ms/products/products.module';
import { OrdersModule } from './orders-ms/orders/orders.module';
import { TablesModule } from './orders-ms/tables/tables.module';
import { SectorsModule } from './orders-ms/sectors/sectors.module';
import { SaaSUserModule } from './auth-ms/saas-auth/saas-user.module';
import { CustomerModule } from './auth-ms/customer-auth/customer.module';
import { TenantMiddleware } from './common/middleware/tenant.middleware';
import { StripeModule } from './payments-ms/stripe-connect/stripe.module';
import { CustomersModule } from './auth-ms/customers/customers.module';
import { PaymentMethodsModule } from './payments-ms/payment-methods/payment-methods.module';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    ProductsModule,
    CategoriesModule,
    IngredientsModule,
    ExtrasModule,
    TagsModule,
    SaaSUserModule,
    CustomerModule,
    MediaModule,
    RabbitMQModule.register({
      name: AUTH_SERVICE,
      queue: 'auth_queue',
      url: envs.rabbitmqUrl,
    }),
    RabbitMQModule.register({
      name: ORGANIZATION_SERVICE,
      queue: 'organization_queue',
      url: envs.rabbitmqUrl,
    }),
    RabbitMQModule.register({
      name: ORGANIZATION_EVENTS_CLIENT,
      queue: envs.rabbitmqOrganizationEventQueue,
      url: envs.rabbitmqUrl,
    }),
    RabbitMQModule.register({
      name: ORDERS_SERVICE,
      queue: 'orders_queue',
      url: envs.rabbitmqUrl,
    }),
    RabbitMQModule.register({
      name: PRODUCTS_SERVICE,
      queue: 'products_queue',
      url: envs.rabbitmqUrl,
    }),
    RabbitMQModule.register({
      name: MEDIA_SERVICE,
      queue: 'media_queue',
      url: envs.rabbitmqUrl,
    }),
    RabbitMQModule.register({
      name: PAYMENT_SERVICE,
      queue: 'payments_queue',
      url: envs.rabbitmqUrl,
    }),
    RabbitMQModule.register({
      name: PAYMENTS_EVENTS_CLIENT,
      queue: envs.rabbitmqPaymentEventQueue,
      url: envs.rabbitmqUrl,
    }),
    RedisModule,
    OrganizationModule,
    UserOrganizationModule,
    OrganizationDomainsModule,
    SubscriptionModule,
    PaymentModule,
    WebhooksModule,
    OrdersModule,
    TablesModule,
    SectorsModule,
    StripeModule,
    CustomersModule,
    PaymentMethodsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard },]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(TenantMiddleware).forRoutes('*');
  }
}
