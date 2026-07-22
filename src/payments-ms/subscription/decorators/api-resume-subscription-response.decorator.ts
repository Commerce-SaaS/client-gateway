import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiResumeSubscriptionResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiCookieAuth('accessToken'),
    ApiOperation({
      summary: 'Undo a scheduled cancellation (resume the subscription)',
    }),
    ApiResponse({
      status: 200,
      description: 'Subscription resumed successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          plan: { type: 'string', enum: ['BASIC', 'PRO'], example: 'PRO' },
          status: { type: 'string', example: 'ACTIVE' },
          stripeSubscriptionId: { type: 'string', nullable: true },
          currentPeriodStart: { type: 'string', format: 'date-time', nullable: true },
          currentPeriodEnd: { type: 'string', format: 'date-time', nullable: true },
          cancelAtPeriodEnd: { type: 'boolean', example: false },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error (e.g. invalid subscription id)',
      schema: {
        example: {
          message: 'Validation failed (uuid is expected)',
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Subscription is already canceled and cannot be resumed',
      schema: {
        example: {
          code: 'SUBSCRIPTION_CANCELED',
          message: 'Cannot resume a canceled subscription; create a new one',
          statusCode: 403,
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Subscription not found',
      schema: {
        example: {
          message: 'Subscription not found',
          statusCode: 404,
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