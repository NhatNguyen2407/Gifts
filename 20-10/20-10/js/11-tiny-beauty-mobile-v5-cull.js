
(()=>{
 'use strict';
 if(!window.TINY_PERF?.mobile)return;
 const decor=document.getElementById('decor-beauty');
 const stage=document.getElementById('beauty-stage');
 if(!decor||!stage)return;
 // Keep a handful of meaningful pieces. Duplicate detail is physically removed,
 // not merely hidden with display:none while its CSS animation runs.
 const trim=(selector,limit)=>{
   const nodes=[...document.querySelectorAll(selector)];
   nodes.slice(limit).forEach(node=>node.remove());
   return nodes.slice(0,limit);
 };
 const petals=trim('#decor-beauty .tiny-beauty-petal',4);
 trim('#decor-beauty .tiny-beauty-glint',3);
 trim('#decor-beauty .tiny-beauty-firefly',4);
 trim('#beauty-stage .wish-twinkle',3);
 trim('#decor-beauty .tiny-meadow-blossom',7);
 // Right butterfly is already CSS-hidden on V4; drop it from the DOM.
 const spareButterfly=stage.querySelector('.butterfly-wrap.right');
 if(spareButterfly)spareButterfly.remove();
 petals.forEach((petal,i)=>{
   petal.style.setProperty('--tiny-v5-delay',`${(i*.38).toFixed(2)}s`);
   petal.style.setProperty('--tiny-v5-duration',`${(6.8+i*.65).toFixed(2)}s`);
   // Once a flower leaves through the lower boundary, it should cease to exist.
   petal.addEventListener('animationend',event=>{
     if(event.animationName==='tinyPetalFall')petal.remove();
   },{once:true});
 });
 // Any moving ornament that is entirely outside the real viewport gets culled.
 // Excludes the falling petals (which start above the screen).
 if('IntersectionObserver' in window){
   const watch=[...decor.querySelectorAll('.tiny-beauty-glint,.tiny-beauty-firefly'),
                ...stage.querySelectorAll('.wish-twinkle,.butterfly-wrap')];
   const observer=new IntersectionObserver(entries=>{
     for(const entry of entries){
       if(!entry.isIntersecting){observer.unobserve(entry.target);entry.target.remove();}
     }
   },{root:null,rootMargin:'0px',threshold:0});
   watch.forEach(el=>observer.observe(el));
 }
 let wasShown=false;
 const sync=()=>{
   const shown=decor.classList.contains('is-visible');
   if(shown){wasShown=true;return;}
   if(!wasShown)return;
   // Wait for the opacity crossfade to finish before disposing of leftovers.
   wasShown=false;
   setTimeout(()=>{
     if(decor.classList.contains('is-visible'))return;
     decor.querySelectorAll('.tiny-beauty-petal,.tiny-beauty-firefly').forEach(el=>el.remove());
   },450);
 };
 new MutationObserver(sync).observe(decor,{attributes:true,attributeFilter:['class']});
 sync();
})();
