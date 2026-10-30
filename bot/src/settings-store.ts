import { DEFAULT_GROUP_SETTINGS, SettingsCache, type GroupSettings } from "./group.js";
import { api } from "./helpers.js";

// Настройки групп (/settings) с кэшем: нужны на каждую ссылку в группе и для
// языка ответов (language.ts).
const settingsCache = new SettingsCache();

export async function loadSettings(chatId: number): Promise<GroupSettings> {
  const cached = settingsCache.get(chatId);
  if (cached) return cached;
  try {
    const s = await api<GroupSettings>(`/group-settings/${chatId}`);
    const value = { ...DEFAULT_GROUP_SETTINGS, ...s };
    settingsCache.set(chatId, value);
    return value;
  } catch (e: any) {
    // Сервер недоступен — работаем по умолчанию, а не молчим в группе.
    console.error(`Группа ${chatId}: настройки не загрузились:`, e?.message ?? e);
    return DEFAULT_GROUP_SETTINGS;
  }
}

export async function saveSettings(chatId: number, patch: Partial<GroupSettings>): Promise<GroupSettings> {
  const s = await api<GroupSettings>(`/group-settings/${chatId}`, patch);
  const value = { ...DEFAULT_GROUP_SETTINGS, ...s };
  settingsCache.set(chatId, value);
  return value;
}

