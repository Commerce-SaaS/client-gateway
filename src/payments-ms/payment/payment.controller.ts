import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { PlatformAuth } from 'src/common/decorators/platform-auth.decorator';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { ApiCreatePaymentSessionResponse } from './decorators/api-create-payment-session-response.decorator';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
  ) {}

  @Post('create-session')
  @ApiCreatePaymentSessionResponse(CreatePaymentSessionDto)
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF, PlatformRolesEnum.CUSTOMER],
    [OrganizationRole.STAFF, OrganizationRole.CUSTOMER],
  )
  createPaymentSession(
    @Body() dto: CreatePaymentSessionDto,
    @OrganizationId() organizationId: string,
    @User() user: CurrentUserContext,
  ) {
    return this.paymentService.createPaymentSession(dto, organizationId, user);
  }

  @Get(':id')
  @PlatformAuth(PlatformRolesEnum.STAFF)
  findOne(@Param('id') id: string) {
    return "ok";
  }
}
