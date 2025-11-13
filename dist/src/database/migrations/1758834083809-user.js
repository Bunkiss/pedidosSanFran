"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User1758834083809 = void 0;
class User1758834083809 {
    name = 'User1758834083809';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`nombre\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`telefono\` varchar(255) NOT NULL, \`contraseña\` varchar(255) NOT NULL, \`rol\` varchar(255) NOT NULL DEFAULT 'user', \`estado\` tinyint NOT NULL DEFAULT 1, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }
    async down(queryRunner) {
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }
}
exports.User1758834083809 = User1758834083809;
//# sourceMappingURL=1758834083809-user.js.map