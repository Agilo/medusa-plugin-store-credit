import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreCreditUpdate1701705386313 implements MigrationInterface {
    name = 'StoreCreditUpdate1701705386313'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit" ADD "region_id" character varying NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_fe5be01426ca9e50c4a110120a" ON "store_credit" ("region_id") `);
        await queryRunner.query(`ALTER TABLE "store_credit" ADD CONSTRAINT "FK_fe5be01426ca9e50c4a110120a1" FOREIGN KEY ("region_id") REFERENCES "region"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit" DROP CONSTRAINT "FK_fe5be01426ca9e50c4a110120a1"`);
        await queryRunner.query(`ALTER TABLE "store_credit" DROP COLUMN "region_id"`);
    }

}
