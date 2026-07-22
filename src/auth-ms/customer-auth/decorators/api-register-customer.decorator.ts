import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { RegisterCustomerDto } from '../dto/register-customer.dto';


export const ApiRegisterCustomer = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Register a new customer',
      description:
        'Registers a tenant-scoped customer account. The customer is linked to a specific organization (tenant). Web clients receive tokens as httpOnly cookies; mobile clients receive them in the response body.',
    }),
    ApiBody({
      type: RegisterCustomerDto,
    }),
    ApiResponse({
      status: 201,
      description: 'Customer registered successfully. Mobile clients receive tokens in body; web clients receive httpOnly cookies.',
      schema: {
        example: {
          user: {
            id: '3ce207fb-0b94-4316-aeef-dca14d36faee',
            email: 'customer@example.com',
            name: 'John Doe',
            createdAt: '2026-01-27T16:29:09.217Z',
          },
          tokens: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (mobile only)',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (mobile only)',
          },
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error: Some fields do not meet the requirements.',
      schema: {
        example: {
          statusCode: 400,
          message: [
            'email must be an email',
            'password must be stronger',
            'name should not be empty',
          ],
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
