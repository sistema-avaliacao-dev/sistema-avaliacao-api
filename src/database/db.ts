import { Sequelize } from 'sequelize-typescript';
import configDatabase from '../config/database';

const sequelize = new Sequelize({
    ...configDatabase.getDatabaseConfig(),
    dialect: 'mysql',
    models: [__dirname + "/models"],
});

export default sequelize