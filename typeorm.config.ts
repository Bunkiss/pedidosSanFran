import { config } from 'dotenv';
import { DataSource } from 'typeorm';

const env = process.env.NODE_ENV || 'development';

config({ 
    path: `.env.${env}` 
});

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    migrations: [__dirname + '/src/database/migrations/*{.ts,.js}'],
});

/* Migraciones:
npm run migration:generate --name=nombreDeLaMigracion
npm run migration:run
npm run migration:revert
npm run migration:show
*/