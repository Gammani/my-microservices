import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserBalance1757598489458 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN "balance" NUMERIC(12,2) NOT NULL DEFAULT 0,
      ADD CONSTRAINT "CHK_user_balance_nonnegative" CHECK ("balance" >= 0)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user"
      DROP CONSTRAINT IF EXISTS "CHK_user_balance_nonnegative",
      DROP COLUMN IF EXISTS "balance"
    `);
  }
}
