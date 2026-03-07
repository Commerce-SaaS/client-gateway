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
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

export const ApiReactivateMe = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Restore deactivated user account',
      description:
        'Restores a previously deactivated (soft deleted) user account. Requires valid email and password.',
    }),

    ApiBody({
      type: LoginDto,
    }),
    ApiResponse({
      status: 200,
      description: 'User restored successfully and logged in',
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
      description: 'User is already active',
      schema: {
        example: {
          statusCode: 400,
          message: 'User with email: user@email.com is already active',
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
      description: 'User not found',
      schema: {
        example: {
          statusCode: 404,
          message: 'User not found',
          error: 'Not Found',
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
