import { Metadata } from "next";
import { Hero } from "@/components/pages/home/hero";
import JsonLd from "@/components/common/JsonLd";
import { LANGUAGES, Language, translations } from "@/lib/i18n/translations";
import { localizedHref } from "@/lib/i18n/routing";

const OG_LOCALE: Record<Language, string> = { en: "en_US", ru: "ru_RU", es: "es_ES" };

export function generateStaticParams() {
  return LANGUAGES.map((locale) => ({ locale }));
}

function resolveLocale(locale: string): Language {
  return (LANGUAGES as readonly string[]).includes(locale)
    ? (locale as Language)
    : "en";
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const lang = resolveLocale((await params).locale);
  const strings = translations[lang].home;
  const title = `${strings.titleLine1} ${strings.titleLine2} | Videoner`;
  const description = strings.subtitle;
  const canonical = `https://videoner.download${localizedHref(lang, "/")}`;

  return {
    title,
    description,
    robots: "index, follow",
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Videoner",
      locale: OG_LOCALE[lang],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical,
      languages: {
        en: "https://videoner.download",
        ru: "https://videoner.download/ru",
        es: "https://videoner.download/es",
        "x-default": "https://videoner.download",
      },
    },
  };
}

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const lang = resolveLocale((await params).locale);
  const canonical = `https://videoner.download${localizedHref(lang, "/")}`;

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Videoner",
    url: canonical,
  };

  return (
    <>
      <JsonLd data={webPageSchema} />
      <Hero />
    </>
  );
}
