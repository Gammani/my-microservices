import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TestingUtilsService {
  constructor(private readonly dataSource: DataSource) {}

  async clearDatabase(): Promise<void> {
    const entities = this.dataSource.entityMetadatas;

    for (const entity of entities) {
      const repository = this.dataSource.getRepository(entity.name);
      await repository.query(`DELETE FROM "${entity.tableName}";`);
    }
  }
}
