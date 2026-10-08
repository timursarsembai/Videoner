import { NextRequest, NextResponse } from "next/server";
import { DASHBOARD_SESSION_COOKIE } from "@/lib/auth/dashboard-session";
import {
  DASHBOARD_SESSION_DAYS,
  acceptTotpOnce,
  clearFailures,
  createDashboardSession,
  isLockedOut,
  matchTotp,
  readCredentials,
  recordFailure,
  safeEqualStrings,
  verifyDashboardSession,
  verifyPassword,
} from "@/lib/auth/dashboard-auth";

// Адрес посетителя: Nginx Proxy Manager перезаписывает X-Forwarded-For
// настоящим IP, подставить свой посетитель не может (проверено 04.10.2026).
function clientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

// Один ответ на любую ошибку: не подсказываем, что именно не подошло —
// логин, пароль или код. Иначе подбирать было бы заметно проще.
function invalid() {
  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}

// Есть ли действующая сессия — страница дашборда спрашивает при загрузке,
// показывать ли форму входа.
export async function GET(request: NextRequest) {
  const ok = await verifyDashboardSession(request.cookies.get(DASHBOARD_SESSION_COOKIE)?.value);
  return NextResponse.json({ authenticated: ok }, { status: ok ? 200 : 401 });
}

export async function POST(request: NextRequest) {
  const ip = clientIp(request);
  if (isLockedOut(ip)) {
    return NextResponse.json(
      { error: "Too many attempts, try again in 15 minutes" },
      { status: 429 }
    );
  }

  const credentials = readCredentials();
  if (!credentials) {
    console.error("Dashboard login is not configured: set DASHBOARD_USERNAME, DASHBOARD_PASSWORD_HASH, DASHBOARD_TOTP_SECRET");
    return NextResponse.json({ error: "Dashboard login is not configured" }, { status: 503 });
  }

  let body: { username?: unknown; password?: unknown; code?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
  const username = typeof body.username === "string" ? body.username.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const code = typeof body.code === "string" ? body.code.replace(/\s/g, "") : "";

  // Все три проверки выполняются всегда, даже если первая уже не прошла:
  // по времени ответа не должно быть видно, на каком шаге отказ.
  const userOk = safeEqualStrings(username, credentials.username);
  const passwordOk = verifyPassword(password, credentials.passwordHash);
  const counter = matchTotp(credentials.totpSecret, code);

  if (!userOk || !passwordOk || counter === null || !acceptTotpOnce(counter)) {
    recordFailure(ip);
    return invalid();
  }

  clearFailures(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASHBOARD_SESSION_COOKIE, await createDashboardSession(credentials), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    // Strict: cookie не уходит ни с одним запросом, начатым на чужом сайте.
    sameSite: "strict",
    path: "/",
    maxAge: DASHBOARD_SESSION_DAYS * 24 * 60 * 60,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(DASHBOARD_SESSION_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
