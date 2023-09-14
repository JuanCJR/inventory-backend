import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuantityClumn1694657519474 implements MigrationInterface {
    name = 'AddQuantityClumn1694657519474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ADD "quantity" integer DEFAULT '1'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "quantity"`);
    }

}
