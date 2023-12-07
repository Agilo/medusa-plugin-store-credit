import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreCreditUpdate1701880062154 implements MigrationInterface {
    name = 'StoreCreditUpdate1701880062154'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit" ADD "is_disabled" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "store_credit_transaction" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit_transaction" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "store_credit" DROP COLUMN "is_disabled"`);
    }

}
