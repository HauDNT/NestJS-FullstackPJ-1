import { DataSource, DataSourceOptions } from "typeorm";

export const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 5000,
    username: 'root',
    password: '123456',
    database: 'nestjs-freeCodeCamp',
    entities: ['dist/**/*.entity.js'],
    synchronize: false,
    migrations: ['dist/db/migrations/*.js'],
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;