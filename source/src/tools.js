/* ================= teaching tools: counters + ten-frames, number line ================= */
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
function fly(fromRect,toRect,gold){
  if(reduceMotion()||!fromRect||!toRect||!fromRect.width) return Promise.resolve();
  return new Promise(res=>{
    const el=document.createElement('div'); el.className='fly'+(gold?' gold':'');
    const w=fromRect.width*0.84;
    el.style.cssText=`left:${fromRect.left+fromRect.width*0.08}px;top:${fromRect.top+fromRect.height*0.08}px;width:${w}px;height:${w}px`;
    document.body.appendChild(el);
    const dx=toRect.left-fromRect.left, dy=toRect.top-fromRect.top;
    const a=el.animate([{transform:'translate(0,0) scale(1)'},{transform:`translate(${dx*.5}px,${dy*.5-30}px) scale(1.15)`},{transform:`translate(${dx}px,${dy}px) scale(1)`}],{duration:380,easing:'ease-in-out'});
    a.onfinish=()=>{el.remove();res();}; a.oncancel=()=>{el.remove();res();};
  });
}

class CounterTool{
  constructor(root,q,cb){this.root=root;this.q=q;this.cb=cb||{};this.alive=true;this.root.addEventListener('click',e=>this.onClick(e));this.init();}
  init(){
    const q=this.q;
    this.mode=q.kind==='bond'?'bond':q.kind==='add'?(q.teen?'teen':'add'):'sub';
    this.A=Array(10).fill(0); this.B=Array(10).fill(0);
    this.merged=false; this.merging=false; this.busy=false; this.touched=false; this.order=[]; this.removed=0; this.hl='';
    if(this.mode==='bond'){ for(let i=0;i<q.a;i++) this.A[i]=1; }
    else if(this.mode==='teen'){ this.A.fill(1); for(let i=0;i<q.teen.o;i++) this.B[i]=1; }
    else if(this.mode==='add'){ for(let i=0;i<q.big;i++) this.A[i]=1; for(let i=0;i<q.small;i++) this.B[i]=1; }
    else { const n=q.sub.n; if(n>10){ this.A.fill(1); for(let i=0;i<n-10;i++) this.B[i]=1; } else { for(let i=0;i<n;i++) this.A[i]=1; } this.target=q.sub.m; this.r0=Math.max(0,n-10); }
    this.draw(); this.updateNote();
  }
  reset(){ this.init(); }
  slotEl(f,i){return this.root.querySelector(`.slot[data-f="${f}"][data-i="${i}"]`);}
  counterHTML(state,f){
    if(state===0) return '';
    const cls=['ct']; if(state===2) cls.push('added'); if(state===3) cls.push('off');
    if((this.mode==='bond'&&state===1)||(this.mode==='add'&&f==='A'&&state===1)||(this.mode==='teen'&&state===1)) cls.push('fixed');
    return `<div class="${cls.join(' ')}"></div>`;
  }
  frameHTML(f,arr,cap,extra=''){
    const full=arr.every(v=>v===1||v===2);
    let h=`<div class="tf-col"><div class="tf-cap">${cap}</div><div class="tf-frame${this.hl===f?' glow':''}${full&&f==='A'?' full':''}${extra}" data-f="${f}">`;
    for(let i=0;i<10;i++){
      const st=arr[i]; let tap='';
      if(this.mode==='bond'&&f==='A') tap=' tap';
      if(this.mode==='add'&&f==='B'&&st===1) tap=' tap';
      if(this.mode==='teen'&&f==='B'&&st!==1) tap=' tap';
      if(this.mode==='sub'&&(st===1||st===3)) tap=' tap';
      h+=`<div class="slot${tap}" data-f="${f}" data-i="${i}" role="button" aria-label="${f==='A'?'First':'Second'} frame, place ${i+1}">${this.counterHTML(st,f)}</div>`;
    }
    return h+'</div></div>';
  }
  draw(){
    const q=this.q; let h='<div class="tf-pair">';
    if(this.mode==='bond'){
      h+=this.frameHTML('A',this.A,`Feeding tray: <b>${q.a}</b> so far`);
    }else if(this.mode==='teen'){
      h+=this.frameHTML('A',this.A,'A full ten');
      h+=this.frameHTML('B',this.B,`<b>${q.teen.o}</b> ones. Add <b>${q.teen.u}</b> more`);
    }else if(this.mode==='add'){
      h+=(this.merged?`<div class="tf-col"><div class="tf-cap">One ten</div><div class="ten-token">10</div></div>`:this.frameHTML('A',this.A,`Start with the bigger number: <b>${q.big}</b>`));
      h+=this.frameHTML('B',this.B,this.merged?'Left over':`Move these across: <b>${q.small}</b>`);
    }else if(q.sub.n<=10){
      h+=this.frameHTML('A',this.A,`<b>${q.sub.n}</b> counters`);
    }else{
      h+=this.frameHTML('A',this.A,'A full ten');
      h+=this.frameHTML('B',this.B,`<b>${q.sub.n-10}</b> ${q.noBridge?'ones':'extra'}`);
    }
    h+='</div><div class="tool-note" data-note></div>';
    this.root.innerHTML=h; this.updateNote();
  }
  count(arr){return arr.filter(v=>v===1||v===2).length;}
  updateNote(){
    const el=this.root.querySelector('[data-note]'); if(!el) return;
    if(this.custom){el.innerHTML=this.custom;return;}
    let t='';
    if(this.mode==='bond'){ const added=this.A.filter(v=>v===2).length; t=this.count(this.A)===10?`Ten! You added <b>${added}</b>.`:`You have added <b>${added}</b>. Tap an empty circle to add a counter.`; }
    else if(this.mode==='teen'){ const added=this.B.filter(v=>v===2).length; t=added>=this.q.teen.u?`You added <b>${added}</b> to the ones.`:`You have added <b>${added}</b> of <b>${this.q.teen.u}</b>. Tap an empty circle in the second frame.`; }
    else if(this.mode==='add'){ t=this.q.noBridge&&!this.merged?(this.count(this.B)===0?'Now count all the counters.':'Tap counters in the second frame to move them across.'):this.merged?`<b>10</b> and <b>${this.count(this.B)}</b> more.`:`Tap counters in the second frame to move them across.`; }
    else { const left=this.count(this.A)+this.count(this.B); t=this.removed>=this.target?`You took away <b>${this.removed}</b>. Counters left: <b>${left}</b>.`:`Taken away: <b>${this.removed}</b> of <b>${this.target}</b>. Tap counters to take them away.`; }
    el.innerHTML=t;
  }
  note(html){this.custom=html;this.updateNote();}
  setHighlight(f){this.hl=f||'';const fr=this.root.querySelector(`.tf-frame[data-f="${f}"]`); this.root.querySelectorAll('.tf-frame').forEach(x=>x.classList.remove('glow')); if(fr) fr.classList.add('glow');}
  onClick(e){
    if(!this.alive||this.busy||this.merging) return;
    const slot=e.target.closest('.slot'); if(!slot||!this.root.contains(slot)) return;
    const f=slot.dataset.f, i=+slot.dataset.i;
    this.custom=null;
    if(this.mode==='bond'&&f==='A'){
      if(this.A[i]===2){ this.A[i]=0; this.touch(); this.draw(); Audio_.fx('tap'); }
      else if(this.A[i]===0){ const j=this.A.indexOf(0); this.A[j]=2; this.touch(); this.draw(); Audio_.fx('pop'); const c=this.slotEl('A',j).querySelector('.ct'); if(c&&!reduceMotion()) c.animate([{transform:'scale(.2)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:260}); if(this.count(this.A)===10){Audio_.fx('ten');} }
    }else if(this.mode==='teen'&&f==='B'){
      if(this.B[i]===2){ this.B[i]=0; this.touch(); this.draw(); Audio_.fx('tap'); }
      else if(this.B[i]===0){ const j=this.B.indexOf(0); this.B[j]=2; this.touch(); this.draw(); Audio_.fx('pop'); const c=this.slotEl('B',j).querySelector('.ct'); if(c&&!reduceMotion()) c.animate([{transform:'scale(.2)'},{transform:'scale(1.15)'},{transform:'scale(1)'}],{duration:260}); }
    }else if(this.mode==='add'&&f==='B'&&this.B[i]===1){ this.touch(); this.moveToA(i); }
    else if(this.mode==='sub'){
      if(this.A[i]===1&&f==='A'||this.B[i]===1&&f==='B'){
        if(this.removed>=this.target){ this.note(`You have taken away enough. Counters left: <b>${this.count(this.A)+this.count(this.B)}</b>.`); return; }
        (f==='A'?this.A:this.B)[i]=3; this.removed++; this.order.push(f); this.touch(); Audio_.fx('tap'); this.draw();
      }else if((f==='A'?this.A:this.B)[i]===3){
        (f==='A'?this.A:this.B)[i]=1; this.removed--; const k=this.order.lastIndexOf(f); if(k>=0) this.order.splice(k,1); this.touch(); this.draw();
      }
    }
  }
  touch(){this.touched=true; if(this.cb.onTouch) this.cb.onTouch();}
  async moveToA(bi){
    const j=this.A.indexOf(0); if(j<0){ this.note('That frame is full. That makes a ten!'); return; }
    const fromEl=this.slotEl('B',bi).querySelector('.ct'); const fr=fromEl?fromEl.getBoundingClientRect():null;
    this.B[bi]=0; this.A[j]=2; this.busy=true; this.draw();
    const toEl=this.slotEl('A',j).querySelector('.ct'); if(toEl) toEl.classList.add('hide');
    Audio_.fx('pop');
    await fly(fr,toEl?toEl.getBoundingClientRect():null,true);
    if(toEl) toEl.classList.remove('hide'); this.busy=false;
    if(this.A.indexOf(0)<0) await this.doMerge();
  }
  async doMerge(){
    this.merging=true; Audio_.fx('ten');
    const fr=this.root.querySelector('.tf-frame[data-f="A"]'); if(!fr){this.merging=false;return;}
    fr.classList.add('full'); await sleep(reduceMotion()?10:550);
    const r=fr.getBoundingClientRect(), cx=r.left+r.width/2, cy=r.top+r.height/2;
    fr.querySelectorAll('.ct').forEach(c=>{const b=c.getBoundingClientRect(); c.style.setProperty('--mx',(cx-(b.left+b.width/2))+'px'); c.style.setProperty('--my',(cy-(b.top+b.height/2))+'px'); c.classList.add('merge');});
    await sleep(reduceMotion()?10:520);
    this.merged=true; this.merging=false; this.draw();
  }
  strategyUsed(){
    if(this.mode==='bond') return this.count(this.A)===10&&this.A.some(v=>v===2);
    if(this.mode==='teen') return this.B.filter(v=>v===2).length===this.q.teen.u;
    if(this.mode==='add') return this.q.noBridge?this.count(this.B)===0:(this.merged||this.count(this.A)===10);
    if(this.q.noBridge) return this.removed>=this.target&&(this.q.sub.n<=10||this.order.every(x=>x==='B'));
    return this.r0>0&&this.order.length>=this.r0&&this.order.slice(0,this.r0).every(x=>x==='B');
  }
  /* animated worked example */
  async demo(){
    this.reset(); this.alive=true; this.busy=true; await sleep(450);
    const q=this.q;
    if(this.mode==='bond'){
      for(let k=0;k<10-q.a;k++){ const j=this.A.indexOf(0); this.A[j]=2; this.draw(); Audio_.fx('pop'); await sleep(650); }
      this.note(`${q.a} and <b>${10-q.a}</b> more make ten.`);
    }else if(this.mode==='teen'){
      for(let k=0;k<q.teen.u;k++){ const j=this.B.indexOf(0); this.B[j]=2; this.draw(); Audio_.fx('pop'); await sleep(600); }
      this.note(`<b>${q.teen.o}</b> and <b>${q.teen.u}</b> make <b>${q.teen.o+q.teen.u}</b>, with the ten that is <b>${q.land}</b>.`);
    }else if(this.mode==='add'&&q.noBridge){
      this.busy=false; for(let k=0;k<q.small;k++){ const bi=this.B.findIndex(v=>v===1); if(bi<0) break; await this.moveToA(bi); await sleep(250); }
      await sleep(600); this.note(`<b>${q.big}</b> and <b>${q.small}</b> together make <b>${q.land}</b>.`);
    }else if(this.mode==='add'){
      const need=10-q.big; this.busy=false;
      for(let k=0;k<need;k++){ const bi=this.B.findIndex(v=>v===1); await this.moveToA(bi); await sleep(250); }
      await sleep(900);
      this.note(`<b>${q.big}</b> needed <b>${need}</b> to make ten. <b>${q.small-need}</b> are left, so <b>10 + ${q.small-need}</b>.`);
    }else if(q.noBridge){
      const n=q.sub.n,m=q.sub.m;
      for(let k=0;k<m;k++){ if(n>10){ const bi=this.B.findIndex(v=>v===1); this.B[bi]=3; this.order.push('B'); } else { const ai=this.A.lastIndexOf(1); this.A[ai]=3; this.order.push('A'); } this.removed++; this.draw(); Audio_.fx('tap'); await sleep(600); }
      this.note(`<b>${n} − ${m}</b> leaves <b>${n-m}</b>.`);
    }else{
      const n=q.sub.n,m=q.sub.m,r0=n-10;
      for(let k=0;k<r0;k++){ const bi=this.B.findIndex(v=>v===1); this.B[bi]=3; this.removed++; this.order.push('B'); this.draw(); Audio_.fx('tap'); await sleep(600); }
      this.note(`Back to <b>10</b>. We still need to take away <b>${m-r0}</b>.`); await sleep(1200); this.custom=null;
      for(let k=0;k<m-r0;k++){ const ai=this.A.lastIndexOf(1); this.A[ai]=3; this.removed++; this.order.push('A'); this.draw(); Audio_.fx('tap'); await sleep(600); }
      this.note(`<b>10 − ${m-r0}</b> leaves <b>${n-m}</b>.`);
    }
    this.busy=false;
  }
}

class LineTool{
  constructor(root,q,cb){this.root=root;this.q=q;this.cb=cb||{};this.root.addEventListener('click',e=>this.onClick(e));this.init();}
  init(){
    const q=this.q;
    this.start=q.kind==='bond'?q.a:q.kind==='add'?q.big:q.sub.n;
    this.pos=this.start; this.hops=[]; this.touched=false; this.custom=null; this.busy=false;
    this.draw(false);
  }
  reset(){this.init();}
  X(n){return 30+n*39;}
  draw(animate){
    const Y=150,X=n=>this.X(n);
    let s=`<div class="line-wrap"><svg viewBox="0 0 840 230" role="img" aria-label="Number line from 0 to 20">`;
    s+=`<line x1="${X(0)}" y1="${Y}" x2="${X(20)}" y2="${Y}" stroke="var(--ink2)" stroke-width="4" stroke-linecap="round"/>`;
    for(let n=0;n<=20;n++){const ten=n===10; s+=`<line class="${ten?'nl-ten':'nl-tick'}" x1="${X(n)}" x2="${X(n)}" y1="${Y-(ten?24:12)}" y2="${Y+(ten?24:12)}"/><text class="nl-lab${ten?' ten':''}" x="${X(n)}" y="${Y+(ten?56:42)}">${n}</text>`;}
    for(let n=0;n<=20;n++) s+=`<rect class="nl-hit" data-n="${n}" x="${X(n)-19.5}" y="40" width="39" height="170"/>`;
    this.hops.forEach((h,k)=>{
      const x1=X(h.from),x2=X(h.to),d=Math.abs(x2-x1),ctl=Y-8-30-d*.45,apex=(Y-8+ctl)/2;
      s+=`<path class="nl-arc" pathLength="1" d="M${x1} ${Y-8} Q${(x1+x2)/2} ${ctl} ${x2} ${Y-8}" style="${animate&&k===this.hops.length-1?'':'animation:none;stroke-dashoffset:0'}"/>`;
      s+=`<text class="nl-hoplab" x="${(x1+x2)/2}" y="${apex-8}">${h.to>h.from?'+':'−'}${Math.abs(h.to-h.from)}</text>`;
    });
    const b=S.dragon?S.dragon.body:'#2a9d8f';
    s+=`<g style="transform:translate(${X(this.pos)}px,0);transition:transform ${reduceMotion()?0:.45}s ease"><path d="M-8 ${Y-26} h16 l-8 11z" fill="${b}"/><circle cx="0" cy="${Y-42}" r="18" fill="${b}"/><circle cx="-6" cy="${Y-45}" r="4.6" fill="#fff"/><circle cx="6" cy="${Y-45}" r="4.6" fill="#fff"/><circle cx="-5" cy="${Y-44}" r="2.2" fill="#14202a"/><circle cx="7" cy="${Y-44}" r="2.2" fill="#14202a"/><path d="M-7 ${Y-36} q7 6 14 0" stroke="#14202a" stroke-width="2.2" fill="none" stroke-linecap="round"/></g>`;
    s+=`</svg></div><div class="tool-note" data-note></div>`;
    this.root.innerHTML=s; this.updateNote();
  }
  updateNote(){
    const el=this.root.querySelector('[data-note]'); if(!el) return;
    if(this.custom){el.innerHTML=this.custom;return;}
    if(!this.hops.length){ el.innerHTML=this.q.kind==='add'?`Start on the bigger number, <b>${this.start}</b>. Tap a number to hop there.`:`You start on <b>${this.start}</b>. Tap a number to hop there.`; }
    else el.innerHTML=`You are on <b>${this.pos}</b>. Tap another number to keep hopping.`;
  }
  note(html){this.custom=html;this.updateNote();}
  setHighlight(){ const t=this.root.querySelector('.nl-lab.ten'); if(t) t.style.fill='var(--ember)'; }
  onClick(e){
    const hit=e.target.closest('.nl-hit'); if(!hit||this.busy) return;
    this.custom=null; this.hopTo(+hit.dataset.n);
  }
  hopTo(n,silent){
    if(n===this.pos) return;
    this.hops.push({from:this.pos,to:n}); this.pos=n; if(!silent){this.touched=true; if(this.cb.onTouch) this.cb.onTouch();}
    Audio_.fx('pop'); this.draw(true);
  }
  strategyUsed(){ if(this.q.noBridge) return this.hops.length>0&&this.pos===this.q.land; return this.hops.length>0&&this.hops.some(h=>h.to===10); }
  async demo(){
    this.reset(); this.busy=true; await sleep(500); const q=this.q;
    const path=q.noBridge?[q.land]:q.kind==='bond'?[10]:q.kind==='add'?[10,q.big+q.small]:[10,q.sub.n-q.sub.m];
    for(const n of path){ this.hopTo(n,true); await sleep(1300); }
    this.busy=false;
    const m=q.noBridge?(q.kind==='add'?`Start on <b>${q.big}</b>, hop on <b>${q.small}</b>. You land on <b>${q.land}</b>.`:`Start on <b>${q.sub.n}</b>, hop back <b>${q.sub.m}</b>. You land on <b>${q.land}</b>.`):q.kind==='bond'?`${q.a} hops to <b>10</b>: that is <b>${10-q.a}</b> more.`:q.kind==='add'?`Hop to <b>10</b> first, then hop the rest. You land on <b>${q.big+q.small}</b>.`:`Hop back to <b>10</b> first, then hop back the rest. You land on <b>${q.sub.n-q.sub.m}</b>.`;
    this.note(m);
  }
}
