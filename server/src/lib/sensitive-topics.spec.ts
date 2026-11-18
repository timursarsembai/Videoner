import { topicsOf } from './sensitive-topics';

describe('topicsOf', () => {
  it('находит конфессии и эзотерику', () => {
    expect(topicsOf({ title: 'Выучите Коран наизусть | Сура 78' })).toEqual(['islam']);
    expect(topicsOf({ title: 'Проповедь', hashtags: ['христианство'] })).toEqual(['christianity']);
    expect(topicsOf({ title: 'Video by olga_taro_guru', author: 'olga_taro_guru' })).toEqual(['esoteric']);
    expect(topicsOf({ title: 'Расклад таро на неделю' })).toEqual(['esoteric']);
    expect(topicsOf({ title: 'الحمد لله' })).toEqual(['islam']);
  });

  it('не путает имена, фамилии и мемы', () => {
    for (const title of [
      'Hans Christian Andersen',
      'Faizə aid sual, Namazov',
      'Михей и Джуманджи - Мама',
      'God of War',
      'Опенинг из Евангелиона',
      'Алла Пугачёва',
      'Рабыня Изаура не споёт с Шаманом',
      'Abdullah عبدالله',
    ]) {
      expect(topicsOf({ title })).toEqual([]);
    }
  });

  it('конкретная конфессия важнее «религии вообще»', () => {
    expect(topicsOf({ title: 'Молитва в мечети' })).toEqual(['islam']);
    expect(topicsOf({ title: 'О религии' })).toEqual(['religion_other']);
  });
});
