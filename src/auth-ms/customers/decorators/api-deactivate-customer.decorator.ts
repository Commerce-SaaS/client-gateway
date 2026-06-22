import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiHeader,
} from '@nestjs/swagger';

export const ApiDeactivateCustomer = () =>
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
      summary: 'Deactivate customer account',
      description:
        'Soft deletes (deactivates) customer account. The account can be restored later.',
    }),

   ApiResponse({
      status: 200,
      description: 'Customer account deactivated successfully',
      schema: {
        example: {
          message: "Customer with id: 53b239f7-da57-4b81-ae45-6622d7a2b862 was soft deleted"
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Customer already deactivated or invalid state',
      schema: {
        example: {
          statusCode: 400,
          message: 'Customer already deactivated',
          error: 'Bad Request',
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
