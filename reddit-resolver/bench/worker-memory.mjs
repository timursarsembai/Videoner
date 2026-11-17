// Offline integration benchmark: real Chromium and models, no Reddit/proxy.
import fs from 'node:fs';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';
import { InferenceClient } from '../inference-client.mjs';
const read = f => Number(fs.readFileSync('/sys/fs/cgroup/'+f, 'utf8'));
const cycles = Number(process.env.BENCH_CYCLES || 20);
if (!Number.isInteger(cycles) || cycles < 1 || cycles > 100) throw new Error('Invalid BENCH_CYCLES');
const mark = phase => console.log(JSON.stringify({ phase, anon: /(?:^|\n)anon (\d+)/.exec(fs.readFileSync('/sys/fs/cgroup/memory.stat','utf8'))?.[1], parentRss: process.memoryUsage().rss,
  memory: read('memory.current'), peak: read('memory.peak'), swap: read('memory.swap.current') }));
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
const infer = new InferenceClient({ idleMs: 100 }); // Accelerates only this benchmark.
const xvfb = spawn('Xvfb', [':98', '-screen', '0', '1280x900x24', '-nolisten', 'tcp'], { stdio: 'ignore' });
let browser;
try {
  mark('parent-start'); await wait(500);
  browser = await chromium.launch({ headless: false, channel: 'chromium', env: { ...process.env, DISPLAY: ':98' },
    ignoreDefaultArgs: ['--enable-automation'], args: ['--no-sandbox', '--disable-dev-shm-usage', '--disable-blink-features=AutomationControlled'] });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.setContent('<body style="margin:0;background:rgb(100,140,180)"></body>');
  const image = await page.screenshot({ clip: { x: 0, y: 0, width: 400, height: 400 } });
  mark('browser-open');
  let reference;
  for (let i = 0; i < cycles; i++) {
    const release = infer.hold();
    const result = await infer.run('classify', { buffers: [image] });
    if (reference && JSON.stringify(result) !== reference) throw new Error('Classification changed across worker restarts');
    reference = JSON.stringify(result); release();
    for (let n = 0; infer.child; n++) { if (n > 300) throw new Error('Worker did not exit'); await wait(10); }
    if (i === 0 || i === cycles - 1) mark('classify-idle-'+i);
  }
  const release = infer.hold();
  try {
    if (process.env.BENCH_SKIP_DETECT !== '1') {
    const tiles = await infer.run('split-grid', { buffer: image, side: 3 });
    await infer.run('classify', { buffers: tiles });
    await infer.run('detect', { buffer: image });
    mark('detect-completed');
    }
  } finally { release(); }
  while (infer.child) await wait(10);
  mark('models-released-browser-kept');
  await browser.close(); browser = undefined;
  await wait(1000); mark('browser-closed');
  await wait(10000); mark('idle-10s');
  console.log(JSON.stringify({ ok: true, cycles }));
} finally { await infer.close(); await browser?.close(); xvfb.kill(); }
