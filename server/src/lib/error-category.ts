import { ErrorCategory } from '@prisma/client';

// Сигналы совпадают с InfoService.handleError() — держим в одном месте,
// чтобы категории ошибок были одинаковыми для /info и /download.
export function categorizeError(raw: string): ErrorCategory {
  const msg = (raw || '').toLowerCase();

  // Региональная блокировка. Проверяется раньше LOGIN_REQUIRED намеренно:
  // вход тут не поможет, ролик не отдают нашему адресу в принципе. Ловим и
  // сырой код TikTok (10231 = "cross_border_violation"), и уже причёсанный
  // текст из InfoService.handleError(), и общие формулировки других площадок.
  if (
    msg.includes('status code 10231') ||
    msg.includes('cross_border_violation') ||
    msg.includes("blocked outside the author's country") ||
    /not available (?:from|in) your (?:location|country|region)/.test(msg) ||
    /geo[-\s]?restrict/.test(msg)
  ) {
    return ErrorCategory.REGION_BLOCKED;
  }

  // Только антибот-проверка YouTube по адресу сервера. «Sign in to confirm
  // your age» (видео 18+, 11.11.2026) — это про ролик, а не про сервер: оно
  // ниже уходит в LOGIN_REQUIRED.
  if (/confirm you.?re not a bot/.test(msg)) {
    return ErrorCategory.YOUTUBE_AUTH_REQUIRED;
  }

  if (
    msg.includes('certain audiences') ||
    msg.includes('age-restricted') ||
    msg.includes('age restricted') ||
    msg.includes('confirm your age') ||
    msg.includes('sign in') ||
    msg.includes('log in') ||
    msg.includes('login required') ||
    msg.includes('requires authentication') ||
    // Instagram не пускает наш адрес без входа (05.11.2026): «redirected to
    // the login page … rate-limit for accessing posts anonymously».
    msg.includes('accessing posts anonymously') ||
    msg.includes('private') ||
    // Экстракторы Meta (Facebook, Instagram) на закрытой записи не сообщают
    // «нужен вход», а падают на разборе страницы: вместо поста им приходит
    // заглушка «This page isn't available right now». Проверено 11.08.2026 —
    // reel открывается только под аккаунтом, настоящий браузер и через
    // резидентный прокси видит ту же заглушку.
    msg.includes('cannot parse data')
  ) {
    return ErrorCategory.LOGIN_REQUIRED;
  }

  if (msg.includes('unsupported platform') || msg.includes('invalid url')) {
    return ErrorCategory.UNSUPPORTED_PLATFORM;
  }

  if (msg.includes('requested format is not available')) {
    return ErrorCategory.FORMAT_UNAVAILABLE;
  }

  if (
    msg.includes('no video formats found') ||
    // Threads: пост без видимого медиа (текстовый или медиа только для вошедших).
    msg.includes('no video or photo is visible in this threads post')
  ) {
    return ErrorCategory.NO_VIDEO_CONTENT;
  }

  if (msg.includes('timed out') || msg.includes('timeout')) {
    return ErrorCategory.TIMEOUT;
  }

  // Страница открылась, а сам файл площадка нашему адресу не отдаёт (403).
  // Так 10.11.2026 весь день падали скачивания YouTube: заблокировали прокси.
  // Раньше это уходило в OTHER, и в журнале проблему было не разглядеть.
  // В самом конце: 403 у закрытой записи — это вход (LOGIN_REQUIRED выше), а
  // сбой туннеля самого прокси — не отказ площадки.
  if (/http error 403|403:?\s*forbidden/.test(msg) && !msg.includes('tunnel connection failed')) {
    return ErrorCategory.SERVER_BLOCKED;
  }

  return ErrorCategory.OTHER;
}
