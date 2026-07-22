import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumberString, IsString, Length } from 'class-validator';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '6-digit verification code sent to the user email',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  @IsNumberString()
  code: string;
}

export class ResendVerificationDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;
}