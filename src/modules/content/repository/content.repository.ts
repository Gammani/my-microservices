// content.repository.ts — репозиторий для ContentEntity
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContentEntity } from '../entity/content.entity';

@Injectable()
export class ContentRepository {
  constructor(
    @InjectRepository(ContentEntity)
    private readonly repo: Repository<ContentEntity>,
  ) {}

  createAndSave(data: Partial<ContentEntity>): Promise<ContentEntity> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async delete(avatarId: string): Promise<void> {
    await this.repo.delete(avatarId);
  }
}
