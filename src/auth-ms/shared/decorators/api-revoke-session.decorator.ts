import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiRevokeSession() {
  return applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({
      summary: 'Revoke a session',
      description:
        "Revokes one of the authenticated user's own sessions by `jti`. A non-owned or non-existent `jti` returns 404 (no enumeration).",
    }),
    ApiParam({
      name: 'jti',
      description: 'JTI of the session to revoke',
      example: '3f1c…',
    }),
    ApiOkResponse({
      description: 'Session revoked successfully',
      schema: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Session revoked successfully' },
        },
      },
    }),
    ApiNotFoundResponse({
      description: 'Session not found or not owned by the user',
    }),
    ApiUnauthorizedResponse({
      description: 'Missing, invalid or revoked session token',
    }),
  );
}
