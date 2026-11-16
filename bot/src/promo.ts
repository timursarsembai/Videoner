import type { Api } from "grammy";
import { api } from "./helpers.js";
import { sitePath, type Lang } from "./i18n.js";
import { PROMO_TEXTS, type PromoKey } from "./promo-texts.js";

// Подсказки о Videoner после удачного скачивания в личке: короткое отдельное
// сообщение вслед за файлом. Что и когда показать, решает сервер
// (BotUserService.nextPromo): каждую подсказку человек видит один раз, не
// чаще одной в сутки и начиная с 3-го удачного скачивания. Дашборд следит,
// не стали ли из-за них чаще блокировать бота. В группах и встроенном режиме
// не показываем — там это увидят посторонние.
export const BOT_PROMOS: PromoKey[] = ["reddit", "extension", "channel", "group", "audio", "inline", "share"];

export function promoText(key: PromoKey, lang: Lang): string {
  return PROMO_TEXTS[lang][key].replace("{url}", `videoner.download${sitePath(lang, "/extension")}`);
}

// Сбой не должен ничем мешать: файл уже у человека.
export async function sendPromo(tg: Api, chatId: number, telegramId: number, lang: Lang): Promise<void> {
  try {
    const { key } = await api<{ key: string | null }>(`/bot-users/${telegramId}/promo`, { keys: BOT_PROMOS });
    if (!key || !(BOT_PROMOS as string[]).includes(key)) return;
    await tg.sendMessage(chatId, promoText(key as PromoKey, lang), { link_preview_options: { is_disabled: true } });
  } catch (e: any) {
    console.error("Подсказка после скачивания не отправлена:", e?.message ?? e);
  }
}
