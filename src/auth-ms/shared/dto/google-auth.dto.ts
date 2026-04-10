import { IsOptional, IsString } from 'class-validator';

export class GoogleAuthDto {
  @IsString()
  idToken: string;

  @IsString()
  @IsOptional()
  organizationId?: string;
}
