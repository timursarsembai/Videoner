import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import {
  createSessionToken,
  SESSION_COOKIE_NAME,
  SESSION_MAX_AGE_SECONDS,
} from "@/lib/auth/session";
import { isSameOriginRequest } from "@/lib/auth/request-origin";

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.API_KEY!;

// Принимает сырой payload от Telegram Login Widget (см. TelegramLoginWidget.tsx),
// пересылает на NestJS /bot-users/telegram-login для проверки подписи Telegram
// (бот-токен есть только у server-контейнера — веб его не хранит и не видит).
// При успехе ставит httpOnly session-cookie на этот домен.
export async function POST(request: NextRequest) {
  // Без этой проверки — login CSRF: атакующий может залогинить браузер жертвы
  // в СВОЙ аккаунт, переиграв свой же ранее полученный валидный подписанный
  // Telegram-payload через cross-site POST (SameSite=Lax на самой cookie от
  // этого не защищает — она про то, шлётся ли УЖЕ существующая cookie на
  // сторонних запросах, а не про то, принимает ли сервер чужой Set-Cookie).
  // Найдено и закрыто 2026-07-23 (код-ревью).
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const response = await axios.post(`${API_URL}/bot-users/telegram-login`, body, {
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        host: new URL(API_URL).host,
      },
      validateStatus: () => true,
    });

    if (response.status < 200 || response.status >= 300) {
      return NextResponse.json(response.data, { status: response.status });
    }

    const status = response.data as { telegramId: string };
    const token = await createSessionToken(Number(status.telegramId));

    const res = NextResponse.json(status);
    res.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_SECONDS,
    });
    return res;
  } catch (error) {
    console.error("Telegram login proxy error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
