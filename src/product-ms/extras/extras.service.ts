import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from 'src/config';
import { CreateExtraDto } from './dto/create-extra.dto';
import { EXTRA_PATTERNS } from './patterns/extra_patterns';
import { UpdateExtraDto } from './dto/update-extra.dto';
import { BaseCrudService } from 'src/common/services/base-crud.service';

@Injectable()
export class ExtrasService extends BaseCrudService<
  CreateExtraDto,
  UpdateExtraDto
> {
  constructor(
    @Inject(PRODUCTS_SERVICE) client: ClientProxy,
  ) {
    super(client, EXTRA_PATTERNS);
  }
}
