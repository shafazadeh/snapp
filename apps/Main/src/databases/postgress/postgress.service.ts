/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Logger } from '@nestjs/common';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';
import * as models from './models';
@Injectable()
export class PostgressService implements OnModuleInit {
  public connection: Sequelize;
  private logger = new Logger('database/postgress/postgress.service');
  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const dbConfig = this.configService.get('Database');

    const sequelizeInstance = new Sequelize({
      dialect: dbConfig.dialect,
      host: dbConfig.host,
      port: dbConfig.port,
      username: dbConfig.username,
      password: dbConfig.password,
      database: dbConfig.database,
      logging: false,
    });

    sequelizeInstance.addModels(Object.values(models));
    models.Driver.hasOne(models.DriverSeesion, {
      foreignKey: 'driverId',
      as: 'session',
    });

    models.DriverSeesion.belongsTo(models.Driver, {
      foreignKey: 'driverId',
      as: 'driver',
    });

    try {
      await sequelizeInstance.sync({ alter: true });
    } catch (error) {
      this.logger.fatal('syncing error');
      this.logger.fatal(error);
      process.exit(1);
    }
    this.logger.verbose('postgres  database is connected');
    this.connection = sequelizeInstance;
  }

  public models = models;
}
