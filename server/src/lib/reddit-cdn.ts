import { spawn } from 'child_process';
import { mkdtemp, readFile, rm, stat } from 'fs/promises';
import { tmpdir } from 'os';
import { join } from 'path';

export const isRedditCdnBlock = (message: string) => /(?:HTTP(?: Error)?\s*[:=]?\s*(?:403|429)|403:?\s*Forbidden|429:?\s*Too Many Requests)/i.test(message);
type Photo = { bytes: Buffer; contentType: string | null };

// curl is already installed in the API image. Credentials go over stdin,
// never into process arguments, stderr, returned errors or logs.
async function photoViaIsp(url: string, proxy: string): Promise<Photo> {
  const parsed = new URL(proxy);
  if (!['http:', 'https:'].includes(parsed.protocol)) throw new Error('Reddit ISP unavailable');
  const dir = await mkdtemp(join(tmpdir(), 'reddit-photo-'));
  const path = join(dir, 'photo');
  try {
    const output = await new Promise<string>((resolve, reject) => {
      const child = spawn('curl', ['--config', '-', '--silent', '--fail', '--max-time', '30',
        '--max-filesize', '134217728', '--output', path, '--write-out', '%{content_type}', '--url', url],
      { stdio: ['pipe', 'pipe', 'ignore'] });
      let text = '';
      const timer = setTimeout(() => { child.kill('SIGKILL'); }, 35000);
      child.stdout.on('data', chunk => { if (text.length < 1024) text += chunk.toString(); });
      child.stdin.on('error', () => {});
      child.on('error', () => { clearTimeout(timer); reject(new Error('Reddit ISP unavailable')); });
      child.on('close', code => { clearTimeout(timer); code === 0 ? resolve(text) : reject(new Error('Reddit ISP unavailable')); });
      child.stdin.end(`proxy = ${JSON.stringify(parsed.toString())}\n`);
    });
    if ((await stat(path)).size > 134217728) throw new Error('Reddit photo too large');
    return { bytes: await readFile(path), contentType: output.trim() || null };
  } finally { await rm(dir, { recursive: true, force: true }); }
}

export async function fetchRedditPhoto(url: string, proxies: string[],
  direct = fetch, viaIsp = photoViaIsp): Promise<Photo> {
  const target = new URL(url);
  if (target.protocol !== 'https:' || target.hostname !== 'i.redd.it' || target.username || target.password || (target.port && target.port !== '443')) {
    throw new Error('Invalid Reddit photo');
  }
  let blocked = false;
  try {
    const response = await direct(url, { signal: AbortSignal.timeout(30000) });
    if (response.ok) return { bytes: Buffer.from(await response.arrayBuffer()), contentType: response.headers.get('content-type') };
    blocked = response.status === 403 || response.status === 429;
    await response.body?.cancel().catch(() => {});
    if (!blocked) throw new Error(`Reddit photo HTTP ${response.status}`);
  } catch (error) {
    if (!blocked && !(error instanceof TypeError) && !['TimeoutError', 'AbortError'].includes((error as Error).name)) throw error;
  }
  for (const proxy of proxies) {
    try { return await viaIsp(url, proxy); } catch { /* Try another ISP, never residential. */ }
  }
  throw new Error('Reddit media unavailable');
}
