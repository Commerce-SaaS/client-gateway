import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiOkResponse,
  ApiBadRequestResponse,
  ApiInternalServerErrorResponse,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';

export const ApiForgotPassword = () =>
  applyDecorators(
    ApiOperation({
      summary: 'Request password reset',
      description:
        'Sends password reset instructions to the provided email if it exists in the system.',
    }),

    ApiBody({
      type: ForgotPasswordDto,
    }),
    ApiResponse({
      status: 201,
      schema: {
        example: {
          message: 'If the email exists, reset instructions were sent',
        },
      },
    }),

    ApiBadRequestResponse({
      description: 'Invalid email format',
      schema: {
        example: {
          statusCode: 400,
          message: ['email must be an email'],
          error: 'Bad Request',
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
