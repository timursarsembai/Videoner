import { UnauthorizedException } from '@nestjs/common';
import { ApiKeyGuard } from './api-key.guard';

describe('metadata polling rate limits', () => {
  function fixture(path = '/info/jobs/12345678-1234-4123-8123-123456789abc', method = 'GET') {
    const keys = { validateApiKey: jest.fn().mockResolvedValue({ id: 'key', user: {} }) };
    const rates = { checkIpRateLimit: jest.fn().mockReturnValue({ isAllowed: false, resetAt: new Date() }),
      checkRateLimit: jest.fn().mockResolvedValue({ isAllowed: true, limit: 1000, remaining: 999, resetAt: new Date() }) };
    const req = { method, path, ip: '127.0.0.1', query: {}, header: (name: string) => name === 'X-API-Key' ? 'test-only' : undefined };
    const ctx = { getHandler: () => ({}), switchToHttp: () => ({ getRequest: () => req, getResponse: () => ({ header: jest.fn() }) }) };
    const guard = new ApiKeyGuard(keys as any, rates as any, { get: () => false } as any);
    return { keys, rates, guard, ctx };
  }
  it('authenticates polling and applies the key quota without consuming the shared heavy-request IP quota', async () => {
    const f = fixture();
    expect(await f.guard.canActivate(f.ctx as any)).toBe(true);
    expect(f.keys.validateApiKey).toHaveBeenCalled();
    expect(f.rates.checkIpRateLimit).not.toHaveBeenCalled();
    expect(f.rates.checkRateLimit).toHaveBeenCalledWith('key');
  });
  it('keeps IP limits for heavy requests and invalid polling paths', async () => {
    for (const [path, method] of [['/info', 'POST'], ['/info/jobs/invalid', 'GET']]) {
      const f = fixture(path, method);
      await expect(f.guard.canActivate(f.ctx as any)).rejects.toMatchObject({ status: 429 });
      expect(f.rates.checkIpRateLimit).toHaveBeenCalled();
    }
  });
  it('does not exempt polling from authentication', async () => {
    const f = fixture(); f.keys.validateApiKey.mockRejectedValue(new UnauthorizedException());
    await expect(f.guard.canActivate(f.ctx as any)).rejects.toBeInstanceOf(UnauthorizedException);
    expect(f.rates.checkRateLimit).not.toHaveBeenCalled();
  });
});
