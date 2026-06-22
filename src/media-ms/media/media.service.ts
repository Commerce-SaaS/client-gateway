import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MEDIA_SERVICE } from 'src/config/services';
import { MEDIA_PATTERNS } from './patterns/media_patterns';
import { rpcSend } from 'src/common/utils/rpc.utils';

@Injectable()
export class MediaService {
  constructor(@Inject(MEDIA_SERVICE) private readonly client: ClientProxy) {}

  create(data: any) {
    return rpcSend(this.client, MEDIA_PATTERNS.CREATE, {
      file: {
        buffer: data.file.buffer,
        originalname: data.file.originalname,
        mimetype: data.file.mimetype,
      },
    });
  }

  remove(id: string) {
    return rpcSend(this.client, MEDIA_PATTERNS.DELETE, id);
  }
}
