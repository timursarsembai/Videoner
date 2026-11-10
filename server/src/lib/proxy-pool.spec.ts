import { parseProxyPool, proxyHost } from './proxy-pool';

describe('proxy pool', () => {
  it('reads the list, falls back to the single proxy, drops quotes and repeats', () => {
    expect(parseProxyPool("http://a@1.1.1.1:1, 'http://b@2.2.2.2:2',http://a@1.1.1.1:1", 'http://x@9.9.9.9:9')).toEqual([
      'http://a@1.1.1.1:1',
      'http://b@2.2.2.2:2',
    ]);
    expect(parseProxyPool(undefined, 'http://x@9.9.9.9:9')).toEqual(['http://x@9.9.9.9:9']);
    expect(parseProxyPool('', '')).toEqual([]);
  });

  it('shows only the host in logs', () => {
    expect(proxyHost('http://user:secret@91.149.249.140:12323')).toBe('91.149.249.140');
    expect(proxyHost('not a url')).toBe('proxy');
  });
});
