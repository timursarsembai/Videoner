import { GrammyError, InlineKeyboard, type Api } from "grammy";
import { NEWS_CHANNEL, sitePath, type Lang } from "./i18n.js";
import type { PromoKey } from "./promo-texts.js";
import { PROMO_RICH_TEXTS } from "./promo-rich-texts.js";
import { isRtl } from "./rich-card.js";
import { surveyKeyboard } from "./survey.js";

// Подсказка после скачивания в виде карточки (rich message): заголовок,
// текст, где нужно — список или пример в рамке, и кнопка действия. Образцы
// одобрены владельцем 17.11.2026. Не приняли карточку — promo.ts шлёт
// прежний простой текст (PROMO_TEXTS).

export type PromoRichText = {
  title: string;
  body?: string;
  items?: string[];
  before?: string;
  example?: string;
  after?: string;
  button?: string;
};

const BOT_USERNAME = "VideonerBot";
// Донаты — два способа на выбор (22.11.2026, решение владельца).
export const DONATE_LINKS = [
  { label: "Boosty", url: "https://boosty.to/timursarsembai/donate" },
  { label: "DonationAlerts", url: "https://www.donationalerts.com/r/timursarsembayev" },
];

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function promoHtml(key: PromoKey, lang: Lang): string | null {
  const t = PROMO_RICH_TEXTS[lang]?.[key];
  if (!t) return null;
  return [
    `<h3>${esc(t.title)}</h3>`,
    t.body ? `<p>${esc(t.body)}</p>` : "",
    t.items?.length ? `<ul>${t.items.map((i) => `<li>${esc(i)}</li>`).join("")}</ul>` : "",
    t.before ? `<p>${esc(t.before)}</p>` : "",
    t.example ? `<pre>${esc(t.example)}</pre>` : "",
    t.after ? `<p>${esc(t.after)}</p>` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export function promoRichMessage(key: PromoKey, lang: Lang) {
  const html = promoHtml(key, lang);
  return html ? { html, ...(isRtl(lang) ? { is_rtl: true } : {}) } : null;
}

// Кнопка действия под подсказкой; у «только звук» и Reddit её нет. У
// просьбы о поддержке — две кнопки, по названиям площадок для донатов.
export function promoKeyboard(key: PromoKey, lang: Lang): InlineKeyboard | undefined {
  if (key === "survey") return surveyKeyboard(lang);
  if (key === "donate") {
    const kb = new InlineKeyboard();
    for (const d of DONATE_LINKS) kb.url(`❤️ ${d.label}`, d.url);
    return kb;
  }
  const label = PROMO_RICH_TEXTS[lang]?.[key]?.button;
  if (!label) return undefined;
  switch (key) {
    case "channel":
      return new InlineKeyboard().url(label, `https://t.me/${NEWS_CHANNEL.replace(/^@/, "")}`);
    case "extension":
      return new InlineKeyboard().url(label, `https://videoner.download${sitePath(lang, "/extension")}`);
    case "group":
      return new InlineKeyboard().url(label, `https://t.me/${BOT_USERNAME}?startgroup=true`);
    case "inline":
      return new InlineKeyboard().switchInlineChosen(label, { query: "", allow_user_chats: true, allow_group_chats: true });
    case "share":
      return new InlineKeyboard().copyText(label, `https://t.me/${BOT_USERNAME}`);
    default:
      return undefined;
  }
}

let richDisabled = false;

// Отправляет подсказку карточкой. false — карточку не приняли (старый сервер
// Bot API, ошибка разметки): тогда promo.ts шлёт простой текст. Отказ по
// другой причине (бот заблокирован, лимит) пробрасываем как есть.
export async function sendPromoRich(tg: Api, chatId: number, key: PromoKey, lang: Lang): Promise<boolean> {
  const message = promoRichMessage(key, lang);
  if (!message || richDisabled) return false;
  try {
    const markup = promoKeyboard(key, lang);
    await tg.sendRichMessage(chatId, message, markup ? { reply_markup: markup } : {});
    return true;
  } catch (e) {
    if (e instanceof GrammyError && (e.error_code === 400 || e.error_code === 404)) {
      if (e.error_code === 404 || /method not found/i.test(e.description)) richDisabled = true;
      console.error("Подсказка-карточка не принята, шлю простым текстом:", e.description);
      return false;
    }
    throw e;
  }
}
