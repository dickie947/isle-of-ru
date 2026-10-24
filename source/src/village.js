/* ===== Village: the island is the home screen. Walk to the school house, then explore. ===== */
const VS={ready:false,painting:null,prevDone:null,pos:null,raf:0,hour:null,sparkle:0,bg:null,loadP:0,idle:[]};
let BASE=null;
const OBJ=[],blocked=[],notes=new Map(),acts=new Map(),trig=new Map(),TREES=[];
for(let j=0;j<H;j++)blocked.push(new Array(W).fill(false));
const key=(i,j)=>i+','+j;
function block(cells,note,act){cells.forEach(([i,j])=>{if(blocked[j]&&i>=0&&i<W){blocked[j][i]=true;if(note)notes.set(key(i,j),note);if(act)acts.set(key(i,j),act)}})}
function addObj(spr,wx,wy,ax,ay,o={}){const sc=o.sc||1;const it=Object.assign({spr,x:wx*T,y:wy*T,ax:ax*sc,ay:ay*sc,w:spr.width/SC*sc,h:spr.height/SC*sc},o);OBJ.push(it);return it}
const MSG={
 house:"This is the school house. Today's practice happens inside.",
 tower:"The lookout tower. From the top you can see other islands. Tap Map to fly to them as they open.",
 ship:"A longship is moored at the dock. Tap Map to see the other islands.",
 bridge:"The bridge is being mended. Finish today's practice at the school house and it will be ready.",
 fire:"The campfire crackles. A good place to rest.",lantern:"A warm lantern.",banner:"The banner flaps in the sea breeze."};
const PLOTS={ /* where each shop item goes: x,y (tile coords), scale */
 forge:{x:22.9,y:11.0,sc:1,k:'build'},stables:{x:11.6,y:11.0,sc:1,k:'build'},clothes:{x:33.3,y:17.3,sc:1,k:'build'},
 campfire:{x:22.5,y:17.9,sc:.8,k:'decor'},lantern:{x:16.6,y:11.95,sc:.6,k:'decor'},banner:{x:21.7,y:13.6,sc:.6,k:'decor'},
 pines:{x:12.6,y:20.6,sc:.8,k:'decor'},jetty:{x:31.5,y:21.6,sc:.8,k:'decor'},tower:{x:36,y:9.95,sc:1,k:'decor'},
 garden:{x:16.4,y:16.6,sc:.8,k:'decor'},fountain:{x:19.5,y:16.2,sc:.9,k:'decor'},windmill:{x:6.6,y:15.5,sc:.9,k:'decor'},statue:{x:29.6,y:14.6,sc:.9,k:'decor'}};
Object.assign(PLOTS,GREEN_PLOTS,GREEN_DECOR);
const GROVE=[[10.8,19.6],[12.2,19.2],[13.6,19.9],[11.6,21],[13,21.4],[14.4,21]];
const STABLE_SPOTS=[[10.4,12.3],[12.7,12.3]];
const own=id=>S.inv.decor.includes(id), built=id=>S.inv.built.includes(id);
const done=()=>!!(S.day.trained||S.settings.exploreAny);
const hatched=()=>!!(S.dragon&&S.dragon.hatched);

/* ---------- scatter trees once (never moves) ---------- */
function scatter(){
  TREES.length=0;
  if(!Z.home)return scatterIsle();
  const r=mulberry(4242);
  const rects=[[14,5.5,21.5,11.8],[8.6,7,14.6,13.9],[20.4,6.8,25.2,11.8],[5,9,9.6,12.6],[29,10.5,33.4,13.4],[34,7,38,10.8],[15.8,10.8,20.4,13.4],[12.4,12.2,15.8,14.6],[20.5,12.6,23,14.8],[21.4,16.4,24,19.2],[9.4,18.6,15.4,22.6],[30.4,20.6,33.2,24.8]];
  const inRect=(x,y)=>rects.some(q=>x>q[0]&&x<q[2]&&y>q[1]&&y<q[3]);
  for(let y=1;y<H-1;y+=.95)for(let x=1;x<W-1;x+=.95){
    const px=x+(r()-.5)*.8,py=y+(r()-.5)*.8,i=Math.floor(px),j=Math.floor(py);
    if(!walk[j][i]||inRect(px,py)||!isGrass(px,py,.28)||Math.hypot(px-18,py-15.3)<4.2)continue;
    const rv=rockV(px,py),cl=fbm(px*.34+11,py*.34);
    let p=cl>.52?.62:cl>.45?.2:.035;if(rv>-3.4&&rv<-1.0)p=Math.max(p,.5);
    if(r()>p)continue;
    const q=r();TREES.push({px,py,i,j,kind:q<.82?'pine':q<.93?'bush':'rock',v:(r()*3)|0});
  }
}

/* ---------- build the live object list from what Ruan owns ---------- */
function buildObjects(){
  OBJ.length=0;notes.clear();acts.clear();trig.clear();
  for(let j=0;j<H;j++)blocked[j].fill(false);
  if(Z.home){
  dockCells.forEach(([i,j])=>{walk[j][i]=own('jetty')});
  // school house
  addObj(SPR.house,18,11,140,224,{});
  const hc=[];for(let i=15;i<=20;i++)for(let j=7;j<=10;j++)hc.push([i,j]);block(hc,MSG.house);
  trig.set(key(17,11),'school');trig.set(key(18,11),'school');
  // nest (and the egg while it waits)
  addObj(SPR.nest,7.2,11.95,65,72,{});block([[6,10],[7,10],[8,10],[6,11],[7,11],[8,11]],null,'nest');
  if(S.dragon&&!S.dragon.hatched){VS.egg=eggSprite(S.dragon);addObj(VS.egg,7.2,11.55,23,50,{})}
  // market and the dash arch
  addObj(SPR.stall,31.6,12.95,65,104,{});block([[30,12],[31,12],[32,12]],null,'stall');
  addObj(SPR.dashgate,14.3,13.55,60,110,{sc:.9});block([[13,13],[15,13]],null,'dash');trig.set(key(14,13),'dash');
  addObj(SPR.sign,23.8,14.0,30,64,{});block([[23,13]],MSG.bridge);
  addObj(SPR.logs,20.3,18.3,35,28,{});addObj(SPR.logs,24.8,18.1,35,28,{});
  // things Ruan has bought, or the plot waiting for them
  const plot=(id)=>{const p=PLOTS[id],nm=(CATALOG[p.k].find(x=>x.id===id)||{}).name||id;
    addObj(SPR.plot,p.x,p.y,50,64,{sc:p.sc});block([[Math.floor(p.x),Math.floor(p.y-.3)]],null,'plot:'+id)};
  if(built('forge')){addObj(SPR.forge,22.9,11.0,95,148,{sc:.8,smoke:[130,6]});block([[21,9],[22,9],[23,9],[24,9],[21,10],[22,10],[23,10],[24,10]],null,'forge')}else plot('forge');
  if(built('stables')){addObj(SPR.stables,11.6,11.0,110,148,{sc:.85});block([[9,9],[10,9],[11,9],[12,9],[13,9],[9,10],[10,10],[11,10],[12,10],[13,10]],null,'stables');
    S.extra.forEach((e,k)=>{const sp=STABLE_SPOTS[k];if(sp)block([[Math.floor(sp[0]),Math.floor(sp[1])]],null,'stables')})}else plot('stables');
  if(built('clothes')){addObj(SPR.clothes,33.3,17.3,90,148,{sc:.8});block([[32,15],[33,15],[34,15],[32,16],[33,16],[34,16]],null,'clothes')}else plot('clothes');
  if(own('campfire')){addObj(SPR.firepit,22.5,17.55,30,17,{under:true});block([[22,17]],MSG.fire)}else plot('campfire');
  if(own('lantern')){[[16.5,11.9],[19.5,11.9],[24.4,16.4]].forEach(([x,y])=>{addObj(SPR.lantern,x,y,20,78,{glow:[20,24]});block([[Math.floor(x),Math.floor(y)]],MSG.lantern)})}else plot('lantern');
  if(own('banner')){addObj(SPR.banner,21.7,13.7,22,122,{});block([[21,13]],MSG.banner)}else plot('banner');
  if(own('pines')){GROVE.forEach(([x,y],k)=>{addObj(SPR.pine[k%3],x,y,35,98,{tree:1});block([[Math.floor(x),Math.floor(y-.35)]])})}else plot('pines');
  if(own('jetty')){addObj(SPR.dock,31.25,21,2,0,{under:true});addObj(SPR.ship,35.3,24.9,90,128,{ship:true});block([[31,25],[32,25],[30,24],[33,24]],MSG.ship)}else plot('jetty');
  if(own('tower')){addObj(SPR.tower,36,9.95,60,176,{});block([[35,9],[36,9]],MSG.tower)}else plot('tower');
  if(own('garden'))addObj(SPR.garden,16.4,16.7,48,34,{under:true});else plot('garden');
  if(own('fountain')){addObj(SPR.fountain,19.5,16.2,45,76,{sc:.9});block([[19,15]],"A little fountain. The water sparkles.")}else plot('fountain');
  if(own('windmill')){addObj(SPR.windmill,6.6,15.5,50,150,{sc:.9});block([[6,15]],"The windmill creaks round and round.")}else plot('windmill');
  { const mi=millieToday(),sp=MILLIE_SPOTS[mi.spot];
    if(done()&&hatched()&&sp&&okGround(Math.floor(sp.x),Math.floor(sp.y))){addObj(mi.rescued?millieSprite('free',null):millieSprite('stuck',sp.prop),sp.x,sp.y,32,60,{});block([[Math.floor(sp.x),Math.floor(sp.y-.3)]],null,'millie')} }
  placeVillagers();
  todaysMounds().forEach(([i,j],n)=>{if(!(S.day.dug||[]).includes(n)){addObj(SPR.mound,i+.5,j+.8,20,22,{});block([[i,j]],null,'dig:'+n)}});
  if(eventActive('xmas')&&okGround(16,14)){addObj(SPR.xtree,16.5,14.7,35,102,{sc:.95,glow:[35,56],glowCol:'255,220,120',glowR:30});block([[16,14]],"A Christmas tree, sparkling with lights.")}
  if(own('statue')){addObj(SPR.statue,29.6,14.6,40,110,{sc:.9});block([[29,14]],"A stone dragon, standing guard over the island.")}else plot('statue');
  }else buildIsle();
  // trees
  for(const t of TREES){
    if(t.kind==='pine'){const ts=SPR[Z.pine||'pine'];const tsp=ts[t.v%ts.length];addObj(tsp,t.px,t.py+.35,tsp.width/SC/2,tsp.height/SC-6,{tree:1})}
    else if(t.kind==='bush')addObj(SPR[Z.bush||'bush'],t.px,t.py+.3,23,30,{});
    else addObj(SPR[Z.rockSpr||'rock'],t.px,t.py+.3,23,30,{});
    block([[t.i,t.j]]);
  }
  OBJ.sort((a,b)=>a.y-b.y);
}

/* ---------- player, dragon, camera ---------- */
const G={mode:'ground',alt:0,joined:false,t:0,doorAsked:false,modal:false,bridge:0,curtain:0};
const P={x:18.5,y:14.5,sx:0,sy:0,ex:0,ey:0,t:0,moving:false,dir:'u',ph:0,queue:[],pending:null,vx:0};
const Dg={x:17.5,y:14.5,dir:'u',ph:0,moving:false,trail:[]};
const held=[],cam={x:0,y:0,z:1,init:false},parts=[];
const ptile=()=>[Math.floor(P.x),Math.floor(P.y)];
const DIRS={u:[0,-1],d:[0,1],l:[-1,0],r:[1,0]};
function okGround(i,j){
  if(i<0||j<0||i>=W||j>=H)return false;
  if(blocked[j][i])return false;
  if(Z.home&&i>=25&&i<=28&&(j===14||j===15))return G.bridge>=1;
  return walk[j][i];
}
const flying=()=>G.mode==='fly'&&G.joined;

/* ---------- on-screen text ---------- */
let typing=null,dcb=[],dFull='';
function vsay(text,buttons){
  const dl=$('#vdlg');if(!dl)return;
  G.modal=true;dl.hidden=false;const dbtn=$('#vdbtn'),dtxt=$('#vdtxt');dbtn.innerHTML='';dtxt.textContent='';dcb=buttons||[{label:'OK'}];dFull=text;
  let n=0;clearInterval(typing);
  const showBtns=()=>{dbtn.innerHTML='';dcb.forEach((b,i)=>{const el=document.createElement('button');el.textContent=b.label;el.className='btn'+(i===0?' btn-primary':'');el.onclick=()=>{closeSay();b.fn&&b.fn()};dbtn.appendChild(el)})};
  vsay._show=showBtns;
  if(reduceMotion()){dtxt.textContent=text;showBtns();return}
  typing=setInterval(()=>{n+=2;dtxt.textContent=text.slice(0,n);if(n>=text.length){clearInterval(typing);typing=null;showBtns()}},22);
}
function closeSay(){clearInterval(typing);typing=null;const dl=$('#vdlg');if(dl)dl.hidden=true;G.modal=false}
function skipTyping(){if(typing){clearInterval(typing);typing=null;$('#vdtxt').textContent=dFull;vsay._show()}else{const b=$('#vdbtn button');b&&b.click()}}
let vtT=0;
function vtoast(t,ms=2600){const el=$('#vtoast');if(!el)return;el.textContent=t;el.classList.add('on');clearTimeout(vtT);vtT=setTimeout(()=>el.classList.remove('on'),ms)}

/* ---------- path finding and moving ---------- */
function bfs(si,sj,ti,tj){
  const prev=new Map(),q=[[si,sj]];prev.set(key(si,sj),null);
  while(q.length){const [i,j]=q.shift();if(i===ti&&j===tj)break;
    for(const d of ['u','d','l','r']){const ni=i+DIRS[d][0],nj=j+DIRS[d][1],k=key(ni,nj);
      if(prev.has(k)||!okGround(ni,nj))continue;prev.set(k,[i,j,d]);q.push([ni,nj])}}
  if(!prev.has(key(ti,tj)))return null;
  const out=[];let c=key(ti,tj);while(prev.get(c)){const [i,j,d]=prev.get(c);out.unshift(d);c=key(i,j)}return out}
function line(si,sj,ti,tj){const out=[];let i=si,j=sj;
  while(i!==ti||j!==tj){const di=ti-i,dj=tj-j;if(Math.abs(di)>=Math.abs(dj)){out.push(di>0?'r':'l');i+=di>0?1:-1}else{out.push(dj>0?'d':'u');j+=dj>0?1:-1}}return out}
const stepDur=()=>flying()?(skillOwned(S.dragon,'speed')?.075:.105):.165;
function tryStep(d){
  const [ti,tj]=ptile(),ni=ti+DIRS[d][0],nj=tj+DIRS[d][1];P.dir=d;
  const ok=flying()?(ni>=1&&nj>=1&&ni<W-1&&nj<H-1):(okGround(ni,nj)&&!npcAt(ni,nj));
  if(!ok){bump(ni,nj);return false}
  P.sx=P.x;P.sy=P.y;P.ex=ni+.5;P.ey=nj+.5;P.t=0;P.moving=true;
  if(!flying()){Dg.trail.push([P.sx,P.sy]);if(Dg.trail.length>3)Dg.trail.shift()}
  return true;
}
let lastBump=0;
function bump(i,j){
  if(G.modal||overlayOpen())return;
  const k=key(i,j),a=acts.get(k),n=notes.get(k),now=performance.now();
  if(now-lastBump<900)return;
  const np=npcAt(i,j);if(np){lastBump=now;talkTo(np);return}
  if(a){lastBump=now;runAct(a);return}
  if(n){lastBump=now;vsay(n);return}
  if(!flying()&&(i<0||j<0||i>=W||j>=H||landV(i+.5,j+.5)<.05||pondV(i+.5,j+.5)>-.1||chanV(i+.5,j+.5)>-.12)){lastBump=now;vtoast(done()&&hatched()?'Water ahead. Your dragon can fly you over it.':'Water ahead.',1800)}
}
function interactFacing(){const [ti,tj]=ptile(),ni=ti+DIRS[P.dir][0],nj=tj+DIRS[P.dir][1],k=key(ni,nj);const np=npcAt(ni,nj);if(np){talkTo(np);return}const a=acts.get(k),n=notes.get(k);if(a)runAct(a);else if(n)vsay(n)}
const overlayOpen=()=>{const o=$('#overlay');return !!(o&&o.children.length)};

/* what happens when he walks into a building or onto a special tile */
function runAct(a){
  if(BUILD_ACTS[a])return BUILD_ACTS[a]();
  if(a.startsWith('hs:'))return hsFlag(+a.slice(3));
  if(a==='nest')return openNest();
  if(a==='stall')return openShop();
  if(a==='forge')return openForge();
  if(a==='stables')return openStables();
  if(a==='clothes')return openClothes();
  if(a==='chest')return openChest();
  if(a.startsWith('vill:')){const v=VILLAGERS.find(x=>x.id===a.slice(5));if(v)talkVillager(v);return}
  if(a.startsWith('dig:')){digMound(+a.slice(4));return}
  if(a==='millie'){const mi=millieToday(),sp=MILLIE_SPOTS[mi.spot];
    if(mi.rescued){vsay(pick(["Millie purrs and rubs against your leg.","Millie is washing her paw and pretending nothing happened.","Millie stares at you, then at the fish stall. She wants a fish.","Millie is eyeing the lantern. This will end badly."]),[{label:'Stroke her',fn:()=>Audio_.fx('pop')}].concat(S.day.trained&&!(S.day.bld&&S.day.bld.hide)?[{label:'Play hide and seek',fn:()=>{travelTo('green').then(()=>{if(Z.id!=='green')return;const[x,y]=nearestWalkable(21.5,19.6);P.x=x;P.y=y;P.dir='u';Dg.x=x-1;Dg.y=y;Dg.trail=[];VS.pos={x:P.x,y:P.y,dir:P.dir};cam.init=false;setTimeout(()=>{if(Z.id==='green'&&!VS.traveling&&typeof hsBoard==='function')hsBoard()},1700)})}}]:[]));return}
    vsay(sp.text,[{label:'Help her',fn:()=>rescueMillie()},{label:'Not yet'}]);return}
  if(a==='school')return askDoor();
  if(a==='dash'){const r=dashLockedReason();if(r)vsay('The Dragon Dash gate. '+r);else vsay('Dragon Dash: ten quick ones you already know. Ready to race?',[{label:"Let's race",fn:()=>showDashIntro()},{label:'Not now'}]);return}
  if(a.startsWith('plot:')){const id=a.slice(5),p=PLOTS[id],it=CATALOG[p.k].find(x=>x.id===id);
    const have=p.k==='build'?built(id):own(id);
    vsay(`A plot for the ${it.name.toLowerCase()}. ${it.note} You can buy it at the market stall for ${it.cost} embers.`,[{label:'OK'}]);}
}
function askDoor(){
  if(!S.dragon)return;
  const D=S.dragon.name;
  if(S.day.trained){const left=extraLeft();vsay(left>0?`Today's practice is done. Want some extra practice? You can earn up to ${left} more embers today.`:"You have earned all the extra embers for today. You can still practise for fun, or come back tomorrow.",[{label:'Go in',fn:()=>startTraining(true)},{label:'Not now'}])}
  else vsay(hatched()?"This is the school house. Ready for today's practice?":"This is the school house. Your egg is waiting, and training will help it hatch. Ready?",[{label:"Let's go",fn:()=>startTraining(false)},{label:'Not yet'}]);
}
function finishStep(){
  P.x=P.ex;P.y=P.ey;P.moving=false;
  const [i,j]=ptile(),k=key(i,j);
  if(!trig.has(k))G.doorAsked=false;
  else if(!G.doorAsked&&!G.modal&&G.mode==='ground'){G.doorAsked=true;P.queue=[];P.pending=null;runAct(trig.get(k))}
  collectAt(i,j);
}
function doTapTile(i,j){
  if(G.modal||overlayOpen()||G.mode==='rising'||G.mode==='landing'||!VS.ready)return;
  P.queue=[];P.pending=null;const [ti,tj]=ptile();
  if(i===ti&&j===tj)return;
  if(flying()){P.queue=line(ti,tj,Math.max(1,Math.min(W-2,i)),Math.max(1,Math.min(H-2,j)));return}
  if(!okGround(i,j)||(!flying()&&npcAt(i,j))){
    const nb=['u','d','l','r'].map(d=>[i+DIRS[d][0],j+DIRS[d][1],d]).filter(([a,b])=>okGround(a,b));let best=null;
    for(const [a,b,d] of nb){const p=bfs(ti,tj,a,b);if(p&&(!best||p.length<best.p.length))best={p,face:{u:'d',d:'u',l:'r',r:'l'}[d]}}
    if(best){P.queue=best.p;P.pending={face:best.face};if(!best.p.length){P.dir=best.face;P.pending=null;interactFacing()}}
    else if(notes.get(key(i,j)))vsay(notes.get(key(i,j)));
    else vtoast(done()?'Your dragon can fly you there.':"Can't walk there.",1800);
    return}
  const p=bfs(ti,tj,i,j);if(p)P.queue=p;else vtoast(done()?'Fly there with your dragon.':"Can't walk there yet.",1800);
}
function goToSchool(){const [ti,tj]=ptile();const p=bfs(ti,tj,18,11);if(p)P.queue=p}

/* ---------- flying ---------- */
function toggleFly(){
  if(G.modal||overlayOpen())return;
  if(!hatched()){vtoast("Your egg needs to hatch first. Training helps it along.",2800);return}
  if(!done()){vtoast("Your dragon is resting. Flying opens after today's practice.",2800);return}
  if(G.mode==='ground'){G.mode='rising';G.joined=false;P.queue=[];hud()}
  else if(G.mode==='fly'){const [i,j]=ptile();if(!okGround(i,j)){vtoast('Find solid ground to land.',2000);return}G.mode='landing';P.queue=[];hud()}
}


/* ---------- travel between islands ---------- */
const BASES={},WS={};
function activate(z){setZone(z);buildWalk();BASE=BASES[z.id];WS[z.id]&&WS[z.id].forEach(w=>WATERSPOTS.push(w));scatter()}
async function paintZone(z,onP){if(BASES[z.id])return;setZone(z);buildWalk();BASES[z.id]=await paintGround(onP);WS[z.id]=WATERSPOTS.slice()}
function nearestWalkable(x,y){if(okGround(Math.floor(x),Math.floor(y)))return [Math.floor(x)+.5,Math.floor(y)+.5];
  for(let r=1;r<10;r++)for(let dj=-r;dj<=r;dj++)for(let di=-r;di<=r;di++){if(Math.max(Math.abs(di),Math.abs(dj))!==r)continue;const i=Math.floor(x)+di,j=Math.floor(y)+dj;if(okGround(i,j))return [i+.5,j+.5]}
  return [x,y]}
async function travelTo(id){
  const z=isleById(id);if(!z||z===Z||VS.traveling)return;
  const st=z===HOME?{ok:true}:isleStatus(z);if(!st.ok){vsay(`${z.name} is not open yet. You need ${st.need}.`);return}
  closeSheetSafe();VS.traveling=true;VS.ready=false;
  const ld=$('#vload');if(ld){ld.style.display='grid';ld.querySelector('b').textContent=z===HOME?'Flying home…':`Flying to ${z.name}…`;const bi=$('#vbari');if(bi)bi.style.width='0'}
  if(Z.home)VS.homePos={x:P.x,y:P.y,dir:P.dir};
  await new Promise(r=>setTimeout(r,80));
  try{
    if(!BASES[z.id])await paintZone(z,p=>{const b=$('#vbari');if(b)b.style.width=Math.round(p*100)+'%'});
    activate(z);buildObjects();VS.shards=todaysShards();
    let sx,sy,dir='u';
    if(z.home){loadNpcs();const hp=VS.homePos||{x:18.5,y:12.5,dir:'d'};[sx,sy]=nearestWalkable(hp.x,hp.y);dir=hp.dir}
    else{NPCS.length=0;[sx,sy]=nearestWalkable(z.spawn[0]+.5,z.spawn[1]+.5)}
    P.x=sx;P.y=sy;P.dir=dir;P.moving=false;P.queue=[];P.pending=null;held.length=0;G.modal=false;G.mode='ground';G.alt=0;G.joined=false;
    Dg.x=P.x-1;Dg.y=P.y;Dg.trail=[];Dg.dir=P.dir;if(!okGround(Math.floor(Dg.x),Math.floor(Dg.y))){Dg.x=P.x;Dg.y=P.y+1}
    G.bridge=done()?1:0;cam.init=false;VS.pos={x:P.x,y:P.y,dir:P.dir};
    for(let k=0;k<12;k++)parts.push({t:'dust',x:P.x*T+(Math.random()-.5)*28,y:P.y*T,vx:(Math.random()-.5)*60,vy:-8-Math.random()*16,age:0,life:.8});
    Audio_.fx('fanfare');
  }catch(e){console.error(e)}
  VS.ready=true;VS.traveling=false;if(ld)ld.style.display='none';hud();
  if(!z.home){const zs=zoneState(z.id);if(!zs.visited){zs.visited=true;saveState();setTimeout(()=>vsay(z.welcome||`Welcome to ${z.name}! ${z.blurb} Look for the Number Stones, ember shards and a hidden chest.`),500)}}
}
function openMap(){
  if(!done()||!hatched()){vtoast("Your dragon is resting. The map opens after today's practice.",2800);return}
  const days=(S.days||[]).length,sec=ALL_ITEMS.filter(it=>isSecure(it.id)).length;
  const rows=[HOME].concat(ISLES).map(z=>{
    const st=z===HOME?{ok:true}:isleStatus(z),here=z===Z,zs=z===HOME?null:zoneState(z.id);
    const sub=z===HOME?'Your island, with the school house and shops.':z.blurb;
    const btn=here?'<span class="own">You are here</span>':st.ok?`<button class="btn btn-primary btn-sm" data-act="travel" data-id="${z.id}">Fly there</button>`:`<span class="note" style="color:var(--ink2)">Needs ${st.need}</span>`;
    return `<div class="card mapcard ${st.ok?'':'locked'}"><b>${z.name}</b><small>${sub}</small>${zs&&zs.chest?'<small>✓ Chest found</small>':''}${btn}</div>`}).join('');
  openSheet(`<div class="row spread"><h2>The Map</h2><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div>
    <p class="sub">Islands open as you keep practising. You have practised ${days} day${days===1?'':'s'} and have ${sec} secure fact${sec===1?'':'s'}.</p><div class="shop">${rows}</div>`,{wide:true});
}



/* ---------- villagers, quests, dig mounds, feeding time ---------- */
const DIG_SPOTS=[[15,13],[20,13],[8,16],[26,16],[12,18],[33,14],[17,20],[24,20],[6,12],[28,18]];
function todaysMounds(){
  if(!skillOwned(S.dragon,'dig'))return [];
  const d=S.day.date||'';let h=0;for(const ch of d)h=(h*17+ch.charCodeAt(0))%1013;
  const ok=DIG_SPOTS.filter(([i,j])=>okGround(i,j));const out=[];
  for(let k=0;k<2&&ok.length;k++){out.push(ok.splice((h+k*3)%ok.length,1)[0])}
  return out}
function placeVillagers(){
  const st=villState();
  VILLAGERS.forEach(v=>{if(!villHere(v))return;
    let [x,y]=nearestWalkable(v.x,v.y);
    addObj(SPR.vill[v.id],x,y+.2,25,64,{});
    if(!st.done.includes(v.id))addObj(SPR.excl,x,y-1.35,10,20,{});
    block([[Math.floor(x),Math.floor(y-.3)]],null,'vill:'+v.id)})}
function talkVillager(v){
  const st=villState(),first=!st.met.includes(v.id),hasQ=!st.done.includes(v.id);
  const n=st.talks[v.id]||0;st.talks[v.id]=n+1;if(first)st.met.push(v.id);saveState();
  const text=first?v.intro:pick(v.chat);
  const btns=[];
  if(hasQ)btns.push({label:v.quest.btn,fn:()=>vsay(v.quest.story,[{label:"Let's do it",fn:()=>runQuest(v)},{label:'Later'}])});
  else btns.push({label:'Any tips?',fn:()=>vsay(v.tip,[{label:'Thanks'}])});
  btns.push({label:'Bye'});
  vsay(`${v.name} the ${v.role}: ${text}`,btns)}
function runQuest(v){
  const total=v.quest.kinds.length;let step=0,right=0;
  const finish=()=>{const st=villState();st.done.push(v.id);let e=v.quest.embers+(right===total?3:0);S.embers+=e;
    Object.entries(v.quest.treats||{}).forEach(([k,n])=>{S.inv[k]=(S.inv[k]||0)+n});
    saveState();buildObjects();hud();Audio_.fx('fanfare');
    vsay(`${v.quest.done} (+${e} embers${right===total?', including 3 for getting every one right first time':''}.)`,[{label:'Thank you',fn:()=>{if(v.id==='sigrun')setTimeout(()=>vsay("Open your dragon's nest to start a skill. Fire breath is the cheapest.",[{label:'OK'}]),200)}}])};
  const next=()=>{if(step>=total){finish();return}
    const ok=shardQuestion(0,0,{q:wordProb(v.quest.kinds[step]),title:`${v.name}'s problem ${step+1} of ${total}`,bonus:0,intro:'Take your time. Pick the answer.',ok:'Yes!',fail:'We will do it together another time.',okLabel:'Next',skipLabel:'Later',done:(g)=>{if(g)right++;step++;next()}});
    if(!ok)finish()};
  next()}
function digMound(n){
  const st=S.day.dug=S.day.dug||[];if(st.includes(n))return;
  st.push(n);const e=3+(Math.random()<.3?2:0);S.embers+=e;let extra='';
  if(Math.random()<.35){S.inv.fish=(S.inv.fish||0)+1;extra=' and a silver fish'}
  saveState();Audio_.fx('good');buildObjects();hud();
  for(let k=0;k<14;k++)parts.push({t:'dust',x:P.x*T+(Math.random()-.5)*28,y:P.y*T,vx:(Math.random()-.5)*70,vy:-20-Math.random()*30,age:0,life:.8});
  vsay(`${S.dragon.name} digs up the mound and finds ${e} embers${extra}!`)}
function feedTime(){
  if(!hatched()){vtoast('Your egg is not hatched yet.',2400);return}
  const n=S.day.feedN||0;
  if(n>=2){vsay(`${S.dragon.name} is full and happy. Feeding time is done for today. Come back tomorrow!`);return}
  const kind=pick(feedKinds());
  const ok=shardQuestion(0,0,{q:wordProb(kind),title:`Feeding time (${n+1} of 2)`,bonus:2,intro:`${S.dragon.name} is hungry. Pick the answer. No rush.`,ok:`${S.dragon.name} munches happily. +2 embers.`,fail:`${S.dragon.name} gets fed anyway.`,okLabel:'Next',skipLabel:'Later',done:()=>{S.day.feedN=(S.day.feedN||0)+1;S.dragon.fedTotal=(S.dragon.fedTotal||0)+1;saveState();hud();if(S.day.feedN<2)setTimeout(feedTime,150)}});
  if(!ok)vtoast('Nothing to feed right now.',2000)}
function announceNew(){
  const st=villState();
  VILLAGERS.forEach(v=>{if(v.day>0&&villHere(v)&&!st.ann.includes(v.id)){st.ann.push(v.id);saveState();setTimeout(()=>vtoast(`${v.name} the ${v.role} has arrived on the island!`,4200),2600)}});
  eventsNow().forEach(e=>{S.evSeen=S.evSeen||{};const k=e.id+(S.day.date||'').slice(0,4);if(!S.evSeen[k]){S.evSeen[k]=1;saveState();setTimeout(()=>vsay(e.msg),3400)}});
  if(S.msgQ&&S.msgQ.length){const m=S.msgQ.shift();saveState();setTimeout(()=>{if(!G.modal)vsay(m)},1400)}
}

/* ---------- Millie the cat: a daily mishap to fix ---------- */
const MILLIE_SPOTS=[
 {prop:'barrel',x:19.5,y:14.7,text:"Millie jumped into the rain barrel to catch a butterfly. Now she is stuck, soggy and VERY unimpressed."},
 {prop:'net',x:8.5,y:20.7,text:"Millie tried to catch a fish and is now tangled in the fishing net like a furry parcel."},
 {prop:'log',x:13.5,y:16.7,text:"Millie walked along a log to look cool. The log rolled. Now she is wobbling and refusing to look down."}];
function millieToday(){
  const d=S.day.date||'';S.millie=S.millie||{date:null,spot:0,rescued:false,total:0};
  if(S.millie.date!==d){let h=0;for(const ch of d)h=(h*31+ch.charCodeAt(0))%997;S.millie.date=d;S.millie.spot=h%MILLIE_SPOTS.length;S.millie.rescued=false}
  return S.millie}
function tellJoke(after){
  S.jokes=S.jokes||{seen:[]};
  let left=JOKES.map((_,i)=>i).filter(i=>!S.jokes.seen.includes(i));if(!left.length){S.jokes.seen=[];left=JOKES.map((_,i)=>i)}
  const n=pick(left);S.jokes.seen.push(n);saveState();const [q,a]=JOKES[n];
  vsay('Joke time! '+q,[{label:'Tell me!',fn:()=>vsay(a,[{label:'Groan',fn:()=>{Audio_.fx('soft');vtoast('Millie approves of that groan.',2200);after&&after()}},{label:'Ha!',fn:()=>{Audio_.fx('good');after&&after()}}])},{label:'Not now'}]);
}
function rescueMillie(){
  const total=3,lines=['Build the first rung','Now the middle rung','Last rung, nearly there'];let step=0,right=0;
  const finish=()=>{const m=S.millie;m.rescued=true;m.total=(m.total||0)+1;const bonus=5+(right===total?2:0);S.embers+=bonus;saveState();buildObjects();hud();Audio_.fx('fanfare');
    vsay(pick(["Millie leaps free, knocks over a bucket, and strolls off as if that was the plan.","Millie is free! She gives you a very dignified look, then sneezes.","Millie escapes, runs three circles, and sits down pretending nothing happened."])+` (+${bonus} embers.)`,[{label:'Good cat',fn:()=>setTimeout(()=>tellJoke(),200)}])};
  const next=()=>{if(step>=total){finish();return}
    const ok=shardQuestion(0,0,{title:`Rescue Millie: rung ${step+1} of ${total}`,bonus:0,intro:`${lines[step]}. Pick the answer. No rush.`,ok:'Rung built!',fail:'The rung is built anyway.',okLabel:'Next',skipLabel:'Not now',done:(g)=>{if(g)right++;step++;next()}});
    if(!ok)finish()};
  next();
}

/* ---------- ember shards (new every day, +1 each, +3 for all six) ---------- */function scatterIsle(){
  const r=mulberry(777+Z.W);
  for(let y=1;y<H-1;y+=.9)for(let x=1;x<W-1;x+=.9){
    const px=x+(r()-.5)*.8,py=y+(r()-.5)*.8,i=Math.floor(px),j=Math.floor(py);
    if(!walk[j][i]||inRects(px,py,Z.clear)||!isGrass(px,py,.2)||Math.hypot(px-Z.spawn[0],py-Z.spawn[1])<3.4)continue;
    const cl=fbm(px*.34+11,py*.34),rv=rockV(px,py);
    let p=cl>.5?.55:cl>.42?.2:.05;if(rv>-3.4&&rv<-1.0)p=Math.max(p,.5);
    if(r()>p)continue;
    const q=r();TREES.push({px,py,i,j,kind:q<.74?'pine':q<.9?'bush':'rock',v:(r()*3)|0});
  }
}

const SHARDS=6;
function todaysShards(){
  const cand=[];
  for(let j=2;j<H-2;j++)for(let i=2;i<W-2;i++){
    if(!walk[j][i]||!isGrass(i+.5,j+.5,.1))continue;
    if(blocked[j][i]||TREES.some(t=>t.i===i&&t.j===j))continue;
    if(Z.home){if(Math.hypot(i-18,j-15)<3)continue;
    if([[14,5.5,21.5,11.8],[8.6,7,14.6,13.9],[20.4,6.8,25.2,11.8],[5,9,9.6,12.6],[29,10.5,33.4,13.4],[34,7,38,10.8]].some(q=>i+.5>q[0]&&i+.5<q[2]&&j+.5>q[1]&&j+.5<q[3]))continue}
    else if(Math.hypot(i-Z.spawn[0],j-Z.spawn[1])<3)continue;
    cand.push([i,j]);
  }
  let h=0;for(const ch of today()+Z.id)h=(h*31+ch.charCodeAt(0))|0;const rr=mulberry(h>>>0);
  const out=[],used=new Set();
  while(out.length<SHARDS&&cand.length){const c=cand[Math.floor(rr()*cand.length)];const k=key(c[0],c[1]);if(used.has(k))continue;used.add(k);
    if(out.every(o=>Math.hypot(o[0]-c[0],o[1]-c[1])>5))out.push(c);else if(used.size>cand.length*.9)out.push(c)}
  return out;
}
function shardState(){if(!S.explore||S.explore.date!==today())S.explore={date:today(),found:[],bonus:false,found2:[],zones:{}};if(!S.explore.found)S.explore.found=[];
  if(Z.home)return S.explore;const zs=S.explore.zones||(S.explore.zones={});return zs[Z.id]||(zs[Z.id]={found:[],bonus:false,qAsked:0})}
function collectAt(i,j){
  if(!done()||!VS.shards)return;
  const ex=shardState();
  VS.shards.forEach((s,n)=>{if(s[0]===i&&s[1]===j&&!ex.found.includes(n)){
    ex.found.push(n);S.embers+=1;Audio_.fx('good');
    for(let k=0;k<14;k++)parts.push({t:'spark',x:(i+.5)*T,y:(j+.5)*T-10,vx:(Math.random()-.5)*70,vy:-30-Math.random()*50,age:0,life:.9+Math.random()*.5});
    let msg=`Ember shard! ${ex.found.length} of ${SHARDS}.`;
    if(ex.found.length===SHARDS&&!ex.bonus){ex.bonus=true;S.embers+=3;Audio_.fx('fanfare');msg=`You found every shard! +3 bonus embers.`}
    saveState();hud();vtoast(msg,2600);
    if(!ex.qAsked)ex.qAsked=0;if(ex.qAsked<SHARDS){ex.qAsked++;setTimeout(()=>{if(screen==='village'&&!G.modal&&!overlayOpen())shardQuestion(i,j)},900)}}});
}


/* ---------- a little maths puzzle when an ember shard is found (optional, gentle, never a penalty) ---------- */
function shardQuestion(i,j,cfg){
  cfg=cfg||{};
  let it=null,ans,text;
  if(cfg.q){ans=cfg.q.ans;text=cfg.q.text}
  else{
    const seen=ALL_ITEMS.filter(it=>isSeen(it.id));if(!seen.length)return false;
    const due=dueItems().map(id=>ITEM[id]).filter(Boolean);
    it=(due.length&&Math.random()<.7)?pick(due.slice(0,8)):pick(seen);
    let q;try{q=makeQ(it)}catch(e){return false}
    if(!q||!q.eq)return false;
    ans=q.ans;text=q.eq.map(t=>t.op?t.op:t.ans?'?':t.t).join(' ');
  }
  const pool=[ans+1,ans-1,ans+2,ans-2,ans+10,ans-10,10-ans,ans+3].filter(n=>n>=0&&n!==ans&&n<=40);
  const opts=shuffle([ans].concat(shuffle(Array.from(new Set(pool))).slice(0,2)));
  const box=$('#vq');if(!box)return false;
  G.modal=true;let tries=0,over=false;
  const bonus=cfg.bonus==null?2:cfg.bonus;let good=false;
  const log=(ok,clean)=>{if(!it){S.log.push({t:Date.now(),id:'word',ok,clean,hints:0,att:tries,ms:0,tool:'none',kind:'word'});return}const gap=applyResult(it.id,{kind:'dash',clean});S.log.push({t:Date.now(),id:it.id,ok,clean,hints:0,att:tries,ms:0,tool:'none',kind:'shard',gap});};
  const close=()=>{box.hidden=true;box.innerHTML='';G.modal=false;hud()};
  const draw=(msg,cls)=>{
    box.innerHTML=`<div class="vq-in"><div class="vq-h">${esc(cfg.title||'Ember puzzle')}</div><div class="vq-eq${text.length>16?' long':''}" aria-live="polite">${esc(text)}</div>
      <div class="vq-opts">${opts.map(o=>`<button class="btn vq-o" data-o="${o}" ${over?'disabled':''}>${o}</button>`).join('')}</div>
      <div class="vq-msg ${cls||''}" role="status">${msg||cfg.intro||`Get it right for ${bonus} bonus embers. No rush, and the shard is yours either way.`}</div>
      <div class="vq-act">${over?`<button class="btn btn-primary" data-vq="ok">${cfg.okLabel||'OK'}</button>`:`<button class="btn btn-ghost" data-vq="skip">${cfg.skipLabel||'Maybe later'}</button>`}</div></div>`;
    box.querySelectorAll('.vq-o').forEach(b=>b.onclick=()=>{
      if(over)return;const o=+b.dataset.o;
      if(o===ans){over=true;good=true;S.embers+=bonus;log(true,tries===0);saveState();Audio_.fx('good');
        for(let k=0;k<12;k++)parts.push({t:'spark',x:P.x*T+(Math.random()-.5)*20,y:P.y*T-24,vx:(Math.random()-.5)*70,vy:-30-Math.random()*50,age:0,life:.9+Math.random()*.5});
        draw(cfg.ok||(tries===0?`Yes! ${bonus} bonus embers.`:`You got it. ${bonus} bonus embers.`),'good');
      }else{tries++;b.disabled=true;b.classList.add('wrong');Audio_.fx('soft');
        if(tries>=2){over=true;log(false,false);saveState();draw(`The answer is ${ans}. ${it?'That fact will come back to practise. ':''}${cfg.fail||'The shard is still yours.'}`,'soft')}
        else draw('Not quite. Try once more.','soft'),box.querySelectorAll('.vq-o').forEach(x=>{if(+x.dataset.o===o){x.disabled=true;x.classList.add('wrong')}})}});
    const k=box.querySelector('[data-vq]');if(k)k.onclick=()=>{const kind=k.dataset.vq;close();if(kind==='ok'){cfg.done&&cfg.done(good)}else cfg.skip&&cfg.skip()};
  };
  box.hidden=false;draw();return true;
}

/* ---------- screen: markup and HUD ---------- */
function markup(){
  const d=S.dragon;
  return `<div class="vil" id="vil">
   <canvas id="vcv" aria-label="Your island. Use the arrow keys or tap to walk."></canvas>
   <div class="vtop">
    <div class="vleft"><button class="vname" data-act="switch" aria-label="Switch player" title="Switch player"><b id="vnm"></b><span id="vst"></span></button>
      <div class="vchip" id="vquest"><i></i><span></span></div>
      <button class="vchip vbtn" id="vschool" data-act="vschool">Take me to the school house</button></div>
    <div class="vright">
      <span class="pill num" id="vstreak" title="Days trained in a row">${ic('flame',18)} <b>0</b></span>
      <span class="pill gold num" id="vemb" title="Embers">${ic('ember',18)} <b>0</b></span>
      <button class="btn btn-icon btn-sm" data-act="sfx" id="vsfx" aria-label="Sound effects" style="background:var(--surface)"></button>
      <button class="btn btn-icon btn-sm" data-act="music" id="vmus" aria-label="Music" style="background:var(--surface)"></button>
      <button class="btn btn-icon btn-sm hold" id="holdgu" data-act="gate" aria-label="Grown-ups. Tap, then answer a question, or hold to open" style="background:var(--surface)">${ic('lock',18)}<i></i></button>
    </div></div>
   <button class="vchip vmap" id="vmap" data-act="vmap">Map</button>
   <button class="vchip vfly" id="vfly" data-act="vfly">Fly</button>
   <div id="vpad"><button data-d="u" aria-label="Up">&#9650;</button><button data-d="l" aria-label="Left">&#9664;</button><button data-d="r" aria-label="Right">&#9654;</button><button data-d="d" aria-label="Down">&#9660;</button></div>
   <div id="vdlg" hidden role="dialog"><div id="vdtxt"></div><div id="vdbtn"></div></div>
   <div id="vq" hidden role="dialog" aria-label="Ember puzzle"></div>
   <div id="vtoast" role="status"></div>
   <div id="vload"><div><b>Painting the island&hellip;</b><div class="vbar"><i id="vbari"></i></div></div></div>
  </div>`;
}
function hud(){
  if(!$('#vil')||!S.dragon)return;
  const d=S.dragon,dn=done();
  const hn=(S.hero&&S.hero.name)||d.name;$('#vnm').textContent=hn;$('#vst').textContent=(S.hero&&S.hero.name?d.name+' · ':'')+(d.hatched?STAGE_NAMES[dragonStage()]:'Dragon egg');
  $('#vstreak b').textContent=S.streak.cur+' day'+(S.streak.cur===1?'':'s');$('#vemb b').textContent=S.embers;
  $('#vsfx').innerHTML=ic(S.settings.sfx?'sound':'mute',20);$('#vmus').innerHTML=ic('music',20);$('#vmus').style.opacity=S.settings.music?1:.6;
  const q=$('#vquest');q.classList.toggle('done',dn);
  const ex=shardState();
  q.querySelector('span').textContent=!dn?(d.hatched?"Today: practice at the school house":"Today: practice to hatch your egg"):(`Practice done. Shards found: ${ex.found.length} of ${SHARDS}`);
  $('#vschool').hidden=dn;
  const mp=$('#vmap');if(mp)mp.hidden=!(dn&&d.hatched);
  const f=$('#vfly');f.classList.toggle('locked',!dn||!d.hatched);f.classList.toggle('up',G.mode!=='ground');
  f.textContent=!d.hatched?'Fly (after hatching)':!dn?'Fly (after practice)':G.mode==='ground'?'Fly':'Land';
}
function updateGate(first){
  const dn=done();
  if(VS.prevDone===null||first&&VS.prevDone===dn){G.bridge=dn?1:0}
  else if(dn&&!VS.prevDone){G.bridge=0;setTimeout(()=>{if(screen==='village'){vtoast('The bell rings! The bridge is being mended'+(hatched()?'. Your dragon is ready to fly.':'.'),4200);for(let k=0;k<26;k++)parts.push({t:'spark',x:(25+Math.random()*4)*T,y:(14+Math.random()*2)*T,vx:(Math.random()-.5)*30,vy:-20-Math.random()*40,age:0,life:1.4+Math.random()});Audio_.fx('fanfare')}},700)}
  else if(!dn){G.bridge=0}
  VS.prevDone=dn;
}

/* ---------- show / preload ---------- */
function preload(){
  if(VS.ready||VS.painting)return VS.painting;
  buildWalk();
  VS.painting=(async()=>{
    BASE=await paintGround(p=>{VS.loadP=p;const b=$('#vbari');if(b)b.style.width=Math.round(p*100)+'%'});
    makeSprites();makeSprites2();makeSprites3();makeSprites4();makeSprites5();BASES.home=BASE;WS.home=WATERSPOTS.slice();scatter();VS.ready=true;
  })();
  return VS.painting;
}
async function show(){
  screen='village';rollDay();closeSheetSafe();if(!S.day.trained)HOME_SHOWN=Date.now();
  $('#app').innerHTML=markup();hud();
  cancelAnimationFrame(VS.raf);
  await preload();
  if(screen!=='village')return;
  $('#vload').style.display='none';
  if(!Z.home){activate(HOME);VS.pos=null}
  buildObjects();VS.shards=todaysShards();loadNpcs();
  const first=!VS.pos;
  if(first){P.x=18.5;P.y=14.5;P.dir='u'}else{P.x=VS.pos.x;P.y=VS.pos.y;P.dir=VS.pos.dir}
  if(!okGround(Math.floor(P.x),Math.floor(P.y))){P.x=18.5;P.y=12.5}
  if(S.day.trained&&VS.prevDone===false){P.x=18.5;P.y=12.5;P.dir='d'}
  P.moving=false;P.queue=[];P.pending=null;held.length=0;G.modal=false;G.doorAsked=true;
  G.mode='ground';G.alt=0;G.joined=false;
  Dg.x=P.x-1;Dg.y=P.y;Dg.trail=[];Dg.dir=P.dir;
  if(!okGround(Math.floor(Dg.x),Math.floor(Dg.y))){Dg.x=P.x;Dg.y=P.y+1}
  updateGate(first);hud();cam.init=false;
  bindInput();
  VS.last=0;VS.raf=requestAnimationFrame(frame);
  if(first&&!S.day.trained)vtoast('Walk to the school house. Arrow keys, or tap where you want to go.',4200);
  announceNew();
  if(S.day.trained&&!S.day.jokeShown&&!first){S.day.jokeShown=true;saveState();setTimeout(()=>{if(screen==='village'&&!G.modal&&!overlayOpen())tellJoke()},1800)}
}
function closeSheetSafe(){try{closeSheet()}catch(e){}}
/* refresh the objects after a purchase, keeping Ruan where he is */
function reset(){VS.homePos=null;if(!Z.home&&BASES.home)activate(HOME);VS.pos=null;VS.prevDone=null;G.bridge=0;G.mode='ground';G.alt=0;G.joined=false;NPCS.length=0;VS.shards=null}
function refresh(){if(!VS.ready||screen!=='village')return;buildObjects();hud()}

/* ---------- input ---------- */
const KM={ArrowUp:'u',ArrowDown:'d',ArrowLeft:'l',ArrowRight:'r',w:'u',s:'d',a:'l',d:'r',W:'u',S:'d',A:'l',D:'r'};
function onKey(e){
  if(screen!=='village')return false;
  if(overlayOpen())return false;
  if(KM[e.key]){const d=KM[e.key],k=held.indexOf(d);if(k>=0)held.splice(k,1);held.push(d);P.queue=[];P.pending=null;return true}
  if(e.key===' '||e.key==='Enter'||e.key==='e'||e.key==='E'){if(G.modal)skipTyping();else interactFacing();return true}
  if(e.key==='f'||e.key==='F'){toggleFly();return true}
  return false;
}
function onKeyUp(e){if(KM[e.key]){const k=held.indexOf(KM[e.key]);if(k>=0)held.splice(k,1)}}
function bindInput(){
  const cv=$('#vcv');if(!cv)return;
  cv.addEventListener('pointerdown',e=>{if(!VS.ready)return;Audio_.ensure();const r=cv.getBoundingClientRect();
    const wx=cam.x+(e.clientX-r.left)/cam.z,wy=cam.y+(e.clientY-r.top)/cam.z;doTapTile(Math.floor(wx/T),Math.floor((wy+8)/T))});
  $('#vdlg').addEventListener('pointerdown',()=>{if(typing)skipTyping()});
  $$('#vpad button').forEach(b=>{const d=b.dataset.d;
    const down=e=>{e.preventDefault();const k=held.indexOf(d);if(k>=0)held.splice(k,1);held.push(d);P.queue=[];b.classList.add('on')};
    const up=e=>{e.preventDefault();const k=held.indexOf(d);if(k>=0)held.splice(k,1);b.classList.remove('on')};
    b.addEventListener('pointerdown',down);['pointerup','pointerleave','pointercancel'].forEach(t=>b.addEventListener(t,up));});
}


/* ---------- the other player(s), wandering the island as friendly characters ---------- */
const NPCS=[];
function loadNpcs(){
  NPCS.length=0;
  try{
    const spots=[];for(let j=12;j<=20;j++)for(let i=6;i<=23;i++)if(okGround(i,j)&&!(i>=15&&i<=20&&j<=12))spots.push([i,j]);
    listProfiles().filter(p=>p.key!==SAVE_KEY&&(p.s.hero||p.s.dragon)).slice(0,3).forEach(p=>{
      const sp=spots.length?pick(spots):[16,16];
      NPCS.push({key:p.key,name:(p.s.hero&&p.s.hero.name)||'',hero:p.s.hero||{},dragon:p.s.dragon&&p.s.dragon.hatched?p.s.dragon:null,dname:p.s.dragon?p.s.dragon.name:'',
        x:sp[0]+.5,y:sp[1]+.5,dir:'d',ph:0,moving:false,sx:0,sy:0,ex:0,ey:0,t:0,path:[],wait:1+Math.random()*3,
        dx:sp[0]-.3,dy:sp[1]+.5,ddir:'d',dph:0,dmov:false,trail:[],talk:0});
    });
  }catch(e){NPCS.length=0}
}
function npcAt(i,j){for(const n of NPCS){if(Math.floor(n.x)===i&&Math.floor(n.y)===j)return n;if(n.moving&&Math.floor(n.ex)===i&&Math.floor(n.ey)===j)return n}return null}
const NPC_LINES=[(n)=>`Hi! I'm ${n.name||'a friend'}.`,(n)=>n.dragon?`This is ${n.dname}, my dragon.`:`I'm waiting for my dragon egg to hatch.`,(n)=>`What a lovely day on the island!`,(n)=>n.dragon?`${n.dname} loves it here.`:`I like looking at the sea.`,(n)=>`Have you found all the ember shards?`];
function talkTo(n){
  const faceMap={u:'d',d:'u',l:'r',r:'l'};n.dir=faceMap[P.dir]||'d';n.wait=Math.max(n.wait,4);n.path=[];
  const line=NPC_LINES[(n.talk++)%NPC_LINES.length](n);
  Audio_.fx('pop');vsay(line,[{label:'Hello!'}]);
}
function updateNpcs(dt){
  for(const n of NPCS){
    if(n.moving){n.t+=dt/.4;n.ph+=dt*12;if(n.t>=1){n.x=n.ex;n.y=n.ey;n.moving=false;n.t=0}else{n.x=n.sx+(n.ex-n.sx)*n.t;n.y=n.sy+(n.ey-n.sy)*n.t}}
    if(!n.moving&&!G.modal){
      if(n.wait>0)n.wait-=dt;
      else if(n.path.length){
        const d=n.path.shift(),ni=Math.floor(n.x)+DIRS[d][0],nj=Math.floor(n.y)+DIRS[d][1];n.dir=d;
        const [pi,pj]=ptile();
        if(okGround(ni,nj)&&!(ni===pi&&nj===pj)&&!NPCS.some(o=>o!==n&&Math.floor(o.x)===ni&&Math.floor(o.y)===nj)&&!(!flying()&&Math.floor(Dg.x)===ni&&Math.floor(Dg.y)===nj&&hatched())){
          n.sx=n.x;n.sy=n.y;n.ex=ni+.5;n.ey=nj+.5;n.t=0;n.moving=true;n.trail.push([n.sx,n.sy]);if(n.trail.length>3)n.trail.shift();
          if(!n.path.length)n.wait=2.5+Math.random()*5;
        }else{n.path=[];n.wait=.8+Math.random()}
      }else{
        const ci=Math.floor(n.x),cj=Math.floor(n.y);let tries=0;
        while(tries++<12){const ti=ci+Math.floor(Math.random()*11)-5,tj=cj+Math.floor(Math.random()*9)-4;if(ti===ci&&tj===cj||!okGround(ti,tj)||npcAt(ti,tj)===n&&0)continue;
          if(ti>=25&&G.bridge<1)continue;const p=bfs(ci,cj,ti,tj);if(p&&p.length&&p.length<=9){n.path=p;break}}
        if(!n.path.length)n.wait=1.5;
      }
    }
    if(n.dragon){
      let tx,ty;if(n.trail.length){const t=n.trail[n.trail.length-1];tx=t[0];ty=t[1]}else{tx=n.x-.9;ty=n.y+.2}
      if(!n.moving&&Math.hypot(n.dx-n.x,n.dy-n.y)<.7){tx=n.dx;ty=n.dy}
      const ddx=tx-n.dx,ddy=ty-n.dy,dist=Math.hypot(ddx,ddy);n.dmov=dist>.07;
      if(n.dmov){const sp=1-Math.exp(-dt*7.5);n.dx+=ddx*sp;n.dy+=ddy*sp;n.dph+=dt*13;if(dist>.12)n.ddir=Math.abs(ddx)>Math.abs(ddy)?(ddx>0?'r':'l'):(ddy>0?'d':'u')}
      if(Math.hypot(n.dx-n.x,n.dy-n.y)>3.5){n.dx=n.x-.8;n.dy=n.y}
    }
  }
}

/* ---------- per-frame update ---------- */
function update(dt){
  G.t+=dt;
  if(done()&&G.bridge<1)G.bridge=Math.min(1,G.bridge+dt/2.4);
  if(!done()&&G.bridge>0)G.bridge=Math.max(0,G.bridge-dt*2);
  if(G.mode==='rising'){
    if(!G.joined){
      Dg.x+=(P.x-Dg.x)*(1-Math.exp(-dt*9));Dg.y+=(P.y-Dg.y)*(1-Math.exp(-dt*9));Dg.moving=true;Dg.ph+=dt*14;
      const dx=P.x-Dg.x,dy=P.y-Dg.y;if(Math.hypot(dx,dy)>.05)Dg.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u');
      if(Math.hypot(dx,dy)<.12){G.joined=true;Audio_.fx('pop');for(let k=0;k<10;k++)parts.push({t:'dust',x:P.x*T+(Math.random()-.5)*20,y:P.y*T,vx:(Math.random()-.5)*50,vy:-10-Math.random()*20,age:0,life:.8})}
    }else{G.alt=Math.min(1,G.alt+dt/.95);if(G.alt>=1){G.mode='fly';hud()}}
  }
  if(G.mode==='landing'){G.alt=Math.max(0,G.alt-dt/.8);
    if(G.alt<=0){G.mode='ground';G.joined=false;Dg.x=P.x;Dg.y=P.y;Dg.trail=[];hud();for(let k=0;k<12;k++)parts.push({t:'dust',x:P.x*T+(Math.random()-.5)*28,y:P.y*T,vx:(Math.random()-.5)*60,vy:-8-Math.random()*16,age:0,life:.8})}}
  const busy=G.mode==='rising'||G.mode==='landing';
  if(!G.modal&&!overlayOpen()&&!busy){
    let guard=0,sdt=dt;
    while(guard++<3){
      if(P.moving){P.t+=sdt/stepDur();sdt=0;if(P.t>=1){P.t-=1;finishStep();if(G.modal)break}else break}
      if(!P.moving){
        const d=held.length?held[held.length-1]:(P.queue.length?P.queue.shift():null);
        if(d){if(!tryStep(d)){P.queue=[];P.pending=null;break}}
        else{if(P.pending){const pd=P.pending;P.pending=null;P.dir=pd.face;interactFacing()}break}
      }
    }
    if(P.moving){const t=Math.min(1,P.t);P.x=P.sx+(P.ex-P.sx)*t;P.y=P.sy+(P.ey-P.sy)*t}
  }
  if(P.moving&&!flying())P.ph+=dt*14.5;
  if(Z.home&&G.mode==='ground'&&hatched()&&skillOwned(S.dragon,'fire')&&Math.random()<dt*.12){for(let k=0;k<7;k++)parts.push({t:'spark',x:Dg.x*T+(Dg.dir==='l'?-10:10),y:Dg.y*T-16,vx:(Dg.dir==='l'?-1:1)*(30+Math.random()*40),vy:-10-Math.random()*20,age:0,life:.6+Math.random()*.4})}
  if(G.mode==='ground'&&hatched()){
    let tx,ty;if(Dg.trail.length){const t=Dg.trail[Dg.trail.length-1];tx=t[0];ty=t[1]}else{tx=Dg.x;ty=Dg.y}
    const idle=!P.moving&&Math.hypot(Dg.x-P.x,Dg.y-P.y)<.6;
    if(idle||(!Dg.trail.length&&Math.hypot(Dg.x-P.x,Dg.y-P.y)<.5)){
      const opp={u:'d',d:'u',l:'r',r:'l'}[P.dir];
      const opts=['d','l','r','u'].map(d=>[P.x+DIRS[d][0],P.y+DIRS[d][1],d]).filter(([a,b])=>okGround(Math.floor(a),Math.floor(b)));
      opts.sort((a,b)=>(a[2]===opp?-1:0)-(b[2]===opp?-1:0));if(opts.length){tx=opts[0][0];ty=opts[0][1]}
    }
    const dx=tx-Dg.x,dy=ty-Dg.y,dist=Math.hypot(dx,dy);Dg.moving=dist>.07;
    if(Dg.moving){const sp=1-Math.exp(-dt*8.5);Dg.x+=dx*sp;Dg.y+=dy*sp;Dg.ph+=dt*13;if(dist>.12)Dg.dir=Math.abs(dx)>Math.abs(dy)?(dx>0?'r':'l'):(dy>0?'d':'u')}
  }
  updateNpcs(dt);
  const tvx=P.moving?(P.ex-P.sx)/stepDur():0;P.vx+=(tvx-P.vx)*(1-Math.exp(-dt*8));
  // camera
  const cv=$('#vcv'),cw=cv.clientWidth,ch=cv.clientHeight;
  const viewTiles=cw<700?11:cw<1100?15:19;cam.z=cw/(viewTiles*T);
  const vw=cw/cam.z,vh=ch/cam.z;let tx=P.x*T-vw/2,ty=(P.y*T-G.alt*18)-vh/2;const mw=W*T,mh=H*T;
  tx=mw<=vw?(mw-vw)/2:Math.max(0,Math.min(mw-vw,tx));ty=mh<=vh?(mh-vh)/2:Math.max(0,Math.min(mh-vh,ty));
  if(!cam.init){cam.x=tx;cam.y=ty;cam.init=true}const k=1-Math.exp(-dt*7);cam.x+=(tx-cam.x)*k;cam.y+=(ty-cam.y)*k;
  // particles
  if(Z.home&&Math.random()<dt*2.2)parts.push({t:'smoke',x:18*T-140+186,y:11*T-224+8,vx:6+Math.random()*4,vy:-14-Math.random()*6,age:0,life:3.2});
  if(Z.home&&built('forge')&&Math.random()<dt*3)parts.push({t:'smoke',x:22.9*T-95*.8+130*.8,y:11*T-148*.8+4,vx:5+Math.random()*4,vy:-16-Math.random()*6,age:0,life:2.6,dark:1});
  if(Z.home&&own('campfire')&&Math.random()<dt*14)parts.push({t:'ember',x:22.5*T+(Math.random()-.5)*10,y:17.45*T,vx:(Math.random()-.5)*14,vy:-24-Math.random()*20,age:0,life:1+Math.random()});
  if(flying()&&P.moving&&Math.random()<dt*20)parts.push({t:'wind',x:P.x*T-(P.ex-P.sx)*30+(Math.random()-.5)*20,y:P.y*T-G.alt*26+(Math.random()-.5)*16,vx:-(P.ex-P.sx)*60,vy:-(P.ey-P.sy)*60,age:0,life:.5});
  for(let n=parts.length-1;n>=0;n--){const p=parts[n];p.age+=dt;p.x+=p.vx*dt;p.y+=p.vy*dt;if(p.age>p.life)parts.splice(n,1)}
  VS.pos={x:P.x,y:P.y,dir:P.dir};
}

/* ---------- drawing ---------- */
function drawBridge(c){
  const x0=25.1*T,x1=28.9*T,y0=14.15*T,y1=15.85*T,N=10,pw=(x1-x0)/N;
  const post=(x,y)=>{c.fillStyle='rgba(20,40,30,.3)';c.beginPath();c.ellipse(x+3,y+3,7,3,0,0,6.3);c.fill();c.fillStyle='#5a3920';c.fillRect(x-3,y-14,6,16);c.fillStyle='#8a5f36';c.fillRect(x-3,y-14,2,16);c.fillStyle='#d9b06a';c.fillRect(x-4,y-16,8,3)};
  const showPlank=k=>{if(k<2||k>=N-2)return true;return (k-2)<Math.floor(G.bridge*(N-4)+1e-6)};
  for(let k=0;k<N;k++){if(!showPlank(k))continue;const x=x0+k*pw,sag=Math.sin((k+.5)/N*Math.PI)*3*G.bridge;
    const pop=(k>=2&&k<N-2)?Math.min(1,(G.bridge*(N-4)-(k-2))*1.2):1;c.save();c.translate(0,(1-pop)*-10);c.globalAlpha=pop;
    c.fillStyle='rgba(10,50,70,.25)';c.fillRect(x+3,y0+5+sag,pw-1,y1-y0);c.fillStyle=k%2?'#a9784a':'#b98550';c.fillRect(x,y0+sag,pw-1.2,y1-y0);
    c.fillStyle='rgba(60,36,16,.45)';c.fillRect(x+pw-1.4,y0+sag,1.4,y1-y0);c.fillStyle='rgba(255,230,180,.2)';c.fillRect(x+2,y0+sag+3,pw-6,1);c.restore()}
  c.strokeStyle='#d9c49a';c.lineWidth=2.2;c.lineCap='round';
  [y0,y1].forEach(y=>{c.beginPath();if(G.bridge>=.99){c.moveTo(x0,y-6);c.quadraticCurveTo((x0+x1)/2,y+4,x1,y-6)}else{c.moveTo(x0,y-6);c.quadraticCurveTo(x0+pw*1.5,y+10,x0+pw*2,y+26);c.moveTo(x1,y-6);c.quadraticCurveTo(x1-pw*1.5,y+10,x1-pw*2,y+26)}c.stroke()});
  post(x0,y0+4);post(x0,y1+4);post(x1,y0+4);post(x1,y1+4);
}
function drawGlow(c,x,y,r,col,a){const gr=c.createRadialGradient(x,y,2,x,y,r);gr.addColorStop(0,`rgba(${col},${a})`);gr.addColorStop(1,`rgba(${col},0)`);c.fillStyle=gr;c.beginPath();c.arc(x,y,r,0,6.3);c.fill()}
function drawFlame(c,x,y){
  c.fillStyle='rgba(70,40,20,.9)';[[-9,0,.5],[9,1,-.5],[0,-3,0]].forEach(([dx,dy,a])=>{c.save();c.translate(x+dx,y+dy);c.rotate(a);c.fillRect(-8,-2.4,16,4.8);c.restore()});
  for(let k=0;k<3;k++){const w=7-k*2,h=(18-k*4)*(1+.18*Math.sin(G.t*11+k*2));c.fillStyle=['#ff7a2f','#ffb347','#fff0b0'][k];c.beginPath();c.moveTo(x-w,y-2);c.quadraticCurveTo(x-w*.5+Math.sin(G.t*9+k)*2,y-h*.6,x+Math.sin(G.t*7+k)*2,y-h);c.quadraticCurveTo(x+w*.5,y-h*.6,x+w,y-2);c.closePath();c.fill()}
}
function drawShard(c,x,y,t,i){const b=Math.sin(t*2.4+i)*3,gl=.6+.4*Math.sin(t*4+i*2);
  drawGlow(c,x,y-14+b,18,'255,170,80',.45*gl);c.save();c.translate(x,y-14+b);c.fillStyle='rgba(15,30,25,.25)';
  c.fillStyle='#ff9d3c';c.beginPath();c.moveTo(0,-11);c.lineTo(7,0);c.lineTo(0,11);c.lineTo(-7,0);c.closePath();c.fill();
  c.fillStyle='#ffd88a';c.beginPath();c.moveTo(0,-11);c.lineTo(7,0);c.lineTo(0,2);c.closePath();c.fill();
  c.fillStyle='rgba(255,255,255,.7)';c.beginPath();c.moveTo(-3,-3);c.lineTo(-1,-6);c.lineTo(0,-2);c.closePath();c.fill();c.restore();
  c.fillStyle='rgba(15,35,30,.22)';c.beginPath();c.ellipse(x,y,6,2.2,0,0,6.3);c.fill()}
function daylight(){const h=VS.hour!=null?VS.hour:(new Date().getHours()+new Date().getMinutes()/60);
  if(h>=20.5||h<5.5)return 1;if(h>=18)return (h-18)/2.5;if(h<7.5)return (7.5-h)/2;return 0}

function frame(now){
  if(screen!=='village'){VS.raf=0;return}
  VS.raf=requestAnimationFrame(frame);
  const cv=$('#vcv');if(!cv||!VS.ready)return;
  const g=cv.getContext('2d');
  const dpr=Math.min(2,devicePixelRatio||1),cw=cv.clientWidth,ch=cv.clientHeight;
  if(cv.width!==Math.round(cw*dpr)||cv.height!==Math.round(ch*dpr)){cv.width=Math.round(cw*dpr);cv.height=Math.round(ch*dpr)}
  const dt=Math.min(.05,(now-(VS.last||now))/1000);VS.last=now;
  update(dt);
  const c=g,d=S.dragon,night=daylight();
  c.setTransform(1,0,0,1,0,0);c.fillStyle=Z.home?'#195e7d':'rgb('+Z.pal.seaB.join(',')+')';c.fillRect(0,0,cv.width,cv.height);
  c.setTransform(cam.z*dpr,0,0,cam.z*dpr,-cam.x*cam.z*dpr,-cam.y*cam.z*dpr);
  c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
  c.drawImage(BASE,0,0,W*T,H*T);
  const vx0=cam.x-90,vy0=cam.y-90,vx1=cam.x+cw/cam.z+90,vy1=cam.y+ch/cam.z+270;
  c.fillStyle='#fff';
  for(let n=0;n<WATERSPOTS.length;n++){const s=WATERSPOTS[n];if(s[0]<vx0||s[0]>vx1||s[1]<vy0||s[1]>vy1)continue;const a=Math.max(0,Math.sin(G.t*1.6+s[2]*3))*.55;if(a<.05)continue;c.globalAlpha=a;c.fillRect(s[0]-3,s[1],6+Math.sin(s[2])*2,1.2);c.fillRect(s[0]+2,s[1]+3,4,1)}
  c.globalAlpha=1;
  for(const o of OBJ)if(o.under&&o.x>vx0-100&&o.x<vx1+100&&o.y>vy0-100&&o.y<vy1+100)c.drawImage(o.spr,o.x-o.ax,o.y-o.ay,o.w,o.h);
  if(Z.home){drawBridge(c);
  if(own('campfire'))drawFlame(c,22.5*T,17.5*T)}
  const list=[];
  for(const o of OBJ){if(o.under)continue;if(o.x<vx0-130||o.x>vx1+130||o.y<vy0||o.y>vy1+130)continue;list.push({y:o.y,o})}
  // ember shards
  if(done()&&VS.shards){const ex=shardState();VS.shards.forEach((s,n)=>{if(ex.found.includes(n))return;const sx=(s[0]+.5)*T,sy=(s[1]+.5)*T;if(sx<vx0||sx>vx1||sy<vy0||sy>vy1)return;list.push({y:sy,fn:()=>drawShard(c,sx,sy,G.t,n)})})}
  // Ruan and his dragon
  const px=P.x*T,py=P.y*T,hasD=hatched(),stg=hasD?dragonStage():0,scl=STAGE_SC[stg];
  const comb=hasD&&G.joined&&(G.mode==='rising'||G.mode==='fly'||G.mode==='landing');
  if(comb){
    const alt=G.alt,y=py-alt*26-Math.sin(G.t*3)*2.2*alt;
    list.push({y:py,fn:()=>{c.save();c.translate(px,py);c.fillStyle='rgba(15,35,30,'+(.34-.14*alt)+')';c.beginPath();c.ellipse(0,2,(24-6*alt)*(1+.2*alt)*scl,(7-1.5*alt),0,0,6.3);c.fill();c.restore()}});
    list.push({y:py+alt*80+1,fn:()=>{c.save();c.translate(px,y);const sc=1+.32*alt;c.scale(sc,sc);
      const bank=(P.dir==='l'||P.dir==='r')?clamp(-(P.ey-P.sy)*.12*(P.moving?1:0),-.2,.2):clamp(P.vx*.012,-.22,.22);
      drawDragon(c,{look:d,stage:stg,dir:P.dir,flying:true,flap:G.t*(G.mode==='fly'?(P.moving?11:8):13),t:G.t,bank,rider:(rx,ry)=>{c.save();c.translate(rx,ry+8);c.scale(.82,.82);drawKid(c,P.dir,0,false,{sit:true});c.restore()}});c.restore()}});
  }else{
    list.push({y:py,fn:()=>{c.save();c.translate(px,py);c.fillStyle='rgba(15,35,30,.3)';c.beginPath();c.ellipse(0,1,11,4.2,0,0,6.3);c.fill();drawKid(c,P.dir,P.ph,P.moving,{});c.restore()}});
    if(hasD){const dxp=Dg.x*T,dyp=Dg.y*T;
      list.push({y:dyp,fn:()=>{c.save();c.translate(dxp,dyp);c.fillStyle='rgba(15,35,30,.3)';c.beginPath();c.ellipse(0,1,17*scl,5.4,0,0,6.3);c.fill();
        const rising=G.mode==='rising'&&!G.joined;drawDragon(c,{look:d,stage:stg,dir:Dg.dir,ph:Dg.ph,moving:Dg.moving,t:G.t,flying:rising,flap:G.t*14});c.restore()}})}
  }
  // dragons resting at the stables
  if(Z.home&&built('stables'))S.extra.forEach((e,k)=>{const sp=STABLE_SPOTS[k];if(!sp)return;const ex=sp[0]*T,ey=sp[1]*T;
    list.push({y:ey,fn:()=>{c.save();c.translate(ex,ey);
      if(e.hatched){c.fillStyle='rgba(15,35,30,.3)';c.beginPath();c.ellipse(0,1,17*STAGE_SC[dragonStage(e)],5.4,0,0,6.3);c.fill();c.translate(0,Math.sin(G.t*2+k*2)*1.2);
        drawDragon(c,{look:e,stage:dragonStage(e),dir:Math.sin(G.t*.4+k*3)>.6?(k?'l':'r'):'d',ph:0,moving:false,t:G.t+k*2,flying:false,flap:0})}
      else{const sp2=e._spr||(e._spr=eggSprite(e));c.drawImage(sp2,-23,-52,46,58)}
      c.restore()}})});
  // the other player(s)
  for(const n of NPCS){
    const nx=n.x*T,ny=n.y*T;if(nx<vx0||nx>vx1||ny<vy0||ny>vy1)continue;
    list.push({y:ny,fn:()=>{c.save();c.translate(nx,ny);c.fillStyle='rgba(15,35,30,.3)';c.beginPath();c.ellipse(0,1,11,4.2,0,0,6.3);c.fill();drawKid(c,n.dir,n.ph,n.moving,{hero:n.hero});
      if(n.name){c.font='600 11px Inter,system-ui,sans-serif';c.textAlign='center';c.lineWidth=3;c.strokeStyle='rgba(20,30,28,.65)';c.strokeText(n.name,0,-56);c.fillStyle='#fff8e6';c.fillText(n.name,0,-56)}c.restore()}});
    if(n.dragon){const dsc=STAGE_SC[dragonStage(n.dragon)],dxp=n.dx*T,dyp=n.dy*T;
      list.push({y:dyp,fn:()=>{c.save();c.translate(dxp,dyp);c.fillStyle='rgba(15,35,30,.3)';c.beginPath();c.ellipse(0,1,17*dsc,5.4,0,0,6.3);c.fill();
        drawDragon(c,{look:n.dragon,stage:dragonStage(n.dragon),dir:n.ddir,ph:n.dph,moving:n.dmov,t:G.t,flying:false,flap:0});c.restore()}})}
  }
  list.sort((a,b)=>a.y-b.y);
  for(const it of list){
    if(it.fn){it.fn();continue}
    const o=it.o;
    if(o.bob){c.save();c.translate(0,-Math.abs(Math.sin(G.t*3.2))*9);c.drawImage(o.spr,o.x-o.ax,o.y-o.ay,o.w,o.h);c.restore();continue}
    if(o.ship){c.save();c.translate(0,Math.sin(G.t*1.2)*1.6);c.drawImage(o.spr,o.x-o.ax,o.y-o.ay,o.w,o.h);c.restore();continue}
    c.drawImage(o.spr,o.x-o.ax,o.y-o.ay,o.w,o.h);
  }
  for(const p of parts){const a=1-p.age/p.life;
    if(p.t==='smoke'){c.fillStyle=p.dark?`rgba(70,66,66,${.4*a})`:`rgba(235,235,230,${.34*a})`;c.beginPath();c.arc(p.x,p.y,5+p.age*6,0,6.3);c.fill()}
    else if(p.t==='ember'){c.fillStyle=`rgba(255,${150+a*80|0},60,${a})`;c.fillRect(p.x,p.y,1.8,1.8)}
    else if(p.t==='dust'){c.fillStyle=`rgba(220,200,160,${.5*a})`;c.beginPath();c.arc(p.x,p.y,3+p.age*8,0,6.3);c.fill()}
    else if(p.t==='wind'){c.strokeStyle=`rgba(255,255,255,${.5*a})`;c.lineWidth=1.4;c.beginPath();c.moveTo(p.x,p.y);c.lineTo(p.x-p.vx*.12,p.y-p.vy*.12);c.stroke()}
    else if(p.t==='spark'){c.fillStyle=`rgba(255,230,150,${a})`;c.beginPath();c.arc(p.x,p.y,2.2*a+.6,0,6.3);c.fill()}}
  // evening tint, then the lights
  if(night>0){c.save();c.setTransform(1,0,0,1,0,0);c.globalCompositeOperation='multiply';
    c.fillStyle=`rgb(${255-Math.round(90*night)},${255-Math.round(78*night)},${255-Math.round(36*night)})`;c.fillRect(0,0,cv.width,cv.height);c.restore()}
  c.globalCompositeOperation='lighter';
  const fl=(.85+.15*Math.sin(G.t*9)+.05*Math.sin(G.t*23))*(.55+night*1.1);
  if(Z.home&&own('campfire'))drawGlow(c,22.5*T,17.2*T,72*fl,'255,150,60',.28);
  for(const o of OBJ){if(!o.glow)continue;drawGlow(c,o.x-o.ax+o.glow[0],o.y-o.ay+o.glow[1],o.glowR||34,o.glowCol||'255,190,90',(o.glowCol?.3:.22)*fl)}
  if(Z.home)drawGlow(c,18*T,10.2*T,56,'255,200,110',.16+.2*night);
  if(Z.home&&built('forge'))drawGlow(c,22.9*T-95*.8+88*.8,11*T-148*.8+124*.8,60*(.8+.2*Math.sin(G.t*7)),'255,130,50',.3+.2*night);
  c.globalCompositeOperation='source-over';
  if(Z.home&&(!done()&&hatched()||!done())){const a=.35+.25*Math.sin(G.t*3);c.fillStyle=`rgba(255,226,140,${a})`;c.beginPath();c.ellipse(18*T,11.5*T,32,10,0,0,6.3);c.fill()}
  c.setTransform(dpr,0,0,dpr,0,0);
  const vg=c.createRadialGradient(cw/2,ch/2,Math.min(cw,ch)*.45,cw/2,ch/2,Math.max(cw,ch)*.75);vg.addColorStop(0,'rgba(30,20,40,0)');vg.addColorStop(1,'rgba(30,20,40,.3)');c.fillStyle=vg;c.fillRect(0,0,cw,ch);
}

return {show,preload,refresh,reset,feedTime,craftPuzzle,drill,travelTo,openMap,activate,ISLES,isleStatus,zone:()=>Z,heroPic,hud,onKey,onKeyUp,toggleFly,goToSchool,
  state:{G,P,Dg,VS,OBJ,TREES,notes,acts,blocked,walk,cam,held},
  setHour:h=>{VS.hour=h},setPos:(x,y)=>{P.x=x+.5;P.y=y+.5;Dg.x=P.x-1;Dg.y=P.y;Dg.trail=[]},
  okGround,bfs,ptile,tapTile:doTapTile,say:vsay,shards:()=>VS.shards,collectAt,runAct,
  stableSpots:STABLE_SPOTS,PLOTS};
