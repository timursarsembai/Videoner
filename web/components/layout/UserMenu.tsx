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


interface UserMenuProps {
  // Иконка без текста — для тесной мобильной шапки. На десктопе, где место
  // есть, показываем полноценную кнопку "Войти"/"Sign In" рядом с иконкой.
  compact?: boolean;
}

export function UserMenu({ compact = false }: UserMenuProps) {
  const { t } = useLanguage();
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
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="font-medium">
              {user.firstName || user.username || "Telegram"}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>{t("auth.logout")}</DropdownMenuItem>
        {/* Telegram не даёт форсировать выбор аккаунта: при живой сессии
            Telegram Web oauth.telegram.org молча подтверждает вход именно ею,
            без экрана выбора. Единственный обходной путь — разлогиниться там.
            Раньше эта подсказка висела ПОД КНОПКОЙ ВХОДА и показывалась всем
            гостям подряд: человек ещё не авторизовался, а ему уже сообщали
            про «не тот аккаунт» (замечание пользователя, дважды). Здесь она
            на своём месте — имя аккаунта видно прямо над ней, и вопрос «не
            тот аккаунт?» наконец имеет смысл. */}
        <DropdownMenuItem asChild>
          <a
            href="https://web.telegram.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted-foreground"
          >
            {t("auth.switchAccountHint")} {t("auth.switchAccountLink")}
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
