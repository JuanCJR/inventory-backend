import { MigrationInterface, QueryRunner } from "typeorm";

export class AddDaysBeforeRemove1689900264583 implements MigrationInterface {
    name = 'AddDaysBeforeRemove1689900264583'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ADD "days_before_remove" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "days_before_remove"`);
    }

}
