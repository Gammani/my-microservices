import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUniqueConstraintsUser1756969143531
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE UNIQUE INDEX uniq_user_email_not_deleted
      ON "user"(email)
      WHERE deleted_at IS NULL;
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX uniq_user_login_not_deleted
      ON "user"(login)
      WHERE deleted_at IS NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX uniq_user_email_not_deleted;`);
    await queryRunner.query(`DROP INDEX uniq_user_login_not_deleted;`);
  }
}
