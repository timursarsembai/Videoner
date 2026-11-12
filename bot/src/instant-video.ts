import { api } from "./helpers.js";

// Режим «сразу видео» (/settings в личке): ссылка без выбора качества — бот
// сразу шлёт видео 720p с кнопкой «MP3». Хранит сервер (BotUser.instantVideo),
// здесь — кэш, как у языка (language.ts).

const TTL_MS = 10 * 60_000;
const ERROR_TTL_MS = 60_000;
// Не ответил сервер быстро — обычный выбор качества, а не ожидание.
const LOOKUP_TIMEOUT_MS = 2_000;
const cache = new Map<number, { value: boolean; expiresAt: number }>();

// Прямо с сервера, мимо кэша; бросает, если сервер не ответил. Для
// переключателя: после сбоя в кэше «выключено», и нажатие «выключить»
// по нему включило бы режим.
export async function fetchInstantVideo(userId: number, now = Date.now()): Promise<boolean> {
  const { instantVideo: value } = await api<{ instantVideo: boolean }>(
    `/bot-users/${userId}/instant-video`,
    undefined,
    { timeoutMs: LOOKUP_TIMEOUT_MS },
  );
  remember(userId, value === true, now + TTL_MS);
  return value === true;
}

export async function instantVideo(userId: number, now = Date.now()): Promise<boolean> {
  const hit = cache.get(userId);
  if (hit && hit.expiresAt > now) return hit.value;
  try {
    return await fetchInstantVideo(userId, now);
  } catch (e: any) {
    console.error(`Сразу видео ${userId}: не загрузилось:`, e?.message ?? e);
    remember(userId, false, now + ERROR_TTL_MS);
    return false;
  }
}

export async function saveInstantVideo(userId: number, on: boolean) {
  await api(`/bot-users/${userId}/instant-video`, { instantVideo: on });
  remember(userId, on, Date.now() + TTL_MS);
}

function remember(userId: number, value: boolean, expiresAt: number) {
  if (cache.size > 50_000) cache.clear();
  cache.set(userId, { value, expiresAt });
}
