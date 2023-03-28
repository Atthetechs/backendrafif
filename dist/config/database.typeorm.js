"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
exports.typeOrmConfig = {
    type: 'postgres',
    host: '18.221.99.126',
    port: 5432,
    username: 'postgres',
    password: 'password',
    database: 'property_management',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
};
//# sourceMappingURL=database.typeorm.js.map