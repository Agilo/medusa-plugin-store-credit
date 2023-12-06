import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreCreditUpdate1701781684943 implements MigrationInterface {
    name = 'StoreCreditUpdate1701781684943'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit" ADD "metadata" jsonb`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit" DROP COLUMN "metadata"`);
    }

}
