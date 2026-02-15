/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';

import * as models from './models';

import config from 'config';
const pgConfig: any = config.get('databases.postgres.core');

@Injectable()
export class PostgresService implements OnModuleInit {
  public connection: Sequelize;
  private logger = new Logger('databases/postgres/postgres.service');

  async onModuleInit() {
    console.log('🔹 Trying to connect to database with config');

    const sequelizeInstance = new Sequelize({
      dialect: pgConfig.dialect,
      host: pgConfig.host,
      port: pgConfig.port,
      username: pgConfig.username,
      password: pgConfig.password,
      database: pgConfig.database,
      logging: false,
    });
    sequelizeInstance.addModels(Object.values(models));

    models.Admin.hasMany(models.AdminSession, {
      foreignKey: 'adminId',
      as: 'sessions',
    });
    models.AdminSession.belongsTo(models.Admin, {
      foreignKey: 'adminId',
      as: 'profile',
    });
    models.Admin.addScope('withoutPassword', {
      attributes: {
        exclude: ['password', 'salt'],
      },
    });

    models.Driver.hasOne(models.DriverSession, {
      foreignKey: 'driverId',
      as: 'session',
    });
    models.DriverSession.belongsTo(models.Driver, {
      foreignKey: 'driverId',
      as: 'driver',
    });

    try {
      await sequelizeInstance.sync({ alter: true });
    } catch (e) {
      this.logger.fatal('Syncing error');
      this.logger.fatal(e);
      console.log(e);
      process.exit(1);
    }
    this.logger.verbose('Postgres database is connected!');
    this.connection = sequelizeInstance;
  }

  public models = models;
}
