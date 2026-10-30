import { listPosts } from "@/lib/blog/posts";
import { telegramHtml } from "@/lib/blog/markdown";
import { blogUi } from "@/lib/blog/ui";

// Статьи для канала новостей @videonerdownload: бот забирает список и
// публикует то, чего ещё не публиковал (bot/src/blog-channel.ts). Канал
// русскоязычный — текст русский. Собирается при сборке сайта.
export const dynamic = "force-static";

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
        html: telegramHtml(post, url, { readOnSite: ui.readOnSite, readMore: ui.readOnSite }),
      };
    });
  return Response.json({ posts });
}
