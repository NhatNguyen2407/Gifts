
(()=>{
 if(!window.TINY_PERF?.mobile)return;
 const sync=()=>document.documentElement.classList.toggle('tiny-page-hidden',document.hidden);
 document.addEventListener('visibilitychange',sync,{passive:true});sync();
})();
