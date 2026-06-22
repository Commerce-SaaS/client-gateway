import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ChangeEmailRequestDto } from 'src/auth-ms/saas-auth/dto/change-email-request.dto';


export const ApiRequestEmailChange = () => {
  return applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({
      summary: 'Request email change',
      description:
        'Starts the email change flow. Re-authenticates the user with their current password and sends a 6-digit OTP to the NEW email. The account email is NOT changed at this step. Accounts without a password (e.g. Google-only) cannot use this endpoint.',
    }),
    ApiBody({
      type: ChangeEmailRequestDto,
    }),
    ApiResponse({
      status: 201,
      description: 'OTP sent to the new email address.',
      schema: {
        example: {
          message: 'Verification code sent to the new email',
        },
      },
    }),
    ApiBadRequestResponse({
      description:
        'Validation error, or the new email equals the current one.',
      schema: {
        example: {
          statusCode: 400,
          message: 'New email must be different from the current one',
          error: 'Bad Request',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Invalid password or missing/invalid session.',
      schema: {
        example: {
          statusCode: 401,
          message: 'Invalid credentials',
          error: 'Unauthorized',
        },
      },
    }),
    ApiForbiddenResponse({
      description:
        'Account has no password set (Google-only); password re-auth is required.',
      schema: {
        example: {
          statusCode: 403,
          message: 'Password is required to change email for this account',
          error: 'Forbidden',
        },
      },
    }),
    ApiConflictResponse({
      description: 'The new email is already in use.',
      schema: {
        example: {
          statusCode: 409,
          message: 'Email already exists',
          error: 'Conflict',
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