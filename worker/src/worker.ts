import { Worker, Job } from 'bullmq';
import { Pool } from 'pg';
const redisUrl = new URL(process.env.REDIS_URL || 'redis://redis:6379');
const connection = { host: redisUrl.hostname, port: Number(redisUrl.port || 6379), username: redisUrl.username || undefined, password: redisUrl.password || undefined, maxRetriesPerRequest: null };
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
async function processJob(job: Job<{ jobId: string; message: string }>) {
  await pool.query(`UPDATE jobs SET status='processing', "updatedAt"=NOW() WHERE id=$1`, [job.data.jobId]);
  await new Promise(resolve => setTimeout(resolve, 2500));
  const result = `Processed successfully: ${job.data.message}`;
  await pool.query(`UPDATE jobs SET status='completed', result=$2, error=NULL, "updatedAt"=NOW() WHERE id=$1`, [job.data.jobId, result]);
  return { result };
}
const worker = new Worker('assessment-jobs', processJob, { connection, concurrency: 5 });
worker.on('completed', job => console.log(`Job ${job.id} completed`));
worker.on('failed', async (job, error) => {
  console.error(`Job ${job?.id} failed`, error);
  if (job?.data?.jobId) await pool.query(`UPDATE jobs SET status='failed', error=$2, "updatedAt"=NOW() WHERE id=$1`, [job.data.jobId, error.message]).catch(e => console.error(e));
});
worker.on('error', error => console.error('Worker error', error));
async function shutdown() { await worker.close(); await pool.end(); process.exit(0); }
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
console.log('BullMQ worker listening');
