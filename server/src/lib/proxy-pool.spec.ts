import { parseProxyPool, pickRandom, proxyAffinityKey, proxyHost } from './proxy-pool';

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

  it('picks a random item, never past the end', () => {
    expect(pickRandom([], () => 0.5)).toBeUndefined();
    expect(pickRandom(['a', 'b', 'c'], () => 0)).toBe('a');
    expect(pickRandom(['a', 'b', 'c'], () => 0.5)).toBe('b');
    expect(pickRandom(['a', 'b', 'c'], () => 0.9999)).toBe('c');
    expect(pickRandom(['a', 'b', 'c'], () => 1)).toBe('c');
  });

  it('keys every form of a YouTube link by the video id', () => {
    const key = 'youtube:dQw4w9WgXcQ';
    for (const url of [
      'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      'https://m.youtube.com/watch?feature=share&v=dQw4w9WgXcQ&t=10',
      'https://youtu.be/dQw4w9WgXcQ?si=abc',
      'https://www.youtube.com/shorts/dQw4w9WgXcQ',
      'https://music.youtube.com/watch?v=dQw4w9WgXcQ&list=x',
    ]) {
      expect(proxyAffinityKey(url)).toBe(key);
    }
    expect(proxyAffinityKey('https://www.instagram.com/reel/abc/?igsh=1#x')).toBe('www.instagram.com/reel/abc/?igsh=1');
    expect(proxyAffinityKey('not a url')).toBeNull();
  });
});
