import { ErrorCategory } from '@prisma/client';
import { categorizeError } from './error-category';

describe('categorizeError', () => {
  it('puts a 403 on the file itself under SERVER_BLOCKED, not OTHER', () => {
    // Дословно ошибка скачивания YouTube 10.11.2026 (заблокированный прокси).
    expect(categorizeError('ERROR: unable to download video data: HTTP Error 403: Forbidden')).toBe(
      ErrorCategory.SERVER_BLOCKED,
    );
  });

  it('keeps a 403 on a private post as LOGIN_REQUIRED and a proxy tunnel 403 out of SERVER_BLOCKED', () => {
    expect(categorizeError('ERROR: HTTP Error 403: Forbidden. This video is private')).toBe(ErrorCategory.LOGIN_REQUIRED);
    expect(categorizeError('Unable to download: Tunnel connection failed: 403 Forbidden')).not.toBe(
      ErrorCategory.SERVER_BLOCKED,
    );
  });

  it('keeps the YouTube bot check as YOUTUBE_AUTH_REQUIRED', () => {
    expect(categorizeError("Sign in to confirm you're not a bot")).toBe(ErrorCategory.YOUTUBE_AUTH_REQUIRED);
  });
});
