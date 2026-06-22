import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiHeader,
  ApiBearerAuth,
  ApiConflictResponse,
} from '@nestjs/swagger';

export const ApiCreatePaymentMethodResponse = <TModel extends Type<any>>(
  model: TModel,
) =>
  applyDecorators(
    ApiBearerAuth('jwt'),
    ApiBody({ type: model }),
    ApiOperation({ summary: 'Create a new payment method' }),
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
      status: 201,
      description: 'Payment method created successfully',
      schema: {
        example: {
          id: 'fe63ca54-fe64-4e46-a57e-2894374c1ee5',
          organizationId: '11111111-2222-3333-4444-555555555555',
          name: 'Ticket Restaurant',
          description: 'Pago mediante ticket restaurant',
          isActive: true,
          isDefault: false,
          isSystem: false,
          sortOrder: 0,
          deletedAt: null,
          createdAt: '2026-06-10T10:00:00.000Z',
          updatedAt: '2026-06-10T10:00:00.000Z',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error',
      schema: {
        example: {
          message: [
            'name must be a string',
            'name must be longer than 1 characters',
          ],
          statusCode: 400,
          error: 'Bad Request',
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
      description: 'Forbidden',
      schema: {
        example: { message: 'Forbidden', statusCode: 403, error: 'Forbidden' },
      },
    }),
    ApiConflictResponse({
      description: 'Payment method already exists',
      schema: {
        example: { message: 'Duplicate', statusCode: 409, error: 'Conflict' },
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
