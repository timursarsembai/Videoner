import { BLOCKED_CONTENT_ERROR, blockedInfo, blockedReason, wouldBlockReligion } from './blocked-content';
import { categorizeError } from './error-category';

describe('blockedReason — эзотерика', () => {
  it('запрещает по строгим словам', () => {
    for (const title of [
      'Расклад таро на неделю',
      'Как снять порчу и сглаз',
      'Приворот на любовь',
      'Натальная карта: разбор',
      'Астролог о 2027 годе',
      'Матрица судьбы по дате рождения',
      'Daily tarot reading',
      'Бал ашу: не істеу керек',
    ]) {
      expect(blockedReason({ title })).toBe('esoteric');
    }
    expect(blockedReason({ title: 'Видео', hashtags: ['таролог'] })).toBe('esoteric');
  });

  it('запрещённого автора — всегда, даже со словами про ислам', () => {
    expect(blockedReason({ title: 'Video by olga_taro_guru', author: 'olga_taro_guru' })).toBe('author');
    expect(blockedReason({ title: 'Иншаллах всё будет', author: 'Olga_Taro_Guru' })).toBe('author');
  });

  it('слово про ислам разрешает', () => {
    expect(blockedReason({ title: 'Порча и сглаз в исламе — лекция устаза' })).toBeNull();
    expect(blockedReason({ title: 'Гадание запрещено в Коране' })).toBeNull();
  });

  it('спорные слова не запрещают', () => {
    for (const title of [
      'Магия вне Хогвартса',
      'Руны в Skyrim',
      'Медитация для сна',
      'Зодиак (фильм, 2007)',
      'Гороскоп-мем',
      'Тарантино: лучшие сцены',
      'Таророма vlog',
      'Psycho Killer',
      'Испорченный телефон',
      'Сглаживание шрифтов',
      'Я всё порчу — влог',
      'Taro milk tea recipe',
      'Taro Aso interview',
    ]) {
      expect(blockedReason({ title })).toBeNull();
    }
  });
});

describe('blockedInfo — ответ yt-dlp', () => {
  it('Instagram: автор из заголовка «Video by»', () => {
    expect(blockedInfo({ title: 'Video by olga_taro_guru' }, 'instagram', 'https://www.instagram.com/reel/X/')).toBe('author');
  });
  it('хэштеги из описания тоже учитываются', () => {
    expect(blockedInfo({ title: 'Неделя', description: '#таро #расклад' }, 'tiktok', 'https://www.tiktok.com/@a/video/1')).toBe('esoteric');
  });
  it('Instagram: подпись из описания', () => {
    expect(blockedInfo({ title: 'Video by someone', description: 'Расклад таро на неделю' }, 'instagram', 'https://www.instagram.com/reel/X/')).toBe('esoteric');
  });
  it('YouTube: описание не смотрим', () => {
    expect(blockedInfo({ title: 'Обзор фильма', description: 'астрология и всё такое' }, 'youtube', 'https://youtu.be/x')).toBeNull();
  });
  it('обычное видео проходит', () => {
    expect(blockedInfo({ title: 'Рецепт плова' }, 'youtube', 'https://youtu.be/x')).toBeNull();
    expect(blockedInfo(null, 'youtube', 'https://youtu.be/x')).toBeNull();
  });
});

describe('wouldBlockReligion — тихий режим', () => {
  it('другая религия без ислама — было бы запрещено', () => {
    expect(wouldBlockReligion({ title: 'Проповедь пастора о Библии' })).toBe(true);
    expect(wouldBlockReligion({ title: 'Буддизм: основы' })).toBe(true);
  });
  it('ислам или диспут с исламом — нет', () => {
    expect(wouldBlockReligion({ title: 'Коран о пророках' })).toBe(false);
    expect(wouldBlockReligion({ title: 'Диспут: мусульманин и христианин об Иисусе' })).toBe(false);
    expect(wouldBlockReligion({ title: 'Рецепт плова' })).toBe(false);
  });
});

it('журнал ошибок узнаёт отказ по теме', () => {
  expect(categorizeError(BLOCKED_CONTENT_ERROR)).toBe('BLOCKED_CONTENT');
});
