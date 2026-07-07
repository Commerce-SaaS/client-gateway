import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { User } from 'src/common/decorators/user.decorator';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { CreatePaymentSessionDto } from './dto/create-payment-session.dto';
import { ApiCreatePaymentSessionResponse } from './decorators/api-create-payment-session-response.decorator';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { PaymentsPaginationDto } from './dto/payments-pagination.dto';
import { ApiFindAllPaymentsResponse } from './decorators/api-find-all-payments-response.decorator';
import { ApiFindMyPaymentsResponse } from './decorators/api-find-my-payments-response.decorator';
import { ApiFindMyPaymentByIdResponse } from './decorators/api-find-my-payment-by-id-response.decorator';
import { ApiFindOnePaymentResponse } from './decorators/api-find-one-payment-response.decorator';
import { ApiCreatePaymentManualResponse } from './decorators/api-create-payment-manual-response.decorator';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { ApiUpdatePaymentResponse } from './decorators/api-update-payment-response.decorator';
import { CancelPaymentDto } from './dto/cancel-payment.dto';
import { ApiCancelPaymentResponse } from './decorators/api-cancel-payment-response.decorator';

@ApiTags('Payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) { }

  @Post('manual')
  @ApiCreatePaymentManualResponse(CreatePaymentDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  create(@Body() dto: CreatePaymentDto, @OrganizationId() id: string) {
    return this.paymentService.createPaymentManual(dto, id);
  }
  @Post('create-session')
  @ApiCreatePaymentSessionResponse(CreatePaymentSessionDto)
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF, PlatformRolesEnum.CUSTOMER],
    [OrganizationRole.STAFF, OrganizationRole.CUSTOMER],
    'customer',
  )
  createPaymentSession(
    @Body() dto: CreatePaymentSessionDto,
    @User() user: CurrentUserContext,
  ) {
    return this.paymentService.createPaymentSession(dto, user);
  }

  @Get('me')
  @ApiFindMyPaymentsResponse()
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.CUSTOMER],
    [OrganizationRole.CUSTOMER],
    ['customer'],
  )
  findMyPayments(
    @User() user: CurrentUserContext,
    @Query() paginationDto: PaymentsPaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.paymentService.findMyPayments(
      paginationDto,
      organizationId,
      user.id,
    );
  }

  @Get('me/:id')
  @ApiFindMyPaymentByIdResponse()
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.CUSTOMER],
    [OrganizationRole.CUSTOMER],
    ['customer'],
  )
  findMyPaymentById(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: CurrentUserContext,
    @OrganizationId() organizationId: string,
  ) {
    return this.paymentService.findMyPaymentById(id, organizationId, user.id);
  }

  @Get()
  @ApiFindAllPaymentsResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findAll(
    @Query() paginationDto: PaymentsPaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.paymentService.findAll(paginationDto, organizationId);
  }

  @Get(':id')
  @ApiFindOnePaymentResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.paymentService.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiUpdatePaymentResponse(UpdatePaymentDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
    @OrganizationId() orgId: string,
  ) {
    return this.paymentService.update(id, dto, orgId);
  }

  @Patch(':id/cancel')
  @ApiCancelPaymentResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CancelPaymentDto,
    @OrganizationId() orgId: string,
  ) {
    return this.paymentService.cancel(id, dto, orgId);
  }
}
