import { Metadata } from "next";

import { LegalDocument } from "@/components/legal/LegalDocument";
import { localizedHref } from "@/lib/i18n/routing";
import { LANGUAGES, Language } from "@/lib/i18n/translations";
import { legal } from "@/lib/legal/documents";
import { LegalSlug } from "@/lib/legal/types";

// Четыре юридические страницы отличаются только слагом, поэтому и метаданные,
// и рендер собираются здесь, а сами page.tsx остаются в три строки. Иначе
// пришлось бы копировать один и тот же generateMetadata четыре раза и потом
// ловить, в какой из копий забыли поправить canonical.

const OG_LOCALE: Record<Language, string> = {
  en: "en_US",
  ru: "ru_RU",
  es: "es_ES",
};

export function resolveLocale(locale: string): Language {
  return (LANGUAGES as readonly string[]).includes(locale) ? (locale as Language) : "en";
}

export function legalStaticParams() {
  return LANGUAGES.map((locale) => ({ locale }));
}

export function legalMetadata(slug: LegalSlug) {
  return async ({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> => {
    const lang = resolveLocale((await params).locale);
    const doc = legal[lang].docs[slug];
    const canonical = `https://videoner.download${localizedHref(lang, `/${slug}`)}`;

    return {
      title: `${doc.title} | Videoner`,
      description: doc.summary,
      // Документы должны находиться и индексироваться: закрывать их от
      // поиска нельзя, иначе проверяющий не увидит, что они существуют.
      robots: "index, follow",
      openGraph: {
        title: doc.title,
        description: doc.summary,
        url: canonical,
        siteName: "Videoner",
        locale: OG_LOCALE[lang],
        type: "article",
      },
      alternates: {
        canonical,
        languages: {
          en: `https://videoner.download/${slug}`,
          ru: `https://videoner.download/ru/${slug}`,
          es: `https://videoner.download/es/${slug}`,
          "x-default": `https://videoner.download/${slug}`,
        },
      },
    };
  };
}

export async function LegalPage({
  slug,
  params,
}: {
  slug: LegalSlug;
  params: Promise<{ locale: string }>;
}) {
  const lang = resolveLocale((await params).locale);
  return <LegalDocument lang={lang} slug={slug} content={legal[lang]} />;
}
