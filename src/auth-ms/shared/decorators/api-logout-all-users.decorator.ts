import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiHeader,
} from '@nestjs/swagger';

export const ApiLogoutAllUsers = () => {
  return applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({
      summary: 'Logout from all sessions',
      description: 'Invalidate all sessions and tokens for the current user.',
    }),
    ApiBearerAuth(),
    ApiResponse({
      status: 201,
      description: 'All user sessions logged out successfully.',
      schema: {
        example: {
          message: 'All sessions logged out successfully',
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
