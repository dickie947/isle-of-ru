/* ================= app shell: create, island, shop, grown-ups, events ================= */
let screen='boot', draft=null, HOME_SHOWN=null;
const NAMES=['Cinder','Pebble','Skylark','Marlow','Bramble','Ripple','Nova','Thistle','Maple','Juniper','Tansy','Flint'];

function openSheet(html,o={}){ $('#overlay').innerHTML=`<div class="veil" data-veil><div class="sheet${o.wide?' wide':''}" role="dialog" aria-modal="true">${html}</div></div>`; const b=$('#overlay button.btn-primary')||$('#overlay button'); if(b) b.focus({preventScroll:true}); }
function closeSheet(){ $('#overlay').innerHTML=''; }
let toastT=null;
function toast(msg){ let t=$('#toast'); if(!t){t=document.createElement('div');t.id='toast';t.className='toast';t.setAttribute('role','status');document.body.appendChild(t);} t.textContent=msg; t.hidden=false; clearTimeout(toastT); toastT=setTimeout(()=>{t.hidden=true;},2600); }

/* ---- create your dragon ---- */
function renderCreate(){
  screen='create';
  draft=draft||{name:'',body:PAL[0].hex,wing:PAL[5].hex,eyes:EYES[0].hex,horn:'small',pattern:'spots',tail:'flame'};
  const sw=(k,list)=>`<div class="swatches" role="group" aria-label="${k}">`+list.map(c=>`<button class="sw" data-act="opt" data-k="${k}" data-v="${c.hex}" style="background:${c.hex}" aria-label="${c.name}" aria-pressed="${draft[k]===c.hex}"></button>`).join('')+'</div>';
  const chips=(k,list)=>`<div class="chips" role="group" aria-label="${k}">`+list.map(([v,l])=>`<button class="chip" data-act="opt" data-k="${k}" data-v="${v}" aria-pressed="${draft[k]===v}">${l}</button>`).join('')+'</div>';
  $('#app').innerHTML=`<div class="screen"><div class="create">
    <div class="preview" id="cpreview"></div>
    <div>
      <h1 style="margin-bottom:6px">${createExtra?'Design your new dragon':'Design your dragon'}</h1>
      <p style="color:var(--ink2);margin-bottom:14px">${createExtra?`Pick how this dragon looks. It waits in the stables as an egg and hatches after your next practice. It costs ${EGG_COSTS[S.extra.length]} embers.`:'Pick how your dragon looks. It starts as an egg and hatches after your first training.'}</p>
      <div class="opt"><h3>Name</h3><div class="row" style="flex-wrap:nowrap"><input class="field" id="dname" maxlength="12" placeholder="Type a name" autocomplete="off" value="${esc(draft.name)}"><button class="btn" data-act="surprise">Surprise me</button></div></div>
      <div class="opt"><h3>Body colour</h3>${sw('body',PAL)}</div>
      <div class="opt"><h3>Wing colour</h3>${sw('wing',PAL)}</div>
      <div class="opt"><h3>Eyes</h3>${sw('eyes',EYES)}</div>
      <div class="opt"><h3>Horns</h3>${chips('horn',HORNS)}</div>
      <div class="opt"><h3>Pattern</h3>${chips('pattern',PATTERNS)}</div>
      <div class="opt"><h3>Tail</h3>${chips('tail',TAILS)}</div>
      <button class="btn btn-ember btn-big" data-act="create-go" style="margin-top:6px">Meet my egg ${ic('next',24)}</button>${createExtra?`<button class="btn btn-ghost" data-act="create-cancel" style="margin-top:6px">Not now</button>`:''}
    </div></div></div>`;
  updateCreate();
}
function updateCreate(){
  const d=Object.assign({},draft,{name:draft.name||'Your dragon'});
  $('#cpreview').innerHTML=`<div style="display:flex;align-items:flex-end;gap:10px;justify-content:center;width:100%">${dragonSVG(d,{mood:'happy',stage:2,uid:'cr'})}<div style="width:90px;flex:none">${eggSVG(d)}</div></div>`;
  $$('[data-act="opt"]').forEach(b=>b.setAttribute('aria-pressed',String(draft[b.dataset.k]===b.dataset.v)));
}


/* ================= players: who is playing, character creator, switching ================= */
const HERO_NAMES=['Robin','Sky','Wren','Alex','Sam','Kit','Ash','Fern','Indy','Jules','Rory','Max'];
const blankHero=()=>({name:'',look:{build:'boy',skin:HERO_SKIN[1].hex,hair:HERO_HAIR[1].hex,style:'short',tunic:HERO_TUNIC[0].hex,scarf:HERO_SCARF[0].hex},wear:{},done:false});
const picHero=(h,w,hh,dir)=>Village.heroPic(h,w,hh,dir);
let heroDraft=null, heroMode='new';
let SPLASHED=false, SPLASH_CB=null;
function showSplash(name,cb){
  if(SPLASHED){ cb(); return; }
  SPLASHED=true; SPLASH_CB=cb; screen='splash';
  const look={body:'#2a9d8f',wing:'#8e5bb5',eyes:'#2f6fd0',horn:'none',pattern:'none',tail:'club',name:''};
  const who=name?esc(name):'You';
  const text=name?`${who} has sailed to the Isle of Ru, an island full of dragons, secrets and surprises. Mend the bridge, hatch your own dragon, meet the villagers, and find out what is waiting beyond the sea.`:`An island full of dragons, secrets and surprises is waiting. Mend the bridge, hatch your own dragon, meet the villagers, and explore beyond the sea.`;
  $('#app').innerHTML=`<div class="splash"><div class="splash-in"><div class="splash-dragon">${dragonSVG(look,{mood:'happy',stage:2,uid:'splash'})}</div><h1 class="splash-title">Isle of Ru</h1><p class="splash-text">${text}</p><button class="btn btn-ember btn-big" data-act="splash-go">Begin ${ic('next',24)}</button></div></div>`;
}
function startNewPlayer(key){
  SAVE_KEY=key; SAVE_LOCKED=false; S=freshState(); draft=null; createExtra=false; Village.reset();
  heroMode='new'; heroDraft=blankHero(); renderHero();
}
function renderHero(){
  screen='hero';
  const h=heroDraft, L=h.look;
  const sw=(k,list)=>`<div class="swatches" role="group" aria-label="${k}">`+list.map(c=>`<button class="sw" data-act="hopt" data-k="${k}" data-v="${c.hex}" style="background:${c.hex}" aria-label="${c.name}" aria-pressed="${L[k]===c.hex}"></button>`).join('')+'</div>';
  const chips=(k,list)=>`<div class="chips" role="group" aria-label="${k}">`+list.map(([v,l])=>`<button class="chip" data-act="hopt" data-k="${k}" data-v="${v}" aria-pressed="${L[k]===v}">${l}</button>`).join('')+'</div>';
  const hasDragon=!!S.dragon;
  const canBack=heroMode==='new'&&listProfiles().length>0;
  $('#app').innerHTML=`<div class="screen"><div class="create">
    <div class="preview" id="hpreview"></div>
    <div>
      <h1 style="margin-bottom:6px">${heroMode==='edit'?'Change your look':'Make your character'}</h1>
      <p style="color:var(--ink2);margin-bottom:14px">${heroMode==='edit'?'Change anything you like. You can do this again whenever you want.':'This is you on the island. You can change your look later, and buy new clothes once the clothes shop is built.'}</p>
      <div class="opt"><h3>Your name</h3><div class="row" style="flex-wrap:nowrap"><input class="field" id="hname" maxlength="12" placeholder="Type your name" autocomplete="off" value="${esc(h.name)}"><button class="btn" data-act="hsurprise">Surprise me</button></div></div>
      <div class="opt"><h3>Character</h3>${chips('build',[['boy','Boy'],['girl','Girl']])}</div>
      <div class="opt"><h3>Hair style</h3>${chips('style',HERO_STYLES)}</div>
      <div class="opt"><h3>Hair colour</h3>${sw('hair',HERO_HAIR)}</div>
      <div class="opt"><h3>Skin</h3>${sw('skin',HERO_SKIN)}</div>
      <div class="opt"><h3>Tunic colour</h3>${sw('tunic',HERO_TUNIC)}</div>
      <div class="opt"><h3>Scarf colour</h3>${sw('scarf',HERO_SCARF)}</div>
      <button class="btn btn-ember btn-big" data-act="hero-go" style="margin-top:6px">${hasDragon?'Done':'Next: my dragon'} ${ic('next',24)}</button>${(canBack||heroMode==='edit')?`<button class="btn btn-ghost" data-act="hero-cancel" style="margin-top:6px">${heroMode==='edit'?'Cancel':'Back'}</button>`:''}
    </div></div></div>`;
  updateHero();
}
function updateHero(){
  const h=Object.assign({},heroDraft,{wear:heroDraft.wear||{}});
  $('#hpreview').innerHTML=`<div style="display:flex;gap:14px;align-items:flex-end;justify-content:center"><img alt="Your character" src="${picHero(h,170,210,'d')}" width="170" height="210"><img alt="" aria-hidden="true" src="${picHero(h,120,150,'r')}" width="120" height="150" style="opacity:.95"></div>`;
  $$('[data-act="hopt"]').forEach(b=>b.setAttribute('aria-pressed',String(heroDraft.look[b.dataset.k]===b.dataset.v)));
}
function heroDone(){
  const n=($('#hname').value||'').trim(); heroDraft.name=n;
  if(!n){ toast('Type your name first.'); $('#hname').focus(); return; }
  S.hero=Object.assign({},S.hero||{},heroDraft,{done:true,wear:(S.hero&&S.hero.wear)||{}});
  rememberPlayer(SAVE_KEY); saveState(); Audio_.fx('good'); heroDraft=null;
  if(S.dragon) goHome(); else { draft=null; renderCreate(); }
}
function whoHTML(inSheet){
  const profs=listProfiles(), free=freeSlot();
  const cards=profs.map(p=>{
    const h=p.s.hero||blankHero(), dn=p.s.dragon?p.s.dragon.name:'No dragon yet', days=(p.s.days||[]).length;
    return `<button class="who-card" data-act="play" data-key="${p.key}" aria-label="Play as ${esc(p.name)}"><img alt="" src="${picHero(h,110,135,'d')}" width="110" height="135"><b>${esc(p.name)}</b><small>with ${esc(dn)}</small><small>${days} day${days===1?'':'s'} of practice</small>${p.active&&inSheet?'<span class="own">Playing now</span>':''}</button>`}).join('');
  const add=free?`<button class="who-card who-add" data-act="newplayer" data-key="${free}"><span class="plus">+</span><b>New player</b><small>Make a new character and dragon</small></button>`:'';
  return `<div class="whogrid">${cards}${add}</div>`;
}
function renderWho(){
  screen='who';
  $('#app').innerHTML=`<div class="screen"><div class="center" style="max-width:860px;width:100%"><h1>Who is playing?</h1><p style="color:var(--ink2)">Everyone has their own island, dragons and embers.</p>${whoHTML(false)}</div></div>`;
}
function openSwitch(){
  SHEET=null;
  openSheet(`<div class="row spread"><h2>Who is playing?</h2><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div><p class="sub">Your progress is saved first. Everyone has their own island.</p>${whoHTML(true)}`,{wide:true});
}
function playAs(key){
  if(key===SAVE_KEY&&S&&S.hero&&S.hero.done&&screen==='village'){ closeSheet(); return; }
  try{ if(S&&S.hero) saveState(); }catch(e){}
  S=loadState(key); rollDay(); rememberPlayer(key); draft=null; createExtra=false; heroDraft=null;
  try{ Audio_.setVol(S.settings.vol); Audio_.syncMusic(); }catch(e){}
  Village.reset(); closeSheet(); enterGame();
}
function enterGame(){
  if(!S.hero||!S.hero.done){ heroMode='edit'; heroDraft=JSON.parse(JSON.stringify(S.hero||blankHero())); if(!heroDraft.look.style) heroDraft.look.style='short'; if(!heroDraft.look.build) heroDraft.look.build='boy'; renderHero(); }
  else if(!S.dragon){ draft=null; renderCreate(); }
  else goHome();
}

/* ---- the clothes shop ---- */
let clothTab='outfit';
const closetHas=id=>S.inv.closet.includes(id);
function openClothes(){
  SHEET='clothes'; const h=S.hero, W=h.wear||(h.wear={});
  const tabs=Object.keys(HERO_SLOTS).filter(k=>CATALOG.wardrobe.some(x=>x.slot===k)||k==='outfit');
  const list=CATALOG.wardrobe.filter(x=>x.slot===clothTab);
  const cards=list.map(it=>{
    const have=closetHas(it.id), on=W[it.slot]===it.id;
    const pic=picHero(Object.assign({},h,{wear:{[it.slot]:it.id}}),96,118,it.slot==='back'?'u':'d');
    let btn;
    if(have) btn=`<button class="btn btn-sm" data-act="wearc" data-id="${it.id}" data-slot="${it.slot}">${on?'Take off':'Wear'}</button>`;
    else if(it.found) btn=`<span class="note" style="color:var(--ink2)">Found on ${it.found}</span>`;
    else if(it.event){ btn=eventActive(it.event)?`<button class="btn btn-primary btn-sm" data-act="claimc" data-id="${it.id}">Claim it!</button>`:`<span class="note" style="color:var(--ink2)">Back at ${(EVENTS.find(e=>e.id===it.event)||{}).name}</span>`; }
    else if(it.earn){ const m=earnMet(it); btn=m?`<button class="btn btn-primary btn-sm" data-act="claimc" data-id="${it.id}">Claim it!</button>`:`<span class="note" style="color:var(--ink2)">${earnText(it)}</span>`; }
    else btn=`<button class="btn btn-primary btn-sm" data-act="buyc" data-id="${it.id}" ${S.embers>=it.cost?'':'disabled'}>${ic('ember',16)} ${it.cost}</button>`;
    return `<div class="card"><img alt="" src="${pic}" width="96" height="118" style="margin:0 auto"><b>${it.name}</b><small>${it.note}</small>${btn}</div>`}).join('');
  openSheet(`<div class="row spread"><h2>The Clothes Shop</h2><div class="row"><span class="pill gold num">${ic('ember',18)} ${S.embers}</span><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div></div>
    <div class="clothes"><div class="cmodel"><img alt="You" src="${picHero(h,150,185,'d')}" width="150" height="185"><div class="row" style="justify-content:center"><button class="btn btn-sm" data-act="edithero">Hair and colours</button></div></div>
    <div><div class="tabs" role="tablist">${tabs.map(k=>`<button class="tab" role="tab" data-act="clothtab" data-k="${k}" aria-selected="${clothTab===k}">${HERO_SLOTS[k]}</button>`).join('')}</div>
    <div class="shop">${cards}</div></div></div>`,{wide:true});
}
const secureCount=()=>ALL_ITEMS.filter(x=>isSecure(x.id)).length;
const earnMet=it=>(!it.earn.days||(S.days||[]).length>=it.earn.days)&&(!it.earn.secure||secureCount()>=it.earn.secure);
const earnText=it=>it.earn.days?`Practise ${it.earn.days} days (you have ${(S.days||[]).length})`:`Get ${it.earn.secure} secure facts (you have ${secureCount()})`;
function claimCloth(id){
  const it=CATALOG.wardrobe.find(x=>x.id===id); if(!it||closetHas(id)||!((it.earn&&earnMet(it))||(it.event&&eventActive(it.event)))) return;
  S.inv.closet.push(id); (S.hero.wear||(S.hero.wear={}))[it.slot]=id; saveState(); Audio_.fx('fanfare'); villageRefresh(); openClothes(); toast(`${it.name}: you earned it!`);
}
function buyCloth(id){
  const it0=CATALOG.wardrobe.find(x=>x.id===id); if(it0&&(it0.found||it0.earn)) return;
  const it=CATALOG.wardrobe.find(x=>x.id===id); if(!it||closetHas(id)||S.embers<it.cost) return;
  S.embers-=it.cost; S.inv.closet.push(id); (S.hero.wear||(S.hero.wear={}))[it.slot]=id; saveState(); Audio_.fx('buy'); villageRefresh(); openClothes(); toast(`${it.name}: yours!`);
}
function wearCloth(id,slot){
  if(!closetHas(id)) return; const W=S.hero.wear||(S.hero.wear={});
  if(W[slot]===id) delete W[slot]; else W[slot]=id; saveState(); Audio_.fx('pop'); openClothes();
}

/* ---- island: the village is the home screen (see village.js) ---- */
function goHome(){ closeSheet(); Village.show(); }
const GEAR=()=>CATALOG.acc.concat(CATALOG.forge);
const gearName=id=>(GEAR().find(x=>x.id===id)||{}).name||id;
let SHEET=null;
function reopenSheet(){ ({nest:openNest,shop:openShop,forge:openForge,stables:openStables,clothes:openClothes,arena:openArena,workshop:openWorkshop}[SHEET]||closeSheet)(); }
function villageRefresh(){ Village.refresh(); }

/* ---- the nest: look after your dragon ---- */
function openNest(){
  SHEET='nest'; const d=S.dragon, D=esc(d.name);
  const head=`<div class="row spread"><h2>${D}'s nest</h2><div class="row"><span class="pill gold num">${ic('ember',18)} ${S.embers}</span><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div></div>`;
  if(!d.hatched){ openSheet(`${head}<div class="center"><div style="width:130px;margin:6px auto">${eggSVG(d,{wiggle:true})}</div><p class="sub">${D}'s egg is warm and wobbling a little. Do today's practice at the school house and it will hatch.</p></div>`); return; }
  const gear=d.gear||{};
  const treats=CATALOG.treats.filter(t=>t.own?S.inv[t.id]>0:(!t.event||eventActive(t.event)||S.inv[t.id]>0)).map(t=>`<div class="card"><svg viewBox="0 0 24 24" style="color:${t.col}">${ICONS[t.icon]}</svg><b>${t.name}</b><small>You have <b class="num">${S.inv[t.id]||0}</b></small><button class="btn btn-primary btn-sm" data-act="give" data-id="${t.id}" ${S.inv[t.id]?'':'disabled'}>Give to ${D}</button></div>`).join('');
  const school=schoolHTML(d);
  const slots=['head','neck','body','tail'].map(sl=>{
    const have=GEAR().filter(g=>g.slot===sl&&S.inv.acc.includes(g.id));
    const chips=have.length?have.map(g=>`<button class="btn btn-sm" data-act="wear" data-id="${g.id}" data-slot="${sl}" aria-pressed="${gear[sl]===g.id}" style="${gear[sl]===g.id?'outline:3px solid var(--tide)':''}">${g.name}</button>`).join(''):`<span class="note" style="color:var(--ink2)">Nothing yet</span>`;
    return `<div class="slotrow"><b>${SLOT_NAMES[sl]}</b>${chips}</div>`}).join('');
  openSheet(`${head}<div class="nestgrid"><div><div class="portrait">${dragonSVG(d,{mood:'happy',stage:dragonStage(),wear:d.gear,uid:'nest'})}</div>
      <div class="row" style="justify-content:center;margin-top:8px"><button class="btn btn-sm" data-act="cuddle">${ic('heart',16)} Cuddle</button></div></div>
    <div><div class="row" style="margin-bottom:8px"><button class="btn btn-primary btn-sm" data-act="feed">Feeding time</button><button class="btn btn-sm" data-act="dragonbook">Dragon book</button></div>${school}<h3 style="margin:0 0 6px">Treats</h3><div class="shop">${treats}</div>
      <h3 style="margin:14px 0 4px">Dress-up</h3>${slots}<p class="sub" style="margin-top:6px">Buy scarves, hats and crowns at the market${built('forge')?', and metal armour at the forge':''}.</p></div></div>`,{wide:true});
}
const abProg=(d,id)=>(d.skills&&d.skills[id])||{prog:0,done:false};
function schoolHTML(d){
  if(!hasMet('sigrun')&&!built('arena')) return `<div class="box" style="margin-bottom:10px"><h3 style="margin:0 0 4px">Dragon school</h3><p class="sub">Sigrun, the dragon teacher, arrives after about 11 days of practice. She teaches skills like fire breath. Or buy the Dragon training arena at the market and train here sooner.</p></div>`;
  const rows=ABILITIES.map(ab=>{const sk=abProg(d,ab.id);let r;
    if(sk.done) r='<span class="own">Learned</span>';
    else if(d.training===ab.id) r=`<span class="note">Training: ${sk.prog||0} of ${ab.days} practice days</span>`;
    else r=`<button class="btn btn-primary btn-sm" data-act="trainskill" data-id="${ab.id}" ${(S.embers>=ab.cost&&!d.training)?'':'disabled'}>${ic('ember',16)} ${ab.cost}</button>`;
    return `<div class="slotrow"><div><b>${ab.name}</b><br><small>${ab.note}</small></div>${r}</div>`}).join('');
  return `<div class="box" style="margin-bottom:10px"><h3 style="margin:0 0 4px">Dragon school</h3><p class="sub" style="margin:0 0 6px">Pick one skill at a time. It trains a little each day you practise.</p>${rows}</div>`;
}
function trainSkill(id){
  const d=S.dragon,ab=ABILITIES.find(a=>a.id===id);if(!ab||d.training||S.embers<ab.cost)return;
  S.embers-=ab.cost;d.skills=d.skills||{};d.skills[id]={prog:0,done:false};d.training=id;saveState();Audio_.fx('buy');villageRefresh();(SHEET==='arena'?openArena:openNest)();toast(`${d.name} starts training ${ab.name}.`);
}
function openArena(){
  SHEET='arena'; const d=S.dragon;
  if(!d||!d.hatched){ openSheet('<div class="row spread"><h2>Training arena</h2><button class="btn btn-ghost btn-sm" data-act="close">'+ic('close',18)+' Close</button></div><p class="sub">The arena is ready. Come back once your dragon has hatched.</p>'); return; }
  const left=!(S.day.bld&&S.day.bld.arena);
  openSheet(`<div class="row spread"><h2>Training arena</h2><div class="row"><span class="pill gold num">${ic('ember',18)} ${S.embers}</span><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div></div>
   <div class="box" style="margin-bottom:10px"><h3 style="margin:0 0 4px">How training works</h3><ol class="sub" style="margin:0;padding-left:20px"><li>Choose one skill below and spend the embers.</li><li>Do your daily practice at the school house. Each practice day trains your dragon a little.</li><li>When the days are done, the skill is learned. Some chests need a skill to open.</li></ol></div>
   ${schoolHTML(d)}
   <div class="box"><h3 style="margin:0 0 4px">Arena drill</h3><p class="sub" style="margin:0 0 6px">${left?'Three quick puzzles with '+esc(d.name)+'. +4 embers.':'Drill done for today. Come back tomorrow.'}</p><button class="btn btn-primary btn-sm" data-act="drill" ${left?'':'disabled'}>Start drill</button></div>`,{wide:true});
}
const CRAFTS=[{id:'bench',name:'Bench',cost:25,note:'A sturdy seat for the Village Green.'},{id:'birdhouse',name:'Birdhouse',cost:40,note:'Something small will move in.'},{id:'flowercart',name:'Flower cart',cost:55,note:'Full of flowers and bees.'}];
function openWorkshop(){
  SHEET='workshop'; S.inv.crafted=S.inv.crafted||[];
  const cards=CRAFTS.map(c=>{const have=S.inv.crafted.includes(c.id);
    return `<div class="card"><b>${c.name}</b><small>${c.note}</small>${have?'<span class="own">On the Green</span>':`<button class="btn btn-primary btn-sm" data-act="craft" data-id="${c.id}" ${S.embers>=c.cost?'':'disabled'}>${ic('ember',16)} ${c.cost}</button>`}</div>`}).join('');
  openSheet(`<div class="row spread"><h2>Workshop</h2><div class="row"><span class="pill gold num">${ic('ember',18)} ${S.embers}</span><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div></div><p class="sub">Build something for the Village Green. There is one measuring puzzle for each build.</p><div class="shop">${cards}</div>`,{wide:true});
}
function craft(id){
  const c=CRAFTS.find(x=>x.id===id); S.inv.crafted=S.inv.crafted||[];
  if(!c||S.inv.crafted.includes(id)||S.embers<c.cost) return;
  closeSheet();
  const ok=Village.craftPuzzle(c.name,()=>{S.embers-=c.cost;S.inv.crafted.push(id);saveState();Audio_.fx('buy');villageRefresh();toast(c.name+': built! Look for it on the Village Green.')});
  if(!ok) toast('Nothing to measure right now.');
}
const SPECIES=[
 {id:'ember',name:'Ember drake',hint:'Your first dragon.'},
 {id:'frost',name:'Frost wyrm',hint:'A cold egg waits on Snowcap Isle. Coming soon.'},
 {id:'sand',name:'Sand skimmer',hint:'Said to hatch from the sand at Sunstone Cove. Coming soon.'},
 {id:'cinder',name:'Cinder wyvern',hint:'Warmed by the vents on Cinder Peak. Coming soon.'},
 {id:'moss',name:'Moss dragon',hint:'Freya the egg-keeper may know where to find one. Coming soon.'},
 {id:'star',name:'Star dragon',hint:'A festival surprise. Coming soon.'}];
function openBook(){
  SHEET='nest';
  const all=[S.dragon].concat(S.extra||[]);
  const mine=all.map(d=>{const sk=ABILITIES.filter(a=>skillOwned(d,a.id)).map(a=>a.name).join(', ')||'No skills yet';
    return `<div class="card"><div class="portrait" style="max-width:130px;margin:0 auto">${dragonSVG(d,{mood:'happy',stage:dragonStage(d),wear:d.gear,uid:'bk'+esc(d.name)})}</div><b>${esc(d.name)}</b><small>${STAGE_NAMES[dragonStage(d)]}${d===S.dragon?`. Fed ${d.fedTotal||0} times.`:''}</small><small>${sk}</small></div>`}).join('');
  const lost=SPECIES.slice(1).map(sp=>`<div class="card"><div class="portrait" style="max-width:110px;margin:0 auto;filter:brightness(0) opacity(.35)">${dragonSVG(S.dragon,{mood:'happy',stage:1,uid:'sp'+sp.id})}</div><b>???</b><small>${sp.name}. ${sp.hint}</small></div>`).join('');
  openSheet(`<div class="row spread"><h2>Dragon book</h2><div class="row"><button class="btn btn-sm" data-act="nest">Back</button><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div></div>
    <h3 style="margin:6px 0">Your dragons</h3><div class="shop">${mine}</div><h3 style="margin:14px 0 6px">Still to find</h3><div class="shop">${lost}</div>`,{wide:true});
}
function giveTreat(id){
  if(!S.inv[id]) return; S.inv[id]--; saveState(); Audio_.fx('munch');
  toast(pick([`${S.dragon.name}: Mmm, delicious!`,`${S.dragon.name}: Yum! Thank you!`,`${S.dragon.name}: That was tasty!`])); openNest();
}
const built=id=>S.inv.built.includes(id);
const costOf=(tab,it)=>tab==='treats'&&built('foodstore')&&!it.event?Math.max(3,it.cost-2):it.cost;
function wearItem(id,slot){
  if(!S.inv.acc.includes(id)) return; const g=S.dragon.gear||(S.dragon.gear={});
  if(g[slot]===id) delete g[slot]; else g[slot]=id; saveState(); Audio_.fx('pop'); reopenSheet();
}

/* ---- the market stall (shop) ---- */
let shopTab='treats';
function openShop(){
  SHEET='shop';
  const tabs=[['treats','Treats'],['decor','Island'],['build','Buildings'],['acc','Dress-up']];
  const list=CATALOG[shopTab].filter(x=>(!x.event||eventActive(x.event))&&!x.own);
  const cards=list.map(it=>{
    let btn='';
    const cst=costOf(shopTab,it),buyBtn=`<button class="btn btn-primary btn-sm" data-act="buy" data-id="${it.id}" ${S.embers>=cst?'':'disabled'}>${ic('ember',16)} ${cst}</button>`;
    if(shopTab==='treats') btn=buyBtn;
    else if(shopTab==='decor') btn=S.inv.decor.includes(it.id)?`<span class="own">On your island</span>`:buyBtn;
    else if(shopTab==='build') btn=built(it.id)?`<span class="own">Built</span>`:buyBtn;
    else btn=S.inv.acc.includes(it.id)?`<button class="btn btn-sm" data-act="wear" data-id="${it.id}" data-slot="${it.slot}">${(S.dragon.gear||{})[it.slot]===it.id?'Take off':'Wear'}</button>`:buyBtn;
    return `<div class="card">${catalogIcon(shopTab,it)}<b>${it.name}</b><small>${it.note}${shopTab==='treats'?` You have ${S.inv[it.id]}.`:''}</small>${btn}</div>`;
  }).join('');
  const hint=shopTab==='build'?`<p class="sub">New buildings appear on the island where you see a staked-out plot.${built('forge')?'':' The forge unlocks metal armour.'}${built('stables')?'':' The stables make room for more dragons.'}${built('clothes')?'':' The clothes shop sells outfits and gear for you.'} The newer buildings go on the Village Green: tap Map, then Village Green.</p>`:shopTab==='decor'?`<p class="sub">Look for the plots on the island to see where each one goes.</p>`:'';
  openSheet(`<div class="row spread"><h2>Market</h2><div class="row"><span class="pill gold num">${ic('ember',18)} ${S.embers}</span><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div></div>
    <div class="tabs" role="tablist">${tabs.map(([k,l])=>`<button class="tab" role="tab" data-act="shoptab" data-k="${k}" aria-selected="${shopTab===k}">${l}</button>`).join('')}</div>${hint}<div class="shop">${cards}</div>`,{wide:true});
}
function spendAndGive(tab,it){
  if(!it||S.embers<costOf(tab,it)) return false;
  if(tab==='decor'&&S.inv.decor.includes(it.id)) return false; if(tab==='build'&&built(it.id)) return false;
  if((tab==='acc'||tab==='forge')&&S.inv.acc.includes(it.id)) return false;
  S.embers-=costOf(tab,it); Audio_.fx('buy');
  if(tab==='treats') S.inv[it.id]=(S.inv[it.id]||0)+1;
  else if(tab==='decor') S.inv.decor.push(it.id);
  else if(tab==='build') S.inv.built.push(it.id);
  else { S.inv.acc.push(it.id); (S.dragon.gear||(S.dragon.gear={}))[it.slot]=it.id; }
  saveState(); villageRefresh(); return true;
}
function buy(id){
  const it=CATALOG[shopTab].find(x=>x.id===id); if(!spendAndGive(shopTab,it)) return;
  reopenSheet();
  toast(shopTab==='build'?`${it.name}: built! Go and look at it.`:`${it.name}: yours!`);
}

/* ---- the forge: metal armour ---- */
function openForge(){
  SHEET='forge'; const gear=S.dragon.gear||{};
  const cards=CATALOG.forge.map(it=>{
    const have=S.inv.acc.includes(it.id);
    const btn=have?(S.dragon.hatched?`<button class="btn btn-sm" data-act="wear" data-id="${it.id}" data-slot="${it.slot}">${gear[it.slot]===it.id?'Take off':'Wear'}</button>`:`<span class="own">Yours</span>`):`<button class="btn btn-primary btn-sm" data-act="buyf" data-id="${it.id}" ${S.embers>=it.cost?'':'disabled'}>${ic('ember',16)} ${it.cost}</button>`;
    return `<div class="card"><div style="padding-top:14px">${catalogIcon('forge',it)}</div><b>${it.name}</b><small>${it.note} (${SLOT_NAMES[it.slot]})</small>${btn}</div>`}).join('');
  openSheet(`<div class="row spread"><h2>The Forge</h2><div class="row"><span class="pill gold num">${ic('ember',18)} ${S.embers}</span><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div></div>
    <p class="sub">The blacksmith hammers metal gear for ${esc(S.dragon.name)}. Chain mail and dragon plate both go on the body, so wear one at a time.</p><div class="shop">${cards}</div>`,{wide:true});
}
function buyForge(id){ const it=CATALOG.forge.find(x=>x.id===id); if(!spendAndGive('forge',it)) return; reopenSheet(); toast(`${it.name}: forged and yours!`); }

/* ---- the stables: more than one dragon ---- */
let createExtra=false;
function openStables(){
  SHEET='stables';
  const all=[{d:S.dragon,active:true,k:-1}].concat(S.extra.map((d,k)=>({d,active:false,k})));
  const cards=all.map(({d,active,k})=>{
    const art=d.hatched?dragonSVG(d,{mood:'happy',stage:dragonStage(d),wear:d.gear,uid:'st'+k}):`<div style="width:90px;margin:0 auto">${eggSVG(d)}</div>`;
    const sub=d.hatched?STAGE_NAMES[dragonStage(d)]:'Egg. Hatches after your next practice.';
    const btn=active?`<span class="own">Walking with you</span>`:d.hatched?`<button class="btn btn-primary btn-sm" data-act="swapdragon" data-k="${k}">Walk with ${esc(d.name)}</button>`:`<span class="note" style="color:var(--ink2)">Warm and waiting</span>`;
    return `<div class="dcard">${art}<b>${esc(d.name)}</b><small>${sub}</small>${btn}</div>`}).join('');
  const n=S.extra.length, cost=EGG_COSTS[n];
  const adopt=n<EGG_COSTS.length?`<div class="dcard"><svg viewBox="0 0 24 24" style="width:60px;color:var(--ember)">${ICONS.star}</svg><b>A new dragon egg</b><small>Design another dragon. It hatches after your next practice.</small><button class="btn btn-ember btn-sm" data-act="newegg" ${S.embers>=cost?'':'disabled'}>${ic('ember',16)} ${cost}</button></div>`:`<div class="dcard"><b>The stables are full</b><small>Three dragons is the most these stables can hold, for now.</small></div>`;
  openSheet(`<div class="row spread"><h2>The Stables</h2><div class="row"><span class="pill gold num">${ic('ember',18)} ${S.embers}</span><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div></div>
    <p class="sub">Your dragons rest here. Pick who walks with you around the island and flies you.</p><div class="dgrid">${cards}${adopt}</div>`,{wide:true});
}
function swapDragon(k){
  const e=S.extra[k]; if(!e||!e.hatched) return;
  S.extra[k]=S.dragon; S.dragon=e; saveState(); Audio_.fx('good'); villageRefresh(); openStables(); toast(`${e.name} is walking with you now.`);
}

/* ---- grown-ups ---- */
function itemLabel(it){ return it.kind==='bond'?`${it.a}+?`:it.kind==='add'||it.kind==='wadd'?`${it.x}+${it.y}`:it.kind==='tadd'?`${it.T}+${it.u}`:it.kind==='sub'?`${it.n}−${it.m}`:it.kind==='tsub'?`${it.c}−${it.u}`:it.kind==='wsub'?`${it.c}−?`:`fam ${it.x}+${it.y}`; }
function median(a){ if(!a.length) return null; const s=a.slice().sort((x,y)=>x-y), m=Math.floor(s.length/2); return s.length%2?s[m]:(s[m-1]+s[m])/2; }
function fmtS(ms){ if(ms==null) return '–'; const s=Math.round(ms/1000); return s<90?`${s}s`:`${Math.round(s/60)} min`; }
function faceWord(v){return v===3?'good':v===2?'okay':v===1?'worried':'no answer';}

/* ---- grown-ups gate: hold the lock for a second, or answer a grown-up sum ---- */
let GATE={a:0,b:0,ans:0};
function openGate(){
  const a=pick([13,14,16,17,18,19]), b=pick([6,7,8,9]); GATE={a,b,ans:a*b};
  openSheet(`<div class="row spread"><h2>Grown-ups</h2><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div>
    <p class="sub">This part is for adults. Answer this sum to open it. (Or press and hold the lock button for a couple of seconds.)</p>
    <div class="center"><div style="font-size:2rem;font-weight:700;margin:6px 0">${a} &times; ${b} = ?</div>
    <input class="field" id="gans" inputmode="numeric" pattern="[0-9]*" maxlength="4" style="max-width:180px;text-align:center;font-size:1.6rem" autocomplete="off" aria-label="Answer">
    <div class="row" style="justify-content:center;margin-top:10px"><button class="btn btn-primary" data-act="gate-go">Open</button></div></div>`);
  const i=$('#gans'); if(i){ i.focus(); i.addEventListener('keydown',e=>{ if(e.key==='Enter'){ e.preventDefault(); const b=$('[data-act="gate-go"]'); if(b) b.click(); } }); }
}
function openGrownups(tab){
  tab=tab||'progress';
  const ss=S.sessions.filter(s=>!s.partial&&!s.bonus), last=ss.slice(-10);
  const secureN=ALL_ITEMS.filter(it=>isSecure(it.id)).length, seenN=ALL_ITEMS.filter(it=>isSeen(it.id)).length;
  /* 1 calmer starts */
  const fa=last.map(s=>s.firstAnswerMs).filter(x=>x!=null), de=last.map(s=>s.startDelayMs).filter(x=>x!=null);
  const faces=[1,2,3].map(v=>last.filter(s=>s.faceStart===v).length);
  const bars=last.length?`<div class="barline" role="img" aria-label="Seconds to first answer, last sessions">${last.map(s=>{const sec=s.firstAnswerMs==null?0:Math.min(120,s.firstAnswerMs/1000);return `<i style="height:${Math.max(4,sec/120*100)}%"><span>${s.firstAnswerMs==null?'–':Math.round(s.firstAnswerMs/1000)}</span></i>`;}).join('')}</div>`:'<p class="note">Shows after the first session.</p>';
  const calm=`<div class="box"><h3>Calmer starts</h3><p class="note">Seconds from the first question appearing to their first answer. Lower and steadier is calmer. Also how they said maths felt before starting.</p>${bars}
     <table><tr><th>Typical time to first answer</th><td>${fmtS(median(fa))}</td></tr><tr><th>Typical wait before starting</th><td>${fmtS(median(de))}</td></tr><tr><th>Felt at the start</th><td>${faces[2]} good, ${faces[1]} okay, ${faces[0]} worried</td></tr></table></div>`;
  /* 2 hard moments */
  const hA=last.reduce((a,s)=>a+(s.hardAsked||0),0), hT=last.reduce((a,s)=>a+(s.hardTry||0),0), hG=last.reduce((a,s)=>a+(s.hardGuess||0),0), hAll=hA+hT+hG;
  const pct=n=>hAll?Math.round(n/hAll*100):0;
  const hard=`<div class="box"><h3>When a question gets hard</h3><p class="note">What they did at the first sign of difficulty over the last ${last.length||0} sessions. Asking for help and trying again are the goals. Quick guessing is the thing to see fall.</p>
    <table><tr><th>Pressed "Not sure yet"</th><td class="num">${hA} (${pct(hA)}%)</td></tr><tr><th>Tried again with the tools</th><td class="num">${hT} (${pct(hT)}%)</td></tr><tr><th>Quick guess</th><td class="num">${hG} (${pct(hG)}%)</td></tr></table>
    ${hAll<6?'<p class="note">Too few hard moments so far to see a pattern.</p>':''}</div>`;
  /* 3 retention */
  const rev=S.log.filter(l=>l.gap!=null&&l.gap>=6&&l.kind==='train'), revOk=rev.filter(l=>l.clean).length;
  const snaps=S.snaps.slice(-14), mx=Math.max(1,ALL_ITEMS.length*.5, ...snaps.map(x=>x.secure));
  const trend=snaps.length?`<div class="barline" role="img" aria-label="Facts known after a week, by day">${snaps.map(x=>`<i style="height:${Math.max(4,x.secure/mx*100)}%;background:var(--moss)"><span>${x.secure}</span></i>`).join('')}</div>`:'';
  const ret=`<div class="box"><h3>Still known after a week</h3><p class="note">A fact counts as secure once they got it right unaided at a review about a week after learning it.</p>${trend}
    <table><tr><th>Facts secure now</th><td class="num">${secureN} of ${ALL_ITEMS.length} (${seenN} met so far)</td></tr>
    <tr><th>Right without help, 6+ days later</th><td class="num">${rev.length>=5?`${Math.round(revOk/rev.length*100)}% of ${rev.length} reviews`:`Needs about 5 reviews (${rev.length} so far)`}</td></tr></table></div>`;
  /* tools */
  const tl={counters:[0,0],line:[0,0],none:[0,0]}; S.log.filter(l=>l.kind==='train'&&l.tool&&tl[l.tool]).forEach(l=>{tl[l.tool][0]++; if(l.clean) tl[l.tool][1]++;});
  const tools=`<div class="box"><h3>Which method is working</h3><p class="note">Right first time, by the way they worked it out. Small numbers early on, so treat this as a hint only.</p>
    <table>${[['counters','Counters and ten-frames'],['line','Number line'],['none','Just knew it']].map(([k,l])=>`<tr><th>${l}</th><td class="num">${tl[k][0]?`${Math.round(tl[k][1]/tl[k][0]*100)}% of ${tl[k][0]}`:'–'}</td></tr>`).join('')}</table></div>`;
  /* facts */
  const facts=SKILLS.map((sk,i)=>{const p=skillStats(i); return `<div class="box"><h3>${sk.name}</h3><p class="note">${sk.blurb} ${skillUnlocked(i)?'':'<b>Locked until the one before is going well.</b>'} Secure: ${p.secure} of ${p.n}.</p><div class="facts">${sk.items.map(it=>{const b=boxOf(it.id);return `<span class="fact ${b>=0?'b'+b:''}" title="${b>=0?'Box '+b:'Not met yet'}">${itemLabel(it)}</span>`;}).join('')}</div></div>`;}).join('');
  const legend=`<div class="legend"><span class="fact">not met</span><span class="fact b0">needs help</span><span class="fact b1">learning</span><span class="fact b3">secure after a week</span></div>`;
  /* settings */
  const sel=(k,opts,cur)=>`<select data-set="${k}">${opts.map(([v,l])=>`<option value="${v}" ${String(cur)===String(v)?'selected':''}>${l}</option>`).join('')}</select>`;
  const backup=btoa(unescape(encodeURIComponent(JSON.stringify(S))));
  const settings=`<div class="box"><h3>Settings</h3>
    <div class="setrow"><span>Sound effects</span><button class="btn btn-sm" data-act="gset" data-k="sfx" aria-pressed="${S.settings.sfx}">${S.settings.sfx?'On':'Off'}</button></div>
    <div class="setrow"><span>Music (off by default, school notes noise can distract)</span><button class="btn btn-sm" data-act="gset" data-k="music" aria-pressed="${S.settings.music}">${S.settings.music?'On':'Off'}</button></div>
    <div class="setrow"><span>Island (bridge, flying, shards) opens without practice first. To switch or add a player, tap the name at the top left of the island</span><button class="btn btn-sm" data-act="gset" data-k="exploreAny" aria-pressed="${S.settings.exploreAny}">${S.settings.exploreAny?'On':'Off'}</button></div>
    <div class="setrow"><span>Volume</span><input type="range" min="0" max="100" value="${Math.round(S.settings.vol*100)}" data-set="vol" aria-label="Volume"></div>
    <div class="setrow"><span>Questions in a training session</span>${sel('sessionMax',[[8,'8 (short)'],[10,'10'],[12,'12']],S.settings.sessionMax)}</div>
    <div class="setrow"><span>New facts per day</span>${sel('newPerDay',[[2,'2'],[3,'3'],[4,'4']],S.settings.newPerDay)}</div>
    <div class="setrow"><span>Dragon Dash clock</span>${sel('dashMode',[['calm','Never offer a clock'],['choice','Let the child choose a gentle clock']],S.settings.dashMode)}</div>
    <div class="setrow"><span>Start from</span>${sel('startSkill',SKILLS.map((s,i)=>[i,s.name]),S.startSkill)}</div></div>`;
  const tips=`<div class="box"><h3>Sitting alongside</h3><ul style="margin:0;padding-left:1.2em;display:grid;gap:4px"><li>Ask "What is your first step?" before you say anything else.</li><li>Praise the strategy ("you made ten first") more than the answer.</li><li>If they ask for help, treat it as a smart move.</li><li>"You have not learned this securely yet" is kinder and truer than "you got it wrong".</li><li>Stop on a win. Ten minutes is plenty.</li></ul></div>`;
  const soon=`<div class="box"><h3>Planned next</h3><div class="soon">${LATER_SKILLS.map(([a,b])=>`<div>${ic('lock',16)}<span><b>${a}</b>. ${b}</span></div>`).join('')}</div></div>`;
  const bk=`<div class="box"><h3>Save code (move to another device)</h3><p class="note">This saves the current player (${esc((S.hero&&S.hero.name)||S.dragon.name)}) only. Progress lives in this browser. To move to another device, copy the save code, then paste it into "Restore" on the new device. Do this every few weeks as a backup too.</p>
    <textarea readonly id="bk" aria-label="Backup code">${backup}</textarea><div class="row"><button class="btn btn-sm" data-act="copy-bk">Copy save code</button></div>
    <textarea id="rs" aria-label="Paste a backup code to restore" placeholder="Paste a backup code here"></textarea><div class="row"><button class="btn btn-sm" data-act="restore">Restore from code</button><button class="btn btn-sm btn-ghost" data-act="reset-all" id="rsall">Erase this player</button></div></div>`;
  const tabs=[['progress','Progress'],['facts','Facts'],['settings','Settings']];
  const body=tab==='progress'?`<div class="grid2">${calm}${hard}${ret}${tools}</div>${tips}${soon}`:tab==='facts'?`${legend}<div class="grid2">${facts}</div>`:`<div class="grid2">${settings}${bk}</div>`;
  openSheet(`<div class="row spread"><h2>Grown-ups</h2><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div>
    <p class="sub">${esc((S.hero&&S.hero.name)||S.dragon.name)} has trained ${S.days.length} day${S.days.length===1?'':'s'} and played ${S.dash.plays.length} Dash${S.dash.plays.length===1?'':'es'}. ${storageOK?'':'<span class="warn">Saving is blocked in this browser, so use the backup code.</span>'}</p>
    <div class="tabs" role="tablist">${tabs.map(([k,l])=>`<button class="tab" role="tab" data-act="gtab" data-k="${k}" aria-selected="${tab===k}">${l}</button>`).join('')}</div><div class="gu">${body}</div>`,{wide:true});
}
function applySetting(k,v){
  const s=S.settings;
  if(k==='vol'){ s.vol=v/100; Audio_.setVol(s.vol); }
  else if(k==='startSkill'){ S.startSkill=+v; }
  else if(k==='dashMode'){ s.dashMode=v; }
  else s[k]=+v;
  saveState();
}

/* ---- events ---- */
document.addEventListener('pointerdown',()=>{ Audio_.ensure(); if(S&&S.settings.music&&!Audio_.musicOn) Audio_.startMusic(); },{once:false,passive:true});
document.addEventListener('click',e=>{
  const v=e.target.closest('[data-veil]'); if(v&&e.target===v&&!$('.sheet [data-act="tutorial-go"]')&&!$('.sheet [data-act="quit-yes"]')&&!$('.sheet [data-act="close-next"]')){ closeSheet(); return; }
  const el=e.target.closest('[data-act]'); if(!el) return;
  const a=el.dataset.act;
  switch(a){
    case 'opt': draft[el.dataset.k]=el.dataset.v; updateCreate(); Audio_.fx('tap'); break;
    case 'surprise': { const bs=shuffle(PAL).slice(0,2); draft.name=pick(NAMES); draft.body=bs[0].hex; draft.wing=bs[1].hex; draft.eyes=pick(EYES).hex; draft.horn=pick(HORNS)[0]; draft.pattern=pick(PATTERNS)[0]; draft.tail=pick(TAILS)[0]; $('#dname').value=draft.name; updateCreate(); Audio_.fx('pop'); break; }
    case 'create-go': { const n=(draft.name||'').trim(); if(!n){toast('Give your dragon a name first.');$('#dname').focus();break;}
      if(createExtra){ const cost=EGG_COSTS[S.extra.length]; if(!(S.embers>=cost)||S.extra.length>=EGG_COSTS.length){toast('Not enough embers yet.');break;}
        S.embers-=cost; S.extra.push(Object.assign({},draft,{name:n,hatched:false,gear:{},since:S.days.length})); createExtra=false; saveState(); Audio_.fx('good'); draft=null; goHome(); toast(`${n}'s egg is waiting in the stables.`); break; }
      S.dragon=Object.assign({},draft,{name:n,hatched:false,gear:{},since:S.days.length}); saveState(); Audio_.fx('good'); draft=null; goHome(); break; }
    case 'create-cancel': createExtra=false; draft=null; goHome(); break;
    case 'switch': openSwitch(); break;
    case 'play': playAs(el.dataset.key); break;
    case 'newplayer': try{ if(S&&S.hero) saveState(); }catch(e){} startNewPlayer(el.dataset.key); closeSheet(); break;
    case 'hopt': heroDraft.look[el.dataset.k]=el.dataset.v; heroDraft.name=($('#hname').value||heroDraft.name); updateHero(); Audio_.fx('tap'); break;
    case 'hsurprise': { const L=heroDraft.look; L.hair=pick(HERO_HAIR).hex; L.skin=pick(HERO_SKIN).hex; L.style=pick(HERO_STYLES)[0]; L.tunic=pick(HERO_TUNIC).hex; L.scarf=pick(HERO_SCARF).hex; if(!($('#hname').value||'').trim()) $('#hname').value=pick(HERO_NAMES); updateHero(); Audio_.fx('pop'); break; }
    case 'hero-go': heroDone(); break;
    case 'hero-cancel': { const k=lastPlayed()||SLOTS[0]; heroDraft=null; if(heroMode==='edit'){ goHome(); } else { S=loadState(k); rollDay(); Village.reset(); renderWho(); } break; }
    case 'edithero': closeSheet(); heroMode='edit'; heroDraft=JSON.parse(JSON.stringify(S.hero)); renderHero(); break;
    case 'clothtab': clothTab=el.dataset.k; openClothes(); break;
    case 'buyc': buyCloth(el.dataset.id); break;
    case 'wearc': wearCloth(el.dataset.id,el.dataset.slot); break;
    case 'newegg': if(S.extra.length<EGG_COSTS.length&&S.embers>=EGG_COSTS[S.extra.length]){ createExtra=true; draft=null; closeSheet(); renderCreate(); } break;
    case 'swapdragon': swapDragon(+el.dataset.k); break;
    case 'cuddle': Audio_.fx('heart'); toast(`${S.dragon.name} loves the cuddle!`); break;
    case 'vschool': Village.goToSchool(); break;
    case 'vfly': Village.toggleFly(); break;
    case 'feed': closeSheet(); Village.feedTime(); break;
    case 'dragonbook': openBook(); break;
    case 'nest': openNest(); break;
    case 'drill': closeSheet(); Village.drill(); break;
    case 'craft': craft(el.dataset.id); break;
    case 'trainskill': trainSkill(el.dataset.id); break;
    case 'splash-go': { const f=SPLASH_CB; SPLASH_CB=null; if(f) f(); break; }
    case 'claimc': claimCloth(el.dataset.id); break;
    case 'vmap': Village.openMap(); break;
    case 'travel': Village.travelTo(el.dataset.id); break;
    case 'buyf': buyForge(el.dataset.id); break;
    case 'sfx': S.settings.sfx=!S.settings.sfx; saveState(); Village.hud(); break;
    case 'music': S.settings.music=!S.settings.music; saveState(); Audio_.syncMusic(); Village.hud(); break;
    case 'train': startTraining(false); break;
    case 'bonus': startTraining(true); break;
    case 'dash': { const r=dashLockedReason(); if(r) toast(r); else showDashIntro(); break; }
    case 'dash-go': startDash(el.dataset.clock==='1'); break;
    case 'dash-quit': if(DASH){clearInterval(DASH.timer);DASH.done=true;} goHome(); break;
    case 'dnum': if(DASH&&!DASH.locked&&DASH.ans.length<2){ DASH.ans+=el.dataset.d; Audio_.fx('tap'); renderDash(); if(DASH.ans.length===String(DASH.q.ans).length) setTimeout(dashAnswer,220); } break;
    case 'dback': if(DASH&&!DASH.locked){DASH.ans=DASH.ans.slice(0,-1);renderDash();} break;
    case 'dcheck': dashAnswer(); break;
    case 'home': goHome(); break;
    case 'home-after': goHome(); break;
    case 'feed': openNest(); break;
    case 'give': giveTreat(el.dataset.id); break;
    case 'shop': openShop(); break;
    case 'shoptab': shopTab=el.dataset.k; openShop(); break;
    case 'buy': buy(el.dataset.id); break;
    case 'wear': wearItem(el.dataset.id,el.dataset.slot); break;
    case 'close': closeSheet(); break;
    case 'gate': { if(Date.now()-holdOpenedAt<900) break; openGate(); break; }
    case 'gate-go': { const v=($('#gans').value||'').trim(); if(+v===GATE.ans){ openGrownups(); } else { toast('Not quite. Here is a new one.'); openGate(); } break; }
    case 'face': SESS.faceStart=+el.dataset.v||null; beginPlan(); break;
    case 'endface': { const v=+el.dataset.v; if(SESS&&SESS.rec){SESS.rec.faceEnd=v; saveState();} $$('#endfaces .face').forEach(b=>b.style.borderColor=b===el?'var(--tide)':''); Audio_.fx('tap'); break; }
    case 'hatch': S.dragon.hatched=true; saveState(); Audio_.fx('hatch'); setTimeout(()=>renderEnd('hatched'),reduceMotion()?50:900); break;
    case 'tutorial-go': S.tutorialSeen=true; saveState(); closeSheet(); nextQuestion(); break;
    case 'tool': if(Q) switchTool(el.dataset.t); break;
    case 'reset': if(Q&&!Q.locked){ activeTool().reset(); setFb('','Fresh start. Take your time.'); } break;
    case 'num': if(Q&&!Q.done&&!Q.locked&&Q.answer.length<2){ setAnswer(Q.answer+el.dataset.d); Audio_.fx('tap'); Q.lastAct=Q.lastAct; } break;
    case 'back': if(Q&&!Q.done) setAnswer(Q.answer.slice(0,-1)); break;
    case 'check': submitAnswer(); break;
    case 'help': pressHelp(false); break;
    case 'next': afterQuestion(); break;
    case 'quit': quitTraining(); break;
    case 'quit-yes': closeSheet(); finishSession(true); break;
    case 'breathe': showBreather('close'); break;
    case 'breathe-next': showBreather('close-next'); break;
    case 'close-next': closeSheet(); nextQuestion(); break;
    case 'gtab': openGrownups(el.dataset.k); break;
    case 'gset': { const k=el.dataset.k; S.settings[k]=!S.settings[k]; saveState(); if(k==='music') Audio_.syncMusic(); openGrownups('settings'); break; }
    case 'copy-bk': { const t=$('#bk'); t.select(); let ok=false; try{ navigator.clipboard.writeText(t.value).then(()=>toast('Backup code copied.'),()=>{try{document.execCommand('copy');toast('Backup code copied.');}catch(_){toast('Select the text and copy it.');}}); ok=true; }catch(_){} if(!ok){try{document.execCommand('copy');toast('Backup code copied.');}catch(_){toast('Select the text and copy it.');}} break; }
    case 'restore': { const t=$('#rs').value.trim(); try{ const o=JSON.parse(decodeURIComponent(escape(atob(t)))); if(!o||o.v!==1||!o.dragon) throw new Error('bad'); if((o.ver||1)>SCHEMA){toast('That backup is from a newer version of the app. Update this one first.');break;} S=migrate(Object.assign(freshState(),o,{ver:o.ver||1})); SAVE_LOCKED=false; saveState(); toast('Restored.'); closeSheet(); goHome(); }catch(_){ toast('That code did not work. Check you pasted all of it.'); } break; }
    case 'reset-all': if(el.dataset.sure){ const k=SAVE_KEY; try{localStorage.removeItem(k);}catch(_){} closeSheet(); const rest=listProfiles(); if(rest.length){ S=loadState(rest[0].key); rollDay(); Village.reset(); renderWho(); } else startNewPlayer(k); } else { el.dataset.sure='1'; el.textContent='Tap again to erase this player'; } break;
  }
});
document.addEventListener('change',e=>{ const el=e.target.closest('[data-set]'); if(el) applySetting(el.dataset.set,el.value); });
document.addEventListener('input',e=>{
  const el=e.target.closest('[data-set]'); if(el&&el.type==='range') applySetting(el.dataset.set,el.value);
  if(e.target.id==='dname'&&draft){ draft.name=e.target.value; }
});
/* hold-to-open for grown-ups */
let holdT=null, holdOpenedAt=0;
function holdStart(btn){ const i=btn.querySelector('i'); if(i){i.style.transition='width 1.2s linear'; i.style.width='100%';} holdT=setTimeout(()=>{holdT=null; if(i){i.style.transition='none';i.style.width='0';} holdOpenedAt=Date.now(); openGrownups();},1200); }
function holdStop(btn){ if(holdT){clearTimeout(holdT);holdT=null;} const i=btn&&btn.querySelector('i'); if(i){i.style.transition='width .2s';i.style.width='0';} }
document.addEventListener('contextmenu',e=>{ if(e.target.closest&&e.target.closest('#holdgu')) e.preventDefault(); });
document.addEventListener('pointerdown',e=>{const b=e.target.closest('#holdgu'); if(b) holdStart(b);});
['pointerup','pointerleave','pointercancel'].forEach(t=>document.addEventListener(t,e=>{const b=e.target.closest&&e.target.closest('#holdgu'); if(b) holdStop(b);},true));
document.addEventListener('keydown',e=>{
  if(screen==='village'&&!e.target.closest('#holdgu')){ if(Village.onKey(e)){ e.preventDefault(); return; } }
  const b=e.target.closest&&e.target.closest('#holdgu'); if(b&&(e.key==='Enter'||e.key===' ')&&!e.repeat){holdStart(b);e.preventDefault();return;}
  const tag=(e.target.tagName||'').toLowerCase(); if(tag==='input'||tag==='textarea'||tag==='select') return;
  if($('#overlay').children.length) { if(e.key==='Escape'&&!$('.sheet [data-act="tutorial-go"]')) closeSheet(); return; }
  if(screen==='question'&&Q){
    if(/^[0-9]$/.test(e.key)){ if(!Q.done&&!Q.locked&&Q.answer.length<2){ setAnswer(Q.answer+e.key); Audio_.fx('tap'); } e.preventDefault(); }
    else if(e.key==='Backspace'){ if(!Q.done) setAnswer(Q.answer.slice(0,-1)); e.preventDefault(); }
    else if(e.key==='Enter'){ if(Q.done) afterQuestion(); else submitAnswer(); e.preventDefault(); }
  }else if(screen==='dash'&&DASH){
    if(/^[0-9]$/.test(e.key)&&!DASH.locked&&DASH.ans.length<2){ DASH.ans+=e.key; renderDash(); if(DASH.ans.length===String(DASH.q.ans).length) setTimeout(dashAnswer,220); e.preventDefault(); }
    else if(e.key==='Backspace'&&!DASH.locked){ DASH.ans=DASH.ans.slice(0,-1); renderDash(); e.preventDefault(); }
    else if(e.key==='Enter'){ dashAnswer(); e.preventDefault(); }
  }
});
document.addEventListener('keyup',e=>{ if(screen==='village') Village.onKeyUp(e); const b=e.target.closest&&e.target.closest('#holdgu'); if(b) holdStop(b);});

/* ---- boot ---- */
S=loadState(); rollDay();
window.EmberIsle={Village,act:(a,d={})=>{const el=document.createElement('button');el.dataset.act=a;Object.assign(el.dataset,d);document.body.appendChild(el);el.click();el.remove();},state:()=>S,setToday:d=>{TODAY_OVERRIDE=d;rollDay();},save:saveState,ITEM,SKILLS,buildPlan,dueItems,applyResult,makeQ,Q:()=>Q,SESS:()=>SESS,DASH:()=>DASH,goHome,openGrownups,fresh:()=>{S=freshState();draft=null;}};
Village.preload();
{ const profs=listProfiles();
  if(!profs.length){ SAVE_KEY=SLOTS[0]; showSplash(null,()=>startNewPlayer(SLOTS[0])); }
  else if(profs.length===1){ S=loadState(profs[0].key); rollDay(); showSplash(S.hero&&S.hero.done?S.hero.name:null,()=>enterGame()); }
  else { const last=lastPlayed(); S=loadState(profs.some(p=>p.key===last)?last:profs[0].key); rollDay(); showSplash(null,()=>renderWho()); } }
