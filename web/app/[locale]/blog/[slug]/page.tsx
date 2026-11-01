import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Send } from "lucide-react";

import JsonLd from "@/components/common/JsonLd";
import { BlogBody } from "@/components/blog/BlogBody";
import { getPost, listPosts } from "@/lib/blog/posts";
import { ORGANIZATION, absoluteUrl, blogUrl, ogImage, ogImageUrl, postUrl } from "@/lib/blog/seo";
import { NEWS_CHANNEL_URL, blogUi, formatPostDate } from "@/lib/blog/ui";
import { languageAlternates, localizedHref, OG_LOCALE } from "@/lib/i18n/routing";
import { LANGUAGES } from "@/lib/i18n/translations";
import { resolveLocale } from "@/lib/legal/page";

type Props = { params: Promise<{ locale: string; slug: string }> };

// Раз в час — чтобы статья, выложенная заранее, открылась в свой день
// (lib/blog/posts.ts). Неизвестный адрес — 404 (getPost вернёт null).
export const revalidate = 3600;

// Сколько свежих статей предлагать в конце статьи.
const MORE_POSTS = 3;

export function generateStaticParams() {
  return LANGUAGES.flatMap((locale) => listPosts(locale).map((post) => ({ locale, slug: post.slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = resolveLocale(locale);
  const post = getPost(slug, lang);
  if (!post) return {};
  const canonical = postUrl(lang, slug);
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
      modifiedTime: post.updated,
      images: [ogImage(lang)],
    },
    // Без своего twitter у статьи остались бы заголовок и описание главной
    // из app/layout.tsx.
    twitter: { card: "summary_large_image", title: post.title, description: post.summary, images: [ogImageUrl(lang)] },
    alternates: { canonical, languages: languageAlternates(`/blog/${slug}`) },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params;
  const lang = resolveLocale(locale);
  const post = getPost(slug, lang);
  if (!post) notFound();
  const ui = blogUi[lang];
  const url = postUrl(lang, slug);
  const more = listPosts(lang)
    .filter((p) => p.slug !== slug)
    .slice(0, MORE_POSTS);
  return (
    <article className="container max-w-3xl pb-12 pt-24 sm:pb-16 sm:pt-28" lang={post.lang}>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.summary,
          datePublished: post.date,
          dateModified: post.updated,
          inLanguage: post.lang,
          url,
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          image: ogImageUrl(lang),
          author: ORGANIZATION,
          publisher: ORGANIZATION,
          isPartOf: { "@type": "Blog", name: ui.title, url: blogUrl(lang) },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Videoner", item: absoluteUrl(lang, "/") },
            { "@type": "ListItem", position: 2, name: ui.allPosts, item: blogUrl(lang) },
            { "@type": "ListItem", position: 3, name: post.title, item: url },
          ],
        }}
      />
      <Link
        href={localizedHref(lang, "/blog")}
        className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
        {ui.back}
      </Link>
      <time dateTime={post.date} className="mt-6 block text-sm text-foreground/50">
        {formatPostDate(post.date, lang)}
      </time>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
      {/* Краткий ответ сразу под заголовком: его первым видят и читатель, и
          поисковики с LLM-поиском, которые цитируют начало страницы. */}
      {post.summary && <p className="mt-4 text-lg text-foreground/80">{post.summary}</p>}
      <BlogBody blocks={post.blocks} />
      {more.length > 0 && (
        <nav className="mt-12 border-t pt-8">
          <Link href={localizedHref(lang, "/blog")} className="text-lg font-semibold transition-colors hover:text-primary">
            {ui.back}
          </Link>
          <ul className="mt-4 space-y-3">
            {more.map((p) => (
              <li key={p.slug}>
                <Link href={localizedHref(lang, `/blog/${p.slug}`)} className="group block">
                  <span className="font-medium group-hover:text-primary">{p.title}</span>
                  <time dateTime={p.date} className="mt-0.5 block text-sm text-foreground/50">
                    {formatPostDate(p.date, lang)}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
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
