"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { SubscriptionStatus } from "@/lib/auth/types";
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

export function UserMenu() {
  const { t, language } = useLanguage();
  // undefined — статус ещё не загружен (не мигаем логин-виджетом до ответа /me)
  const [user, setUser] = useState<SubscriptionStatus | null | undefined>(undefined);

  // Обработка Telegram-редиректа (#tgAuthResult=...) живёт в Navbar — она
  // должна выполниться РОВНО ОДИН РАЗ (POST на /api/auth/telegram), а UserMenu
  // монтируется дважды одновременно (десктоп + мобильная шапка, оба всегда
  // в DOM, просто один скрыт через CSS) — если бы каждый экземпляр сам себе
  // парсил хэш, была бы гонка за то, кто первым его обнулит. После успешного
  // входа Navbar делает location.replace() — так что здесь просто читаем
  // текущую сессию, ничего не обрабатываем.
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    // Полная перезагрузка, а не просто setUser(null) — на странице может быть
    // ещё несколько независимых потребителей /api/auth/me (см. VideoInfo.tsx),
    // у каждого свой локальный стейт без общего контекста.
    window.location.reload();
  };

  if (user === undefined) return null;

  if (!user) {
    return <TelegramLoginWidget label={t("auth.loginButton")} compact />;
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
