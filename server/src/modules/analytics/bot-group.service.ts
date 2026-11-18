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
    if (e.event === 'migrated') return this.migrate(chatId, BigInt(e.toChatId!));

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

  // Новый номер чата после перехода в супергруппу: переносим запись.
  private async migrate(from: bigint, to: bigint): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const old = await tx.botGroup.findUnique({ where: { chatId: from } });
      if (!old) return;
      const existing = await tx.botGroup.findUnique({ where: { chatId: to } });
      if (!existing) {
        await tx.botGroup.update({ where: { chatId: from }, data: { chatId: to, type: 'supergroup' } });
        return;
      }
      await tx.botGroup.update({
        where: { chatId: to },
        data: {
          downloads: { increment: old.downloads },
          addedAt: existing.addedAt ?? old.addedAt,
          addedById: existing.addedById ?? old.addedById,
        },
      });
      await tx.botGroup.delete({ where: { chatId: from } });
    });
  }

  // Для дашборда: сводка и список, свежие сверху.
  async list() {
    const rows = await this.prisma.botGroup.findMany({ take: 1000 });
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const lastActivity = (r: (typeof rows)[number]) =>
      Math.max(r.lastLinkAt?.getTime() ?? 0, r.lastDownloadAt?.getTime() ?? 0, r.addedAt?.getTime() ?? 0);
    rows.sort((a, b) => lastActivity(b) - lastActivity(a));
    return {
      total: rows.length,
      present: rows.filter((r) => !r.removedAt).length,
      activeWeek: rows.filter((r) => !r.removedAt && lastActivity(r) > weekAgo).length,
      downloads: rows.reduce((sum, r) => sum + r.downloads, 0),
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
        lastLinkAt: r.lastLinkAt,
        lastDownloadAt: r.lastDownloadAt,
        firstSeenAt: r.firstSeenAt,
      })),
    };
  }
}
