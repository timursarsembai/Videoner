import { listPosts } from "@/lib/blog/posts";
import { telegramHtml } from "@/lib/blog/markdown";
import { blogUi } from "@/lib/blog/ui";

// Статьи для канала новостей @videonerdownload: бот забирает список и
// публикует то, чего ещё не публиковал (bot/src/blog-channel.ts). Канал
// русскоязычный — текст русский. Пересобирается раз в час: статья с датой
// «на завтра» попадёт в ленту в свой день без нового выката.
export const revalidate = 3600;

export function GET() {
  const ui = blogUi.ru;
  const posts = listPosts("ru")
    .filter((post) => post.lang === "ru")
    .map((post) => {
      const url = `https://videoner.download/ru/blog/${post.slug}`;
      return {
        slug: post.slug,
        date: post.date,
        url,
        html: telegramHtml(post, url, { readOnSite: ui.readOnSite, readMore: ui.readFull }),
      };
    });
  return Response.json({ posts });
}
