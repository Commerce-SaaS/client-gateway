import { Inject, Injectable } from '@nestjs/common';
import { CreateOrganizationDomainDto } from './dto/create-organization_domain.dto';
import { UpdateOrganizationDomainDto } from './dto/update-organization_domain.dto';
import { ClientProxy } from '@nestjs/microservices';
import { ORGANIZATION_DOMAIN_PATTERNS } from './patterns/organization_domain_patterns';
import { ORGANIZATION_SERVICE } from 'src/config/services';
import { BaseCrudService } from 'src/common/services/base-crud.service';

@Injectable()
export class OrganizationDomainsService extends BaseCrudService<
  CreateOrganizationDomainDto,
  UpdateOrganizationDomainDto
> {
  constructor(
    @Inject(ORGANIZATION_SERVICE) client: ClientProxy,
  ) {
    super(client, ORGANIZATION_DOMAIN_PATTERNS);
  }
}