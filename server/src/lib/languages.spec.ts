import {
  SUPPORTED_LANGUAGES,
  downloadLanguage,
  effectiveBotLanguage,
  normalizeLanguageCode,
  parseUiLang,
} from './languages';

describe('normalizeLanguageCode', () => {
  it('берёт базовый код до дефиса и приводит к нижнему регистру', () => {
    expect(normalizeLanguageCode('pt-BR')).toBe('pt');
    expect(normalizeLanguageCode('EN-us')).toBe('en');
    expect(normalizeLanguageCode('ckb-IQ')).toBe('ckb');
    expect(normalizeLanguageCode('inh')).toBe('inh');
  });

  it('старые и альтернативные коды сводит к поддерживаемым', () => {
    expect(normalizeLanguageCode('in')).toBe('id');
    expect(normalizeLanguageCode('fil-PH')).toBe('tl');
    expect(normalizeLanguageCode('kmr')).toBe('ku');
    expect(normalizeLanguageCode('mo')).toBe('ro');
  });

  it('неподдерживаемые и пустые коды — other', () => {
    expect(normalizeLanguageCode('be')).toBe('other');
    expect(normalizeLanguageCode('')).toBe('other');
    expect(normalizeLanguageCode(null)).toBe('other');
    expect(normalizeLanguageCode(undefined)).toBe('other');
  });

  it('все 46 поддерживаемых языков остаются как есть', () => {
    expect(SUPPORTED_LANGUAGES).toHaveLength(46);
    for (const code of SUPPORTED_LANGUAGES) {
      expect(normalizeLanguageCode(code)).toBe(code);
    }
  });
});

describe('effectiveBotLanguage', () => {
  it('выбранный вручную язык важнее языка Telegram', () => {
    expect(effectiveBotLanguage('uk', 'ru')).toBe('uk');
    expect(effectiveBotLanguage(null, 'ru-RU')).toBe('ru');
    expect(effectiveBotLanguage(null, null)).toBe('other');
  });
});

describe('parseUiLang', () => {
  it('пропускает только 2–3 строчные латинские буквы', () => {
    expect(parseUiLang('uk')).toBe('uk');
    expect(parseUiLang('ckb')).toBe('ckb');
    expect(parseUiLang('UK')).toBeNull();
    expect(parseUiLang('pt-BR')).toBeNull();
    expect(parseUiLang('abcd')).toBeNull();
    expect(parseUiLang('')).toBeNull();
    expect(parseUiLang(42)).toBeNull();
    expect(parseUiLang(undefined)).toBeNull();
  });
});

describe('downloadLanguage', () => {
  it('null — unknown, код вне списка — other', () => {
    expect(downloadLanguage(null)).toBe('unknown');
    expect(downloadLanguage('de')).toBe('de');
    expect(downloadLanguage('xx')).toBe('other');
  });
});
