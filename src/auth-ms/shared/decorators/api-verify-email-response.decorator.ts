import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { VerifyEmailDto } from '../dto/verify-email.dto';

export function ApiVerifyEmail() {
  return applyDecorators(
    ApiOperation({
      summary: 'Verify email with OTP code',
      description:
        'Verifies a user email using the 6-digit code sent on registration. ' +
        'The code expires after 15 minutes and is invalidated after 5 failed attempts.',
    }),
    ApiBody({ type: VerifyEmailDto }),
    ApiResponse({
      status: 201,
      description: 'Email verified (or already verified)',
      schema: { example: { message: 'Email verified' } },
    }),
    ApiResponse({
      status: 400,
      description: 'Invalid code, expired code, or too many attempts',
    }),
    ApiResponse({
      status: 429,
      description: 'Too many requests (rate limit)',
    }),
  );
}