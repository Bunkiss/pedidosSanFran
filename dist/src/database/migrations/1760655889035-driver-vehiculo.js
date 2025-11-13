"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverVehiculo1760655889035 = void 0;
class DriverVehiculo1760655889035 {
    name = 'DriverVehiculo1760655889035';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`drivers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` int NULL, UNIQUE INDEX \`REL_8e224f1b8f05ace7cfc7c76d03\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`vehicles\` (\`id\` int NOT NULL AUTO_INCREMENT, \`tipo\` varchar(255) NOT NULL, \`marca\` varchar(255) NULL, \`modelo\` varchar(255) NULL, \`patente\` varchar(255) NULL, \`activo\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`driver_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`drivers\` ADD CONSTRAINT \`FK_8e224f1b8f05ace7cfc7c76d03b\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vehicles\` ADD CONSTRAINT \`FK_9c2e0a8772c9e43b32f57bfcfcc\` FOREIGN KEY (\`driver_id\`) REFERENCES \`drivers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`vehicles\` DROP FOREIGN KEY \`FK_9c2e0a8772c9e43b32f57bfcfcc\``);
        await queryRunner.query(`ALTER TABLE \`drivers\` DROP FOREIGN KEY \`FK_8e224f1b8f05ace7cfc7c76d03b\``);
        await queryRunner.query(`DROP TABLE \`vehicles\``);
        await queryRunner.query(`DROP INDEX \`REL_8e224f1b8f05ace7cfc7c76d03\` ON \`drivers\``);
        await queryRunner.query(`DROP TABLE \`drivers\``);
    }
}
exports.DriverVehiculo1760655889035 = DriverVehiculo1760655889035;
//# sourceMappingURL=1760655889035-driver-vehiculo.js.map