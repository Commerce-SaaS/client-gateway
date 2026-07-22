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
} from '@nestjs/swagger';

export const ApiSoftDeletePaymentMethodResponse = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiParam({
      name: 'id',
      description: 'Payment method ID',
      schema: {
        type: 'string',
        format: 'uuid',
        example: 'fe63ca54-fe64-4e46-a57e-2894374c1ee5',
      },
    }),
    ApiOperation({ summary: 'Soft delete a payment method' }),
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
      description: 'Payment method deleted successfully',
      schema: { example: { message: 'Payment method deleted successfully' } },
    }),
    ApiBadRequestResponse({
      description: 'System payment methods cannot be deleted',
      schema: {
        example: {
          message: 'System payment methods cannot be deleted',
          statusCode: 400,
          error: 'Bad Request',
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Payment method not found',
      schema: {
        example: { message: 'Payment method not found', statusCode: 404 },
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
      description: 'Payment method does not belong to this organization',
      schema: {
        example: {
          message: 'You do not have access to this payment method',
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
