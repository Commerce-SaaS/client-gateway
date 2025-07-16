import { Controller, Get, Post, Body, Patch, Param, Delete, Inject } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { NATS_SERVICE } from 'src/config';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';

@Controller('tags')
export class TagsController {
  constructor(@Inject(NATS_SERVICE) private readonly client: ClientProxy) {}

  @Post()
  create(@Body() createTagDto) {
    return this.client.send("createTag", createTagDto).pipe(

      catchError(err => {
        console.error('Error creating tag:', err);
        throw new RpcException(err);
      })
    );
  }

  // @Get()
  // findAll() {
  //   return this.tagsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.tagsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateTagDto: UpdateTagDto) {
  //   return this.tagsService.update(+id, updateTagDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.tagsService.remove(+id);
  // }
}
