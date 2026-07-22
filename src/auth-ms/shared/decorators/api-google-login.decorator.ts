import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { GoogleAuthDto } from '../dto/google-auth.dto';

export const ApiGoogleLogin = () => {
  return applyDecorators(
    ApiOperation({
      summary: 'Login with Google OAuth',
      description:
        'Authenticate using a Google OAuth ID token. For customer login, the tenant organizationId is resolved from the request context (header or domain). Web clients receive tokens as httpOnly cookies; mobile clients receive them in the response body.',
    }),
    ApiBody({
      type: GoogleAuthDto,
    }),

    ApiResponse({
      status: 201,
      description:
        'Authentication successful. Returns customer information and access tokens.',
      schema: {
        example: {
          user: {
            id: '3ce207fb-0b94-4316-aeef-dca14d36faee',
            email: 'user@gmail.com',
            name: 'John Doe',
            provider: 'google',
            createdAt: '2026-01-27T16:29:09.217Z',
          },
          tokens: {
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            refreshToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Validation error: Missing or malformed ID token.',
      schema: {
        example: {
          statusCode: 400,
          message: ['idToken should not be empty'],
          error: 'Bad Request',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Invalid or expired Google token.',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid Google authentication token',
          error: 'Unauthorized',
        },
      },
    }),

    ApiInternalServerErrorResponse({
      description: 'Internal server error.',
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