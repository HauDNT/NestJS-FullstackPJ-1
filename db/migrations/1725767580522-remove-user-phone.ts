import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveUserPhone1725767580522 implements MigrationInterface {
    name = 'RemoveUserPhone1725767580522'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`phone\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`phone\` varchar(255) NOT NULL`);
    }

}
