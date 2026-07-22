import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const ApiRefreshToken = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Refresh access token',
      description: 'Generate a new access token using a valid refresh token.',
    }),
    ApiBody({
      description: 'Refresh token payload',
      schema: {
        example: {
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    }),
    ApiResponse({
      status: 201,
      schema: {
        example: {
          accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          refreshToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Validation error: Missing or invalid refresh token.',
      schema: {
        example: {
          statusCode: 400,
          message: ['refreshToken should not be empty'],
          error: 'Bad Request',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid or expired refresh token.',
      schema: {
        example: {
          statusCode: 401,
          message: 'Refresh token is invalid or expired',
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
