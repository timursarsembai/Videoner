import { BadRequestException, Injectable, NotFoundException, OnModuleDestroy, ServiceUnavailableException } from '@nestjs/common';
import { randomUUID } from 'crypto';

const UNAVAILABLE = 'Reddit server access unavailable';
type Job = {
  owner: string; expires: number; timer: ReturnType<typeof setTimeout>;
  state: 'pending' | 'completed' | 'failed'; result?: unknown; message?: string;
};

@Injectable()
export class InfoJobsService implements OnModuleDestroy {
  private jobs = new Map<string, Job>();

  start(owner: string, work: () => Promise<unknown>) {
    this.prune();
    if (this.jobs.size >= 100 || [...this.jobs.values()].filter(j => j.owner === owner && j.state === 'pending').length >= 2) {
      throw new ServiceUnavailableException(UNAVAILABLE);
    }
    const jobId = randomUUID();
    const job: Job = { owner, expires: Date.now() + 5 * 60000, state: 'pending', timer: null! };
    job.timer = setTimeout(() => { job.state = 'failed'; job.message = UNAVAILABLE; job.expires = Date.now() + 120000; }, 230000);
    job.timer.unref();
    this.jobs.set(jobId, job);
    // Never hold a browser-facing HTTP request while extraction is running.
    void Promise.resolve().then(work).then(result => {
      if (job.state === 'pending') { job.state = 'completed'; job.result = result; job.expires = Date.now() + 120000; }
    }, error => {
      if (job.state === 'pending') {
        job.state = 'failed';
        job.expires = Date.now() + 120000;
        job.message = error instanceof BadRequestException ? error.message : UNAVAILABLE;
      }
    }).finally(() => clearTimeout(job.timer));
    return { jobId, state: 'pending' as const };
  }

  get(owner: string, id: string) {
    this.prune();
    const job = this.jobs.get(id);
    if (!job || job.owner !== owner) throw new NotFoundException(UNAVAILABLE);
    if (job.state === 'completed') return { state: job.state, result: job.result };
    if (job.state === 'failed') return { state: job.state, message: job.message, statusCode: 400 };
    return { state: job.state };
  }

  private prune() {
    for (const [id, job] of this.jobs) if (job.expires <= Date.now()) {
      clearTimeout(job.timer); this.jobs.delete(id);
    }
  }

  onModuleDestroy() {
    for (const job of this.jobs.values()) clearTimeout(job.timer);
    this.jobs.clear();
  }
}
