import { PAID_QUALITY_MIN_HEIGHT } from 'src/lib/config';

// Зеркалит isPaidQuality() из bot/src/bot.ts и isPaidVideoQuality() в
// web/lib/subscription.ts — держать все три места в синхроне при изменении
// правила (см. общий фикстур-тест: server/test/paid-quality.fixture.json,
// используется во всех трёх; parity-тесты — download.service.spec.ts здесь,
// bot/src/paid-quality.test.ts, web/lib/subscription.test.ts). Сервер
// авторитетен (enforceWebLimits пересчитывает качества заново, не доверяя
// клиенту) — дублирование в bot/web только для UI, не дыра безопасности,
// но риск рассинхрона порога при будущей правке реален, отсюда и тест.
//
// Вынесено из приватного метода DownloadService в отдельный чистый модуль,
// чтобы было тестируемо без поднятия всего Nest-модуля/DI-контейнера.
export function isPaidVideoQuality(quality: string, availableQualities: string[]): boolean {
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
