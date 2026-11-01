import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { localizedHref } from "@/lib/i18n/routing";
import { Language } from "@/lib/i18n/translations";
import { LEGAL_UPDATED, operator } from "@/lib/legal/operator";
import { LEGAL_SLUGS, LegalSlug, LegalContent } from "@/lib/legal/types";

// Документ рисуется на сервере по локали из адреса, а не через клиентский
// контекст языка: переключатель языка и так уводит на /<язык>/...,
// зато поисковик и проверяющий получают текст сразу в разметке, без JS.

const localeTag: Record<Language, string> = {
  en: "en-US",
  ru: "ru-RU",
  es: "es-ES",
  uk: "uk-UA",
  kk: "kk-KZ",
  ar: "ar",
  zh: "zh-CN",
  hi: "hi-IN",
  id: "id-ID",
  sw: "sw-KE",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  pt: "pt-BR",
  uz: "uz-UZ",
  tr: "tr-TR",
  fa: "fa-IR",
  vi: "vi-VN",
  bn: "bn-BD",
  ur: "ur-PK",
  pl: "pl-PL",
  ja: "ja-JP",
  ko: "ko-KR",
  th: "th-TH",
  tl: "fil-PH",
  am: "am-ET",
  om: "om-ET",
  ha: "ha-NG",
  so: "so-SO",
  az: "az-AZ",
  ky: "ky-KG",
  tg: "tg-TJ",
  ms: "ms-MY",
  nl: "nl-NL",
  ro: "ro-RO",
  ps: "ps-AF",
  ckb: "ckb-IQ",
  ku: "ku-TR",
  ug: "ug-CN",
  tk: "tk-TM",
  tt: "tt-RU",
  sq: "sq-AL",
  bs: "bs-BA",
  ce: "ce-RU",
  inh: "inh-RU",
  av: "av-RU",
};

function operatorLines(lang: Language) {
  const name = { en: operator.nameEn, ru: operator.nameRu, es: operator.nameEs, uk: operator.nameUk, kk: operator.nameKk, ar: operator.nameAr, zh: operator.nameZh, hi: operator.nameHi, id: operator.nameId, sw: operator.nameSw, de: operator.nameDe, fr: operator.nameFr, it: operator.nameIt, pt: operator.namePt, uz: operator.nameUz, tr: operator.nameTr, fa: operator.nameFa, vi: operator.nameVi, bn: operator.nameBn, ur: operator.nameUr, pl: operator.namePl, ja: operator.nameJa, ko: operator.nameKo, th: operator.nameTh, tl: operator.nameTl, am: operator.nameAm, om: operator.nameOm, ha: operator.nameHa, so: operator.nameSo, az: operator.nameAz, ky: operator.nameKy, tg: operator.nameTg, ms: operator.nameMs, nl: operator.nameNl, ro: operator.nameRo, ps: operator.namePs, ckb: operator.nameCkb, ku: operator.nameKu, ug: operator.nameUg, tk: operator.nameTk, tt: operator.nameTt, sq: operator.nameSq, bs: operator.nameBs, ce: operator.nameCe, inh: operator.nameInh, av: operator.nameAv }[lang];
  const address = {
    en: operator.addressEn,
    ru: operator.addressRu,
    es: operator.addressEs,
    uk: operator.addressUk,
    kk: operator.addressKk,
    ar: operator.addressAr,
    zh: operator.addressZh,
    hi: operator.addressHi,
    id: operator.addressId,
    sw: operator.addressSw,
    de: operator.addressDe,
    fr: operator.addressFr,
    it: operator.addressIt,
    pt: operator.addressPt,
    uz: operator.addressUz,
    tr: operator.addressTr,
    fa: operator.addressFa,
    vi: operator.addressVi,
    bn: operator.addressBn,
    ur: operator.addressUr,
    pl: operator.addressPl,
    ja: operator.addressJa,
    ko: operator.addressKo,
    th: operator.addressTh,
    tl: operator.addressTl,
    am: operator.addressAm,
    om: operator.addressOm,
    ha: operator.addressHa,
    so: operator.addressSo,
    az: operator.addressAz,
    ky: operator.addressKy,
    tg: operator.addressTg,
    ms: operator.addressMs,
    nl: operator.addressNl,
    ro: operator.addressRo,
    ps: operator.addressPs,
    ckb: operator.addressCkb,
    ku: operator.addressKu,
    ug: operator.addressUg,
    tk: operator.addressTk,
    tt: operator.addressTt,
    sq: operator.addressSq,
    bs: operator.addressBs,
    ce: operator.addressCe,
    inh: operator.addressInh,
    av: operator.addressAv,
  }[lang];
  const basis = { en: operator.basisEn, ru: operator.basisRu, es: operator.basisEs, uk: operator.basisUk, kk: operator.basisKk, ar: operator.basisAr, zh: operator.basisZh, hi: operator.basisHi, id: operator.basisId, sw: operator.basisSw, de: operator.basisDe, fr: operator.basisFr, it: operator.basisIt, pt: operator.basisPt, uz: operator.basisUz, tr: operator.basisTr, fa: operator.basisFa, vi: operator.basisVi, bn: operator.basisBn, ur: operator.basisUr, pl: operator.basisPl, ja: operator.basisJa, ko: operator.basisKo, th: operator.basisTh, tl: operator.basisTl, am: operator.basisAm, om: operator.basisOm, ha: operator.basisHa, so: operator.basisSo, az: operator.basisAz, ky: operator.basisKy, tg: operator.basisTg, ms: operator.basisMs, nl: operator.basisNl, ro: operator.basisRo, ps: operator.basisPs, ckb: operator.basisCkb, ku: operator.basisKu, ug: operator.basisUg, tk: operator.basisTk, tt: operator.basisTt, sq: operator.basisSq, bs: operator.basisBs, ce: operator.basisCe, inh: operator.basisInh, av: operator.basisAv }[lang];
  const binLabel = { en: "BIN/IIN", ru: "БИН/ИИН", es: "BIN/IIN", uk: "БІН/ІІН", kk: "БСН/ЖСН", ar: "BIN/IIN", zh: "BIN/IIN", hi: "BIN/IIN", id: "BIN/IIN", sw: "BIN/IIN", de: "BIN/IIN", fr: "BIN/IIN", it: "BIN/IIN", pt: "BIN/IIN", uz: "BIN/IIN", tr: "BIN/IIN", fa: "BIN/IIN", vi: "BIN/IIN", bn: "BIN/IIN", ur: "BIN/IIN", pl: "BIN/IIN", ja: "BIN/IIN", ko: "BIN/IIN", th: "BIN/IIN", tl: "BIN/IIN", am: "BIN/IIN", om: "BIN/IIN", ha: "BIN/IIN", so: "BIN/IIN", az: "BIN/IIN", ky: "BIN/IIN", tg: "BIN/IIN", ms: "BIN/IIN", nl: "BIN/IIN", ro: "BIN/IIN", ps: "BIN/IIN", ckb: "BIN/IIN", ku: "BIN/IIN", ug: "BIN/IIN", tk: "BIN/IIN", tt: "BIN/IIN", sq: "BIN/IIN", bs: "BIN/IIN", ce: "BIN/IIN", inh: "BIN/IIN", av: "BIN/IIN" }[lang];
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
    <article className="container max-w-3xl pb-12 pt-24 sm:pb-16 sm:pt-28">
      <Link
        href={localizedHref(lang, "/")}
        className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" />
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
              <ul className="mt-3 list-disc space-y-1.5 ps-5 text-foreground/80">
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
