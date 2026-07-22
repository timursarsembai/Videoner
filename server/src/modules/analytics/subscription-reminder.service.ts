import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BotUserService } from './bot-user.service';

const REMINDER_DAYS_BEFORE_EXPIRY = 3;
const DAY_MS = 24 * 60 * 60 * 1000;

// Годовая подписка (в отличие от месячной) не автопродляется — Telegram Stars
// поддерживает автосписание только с фиксированным периодом 30 дней (см.
// память security-audit/подписки). Раз в день шлём напоминание тем, у кого
// годовая подписка истекает через REMINDER_DAYS_BEFORE_EXPIRY дней, чтобы
// они успели продлить вручную через /subscribe.
@Injectable()
export class SubscriptionReminderService {
  private readonly logger = new Logger(SubscriptionReminderService.name);

  constructor(private readonly botUser: BotUserService) {}

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  async remindExpiringYearlySubscriptions() {
    const token = process.env.BOT_TOKEN;
    if (!token) return;

    const from = new Date(Date.now() + REMINDER_DAYS_BEFORE_EXPIRY * DAY_MS);
    const to = new Date(from.getTime() + DAY_MS);

    const expiring = await this.botUser.findYearlySubscriptionsExpiringBetween(from, to);

    for (const user of expiring) {
      const isRu = user.languageCode?.toLowerCase().startsWith('ru');
      const dateStr = user.subscriptionUntil!.toLocaleDateString(isRu ? 'ru-RU' : 'en-US');
      const text = isRu
        ? `⏳ Твоя годовая подписка Videoner заканчивается ${dateStr}. Чтобы не потерять безлимитный доступ, оформи новую через /subscribe — она не продлевается автоматически.`
        : `⏳ Your Videoner yearly subscription ends on ${dateStr}. It doesn't auto-renew — use /subscribe to buy a new one and keep unlimited access.`;

      try {
        const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: user.telegramId.toString(), text }),
        });
        if (!res.ok) {
          this.logger.error(
            `Не удалось отправить напоминание о подписке ${user.telegramId}: ${res.status} ${await res.text()}`,
          );
        }
      } catch (error) {
        this.logger.error(`Ошибка отправки напоминания о подписке ${user.telegramId}:`, error);
      }
    }
  }
}
