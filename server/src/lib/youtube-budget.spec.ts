import {
  capYoutubeQualities,
  capYoutubeQuality,
  qualityHeight,
  youtubeDailyLimitPerIpBytes,
  youtubeMaxHeight,
} from './youtube-budget';

const VARS = [
  'YOUTUBE_MAX_HEIGHT',
  'YOUTUBE_LONG_VIDEO_MINUTES',
  'YOUTUBE_LONG_MAX_HEIGHT',
  'YOUTUBE_DAILY_GB_PER_IP',
];

beforeEach(() => {
  for (const name of VARS) delete process.env[name];
});

// Потолок, который был по умолчанию до 03.10.2026: проверяем сам механизм.
function capAt720() {
  process.env.YOUTUBE_MAX_HEIGHT = '720';
  process.env.YOUTUBE_LONG_VIDEO_MINUTES = '30';
}

describe('по умолчанию потолка нет', () => {
  it('качества и запрос не режутся', () => {
    expect(youtubeMaxHeight(3 * 60 * 60)).toBe(Infinity);
    expect(capYoutubeQualities(['2160p', '1080p', '720p'], 3 * 60 * 60)).toEqual([
      '2160p',
      '1080p',
      '720p',
    ]);
    expect(capYoutubeQuality('2160p', 60)).toBe('2160p');
  });
});

describe('youtubeMaxHeight', () => {
  it('720 и 480 для роликов от 30 минут', () => {
    capAt720();
    expect(youtubeMaxHeight(60)).toBe(720);
    expect(youtubeMaxHeight(29 * 60)).toBe(720);
    expect(youtubeMaxHeight(30 * 60)).toBe(480);
    expect(youtubeMaxHeight(undefined)).toBe(720);
  });

  it('читает пороги из окружения', () => {
    process.env.YOUTUBE_MAX_HEIGHT = '1080';
    process.env.YOUTUBE_LONG_VIDEO_MINUTES = '60';
    process.env.YOUTUBE_LONG_MAX_HEIGHT = '720';
    expect(youtubeMaxHeight(45 * 60)).toBe(1080);
    expect(youtubeMaxHeight(60 * 60)).toBe(720);
  });

  it('YOUTUBE_LONG_VIDEO_MINUTES=0 отключает отдельный потолок для длинных', () => {
    process.env.YOUTUBE_MAX_HEIGHT = '720';
    process.env.YOUTUBE_LONG_VIDEO_MINUTES = '0';
    expect(youtubeMaxHeight(3 * 60 * 60)).toBe(720);
  });

  it('потолок для длинных не поднимает общий', () => {
    capAt720();
    process.env.YOUTUBE_LONG_MAX_HEIGHT = '1080';
    expect(youtubeMaxHeight(2 * 60 * 60)).toBe(720);
  });

  it('мусор в окружении — значения по умолчанию', () => {
    process.env.YOUTUBE_MAX_HEIGHT = 'abc';
    process.env.YOUTUBE_LONG_VIDEO_MINUTES = '30';
    process.env.YOUTUBE_LONG_MAX_HEIGHT = '-1';
    expect(youtubeMaxHeight(60)).toBe(Infinity);
    expect(youtubeMaxHeight(60 * 60)).toBe(480);
  });
});

describe('qualityHeight', () => {
  it('понимает обе формы подписи', () => {
    expect(qualityHeight('1080p')).toBe(1080);
    expect(qualityHeight('1920x1080')).toBe(1080);
    expect(qualityHeight('1080x1920')).toBe(1080);
    expect(qualityHeight('original')).toBeNull();
    expect(qualityHeight('hd')).toBeNull();
  });
});

describe('capYoutubeQualities', () => {
  beforeEach(capAt720);

  it('убирает всё выше потолка и сохраняет порядок', () => {
    expect(
      capYoutubeQualities(['2160p', '1080p', '720p', '480p', '360p'], 60),
    ).toEqual(['720p', '480p', '360p']);
  });

  it('длинному ролику оставляет до 480p', () => {
    expect(
      capYoutubeQualities(['1080p', '720p', '480p', '360p'], 2 * 60 * 60),
    ).toEqual(['480p', '360p']);
  });

  it('не оставляет человека без кнопок', () => {
    expect(capYoutubeQualities(['1080p'], 60)).toEqual(['720p']);
  });
});

describe('capYoutubeQuality', () => {
  beforeEach(capAt720);

  it('опускает запрошенное качество до потолка', () => {
    expect(capYoutubeQuality('2160p', 60)).toBe('720p');
    expect(capYoutubeQuality('1080p', 2 * 60 * 60)).toBe('480p');
  });

  it('не трогает то, что ниже потолка, и нечисловые качества', () => {
    expect(capYoutubeQuality('360p', 60)).toBe('360p');
    expect(capYoutubeQuality('original', 60)).toBe('original');
  });
});

describe('youtubeDailyLimitPerIpBytes', () => {
  it('по умолчанию 5 ГБ, 0 — без лимита', () => {
    expect(youtubeDailyLimitPerIpBytes()).toBe(5 * 1024 ** 3);
    process.env.YOUTUBE_DAILY_GB_PER_IP = '0';
    expect(youtubeDailyLimitPerIpBytes()).toBe(0);
    process.env.YOUTUBE_DAILY_GB_PER_IP = '1.5';
    expect(youtubeDailyLimitPerIpBytes()).toBe(Math.round(1.5 * 1024 ** 3));
  });
});
