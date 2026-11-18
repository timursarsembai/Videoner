import { parseDownloadOptions } from './helper';
import { VideoFormat } from '../types';

// Pinterest: видео — дорожки без звука (234x416 … 720x1280), звук отдельно.
// Качество подписано по короткой стороне — выбор должен смотреть обе стороны.
describe('Pinterest: выбор формата', () => {
  const selectorFor = (quality: string) => {
    const args = parseDownloadOptions({ filter: 'mergevideo', quality: quality as never, format: VideoFormat.mp4 }, 'pinterest');
    return { selector: args[args.indexOf('-f') + 1], sort: args[args.indexOf('-S') + 1] };
  };

  it('234p вертикального ролика: кап 416 по обеим сторонам, видео со звуком', () => {
    const { selector, sort } = selectorFor('234p');
    expect(selector.startsWith('bv*[width<=?416][height<=?416]+ba/')).toBe(true);
    expect(selector.endsWith('/bv*+ba/b')).toBe(true);
    expect(sort).toBe('res:234,vcodec:avc1,acodec:aac');
  });

  it('720p: кап 1280 — проходит 720x1280, а не только 360x640', () => {
    expect(selectorFor('720p').selector).toContain('[width<=?1280][height<=?1280]');
  });
});
