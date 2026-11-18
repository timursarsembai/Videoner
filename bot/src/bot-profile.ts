import { GrammyError, InlineKeyboard, type Api } from "grammy";
import { LANGS, NEWS_CHANNEL, messages, sitePath, type Lang } from "./i18n.js";
import { PROFILE_TEXTS } from "./bot-profile-texts.js";

// Профиль бота в Telegram (владелец 18.11.2026): описание — его видно в
// профиле и на пустом чате до «Старт», короткое описание — в профиле и при
// пересылке ссылки на бота, и контакт для обратной связи (/contact).
// Ставим из кода при каждом запуске — так профиль всегда совпадает с кодом.

export const FEEDBACK_USERNAME = "sarsembai_timur";
const SITE = "videoner.download";

export function botDescription(lang: Lang): string {
  const p = PROFILE_TEXTS[lang];
  const site = `${SITE}${sitePath(lang, "")}`;
  return [
    `🎬 ${p.intro}`,
    "",
    `📥 ${p.send}`,
    `YouTube · ${p.tiktok} · ${p.instagram} · Facebook · X · Threads · Reddit · VK · Rutube · OK · Pinterest · Vimeo`,
    "",
    `✨ ${p.features}`,
    "",
    `🌐 ${p.site}: ${site}`,
    `🧩 ${p.extension}: ${site}/extension`,
    `📣 ${p.news}: ${NEWS_CHANNEL}`,
    `✉️ ${p.feedback}: @${FEEDBACK_USERNAME}`,
  ].join("\n");
}

export function botShortDescription(lang: Lang): string {
  return `🎬 ${PROFILE_TEXTS[lang].short} ${SITE}${sitePath(lang, "")}`;
}

// Ответ на /contact.
export function contactMessage(lang: Lang): { text: string; keyboard: InlineKeyboard } {
  return {
    text: `✉️ ${PROFILE_TEXTS[lang].feedback}: @${FEEDBACK_USERNAME}`,
    keyboard: new InlineKeyboard().url(messages[lang].contactButton, `https://t.me/${FEEDBACK_USERNAME}`),
  };
}

// language_code — только двухбуквенный ISO 639-1: у сорани (ckb) и
// ингушского (inh) его нет, они видят описание по умолчанию (английское).
type ProfileLang = Exclude<Lang, "en" | "ckb" | "inh">;
const PROFILE_LANGS = LANGS.filter((l): l is ProfileLang => l !== "en" && l !== "ckb" && l !== "inh");

async function withRetry(label: string, call: () => Promise<unknown>) {
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      await call();
      return;
    } catch (e) {
      const retryAfter = e instanceof GrammyError ? e.parameters?.retry_after : undefined;
      if (retryAfter === undefined || attempt === 4) {
        console.error(`Профиль бота ${label}:`, (e as Error)?.message ?? e);
        return;
      }
      await new Promise((r) => setTimeout(r, (retryAfter + 1) * 1000));
    }
  }
}

// Меняем только то, что отличается: 46 языков × 2 текста при каждом
// перезапуске упирались бы в лимит Telegram.
export async function registerBotProfile(api: Api) {
  for (const lang of [undefined, ...PROFILE_LANGS]) {
    const l: Lang = lang ?? "en";
    const opts = lang ? { language_code: lang } : {};
    const description = botDescription(l);
    const short = botShortDescription(l);
    await withRetry(`${l} описание`, async () => {
      if ((await api.getMyDescription(opts)).description !== description) await api.setMyDescription(description, opts);
    });
    await withRetry(`${l} короткое`, async () => {
      if ((await api.getMyShortDescription(opts)).short_description !== short) await api.setMyShortDescription(short, opts);
    });
  }
}
