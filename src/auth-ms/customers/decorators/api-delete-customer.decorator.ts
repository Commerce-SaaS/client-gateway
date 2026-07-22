import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiNotFoundResponse,
  ApiHeader,
} from '@nestjs/swagger';

export const ApiDeleteCustomer = () =>
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
      summary: 'Delete customer account',
      description: "Deletes customer account. The account can't be restored.",
    }),

    ApiResponse({
      status: 200,
      description: 'Customer account deleted successfully',
      schema: {
        example: {
          message:
            'Customer with id: 53b239f7-da57-4b81-ae45-6622d7a2b862 was deleted',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Invalid or expired token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid or expired token',
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
