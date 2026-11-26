import { InputFile, type Context } from "grammy";
import { ADMIN_TELEGRAM_ID, api } from "./helpers.js";

// «Текст из видео» (владелец 26.11.2026): распознавание речи на нашем сервере
// (server/src/modules/transcribe). Пока только для владельца, поэтому тексты —
// только по-русски. Короткий текст приходит сообщением, длинный — файлом .txt
// (в сообщении Telegram не больше 4096 знаков).

export const TRANSCRIBE_BUTTON = "📄 Текст из видео";
const MESSAGE_LIMIT = 4000;
const POLL_MS = 5000;
const MAX_WAIT_MS = 6 * 60 * 60 * 1000;

const TEXTS = {
  queued: "📝 Готовлю текст из видео. Видео пока можно скачать — кнопки выше.",
  downloading: "📝 Скачиваю звук для распознавания…",
  transcribing: "📝 Распознаю речь… Это может занять несколько минут: примерно треть длины видео.",
  empty: "📝 В этом видео не нашлось речи.",
  failed: "❌ Не получилось сделать текст из видео.",
  title: "📄 Текст из видео",
};

export function canTranscribe(userId: number | undefined, chatId: number | undefined): boolean {
  return !!ADMIN_TELEGRAM_ID && userId === ADMIN_TELEGRAM_ID && !!chatId && chatId > 0;
}

// Имя файла: латиница, цифры и кириллица из названия ролика.
export function transcriptFileName(title: string | undefined): string {
  const clean = (title ?? "").replace(/[^\p{L}\p{N}]+/gu, "_").replace(/^_+|_+$/g, "").slice(0, 60);
  return `${clean || "text"}.txt`;
}

const inFlight = new Set<number>();

export async function sendTranscript(ctx: Context, url: string, title: string | undefined): Promise<void> {
  const chatId = ctx.chat?.id;
  const userId = ctx.from?.id;
  if (!chatId || !userId || !canTranscribe(userId, chatId)) return;
  if (inFlight.has(userId)) {
    await ctx.reply("📝 Текст из прошлого видео ещё готовится — дождитесь его.");
    return;
  }
  inFlight.add(userId);
  const note = await ctx.reply(TEXTS.queued);
  let shown = "queued";
  const edit = (text: string) =>
    ctx.api.editMessageText(chatId, note.message_id, text).catch((e) => console.error("Не удалось обновить «текст из видео»:", e?.message ?? e));
  try {
    const { jobId } = await api<{ jobId: string }>("/transcribe", { url, telegramId: userId });
    const deadline = Date.now() + MAX_WAIT_MS;
    let job: { status: string; text?: string; error?: string } = { status: "queued" };
    while (Date.now() < deadline) {
      await new Promise((r) => setTimeout(r, POLL_MS));
      try {
        job = await api(`/transcribe/${jobId}?telegramId=${userId}`, undefined, { timeoutMs: 15_000 });
      } catch (e: any) {
        // Сервер перезапустился — задание потеряно.
        if (/not found/i.test(e?.message ?? "")) throw e;
        continue;
      }
      if (job.status === "done" || job.status === "failed") break;
      if (job.status !== shown && (job.status === "downloading" || job.status === "transcribing")) {
        shown = job.status;
        await edit(TEXTS[job.status]);
      }
    }
    if (job.status !== "done") throw new Error(job.error ?? "Transcription timed out");
    const text = (job.text ?? "").trim();
    if (!text) {
      await edit(TEXTS.empty);
      return;
    }
    const heading = title ? `${TEXTS.title}: ${title}` : TEXTS.title;
    if (heading.length + text.length + 2 <= MESSAGE_LIMIT) {
      await ctx.reply(`${heading}\n\n${text}`);
    } else {
      await ctx.replyWithDocument(new InputFile(Buffer.from(`${title ? title + "\n" + url : url}\n\n${text}\n`, "utf8"), transcriptFileName(title)), {
        caption: `${heading.slice(0, 900)}\n${text.length.toLocaleString("ru-RU")} знаков`,
      });
    }
    await ctx.api.deleteMessage(chatId, note.message_id).catch(() => {});
  } catch (e: any) {
    console.error(`Текст из видео для ${url}:`, e?.message ?? e);
    await edit(TEXTS.failed);
  } finally {
    inFlight.delete(userId);
  }
}
