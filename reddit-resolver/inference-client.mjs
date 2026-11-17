import { fork } from 'node:child_process';
import { validInferenceInput, validInferenceResult } from './inference-protocol.mjs';

const unavailable = () => new Error('REDDIT_INFERENCE_UNAVAILABLE');
export class InferenceClient {
  constructor({ idleMs = 120000, shutdownMs = 2000, worker = new URL('./inference-worker.mjs', import.meta.url), spawn = fork } = {}) {
    this.idleMs = idleMs; this.shutdownMs = shutdownMs; this.worker = worker; this.spawn = spawn;
    this.queue = []; this.current = null; this.child = null; this.leases = 0; this.sequence = 0; this.closed = false;
  }
  hold() {
    this.leases++; clearTimeout(this.idleTimer);
    let released = false;
    return () => { if (!released) { released = true; this.leases--; this.armIdle(); } };
  }
  run(op, payload, { deadline = Date.now() + 200000 } = {}) {
    if (this.closed || !validInferenceInput(op, payload) || !Number.isFinite(deadline) || deadline <= Date.now() || this.queue.length >= 8) return Promise.reject(unavailable());
    clearTimeout(this.idleTimer);
    return new Promise((resolve, reject) => {
      const job = { id: ++this.sequence, op, payload, resolve, reject };
      job.timer = setTimeout(() => this.fail(new Error('REDDIT_INFERENCE_TIMEOUT')), Math.min(200000, deadline - Date.now()));
      this.queue.push(job); this.pump();
    });
  }
  start() {
    // Inference has no reason to receive proxy credentials or browser secrets.
    const env = { PATH: process.env.PATH || '/usr/bin:/bin', MODEL_CACHE_DIR: process.env.MODEL_CACHE_DIR || '/models',
      MODEL_OFFLINE: '1', NODE_ENV: 'production', OMP_NUM_THREADS: '1' };
    const child = this.spawn(this.worker, [], { env, serialization: 'advanced', execArgv: [], stdio: ['ignore', 'ignore', 'ignore', 'ipc'] });
    this.child = child;
    this.stopped = new Promise(resolve => { this.resolveStopped = resolve; });
    child.on('message', message => {
      if (child !== this.child || this.stopping) return;
      const job = this.current;
      if (!job || message?.id !== job.id || !message.ok || !validInferenceResult(job.op, message.result, job.payload)) { this.fail(unavailable()); return; }
      clearTimeout(job.timer); this.current = null; job.resolve(message.result); this.pump();
    });
    child.on('error', () => { if (child === this.child && !this.stopping) this.fail(unavailable()); });
    child.on('close', () => {
      if (child !== this.child) return;
      clearTimeout(this.killTimer);
      const expected = this.stopping;
      this.child = null; this.stopping = false;
      this.resolveStopped?.(); this.resolveStopped = null;
      if (!expected) this.rejectJobs(unavailable());
      this.pump();
    });
  }
  pump() {
    if (this.stopping || this.closed || this.current) return;
    if (!this.queue.length) { this.armIdle(); return; }
    try {
      if (!this.child) this.start();
      const job = this.current = this.queue.shift();
      const child = this.child;
      child.send({ id: job.id, op: job.op, payload: job.payload }, error => { if (error && child === this.child && !this.stopping) this.fail(unavailable()); });
    } catch { this.fail(unavailable()); }
  }
  armIdle() {
    clearTimeout(this.idleTimer);
    if (this.closed || !this.child || this.stopping || this.leases || this.current || this.queue.length) return;
    this.idleTimer = setTimeout(() => { if (!this.leases && !this.current && !this.queue.length) this.stop(); }, this.idleMs);
    this.idleTimer.unref();
  }
  rejectJobs(error) {
    const jobs = [...(this.current ? [this.current] : []), ...this.queue];
    this.current = null; this.queue = [];
    for (const job of jobs) { clearTimeout(job.timer); job.reject(error); }
  }
  fail(error) { this.rejectJobs(error); this.stop(); }
  stop() {
    clearTimeout(this.idleTimer);
    if (!this.child || this.stopping) return;
    this.stopping = true;
    const child = this.child;
    child.kill('SIGTERM');
    this.killTimer = setTimeout(() => { if (this.child === child) child.kill('SIGKILL'); }, this.shutdownMs);
    this.killTimer.unref();
  }
  async close() {
    this.closed = true; this.rejectJobs(unavailable()); this.stop();
    if (this.child) await this.stopped;
  }
}
let shared;
export function getInferenceClient() { return shared ??= new InferenceClient(); }
