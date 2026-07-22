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
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './product.service';
import { OrganizationId } from 'src/common/decorators/organizationId.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { CurrentUserContext } from 'src/common/interfaces/current-user-context.type';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiCreateResponse } from 'src/common/decorators/swagger/api-create-response.decorator';
import { ApiUpdateResponse } from 'src/common/decorators/swagger/api-update-response.decorator';
import { ApiSoftDeleteResponse } from 'src/common/decorators/swagger/api-soft-delete-response.decorator';
import { PaginationProductDto } from './dto/paginationProduct.dto';
import { ApiFindAllProducts } from '../../common/decorators/swagger/api-find-all-products-response.decorator';
import { ApiFindOnePublicResponse } from 'src/common/decorators/swagger/api-find-one-public-response.decorator';
import { ApiRestoreResponse } from 'src/common/decorators/swagger/api-restore-response.decorator';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { PublicTenant } from 'src/common/decorators/public-tenant.decorator';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  @ApiCreateResponse(CreateProductDto)
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF], 'saas')
  create(@Body() dto: CreateProductDto, @User() user: CurrentUserContext) {
    return this.service.create(dto, user.organizationId);
  }

  @Get()
  @SkipThrottle()
  @PublicTenant()
  @ApiFindAllProducts()
  findAll(
    @Query() paginationProductDto: PaginationProductDto,
    @OrganizationId() organizationId: string,
  ) {
    console.log({paginationProductDto, organizationId})
    return this.service.findAll(paginationProductDto, organizationId);
  }

  @Get(':id')
  @SkipThrottle()
  @PublicTenant()
  @ApiFindOnePublicResponse('Product')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @OrganizationId() organizationId: string,
  ) {
    return this.service.findOne(id, organizationId);
  }

  @Patch(':id')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF], 'saas')
  @ApiUpdateResponse(UpdateProductDto)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
    @User() user: CurrentUserContext,
  ) {
    return this.service.update(id, dto, user.organizationId);
  }

  @Patch(':id/soft-delete')
  @ApiSoftDeleteResponse('Product')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: CurrentUserContext,
  ) {
    return this.service.remove(id, user.organizationId);
  }

  @Patch(':id/restore')
  @ApiRestoreResponse('Product')
  @PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
  restore(
    @Param('id', ParseUUIDPipe) id: string,
    @User() user: CurrentUserContext,
  ) {
    return this.service.restore(id, user.organizationId);
  }
}
