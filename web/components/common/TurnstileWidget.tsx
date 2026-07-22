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
    };
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

interface TurnstileWidgetProps {
  onVerify: (token: string | null) => void;
}

// Managed-виджет Cloudflare Turnstile — защищает форму отправки ссылки от
// автоматизированного/скриптового злоупотребления (см. память bot-monetization,
// пункт про капчу). data-action фиксирован по требованию виджета (для атрибуции
// интеграции на стороне Cloudflare), значения токена это не меняет.
export function TurnstileWidget({ onVerify }: TurnstileWidgetProps) {
  const containerId = useId().replace(/:/g, "");
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    if (!scriptLoaded || !SITE_KEY || !window.turnstile) return;

    window.turnstile.render(`#${containerId}`, {
      sitekey: SITE_KEY,
      action: "turnstile-spin-v2",
      callback: (token) => onVerify(token),
      "expired-callback": () => onVerify(null),
      "error-callback": () => onVerify(null),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded, containerId]);

  if (!SITE_KEY) return null;

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        async
        defer
        onLoad={() => setScriptLoaded(true)}
      />
      <div id={containerId} className="cf-turnstile" data-action="turnstile-spin-v2" />
    </>
  );
}
