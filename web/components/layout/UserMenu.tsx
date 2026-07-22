"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/context";
import { Button } from "../ui/button";
import { TelegramAuthUser, TelegramLoginWidget } from "../common/TelegramLoginWidget";

interface SubscriptionStatus {
  telegramId: string;
  username: string | null;
  firstName: string | null;
  isUnlimited: boolean;
  subscriptionUntil: string | null;
  subscriptionKind: "MONTHLY" | "YEARLY" | null;
}

const BOT_USERNAME = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME;
const LOCALE_MAP: Record<string, string> = { ru: "ru-RU", es: "es-ES", en: "en-US" };

export function UserMenu() {
  const { t, language } = useLanguage();
  // undefined — статус ещё не загружен (не мигаем логин-виджетом до ответа /me)
  const [user, setUser] = useState<SubscriptionStatus | null | undefined>(undefined);

  const handleAuth = async (authUser: TelegramAuthUser) => {
    try {
      const res = await fetch("/api/auth/telegram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authUser),
      });
      if (res.ok) {
        setUser(await res.json());
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Telegram login failed:", error);
      setUser(null);
    }
  };

  useEffect(() => {
    // Telegram возвращает результат на return_to не query-параметрами, а
    // фрагментом URL: #tgAuthResult=<base64(JSON)> — сам объект (id, hash, ...)
    // при успехе, либо буквально base64("false") при отмене/повторном запросе
    // (см. TelegramLoginWidget.tsx).
    const rawHash = window.location.hash;
    if (rawHash.startsWith("#tgAuthResult=")) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
      const encoded = rawHash.slice("#tgAuthResult=".length);
      try {
        const padded = encoded + "=".repeat((4 - (encoded.length % 4)) % 4);
        const decoded = JSON.parse(atob(padded));
        if (decoded && typeof decoded === "object" && decoded.hash) {
          handleAuth(decoded as TelegramAuthUser);
          return;
        }
      } catch (error) {
        console.error("Failed to parse Telegram auth result:", error);
      }
      setUser(null);
      return;
    }

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
  };

  if (user === undefined) return null;

  if (!user) {
    return <TelegramLoginWidget label={t("auth.loginButton")} />;
  }

  const dateStr = user.subscriptionUntil
    ? new Date(user.subscriptionUntil).toLocaleDateString(LOCALE_MAP[language] ?? "en-US")
    : null;
  const subscriptionLabel = user.isUnlimited
    ? dateStr
      ? t("auth.subscribedUntil", { date: dateStr })
      : t("auth.subscribed")
    : t("auth.notSubscribed");

  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="hidden text-foreground/70 sm:inline">
        {user.firstName || user.username || "Telegram"} · {subscriptionLabel}
      </span>
      {!user.isUnlimited && BOT_USERNAME && (
        <a href={`https://t.me/${BOT_USERNAME}?start=subscribe`} target="_blank" rel="noopener noreferrer">
          <Button size="sm">{t("auth.subscribeButton")}</Button>
        </a>
      )}
      <Button size="sm" variant="ghost" onClick={handleLogout}>
        {t("auth.logout")}
      </Button>
    </div>
  );
}
