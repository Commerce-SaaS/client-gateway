import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

export const ApiLogoutUser = () => {
  return applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({
      summary: 'Logout user',
      description: 'Invalidate the user session and tokens.',
    }),
    ApiResponse({
      status: 201,
      description: 'User logged out successfully.',
      schema: {
        example: {
          message: 'Session logged out successfully',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid or missing token.',
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
};
