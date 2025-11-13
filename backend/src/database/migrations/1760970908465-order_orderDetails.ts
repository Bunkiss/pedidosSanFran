import { MigrationInterface, QueryRunner } from "typeorm";

export class OrderOrderDetails1760970908465 implements MigrationInterface {
    name = 'OrderOrderDetails1760970908465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order_details\` (\`id\` int NOT NULL AUTO_INCREMENT, \`cantidad\` int NOT NULL DEFAULT '1', \`subtotal\` decimal(10,2) NOT NULL, \`impuestos\` decimal(10,2) NOT NULL DEFAULT '0.00', \`propina\` decimal(10,2) NOT NULL DEFAULT '0.00', \`costo_envio\` decimal(10,2) NOT NULL DEFAULT '0.00', \`metodo_pago\` enum ('efectivo', 'tarjeta', 'transferencia') NOT NULL DEFAULT 'efectivo', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`order_id\` int NULL, \`product_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`id\` int NOT NULL AUTO_INCREMENT, \`total\` decimal(10,2) NOT NULL DEFAULT '0.00', \`estado\` enum ('pendiente', 'en_proceso', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`vendor_id\` int NULL, \`user_id\` int NULL, \`driver_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`vendors\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vendors\` ADD UNIQUE INDEX \`IDX_65b4134d1ddc73872e6abee2c1\` (\`user_id\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_65b4134d1ddc73872e6abee2c1\` ON \`vendors\` (\`user_id\`)`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_3ff3367344edec5de2355a562ee\` FOREIGN KEY (\`order_id\`) REFERENCES \`orders\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_ce1f689e43b39edd9330cadaeb8\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_f8ebf94df30e29b0e53fbdfaadd\` FOREIGN KEY (\`vendor_id\`) REFERENCES \`vendors\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_222cd7bf166a2d7a6aad9cdebee\` FOREIGN KEY (\`driver_id\`) REFERENCES \`drivers\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vendors\` ADD CONSTRAINT \`FK_65b4134d1ddc73872e6abee2c17\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vendors\` DROP FOREIGN KEY \`FK_65b4134d1ddc73872e6abee2c17\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_222cd7bf166a2d7a6aad9cdebee\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_f8ebf94df30e29b0e53fbdfaadd\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_ce1f689e43b39edd9330cadaeb8\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_3ff3367344edec5de2355a562ee\``);
        await queryRunner.query(`DROP INDEX \`REL_65b4134d1ddc73872e6abee2c1\` ON \`vendors\``);
        await queryRunner.query(`ALTER TABLE \`vendors\` DROP INDEX \`IDX_65b4134d1ddc73872e6abee2c1\``);
        await queryRunner.query(`ALTER TABLE \`vendors\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`order_details\``);
    }

}
