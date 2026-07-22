"use client";

import Script from "next/script";
import { useEffect, useId, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          action?: string;
          callback?: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

interface TurnstileWidgetProps {
  onVerify: (token: string | null) => void;
}

// Managed-виджет Cloudflare Turnstile — защищает форму отправки ссылки от
// автоматизированного/скриптового злоупотребления (см. память bot-monetization,
// пункт про капчу). data-action фиксирован по требованию виджета (для атрибуции
// интеграции на стороне Cloudflare), значения токена это не меняет.
export function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
  const containerId = useId().replace(/:/g, "");
  const [ready, setReady] = useState(false);

  // next/script вызывает onLoad ОДИН РАЗ на весь сайт (дедуп по src) — при
  // клиентской навигации Next.js на другую страницу тег скрипта уже в DOM,
  // и onLoad для нового смонтированного виджета больше никогда не сработает
  // (баг, из-за которого виджет пропадал после первого показа). Вместо этого
  // проверяем window.turnstile напрямую и, если скрипт ещё не готов, ждём поллингом.
  useEffect(() => {
    if (window.turnstile) {
      setReady(true);
      return;
    }
    const interval = setInterval(() => {
      if (window.turnstile) {
        setReady(true);
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!ready || !SITE_KEY || !window.turnstile) return;

    const widgetId = window.turnstile.render(`#${containerId}`, {
      sitekey: SITE_KEY,
      action: "turnstile-spin-v2",
      callback: (token) => onVerify(token),
      "expired-callback": () => onVerify(null),
      "error-callback": () => onVerify(null),
    });

    return () => {
      window.turnstile?.remove(widgetId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, containerId]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script src={SCRIPT_SRC} strategy="afterInteractive" />
      <div id={containerId} className="cf-turnstile" data-action="turnstile-spin-v2" />
    </>
  );
}
