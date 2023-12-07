import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreCreditUpdate1701886687486 implements MigrationInterface {
    name = 'StoreCreditUpdate1701886687486'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_store_credits" ("order_id" character varying NOT NULL, "store_credit_id" character varying NOT NULL, CONSTRAINT "PK_296472542a9aa90e4271fb8c8cb" PRIMARY KEY ("order_id", "store_credit_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_30420fa658313b57942a2d8dad" ON "order_store_credits" ("order_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_461f4dbe1e6c3649b007b1a116" ON "order_store_credits" ("store_credit_id") `);
        await queryRunner.query(`ALTER TABLE "order_store_credits" ADD CONSTRAINT "FK_30420fa658313b57942a2d8dad4" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "order_store_credits" ADD CONSTRAINT "FK_461f4dbe1e6c3649b007b1a1167" FOREIGN KEY ("store_credit_id") REFERENCES "store_credit"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "order_store_credits" DROP CONSTRAINT "FK_461f4dbe1e6c3649b007b1a1167"`);
        await queryRunner.query(`ALTER TABLE "order_store_credits" DROP CONSTRAINT "FK_30420fa658313b57942a2d8dad4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_461f4dbe1e6c3649b007b1a116"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_30420fa658313b57942a2d8dad"`);
        await queryRunner.query(`DROP TABLE "order_store_credits"`);
    }

}
