// Повторная отправка скачиваний, которые не удались по нашей вине, — с
// извинением под файлом. Первый раз — 10.11.2026: YouTube заблокировал прокси,
// и полдня ни одно скачивание с YouTube не проходило.
//
// Запуск в контейнере бота (там токен и адрес локального Bot API):
//   docker cp items.json videoner-bot:/tmp/items.json
//   docker exec videoner-bot npx tsx scripts/resend-failed.ts /tmp/items.json [--only <telegramId>]
//
// items.json — массив { telegramId, languageCode?, url, kind: "v" | "a",
// quality, extension }. Собирается из базы (неудачные Download), в репозиторий
// не кладётся: там id людей.
//
// Файл уходит тем же путём, что и обычное скачивание (performDownload): та же
// подпись, кеш, обработка ошибок. В канал не публикуем.
import { readFileSync } from "node:fs";
import { Api } from "grammy";
import { messages, type Lang } from "../src/i18n.js";
import { userLang } from "../src/language.js";
import { api, BOT_API_ROOT } from "../src/helpers.js";
import { performDownload, sendersForApi } from "../src/handlers/download.js";
import { postDescription } from "../src/caption.js";

type Item = {
  telegramId: number;
  languageCode?: string;
  url: string;
  kind: "v" | "a";
  quality: string;
  extension: string;
};

const CAPTION_LIMIT = 1024;

// Строка под подписью. Языки — те, что есть у пострадавших; остальным —
// английский.
const NOTE: Partial<Record<Lang, string>> = {
  ru: "❗️ Извините: какое-то время скачивание с YouTube не работало, и этот файл тогда не пришёл. Теперь всё снова работает — вот он.",
  uk: "❗️ Вибачте: деякий час завантаження з YouTube не працювало, і цей файл тоді не надійшов. Тепер усе знову працює — ось він.",
  en: "❗️ Sorry: downloading from YouTube was broken for a while, and this file didn't arrive then. Everything works again now — here it is.",
};

async function main() {
  const [path, flag, only] = process.argv.slice(2);
  if (!path) throw new Error("usage: resend-failed.ts items.json [--only <telegramId>]");
  const token = process.env.BOT_TOKEN;
  if (!token) throw new Error("BOT_TOKEN is not set");
  const tg = new Api(token, BOT_API_ROOT ? { apiRoot: BOT_API_ROOT } : undefined);

  let items = JSON.parse(readFileSync(path, "utf8")) as Item[];
  if (flag === "--only") items = items.filter((i) => String(i.telegramId) === only);

  for (const item of items) {
    const who = `${String(item.telegramId).slice(0, 3)}…`;
    try {
      const lang = await userLang({ id: item.telegramId, language_code: item.languageCode });
      const m = messages[lang];
      const note = NOTE[lang] ?? NOTE.en!;
      const meta = { telegramId: item.telegramId, telegramLanguageCode: item.languageCode };
      const info = await api<{ title?: string; description?: string; thumbnail?: string }>("/info", {
        url: item.url,
        ...meta,
      });
      const formatCaption = (title: string, sourceUrl: string, shareUrl?: string, description?: string) => {
        const body = m.fileCaption(title, sourceUrl, shareUrl, description);
        return `${body.slice(0, CAPTION_LIMIT - note.length - 2)}\n\n${note}`;
      };
      const ok = await performDownload(
        item.telegramId,
        item.kind,
        item.quality,
        item.extension,
        item.url,
        lang,
        {
          ...sendersForApi(tg, item.telegramId, { publish: false }),
          formatCaption,
          description: postDescription(item.url, info.description),
        },
        meta,
        info.title ?? "",
        info.thumbnail,
      );
      console.log(`${who} ${item.url}: ${ok ? "отправлено" : "не отправлено"}`);
    } catch (e: any) {
      console.error(`${who} ${item.url}: ошибка — ${e?.message ?? e}`);
    }
    // Не долбим YouTube и Telegram пачкой.
    await new Promise((r) => setTimeout(r, 5000));
  }
}

main().then(
  () => process.exit(0),
  (e) => {
    console.error(e);
    process.exit(1);
  },
);
