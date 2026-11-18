import { YtdlpProcessService } from './ytdlp-process.service';

// Пост Threads с записью Instagram: отказ instagram.com нашему адресу считаем
// блокировкой — тогда сервер повторяет запрос через прокси.
describe('Threads: недоступное вложение Instagram', () => {
  const msg =
    'ERROR: [threads] Instagram attachment of this Threads post is unavailable: https://www.instagram.com/p/ABC123/';
  const service = new YtdlpProcessService() as any;

  it('считается отказом площадки для запроса без кук', () => {
    expect(service.isBlockError(msg, 'threads', false)).toBe(true);
  });

  it('не путается с другими ошибками Threads', () => {
    expect(service.isBlockError('ERROR: [threads] No video or photo is visible in this Threads post', 'threads', false)).toBe(false);
  });
});
