import { ApiProperty } from '@nestjs/swagger';
import { IsJWT, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({
    description: 'The refresh token issued to the user.',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwianRpIjoiZDRlYzA1YjQtOWYxOC00Y2YzLTg3YjktNzY1Y2Y5MjZhZmNmIiwiaWF0IjoxNjA3MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
  })
  @IsString()
  @IsJWT()
  refreshToken: string;
}