import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getSessionTelegramId } from "@/lib/auth/session";

// Внутренний адрес бэкенда для серверного прокси (в Docker — http://server:3001).
// Если не задан, падаем на публичный NEXT_PUBLIC_API_URL (как в локальной разработке).
const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.API_KEY!;
const ALLOWED_ORIGIN = process.env.NEXT_PUBLIC_APP_URL!;

// На бэкенде (server) все запросы отсюда видны с ОДНОГО internal docker-IP
// этого web-контейнера — per-IP лимит там не различает реальных посетителей
// сайта между собой. Здесь, на входе в /api/*, x-forwarded-for ещё содержит
// настоящий IP браузера (его проставляет ваш nginx на этом хопе) — поэтому
// троттлим по нему именно тут, до похода в NestJS API.
const VISITOR_RATE_LIMIT = Number(process.env.VISITOR_RATE_LIMIT) || 30; // запросов/мин
const visitorRequests = new Map<string, { count: number; resetAt: number }>();

function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function checkVisitorRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = visitorRequests.get(ip);

  if (!entry || entry.resetAt < now) {
    visitorRequests.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }

  if (entry.count >= VISITOR_RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of visitorRequests.entries()) {
    if (entry.resetAt < now) visitorRequests.delete(ip);
  }
}, 60_000);

// Cloudflare Turnstile: проверяем токен ТОЛЬКО на /info — это единственная
// форма на сайте (см. TurnstileWidget в Page.tsx), и самая ресурсоёмкая точка
// входа (дёргает yt-dlp). Бот сюда не заходит вообще — он бьёт напрямую в
// NestJS (API_URL в bot/src/bot.ts), минуя этот прокси, так что проверка не
// может сломать бота даже случайно.
const TURNSTILE_SECRET = process.env.TURNSTILE_SECRET;

async function verifyTurnstile(token: unknown, remoteIp: string): Promise<boolean> {
  if (!TURNSTILE_SECRET) {
    console.error("TURNSTILE_SECRET not configured — failing closed on /info");
    return false;
  }
  if (typeof token !== "string" || !token) return false;

  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: TURNSTILE_SECRET,
        response: token,
        remoteip: remoteIp,
      }),
    });
    const result = await res.json();
    return result.success === true;
  } catch (error) {
    console.error("Turnstile siteverify request failed:", error);
    return false;
  }
}

// Middleware to verify the request is coming from our frontend
function isValidRequest(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");

  // In development, allow requests without origin (like from Postman)
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  // Verify the request is coming from our frontend
  if (
    (!origin || origin !== ALLOWED_ORIGIN) &&
    (!referer || !referer.startsWith(ALLOWED_ORIGIN))
  ) {
    return false;
  }

  return true;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!isValidRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return handleRequest(request, path);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!isValidRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return handleRequest(request, path);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!isValidRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return handleRequest(request, path);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!isValidRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return handleRequest(request, path);
}


async function handleRequest(request: NextRequest, path: string[]) {
  if (!API_KEY) {
    return NextResponse.json(
      { error: "API key not configured" },
      { status: 500 }
    );
  }

  if (!checkVisitorRateLimit(getClientIp(request))) {
    return NextResponse.json(
      { error: "Rate limit exceeded, try again later" },
      { status: 429 }
    );
  }

  try {
    const targetUrl = `${API_URL}/${path.join("/")}`;
    let body = request.body ? await request.json() : undefined;

    if (path.length === 1 && path[0] === "info" && request.method === "POST") {
      const ok = await verifyTurnstile(body?.turnstileToken, getClientIp(request));
      if (!ok) {
        return NextResponse.json({ error: "Captcha verification failed" }, { status: 403 });
      }
      delete body.turnstileToken;
    }

    // Скачивание на сайте требует входа через Telegram — тот же дневной лимит
    // и HD-гейт, что и в боте (см. DownloadService.enforceWebLimits на сервере).
    // telegramId берём из проверенной сессии (cookie), а не от клиента — иначе
    // можно было бы просто подставить чужой id и обойти лимит/подписку.
    if (
      path.length === 2 &&
      path[0] === "download" &&
      (path[1] === "video" || path[1] === "audio") &&
      request.method === "POST"
    ) {
      const telegramId = await getSessionTelegramId();
      if (!telegramId) {
        return NextResponse.json(
          { message: "Login required to download on the website", error: "Unauthorized" },
          { status: 401 }
        );
      }
      body = { ...(body ?? {}), telegramId };
    }

    const response = await axios({
      method: request.method,
      url: targetUrl,
      data: body,
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": API_KEY,
        host: new URL(API_URL).host,
      },
      validateStatus: () => true,
    });

    const headers = new Headers();

    // Forward rate limit headers
    const rateLimitHeaders = [
      "X-RateLimit-Limit",
      "X-RateLimit-Remaining",
      "X-RateLimit-Reset",
    ];

    rateLimitHeaders.forEach((header) => {
      const value = response.headers[header.toLowerCase()];
      if (value) {
        headers.set(header, value.toString());
      }
    });

    return NextResponse.json(response.data, {
      status: response.status,
      headers,
    });
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
