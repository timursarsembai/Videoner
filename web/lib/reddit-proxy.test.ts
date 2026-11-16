import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import axios from 'axios';
import { createHmac } from 'node:crypto';

process.env.API_INTERNAL_URL = 'http://api.test';
process.env.API_KEY = 'test-key';
process.env.TURNSTILE_SECRET = 'test-secret';
process.env.NEXT_PUBLIC_APP_URL = 'https://site.test';
let proxyApiRequest: typeof import('./api-proxy').proxyApiRequest;
const fetchOriginal = global.fetch;
const adapterOriginal = axios.defaults.adapter;
const options = { allowedPaths: [{ method: 'POST', path: 'info' }, { method: 'GET', path: 'info/jobs/:id' }],
  allowVisitor: () => true, requireCaptcha: true, source: 'WEB' as const };
before(async () => { ({ proxyApiRequest } = await import('./api-proxy')); });
after(() => { global.fetch = fetchOriginal; axios.defaults.adapter = adapterOriginal; });

test('site Reddit creation still requires Turnstile and requests async extraction with a short timeout', async () => {
  global.fetch = async () => Response.json({ success: true });
  let calls = 0;
  axios.defaults.adapter = async config => {
    calls++;
    assert.equal(config.timeout, 20000); assert.equal(config.headers.get('Prefer'), 'respond-async');
    assert.equal(config.headers.get('X-Info-Visitor'), createHmac('sha256', 'test-key').update('198.51.100.10').digest('hex'));
    const body = JSON.parse(config.data);
    assert.equal(body.source, 'WEB'); assert.equal(body.cookieScope, undefined); assert.equal(body.turnstileToken, undefined);
    return { data: { jobId: 'id' }, status: 202, statusText: 'Accepted', headers: {}, config };
  };
  const response = await proxyApiRequest(new NextRequest('https://site.test/api/info', { method: 'POST', headers: { 'x-forwarded-for': '198.51.100.10', 'x-info-visitor': 'spoofed' },
    body: JSON.stringify({ url: 'https://www.reddit.com/comments/6rrwyj/', turnstileToken: 'token', source: 'BOT', cookieScope: 'user:1' }) }), ['info'], options);
  assert.equal(response.status, 202); assert.equal(calls, 1); assert.equal(response.headers.get('cache-control'), 'no-store');
  global.fetch = async () => Response.json({ success: false });
  assert.equal((await proxyApiRequest(new NextRequest('https://site.test/api/info', { method: 'POST',
    body: JSON.stringify({ url: 'https://www.reddit.com/comments/6rrwyj/', turnstileToken: 'bad' }) }), ['info'], options)).status, 403);
  assert.equal(calls, 1);
});

test('job polls have a separate visitor quota and leave normal download requests available', async () => {
  const route = await import('../app/api/[...path]/route');
  global.fetch = async () => Response.json({ success: true });
  axios.defaults.adapter = async config => ({ data: { state: 'pending' }, status: 200, statusText: 'OK', headers: {}, config });
  const id = '12345678-1234-4123-8123-123456789abc';
  const headers = { Origin: 'https://site.test', 'x-forwarded-for': '203.0.113.2' };
  const poll = () => route.GET(new NextRequest(`https://site.test/api/info/jobs/${id}`, { headers }),
    { params: Promise.resolve({ path: ['info', 'jobs', id] }) });
  const submit = () => route.POST(new NextRequest('https://site.test/api/info', { method: 'POST', headers,
    body: JSON.stringify({ url: 'https://www.reddit.com/comments/6rrwyj/', turnstileToken: 'token' }) }),
    { params: Promise.resolve({ path: ['info'] }) });
  for (let i = 0; i < 40; i++) assert.equal((await poll()).status, 200);
  for (let i = 0; i < 30; i++) assert.equal((await submit()).status, 200);
  assert.equal((await submit()).status, 429);
  for (let i = 0; i < 20; i++) assert.equal((await poll()).status, 200);
  assert.equal((await poll()).status, 429);
});

test('polling permits only the explicit UUID route and retains a short timeout', async () => {
  let calls = 0;
  axios.defaults.adapter = async config => {
    calls++; assert.equal(config.timeout, 20000);
    return { data: { state: 'pending' }, status: 200, statusText: 'OK', headers: {}, config };
  };
  const id = '12345678-1234-4123-8123-123456789abc';
  const response = await proxyApiRequest(new NextRequest(`https://site.test/api/info/jobs/${id}`), ['info', 'jobs', id], options);
  assert.equal(response.status, 200); assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal((await proxyApiRequest(new NextRequest('https://site.test/api/info/jobs/nope'), ['info', 'jobs', 'nope'], options)).status, 404);
  assert.equal((await proxyApiRequest(new NextRequest('https://site.test/api/users'), ['users'], options)).status, 404);
  assert.equal(calls, 1);
});
