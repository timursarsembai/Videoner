import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";

import JsonLd from "@/components/common/JsonLd";
import { BlogBody } from "@/components/blog/BlogBody";
import { getPost, listPosts } from "@/lib/blog/posts";
import { NEWS_CHANNEL_URL, blogUi, formatPostDate } from "@/lib/blog/ui";
import { languageAlternates, localizedHref, OG_LOCALE } from "@/lib/i18n/routing";
import { LANGUAGES } from "@/lib/i18n/translations";
import { resolveLocale } from "@/lib/legal/page";

type Props = { params: Promise<{ locale: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return LANGUAGES.flatMap((locale) => listPosts(locale).map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = resolveLocale(locale);
  const post = getPost(slug, lang);
  if (!post) return {};
  const canonical = `https://videoner.download${localizedHref(lang, `/blog/${slug}`)}`;
  return {
    title: `${post.title} | Videoner`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      url: canonical,
      siteName: "Videoner",
      locale: OG_LOCALE[lang],
      type: "article",
      publishedTime: post.date,
    },
    alternates: { canonical, languages: languageAlternates(`/blog/${slug}`) },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const lang = resolveLocale(locale);
  const post = getPost(slug, lang);
  if (!post) notFound();
  const ui = blogUi[lang];
  const url = `https://videoner.download${localizedHref(lang, `/blog/${slug}`)}`;
  return (
    <article className="container max-w-3xl pb-12 pt-24 sm:pb-16 sm:pt-28" lang={post.lang}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          inLanguage: post.lang,
          url,
          publisher: { "@type": "Organization", name: "Videoner", url: "https://videoner.download" },
        }}
      />
      <Link
        href={localizedHref(lang, "/blog")}
        className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {ui.back}
      </Link>
      <time dateTime={post.date} className="mt-6 block text-sm text-foreground/50">
        {formatPostDate(post.date, lang)}
      </time>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
      <BlogBody blocks={post.blocks} />
      <a
        href={NEWS_CHANNEL_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary/80"
      >
        <Send className="h-4 w-4" />
        {ui.channelCta}
      </a>
    </article>
  );
}
