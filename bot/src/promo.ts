import { GrammyError, type Api } from "grammy";
import { api } from "./helpers.js";
import { NEWS_CHANNEL, sitePath, type Lang } from "./i18n.js";
import { PROMO_TEXTS, type PromoKey } from "./promo-texts.js";
import { sendPromoRich } from "./promo-rich.js";

// Подсказки о Videoner после удачного скачивания в личке: короткое отдельное
// сообщение вслед за файлом. Что и когда показать, решает сервер
// (BotUserService.nextPromo): каждую подсказку человек видит один раз, не
// чаще одной в сутки и начиная с 3-го удачного скачивания. Дашборд следит,
// не стали ли из-за них чаще блокировать бота. В группах и встроенном режиме
// не показываем — там это увидят посторонние.
export const BOT_PROMOS: PromoKey[] = ["reddit", "extension", "channel", "group", "audio", "inline", "share", "donate"];

export function promoText(key: PromoKey, lang: Lang): string {
  return PROMO_TEXTS[lang][key].replace("{url}", `videoner.download${sitePath(lang, "/extension")}`);
}

// Сбой не должен ничем мешать: файл уже у человека. Дольше PROMO_WAIT_MS не
// ждём: от подсказки ждёт выбор качества следующей ссылки. Не успели к сроку —
// подсказку не отправляем вовсе (опоздавшая пришла бы посреди выбора
// качества следующей ссылки).
const PROMO_WAIT_MS = 10_000;
export function sendPromo(tg: Api, chatId: number, telegramId: number, lang: Lang): Promise<void> {
  const deadline = Date.now() + PROMO_WAIT_MS;
  return Promise.race([
    trySendPromo(tg, chatId, telegramId, lang, deadline),
    new Promise<void>((resolve) => setTimeout(resolve, PROMO_WAIT_MS)),
  ]);
}

// Подписан ли человек на канал новостей — тогда звать его туда незачем. Бот —
// админ канала (публикует туда статьи блога, BLOG_CHANNEL), поэтому Telegram
// ему отвечает. Не удалось проверить — приглашение покажем: иначе при сбое
// (бота сняли с админов) подсказка про канал молча пропала бы у всех.
const MEMBER = new Set(["creator", "administrator", "member"]);
async function inNewsChannel(tg: Api, telegramId: number): Promise<boolean> {
  try {
    const member = await tg.getChatMember(NEWS_CHANNEL, telegramId);
    return MEMBER.has(member.status) || (member.status === "restricted" && member.is_member);
  } catch (e: any) {
    console.error("Не удалось проверить подписку на канал для подсказки:", e?.message ?? e);
    return false;
  }
}

async function trySendPromo(tg: Api, chatId: number, telegramId: number, lang: Lang, deadline: number): Promise<void> {
  try {
    // Недолго: от ответа ждёт выбор качества следующей ссылки.
    // Сначала — что человеку подходит сейчас (с 3-го скачивания, раз в
    // сутки, ещё не видел; про расширение сервер уберёт сам, если человек
    // подключал аккаунт кодом из расширения). Подписку на канал спрашиваем у
    // Telegram, только если подсказка про канал среди подходящих: так не
    // дёргаем его на каждое скачивание.
    const path = `/bot-users/${telegramId}/promo`;
    const { candidates } = await api<{ candidates?: unknown }>(path, { keys: BOT_PROMOS, peek: true }, { timeoutMs: 3000 });
    // Сервер старее бота (peek не знает и уже записал показ) — не гадаем.
    if (!Array.isArray(candidates)) return;
    let keys = BOT_PROMOS.filter((k) => candidates.includes(k));
    if (keys.includes("channel") && (await inNewsChannel(tg, telegramId))) keys = keys.filter((k) => k !== "channel");
    if (!keys.length) return;
    const { key } = await api<{ key: string | null }>(path, { keys }, { timeoutMs: 3000 });
    if (!key || !(keys as string[]).includes(key)) return;
    if (Date.now() > deadline) {
      await api(`${path}/failed`, { key }, { timeoutMs: 3000 }).catch(() => {});
      return;
    }
    try {
      if (!(await sendPromoRich(tg, chatId, key as PromoKey, lang))) {
        await tg.sendMessage(chatId, promoText(key as PromoKey, lang), { link_preview_options: { is_disabled: true } });
      }
    } catch (e) {
      // Telegram отказал (лимит, бот заблокирован) — снимаем отметку о показе
      // (BotUserService.promoFailed). Сбой сети не снимаем: сообщение могло
      // и дойти, а показывать подсказку дважды нельзя.
      if (e instanceof GrammyError) {
        await api(`/bot-users/${telegramId}/promo/failed`, { key }, { timeoutMs: 5000 }).catch(() => {});
      }
      throw e;
    }
  } catch (e: any) {
    console.error("Подсказка после скачивания не отправлена:", e?.message ?? e);
  }
}
