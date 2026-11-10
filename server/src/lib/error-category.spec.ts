import { ErrorCategory } from '@prisma/client';
import { categorizeError } from './error-category';

describe('categorizeError', () => {
  it('puts a 403 on the file itself under SERVER_BLOCKED, not OTHER', () => {
    // Дословно ошибка скачивания YouTube 10.11.2026 (заблокированный прокси).
    expect(categorizeError('ERROR: unable to download video data: HTTP Error 403: Forbidden')).toBe(
      ErrorCategory.SERVER_BLOCKED,
    );
  });

  it('keeps the YouTube bot check as YOUTUBE_AUTH_REQUIRED', () => {
    expect(categorizeError("Sign in to confirm you're not a bot")).toBe(ErrorCategory.YOUTUBE_AUTH_REQUIRED);
  });
});
