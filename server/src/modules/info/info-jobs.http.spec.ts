import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request = require('supertest');
import { InfoController } from './info.controller';
import { InfoJobsController } from './info-jobs.controller';
import { InfoJobsService } from './info-jobs.service';
import { InfoService } from './info.service';
import { YtdlpFormatService } from '../ytdlp/ytdlp-format.service';

describe('Reddit metadata HTTP flow', () => {
  let app: INestApplication;
  let finish: (result: unknown) => void;
  let extract: jest.Mock;
  beforeEach(async () => {
    extract = jest.fn(() => new Promise(resolve => { finish = resolve; }));
    const module = await Test.createTestingModule({
      controllers: [InfoController, InfoJobsController],
      providers: [InfoJobsService, { provide: InfoService, useValue: { getVideoInfo: extract } },
        { provide: YtdlpFormatService, useValue: {} }],
    }).compile();
    app = module.createNestApplication();
    // Authentication itself is covered by the production global API-key guard;
    // emulate its output to exercise the real controller/routes here.
    app.use((req, _res, next) => { req.apiKey = { id: req.headers['x-test-owner'] || 'web' }; next(); });
    await app.init();
  });
  afterEach(async () => { await app.close(); });

  it('responds 202 before extraction completes and serves uncached short status requests', async () => {
    const created = await request(app.getHttpServer()).post('/info').set('Prefer', 'respond-async')
      .send({ url: 'https://www.reddit.com/comments/6rrwyj/', cookieScope: 'user:123' }).expect(202);
    const path = `/info/jobs/${created.body.jobId}`;
    expect(extract.mock.calls[0][0].cookieScope).toBeUndefined();
    const pending = await request(app.getHttpServer()).get(path).expect(200);
    expect(pending.headers['cache-control']).toBe('no-store');
    expect(pending.body.state).toBe('pending');
    await request(app.getHttpServer()).get(path).set('X-Test-Owner', 'other').expect(404);
    finish({ title: 'Ready' });
    const completed = await request(app.getHttpServer()).get(path).expect(200);
    expect(completed.body).toEqual({ state: 'completed', result: { title: 'Ready' } });
  });

  it('rejects an invalid URL before creating any job', async () => {
    await request(app.getHttpServer()).post('/info').set('Prefer', 'respond-async')
      .send({ url: 'https://localhost/private' }).expect(400);
    expect(extract).not.toHaveBeenCalled();
  });

  it('keeps the existing synchronous bot/API behavior without Prefer', async () => {
    extract.mockResolvedValue({ title: 'Ready' });
    const result = await request(app.getHttpServer()).post('/info')
      .send({ url: 'https://www.reddit.com/comments/6rrwyj/' }).expect(201);
    expect(result.body).toEqual({ title: 'Ready' });
  });

  it('separates visitors using the same site API key for both creation and polling', async () => {
    const start = (visitor: string) => request(app.getHttpServer()).post('/info')
      .set('Prefer', 'respond-async').set('X-Info-Visitor', visitor)
      .send({ url: 'https://www.reddit.com/comments/6rrwyj/' });
    const a = 'a'.repeat(64), b = 'b'.repeat(64);
    const created = await start(a).expect(202);
    await start(a).expect(202);
    await start(a).expect(503);
    await start(b).expect(202);
    await request(app.getHttpServer()).get(`/info/jobs/${created.body.jobId}`).set('X-Info-Visitor', b).expect(404);
    await request(app.getHttpServer()).get(`/info/jobs/${created.body.jobId}`).set('X-Info-Visitor', a).expect(200);
  });
});
