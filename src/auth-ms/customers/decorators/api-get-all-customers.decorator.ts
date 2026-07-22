import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
  ApiNotFoundResponse,
  ApiQuery,
  ApiHeader,
} from '@nestjs/swagger';
import { CustomersResponseDto } from '../dto/customersResponse.dto';

export const ApiGetAllCustomers = () =>
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
    // ----------- Query params -----------
    ApiQuery({
      name: 'offset',
      required: false,
      type: Number,
      description: 'Number of records to skip',
      example: 0,
    }),

    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      description: 'Maximum number of records to return',
      example: 10,
    }),

    ApiQuery({
      name: 'search',
      required: false,
      type: String,
      description: 'Free text search by email or name',
      example: 'John',
    }),

    ApiQuery({
      name: 'withDeleted',
      required: false,
      type: Boolean,
      description: 'Include soft-deleted customers',
      example: false,
    }),

    ApiOperation({
      summary: 'Get all customers profiles by organization',
      description: 'Retrieve the profile information of the customers.',
    }),

    ApiResponse({
      status: 200,
      description: 'Customers profile retrieved successfully',
      type: CustomersResponseDto,
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
