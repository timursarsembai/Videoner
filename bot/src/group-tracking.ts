import type { Api } from "grammy";
import type { Chat } from "grammy/types";
import { api } from "./helpers.js";

// Учёт групп для дашборда (server: BotGroupService, раздел «Группы»).
// Списка своих групп Telegram боту не даёт, поэтому сообщаем серверу:
// добавили, удалили, в группе прислали ссылку, бот прислал видео, группа
// стала супергруппой. Всё в фоне и молча: учёт не должен ни задерживать, ни
// ломать работу в группе.

type GroupChat = Extract<Chat, { type: "group" | "supergroup" }>;

// «Прислали ссылку» — не чаще раза в 30 минут на группу (после перезапуска
// бота — сразу: так быстро находятся группы, куда добавили до учёта).
const SEEN_INTERVAL_MS = 30 * 60 * 1000;
// Число участников спрашиваем у Telegram не чаще раза в сутки на группу.
const MEMBERS_INTERVAL_MS = 24 * 60 * 60 * 1000;
const MAX_TRACKED = 50_000;

const lastSeen = new Map<number, number>();
const lastMembers = new Map<number, number>();

function remember(map: Map<number, number>, chatId: number, now: number) {
  if (map.size > MAX_TRACKED) map.clear();
  map.set(chatId, now);
}

function about(chat: GroupChat) {
  return {
    chatId: chat.id,
    title: chat.title,
    type: chat.type,
    ...("username" in chat && chat.username ? { username: chat.username } : {}),
  };
}

async function membersOf(tg: Api, chatId: number, force = false): Promise<number | undefined> {
  const now = Date.now();
  if (!force && now - (lastMembers.get(chatId) ?? 0) < MEMBERS_INTERVAL_MS) return undefined;
  remember(lastMembers, chatId, now);
  return tg.getChatMemberCount(chatId).catch(() => undefined);
}

function send(body: Record<string, unknown>) {
  api("/bot-groups/event", body, { timeoutMs: 5000 }).catch((e) =>
    console.error(`Группа ${body.chatId}: учёт (${body.event}) не записан:`, e?.message ?? e),
  );
}

export function trackGroupAdded(tg: Api, chat: GroupChat, addedById?: number) {
  void membersOf(tg, chat.id, true).then((members) =>
    send({ ...about(chat), event: "added", ...(addedById ? { addedById } : {}), ...(members !== undefined ? { members } : {}) }),
  );
}

export function trackGroupRemoved(chat: GroupChat) {
  send({ ...about(chat), event: "removed" });
}

export function trackGroupLink(tg: Api, chat: GroupChat) {
  const now = Date.now();
  if (now - (lastSeen.get(chat.id) ?? 0) < SEEN_INTERVAL_MS) return;
  remember(lastSeen, chat.id, now);
  void membersOf(tg, chat.id).then((members) =>
    send({ ...about(chat), event: "seen", ...(members !== undefined ? { members } : {}) }),
  );
}

export function trackGroupDownload(chatId: number) {
  send({ chatId, event: "download" });
}

export function trackGroupMigrated(chatId: number, toChatId: number) {
  send({ chatId, event: "migrated", toChatId });
}

// Для тестов.
export function resetGroupTracking() {
  lastSeen.clear();
  lastMembers.clear();
}
