import { MigrationInterface, QueryRunner } from "typeorm";

export class StoreCreditCreate1701281595113 implements MigrationInterface {
    name = 'StoreCreditCreate1701281595113'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "store_credit" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "value" integer NOT NULL, "balance" integer NOT NULL, "customer_id" character varying NOT NULL, CONSTRAINT "PK_77277b8e8c11409fd589098c46b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0c5028ec6c9729e18d80a9c425" ON "store_credit" ("customer_id") `);
        await queryRunner.query(`CREATE TABLE "store_credit_transaction" ("id" character varying NOT NULL, "store_credit_id" character varying NOT NULL, "order_id" character varying NOT NULL, "amount" integer NOT NULL, CONSTRAINT "gcuniq" UNIQUE ("store_credit_id", "order_id"), CONSTRAINT "PK_7a14ace1d30f0f5d1dc1cfa5aa1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_56d95bd6e745ffcbc9da4d3cd3" ON "store_credit_transaction" ("order_id") `);
        await queryRunner.query(`ALTER TABLE "store_credit" ADD CONSTRAINT "FK_0c5028ec6c9729e18d80a9c4253" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_credit_transaction" ADD CONSTRAINT "FK_7df7bc0a95137896cfd5280317c" FOREIGN KEY ("store_credit_id") REFERENCES "store_credit"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "store_credit_transaction" ADD CONSTRAINT "FK_56d95bd6e745ffcbc9da4d3cd36" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "store_credit_transaction" DROP CONSTRAINT "FK_56d95bd6e745ffcbc9da4d3cd36"`);
        await queryRunner.query(`ALTER TABLE "store_credit_transaction" DROP CONSTRAINT "FK_7df7bc0a95137896cfd5280317c"`);
        await queryRunner.query(`ALTER TABLE "store_credit" DROP CONSTRAINT "FK_0c5028ec6c9729e18d80a9c4253"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_56d95bd6e745ffcbc9da4d3cd3"`);
        await queryRunner.query(`DROP TABLE "store_credit_transaction"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0c5028ec6c9729e18d80a9c425"`);
        await queryRunner.query(`DROP TABLE "store_credit"`);
    }

}
