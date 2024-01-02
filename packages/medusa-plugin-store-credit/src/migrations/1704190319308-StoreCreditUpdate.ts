import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreCreditUpdate1704190319308 implements MigrationInterface {
    name = 'StoreCreditUpdate1704190319308'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit" ADD "description" text`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit" DROP COLUMN "description"`);
    }

}
