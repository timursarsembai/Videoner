import http from 'node:http';
import { spawn } from 'node:child_process';
import { RedditResolver } from './resolver.mjs';
import { resolverEvent, traceResolution } from './diagnostics.mjs';

const display = process.env.DISPLAY || ':99';
const xvfb = spawn('Xvfb', [display, '-screen', '0', '1280x900x24', '-nolisten', 'tcp'], { stdio: 'ignore' });
const resolver = new RedditResolver({ display, onEvent: resolverEvent });
const reply = (res, status, data) => {
  if (res.destroyed || res.writableEnded) return;
  res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
  res.end(JSON.stringify(data));
};
const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/health') return reply(res, 200, { ok: true });
  if (req.method !== 'POST' || req.url !== '/resolve') return reply(res, 404, { ok: false });
  let body = '';
  try {
    for await (const chunk of req) {
      body += chunk;
      if (Buffer.byteLength(body) > 4096) return reply(res, 413, { ok: false, code: 'REDDIT_INVALID_URL' });
    }
    const input = JSON.parse(body);
    if (typeof input.url !== 'string' || input.url.length > 2048) throw new Error('REDDIT_INVALID_URL');
    const media = await traceResolution(() => resolver.resolve(input.url));
    reply(res, 200, { ok: true, media });
  } catch (error) {
    // Never log raw browser errors: authenticated proxy URLs may occur there.
    const code = /^REDDIT_[A-Z_]+$/.test(error?.message || '') ? error.message : 'REDDIT_UNAVAILABLE';
    console.warn(JSON.stringify({ event: 'resolve-failed', code }));
    reply(res, code === 'REDDIT_INVALID_URL' ? 400 : 200, { ok: false, code });
  }
});
server.requestTimeout = 240000;
server.listen(Number(process.env.PORT || 4418), '0.0.0.0');
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, async () => {
  server.close(); await resolver.shutdown(); xvfb.kill(); process.exit(0);
});
