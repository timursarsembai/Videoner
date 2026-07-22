"use client";

import { useEffect, useRef } from "react";

export interface TelegramAuthUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

declare global {
  interface Window {
    onTelegramAuth?: (user: TelegramAuthUser) => void;
  }
}

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;

interface TelegramLoginWidgetProps {
  onAuth: (user: TelegramAuthUser) => void;
}

// В отличие от Turnstile (у него есть window.turnstile.render() для явного
// вызова из React), у Telegram Login Widget нет отдельного JS render-API —
// он сканирует DOM на <script data-telegram-login> в момент СВОЕГО исполнения
// и заменяет его на iframe-кнопку. next/script дедуплицирует по src и не
// выполнится повторно при повторном монтировании (см. баг Turnstile этой же
// сессии) — здесь вместо этого вручную создаём новый <script> при каждом
// монтировании компонента, так что виджет гарантированно пересканирует
// именно этот контейнер.
export function TelegramLoginWidget({ onAuth }: TelegramLoginWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!BOT_USERNAME || !containerRef.current) return;

    window.onTelegramAuth = onAuth;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", BOT_USERNAME);
    script.setAttribute("data-size", "medium");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");

    const container = containerRef.current;
    container.innerHTML = "";
    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!BOT_USERNAME) return null;

  return <div ref={containerRef} />;
}
