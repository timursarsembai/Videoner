import { env, pipeline, RawImage } from '@huggingface/transformers';
import { pathToFileURL } from 'node:url';
import { getTileModel, classifyTileImages } from './tile-model.mjs';

env.cacheDir = process.env.MODEL_CACHE_DIR || '/models';
// Runtime can be made strictly offline after warmup. No inference API is used.
env.allowRemoteModels = process.env.MODEL_OFFLINE !== '1';

let detector;
let transcriber;
const SESSION_OPTIONS = { intraOpNumThreads: 1, interOpNumThreads: 1, enableCpuMemArena: false };
export async function getClassifier() {
  return getTileModel();
}

export async function getDetector() {
  detector ??= pipeline('object-detection', 'Xenova/yolos-tiny', {
    dtype: 'q8', device: 'cpu', revision: 'e2f9c7673f0fa61849efe2b56a0d7774779ebb9d',
    session_options: SESSION_OPTIONS,
  }).catch(error => { detector = undefined; throw error; });
  return detector;
}

export async function detectObjects(buffer) {
  const model = await getDetector();
  return model(await RawImage.fromBlob(new Blob([buffer])), { threshold: 0.3, percentage: true });
}

export async function getTranscriber() {
  transcriber ??= pipeline('automatic-speech-recognition', 'Xenova/whisper-tiny.en', {
    dtype: 'q8', device: 'cpu', revision: '79fb389fc764e7c395bd330e9531d9d32ada7049',
    session_options: SESSION_OPTIONS,
  }).catch(error => { transcriber = undefined; throw error; });
  return transcriber;
}

export async function transcribe(samples) {
  const model = await getTranscriber();
  const result = await model(new Float32Array(samples));
  return result.text.trim().replace(/[.,!?]/g, '');
}

export async function classifyTiles(buffers) {
  return classifyTileImages(buffers);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await getClassifier();
  await getDetector();
  await getTranscriber();
  console.log(JSON.stringify({ ready: true, inference: 'local-cpu' }));
}
