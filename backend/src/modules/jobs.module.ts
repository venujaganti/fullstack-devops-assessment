import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JobEntity } from './job.entity';
@Module({
  imports: [TypeOrmModule.forFeature([JobEntity])],
  controllers: [JobsController],
  providers: [JobsService],
})
export class JobsModule {}
