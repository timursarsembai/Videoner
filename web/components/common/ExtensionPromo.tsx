"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { localizedHref, stripLocalePrefix } from "@/lib/i18n/routing";
import { extensionPromo } from "@/lib/extension-promo";
import { FIREFOX_AMO, isChromiumUserAgent, isFirefoxUserAgent } from "@/lib/extension-links";
import { ChromeLogo, FirefoxLogo } from "./browser-logos";

// Окошко «Установите расширение» в правом нижнем углу (в арабском письме —
// в левом). Firefox ведём сразу в каталог дополнений Mozilla, браузеры на
// Chromium (Chrome, Яндекс, Edge, Opera, Brave) — на нашу страницу
// расширения. На телефонах и в остальных браузерах (Safari) расширение не
// поставить — там окошка нет.
//
// Узнать, стоит ли расширение, сайт не может: на videoner.download оно не
// запускается. Поэтому окошко помнит ответ человека: закрыл — молчим
// DISMISS_DAYS дней, пошёл ставить — INSTALL_DAYS: переход ещё не установка
// (в Chrome это архив и режим разработчика, многие бросают на полпути), и
// навсегда молчать незачем.
//
// Слой ниже всплывающих уведомлений (react-hot-toast, тот же угол) и меню
// телефона в шапке (z-40): окошко второстепенное и ничего не перекрывает.

const STORAGE_KEY = "videoner.extensionPromo";
const DISMISS_DAYS = 30;
const INSTALL_DAYS = 180;
// Не с порога: сначала человек видит сам сайт.
const SHOW_DELAY_MS = 4000;

type Browser = "firefox" | "chromium";

function detectBrowser(userAgent: string): Browser | null {
  if (isFirefoxUserAgent(userAgent)) return "firefox";
  if (isChromiumUserAgent(userAgent)) return "chromium";
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

// Хранится «dismissed:<время>» или «install:<время>».
function wasAnswered(): boolean {
  const [kind, at] = (readState() ?? "").split(":");
  const days = kind === "install" ? INSTALL_DAYS : kind === "dismissed" ? DISMISS_DAYS : 0;
  const since = Number(at);
  return days > 0 && Number.isFinite(since) && Date.now() - since < days * 24 * 60 * 60 * 1000;
}

export function ExtensionPromo() {
  const { language } = useLanguage();
  const pathname = usePathname();
  const [browser, setBrowser] = useState<Browser | null>(null);
  const [visible, setVisible] = useState(false);
  // На самой странице расширения окошко ни к чему.
  const onExtensionPage = stripLocalePrefix((pathname ?? "/").replace(/\/+$/, "") || "/") === "/extension";

  useEffect(() => {
    if (onExtensionPage || wasAnswered()) return;
    const detected = detectBrowser(navigator.userAgent);
    if (!detected) return;
    setBrowser(detected);
    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [onExtensionPage]);

  if (!visible || !browser || onExtensionPage) return null;

  const text = extensionPromo[language];
  const href = browser === "firefox" ? FIREFOX_AMO : localizedHref(language, "/extension");
  const close = () => {
    writeState(`dismissed:${Date.now()}`);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label={text.title}
      className="fixed bottom-4 end-4 z-30 w-[calc(100vw-2rem)] max-w-sm rounded-xl border border-border bg-background p-4 shadow-lg"
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
              writeState(`install:${Date.now()}`);
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
