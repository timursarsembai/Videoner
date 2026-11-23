// Опросы в боте (bot/src/survey.ts). Ключ опроса — он же ключ подсказки
// (PromoShow), чтобы опрос приходил по тем же правилам: один раз и не в
// один день с другой подсказкой.
//
// transcribe (владелец 23.11.2026): нужна ли расшифровка видео — субтитры,
// где их нет, текст целиком, краткий конспект. Можно выбрать несколько;
// «ничего из этого» снимает остальные отметки, а любая другая — её.
export const SURVEYS: Record<string, { options: string[]; exclusive?: string }> = {
  transcribe: { options: ['subtitles', 'text', 'summary', 'none'], exclusive: 'none' },
};

// Новые отметки после нажатия на вариант option.
export function toggleChoice(survey: string, choices: string[], option: string): string[] {
  const def = SURVEYS[survey];
  if (!def || !def.options.includes(option)) return choices;
  if (choices.includes(option)) return choices.filter((c) => c !== option);
  const rest = option === def.exclusive ? [] : choices.filter((c) => c !== def.exclusive);
  // Порядок — как в опросе, чтобы одинаковые ответы выглядели одинаково.
  return def.options.filter((o) => o === option || rest.includes(o));
}
