import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { shadowValidationStats } from '../../lib/shadow-validation.pipe';

// Часовая сводка режима наблюдения за валидацией (см. lib/shadow-validation.pipe.ts).
//
// Сводка, а не строка на каждый запрос: строка на запрос — это тысячи записей в
// сутки, в которых утонет то единственное несовпадение, ради которого всё
// затевалось. Сами несовпадения пишутся сразу, по факту; здесь только итоги.
//
// Вторая, не менее важная задача отчёта — ПОКРЫТИЕ. Строгий режим можно
// включать только для тех запросов, которые за время наблюдения реально
// приходили. DTO, не появившийся в отчётах ни разу, означает не «всё хорошо», а
// «мы про него ничего не знаем».
@Injectable()
export class ValidationReportService {
  private readonly logger = new Logger('ShadowValidation');

  @Cron(process.env.VALIDATION_REPORT_CRON || CronExpression.EVERY_HOUR)
  report() {
    if (process.env.VALIDATION_MODE !== 'shadow') {
      return;
    }

    if (shadowValidationStats.size === 0) {
      this.logger.log('за час запросов с проверяемым телом не было');
      return;
    }

    const rows = [...shadowValidationStats.entries()]
      .map(([name, tally]) => {
        const norules = tally.norules
          ? `, ${tally.norules} БЕЗ ПРАВИЛ (не проверялись)`
          : '';
        return `${name}: ${tally.ok} ок / ${tally.mismatch} отклонил бы${norules}`;
      })
      .join(', ');
    this.logger.log(`за час — ${rows}`);

    // Обнуляем: каждая строка отчёта про свой час, иначе накопленные числа
    // смазывают момент, когда несовпадения начались.
    shadowValidationStats.clear();
  }
}
