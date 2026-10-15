import { Context } from "grammy";
import { messages, type Lang } from "../i18n.js";
import { api } from "../helpers.js";
import { handleLinks } from "./download.js";

/**
 * Ссылки-приглашения: videoner.download/b/<код> → t.me/<бот>?start=<код>.
 *
 * В start Telegram пропускает не больше 64 символов из [A-Za-z0-9_-], поэтому
 * сама ссылка на видео лежит на сервере (модуль share-link), а сюда приходит
 * только её код. Получив ссылку, обрабатываем её ровно как присланную
 * сообщением — через handleLinks, со всеми лимитами и проверкой подписки.
 */

// Коды выдаёт сервер (8 символов без похожих букв), но с запасом: проверка
// нужна лишь затем, чтобы произвольный текст из start не попал в путь запроса.
const CODE_PATTERN = /^[A-Za-z0-9]{4,32}$/;

export async function openInvite(ctx: Context, code: string, lang: Lang): Promise<void> {
  const m = messages[lang];
  if (!CODE_PATTERN.test(code)) {
    await ctx.reply(m.start);
    return;
  }

  let url: string;
  try {
    ({ url } = await api<{ url: string }>(`/share-links/${code}`));
  } catch (e: any) {
    const reason = e?.message ?? String(e);
    console.error(`Не удалось открыть приглашение ${code}:`, reason);
    // Текст 404 задаёт ShareLinkService.resolve. Остальное — сбой связи или
    // сервера: ссылка, скорее всего, рабочая, и говорить «не нашёл» неверно.
    await ctx.reply(reason === "Share link not found" ? m.inviteNotFound : m.inviteUnavailable);
    return;
  }

  await ctx.reply(m.inviteGreeting);
  await handleLinks(ctx, [url]);
}
