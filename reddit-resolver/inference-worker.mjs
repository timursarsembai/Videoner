import { validInferenceInput, validInferenceResult } from './inference-protocol.mjs';
let busy = false;
process.on('disconnect', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
process.on('message', async message => {
  const { id, op, payload } = message || {};
  if (busy || !Number.isSafeInteger(id) || !validInferenceInput(op, payload)) { process.exit(1); return; }
  busy = true;
  try {
    if (op !== 'transcribe') {
      const sharp = (await import('sharp')).default;
      for (const buffer of op === 'classify' ? payload.buffers : [payload.buffer]) {
        const meta = await sharp(Buffer.from(buffer), { limitInputPixels: 2048 * 2048 }).metadata();
        if (!meta.width || !meta.height || meta.width * meta.height > 2048 * 2048) throw new Error();
      }
    }
    let result;
    if (op === 'classify' || op === 'split-grid') {
      // These operations need only the tile model/Sharp, not Transformers.js.
      const tiles = await import('./tile-model.mjs');
      result = op === 'classify' ? await tiles.classifyTileImages(payload.buffers.map(b => Buffer.from(b)))
        : await tiles.splitGrid(Buffer.from(payload.buffer), payload.side);
    } else {
      const vision = await import('./vision.mjs');
      result = op === 'detect' ? await vision.detectObjects(Buffer.from(payload.buffer))
        : await vision.transcribe(payload.samples);
    }
    if (!validInferenceResult(op, result, payload)) throw new Error();
    process.send?.({ id, ok: true, result });
  } catch {
    // Raw model errors can contain filesystem paths; IPC uses a bounded code.
    process.send?.({ id, ok: false });
  } finally { busy = false; }
});
