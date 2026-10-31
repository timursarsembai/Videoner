// Флаги к ссылке: «ссылка -audio» — сразу звук (mp3), «ссылка -hd» — сразу
// лучшее качество, без выбора кнопками. В личке и в группах.
//
// Флаг — отдельное слово через пробел: внутри адреса «-hd» не флаг. Телефон
// нередко сам превращает «-» и «--» в тире — его тоже понимаем.
// "std" — 720p без выбора: в тексте его нет, его ставит выбор качества
// плейлиста (handlers/playlist.ts).
export type LinkFlag = "audio" | "hd" | "std";

const FLAG_RE = /(^|\s)[-–—]{1,2}(audio|mp3|hd)(?=\s|$)/gi;

export function parseFlag(text: string): LinkFlag | null {
  let flag: LinkFlag | null = null;
  for (const m of text.matchAll(FLAG_RE)) {
    const word = m[2].toLowerCase();
    // Звук важнее: «-hd -audio» — всё равно просили звук.
    flag = word === "hd" && flag !== "audio" ? "hd" : "audio";
  }
  return flag;
}

// Текст без флагов — чтобы сообщение «ссылка -audio» по-прежнему считалось
// «только ссылкой» (группа удаляет такие после отправки видео).
export function stripFlags(text: string): string {
  return text.replace(FLAG_RE, "$1");
}
