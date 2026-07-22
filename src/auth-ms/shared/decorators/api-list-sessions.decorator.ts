import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

export function ApiListSessions() {
  return applyDecorators(
    ApiBearerAuth('jwt'),
    ApiOperation({
      summary: 'List active sessions',
      description:
        "Returns the authenticated user's active sessions. The session used to make the request is flagged with `current: true`.",
    }),
    ApiOkResponse({
      description: 'Active sessions retrieved successfully',
      schema: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            jti: { type: 'string', format: 'uuid' },
            device: { type: 'string', example: 'iPhone 15 de Juan' },
            ip: { type: 'string', nullable: true, example: '190.12.34.56' },
            createdAt: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              example: '2026-06-18T12:34:56.000Z',
            },
            current: { type: 'boolean', example: true },
          },
        },
      },
    }),
    ApiUnauthorizedResponse({
      description: 'Missing, invalid or revoked session token',
    }),
  );
}
