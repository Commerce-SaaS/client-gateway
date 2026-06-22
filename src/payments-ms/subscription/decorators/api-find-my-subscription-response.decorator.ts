import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCookieAuth,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiFindMySubscriptionResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiCookieAuth('accessToken'),
    ApiOperation({ summary: 'Get current staff subscription' }),
    ApiResponse({
      status: 200,
      description: 'Subscription retrieved successfully',
      schema: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          plan: { type: 'string', example: 'BASIC' },
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
      description: 'Validation error',
      schema: {
        example: {
          message: 'Invalid request',
          statusCode: 400,
          error: 'Bad Request',
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
