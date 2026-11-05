'use client';
import { FormEvent, useEffect, useState } from 'react';
type Job = { id: string; message: string; status: string; result?: string | null; error?: string | null };
const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export default function Home() {
  const [message, setMessage] = useState('Generate a welcome summary');
  const [job, setJob] = useState<Job | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError(''); setJob(null);
    try {
      const response = await fetch(`${API}/jobs`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message }) });
      if (!response.ok) throw new Error(`API returned ${response.status}`);
      const created = await response.json(); setJob({ id: created.id, message, status: created.status });
    } catch (e) { setError(e instanceof Error ? e.message : 'Request failed'); }
    finally { setBusy(false); }
  }
  useEffect(() => {
    if (!job?.id || ['completed', 'failed'].includes(job.status)) return;
    const timer = setInterval(async () => {
      try { const response = await fetch(`${API}/jobs/${job.id}`); if (response.ok) setJob(await response.json()); } catch { /* retry next interval */ }
    }, 1200);
    return () => clearInterval(timer);
  }, [job?.id, job?.status]);
  return <main className="shell"><section className="panel">
    <p className="eyebrow">DEVOPS IMPLEMENTATION ASSESSMENT</p><h1>Async job processing demo</h1>
    <p className="intro">Submit a task to NestJS. BullMQ queues it in Redis, a separate worker processes it, and PostgreSQL stores the result.</p>
    <form onSubmit={submit}><label htmlFor="message">Task message</label>
      <textarea id="message" value={message} maxLength={500} onChange={e => setMessage(e.target.value)} required />
      <button disabled={busy || !message.trim()}>{busy ? 'Submitting…' : 'Submit background job'}</button>
    </form>
    {error && <p className="error" role="alert">{error}</p>}
    {job && <div className="result" aria-live="polite"><div className="statusline"><h2>Job status</h2><span className={`pill ${job.status}`}>{job.status}</span></div>
      <p className="muted">Job ID: <code>{job.id}</code></p>{job.result && <p className="success">{job.result}</p>}
      {job.error && <p className="error">{job.error}</p>}{!['completed','failed'].includes(job.status) && <p className="muted">Waiting for worker…</p>}
    </div>}
    <footer>Next.js · NestJS · PostgreSQL · Redis · BullMQ · Docker Compose</footer>
  </section></main>;
}
