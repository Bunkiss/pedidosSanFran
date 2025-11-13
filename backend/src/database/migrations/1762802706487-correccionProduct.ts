import { MigrationInterface, QueryRunner } from "typeorm";

export class CorreccionProduct1762802706487 implements MigrationInterface {
    name = 'CorreccionProduct1762802706487'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`imagen\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`imagen\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`imagen\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`imagen\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`imagen\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`imagen\` longtext NULL`);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`imagen\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`imagen\` varchar(255) NULL`);
    }

}
