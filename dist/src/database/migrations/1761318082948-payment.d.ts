import { MigrationInterface, QueryRunner } from "typeorm";
export declare class Payment1761318082948 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
