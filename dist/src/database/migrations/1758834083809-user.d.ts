import { MigrationInterface, QueryRunner } from "typeorm";
export declare class User1758834083809 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
