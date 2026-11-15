import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { classifyTiles, detectObjects } from './vision.mjs';
import { splitGrid } from './tile-model.mjs';
import { challengeTarget, targetScore, tilesForDetections, DETECTOR_LABELS } from './selection.mjs';
import { tryAudioChallenge } from './audio.mjs';

export async function solveChallenge(page, { deadline, postId, onEvent = () => {}, audio = false }) {
  const seen = new Map();
  let checkboxClicked = false;
  let audioAttempted = !audio;
  let reloads = 0;
  let lastVerified = '';
  let repeatedVerification = 0;
  for (let round = 0; round < 18 && Date.now() < deadline;) {
    if (await page.locator(`shreddit-post[id="t3_${postId}"]`).count()) return;
    const text = await page.locator('body').innerText({ timeout: 3000 }).catch(() => '');
    if (/Too Many Requests/i.test(text)) throw new Error('REDDIT_RATE_LIMITED');
    if (/blocked by network security|network policy/i.test(text)) throw new Error('REDDIT_NETWORK_BLOCKED');
    const frame = page.frames().find(f => /\/recaptcha\/(?:api2|enterprise)\/bframe/.test(f.url()));
    if (frame) {
      const message = await frame.locator('body').innerText({ timeout: 2000 }).catch(() => '');
      if (/sending automated queries|can't process your request|Try again later/i.test(message)) {
        throw new Error('REDDIT_CAPTCHA_NETWORK_BLOCKED');
      }
    }
    const tiles = frame?.locator('.rc-imageselect-tile');
    const count = tiles ? await tiles.count().catch(() => 0) : 0;
    if (!count) {
      if (!checkboxClicked) {
        const anchor = page.frameLocator('iframe[src*="recaptcha"][src*="anchor"]').locator('#recaptcha-anchor');
        if (await anchor.count().catch(() => 0)) {
          await anchor.click({ timeout: 5000 }); checkboxClicked = true;
        }
      }
      await page.waitForTimeout(1500);
      continue;
    }
    const description = await frame.locator('.rc-imageselect-desc-wrapper').innerText({ timeout: 3000 });
    round++;
    const target = challengeTarget(description);
    if (!audioAttempted) {
      audioAttempted = true;
      await tryAudioChallenge(page, frame, onEvent);
      continue;
    }
    if (!target || (count === 16 && !DETECTOR_LABELS[target])) {
      if (++reloads > 2) throw new Error('REDDIT_UNSUPPORTED_CHALLENGE');
      onEvent({ stage: 'challenge-reload', target, count });
      await frame.locator('#recaptcha-reload-button').click({ timeout: 3000 });
      await page.waitForTimeout(3000);
      seen.clear();
      continue;
    }
    if (process.env.CAPTCHA_ARTIFACT_DIR) {
      await mkdir(process.env.CAPTCHA_ARTIFACT_DIR, { recursive: true });
      await frame.locator('.rc-imageselect-target').screenshot({ path: `${process.env.CAPTCHA_ARTIFACT_DIR}/round-${round}.png` });
      await writeFile(`${process.env.CAPTCHA_ARTIFACT_DIR}/round-${round}.json`, JSON.stringify({ description, count, target,
        message: await frame.locator('body').innerText({ timeout: 2000 }).catch(() => '') }));
    }
    if (count === 16) {
      const image = await frame.locator('.rc-imageselect-target').screenshot({ timeout: 5000 });
      const detections = await detectObjects(image);
      const selected = tilesForDetections(detections, target, 4);
      if (!selected) throw new Error('REDDIT_UNSUPPORTED_CHALLENGE');
      onEvent({ stage: 'localization', round, target, selected, detections });
      // reCAPTCHA expands the hovered/selected image over its neighbour.
      // Ignore that temporary overlay while clicking the original cell.
      for (const i of selected) {
        await tiles.nth(i).click({ timeout: 5000, force: true });
        await page.waitForTimeout(200);
      }
      await frame.locator('#recaptcha-verify-button').click({ timeout: 3000 });
      await page.waitForTimeout(7000);
      continue;
    }
    if (count !== 9) throw new Error('REDDIT_UNSUPPORTED_CHALLENGE');
    // Dynamic tasks may take several seconds to replace the selected image.
    // Waiting on a locator with multiple matches would fail immediately;
    // inspect all cells together and don't classify half-faded replacements.
    await frame.waitForFunction(() =>
      !document.querySelector('.rc-imageselect-dynamic-selected') &&
      [...document.querySelectorAll('.rc-imageselect-target img')].every(img => img.complete && img.naturalWidth > 0),
      null, { timeout: 15000 }).catch(() => { throw new Error('REDDIT_IMAGES_TIMEOUT'); });
    // Screenshot once. Nine separate screenshots repeatedly scroll the iframe
    // and wait for animations; that can consume the challenge's entire TTL.
    const grid = await frame.locator('.rc-imageselect-target').screenshot({ timeout: 5000 });
    const buffers = await splitGrid(grid, 3);
    const hashes = buffers.map(b => createHash('sha256').update(b).digest('hex'));
    const missing = hashes.map((h, i) => seen.has(`${target}:${h}`) ? -1 : i).filter(i => i >= 0);
    if (missing.length) {
      const results = await classifyTiles(missing.map(i => buffers[i]));
      missing.forEach((i, j) => seen.set(`${target}:${hashes[i]}`, targetScore(results[j], target)));
    }
    const selected = hashes.map((h, i) => seen.get(`${target}:${h}`).selected ? i : -1).filter(i => i >= 0);
    onEvent({ stage: 'classification', round, target, count, selected,
      scores: hashes.map(h => seen.get(`${target}:${h}`)) });
    const dynamic = /none left|once there are none/i.test(description);
    for (const i of selected) {
      if (!await tiles.nth(i).evaluate(e => e.classList.contains('rc-imageselect-tileselected'))) {
        await tiles.nth(i).click({ timeout: 5000, force: true }); await page.waitForTimeout(250);
      }
    }
    if (!dynamic || selected.length === 0) {
      const fingerprint = `${target}:${hashes.join(':')}`;
      repeatedVerification = fingerprint === lastVerified ? repeatedVerification + 1 : 0;
      lastVerified = fingerprint;
      if (repeatedVerification > 0) {
        if (++reloads > 2) throw new Error('REDDIT_CHALLENGE_REJECTED');
        onEvent({ stage: 'challenge-rejected', target });
        await frame.locator('#recaptcha-reload-button').click({ timeout: 3000 });
        await page.waitForTimeout(3000);
        seen.clear();
        continue;
      }
      await frame.locator('#recaptcha-verify-button').click({ timeout: 3000 });
      seen.clear();
    }
    await page.waitForTimeout(dynamic && selected.length ? 4500 : 9000);
  }
  throw new Error('REDDIT_CHALLENGE_TIMEOUT');
}
