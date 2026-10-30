import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";

import { ChromeLogo, FirefoxLogo } from "@/components/common/browser-logos";

import { extensionPage } from "@/lib/extension-page";
import { FIREFOX_EXTENSION_VERSION } from "@/lib/extension-firefox-version";
import { EXTENSION_VERSION } from "@/lib/extension-version";
import { languageAlternates, localizedHref } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/legal/page";
import { detectPlatform } from "@/lib/validations/url";

// Страница расширения для браузера. Сюда ведут кнопки «скачать через
// расширение» из бота и с сайта, когда площадка не отдала ролик нашему серверу
// (lib/extension-hint.ts, bot/src/helpers.ts) — со ссылкой на ролик в ?url=.
//
// Два варианта установки — две кнопки рядом: архив для Chrome и браузеров на
// его основе (режим разработчика, вручную) и подписанный у Mozilla .xpi для
// Firefox (установка прямо с сайта). Кнопку браузера посетителя выделяем и
// ставим его инструкцию первой; браузер узнаём по User-Agent: ошибиться тут
// не страшно, обе кнопки на странице всегда есть.

const FIREFOX_XPI = "/extension/videoner-firefox.xpi";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ url?: string | string[] }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = resolveLocale((await params).locale);
  const text = extensionPage[lang];
  const canonical = `https://videoner.download${localizedHref(lang, "/extension")}`;
  return {
    title: `${text.metaTitle} | Videoner`,
    description: text.summary,
    alternates: {
      canonical,
      languages: languageAlternates("/extension"),
    },
  };
}

export default async function ExtensionPage({ params, searchParams }: Props) {
  const lang = resolveLocale((await params).locale);
  const text = extensionPage[lang];
  const rawUrl = (await searchParams).url;
  // Ссылку показываем, только если это ролик поддерживаемой площадки: иначе
  // страница стала бы кнопкой «открыть любой адрес» под нашим доменом.
  const videoUrl = typeof rawUrl === "string" && detectPlatform(rawUrl.trim()) ? rawUrl.trim() : null;
  // Firefox для Android сюда не относится: дополнения не из каталога Mozilla
  // он не ставит.
  const userAgent = (await headers()).get("user-agent") ?? "";
  const isMobile = /Android|Mobile|iPhone|iPad/.test(userAgent);
  const isFirefox = /Firefox\//.test(userAgent) && !isMobile;
  const firefoxReady = FIREFOX_EXTENSION_VERSION !== null;

  const chromeButton = (
    <BrowserButton
      href={`/extension/videoner-extension.zip?v=${EXTENSION_VERSION}`}
      download={`videoner-extension-${EXTENSION_VERSION}.zip`}
      logo={<ChromeLogo className="h-10 w-10 text-[#1a73e8]" />}
      title={text.chromeTitle}
      hint={text.chromeHint}
      footer={`${text.version} ${EXTENSION_VERSION} · .zip`}
      badge={isFirefox || isMobile ? null : text.yourBrowser}
    />
  );
  // Ссылка на .xpi без download: Firefox сам предлагает установить
  // дополнение, а не сохраняет файл.
  const firefoxButton = (
    <BrowserButton
      href={firefoxReady ? `${FIREFOX_XPI}?v=${FIREFOX_EXTENSION_VERSION}` : null}
      logo={<FirefoxLogo className="h-10 w-10 text-[#ff7139]" />}
      title={text.firefoxTitle}
      hint={firefoxReady ? text.firefoxHint : text.firefoxSoon}
      footer={firefoxReady ? `${text.version} ${FIREFOX_EXTENSION_VERSION} · .xpi` : text.soon}
      badge={isFirefox ? text.yourBrowser : null}
    />
  );
  const chromeSteps = (
    <section key="chrome" className="mt-10">
      <h2 className="text-xl font-semibold">{text.stepsTitle}</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-foreground/80">
        {text.steps.map((step) => (
          <li key={step} className="leading-relaxed">
            {step}
          </li>
        ))}
      </ol>
      {/* Сюда ведёт уведомление о новой версии из самого расширения
          (extension/update-check.js) — якорь #update. */}
      <h3 id="update" className="mt-8 scroll-mt-28 text-lg font-semibold">
        {text.updateTitle}
      </h3>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-foreground/80">
        {text.updateSteps.map((step) => (
          <li key={step} className="leading-relaxed">
            {step}
          </li>
        ))}
      </ol>
    </section>
  );
  const firefoxSteps = firefoxReady ? (
    <section key="firefox" id="firefox" className="mt-10">
      <h2 className="text-xl font-semibold">{text.firefoxStepsTitle}</h2>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-foreground/80">
        {text.firefoxSteps.map((step) => (
          <li key={step} className="leading-relaxed">
            {step}
          </li>
        ))}
      </ol>
    </section>
  ) : null;

  return (
    <article className="container max-w-3xl pb-12 pt-24 sm:pb-16 sm:pt-28">
      <Link
        href={localizedHref(lang, "/")}
        className="inline-flex items-center gap-1.5 text-sm text-foreground/60 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        {text.back}
      </Link>

      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{text.title}</h1>
      <p className="mt-3 leading-relaxed text-foreground/70">{text.summary}</p>

      {videoUrl && (
        <div className="mt-8 rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="font-medium">{text.failedVideo}</p>
          <p className="mt-1 break-all text-sm text-foreground/70">{videoUrl}</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">{text.failedVideoHint}</p>
          <a
            href={videoUrl}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
          >
            {text.openVideo}
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {chromeButton}
        {firefoxButton}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{text.browsersTitle}</h2>
        <p className="mt-3 leading-relaxed text-foreground/80">{text.browsers}</p>
        {firefoxReady && <p className="mt-2 leading-relaxed text-foreground/80">{text.browsersFirefox}</p>}
        <p className="mt-2 leading-relaxed text-foreground/60">{text.mobile}</p>
      </section>

      {isFirefox ? [firefoxSteps, chromeSteps] : [chromeSteps, firefoxSteps]}

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{text.getcourseTitle}</h2>
        <p className="mt-3 leading-relaxed text-foreground/80">{text.getcourse}</p>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold">{text.privacyTitle}</h2>
        <p className="mt-3 leading-relaxed text-foreground/80">{text.privacy}</p>
      </section>
    </article>
  );
}

// Кнопка установки для одного браузера. href null — варианта ещё нет:
// карточка видна, но не нажимается.
function BrowserButton({
  href,
  download,
  logo,
  title,
  hint,
  footer,
  badge,
}: {
  href: string | null;
  download?: string;
  logo: ReactNode;
  title: string;
  hint: string;
  footer: string;
  badge: string | null;
}) {
  const highlighted = badge !== null;
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-white/95">
          {logo}
        </span>
        {badge && (
          <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">{badge}</span>
        )}
      </div>
      <span className="mt-4 block text-lg font-semibold leading-snug">{title}</span>
      <span className="mt-1 block text-sm leading-relaxed text-foreground/60">{hint}</span>
      <span
        className={`mt-5 inline-flex items-center gap-2 self-start rounded-lg px-4 py-2 text-sm font-semibold ${
          href
            ? highlighted
              ? "bg-primary text-white transition-colors group-hover:bg-primary/90"
              : "bg-foreground/5 text-foreground transition-colors group-hover:bg-foreground/10"
            : "bg-foreground/5 text-foreground/50"
        }`}
      >
        {href && <Download className="h-4 w-4" />}
        {footer}
      </span>
    </>
  );
  const frame = `group flex flex-col rounded-2xl border p-5 text-left ${
    highlighted ? "border-primary/50 bg-primary/5 shadow-md" : "border-border bg-background"
  }`;

  if (!href) {
    return (
      <div className={`${frame} opacity-70`} aria-disabled="true">
        {body}
      </div>
    );
  }
  return (
    <a
      href={href}
      download={download}
      className={`${frame} transition-all hover:-translate-y-0.5 hover:border-primary hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary`}
    >
      {body}
    </a>
  );
}
