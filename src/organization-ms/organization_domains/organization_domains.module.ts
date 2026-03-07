import { Module } from '@nestjs/common';
import { OrganizationDomainsService } from './organization_domains.service';
import { OrganizationDomainsController } from './organization_domains.controller';

@Module({
  controllers: [OrganizationDomainsController],
  providers: [OrganizationDomainsService],
  exports: [OrganizationDomainsService],
})
export class OrganizationDomainsModule {}
