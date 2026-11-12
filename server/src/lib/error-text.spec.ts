import { errorText } from './error-text';

describe('errorText', () => {
  it('drops links (proxy passwords live there), cookie lines and extra whitespace', () => {
    const raw =
      'ERROR: Unable to connect to proxy http://user:secret@1.2.3.4:12323\n' +
      '.instagram.com\tTRUE\t/\tTRUE\t0\tsessionid\tabc\n  see https://example.com/x';
    const text = errorText(raw);
    expect(text).toBe('ERROR: Unable to connect to proxy <url> see <url>');
    expect(text).not.toContain('secret');
    expect(text).not.toContain('sessionid');
  });

  it('drops our own yt-dlp wrapper', () => {
    expect(errorText('Failed to run yt-dlp command: ERROR: [threads] not found')).toBe('ERROR: [threads] not found');
  });

  it('cuts long messages', () => {
    expect(errorText('x'.repeat(900))).toHaveLength(500);
  });
});
