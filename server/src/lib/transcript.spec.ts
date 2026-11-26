import { transcriptText } from './transcript';

describe('transcriptText', () => {
  it('склеивает отрезки и делит на абзацы по паузам', () => {
    expect(
      transcriptText([
        { start: 0, end: 2, text: ' Привет.' },
        { start: 2.2, end: 4, text: ' Как дела?' },
        { start: 8, end: 9, text: ' Новая мысль.' },
      ]),
    ).toBe('Привет. Как дела?\n\nНовая мысль.');
  });

  it('склеивает слово, разрезанное между отрезками', () => {
    expect(transcriptText([{ start: 0, end: 1, text: ' сделаем и аг' }, { start: 4, end: 5, text: 'ента, который' }])).toBe(
      'сделаем и агента, который',
    );
  });

  it('убирает служебные пометки и пустые отрезки', () => {
    expect(transcriptText([{ text: ' [Музыка]' }, { text: '' }, { text: '(аплодисменты)' }, { text: ' Текст' }])).toBe('Текст');
    expect(transcriptText([])).toBe('');
  });

  it('режет слишком длинный абзац на конце предложения', () => {
    const long = 'слово '.repeat(160).trim() + '.';
    const out = transcriptText([{ start: 0, end: 1, text: long }, { start: 1, end: 2, text: ' Дальше.' }]);
    expect(out.split('\n\n')).toHaveLength(2);
  });
});
