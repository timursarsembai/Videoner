import fs from 'node:fs';
// Run inside an isolated image with /models already warmed; never downloads.
const steps = Number(process.env.BENCH_STEPS || 20);
if (!Number.isInteger(steps) || steps < 1 || steps > 100) throw new Error('Invalid BENCH_STEPS');
const arena=process.env.BENCH_ARENA!=='0';
const mark=(phase,extra={})=>{let swap=0,peak=0;try{swap=+fs.readFileSync('/sys/fs/cgroup/memory.swap.current','utf8');peak=+fs.readFileSync('/sys/fs/cgroup/memory.peak','utf8')}catch{}console.log(JSON.stringify({phase,arena,...process.memoryUsage(),cgroupPeak:peak,swap,...extra}));};
mark('node-start');
const sharp=(await import('sharp')).default;
const {pipeline,RawImage,env}=await import('@huggingface/transformers');
const ort=await import('onnxruntime-node');
env.cacheDir='/models';env.allowRemoteModels=false;
const options={intraOpNumThreads:1,interOpNumThreads:1,enableCpuMemArena:arena,enableMemPattern:process.env.BENCH_PATTERN!=='0'};
mark('imports');
const start=Date.now();
const cls=await ort.InferenceSession.create('/models/recaptcha-classification-small.onnx',{executionProviders:['cpu'],...options});
const input=new ort.Tensor('float32',new Float32Array(3*224*224).fill(0.5),[1,3,224,224]);
for(let i=0;i<steps;i++){const out=await cls.run({[cls.inputNames[0]]:input});for(const t of Object.values(out))t.dispose();if(i===0||i===steps-1)mark('classifier-'+i);}
input.dispose();mark('classifier-done',{ms:Date.now()-start});
const detector=await pipeline('object-detection','Xenova/yolos-tiny',{dtype:'q8',device:'cpu',revision:'e2f9c7673f0fa61849efe2b56a0d7774779ebb9d',session_options:options});
const buf=await sharp({create:{width:400,height:400,channels:3,background:{r:100,g:140,b:180}}}).png().toBuffer();
const image=await RawImage.fromBlob(new Blob([buf]));
const dstart=Date.now();
for(let i=0;i<steps;i++){await detector(image,{threshold:0.3,percentage:true});if(i===0||i===steps-1)mark('detector-'+i);}
mark('detector-done',{ms:Date.now()-dstart});
await cls.release();await detector.dispose();mark('disposed');
setTimeout(()=>{mark('idle-10s');process.exit(0);},10000);
