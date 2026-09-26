import { Api, Bot, Context, InlineKeyboard, InputFile, InputMediaBuilder } from "grammy";
import { detectLang, messages, type Lang } from "../i18n.js";
import {
  api,
  getQuotaInfo,
  fmtDuration,
  friendlyError,
  checkUserRateLimit,
  API_URL,
  BOT_API_ROOT,
  CLOUD_SIZE_LIMIT,
  ADMIN_TELEGRAM_ID,
} from "../helpers.js";
import { SHARE_CHANNEL, publishLink } from "./share.js";
import { blockUnlessSubscribed, isChannelMember, subscribeKeyboard } from "./membership.js";
import { LinkQueues, QUEUE_LIMIT, extractUrls, type Current, type OwnerState } from "../queue.js";
import { orderTracks, type SubtitleTrack } from "../subtitles.js";

// Приходят из /download/:filename/metadata (ffprobe на стороне сервера).
// Поля необязательные: если ffprobe не смог разобрать файл, видео уйдёт без
// размеров — как отправлялось до этой правки.
type VideoDimensions = {
  width?: number;
  height?: number;
  duration?: number;
};

// Ключ активного скачивания — чат плюс сообщение «⏬ Скачиваю...».
function sessionKey(chatId: number, messageId: number): string {
  return `${chatId}:${messageId}`;
}
// Предел Telegram на один альбом.
const ALBUM_LIMIT = 10;

// Обложка для канала — намеренно не самый крупный вариант.
//
// У фотографии превью и есть само содержимое: обложкой поста из снимков
// оказывался исходник в полном качестве, и в канал уходил он, хотя туда мы
// публикуем ссылку с превью, а не сам материал (см. publishLink). Размеры
// вариантов у Instagram не заполнены вовсе, так что выбрать вариант поменьше по
// данным площадки нельзя — зато Telegram, приняв снимок, сам возвращает
// лесенку своих размеров, и вот из неё выбор надёжен на любой площадке.
const COVER_MAX_SIDE = 800;

function previewFileId(
  sizes: readonly { file_id: string; width: number; height: number }[] | undefined,
): string | undefined {
  if (!sizes?.length) return undefined;
  const area = (s: { width: number; height: number }) => s.width * s.height;
  const fits = sizes.filter((s) => Math.max(s.width, s.height) <= COVER_MAX_SIDE);
  // Из уместившихся берём самый крупный. Не уместился ни один — самый мелкий из
  // всех: обложка должна остаться превью, даже если лесенка начинается высоко.
  const chosen = fits.length
    ? fits.reduce((best, s) => (area(s) > area(best) ? s : best))
    : sizes.reduce((best, s) => (area(s) < area(best) ? s : best));
  return chosen.file_id;
}

// Ссылки каждого человека (см. queue.ts). Заменили прежнюю таблицу сессий по
// сообщению с клавиатурой: живая клавиатура у человека теперь одна — у текущей
// ссылки, — и какую ссылку качать по нажатию, говорит очередь, а не кнопка.
// callback_data ограничена 64 байтами, поэтому в кнопке по-прежнему только тип
// и качество, а адрес живёт здесь.
const queues = new LinkQueues();

// Не нажали кнопку качества — очередь не должна стоять вечно.
const CHOOSE_TIMEOUT_MS = 30 * 60 * 1000;
const chooseTimers = new Map<string, NodeJS.Timeout>();

function clearChooseTimer(key: string) {
  const timer = chooseTimers.get(key);
  if (timer) clearTimeout(timer);
  chooseTimers.delete(key);
}

// Долгая работа идёт В ФОНЕ, а не внутри обработчика, и это главное в этом
// файле. bot.start() в grammY обрабатывает обновления строго по одному и ждёт
// каждый обработчик до конца. Пока обработчик ждал скачивание (до 20 минут
// опроса сервера плюс отправка файла), бот не видел НИЧЬИХ новых сообщений —
// ни этого человека, ни остальных. Обработчик теперь только меняет состояние и
// сразу возвращается; ошибки фоновой работы ловим здесь, иначе они ушли бы в
// unhandledRejection мимо bot.catch.
function inBackground(label: string, work: Promise<unknown>) {
  work.catch((e) => console.error(`${label}:`, e?.message ?? e));
}

type DownloadMeta = {
  telegramId?: number;
  telegramUsername?: string;
  telegramLanguageCode?: string;
};

// Раньше рестарт/редеплой бота (docker-compose rm -sf bot, шлёт SIGTERM) молча
// убивал любой активный performDownload — пользователь навсегда оставался
// смотреть на "⏬ Скачиваю..." без единого сообщения. Полноценное восстановление
// скачивания после рестарта потребовало бы хранить chatId/messageId на сервере
// и переживать пересоздание контейнера — непропорционально для этой находки.
// Вместо этого — трекинг активных загрузок в памяти + явное уведомление при
// штатной остановке (см. notifyActiveDownloadsBeforeShutdown, вызывается из
// bot.ts при SIGTERM/SIGINT), а не полная тишина.
const activeDownloads = new Map<string, { chatId: number; messageId: number; lang: Lang }>();

export async function notifyActiveDownloadsBeforeShutdown(bot: Bot) {
  console.log(`Уведомляю ${activeDownloads.size} активных скачиваний перед остановкой...`);
  const notices: Promise<unknown>[] = Array.from(activeDownloads.values()).map(({ chatId, messageId, lang }) =>
    bot.api
      .editMessageText(chatId, messageId, messages[lang].downloadInterrupted)
      .catch((e) => console.error(`Failed to notify chat ${chatId} about shutdown:`, e)),
  );
  // Очередь живёт в памяти и с процессом пропадает. Текущее скачивание уже
  // получило своё сообщение выше — здесь считаем остальное: ждущие ссылки и
  // ту, по которой ещё не выбрано качество (её клавиатура после перезапуска
  // ответит «сессия устарела»).
  for (const [, state] of queues.entries()) {
    const lost = state.pending.length + (state.current && state.current.phase !== "downloading" ? 1 : 0);
    if (!lost) continue;
    const lang = detectLang(state.languageCode);
    notices.push(
      bot.api
        .sendMessage(state.chatId, messages[lang].queueLostOnRestart(lost))
        .catch((e) => console.error(`Failed to notify chat ${state.chatId} about lost queue:`, e)),
    );
  }
  await Promise.allSettled(notices);
}

async function performDownload(
  chatId: number,
  kind: "v" | "a",
  quality: string,
  extension: string,
  url: string,
  lang: Lang,
  send: {
    reply: (text: string) => Promise<{ message_id: number }>;
    editMessageText: (messageId: number, text: string) => Promise<unknown>;
    replyWithVideo: (file: InputFile, caption: string, dims?: VideoDimensions) => Promise<unknown>;
    replyWithAudio: (file: InputFile, caption: string) => Promise<unknown>;
    // Снимок отдаём именно фотографией: пост может состоять из одного фото, и
    // отправлять его видео нельзя — Telegram получил бы jpeg под видом ролика.
    replyWithPhoto: (file: InputFile, caption: string) => Promise<string | undefined>;
    deleteMessage: (messageId: number) => Promise<unknown>;
    publishToChannel: (
      url: string,
      title: string,
      thumbnail: string | undefined,
      lang: Lang,
      coverFileId?: string,
    ) => Promise<unknown>;
    // Возвращает file_id уменьшенного варианта первого снимка — обложку для
    // канала (см. publishToChannel).
    replyWithAlbum: (
      items: { filename: string; kind: string; width?: number; height?: number; duration?: number }[],
      caption: string,
    ) => Promise<string | undefined>;
  },
  dlMeta: DownloadMeta,
  title: string,
  thumbnail: string | undefined,
) {
  const m = messages[lang];
  const msg = await send.reply(m.downloading);
  const trackingKey = sessionKey(chatId, msg.message_id);
  activeDownloads.set(trackingKey, { chatId, messageId: msg.message_id, lang });

  try {
    const started = await api<{ downloadId: string; fileName: string }>(
      kind === "v" ? "/download/video" : "/download/audio",
      { url, quality, extension, source: "BOT", ...dlMeta },
    );

    // items — файлы поста. Пусто или одна запись — обычное скачивание,
    // несколько — карусель, её отправляем альбомом.
    type StatusItem = {
      position: number;
      filename: string;
      kind: string;
      width?: number;
      height?: number;
      duration?: number;
      fileSize?: number;
    };
    let status:
      | { status: string; downloadUrl?: string; items?: StatusItem[] }
      | undefined;
    for (let i = 0; i < 400; i++) {
      await new Promise((r) => setTimeout(r, 3000));
      status = await api(`/download/${started.downloadId}/status`);
      if (status && (status.status === "COMPLETED" || status.status === "FAILED")) break;
    }
    if (!status || status.status !== "COMPLETED") {
      throw new Error(status?.status === "FAILED" ? m.downloadFailed : m.downloadTimeout);
    }

    const items = status.items ?? [];
    if (items.length > 1) {
      await send.editMessageText(msg.message_id, m.sendingAlbum(items.length));
      const cover = await send.replyWithAlbum(items, m.fileCaption(title, url));
      await send.deleteMessage(msg.message_id);
      await send.publishToChannel(url, title, thumbnail, lang, cover);
      return;
    }

    // У карусели настоящее имя первого файла известно только из items —
    // started.fileName содержит базовое имя без номера. Для одиночного
    // скачивания оба совпадают.
    const fileName = encodeURIComponent(items[0]?.filename ?? started.fileName);
    const fileUrl = `${API_URL}/download/${fileName}`;
    const meta = await api<{ size: number } & VideoDimensions>(
      `/download/${fileName}/metadata`,
    );

    // Без локального Bot API сервера облачный лимит — 50 МБ на файл от бота
    if (!BOT_API_ROOT && meta.size > CLOUD_SIZE_LIMIT) {
      const mb = (meta.size / 1024 / 1024).toFixed(1);
      await send.editMessageText(msg.message_id, m.fileTooBig(mb, fileUrl));
      return;
    }

    await send.editMessageText(msg.message_id, m.sendingFile);
    const file = new InputFile(new URL(fileUrl));
    // Пост из ОДНОГО снимка сюда же и попадает — items длиной в единицу
    // альбомом не отправляется. Кнопка при этом нажата видеокачества (другой у
    // такого поста нет), поэтому решает вид файла, а не kind: иначе jpeg уходил
    // бы в sendVideo.
    if (items[0]?.kind === "PHOTO") {
      const cover = await send.replyWithPhoto(file, m.fileCaption(title, url));
      await send.deleteMessage(msg.message_id);
      await send.publishToChannel(url, title, thumbnail, lang, cover);
      return;
    }
    if (kind === "v") {
      // Размеры передаём явно: без них Telegram на iOS показывает вертикальное
      // видео сплющенным в квадрат (Desktop читает поток сам и рисует верно).
      await send.replyWithVideo(file, m.fileCaption(title, url), {
        width: meta.width,
        height: meta.height,
        duration: meta.duration,
      });
    } else {
      await send.replyWithAudio(file, m.fileCaption(title, url));
    }
    await send.deleteMessage(msg.message_id);
    // Ссылка уходит в канал после того, как файл дошёл до человека: пост о
    // том, что скачать не удалось, никому не нужен.
    await send.publishToChannel(url, title, thumbnail, lang);
  } catch (e: any) {
    await send.editMessageText(msg.message_id, `${m.failedPrefix}${friendlyError(e.message, lang)}`);
  } finally {
    activeDownloads.delete(trackingKey);
  }
}

// Как отправлять файлы в чат, где нажата кнопка. Вынесено из обработчика
// кнопки, чтобы тот читался как последовательность шагов очереди.
function sendersFor(ctx: Context, chatId: number) {
  return {
    reply: (text: string) => ctx.reply(text),
    editMessageText: (messageId: number, text: string) => ctx.api.editMessageText(chatId, messageId, text),
    // Подпись едет вместе с файлом при пересылке — в этом весь смысл:
    // ссылка на первоисточник и упоминание бота остаются с видео у любого,
    // кому его переслали.
    replyWithVideo: (file: InputFile, caption: string, dims?: VideoDimensions) =>
      ctx.replyWithVideo(file, { caption, supports_streaming: true, ...dims }),
    replyWithAudio: (file: InputFile, caption: string) =>
      ctx.replyWithAudio(file, { caption }),
    replyWithPhoto: async (file: InputFile, caption: string) => {
      const sent = await ctx.replyWithPhoto(file, { caption });
      return previewFileId(sent.photo);
    },
    deleteMessage: (messageId: number) => ctx.api.deleteMessage(chatId, messageId),
    publishToChannel: (
      u: string,
      t: string,
      th: string | undefined,
      l: Lang,
      cover?: string,
    ) => publishLink(ctx.api, u, t, th, l, cover),
    replyWithAlbum: async (
      items: { filename: string; kind: string; width?: number; height?: number; duration?: number }[],
      caption: string,
    ) => {
      // Telegram принимает не больше 10 элементов в одном альбоме, а в
      // карусели Instagram их бывает до двадцати — режем на части. Подпись
      // ставим только на первый элемент первого альбома: на каждом она
      // повторялась бы под каждым файлом.
      let cover: string | undefined;
      for (let start = 0; start < items.length; start += ALBUM_LIMIT) {
        const chunk = items.slice(start, start + ALBUM_LIMIT);
        const media = chunk.map((item, index) => {
          const file = new InputFile(
            new URL(`${API_URL}/download/${encodeURIComponent(item.filename)}`),
          );
          const withCaption = start === 0 && index === 0 ? { caption } : {};
          return item.kind === "PHOTO"
            ? InputMediaBuilder.photo(file, withCaption)
            : InputMediaBuilder.video(file, {
                ...withCaption,
                // Без размеров Telegram на iOS сплющивает вертикальное видео.
                width: item.width,
                height: item.height,
                duration: item.duration,
                supports_streaming: true,
              });
        });
        const sent = await ctx.replyWithMediaGroup(media);
        // Обложку для канала берём у первого снимка первого альбома — и
        // именно у той, что вернул Telegram, а не у исходника (см. ниже).
        // Альбом возвращает сообщения разных видов, и photo есть только у
        // снимка — проверяем это, а не верим items на слово.
        const first = sent[0];
        if (start === 0 && first && "photo" in first) {
          cover = previewFileId(first.photo);
        }
      }
      return cover;
    },
  };
}

// Анализирует текущую ссылку и показывает выбор качества. Не разобралась —
// пишет ошибку и берёт следующую, пока очередь не кончится или одна из ссылок
// не дойдёт до выбора: ошибка одной ссылки не должна держать остальные.
async function showNextChoice(tg: Api, key: string) {
  for (;;) {
    const state = queues.get(key);
    const current = state?.current;
    if (!state || !current || current.phase !== "analyzing") return;
    if (await showChoice(tg, key, state, current)) return;
    if (!queues.finish(key, current.token)) return;
  }
}

// Клавиатура выбора текущей ссылки. Собирается из запомненного в очереди, а не
// из ответа сервера: после экрана языков субтитров её надо вернуть как была.
function choiceKeyboard(m: (typeof messages)[Lang], current: Current): InlineKeyboard {
  const kb = new InlineKeyboard();
  for (const q of (current.qualities?.video ?? []).slice(0, 6)) {
    // Замок с HD-качеств снят вместе с платными функциями: все качества
    // доступны всем без исключения.
    // "original" сервер присылает для поста, где нет ни одного видео —
    // выбирать там нечего, снимки забираются в исходном размере.
    kb.text(q === "original" ? m.photoButton : `🎬 ${q}`, `v|${q}`).row();
  }
  // У поста из одних фотографий звуковой дорожки нет — кнопку не рисуем,
  // иначе она вела бы в заведомую ошибку.
  if (current.qualities?.audio.length) {
    kb.text(m.audioOnlyButton, "a|128Kbps").row();
  }
  if (current.subtitles?.length) {
    kb.text(m.subtitlesButton, "s|list").row();
  }
  // Отказаться от ссылки, не дожидаясь получаса: иначе следующие в очереди
  // ждали бы, пока истечёт время выбора.
  kb.text(m.skipButton, "x|skip");
  return kb;
}

function subtitlesKeyboard(m: (typeof messages)[Lang], tracks: SubtitleTrack[]): InlineKeyboard {
  const kb = new InlineKeyboard();
  // В кнопке — номер дорожки, а не код языка: callback_data ограничена 64
  // байтами, а номер к тому же не даст прислать произвольный код.
  tracks.forEach((track, i) => {
    kb.text(track.auto ? `${track.name} (${m.subtitlesAuto})` : track.name, `s|${i}`).row();
  });
  kb.text(m.subtitlesBack, "s|back");
  return kb;
}

// Кто сейчас ждёт субтитры: повторное нажатие не запускает второй запрос.
const subtitlesInFlight = new Set<string>();

// Готовит .srt на сервере и присылает документом. Ссылка при этом остаётся
// текущей: субтитры обычно берут вместе с видео, и выбор качества после них
// возвращается на место. Очередь двигает только видео, «Не скачивать» или
// истёкшее время.
async function sendSubtitles(ctx: Context, key: string, current: Current, track: SubtitleTrack, lang: Lang) {
  const m = messages[lang];
  const chatId = ctx.chat?.id;
  if (!chatId) return;
  const note = await ctx.reply(m.subtitlesPreparing);
  try {
    const { fileName } = await api<{ fileName: string }>("/download/subtitles", {
      url: current.url,
      lang: track.lang,
      title: current.title,
      source: "BOT",
      telegramId: ctx.from?.id,
      telegramUsername: ctx.from?.username,
      telegramLanguageCode: ctx.from?.language_code,
    });
    await ctx.replyWithDocument(new InputFile(new URL(`${API_URL}/download/${encodeURIComponent(fileName)}`), fileName), {
      caption: m.fileCaption(current.title ?? "", current.url),
    });
    await ctx.api.deleteMessage(chatId, note.message_id).catch((e) => console.error("Не удалось убрать «готовлю»:", e?.message ?? e));
  } catch (e: any) {
    const raw = e?.message ?? String(e);
    console.error(`Субтитры ${track.lang} для ${current.url}:`, raw);
    const text = /refusing/i.test(raw) ? m.subtitlesBusy : m.subtitlesFailed;
    await ctx.api.editMessageText(chatId, note.message_id, `${m.failedPrefix}${text}`).catch((err) => console.error("Не удалось показать ошибку субтитров:", err?.message ?? err));
  } finally {
    subtitlesInFlight.delete(key);
  }
}

// true — клавиатура показана, ждём нажатия. false — ссылку надо пропустить.
async function showChoice(tg: Api, key: string, state: OwnerState, current: Current): Promise<boolean> {
  const lang = detectLang(state.languageCode);
  const m = messages[lang];
  let messageId: number | undefined;
  try {
    messageId = (await tg.sendMessage(state.chatId, m.fetchingInfo)).message_id;
    current.messageId = messageId;

    const info = await api<{
      title: string;
      duration?: number;
      thumbnail?: string;
      qualities: { video: string[]; audio: string[] };
      subtitles?: SubtitleTrack[];
    }>("/info", {
      url: current.url,
      telegramId: state.userId,
      telegramUsername: state.username,
      telegramLanguageCode: state.languageCode,
    });
    current.title = info.title ?? "";
    current.thumbnail = info.thumbnail;
    current.qualities = { video: info.qualities.video ?? [], audio: info.qualities.audio ?? [] };
    // Сервер отдаёт субтитры только для YouTube; у остальных поле пустое.
    current.subtitles = orderTracks(info.subtitles ?? []);

    const kb = choiceKeyboard(m, current);

    const dur = fmtDuration(info.duration);
    const notice = SHARE_CHANNEL ? m.channelNotice(SHARE_CHANNEL) : "";
    const rest = state.pending.length ? m.queueRest(state.pending.length) : "";
    await tg.editMessageText(state.chatId, messageId, m.chooseQuality(current.title, dur) + notice + rest, {
      reply_markup: kb,
    });
  } catch (e: any) {
    const text = `${m.failedPrefix}${friendlyError(e?.message ?? String(e), lang)}`;
    if (messageId) {
      await tg.editMessageText(state.chatId, messageId, text).catch((err) => console.error("Не удалось показать ошибку:", err?.message ?? err));
    } else {
      // Не удалось даже отправить «Получаю информацию» — скорее всего бот
      // заблокирован. Писать ошибку некуда, остаётся лог.
      console.error(`Ссылка из очереди ${key} не показана:`, e?.message ?? e);
    }
    return false;
  }

  current.phase = "choosing";
  clearChooseTimer(key);
  const token = current.token;
  const timer = setTimeout(() => {
    chooseTimers.delete(key);
    inBackground("Пропуск по времени", skipByTimeout(tg, key, token));
  }, CHOOSE_TIMEOUT_MS);
  // Таймер не должен держать процесс при остановке.
  timer.unref();
  chooseTimers.set(key, timer);
  return true;
}

async function skipByTimeout(tg: Api, key: string, token: number) {
  const state = queues.get(key);
  const current = state?.current;
  if (!state || !current || current.token !== token || current.phase !== "choosing") return;
  const messageId = current.messageId;
  queues.finish(key, token);
  if (messageId) {
    // Новый текст без reply_markup заодно убирает клавиатуру.
    await tg
      .editMessageText(state.chatId, messageId, messages[detectLang(state.languageCode)].chooseTimedOut)
      .catch((e) => console.error("Не удалось отметить пропуск:", e?.message ?? e));
  }
  await showNextChoice(tg, key);
}

export function registerDownloadHandlers(bot: Bot) {
  bot.on("message:text", async (ctx) => {
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];
    // Без отправителя очередь не к кому привязать (служебные сообщения групп).
    if (!ctx.from) return;
    const urls = extractUrls(ctx.message.text);
    if (!urls.length) {
      await ctx.reply(m.notLink);
      return;
    }

    if (ctx.from.id !== ADMIN_TELEGRAM_ID && !checkUserRateLimit(ctx.from.id)) {
      await ctx.reply(m.errorRateLimited);
      return;
    }

    // Проверяем здесь, до запроса метаданных: незачем гонять сервер и
    // показывать выбор качества тому, кто всё равно не сможет скачать.
    if (await blockUnlessSubscribed(ctx, lang)) return;

    const key = LinkQueues.key(ctx.chat.id, ctx.from.id);
    const added = queues.enqueue(
      key,
      {
        chatId: ctx.chat.id,
        userId: ctx.from.id,
        username: ctx.from.username,
        languageCode: ctx.from.language_code,
      },
      urls,
    );

    // Если начинаем прямо сейчас, про остальные ссылки скажет сообщение с
    // выбором качества («в очереди ещё …»). Отдельное сообщение пришло бы
    // вперемешку с ним: анализ идёт в фоне, и порядок двух отправок не задан.
    const notes: string[] = [];
    if (!added.startNow && added.queued === 1) notes.push(m.queuedOne(added.waiting + 1));
    if (!added.startNow && added.queued > 1) notes.push(m.queuedMany(added.queued, added.waiting));
    if (added.duplicates) notes.push(m.queueDuplicates(added.duplicates));
    if (added.overLimit) notes.push(m.queueFull(QUEUE_LIMIT, added.overLimit));
    if (notes.length) await ctx.reply(notes.join("\n\n"));

    if (added.startNow) inBackground("Анализ ссылки", showNextChoice(ctx.api, key));
  });

  bot.on("callback_query:data", async (ctx) => {
    const lang = detectLang(ctx.from?.language_code);
    const m = messages[lang];
    const chatId = ctx.chat?.id;
    const messageId = ctx.callbackQuery.message?.message_id;
    const key = chatId ? LinkQueues.key(chatId, ctx.from.id) : "";
    const state = queues.get(key);
    const current = state?.current;
    // Нажать можно только клавиатуру ТЕКУЩЕЙ ссылки этого человека. Всё
    // остальное — кнопки, пережившие перезапуск бота, уже выбранные или
    // пропущенные ссылки, чужая клавиатура в группе.
    if (!chatId || !messageId || !state || !current || current.phase !== "choosing" || current.messageId !== messageId) {
      await ctx.answerCallbackQuery({ text: m.sessionExpired });
      return;
    }

    // Раньше это был просто type cast без runtime-проверки — если бы в чате
    // остались inline-кнопки от предыдущей версии бота с другим форматом
    // callback_data (переживший живую сессию редеплой), всё, что не "v",
    // молча трактовалось бы как "a" (аудио) с бессмысленным quality.
    const [kind, quality] = ctx.callbackQuery.data.split("|");
    const token = current.token;

    if (kind === "x") {
      // Состояние меняем ДО первого await: второе нажатие, пришедшее следом,
      // должно увидеть ссылку уже закрытой.
      clearChooseTimer(key);
      queues.finish(key, token);
      await ctx.answerCallbackQuery();
      await ctx.editMessageText(m.skipped).catch((e) => console.error("Не удалось отметить пропуск:", e?.message ?? e));
      inBackground("Анализ ссылки", showNextChoice(ctx.api, key));
      return;
    }
    if (kind === "s") {
      const tracks = current.subtitles ?? [];
      if (quality === "list" || quality === "back") {
        await ctx.answerCallbackQuery();
        const kb = quality === "list" ? subtitlesKeyboard(m, tracks) : choiceKeyboard(m, current);
        await ctx.editMessageReplyMarkup({ reply_markup: kb }).catch((e) => console.error("Не удалось сменить клавиатуру:", e?.message ?? e));
        return;
      }
      const track = /^\d+$/.test(quality ?? "") ? tracks[Number(quality)] : undefined;
      if (!track) {
        await ctx.answerCallbackQuery({ text: m.sessionExpired });
        return;
      }
      if (subtitlesInFlight.has(key)) {
        await ctx.answerCallbackQuery({ text: m.subtitlesPreparing });
        return;
      }
      subtitlesInFlight.add(key);
      await ctx.answerCallbackQuery();
      // Возвращаем выбор качества сразу: субтитры готовятся в фоне, а видео
      // можно выбрать, не дожидаясь их.
      await ctx.editMessageReplyMarkup({ reply_markup: choiceKeyboard(m, current) }).catch((e) => console.error("Не удалось вернуть клавиатуру:", e?.message ?? e));
      inBackground("Субтитры", sendSubtitles(ctx, key, current, track, lang));
      return;
    }
    if ((kind !== "v" && kind !== "a") || !quality) {
      await ctx.answerCallbackQuery({ text: m.sessionExpired });
      return;
    }
    const extension = kind === "v" ? "mp4" : "mp3";
    await ctx.answerCallbackQuery();

    // Между присылкой ссылки и нажатием кнопки можно успеть отписаться.
    if (!(await isChannelMember(ctx, ctx.from?.id))) {
      await ctx.reply(m.subscribeRequired(SHARE_CHANNEL), {
        reply_markup: subscribeKeyboard(lang),
      });
      return;
    }

    // Пока шла проверка подписки, могли нажать ещё раз или сработал таймер.
    // Проверка и смена фазы — без await между ними, иначе два нажатия
    // запустили бы два скачивания.
    if (state.current !== current || current.phase !== "choosing") return;
    current.phase = "downloading";
    clearChooseTimer(key);
    // Клавиатуру убираем: выбор сделан, повторное нажатие скачало бы файл
    // второй раз.
    await ctx.editMessageReplyMarkup().catch((e) => console.error("Не удалось убрать клавиатуру:", e?.message ?? e));

    const quota = await getQuotaInfo(ctx.from?.id);

    // Единственное оставшееся ограничение — суточный лимит. Снять его деньгами
    // нельзя: платных функций нет. unlimited остаётся только как ручной
    // админский грант через /grant.
    if (!quota.unlimited && quota.remaining <= 0) {
      // Остальные ссылки сегодня тоже не скачать — держать их незачем.
      const dropped = queues.clear(key);
      await ctx.reply(m.dailyLimitReached + (dropped ? m.queueDroppedByLimit(dropped) : ""));
      return;
    }

    const download = performDownload(
      chatId, kind, quality, extension, current.url, lang, sendersFor(ctx, chatId),
      {
        telegramId: ctx.from?.id,
        telegramUsername: ctx.from?.username,
        telegramLanguageCode: ctx.from?.language_code,
      },
      current.title ?? "",
      current.thumbnail,
    ).finally(() => {
      // Следующая ссылка получает выбор качества только после того, как файл
      // этой отправлен (или скачивание не удалось) — так и задумано.
      if (queues.finish(key, token)) inBackground("Анализ ссылки", showNextChoice(ctx.api, key));
    });
    inBackground("Скачивание", download);
  });
}
