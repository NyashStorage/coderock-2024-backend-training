import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { AutoMap } from 'automapper-classes';

@Entity('users')
export default class UserEntity {
  @PrimaryGeneratedColumn()
  @AutoMap()
  id: number;

  @Index({ unique: true })
  @Column({ unique: true })
  @AutoMap()
  username: string;

  @Column()
  password: string;
}
