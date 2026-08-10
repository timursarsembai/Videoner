import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { localizedHref } from "@/lib/i18n/routing";
import { Language } from "@/lib/i18n/translations";
import { LEGAL_UPDATED, operator } from "@/lib/legal/operator";
import { LEGAL_SLUGS, LegalSlug, LegalContent } from "@/lib/legal/types";

// Документ рисуется на сервере по локали из адреса, а не через клиентский
// контекст языка: переключатель языка и так уводит на /ru/... или /es/...,
// зато поисковик и проверяющий получают текст сразу в разметке, без JS.

const localeTag: Record<Language, string> = {
  en: "en-US",
  ru: "ru-RU",
  es: "es-ES",
};

function operatorLines(lang: Language) {
  const name =
    lang === "ru" ? operator.nameRu : lang === "es" ? operator.nameEs : operator.nameEn;
  const address =
    lang === "ru"
      ? operator.addressRu
      : lang === "es"
        ? operator.addressEs
        : operator.addressEn;
  const basis =
    lang === "ru" ? operator.basisRu : lang === "es" ? operator.basisEs : operator.basisEn;
  const binLabel = lang === "ru" ? "БИН/ИИН" : "BIN/IIN";
  return [name, `${binLabel}: ${operator.bin}`, basis, address];
}

export function LegalDocument({
  lang,
  slug,
  content,
}: {
  lang: Language;
  slug: LegalSlug;
  content: LegalContent;
}) {
  const doc = content.docs[slug];
  const updated = new Intl.DateTimeFormat(localeTag[lang], {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date(LEGAL_UPDATED));

  return (
    <article className="container max-w-3xl py-12 sm:py-16">
      <Link
        href={localizedHref(lang, "/")}
        className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {content.ui.back}
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{doc.title}</h1>
      <p className="mt-3 text-foreground/70">{doc.summary}</p>
      <p className="mt-2 text-sm text-foreground/50">
        {content.ui.updated}: {updated}
      </p>

      <div className="mt-10 space-y-8">
        {doc.sections.map((section, index) => (
          <section key={section.heading}>
            <h2 className="text-xl font-semibold">
              {index + 1}. {section.heading}
            </h2>
            {section.body?.map((paragraph) => (
              <p key={paragraph} className="mt-3 leading-relaxed text-foreground/80">
                {paragraph}
              </p>
            ))}
            {section.bullets && (
              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-foreground/80">
                {section.bullets.map((bullet) => (
                  <li key={bullet} className="leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="mt-12 rounded-2xl border border-border/60 bg-background/60 p-6">
        <h2 className="text-lg font-semibold">{content.ui.operatorHeading}</h2>
        <div className="mt-3 space-y-1 text-sm text-foreground/80">
          {operatorLines(lang).map((line) => (
            <div key={line}>{line}</div>
          ))}
          <div>
            <a
              href={`mailto:${operator.email}`}
              className="text-primary underline-offset-4 hover:underline"
            >
              {operator.email}
            </a>
          </div>
        </div>
      </div>

      <nav className="mt-10">
        <h2 className="text-sm font-medium text-foreground/60">{content.ui.navHeading}</h2>
        <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          {LEGAL_SLUGS.filter((other) => other !== slug).map((other) => (
            <li key={other}>
              <Link
                href={localizedHref(lang, `/${other}`)}
                className="text-primary underline-offset-4 hover:underline"
              >
                {content.ui.labels[other]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
