// Offline regression: cold grid/classifier startup and identical result digest.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { InferenceClient } from '../inference-client.mjs';
const infer=new InferenceClient();
try {
  const image=readFileSync(process.argv[2]); const start=performance.now();
  const tiles=await infer.run('split-grid',{buffer:image,side:3}); const splitMs=performance.now()-start;
  const result=await infer.run('classify',{buffers:tiles});
  assert.equal(result.length,9);
  console.log(JSON.stringify({splitMs:Math.round(splitMs),totalMs:Math.round(performance.now()-start),
    digest:createHash('sha256').update(JSON.stringify(result)).digest('hex'),tiles:tiles.length}));
  if(process.argv.includes('--without-transformers')) {
    await assert.rejects(infer.run('detect',{buffer:image}),/INFERENCE_UNAVAILABLE/);
    console.log(JSON.stringify({detectorStillRequiresTransformers:true}));
  }
} finally {await infer.close();}
