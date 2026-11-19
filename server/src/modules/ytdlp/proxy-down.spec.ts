import { YtdlpProcessService } from './ytdlp-process.service';

describe('мёртвый прокси не выбираем', () => {
  const A = 'http://a.test:1';
  const B = 'http://b.test:1';
  const C = 'http://c.test:1';
  let service: any;
  beforeEach(() => {
    service = new YtdlpProcessService() as any;
    service.proxyPool = [A, B, C];
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it('берёт только живые, в том числе вместо уже закреплённого за роликом', () => {
    const url = 'https://youtu.be/Il0K23_77QQ';
    jest.spyOn(Math, 'random').mockReturnValue(0);
    expect(service.pickProxy('youtube', url)).toBe(A);
    service.setProxyDown(A, true);
    for (let i = 0; i < 20; i++) {
      (Math.random as jest.Mock).mockReturnValue(i / 20);
      expect([B, C]).toContain(service.pickProxy('youtube', `${url}?t=${i}`));
    }
    expect(service.spareProxies('youtube', B, [])).toEqual([C]);
  });

  it('если не отвечает ни один — берёт любой, а оживший возвращает', () => {
    for (const p of [A, B, C]) service.setProxyDown(p, true);
    expect([A, B, C]).toContain(service.pickProxy('youtube'));
    service.setProxyDown(A, false);
    service.setProxyDown(B, false);
    service.setProxyDown(C, false);
    expect(service.aliveProxies()).toEqual([A, B, C]);
  });

  it('чужой адрес не запоминает', () => {
    service.setProxyDown('http://other.test:1', true);
    expect(service.downProxies.size).toBe(0);
  });
});
