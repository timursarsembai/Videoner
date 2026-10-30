import { createHmac } from 'crypto';
import { isBotRequest } from './bot-auth';

describe('bot auth', () => {
  const saved = process.env.BOT_TOKEN;
  afterEach(() => {
    process.env.BOT_TOKEN = saved;
  });

  it('accepts only the HMAC of the bot token', () => {
    process.env.BOT_TOKEN = '123:abc';
    const good = createHmac('sha256', '123:abc').update('videoner-bot-v1').digest('hex');
    expect(isBotRequest({ headers: { 'x-videoner-bot': good } })).toBe(true);
    expect(isBotRequest({ headers: { 'x-videoner-bot': good.replace(/.$/, '0') } })).toBe(false);
    expect(isBotRequest({ headers: { 'x-videoner-bot': '123:abc' } })).toBe(false);
    expect(isBotRequest({ headers: {} })).toBe(false);
  });

  it('refuses everything without a configured token', () => {
    delete process.env.BOT_TOKEN;
    expect(isBotRequest({ headers: { 'x-videoner-bot': 'anything' } })).toBe(false);
  });
});
