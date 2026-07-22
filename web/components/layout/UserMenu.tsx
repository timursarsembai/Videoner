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
    // Telegram возвращает пользователя редиректом на return_to с подписанными
    // полями в query-параметрах (см. TelegramLoginWidget.tsx) — если они есть,
    // это только что завершённый вход, а не обычный заход на страницу.
    const params = new URLSearchParams(window.location.search);
    const hash = params.get("hash");
    const id = params.get("id");
    if (hash && id) {
      window.history.replaceState(null, "", window.location.pathname);
      handleAuth({
        id: Number(id),
        first_name: params.get("first_name") ?? "",
        last_name: params.get("last_name") ?? undefined,
        username: params.get("username") ?? undefined,
        photo_url: params.get("photo_url") ?? undefined,
        auth_date: Number(params.get("auth_date")),
        hash,
      });
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
