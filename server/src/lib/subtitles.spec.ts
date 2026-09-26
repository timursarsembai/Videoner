import { isAutoTrack, listSubtitles, SUBTITLE_LANG_RE } from './subtitles';

// Похоже на настоящий ответ yt-dlp для dQw4w9WgXcQ (26.09.2026): пять авторских
// дорожек и 157 автоматических, из которых распознанная речь одна — en-orig.
const rickroll = {
  subtitles: {
    en: [{ name: 'English' }],
    'de-DE': [{ name: 'German (Germany)' }],
    ja: [{ name: 'Japanese' }],
  },
  automatic_captions: {
    'en-orig': [{ name: 'English (Original)' }],
    en: [{ name: 'English' }],
    ru: [{ name: 'Russian' }],
    'ab-en': [{ name: 'Abkhazian from English' }],
  },
};

describe('listSubtitles', () => {
  it('отдаёт авторские субтитры', () => {
    expect(listSubtitles(rickroll).filter((t) => !t.auto).map((t) => t.lang)).toEqual(['en', 'de-DE', 'ja']);
  });

  it('машинные переводы не показывает', () => {
    const langs = listSubtitles(rickroll).map((t) => t.lang);
    expect(langs).not.toContain('ru');
    expect(langs).not.toContain('ab-en');
  });

  it('распознанную речь не показывает, если есть авторские на том же языке', () => {
    expect(listSubtitles(rickroll).some((t) => t.auto)).toBe(false);
  });

  it('распознанную речь показывает, если авторских нет', () => {
    const tracks = listSubtitles({
      automatic_captions: { 'ru-orig': [{ name: 'Russian (Original)' }], en: [{ name: 'English' }] },
    });
    expect(tracks).toEqual([{ lang: 'ru-orig', name: 'Russian (Original)', auto: true }]);
  });

  it('без субтитров — пустой список, чат трансляции не считается', () => {
    expect(listSubtitles({})).toEqual([]);
    expect(listSubtitles({ subtitles: { live_chat: [{ name: 'Live chat' }] } })).toEqual([]);
  });
});

describe('код языка', () => {
  it('распознанная дорожка — по суффиксу -orig', () => {
    expect(isAutoTrack('en-orig')).toBe(true);
    expect(isAutoTrack('en')).toBe(false);
  });

  it('форма пропускает только короткий код', () => {
    expect(SUBTITLE_LANG_RE.test('de-DE')).toBe(true);
    expect(SUBTITLE_LANG_RE.test('en,ru')).toBe(false);
    expect(SUBTITLE_LANG_RE.test('--exec')).toBe(false);
    expect(SUBTITLE_LANG_RE.test('en.*')).toBe(false);
  });

  it('«all» форму проходит — его отдельно запрещает downloadSubtitles', () => {
    expect(SUBTITLE_LANG_RE.test('all')).toBe(true);
  });
});
