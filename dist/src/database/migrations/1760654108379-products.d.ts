import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Products1760654108379 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
