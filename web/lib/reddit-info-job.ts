type Job<T> = { state: 'pending' | 'completed' | 'failed'; result?: T; message?: string; statusCode?: number };

export async function waitForRedditInfo<T>(poll: () => Promise<Job<T>>, {
  now = Date.now, wait = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms)),
} = {}): Promise<T> {
  const deadline = now() + 240000;
  let transientErrors = 0;
  while (now() < deadline) {
    let job: Job<T>;
    try {
      job = await poll();
      transientErrors = 0;
    } catch (error) {
      const status = (error as { statusCode?: number })?.statusCode;
      if (++transientErrors <= 3 && (status === 429 || status === undefined || status >= 500)) {
        await wait(3000 * transientErrors);
        continue;
      }
      throw error;
    }
    if (job.state === 'completed' && job.result !== undefined) return job.result;
    if (job.state === 'failed') throw { message: job.message || 'Reddit server access unavailable', statusCode: job.statusCode || 400 };
    await wait(3000);
  }
  throw { message: 'Reddit server access unavailable', statusCode: 504 };
}
