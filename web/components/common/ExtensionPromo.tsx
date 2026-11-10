"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { localizedHref } from "@/lib/i18n/routing";
import { extensionPromo } from "@/lib/extension-promo";
import { ChromeLogo, FirefoxLogo } from "./browser-logos";

// Окошко «Установите расширение» в правом нижнем углу (в арабском письме —
// в левом). Firefox ведём сразу в каталог дополнений Mozilla, браузеры на
// Chromium (Chrome, Яндекс, Edge, Opera, Brave) — на нашу страницу
// расширения. На телефонах и в остальных браузерах (Safari) расширение не
// поставить — там окошка нет.
//
// Узнать, стоит ли расширение, сайт не может: на videoner.download оно не
// запускается. Поэтому окошко помнит ответ человека: закрыл — молчим
// DISMISS_DAYS дней, пошёл ставить — больше не показываем.

const FIREFOX_AMO = "https://addons.mozilla.org/firefox/addon/videoner-video-downloader/";
const STORAGE_KEY = "videoner.extensionPromo";
const DISMISS_DAYS = 30;
// Не с порога: сначала человек видит сам сайт.
const SHOW_DELAY_MS = 4000;

type Browser = "firefox" | "chromium";

function detectBrowser(userAgent: string): Browser | null {
  if (/Android|Mobile|iPhone|iPad/i.test(userAgent)) return null;
  if (/Firefox\//.test(userAgent)) return "firefox";
  // Chrome, Edge, Opera, Яндекс Браузер, Brave, Vivaldi пишут «Chrome/» в
  // user-agent; Safari — нет.
  if (/Chrome\//.test(userAgent)) return "chromium";
  return null;
}

// Хранилище может быть недоступно (приватный режим, запрет сайтов) — тогда
// просто показываем окошко как в первый раз.
function readState(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeState(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Не запомнили — покажем ещё раз, не беда.
  }
}

function wasAnswered(): boolean {
  const state = readState();
  if (!state) return false;
  if (state === "installed") return true;
  const dismissedAt = Number(state);
  return Number.isFinite(dismissedAt) && Date.now() - dismissedAt < DISMISS_DAYS * 24 * 60 * 60 * 1000;
}

export function ExtensionPromo() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [browser, setBrowser] = useState<Browser | null>(null);
  const [visible, setVisible] = useState(false);
  // На самой странице расширения окошко ни к чему.
  const onExtensionPage = /\/extension\/?$/.test(pathname ?? "");

  useEffect(() => {
    if (onExtensionPage || wasAnswered()) return;
    const detected = detectBrowser(navigator.userAgent);
    if (!detected) return;
    setBrowser(detected);
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [onExtensionPage]);

  if (!visible || !browser || onExtensionPage) return null;

  const text = extensionPromo[language] ?? extensionPromo.en;
  const href = browser === "firefox" ? FIREFOX_AMO : localizedHref(language, "/extension");
  const close = () => {
    writeState(String(Date.now()));
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label={text.title}
      className="fixed bottom-4 end-4 z-40 w-[calc(100vw-2rem)] max-w-sm rounded-xl border border-border bg-background p-4 shadow-lg"
    >
      <button
        type="button"
        onClick={close}
        aria-label={text.close}
        className="absolute end-2 top-2 rounded-md p-1 text-foreground/50 hover:bg-foreground/5 hover:text-foreground"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="flex items-start gap-3 pe-6">
        {browser === "firefox" ? (
          <FirefoxLogo className="h-9 w-9 shrink-0 text-[#ff7139]" />
        ) : (
          <ChromeLogo className="h-9 w-9 shrink-0 text-[#1a73e8]" />
        )}
        <div className="min-w-0">
          <p className="font-semibold leading-snug">{text.title}</p>
          <p className="mt-1 text-sm leading-snug text-foreground/70">{text.text}</p>
          <a
            href={href}
            {...(browser === "firefox" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            onClick={() => {
              writeState("installed");
              setVisible(false);
            }}
            className="mt-3 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-white hover:bg-primary/90"
          >
            {text.install}
          </a>
        </div>
      </div>
    </div>
  );
}
