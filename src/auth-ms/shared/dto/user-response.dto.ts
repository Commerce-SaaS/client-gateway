import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({ example: '3ce207fb-0b94-4316-aeef-dca14d36faee' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: true })
  emailVerified: string;

  @ApiProperty({ example: 'John Doe' })
  name: string;

  @ApiProperty({ example: '2026-01-27T16:29:09.217Z' })
  createdAt: string;
}
