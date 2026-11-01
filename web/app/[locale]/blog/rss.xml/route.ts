import { listPosts } from "@/lib/blog/posts";
import { blogUrl, postUrl, rssUrl } from "@/lib/blog/seo";
import { blogUi } from "@/lib/blog/ui";
import { LANGUAGES } from "@/lib/i18n/translations";
import { resolveLocale } from "@/lib/legal/page";

// RSS 2.0 блога на каждом языке: /blog/rss.xml (английский — middleware
// переписывает его на /en/blog/rss.xml) и /<язык>/blog/rss.xml. Обновляется
// так же, как страницы блога, — раз в час.
export const revalidate = 3600;

export function generateStaticParams() {
  return LANGUAGES.map((locale) => ({ locale }));
}

const xml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

// RFC 822, как требует RSS: «Sun, 01 Nov 2026 00:00:00 GMT».
const rfc822 = (date: string) => new Date(`${date}T00:00:00Z`).toUTCString();

export async function GET(_request: Request, { params }: { params: Promise<{ locale: string }> }) {
  const lang = resolveLocale((await params).locale);
  const ui = blogUi[lang];
  const posts = listPosts(lang);
  // Дата последней публикации или правки — от неё читалки решают, есть ли новое.
  const lastChange = posts.map((p) => p.updated).sort().at(-1);
  const items = posts
    .map((post) => {
      const url = postUrl(lang, post.slug);
      return [
        "    <item>",
        `      <title>${xml(post.title)}</title>`,
        `      <link>${xml(url)}</link>`,
        `      <guid isPermaLink="true">${xml(url)}</guid>`,
        `      <pubDate>${rfc822(post.date)}</pubDate>`,
        `      <description>${xml(post.summary)}</description>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(ui.title)}</title>
    <link>${xml(blogUrl(lang))}</link>
    <description>${xml(ui.description)}</description>
    <language>${lang}</language>
    <atom:link href="${xml(rssUrl(lang))}" rel="self" type="application/rss+xml"/>
${lastChange ? `    <lastBuildDate>${rfc822(lastChange)}</lastBuildDate>\n` : ""}${items}
  </channel>
</rss>
`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
