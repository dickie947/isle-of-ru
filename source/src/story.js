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
/* ---- chapter 1 and 2: new puzzle-spot sprites ---- */
SPR.stLine=mk(60,56,c=>{shadowBlob(c,30,50,22,4,.28);c.fillStyle='#7a5230';c.fillRect(6,10,4,40);c.fillRect(50,10,4,40);
  c.strokeStyle='#5a4a3a';c.lineWidth=1.3;c.beginPath();c.moveTo(8,13);c.quadraticCurveTo(30,22,52,13);c.stroke();
  [[16,0,'#e05a4a'],[26,0,'#4a8ad9'],[36,0,'#e0b83a'],[44,0,'#6aa84a']].forEach(([x,_,col],i)=>{const y=17+Math.sin(i*1.4+.6)*2.2;c.fillStyle=col;c.beginPath();c.moveTo(x-4,y);c.lineTo(x+4,y);c.lineTo(x+3,y+14);c.quadraticCurveTo(x,y+17,x-3,y+14);c.closePath();c.fill();c.fillStyle='#fff8e6';c.fillRect(x-4,y,8,2.4)});
  c.fillStyle='#d9342b';c.beginPath();c.moveTo(52,16);c.lineTo(58,13);c.lineTo(58,19);c.closePath();c.fill();c.beginPath();c.moveTo(52,16);c.lineTo(46,13);c.lineTo(46,19);c.closePath();c.fill()});
SPR.stFeather=mk(44,34,c=>{c.fillStyle='rgba(60,40,20,.16)';c.beginPath();c.ellipse(22,24,19,6,0,0,6.3);c.fill();
  [[10,18,-.5],[18,14,.2],[26,17,.7],[32,21,-.2],[14,23,.4],[24,22,-.7]].forEach(([x,y,r])=>{c.save();c.translate(x,y);c.rotate(r);c.fillStyle='#fdfdf8';c.strokeStyle='#c8ccd2';c.lineWidth=.8;c.beginPath();c.ellipse(0,0,10,3.2,0,0,6.3);c.fill();c.stroke();c.beginPath();c.moveTo(-10,0);c.lineTo(10,0);c.stroke();c.restore()});
  c.fillStyle='#4a78c8';c.fillRect(20,19,7,1.4)});

const KNUT=t=>'Old Knut: '+t;
const pgs=(x,D)=>{const v=typeof x==='function'?x(D):x;return (Array.isArray(v)?v:[v]).map(t=>t.replace(/\{D\}/g,D))};
function stScene(pages,label,fn){const go=i=>vsay(pages[i],i<pages.length-1?[{label:'Turn the page',fn:()=>go(i+1)}]:[{label,fn}]);go(0)}
function stFull(ch,D){let a=pgs(ch.intro,D);ch.spots.forEach((p,i)=>{if(p.look)a=a.concat(pgs(p.look,D));if(p.win)a=a.concat(pgs(p.win,D));if(p.end)a=a.concat(pgs(p.end,D))});return a}

const CH1={n:1,title:'The Biscuit Tin Is Empty',
  intro:[
   KNUT("Welcome, brave detective! I am Old Knut the Unreliable, and this is my Book of Tall Tales. Every word is true. (Most words. Some words. A few.) Our story begins on the Isle of Ru, on an ordinary morning, when something EXTRAORDINARY happened to a biscuit tin."),
   KNUT("The tin belonged to Daddy. Daddy takes tea very seriously. He takes biscuits even more seriously. He hid them in a secret place that nobody knew about, except the hens, the gulls and everybody. Knut's Rule of Detecting Number 1: a secret that everybody knows is only a surprise."),
   KNUT("Now, the Isle of Ru is not an ordinary island. It has dragons, puffins who gossip, a gull called Grimble who sees everything slightly wrong, and a very small dog called Crumpet, who is so cute that people hand him cheese without noticing they have done it. On THIS particular morning, the island was quiet. Too quiet. The sort of quiet that goes ‘hmmmm’."),
   "Daddy: “The tin is EMPTY! I am being extremely serious.” (A crumb fell off his chin.) “Somebody has been in my biscuits, and I want to know WHO. Detective, find the biscuit thief!” Look for the bouncing ! on the island."],
  spots:[
   {x:24,y:14,spr:'stTin',ax:23,ay:40,cx:24.5,cy:14.95,
    seen:'The biscuit tin. Still empty. Daddy is still being extremely serious about it.',
    look:["The biscuit tin is empty, the lid is still warm and there is not one biscuit left. Daddy says: “There were biscuits in there. MANY biscuits. I counted them. Twice.”",
          "{D} climbs on top of the tin, peers inside, and comes out with a crumb on its nose. Knut: “A good detective starts with the facts. The fact is: biscuits, there WERE. Biscuits, there are NOT. So count what has gone.”"],btn:'Count them',
    puz:{kind:'add',e:['🍫','🍪'],q:(a,b)=>`Daddy's tin held ${a} chocolate biscuits and ${b} plain ones. How many biscuits have vanished altogether?`},
    clue:['crumbs','The crumb trail',"A trail of crumbs leads away from Daddy's tin across the grass."],
    win:["Yes! All gone. Daddy goes pale. “That is… a LOT of biscuits,” he whispers. He sits down on an upturned bucket and holds his teacup with both hands.",
         "Then {D} spots something on the grass: a trail of crumbs, leading away from the tin. Knut: “A clue! (I would have found it myself, but I was busy being wise.)” Clue found: the crumb trail! Follow the bouncing !."]},
   {x:23,y:17,spr:'stCrumbs',ax:24,ay:20,cx:23.5,cy:17.9,sc:1.5,
    seen:'The crumb trail. Whoever dropped these was small, hungry and in a hurry.',
    look:["Crumbs, crumbs and more crumbs. Whoever took the biscuits dropped them as they ran, and the trail wiggles all over the grass like a very greedy snake.",
          "Knut whispers from the page: “Notice how small the crumbs are. Small crumbs mean small bites. Small bites mean a small mouth. (That is Knut's Rule: small crumbs, small thief.) Let's count them properly.”"],btn:'Count the crumbs',
    puz:{kind:'sub',e:['🟤','⚪'],q:(n,k)=>`There are ${n} crumbs in the trail. The thief dropped ${k} on the grass. The rest went along the path. How many went along the path?`},
    clue:['small','A small, hungry thief','The crumbs are tiny. The thief is small, and in a very big hurry.'],
    win:["Right! And look how small the crumbs are. Our thief is small, hungry and in a hurry.",
         "Something rustles in the hedge ahead. {D} pounces, but there is only a leaf. The leaf looks guilty. Knut: “Never trust a leaf. Clue found! The trail goes on. Follow the bouncing !.”"]},
   {x:21,y:18,spr:'stPaws',ax:26,ay:24,cx:21.5,cy:18.9,
    seen:'Tiny paw prints, each with a tiny bow-shaped dent. A very stylish thief.',
    look:["Tiny paw prints! Each one has a dent shaped like a little bow. {D} sniffs them and gives a very suspicious look.",
          "Knut: “A thief with a BOW? A thief with STYLE. This is going to be a tricky case, because I already rather admire him.” Each print has a number scratched beside it."],btn:'Read the numbers',
    puz:{kind:'pat',q:seq=>`The tiny paw prints are numbered! They go: ${seq.join(', ')}, ... What number is on the next print?`},
    clue:['paws','Tiny paw prints with a bow','Paw prints, smaller than a conker, with a bow-shaped dent. Whoever it was dresses very smartly.'],
    win:["Correct! The prints lead on, over a flowerbed and under a bench, and then they stop at Uncle Andy's washing line. Follow the bouncing !.",
         "Clue found: tiny paw prints with a bow."]},
   {x:25,y:19,spr:'stLine',ax:30,ay:52,cx:25.5,cy:19.95,
    seen:'Uncle Andy\'s washing line. One sock is missing and a tiny red ribbon was left behind.',
    look:["The paw prints stop at Uncle Andy's washing line, where socks hang in neat rows. Uncle Andy says: “Don't mind the socks. They are my best socks, and they have been OFFICIALLY counted. By me. This morning.”",
          "But one peg is empty, and something small and red is caught on the peg beside it. Knut: “Count the socks, detective. Uncle Andy always counts right. (He does not.)”"],btn:'Count the socks',
    puz:{kind:'grp',perRow:4,e:['🧦'],q:(r,c)=>`Uncle Andy hung his socks in ${r} rows, with ${c} socks in each row. How many socks should there be altogether?`},
    clue:['ribbon','A tiny red ribbon','A little red bow, snagged on Uncle Andy\'s washing line. It matches the bow-shaped dents in the paw prints.'],
    win:["Exactly right! And one sock IS missing from the end of the line. In its place, snagged on a peg, is a tiny red ribbon, exactly the shape of the dents in the paw prints.",
         "Knut gasps so hard that he drops a page. Clue found: a tiny red ribbon! The trail runs on towards the sandy bank. Follow the bouncing ! one last time."]},
   {x:18,y:21,spr:'stStone',ax:20,ay:30,cx:18.5,cy:21.9,glow:true,
    seen:'The warm, humming stone is in your Clue Book.',
    clue:['stone','A warm, humming stone','A small orange stone, warm as toast, humming a little tune. It was left where the paw prints end.'],
    end:["In the sand, where the paw prints end, something is humming. A small orange stone, warm as toast. You pick it up. It hums a little tune. (+6 embers.)",
         "{D} sniffs the stone, sneezes a tiny puff of smoke, and the stone hums LOUDER. The sand around it glows, just a little, like a lamp somebody forgot to turn off.",
         "Daddy hurries over, sniffing the air like a bloodhound. “A stone! My teapot stone! It lives under the tea cosy, and this morning my tea went stone cold. Detective, I have a feeling this was never just about biscuits.”",
         KNUT("A warm stone! The island keeps its hens' eggs cosy with them, and Daddy's teapot too. Funny. Daddy's teapot has gone cold this morning. But no, no. One mystery at a time."),
         "Then, from far out across the water, a tiny light blinks three times. And from the dark comes a bark. A very small, very smug bark.",
         KNUT("I would tell you who it was, but my tea has gone cold and I am NOT going on. Come back soon for Chapter 2: Suspect Number One. (Chapter 2 opens after "+STORY_EVERY+" more days of practice.)")]}]};
const CH2={n:2,title:'Suspect Number One',
  intro:[
   KNUT("Last time: an empty biscuit tin, a trail of crumbs, tiny paw prints, a tiny red ribbon and a stone that hums. Today, every grown-up on Ru has a THEORY."),
   KNUT("Daddy blames the cows. (Daddy is scared of cows, so he blames them from a very long way away.) Mummy blames the deer. Uncle Andy blames geese. (He is scared of those.) Nobody blames the cutest suspect of all, because Crumpet is SO cute. Knut's Rule of Detecting Number 2: the cuter the suspect, the harder you must look."),
   "Mummy: “It was the deer,” says Mummy, who once lost a whole row of lettuces. “Deer are sneaky. They have big eyes and no conscience.” Knut: “Mummy is wrong. But she is wrong in a very kind way, which is the best way to be wrong.”",
   KNUT("Crumpet, for anyone who has not met him, is small, round and fluffy, with ears like two slices of toast and a very good reason for everything he has ever done. (The reason is usually cheese.) He is Uncle Andy's dog, and Uncle Andy is sure he is perfect."),
   KNUT("Today is a day of ALIBIS. An alibi is when you say you were somewhere else at the time. Everybody has one. Most of them wobble. Hear every story, count carefully, and believe nothing except the numbers."),
   KNUT("Grimble the gull saw everything. Grimble the gull always sees everything, slightly wrong. Find the bouncing ! and hear his story.")],
  spots:[
   {x:13,y:14,spr:'stGull',ax:23,ay:50,cx:13.5,cy:14.95,
    seen:'Grimble is still talking. He has now forgotten what he saw, but is very sure about it.',
    look:["Grimble the gull flaps onto his post. “I saw EVERYTHING,” he squawks. “It was dark. Or foggy. Or I had my eyes shut. But I definitely saw them!”",
          "{D} waits politely. Grimble wobbles. “Furry things! Small ones! And big hairy ones! Possibly a hat with legs!” Knut: “Take his numbers, detective, and do the sums yourself.”"],btn:'Listen carefully',
    puz:{kind:'cmp',e:['🐕','🐄'],q:(a,b)=>`Grimble says: “I saw ${a} small furry things and ${b} big hairy ones!” (Knut's footnote: he did NOT.) How many MORE small furry things than big hairy ones did Grimble say he saw?`},
    clue:['grimble','Grimble the gull saw a small furry thing','Grimble saw a small furry thing wearing a hat. Grimble also once saw a cheese fly, so check everything he says.'],
    win:["Right! More small furry things than big hairy ones. So the thief was small, not big and hairy. Grimble adds: “And it was wearing a HAT!”",
         "Knut: “A hat! Write that down. Then write down that Grimble once saw a cheese fly, and draw a line under it.” Clue found. Follow the bouncing !."]},
   {x:30,y:14,spr:"stHoof",ax:26,ay:26,cx:30.5,cy:14.9,
    seen:'Hoofprints in the mud, nowhere near the biscuit tin. The cows are innocent.',
    look:["Daddy says it was the cows. “Cows are very large,” he calls from behind the water trough, “and they LOOK at you.”",
          "{D} checks the cow paddock for evidence. There are lots of muddy hoofprints here, and each cow has four legs. Time to count them properly."],btn:'Count the hoofprints',
    puz:{kind:'grp',perRow:4,e:['🐾'],q:(r,c)=>`There are ${r} cows in the paddock. Each cow has ${c} legs, so each makes ${c} hoofprints. How many hoofprints do ${r} cows make?`},
    clue:['cows','The cows are innocent','Cows make lots of hoofprints, but there were none near Daddy\'s tin, only tiny paw prints. Daddy is wrong about the cows.'],
    win:["Yes! And there were NO hoofprints anywhere near Daddy's tin. The cows are innocent. (Daddy will still keep a safe distance from them.)",
         "A cow looks up, chews slowly and gives {D} a look that says: ‘I would never. I am a COW.’ Knut: “Never has a suspect looked so bored. Clue found. Follow the bouncing !.”"]},
   {x:25,y:19,spr:'stFeather',ax:22,ay:26,cx:25.5,cy:19.9,sc:1.3,
    seen:'A heap of soft white feathers that are not goose feathers at all. Uncle Andy went very quiet.',
    look:["Uncle Andy points at a heap of white feathers by the pond. “GEESE,” he whispers. “Everybody knows geese steal biscuits. They have that look.”",
          "{D} picks up a feather and sniffs it. Knut: “One feather from a goose is a clue. A whole HEAP of them is a pillow fight. Count how many are left on the grass, detective.”"],btn:'Count the feathers',
    puz:{kind:'sub',e:['💨','🪶'],q:(n,k)=>`There were ${n} white feathers in the heap. The wind blew ${k} of them into the pond. How many are left on the grass?`},
    clue:['stuffing','Soft white pillow stuffing','The feathers are not from a goose. They are soft pillow stuffing, with a tiny thread of blue stripe.'],
    win:["Yes! And now look closely, because these are not goose feathers at all. They are stuffing. Soft, white pillow stuffing, with a tiny thread of blue stripe.",
         "Uncle Andy goes very, very quiet. Knut: “Interesting. Uncle Andy owns a great many pillows. Clue found: pillow stuffing. Follow the bouncing !.”"]},
   {x:26,y:12,spr:'stPhoto',ax:27,ay:58,cx:26.5,cy:12.95,glow:false,
    seen:'Uncle Andy\'s alibi photo, pinned to the board. Something about it is not right.',
    look:["Uncle Andy has pinned up his alibi: photos of Crumpet fast asleep in bed all night. “Crumpet NEVER leaves his basket,” he says proudly. “I took a photo every hour. For safety. And for the fridge.”",
          "The photos are numbered, but one is smudged. Knut peers over {D}'s shoulder: “A good alibi has no gaps. Find the missing number, detective, and we shall see what the last photo says.”"],btn:'Read the numbers',
    puz:{kind:'pat',q:seq=>`The alibi photos are numbered: ${seq.join(', ')}, ... What number is the next photo?`},
    clue:['photo','The alibi photo is fake','In Uncle Andy\'s alibi photo, Crumpet is not Crumpet. It is a pillow wearing a tiny hat with a bow.'],
    end:["Correct! You lean closer to the last photo. There is Crumpet, fast asleep in his basket. Very cute. Very still. TOO still. (+6 embers.)",
         "Because it is not Crumpet. It is a PILLOW. Wearing a tiny hat. Someone has propped it up with a very small, very neat bow. And a thread of blue stripe is hanging off its corner.",
         "{D} looks at the feathers, then at the pillow, then at Uncle Andy, who is suddenly very interested in the clouds. Uncle Andy: “Ah. That. I can explain. Possibly. Later.”",
         KNUT("Let us tidy up the evidence, detective. Grimble saw a small furry thing in a hat. The cows are innocent. The feathers are pillow stuffing. The photo is a pillow in a hat. And one very smart teaspoon is missing. Every clue points the same way, and none of them points at a goose."),
         "Just then, from the direction of the shore, comes a bark. A very small, very smug bark. Uncle Andy goes pale. {D} goes very still. Something small and quick, with a red bow, slips behind a hedge and is gone before anyone can blink.",
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
    stScene(pgs(p.look,D),p.btn,()=>stPuzzle(p.puz,()=>{
      stClue(...p.clue);c.step=i+1;saveState();stRefresh();stReadPages(pgs(p.win,D))}));
  }else{
    const finish=()=>{stClue(...p.clue);c.done=true;c.doneDays=S.days.length;S.embers+=6;saveState();hud();Audio_.fx('fanfare');stRefresh();stReadPages(pgs(p.end,D),()=>stRefresh())};
    if(p.puz){stScene(pgs(p.look,D),p.btn,()=>stPuzzle(p.puz,finish))}
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
    if(c&&c.done) btns.push({label:`Chapter ${ch.n}: ${ch.title} (finished)`,fn:()=>stReadPages(stFull(ch,stName()))});
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
