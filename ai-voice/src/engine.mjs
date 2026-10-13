// Grounded retrieval and policy gates are independent of the optional language model.
const stop=new Set('mgi offer provide included work team a an the of for to in on with from and or is are do does can could would will should i we you your our it that this what how tell me about please more explain much'.split(' '));
export function terms(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').split(/\s+/).filter(w=>w.length>1&&!stop.has(w)).map(w=>w.length>4&&w.endsWith('s')?w.slice(0,-1):w);}
const aliases={cost:'pricing quote budget',price:'pricing quote',rates:'pricing quote',hire:'onboarding team',hiring:'onboarding team',start:'onboarding pilot',setup:'onboarding',bpo:'outsourcing managed',va:'virtual assistant administrative',assistants:'administrative back office',support:'customer support',sdr:'sales development white label',secure:'data protection security',security:'data protection access',hipaa:'healthcare compliance',registered:'registration florida',legitimate:'verification florida',tools:'crm systems access',software:'crm systems technology',spanish:'languages bilingual',staff:'team members',employees:'team members',hours:'coverage schedule timezone',training:'onboarding training',quality:'assurance scorecard',metrics:'performance reporting',refund:'contract terms',guarantee:'guaranteed outcomes',guaranteed:'guarantee outcomes',nda:'confidentiality data protection'};
export function retrieve(kb,question,history=[]){
 let query=question; const original=terms(question);
 // Resolve short follow-ups using the previous user's topic, never arbitrary assistant output.
 if((/\b(it|they|those|them|that|their|these|same|also)\b/i.test(question)||original.length<3)&&history.length){const last=history.filter(m=>m.role==='user').at(-1);if(last)query=last.content+' '+query;}
 const words=[...new Set(terms(query).flatMap(w=>[w,...terms(aliases[w]||'')]))];
 const q=query.toLowerCase();let preferred=[];
 if(/\bservices?\b/.test(q)&&!/customer|sdr|back.office|appointment|calling|sales|quality/.test(q))preferred=['/services/'];
 if(/appointment|scheduling|schedule.*sales/.test(q))preferred.push('/services/appointment-setting/');
 if(/back.office|data entry|virtual assistant/.test(q))preferred.push('/services/back-office/');
 if(/white.label|sdr/.test(q))preferred.push('/services/white-label-sdr/');
 if(/agency|agencies|partnership/.test(q))preferred.push('/agency-partners/');
 if(/customer support|customer service|email.*chat/.test(q))preferred.push('/services/customer-support/');
 if(/crm hygiene|sales operation/.test(q))preferred.push('/services/sales-operations/');
 if(/quality assurance|quality control/.test(q))preferred.push('/services/quality-assurance/');
 if(/contact|email address|phone number/.test(q))preferred.push('/contact/');
 if(/registration|registered|florida|legitimate/.test(q))preferred.push('/company-verification/');
 if(/onboard|how.*start/.test(q))preferred.push('/client-onboarding/');
 if(/pricing|price|cost|rate/.test(q))preferred.push('/contact/');
 if(/data protection|security|confidential/.test(q))preferred.push('/client-data-protection/');
 if(/reporting|delivery standard/.test(q))preferred.push('/delivery-standards/');
 if(/calling software|calling tool|outbound/.test(q))preferred.push('/services/outbound-calling/');
 const N=kb.chunks.length,df=new Map();for(const c of kb.chunks){for(const w of new Set(terms(c.text+' '+c.heading)))df.set(w,(df.get(w)||0)+1);}
 const ranked=kb.chunks.map(c=>{const body=terms(c.text),counts=new Map();body.forEach(w=>counts.set(w,(counts.get(w)||0)+1));const title=terms(c.title+' '+c.heading+' '+c.url);const heading=terms(c.heading);let score=0,hits=0;for(const w of words){const tf=counts.get(w)||0;if(tf){hits++;score+=Math.log(1+(N-(df.get(w)||0)+.5)/((df.get(w)||0)+.5))*tf*2.2/(tf+1.2*(.25+.75*body.length/100));}if(title.includes(w)){score+=original.includes(w)?2.5:.4;if(original.includes(w))hits++;}if(heading.includes(w)&&original.includes(w))score+=4;}
 if(preferred.includes(new URL(c.url).pathname)&&hits)score+=14;if(c.heading.endsWith('?')&&hits)score+=4;if(preferred[0]==='/services/'&&c.url.endsWith('/services/')&&/business functions|operational capacity/i.test(c.heading))score+=20;
 if(c.url.includes('/insights/')&&!/compare|versus|difference|checklist|guide|saas/.test(q))score*=.65;
 if(c.url.endsWith('/real-estate/')&&!/investment|property portfolio/.test(q))score*=.25;
 if(/contact|email address|phone number/i.test(question)&&c.url.endsWith('/contact/')&&c.text.includes('@'))score+=20;
 if(c.url.endsWith('/growth-strategy/')&&!/expansion|strategy|2027/.test(q))score*=.3;
 return {...c,score,hits};}).filter(c=>c.hits>0).sort((a,b)=>b.score-a.score);
 const out=[],urls=new Map();for(const c of ranked){if(out.length>=4)break;if((urls.get(c.url)||0)>=2)continue;out.push(c);urls.set(c.url,(urls.get(c.url)||0)+1);}return out;
}
export function policy(question){
 if(/\b(ignore|disregard|override)\b.*\b(instruction|prompt|rule)|system prompt|api key|password|private.*(client|customer)|pretend.*(price|guarantee)/i.test(question))return 'I can help with published MGI services and company information. I cannot provide private credentials or make up business commitments. What would you like to know about MGI?';
 if(/^(hi|hello|hey|good morning|good afternoon)[!.\s]*$/i.test(question))return 'Welcome to MGI. I can help you explore managed teams, customer support, sales development and agency partnerships. What are you looking to support in your business?';
 if(/^(thanks|thank you|great|ok|okay|bye)[!.\s]*$/i.test(question))return 'You’re welcome. You can keep exploring here or contact the MGI team whenever you’re ready to discuss your requirements.';
 if(/\b(weather|recipe|football|bitcoin|stock market|write.*code|capital of|president|medical advice|legal advice)\b/i.test(question))return 'I focus on MGI’s published services and company information. I can help you explore outsourcing, team workflows or a potential partnership.';
 if(/\b(exact|fixed|hourly|monthly|per seat|per agent|how much|refund|discount|credit card)\b/i.test(question)&&/\b(price|pricing|rate|cost|pay|refund|discount|credit card|how much)\b/i.test(question))return 'MGI does not publish a fixed rate for every engagement. Pricing is scoped around the role, skills, hours, team size and workflow. The MGI team can confirm commercial terms and prepare a tailored proposal.';
 if(/\b(guarantee|guaranteed)\b/i.test(question))return 'MGI’s published service information does not promise guaranteed sales, booked meetings or error-free work. The team can agree on scope, quality criteria and pilot metrics with you.';
 if(/\b(hipaa|soc.?2|iso.?27001|pci.?dss|certified|certification)\b/i.test(question))return 'I cannot confirm that certification from the published information available to me. Please ask the MGI team to confirm the specific security or compliance requirements for your engagement.';
 if(/\b(how many|number of|list of|name.*client)\b.*\b(employees|staff|clients|customers)\b/i.test(question))return 'I do not have a verified public headcount or client roster to share. The MGI team can discuss delivery capacity and any references available for your proposed engagement.';
 if(/\b(tomorrow|today|immediately|available now|24.?7|spanish|bilingual|arabic|refund policy|favorite|favourite|founder|owner|headcount)\b/i.test(question))return 'I cannot confirm that specific detail or current availability from the published MGI information. The MGI team can confirm the requirements, staffing and timing for your engagement.';
 return null;
}
export function fallback(question,sources){
 const gate=policy(question);if(gate)return gate;
 if(!sources.length||sources[0].score<3)return 'I do not have enough published MGI information to confirm that. Could you clarify the service or requirement you mean? The MGI team can also help with a specific request.';
 if(/contact|email address|phone number/i.test(question)){const contact=sources.find(s=>s.url.endsWith('/contact/')&&s.text.includes('@'));if(contact){const email=contact.text.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/i)?.[0];const phone=contact.text.match(/\+1[ \d-]{10,20}/)?.[0]?.trim();return `You can reach MGI at ${email||'the contact page'}${phone?' or '+phone:''}. Share the service, team size and hours you need so the team can discuss a tailored proposal.`;}}
 const words=terms(question);const sentences=sources.slice(0,2).flatMap(c=>(c.text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[]).map(s=>s.trim())).filter(s=>s.length>35&&s.length<420&&!/↗|→/.test(s));
 sentences.sort((a,b)=>words.filter(w=>terms(b).includes(w)).length-words.filter(w=>terms(a).includes(w)).length);
 return [...new Set(sentences)].slice(0,2).join(' ')||'Please review the linked MGI service pages or contact the team to confirm this requirement.';
}
export function validateAnswer(answer,sources){
 if(/MGI\s*\((?!Miami Global)|likely referring|as an ai|sorry.*cannot assist/i.test(answer||''))return false;
 if(!answer||answer.length>1600||/\b(system|assistant|user):|<\|/.test(answer))return false;
 const facts=sources.map(s=>s.text).join(' ').toLowerCase();
 const numbers=answer.match(/\b\d[\d,.]*\b/g)||[];if(numbers.some(n=>!facts.includes(n.toLowerCase())))return false;
 if(/\b(guarantee|certified|unlimited|instant|always available|we have \d|i have sent|i have booked)\b/i.test(answer))return false;
 if((answer.match(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi)||[]).some(e=>!facts.includes(e.toLowerCase())))return false;
 const useful=terms(answer).filter(w=>w.length>3);return useful.length>3&&useful.filter(w=>facts.includes(w)).length/useful.length>=.65;
}
export function messages(question,history,sources){
 const context=sources.slice(0,3).map((s,i)=>`[${i+1}] ${s.heading}: ${s.text}`).join('\n').slice(0,2000);
 return [{role:'system',content:'You are the assistant for Miami Global Investments Group LLC (MGI). Give a brief, friendly business answer in 2 sentences. Use the provided MGI facts. Do not add facts.'},...history.slice(-4),{role:'user',content:`MGI WEBSITE FACTS:\n${context}\n\nQUESTION: ${question}\n\nAnswer the question using only these facts. If they do not answer it, say the MGI team can confirm. No invented prices, guarantees, certifications or staffing. Two short sentences, no bullet list.\nANSWER:`}];
}
