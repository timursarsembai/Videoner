import {
  ArgumentMetadata,
  Injectable,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { getMetadataStorage } from 'class-validator';

// Режим наблюдения за валидацией входа.
//
// Зачем он вообще: обычный ValidationPipe отвергает всё, что не совпало с
// описанием запроса (DTO), а описания у нас неточные — они писались как
// документация и годами ничего не проверяли (см. коммит e1bf2b9). Включить его
// сразу означает с высокой вероятностью перестать принимать РАБОЧИЕ запросы:
// например, quality приходит не из фиксированного списка, а из нашего же
// ответа /info, и там бывают и «1080p», и «hd», и «original» (пост без единого
// видео). Проверять такие догадки на живых пользователях нельзя.
//
// Поэтому здесь тот же самый ValidationPipe, с теми же правилами и той же
// логикой выбора типа — но результат только ЗАПИСЫВАЕТСЯ. Запрос идёт дальше
// в любом случае, наружу ничего не меняется. Через неделю живого трафика лог
// покажет, чем реальные запросы отличаются от описаний; после этого описания
// правятся, и строгий режим включается уже по фактам, а не по предположениям.
//
// Важно, что механизм ОДИН: наблюдение проверяет ровно то, что потом начнёт
// отвергать. Отдельная «облегчённая» проверка для наблюдения не гарантировала
// бы ничего.

type Tally = { ok: number; mismatch: number; norules: number };

// Копится в памяти, раз в час выгружается в лог и обнуляется
// (ValidationReportService). Отсутствие DTO в отчёте означает «за этот час по
// нему не было ни одного запроса» — это тоже важные данные: включать строгий
// режим для маршрута, который никто не дёргал, нельзя, тишина там ничего не
// доказывает.
export const shadowValidationStats = new Map<string, Tally>();

const bump = (name: string, field: keyof Tally) => {
  const tally = shadowValidationStats.get(name) ?? {
    ok: 0,
    mismatch: 0,
    norules: 0,
  };
  tally[field] += 1;
  shadowValidationStats.set(name, tally);
};

@Injectable()
export class ShadowValidationPipe extends ValidationPipe {
  private readonly logger = new Logger('ShadowValidation');

  async transform(value: any, metadata: ArgumentMetadata) {
    const name = metadata.metatype?.name;

    // toValidate() — тот же отбор, что и у боевого пайпа: примитивы и типы без
    // правил он пропускает. Считать их в статистику нельзя, иначе «ок» начнёт
    // means «не проверяли», и отчёт будет врать в самую опасную сторону.
    if (!name || !this.toValidate(metadata)) {
      return value;
    }

    // Отдельно считаем DTO, у которых НЕТ ни одного правила. Без этой проверки
    // такой класс давал бы «0 несовпадений» — и выглядел бы идеально пройденным
    // наблюдением, хотя не проверялось ровно ничего. Именно так и появилась
    // дыра, с которой началась вся эта история: описание выглядело проверкой,
    // не будучи ею. Молчание в отчёте должно означать отсутствие трафика, а не
    // отсутствие правил.
    if (
      getMetadataStorage().getTargetValidationMetadatas(
        metadata.metatype as Function,
        name,
        true,
        false,
      ).length === 0
    ) {
      bump(name, 'norules');
      return value;
    }

    try {
      await super.transform(value, metadata);
      bump(name, 'ok');
    } catch (error: any) {
      bump(name, 'mismatch');
      this.logger.warn(
        `${name}: ${this.describe(error)} — запрос ПРОПУЩЕН (режим наблюдения)`,
      );
    }

    // ВСЕГДА исходное значение, а не то, что вернул super.transform(): пайп
    // умеет приводить типы, и вернуть его результат значило бы менять поведение
    // приложения — ровно то, чего режим наблюдения делать не должен.
    return value;
  }

  // В лог уходят имена полей и нарушенные правила, но НЕ присланные значения:
  // в теле запроса ссылки и telegram id живых людей, и им не место в логах.
  // Стандартные сообщения ValidationPipe как раз такие («quality must match ...
  // regular expression»), поэтому берём их как есть.
  private describe(error: any): string {
    try {
      const response = error?.getResponse?.();
      const message = (response as any)?.message ?? error?.message;
      const list = Array.isArray(message) ? message : [String(message)];
      const shown = list.slice(0, 5).join('; ');
      return list.length > 5 ? `${shown} (и ещё ${list.length - 5})` : shown;
    } catch {
      return 'не удалось разобрать причину';
    }
  }
}
