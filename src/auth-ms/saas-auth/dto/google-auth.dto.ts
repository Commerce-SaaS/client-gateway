import { IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class GoogleAuthDto {
  @ApiProperty({
    description: 'Google OAuth ID token obtained from Google Sign-In on the client',
    example: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjA1YzE5M2Y4YzA2Nz...',
  })
  @IsString()
  idToken: string;
}
