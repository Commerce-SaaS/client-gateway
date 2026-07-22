import { Module } from '@nestjs/common';
import { UserOrganizationService } from './user_organization.service';
import { UserOrganizationController } from './user_organization.controller';

@Module({
  controllers: [UserOrganizationController],
  providers: [UserOrganizationService],
  exports: [UserOrganizationService],
})
export class UserOrganizationModule {}
