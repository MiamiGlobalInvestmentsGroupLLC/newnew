// Run from an isolated npm environment: node ai-voice/src/build.mjs /path/to/node_modules
import {createRequire} from 'node:module';import fs from 'node:fs';import path from 'node:path';import {fileURLToPath} from 'node:url';
const here=path.dirname(fileURLToPath(import.meta.url));const deps=path.resolve(process.argv[2]||'node_modules');const require=createRequire(path.join(deps,'../package.json'));const {build}=require('esbuild');
await build({entryPoints:[path.join(here,'inference-worker.js')],outfile:path.join(here,'../worker.js'),bundle:true,format:'esm',platform:'browser',minify:true,plugins:[{name:'pin-kokoro-voices',setup(b){b.onLoad({filter:/kokoro-js.*dist.*kokoro\.js$/},async({path:p})=>({contents:fs.readFileSync(p,'utf8').replaceAll('resolve/main/voices/','resolve/1939ad2a8e416c0acfeecc08a694d14ef25f2231/voices/'),loader:'js'}));}}],nodePaths:[deps],legalComments:'linked'});
for(const [pkg,name] of [['@huggingface/transformers','transformers'],['kokoro-js','kokoro'],['phonemizer','phonemizer']]){const dir=path.join(deps,pkg);const file=['LICENSE','LICENSE.txt'].find(f=>fs.existsSync(path.join(dir,f)));if(file)fs.copyFileSync(path.join(dir,file),path.join(here,'../vendor',name+'-LICENSE.txt'));}

// Package the compiled worker into source modules for small repository uploads.
const compiled=fs.readFileSync(path.join(here,'../worker.js'),'utf8');
const runtime=path.join(here,'../runtime');fs.mkdirSync(runtime,{recursive:true});
for(const file of fs.readdirSync(runtime))if(/^part-\d+\.js$/.test(file))fs.unlinkSync(path.join(runtime,file));
const names=[];for(let i=0,start=0;start<compiled.length;i++,start+=45000){const name='part-'+String(i).padStart(2,'0')+'.js';names.push(name);fs.writeFileSync(path.join(runtime,name),'export default '+JSON.stringify(compiled.slice(start,start+45000))+';\n');}
const imports=names.map((n,i)=>'import p'+i+' from "./runtime/'+n+'";').join('\n');
fs.writeFileSync(path.join(here,'../worker.js'),imports+'\nconst source=['+names.map((_,i)=>'p'+i).join(',')+'].join("");\nconst pending=[];const enqueue=event=>pending.push(event);self.addEventListener("message",enqueue);\nconst url=URL.createObjectURL(new Blob([source],{type:"text/javascript"}));\ntry { await import(url); self.removeEventListener("message",enqueue); for(const event of pending)self.onmessage?.(event); } finally { URL.revokeObjectURL(url); }\n');
