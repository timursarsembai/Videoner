import { adultHintInInfo, isWatched } from './adult-watch';

const DAY = 24 * 60 * 60 * 1000;
const now = Date.UTC(2026, 10, 22, 12);
const ago = (days: number) => new Date(now - days * DAY);

describe('isWatched', () => {
  it('3 отказа за неделю — под наблюдением', () => {
    expect(isWatched([ago(1), ago(3), ago(6)], now)).toBe(true);
  });
  it('2 отказа — нет', () => {
    expect(isWatched([ago(1), ago(2)], now)).toBe(false);
  });
  it('3 отказа, растянутые больше чем на неделю, — нет', () => {
    expect(isWatched([ago(1), ago(9), ago(20)], now)).toBe(false);
  });
  it('через 30 дней без отказов наблюдение снимается', () => {
    expect(isWatched([ago(31), ago(32), ago(33)], now)).toBe(false);
    expect(isWatched([ago(29), ago(32), ago(33)], now)).toBe(true);
  });
  it('нет отказов — нет', () => {
    expect(isWatched([], now)).toBe(false);
  });
});

describe('adultHintInInfo', () => {
  it('признаки в подписи, описании или имени автора', () => {
    expect(adultHintInInfo({ title: 'Michelle - Rate this dress 1-10?', uploader: 'Michelle' })).toBe(true);
    expect(adultHintInInfo({ title: 'x - hi', description: 'hi', uploader: 'Melissa Starova 🍒' })).toBe(true);
    expect(adultHintInInfo({ title: 'Savy Delaney - wataa', uploader: 'Savy Delaney' })).toBe(true);
    expect(adultHintInInfo({ entries: [{ title: 'Sisi (FREE 0F) - hey', uploader: 'Sisi' }] })).toBe(true);
  });
  it('обычный пост — нет', () => {
    expect(adultHintInInfo({ title: 'NASA - Launch day!', description: 'Launch day!', uploader: 'NASA' })).toBe(false);
    expect(adultHintInInfo(null)).toBe(false);
  });
});
