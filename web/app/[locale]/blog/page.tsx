import { Metadata } from "next";
import Link from "next/link";
import { Send } from "lucide-react";

import JsonLd from "@/components/common/JsonLd";
import { listPosts } from "@/lib/blog/posts";
import { ORGANIZATION, blogUrl, ogImage, postUrl, rssUrl } from "@/lib/blog/seo";
import { NEWS_CHANNEL_URL, blogUi, formatPostDate } from "@/lib/blog/ui";
import { languageAlternates, localizedHref, OG_LOCALE } from "@/lib/i18n/routing";
import { LANGUAGES } from "@/lib/i18n/translations";
import { resolveLocale } from "@/lib/legal/page";

type Props = { params: Promise<{ locale: string }> };

// Раз в час: статьи, выложенные заранее, появляются в списке в свой день.
export const revalidate = 3600;

export function generateStaticParams() {
  return LANGUAGES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = resolveLocale((await params).locale);
  const ui = blogUi[lang];
  const canonical = blogUrl(lang);
  return {
    title: ui.title,
    description: ui.description,
    openGraph: { title: ui.title, description: ui.description, url: canonical, siteName: "Videoner", locale: OG_LOCALE[lang], type: "website", images: [ogImage(lang)] },
    // Иначе остались бы заголовок и описание главной из app/layout.tsx.
    twitter: { card: "summary_large_image", title: ui.title, description: ui.description },
    alternates: {
      canonical,
      languages: languageAlternates("/blog"),
      // <link rel="alternate" type="application/rss+xml"> — по нему ленту
      // находят читалки и краулеры (app/[locale]/blog/rss.xml).
      types: { "application/rss+xml": [{ url: rssUrl(lang), title: ui.title }] },
    },
  };
}

export default async function BlogIndex({ params }: Props) {
  const lang = resolveLocale((await params).locale);
  const ui = blogUi[lang];
  const posts = listPosts(lang);
  return (
    <main className="container max-w-3xl pb-12 pt-24 sm:pb-16 sm:pt-28">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: ui.title,
          description: ui.description,
          url: blogUrl(lang),
          inLanguage: lang,
          publisher: ORGANIZATION,
          blogPost: posts.map((post) => ({
            "@type": "BlogPosting",
            headline: post.title,
            url: postUrl(lang, post.slug),
            datePublished: post.date,
            dateModified: post.updated,
          })),
        }}
      />
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{ui.title}</h1>
      <p className="mt-3 text-foreground/70">{ui.description}</p>
      <a
        href={NEWS_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
      >
        <Send className="h-4 w-4" />
        {ui.channelCta}
      </a>
      <div className="mt-10 space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={localizedHref(lang, `/blog/${post.slug}`)}
            className="block rounded-xl border p-5 transition-colors hover:border-primary/50 hover:bg-primary/5"
          >
            <time dateTime={post.date} className="text-sm text-foreground/50">
              {formatPostDate(post.date, lang)}
            </time>
            <h2 className="mt-1 text-lg font-semibold">{post.title}</h2>
            <p className="mt-1.5 text-foreground/70">{post.summary}</p>
            <span className="mt-2 inline-block text-sm font-medium text-primary">{ui.readMore} <span className="inline-block rtl:-scale-x-100">→</span></span>
          </Link>
        ))}
      </div>
    </main>
  );
}
