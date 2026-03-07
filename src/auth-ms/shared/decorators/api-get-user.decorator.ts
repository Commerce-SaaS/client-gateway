import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { UserResponseDto } from '../dto/user-response.dto';

export const ApiGetMe = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiOperation({
      summary: 'Get current user profile',
      description:
        'Retrieve the profile information of the authenticated user.',
    }),

    ApiResponse({
      status: 201,
      description: 'User profile retrieved successfully',
      type: UserResponseDto,
    }),

    ApiUnauthorizedResponse({
      description: 'Invalid or missing token',
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
