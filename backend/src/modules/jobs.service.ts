import { Injectable, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Repository } from 'typeorm';
import { JobEntity } from './job.entity';
@Injectable()
export class JobsService {
  private readonly queue = new Queue('assessment-jobs', { connection: this.redisConnection() });
  constructor(@InjectRepository(JobEntity) private readonly repo: Repository<JobEntity>) {}
  private redisConnection() {
    const url = new URL(process.env.REDIS_URL || 'redis://redis:6379');
    return { host: url.hostname, port: Number(url.port || 6379), username: url.username || undefined, password: url.password || undefined, maxRetriesPerRequest: null };
  }
  async create(message: string) {
    const record = await this.repo.save(this.repo.create({ message, status: 'queued' }));
    try {
      await this.queue.add('process-message', { jobId: record.id, message }, { attempts: 3, backoff: { type: 'exponential', delay: 1000 }, removeOnComplete: 100, removeOnFail: 100 });
    } catch {
      record.status = 'failed'; record.error = 'Unable to enqueue job'; await this.repo.save(record);
      throw new ServiceUnavailableException('Queue is unavailable');
    }
    return { id: record.id, status: record.status };
  }
  async get(id: string) {
    const record = await this.repo.findOne({ where: { id } });
    if (!record) throw new NotFoundException('Job not found');
    return record;
  }
}
