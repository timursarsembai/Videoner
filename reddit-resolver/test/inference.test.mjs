import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fork } from 'node:child_process';
import { InferenceClient } from '../inference-client.mjs';
const worker = new URL('./fixtures/inference-worker.mjs', import.meta.url);
const payload = text => ({ buffer: Buffer.from(text) });
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(predicate) {
  for (let i = 0; i < 200; i++) { if (predicate()) return; await wait(10); }
  assert.fail('Condition did not become true');
}
function client(options = {}) { return new InferenceClient({ worker, idleMs: 40, shutdownMs: 40, ...options }); }

test('inference is lazy, serial, uses one child, and does not forward secrets', async () => {
  const c = client(); const release = c.hold();
  const old = process.env.INFERENCE_TEST_SECRET; process.env.INFERENCE_TEST_SECRET = 'test-only-not-forwarded';
  try {
    assert.equal(c.child, null);
    const [a, b] = await Promise.all([c.run('detect', payload('slow')), c.run('detect', payload('echo'))]);
    assert.equal(a[0].pid, b[0].pid); assert.equal(a[0].secretPresent, false);
    assert.deepEqual([a[0].command, b[0].command], ['slow', 'echo']);
    await wait(80); assert.ok(c.child, 'lease must keep worker during a post');
    release(); await until(() => !c.child);
  } finally { if (old === undefined) delete process.env.INFERENCE_TEST_SECRET; else process.env.INFERENCE_TEST_SECRET = old; release(); await c.close(); }
});

test('a new request after idle starts a new worker', async () => {
  const c = client();
  try {
    const a = await c.run('detect', payload('echo'));
    await until(() => !c.child);
    const b = await c.run('detect', payload('echo'));
    assert.notEqual(a[0].pid, b[0].pid);
  } finally { await c.close(); }
});

test('requests arriving during shutdown wait for the old child to exit', async () => {
  const c = client({ idleMs: 10000 });
  try {
    const a = await c.run('detect', payload('echo')); c.stop();
    const b = await c.run('detect', payload('echo'));
    assert.notEqual(a[0].pid, b[0].pid);
  } finally { await c.close(); }
});

test('a crashed worker rejects active and queued work, then can recover', async () => {
  const c = client();
  try {
    const result = await Promise.allSettled([c.run('detect', payload('crash')), c.run('detect', payload('echo'))]);
    assert.ok(result.every(r => r.status === 'rejected' && /INFERENCE_UNAVAILABLE/.test(r.reason.message)));
    assert.equal((await c.run('detect', payload('echo')))[0].command, 'echo');
  } finally { await c.close(); }
});

test('deadline terminates a stuck worker including one ignoring SIGTERM', async () => {
  const c = client();
  try {
    await assert.rejects(c.run('detect', payload('hang'), { deadline: Date.now() + 1000 }), /INFERENCE_TIMEOUT/);
    await until(() => !c.child);
    assert.equal((await c.run('detect', payload('echo')))[0].command, 'echo');
  } finally { await c.close(); }
});

test('invalid input and expired deadlines never launch a child', async () => {
  const c = client();
  try {
    await assert.rejects(c.run('detect', { buffer: Buffer.alloc(4 * 1024 * 1024 + 1) }), /INFERENCE_UNAVAILABLE/);
    await assert.rejects(c.run('detect', payload('echo'), { deadline: Date.now() - 1 }), /INFERENCE_UNAVAILABLE/);
    await assert.rejects(c.run('transcribe', { samples: [NaN] }), /INFERENCE_UNAVAILABLE/);
    assert.equal(c.child, null);
  } finally { await c.close(); }
});

test('invalid worker output rejects safely and does not poison later work', async () => {
  const c = client();
  try {
    await assert.rejects(c.run('detect', payload('bad')), /INFERENCE_UNAVAILABLE/);
    assert.equal((await c.run('detect', payload('echo')))[0].command, 'echo');
  } finally { await c.close(); }
});

test('close rejects all pending work and prevents further startup', async () => {
  const c = client();
  const rejected = assert.rejects(c.run('detect', payload('slow')), /INFERENCE_UNAVAILABLE/);
  await c.close(); await rejected;
  assert.equal(c.child, null);
  await assert.rejects(c.run('detect', payload('echo')), /INFERENCE_UNAVAILABLE/);
});

test('spawn failures are bounded and the queue is cleared', async () => {
  const c = client({ spawn: () => { throw new Error('private failure details'); } });
  await assert.rejects(c.run('detect', payload('echo')), /^Error: REDDIT_INFERENCE_UNAVAILABLE$/);
  assert.equal(c.current, null); assert.equal(c.queue.length, 0); await c.close();
});

test('the queued IPC work has a fixed upper bound', async () => {
  const c = client();
  const jobs = Array.from({ length: 9 }, () => c.run('detect', payload('slow')).catch(e => e));
  await assert.rejects(c.run('detect', payload('echo')), /INFERENCE_UNAVAILABLE/);
  await c.close(); await Promise.all(jobs);
});

test('importing the HTTP/browser path does not load native model libraries', async () => {
  const child = fork(new URL('./fixtures/import-check.mjs', import.meta.url), [], { env: { PATH: process.env.PATH }, stdio: ['ignore', 'pipe', 'pipe', 'ipc'] });
  let out = ''; let err = ''; child.stdout.on('data', b => out += b); child.stderr.on('data', b => err += b);
  const code = await new Promise(resolve => child.on('close', resolve));
  assert.equal(code, 0, err); assert.equal(JSON.parse(out).heavy, false);
});
