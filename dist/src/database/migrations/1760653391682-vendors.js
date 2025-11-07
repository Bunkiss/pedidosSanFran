"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendors1760653391682 = void 0;
class Vendors1760653391682 {
    name = 'Vendors1760653391682';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`vendors\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`categoria\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, UNIQUE INDEX \`REL_65b4134d1ddc73872e6abee2c1\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vendor_schedules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`dia\` enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL, \`horaApertura\` time NOT NULL, \`horaCierre\` time NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`vendor_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vendors\` ADD CONSTRAINT \`FK_65b4134d1ddc73872e6abee2c17\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` ADD CONSTRAINT \`FK_883bc07109d39a0b9629d890b26\` FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` DROP FOREIGN KEY \`FK_883bc07109d39a0b9629d890b26\``);
        await queryRunner.query(`ALTER TABLE \`vendors\` DROP FOREIGN KEY \`FK_65b4134d1ddc73872e6abee2c17\``);
        await queryRunner.query(`DROP TABLE \`vendor_schedules\``);
        await queryRunner.query(`DROP INDEX \`REL_65b4134d1ddc73872e6abee2c1\` ON \`vendors\``);
        await queryRunner.query(`DROP TABLE \`vendors\``);
    }
}
exports.Vendors1760653391682 = Vendors1760653391682;
//# sourceMappingURL=1760653391682-vendors.js.map