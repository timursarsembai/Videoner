import { Metadata } from "next";
import { headers } from "next/headers";
import Link from "next/link";
import { ArrowLeft, Download, ExternalLink } from "lucide-react";

import { extensionPage } from "@/lib/extension-page";
import { FIREFOX_EXTENSION_VERSION } from "@/lib/extension-firefox-version";
import { EXTENSION_VERSION } from "@/lib/extension-version";
import { localizedHref } from "@/lib/i18n/routing";
import { resolveLocale } from "@/lib/legal/page";
import { detectPlatform } from "@/lib/validations/url";

// Страница расширения для браузера. Сюда ведут кнопки «скачать через
// расширение» из бота и с сайта, когда площадка не отдала ролик нашему серверу
// (lib/extension-hint.ts, bot/src/helpers.ts) — со ссылкой на ролик в ?url=.
//
// Два варианта установки: архив для Chrome и браузеров на его основе (режим
// разработчика, вручную) и подписанный у Mozilla .xpi для Firefox (кнопкой с
// сайта). Посетителю Firefox — его вариант первым; браузер узнаём по
// User-Agent: ошибиться тут не страшно, второй вариант на странице тоже есть.

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
      languages: {
        en: "https://videoner.download/extension",
        ru: "https://videoner.download/ru/extension",
        es: "https://videoner.download/es/extension",
        "x-default": "https://videoner.download/extension",
      },
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
  const isFirefox = /Firefox\//.test(userAgent) && !/Android|Mobile/.test(userAgent);
  const firefoxReady = FIREFOX_EXTENSION_VERSION !== null;

  const chromeDownload = (
    <a
      href={`/extension/videoner-extension.zip?v=${EXTENSION_VERSION}`}
      download={`videoner-extension-${EXTENSION_VERSION}.zip`}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white shadow transition-colors hover:bg-primary/90"
    >
      <Download className="h-5 w-5" />
      {text.download}
    </a>
  );
  // Ссылка на .xpi без download: Firefox сам предлагает установить
  // дополнение, а не сохраняет файл.
  const firefoxInstall = (
    <a
      href={`${FIREFOX_XPI}?v=${FIREFOX_EXTENSION_VERSION}`}
      className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-white shadow transition-colors hover:bg-primary/90"
    >
      <Download className="h-5 w-5" />
      {text.firefoxInstall}
    </a>
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

      {isFirefox && !firefoxReady && (
        <p className="mt-8 rounded-xl border border-border bg-muted/40 p-4 text-sm leading-relaxed text-foreground/80">
          {text.firefoxSoon}
        </p>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-4">
        {isFirefox && firefoxReady ? firefoxInstall : chromeDownload}
        <span className="text-sm text-foreground/50">
          {text.version} {isFirefox && firefoxReady ? FIREFOX_EXTENSION_VERSION : EXTENSION_VERSION}
        </span>
      </div>
      {firefoxReady && (
        <p className="mt-3 text-sm">
          {isFirefox ? (
            <a
              href={`/extension/videoner-extension.zip?v=${EXTENSION_VERSION}`}
              download={`videoner-extension-${EXTENSION_VERSION}.zip`}
              className="text-primary hover:underline"
            >
              {text.chromeZipLink}
            </a>
          ) : (
            <a href={`${FIREFOX_XPI}?v=${FIREFOX_EXTENSION_VERSION}`} className="text-primary hover:underline">
              {text.firefoxLink}
            </a>
          )}
        </p>
      )}

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
