import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DownloadStatus } from '@prisma/client';
import { SURVEY_PROMOS, SURVEYS, surveyRepeatKey, surveyShowKey, toggleChoice } from 'src/lib/surveys';

// Подсказки после скачивания: с какого удачного скачивания и как часто.
export const PROMO_MIN_DOWNLOADS = 3;
export const PROMO_INTERVAL_MS = 24 * 60 * 60 * 1000;
// Важные новости: показываем первыми и уже с первого удачного скачивания
// (решение владельца 17.11.2026 — про Reddit должны узнать все).
// Опрос о расшифровке видео (23.11.2026) — впереди всех: важен каждый ответ
// активного человека, а сам опрос — одно нажатие.
export const PROMO_PRIORITY = ['survey', 'reddit'];

export interface UpsertBotUserInput {
  telegramId: number;
  username?: string;
  firstName?: string;
  languageCode?: string;
  // true только из telegramLogin (вход на сайте) — отдельно от обычного
  // upsert'а в боте, который вызывается на каждое сообщение и не должен
  // считаться "заходом на сайт".
  markWebLogin?: boolean;
}

// Профиль, который отдаётся сайту после входа через Telegram Login Widget.
// Раньше назывался SubscriptionStatus и нёс даты подписки — платных функций
// больше нет, остался только признак ручного админского безлимита.
export interface BotUserProfile {
  telegramId: string;
  username: string | null;
  firstName: string | null;
  isUnlimited: boolean;
}

@Injectable()
export class BotUserService {
  constructor(private prisma: PrismaService) {}

  async upsertBotUser(data: UpsertBotUserInput) {
    const telegramId = BigInt(data.telegramId);
    const webLogin = data.markWebLogin ? { lastWebLoginAt: new Date() } : {};
    const botUser = await this.prisma.botUser.upsert({
      where: { telegramId },
      create: {
        telegramId,
        username: data.username,
        firstName: data.firstName,
        languageCode: data.languageCode,
        ...webLogin,
      },
      update: {
        username: data.username,
        firstName: data.firstName,
        languageCode: data.languageCode,
        lastSeenAt: new Date(),
        ...webLogin,
      },
    });
    await this.recordActivityDay(botUser.id);
    // Блокировку здесь не снимаем: сюда приходят и запросы сайта, а человек,
    // заблокировавший бота, может пользоваться сайтом. О разблокировке Telegram
    // сообщает боту сам (setBlocked).
    return botUser;
  }

  async getLanguage(telegramId: number): Promise<string | null> {
    const row = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: { language: true },
    });
    return row?.language ?? null;
  }

  // Выбор языка приходит из бота, когда человек ему уже писал, но запись
  // могла ещё не появиться (её создаёт первое скачивание) — поэтому upsert.
  async setLanguage(telegramId: number, language: string | null) {
    await this.prisma.botUser.upsert({
      where: { telegramId: BigInt(telegramId) },
      create: { telegramId: BigInt(telegramId), language },
      update: { language },
    });
  }

  async getInstantVideo(telegramId: number): Promise<boolean> {
    const row = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: { instantVideo: true },
    });
    return row?.instantVideo ?? false;
  }

  // upsert — по той же причине, что и у языка.
  async setInstantVideo(telegramId: number, instantVideo: boolean) {
    await this.prisma.botUser.upsert({
      where: { telegramId: BigInt(telegramId) },
      create: { telegramId: BigInt(telegramId), instantVideo },
      update: { instantVideo },
    });
  }

  // Какую подсказку о Videoner показать после этого скачивания (бот,
  // bot/src/promo.ts). keys — подсказки, которые бот умеет показывать.
  // null — сейчас ничего: меньше PROMO_MIN_DOWNLOADS удачных скачиваний,
  // подсказка уже была за последние сутки или все уже видел. Выбранная
  // сразу записывается как показанная: бот отправляет её следом, а повторный
  // вызов (две ссылки подряд) не должен выдать вторую в те же сутки.
  // Подсказку про расширение не показываем тем, у кого оно есть
  // (extensionLinkedAt); про канал бот убирает её сам — подписан ли
  // человек, знает только Telegram.
  async nextPromo(telegramId: number, keys: string[], rnd: () => number = Math.random): Promise<string | null> {
    const found = await this.promoCandidates(telegramId, keys);
    if (!found) return null;
    const { botUserId, fresh, since, showKeys } = found;
    const priority = fresh.filter((k) => PROMO_PRIORITY.includes(k));
    const key = priority.length ? priority[0] : fresh[Math.floor(rnd() * fresh.length)];
    const showKey = showKeys[key] ?? key;
    // Проверка «не было за сутки» и запись — под блокировкой на человека:
    // два одновременных вызова (две ссылки подряд) иначе оба не увидели бы
    // чужую ещё не закоммиченную запись и выдали бы две разные подсказки.
    const inserted = await this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${'promo:' + botUserId}))`;
      return tx.$executeRaw`
        INSERT INTO "PromoShow" ("id", "botUserId", "key", "shownAt")
        SELECT gen_random_uuid()::text, ${botUserId}, ${showKey}, now()
        WHERE NOT EXISTS (
          SELECT 1 FROM "PromoShow" WHERE "botUserId" = ${botUserId} AND ("shownAt" > ${since} OR "key" = ${showKey})
        )
        ON CONFLICT DO NOTHING`;
    });
    return inserted === 1 ? key : null;
  }

  // Какие из keys человеку можно показать сейчас — без записи о показе. Бот
  // спрашивает это первым и проверяет подписку на канал у Telegram, только
  // если подсказка про канал среди подходящих (bot/src/promo.ts).
  async promoCandidates(
    telegramId: number,
    keys: string[],
  ): Promise<{ botUserId: string; fresh: string[]; since: Date; showKeys: Record<string, string> } | null> {
    const botUser = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: { id: true, blockedAt: true, extensionLinkedAt: true },
    });
    if (!botUser || botUser.blockedAt) return null;
    if (botUser.extensionLinkedAt) keys = keys.filter((k) => k !== 'extension');
    const since = new Date(Date.now() - PROMO_INTERVAL_MS);
    const [successful, shows] = await Promise.all([
      this.prisma.download.count({
        where: { botUserId: botUser.id, status: { in: [DownloadStatus.COMPLETED, DownloadStatus.EXPIRED] } },
      }),
      this.prisma.promoShow.findMany({ where: { botUserId: botUser.id }, select: { key: true, shownAt: true } }),
    ]);
    if (successful < 1) return null;
    if (successful < PROMO_MIN_DOWNLOADS) keys = keys.filter((k) => PROMO_PRIORITY.includes(k));
    if (shows.some((s) => s.shownAt > since)) return null;
    const seen = new Set(shows.map((s) => s.key));
    // Опросы — по своим правилам (surveyShowKey); под каким ключом записать
    // показ — в showKeys.
    const showKeys: Record<string, string> = {};
    const surveyKeys = keys.filter((k) => SURVEY_PROMOS[k]);
    if (surveyKeys.length) {
      const answers = await this.prisma.surveyAnswer.findMany({
        where: { botUserId: botUser.id },
        select: { survey: true, choices: true },
      });
      const answered = new Set(answers.filter((a) => a.choices.length).map((a) => a.survey));
      for (const k of surveyKeys) {
        const showKey = surveyShowKey(k, shows, answered.has(SURVEY_PROMOS[k]));
        if (showKey) showKeys[k] = showKey;
      }
    }
    const fresh = keys.filter((k) => (SURVEY_PROMOS[k] ? !!showKeys[k] : !seen.has(k)));
    if (!fresh.length) return null;
    return { botUserId: botUser.id, fresh, since, showKeys };
  }

  // Опрос в боте (lib/surveys.ts): нажатие на вариант. Под блокировкой на
  // человека — два быстрых нажатия иначе затёрли бы друг друга. null —
  // человек боту незнаком.
  async surveyToggle(telegramId: number, survey: string, option: string): Promise<string[] | null> {
    return this.surveyUpdate(telegramId, survey, (choices) => ({ choices: toggleChoice(survey, choices, option) }));
  }

  // «Готово»: отмечаем, что человек закончил. Без отметок не закрываем.
  async surveyDone(telegramId: number, survey: string): Promise<string[] | null> {
    return this.surveyUpdate(telegramId, survey, (choices) => (choices.length ? { choices, done: true } : { choices }));
  }

  private async surveyUpdate(
    telegramId: number,
    survey: string,
    change: (choices: string[]) => { choices: string[]; done?: boolean },
  ): Promise<string[] | null> {
    if (!SURVEYS[survey]) return null;
    const botUser = await this.prisma.botUser.findUnique({ where: { telegramId: BigInt(telegramId) }, select: { id: true } });
    if (!botUser) return null;
    return this.prisma.$transaction(async (tx) => {
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${'survey:' + botUser.id}))`;
      const prev = await tx.surveyAnswer.findUnique({ where: { botUserId_survey: { botUserId: botUser.id, survey } } });
      const next = change(prev?.choices ?? []);
      await tx.surveyAnswer.upsert({
        where: { botUserId_survey: { botUserId: botUser.id, survey } },
        create: { botUserId: botUser.id, survey, choices: next.choices, done: !!next.done },
        update: { choices: next.choices, ...(next.done ? { done: true } : {}) },
      });
      return next.choices;
    });
  }

  // Итоги опроса для дашборда: скольким показан, сколько ответили и что
  // выбрали — всего и по языкам.
  async surveyStats(survey: string) {
    const def = SURVEYS[survey];
    if (!def) return null;
    const [shown, rows] = await Promise.all([
      this.prisma.promoShow.count({ where: { key: 'survey' } }),
      this.prisma.surveyAnswer.findMany({
        where: { survey },
        select: { choices: true, done: true, botUser: { select: { language: true, languageCode: true } } },
      }),
    ]);
    const answered = rows.filter((r) => r.choices.length);
    const count = (list: typeof answered) => Object.fromEntries(def.options.map((o) => [o, list.filter((r) => r.choices.includes(o)).length]));
    const langOf = (r: (typeof rows)[number]) => r.botUser.language ?? r.botUser.languageCode?.slice(0, 2) ?? '?';
    const langs = [...new Set(answered.map(langOf))];
    return {
      survey,
      options: def.options,
      shown,
      answered: answered.length,
      done: rows.filter((r) => r.done).length,
      totals: count(answered),
      byLang: langs
        .map((lang) => {
          const list = answered.filter((r) => langOf(r) === lang);
          return { lang, answered: list.length, totals: count(list) };
        })
        .sort((a, b) => b.answered - a.answered),
    };
  }

  // Бот не смог отправить выданную подсказку (лимит Telegram, сеть) —
  // снимаем запись: иначе подсказка пропала бы, на сутки закрыла бы другие и
  // попала бы в статистику дашборда как показанная.
  async promoFailed(telegramId: number, key: string) {
    await this.prisma.promoShow.deleteMany({
      where: { key: { in: [key, surveyRepeatKey(key)] }, botUser: { telegramId: BigInt(telegramId) }, shownAt: { gt: new Date(Date.now() - 10 * 60 * 1000) } },
    });
  }

  // Человек заблокировал бота или разблокировал его. Событие для графиков
  // пишется только при смене состояния: Telegram может прислать то же самое
  // повторно. Смена и проверка — одним условным update, чтобы два
  // одновременных вызова не записали два события. Незнакомых боту людей
  // пропускаем: статистика — только по тем, кого мы уже видели.
  async setBlocked(telegramId: number | string, blocked: boolean, source: string) {
    try {
      const at = new Date();
      await this.prisma.$transaction(async (tx) => {
        const botUser = await tx.botUser.findUnique({
          where: { telegramId: BigInt(telegramId) },
          select: { id: true },
        });
        if (!botUser) return;
        const changed = await tx.botUser.updateMany({
          where: { id: botUser.id, blockedAt: blocked ? null : { not: null } },
          data: { blockedAt: blocked ? at : null },
        });
        if (changed.count !== 1) return;
        await tx.botBlockEvent.create({
          data: { botUserId: botUser.id, blocked, source, at },
        });
      });
    } catch (e) {
      console.error(`Failed to record block state for BotUser ${telegramId}:`, e);
    }
  }

  // День активности для графиков MAU (см. модель UserActivityDay). Сбой
  // записи только в лог: из-за статистики скачивание ломаться не должно.
  private async recordActivityDay(botUserId: string) {
    const now = new Date();
    const day = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    try {
      await this.prisma.userActivityDay.createMany({
        data: [{ botUserId, day }],
        skipDuplicates: true,
      });
    } catch (e) {
      console.error(`Failed to record activity day for BotUser ${botUserId}:`, e);
    }
  }

  // Профиль для входа на сайт через Telegram Login Widget
  // (см. bot-user.controller.ts).
  async getProfile(telegramId: number): Promise<BotUserProfile | null> {
    const botUser = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });
    if (!botUser) return null;

    return {
      telegramId: botUser.telegramId.toString(),
      username: botUser.username,
      firstName: botUser.firstName,
      isUnlimited: botUser.isUnlimited,
    };
  }

  // Ручной админский грант через /grant, без срока. Купить его нельзя —
  // платных функций в сервисе нет.
  async isUnlimited(telegramId: number): Promise<boolean> {
    const botUser = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
      select: { isUnlimited: true },
    });
    return botUser?.isUnlimited ?? false;
  }

  // Пользователь должен хотя бы раз написать боту (BotUser создаётся через
  // upsertBotUser), поэтому здесь только update — без create.
  async setUnlimited(
    target: { telegramId?: number; username?: string },
    isUnlimited: boolean,
  ) {
    const botUser = target.telegramId
      ? await this.prisma.botUser.findUnique({
          where: { telegramId: BigInt(target.telegramId) },
        })
      : await this.prisma.botUser.findFirst({
          where: { username: { equals: target.username, mode: 'insensitive' } },
        });
    if (!botUser) return null;

    return this.prisma.botUser.update({
      where: { id: botUser.id },
      data: { isUnlimited },
    });
  }

  // Считаем только успешно завершённые скачивания за последние 24ч —
  // неудачные попытки (битая ссылка и т.п.) не должны съедать лимит пользователя.
  // EXPIRED считаем тоже: CleanupService переводит в него COMPLETED после удаления
  // файла с диска, это не отменяет сам факт скачивания.
  async countDownloadsToday(telegramId: number): Promise<number> {
    const botUser = await this.prisma.botUser.findUnique({
      where: { telegramId: BigInt(telegramId) },
    });
    if (!botUser) return 0;

    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.prisma.download.count({
      where: {
        botUserId: botUser.id,
        status: { in: [DownloadStatus.COMPLETED, DownloadStatus.EXPIRED] },
        createdAt: { gte: since },
      },
    });
  }
}
