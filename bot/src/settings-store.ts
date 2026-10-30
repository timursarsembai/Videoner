import { DEFAULT_GROUP_SETTINGS, SettingsCache, type GroupSettings } from "./group.js";
import { api } from "./helpers.js";

// Настройки групп (/settings) с кэшем: нужны на каждую ссылку в группе и для
// языка ответов (language.ts).
const SETTINGS_TTL_MS = 10 * 60_000;
const FAILURE_TTL_MS = 60_000;
const LOOKUP_TIMEOUT_MS = 5_000;
const settingsCache = new SettingsCache(SETTINGS_TTL_MS);

export async function loadSettings(chatId: number): Promise<GroupSettings> {
  const cached = settingsCache.get(chatId);
  if (cached) return cached;
  try {
    const s = await api<GroupSettings>(`/group-settings/${chatId}`, undefined, { timeoutMs: LOOKUP_TIMEOUT_MS });
    const value = { ...DEFAULT_GROUP_SETTINGS, ...s };
    settingsCache.set(chatId, value);
    return value;
  } catch (e: any) {
    // Сервер недоступен — работаем по умолчанию, а не молчим в группе. И
    // минуту не спрашиваем снова: бот обрабатывает обновления по одному, и
    // каждое сообщение группы ждало бы сервер заново.
    console.error(`Группа ${chatId}: настройки не загрузились:`, e?.message ?? e);
    settingsCache.set(chatId, DEFAULT_GROUP_SETTINGS, Date.now() - SETTINGS_TTL_MS + FAILURE_TTL_MS);
    return DEFAULT_GROUP_SETTINGS;
  }
}

export async function saveSettings(chatId: number, patch: Partial<GroupSettings>): Promise<GroupSettings> {
  const s = await api<GroupSettings>(`/group-settings/${chatId}`, patch);
  const value = { ...DEFAULT_GROUP_SETTINGS, ...s };
  settingsCache.set(chatId, value);
  return value;
}

