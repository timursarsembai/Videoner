import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { createHmac, timingSafeEqual } from 'crypto';

// Запрос именно от бота, а не просто от владельца API-ключа. Ключ API общий у
// бота и сайта (а админ может выдать ключи и другим), поэтому подключённые
// людьми куки (UserCookiesService) по одному ключу отдавать нельзя: иначе
// любой обладатель ключа скачал бы чужое закрытое или увёл чужой вход.
//
// Доказательство — знание токена бота: он есть только у бота и у сервера (у
// сайта его нет, см. docker-compose.prod.yml). Бот шлёт заголовок
// X-Videoner-Bot = HMAC-SHA256(BOT_TOKEN, "videoner-bot-v1") — сам токен по
// сети при этом не ходит (bot/src/helpers.ts api()).
const HEADER = 'x-videoner-bot';

function expected(): Buffer | null {
  const token = process.env.BOT_TOKEN;
  if (!token) return null;
  return Buffer.from(createHmac('sha256', token).update('videoner-bot-v1').digest('hex'));
}

// req — запрос Express; тип намеренно широкий: контроллеры в проекте
// импортируют Request то из express, то из глобальных типов fetch.
export function isBotRequest(req: unknown): boolean {
  const want = expected();
  const got = (req as { headers?: Record<string, unknown> } | null)?.headers?.[HEADER];
  if (!want || typeof got !== 'string') return false;
  const buf = Buffer.from(got);
  return buf.length === want.length && timingSafeEqual(buf, want);
}

@Injectable()
export class BotOnlyGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    if (!isBotRequest(context.switchToHttp().getRequest())) throw new ForbiddenException('Bot only');
    return true;
  }
}
