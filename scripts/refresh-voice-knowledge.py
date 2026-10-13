#!/usr/bin/env python3
"""Build voice knowledge from the canonical sitemap; fail closed on incomplete refresh."""
import argparse, concurrent.futures, datetime, hashlib, json, pathlib, re, subprocess, xml.etree.ElementTree as ET
from html.parser import HTMLParser
ROOT=pathlib.Path(__file__).resolve().parents[1]
BASE='https://www.mgiglobalgroup.com'
class MainParser(HTMLParser):
 def __init__(self):
  super().__init__(); self.depth=0; self.skip=0; self.tag=None; self.parts=[]; self.blocks=[]; self.heading='Overview'; self.title=''; self.in_title=False
 def handle_starttag(self,tag,attrs):
  if tag=='title': self.in_title=True
  if tag=='main': self.depth=1
  elif self.depth:
   if tag in ('script','style','noscript','form'): self.skip+=1
   if tag in ('h1','h2','h3','h4','p','li','dt','dd') and not self.skip:
    self.flush(); self.tag=tag; self.parts=[]
 def handle_endtag(self,tag):
  if tag=='title': self.in_title=False
  if tag=='main': self.flush(); self.depth=0
  if self.depth:
   if tag==self.tag: self.flush()
   if tag in ('script','style','noscript','form') and self.skip: self.skip-=1
 def handle_data(self,data):
  if self.in_title: self.title+=data
  if self.depth and not self.skip and self.tag: self.parts.append(data)
 def flush(self):
  t=re.sub(r'\s+',' ',' '.join(self.parts)).strip()
  if self.tag and self.tag.startswith('h'): self.heading=t
  elif len(t)>9 and not re.match(r'^(Request |Chat on WhatsApp|Explore related|See how |Practical buyer|Review |Explore |Read |See |Learn more:)',t): self.blocks.append((self.heading,t+('.' if self.tag=='li' and t[-1] not in '.!?' else '')))
  self.tag=None;self.parts=[]
def fetch(url):
 return subprocess.check_output(['curl','-fLsS','--retry','2','--max-time','35',url],text=True)
def build(local=False):
 sitemap=(ROOT/'sitemap.xml').read_text() if local else fetch(BASE+'/sitemap.xml')
 urls=sorted({e.text.replace('https://mgiglobalgroup.com',BASE) for e in ET.fromstring(sitemap).iter() if e.tag.endswith('loc') and e.text})
 urls=[u for u in urls if '/ai-voice' not in u and '/careers' not in u and '/terms' not in u and '/privacy' not in u]
 def read(url):
  path=url.removeprefix(BASE).strip('/')
  if local:
   p=ROOT/(path+'/index.html' if path else 'index.html')
   if not p.exists(): p=ROOT/(path+'.html')
   html=p.read_text()
  else: html=fetch(url)
  parser=MainParser();parser.feed(html);parser.flush()
  if not parser.blocks: raise ValueError('No main content: '+url)
  groups={}
  for heading,text in parser.blocks: groups.setdefault(heading,[]).append(text)
  return {'url':url,'title':parser.title.strip(),'sections':[{'heading':h,'text':' '.join(dict.fromkeys(v))} for h,v in groups.items()]}
 with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool: pages=list(pool.map(read,urls))
 chunks=[];seen=set()
 for page in pages:
  for section in page['sections']:
   # Preserve paragraph/section boundaries and full page references.
   sentences=re.split(r'(?<=[.!?])\s+',section['text']);buf=''
   for s in sentences+['']:
    if buf and (len(buf)+len(s)>1000 or not s):
     fingerprint=hashlib.sha256(buf.lower().encode()).hexdigest()
     if fingerprint not in seen:
      chunks.append({'id':fingerprint[:12],'url':page['url'],'title':page['title'],'heading':section['heading'],'text':buf.strip()});seen.add(fingerprint)
     buf=''
    if s: buf+=' '+s
 out={'version':2,'updatedAt':datetime.datetime.now(datetime.timezone.utc).isoformat(),'source':BASE,'pages':[{k:p[k] for k in ('url','title')} for p in pages],'chunks':chunks}
 assert len(pages)>20 and len(chunks)>40, 'Incomplete knowledge'
 target=ROOT/'ai-voice/knowledge.json';temp=target.with_suffix('.tmp');temp.write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n');temp.replace(target)
 print(f'Refreshed {len(pages)} canonical pages / {len(chunks)} unique sections ({"repository" if local else "live crawl"}).')
if __name__=='__main__':
 ap=argparse.ArgumentParser();ap.add_argument('--local',action='store_true');build(ap.parse_args().local)
