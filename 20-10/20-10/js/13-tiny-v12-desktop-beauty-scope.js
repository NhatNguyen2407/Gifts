
(() => {
  if(window.TINY_PERF?.mobile)return;
  const stage=document.getElementById('beauty-stage');
  if(!stage)return;
  const root=document.documentElement;
  const sync=()=>root.classList.toggle('tiny-pc-beauty-v12',stage.classList.contains('hien-thi'));
  new MutationObserver(sync).observe(stage,{attributes:true,attributeFilter:['class']});
  sync();
})();
