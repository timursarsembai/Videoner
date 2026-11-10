// Цвета, подписи и форматы дашборда — общие для всех его графиков и таблиц.

export const PLATFORM_COLORS: Record<string, string> = {
  YOUTUBE: "#ef4444",
  TIKTOK: "#111827",
  INSTAGRAM: "#ec4899",
  FACEBOOK: "#3b82f6",
  TWITTER: "#0ea5e9",
  THREADS: "#374151",
  VIMEO: "#14b8a6",
  VK: "#6366f1",
  RUTUBE: "#f97316",
  OKRU: "#eab308",
  PINTEREST: "#be123c",
  GETCOURSE: "#16a34a",
};

export const SOURCE_COLORS: Record<string, string> = {
  BOT: "#0ea5e9",
  WEB: "#22c55e",
  EXTENSION: "#8b5cf6",
  API: "#9ca3af",
};

export const SOURCE_LABELS: Record<string, string> = {
  BOT: "Бот",
  WEB: "Сайт",
  EXTENSION: "Расширение",
  API: "API",
};

export const ERROR_COLORS: Record<string, string> = {
  LOGIN_REQUIRED: "#f59e0b",
  UNSUPPORTED_PLATFORM: "#6b7280",
  FORMAT_UNAVAILABLE: "#8b5cf6",
  YOUTUBE_AUTH_REQUIRED: "#ef4444",
  TIMEOUT: "#3b82f6",
  SERVER_BLOCKED: "#dc2626",
  OTHER: "#9ca3af",
};

// С этого дня сайт и расширение присылают язык интерфейса вместе со
// скачиванием (Download.lang), а с COUNTRY_TRACKING_SINCE — и страну
// (Download.country). Раньше — «Не указан».
export const LANGUAGE_TRACKING_SINCE = "2026-11-01";
export const COUNTRY_TRACKING_SINCE = "2026-11-05";

// Дни в базе — полуночи UTC; подписываем их в UTC, иначе в часовом поясе
// западнее Гринвича день сдвигался бы на вчера.
export function formatDay(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", timeZone: "UTC" });
}

export function formatLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function formatMonth(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

// Неделя подписывается датой её понедельника.
export function formatWeek(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "UTC",
  });
}

export const BYTE_UNITS = [
  { label: "ГБ", size: 1024 ** 3 },
  { label: "МБ", size: 1024 ** 2 },
  { label: "КБ", size: 1024 },
];

// Единица — по самому большому значению графика, одна на всю ось: подписи
// «0,3 ГБ» и «300 МБ» вперемешку на одной шкале читаются хуже.
export function pickByteUnit(max: number) {
  return BYTE_UNITS.find((unit) => max >= unit.size) ?? BYTE_UNITS[BYTE_UNITS.length - 1];
}

export function formatBytes(bytes: number): string {
  const unit = pickByteUnit(bytes);
  const value = bytes / unit.size;
  return `${value.toLocaleString("ru-RU", { maximumFractionDigits: value < 10 ? 2 : 1 })} ${unit.label}`;
}

// Порядок как в prisma/schema.prisma (enum Downloaders) — чтобы список в
// фильтре не расходился с тем, что реально может прийти из базы.
export const PLATFORM_OPTIONS = [
  "YOUTUBE",
  "FACEBOOK",
  "INSTAGRAM",
  "TIKTOK",
  "TWITTER",
  "VIMEO",
  "VK",
  "RUTUBE",
  "OKRU",
  "PINTEREST",
  "THREADS",
  "GETCOURSE",
] as const;
