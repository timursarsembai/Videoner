import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { DASHBOARD_KEY_COOKIE } from "@/lib/auth/dashboard-session";

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL!;

// Раньше ключ дашборд-аналитики (X-API-Key с правами admin — доступ к email
// пользователей, revenue, telegramId) хранился в sessionStorage браузера и
// летел напрямую с клиента на NEXT_PUBLIC_API_URL, в обход серверного прокси.
// Любая XSS на этой странице могла его прочитать. Теперь ключ вводится один
// раз, проверяется здесь на сервере и живёт ТОЛЬКО в httpOnly-cookie — из
// клиентского JS он больше не читаем и не виден никаким скриптам страницы.
export async function POST(request: NextRequest) {
  let body: { apiKey?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const apiKey = body.apiKey?.trim();
  if (!apiKey) {
    return NextResponse.json({ error: "apiKey is required" }, { status: 400 });
  }

  const check = await axios.get(`${API_URL}/analytics/overview`, {
    headers: { "X-API-Key": apiKey, host: new URL(API_URL).host },
    validateStatus: () => true,
  });

  if (check.status !== 200) {
    return NextResponse.json({ error: "Invalid or revoked key" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASHBOARD_KEY_COOKIE, apiKey, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    // Без maxAge — сессионная cookie, как и было с sessionStorage (живёт,
    // пока не закрыт браузер, не переживает явное закрытие вкладки/окна).
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASHBOARD_KEY_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
