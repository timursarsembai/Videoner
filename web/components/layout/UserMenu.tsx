"use client";

import { useLanguage } from "@/lib/i18n/context";
import { useAuth } from "@/lib/auth/context";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { TelegramLoginWidget } from "../common/TelegramLoginWidget";

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
const LOCALE_MAP: Record<string, string> = { ru: "ru-RU", es: "es-ES", en: "en-US" };

interface UserMenuProps {
  // Иконка без текста — для тесной мобильной шапки. На десктопе, где место
  // есть, показываем полноценную кнопку "Войти"/"Sign In" рядом с иконкой.
  compact?: boolean;
}

export function UserMenu({ compact = false }: UserMenuProps) {
  const { t, language } = useLanguage();
  // Статус приходит из общего AuthProvider (один запрос /api/auth/me на всю
  // страницу, а не по одному на каждый смонтированный потребитель — см.
  // lib/auth/context.tsx). Обработка Telegram-редиректа (#tgAuthResult=...)
  // по-прежнему живёт в Navbar (должна выполниться РОВНО ОДИН РАЗ), здесь
  // просто читаем текущую сессию.
  const { user, refresh } = useAuth();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // refresh(), а не полная перезагрузка страницы — общий контекст сам
    // обновит состояние у всех потребителей (обе UserMenu, VideoInfo и т.д.).
    refresh();
  };

  if (user === undefined) return null;

  if (!user) {
    return compact ? (
      <TelegramLoginWidget label={t("auth.loginButton")} compact />
    ) : (
      <TelegramLoginWidget label={t("auth.signIn")} />
    );
  }

  const dateStr = user.subscriptionUntil
    ? new Date(user.subscriptionUntil).toLocaleDateString(LOCALE_MAP[language] ?? "en-US")
    : null;
  const subscriptionLabel = user.isUnlimited
    ? dateStr
      ? t("auth.subscribedUntil", { date: dateStr })
      : t("auth.subscribed")
    : t("auth.notSubscribed");
  const initial = (user.firstName || user.username || "T").charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full"
          aria-label={t("auth.loginButton")}
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
            {initial}
          </span>
          <span
            className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-background ${
              user.isUnlimited ? "bg-green-500" : "bg-muted-foreground/50"
            }`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">
              {user.firstName || user.username || "Telegram"}
            </span>
            <span className="text-xs text-muted-foreground">{subscriptionLabel}</span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {!user.isUnlimited && BOT_USERNAME && (
          <DropdownMenuItem asChild>
            <a
              href={`https://t.me/${BOT_USERNAME}?start=subscribe`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("auth.subscribeButton")}
            </a>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={handleLogout}>{t("auth.logout")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
