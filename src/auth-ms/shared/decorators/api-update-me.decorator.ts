import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiUnauthorizedResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
} from '@nestjs/swagger';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserResponseDto } from '../dto/user-response.dto';

export const ApiUpdateMe = () =>
  applyDecorators(
    ApiBearerAuth('jwt'),

    ApiOperation({
      summary: 'Update current user profile',
      description: 'Update the profile information of the authenticated user.',
    }),

    ApiBody({
      type: UpdateUserDto,
      description: 'User fields to update',
    }),

    ApiOkResponse({
      description: 'User profile updated successfully',
      type: UserResponseDto,
    }),

    ApiBadRequestResponse({
      description: 'Invalid input data',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
        },
      },
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
