import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiResponse,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';

export const ApiReactivateCustomer = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),
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
    ApiOperation({
      summary: 'Restore deactivated customer account',
      description:
        'Restores a previously deactivated (soft deleted) customer account.',
    }),
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
      description: 'Customer restored successfully.',
      schema: {
        example: {
          statusCode: 200,
          message: 'Customer restored successfully.',
          error: 'Bad Request',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Customer is already active',
      schema: {
        example: {
          statusCode: 400,
          message: 'Customer with email: customer@email.com is already active',
          error: 'Bad Request',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized',
        },
      },
    }),

    ApiNotFoundResponse({
      description: 'Customer not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'Customer with id=uuid not found in the database.',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error',
      schema: {
        example: {
          statusCode: 500,
          message: 'Check server logs',
          error: 'Internal Server Error',
        },
      },
    }),
  );
