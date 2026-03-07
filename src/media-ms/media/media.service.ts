import { Inject, Injectable } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { MEDIA_SERVICE } from 'src/config/services';
import { MEDIA_PATTERNS } from './patterns/media_patterns';

@Injectable()
export class MediaService {
  constructor(@Inject(MEDIA_SERVICE) private readonly client: ClientProxy) {}
  create(data: any) {
    return firstValueFrom(
      this.client.send(MEDIA_PATTERNS.CREATE, {
        file: {
          buffer: data.file.buffer,
          originalname: data.file.originalname,
          mimetype: data.file.mimetype,
        },
      }),
    );
  }

  remove(id: string) {
    return firstValueFrom(this.client.send(MEDIA_PATTERNS.DELETE, id));
  }
}
