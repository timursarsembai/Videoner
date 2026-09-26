// Какие субтитры YouTube предлагать человеку — на сайте и в боте одинаково.
//
// yt-dlp отдаёт их в двух полях, и смешивать их нельзя:
//   subtitles          — субтитры, которые загрузил автор. Надёжны.
//   automatic_captions — распознанная речь на языке ролика (ключ «<язык>-orig»,
//                        например «en-orig») и ~150 МАШИННЫХ ПЕРЕВОДОВ её же.
//
// Машинные переводы не показываем. Проверено 26.09.2026: YouTube отдаёт их
// нашему серверу через раз — русский на пробном ролике вернул
// «429 Too Many Requests», хотя английские авторские скачались сразу. Кнопка,
// которая чаще ломается, чем работает, хуже отсутствующей.
//
// Распознанную речь показываем, но только если авторских на том же языке нет:
// у многих роликов других субтитров нет вовсе, а рядом с авторскими она
// лишняя — те точнее.

export type SubtitleTrack = {
  // Код, который уходит в yt-dlp как есть (--sub-langs): «en», «de-DE»,
  // «en-orig». По нему же сервер решает, авторские это или распознанные.
  lang: string;
  // Как назвала дорожку сама площадка: «English», «English (Original)».
  name: string;
  auto: boolean;
};

type TrackMap = Record<string, { name?: string }[] | undefined> | undefined;

// Код языка — короткий, с буквы, из букв, цифр и дефисов. Значение приходит от
// клиента и уходит в --sub-langs, а тот понимает регулярные выражения — форма
// их отсекает. «All» форму проходит, его downloadSubtitles запрещает отдельно.
// Машинный перевод этим кодом тоже не запросить: для кода без «-orig» сервер
// зовёт --write-subs, а он берёт только авторские субтитры.
export const SUBTITLE_LANG_RE = /^[A-Za-z][A-Za-z0-9-]{0,19}$/;

const AUTO_SUFFIX = '-orig';

// Служебная «дорожка» с чатом трансляции — это не субтитры.
const NOT_SUBTITLES = new Set(['live_chat']);

export function listSubtitles(info: {
  subtitles?: TrackMap;
  automatic_captions?: TrackMap;
}): SubtitleTrack[] {
  const tracks: SubtitleTrack[] = [];
  const manualBases = new Set<string>();

  for (const [lang, variants] of Object.entries(info.subtitles ?? {})) {
    if (NOT_SUBTITLES.has(lang) || !variants?.length) continue;
    tracks.push({ lang, name: variants[0]?.name || lang, auto: false });
    manualBases.add(baseLang(lang));
  }

  for (const [lang, variants] of Object.entries(info.automatic_captions ?? {})) {
    if (!lang.endsWith(AUTO_SUFFIX) || !variants?.length) continue;
    if (manualBases.has(baseLang(lang))) continue;
    tracks.push({ lang, name: variants[0]?.name || lang, auto: true });
  }

  return tracks;
}

// Распознанная ли это дорожка — по коду, который прислал клиент. Решаем на
// сервере, а не верим флагу из запроса: от этого зависит ключ yt-dlp
// (--write-subs или --write-auto-subs), и ошибка дала бы пустой результат.
export function isAutoTrack(lang: string): boolean {
  return lang.endsWith(AUTO_SUFFIX);
}

// «de-DE» и «de», «en-orig» и «en» — один язык.
function baseLang(lang: string): string {
  return lang.replace(new RegExp(`${AUTO_SUFFIX}$`), '').split('-')[0].toLowerCase();
}
