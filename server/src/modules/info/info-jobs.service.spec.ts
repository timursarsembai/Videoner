import { BadRequestException, NotFoundException } from '@nestjs/common';
import { InfoJobsService } from './info-jobs.service';
import { ADULT_CONTENT_ERROR } from '../../lib/adult-content';

describe('asynchronous Reddit metadata', () => {
  let jobs: InfoJobsService;
  beforeEach(() => { jest.useFakeTimers(); jobs = new InfoJobsService(); });
  afterEach(() => { jobs.onModuleDestroy(); jest.useRealTimers(); });

  it('returns immediately and permits short polls while extraction takes over three minutes', async () => {
    const job = jobs.start('web', () => new Promise(resolve => setTimeout(() => resolve({ id: 'post' }), 183000)));
    expect(jobs.get('web', job.jobId)).toEqual({ state: 'pending' });
    await jest.advanceTimersByTimeAsync(182000);
    expect(jobs.get('web', job.jobId)).toEqual({ state: 'pending' });
    await jest.advanceTimersByTimeAsync(1000);
    expect(jobs.get('web', job.jobId)).toEqual({ state: 'completed', result: { id: 'post' } });
  });

  it('keeps the translated adult refusal and hides unexpected error details', async () => {
    const adult = jobs.start('web', async () => { throw new BadRequestException(ADULT_CONTENT_ERROR); });
    const broken = jobs.start('web', async () => { throw new Error('private diagnostic'); });
    await jest.advanceTimersByTimeAsync(0);
    expect(jobs.get('web', adult.jobId)).toEqual({ state: 'failed', message: ADULT_CONTENT_ERROR, statusCode: 400 });
    expect(jobs.get('web', broken.jobId)).toEqual({ state: 'failed', message: 'Reddit server access unavailable', statusCode: 400 });
  });

  it('does not expose jobs to another API key and expires old results', async () => {
    const job = jobs.start('owner', async () => ({}));
    expect(() => jobs.get('other', job.jobId)).toThrow(NotFoundException);
    await jest.advanceTimersByTimeAsync(300001);
    expect(() => jobs.get('owner', job.jobId)).toThrow(NotFoundException);
  });

  it('bounds concurrent work and discards a result arriving after the job timeout', async () => {
    const job = jobs.start('owner', () => new Promise(resolve => setTimeout(() => resolve('late'), 250000)));
    jobs.start('owner', async () => new Promise(() => {}));
    expect(() => jobs.start('owner', async () => ({}))).toThrow();
    await jest.advanceTimersByTimeAsync(250000);
    expect(jobs.get('owner', job.jobId)).toMatchObject({ state: 'failed' });
  });
});
