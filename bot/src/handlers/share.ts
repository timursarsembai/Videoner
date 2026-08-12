import { Api, InputFile } from "grammy";
import { messages, type Lang } from "../i18n.js";

/**
 * Публикация ссылки в канал.
 *
 * В канал уходит ССЫЛКА на исходный пост в соцсети плюс обложка ролика — тот
 * самый кадр, который площадка показывает в превью поста. Сам видеофайл не
 * публикуется нигде и никогда.
 *
 * Обложку грузим сами, потому что Telegram отказывается строить превью для
 * части площадок: для threads.com он возвращает link_preview_options
 * {is_disabled: true} ещё до загрузки страницы и игнорирует явный
 * is_disabled: false, у Instagram и Facebook карточка тоже не появляется.
 * Без обложки пост выглядит голой ссылкой, поэтому картинку отправляем сами,
 * а ссылку кладём в подпись.
 *
 * Публикуется анонимно: кто скачал — в канале не указывается.
 *
 * Канал не задан — не публикуем ничего, бот работает как раньше.
 */

export const SHARE_CHANNEL = process.env.TELEGRAM_CHANNEL_ID ?? "";

// Одна и та же ссылка не должна попадать в канал дважды: без этого лента
// быстро превратилась бы в повторы популярного ролика. Память процесса —
// после перезапуска возможен один дубль, что дешевле похода в базу.
const published = new Map<string, number>();
const PUBLISHED_TTL_MS = 30 * 24 * 60 * 60 * 1000;

setInterval(() => {
  const cutoff = Date.now() - PUBLISHED_TTL_MS;
  for (const [url, at] of published.entries()) {
    if (at < cutoff) published.delete(url);
  }
}, 60 * 60 * 1000);

export async function publishLink(
  api: Api,
  url: string,
  title: string,
  thumbnail: string | undefined,
  lang: Lang,
  coverFileId?: string,
) {
  if (!SHARE_CHANNEL) return;
  if (published.has(url)) return;
  published.set(url, Date.now());

  const caption = messages[lang].channelPost(title, url);

  try {
    // У поста из фотографий обложка площадки — это сам снимок в полном
    // качестве, и публиковать его значило бы выкладывать в канал материал, а не
    // ссылку на него. Поэтому для таких постов бот передаёт сюда уменьшенный
    // вариант, который вернул сам Telegram, приняв снимок, — по file_id, без
    // повторной загрузки.
    if (coverFileId) {
      await api.sendPhoto(SHARE_CHANNEL, coverFileId, { caption });
      return;
    }
    if (thumbnail) {
      // Скачиваем и заливаем сами, а не передаём ссылку на CDN строкой:
      // обложки Instagram и Threads лежат за подписанными адресами fbcdn,
      // которые загрузчику Telegram отдаются не всегда — тогда sendPhoto по
      // URL падает, а через InputFile байты уходят с нашей стороны и вопрос
      // доступа к CDN снимается.
      await api.sendPhoto(SHARE_CHANNEL, new InputFile(new URL(thumbnail)), { caption });
      return;
    }
    await api.sendMessage(SHARE_CHANNEL, caption);
  } catch (e: any) {
    console.error("Публикация в канал не удалась:", e?.message ?? e);
    // Не смогли с обложкой — пробуем текстом: пост без картинки лучше, чем
    // отсутствие поста. Отметку о публикации снимаем только если не удалось
    // вообще ничего, чтобы ссылка могла попасть в канал в следующий раз.
    try {
      await api.sendMessage(SHARE_CHANNEL, caption);
    } catch (inner: any) {
      console.error("Текстовый запасной вариант тоже не прошёл:", inner?.message ?? inner);
      published.delete(url);
    }
  }
}
