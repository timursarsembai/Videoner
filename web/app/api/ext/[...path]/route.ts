import { NextRequest, NextResponse } from "next/server";
import {
  DOWNLOAD_PROXY_PATHS,
  createVisitorRateLimiter,
  isInfoRequest,
  proxyApiRequest,
  type ProxyOptions,
} from "@/lib/api-proxy";

// Вход в API для браузерного расширения (extension/). Те же пути, что у сайта,
// кроме квоты (она про вход через Telegram, а у расширения сессии нет), и без
// капчи: Turnstile внутри расширения не пройти.
//
// Защита вместо капчи — только лимиты по IP. Проверка Origin ниже отсекает
// чужие сайты (подделать Origin браузер им не даст), но скрипт вне браузера
// подставит любой — это осознанное решение владельца (27.10.2026). На
// скачивание сверх этого действует суточный лимит трафика YouTube по IP на
// сервере: прокси ставит source = EXTENSION, и лимит его учитывает.
const EXTENSION_RATE_LIMIT = Number(process.env.EXTENSION_RATE_LIMIT) || 30; // запросов/мин
// /info — самый дорогой запрос (yt-dlp, трафик прокси YouTube), и у сайта его
// прикрывает капча. Здесь — свой лимит, заметно строже общего.
const EXTENSION_INFO_RATE_LIMIT = Number(process.env.EXTENSION_INFO_RATE_LIMIT) || 10; // запросов/мин

const allowRequest = createVisitorRateLimiter(EXTENSION_RATE_LIMIT);
const allowInfo = createVisitorRateLimiter(EXTENSION_INFO_RATE_LIMIT);

const EXTENSION_PROXY: ProxyOptions = {
  // report — отчёт о файле, который браузер скачал сам (TikTok, Threads), для
  // статистики; сайту этот путь не нужен и не открыт.
  allowedPaths: [...DOWNLOAD_PROXY_PATHS, { method: "POST", path: "download/report" }],
  allowVisitor: (ip, request, path) =>
    allowRequest(ip) && (!isInfoRequest(request, path) || allowInfo(ip)),
  requireCaptcha: false,
  source: "EXTENSION",
};

// Chrome, Яндекс Браузер и Edge — все на Chromium, адрес страниц расширения у
// них один и тот же по виду.
function isExtensionRequest(request: NextRequest): boolean {
  return request.headers.get("origin")?.startsWith("chrome-extension://") ?? false;
}

async function handle(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!isExtensionRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return proxyApiRequest(request, path, EXTENSION_PROXY);
}

export const GET = handle;
export const POST = handle;
