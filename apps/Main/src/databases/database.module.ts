import { Global, Module } from '@nestjs/common';
import { RedisService } from './redis/redis.service';
import { PostgresService } from './postgres/postgres.service';

@Global()
@Module({
  providers: [PostgresService, RedisService],
  exports: [PostgresService, RedisService],
})
export class DatabaseModule {}
