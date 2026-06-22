import { applyDecorators } from '@nestjs/common';
import {
  ApiOperation,
  ApiBody,
  ApiBearerAuth,
  ApiResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { ChangeEmailConfirmDto } from 'src/auth-ms/saas-auth/dto/change-email-confirm.dto';

export const ApiConfirmEmailChange = () => {
  return applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({
      summary: 'Confirm email change',
      description:
        'Confirms the pending email change with the OTP sent to the new email. On success the account email is updated, emailVerified stays true, a notice is sent to the previous email, and all other sessions are revoked (the current one is kept). The OTP is attempt-limited and burns after too many failures.',
    }),
    ApiBody({
      type: ChangeEmailConfirmDto,
    }),
    ApiResponse({
      status: 201,
      description: 'Email updated successfully.',
      schema: {
        example: {
          message: 'Email updated successfully',
        },
      },
    }),
    ApiBadRequestResponse({
      description:
        'Invalid/expired code, wrong code, or too many attempts. Same generic message for expired and missing pending request.',
      schema: {
        example: {
          statusCode: 400,
          message: 'Invalid or expired code',
          error: 'Bad Request',
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Missing or invalid session.',
      schema: {
        example: {
          statusCode: 401,
          message: 'Unauthorized',
          error: 'Unauthorized',
        },
      },
    }),
    ApiConflictResponse({
      description:
        'The new email was taken by another account between request and confirm (race).',
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