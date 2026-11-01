import { blocksToMarkdown } from "@/lib/blog/markdown";
import { listPosts } from "@/lib/blog/posts";
import { NEWS_CHANNEL_URL } from "@/lib/blog/ui";
import { SITE, absoluteUrl, postUrl, rssUrl } from "@/lib/blog/seo";
import { extensionPage } from "@/lib/extension-page";
import { LANGUAGES, LANGUAGE_LABELS, translations } from "@/lib/i18n/translations";
import { legal } from "@/lib/legal/documents";
import { LEGAL_SLUGS } from "@/lib/legal/types";

// /llms.txt и /llms-full.txt (формат https://llmstxt.org): краткая справка о
// Videoner для LLM-поиска (ChatGPT, Perplexity, AI Overviews, Claude) —
// по-английски, собранная из тех же данных, что и сайт: список площадок —
// из словаря (у каждой площадки своя страница app/[locale]/<площадка>),
// статьи — из content/blog. Руками здесь только общие факты о сервисе.

const BOT = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "VideonerBot";

// Лимиты трафика YouTube — значения по умолчанию из
// server/src/lib/youtube-budget.ts (YOUTUBE_DAILY_GB_PER_IP,
// YOUTUBE_DAILY_GB_PER_TG_USER). Поменяли там — поправьте здесь.
const YOUTUBE_GB_PER_NETWORK = 10;
const YOUTUBE_GB_PER_TG_USER = 25;

function header(): string {
  const en = translations.en;
  const platformNames =
    "YouTube, TikTok, Instagram, Facebook, X/Twitter, Vimeo, VK, Rutube, OK.ru, Pinterest, Threads";
  const languages = LANGUAGES.filter((l) => l !== "en")
    .map((l) => `${l} (${LANGUAGE_LABELS[l]})`)
    .join(", ");
  return `# Videoner

> Videoner is a free video downloader available as a website (${SITE}), a Telegram bot (@${BOT}) and a browser extension for Chrome and Firefox. It saves videos and audio from ${platformNames}.

${en.home.subtitle}

Key facts:

- Free to use. No sign-up or account is needed on the website: paste a link and press Download.
- Three ways to download: the website, the Telegram bot https://t.me/${BOT} (send it a link) and the browser extension (${absoluteUrl("en", "/extension")}), which downloads using the user's own browser sign-in when a platform does not give a video to the server.
- Shortcut: put videoner.download/ in front of any supported link (for example https://videoner.download/https://www.youtube.com/watch?v=...) to open it on the right platform page.
- Available in ${LANGUAGES.length} languages. English lives at ${SITE} without a prefix; every other language uses the URL pattern ${SITE}/<code> (for example ${SITE}/es/youtube). Codes: ${languages}.
- YouTube traffic limit: ${YOUTUBE_GB_PER_NETWORK} GB per day per network on the website and the extension; ${YOUTUBE_GB_PER_TG_USER} GB per day per Telegram user in the bot.
- Users should download only content they have the right to save and respect the platforms' terms.
`;
}

export function llmsTxt(): string {
  const en = translations.en;
  const platforms = (Object.keys(en.platforms) as (keyof typeof en.platforms)[]).map((key) => {
    const p = en.platforms[key];
    return `- [${p.titleLine1} ${p.titleLine2}](${absoluteUrl("en", `/${key}`)}): ${p.pageDescription}`;
  });
  const legalPages = LEGAL_SLUGS.map((slug) => {
    const doc = legal.en.docs[slug];
    return `- [${doc.title}](${absoluteUrl("en", `/${slug}`)}): ${doc.summary}`;
  });
  const posts = listPosts("en")
    .filter((post) => post.lang === "en")
    .map((post) => `- [${post.title}](${postUrl("en", post.slug)}): ${post.summary}`);
  return `${header()}
## Pages

- [${en.home.titleLine1} ${en.home.titleLine2}](${SITE}): ${en.home.subtitle}
${platforms.join("\n")}
- [${extensionPage.en.metaTitle}](${absoluteUrl("en", "/extension")}): ${extensionPage.en.summary}
${legalPages.join("\n")}

## Blog

${posts.join("\n")}

## Optional

- [Blog RSS feed](${rssUrl("en")}): all blog posts in English; other languages at ${SITE}/<code>/blog/rss.xml
- [Full text of the blog](${SITE}/llms-full.txt): every English blog post in Markdown
- [Telegram news channel](${NEWS_CHANNEL_URL}): project news (in Russian)
`;
}

export function llmsFullTxt(): string {
  const posts = listPosts("en")
    .filter((post) => post.lang === "en")
    .map((post) => {
      const updated = post.updated !== post.date ? `\nUpdated: ${post.updated}` : "";
      return `## ${post.title}

URL: ${postUrl("en", post.slug)}
Published: ${post.date}${updated}

${post.summary}

${blocksToMarkdown(post.blocks).replace(/^## /gm, "### ")}`;
    });
  return `${header()}
# Blog posts (newest first)

${posts.join("\n\n---\n\n")}
`;
}
