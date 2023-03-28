import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: '18.221.99.126',
  // host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'password',
  database: 'property_management',
  // entities: [__dirname + '/../**/*.entity.{js,ts}'], // for local use
  entities: ['dist/**/*.entity{.ts,.js}'], // for deployment
  synchronize: true,
};
