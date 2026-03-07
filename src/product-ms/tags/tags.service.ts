import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';
import { CreateTagDto } from './dto/create-tag.dto';
import { TAG_PATTERNS } from './patterns/tag_patterns';
import { UpdateTagDto } from './dto/update-tag.dto';
import { BaseCrudService } from 'src/common/services/base-crud.service';

@Injectable()
export class TagsService extends BaseCrudService<
  CreateTagDto,
  UpdateTagDto
> {
  constructor(
    @Inject(PRODUCTS_SERVICE) client: ClientProxy,
  ) {
    super(client, TAG_PATTERNS);
  }
}

