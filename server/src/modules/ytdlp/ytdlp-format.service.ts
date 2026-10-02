import { Injectable } from '@nestjs/common';
import { PlaylistVideoInfo, YtdlpVideoInfo } from '../../types/youtube';
import { YtdlpProcessService } from './ytdlp-process.service';

// Сколько живут метаданные в кеше и сколько записей держим. Одно скачивание
// запрашивает их дважды подряд: /info, чтобы показать выбор качества, и
// /download перед стартом, чтобы проверить длительность и назвать файл. У
// YouTube каждый такой запрос идёт через прокси с оплатой за гигабайты, а
// между ними обычно секунды или минуты. Десяти минут хватает, чтобы выбрать
// качество, и мало, чтобы название или список форматов успели устареть.
// Ответ YouTube весит 0,3-1 МБ, поэтому записей не больше сотни — до ~100 МБ
// памяти в худшем случае. Не поместилось — старые вытесняются первыми.
const INFO_CACHE_TTL_MS = 10 * 60 * 1000;
const INFO_CACHE_MAX_ENTRIES = 100;

// Метаданные (info/playlist) — вторая половина бывшего единого YtdlpService
// (см. ytdlp-process.service.ts про причину разделения и про исправленный
// заодно баг с тройным инстансом). Сам запуск процесса, семафоры и куки —
// в YtdlpProcessService, этот сервис только парсит JSON-вывод yt-dlp.
@Injectable()
export class YtdlpFormatService {
  constructor(private readonly process: YtdlpProcessService) {}

  // Хранится сырой JSON, а не объект: каждый вызов получает свою копию, и
  // правка результата одним потребителем не может испортить его другому.
  private readonly infoCache = new Map<
    string,
    { json: string; expiresAt: number }
  >();
  // Запросы, которые уже выполняются: второй такой же (двойное нажатие,
  // сайт и бот одновременно) ждёт первый, а не запускает yt-dlp ещё раз.
  private readonly infoInFlight = new Map<string, Promise<string>>();

  async getYtdlpVideoInfo(
    url: string,
    options?: { skipCookies?: boolean; allowPhotos?: boolean },
  ): Promise<YtdlpVideoInfo> {
    // skipCookies в ключ не входит: удачный ответ годится всем, с куками он
    // получен или без. Наоборот, так повтор без кук в InfoService
    // (fetchInfoWithCookieFallback) избавляет /download от той же попытки
    // с протухшими куками. allowPhotos входит — он меняет сам ответ.
    const key = `${options?.allowPhotos ? 'p' : '-'}|${url}`;

    const cached = this.infoCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return JSON.parse(cached.json);
    }

    let pending = this.infoInFlight.get(key);
    if (!pending) {
      pending = this.fetchInfoJson(url, options).finally(() => {
        this.infoInFlight.delete(key);
      });
      this.infoInFlight.set(key, pending);
    }
    const json = await pending;
    // Ошибки не кешируются: до сюда доходит только удачный ответ.
    this.rememberInfo(key, json);
    return JSON.parse(json);
  }

  private rememberInfo(key: string, json: string) {
    const now = Date.now();
    // Map хранит порядок вставки: удаление и повторная вставка ставят запись
    // в конец, поэтому первыми вытесняются самые старые.
    this.infoCache.delete(key);
    this.infoCache.set(key, { json, expiresAt: now + INFO_CACHE_TTL_MS });
    for (const [k, entry] of this.infoCache) {
      if (this.infoCache.size <= INFO_CACHE_MAX_ENTRIES && entry.expiresAt > now) {
        break;
      }
      this.infoCache.delete(k);
    }
  }

  private async fetchInfoJson(
    url: string,
    options?: { skipCookies?: boolean; allowPhotos?: boolean },
  ): Promise<string> {
    // --dump-single-json, а НЕ --dump-json: второй печатает по объекту на
    // каждый элемент поста, и JSON.parse всего вывода падает на второй строке
    // («Unexpected non-whitespace character ... line 2 column 1»). Любая
    // карусель — Instagram, Threads — ломалась именно здесь. Одиночный пост
    // при этом отдаётся тем же одним объектом, что и раньше.
    const command = ['--dump-single-json', '--no-download'];
    // Пост без единого видео (только фотографии) yt-dlp считает ошибкой:
    // «There is no video in this post». Для площадок, где мы умеем забирать
    // фото, ошибку глушим — сведения о посте при этом отдаются полностью,
    // вместе со снимками в thumbnails. Для остальных площадок оставляем как
    // есть: там это осмысленное сообщение, а не помеха.
    if (options?.allowPhotos) {
      command.push('--ignore-no-formats-error');
    }
    command.push(url);
    const result = await this.process.ytdlp(command, options);
    // Разбираем здесь, чтобы битый вывод упал ошибкой и не попал в кеш.
    JSON.parse(result.stdout);
    return result.stdout;
  }

  async getYoutubePlaylistInfo(url: string): Promise<PlaylistVideoInfo[]> {
    const command = [
      '--dump-json',
      '--no-download',
      '--flat-playlist',
      '--playlist-reverse',
      url,
    ];
    return this.process.ytdlp(command).then((result) => {
      // Split output into lines and filter empty lines
      const jsonLines = result.stdout.split('\n').filter((line) => line.trim());
      // parse all json lines
      const json = jsonLines.map((line) => JSON.parse(line));

      return json;
    });
  }
}
