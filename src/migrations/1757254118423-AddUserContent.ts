import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserContent1757254118423 implements MigrationInterface {
  name = 'AddUserContent1757254118423';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "content" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "file_key" varchar NOT NULL,
        "file_name" varchar,
        "mime_type" varchar,
        "size_bytes" integer,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_content_id" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN "avatar_content_id" uuid;
    `);
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD CONSTRAINT "FK_user_avatar_content"
      FOREIGN KEY ("avatar_content_id") REFERENCES "content"("id")
      ON DELETE SET NULL ON UPDATE NO ACTION;
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_user_avatar_content_id" ON "user" ("avatar_content_id");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "IDX_user_avatar_content_id";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_user_avatar_content";`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP COLUMN "avatar_content_id";`,
    );
    await queryRunner.query(`DROP TABLE "content";`);
  }
}
