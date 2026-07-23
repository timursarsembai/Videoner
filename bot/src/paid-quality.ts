// Зеркалит isPaidVideoQuality() из server/src/modules/download/paid-quality.ts
// и web/lib/subscription.ts — держать все три места в синхроне при изменении
// правила (см. общий набор кейсов в paid-quality.test.ts здесь и парных тестах
// в server/web). Сервер авторитетен (enforceWebLimits пересчитывает качества
// заново, не доверяя клиенту) — эта копия только для UI бота (клавиатура,
// пометка 🔒), не дыра безопасности сама по себе, но риск рассинхрона порога
// при будущей правке реален, отсюда и parity-тест.
//
// Вынесено из bot.ts в отдельный модуль: bot.ts на верхнем уровне запускает
// самого бота (bot.start()) при импорте — тестировать чистую функцию из
// такого файла напрямую нельзя было бы без побочных эффектов.
export const PAID_QUALITY_MIN_HEIGHT = 720;

// Если у видео вообще нет вариантов ниже 720p (площадка отдаёт 720p как минимум),
// 720p — единственный разумный выбор пользователя, поэтому отдаём его бесплатно.
// Если варианты ниже 720p есть, 720p остаётся платным, как и раньше.
export function isPaidQuality(
  kind: string,
  quality: string,
  availableQualities: string[] = [],
): boolean {
  if (kind !== "v") return false;
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
