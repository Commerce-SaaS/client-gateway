import { ApiProperty } from '@nestjs/swagger';
import { Matches } from 'class-validator';

export class GetAvailableSlotsDto {
  @ApiProperty({
    description: 'Date to list available scheduling slots for (YYYY-MM-DD)',
    example: '2026-07-15',
  })
  @Matches(/^\d{4}-\d{2}-\d{2}$/, { message: 'date must be in YYYY-MM-DD format' })
  date: string;
}
