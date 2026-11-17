import { getInferenceClient } from './inference-client.mjs';

// Fetch and decode inside the Google challenge frame. This keeps the same
// proxy/browser session and uses Chromium's built-in MP3 decoder; no binary
// download, external speech API, or user audio is involved.
export async function tryAudioChallenge(page, frame, onEvent, inference = getInferenceClient(), deadline = Date.now() + 200000) {
  try {
    await frame.locator('#recaptcha-audio-button').click({ timeout: 5000 });
    await frame.locator('#audio-source').waitFor({ state: 'attached', timeout: 12000 });
    const samples = await frame.evaluate(async () => {
      const src = document.querySelector('#audio-source')?.src;
      if (!src) throw new Error('Audio unavailable');
      const u = new URL(src);
      if (u.protocol !== 'https:' || !/(^|\.)(google\.com|recaptcha\.net)$/.test(u.hostname)) throw new Error('Unexpected audio host');
      const response = await fetch(src);
      if (!response.ok) throw new Error('Audio request failed');
      const decoder = new OfflineAudioContext(1, 16000, 16000);
      const audio = await decoder.decodeAudioData(await response.arrayBuffer());
      if (audio.duration < 0.25 || audio.duration > 30) throw new Error('Unexpected audio duration');
      return Array.from(audio.getChannelData(0));
    });
    const text = await inference.run('transcribe', { samples }, { deadline });
    if (!text || text.length > 250) throw new Error('No usable transcript');
    await frame.locator('#audio-response').fill(text, { timeout: 3000 });
    await frame.locator('#recaptcha-verify-button').click({ timeout: 3000 });
    onEvent({ stage: 'audio-submitted', samples: samples.length });
    await page.waitForTimeout(4000);
    return true;
  } catch (error) {
    if (error?.message?.startsWith('REDDIT_INFERENCE_')) throw error;
    onEvent({ stage: 'audio-unavailable' });
    await frame.locator('#recaptcha-image-button').click({ timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(2000);
    return false;
  }
}
