import { Injectable } from '@nestjs/common';
import UserEntity from '../entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export default class UsersRepository {
  public constructor(
    @InjectRepository(UserEntity)
    private readonly repo: Repository<UserEntity>,
  ) {}

  public create(entity: Omit<UserEntity, 'id'>): Promise<UserEntity> {
    const createdEntity = new UserEntity();
    Object.assign(createdEntity, entity);

    return this.repo.save(createdEntity);
  }

  public getById(id: number): Promise<UserEntity | null> {
    return this.repo
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .getOne();
  }

  public getByUsername(username: string): Promise<UserEntity | null> {
    return this.repo
      .createQueryBuilder('user')
      .where('user.username = :username', { username })
      .getOne();
  }
}
