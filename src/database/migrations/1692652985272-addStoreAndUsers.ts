import { MigrationInterface, QueryRunner } from "typeorm";

export class AddStoreAndUsers1692652985272 implements MigrationInterface {
    name = 'AddStoreAndUsers1692652985272'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "username" character varying(255) NOT NULL, "password" character varying(255) NOT NULL, "store_id" integer, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "store" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, CONSTRAINT "PK_f3172007d4de5ae8e7692759d79" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD "store_id" integer`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_0b7eefd81e97f9a779785f66080" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "inventory" ADD CONSTRAINT "FK_11f936d3d7a959d55b61f2eb685" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory" DROP CONSTRAINT "FK_11f936d3d7a959d55b61f2eb685"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_0b7eefd81e97f9a779785f66080"`);
        await queryRunner.query(`ALTER TABLE "inventory" DROP COLUMN "store_id"`);
        await queryRunner.query(`DROP TABLE "store"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
