import { MigrationInterface, QueryRunner } from "typeorm";
export declare class SchedulesCorreccion1761835245622 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
