import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
} from '@nestjs/swagger';

export const ApiDeleteMe = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiOperation({
      summary: 'Delete current user account',
      description:
        "Deletes the authenticated user account. The account can't be restored later.",
    }),

   ApiResponse({
      status: 200,
      description: 'User account deleted successfully',
      schema: {
        example: {
          message: "User with id: 53b239f7-da57-4b81-ae45-6622d7a2b862 was deleted"
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'User already deleted or invalid state',
      schema: {
        example: {
          statusCode: 400,
          message: 'User already deleted',
          error: 'Bad Request',
        },
      },
    }),

    ApiUnauthorizedResponse({
      description: 'Invalid or expired token',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid or expired token',
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
