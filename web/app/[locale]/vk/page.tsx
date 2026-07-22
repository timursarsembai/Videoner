import { Suspense } from "react";
import { Metadata } from "next";
import Page from "@/components/common/Page";
import JsonLd from "@/components/common/JsonLd";
import { LANGUAGES, Language, translations } from "@/lib/i18n/translations";
import { localizedHref } from "@/lib/i18n/routing";

const NAME = "VK";
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
  const strings = translations[lang].platforms.vk;
  const title = `${strings.titleLine1} ${strings.titleLine2} | Videoner`;
  const description = strings.pageDescription;
  const canonical = `https://videoner.download${localizedHref(lang, "/vk")}`;

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
        en: "https://videoner.download/vk",
        ru: "https://videoner.download/ru/vk",
        es: "https://videoner.download/es/vk",
        "x-default": "https://videoner.download/vk",
      },
    },
  };
}

export default async function PlatformPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const lang = resolveLocale((await params).locale);
  const canonical = `https://videoner.download${localizedHref(lang, "/vk")}`;

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `Videoner ${NAME} Downloader`,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Any",
    url: canonical,
    description: translations[lang].platforms.vk.pageDescription,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `https://videoner.download${localizedHref(lang, "/")}`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: NAME,
        item: canonical,
      },
    ],
  };

  return (
    <>
      <JsonLd data={softwareApplicationSchema} />
      <JsonLd data={breadcrumbSchema} />
      <Suspense fallback={null}>
        <Page platform="vk" />
      </Suspense>
    </>
  );
}
