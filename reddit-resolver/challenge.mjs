import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { getInferenceClient } from './inference-client.mjs';
import { challengeTarget, targetScore, tilesForDetections, supportsChallenge, safeRedditPostUrl } from './selection.mjs';
import { tryAudioChallenge } from './audio.mjs';
import { pageRefusal } from './post.mjs';

async function visibleChallenge(page) {
  for (const frame of page.frames()) {
    if (!/\/recaptcha\/(?:api2|enterprise)\/bframe/.test(frame.url())) continue;
    try { if (await (await frame.frameElement()).isVisible()) return frame; } catch { /* navigation */ }
  }
  return null;
}

export async function solveChallenge(page, { deadline, postId, onEvent = () => {}, audio = false, now = Date.now, inference = getInferenceClient() }) {
  const seen = new Map();
  let checkboxClicked = false;
  let audioAttempted = !audio;
  let reloads = 0;
  let lastVerified = '';
  let repeatedVerification = 0;
  let expiredRestarts = 0;
  let widgetMissingSince = null;
  for (let round = 0; round < 18 && now() < deadline;) {
    let currentId = postId || safeRedditPostUrl(page.url())?.id;
    if (!currentId) {
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href').catch(() => null);
      currentId = safeRedditPostUrl(canonical)?.id;
    }
    if (currentId && await page.locator(`shreddit-post[id="t3_${currentId}"]`).count()) return currentId;
    const text = await page.locator('body').innerText({ timeout: 3000 }).catch(() => '');
    const refusal = pageRefusal(text);
    if (refusal) throw new Error(refusal);
    const frame = await visibleChallenge(page);
    if (frame) {
      const message = await frame.locator('body').innerText({ timeout: 2000 }).catch(() => '');
      if (/sending automated queries|can't process your request|Try again later/i.test(message)) {
        throw new Error('REDDIT_CAPTCHA_NETWORK_BLOCKED');
      }
    }
    const tiles = frame?.locator('.rc-imageselect-tile');
    const count = tiles ? await tiles.count().catch(() => 0) : 0;
    if (!count) {
      if (checkboxClicked) {
        const anchorFrame = page.frames().find(f => /\/recaptcha\/(?:api2|enterprise)\/anchor/.test(f.url()));
        const message = await anchorFrame?.locator('body').innerText({ timeout: 2000 }).catch(() => '');
        if (/challenge expired|check the checkbox again/i.test(message || '')) {
          if (++expiredRestarts > 1) throw new Error('REDDIT_CHALLENGE_EXPIRED');
          checkboxClicked = false; lastVerified = ''; repeatedVerification = 0;
          onEvent({ stage: 'challenge-expired-restart' });
        }
      }
      if (!checkboxClicked) {
        const anchor = page.frameLocator('iframe[src*="recaptcha"][src*="anchor"]').locator('#recaptcha-anchor');
        if (await anchor.count().catch(() => 0)) {
          widgetMissingSince = null;
          await anchor.click({ timeout: 5000 }); checkboxClicked = true;
        } else if (/Prove your humanity/i.test(text)) {
          widgetMissingSince ??= now();
          if (now() - widgetMissingSince >= 20000) throw new Error('REDDIT_CHALLENGE_NOT_LOADED');
        } else {
          widgetMissingSince = null;
        }
      }
      await page.waitForTimeout(1500);
      continue;
    }
    const clickTiles = async indices => {
      try {
        for (const i of indices) {
          if (!await tiles.nth(i).evaluate(e => e.classList.contains('rc-imageselect-tileselected'))) {
            await tiles.nth(i).click({ timeout: 5000, force: true });
            await page.waitForTimeout(200);
          }
        }
        return true;
      } catch (error) {
        if (!await visibleChallenge(page)) return false;
        throw error;
      }
    };
    const description = await frame.locator('.rc-imageselect-desc-wrapper').innerText({ timeout: 3000 });
    round++;
    const target = challengeTarget(description);
    if (!audioAttempted) {
      audioAttempted = true;
      await tryAudioChallenge(page, frame, onEvent, inference, deadline);
      continue;
    }
    if (!supportsChallenge(target, count)) {
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
      const detections = await inference.run('detect', { buffer: image }, { deadline });
      const selected = tilesForDetections(detections, target, 4);
      if (!selected) throw new Error('REDDIT_UNSUPPORTED_CHALLENGE');
      onEvent({ stage: 'localization', round, target, selected, detections });
      // reCAPTCHA expands the hovered/selected image over its neighbour.
      // Ignore that temporary overlay while clicking the original cell.
      if (!await clickTiles(selected)) continue;
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
    const buffers = await inference.run('split-grid', { buffer: grid, side: 3 }, { deadline });
    const hashes = buffers.map(b => createHash('sha256').update(b).digest('hex'));
    const missing = hashes.map((h, i) => seen.has(`${target}:${h}`) ? -1 : i).filter(i => i >= 0);
    if (missing.length) {
      const results = await inference.run('classify', { buffers: missing.map(i => buffers[i]) }, { deadline });
      missing.forEach((i, j) => seen.set(`${target}:${hashes[i]}`, targetScore(results[j], target)));
    }
    const selected = hashes.map((h, i) => seen.get(`${target}:${h}`).selected ? i : -1).filter(i => i >= 0);
    onEvent({ stage: 'classification', round, target, count, selected,
      scores: hashes.map(h => seen.get(`${target}:${h}`)) });
    const dynamic = /none left|once there are none/i.test(description);
    if (!await clickTiles(selected)) continue;
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
