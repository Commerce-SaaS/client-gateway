import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { ApiDeleteMediaResponse } from './decorators/swagger/api-delete-media-response.decorator';
import { ApiUploadResponse } from './decorators/swagger/api-upload-media-response.decorator';

@Controller('media')
@PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiUploadResponse()
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Body() body: any) {
    return this.mediaService.create({ file, ...body });
  }

  @Delete(':id')
  @ApiDeleteMediaResponse()
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
