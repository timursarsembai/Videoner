import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

// Кто из пользователей бота подписан на канал новостей — для столбца «В
// канале» на дашборде. Список подписчиков Bot API не отдаёт, зато бот — админ
// канала и может спросить про конкретного человека (getChatMember). Поэтому
// раз в сутки обходим всех пользователей бота и запоминаем ответ
// (BotUser.inChannel). Только чтение: никому ничего не пишем.
const CHANNEL = '@videonerdownload';
const MEMBER = new Set(['creator', 'administrator', 'member']);
// ~10 запросов в секунду — далеко от лимитов Telegram; 700 человек — пара минут.
const DELAY_MS = 100;
// Столько ошибок подряд — значит, не в человеке дело (бота сняли с админов,
// нет сети): бросаем обход, прежние ответы остаются.
const MAX_ERRORS_IN_ROW = 20;
const STALE_MS = 20 * 60 * 60 * 1000;

@Injectable()
export class ChannelMembershipService implements OnApplicationBootstrap {
  private readonly logger = new Logger(ChannelMembershipService.name);
  private running = false;

  constructor(private prisma: PrismaService) {}

  // Включено только в docker-compose.prod.yml: у staging тот же BOT_TOKEN.
  private enabled(): boolean {
    return process.env.CHANNEL_CHECK_ENABLED === 'true' && !!process.env.BOT_TOKEN;
  }

  // После выкладки — не ждать ночи, если кого-то не проверяли больше суток
  // (в первый раз — сразу заполнить столбец; прерванный обход — доделать).
  onApplicationBootstrap() {
    if (!this.enabled()) return;
    setTimeout(() => {
      void this.prisma.botUser
        .findFirst({
          where: {
            OR: [{ inChannelCheckedAt: null }, { inChannelCheckedAt: { lt: new Date(Date.now() - STALE_MS) } }],
          },
          select: { id: true },
        })
        .then((stale) => (stale ? this.checkAll() : undefined))
        .catch((e) => this.logger.error(`Проверка подписок не запустилась: ${e?.message ?? e}`));
    }, 60_000).unref();
  }

  // 03:30 по Алматы.
  @Cron('30 22 * * *')
  async checkAll() {
    const token = process.env.BOT_TOKEN;
    if (!token || !this.enabled() || this.running) return;
    this.running = true;
    try {
      const users = await this.prisma.botUser.findMany({ select: { id: true, telegramId: true } });
      let members = 0;
      let errors = 0;
      let errorsInRow = 0;
      let checked = 0;
      for (const u of users) {
        const result = await this.isMember(token, u.telegramId);
        if (typeof result === 'string') {
          errors++;
          if (++errorsInRow >= MAX_ERRORS_IN_ROW) {
            this.logger.warn(
              `Проверка подписок прервана: ${errorsInRow} ошибок подряд (последняя: ${result}); ` +
                `проверено ${checked} из ${users.length}, в канале ${members}`,
            );
            return;
          }
        } else {
          errorsInRow = 0;
          checked++;
          if (result) members++;
          await this.prisma.botUser.update({
            where: { id: u.id },
            data: { inChannel: result, inChannelCheckedAt: new Date() },
          });
        }
        await new Promise((r) => setTimeout(r, DELAY_MS));
      }
      this.logger.log(`Подписки на канал: в канале ${members} из ${users.length}, не проверено ${errors}`);
    } finally {
      this.running = false;
    }
  }

  // true/false — ответ Telegram; строка — проверить не удалось (причина для лога).
  private async isMember(token: string, telegramId: bigint): Promise<boolean | string> {
    let error = 'нет ответа';
    for (let attempt = 0; attempt < 3; attempt++) {
      if (attempt > 0) await new Promise((r) => setTimeout(r, 2000));
      try {
        const res = await fetch(
          `https://api.telegram.org/bot${token}/getChatMember?chat_id=${encodeURIComponent(CHANNEL)}&user_id=${telegramId}`,
          { signal: AbortSignal.timeout(10_000) },
        );
        const body = (await res.json()) as {
          ok: boolean;
          result?: { status: string; is_member?: boolean };
          error_code?: number;
          description?: string;
          parameters?: { retry_after?: number };
        };
        if (body.ok && body.result) {
          const { status, is_member } = body.result;
          return MEMBER.has(status) || (status === 'restricted' && is_member === true);
        }
        error = `${body.error_code ?? res.status} ${body.description ?? ''}`.trim();
        if (body.error_code === 429) {
          await new Promise((r) => setTimeout(r, ((body.parameters?.retry_after ?? 5) + 1) * 1000));
          continue;
        }
        // Удалённый аккаунт и т. п.: Telegram не знает такого участника — не в канале.
        if (body.error_code === 400 && /user not found|PARTICIPANT_ID_INVALID/i.test(body.description ?? '')) {
          return false;
        }
        // Прочие ответы Telegram (нет прав в канале, неверный токен) повтор не исправит.
        if (body.error_code !== undefined && body.error_code < 500) return error;
      } catch (e) {
        // Сеть, таймаут, HTML вместо JSON при 5xx — пробуем ещё раз.
        error = e instanceof Error ? e.message : String(e);
      }
    }
    return error;
  }
}
