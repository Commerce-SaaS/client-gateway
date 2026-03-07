import { Inject, Injectable } from '@nestjs/common';
import { CreateUserOrganizationDto } from './dto/create-user_organization.dto';
import { UpdateUserOrganizationDto } from './dto/update-user_organization.dto';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { USER_ORGANIZATION_PATTERNS } from './patterns/user_organization_patterns';
import { ORGANIZATION_SERVICE} from 'src/config/services';

@Injectable()
export class UserOrganizationService {
  constructor(@Inject(ORGANIZATION_SERVICE) private readonly client: ClientProxy) {}
  create(createUserOrganizationDto: CreateUserOrganizationDto) {
    return firstValueFrom(
      this.client.send(
        USER_ORGANIZATION_PATTERNS.CREATE_USER_ORGANIZATION,
        createUserOrganizationDto,
      ),
    );
  }

  getUserOrgPermissions(id: string) {
    return firstValueFrom(
      this.client.send(
        USER_ORGANIZATION_PATTERNS.GET_USER_PERMISSIONS,
        id,
      ),
    );
  }

  findOrganizationsByUser(id: string) {
    return firstValueFrom(
      this.client.send(
        USER_ORGANIZATION_PATTERNS.FIND_ALL_ORGANIZATIONS_BY_USER,
        id,
      ),
    );
  }

  findUsersByOrganization(id: string) {
    return firstValueFrom(
      this.client.send(
        USER_ORGANIZATION_PATTERNS.FIND_ALL_USER_ORGANIZATION,
        id,
      ),
    );
  }

  update(id: string, updateUserOrganizationDto: UpdateUserOrganizationDto) {
    return firstValueFrom(
      this.client.send(
        USER_ORGANIZATION_PATTERNS.UPDATE_USER_ORGANIZATION,
        { id, ...updateUserOrganizationDto },
      ),
    );
  }

  remove(id: string) {
    return firstValueFrom(
      this.client.send(
        USER_ORGANIZATION_PATTERNS.DELETE_USER_ORGANIZATION,
        id,
      ),
    );
  }

  restore(id: string) {
    return firstValueFrom(
      this.client.send(
        USER_ORGANIZATION_PATTERNS.RESTORE_USER_ORGANIZATION,
        id,
      ),
    );
  }
}
