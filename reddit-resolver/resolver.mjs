import { chromium } from 'playwright';
import { randomBytes } from 'node:crypto';
import { InferenceClient } from './inference-client.mjs';
import { solveChallenge } from './challenge.mjs';
import { safeRedditPostUrl } from './selection.mjs';
import { snapshotInPage, parsePost } from './post.mjs';
import { mkdir, writeFile } from 'node:fs/promises';

const POST_REFUSALS = new Set(['REDDIT_ADULT_CONTENT', 'REDDIT_NO_MEDIA',
  'REDDIT_AGE_UNVERIFIED', 'REDDIT_POST_UNAVAILABLE', 'REDDIT_INVALID_CROSSPOST']);
const RETRYABLE = new Set(['REDDIT_RATE_LIMITED', 'REDDIT_NETWORK_BLOCKED',
  'REDDIT_CAPTCHA_NETWORK_BLOCKED', 'REDDIT_CHALLENGE_EXPIRED', 'REDDIT_IMAGES_TIMEOUT',
  'REDDIT_CHALLENGE_REJECTED', 'REDDIT_UNSUPPORTED_CHALLENGE', 'REDDIT_CHALLENGE_NOT_LOADED']);

export class RedditResolver {
  constructor({ proxy = process.env.REDDIT_PROXY_URL, country = process.env.REDDIT_PROXY_COUNTRY || 'gb',
    display = process.env.DISPLAY || ':99', onEvent = () => {}, inference = new InferenceClient() } = {}) {
    this.inference = inference; this.proxy = proxy; this.country = country; this.display = display; this.onEvent = onEvent;
    this.cache = new Map(); this.refusals = new Map(); this.pending = new Map(); this.queue = Promise.resolve();
    this.queued = 0; this.cooldownUntil = 0;
  }

  async session() {
    if (this.context && this.expires > Date.now() && this.browser?.isConnected()) return this.context;
    await this.close();
    let proxy;
    try {
      const u = new URL(this.proxy);
      if (!/^https?:$/.test(u.protocol) || !u.username || !u.password) throw new Error();
      const base = decodeURIComponent(u.password).split(/_(?:country|session|lifetime)-/)[0];
      const password = `${base}_country-${this.country}_session-${randomBytes(6).toString('hex')}_lifetime-10m`;
      proxy = { server: `${u.protocol}//${u.hostname}:${u.port}`, username: decodeURIComponent(u.username), password };
    } catch { throw new Error('REDDIT_PROXY_CONFIG_INVALID'); }
    this.browser = await chromium.launch({ headless: false, channel: 'chromium',
      env: { ...process.env, DISPLAY: this.display }, ignoreDefaultArgs: ['--enable-automation'],
      args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled'], proxy });
    this.context = await this.browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'en-US' });
    this.expires = Date.now() + 8 * 60000;
    return this.context;
  }

  async resolve(url) {
    const parsed = safeRedditPostUrl(url);
    if (!parsed) throw new Error('REDDIT_INVALID_URL');
    const key = parsed.id || parsed.url;
    const refusal = this.refusals.get(key);
    if (refusal?.expires > Date.now()) throw new Error(refusal.code);
    this.refusals.delete(key);
    const hit = this.cache.get(key);
    if (hit?.expires > Date.now()) return structuredClone(hit.value);
    if (this.pending.has(key)) return this.pending.get(key).then(structuredClone);
    if (this.queued >= 1 || this.cooldownUntil > Date.now()) throw new Error('REDDIT_BUSY');
    this.queued++;
    const releaseInference = this.inference.hold();
    const task = this.queue.then(() => {
      if (this.cooldownUntil > Date.now()) throw new Error('REDDIT_BUSY');
      return this.resolveWithRetry(parsed, Date.now() + 200000);
    });
    const pending = task.then(value => {
      if (!(this.cache.get(key)?.expires > Date.now())) this.remember(key, value);
      return structuredClone(value);
    }).catch(async error => {
      if (POST_REFUSALS.has(error?.message)) {
        this.refusals.set(key, { code: error.message, expires: Date.now() + 60000 });
        while (this.refusals.size > 100) this.refusals.delete(this.refusals.keys().next().value);
      } else if (!String(error?.message).startsWith('REDDIT_INFERENCE_')) {
        this.cooldownUntil = Date.now() + 30000;
        await this.close();
      }
      throw error;
    }).finally(() => { this.pending.delete(key); this.queued--; releaseInference(); });
    this.queue = pending.catch(() => {});
    this.pending.set(key, pending);
    return pending;
  }

  remember(key, value, expires = Date.now() + 10 * 60000) {
    // Own the cached value; callers and crosspost wrappers cannot mutate it.
    this.cache.delete(key);
    this.cache.set(key, { value: structuredClone(value), expires });
    while (this.cache.size > 100) this.cache.delete(this.cache.keys().next().value);
  }

  async resolveWithRetry(parsed, deadline) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try { return await this.resolvePost(parsed, new Set(), deadline); }
      catch (error) {
        const temporary = RETRYABLE.has(error?.message) ||
          !String(error?.message || '').startsWith('REDDIT_');
        if (attempt || !temporary || deadline - Date.now() < 60000) throw error;
        await this.close();
        const countries = ['gb', 'us', 'de'];
        this.country = countries[(countries.indexOf(this.country) + 1) % countries.length];
        this.onEvent({ stage: 'proxy-session-retry' });
      }
    }
  }

  async resolvePost(parsed, visited, deadline) {
    const key = parsed.id || parsed.url;
    if (Date.now() >= deadline) throw new Error('REDDIT_CHALLENGE_TIMEOUT');
    if (visited.has(key) || visited.size >= 4) throw new Error('REDDIT_INVALID_CROSSPOST');
    visited.add(key);
    const cached = this.cache.get(key);
    if (cached?.expires > Date.now()) return structuredClone(cached.value);
    this.cache.delete(key);
    const context = await this.session();
    if (this.idleTimer) clearTimeout(this.idleTimer);
    const page = await context.newPage();
    let requests = 0;
    try {
      await page.route('**/*', route => {
        const request = route.request(), host = new URL(request.url()).hostname;
        const main = request.isNavigationRequest() && request.frame() === page.mainFrame();
        const type = request.resourceType();
        const challengeImage = /(^|\.)(google\.com|gstatic\.com|recaptcha\.net)$/.test(host);
        if (++requests > 240 || (main && host !== 'www.reddit.com') || type === 'media' || type === 'font' ||
          host === 'v.redd.it' || (type === 'image' && !challengeImage)) return route.abort();
        return route.continue();
      });
      await page.goto(parsed.url, { waitUntil: 'domcontentloaded', timeout: Math.max(1, Math.min(30000, deadline - Date.now())) });
      await page.waitForTimeout(1500);
      const actualId = await solveChallenge(page, { deadline, postId: parsed.id, onEvent: this.onEvent, inference: this.inference });
      const data = parsePost(await page.evaluate(snapshotInPage, actualId), actualId);
      if (data.kind === 'crosspost') {
        const source = safeRedditPostUrl(data.source_url);
        if (!source) throw new Error('REDDIT_AGE_UNVERIFIED');
        const media = await this.resolvePost(source, visited, deadline);
        if (media.over_18 !== false || media.age_verified !== true) throw new Error('REDDIT_AGE_UNVERIFIED');
        const result = { ...media, id: actualId, title: data.title || media.title, webpage_url: data.webpage_url,
          source_post_id: media.source_post_id || media.id };
        // A crosspost must not extend the age of its source verification.
        this.remember(key, result, this.cache.get(source.id || source.url)?.expires);
        return result;
      }
      this.remember(key, data);
      return data;
    } catch (error) {
      if (process.env.REDDIT_DEBUG_DIR) {
        const dir = process.env.REDDIT_DEBUG_DIR;
        await mkdir(dir, { recursive: true }).catch(() => {});
        await page.screenshot({ path: `${dir}/${parsed.id || 'share'}.png` }).catch(() => {});
        const diagnostic = { title: await page.title().catch(() => ''),
          text: (await page.locator('body').innerText({ timeout: 2000 }).catch(() => '')).slice(0, 2000),
          snapshot: parsed.id ? await page.evaluate(snapshotInPage, parsed.id).catch(() => null) : null };
        await writeFile(`${dir}/${parsed.id || 'share'}.json`, JSON.stringify(diagnostic)).catch(() => {});
      }
      throw error;
    } finally {
      await page.close().catch(() => {});
      if (this.idleTimer) clearTimeout(this.idleTimer);
      this.idleTimer = setTimeout(() => this.close(), 5 * 60000);
      this.idleTimer.unref();
    }
  }

  async shutdown() {
    await Promise.all([this.close(), this.inference.close()]);
  }

  async close() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    const browser = this.browser;
    this.browser = null; this.context = null;
    if (browser) await browser.close().catch(() => {});
  }
}
