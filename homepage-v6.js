(function(){
'use strict';
var reduce=false;try{reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){}
var mobile=false;try{mobile=window.matchMedia('(max-width: 980px)').matches;}catch(e){}
function safe(fn){try{fn();}catch(e){}}
function injectMobileFix(){
  if(document.getElementById('v6-mobile-fix'))return;
  var s=document.createElement('style');
  s.id='v6-mobile-fix';
  s.textContent='@media(max-width:980px){'+
  '.home-v6 .topbar{z-index:220!important;background:#07111f!important;backdrop-filter:none!important;-webkit-backdrop-filter:none!important;box-shadow:0 1px 0 rgba(255,255,255,.08)!important}'+
  '.home-v6 .nav{position:fixed!important;left:12px!important;right:12px!important;top:78px!important;bottom:auto!important;z-index:219!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:6px!important;padding:14px!important;margin:0!important;max-height:calc(100dvh - 94px)!important;overflow-y:auto!important;-webkit-overflow-scrolling:touch;background:rgba(7,17,31,.985)!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:22px!important;box-shadow:0 28px 70px rgba(0,0,0,.34)!important;opacity:0!important;visibility:hidden!important;pointer-events:none!important;transform:translateY(-10px)!important;transition:opacity .18s ease,transform .22s cubic-bezier(.16,1,.3,1),visibility .18s ease!important}'+
  '.home-v6 .nav.open{opacity:1!important;visibility:visible!important;pointer-events:auto!important;transform:none!important}'+
  '.home-v6 .nav>a:not(.btn),.home-v6 .nav .nav-solutions>a{display:flex!important;align-items:center!important;min-height:52px!important;width:100%!important;padding:0 16px!important;border:1px solid rgba(255,255,255,.07)!important;border-radius:14px!important;background:rgba(255,255,255,.035)!important;color:#f6f8fb!important;font-size:1rem!important;font-weight:760!important;letter-spacing:-.01em!important}'+
  '.home-v6 .nav>a:not(.btn):after,.home-v6 .nav .nav-solutions>a:after{display:none!important}'+
  '.home-v6 .nav .nav-solutions{width:100%!important}'+
  '.home-v6 .nav .solutions-menu{display:none!important}'+
  '.home-v6 .nav .btn{display:flex!important;width:100%!important;min-height:54px!important;margin-top:4px!important;border-radius:14px!important;background:#246bfd!important;color:#fff!important}'+
  '.home-v6 .menu-btn{position:relative!important;z-index:221!important;display:grid!important;place-items:center!important;width:50px!important;height:50px!important;border-radius:16px!important;background:rgba(255,255,255,.06)!important;border:1px solid rgba(255,255,255,.18)!important;color:#fff!important}'+
  '.home-v6.nav-open:before,.home-v6.nav-open::before{content:"";position:fixed;inset:76px 0 0;z-index:210;background:rgba(3,9,17,.50);backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px)}'+
  '.home-v6 .v6-console{backdrop-filter:none!important;-webkit-backdrop-filter:none!important}'+
  '.home-v6 [data-v6-reveal]{opacity:1!important;transform:none!important;filter:none!important}'+
  '.home-v6 .v6-live i{animation:none!important;box-shadow:0 0 0 5px rgba(72,214,197,.10)!important}'+
  '}'+
  '@media(max-width:680px){.home-v6 .nav{top:70px!important;left:10px!important;right:10px!important;max-height:calc(100dvh - 82px)!important}.home-v6.nav-open:before,.home-v6.nav-open::before{inset:68px 0 0}}';
  document.head.appendChild(s);
}
function progress(){var bar=document.querySelector('.v6-progress i');if(!bar)return;var busy=false;function draw(){var d=document.documentElement;var max=Math.max(1,d.scrollHeight-window.innerHeight);var p=Math.max(0,Math.min(1,window.pageYOffset/max));bar.style.transform='scaleX('+p+')';busy=false;}function req(){if(!busy){busy=true;window.requestAnimationFrame(draw);}}draw();window.addEventListener('scroll',req,{passive:true});window.addEventListener('resize',req,{passive:true});}
function reveal(){if(mobile||reduce||!('IntersectionObserver' in window)||!Element.prototype.animate)return;var els=document.querySelectorAll('[data-v6-reveal]');var obs=new IntersectionObserver(function(entries){for(var i=0;i<entries.length;i++){var e=entries[i];if(e.isIntersecting){e.target.animate([{opacity:.72,transform:'translateY(12px)'},{opacity:1,transform:'translateY(0)'}],{duration:480,easing:'cubic-bezier(.16,1,.3,1)',fill:'none'});obs.unobserve(e.target);}}},{threshold:.08,rootMargin:'0px 0px -4% 0px'});for(var j=0;j<els.length;j++)obs.observe(els[j]);}
function consoleTilt(){if(reduce||mobile)return;var fine=false;try{fine=window.matchMedia('(pointer:fine)').matches;}catch(e){}if(!fine)return;var card=document.querySelector('.v6-console');if(!card)return;var rx=0,ry=0,cx=0,cy=0,raf=0;function tick(){cx+=(rx-cx)*.12;cy+=(ry-cy)*.12;card.style.transform='perspective(1000px) rotateX('+cy+'deg) rotateY('+cx+'deg)';if(Math.abs(rx-cx)>.02||Math.abs(ry-cy)>.02)raf=requestAnimationFrame(tick);else raf=0;}card.addEventListener('pointermove',function(ev){var r=card.getBoundingClientRect();rx=((ev.clientX-r.left)/r.width-.5)*3.6;ry=-((ev.clientY-r.top)/r.height-.5)*3;if(!raf)raf=requestAnimationFrame(tick);});card.addEventListener('pointerleave',function(){rx=0;ry=0;if(!raf)raf=requestAnimationFrame(tick);});}
function currentYear(){var y=document.querySelectorAll('[data-v6-year]');for(var i=0;i<y.length;i++)y[i].textContent=String(new Date().getFullYear());}
function boot(){safe(injectMobileFix);safe(progress);safe(reveal);safe(consoleTilt);safe(currentYear);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
