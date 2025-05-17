// src/shared/repositories/base.repository.ts
import { ObjectLiteral, Repository } from 'typeorm';
import { DeepPartial } from 'typeorm/common/DeepPartial';

export abstract class BaseRepository<T extends ObjectLiteral> {
  constructor(protected readonly repo: Repository<T>) {}

  async create(entityData: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(entityData);
    return this.repo.save(entity);
  }

  async save(entity: T): Promise<T> {
    return await this.repo.save(entity);
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await this.repo.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async findById(id: string): Promise<T | null> {
    return await this.repo.findOne({ where: { id } as any });
  }

  findAll(): Promise<T[]> {
    return this.repo.find();
  }
}
