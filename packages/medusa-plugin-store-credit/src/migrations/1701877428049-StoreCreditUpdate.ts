import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreCreditUpdate1701877428049 implements MigrationInterface {
    name = 'StoreCreditUpdate1701877428049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit" ADD "ends_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit" DROP COLUMN "ends_at"`);
    }

}
