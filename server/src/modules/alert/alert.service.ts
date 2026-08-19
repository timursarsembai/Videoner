import { Injectable, Logger } from '@nestjs/common';

// Уведомляет админа в Telegram, когда yt-dlp упирается в "Sign in to confirm
// you're not a bot" (YouTube) или в другой признак "нужен логин" (Instagram/
// Facebook/Vimeo) — значит, авторизованные cookies протухли и нужно
// переэкспортировать их вручную (см. README, раздел «Cookies»).
@Injectable()
export class AlertService {
  private readonly logger = new Logger(AlertService.name);
  private readonly lastAlertAt = new Map<string, number>();
  // Не спамим админу при каждом запросе — максимум раз в час на платформу.
  private readonly ALERT_COOLDOWN_MS = 60 * 60 * 1000;

  async notifyYoutubeAuthRequired(rawError: string) {
    const text =
      '⚠️ YouTube требует авторизацию (антибот-защита).\n\n' +
      'yt-dlp получил: "Sign in to confirm you\'re not a bot".\n' +
      'Нужно переэкспортировать server/cookies/<платформа>.txt (см. README) и перезапустить server.\n\n' +
      `Исходная ошибка: ${rawError.slice(0, 300)}`;

    await this.notifyWithCooldown('youtube', text);
  }

  // Instagram/Facebook/Vimeo: авторизованные cookies, похоже, протухли.
  // Сервер уже попробовал (или попробует) fallback без cookies — этот алерт
  // приходит независимо от того, сработал fallback или нет, чтобы админ знал,
  // что cookies пора переэкспортировать.
  async notifyCookiesExpired(platform: string, rawError: string) {
    const text =
      `⚠️ ${platform}: похоже, авторизованные cookies протухли.\n\n` +
      'yt-dlp получил ошибку, похожую на "требуется вход" — сервер попробовал ' +
      'скачать анонимно (может не сработать для приватного контента).\n' +
      'Нужно переэкспортировать server/cookies/<платформа>.txt (см. README) и перезапустить server.\n\n' +
      `Исходная ошибка: ${rawError.slice(0, 300)}`;

    await this.notifyWithCooldown(platform, text);
  }

  // ISP-прокси не отвечает. Шлётся БЕЗ кулдауна, в отличие от алертов выше:
  // ограничитель здесь — само расписание проверки (раз в час), а кулдаун в час
  // поверх часового крона глушил бы каждое второе сообщение (проверка занимает
  // секунды, и соседние тики попадали бы то чуть внутрь окна, то чуть наружу).
  async notifyProxyDown(
    maskedProxyUrl: string,
    probeUrl: string,
    reason: string,
  ) {
    const text =
      '🚨 ISP-прокси не отвечает.\n\n' +
      `Проверка: GET ${probeUrl} через ${maskedProxyUrl}\n` +
      `Причина: ${reason}\n\n` +
      'Пока он лежит, YouTube не работает СОВСЕМ (он ходит через прокси всегда, ' +
      'без попытки напрямую), а Threads не открывается по коротким ссылкам.\n\n' +
      'Чаще всего это закончившаяся аренда. Порядок: купить новый прокси, ' +
      'обновить YOUTUBE_PROXY_URL в Infisical в ОБОИХ окружениях (prod и staging), ' +
      'затем ./scripts/deploy.sh server threads-resolver и ./scripts/deploy-staging.sh server.';

    await this.send(text);
  }

  async notifyProxyRecovered(maskedProxyUrl: string) {
    await this.send(`✅ ISP-прокси снова отвечает (${maskedProxyUrl}).`);
  }

  private async notifyWithCooldown(key: string, text: string) {
    const now = Date.now();
    const lastAt = this.lastAlertAt.get(key) ?? 0;
    if (now - lastAt < this.ALERT_COOLDOWN_MS) {
      return;
    }
    this.lastAlertAt.set(key, now);
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
