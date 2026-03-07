import { Module } from '@nestjs/common';
import { ExtrasController } from './extras.controller';
import { ExtrasService } from './extras.service';

@Module({
  controllers: [ExtrasController],
  imports: [],
  providers: [ExtrasService],
})
export class ExtrasModule {}
