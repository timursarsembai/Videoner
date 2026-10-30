import type { Api } from "grammy";
import { api } from "./helpers.js";

// Статьи блога сайта → канал новостей. Сайт отдаёт готовые к отправке тексты
// (web/app/api/blog/channel), сервер помнит, что уже опубликовано
// (/channel-posts). Бот раз в полчаса публикует новое — старые статьи раньше
// новых, чтобы в канале они шли по порядку.
//
// Включается только переменной BLOG_CHANNEL (в docker-compose.prod.yml):
// тестовые запуски бота в канал не пишут.

const CHANNEL = process.env.BLOG_CHANNEL ?? "";
const FEED_URL = process.env.BLOG_FEED_URL ?? "https://videoner.download/api/blog/channel";
const EVERY_MS = 30 * 60_000;
const FIRST_RUN_MS = 60_000;
const BETWEEN_POSTS_MS = 3_000;

type FeedPost = { slug: string; date: string; url: string; html: string };

let running = false;
// Опубликованные статьи, номер которых сервер ещё не записал.
const pendingDone = new Map<string, number>();

async function markDone(slug: string, messageId: number) {
  try {
    await api("/channel-posts/done", { slug, messageId });
    pendingDone.delete(slug);
  } catch (e: any) {
    pendingDone.set(slug, messageId);
    console.error(`Блог: «${slug}» опубликована, но сервер не записал номер:`, e?.message ?? e);
  }
}

async function publishNew(tg: Api) {
  if (running) return;
  running = true;
  try {
    for (const [slug, messageId] of pendingDone) await markDone(slug, messageId);
    if (pendingDone.size) return;
    const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(20_000) });
    if (!res.ok) throw new Error(`лента блога: HTTP ${res.status}`);
    const { posts } = (await res.json()) as { posts: FeedPost[] };
    const { slugs } = await api<{ slugs: string[] }>("/channel-posts");
    const fresh = posts
      .filter((p) => !slugs.includes(p.slug) && !pendingDone.has(p.slug))
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : a.slug.localeCompare(b.slug)));
    for (const post of fresh) {
      const { ok } = await api<{ ok: boolean }>("/channel-posts/claim", { slug: post.slug });
      if (!ok) continue;
      let messageId: number;
      try {
        const msg = await tg.sendMessage(CHANNEL, post.html, {
          parse_mode: "HTML",
          link_preview_options: { url: post.url },
        });
        messageId = msg.message_id;
      } catch (e: any) {
        // Не ушло — отдаём статью следующему запуску. Остальные статьи не
        // ждут: одна сломанная не должна держать все новые.
        console.error(`Блог: «${post.slug}» не опубликована:`, e?.message ?? e);
        await api("/channel-posts/release", { slug: post.slug }).catch(() => {});
        continue;
      }
      // Пост уже в канале: отметку не снимаем ни при каком ответе сервера.
      // Не записал номер — повторим в начале следующего запуска (pendingDone),
      // иначе через 15 минут сервер счёл бы статью брошенной.
      await markDone(post.slug, messageId);
      console.log(`Блог: «${post.slug}» опубликована в ${CHANNEL}`);
      await new Promise((r) => setTimeout(r, BETWEEN_POSTS_MS));
    }
  } catch (e: any) {
    console.error("Блог → канал:", e?.message ?? e);
  } finally {
    running = false;
  }
}

export function startBlogChannel(tg: Api) {
  if (!CHANNEL) return;
  setTimeout(() => void publishNew(tg), FIRST_RUN_MS).unref();
  setInterval(() => void publishNew(tg), EVERY_MS).unref();
}
