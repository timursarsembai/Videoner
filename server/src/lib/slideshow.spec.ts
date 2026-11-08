import { addAudioArgs, audioSlideshowSeconds, photoQualities, postAudio, slideshowArgs } from './slideshow';

describe('slideshow', () => {
  it('offers a slideshow only for posts with several photos', () => {
    expect(photoQualities(1)).toEqual(['original']);
    expect(photoQualities(3)).toEqual(['original', 'slideshow', 'gallery']);
  });

  it('offers a slideshow for a single photo when the post has sound', () => {
    expect(photoQualities(1, true)).toEqual(['original', 'slideshow', 'gallery']);
  });

  it('reads the post sound only from an https link', () => {
    expect(postAudio({ vn_audio: { url: 'https://cdn/a.mp3', duration: 5 } })).toEqual({ url: 'https://cdn/a.mp3', duration: 5 });
    expect(postAudio({ vn_audio: { url: 'file:///etc/passwd' } })).toBeNull();
    expect(postAudio({})).toBeNull();
  });

  it('lasts as long as the sound, at least one round of photos, at most the cap', () => {
    expect(audioSlideshowSeconds(1, 491)).toBe(491);
    expect(audioSlideshowSeconds(10, 12)).toBe(30);
    expect(audioSlideshowSeconds(2, undefined)).toBe(6);
    expect(audioSlideshowSeconds(1, 5000)).toBe(1800);
  });

  it('loops the silent video under the sound without re-encoding it', () => {
    const args = addAudioArgs('/d/v.mp4', '/d/a.mp3', 491, '/d/out.mp4');
    expect(args.filter((a) => a === '-stream_loop')).toHaveLength(2);
    expect(args[args.indexOf('-c:v') + 1]).toBe('copy');
    expect(args[args.indexOf('-t') + 1]).toBe('491');
    expect(args[args.length - 1]).toBe('/d/out.mp4');
  });

  it('builds one input per photo and concatenates them without audio', () => {
    const args = slideshowArgs(['/d/a-01.jpg', '/d/a-02.jpg'], '/d/a-00.mp4');
    expect(args.filter((a) => a === '-i')).toHaveLength(2);
    const filter = args[args.indexOf('-filter_complex') + 1];
    expect(filter).toContain('[v0][v1]concat=n=2:v=1:a=0[out]');
    expect(args).not.toContain('-c:a');
    expect(args[args.length - 1]).toBe('/d/a-00.mp4');
  });
});
