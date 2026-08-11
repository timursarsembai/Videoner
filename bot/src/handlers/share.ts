import { Api } from "grammy";
import { messages, type Lang } from "../i18n.js";

/**
 * Публикация ссылки в канал.
 *
 * В канал уходит ССЫЛКА на исходный пост в соцсети, а не файл. Это принципиально:
 * ссылку на публичный пост площадки сами предлагают распространять кнопкой
 * «Поделиться», и её публикация не является использованием чужого произведения.
 * Видео мы не перезаливаем никуда и никогда.
 *
 * Публикуется анонимно: кто скачал — в канале не указывается, поэтому в посте
 * нет и персональных данных. Условие описано в пользовательском соглашении, а
 * человек видит предупреждение прямо под кнопками выбора качества — до того,
 * как нажмёт. Мелким шрифтом это не спрятано.
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

export async function publishLink(api: Api, url: string, title: string, lang: Lang) {
  if (!SHARE_CHANNEL) return;
  if (published.has(url)) return;
  published.set(url, Date.now());
  try {
    await api.sendMessage(SHARE_CHANNEL, messages[lang].channelPost(title, url));
  } catch (e: any) {
    // Публикация — побочная задача: если канал недоступен или бота сняли с
    // админов, человек всё равно должен получить своё видео. Поэтому ошибка
    // только в лог, наверх не поднимается.
    console.error("Публикация в канал не удалась:", e?.message ?? e);
    published.delete(url);
  }
}
