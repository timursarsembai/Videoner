import { fetchRedditPhoto, isRedditCdnBlock } from './reddit-cdn';

describe('Reddit media ISP reserve', () => {
  const url = 'https://i.redd.it/example.jpg';
  it('uses the direct response without contacting ISP', async () => {
    const isp = jest.fn();
    const result = await fetchRedditPhoto(url, ['http://isp.test:1234'], jest.fn().mockResolvedValue(new Response('image', { headers: { 'Content-Type': 'image/jpeg' } })), isp);
    expect(result.bytes.toString()).toBe('image'); expect(isp).not.toHaveBeenCalled();
  });
  it('tries the ISP list after a CDN block and rotates after a failed ISP', async () => {
    const isp = jest.fn().mockRejectedValueOnce(new Error('unavailable')).mockResolvedValueOnce({ bytes: Buffer.from('ok'), contentType: 'image/jpeg' });
    const result = await fetchRedditPhoto(url, ['http://isp-one.test:1234', 'http://isp-two.test:1234'],
      jest.fn().mockResolvedValue(new Response('', { status: 429 })), isp);
    expect(result.bytes.toString()).toBe('ok');
    expect(isp.mock.calls.map(call => call[1])).toEqual(['http://isp-one.test:1234', 'http://isp-two.test:1234']);
  });
  it('does not spend proxy traffic on missing files or unrelated hosts', async () => {
    const isp = jest.fn(); const direct = jest.fn().mockResolvedValue(new Response('', { status: 404 }));
    await expect(fetchRedditPhoto(url, ['http://isp.test:1234'], direct, isp)).rejects.toThrow('404');
    await expect(fetchRedditPhoto('https://example.com/photo.jpg', [], direct, isp)).rejects.toThrow('Invalid Reddit photo');
    expect(isp).not.toHaveBeenCalled(); expect(direct).toHaveBeenCalledTimes(1);
  });
  it('recognizes CDN refusals without treating account authentication as a media block', () => {
    expect(isRedditCdnBlock('ERROR: HTTP Error 403: Forbidden')).toBe(true);
    expect(isRedditCdnBlock('HTTP Error 429: Too Many Requests')).toBe(true);
    expect(isRedditCdnBlock('Account authentication is required')).toBe(false);
    expect(isRedditCdnBlock('HTTP Error 404: Not Found')).toBe(false);
  });
});
