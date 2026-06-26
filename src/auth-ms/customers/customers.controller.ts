import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { ApiDeactivateCustomer } from './decorators/api-deactivate-customer.decorator';
import { ApiGetCustomer } from './decorators/api-get-customer.decorator';
import { ApiReactivateCustomer } from './decorators/api-reactivate-customer.decorator';
import { ApiGetAllCustomers } from './decorators/api-get-all-customers.decorator';
import { PaginationCustomerDto } from './dto/pagination.dto';
import { ApiUpdateCustomer } from './decorators/api-update-me.decorator';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { ApiRegisterCustomer } from './decorators/api-create-customer.decorator';
import { ApiDeleteCustomer } from './decorators/api-delete-customer.decorator';
import { UpdateCustomerByAdminDto } from './dto/update-customer-by-admin.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF],
    [OrganizationRole.STAFF],
    ['saas'],
  )
  @Post('')
  @ApiRegisterCustomer()
  create(
    @Body() dto: CreateCustomerDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.customersService.create({
      ...dto,
      organizationId,
    });
  }

  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF],
    [OrganizationRole.STAFF],
    ['saas'],
  )
  @Get('')
  @ApiGetAllCustomers()
  getAllCustomers(
    @Query() paginationCustomerDto: PaginationCustomerDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.customersService.findAll({
      ...paginationCustomerDto,
      organizationId,
    });
  }

  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF],
    [OrganizationRole.STAFF],
    ['saas'],
  )
  @Get(':id')
  @ApiGetCustomer()
  getCustomer(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.customersService.findOne(id, organizationId);
  }
  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF],
    [OrganizationRole.STAFF],
    ['saas'],
  )
  @Patch(':id')
  @ApiUpdateCustomer()
  updateCustomerProfile(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerByAdminDto,
    @OrganizationId() organizationId: string,
  ) {
    return this.customersService.update(id, dto, organizationId);
  }

  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF],
    [OrganizationRole.STAFF],
    ['saas'],
  )
  @Patch(':id/deactivate')
  @ApiDeactivateCustomer()
  softDelete(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.customersService.softDelete(id, organizationId);
  }

  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF],
    [OrganizationRole.STAFF],
    ['saas'],
  )
  @Patch(':id/delete-account')
  @ApiDeleteCustomer()
  delete(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.customersService.delete(id, organizationId);
  }

  @PlatformOrganizationAuth(
    [PlatformRolesEnum.STAFF],
    [OrganizationRole.STAFF],
    ['saas'],
  )
  @Patch(':id/restore')
  @ApiReactivateCustomer()
  restore(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.customersService.restoreByAdmin(id, organizationId);
  }
}
