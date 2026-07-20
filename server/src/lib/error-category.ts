import { ErrorCategory } from '@prisma/client';

// Сигналы совпадают с InfoService.handleError() — держим в одном месте,
// чтобы категории ошибок были одинаковыми для /info и /download.
export function categorizeError(raw: string): ErrorCategory {
  const msg = (raw || '').toLowerCase();

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
    msg.includes('private')
  ) {
    return ErrorCategory.LOGIN_REQUIRED;
  }

  if (msg.includes('unsupported platform') || msg.includes('invalid url')) {
    return ErrorCategory.UNSUPPORTED_PLATFORM;
  }

  if (msg.includes('requested format is not available')) {
    return ErrorCategory.FORMAT_UNAVAILABLE;
  }

  if (msg.includes('timed out') || msg.includes('timeout')) {
    return ErrorCategory.TIMEOUT;
  }

  return ErrorCategory.OTHER;
}
