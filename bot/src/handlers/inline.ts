import { Bot, InlineKeyboard, InputFile, InputMediaBuilder } from "grammy";
import { detectLang, messages, type Lang } from "../i18n.js";
import {
  ADMIN_TELEGRAM_ID,
  API_URL,
  BOT_API_ROOT,
  CLOUD_SIZE_LIMIT,
  api,
  checkUserRateLimit,
  friendlyError,
} from "../helpers.js";
import { isChannelMember } from "./membership.js";

// Инлайн-режим: «@бот <ссылка>» в ЛЮБОМ чате, даже там, где бота нет. Человек
// выбирает единственный результат, в чат уходит заглушка, а как только видео
// скачано — заглушка заменяется самим видео.
//
// Почему именно в два шага. На инлайн-запрос Telegram ждёт ответа считаные
// секунды, а у нас одно только получение метаданных занимает дольше. Поэтому на
// запрос отвечаем мгновенно и без обращения к серверу, а работа начинается уже
// после ВЫБОРА результата — по событию chosen_inline_result.
//
// Два требования Telegram, без которых схема не работает вовсе:
//   1. У @BotFather включён Inline Feedback = 100%. Это ВЕРОЯТНОСТЬ, с которой
//      приходит chosen_inline_result. На значении по умолчанию (и на 1%, как
//      было у нас) уведомление приходило бы к одному человеку из ста, а
//      остальные девяносто девять смотрели бы на вечную заглушку.
//   2. К результату прикреплена инлайн-клавиатура. Без неё Telegram НЕ
//      присылает inline_message_id — тот самый идентификатор, по которому
//      заглушка потом заменяется видео. Кнопка «Открыть бота» стоит там не для
//      красоты.
const SHARE_CHANNEL = process.env.SHARE_CHANNEL ?? "";

// Заглушку заменяем один раз. Telegram честно предупреждает, что
// chosen_inline_result может прийти повторно из-за кеширования результатов —
// без этой защиты одно и то же видео скачивалось бы дважды.
const handled = new Set<string>();

// Качество для инлайна выбираем сами: выбирать в этом режиме негде, кнопок нет.
// 720p — компромисс между «прилично выглядит» и «дойдёт за разумное время»;
// если его нет, берём первое предложенное сервером.
function pickQuality(available: string[]): string | null {
  if (!available.length) return null;
  return available.find((q) => q === "720p") ?? available[0];
}

export function registerInlineHandlers(bot: Bot) {
  bot.on("inline_query", async (ctx) => {
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];
    const url = ctx.inlineQuery.query.trim();

    // Пусто или не ссылка — показываем кнопку «отправьте ссылку боту» вместо
    // результата. Дёргать сервер здесь нельзя: Telegram ждёт ответа секунды.
    if (!/^https?:\/\//i.test(url)) {
      await ctx.answerInlineQuery([], {
        cache_time: 0,
        is_personal: true,
        button: { text: m.inlineHintButton, start_parameter: "inline" },
      });
      return;
    }

    await ctx.answerInlineQuery(
      [
        {
          type: "article",
          id: "download",
          title: m.inlineResultTitle,
          description: m.inlineResultDescription,
          input_message_content: {
            message_text: m.inlinePlaceholder,
            link_preview_options: { is_disabled: true },
          },
          // Клавиатура обязательна — см. комментарий вверху файла.
          reply_markup: new InlineKeyboard().url(
            m.inlineOpenBot,
            `https://t.me/${ctx.me.username}`,
          ),
        },
      ],
      // cache_time: 0 и is_personal: результат зависит от конкретного человека
      // (его лимит и подписка), кешировать его между людьми нельзя.
      { cache_time: 0, is_personal: true },
    );
  });

  bot.on("chosen_inline_result", async (ctx) => {
    const chosen = ctx.chosenInlineResult;
    const inlineMessageId = chosen.inline_message_id;
    const url = chosen.query.trim();
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];

    if (!inlineMessageId) {
      // Такого быть не должно (к результату прикреплена клавиатура), но если
      // Telegram всё же не дал идентификатор — заменять нечего.
      console.error("chosen_inline_result без inline_message_id — нечего заменять");
      return;
    }
    if (handled.has(inlineMessageId)) return;
    handled.add(inlineMessageId);

    const say = (text: string) =>
      bot.api
        .editMessageTextInline(inlineMessageId, text, {
          link_preview_options: { is_disabled: true },
        })
        .catch((e) => console.error("Не удалось обновить инлайн-сообщение:", e?.message ?? e));

    try {
      if (ctx.from.id !== ADMIN_TELEGRAM_ID && !checkUserRateLimit(ctx.from.id)) {
        await say(m.inlineRateLimited);
        return;
      }
      if (SHARE_CHANNEL && !(await isChannelMember(ctx, ctx.from.id))) {
        await say(m.inlineSubscribeRequired(SHARE_CHANNEL));
        return;
      }

      const info = await api<{
        title: string;
        itemCount?: number;
        qualities: { video: string[]; audio: string[] };
      }>("/info", {
        url,
        telegramId: ctx.from.id,
        telegramUsername: ctx.from.username,
        telegramLanguageCode: ctx.from.language_code,
      });

      // Карусель и фотопосты в инлайне не отправить: заменить заглушку можно
      // ровно одним файлом, альбом сюда не поместится.
      const quality = pickQuality(info.qualities?.video ?? []);
      if ((info.itemCount ?? 1) > 1 || !quality || quality === "original") {
        await say(m.inlineOnlySingleVideo);
        return;
      }

      const started = await api<{ downloadId: string; fileName: string }>(
        "/download/video",
        {
          url,
          quality,
          extension: "mp4",
          source: "BOT",
          telegramId: ctx.from.id,
          telegramUsername: ctx.from.username,
          telegramLanguageCode: ctx.from.language_code,
        },
      );

      let status: { status: string; items?: { filename: string }[] } | undefined;
      for (let i = 0; i < 400; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        status = await api(`/download/${started.downloadId}/status`);
        if (status && (status.status === "COMPLETED" || status.status === "FAILED")) break;
      }
      if (!status || status.status !== "COMPLETED") {
        throw new Error(status?.status === "FAILED" ? m.downloadFailed : m.downloadTimeout);
      }

      const fileName = encodeURIComponent(status.items?.[0]?.filename ?? started.fileName);
      const fileUrl = `${API_URL}/download/${fileName}`;
      const meta = await api<{
        size: number;
        width?: number;
        height?: number;
        duration?: number;
      }>(`/download/${fileName}/metadata`);

      if (!BOT_API_ROOT && meta.size > CLOUD_SIZE_LIMIT) {
        const mb = (meta.size / 1024 / 1024).toFixed(1);
        await say(m.fileTooBig(mb, url));
        return;
      }

      // Инлайн-сообщение нельзя заменить ЗАГРУЖАЕМЫМ файлом — Telegram
      // принимает здесь только file_id или ссылку, по которой сходит сам.
      // Ссылка отпадает: файл лежит во внутренней сети, наружу его отдаёт
      // только сайт, да и облачный лимит на скачивание по ссылке всего 20 МБ.
      // Поэтому сначала отправляем видео себе (в личный чат админа), берём у
      // отправленного сообщения file_id и уже им заменяем заглушку. Служебное
      // сообщение сразу удаляем — file_id остаётся рабочим и после удаления.
      // Без личного чата админа промежуточную загрузку делать негде — честно
      // говорим об этом в лог и оставляем человеку понятное сообщение, а не
      // молчащую заглушку.
      if (!ADMIN_TELEGRAM_ID) {
        console.error(
          "ADMIN_TELEGRAM_ID не задан — инлайн-режим не может загрузить видео (нужен чат для промежуточной отправки)",
        );
        await say(m.inlineOnlySingleVideo);
        return;
      }

      const staged = await bot.api.sendVideo(
        ADMIN_TELEGRAM_ID,
        new InputFile(new URL(fileUrl)),
        {
          width: meta.width,
          height: meta.height,
          duration: meta.duration,
          disable_notification: true,
          caption: `служебная загрузка для инлайна: ${info.title ?? ""}`.slice(0, 200),
        },
      );

      const fileId = staged.video?.file_id;
      if (!fileId) throw new Error("Telegram не вернул file_id для отправленного видео");

      await bot.api.editMessageMediaInline(
        inlineMessageId,
        InputMediaBuilder.video(fileId, { caption: m.fileCaption(info.title ?? "", url) }),
        {
          reply_markup: new InlineKeyboard().url(
            m.inlineOpenBot,
            `https://t.me/${ctx.me.username}`,
          ),
        },
      );

      await bot.api
        .deleteMessage(ADMIN_TELEGRAM_ID, staged.message_id)
        .catch(() => {});
    } catch (e: any) {
      await say(`${m.failedPrefix}${friendlyError(e?.message ?? String(e), lang)}`);
    }
  });
}
