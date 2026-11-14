/* ================= play allowance, bedtime sunset, pass-the-iPad and the family chest =================
   Each child has a daily play allowance (grown-ups set it, 25 minutes by default). Only active play counts.
   The last five minutes turn the island to sunset, the dragon yawns, then goes to bed. Nothing is ever cut off:
   a puzzle or a practice session always finishes first. The family chest lives in one small shared record
   (not inside either child's save), so one child's game never writes into the other's. */
const FAM_KEY='isleOfRu.family';
const CHEST_BASE=4, CHEST_BONUS=10;
/* ---- weekly shared island project: every finished practice adds bricks from each child, nobody sees who added more ---- */
const BRICKS_EACH=5;
const PROJECTS=[
  {id:'lighthouse',name:'Lighthouse',start:'2026-11-14',need:40,stages:[10,20,30,40],reward:30,
   stageText:['A staked-out plot by the sea, ready for a lighthouse.','The stone base is going up.','The tower is rising, stripe by stripe.','The tower is done. The lamp room just needs its light.','The lighthouse is finished. Its lamp shines over the sea at night.']}
  /* later projects (longship repairs, windmill, market stall, ...) are listed in ROADMAP.md and added as their art is made */
];
const projStage=(p,n)=>{let st=0;for(const th of p.stages) if(n>=th) st++;return st};
const Fam={
  get(){
    let f={}; try{ f=JSON.parse(localStorage.getItem(FAM_KEY))||{}; }catch(e){}
    f.last=f.last||{}; f.names=f.names||{}; f.pending=f.pending||{};
    if(f.date!==today()){
      if(f.date) f.prevFirst=f.first||null;
      f.date=today(); f.done={}; f.first=null; f.opened=false; f.starter=null;
      this.put(f);
    }
    f.done=f.done||{}; return f;
  },
  put(f){ try{ localStorage.setItem(FAM_KEY,JSON.stringify(f)); }catch(e){} },
  /* children who practised in the last 14 days, in slot order */
  members(f){ return SLOTS.filter(k=>f.last[k]&&daysBetween(f.last[k],today())<=14); },
  noteStart(){ if(!S||!S.hero) return; const f=this.get(); if(!f.first){ f.first=SAVE_KEY; this.put(f); } },
  /* who goes first today: the child who went second yesterday */
  starter(){
    const f=this.get(); if(f.first) return null;
    const m=this.members(f); if(m.length<2) return null;
    if(f.starter) return f.starter;
    let next=m[0]; if(f.prevFirst&&m.includes(f.prevFirst)) next=m[(m.indexOf(f.prevFirst)+1)%m.length];
    f.starter=next; this.put(f); return next;
  },
  /* called once when today's practice is finished */
  practiceDone(){
    this.lastBuild=null; if(!S||!S.dragon) return null;
    const f=this.get(), k=SAVE_KEY; if(f.done[k]) return null;
    f.done[k]=true; f.last[k]=today(); f.names[k]=(S.hero&&S.hero.name)||S.dragon.name;
    this.lastBuild=this.addBricks(f,k);
    if(listProfiles().length<2){ this.put(f); return null; }   /* a chest needs a family: nothing happens with one player */
    let gain=CHEST_BASE, opened=false; const m=this.members(f);
    if(m.length>=2&&m.every(x=>f.done[x])&&!f.opened){
      f.opened=true; opened=true; gain+=CHEST_BONUS;
      m.forEach(x=>{ if(x!==k) f.pending[x]=(f.pending[x]||0)+CHEST_BONUS; });
    }
    this.put(f); S.embers+=gain;
    return {gain,opened,keys:m.filter(x=>f.done[x]).length,total:m.length};
  },
  /* the project being built now: the first one not yet finished whose start date has come */
  current(f){ f=f||this.get(); f.projDone=f.projDone||[]; return PROJECTS.find(p=>!f.projDone.includes(p.id)&&p.start<=today())||null; },
  bricks(id,f){ f=f||this.get(); return (f.bricks&&f.bricks[id])||0; },
  /* one set of bricks per child per day, added when practice is finished */
  addBricks(f,k){
    f.projDone=f.projDone||[]; f.bricks=f.bricks||{}; f.bday=f.bday||{}; f.pendingB=f.pendingB||{};
    const p=this.current(f); if(!p||f.bday[k]===today()) return null;
    f.bday[k]=today();
    const before=f.bricks[p.id]||0, after=Math.min(p.need,before+BRICKS_EACH); f.bricks[p.id]=after;
    const r={id:p.id,name:p.name,n:after,need:p.need,stage:projStage(p,after),stageUp:projStage(p,after)>projStage(p,before),done:false,reward:0};
    if(after>=p.need){
      f.projDone.push(p.id); r.done=true; r.reward=p.reward; S.embers+=p.reward;
      this.members(f).forEach(x=>{ if(x!==k) f.pendingB[x]={e:p.reward,name:p.name}; });
    }
    return r;
  },
  /* a finished project's reward for a child who was not the one who placed the last bricks */
  claimBuild(){
    const f=this.get(), g=f.pendingB&&f.pendingB[SAVE_KEY]; if(!g) return null;
    delete f.pendingB[SAVE_KEY]; this.put(f); S.embers+=g.e; saveState(); return g;
  },
  /* embers waiting from a chest that opened after this child had finished */
  claim(){
    const f=this.get(), p=f.pending[SAVE_KEY]||0; if(!p) return 0;
    delete f.pending[SAVE_KEY]; this.put(f); S.embers+=p; saveState(); return p;
  },
  /* the state of today's chest for display: one row per child */
  chest(){
    const f=this.get(), m=this.members(f);
    return {opened:!!f.opened,rows:m.map(k=>({key:k,name:f.names[k]||'Player',done:!!f.done[k]})),count:m.filter(x=>f.done[x]).length,total:m.length};
  }
};

const Allow=(function(){
  let lastInput=Date.now(), lastTick=Date.now(), saveN=0, overrunSince=0, nudged=false, started=false;
  const A=()=>{
    if(!S) return null;
    if(!S.allow||S.allow.date!==today()) S.allow={date:today(),used:0,extra:0,asleep:false,yawn:false};
    return S.allow;
  };
  const mins=()=>(S&&S.settings&&S.settings.allowMin!=null)?+S.settings.allowMin:25;
  const limit=()=>mins()>0?mins()*60+((A()||{}).extra||0):Infinity;
  const remain=()=>{ const a=A(); return a?limit()-a.used:Infinity; };
  const active=()=>!!(S&&S.hero&&S.hero.done&&S.dragon);
  /* 0 = bright day, 1 = night: the last five minutes slide from one to the other */
  function dusk(){
    if(!active()) return 0; const a=A(); if(a.asleep) return 1;
    const r=remain(); if(!isFinite(r)||r>300) return 0;
    return Math.max(0,Math.min(1,(300-r)/300));
  }
  function frac(){ const a=A(); const l=limit(); return !a||!isFinite(l)?0:Math.max(0,Math.min(1,a.used/l)); }
  /* the little sun-and-moon arc in the corner: no numbers on purpose */
  function paint(){
    const el=$('#vsun'); if(!el) return;
    if(!active()||!isFinite(limit())){ el.hidden=true; return; }
    el.hidden=false; const t=frac(), x=4+t*40, y=22-Math.sin(t*Math.PI)*17, moon=t>=.86;
    const body=moon?`<circle cx="${x}" cy="${y}" r="5.5" fill="#f4efe0"/><circle cx="${x+2.4}" cy="${y-1.4}" r="4.6" fill="#173040"/>`:`<circle cx="${x}" cy="${y}" r="5.5" fill="#ffc94a"/><circle cx="${x}" cy="${y}" r="8" fill="#ffc94a" opacity=".25"/>`;
    el.innerHTML=`<svg viewBox="0 0 48 28" width="48" height="28" aria-hidden="true"><path d="M4 22 Q24 -10 44 22" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2" stroke-dasharray="2 3" stroke-linecap="round"/>${body}</svg>`;
    el.setAttribute('aria-label',t>=.86?'Nearly bedtime':'Play time today');
  }
  function bump(){ lastInput=Date.now(); }
  function tick(){
    const now=Date.now(), el=Math.min(3,(now-lastTick)/1000); lastTick=now;
    if(!active()) return;
    if(['who','splash','sleep','pass','hero','create'].includes(screen)) return;
    if(document.visibilityState!=='visible') return;
    if(now-lastInput>90000) return;
    const a=A(); if(a.asleep) return;
    a.used+=el; Fam.noteStart();
    if(++saveN%10===0) saveState();
    if(!isFinite(limit())) return;
    paint();
    const r=remain();
    if(r<=180&&!a.yawn&&screen==='village'&&Village.idle()){ a.yawn=true; saveState(); Village.yawn(); }
    if(r<=0){
      if(!S.day.trained&&!S.settings.exploreAny){
        if(!nudged&&screen==='village'&&Village.idle()){ nudged=true; Village.say(`It is getting late, and ${S.dragon.name} is sleepy. Let us do today's practice first, then it is bedtime.`); }
        return;
      }
      if(!overrunSince) overrunSince=now;
      const safe=screen==='village'&&Village.idle();
      if(safe||(screen==='village'&&now-overrunSince>180000&&!Village.busy())) bedtime();
    }else overrunSince=0;
  }
  function bedtime(){
    const a=A(); if(a.asleep) return; a.asleep=true; overrunSince=0; saveState();
    Audio_.fx('soft'); renderSleep();
  }
  /* true if this child is already in bed: used when a child opens the game again the same day */
  function guard(){ if(!active()) return false; const a=A(); if(a.asleep&&isFinite(limit())){ renderSleep(); return true; } return false; }

  function renderSleep(){
    screen='sleep'; const D=esc(S.dragon.name), nm=esc((S.hero&&S.hero.name)||S.dragon.name);
    const others=listProfiles().filter(p=>p.key!==SAVE_KEY);
    $('#app').innerHTML=`<div class="sleep" role="main"><div class="stars" aria-hidden="true"></div>
      <div class="moonbig" aria-hidden="true"></div>
      <div class="sleep-in">
        <div class="sleep-dragon">${dragonSVG(S.dragon,{mood:'sleepy',stage:dragonStage(),wear:S.dragon.gear,uid:'sleep'})}</div>
        <h1>${D} is getting sleepy now</h1>
        <p>Time for bed, ${nm}. See you again tomorrow!</p>
        <div class="sleep-row"><button class="btn btn-primary btn-big" data-act="goodnight">${others.length?'Goodnight':'Goodnight'}</button></div>
        <button class="sleep-gu" data-act="sleep-more">Grown-up: more time</button>
      </div></div>`;
  }
  /* who plays next: whoever still has time today */
  function hasTime(p){
    const s=p.s, m=s.settings&&s.settings.allowMin!=null?+s.settings.allowMin:25;
    if(!(s.hero&&s.hero.done&&s.dragon)) return true;
    if(m<=0) return true;
    const a=s.allow; if(!a||a.date!==today()) return true;
    return !a.asleep&&a.used<m*60+(a.extra||0);
  }
  function renderPass(){
    if(S&&S.hero) saveState();
    screen='pass'; const profs=listProfiles(), ch=Fam.chest();
    const next=profs.filter(p=>p.key!==SAVE_KEY&&hasTime(p)), cards=next.map(p=>{
      const h=p.s.hero||blankHero(), dn=p.s.dragon?p.s.dragon.name:'No dragon yet';
      return `<button class="who-card pass-card" data-act="play" data-key="${p.key}" aria-label="Play as ${esc(p.name)}"><img alt="" src="${picHero(h,130,160,'d')}" width="130" height="160"><b>${esc(p.name)}</b><small>with ${esc(dn)}</small></button>`; }).join('');
    const keys=ch.total>=2?`<div class="chestbox"><div class="chest-ico" aria-hidden="true">${chestIcon(ch.count,ch.total)}</div><div><b>Family chest</b><br>${ch.opened?'It is open! Everyone gets a bonus.':`${ch.count} of ${ch.total} keys turned today.`}<div class="keyrow">${ch.rows.map(r=>`<span class="key ${r.done?'on':''}"><i></i>${esc(r.name)}</span>`).join('')}</div></div></div>`:'';
    const title=next.length?(next.length===1?`Time for ${esc(next[0].name)}'s turn!`:'Whose turn is it?'):'Everyone has had a turn today';
    const sub=next.length?'Pass the iPad over. Your progress is safe.':'See you all tomorrow. Sleep well!';
    $('#app').innerHTML=`<div class="sleep pass" role="main"><div class="stars" aria-hidden="true"></div><div class="sleep-in" style="max-width:760px">
      <h1>${title}</h1><p>${sub}</p>
      ${cards?`<div class="whogrid" style="justify-content:center">${cards}</div>`:''}
      ${keys}
      <button class="sleep-gu" data-act="sleep-more">Grown-up: more time</button></div></div>`;
  }
  /* a small picture of the chest: keyholes light up as keys are turned */
  function chestIcon(n,total){
    const lock=i=>`<circle cx="${14+i*20}" cy="26" r="5" fill="${i<n?'#7fe08a':'#4a3a20'}" stroke="#2b1d10" stroke-width="1.6"/>`;
    return `<svg viewBox="0 0 68 48" width="68" height="48"><rect x="4" y="12" width="60" height="32" rx="5" fill="#9b6a38" stroke="#2b1d10" stroke-width="2.4"/><path d="M4 22 Q34 4 64 22" fill="#b27d45" stroke="#2b1d10" stroke-width="2.4"/><rect x="4" y="22" width="60" height="5" fill="#d9a441" stroke="#2b1d10" stroke-width="1.6"/>${[0,1].map(lock).join('')}</svg>`;
  }
  /* grown-up sheet: add time, or wake the dragon for a while */
  function moreTime(){
    openGate(()=>{
      openSheet(`<div class="row spread"><h2>Add play time</h2><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div>
        <p class="sub">${esc(S.dragon.name)} has been playing for ${Math.round(A().used/60)} minutes today. How much more would you like to allow?</p>
        <div class="row" style="flex-wrap:wrap;gap:8px"><button class="btn" data-act="addtime" data-m="5">5 more minutes</button><button class="btn" data-act="addtime" data-m="10">10 more minutes</button><button class="btn" data-act="addtime" data-m="15">15 more minutes</button><button class="btn" data-act="addtime" data-m="30">30 more minutes</button></div>`);
    });
  }
  function addTime(m){
    const a=A(); a.extra=(a.extra||0)+m*60; a.asleep=false; a.yawn=false; overrunSince=0; nudged=false; saveState(); closeSheet();
    toast(`${m} more minutes. ${S.dragon.name} is awake again.`); goHome();
  }
  function start(){
    if(started) return; started=true;
    ['pointerdown','keydown','touchstart'].forEach(ev=>window.addEventListener(ev,bump,{passive:true,capture:true}));
    setInterval(tick,1000);
  }
  return {start,dusk,paint,guard,renderPass,renderSleep,moreTime,addTime,bedtime,remain,limit,state:()=>A(),hasTime,chestIcon};
})();
