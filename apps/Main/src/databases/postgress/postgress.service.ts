/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class PostgressService implements OnModuleInit {
  public connection: Sequelize;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    try {
      const dbConfig = this.configService.get('Database');

      this.connection = new Sequelize({
        dialect: dbConfig.dialect,
        host: dbConfig.host,
        port: dbConfig.port,
        username: dbConfig.username,
        password: dbConfig.password,
        database: dbConfig.database,
        logging: false,
      });

      await this.connection.authenticate();
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
}
