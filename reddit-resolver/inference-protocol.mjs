const MAX_IMAGE = 4 * 1024 * 1024;
const MAX_TOTAL = 8 * 1024 * 1024;
export function validInferenceInput(op, payload) {
  const image = b => b instanceof Uint8Array && b.byteLength > 0 && b.byteLength <= MAX_IMAGE;
  if (op === 'detect') return image(payload?.buffer);
  if (op === 'split-grid') return image(payload?.buffer) && payload.side === 3;
  if (op === 'classify') return Array.isArray(payload?.buffers) && payload.buffers.length > 0 && payload.buffers.length <= 9 &&
    payload.buffers.every(image) && payload.buffers.reduce((n, b) => n + b.byteLength, 0) <= MAX_TOTAL;
  if (op === 'transcribe') return (Array.isArray(payload?.samples) || payload?.samples instanceof Float32Array) &&
    payload.samples.length > 0 && payload.samples.length <= 480000 && payload.samples.every(Number.isFinite);
  return false;
}
export function validInferenceResult(op, result, payload) {
  if (op === 'split-grid') return Array.isArray(result) && result.length === 9 &&
    result.every(b => b instanceof Uint8Array && b.byteLength <= MAX_IMAGE) && result.reduce((n, b) => n + b.byteLength, 0) <= MAX_TOTAL;
  if (op === 'transcribe') return typeof result === 'string' && result.length <= 1000;
  const score = item => typeof item?.label === 'string' && item.label.length <= 200 && Number.isFinite(item.score);
  if (op === 'classify') return Array.isArray(result) && result.length <= 9 && result.length === payload?.buffers?.length && result.every(row =>
    Array.isArray(row) && row.length > 0 && row.length <= 100 && row.every(score));
  if (op === 'detect') return Array.isArray(result) && result.length <= 1000 && result.every(item =>
    score(item) && ['xmin', 'ymin', 'xmax', 'ymax'].every(key => Number.isFinite(item.box?.[key])));
  return false;
}
