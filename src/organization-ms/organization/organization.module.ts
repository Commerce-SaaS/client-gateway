import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { PaidOnboardingGuard } from 'src/common/guards/paid-onboarding.guard';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, PaidOnboardingGuard],
  imports: [],
  exports: [OrganizationService],
})
export class OrganizationModule {}
