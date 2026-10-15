import { NextRequest, NextResponse } from "next/server";

// Длинная ссылка-приглашение videoner.download/bot/<ссылка на видео>: middleware
// переписывает её сюда, передав ссылку заголовком (см. INVITE_URL_HEADER), мы берём у сервера короткий код и уводим в
// бота — t.me/<бот>?start=<код>. В start Telegram пропускает только короткий
// код, а не саму ссылку (см. server/src/modules/share-link).
//
// Любая неудача — всё равно в бота, только без видео: человек шёл туда.
const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.API_KEY!;
const BOT_URL = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME ?? "VideonerBot"}`;
const API_TIMEOUT_MS = 5_000;
// Заголовком, а не ?url=: после rewrite из middleware route handler видит
// исходный адрес запроса (/bot/https:/...), и query переписанного адреса до
// него не доходит. Подделать заголовок можно — но это ничего не даёт сверх
// того, что и так доступно через /bot/<ссылка>: сервер сам проверяет ссылку.
const INVITE_URL_HEADER = "x-videoner-invite-url";

// Свой лимит по IP посетителя, как в app/api/[...path]/route.ts: на сервере
// все запросы сайта видны с одного IP и идут под общим ключом, так что без
// него перебор этого адреса выедал бы общий лимит всего сайта.
const INVITE_RATE_LIMIT = 20; // запросов/мин
const visitorRequests = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function allowVisitor(ip: string): boolean {
  const now = Date.now();
  for (const [key, entry] of visitorRequests) {
    if (entry.resetAt < now) visitorRequests.delete(key);
  }
  const entry = visitorRequests.get(ip);
  if (!entry) {
    visitorRequests.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= INVITE_RATE_LIMIT) return false;
  entry.count++;
  return true;
}

export async function GET(request: NextRequest) {
  const url = request.headers.get(INVITE_URL_HEADER);
  if (!url || !allowVisitor(getClientIp(request))) {
    return NextResponse.redirect(BOT_URL, 307);
  }

  try {
    const res = await fetch(`${API_URL}/share-links`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
      body: JSON.stringify({ url }),
      signal: AbortSignal.timeout(API_TIMEOUT_MS),
    });
    if (res.ok) {
      const { code } = await res.json();
      if (typeof code === "string" && /^[A-Za-z0-9]+$/.test(code)) {
        return NextResponse.redirect(`${BOT_URL}?start=${code}`, 307);
      }
    }
    console.error(`Код приглашения для ${url} не получен: сервер ответил ${res.status}`);
  } catch (e: any) {
    console.error(`Код приглашения для ${url} не получен:`, e?.message ?? e);
  }
  return NextResponse.redirect(BOT_URL, 307);
}
