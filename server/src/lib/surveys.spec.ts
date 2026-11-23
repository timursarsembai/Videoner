import { toggleChoice } from './surveys';

describe('toggleChoice', () => {
  it('отмечает и снимает вариант', () => {
    expect(toggleChoice('transcribe', [], 'text')).toEqual(['text']);
    expect(toggleChoice('transcribe', ['text'], 'summary')).toEqual(['text', 'summary']);
    expect(toggleChoice('transcribe', ['text', 'summary'], 'text')).toEqual(['summary']);
  });
  it('«ничего из этого» снимает остальные, и наоборот', () => {
    expect(toggleChoice('transcribe', ['text', 'summary'], 'none')).toEqual(['none']);
    expect(toggleChoice('transcribe', ['none'], 'subtitles')).toEqual(['subtitles']);
  });
  it('незнакомый опрос или вариант — без изменений', () => {
    expect(toggleChoice('transcribe', ['text'], 'bad')).toEqual(['text']);
    expect(toggleChoice('nope', ['text'], 'text')).toEqual(['text']);
  });
});
