import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobsModule } from './jobs.module';
import { JobEntity } from './job.entity';
import { HealthController } from './health.controller';
@Module({
  imports: [
    TypeOrmModule.forRoot({ type: 'postgres', url: process.env.DATABASE_URL, entities: [JobEntity], synchronize: true, retryAttempts: 10, retryDelay: 3000 }),
    TypeOrmModule.forFeature([JobEntity]), JobsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
