/* ================= core: utilities, saved state, skills, spaced review ================= */
/* Each player has their own save slot. The first slot keeps the original key so existing progress is untouched. */
const SLOTS=['emberIsle.v2','emberIsle.p2','emberIsle.p3','emberIsle.p4'];
const META_KEY='emberIsle.meta';
let SAVE_KEY=SLOTS[0];
const BOX_DAYS=[1,1,3,7,14,30];          // days until the next review, by box 0..5
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const rnd=n=>Math.floor(Math.random()*n);
const pick=a=>a[rnd(a.length)];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function shuffle(a){a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(i+1);[a[i],a[j]]=[a[j],a[i]];}return a;}
const pad2=n=>String(n).padStart(2,'0');
function localDate(d=new Date()){return d.getFullYear()+'-'+pad2(d.getMonth()+1)+'-'+pad2(d.getDate());}
let TODAY_OVERRIDE=null;
const today=()=>TODAY_OVERRIDE||localDate();
function addDays(ds,n){const [y,m,d]=ds.split('-').map(Number);return localDate(new Date(y,m-1,d+n));}
function daysBetween(a,b){const pa=a.split('-').map(Number),pb=b.split('-').map(Number);return Math.round((Date.UTC(pb[0],pb[1]-1,pb[2])-Date.UTC(pa[0],pa[1]-1,pa[2]))/86400000);}
const reduceMotion=()=>{try{return window.matchMedia('(prefers-reduced-motion: reduce)').matches;}catch(e){return false;}};

/* ---- saved state ---- */
let S=null, storageOK=true;
const SCHEMA=3;   /* bump when the saved shape changes, and add a step to migrate() */
let SAVE_LOCKED=false; /* true when the save came from a newer version of the app: never overwrite it */
function freshState(){return {
  v:1, ver:SCHEMA, created:Date.now(), dragon:null, extra:[], hero:null,
  settings:{sfx:true,music:false,vol:0.6,dashMode:'calm',clockOffered:false,exploreAny:false,sessionMax:10,newPerDay:3},
  embers:0, inv:{fish:0,berry:0,spice:0,decor:[],acc:[],wear:null,built:[],closet:[]},
  items:{}, sessions:[], log:[], days:[], streak:{cur:0,best:0,last:null},
  dash:{plays:[],best:0},
  care:{petDate:null,pets:0},
  snaps:[], explore:null, tutorialSeen:false, startSkill:0,
  day:{date:null,trained:false,dashDone:false,fed:false,extra:0}
};}
const GEAR_SLOT={scarf:'neck',hat:'head',crown:'head',helm:'head',mail:'body',plate:'body',blade:'tail'};
/* Upgrade an older save to the current shape. Only ever ADD or MOVE things here; never delete a child's progress. */
function migrate(s){
  s.ver=s.ver||1;
  if(s.ver<2){
    s.inv=s.inv||{}; s.inv.built=s.inv.built||[]; s.extra=s.extra||[];
    if(s.dragon){ if(!s.dragon.gear){ s.dragon.gear={}; const w=s.inv.wear; if(w&&GEAR_SLOT[w]) s.dragon.gear[GEAR_SLOT[w]]=w; } if(s.dragon.since==null) s.dragon.since=0; }
    s.ver=2;
  }
  if(s.ver<3){
    s.inv=s.inv||{}; s.inv.closet=s.inv.closet||[];
    if(!s.hero) s.hero={name:'',look:{build:'boy',skin:'#f2c9a0',hair:'#6b3d1e',style:'long',tunic:'#2f8f8d',scarf:'#e8743b'},wear:{},done:false};
    s.ver=3;
  }
  /* future steps: if(s.ver<3){ ...; s.ver=3; } */
  return s;
}
function parseSave(raw){
  try{ const s=JSON.parse(raw); return s&&(s.v===1||s.ver>=1)?s:null; }catch(e){ return null; }
}
function loadState(key){
  if(key) SAVE_KEY=key;
  SAVE_LOCKED=false;
  try{
    const t='__t'; localStorage.setItem(t,'1'); localStorage.removeItem(t);
    const raw=localStorage.getItem(SAVE_KEY);
    storageOK=true;
    if(raw){const s=parseSave(raw);
      if(s){
        const from=s.ver||1;
        if(from>SCHEMA){ SAVE_LOCKED=true; }   /* made by a newer app: leave it alone */
        else if(from<SCHEMA){ try{ localStorage.setItem(SAVE_KEY+'.backup-v'+from,raw); }catch(_){} }
        const base=freshState(); s.ver=from;
        const m=migrate(Object.assign(base,s,{settings:Object.assign(base.settings,s.settings||{}),inv:Object.assign(base.inv,s.inv||{}),day:Object.assign(base.day,s.day||{})}));
        return m;}}
  }catch(e){storageOK=false;}
  return freshState();
}
/* every saved player, read-only: used for the "who is playing" screen and for the other child wandering the island */
function listProfiles(){
  const out=[];
  SLOTS.forEach(key=>{
    let raw=null; try{ raw=localStorage.getItem(key); }catch(e){}
    if(!raw) return; const s=parseSave(raw); if(!s||!s.dragon&&!s.hero) return;
    const from=s.ver||1; let m=s;
    if(from<=SCHEMA){ try{ m=migrate(Object.assign(freshState(),s,{ver:from,inv:Object.assign(freshState().inv,s.inv||{})})); }catch(e){ m=s; } }
    out.push({key,s:m,name:(m.hero&&m.hero.name)||(m.dragon&&m.dragon.name)||'Player',active:key===SAVE_KEY});
  });
  return out;
}
function freeSlot(){ return SLOTS.find(k=>{ try{ return !localStorage.getItem(k); }catch(e){ return false; } }); }
function lastPlayed(){ try{ return localStorage.getItem(META_KEY); }catch(e){ return null; } }
function rememberPlayer(key){ try{ localStorage.setItem(META_KEY,key); }catch(e){} }
function saveState(){
  if(SAVE_LOCKED){ storageOK=false; return; }
  if(S.log.length>1600) S.log=S.log.slice(-1200);
  if(S.sessions.length>400) S.sessions=S.sessions.slice(-300);
  try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));storageOK=true;}catch(e){storageOK=false;}
}
function rollDay(){ if(S.day.date!==today()){ S.day={date:today(),trained:false,dashDone:false,fed:false,extra:0}; S.care.pets=0; S.care.petDate=today(); } }

/* ---- skills and fact items ---- */
const SKILLS=[];
const ITEM={};
(function buildSkills(){
  const bonds=[5,1,9,2,8,3,7,4,6].map(a=>({id:'b:'+a,kind:'bond',a,ans:10-a}));
  const adds=[]; for(const x of [9,8,7,6]) for(let y=11-x;y<=x;y++) adds.push({id:`a:${x}+${y}`,kind:'add',x,y,ans:x+y});
  const subs=[]; for(let n=11;n<=18;n++) for(let m=n-9;m<=9;m++) subs.push({id:`s:${n}-${m}`,kind:'sub',n,m,ans:n-m,r:m-(n-10)});
  subs.sort((p,q)=>p.r-q.r||p.n-q.n);
  const fams=adds.map(a=>({id:`f:${a.x}+${a.y}`,kind:'fam',x:a.x,y:a.y,c:a.x+a.y,src:a.id,ans:a.y}));
  /* within ten: x+y<=10, no ten involved */
  const wadds=[]; for(let y=2;y<=5;y++) for(let x=y;x<=10-y;x++) wadds.push({id:`w:${x}+${y}`,kind:'wadd',x,y,ans:x+y});
  const wsubs=wadds.map(a=>({id:`v:${a.x}+${a.y}`,kind:'wsub',x:a.x,y:a.y,c:a.x+a.y,src:a.id,ans:a.y}));
  /* teens plus ones, no crossing a ten: totals 14 to 20 */
  const tadds=[]; for(let T=12;T<=18;T++){ const o=T-10; for(let u=(T===18?2:3);u<=10-o;u++) tadds.push({id:`t:${T}+${u}`,kind:'tadd',T,u,o,ans:T+u}); }
  const tsubs=tadds.map(a=>({id:`u:${a.T}+${a.u}`,kind:'tsub',T:a.T,u:a.u,c:a.T+a.u,src:a.id,ans:a.T}));
  SKILLS.push({id:'bonds',name:'Pairs that make ten',blurb:'How many more to fill a ten-frame.',items:bonds});
  SKILLS.push({id:'w10add',easy:true,name:'Adding within ten',blurb:'Join small groups, e.g. 3 + 4.',items:wadds});
  SKILLS.push({id:'w10sub',easy:true,name:'Taking away within ten',blurb:'Use an adding fact to take away, e.g. 7 − 3.',items:wsubs});
  SKILLS.push({id:'make10',name:'Make ten to add',blurb:'Add by filling the ten first, e.g. 8 + 5.',items:adds});
  SKILLS.push({id:'back10',name:'Go back through ten',blurb:'Subtract by stepping back to ten first, e.g. 14 − 6.',items:subs});
  SKILLS.push({id:'family',name:'Fact families',blurb:'Use an adding fact to find the matching take-away.',items:fams});
  SKILLS.push({id:'teenadd',easy:true,name:'Teens plus ones',blurb:'A ten and some ones, e.g. 13 + 4, up to 20.',items:tadds});
  SKILLS.push({id:'teensub',easy:true,name:'Teens take away ones',blurb:'Take ones from a teen number, e.g. 17 − 3.',items:tsubs});
  for(const sk of SKILLS) for(const it of sk.items){it.skill=sk.id; ITEM[it.id]=it;}
})();
const ALL_ITEMS=SKILLS.flatMap(s=>s.items);
const LATER_SKILLS=[
  ['Times tables with arrays','Build grids of counters, doubling and halving.'],
  ['Place value and column methods','Ten-frames grow into tens and hundreds.'],
  ['Fraction strips','Halves, quarters and thirds you can see and compare.'],
  ['Story problems','Turn a story into a picture, then a sum.']
];

const boxOf=id=>S.items[id]?S.items[id].box:-1;
const isSeen=id=>!!S.items[id];
const isSecure=id=>boxOf(id)>=3;
function skillStats(i){
  const its=SKILLS[i].items;
  return {n:its.length, seen:its.filter(x=>isSeen(x.id)).length, steady:its.filter(x=>boxOf(x.id)>=2).length, secure:its.filter(x=>isSecure(x.id)).length};
}
function skillUnlocked(i){
  if(i===0||i<=S.startSkill) return true;
  const p=skillStats(i-1); return p.steady>=Math.ceil(p.n*0.7);
}
function itemEligible(it){ if(!it.src) return true; return boxOf(it.src)>=1; }
function pickNew(count){
  const out=[];
  for(let i=Math.min(S.startSkill,SKILLS.length-1);i<SKILLS.length&&out.length<count;i++){
    if(!skillUnlocked(i)) break;
    for(const it of SKILLS[i].items){ if(out.length>=count) break; if(!isSeen(it.id)&&itemEligible(it)){ out.push(it.id); if(out.length===1&&SKILLS[i].easy) count=Math.max(count,5); } }
  }
  return out;
}
function dueItems(){
  const t=today();
  return ALL_ITEMS.filter(it=>S.items[it.id]&&S.items[it.id].due<=t).sort((a,b)=>S.items[a.id].due.localeCompare(S.items[b.id].due)||S.items[a.id].box-S.items[b.id].box).map(x=>x.id);
}
function easiestKnown(exclude=[]){
  const cands=ALL_ITEMS.filter(it=>isSeen(it.id)&&boxOf(it.id)>=2&&!exclude.includes(it.id));
  if(cands.length) return pick(cands).id;
  const seen=ALL_ITEMS.filter(it=>isSeen(it.id)&&!exclude.includes(it.id)).sort((a,b)=>boxOf(b.id)-boxOf(a.id));
  return seen.length?seen[0].id:null;
}
/* record how a fact went and when it comes back */
function applyResult(id,res){
  const t=today(); let st=S.items[id];
  if(!st) st=S.items[id]={box:0,due:t,seen:0,ok:0,fail:0,last:null,first:t,prom:null};
  const gap=st.last?daysBetween(st.last,t):null;
  st.seen++;
  if(res.kind==='dash'){
    if(res.clean){ st.ok++; if(st.prom!==t&&st.due<=t){st.box=Math.min(5,st.box+1);st.due=addDays(t,BOX_DAYS[st.box]);st.prom=t;} }
    else { st.fail++; const tm=addDays(t,1); if(st.due>tm) st.due=tm; }
  }else if(res.clean){
    st.ok++;
    if(res.fast&&st.seen===1){ st.box=2; st.prom=t; st.due=addDays(t,BOX_DAYS[2]); }
    else { if(st.prom!==t){st.box=Math.min(5,st.box+1);st.prom=t;} st.due=addDays(t,BOX_DAYS[st.box]); }
  }else{
    st.fail++; st.box=st.box>=3?2:Math.max(0,st.box-1); st.due=addDays(t,1); st.prom=t;
  }
  st.last=t;
  return gap;
}

/* ---- session plan ---- */
function buildPlan(max,newCount){
  const dueIds=dueItems();
  const news=pickNew(newCount);
  const used=new Set(news);
  const warm=easiestKnown([...news]);
  const out=[]; if(warm){out.push({id:warm,role:'warm'});used.add(warm);}
  const revCap=Math.max(0,Math.min(4,max-2-news.length));
  const R=dueIds.filter(id=>!used.has(id)&&!news.includes(id)).slice(0,revCap);
  R.forEach(id=>used.add(id));
  const N=news.map(id=>({id,role:'new'}));
  const Rq=R.map(id=>({id,role:'review'}));
  while(Rq.length||N.length){ if(Rq.length) out.push(Rq.shift()); if(N.length) out.push(N.shift()); }
  /* repeat each new fact once, a few questions later, if there is room */
  const room=()=>out.length<max-1;
  for(const n of news){ if(!room()) break; const at=out.findIndex(e=>e.id===n); const pos=Math.min(out.length,at+3); out.splice(pos,0,{id:n,role:'repeat'}); }
  /* top up with practice if the day is light */
  if(out.length<6){
    const extra=ALL_ITEMS.filter(it=>isSeen(it.id)&&!out.some(e=>e.id===it.id)).sort((a,b)=>boxOf(a.id)-boxOf(b.id)).slice(0,6-out.length);
    extra.forEach(it=>out.push({id:it.id,role:'review'}));
  }
  if(out.length>max-1) out.length=max-1;
  const fin=easiestKnown(out.map(e=>e.id)) || (out.length?out[0].id:null);
  if(fin&&out.length) out.push({id:fin,role:'finish'});
  return out;
}

/* ---- streak, growth ---- */
function bumpStreak(){
  const t=today(), st=S.streak; if(st.last===t) return;
  if(!st.last) st.cur=1; else st.cur=daysBetween(st.last,t)<=3?st.cur+1:1;
  st.last=t; st.best=Math.max(st.best,st.cur);
  if(!S.days.includes(t)) S.days.push(t);
}
function dragonStage(d){ d=d||S.dragon; const n=Math.max(0,S.days.length-((d&&d.since)||0)); return n>=26?3:n>=11?2:n>=4?1:0; }
const STAGE_NAMES=['Hatchling','Young dragon','Island guardian','Elder dragon'];
function snapshot(){
  const secure=ALL_ITEMS.filter(it=>isSecure(it.id)).length, seen=ALL_ITEMS.filter(it=>isSeen(it.id)).length;
  const t=today(); S.snaps=S.snaps.filter(x=>x.date!==t); S.snaps.push({date:t,secure,seen}); if(S.snaps.length>120) S.snaps.shift();
}
