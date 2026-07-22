import { NextResponse } from "next/server";
import axios from "axios";
import { getSessionTelegramId } from "@/lib/auth/session";

const API_URL = process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_URL!;
const API_KEY = process.env.API_KEY!;

// Возвращает текущий статус подписки для сессии сайта (или { user: null },
// если не залогинен). Сессия уже подтверждает личность — доверия к подписи
// Telegram заново не требуется, просто читаем свежие данные по telegramId.
export async function GET() {
  const telegramId = await getSessionTelegramId();
  if (!telegramId || !API_KEY) {
    return NextResponse.json({ user: null });
  }

  try {
    const response = await axios.get(`${API_URL}/bot-users/${telegramId}/subscription`, {
      headers: { "X-API-Key": API_KEY, host: new URL(API_URL).host },
      validateStatus: () => true,
    });

    if (response.status !== 200) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user: response.data });
  } catch (error) {
    console.error("Auth me proxy error:", error);
    return NextResponse.json({ user: null });
  }
}
