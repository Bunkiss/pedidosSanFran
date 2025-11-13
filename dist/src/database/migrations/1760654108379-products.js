"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Products1760654108379 = void 0;
class Products1760654108379 {
    name = 'Products1760654108379';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`vendors\` DROP FOREIGN KEY \`FK_65b4134d1ddc73872e6abee2c17\``);
        await queryRunner.query(`DROP INDEX \`REL_65b4134d1ddc73872e6abee2c1\` ON \`vendors\``);
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`descripcion\` text NULL, \`precio\` decimal(10,2) NOT NULL, \`imagen\` varchar(255) NULL, \`estado\` tinyint NOT NULL DEFAULT '1', \`vendor_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`vendors\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_0e859a83f1dd6b774c20c02885d\` FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_0e859a83f1dd6b774c20c02885d\``);
        await queryRunner.query(`ALTER TABLE \`vendors\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`DROP TABLE \`products\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_65b4134d1ddc73872e6abee2c1\` ON \`vendors\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`vendors\` ADD CONSTRAINT \`FK_65b4134d1ddc73872e6abee2c17\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
}
exports.Products1760654108379 = Products1760654108379;
//# sourceMappingURL=1760654108379-products.js.map