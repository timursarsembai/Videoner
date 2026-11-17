process.on('disconnect', () => process.exit(0));
process.on('message', ({ id, payload }) => {
  const command = Buffer.from(payload.buffer).toString();
  if (command === 'crash') return process.exit(1);
  if (command === 'hang') { process.on('SIGTERM', () => {}); return; }
  if (command === 'bad') return process.send({ id, ok: true, result: 'invalid output' });
  const answer = () => process.send({ id, ok: true, result: [{ pid: process.pid,
    secretPresent: !!process.env.REDDIT_PROXY_URL || !!process.env.BOT_TOKEN || !!process.env.INFERENCE_TEST_SECRET,
    command, label: command, score: 1, box: { xmin: 0, ymin: 0, xmax: 1, ymax: 1 } }] });
  if (command === 'slow') setTimeout(answer, 100);
  else answer();
});
