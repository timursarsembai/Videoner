import fs from 'node:fs';
await import('../../resolver.mjs');
console.log(JSON.stringify({ heavy: /onnxruntime|libvips/.test(fs.readFileSync('/proc/self/maps', 'utf8')) }));
