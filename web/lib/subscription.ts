// Зеркалит isPaidQuality() из bot/src/bot.ts и isPaidVideoQuality() в
// server/src/modules/download/download.service.ts — держать все три места в
// синхроне при изменении правила. Чисто для UI (лочит кнопки заранее) —
// окончательное решение всё равно принимает сервер (enforceWebLimits).
export const PAID_QUALITY_MIN_HEIGHT = 720;

export function isPaidVideoQuality(
  quality: string,
  availableQualities: string[]
): boolean {
  const height = parseInt(quality, 10);
  if (!Number.isFinite(height) || height < PAID_QUALITY_MIN_HEIGHT) return false;

  if (height === PAID_QUALITY_MIN_HEIGHT) {
    const heights = availableQualities
      .map((q) => parseInt(q, 10))
      .filter((h) => Number.isFinite(h));
    const minHeight = heights.length ? Math.min(...heights) : height;
    if (minHeight >= PAID_QUALITY_MIN_HEIGHT) return false;
  }

  return true;
}
