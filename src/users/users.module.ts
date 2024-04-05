import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import UserEntity from './entities/user.entity';
import UsersRepository from './repositories/users.repository';
import UsersController from './users.controller';
import UserProfile from './profiles/user.profile';
import TokensModule from '../tokens/tokens.module';

@Module({
  imports: [TokensModule, TypeOrmModule.forFeature([UserEntity])],
  controllers: [UsersController],
  providers: [UsersRepository, UserProfile],
  exports: [UsersRepository, UserProfile],
})
export default class UsersModule {}
