import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateCustomerDto } from '../dto/create-customer.dto';

export const ApiRegisterCustomer = () => {
  return applyDecorators(
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
      summary: 'Create a new customer',
      description:
        'Create a tenant-scoped customer account. The customer is linked to a specific organization (tenant).',
    }),
    ApiBody({
      type: CreateCustomerDto,
    }),
    ApiResponse({
      status: 201,
      description: 'Customer registered successfully.',
      schema: {
        example: {
          customer: {
            id: '3ce207fb-0b94-4316-aeef-dca14d36faee',
            email: 'customer@example.com',
            name: 'John Doe',
            createdAt: '2026-01-27T16:29:09.217Z',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description:
        'Validation error: Some fields do not meet the requirements.',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email', 'name should not be empty'],
          error: 'Bad Request',
        },
      },
    }),
    ApiConflictResponse({
      description: 'Conflict: Email already exists.',
      schema: {
        example: {
          statusCode: 409,
          message: 'Email (user@example.com) already exists.',
          error: 'Conflict',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized: Invalid credentials or token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid credentials',
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
};
