import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiNotFoundResponse,
  ApiHeader,
} from '@nestjs/swagger';
import { UserResponseDto } from 'src/auth-ms/shared/dto/user-response.dto';

export const ApiGetCustomer = () =>
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
      summary: 'Get customer profile',
      description: 'Retrieve the profile information of the customer.',
    }),

    ApiResponse({
      status: 200,
      description: 'Customer profile retrieved successfully',
      type: UserResponseDto,
    }),

    ApiUnauthorizedResponse({
      description: 'Invalid or missing token',
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
