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
      summary: 'Register a new user',
      description: 'Registers a user with email, password, and name.',
    }),
    ApiBody({
      description: 'User registration data',
      type: RegisterCustomerDto,
      schema: {
        example: {
          email: 'user@example.com',
          password: 'StrongPassword123!',
          name: 'John Doe',
          organizationId: '34f62db9-8d4d-4d1d-af8b-51afb0a4dcc2'
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'User registered successfully.',
      schema: {
        example: {
          user: {
            id: '3ce207fb-0b94-4316-aeef-dca14d36faee',
            email: 'user@example.com',
            name: 'John Doe',
            createdAt: '2026-01-27T16:29:09.217Z',
          },
          tokens: {
            accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
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
