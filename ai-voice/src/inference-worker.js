import {env,pipeline,StyleTextToSpeech2Model,AutoTokenizer,AutoModelForCausalLM} from '@huggingface/transformers';
import {KokoroTTS} from 'kokoro-js';
env.allowLocalModels=false;
env.backends.onnx.wasm.numThreads=1;
env.backends.onnx.wasm.proxy=false;
env.backends.onnx.wasm.wasmPaths='https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1/dist/';
let model=null,kind=null;
const models={tts:'onnx-community/Kokoro-82M-v1.0-ONNX',asr:'onnx-community/whisper-tiny.en',llm:'onnx-community/Qwen3-0.6B-ONNX'};
async function load(type,id){
 if(kind===type&&model)return;
 if(model){await (model.dispose?.()||model.model?.dispose?.());model=null;kind=null;}
 const progress_callback=p=>self.postMessage({id,progress:p});
 if(type==='tts'){const options={dtype:'q8',device:'wasm',revision:'1939ad2a8e416c0acfeecc08a694d14ef25f2231',progress_callback};const [weights,tokenizer]=await Promise.all([StyleTextToSpeech2Model.from_pretrained(models.tts,options),AutoTokenizer.from_pretrained(models.tts,options)]);model=new KokoroTTS(weights,tokenizer);}
 else if(type==='asr')model=await pipeline('automatic-speech-recognition',models.asr,{dtype:'q8',device:'wasm',revision:'2575352d61be1bf7225cf8f8b268a4678025fc58',progress_callback});
 else {const options={dtype:'q8',device:'wasm',revision:'1e0a4a196ecabdf9a879664110574563d3f372d3',progress_callback};const [weights,tokenizer]=await Promise.all([AutoModelForCausalLM.from_pretrained(models.llm,options),AutoTokenizer.from_pretrained(models.llm,options)]);model={model:weights,tokenizer,dispose:()=>weights.dispose()};}
 kind=type;
}
self.onmessage=async({data})=>{const {id,type,payload}=data;try{
 const start=performance.now();await load(type,id);
 if(type==='tts'){const audio=await model.generate(payload.text.replace(/\bMGI\b/g,'M G I').replace(/\bBPO\b/g,'B P O').replace(/\bSDR\b/g,'S D R'),{voice:payload.voice||'af_heart',speed:1});self.postMessage({id,result:{audio:audio.audio,sampling_rate:audio.sampling_rate,ms:performance.now()-start}},[audio.audio.buffer]);}
 else if(type==='asr'){const r=await model(payload.audio,{max_new_tokens:100,chunk_length_s:25,stride_length_s:3});self.postMessage({id,result:{text:r.text,ms:performance.now()-start}});}
 else {const inputs=model.tokenizer.apply_chat_template(payload.messages,{add_generation_prompt:true,enable_thinking:false,tokenize:true,return_dict:true});const output=await model.model.generate({...inputs,max_new_tokens:110,do_sample:false,repetition_penalty:1.08});const ids=output.tolist()[0].slice(inputs.input_ids.dims.at(-1));const answer=model.tokenizer.decode(ids,{skip_special_tokens:true}).replace(/<think>[\s\S]*?<\/think>/g,'').trim();self.postMessage({id,result:{text:answer,ms:performance.now()-start}});}
 }catch(error){self.postMessage({id,error:String(error.message||error)});}};
