import { AutomapperProfile, InjectMapper } from 'automapper-nestjs';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import type { Mapper } from 'automapper-core';
import { createMap } from 'automapper-core';
import { Injectable } from '@nestjs/common';
import UserEntity from '../entities/user.entity';
import UserResponse from '../dto/responses/user.response';

@Injectable()
export default class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper): void => {
      createMap(mapper, UserEntity, UserResponse);
    };
  }
}
