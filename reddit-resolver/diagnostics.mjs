import { AsyncLocalStorage } from 'node:async_hooks';
import { randomBytes } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import { readFileSync } from 'node:fs';
import { TOPICS } from './selection.mjs';

const context = new AsyncLocalStorage();
const STAGES = new Set(['cache-hit', 'source-cache-hit', 'coalesced', 'busy', 'resolve-start',
  'browser-start', 'browser-ready', 'navigation', 'post-found', 'post-snapshot',
  'waiting-widget', 'waiting-challenge', 'checkbox-clicked', 'challenge-visible',
  'detect-start', 'detect-done', 'grid-split-start', 'grid-split-done', 'classify-start', 'classify-done',
  'verification-submitted', 'challenge-expired-restart', 'challenge-reload', 'localization',
  'classification', 'challenge-rejected', 'proxy-session-retry', 'audio-submitted', 'audio-unavailable']);
const TARGETS = new Set(Object.keys(TOPICS));
const CODES = new Set(['ADULT_CONTENT', 'AGE_UNVERIFIED', 'INVALID_URL', 'INVALID_CROSSPOST',
  'NO_MEDIA', 'POST_UNAVAILABLE', 'POST_MISMATCH', 'CHALLENGE_TIMEOUT', 'CHALLENGE_EXPIRED',
  'CHALLENGE_REJECTED', 'CHALLENGE_NOT_LOADED', 'CAPTCHA_NETWORK_BLOCKED', 'RATE_LIMITED',
  'NETWORK_BLOCKED', 'IMAGES_TIMEOUT', 'UNSUPPORTED_CHALLENGE', 'PROXY_CONFIG_INVALID',
  'INFERENCE_UNAVAILABLE', 'INFERENCE_TIMEOUT', 'BUSY', 'UNAVAILABLE'].map(value => `REDDIT_${value}`));
const code = error => CODES.has(error?.message) ? error.message : 'REDDIT_UNAVAILABLE';
const integer = (value, max) => Number.isInteger(value) && value >= 0 && value <= max;

function resourceCounters() {
  try {
    const read = name => readFileSync(`/sys/fs/cgroup/${name}`, 'utf8');
    const pairs = name => Object.fromEntries(read(name).trim().split('\n').map(line => line.split(/\s+/)));
    const memory = pairs('memory.events'), cpu = pairs('cpu.stat');
    const result = { memoryBytes: Number(read('memory.current')), swapBytes: Number(read('memory.swap.current')),
      memoryMax: Number(memory.max), oomKills: Number(memory.oom_kill),
      cpuMicros: Number(cpu.usage_usec), throttledMicros: Number(cpu.throttled_usec) };
    return Object.values(result).every(Number.isFinite) ? result : null;
  } catch { return null; }
}

export class ResolveTrace {
  constructor({ clock = () => performance.now() } = {}) {
    this.clock = clock; this.start = clock(); this.id = randomBytes(6).toString('hex');
    this.steps = []; this.counts = {}; this.dropped = 0; this.resources = resourceCounters();
  }
  record(event) {
    if (!STAGES.has(event?.stage)) return;
    const step = { stage: event.stage };
    for (const [key, max] of [['round', 18], ['count', 16], ['status', 599], ['durationMs', 3600000]]) {
      if (integer(event[key], max)) step[key] = event[key];
    }
    if (TARGETS.has(event.target)) step.target = event.target;
    if (['gb', 'us', 'de'].includes(event.country)) step.country = event.country;
    for (const key of ['matchedPost', 'correctId', 'hasPostType', 'anchorChecked']) if (typeof event[key] === 'boolean') step[key] = event[key];
    if (Array.isArray(event.selected) && event.selected.length <= 16) step.selectedCount = event.selected.length;
    this.counts[event.stage] = Math.min(1000000, (this.counts[event.stage] || 0) + 1);
    const signature = JSON.stringify(step);
    if (signature === this.signature) return;
    this.signature = signature;
    step.atMs = Math.max(0, Math.round(this.clock() - this.start));
    this.steps.push(step);
    if (this.steps.length > 32) { this.steps.shift(); this.dropped++; }
  }
  finish(error) {
    const end = resourceCounters();
    const resources = this.resources && end ? { start: this.resources, end,
      memoryMaxEvents: Math.max(0, end.memoryMax - this.resources.memoryMax),
      oomKills: Math.max(0, end.oomKills - this.resources.oomKills),
      cpuMicros: Math.max(0, end.cpuMicros - this.resources.cpuMicros),
      throttledMicros: Math.max(0, end.throttledMicros - this.resources.throttledMicros) } : undefined;
    return { event: 'reddit-resolve', requestId: this.id, ok: !error,
      elapsedMs: Math.max(0, Math.round(this.clock() - this.start)), ...(error ? { code: code(error) } : {}),
      lastStage: this.steps.at(-1)?.stage || 'none', ...(resources ? { resources } : {}), stages: this.steps, counts: this.counts, dropped: this.dropped };
  }
}
export function resolverEvent(event) { try { context.getStore()?.record(event); } catch { /* Diagnostics cannot interrupt work. */ } }
export async function traceResolution(task, { emit = entry => console.log(JSON.stringify(entry)), ...options } = {}) {
  const trace = new ResolveTrace(options);
  const report = error => { try { emit(trace.finish(error)); } catch { /* Logging cannot change the response. */ } };
  return context.run(trace, async () => {
    try { const result = await task(); report(); return result; }
    catch (error) { report(error); throw error; }
  });
}
