import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { DASHBOARD_KEY_COOKIE } from "@/lib/auth/dashboard-session";

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL!;

// Прокси GET-запросов дашборда к /analytics/* на бэкенде. Ключ берётся ИЗ
// httpOnly-cookie (см. ../auth/route.ts), а не от клиента — сам браузер этот
// ключ никогда не видит и не может его никуда передать.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const apiKey = request.cookies.get(DASHBOARD_KEY_COOKIE)?.value;
  if (!apiKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { path } = await params;
  const targetUrl = `${API_URL}/analytics/${path.join("/")}${request.nextUrl.search}`;

  const response = await axios.get(targetUrl, {
    headers: { "X-API-Key": apiKey, host: new URL(API_URL).host },
    validateStatus: () => true,
  });

  return NextResponse.json(response.data, { status: response.status });
}
