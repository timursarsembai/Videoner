import { NextRequest, NextResponse } from "next/server";
import { isSameOriginRequest } from "@/lib/auth/request-origin";
import {
  DOWNLOAD_PROXY_PATHS,
  createVisitorRateLimiter,
  proxyApiRequest,
  type ProxyOptions,
} from "@/lib/api-proxy";

// Прокси сайта к NestJS API. Общая логика — в lib/api-proxy.ts (её же
// использует вход для расширения, app/api/ext/[...path]/route.ts); здесь —
// то, что относится только к сайту: проверка Origin, капча на /info, квота.
const VISITOR_RATE_LIMIT = Number(process.env.VISITOR_RATE_LIMIT) || 30; // запросов/мин
const allowVisitor = createVisitorRateLimiter(VISITOR_RATE_LIMIT);

const SITE_PROXY: ProxyOptions = {
  allowedPaths: [...DOWNLOAD_PROXY_PATHS, { method: "GET", path: "download/quota" }],
  allowVisitor: (ip) => allowVisitor(ip),
  requireCaptcha: true,
  source: "WEB",
};

async function handle(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  return proxyApiRequest(request, path, SITE_PROXY);
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
