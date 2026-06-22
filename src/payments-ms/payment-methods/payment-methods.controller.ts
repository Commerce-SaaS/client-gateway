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
import { PaymentMethodsService } from './payment-methods.service';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { ApiCreatePaymentMethodResponse } from './decorators/api-create-payment-method-response.decorator';
import { ApiFindAllPaymentMethodsResponse } from './decorators/api-find-all-payment-methods-response.decorator';
import { ApiFindOnePaymentMethodResponse } from './decorators/api-find-one-payment-method-response.decorator';
import { ApiUpdatePaymentMethodResponse } from './decorators/api-update-payment-method-response.decorator';
import { ApiSoftDeletePaymentMethodResponse } from './decorators/api-soft-delete-payment-method-response.decorator';
import { ApiRestorePaymentMethodResponse } from './decorators/api-restore-payment-method-response.decorator';
import { CreatePaymentMethodDto } from './dto/create-payment-method.dto';
import { PaymentMethodsPaginationDto } from './dto/payment-methods-pagination.dto';
import { UpdatePaymentMethodDto } from './dto/update-payment-method.dto';

@ApiTags('Payment Methods')
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Post()
  @ApiCreatePaymentMethodResponse(CreatePaymentMethodDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  create(
    @Body() dto: CreatePaymentMethodDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.paymentMethodsService.create(dto, organizationId);
  }

  @Get()
  @ApiFindAllPaymentMethodsResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findAll(
    @Query() paginationDto: PaymentMethodsPaginationDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.paymentMethodsService.findAll(paginationDto, organizationId);
  }

  @Get(':id')
  @ApiFindOnePaymentMethodResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.paymentMethodsService.findOne(id, organizationId);
  }

  @Patch(':id')
  @ApiUpdatePaymentMethodResponse(UpdatePaymentMethodDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentMethodDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.paymentMethodsService.update(id, dto, organizationId);
  }

  @Patch(':id/restore')
  @ApiRestorePaymentMethodResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  restore(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.paymentMethodsService.restore(id, organizationId);
  }

  @Patch(':id/delete')
  @ApiSoftDeletePaymentMethodResponse()
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  softDelete(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.paymentMethodsService.softDelete(id, organizationId);
  }
}