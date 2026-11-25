import { isRedditUrl, getPlatform } from '../validate/url';
import { parseDownloadOptions } from './helper';
import { estimateVideoSize } from './file-size';
import { YtdlpProcessService } from '../modules/ytdlp/ytdlp-process.service';
import { InfoService } from '../modules/info/info.service';
import { ADULT_CONTENT_ERROR } from './adult-content';
import { VideoQuality, VideoFormat } from '../types';

describe('Reddit entry points', () => {
  it('accepts posts, short post links and mobile share links', () => {
    for (const url of ['https://www.reddit.com/r/videos/comments/6rrwyj/title/',
      'https://old.reddit.com/comments/6rrwyj', 'https://redd.it/6rrwyj',
      'https://www.reddit.com/r/videos/s/AbCd123/']) {
      expect(isRedditUrl(url)).toBe(true); expect(getPlatform(url)).toBe('reddit');
    }
  });
  it('rejects direct media that cannot carry the post age flag and lookalike hosts', () => {
    for (const url of ['https://v.redd.it/abcdef123', 'https://i.redd.it/abcdef.jpg',
      'https://reddit.com.evil.test/comments/abc/', 'https://reddit.com/r/videos/',
      'file://reddit.com/comments/abc/']) expect(isRedditUrl(url)).toBe(false);
  });
  it('keeps a video-only fallback after trying to include audio', () => {
    const args = parseDownloadOptions({ filter: 'mergevideo', quality: VideoQuality['720p'], format: VideoFormat.mp4 }, 'reddit');
    const selector = args[args.indexOf('-f') + 1];
    expect(selector).toContain('+ba/'); expect(selector.split('/').at(-1)).toBe('bv');
  });
  it('picks quality by the short side: wide videos keep the chosen quality', () => {
    const args = parseDownloadOptions({ filter: 'mergevideo', quality: '394p' as never, format: VideoFormat.mp4 }, 'reddit');
    expect(args[args.indexOf('-f') + 1]).not.toContain('width');
    expect(args[args.indexOf('-S') + 1]).toMatch(/^res:394,/);
    const formats = [[390, 180], [852, 394]].map(([width, height]) => ({
      format_id: `${height}`, width, height, ext: 'mp4', vcodec: 'avc1', acodec: 'none', filesize: width * 1000,
    }));
    expect(estimateVideoSize({ formats, duration: 9 } as never, '394p', 'reddit')).toBe(852000);
  });
  it('metadata extraction never opens account cookies or adds an ISP proxy', async () => {
    const process = Object.create(YtdlpProcessService.prototype) as YtdlpProcessService;
    const internal = process as any;
    internal.ytdlpPath = '/unused/yt-dlp';
    internal.makeDisposableCookies = jest.fn(() => { throw new Error('Cookies must not be read'); });
    internal.runProcess = jest.fn().mockResolvedValue({ stdout: '{}', stderr: '' });
    await process.ytdlp(['--dump-single-json', 'https://www.reddit.com/comments/6rrwyj/']);
    expect(internal.makeDisposableCookies).not.toHaveBeenCalled();
    const args = internal.runProcess.mock.calls[0][1];
    expect(args).not.toContain('--cookies'); expect(args).not.toContain('--proxy');
  });
  it('normalizes plugin errors to the existing translated adult refusal', () => {
    const service = Object.create(InfoService.prototype) as any;
    expect(service.handleError(new Error(`ERROR: [reddit+videoner] 6rrwyj: ${ADULT_CONTENT_ERROR}`), 'reddit', false)).toBe(ADULT_CONTENT_ERROR);
  });
});
