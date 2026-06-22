import { IsEmail, IsNumberString, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: '6-digit verification code sent to the user on registration',
    example: '123456',
  })
  @IsString()
  @Length(6, 6)
  @IsNumberString()
  code: string;
}