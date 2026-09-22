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

  if (/sign in to confirm/.test(msg)) {
    return ErrorCategory.YOUTUBE_AUTH_REQUIRED;
  }

  if (
    msg.includes('certain audiences') ||
    msg.includes('age-restricted') ||
    msg.includes('age restricted') ||
    msg.includes('sign in') ||
    msg.includes('log in') ||
    msg.includes('login required') ||
    msg.includes('requires authentication') ||
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

  if (msg.includes('no video formats found')) {
    return ErrorCategory.NO_VIDEO_CONTENT;
  }

  if (msg.includes('timed out') || msg.includes('timeout')) {
    return ErrorCategory.TIMEOUT;
  }

  return ErrorCategory.OTHER;
}
