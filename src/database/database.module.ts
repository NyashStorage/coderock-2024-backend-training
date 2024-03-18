import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import options from './data-source-options';

@Global()
@Module({
  imports: [TypeOrmModule.forRoot(options)],
})
export default class DatabaseModule {}
