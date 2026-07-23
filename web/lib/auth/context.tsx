"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { SubscriptionStatus } from "./types";

interface AuthContextValue {
  // undefined — статус ещё не загружен (не мигать логин-виджетом до ответа /me)
  user: SubscriptionStatus | null | undefined;
  refresh: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Раньше UserMenu (монтируется дважды — десктоп+мобильная шапка) и VideoInfo
// каждый сам себе дёргали GET /api/auth/me — 3 независимых одинаковых запроса
// на одну загрузку страницы download-UI. Один провайдер на уровне layout'а —
// один запрос, все потребители читают общий стейт через useAuth().
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SubscriptionStatus | null | undefined>(undefined);

  const refresh = useCallback(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setUser(data.user ?? null))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <AuthContext.Provider value={{ user, refresh }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
