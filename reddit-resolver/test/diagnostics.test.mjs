import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ResolveTrace, resolverEvent, traceResolution } from '../diagnostics.mjs';
import { RedditResolver } from '../resolver.mjs';

test('diagnostics retain only safe bounded fields, never raw inputs or errors', () => {
  const secret = 'http://private-user:private-password@proxy.example:1234';
  const trace = new ResolveTrace({ clock: () => 5 });
  trace.record({ stage: 'classification', target: 'cars', round: 1, count: 9,
    selected: [1, 2], proxy: secret, scores: [secret], url: secret, text: secret, html: secret });
  trace.record({ stage: 'post-snapshot', matchedPost: true, correctId: false, hasPostType: false, attributes: { title: secret } });
  trace.record({ stage: secret, target: secret });
  trace.record({ stage: 'navigation', status: secret, target: secret, country: secret });
  const result = trace.finish(new Error(secret));
  assert.equal(JSON.stringify(result).includes('private-'), false);
  assert.equal(result.code, 'REDDIT_UNAVAILABLE');
  assert.equal(result.stages[0].selectedCount, 2); assert.equal(result.stages[0].target, 'cars');
  assert.equal(result.counts.classification, 1); assert.equal(result.stages[1].hasPostType, false);
  assert.match(result.requestId, /^[a-f0-9]{12}$/);
  assert.equal(trace.finish(new Error('REDDIT_PRIVATE_SECRET')).code, 'REDDIT_UNAVAILABLE');
});

test('a long trace is bounded and repeated waiting states are compressed', () => {
  let time = 0; const trace = new ResolveTrace({ clock: () => time });
  for (let i = 0; i < 2000; i++) { time++; trace.record({ stage: 'waiting-challenge' }); }
  assert.equal(trace.steps.length, 1); assert.equal(trace.counts['waiting-challenge'], 2000);
  for (let i = 0; i < 100; i++) trace.record({ stage: i % 2 ? 'detect-start' : 'detect-done', durationMs: 10 });
  assert.equal(trace.steps.length, 32); assert.equal(trace.dropped, 69);
  assert.ok(JSON.stringify(trace.finish(new Error('REDDIT_CHALLENGE_TIMEOUT'))).length < 16000);
});

test('timeout summaries identify the last phase and measured operation duration', async () => {
  let time = 0; const logs = []; const error = new Error('REDDIT_CHALLENGE_TIMEOUT');
  await assert.rejects(traceResolution(async () => {
    resolverEvent({ stage: 'proxy-session-retry', country: 'us' }); time = 1000;
    resolverEvent({ stage: 'detect-start', round: 1, count: 16 }); time = 30000;
    resolverEvent({ stage: 'detect-done', round: 1, count: 16, durationMs: 29000 });
    resolverEvent({ stage: 'waiting-challenge' }); time = 220000; throw error;
  }, { clock: () => time, emit: e => logs.push(e) }), e => e === error);
  assert.equal(logs.length, 1); assert.equal(logs[0].elapsedMs, 220000);
  assert.equal(logs[0].lastStage, 'waiting-challenge'); assert.equal(logs[0].code, error.message);
  assert.equal(logs[0].stages[2].durationMs, 29000); assert.equal(logs[0].stages[0].country, 'us');
});

test('concurrent asynchronous resolutions keep separate traces', async () => {
  const logs = []; let release;
  const gate = new Promise(resolve => { release = resolve; });
  const first = traceResolution(async () => { resolverEvent({ stage: 'detect-start' }); await gate;
    resolverEvent({ stage: 'detect-done' }); return 'first'; }, { emit: e => logs.push(e) });
  const second = traceResolution(async () => { resolverEvent({ stage: 'cache-hit' }); return 'second'; }, { emit: e => logs.push(e) });
  assert.equal(await second, 'second'); release(); assert.equal(await first, 'first');
  const hit = logs.find(l => l.counts['cache-hit']); const detection = logs.find(l => l.counts['detect-start']);
  assert.notEqual(hit.requestId, detection.requestId); assert.equal(hit.counts['detect-done'], undefined);
  assert.equal(detection.counts['cache-hit'], undefined); assert.equal(detection.counts['detect-done'], 1);
});

test('coalesced requests preserve the original result and do not mix source traces', async () => {
  const logs = []; let release; const gate = new Promise(resolve => { release = resolve; });
  const resolver = new RedditResolver({ onEvent: resolverEvent });
  resolver.resolvePost = async () => { resolverEvent({ stage: 'classify-start' }); await gate;
    resolverEvent({ stage: 'classify-done' }); return { id: 'abc123', over_18: false, age_verified: true }; };
  const url = 'https://www.reddit.com/comments/abc123/';
  const a = traceResolution(() => resolver.resolve(url), { emit: e => logs.push(e) });
  await Promise.resolve();
  const b = traceResolution(() => resolver.resolve(url), { emit: e => logs.push(e) });
  release(); assert.deepEqual(await a, await b);
  const joined = logs.find(l => l.counts.coalesced); const original = logs.find(l => l.counts['resolve-start']);
  assert.equal(joined.counts['classify-done'], undefined); assert.equal(original.counts['classify-done'], 1);
  assert.equal(resolver.inference.leases, 0); await resolver.shutdown();
});

test('logging failure cannot alter successful or refused responses', async () => {
  const emit = () => { throw new Error('log sink unavailable'); };
  assert.equal(await traceResolution(async () => 42, { emit }), 42);
  const adult = new Error('REDDIT_ADULT_CONTENT');
  await assert.rejects(traceResolution(async () => { throw adult; }, { emit }), e => e === adult);
});
