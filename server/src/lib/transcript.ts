// «Текст из видео» (владелец 26.11.2026): ответ whisper.cpp → читаемый текст.
// Отрезки склеиваются через пробел, а после паузы длиннее PARAGRAPH_GAP_S или
// когда абзац стал слишком длинным — новый абзац: сплошная стена текста на
// десять минут речи не читается.

export const PARAGRAPH_GAP_S = 2;
const PARAGRAPH_MAX_CHARS = 900;

export interface WhisperSegment {
  start?: number;
  end?: number;
  text?: string;
}

// Служебные пометки Whisper вместо речи: [Музыка], (аплодисменты), [BLANK_AUDIO].
const NOISE = /^\s*[[(][^\])]{1,40}[\])]\s*$/;

export function transcriptText(segments: WhisperSegment[]): string {
  const paragraphs: string[] = [];
  let current = '';
  let lastEnd: number | null = null;
  // Whisper на шуме и крике зацикливается и повторяет одну фразу десятки раз
  // (26.11.2026, ролик со стрима): одинаковые подряд — не больше двух.
  let previous = '';
  let repeats = 0;
  for (const segment of segments) {
    const raw = (segment.text ?? '').replace(/\s+/g, ' ');
    const text = raw.trim();
    if (!text || NOISE.test(text)) continue;
    const norm = text.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '');
    repeats = norm && norm === previous ? repeats + 1 : 0;
    previous = norm;
    if (repeats >= 2) {
      // Время идёт и на пропущенных повторах — иначе после них лишний абзац.
      if (typeof segment.end === 'number') lastEnd = segment.end;
      continue;
    }
    // whisper.cpp режет и посреди слова («и аг» + «ента»): у продолжения
    // слова нет пробела в начале — его приклеиваем без пробела и абзац тут
    // не начинаем.
    const newWord = raw.startsWith(' ') || !current;
    const gap = lastEnd !== null && typeof segment.start === 'number' ? segment.start - lastEnd : 0;
    if (current && newWord && (gap > PARAGRAPH_GAP_S || (current.length > PARAGRAPH_MAX_CHARS && /[.!?…]$/.test(current)))) {
      paragraphs.push(current);
      current = '';
    }
    current = !current ? text : newWord ? `${current} ${text}` : current + text;
    if (typeof segment.end === 'number') lastEnd = segment.end;
  }
  if (current) paragraphs.push(current);
  return paragraphs.join('\n\n');
}
