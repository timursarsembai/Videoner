import { EventEmitter } from 'events';
import * as cp from 'child_process';
import * as helpers from '../../lib/helper';
import { YtdlpProcessService } from './ytdlp-process.service';
import { VideoFormat, VideoQuality } from '../../types';

describe('Reddit download ISP fallback', () => {
  afterEach(() => jest.restoreAllMocks());
  it('starts direct, retries 403/429 via ISP, keeps metadata, and never reads cookies', async () => {
    const service = new YtdlpProcessService() as any;
    service.ytdlpPath = '/test/yt-dlp';
    service.proxyPool = ['http://first.test:1234', 'http://second.test:1234'];
    service.makeDisposableCookies = jest.fn(() => { throw new Error('Must not read cookies'); });
    jest.spyOn(service, 'getOutputPath').mockReturnValue('/tmp/reddit-reserve-test.mp4');
    jest.spyOn(helpers, 'stringToProgress').mockReturnValue({ percentage: 40 } as any);
    const attempts: string[][] = [];
    jest.spyOn(cp, 'spawn').mockImplementation((_cmd: any, args: any) => {
      attempts.push([...args]); const n = attempts.length;
      const child = new EventEmitter() as any;
      child.stdout = new EventEmitter(); child.stderr = new EventEmitter();
      setImmediate(() => {
        if (n === 1) child.stdout.emit('data', Buffer.from('progress'));
        if (n < 3) child.stderr.emit('data', Buffer.from(`ERROR: HTTP Error ${n === 1 ? 403 : 429}: Forbidden`));
        else child.stdout.emit('data', Buffer.from('has already been downloaded'));
        child.emit('exit', n < 3 ? 1 : 0);
      });
      return child;
    });
    const result = await service.download('https://www.reddit.com/comments/6rrwyj/', 'reddit',
      { filter: 'mergevideo', quality: VideoQuality['480p'], format: VideoFormat.mp4 }, { infoJson: '{}' });
    await new Promise<void>((resolve, reject) => result.subscribe({ complete: resolve, error: reject }));
    expect(attempts).toHaveLength(3);
    expect(attempts[0]).not.toContain('--proxy');
    expect(attempts[1]).toContain('--proxy'); expect(attempts[2]).toContain('--proxy');
    expect(attempts[1][attempts[1].indexOf('--proxy') + 1]).not.toBe(attempts[2][attempts[2].indexOf('--proxy') + 1]);
    expect(attempts.every(args => args.includes('--load-info-json') && args.includes('--continue'))).toBe(true);
    expect(service.makeDisposableCookies).not.toHaveBeenCalled();
    expect(service.proxyUntil.has('reddit')).toBe(false);
  });
});
