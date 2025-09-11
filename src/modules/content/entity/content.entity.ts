import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../user/entity/user.entity';

@Entity({ name: 'content' })
export class ContentEntity extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // стабильный ключ/относительный путь в S3/Spaces, например "avatars/ab/cd/<uuid>.png"
  @Column({ name: 'file_key', nullable: false })
  fileKey: string;

  // оригинальное имя (для Content-Disposition/логов)
  @Column({ name: 'file_name', nullable: true })
  fileName?: string;

  @Column({ name: 'mime_type', nullable: true })
  mimeType?: string;

  @Column({ name: 'size_bytes', type: 'int', nullable: true })
  sizeBytes?: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
  createdAt: Date;

  // обратная сторона связи (без JoinColumn)
  @OneToOne(() => UserEntity, (user) => user.avatarContent)
  user?: UserEntity;
}
