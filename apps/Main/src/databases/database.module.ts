import { Global, Module } from '@nestjs/common';
import { PostgressService } from './postgress/postgress.service';
import { RedisService } from './redis/rediis.service';

@Global()
@Module({
  providers: [PostgressService, RedisService],
  exports: [PostgressService, RedisService],
})
export class DatabaseModule {}
