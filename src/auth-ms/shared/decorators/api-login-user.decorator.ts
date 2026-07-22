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
        'Authenticate user with email and password. Web clients receive tokens as httpOnly cookies; mobile clients receive them in the response body.',
    }),
    ApiBody({
      type: LoginDto,
    }),
    ApiResponse({
      status: 201,
      description: 'Login successful. Mobile clients receive tokens in body; web clients receive httpOnly cookies.',
      schema: {
        example: {
          user: {
            id: '3ce207fb-0b94-4316-aeef-dca14d36faee',
            email: 'user@example.com',
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
