import { MigrationInterface, QueryRunner } from "typeorm";

export class SchedulesCorreccion1761835245622 implements MigrationInterface {
    name = 'SchedulesCorreccion1761835245622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` CHANGE \`dia\` \`dia\` enum ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` CHANGE \`dia\` \`dia\` enum ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` CHANGE \`dia\` \`dia\` enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` CHANGE \`dia\` \`dia\` enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL`);
    }

}
