/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

import Redis from 'ioredis';
import config from 'config';
const redisConfig: any = config.get('databases.redis');

@Injectable()
export class RedisService implements OnModuleInit {
  private logger = new Logger('databases/redis/redis.service');

  public cacheCli!: Redis;
  public sessionCli!: Redis;

  async onModuleInit() {
    const cacheClient = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      db: redisConfig.cacheDb,
    });
    cacheClient.on('error', (e) => {
      this.logger.fatal('cacheClient connecting error');
      this.logger.fatal(e);
      process.exit(1);
    });
    cacheClient.on('connect', () => {
      this.logger.verbose('cacheClient is connected!');
    });
    this.cacheCli = cacheClient;

    const sessionClient = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      db: redisConfig.sessionDb,
    });

    sessionClient.on('error', (e) => {
      this.logger.fatal('sessionClient connecting error');
      this.logger.fatal(e);
      process.exit(1);
    });
    sessionClient.on('connect', () => {
      this.logger.verbose('sessionClient is connected!');
    });
    this.sessionCli = sessionClient;
  }
}
