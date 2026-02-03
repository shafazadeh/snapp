import { Global, Module } from '@nestjs/common';
import { PostgressService } from './postgress/postgress.service';

@Global()
@Module({
  providers: [PostgressService],
  exports: [PostgressService],
})
export class DatabaseModule {}
