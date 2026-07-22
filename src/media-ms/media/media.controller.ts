import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MediaService } from './media.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { OrganizationRole } from 'src/common/enums/organization-roles.enum';
import { PlatformRolesEnum } from 'src/common/enums/platform-roles.enum';
import { PlatformOrganizationAuth } from 'src/common/decorators/platform-organization-auth.decorator';
import { ApiDeleteMediaResponse } from './decorators/swagger/api-delete-media-response.decorator';
import { ApiUploadResponse } from './decorators/swagger/api-upload-media-response.decorator';

@ApiTags('Media')
@Controller('media')
@PlatformOrganizationAuth([PlatformRolesEnum.STAFF], [OrganizationRole.STAFF])
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  @ApiUploadResponse()
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
      fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
          return cb(new BadRequestException('Only images are allowed'), false);
        }
        cb(null, true);
      },
    }),
  )
  async upload(@UploadedFile() file: Express.Multer.File) {
    return this.mediaService.create({ file });
  }

  @Delete(':id')
  @ApiDeleteMediaResponse()
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
