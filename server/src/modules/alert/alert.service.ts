import { Injectable, Logger } from '@nestjs/common';

// Уведомляет админа в Telegram, когда yt-dlp упирается в "Sign in to confirm
// you're not a bot" — это значит, что cookies для YouTube протухли и нужно
// переэкспортировать их вручную (см. README, раздел «Cookies»).
@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private lastYoutubeAuthAlertAt = 0;
  // Не спамим админу при каждом запросе — максимум раз в час.
  private readonly ALERT_COOLDOWN_MS = 60 * 60 * 1000;

  async notifyYoutubeAuthRequired(rawError: string) {
    const now = Date.now();
    if (now - this.lastYoutubeAuthAlertAt < this.ALERT_COOLDOWN_MS) {
      return;
    }
    this.lastYoutubeAuthAlertAt = now;

    const text =
      '⚠️ YouTube требует авторизацию (антибот-защита).\n\n' +
      'yt-dlp получил: "Sign in to confirm you\'re not a bot".\n' +
      'Нужно переэкспортировать server/cookies.txt и перезапустить server.\n\n' +
      `Исходная ошибка: ${rawError.slice(0, 300)}`;

    await this.send(text);
  }

  private async send(text: string) {
    const token = process.env.BOT_TOKEN;
    const chatId = process.env.ADMIN_CHAT_ID;
    if (!token || !chatId) {
      this.logger.warn(
        'Не настроен BOT_TOKEN/ADMIN_CHAT_ID — алерт в Telegram пропущен',
      );
      return;
    }

    try {
      const res = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: chatId, text }),
        },
      );
      if (!res.ok) {
        this.logger.error(
          `Не удалось отправить алерт в Telegram: ${res.status} ${await res.text()}`,
        );
      }
    } catch (error) {
      this.logger.error('Ошибка отправки алерта в Telegram:', error);
    }
  }
}
