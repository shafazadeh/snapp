import { Global, Module } from '@nestjs/common';
import { PostgresService } from './postgress/postgress.service';
import { RedisService } from './redis/rediis.service';

@Global()
@Module({
  providers: [PostgresService, RedisService],
  exports: [PostgresService, RedisService],
})
export class DatabaseModule {}
