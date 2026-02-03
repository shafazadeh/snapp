/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ConfigService } from '@nestjs/config';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RedisService implements OnModuleInit {
  private logger = new Logger('database/redis/redis.service');

  public cacheCli!: Redis;
  public sessionCli!: Redis;

  constructor(private configService: ConfigService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async onModuleInit() {
    const cacheClient = new Redis({
      host: this.configService.get('Redis.host'),
      port: this.configService.get('Redis.port'),
      db: this.configService.get('Redis.cacheDb'),
      retryStrategy: (times) => {
        const delay = Math.min(times * 10, 2000);
        return delay;
      },
    });

    cacheClient.on('error', (err) => {
      this.logger.fatal('failed to connect to redis db ');
      this.logger.fatal(err);
      process.exit(1);
    });

    cacheClient.on('connect', () => {
      this.logger.verbose('coonnect to redis ');
    });

    this.cacheCli = cacheClient;

    const sessionClient = new Redis({
      host: this.configService.get('Redis.host'),
      port: this.configService.get('Redis.port'),
      db: this.configService.get('Redis.sessionDb'),
      retryStrategy: (times) => {
        const delay = Math.min(times * 10, 2000);
        return delay;
      },
    });

    sessionClient.on('error', (err) => {
      this.logger.fatal('Failed to connect to Redis Session DB');
      this.logger.fatal(err);
      process.exit(1);
    });

    sessionClient.on('connect', () => {
      this.logger.verbose('Connected to Redis Session DB');
    });

    this.sessionCli = sessionClient;
  }
  async onModuleDestroy() {
    if (this.cacheCli) await this.cacheCli.quit();
    if (this.sessionCli) await this.sessionCli.quit();
  }
}
