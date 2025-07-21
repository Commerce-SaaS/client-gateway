import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateExtraDto } from './dto/create-extra.dto';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy } from '@nestjs/microservices';

@Controller('extras')
export class ExtrasController {
  constructor(
    @Inject(NATS_SERVICE) private readonly client: ClientProxy,
  ) {}

  @Post()
  create(@Body() createExtraDto: CreateExtraDto) {
    return this.client.send("createExtra",createExtraDto);
  }

  // @Get()
  // findAll() {
  //   return this.extrasService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.extrasService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateExtraDto: UpdateExtraDto) {
  //   return this.extrasService.update(+id, updateExtraDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.extrasService.remove(+id);
  // }
}
