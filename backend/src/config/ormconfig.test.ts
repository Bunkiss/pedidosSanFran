import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';

const ormConfigTest: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  synchronize: true, 
  dropSchema: true, 
};

export default ormConfigTest;