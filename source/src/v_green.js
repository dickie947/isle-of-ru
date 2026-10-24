/* ===== Village Green: a second part of home where the new buildings go ===== */
const GREEN_PLOTS={
 library:{x:9.5,y:10.2,sc:1,k:'build',w:3,tiles:[[8,8],[9,8],[10,8],[8,9],[9,9],[10,9]],spr:'library',ax:55,ay:124},
 workshop:{x:17,y:10.2,sc:1,k:'build',tiles:[[15,8],[16,8],[17,8],[15,9],[16,9],[17,9]],spr:'workshop',ax:60,ay:124},
 arena:{x:25.5,y:10.4,sc:1,k:'build',tiles:[[23,8],[24,8],[25,8],[26,8],[27,8],[23,9],[24,9],[25,9],[26,9],[27,9]],spr:'arena',ax:80,ay:96},
 bakery:{x:33.5,y:10.2,sc:1,k:'build',tiles:[[32,8],[33,8],[34,8],[32,9],[33,9],[34,9]],spr:'bakery',ax:55,ay:124},
 foodstore:{x:9.5,y:19.4,sc:1,k:'build',tiles:[[8,17],[9,17],[10,17],[8,18],[9,18],[10,18]],spr:'foodstore',ax:55,ay:114},
 bath:{x:27.5,y:19.4,sc:1,k:'build',tiles:[[26,18],[27,18],[28,18]],spr:'bath',ax:48,ay:76},
 coop:{x:35.5,y:19.2,sc:1,k:'build',tiles:[[34,17],[35,17],[36,17],[34,18],[35,18],[36,18]],spr:'coop',ax:55,ay:92}};
const GREEN_SPOTS={bench:[19.4,15.7],birdhouse:[25.2,12.6],flowercart:[23.6,15.7]};
const GREEN=Object.assign({id:'green',name:'Village Green',blurb:'The green is where the island keeps its workshops and shops.',welcome:'Welcome to the Village Green! New buildings you buy at the market are built on the plots here.',days:0,secure:0},
 mkIsle({id:'green',W:44,H:28,cx:22,cy:14,rx:19.8,ry:11.4,seed:21,wob:.18,pal:PAL_HOME,
  rocks:[[4.5,5.5,2.4],[40,22,2.6],[39,5,2]],ponds:[[15.5,21.2,2.6,1.5]],
  segs:[[22,22.5,22,13.5,1],[22,13.5,9,13.5,.8],[22,13.5,36,13.5,.8],[9.5,13.5,9.5,10.8,.7],[17,13.5,17,10.8,.7],[25.5,13.5,25.5,10.8,.7],[33.5,13.5,33.5,10.8,.7],[9.5,13.5,9.5,18.8,.7],[27.5,13.5,27.5,19.2,.7],[35.5,13.5,35.5,18.6,.7]],plaza:[22,13.5,3,2]}),
 {spawn:[22,21],clear:[[6,6,13,12],[13.5,6,20.5,12],[21,6,30,12],[30.5,6,37.5,12],[5.5,15.5,13,21],[24,16,31,21.5],[32.5,14.5,39,21],[18,12,27,17]],stones:[],
  build(){
    const plotOf=(id)=>{const p=GREEN_PLOTS[id],nm=(CATALOG.build.find(x=>x.id===id)||{}).name||id;addObj(SPR.plot,p.x,p.y,50,64,{sc:p.sc});block([[Math.floor(p.x),Math.floor(p.y-.3)]],null,'plot:'+id)};
    Object.keys(GREEN_PLOTS).forEach(id=>{const p=GREEN_PLOTS[id];
      if(built(id)){addObj(SPR[p.spr],p.x,p.y,p.ax,p.ay,{sc:p.sc,smoke:(id==='bakery'||id==='workshop')?[id==='bakery'?72:92,6]:null});block(p.tiles,null,id)}else plotOf(id)});
    if(built('coop')){[[33.6,20.6,0],[37.4,20.9,1],[34.8,21.7,2]].forEach(([x,y,v])=>addObj(SPR.hen[v],x,y,13,24,{}))}
    const cr=S.inv.crafted||[];
    if(cr.includes('bench')){addObj(SPR.bench,GREEN_SPOTS.bench[0],GREEN_SPOTS.bench[1],25,26,{});block([[Math.floor(GREEN_SPOTS.bench[0]),Math.floor(GREEN_SPOTS.bench[1]-.3)]],"A neat bench from the workshop. It is a good spot to sit and think.")}
    if(cr.includes('birdhouse')){addObj(SPR.birdhouse,GREEN_SPOTS.birdhouse[0],GREEN_SPOTS.birdhouse[1],18,64,{});block([[Math.floor(GREEN_SPOTS.birdhouse[0]),Math.floor(GREEN_SPOTS.birdhouse[1]-.3)]],"A birdhouse. Something small is chirping inside.")}
    if(cr.includes('flowercart')){addObj(SPR.flowercart,GREEN_SPOTS.flowercart[0],GREEN_SPOTS.flowercart[1],30,40,{});block([[Math.floor(GREEN_SPOTS.flowercart[0]),Math.floor(GREEN_SPOTS.flowercart[1]-.3)]],"A cart of flowers. The bees agree it was a good idea.")}
  }});
ISLES.unshift(GREEN);

function makeSprites4(){
  const gable=(c,x,y,w,a,b,rise=34)=>{c.fillStyle=lg(c,0,y-rise,0,y+4,[a,b]);c.beginPath();c.moveTo(x-8,y+3);c.lineTo(x+w/2,y-rise);c.lineTo(x+w+8,y+3);c.closePath();c.fill();c.strokeStyle='rgba(0,0,0,.22)';c.lineWidth=1;for(let k=1;k<4;k++){c.beginPath();c.moveTo(x-8+k*3,y+3-k*(rise/4.2));c.lineTo(x+w+8-k*3,y+3-k*(rise/4.2));c.stroke()}};
  const wall=(c,x,y,w,h,a,b)=>{c.fillStyle=lg(c,0,y,0,y+h,[a,b]);c.fillRect(x,y,w,h);c.strokeStyle='rgba(0,0,0,.14)';c.lineWidth=1;for(let k=1;k<h/10;k++){c.beginPath();c.moveTo(x,y+k*10);c.lineTo(x+w,y+k*10);c.stroke()}};
  const door=(c,x,y,col='#5a3a22')=>{c.fillStyle=col;c.beginPath();c.roundRect(x-9,y-26,18,26,[9,9,0,0]);c.fill();c.fillStyle='#e9c46a';c.beginPath();c.arc(x+4,y-12,1.4,0,6.3);c.fill()};
  const win=(c,x,y,w,h,col='#bfe0ee')=>{c.fillStyle='#4a3624';c.fillRect(x-2,y-2,w+4,h+4);c.fillStyle=col;c.fillRect(x,y,w,h);c.strokeStyle='#4a3624';c.lineWidth=1.4;c.beginPath();c.moveTo(x+w/2,y);c.lineTo(x+w/2,y+h);c.moveTo(x,y+h/2);c.lineTo(x+w,y+h/2);c.stroke()};
  SPR.library=mk(110,130,(c)=>{shadowBlob(c,55,122,48,8,.36);wall(c,18,62,74,60,'#d4c4a4','#a89878');gable(c,18,62,74,'#4f6f8f','#34506e',36);door(c,55,122,'#4a2f1b');
    [[28],[68]].forEach(([x])=>{c.fillStyle='#4a3624';c.beginPath();c.roundRect(x-2,76,16,30,[8,8,0,0]);c.fill();c.fillStyle='#bfe0ee';c.beginPath();c.roundRect(x,78,12,28,[6,6,0,0]);c.fill()});
    c.fillStyle='#f3e6c4';c.beginPath();c.roundRect(44,52,22,14,2);c.fill();c.strokeStyle='#6b4524';c.lineWidth=1.4;c.stroke();c.beginPath();c.moveTo(55,52);c.lineTo(55,66);c.stroke();
    c.fillStyle='#b8452c';c.fillRect(46,55,7,2);c.fillStyle='#3a6fc4';c.fillRect(57,55,7,2);
    [['#b8452c',96,116],['#3a6fc4',96,110],['#4f9a4a',97,104]].forEach(([col,x,y])=>{c.fillStyle=col;c.fillRect(x,y,12,6)})});
  SPR.bakery=mk(110,130,(c)=>{shadowBlob(c,55,122,48,8,.36);wall(c,18,62,74,60,'#f2e4c4','#d8c49c');gable(c,18,62,74,'#b5533a','#8f3a26',32);
    c.fillStyle='#8a8480';c.fillRect(66,22,12,30);c.fillStyle='#6b6560';c.fillRect(64,18,16,6);door(c,40,122,'#7a4a2a');
    win(c,58,78,26,22,'#ffe9b0');
    for(let k=0;k<6;k++){c.fillStyle=k%2?'#fff':'#d9342b';c.beginPath();c.moveTo(54+k*6,70);c.lineTo(60+k*6,70);c.lineTo(59+k*6,78);c.lineTo(55+k*6,78);c.closePath();c.fill()}
    c.fillStyle='#d9a45a';[[64,96],[72,96],[80,96]].forEach(([x,y])=>{c.beginPath();c.ellipse(x,y,5,3,0,0,6.3);c.fill()});
    c.fillStyle='#e8b86a';c.beginPath();c.ellipse(33,64,11,6,0,0,6.3);c.fill();c.strokeStyle='#a8742c';c.lineWidth=1;[[-4],[0],[4]].forEach(([d])=>{c.beginPath();c.moveTo(33+d-2,61);c.lineTo(33+d+1,67);c.stroke()})});
  SPR.foodstore=mk(110,120,(c)=>{shadowBlob(c,55,112,48,8,.36);wall(c,16,54,78,58,'#a8845a','#7a5a36');gable(c,16,54,78,'#6b4a2a','#4a3220',30);
    c.fillStyle='#2a1c12';c.fillRect(30,72,50,40);
    [[34,100],[48,100],[62,100]].forEach(([x,y])=>{c.fillStyle='#b58a52';c.fillRect(x,y,14,12);c.strokeStyle='#6b4a2a';c.lineWidth=1;c.strokeRect(x,y,14,12);c.fillStyle='#6db7d9';c.beginPath();c.ellipse(x+7,y,5,2.4,0,0,6.3);c.fill()});
    c.strokeStyle='#4a3624';c.lineWidth=2;c.beginPath();c.moveTo(34,76);c.lineTo(76,76);c.stroke();[[40],[54],[68]].forEach(([x])=>{c.fillStyle='#6db7d9';c.beginPath();c.ellipse(x,84,3.4,7,0,0,6.3);c.fill();c.beginPath();c.moveTo(x,90);c.lineTo(x-4,96);c.lineTo(x+4,96);c.closePath();c.fill()});
    c.fillStyle='#f3e6c4';c.beginPath();c.roundRect(40,56,30,12,2);c.fill();c.fillStyle='#6db7d9';c.beginPath();c.ellipse(55,62,8,3.6,0,0,6.3);c.fill();c.beginPath();c.moveTo(63,62);c.lineTo(68,58);c.lineTo(68,66);c.closePath();c.fill()});
  SPR.arena=mk(160,120,(c)=>{shadowBlob(c,80,98,70,12,.3);c.fillStyle=lg(c,0,50,0,100,['#ead6a4','#cdb27a']);c.beginPath();c.ellipse(80,76,68,26,0,0,6.3);c.fill();c.strokeStyle='#8a6a3a';c.lineWidth=2;c.stroke();
    c.strokeStyle='rgba(120,90,50,.35)';c.lineWidth=1.4;c.beginPath();c.ellipse(80,76,46,16,0,0,6.3);c.stroke();c.beginPath();c.ellipse(80,76,24,8,0,0,6.3);c.stroke();
    c.fillStyle='#7a5a36';for(let k=0;k<16;k++){const a=k/16*6.283,x=80+Math.cos(a)*68,y=76+Math.sin(a)*26;if(Math.sin(a)>-.2){c.fillRect(x-1.6,y-10,3.2,12)}}
    c.strokeStyle='#8a6a3a';c.lineWidth=2;c.beginPath();c.ellipse(80,66,68,26,0,.1,3.04);c.stroke();
    [[22,60,'#d9342b'],[138,60,'#3a6fc4'],[44,92,'#ffd36b'],[116,92,'#4f9a4a']].forEach(([x,y,col])=>{c.fillStyle='#6b4524';c.fillRect(x-1.4,y-34,2.8,38);c.fillStyle=col;c.beginPath();c.moveTo(x+1.4,y-34);c.lineTo(x+20,y-28);c.lineTo(x+1.4,y-20);c.closePath();c.fill()});
    c.fillStyle='#f3e6c4';c.beginPath();c.arc(80,48,13,0,6.3);c.fill();c.fillStyle='#d9342b';c.beginPath();c.arc(80,48,9,0,6.3);c.fill();c.fillStyle='#f3e6c4';c.beginPath();c.arc(80,48,5,0,6.3);c.fill();c.fillStyle='#d9342b';c.beginPath();c.arc(80,48,2,0,6.3);c.fill();c.fillStyle='#6b4524';c.fillRect(78.6,60,2.8,14)});
  SPR.bath=mk(96,84,(c)=>{shadowBlob(c,48,76,40,7,.34);c.fillStyle=lg(c,10,40,86,40,['#a07a48','#8a6638','#a07a48']);c.beginPath();c.roundRect(10,38,76,34,[6,6,12,12]);c.fill();
    c.strokeStyle='#4a3020';c.lineWidth=2.2;c.beginPath();c.moveTo(12,50);c.lineTo(84,50);c.moveTo(14,62);c.lineTo(82,62);c.stroke();
    c.fillStyle='#8fd0e8';c.beginPath();c.ellipse(48,38,38,10,0,0,6.3);c.fill();c.strokeStyle='#6b4524';c.lineWidth=2.2;c.stroke();
    c.fillStyle='rgba(255,255,255,.85)';[[28,34,6],[40,30,8],[56,32,7],[66,36,5],[48,36,5],[34,38,4]].forEach(([x,y,r])=>{c.beginPath();c.arc(x,y,r,0,6.3);c.fill()});
    c.fillStyle='#ffd23a';c.beginPath();c.ellipse(70,32,7,5,0,0,6.3);c.fill();c.beginPath();c.arc(75,27,3.6,0,6.3);c.fill();c.fillStyle='#e8751a';c.beginPath();c.moveTo(78,27);c.lineTo(83,28);c.lineTo(78,30);c.closePath();c.fill()});
  SPR.coop=mk(110,100,(c)=>{shadowBlob(c,55,92,46,7,.34);wall(c,24,44,62,44,'#c4543a','#9a3a26');gable(c,24,44,62,'#e0c068','#b89a40',28);
    c.fillStyle='#2a1c12';c.beginPath();c.roundRect(42,66,22,22,[11,11,0,0]);c.fill();c.fillStyle='#f3e6c4';c.fillRect(24,42,62,3);
    c.fillStyle='#e0c068';c.beginPath();c.moveTo(70,88);c.lineTo(96,88);c.lineTo(90,76);c.lineTo(70,76);c.closePath();c.fill();
    c.strokeStyle='#6b4524';c.lineWidth=2;for(let k=0;k<6;k++){c.beginPath();c.moveTo(74+k*3.6,88);c.lineTo(74+k*3.6,80);c.stroke()}
    c.fillStyle='#fff';c.beginPath();c.arc(55,56,4.6,0,6.3);c.fill();c.fillStyle='#2a1c12';c.beginPath();c.arc(55,56,3,0,6.3);c.fill();
    c.strokeStyle='#e8dcc0';c.lineWidth=2;c.beginPath();c.moveTo(6,90);c.lineTo(28,90);c.moveTo(6,82);c.lineTo(28,82);c.stroke();[[8],[18],[27]].forEach(([x])=>{c.beginPath();c.moveTo(x,92);c.lineTo(x,78);c.stroke()})});
  SPR.workshop=mk(120,130,(c)=>{shadowBlob(c,60,122,52,8,.36);wall(c,16,62,88,60,'#9a7a52','#6e5234');gable(c,16,62,88,'#56606c','#3a4450',34);
    c.fillStyle='#8a8480';c.fillRect(82,24,12,34);c.fillStyle='#6b6560';c.fillRect(80,20,16,6);
    c.fillStyle='#2a1c12';c.beginPath();c.roundRect(40,86,40,36,[3,3,0,0]);c.fill();c.fillStyle='#ffb050';c.beginPath();c.roundRect(44,92,32,30,[2,2,0,0]);c.fill();
    c.fillStyle='#4a3624';c.fillRect(30,100,10,3);c.fillRect(80,100,10,3);
    c.strokeStyle='#d9d9d9';c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(34,70);c.lineTo(46,82);c.stroke();c.strokeStyle='#8a5a30';c.beginPath();c.moveTo(48,68);c.lineTo(36,84);c.stroke();
    c.fillStyle='#c9a46e';[[88,112],[88,106],[90,100]].forEach(([x,y])=>c.fillRect(x,y,20,5));c.fillStyle='#8a5a30';c.fillRect(96,92,4,8)});
  SPR.hen=['#fff','#b8743a','#3a3230'].map((col,v)=>mk(26,26,(c)=>{shadowBlob(c,13,23,8,3,.3);c.fillStyle=col;c.beginPath();c.ellipse(12,15,8,6.4,0,0,6.3);c.fill();c.beginPath();c.moveTo(5,13);c.lineTo(1,8);c.lineTo(7,12);c.closePath();c.fill();c.beginPath();c.arc(18,9,4.4,0,6.3);c.fill();
    c.fillStyle='#d9342b';c.beginPath();c.arc(17,4.6,1.8,0,6.3);c.arc(19.6,5,1.6,0,6.3);c.fill();c.fillStyle='#f0a030';c.beginPath();c.moveTo(22,9);c.lineTo(26,10.4);c.lineTo(22,11.6);c.closePath();c.fill();c.fillStyle='#111';c.beginPath();c.arc(19.4,8.4,.9,0,6.3);c.fill();
    c.strokeStyle='#f0a030';c.lineWidth=1.2;c.beginPath();c.moveTo(11,20);c.lineTo(11,24);c.moveTo(15,20);c.lineTo(15,24);c.stroke();if(v===0){c.strokeStyle='rgba(0,0,0,.12)';c.beginPath();c.ellipse(12,15,8,6.4,0,0,6.3);c.stroke()}}));
  SPR.bench=mk(50,36,(c)=>{shadowBlob(c,25,32,20,4,.3);c.fillStyle='#8a5a30';c.fillRect(6,14,38,6);c.fillRect(6,6,38,5);c.fillStyle='#6b4524';c.fillRect(8,20,4,12);c.fillRect(38,20,4,12);c.fillRect(8,4,3,12);c.fillRect(39,4,3,12)});
  SPR.birdhouse=mk(36,72,(c)=>{shadowBlob(c,18,68,10,3,.3);c.fillStyle='#6b4524';c.fillRect(16,28,4,40);c.fillStyle='#d9a45a';c.fillRect(6,12,24,20);c.fillStyle='#b5533a';c.beginPath();c.moveTo(3,13);c.lineTo(18,0);c.lineTo(33,13);c.closePath();c.fill();c.fillStyle='#2a1c12';c.beginPath();c.arc(18,22,4,0,6.3);c.fill()});
  SPR.flowercart=mk(60,48,(c)=>{shadowBlob(c,30,44,24,4,.3);c.fillStyle='#8a5a30';c.beginPath();c.roundRect(8,18,44,16,3);c.fill();c.fillStyle='#6b4524';c.fillRect(14,34,3,6);c.fillRect(44,34,3,6);c.fillStyle='#3a2a1c';c.beginPath();c.arc(14,40,6,0,6.3);c.arc(46,40,6,0,6.3);c.fill();
    ['#ff8fb1','#ffd36b','#fff','#b58ae8','#ff7a5a','#ff8fb1','#ffd36b'].forEach((col,k)=>{c.strokeStyle='#3f7a3a';c.lineWidth=1.4;c.beginPath();c.moveTo(12+k*6,20);c.lineTo(12+k*6,12+(k%2)*3);c.stroke();c.fillStyle=col;c.beginPath();c.arc(12+k*6,11+(k%2)*3,3.4,0,6.3);c.fill()})});
}

/* ===== What each new building does ===== */
const HEN_NAMES=['Clover','Biscuit','Pepper']; /* placeholder names: swap for Ruan's real hens */
const LORE=[
 "Dragons keep their treasure in tens. Ten coins, ten gems, ten shiny pebbles. It makes counting very quick.",
 "The oldest dragon on record was 100. That is ten tens. Her birthday cake needed a lot of candles.",
 "A dragon's wings beat twice for every step it takes on the ground. Twice means doubling.",
 "Ember drakes sleep in pairs. 2, 4, 6, 8: you can count their eggs by hopping two at a time.",
 "Old rule from the scroll shelf: when adding, make a ten first. 8 + 5 is 8 + 2 + 3, which is 13.",
 "Frost wyrms collect snowflakes, but only the ones with six arms. Six, twelve, eighteen... count them in sixes.",
 "A dragon feast needs the right number of plates. Half as many plates as guests? Then guests must be even.",
 "Sand skimmers bury treasure in rows. Four rows of five is twenty. Rows make counting easy.",
 "The lantern keeper counts one star each night, then two, then three. By day ten there are fifty-five stars!",
 "Cinder wyverns hate odd socks. Pairs make even numbers. Even numbers are friends of two.",
 "A map-maker once measured the whole island in strides. It was 40 strides across. Ruan's would be fewer, with long legs.",
 "The last page is blank on purpose. It says: the best stories are the ones you add yourself."];
const dayB=()=>S.day.bld||(S.day.bld={});
function chain(title,n,pool,onDone){
  let step=0,right=0;
  const next=()=>{if(step>=n){onDone(right);return}
    const ok=shardQuestion(0,0,{q:wordProb(pick(pool)),title:`${title}: ${step+1} of ${n}`,bonus:0,intro:'Pick the answer. No rush.',ok:'Yes!',fail:'That is fine, keep going.',okLabel:'Next',skipLabel:'Not now',done:g=>{if(g)right++;step++;next()}});
    if(!ok)vtoast('Nothing to do here right now.',2000)};
  next()}
function poolFor(list){const f=feedKinds(),p=f.filter(k=>list.includes(k));return p.length?p:f}
function reward(e,item){S.embers+=e;if(item)S.inv[item]=(S.inv[item]||0)+1;saveState();Audio_.fx('fanfare');hud();
  for(let k=0;k<14;k++)parts.push({t:'spark',x:P.x*T+(Math.random()-.5)*26,y:P.y*T-24,vx:(Math.random()-.5)*80,vy:-30-Math.random()*60,age:0,life:1+Math.random()*.5})}
function needDragon(){if(!S.dragon||!hatched()){vsay('Your dragon is still in the egg. Come back after it hatches!');return true}return false}

function craftPuzzle(name,done){return shardQuestion(0,0,{q:wordProb(pick(poolFor(['double','group','add10','add20']))),title:'Measuring for the '+name.toLowerCase(),bonus:0,intro:'Work out the amount. Pick the answer.',ok:'Measured!',fail:'Close enough, it still fits.',okLabel:'Build it',skipLabel:'Later',done})}
function drill(){if(needDragon())return;const D=S.dragon.name;if(dayB().arena){vsay('Drill is done for today.');return}
  chain('Arena drill',3,poolFor(['add10','bonds','missing','add20','sub20','double']),()=>{dayB().arena=1;reward(4);vsay(`${D} charges round the arena and skids to a stop. (+4 embers.)`)})}
const BUILD_ACTS={
 bakery(){const n=dayB().bakery||0,D=S.dragon.name;
  if(n>=2){vsay("The oven is cooling. The baker says: no more orders today. Come back tomorrow for fresh buns!");return}
  vsay(n?"Another order has come in. Ready to bake?":"Welcome to the bakery! Orders come in and we bake the right number. Want to help?",[{label:'Bake',fn:()=>{
   const ok=shardQuestion(0,0,{q:wordProb(pick(poolFor(['double','group','add10','add20']))),title:`Bakery order ${n+1} of 2`,bonus:0,intro:'Work out how many to bake. Pick the answer.',ok:'Perfect batch!',fail:'The batch is baked anyway.',okLabel:'Collect',skipLabel:'Later',
    done:()=>{dayB().bakery=n+1;reward(2,'bun');vsay(`A warm honey bun comes out of the oven. (+2 embers, +1 bun.) ${D} would love it. Find it in the nest under Treats.`)}});
   if(!ok)vtoast('Nothing to bake right now.',2000)}},{label:'Not now'}])},
 coop(){const n=dayB().coop||0;
  if(n>=2){vsay(`${HEN_NAMES.join(', ')} have no more eggs today. They are very proud of themselves.`);return}
  vsay(`${HEN_NAMES[0]}, ${HEN_NAMES[1]} and ${HEN_NAMES[2]} are clucking. ${n?'There are more eggs in the straw.':'Are there eggs this morning?'}`,[{label:'Check the nests',fn:()=>{
   const ok=shardQuestion(0,0,{q:wordProb(pick(poolFor(['group','double','add10','add20']))),title:`Egg count ${n+1} of 2`,bonus:0,intro:'Count the eggs. Pick the answer.',ok:'All counted!',fail:'You collected them anyway.',okLabel:'Collect',skipLabel:'Later',
    done:()=>{dayB().coop=n+1;reward(2,'egg');vsay(`You gather a warm egg. (+2 embers, +1 egg.) ${pick(HEN_NAMES)} clucks as if she did it all herself.`)}});
   if(!ok)vtoast('No eggs right now.',2000)}},{label:'Not now'}])},
 bath(){if(needDragon())return;const D=S.dragon.name;
  if(dayB().bath){vsay(`${D} is sparkling clean and smells of soap. One bath a day is plenty!`);return}
  vsay(`Bath time! ${D} loves bubbles. Count out the right amounts of soap and water.`,[{label:'Start',fn:()=>chain('Bath time',3,poolFor(['add10','bonds','missing','add20']),()=>{dayB().bath=1;reward(4);vsay(`${D} splashes about, sneezes a bubble and shines like new. (+4 embers.)`)})},{label:'Not now'}])},
 foodstore(){shopTab='treats';openShop()},
 arena(){openArena()},
 workshop(){openWorkshop()},
 library(){const L=S.lib=S.lib||{read:0};
  const shelf=()=>vsay(`${L.read} of ${LORE.length} pages read. `+(L.read?'Last page: '+LORE[(L.read-1)%LORE.length]:'The shelf is waiting for you.'));
  if(dayB().library){shelf();return}
  vsay('The library smells of old paper. Today there is a new page on the shelf. Read it?',[{label:'Read',fn:()=>chain('Story puzzle',2,poolFor(['twostep','add20','sub20','missing','bonds']),()=>{
    dayB().library=1;const page=LORE[L.read%LORE.length];L.read++;reward(3);vsay(`Page ${L.read}: ${page} (+3 embers.)`)})},{label:'Not now'}])}
};
