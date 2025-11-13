import { MigrationInterface, QueryRunner } from "typeorm";

export class ActualizacionParaFront1762555350580 implements MigrationInterface {
    name = 'ActualizacionParaFront1762555350580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_ce1f689e43b39edd9330cadaeb8\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`vendors\` DROP FOREIGN KEY \`FK_65b4134d1ddc73872e6abee2c17\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`user_id\``);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`telefono\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`direccionEntrega\` varchar(255) NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`notas\` text NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`metodoPago\` enum ('efectivo', 'tarjeta', 'transferencia') NOT NULL DEFAULT 'efectivo'`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`client_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`total\` \`total\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`estado\` \`estado\` enum ('pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado', 'completado') NOT NULL DEFAULT 'pendiente'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`nombre\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`nombre\` varchar(100) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`rol\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`rol\` enum ('cliente', 'vendor', 'driver', 'admin') NOT NULL DEFAULT 'cliente'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`total\` \`total\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`estado\` \`estado\` enum ('pendiente', 'confirmado', 'en_camino', 'entregado', 'cancelado', 'completado') NOT NULL DEFAULT 'pendiente'`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_ce1f689e43b39edd9330cadaeb8\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_505ba3689ef2763acd6c4fc93a4\` FOREIGN KEY (\`client_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`vendors\` ADD CONSTRAINT \`FK_65b4134d1ddc73872e6abee2c17\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vendors\` DROP FOREIGN KEY \`FK_65b4134d1ddc73872e6abee2c17\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_505ba3689ef2763acd6c4fc93a4\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_ce1f689e43b39edd9330cadaeb8\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`estado\` \`estado\` enum ('pendiente', 'en_proceso', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`total\` \`total\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`rol\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`rol\` varchar(255) NOT NULL DEFAULT 'user'`);
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`nombre\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`nombre\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`estado\` \`estado\` enum ('pendiente', 'en_proceso', 'completado', 'cancelado') NOT NULL DEFAULT 'pendiente'`);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`total\` \`total\` decimal(10,2) NOT NULL DEFAULT '0.00'`);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`client_id\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`metodoPago\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`notas\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP COLUMN \`direccionEntrega\``);
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`telefono\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`vendors\` ADD CONSTRAINT \`FK_65b4134d1ddc73872e6abee2c17\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE SET NULL ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_ce1f689e43b39edd9330cadaeb8\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
