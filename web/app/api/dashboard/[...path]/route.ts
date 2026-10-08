import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { DASHBOARD_SESSION_COOKIE } from "@/lib/auth/dashboard-session";
import { verifyDashboardSession } from "@/lib/auth/dashboard-auth";

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.API_KEY;

// Прокси GET-запросов дашборда к /analytics/* на бэкенде. Пускает только с
// действующей сессией (вход по логину, паролю и коду), а к бэкенду ходит с
// ключом администратора из окружения сайта: в браузер этот ключ не попадает
// никогда, ни в каком виде.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const ok = await verifyDashboardSession(request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value);
  if (!ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const { path } = await params;
  const targetUrl = `${API_URL}/analytics/${path.join("/")}${request.nextUrl.search}`;

  const response = await axios.get(targetUrl, {
    headers: { "X-API-Key": API_KEY, host: new URL(API_URL).host },
    validateStatus: () => true,
  });

  return NextResponse.json(response.data, { status: response.status });
}
