import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ResetPasswordDto } from '../dto/reset-password.dto';

export const ApiResetPassword = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Reset user password',
      description:
        'Resets the user password using a valid password reset token.',
    }),

    ApiBody({
      type: ResetPasswordDto,
    }),

    ApiResponse({
      status: 201,
      schema: {
        example: {
          message: 'Password reset successfully',
        },
      },
    }),
    ApiBadRequestResponse({
      description: 'Invalid input data',
      schema: {
        example: {
          statusCode: 400,
          message: ['password must be at least 8 characters long'],
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
