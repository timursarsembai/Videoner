import { YtdlpFormatService } from './ytdlp-format.service';
import { YtdlpProcessService } from './ytdlp-process.service';

function makeService(ytdlp: jest.Mock) {
  return new YtdlpFormatService({ ytdlp } as unknown as YtdlpProcessService);
}

const URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

describe('YtdlpFormatService: кеш метаданных', () => {
  afterEach(() => jest.useRealTimers());

  it('второй запрос той же ссылки не запускает yt-dlp', async () => {
    const ytdlp = jest.fn().mockResolvedValue({ stdout: '{"id":"a"}', stderr: '' });
    const service = makeService(ytdlp);
    await service.getYtdlpVideoInfo(URL, { allowPhotos: false });
    // Повтор без кук (как в InfoService) тоже берёт из кеша.
    const second = await service.getYtdlpVideoInfo(URL, { skipCookies: true });
    expect(second).toEqual({ id: 'a' });
    expect(ytdlp).toHaveBeenCalledTimes(1);
  });

  it('каждый вызов получает свою копию', async () => {
    const ytdlp = jest.fn().mockResolvedValue({ stdout: '{"id":"a"}', stderr: '' });
    const service = makeService(ytdlp);
    const first: any = await service.getYtdlpVideoInfo(URL);
    first.id = 'испорчено';
    expect(await service.getYtdlpVideoInfo(URL)).toEqual({ id: 'a' });
  });

  it('одновременные запросы ждут один процесс', async () => {
    const ytdlp = jest.fn().mockResolvedValue({ stdout: '{"id":"a"}', stderr: '' });
    const service = makeService(ytdlp);
    await Promise.all([service.getYtdlpVideoInfo(URL), service.getYtdlpVideoInfo(URL)]);
    expect(ytdlp).toHaveBeenCalledTimes(1);
  });

  it('allowPhotos — отдельная запись: он меняет сам ответ', async () => {
    const ytdlp = jest.fn().mockResolvedValue({ stdout: '{"id":"a"}', stderr: '' });
    const service = makeService(ytdlp);
    await service.getYtdlpVideoInfo(URL);
    await service.getYtdlpVideoInfo(URL, { allowPhotos: true });
    expect(ytdlp).toHaveBeenCalledTimes(2);
  });

  it('ошибки не кешируются', async () => {
    const ytdlp = jest
      .fn()
      .mockRejectedValueOnce(new Error('Sign in to confirm'))
      .mockResolvedValueOnce({ stdout: '{"id":"a"}', stderr: '' });
    const service = makeService(ytdlp);
    await expect(service.getYtdlpVideoInfo(URL)).rejects.toThrow('Sign in');
    expect(await service.getYtdlpVideoInfo(URL)).toEqual({ id: 'a' });
  });

  it('битый вывод — ошибка, а не запись в кеше', async () => {
    const ytdlp = jest
      .fn()
      .mockResolvedValueOnce({ stdout: 'not json', stderr: '' })
      .mockResolvedValueOnce({ stdout: '{"id":"a"}', stderr: '' });
    const service = makeService(ytdlp);
    await expect(service.getYtdlpVideoInfo(URL)).rejects.toThrow();
    expect(await service.getYtdlpVideoInfo(URL)).toEqual({ id: 'a' });
  });

  it('через 10 минут запись устаревает', async () => {
    jest.useFakeTimers({ now: new Date('2026-10-02T10:00:00Z') });
    const ytdlp = jest.fn().mockResolvedValue({ stdout: '{"id":"a"}', stderr: '' });
    const service = makeService(ytdlp);
    await service.getYtdlpVideoInfo(URL);
    jest.setSystemTime(new Date('2026-10-02T10:09:00Z'));
    await service.getYtdlpVideoInfo(URL);
    expect(ytdlp).toHaveBeenCalledTimes(1);
    jest.setSystemTime(new Date('2026-10-02T10:11:00Z'));
    await service.getYtdlpVideoInfo(URL);
    expect(ytdlp).toHaveBeenCalledTimes(2);
  });

  it('держит не больше 100 записей, вытесняя старые', async () => {
    const ytdlp = jest.fn().mockResolvedValue({ stdout: '{"id":"a"}', stderr: '' });
    const service = makeService(ytdlp);
    for (let i = 0; i < 101; i++) {
      await service.getYtdlpVideoInfo(`${URL}&n=${i}`);
    }
    expect(ytdlp).toHaveBeenCalledTimes(101);
    await service.getYtdlpVideoInfo(`${URL}&n=100`);
    expect(ytdlp).toHaveBeenCalledTimes(101);
    await service.getYtdlpVideoInfo(`${URL}&n=0`);
    expect(ytdlp).toHaveBeenCalledTimes(102);
  });
});
