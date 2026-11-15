import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { readFile, writeFile } from 'node:fs/promises';
import { randomBytes, createHash } from 'node:crypto';
import { isIP } from 'node:net';
import { getClassifier } from './vision.mjs';
import { solveChallenge } from './challenge.mjs';
import { safeRedditPostUrl } from './selection.mjs';

// Diagnostic only. Never dump environment, proxy credentials, cookies or
// exception stacks: Playwright errors may contain authenticated proxy URLs.
let input, proxy;
try {
  input = JSON.parse(await readFile('/dev/stdin', 'utf8'));
  proxy = new URL(input.proxy);
  if (!/^https?:$/.test(proxy.protocol) || !proxy.username || !proxy.password) throw new Error();
} catch {
  console.error('REDDIT_PROXY_CONFIG_INVALID'); process.exit(1);
}
const post = safeRedditPostUrl(input.url);
if (!post || !input.proxy) throw new Error('Valid Reddit post and proxy required');
const base = decodeURIComponent(proxy.password).split(/_(?:country|session|lifetime)-/)[0];
const password = `${base}_country-${input.country || 'de'}_session-${randomBytes(6).toString('hex')}_lifetime-10m`;
let browser, xvfb, page, context, initialExit;
const salt = randomBytes(16);
const events = [];
function event(value) {
  events.push(value);
  const { scores, result, ...summary } = value;
  if (result) summary.result = { matchedPost: result.matchedPost,
    attributeNames: Object.keys(result.attributes || {}), players: result.players?.length || 0 };
  console.log(JSON.stringify(summary));
}
async function exitHash() {
  try {
    const response = await context.request.get('https://api.ipify.org?format=json', { timeout: 10000 });
    const ip = (await response.json()).ip;
    return isIP(ip) ? createHash('sha256').update(salt).update(ip).digest('hex').slice(0, 10) : null;
  } catch { return null; }
}
try {
  await getClassifier(); event({ stage: 'model-ready' });
  xvfb = spawn('Xvfb', [':99', '-screen', '0', '1280x900x24', '-nolisten', 'tcp'], { stdio: 'ignore' });
  await new Promise(resolve => setTimeout(resolve, 500));
  browser = await chromium.launch({
    headless: false, channel: 'chromium', env: { ...process.env, DISPLAY: ':99' },
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled'],
    proxy: { server: `${proxy.protocol}//${proxy.hostname}:${proxy.port}`,
      username: decodeURIComponent(proxy.username), password },
  });
  context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'en-US' });
  initialExit = await exitHash();
  event({ stage: 'exit', phase: 'before', tag: initialExit });
  page = await context.newPage();
  page.on('request', request => {
    const u = new URL(request.url());
    if (u.hostname === 'www.reddit.com' && request.method() === 'POST') {
      const body = request.postData() || '';
      event({ stage: 'post-request', path: u.pathname,
        hasRecaptchaResponse: /g-recaptcha-response|recaptcha_response|recaptcha_token/.test(body) });
    }
  });
  page.on('response', response => {
    const request = response.request();
    if (request.isNavigationRequest() && request.frame() === page.mainFrame()) {
      const u = new URL(response.url());
      event({ stage: 'navigation', status: response.status(), path: u.pathname,
        method: request.method(), queryKeys: [...u.searchParams.keys()] });
    }
  });
  let requests = 0;
  await page.route('**/*', route => {
    const request = route.request(), type = request.resourceType();
    const host = new URL(request.url()).hostname;
    if (request.isNavigationRequest() && request.frame() === page.mainFrame() && host !== 'www.reddit.com') return route.abort();
    const challengeImage = /(^|\.)(google\.com|gstatic\.com|recaptcha\.net)$/.test(host);
    if (++requests > 240 || type === 'media' || type === 'font' || host === 'v.redd.it' || (type === 'image' && !challengeImage)) return route.abort();
    return route.continue();
  });
  await page.goto(post.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(2000);
  await solveChallenge(page, { deadline: Date.now() + 180000, postId: post.id, onEvent: event, audio: input.audio === true });
  const result = await page.evaluate(id => {
    const node = document.getElementById(`t3_${id}`);
    if (!node || node.tagName.toLowerCase() !== 'shreddit-post') return { matchedPost: false };
    return { matchedPost: true, attributes: Object.fromEntries([...node.attributes].map(a => [a.name, a.value])),
      players: [...node.querySelectorAll('shreddit-player,shreddit-player-2,video,source')]
        .map(n => ({ tag: n.tagName, attributes: Object.fromEntries([...n.attributes].map(a => [a.name, a.value])) })) };
  }, post.id);
  event({ stage: 'result', result, requests });
} catch (error) {
  const code = /^REDDIT_[A-Z_]+$/.test(error?.message || '') ? error.message : 'REDDIT_PROBE_FAILED';
  let detail = String(error?.message || '').split('\n')[0].replace(/https?:\/\/\S+/g, '[url]');
  for (const value of [input.proxy, proxy.username, decodeURIComponent(proxy.username), proxy.password, base, password]) {
    if (value) detail = detail.replaceAll(value, '[redacted]');
  }
  event({ stage: 'failed', code, detail }); process.exitCode = 1;
  if (page && process.env.PROBE_SCREENSHOT) await page.screenshot({ path: process.env.PROBE_SCREENSHOT }).catch(() => {});
} finally {
  if (context) {
    const after = await exitHash();
    event({ stage: 'exit', phase: 'after', tag: after,
      stickyConfirmed: initialExit && after ? initialExit === after : null });
  }
  if (browser) await browser.close().catch(() => {});
  xvfb?.kill();
  if (process.env.PROBE_REPORT) await writeFile(process.env.PROBE_REPORT, JSON.stringify(events, null, 2));
}
