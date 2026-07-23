"use client";

import { Send } from "lucide-react";
import { Button } from "../ui/button";

const BOT_ID = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID;

export interface TelegramAuthUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date: number;
  hash: string;
}

interface TelegramLoginWidgetProps {
  label: string;
  // Иконка вместо текстовой кнопки — для тесных мест (шапка на мобильном).
  compact?: boolean;
}

// Официальный JS-виджет (iframe от telegram.org/js/telegram-widget.js)
// на части мобильных браузеров не рендерится вообще — трекинг-защита
// блокирует скрипт как соц. виджет (Facebook Like-style трекер), и
// проверить/починить это без живого браузера нельзя. Поэтому вместо
// стороннего скрипта используем официальный redirect-флоу Telegram Login:
// обычная ссылка на oauth.telegram.org — Telegram сам вернёт подписанные
// поля пользователя через query-параметры на return_to (см. UserMenu.tsx).
export function TelegramLoginWidget({ label, compact }: TelegramLoginWidgetProps) {
  if (!BOT_ID) return null;

  const handleClick = () => {
    const origin = window.location.origin;
    const returnTo = `${origin}${window.location.pathname}`;
    const url =
      `https://oauth.telegram.org/auth?bot_id=${BOT_ID}` +
      `&origin=${encodeURIComponent(origin)}` +
      `&request_access=write` +
      `&return_to=${encodeURIComponent(returnTo)}`;
    window.location.href = url;
  };

  if (compact) {
    return (
      <Button
        size="icon"
        variant="ghost"
        className="rounded-full"
        onClick={handleClick}
        aria-label={label}
        title={label}
      >
        <Send className="h-5 w-5" />
      </Button>
    );
  }

  return (
    <Button size="sm" onClick={handleClick} className="gap-1.5">
      <Send className="h-4 w-4" />
      {label}
    </Button>
  );
}
