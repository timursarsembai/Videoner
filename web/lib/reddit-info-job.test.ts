import { test } from 'node:test';
import assert from 'node:assert/strict';
import { waitForRedditInfo } from './reddit-info-job';

test('a slow metadata job completes through short polls without a long HTTP request', async () => {
  let elapsed = 0, calls = 0;
  const result = await waitForRedditInfo(async () => {
    calls++;
    return elapsed < 183000 ? { state: 'pending' as const } : { state: 'completed' as const, result: { id: 'post' } };
  }, { now: () => elapsed, wait: async ms => { elapsed += ms; } });
  assert.deepEqual(result, { id: 'post' });
  assert.ok(calls > 50 && calls < 70);
});

test('job failures preserve the adult-content message for existing translations', async () => {
  await assert.rejects(waitForRedditInfo(async () => ({ state: 'failed', message: 'Adult content: blocked', statusCode: 400 })),
    error => (error as { message: string }).message === 'Adult content: blocked');
});

test('polling stops when a job never finishes', async () => {
  let elapsed = 0;
  await assert.rejects(waitForRedditInfo(async () => ({ state: 'pending' }), {
    now: () => elapsed, wait: async ms => { elapsed += ms; },
  }), error => (error as { statusCode: number }).statusCode === 504);
  assert.equal(elapsed, 240000);
});

test('a temporary polling rate limit does not abandon the running job', async () => {
  let calls = 0, elapsed = 0;
  const result = await waitForRedditInfo(async () => {
    if (++calls === 1) throw { statusCode: 429 };
    return { state: 'completed', result: 'ready' };
  }, { now: () => elapsed, wait: async ms => { elapsed += ms; } });
  assert.equal(result, 'ready'); assert.equal(elapsed, 3000);
});
