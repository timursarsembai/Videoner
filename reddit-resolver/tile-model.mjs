import * as ort from 'onnxruntime-node';
import sharp from 'sharp';
import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream } from 'node:fs';
import { access, mkdir, rename, unlink } from 'node:fs/promises';
import { Readable, Transform } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { join } from 'node:path';
import { TOPICS, CLASSIFIER_CLASSES as CLASSES } from './selection.mjs';

const MODEL = {
  url: 'https://huggingface.co/VeyraAgent/cf-solver-models/resolve/0257291b5110eeab7d13cab98907ab1347559e22/solvers/recaptcha/models/recaptcha_cls_s.onnx',
  sha256: '164a4935030fe88cb6b7d56abe06b6572d1a85a7fcbecc4a7edeff4b166d987d',
  bytes: 20405782,
};

async function hashFile(path) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest('hex');
}

async function modelPath() {
  const dir = process.env.MODEL_CACHE_DIR || '/models';
  const path = join(dir, 'recaptcha-classification-small.onnx');
  let exists = true;
  await access(path).catch(() => { exists = false; });
  if (!exists) {
    if (process.env.MODEL_OFFLINE === '1') throw new Error('REDDIT_TILE_MODEL_MISSING');
    await mkdir(dir, { recursive: true });
    const response = await fetch(MODEL.url, { signal: AbortSignal.timeout(180000) });
    if (!response.ok || !response.body) throw new Error('REDDIT_MODEL_DOWNLOAD_FAILED');
    const temporary = `${path}.${process.pid}.tmp`;
    let bytes = 0;
    const limit = new Transform({ transform(chunk, encoding, done) {
      bytes += chunk.length;
      if (bytes > MODEL.bytes) return done(new Error('REDDIT_MODEL_SIZE_MISMATCH'));
      done(null, chunk);
    } });
    try {
      await pipeline(Readable.fromWeb(response.body), limit, createWriteStream(temporary, { flags: 'wx' }));
      if (bytes !== MODEL.bytes || await hashFile(temporary) !== MODEL.sha256) throw new Error('REDDIT_MODEL_CHECKSUM_MISMATCH');
      await rename(temporary, path);
    } finally { await unlink(temporary).catch(() => {}); }
  }
  if (await hashFile(path) !== MODEL.sha256) throw new Error('REDDIT_MODEL_CHECKSUM_MISMATCH');
  return path;
}

// RGB [0,255] -> bilinear shortest-edge resize, centre crop, planar RGB [0,1].
// Match the model's declared preprocessing; accepting arbitrary dimensions
// without this conversion produces plausible but incorrect predictions.
export function rgbToPlanar(data, width, height, size = 224) {
  const pixels = size * size;
  const out = new Float32Array(pixels * 3);
  const edge = Math.min(width, height), scale = edge / size;
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const sx = Math.max(0, Math.min(width - 1, (x + 0.5) * scale - 0.5 + (width - edge) / 2));
    const sy = Math.max(0, Math.min(height - 1, (y + 0.5) * scale - 0.5 + (height - edge) / 2));
    const x0 = Math.floor(sx), y0 = Math.floor(sy), x1 = Math.min(width - 1, x0 + 1), y1 = Math.min(height - 1, y0 + 1);
    const dx = sx - x0, dy = sy - y0;
    for (let c = 0; c < 3; c++) {
      const top = data[(y0 * width + x0) * 3 + c] * (1 - dx) + data[(y0 * width + x1) * 3 + c] * dx;
      const bottom = data[(y1 * width + x0) * 3 + c] * (1 - dx) + data[(y1 * width + x1) * 3 + c] * dx;
      out[c * pixels + y * size + x] = (top * (1 - dy) + bottom * dy) / 255;
    }
  }
  return out;
}

let session;
export async function getTileModel() {
  session ??= modelPath().then(path => ort.InferenceSession.create(path, {
    executionProviders: ['cpu'], intraOpNumThreads: 1, interOpNumThreads: 1, enableCpuMemArena: false,
  })).catch(error => { session = undefined; throw error; });
  return session;
}

export async function classifyTileImages(buffers) {
  const model = await getTileModel();
  const results = [];
  // Batch one keeps activation memory bounded on the shared VPS.
  for (const buffer of buffers) {
    const { data, info } = await sharp(buffer).removeAlpha().toColourspace('srgb').raw().toBuffer({ resolveWithObject: true });
    if (info.channels !== 3) throw new Error('REDDIT_INVALID_TILE');
    const tensor = new ort.Tensor('float32', rgbToPlanar(data, info.width, info.height), [1, 3, 224, 224]);
    let output;
    try {
      output = await model.run({ [model.inputNames[0]]: tensor });
      const scores = output[model.outputNames[0]].data;
      if (scores.length !== CLASSES.length) throw new Error('REDDIT_MODEL_OUTPUT_MISMATCH');
      results.push(CLASSES.map((topic, i) => ({ label: TOPICS[topic][0], score: Number(scores[i]) })));
    } finally {
      tensor.dispose();
      for (const value of Object.values(output || {})) value.dispose();
    }
  }
  return results;
}

export async function splitGrid(buffer, side) {
  const { width, height } = await sharp(buffer).metadata();
  const tiles = [];
  for (let row = 0; row < side; row++) for (let col = 0; col < side; col++) {
    const left = Math.round(col * width / side), top = Math.round(row * height / side);
    tiles.push(await sharp(buffer).extract({ left, top,
      width: Math.round((col + 1) * width / side) - left,
      height: Math.round((row + 1) * height / side) - top }).png().toBuffer());
  }
  return tiles;
}
