import { Inject, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ORGANIZATION_PATTERNS } from './patterns/organization_patterns';
import { ORGANIZATION_SERVICE } from 'src/config/services';
import { BaseCrudService } from 'src/common/services/base-crud.service';

@Injectable()
export class OrganizationService extends BaseCrudService<
  CreateOrganizationDto,
  UpdateOrganizationDto
> {
  constructor(
    @Inject(ORGANIZATION_SERVICE) client: ClientProxy,
  ) {
    super(client, ORGANIZATION_PATTERNS);
  }
}

