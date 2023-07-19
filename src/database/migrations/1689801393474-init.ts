import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1689801393474 implements MigrationInterface {
    name = 'Init1689801393474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "inventory" ("id" SERIAL NOT NULL, "ean" character varying(100) NOT NULL, "product_name" character varying(100) NOT NULL, "expires_in" date NOT NULL, "created_at" character varying NOT NULL DEFAULT now(), "updated_at" character varying NOT NULL DEFAULT now(), CONSTRAINT "PK_82aa5da437c5bbfb80703b08309" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "inventory"`);
    }

}
