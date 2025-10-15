import { Inject, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { first, firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ORGANIZATION_PATTERNS } from './patterns/organization_patterns';

@Injectable()
export class OrganizationService {
  constructor(
    @Inject('AUTH_SERVICE') private readonly clientAuthService: ClientProxy,
  ) {}

  create(createOrganizationDto: CreateOrganizationDto) {
    return firstValueFrom(
      this.clientAuthService.send(
        ORGANIZATION_PATTERNS.CREATE_ORGANIZATION,
        createOrganizationDto,
      ),
    );
  }

  // findAllByOwner() {
  //   return firstValueFrom(
  //     this.clientAuthService.send(
  //       ORGANIZATION_PATTERNS.FIND_ALL_ORGANIZATIONS_BY_OWNER,
  //       {},
  //     ),
  //   );
  // }

  findOne(id: string) {
    return firstValueFrom(
      this.clientAuthService.send(ORGANIZATION_PATTERNS.GET_ORGANIZATION, id),
    );
  }

  update(id: string, updateOrganizationDto: UpdateOrganizationDto) {
    return firstValueFrom(
      this.clientAuthService.send(ORGANIZATION_PATTERNS.UPDATE_ORGANIZATION, {
        id,
        ...updateOrganizationDto,
      }),
    );
  }

  remove(id: string) {
    return firstValueFrom(
      this.clientAuthService.send(
        ORGANIZATION_PATTERNS.DELETE_ORGANIZATION,
        id,
      ),
    );
  }
}
