import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContentEntity } from '../../content/entity/content.entity';

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

  @Column({ type: 'numeric', precision: 12, scale: 2, default: 0 })
  balance: string;

  @CreateDateColumn({
    nullable: false,
    type: 'timestamp with time zone',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @Column({ nullable: false })
  passwordHash: string;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp with time zone',
    nullable: true,
  })
  deletedAt: Date | null;

  @OneToOne(() => ContentEntity, (content) => content.user, {
    cascade: ['insert', 'update'], // сохранять контент вместе с юзером при привязке
    nullable: true, // аватар необязателен
    onDelete: 'SET NULL', // удалили контент — у юзера ссылка станет NULL
    eager: false,
  })
  @JoinColumn({ name: 'avatar_content_id' })
  avatarContent?: ContentEntity;
}
