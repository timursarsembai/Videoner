// Субтитры в боте: какие дорожки показать кнопками и в каком порядке.
//
// Список приходит от сервера (/info → subtitles) уже без машинных переводов —
// почему, см. server/src/lib/subtitles.ts. Здесь только раскладка под кнопки.

export type SubtitleTrack = {
  lang: string;
  name: string;
  auto: boolean;
};

// Больше кнопок языков не помещается так, чтобы клавиатура оставалась
// читаемой на телефоне. У большинства роликов дорожек и так одна-две.
export const SUBTITLE_BUTTONS = 8;

// Кого ставим первыми: аудитория бота говорит по-русски, по-английски и
// по-казахски. Остальные — в том порядке, в каком их отдала площадка.
const PREFERRED = ["ru", "en", "kk"];

function rank(track: SubtitleTrack): number {
  const base = track.lang.replace(/-orig$/, "").split("-")[0].toLowerCase();
  const i = PREFERRED.indexOf(base);
  return i === -1 ? PREFERRED.length : i;
}

export function orderTracks(tracks: readonly SubtitleTrack[]): SubtitleTrack[] {
  // sort устойчива: у равных по рангу сохраняется порядок площадки.
  return [...tracks].sort((a, b) => rank(a) - rank(b)).slice(0, SUBTITLE_BUTTONS);
}
