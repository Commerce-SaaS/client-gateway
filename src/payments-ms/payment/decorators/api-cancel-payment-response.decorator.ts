import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { CancelPaymentDto } from '../dto/cancel-payment.dto';

export const ApiCancelPaymentResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiParam({
      name: 'id',
      description: 'Payment ID to cancel',
      schema: {
        type: 'string',
        format: 'uuid',
        example: 'fe63ca54-fe64-4e46-a57e-2894374c1ee5',
      },
    }),
    ApiBody({ type: CancelPaymentDto }),
    ApiOperation({ summary: 'Cancel a manual payment' }),
    ApiHeader({
      name: 'x-organization-id',
      required: true,
      description: 'Organization context ID',
      schema: {
        type: 'string',
        format: 'uuid',
        example: '11111111-2222-3333-4444-555555555555',
      },
    }),
    ApiResponse({
      status: 200,
      description: 'Payment cancelled successfully',
      schema: {
        example: {
          message: 'Payment cancelled successfully',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Payment cannot be cancelled',
      schema: {
        examples: {
          alreadyCancelled: {
            summary: 'Payment is already cancelled',
            value: {
              message: 'Payment is already cancelled',
              statusCode: 400,
              error: 'Bad Request',
            },
          },
          stripePayment: {
            summary: 'Stripe payments cannot be cancelled manually',
            value: {
              message: 'Stripe payments cannot be cancelled manually',
              statusCode: 400,
              error: 'Bad Request',
            },
          },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Payment not found',
      schema: {
        example: {
          message: 'Payment not found',
          statusCode: 404,
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
      schema: {
        example: {
          message: 'Unauthorized',
          statusCode: 401,
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description: 'Payment does not belong to this organization',
      schema: {
        example: {
          message: 'You do not have access to this payment',
          statusCode: 403,
          error: 'Forbidden',
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