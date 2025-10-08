import { MigrationInterface, QueryRunner } from "typeorm";

export class VendorVendorSchedule1759945914539 implements MigrationInterface {
    name = 'VendorVendorSchedule1759945914539'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`vendors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`categoria\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vendor_schedules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dia\` enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL, \`horaApertura\` time NOT NULL, \`horaCierre\` time NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`vendor_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` ADD CONSTRAINT \`FK_883bc07109d39a0b9629d890b26\` FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` DROP FOREIGN KEY \`FK_883bc07109d39a0b9629d890b26\``);
        await queryRunner.query(`DROP TABLE \`vendor_schedules\``);
        await queryRunner.query(`DROP TABLE \`vendors\``);
    }

}
