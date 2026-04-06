import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostsAndUsers1712500000000 implements MigrationInterface {
    name = "UpdatePostsAndUsers1712500000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN IF NOT EXISTS "deleted" boolean NOT NULL DEFAULT false
        `);

        await queryRunner.query(`
            ALTER TABLE "newspost"
            ADD COLUMN IF NOT EXISTS "deleted" boolean NOT NULL DEFAULT false
        `);

        await queryRunner.query(`
            ALTER TABLE "newspost"
            RENAME COLUMN "title" TO "header"
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_USER_EMAIL" ON "user" ("email")
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_NEWSPOST_HEADER" ON "newspost" ("header")
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_NEWSPOST_DELETED" ON "newspost" ("deleted")
        `);

        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS "IDX_USER_DELETED" ON "user" ("deleted")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_USER_DELETED"
        `);

        await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_NEWSPOST_DELETED"
        `);

        await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_NEWSPOST_HEADER"
        `);

        await queryRunner.query(`
            DROP INDEX IF EXISTS "IDX_USER_EMAIL"
        `);

        await queryRunner.query(`
            ALTER TABLE "newspost"
            RENAME COLUMN "header" TO "title"
        `);

        await queryRunner.query(`
            ALTER TABLE "newspost"
            DROP COLUMN IF EXISTS "deleted"
        `);

        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN IF EXISTS "deleted"
        `);
    }
}