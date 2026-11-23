import { test } from 'node:test';
import assert from 'node:assert/strict';
import { solveChallenge } from '../challenge.mjs';

function loadingPage({ anchorAfter = Infinity, text = 'Prove your humanity' } = {}) {
  let elapsed = 0, clicked = false;
  return {
    now: () => elapsed,
    page: {
      frames: () => [],
      locator: selector => selector === 'body' ? { innerText: async () => text }
        : { count: async () => clicked ? 1 : 0 },
      frameLocator: () => ({ locator: () => ({
        count: async () => elapsed >= anchorAfter ? 1 : 0,
        click: async () => { clicked = true; },
      }) }),
      waitForTimeout: async ms => { elapsed += ms; },
    },
  };
}

test('a missing captcha widget fails early enough to leave time for recovery', async () => {
  const fixture = loadingPage();
  await assert.rejects(solveChallenge(fixture.page, {
    postId: '6rrwyj', deadline: 200000, now: fixture.now,
  }), /CHALLENGE_NOT_LOADED/);
  assert.ok(fixture.now() >= 20000 && fixture.now() < 30000);
});

test('a slowly loaded widget is allowed to complete within the loading window', async () => {
  const fixture = loadingPage({ anchorAfter: 10000 });
  assert.equal(await solveChallenge(fixture.page, {
    postId: '6rrwyj', deadline: 200000, now: fixture.now,
  }), '6rrwyj');
});

test('the early missing-widget error applies only to the known challenge page', async () => {
  const fixture = loadingPage({ text: 'Loading a page' });
  await assert.rejects(solveChallenge(fixture.page, {
    postId: '6rrwyj', deadline: 30000, now: fixture.now,
  }), /CHALLENGE_TIMEOUT/);
});

test('diagnostics distinguish a checked Google checkbox from the absent Reddit post', async () => {
  let elapsed = 0; const events = [];
  const anchor = { url: () => 'https://www.google.com/recaptcha/api2/anchor',
    locator: () => ({ innerText: async () => '', getAttribute: async () => 'true' }) };
  const page = { frames: () => [anchor],
    locator: selector => selector === 'body' ? { innerText: async () => 'Prove your humanity' } : { count: async () => 0 },
    frameLocator: () => ({ locator: () => ({ count: async () => 1, click: async () => {} }) }),
    waitForTimeout: async ms => { elapsed += ms; } };
  await assert.rejects(solveChallenge(page, { postId: '6rrwyj', deadline: 10000, now: () => elapsed,
    onEvent: event => events.push(event) }), /CHALLENGE_TIMEOUT/);
  assert.ok(events.some(e => e.stage === 'waiting-challenge' && e.anchorChecked === true));
});
