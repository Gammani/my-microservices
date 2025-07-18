import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false, collation: 'C' })
  login: string;

  @Column({ nullable: false, collation: 'C' })
  email: string;

  @Column({ nullable: false })
  age: number;

  @Column({})
  description: string;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ nullable: false })
  passwordHash: string;
}
