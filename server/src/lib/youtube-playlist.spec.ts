import { playlistEntriesFromFlat, youtubePlaylistId } from './youtube-playlist';

describe('youtube playlists', () => {
  it('takes the list id from playlist and video links, skipping mixes and private lists', () => {
    expect(youtubePlaylistId('https://www.youtube.com/playlist?list=PLabcdefghij123')).toBe('PLabcdefghij123');
    expect(youtubePlaylistId('https://youtube.com/watch?v=x&list=PLabcdefghij123&index=2')).toBe('PLabcdefghij123');
    expect(youtubePlaylistId('https://www.youtube.com/watch?v=x&list=RDabcdefghij123')).toBeNull();
    expect(youtubePlaylistId('https://www.youtube.com/watch?v=x')).toBeNull();
    expect(youtubePlaylistId('https://vimeo.com/x?list=PLabcdefghij123')).toBeNull();
  });

  it('maps flat entries and drops deleted/private placeholders', () => {
    expect(
      playlistEntriesFromFlat({
        entries: [
          { id: 'a1', title: 'One', duration: 61 },
          { id: 'b2', title: '[Deleted video]' },
          { id: 'c3', title: '[Private video]' },
        ],
      }),
    ).toEqual([{ url: 'https://www.youtube.com/watch?v=a1', title: 'One', duration: 61 }]);
  });
});
