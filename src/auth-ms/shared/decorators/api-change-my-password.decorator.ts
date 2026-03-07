import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ChangePasswordDto } from '../dto/change-password.dto';

export const ApiChangeMyPassword = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiOperation({
      summary: 'Change current user password',
      description:
        'Change the password of the authenticated user by providing the current password.',
    }),

    ApiBody({
      type: ChangePasswordDto,
      description: 'Current and new password',
    }),

   ApiResponse({
      status: 201,
      description: 'Password changed successfully',
      schema: {
        example: {
          message: 'Password updated successfully',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Invalid input data',
      schema: {
        example: {
          statusCode: 400,
          message: ['newPassword should not be empty'],
          error: 'Bad Request',
        },
      },
    }),

    ApiForbiddenResponse({
      description: 'Current password is incorrect',
      schema: {
        example: {
          statusCode: 403,
          message: 'Current password is incorrect',
          error: 'Forbidden',
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
