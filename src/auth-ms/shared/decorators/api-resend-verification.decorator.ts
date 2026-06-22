import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { ResendVerificationDto } from '../dto/resend-verification.dto';

export function ApiResendVerification() {
  return applyDecorators(
    ApiOperation({
      summary: 'Resend email verification code',
      description:
        'Sends a new 6-digit code if the account exists and is unverified. Always returns a generic message.',
    }),
    ApiBody({ type: ResendVerificationDto }),
    ApiResponse({
      status: 201,
      schema: {
        example: {
          message:
            'If an unverified account exists for this email, a new code was sent',
        },
      },
    }),
    ApiResponse({ status: 429, description: 'Too many requests (rate limit)' }),
  );
}
