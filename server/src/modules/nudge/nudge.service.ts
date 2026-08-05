import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';

// Один раз пишет человеку, который запустил бота и за 48 часов не прислал ни
// одной ссылки. Это ПОДСКАЗКА, а не опрос: такие люди отваливаются до первого
// действия, спрашивать «что не понравилось» бессмысленно — не понравиться ещё
// нечему. Поэтому в тексте пример ссылки и явное «больше не побеспокою».
//
// Почему так осторожно: массовые непрошеные сообщения — ровно тот шаблон, за
// который в Telegram жмут «Пожаловаться на спам», а после нескольких жалоб
// боту режут рассылку. Отсюда три ограничения: строго одно сообщение на
// человека за всё время, только дневное окно и потолок на запуск.
@Injectable()
export class NudgeService {
  private readonly logger = new Logger(NudgeService.name);

  // Все пороги вынесены в переменные окружения со значениями по умолчанию,
  // равными боевым: так их можно подкрутить без пересборки образа и, главное,
  // прогнать весь сценарий на отдельном контейнере против staging-БД, не
  // дожидаясь дневного окна. Проверять рассылку живым людям «на глаз» нельзя.
  private readonly SILENCE_HOURS = this.envInt('NUDGE_SILENCE_HOURS', 48);
  // Окно отправки в UTC. Сервер живёт в UTC, аудитория в основном русскоязычная
  // (Алматы, UTC+5), поэтому 06:00–15:00 UTC = 11:00–20:00 по Алматы. Ночью не
  // пишем: сообщение от незнакомого бота в три часа ночи — самый быстрый путь
  // в блок.
  private readonly WINDOW_START_UTC = this.envInt('NUDGE_WINDOW_START_UTC', 6);
  private readonly WINDOW_END_UTC = this.envInt('NUDGE_WINDOW_END_UTC', 15);
  // Потолок на один запуск. Страхует от единственного по-настоящему опасного
  // сценария: ошибка в условии выборки и веерная рассылка всей базе разом.
  private readonly MAX_PER_RUN = this.envInt('NUDGE_MAX_PER_RUN', 20);
  // Пауза между отправками, чтобы не упереться в лимиты Telegram.
  private readonly SEND_DELAY_MS = 400;

  constructor(private prisma: PrismaService) {}

  private envInt(name: string, fallback: number): number {
    const parsed = Number(process.env[name]);
    return Number.isFinite(parsed) ? parsed : fallback;
  }

  // Расписание тоже из окружения (по умолчанию раз в час) — нужно, чтобы в
  // тестовом прогоне поставить «каждую минуту» и увидеть не только отправку,
  // но и то, что на следующем тике повторного сообщения НЕ уходит.
  @Cron(process.env.NUDGE_CRON || CronExpression.EVERY_HOUR)
  async sendNudges() {
    // Выключатель. По умолчанию ВЫКЛЮЧЕНО и включается только в
    // docker-compose.prod.yml — иначе staging-контур, у которого свой БД, но
    // тот же BOT_TOKEN, писал бы тем же живым людям второй раз.
    if (process.env.NUDGE_ENABLED !== 'true') {
      return;
    }

    const hourUtc = new Date().getUTCHours();
    if (hourUtc < this.WINDOW_START_UTC || hourUtc >= this.WINDOW_END_UTC) {
      return;
    }

    const cutoff = new Date(Date.now() - this.SILENCE_HOURS * 60 * 60 * 1000);

    // downloads: { none: {} } — ни одной загрузки вообще, включая упавшие:
    // если человек пробовал и у него не вышло, ему нужна не подсказка, а
    // разбор, и такой случай лучше видеть руками.
    const users = await this.prisma.botUser.findMany({
      where: {
        firstSeenAt: { lte: cutoff },
        nudgeSentAt: null,
        downloads: { none: {} },
      },
      orderBy: { firstSeenAt: 'asc' },
      take: this.MAX_PER_RUN,
    });

    if (users.length === 0) {
      return;
    }

    this.logger.log(`Подсказка после ${this.SILENCE_HOURS}ч молчания: кандидатов ${users.length}`);

    let sent = 0;
    for (const user of users) {
      const text = this.textFor(user.languageCode);
      const result = await this.send(user.telegramId, text);

      if (result === 'retry') {
        // Сеть или лимит Telegram — не помечаем, вернёмся через час.
        this.logger.warn(`Отложил подсказку для ${user.telegramId}, попробую позже`);
        break;
      }

      // 'sent' и 'blocked' помечаем одинаково: если человек заблокировал бота,
      // повторять попытку бессмысленно и вредно.
      await this.prisma.botUser.update({
        where: { id: user.id },
        data: { nudgeSentAt: new Date() },
      });
      if (result === 'sent') {
        sent++;
      }

      await new Promise((resolve) => setTimeout(resolve, this.SEND_DELAY_MS));
    }

    this.logger.log(`Подсказка отправлена: ${sent} из ${users.length}`);
  }

  private textFor(languageCode: string | null): string {
    const isRu = languageCode?.toLowerCase().startsWith('ru') ?? false;

    if (isRu) {
      return (
        'Здравствуйте! Вы запускали этого бота, но пока ничего не скачали — ' +
        'возможно, было непонятно, с чего начать.\n\n' +
        'Всё делается в одно действие: пришлите сюда ссылку на видео, ' +
        'например https://youtube.com/watch?v=dQw4w9WgXcQ — и я верну готовый ' +
        'файл примерно за полминуты.\n\n' +
        'Работают YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
        'Rutube, OK.ru и Pinterest. Бесплатно — до 10 видео в сутки.\n\n' +
        'Если что-то не сработает, просто напишите об этом в ответ. Это ' +
        'единственное напоминание, больше не побеспокою.'
      );
    }

    return (
      "Hi! You started this bot but haven't downloaded anything yet — maybe it " +
      "wasn't clear where to begin.\n\n" +
      'It takes one step: send me a link to a video, for example ' +
      'https://youtube.com/watch?v=dQw4w9WgXcQ — and I’ll send the file back in ' +
      'about half a minute.\n\n' +
      'Works with YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, VK, ' +
      'Rutube, OK.ru and Pinterest. Free — up to 10 videos a day.\n\n' +
      'If something goes wrong, just reply here. This is the only reminder — ' +
      "I won't message you again."
    );
  }

  private async send(
    telegramId: bigint,
    text: string,
  ): Promise<'sent' | 'blocked' | 'retry'> {
    const token = process.env.BOT_TOKEN;
    if (!token) {
      this.logger.warn('Не настроен BOT_TOKEN — подсказка не отправлена');
      return 'retry';
    }

    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: telegramId.toString(),
          text,
          // Ссылка в тексте — пример, а не то, что человек должен открыть:
          // превью только отвлекало бы от смысла сообщения.
          disable_web_page_preview: true,
        }),
      });

      if (res.ok) {
        return 'sent';
      }

      const body = await res.text();
      // 403 — заблокировал бота; 400 с "chat not found" — удалил аккаунт.
      // И то и другое означает «больше не пытаться».
      if (res.status === 403 || (res.status === 400 && body.includes('chat not found'))) {
        this.logger.log(`${telegramId}: бот заблокирован или чат недоступен — помечаю, чтобы не повторять`);
        return 'blocked';
      }

      this.logger.error(`Telegram отклонил подсказку для ${telegramId}: ${res.status} ${body.slice(0, 200)}`);
      return 'retry';
    } catch (error) {
      this.logger.error(`Ошибка отправки подсказки для ${telegramId}:`, error);
      return 'retry';
    }
  }
}
