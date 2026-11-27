/* ===== The story: "Crumpet and the Case of the Missing Warm Stones" =====
   Told by Old Knut the Unreliable. Chapters open by practised days, never by scores.
   Wrong answers cost nothing, nothing is timed, and nothing here touches the maths practice. ===== */
const STORY_EVERY=4;                     /* practised days between chapters */
const stSt=()=>S.story||(S.story={ch:{},clues:[],seen:false,embers:0});
const stCh=n=>stSt().ch[n]||null;
const stDone=n=>!!(stCh(n)&&stCh(n).done);
const stName=()=>S.dragon&&hatched()?S.dragon.name:'your egg';
function stLevel(){const n=Object.keys(S.items||{}).length;return n<15?0:n<45?1:2}
function stOpens(n){            /* has chapter n opened yet, and how many practised days remain */
  if(n===1) return {open:true,left:0};
  const p=stCh(n-1); if(!p||!p.done) return {open:false,left:null};
  const left=Math.max(0,STORY_EVERY-(S.days.length-(p.doneDays||0)));
  return {open:left===0,left};
}
const shuf=a=>a.slice().sort(()=>Math.random()-.5);
function stChoices(ans,near){const set=new Set([ans]);let g=0;while(set.size<3&&g++<40){const d=near[RR(0,near.length-1)]*(Math.random()<.5?-1:1);const v=ans+d;if(v>=0&&v!==ans)set.add(v)}return shuf([...set])}

/* ---- sprites ---- */
SPR.stTin=mk(46,46,c=>{shadowBlob(c,23,41,15,4,.3);
  c.fillStyle='#b8402e';c.beginPath();c.ellipse(23,32,15,6,0,0,6.3);c.fill();c.fillRect(8,22,30,10);c.fillStyle='#b8402e';c.beginPath();c.ellipse(23,32,15,6,0,0,3.15);c.fill();
  c.fillStyle='#8f2c1f';c.beginPath();c.ellipse(23,22,15,6,0,0,6.3);c.fill();c.fillStyle='#3b2416';c.beginPath();c.ellipse(23,22,12,4.2,0,0,6.3);c.fill();
  c.fillStyle='#e8d9a8';c.fillRect(13,26,20,5);c.fillStyle='#5a3a1a';c.fillRect(15,28,6,1.4);c.fillRect(24,28,6,1.4);
  c.save();c.translate(33,17);c.rotate(.7);c.fillStyle='#d9a441';c.beginPath();c.ellipse(0,0,13,3.6,0,0,6.3);c.fill();c.restore();
  c.fillStyle='#8a5a2a';[[10,38],[17,40],[29,39],[35,37],[22,42]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,1.5,0,6.3);c.fill()})});
SPR.stCrumbs=mk(48,26,c=>{c.fillStyle='rgba(60,40,20,.18)';c.beginPath();c.ellipse(24,16,21,6,0,0,6.3);c.fill();
  [[6,14,2],[12,10,1.6],[17,16,2.2],[23,11,1.5],[28,17,2],[34,12,1.8],[40,16,2.2],[20,20,1.4],[10,19,1.3],[44,11,1.4]].forEach(([x,y,r])=>{c.fillStyle='#9a6b36';c.beginPath();c.arc(x,y,r,0,6.3);c.fill();c.fillStyle='#c79556';c.beginPath();c.arc(x-.4,y-.4,r*.55,0,6.3);c.fill()});
  c.fillStyle='#c79556';c.beginPath();c.arc(30,9,5,0,3.14);c.fill();c.strokeStyle='#7a5226';c.lineWidth=1;c.stroke()});
function stPaw(c,x,y,s,bow){c.fillStyle='rgba(70,50,30,.55)';c.beginPath();c.ellipse(x,y,3.4*s,2.8*s,0,0,6.3);c.fill();[[-3.6,-3.6],[-1.2,-5.2],[1.4,-5.2],[3.8,-3.6]].forEach(([dx,dy])=>{c.beginPath();c.ellipse(x+dx*s,y+dy*s,1.2*s,1.5*s,0,0,6.3);c.fill()});
  if(bow){c.fillStyle='#d9342b';c.beginPath();c.moveTo(x,y-7*s);c.lineTo(x-4*s,y-9*s);c.lineTo(x-4*s,y-5*s);c.closePath();c.fill();c.beginPath();c.moveTo(x,y-7*s);c.lineTo(x+4*s,y-9*s);c.lineTo(x+4*s,y-5*s);c.closePath();c.fill()}}
SPR.stPaws=mk(52,32,c=>{c.fillStyle='rgba(120,90,50,.16)';c.beginPath();c.ellipse(26,20,24,8,0,0,6.3);c.fill();stPaw(c,10,24,1,false);stPaw(c,26,18,1,false);stPaw(c,42,24,1,true)});
SPR.stStone=mk(40,40,c=>{shadowBlob(c,20,34,11,3.5,.3);c.fillStyle='rgba(255,170,60,.28)';c.beginPath();c.arc(20,24,15,0,6.3);c.fill();
  c.fillStyle=lg(c,0,12,0,34,['#ffb347','#e0661f']);c.beginPath();c.moveTo(9,28);c.quadraticCurveTo(8,14,20,12);c.quadraticCurveTo(33,14,32,28);c.quadraticCurveTo(20,35,9,28);c.fill();
  c.strokeStyle='#8a3a10';c.lineWidth=1.2;c.stroke();c.fillStyle='rgba(255,236,170,.8)';c.beginPath();c.ellipse(16,19,4,2.4,-.5,0,6.3);c.fill();
  c.strokeStyle='rgba(255,226,140,.8)';c.lineWidth=1.2;[[6,8,12,12],[34,8,28,12],[20,3,20,8]].forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke()})});
SPR.stMark=mk(24,32,c=>{c.fillStyle='#ffd23f';c.strokeStyle='#8a5a10';c.lineWidth=2;c.beginPath();c.arc(12,12,10,0,6.3);c.fill();c.stroke();
  c.fillStyle='#3a2410';c.fillRect(10.4,5,3.2,9);c.beginPath();c.arc(12,18,1.9,0,6.3);c.fill();
  c.fillStyle='#ffd23f';c.beginPath();c.moveTo(8,21);c.lineTo(12,28);c.lineTo(16,21);c.closePath();c.fill();c.strokeStyle='#8a5a10';c.stroke()});

/* ---- chapter 2 sprites ---- */
SPR.stGull=mk(46,56,c=>{shadowBlob(c,23,50,12,3.5,.3);c.fillStyle='#7a5230';c.fillRect(19,34,8,16);c.fillStyle='#8f6a42';c.fillRect(17,32,12,4);
  c.fillStyle='#f4f4f0';c.beginPath();c.ellipse(23,24,10,8,0,0,6.3);c.fill();c.beginPath();c.arc(30,15,5.6,0,6.3);c.fill();
  c.fillStyle='#9aa4b0';c.beginPath();c.moveTo(10,22);c.quadraticCurveTo(22,14,32,26);c.quadraticCurveTo(20,30,10,22);c.fill();
  c.fillStyle='#f0a030';c.beginPath();c.moveTo(34,14);c.lineTo(42,17);c.lineTo(34,19);c.closePath();c.fill();c.fillStyle='#d9342b';c.fillRect(38,16.5,3,1.6);
  c.fillStyle='#111';c.beginPath();c.arc(31.5,13.4,1.1,0,6.3);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(31.9,13,.4,0,6.3);c.fill();
  c.strokeStyle='#f0a030';c.lineWidth=1.4;c.beginPath();c.moveTo(21,31);c.lineTo(21,34);c.moveTo(26,31);c.lineTo(26,34);c.stroke()});
SPR.stHoof=mk(52,34,c=>{c.fillStyle='rgba(90,60,30,.42)';c.beginPath();c.ellipse(26,20,24,10,0,0,6.3);c.fill();
  [[10,16],[24,22],[38,15],[44,24]].forEach(([x,y])=>{c.fillStyle='rgba(50,32,16,.7)';c.beginPath();c.ellipse(x-2.2,y,2,3.2,.15,0,6.3);c.fill();c.beginPath();c.ellipse(x+2.2,y,2,3.2,-.15,0,6.3);c.fill()})});
SPR.stPhoto=mk(54,64,c=>{shadowBlob(c,27,58,14,4,.3);c.fillStyle='#6b4a2a';c.fillRect(24,34,6,24);
  c.fillStyle='#8f6a42';c.strokeStyle='#4a3018';c.lineWidth=2;c.beginPath();c.rect(5,4,44,36);c.fill();c.stroke();
  c.fillStyle='#fff8e6';c.fillRect(10,9,34,26);c.fillStyle='#d9a441';c.beginPath();c.ellipse(27,28,13,5,0,0,6.3);c.fill();
  c.fillStyle='#f2c98a';c.beginPath();c.ellipse(27,23,10,6,0,0,6.3);c.fill();c.fillStyle='#3b2416';c.beginPath();c.arc(23,22,1,0,6.3);c.arc(31,22,1,0,6.3);c.fill();
  c.fillStyle='#d9342b';c.beginPath();c.moveTo(27,16);c.lineTo(23,13);c.lineTo(23,18);c.closePath();c.moveTo(27,16);c.lineTo(31,13);c.lineTo(31,18);c.closePath();c.fill();
  c.fillStyle='#ffd23f';c.beginPath();c.arc(8,6,2.4,0,6.3);c.fill()});
/* ---- puzzles: pitched by how much the child has practised; pictures to count; unlimited tries ---- */
function stMake(spec){
  const L=stLevel(); let q,ans,opts,show='';
  const rows=(n,e,per)=>{let t=[];for(let k=0;k<n;k+=per)t.push(e.repeat(Math.min(per,n-k)));return t.join('\n')};
  if(spec.kind==='add'){
    const a=L===0?RR(2,5):L===1?RR(5,10):RR(8,20), b=L===0?RR(2,4):L===1?RR(4,9):RR(7,19); ans=a+b; q=spec.q(a,b);
    if(ans<=20) show=(spec.e[0].repeat(a))+'  '+(spec.e[1].repeat(b)); opts=stChoices(ans,L===0?[1,2]:[1,2,10]);
  }else if(spec.kind==='sub'){
    const n=L===0?RR(6,9):L===1?RR(12,20):RR(3,5)*10, k=L===0?RR(2,n-3):L===1?RR(4,n-4):RR(1,n/10-1)*10+(L===2?RR(0,4):0); ans=n-k; q=spec.q(n,k);
    if(n<=20) show=spec.e[0].repeat(k)+'  '+spec.e[1].repeat(n-k); opts=stChoices(ans,L===0?[1,2]:[1,2,10]);
  }else if(spec.kind==='cmp'){
    const a=L===0?RR(5,9):L===1?RR(9,16):RR(20,40), b=L===0?RR(2,a-2):L===1?RR(3,a-3):RR(10,a-4); ans=a-b; q=spec.q(a,b);
    if(a<=16) show=spec.e[0].repeat(a)+'\n'+spec.e[1].repeat(b); opts=stChoices(ans,L===0?[1,2]:[1,2,10]);
  }else if(spec.kind==='grp'){
    const c=spec.perRow||(L===0?RR(2,3):RR(2,5)), r=L===0?RR(2,3):L===1?RR(2,4):RR(3,6); ans=r*c; q=spec.q(r,c);
    show=Array.from({length:r},()=>spec.e[0].repeat(c)).join('\n'); opts=stChoices(ans,L===0?[1,2]:[c,2,1]);
  }else{
    const s=L===0?1:[2,5,10][RR(0,2)], st=RR(1,4)*s+(L===0?RR(0,3):0), seq=[0,1,2].map(i=>st+i*s); ans=st+3*s; q=spec.q(seq); opts=stChoices(ans,[s,s*2]);
  }
  return {q,ans,opts,show};
}
function stPuzzle(spec,onRight){
  const p=stMake(spec);
  const ask=(msg)=>vsay((msg?msg+'\n\n':'')+p.q+(p.show?'\n'+p.show:''),p.opts.map(x=>({label:String(x),fn:()=>{
    if(x===p.ans){Audio_.fx('pop');onRight()}
    else ask('Not quite. Take your time, you can try as often as you like.')}})));
  ask('');
}
function stReadPages(pages,done){const go=i=>vsay(pages[i],[{label:i<pages.length-1?'Turn the page':'On we go',fn:()=>i<pages.length-1?go(i+1):(done&&done())}]);go(0)}
function stClue(id,title,text){const s=stSt();if(!s.clues.some(c=>c.id===id)){s.clues.push({id,title,text});saveState()}}
function stRefresh(){Village.refresh&&Village.refresh()}

/* ---- chapter data: spots are tiles on the home island, shown one at a time with a bouncing marker over the next ---- */
const KNUT=t=>'Old Knut: '+t;
const CH1={n:1,title:'The Biscuit Tin Is Empty',
  intro:[
   KNUT("Welcome, brave detective! I am Old Knut the Unreliable, and this is my Book of Tall Tales. Every word is true. (Most words. Some words. A few.) Our story begins on the Isle of Ru, on an ordinary morning, when something EXTRAORDINARY happened to a biscuit tin."),
   KNUT("The tin belonged to Daddy. Daddy takes tea very seriously. He takes biscuits even more seriously. He hid them in a secret place that nobody knew about, except the hens, the gulls and everybody. Knut's Rule of Detecting Number 1: a secret that everybody knows is only a surprise."),
   "Daddy: \"The tin is EMPTY! I am being extremely serious.\" (A crumb fell off his chin.) \"Detective, find the biscuit thief!\" Look for the bouncing ! on the island."],
  spots:[
   {x:24,y:14,spr:'stTin',ax:23,ay:40,cx:24.5,cy:14.95,
    seen:'The biscuit tin. Still empty. Daddy is still being extremely serious about it.',
    look:"The biscuit tin is empty, the lid is still warm and there is not one biscuit left. Daddy says: \"There were biscuits in there. MANY biscuits. I counted them. Twice.\"",btn:'Count them',
    puz:{kind:'add',e:['🍫','🍪'],q:(a,b)=>`Daddy's tin held ${a} chocolate biscuits and ${b} plain ones. How many biscuits have vanished altogether?`},
    clue:['crumbs','The crumb trail',"A trail of crumbs leads away from Daddy's tin across the grass."],
    win:"Yes! All gone. Daddy goes pale. Then you spot something: a trail of crumbs leading away across the grass. Clue found: the crumb trail! Follow the bouncing !."},
   {x:23,y:17,spr:'stCrumbs',ax:24,ay:20,cx:23.5,cy:17.9,sc:1.5,
    seen:'The crumb trail. Whoever dropped these was small, hungry and in a hurry.',
    look:"Crumbs, crumbs and more crumbs. Whoever took the biscuits dropped them as they ran. Let's count them properly.",btn:'Count the crumbs',
    puz:{kind:'sub',e:['🟤','⚪'],q:(n,k)=>`There are ${n} crumbs in the trail. The thief dropped ${k} on the grass. The rest went along the path. How many went along the path?`},
    clue:['small','A small, hungry thief','The crumbs are tiny. The thief is small, and in a very big hurry.'],
    win:"Right! And look how small the crumbs are. Our thief is small, hungry and in a hurry. Clue found! The trail goes on. Follow the bouncing !."},
   {x:21,y:18,spr:'stPaws',ax:26,ay:24,cx:21.5,cy:18.9,
    seen:'Tiny paw prints, each with a tiny bow-shaped dent. A very stylish thief.',
    look:(D)=>`Tiny paw prints! Each one has a dent shaped like a little bow. ${D} sniffs them and gives a very suspicious look. Each print has a number scratched beside it.`,btn:'Read the numbers',
    puz:{kind:'pat',q:seq=>`The tiny paw prints are numbered! They go: ${seq.join(', ')}, ... What number is on the next print?`},
    clue:['paws','Tiny paw prints with a bow','Paw prints, smaller than a conker, with a bow-shaped dent. Whoever it was dresses very smartly.'],
    win:"Correct! The prints lead on, towards the sandy bank. Clue found: tiny paw prints with a bow. Follow the bouncing ! one last time."},
   {x:18,y:21,spr:'stStone',ax:20,ay:30,cx:18.5,cy:21.9,glow:true,
    seen:'The warm, humming stone is in your Clue Book.',
    clue:['stone','A warm, humming stone','A small orange stone, warm as toast, humming a little tune. It was left where the paw prints end.'],
    end:(D)=>[
      "In the sand, where the paw prints end, something is humming. A small orange stone, warm as toast. You pick it up. It hums a little tune. (+6 embers.)",
      `${D} sniffs the stone, sneezes a tiny puff of smoke, and the stone hums LOUDER.`,
      "Then, from far out across the water, a tiny light blinks three times. And from the dark comes a bark. A very small, very smug bark.",
      KNUT("I would tell you who it was, but my tea has gone cold and I am NOT going on. Come back soon for Chapter 2: Suspect Number One. (Chapter 2 opens after "+STORY_EVERY+" more days of practice.)")]}],
  recap:["You found the empty tin, the crumb trail, the tiny paw prints and a warm, humming stone. And out in the dark, someone barked."]};
const CH2={n:2,title:'Suspect Number One',
  intro:[
   KNUT("Last time: an empty biscuit tin, a trail of crumbs, tiny paw prints and a stone that hums. Today, every grown-up on Ru has a THEORY."),
   KNUT("Daddy blames the cows. (Daddy is scared of cows, so he blames them from a very long way away.) Mummy blames the deer. Uncle Andy blames geese. (He is scared of those.) Nobody blames the cutest suspect of all, because Crumpet is SO cute. Knut's Rule of Detecting Number 2: the cuter the suspect, the harder you must look."),
   KNUT("Grimble the gull saw everything. Grimble the gull always sees everything, slightly wrong. Find the bouncing ! and hear his story.")],
  spots:[
   {x:13,y:14,spr:'stGull',ax:23,ay:50,cx:13.5,cy:14.95,
    seen:'Grimble is still talking. He has now forgotten what he saw, but is very sure about it.',
    look:"Grimble the gull flaps onto his post. \"I saw EVERYTHING,\" he squawks. \"It was dark. Or foggy. Or I had my eyes shut. But I definitely saw them!\"",btn:'Listen carefully',
    puz:{kind:'cmp',e:['🐕','🐄'],q:(a,b)=>`Grimble says: "I saw ${a} small furry things and ${b} big hairy ones!" (Knut's footnote: he did NOT.) How many MORE small furry things than big hairy ones did Grimble say he saw?`},
    clue:['grimble','Grimble the gull saw a small furry thing','Grimble saw a small furry thing wearing a hat. Grimble also once saw a cheese fly, so check everything he says.'],
    win:"Right! More small furry things than big hairy ones. So the thief was small, not big and hairy. Grimble adds: \"And it was wearing a HAT!\" Clue found. Follow the bouncing !."},
   {x:30,y:14,spr:"stHoof",ax:26,ay:26,cx:30.5,cy:14.9,
    seen:'Hoofprints in the mud, nowhere near the biscuit tin. The cows are innocent.',
    look:(D)=>`Daddy says it was the cows. ${D} checks the cow paddock for evidence. There are lots of muddy hoofprints here, but cows have four legs each.`,btn:'Count the hoofprints',
    puz:{kind:'grp',perRow:4,e:['🐾'],q:(r,c)=>`There are ${r} cows in the paddock. Each cow has ${c} legs, so each makes ${c} hoofprints. How many hoofprints do ${r} cows make?`},
    clue:['cows','The cows are innocent','Cows make lots of hoofprints, but there were none near Daddy\'s tin, only tiny paw prints. Daddy is wrong about the cows.'],
    win:"Yes! And there were NO hoofprints anywhere near Daddy's tin. The cows are innocent. (Daddy will still keep a safe distance from them.) Clue found. Follow the bouncing !."},
   {x:26,y:12,spr:'stPhoto',ax:27,ay:58,cx:26.5,cy:12.95,glow:false,
    seen:'Uncle Andy\'s alibi photo, pinned to the board. Something about it is not right.',
    look:"Uncle Andy has pinned up his alibi: photos of Crumpet fast asleep in bed all night. \"Crumpet NEVER leaves his basket,\" he says proudly. The photos are numbered, but one is smudged.",btn:'Read the numbers',
    puz:{kind:'pat',q:seq=>`The alibi photos are numbered: ${seq.join(', ')}, ... What number is the next photo?`},
    clue:['photo','The alibi photo is fake','In Uncle Andy\'s alibi photo, Crumpet is not Crumpet. It is a pillow wearing a tiny hat with a bow.'],
    end:(D)=>[
      "Correct! You lean closer to the last photo. There is Crumpet, fast asleep in his basket. Very cute. Very still. TOO still. (+6 embers.)",
      "Because it is not Crumpet. It is a PILLOW. Wearing a tiny hat. Someone has propped it up with a very small, very neat bow.",
      KNUT("Uncle Andy swears on his best teaspoon that Crumpet was in bed all night. But if that is a pillow, then WHERE was Crumpet? And where is Uncle Andy's best teaspoon? Come back soon for Chapter 3: The Cheese Cellar Job.")]}]};
const CHAPTERS=[CH1,CH2];
const stChap=n=>CHAPTERS.find(c=>c.n===n);

function storySpots(){
  CHAPTERS.forEach(ch=>{
    const st0=stCh(ch.n); if(!st0||st0.done) return;
    const st=Math.min(st0.step||0,ch.spots.length-1);
    ch.spots.forEach((p,i)=>{ if(i>st) return;
      addObj(SPR[p.spr],p.cx,p.cy,p.ax,p.ay,p.glow?{glow:[20,24],glowR:36,glowCol:'255,170,60'}:(p.sc?{sc:p.sc}:{}));
      block([[p.x,p.y]],null,'story:'+ch.n+':'+i);hitArea(p.x,p.y,[[0,-1],[0,1],[-1,0],[1,0],[0,-2],[-1,-1],[1,-1]]);
    });
    const p=ch.spots[st];addObj(SPR.stMark,p.cx,p.cy-1.1,12,26,{bob:true,glow:[12,12],glowR:26,glowCol:'255,214,90'});
  });
}
function storyAct(n,i){
  const ch=stChap(n), c=stCh(n); if(!ch||!c||c.done) return;
  const st=c.step||0, D=stName(), p=ch.spots[i];
  if(i<st){ vsay(p.seen); return }
  if(i>st){ vsay('Not this one yet. Look for the bouncing ! to find the next clue.'); return }
  const last=i===ch.spots.length-1;
  if(!last){
    const look=typeof p.look==='function'?p.look(D):p.look;
    vsay(look,[{label:p.btn,fn:()=>stPuzzle(p.puz,()=>{
      stClue(...p.clue);c.step=i+1;saveState();stRefresh();vsay(p.win)})}]);
  }else{
    const finish=()=>{stClue(...p.clue);c.done=true;c.doneDays=S.days.length;S.embers+=6;saveState();hud();Audio_.fx('fanfare');stRefresh();stReadPages(p.end(D),()=>stRefresh())};
    if(p.puz){const look=typeof p.look==='function'?p.look(D):p.look;vsay(look,[{label:p.btn,fn:()=>stPuzzle(p.puz,finish)}])}
    else finish();
  }
}

/* ---- the book: chapters and the clue book ---- */
function openStory(){
  const s=stSt(); if(!s.seen){s.seen=true;saveState();hud&&hud()}
  const begin=ch=>stReadPages(ch.intro,()=>{s.ch[ch.n]={step:0,done:false};saveState();stRefresh();vsay("Chapter "+ch.n+" has begun! Find the bouncing ! on the island and tap it. Open the Story book any time from the Story button.")});
  if(!stCh(1)){ begin(CH1); return }
  const btns=[]; let note="Old Knut's Book of Tall Tales.";
  CHAPTERS.forEach(ch=>{
    const c=stCh(ch.n), o=stOpens(ch.n);
    if(c&&c.done) btns.push({label:`Chapter ${ch.n}: ${ch.title} (finished)`,fn:()=>stReadPages(ch.intro.slice(0,1).concat(ch.recap||[`Chapter ${ch.n} is finished. Well done, detective.`]))});
    else if(c) btns.push({label:`Chapter ${ch.n}: ${ch.title} (in progress)`,fn:()=>vsay(`Chapter ${ch.n}: ${ch.title}. Look for the bouncing ! on the island and tap it to find the next clue.`)});
    else if(o.open) btns.push({label:`Chapter ${ch.n}: ${ch.title} (new!)`,fn:()=>begin(ch)});
    else if(o.left!=null) note+=` Chapter ${ch.n} opens after ${o.left} more practised day${o.left===1?'':'s'}.`;
  });
  const lastDone=CHAPTERS.filter(ch=>stDone(ch.n)).length;
  if(lastDone===CHAPTERS.length) note+=` The next chapter is being written and will arrive in a coming update.`;
  btns.push({label:'Clue Book ('+s.clues.length+')',fn:openClues});btns.push({label:'Close'});
  vsay(note,btns);
}
function openClues(){
  const s=stSt();
  if(!s.clues.length){vsay("Your Clue Book is empty. Start the story and every clue you find goes in here.");return}
  openSheet(`<div class="row spread"><h2>Clue Book</h2><button class="btn btn-ghost btn-sm" data-act="close">${ic('close',18)} Close</button></div>
   <p class="note">Every clue you have found as the island's detective.</p>
   ${s.clues.map((c,i)=>`<div class="box"><h3>${i+1}. ${esc(c.title)}</h3><p class="note">${esc(c.text)}</p></div>`).join('')}`);
}
/* the Story button pulses until the book is opened, and again whenever a new chapter has opened but not been started */
const storyNew=()=>{const s=stSt();if(!s.seen)return true;return CHAPTERS.some(ch=>!stCh(ch.n)&&stOpens(ch.n).open)};
