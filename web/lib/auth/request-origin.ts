import { NextRequest } from "next/server";

const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL!;

// Общая проверка Origin/Referer для всех Route Handler'ов, принимающих
// state-changing запросы (POST/PUT/DELETE) с побочными эффектами для сессии
// пользователя. Раньше жила только внутри web/app/api/[...path]/route.ts —
// web/app/api/auth/telegram/route.ts её не имел вообще, что позволяло
// login CSRF: cross-site POST с валидным (ранее полученным атакующим)
// Telegram-payload логинил браузер жертвы в аккаунт атакующего. Найдено и
// закрыто 2026-07-23 (код-ревью). Используй в КАЖДОМ новом Route Handler'е
// с side-effect'ами — не полагайся на SameSite=Lax cookie, он не защищает
// от простых cross-site form/fetch POST-запросов.
export function isSameOriginRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  if (process.env.NODE_ENV === "development") {
    return true;
  }

  if (
    (!origin || origin !== ALLOWED_ORIGIN) &&
    (!referer || !referer.startsWith(ALLOWED_ORIGIN))
  ) {
    return false;
  }

  return true;
}
