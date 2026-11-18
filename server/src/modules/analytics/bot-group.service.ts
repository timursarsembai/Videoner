import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// Учёт групп, куда добавлен бот (раздел «Группы» дашборда). Списка своих
// чатов Telegram боту не даёт — бот сам сообщает о событиях
// (bot/src/group-tracking.ts):
//   added    — бота добавили (my_chat_member), с тем, кто добавил;
//   removed  — бота удалили;
//   seen     — в группе прислали ссылку: так в список попадают и группы,
//              куда бота добавили до появления учёта (18.11.2026);
//   download — бот прислал в группу видео;
//   migrated — группа стала супергруппой, у чата новый номер (toChatId).
export const BOT_GROUP_EVENTS = ['added', 'removed', 'seen', 'download', 'migrated'] as const;
export type BotGroupEvent = (typeof BOT_GROUP_EVENTS)[number];

export type BotGroupEventInput = {
  chatId: number;
  event: BotGroupEvent;
  title?: string;
  username?: string;
  type?: string;
  members?: number;
  addedById?: number;
  toChatId?: number;
};

const isGroupId = (v: unknown): v is number => Number.isSafeInteger(v) && (v as number) < 0;
const isUserId = (v: unknown): v is number => Number.isSafeInteger(v) && (v as number) > 0;
const text = (v: unknown, max: number): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim().slice(0, max) : undefined;

// Проверка тела запроса от бота: всё лишнее и кривое отбрасываем.
export function parseBotGroupEvent(body: Record<string, unknown> | null | undefined): BotGroupEventInput {
  const event = body?.event;
  if (!isGroupId(body?.chatId) || !BOT_GROUP_EVENTS.includes(event as BotGroupEvent)) {
    throw new BadRequestException('chatId (negative) and event are required');
  }
  if (event === 'migrated' && !isGroupId(body?.toChatId)) throw new BadRequestException('toChatId is required');
  const username = text(body?.username, 64);
  return {
    chatId: body!.chatId as number,
    event: event as BotGroupEvent,
    title: text(body?.title, 256),
    username: username && /^[A-Za-z0-9_]{3,64}$/.test(username) ? username : undefined,
    type: body?.type === 'group' || body?.type === 'supergroup' ? body.type : undefined,
    members: Number.isSafeInteger(body?.members) && (body!.members as number) >= 0 ? (body!.members as number) : undefined,
    addedById: isUserId(body?.addedById) ? (body!.addedById as number) : undefined,
    toChatId: isGroupId(body?.toChatId) ? (body!.toChatId as number) : undefined,
  };
}

@Injectable()
export class BotGroupService {
  constructor(private prisma: PrismaService) {}

  async record(e: BotGroupEventInput): Promise<void> {
    const chatId = BigInt(e.chatId);
    const now = new Date();
    if (e.event === 'migrated') return this.migrate(chatId, BigInt(e.toChatId!), now);

    // Опоздавшее событие старой группы, которая уже стала супергруппой, —
    // не воскрешаем её отдельной строкой (её история уже у нового номера).
    const moved = await this.prisma.botGroup.findFirst({ where: { chatId, migratedTo: { not: null } }, select: { chatId: true } });
    if (moved) return;

    // Что известно о самой группе — обновляем при любом событии.
    const about = {
      ...(e.title !== undefined ? { title: e.title } : {}),
      // Имя бывает убрано (группу сделали закрытой) — тогда приходит без него,
      // но только у событий, где бот видел чат целиком.
      ...(e.event !== 'download' && e.event !== 'removed' ? { username: e.username ?? null } : {}),
      ...(e.type !== undefined ? { type: e.type } : {}),
      ...(e.members !== undefined ? { members: e.members, membersAt: now } : {}),
    };
    const change =
      e.event === 'added'
        ? { addedAt: now, removedAt: null, ...(e.addedById ? { addedById: BigInt(e.addedById) } : {}) }
        : e.event === 'removed'
          ? { removedAt: now }
          : e.event === 'seen'
            ? { lastLinkAt: now, removedAt: null }
            : { lastDownloadAt: now, removedAt: null };
    await this.prisma.botGroup.upsert({
      where: { chatId },
      create: { chatId, ...about, ...change, ...(e.event === 'download' ? { downloads: 1 } : {}) },
      update: { ...about, ...change, ...(e.event === 'download' ? { downloads: { increment: 1 } } : {}) },
    });
  }

  // Группа стала супергруппой: у чата новый номер. Старую строку не двигаем
  // (смена ключа гонялась бы с событиями нового номера), а помечаем
  // migratedTo и сливаем её историю в строку нового номера: счётчик видео
  // складываем, даты берём самые ранние/поздние, недостающее — из старой.
  private async migrate(from: bigint, to: bigint, now: Date): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const old = await tx.botGroup.findUnique({ where: { chatId: from } });
      if (!old || old.migratedTo !== null) return;
      await tx.botGroup.update({ where: { chatId: from }, data: { migratedTo: to, removedAt: now } });
      const cur = await tx.botGroup.findUnique({ where: { chatId: to } });
      const earliest = (a: Date | null, b: Date | null) => (a && b ? (a < b ? a : b) : (a ?? b));
      const latest = (a: Date | null, b: Date | null) => (a && b ? (a > b ? a : b) : (a ?? b));
      const merged = {
        title: cur?.title ?? old.title,
        username: cur?.username ?? old.username,
        type: 'supergroup',
        addedById: cur?.addedById ?? old.addedById,
        addedAt: earliest(cur?.addedAt ?? null, old.addedAt),
        members: cur?.members ?? old.members,
        membersAt: cur?.membersAt ?? old.membersAt,
        lastLinkAt: latest(cur?.lastLinkAt ?? null, old.lastLinkAt),
        lastDownloadAt: latest(cur?.lastDownloadAt ?? null, old.lastDownloadAt),
        firstSeenAt: earliest(cur?.firstSeenAt ?? null, old.firstSeenAt)!,
        // Бот в супергруппе — раз Telegram сообщил о переезде из неё же.
        removedAt: cur?.removedAt ?? null,
      };
      await tx.botGroup.upsert({
        where: { chatId: to },
        create: { chatId: to, ...merged, downloads: old.downloads },
        update: { ...merged, downloads: { increment: old.downloads } },
      });
    });
  }

  // Для дашборда: сводка по всем группам и список, свежие сверху.
  // «Последняя активность» — здесь и только здесь (её же сортирует дашборд).
  async list() {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const [summary] = await this.prisma.$queryRaw<
      { total: bigint; present: bigint; active_week: bigint; downloads: bigint | null }[]
    >`
      SELECT count(*) AS total,
             count(*) FILTER (WHERE "removedAt" IS NULL) AS present,
             count(*) FILTER (WHERE "removedAt" IS NULL
               AND GREATEST("lastLinkAt", "lastDownloadAt", "addedAt") > ${weekAgo}) AS active_week,
             sum("downloads") AS downloads
      FROM "BotGroup" WHERE "migratedTo" IS NULL`;
    const rows = await this.prisma.$queryRaw<
      {
        chatId: bigint; title: string | null; username: string | null; type: string | null;
        addedById: bigint | null; addedAt: Date | null; removedAt: Date | null; members: number | null;
        downloads: number; lastActivityAt: Date | null; firstSeenAt: Date;
      }[]
    >`
      SELECT "chatId", "title", "username", "type", "addedById", "addedAt", "removedAt", "members",
             "downloads", GREATEST("lastLinkAt", "lastDownloadAt", "addedAt") AS "lastActivityAt", "firstSeenAt"
      FROM "BotGroup" WHERE "migratedTo" IS NULL
      ORDER BY "lastActivityAt" DESC NULLS LAST, "firstSeenAt" DESC
      LIMIT 2000`;
    return {
      total: Number(summary?.total ?? 0),
      present: Number(summary?.present ?? 0),
      activeWeek: Number(summary?.active_week ?? 0),
      downloads: Number(summary?.downloads ?? 0),
      groups: rows.map((r) => ({
        chatId: r.chatId.toString(),
        title: r.title,
        username: r.username,
        type: r.type,
        addedById: r.addedById?.toString() ?? null,
        addedAt: r.addedAt,
        removedAt: r.removedAt,
        members: r.members,
        downloads: r.downloads,
        lastActivityAt: r.lastActivityAt,
        firstSeenAt: r.firstSeenAt,
      })),
    };
  }
}
