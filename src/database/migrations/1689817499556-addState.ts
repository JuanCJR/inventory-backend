import { MigrationInterface, QueryRunner } from "typeorm";

export class AddState1689817499556 implements MigrationInterface {
    name = 'AddState1689817499556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" ADD "state" character varying(100)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "state"`);
    }

}
