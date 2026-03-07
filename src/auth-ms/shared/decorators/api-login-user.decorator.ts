import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

export const ApiLoginUser = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'User login',
      description:
        'Authenticate user using email and password and receive access and refresh tokens.',
    }),
    ApiBody({
      description: 'Login credentials',
      type: LoginDto,
      schema: {
        example: {
          email: 'user@example.com',
          password: 'StrongPassword123!',
        },
      },
    }),
    ApiResponse({
      status: 201,
      description: 'Login successful, returns user info and tokens.',
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
      description: 'Validation error: Incorrect or missing fields.',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email', 'password should not be empty'],
          error: 'Bad Request',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid credentials',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid email or password',
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
