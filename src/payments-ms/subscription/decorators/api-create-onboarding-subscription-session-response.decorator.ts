import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export const ApiCreateOnboardingSubscriptionSessionResponse = <
  TModel extends Type<any>,
>(
  model: TModel,
) =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiBody({ type: model }),
    ApiOperation({ summary: 'Create onboarding subscription checkout session' }),
    ApiOkResponse({
      description: 'Checkout session created successfully',
      schema: {
        example: {
          paymentId: '6b3f3f63-7d89-4f8e-a2d7-bde248f32b9f',
          checkoutUrl: 'https://checkout.stripe.com/c/pay/cs_test_123',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: ['invalid field'],
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid authentication token',
      schema: {
        example: {
          message: 'Token not found',
          error: 'Unauthorized',
          statusCode: 401,
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Forbidden',
      schema: {
        example: {
          message:
            'You must complete onboarding subscription payment before creating an organization',
          error: 'Forbidden',
          statusCode: 403,
        },
      },
    }),
    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          message: 'Check server logs',
          statusCode: 500,
          error: 'Internal Server Error',
        },
      },
    }),
  );