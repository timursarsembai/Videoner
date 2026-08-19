// Имя файла собирается из ЧУЖИХ данных: заголовок приходит от площадки, а
// quality и extension — прямо из тела запроса. Заголовок чистился и раньше, а
// два других поля подставлялись как есть, хотя проверяются они только zod-схемой
// с `quality: z.string()` — то есть не проверяются вовсе (декораторы @IsEnum в
// DTO не работают: глобального ValidationPipe в приложении нет).
//
// Через это имя уходило в -o для yt-dlp, и `quality: "../../../../cookies/X"`
// записывал файл ВНЕ каталога загрузок — воспроизведено на staging 19.08.2026,
// файл лёг в примонтированный с хоста server/cookies/. Дотянуться туда мог любой
// посетитель сайта: прокси web-а форвардит POST download/video, подставляя
// админский ключ на своей стороне, а тело запроса задаёт клиент.
//
// Поэтому здесь тот же фильтр, что и для заголовка: всё, кроме букв и цифр,
// превращается в подчёркивание. Разделители пути, точки и «..» после этого не
// выживают в принципе. Вторая, независимая проверка — в getOutputPath()
// (ytdlp-process.service.ts): она отбивает любое имя с разделителем пути, от
// какого бы вызывающего оно ни пришло.
const sanitizeNamePart = (value?: string) =>
  (value ?? '').replace(/[^a-zA-Z0-9]/g, '_').replace(/_{2,}/g, '_');

export const getFileName = (title: string, quality?: string, extension?: string) => {
  const timestamp = new Date().getTime();
  let cleanTitle = title.replace(/[^a-zA-Z0-9]/g, '_');
  cleanTitle = cleanTitle.replace(/_{2,}/g, '_').slice(0, 100);
  // Расширение остаётся отдельным куском после точки, поэтому чистим и его:
  // «mp4/../../x» иначе снова дало бы путь.
  return `${cleanTitle}_${sanitizeNamePart(quality)}_${timestamp}.${sanitizeNamePart(extension)}`;
};

export const PROGRESS_STRING =
  'bright-{"status":"%(progress.status)s","downloaded":"%(progress.downloaded_bytes)s","total":"%(progress.total_bytes)s","total_estimate":"%(progress.total_bytes_estimate)s","speed":"%(progress.speed)s","eta":"%(progress.eta)s"}';

export function formatBytes(bytes: string | number, decimals = 2) {
  let newBytes = Number(bytes);

  if (newBytes === 0 || isNaN(newBytes)) return newBytes + ' Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(newBytes) / Math.log(k));

  return parseFloat((newBytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

function toFixedNumber(num: number, digits: number, base?: number) {
  var pow = Math.pow(base || 10, digits);
  return Math.round(num * pow) / pow;
}

export function percentage(
  partialValue: string | number,
  totalValue: string | number,
) {
  return toFixedNumber((100 * Number(partialValue)) / Number(totalValue), 2);
}

export function secondsToHms(d: number | string) {
  d = Number(d);
  var h = Math.floor(d / 3600);
  var m = Math.floor((d % 3600) / 60);
  var s = Math.floor((d % 3600) % 60);

  var hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : '';
  var mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : '';
  var sDisplay = s >= 0 ? s + (s == 1 ? ' second' : ' seconds') : '';
  return hDisplay + mDisplay + sDisplay;
}

export function thr() {
  throw new Error();
}
