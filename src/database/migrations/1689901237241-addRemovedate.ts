import { MigrationInterface, QueryRunner } from "typeorm";

export class AddRemovedate1689901237241 implements MigrationInterface {
    name = 'AddRemovedate1689901237241'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ADD "remove_date" date`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "remove_date"`);
    }

}
