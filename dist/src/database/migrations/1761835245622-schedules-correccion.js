"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulesCorreccion1761835245622 = void 0;
class SchedulesCorreccion1761835245622 {
    name = 'SchedulesCorreccion1761835245622';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` CHANGE \`dia\` \`dia\` enum ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` CHANGE \`dia\` \`dia\` enum ('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` CHANGE \`dia\` \`dia\` enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`vendor_schedules\` CHANGE \`dia\` \`dia\` enum ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL`);
    }
}
exports.SchedulesCorreccion1761835245622 = SchedulesCorreccion1761835245622;
//# sourceMappingURL=1761835245622-schedules-correccion.js.map