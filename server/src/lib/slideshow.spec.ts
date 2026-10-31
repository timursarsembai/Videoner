import { photoQualities, slideshowArgs } from './slideshow';

describe('slideshow', () => {
  it('offers a slideshow only for posts with several photos', () => {
    expect(photoQualities(1)).toEqual(['original']);
    expect(photoQualities(3)).toEqual(['original', 'slideshow', 'gallery']);
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
