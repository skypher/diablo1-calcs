(()=>{
  const d=document; const script=d.currentScript;
  const base=new URL('../embed.js', script.src).href;
  const calc="life-mana-calculator.html";
  const title="Life & Mana Calculator";
  const params=new URLSearchParams({calc,title});
  ['width','maxWidth','height'].forEach(k=>{const v=script.dataset?.[k]; if(v) params.set(k,v);});
  const s=d.createElement('script');
  s.src=base+'?'+params.toString();
  s.async=true;
  (script.parentNode||d.head||d.documentElement).insertBefore(s,script);
})();
