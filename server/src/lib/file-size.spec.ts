import {
  estimateAudioSize,
  estimateSizes,
  estimateVideoSize,
  maxFileBytes,
} from './file-size';

// Срез настоящего набора форматов YouTube: видео отдельно от звука, на одном
// разрешении и H.264, и VP9.
const youtube = {
  duration: 600,
  formats: [
    { format_id: '140', vcodec: 'none', acodec: 'mp4a.40.2', filesize: 9_000_000, tbr: 129 },
    { format_id: '251', vcodec: 'none', acodec: 'opus', filesize: 10_000_000, tbr: 140 },
    { format_id: '136', vcodec: 'avc1.4d401f', acodec: 'none', width: 1280, height: 720, filesize: 60_000_000 },
    { format_id: '247', vcodec: 'vp9', acodec: 'none', width: 1280, height: 720, filesize: 50_000_000 },
    { format_id: '137', vcodec: 'avc1.640028', acodec: 'none', width: 1920, height: 1080, filesize: 120_000_000 },
    { format_id: '135', vcodec: 'avc1.4d401e', acodec: 'none', width: 854, height: 480, filesize: 30_000_000 },
    { format_id: 'sb0', ext: 'mhtml', vcodec: 'none', acodec: 'none' },
  ],
};

describe('estimateVideoSize', () => {
  it('YouTube: H.264 нужного разрешения плюс AAC', () => {
    expect(estimateVideoSize(youtube, '720p', 'youtube')).toBe(69_000_000);
    expect(estimateVideoSize(youtube, '480p', 'youtube')).toBe(39_000_000);
  });

  it('вертикальный ролик меряется по короткой стороне', () => {
    const shorts = {
      duration: 30,
      formats: [
        { vcodec: 'avc1', acodec: 'none', width: 720, height: 1280, filesize: 5_000_000 },
        { vcodec: 'none', acodec: 'mp4a', filesize: 500_000 },
      ],
    };
    expect(estimateVideoSize(shorts, '720p', 'youtube')).toBe(5_500_000);
  });

  it('потоковый формат без размера — по битрейту и длительности', () => {
    // VK/Rutube: HLS с муксованным звуком, размер не сообщается.
    const vk = {
      duration: 3600,
      formats: [{ vcodec: 'avc1', acodec: 'mp4a', width: 426, height: 240, tbr: 280 }],
    };
    expect(estimateVideoSize(vk, '240p', 'vk')).toBe(280 * 125 * 3600);
  });

  it('VK: прогрессивный файл без размера — по скромному битрейту того же разрешения', () => {
    // Срез настоящего ролика VK (03.10.2026): yt-dlp берёт url240, у
    // которого нет ни размера, ни кодека; настоящий файл весил 124,7 МБ.
    const vk = {
      duration: 3599,
      formats: [
        { format_id: 'hls_fmp4-289', vcodec: 'avc1', acodec: 'none', width: 426, height: 240, tbr: 289.363 },
        { format_id: 'dash_sep-2', vcodec: 'avc1', acodec: 'none', width: 426, height: 240, tbr: 424.874 },
        { format_id: 'dash_sep-13', vcodec: 'none', acodec: 'mp4a', tbr: 265.483 },
        { format_id: 'url240', ext: 'mp4', height: 240, source_preference: 1 },
        { format_id: 'url360', ext: 'mp4', height: 360, source_preference: 1 },
        { format_id: 'url720', ext: 'mp4', height: 720, source_preference: 1 },
      ],
    };
    const size = estimateVideoSize(vk, '240p', 'vk') as number;
    expect(size).toBe(Math.round(289.363 * 125 * 3599));
    expect(size / 1024 ** 2).toBeGreaterThan(110);
    expect(size / 1024 ** 2).toBeLessThan(140);
  });

  it('VK: HLS со звуком внутри, если он есть', () => {
    const vk = {
      duration: 3599,
      formats: [
        { format_id: 'hls-365', protocol: 'm3u8_native', width: 426, height: 240, tbr: 365.543 },
        { format_id: 'hls_fmp4-289', protocol: 'm3u8_native', vcodec: 'avc1', acodec: 'none', width: 426, height: 240, tbr: 289.363 },
        { format_id: 'hls-576', protocol: 'm3u8_native', width: 640, height: 360, tbr: 576.746 },
        { format_id: 'url240', protocol: 'https', ext: 'mp4', height: 240, source_preference: 1 },
      ],
    };
    expect(estimateVideoSize(vk, '240p', 'vk')).toBe(Math.round(365.543 * 125 * 3599));
  });

  it('Facebook — по имени формата', () => {
    const fb = { duration: 60, formats: [{ format_id: 'hd', vcodec: 'avc1', acodec: 'mp4a', filesize: 7_000_000 }] };
    expect(estimateVideoSize(fb, 'hd', 'facebook')).toBe(7_000_000);
  });

  it('неизвестный размер — null, а не ноль', () => {
    const unknown = { formats: [{ vcodec: 'avc1', acodec: 'mp4a', width: 1280, height: 720 }] };
    expect(estimateVideoSize(unknown, '720p', 'tiktok')).toBeNull();
    expect(estimateVideoSize(youtube, 'original', 'instagram')).toBeNull();
  });
});

describe('estimateAudioSize', () => {
  it('mp3 заданного битрейта', () => {
    expect(estimateAudioSize(youtube, '128Kbps')).toBe(128 * 125 * 600);
    expect(estimateAudioSize({}, '128Kbps')).toBeNull();
  });
});

describe('estimateSizes', () => {
  it('пропускает качества с неизвестным размером', () => {
    expect(
      estimateSizes(youtube, 'youtube', { video: ['720p', 'original'], audio: ['128Kbps'] }),
    ).toEqual({ video: { '720p': 69_000_000 }, audio: { '128Kbps': 9_600_000 } });
  });
});

describe('maxFileBytes', () => {
  afterEach(() => {
    delete process.env.MAX_FILE_SIZE_BOT_MB;
    delete process.env.MAX_FILE_SIZE_WEB_MB;
  });

  it('бот — 2000 МБ, остальные — 4096 МБ по умолчанию', () => {
    expect(maxFileBytes('BOT')).toBe(2000 * 1024 ** 2);
    expect(maxFileBytes('WEB')).toBe(4096 * 1024 ** 2);
    expect(maxFileBytes(undefined)).toBe(4096 * 1024 ** 2);
  });

  it('YouTube на сайте без предела, в боте — предел Telegram', () => {
    expect(maxFileBytes('WEB', 'youtube')).toBe(Infinity);
    expect(maxFileBytes('BOT', 'youtube')).toBe(2000 * 1024 ** 2);
    expect(maxFileBytes('WEB', 'vk')).toBe(4096 * 1024 ** 2);
  });

  it('читает пределы из окружения', () => {
    process.env.MAX_FILE_SIZE_BOT_MB = '1000';
    expect(maxFileBytes('BOT')).toBe(1000 * 1024 ** 2);
  });
});
