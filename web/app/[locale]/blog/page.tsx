import { Metadata } from "next";
import Link from "next/link";
import { Send } from "lucide-react";

import { listPosts } from "@/lib/blog/posts";
import { NEWS_CHANNEL_URL, blogUi, formatPostDate } from "@/lib/blog/ui";
import { languageAlternates, localizedHref, OG_LOCALE } from "@/lib/i18n/routing";
import { LANGUAGES } from "@/lib/i18n/translations";
import { resolveLocale } from "@/lib/legal/page";

type Props = { params: Promise<{ locale: string }> };

export function generateStaticParams() {
  return LANGUAGES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = resolveLocale((await params).locale);
  const ui = blogUi[lang];
  const canonical = `https://videoner.download${localizedHref(lang, "/blog")}`;
  return {
    title: ui.title,
    description: ui.description,
    openGraph: { title: ui.title, description: ui.description, url: canonical, siteName: "Videoner", locale: OG_LOCALE[lang], type: "website" },
    alternates: { canonical, languages: languageAlternates("/blog") },
  };
}

export default async function BlogIndex({ params }: Props) {
  const lang = resolveLocale((await params).locale);
  const ui = blogUi[lang];
  const posts = listPosts(lang);
  return (
    <main className="container max-w-3xl pb-12 pt-24 sm:pb-16 sm:pt-28">
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
            <span className="mt-2 inline-block text-sm font-medium text-primary">{ui.readMore} →</span>
          </Link>
        ))}
      </div>
    </main>
  );
}
