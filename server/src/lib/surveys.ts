// Опросы в боте (bot/src/survey.ts). Ключ опроса — он же ключ подсказки
// (PromoShow), чтобы опрос приходил по тем же правилам: не в один день с
// другой подсказкой.
//
// transcribe (владелец 23.11.2026): нужна ли расшифровка видео — субтитры,
// где их нет, текст целиком, краткий конспект. Можно выбрать несколько;
// «ничего из этого» снимает остальные отметки, а любая другая — её.
export const SURVEYS: Record<string, { options: string[]; exclusive?: string }> = {
  transcribe: { options: ['subtitles', 'text', 'summary', 'none'], exclusive: 'none' },
};

// Подсказка (PromoShow.key) -> опрос, который она показывает.
export const SURVEY_PROMOS: Record<string, string> = { survey: 'transcribe' };

// Кому и сколько раз (владелец 25.11.2026): ответил — больше не присылаем, даже
// если показ не записан (сообщение отправили вручную); не ответил — один раз
// повторяем через неделю, и всё. Повтор пишется в PromoShow своим ключом.
export const SURVEY_REPEAT_MS = 7 * 24 * 60 * 60 * 1000;
export const surveyRepeatKey = (key: string) => `${key}-again`;

// Под каким ключом записать показ опроса сейчас; null — показывать нельзя.
export function surveyShowKey(
  key: string,
  shows: { key: string; shownAt: Date }[],
  answered: boolean,
  now = Date.now(),
): string | null {
  if (answered) return null;
  const again = surveyRepeatKey(key);
  if (shows.some((s) => s.key === again)) return null;
  const first = shows.find((s) => s.key === key);
  if (!first) return key;
  return first.shownAt.getTime() <= now - SURVEY_REPEAT_MS ? again : null;
}

// Новые отметки после нажатия на вариант option.
export function toggleChoice(survey: string, choices: string[], option: string): string[] {
  const def = SURVEYS[survey];
  if (!def || !def.options.includes(option)) return choices;
  if (choices.includes(option)) return choices.filter((c) => c !== option);
  const rest = option === def.exclusive ? [] : choices.filter((c) => c !== def.exclusive);
  // Порядок — как в опросе, чтобы одинаковые ответы выглядели одинаково.
  return def.options.filter((o) => o === option || rest.includes(o));
}
