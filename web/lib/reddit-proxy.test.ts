import { before, after, test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import axios from 'axios';

process.env.API_INTERNAL_URL = 'http://api.test';
process.env.API_KEY = 'test-key';
process.env.TURNSTILE_SECRET = 'test-secret';
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
    const body = JSON.parse(config.data);
    assert.equal(body.source, 'WEB'); assert.equal(body.cookieScope, undefined); assert.equal(body.turnstileToken, undefined);
    return { data: { jobId: 'id' }, status: 202, statusText: 'Accepted', headers: {}, config };
  };
  const response = await proxyApiRequest(new NextRequest('https://site.test/api/info', { method: 'POST',
    body: JSON.stringify({ url: 'https://www.reddit.com/comments/6rrwyj/', turnstileToken: 'token', source: 'BOT', cookieScope: 'user:1' }) }), ['info'], options);
  assert.equal(response.status, 202); assert.equal(calls, 1); assert.equal(response.headers.get('cache-control'), 'no-store');
  global.fetch = async () => Response.json({ success: false });
  assert.equal((await proxyApiRequest(new NextRequest('https://site.test/api/info', { method: 'POST',
    body: JSON.stringify({ url: 'https://www.reddit.com/comments/6rrwyj/', turnstileToken: 'bad' }) }), ['info'], options)).status, 403);
  assert.equal(calls, 1);
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
