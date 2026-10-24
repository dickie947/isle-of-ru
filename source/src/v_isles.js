/* ===== Other islands: three small worlds you can fly to once your facts are growing ===== */
const PAL_SNOW={seaA:[120,190,214],seaB:[26,74,118],sand:[208,224,236],gA:[226,236,246],gB:[244,248,252],gdk:.1,rock:[104,116,132],path:[176,190,208],pondA:[170,222,240],pondB:[96,160,200],tuft:['rgba(120,150,190,.5)','rgba(255,255,255,.7)'],flowers:null};
const PAL_BEACH={seaA:[84,226,212],seaB:[16,118,160],sand:[242,224,172],gA:[240,206,128],gB:[252,226,154],gdk:.12,rock:[168,150,120],path:[222,186,116],pondA:[96,214,206],pondB:[40,150,176],tuft:['rgba(120,150,60,.5)','rgba(190,170,100,.55)'],flowers:['#ff8fb1','#ffd36b','#ffffff','#ff9d5c']};
const PAL_LAVA={seaA:[70,130,150],seaB:[16,44,66],sand:[74,68,70],gA:[84,78,78],gB:[108,98,94],gdk:.2,rock:[70,50,48],path:[132,112,100],pondA:[255,176,60],pondB:[214,70,22],tuft:['rgba(60,54,54,.6)','rgba(130,116,108,.6)'],flowers:null};

const ISLES=[
 {id:'snow',name:'Snowcap Isle',blurb:'A quiet island of snow, pines and an old Number Stone.',days:3,secure:0,
  ...mkIsle({id:'snow',W:34,H:24,cx:17,cy:12.2,rx:14.6,ry:9.6,seed:5,wob:.2,pal:PAL_SNOW,
    rocks:[[9,2.6,3.6],[16,1.6,4.2],[24,3,3.8]],ponds:[[24.8,15.2,2.8,1.8]],
    segs:[[17,19,17,12.6,.9],[17,13,9.5,14.2,.8],[17,13,26.5,10.8,.8],[26.5,10.8,28.5,8.2,.7],[9.5,14.2,7.4,10.4,.7]],plaza:[17,12.8,2.6,1.8]}),
  spawn:[17,18],pine:'snowpine',bush:'snowbush',rockSpr:'snowrock',
  clear:[[14.5,16.5,19.5,20],[7,8.5,11.5,15.5],[15,8,19,11.5],[24.5,7,29,12.5],[19.5,13.5,23.5,16.5]],
  chest:{x:28.6,y:11.2,embers:40,needs:'fire',lock:'The chest is frozen solid. A dragon with fire breath could melt the ice. Sigrun the dragon teacher can show yours how.',item:'frostcloak',text:'Inside the chest is a shimmering Frost Cloak and a handful of embers!'},
  stones:[[17,9.6,"The Number Stone hums. 'Every number has a partner that makes ten. 7 and 3. 6 and 4. 8 and 2. Find the partner.'"],[26.8,8.8,"The stone glows blue. 'To add 9 + 5, make ten first. Take 1 from the 5 to make 10. Then add the 4 that is left. That is 14.'"]],
  build(){addObj(SPR.igloo,9.3,13.4,70,86,{sc:.8});block([[8,12],[9,12],[10,12],[8,13],[9,13],[10,13]],"A cosy igloo. Someone has left a little lamp inside.");
    addObj(SPR.snowman,21.2,15.1,24,60,{});block([[21,14]],"A snowman with a carrot nose and a scarf. He seems pleased to meet you.");
    addObj(SPR.crystal,12,6.8,36,64,{glow:[36,40],glowCol:'140,210,255'});block([[11,6],[12,6]],"Ice crystals ring softly when you tap them.");}},
 {id:'beach',name:'Sunstone Cove',blurb:'Warm sand, palm trees and a golden Sunstone.',days:8,secure:10,
  ...mkIsle({id:'beach',W:36,H:24,cx:18,cy:12.2,rx:15.6,ry:9.4,seed:9,wob:.24,pal:PAL_BEACH,
    rocks:[[28.5,3.2,3.2],[5.5,18,2.8]],ponds:[[10,15,2.6,1.6]],
    segs:[[18,19.2,18,12.6,.9],[18,13,9,12.2,.8],[18,13,28,13.4,.8],[9,12.2,7.6,8.8,.7],[28,13.4,30,9,.7]],plaza:[18,12.8,2.6,1.8]}),
  spawn:[18,18],pine:'palm',bush:'bush',rockSpr:'sandrock',
  clear:[[15,16.5,21,20],[5.5,7,10.5,13.5],[14.5,8,21.5,11.5],[26,7,32,12],[24,14,31,18]],
  chest:{x:30.4,y:15.6,embers:60,needs:'dig',lock:'You can see the corner of a chest in the sand, but it is buried deep. A dragon that can dig could uncover it.',item:'sunhat',text:'You dig in the warm sand and find a chest! Inside: a big straw Sun Hat and some embers.'},
  stones:[[18,9.4,"The Sunstone glows gold. 'Doubles are easy friends. 6 + 6 = 12, so 6 + 7 is just one more: 13.'"],[9.4,10.2,"A carved note: 'To take away, count up. 13 − 9? Start at 9, hop to 10, then 3 more. The answer is 4.'"]],
  build(){addObj(SPR.beachhut,7.2,9.2,70,92,{sc:.8});block([[6,7],[7,7],[8,7],[6,8],[7,8],[8,8]],"A thatched beach hut. A hammock swings inside.");
    addObj(SPR.boat,24.4,16.8,50,42,{});block([[23,16],[24,16]],"A little rowing boat, pulled up on the sand.");}},
 {id:'lava',name:'Cinder Peak',blurb:'Black sand, glowing vents and an ancient forge.',days:15,secure:25,
  ...mkIsle({id:'lava',W:34,H:26,cx:17,cy:13.2,rx:14.4,ry:10.4,seed:13,wob:.22,pal:PAL_LAVA,
    rocks:[[17,3,4.4],[7,8,3],[27.5,9,3.2]],ponds:[[24.5,16.6,2.4,1.6],[8.6,17.4,2,1.3]],
    segs:[[17,20.5,17,13.6,.9],[17,14,9.5,13.6,.8],[17,14,25.6,12.4,.8],[25.6,12.4,28,16,.7],[9.5,13.6,10.4,9.6,.7]],plaza:[17,14,2.6,1.8]}),
  spawn:[17,19],pine:'ashtree',bush:'lavabush',rockSpr:'lavarock',
  clear:[[14.5,17.5,19.5,22],[8,9.5,13,15.5],[14.5,10,19.5,13.5],[22.5,10,28.5,14.5]],
  chest:{x:29.2,y:15.4,embers:90,needs:'speed',lock:'The chest sits on a ledge across the lava, too far to reach before the heat gets you. Swift wings could make it.',item:'embercrown',text:'The chest is warm to touch. Inside: a glowing Ember Crown and a pile of embers!'},
  stones:[[17,11.2,"The Stone glows orange. 'To take away 15 − 7, go back to ten first. 15 − 5 = 10. Then take 2 more. The answer is 8.'"],[26.2,10.4,"Old words: 'Use a fact you know to find one you do not. If you know 8 + 8 = 16, then 8 + 9 is one more: 17.'"]],
  build(){addObj(SPR.forge,11.4,12.2,95,148,{sc:.8,smoke:[130,6]});block([[9,10],[10,10],[11,10],[12,10],[9,11],[10,11],[11,11],[12,11]],"An ancient forge, cold and quiet. Dragons must have made things here long ago.");
    [[22,18.6],[14.2,6.6],[25.5,6.4]].forEach(([x,y])=>{addObj(SPR.vent,x,y,36,40,{glow:[36,26],glowCol:'255,120,40'});block([[Math.floor(x),Math.floor(y-.3)]],"A glowing vent. It is warm, so stay back.")})}},
];
const isleById=id=>id==='home'?HOME:ISLES.find(z=>z.id===id);
function isleStatus(z){
  const days=(S.days||[]).length,sec=ALL_ITEMS.filter(it=>isSecure(it.id)).length;
  const needs=[];if(days<z.days)needs.push(`${z.days-days} more practice day${z.days-days===1?'':'s'}`);if(sec<z.secure)needs.push(`${z.secure-sec} more secure fact${z.secure-sec===1?'':'s'}`);
  return {ok:!needs.length||S.settings.exploreAny,need:needs.join(' and ')};
}
function zoneState(id){S.zones=S.zones||{};return S.zones[id]||(S.zones[id]={visited:false,chest:false})}

/* ---- the island's own objects ---- */
function buildIsle(){
  const z=Z;
  addObj(SPR.pad,z.spawn[0]+.5,z.spawn[1]+1.1,40,22,{under:true});
  addObj(SPR.sign,z.spawn[0]-1.6,z.spawn[1]+.6,30,64,{});block([[Math.floor(z.spawn[0]-1.6),Math.floor(z.spawn[1]+.3)]],`${z.name}. Tap the Map button to fly somewhere else.`);
  (z.stones||[]).forEach(([x,y,t],k)=>{addObj(SPR.stone[z.id==='beach'?1:z.id==='lava'?2:0],x,y,26,70,{glow:[26,44],glowCol:z.id==='lava'?'255,150,70':z.id==='beach'?'255,220,110':'150,200,255'});block([[Math.floor(x),Math.floor(y-.3)]],t)});
  if(z.chest){const ch=zoneState(z.id).chest;
  addObj(ch?SPR.chestOpen:SPR.chest,z.chest.x,z.chest.y,26,40,{});block([[Math.floor(z.chest.x),Math.floor(z.chest.y-.3)]],null,'chest');}
  z.build();
}
function openChest(){
  const z=Z,zs=zoneState(z.id);
  if(zs.chest){vsay('The chest is empty now. You already found what was inside.');return}
  if(z.chest.needs&&!skillOwned(S.dragon,z.chest.needs)){vsay(z.chest.lock);return}
  zs.chest=true;S.embers+=z.chest.embers;
  S.inv.closet=S.inv.closet||[];if(!S.inv.closet.includes(z.chest.item))S.inv.closet.push(z.chest.item);
  Audio_.fx('fanfare');saveState();buildObjects();hud();
  for(let k=0;k<22;k++)parts.push({t:'spark',x:z.chest.x*T+(Math.random()-.5)*30,y:z.chest.y*T-20,vx:(Math.random()-.5)*80,vy:-30-Math.random()*60,age:0,life:1+Math.random()*.6});
  vsay(`${z.chest.text} (+${z.chest.embers} embers.) You can wear it from the Clothes Shop.`);
}

/* ---- painted sprites for the islands ---- */
/* ---- Millie the cat (dark brown with white paws; coat colours are easy to change) ---- */
const MILLIE_COAT={base:'#4a3326',dark:'#2c1d14',belly:'#5a4030',ear:'#c98a8a',eye:'#e6c04a',paw:'#f4efe6'};
function drawCat(c,pose,prop,K){
  shadowBlob(c,32,60,22,5,.3);
  const stuck=pose==='stuck';
  if(prop==='log'){c.fillStyle='#8a5a30';c.beginPath();c.roundRect(6,52,52,10,5);c.fill();c.fillStyle='#b07c42';c.beginPath();c.ellipse(9,57,3,5,0,0,6.3);c.fill()}
  c.strokeStyle=K.base;c.lineWidth=5.5;c.lineCap='round';c.beginPath();c.moveTo(43,50);c.quadraticCurveTo(60,48,55,32);c.stroke();
  c.strokeStyle=K.dark;c.lineWidth=2;[[55,36],[57,42],[51,47]].forEach(([x,y])=>{c.beginPath();c.moveTo(x-3,y);c.lineTo(x+3,y);c.stroke()});
  c.fillStyle=K.base;c.beginPath();c.ellipse(31,47,14,12,0,0,6.3);c.fill();
  c.strokeStyle=K.dark;c.lineWidth=2;[[20,42],[19,48],[42,42],[43,48]].forEach(([x,y])=>{c.beginPath();c.moveTo(x,y);c.lineTo(x+(x<30?4:-4),y+2);c.stroke()});
  c.fillStyle=K.belly;c.beginPath();c.ellipse(31,52,7,6,0,0,6.3);c.fill();
  c.fillStyle=K.paw||K.base;c.beginPath();c.ellipse(24,58,5,3.2,0,0,6.3);c.ellipse(38,58,5,3.2,0,0,6.3);c.fill();
  c.fillStyle=K.base;c.beginPath();c.arc(31,29,11,0,6.3);c.fill();
  [[-1],[1]].forEach(([m])=>{c.fillStyle=K.base;c.beginPath();c.moveTo(31+m*10.5,24);c.lineTo(31+m*10,10);c.lineTo(31+m*2,19);c.closePath();c.fill();c.fillStyle=K.ear;c.beginPath();c.moveTo(31+m*9,22);c.lineTo(31+m*8.6,13.5);c.lineTo(31+m*3.4,19.5);c.closePath();c.fill()});
  c.strokeStyle=K.dark;c.lineWidth=1.6;[[-3],[0],[3]].forEach(([x])=>{c.beginPath();c.moveTo(31+x,19);c.lineTo(31+x,23.5);c.stroke()});
  if(stuck){[[-4.6],[4.6]].forEach(([x])=>{c.fillStyle='#fff';c.beginPath();c.ellipse(31+x,29,3.6,4.4,0,0,6.3);c.fill();c.fillStyle=K.eye;c.beginPath();c.arc(31+x,29.6,2.4,0,6.3);c.fill();c.fillStyle='#1d1d22';c.beginPath();c.arc(31+x,29.6,1.2,0,6.3);c.fill()});
    c.fillStyle='#4a2a2a';c.beginPath();c.ellipse(31,36,1.8,2.4,0,0,6.3);c.fill();
    c.fillStyle='#6fc3ee';c.beginPath();c.moveTo(43,20);c.quadraticCurveTo(46,25,43,27);c.quadraticCurveTo(40,25,43,20);c.fill();
    c.fillStyle='#e4572e';c.font='bold 16px sans-serif';c.fillText('!',47,16)}
  else{c.strokeStyle='#2a2a30';c.lineWidth=1.8;c.lineCap='round';[[-4.6],[4.6]].forEach(([x])=>{c.beginPath();c.arc(31+x,30,2.6,3.6,5.8);c.stroke()});
    c.strokeStyle='#8a4a4a';c.lineWidth=1.3;c.beginPath();c.arc(29.2,35,1.8,0.2,2.6);c.arc(32.8,35,1.8,0.5,2.9);c.stroke()}
  c.fillStyle='#e58a95';c.beginPath();c.moveTo(29.4,33);c.lineTo(32.6,33);c.lineTo(31,35);c.closePath();c.fill();
  c.strokeStyle='rgba(250,250,250,.75)';c.lineWidth=.9;[[-1],[1]].forEach(([m])=>{[[33,-3],[35,1]].forEach(([y,dy])=>{c.beginPath();c.moveTo(31+m*6,y);c.lineTo(31+m*15,y+dy);c.stroke()})});
  if(prop==='barrel'){c.fillStyle=lg(c,12,0,50,0,['#9a6a3a','#b9844a','#8a5a30']);c.beginPath();c.roundRect(12,40,40,22,[4,4,6,6]);c.fill();c.strokeStyle='#4a3020';c.lineWidth=2;[[46],[56]].forEach(([y])=>{c.beginPath();c.moveTo(12,y);c.lineTo(52,y);c.stroke()});
    c.fillStyle=K.paw||K.belly;c.beginPath();c.ellipse(24,41,4.6,3,0,0,6.3);c.ellipse(38,41,4.6,3,0,0,6.3);c.fill()}
  if(prop==='net'){c.strokeStyle='rgba(120,98,60,.95)';c.lineWidth=1.1;for(let k=-6;k<12;k++){c.beginPath();c.moveTo(8+k*6,16);c.lineTo(32+k*6,62);c.moveTo(56-k*6+0,16);c.lineTo(32-k*6,62);c.stroke()}
    c.beginPath();c.ellipse(31,40,26,25,0,0,6.3);c.stroke()}
}
function makeSprites3(){
  SPR.xtree=mk(70,110,(c)=>{shadowBlob(c,35,102,26,6,.35);c.fillStyle='#6b4524';c.fillRect(31,92,8,12);[[12,52,20],[28,72,26],[44,92,32]].forEach(([ap,bs,hw],k)=>{c.fillStyle=k%2?'#2f7d4f':'#276b44';c.beginPath();c.moveTo(35,ap);c.lineTo(35+hw,bs);c.lineTo(35-hw,bs);c.closePath();c.fill()});
    [[30,48,'#ff5a5a'],[42,62,'#ffd36b'],[26,70,'#6fc3ee'],[46,80,'#ff8fb1'],[34,30,'#ffd36b'],[24,86,'#ff5a5a'],[38,88,'#6fc3ee']].forEach(([x,y,col])=>{c.fillStyle=col;c.beginPath();c.arc(x,y,2.6,0,6.3);c.fill()});
    c.fillStyle='#ffd36b';c.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,r=(k%2?3:7);c.lineTo(35+Math.cos(a)*r,8+Math.sin(a)*r)}c.closePath();c.fill()});
  SPR.mound=mk(40,28,(c)=>{shadowBlob(c,20,22,14,4,.3);c.fillStyle=lg(c,0,6,0,24,['#9a6a3a','#6e4a28']);c.beginPath();c.ellipse(20,17,13,8,0,0,6.3);c.fill();c.strokeStyle='#e4572e';c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(15,13);c.lineTo(25,20);c.moveTo(25,13);c.lineTo(15,20);c.stroke()});
  SPR.excl=mk(20,26,(c)=>{c.fillStyle='#ffd36b';c.strokeStyle='#8a5a10';c.lineWidth=1.6;c.beginPath();c.arc(10,10,8,0,6.3);c.fill();c.stroke();c.fillStyle='#6b3a08';c.font='bold 13px sans-serif';c.textAlign='center';c.fillText('!',10,15)});
  SPR.vill={};VILLAGERS.forEach(v=>{SPR.vill[v.id]=mk(50,76,(c)=>{shadowBlob(c,25,66,15,4,.3);c.translate(25,64);c.scale(1.3,1.3);drawKid(c,'d',0,false,{hero:{name:v.name,look:Object.assign({},v.look,{build:v.look.build}),wear:v.look.wear||{}}})})});
  SPR.millie={};['barrel','net','log'].forEach(p=>{SPR.millie[p]=mk(64,66,(c)=>drawCat(c,'stuck',p,MILLIE_COAT))});SPR.millie.free=mk(64,66,(c)=>drawCat(c,'free',null,MILLIE_COAT));
  const pineLike=(cols,snow)=>[0,1,2].map(v=>mk(70,104,(c)=>{
    const cc=cols[v%cols.length];shadowBlob(c,38,96,26,9,.38);
    c.fillStyle=lg(c,30,0,40,0,['#7b5634','#5a3b22']);c.fillRect(31,76,9,22);
    [[80,34,26,22],[60,31,23,22],[40,28,20,22],[20,24,16,22]].forEach((t,i)=>{const by=t[0]+14,half=t[2]+6-i*1.5;
      c.fillStyle=lg(c,35-half,0,35+half,0,[cc[2],cc[1],cc[0]]);c.beginPath();c.moveTo(35,by-t[3]-14);c.lineTo(35+half,by);c.quadraticCurveTo(35,by+6,35-half,by);c.closePath();c.fill();
      if(snow){c.fillStyle='#f4f8fc';c.beginPath();c.moveTo(35,by-t[3]-14);c.lineTo(35+half*.72,by-t[3]*.28-4);c.quadraticCurveTo(35+half*.3,by-t[3]*.5,35,by-t[3]*.24-2);c.quadraticCurveTo(35-half*.3,by-t[3]*.5,35-half*.72,by-t[3]*.28-4);c.closePath();c.fill();
        c.fillStyle='rgba(150,180,215,.45)';c.beginPath();c.ellipse(35+half*.3,by-6,half*.3,2.2,0,0,6.3);c.fill()}})}));
  SPR.snowpine=pineLike([['#2c5a47','#3b7258','#4f8c6a'],['#27504a','#356b5e','#4a8574'],['#31604c','#427a5c','#5a9772']],true);
  SPR.snowbush=mk(46,34,(c)=>{shadowBlob(c,23,29,18,6,.3);[[14,20,11],[26,18,12],[20,13,10]].forEach(([x,y,r])=>{const g=c.createRadialGradient(x-3,y-4,2,x,y,r);g.addColorStop(0,'#eef4fa');g.addColorStop(1,'#a8bcd2');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,6.3);c.fill()});c.fillStyle='#d9534f';[[12,15],[22,10],[28,18]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,1.5,0,6.3);c.fill()})});
  SPR.snowrock=mk(46,34,(c)=>{shadowBlob(c,23,29,19,6,.35);c.fillStyle=lg(c,8,8,38,30,['#a8b4c4','#74828f','#566270']);c.beginPath();c.moveTo(6,28);c.quadraticCurveTo(4,12,16,8);c.quadraticCurveTo(28,4,38,14);c.quadraticCurveTo(44,24,38,29);c.closePath();c.fill();
    c.fillStyle='#f4f8fc';c.beginPath();c.moveTo(8,18);c.quadraticCurveTo(10,10,18,8);c.quadraticCurveTo(28,5,36,13);c.quadraticCurveTo(28,14,22,12);c.quadraticCurveTo(14,16,8,18);c.fill()});
  SPR.sandrock=mk(46,34,(c)=>{shadowBlob(c,23,29,19,6,.3);c.fillStyle=lg(c,8,8,38,30,['#d9c79c','#b49f72','#8f7c55']);c.beginPath();c.moveTo(6,28);c.quadraticCurveTo(4,12,16,8);c.quadraticCurveTo(28,4,38,14);c.quadraticCurveTo(44,24,38,29);c.closePath();c.fill();c.strokeStyle='rgba(255,255,255,.3)';c.lineWidth=1.3;c.beginPath();c.moveTo(12,14);c.quadraticCurveTo(22,8,32,14);c.stroke()});
  SPR.lavarock=mk(46,34,(c)=>{shadowBlob(c,23,29,19,6,.4);c.fillStyle=lg(c,8,8,38,30,['#58484a','#3a2e30','#241c1e']);c.beginPath();c.moveTo(6,28);c.quadraticCurveTo(4,12,16,8);c.quadraticCurveTo(28,4,38,14);c.quadraticCurveTo(44,24,38,29);c.closePath();c.fill();
    c.strokeStyle='#ff9d3c';c.lineWidth=1.6;c.beginPath();c.moveTo(14,26);c.lineTo(18,18);c.lineTo(24,20);c.lineTo(28,12);c.stroke();c.strokeStyle='rgba(255,220,140,.6)';c.lineWidth=.7;c.stroke()});
  SPR.lavabush=mk(40,30,(c)=>{shadowBlob(c,20,26,15,5,.3);c.strokeStyle='#3a2e30';c.lineWidth=2.2;c.lineCap='round';[[20,26,10,10],[20,26,20,6],[20,26,31,12],[16,18,8,20]].forEach(([x,y,ex,ey])=>{c.beginPath();c.moveTo(x,y);c.quadraticCurveTo((x+ex)/2,(y+ey)/2-4,ex,ey);c.stroke()});c.fillStyle='#ff8a3d';[[10,10],[20,6],[31,12]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,1.8,0,6.3);c.fill()})});
  SPR.ashtree=[0,1,2].map(v=>mk(64,100,(c)=>{shadowBlob(c,34,92,22,8,.4);c.strokeStyle='#2f2528';c.lineCap='round';c.lineWidth=7;c.beginPath();c.moveTo(34,92);c.quadraticCurveTo(30+v*3,60,34,34);c.stroke();
    c.lineWidth=3.4;[[34,64,14,42],[33,54,52,34],[34,42,18,22],[34,38,48,18],[34,34,32,10]].forEach(([x,y,ex,ey],i)=>{if(v===1&&i===3)return;c.beginPath();c.moveTo(x,y);c.quadraticCurveTo((x+ex)/2,(y+ey)/2-6,ex,ey);c.stroke();c.fillStyle='#ff8a3d';c.beginPath();c.arc(ex,ey,2,0,6.3);c.fill()})}));
  SPR.palm=[0,1].map(v=>mk(80,112,(c)=>{shadowBlob(c,40,104,24,8,.34);
    c.strokeStyle='#8a6a3a';c.lineWidth=7;c.lineCap='round';c.beginPath();c.moveTo(38,104);c.quadraticCurveTo(46+v*-8,70,40+v*8,34);c.stroke();
    c.strokeStyle='#6b5028';c.lineWidth=1.4;for(let k=0;k<7;k++){const t=k/7,x=38+(2+v*8-8*v*0)*t*3+(1-t)*0,y=104-70*t;c.beginPath();c.moveTo(x-4,y);c.lineTo(x+4,y-2);c.stroke()}
    const tx=40+v*8,ty=34;
    [[-34,6],[-26,-10],[-8,-18],[16,-16],[30,-4],[34,12],[-30,18]].forEach(([dx,dy],i)=>{c.fillStyle=i%2?'#3f9a4a':'#4fb057';c.beginPath();c.moveTo(tx,ty);c.quadraticCurveTo(tx+dx*.5,ty+dy-12,tx+dx,ty+dy+(dy>5?10:0));c.quadraticCurveTo(tx+dx*.5,ty+dy-2,tx,ty+3);c.fill()});
    c.fillStyle='#6b4a22';[[-3,4],[3,5]].forEach(([dx,dy])=>{c.beginPath();c.arc(tx+dx,ty+dy,3.2,0,6.3);c.fill()})}));
  SPR.stone=['#8aa0b8','#d9b45a','#6a5558'].map((col,k)=>mk(54,92,(c)=>{shadowBlob(c,27,86,22,7,.4);
    c.fillStyle=lg(c,10,0,44,0,k===1?['#e8d2a0','#c0a068','#9a8050']:k===2?['#6e5a5c','#4a3a3c','#2e2426']:['#aeb9c6','#808d9c','#5a6674']);
    c.beginPath();c.moveTo(10,86);c.lineTo(8,24);c.quadraticCurveTo(27,2,46,24);c.lineTo(44,86);c.closePath();c.fill();
    c.strokeStyle=col;c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.arc(27,40,8,0,6.3);c.moveTo(27,32);c.lineTo(27,56);c.moveTo(19,48);c.lineTo(35,48);c.stroke();
    c.fillStyle=k===2?'rgba(255,140,60,.5)':k===1?'rgba(255,230,150,.5)':'rgba(180,220,255,.5)';c.beginPath();c.arc(27,40,5,0,6.3);c.fill()}));
  const chest=(open)=>mk(52,46,(c)=>{shadowBlob(c,26,42,20,6,.35);
    c.fillStyle=lg(c,0,20,0,42,['#9a6a38','#6b4524']);c.fillRect(8,22,36,20);
    if(open){c.fillStyle='#ffe28a';c.beginPath();c.ellipse(26,22,15,5,0,0,6.3);c.fill();const g=c.createRadialGradient(26,20,2,26,16,26);g.addColorStop(0,'rgba(255,240,170,.8)');g.addColorStop(1,'rgba(255,240,170,0)');c.fillStyle=g;c.fillRect(0,-8,52,40);
      c.fillStyle='#8a5a30';c.beginPath();c.moveTo(8,20);c.lineTo(10,4);c.lineTo(42,4);c.lineTo(44,20);c.closePath();c.fill()}
    else{c.fillStyle=lg(c,0,8,0,24,['#b07a42','#8a5a30']);c.beginPath();c.moveTo(8,22);c.quadraticCurveTo(8,6,26,6);c.quadraticCurveTo(44,6,44,22);c.closePath();c.fill()}
    c.fillStyle='#e9c46a';c.fillRect(8,22,36,3);c.fillRect(22,open?22:12,8,open?10:14);c.fillStyle='#4a3020';c.fillRect(24,open?24:20,4,5)});
  SPR.chest=chest(false);SPR.chestOpen=chest(true);
  SPR.crystal=mk(72,80,(c)=>{shadowBlob(c,36,72,28,7,.3);
    [[26,66,12,48,'#9ad8ff'],[42,68,10,56,'#7cc4f0'],[34,70,14,36,'#c4ecff'],[52,66,8,30,'#8dd0f5'],[16,66,8,26,'#a8dcff']].forEach(([x,y,w,h,col])=>{c.fillStyle=col;c.beginPath();c.moveTo(x-w/2,y);c.lineTo(x-w/3,y-h*.8);c.lineTo(x,y-h);c.lineTo(x+w/3,y-h*.8);c.lineTo(x+w/2,y);c.closePath();c.fill();c.fillStyle='rgba(255,255,255,.55)';c.beginPath();c.moveTo(x,y-h);c.lineTo(x+w/3,y-h*.8);c.lineTo(x,y-h*.2);c.closePath();c.fill()})});
  SPR.igloo=mk(130,100,(c)=>{shadowBlob(c,65,92,56,9,.32);
    c.fillStyle=lg(c,10,10,120,92,['#fafdff','#cfe0ee','#a9c0d6']);c.beginPath();c.moveTo(8,90);c.quadraticCurveTo(8,10,65,8);c.quadraticCurveTo(122,10,122,90);c.closePath();c.fill();
    c.strokeStyle='rgba(120,150,185,.5)';c.lineWidth=1.4;for(let r=0;r<5;r++){const y=24+r*13;c.beginPath();c.moveTo(14+r*2,y);c.lineTo(116-r*2,y);c.stroke();for(let x=18+(r%2)*10;x<114;x+=20){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+13);c.stroke()}}
    c.fillStyle='#31465c';c.beginPath();c.moveTo(46,90);c.lineTo(46,66);c.quadraticCurveTo(65,48,84,66);c.lineTo(84,90);c.fill();c.fillStyle='rgba(255,210,120,.6)';c.beginPath();c.moveTo(54,90);c.lineTo(54,70);c.quadraticCurveTo(65,60,76,70);c.lineTo(76,90);c.fill()});
  SPR.snowman=mk(48,66,(c)=>{shadowBlob(c,24,60,16,5,.3);[[24,48,13],[24,31,10],[24,17,8]].forEach(([x,y,r])=>{const g=c.createRadialGradient(x-3,y-4,2,x,y,r);g.addColorStop(0,'#fff');g.addColorStop(1,'#b9cde0');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,6.3);c.fill()});
    c.fillStyle='#222';[[21,15],[27,15],[24,31],[24,38]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,1.2,0,6.3);c.fill()});c.fillStyle='#ff8a3d';c.beginPath();c.moveTo(24,18);c.lineTo(35,20);c.lineTo(24,21);c.fill();
    c.fillStyle='#d34a4a';c.fillRect(15,23,18,4);c.fillRect(28,25,4,12);c.strokeStyle='#6b4524';c.lineWidth=2;c.beginPath();c.moveTo(12,32);c.lineTo(2,24);c.moveTo(36,32);c.lineTo(46,26);c.stroke()});
  SPR.beachhut=mk(140,120,(c)=>{shadowBlob(c,70,112,58,9,.32);
    c.fillStyle='#6b4a28';[26,52,88,114].forEach(x=>c.fillRect(x,80,6,32));
    c.fillStyle=lg(c,0,60,0,100,['#d9b87a','#b8935a']);c.fillRect(24,60,96,40);c.fillStyle='rgba(80,50,20,.3)';for(let x=24;x<120;x+=8)c.fillRect(x,60,1,40);
    c.fillStyle='#2a1c10';c.fillRect(60,66,26,34);c.fillStyle='#4fa8b8';c.fillRect(32,70,18,16);c.fillRect(96,70,18,16);
    c.fillStyle=lg(c,0,12,0,66,['#d8b24a','#a8812e']);c.beginPath();c.moveTo(70,10);c.lineTo(132,66);c.lineTo(8,66);c.closePath();c.fill();
    c.strokeStyle='rgba(90,60,10,.5)';c.lineWidth=1.3;for(let k=0;k<10;k++){const y=20+k*5;c.beginPath();c.moveTo(70-(y-10)*.95,y);c.lineTo(70+(y-10)*.95,y);c.stroke()}});
  SPR.boat=mk(100,56,(c)=>{shadowBlob(c,50,48,40,7,.3);c.fillStyle=lg(c,0,18,0,46,['#c4452d','#8a2a1a']);c.beginPath();c.moveTo(8,22);c.quadraticCurveTo(50,44,92,22);c.quadraticCurveTo(84,46,50,48);c.quadraticCurveTo(16,46,8,22);c.fill();
    c.fillStyle='#e8dcc0';c.beginPath();c.moveTo(12,26);c.quadraticCurveTo(50,40,88,26);c.lineTo(86,30);c.quadraticCurveTo(50,44,14,30);c.fill();c.strokeStyle='#6b4524';c.lineWidth=3;c.beginPath();c.moveTo(30,22);c.lineTo(74,6);c.stroke()});
  SPR.vent=mk(72,64,(c)=>{shadowBlob(c,36,58,28,7,.4);c.fillStyle=lg(c,8,20,64,60,['#4a3a3c','#2a2022']);c.beginPath();c.moveTo(6,58);c.quadraticCurveTo(10,26,36,22);c.quadraticCurveTo(62,26,66,58);c.closePath();c.fill();
    const g=c.createRadialGradient(36,30,2,36,30,18);g.addColorStop(0,'#fff1b0');g.addColorStop(.4,'#ff9d3c');g.addColorStop(1,'rgba(200,60,20,0)');c.fillStyle=g;c.beginPath();c.ellipse(36,30,18,8,0,0,6.3);c.fill();
    c.strokeStyle='#ff8a3d';c.lineWidth=1.6;c.beginPath();c.moveTo(20,50);c.lineTo(26,40);c.lineTo(32,44);c.moveTo(52,52);c.lineTo(48,40);c.stroke()});
  SPR.pad=mk(80,44,(c)=>{c.fillStyle='rgba(30,40,40,.18)';c.beginPath();c.ellipse(40,22,34,14,0,0,6.3);c.fill();c.strokeStyle='rgba(255,246,210,.8)';c.lineWidth=2;c.setLineDash([5,4]);c.beginPath();c.ellipse(40,22,28,11,0,0,6.3);c.stroke();c.setLineDash([]);
    c.fillStyle='rgba(255,246,210,.85)';c.beginPath();c.moveTo(40,12);c.lineTo(48,28);c.lineTo(40,24);c.lineTo(32,28);c.closePath();c.fill()});
  /* ---- shop decorations for the home island ---- */
  SPR.garden=mk(96,56,(c)=>{c.fillStyle='rgba(60,40,20,.25)';c.beginPath();c.ellipse(48,32,42,18,0,0,6.3);c.fill();c.fillStyle='#6a4a2a';c.beginPath();c.ellipse(48,30,38,15,0,0,6.3);c.fill();
    const cols=['#ff8fb1','#ffd36b','#fff','#b58ae8','#ff7a5a'];let sd=7;const r=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
    for(let k=0;k<26;k++){const a=r()*6.3,d=Math.sqrt(r()),x=48+Math.cos(a)*d*34,y=30+Math.sin(a)*d*12;c.strokeStyle='#3f7a3a';c.lineWidth=1.4;c.beginPath();c.moveTo(x,y+5);c.lineTo(x,y);c.stroke();c.fillStyle=cols[k%5];c.beginPath();c.arc(x,y-1,3,0,6.3);c.fill();c.fillStyle='#ffe9a0';c.beginPath();c.arc(x,y-1,1,0,6.3);c.fill()}});
  SPR.fountain=mk(90,90,(c)=>{shadowBlob(c,45,78,38,9,.34);c.fillStyle=lg(c,0,50,0,78,['#b9b4aa','#8a857d']);c.beginPath();c.ellipse(45,66,34,13,0,0,6.3);c.fill();c.fillStyle='#6fb8d8';c.beginPath();c.ellipse(45,63,29,10,0,0,6.3);c.fill();
    c.fillStyle='#a39e94';c.fillRect(40,34,10,30);c.fillStyle='#b9b4aa';c.beginPath();c.ellipse(45,36,16,6,0,0,6.3);c.fill();c.fillStyle='#8cc8e4';c.beginPath();c.ellipse(45,35,13,4.4,0,0,6.3);c.fill();
    c.strokeStyle='rgba(220,244,255,.9)';c.lineWidth=2.2;c.lineCap='round';[[-8,-5],[0,-9],[8,-5]].forEach(([dx,dy])=>{c.beginPath();c.moveTo(45,34);c.quadraticCurveTo(45+dx*.6,24+dy,45+dx*1.6,36);c.stroke()})});
  SPR.windmill=mk(100,160,(c)=>{shadowBlob(c,50,150,36,8,.36);c.fillStyle=lg(c,30,0,70,0,['#d9c9a6','#b0a07e']);c.beginPath();c.moveTo(30,146);c.lineTo(38,58);c.lineTo(62,58);c.lineTo(70,146);c.closePath();c.fill();
    c.fillStyle='#8a4a2a';c.beginPath();c.moveTo(32,60);c.lineTo(50,38);c.lineTo(68,60);c.closePath();c.fill();c.fillStyle='#5a3a22';c.beginPath();c.roundRect(44,120,12,26,[6,6,0,0]);c.fill();c.fillStyle='#6a8fa8';c.fillRect(46,80,8,12);
    c.save();c.translate(50,56);c.strokeStyle='#6b4524';c.lineWidth=3;for(let k=0;k<4;k++){c.rotate(Math.PI/2);c.beginPath();c.moveTo(0,0);c.lineTo(0,-44);c.stroke();c.fillStyle='#f0e6cc';c.strokeStyle='#8a7a5a';c.lineWidth=1;c.fillRect(2,-44,12,24);c.strokeRect(2,-44,12,24);c.strokeStyle='#6b4524';c.lineWidth=3}c.fillStyle='#4a3020';c.beginPath();c.arc(0,0,4,0,6.3);c.fill();c.restore()});
  SPR.statue=mk(80,120,(c)=>{shadowBlob(c,40,110,32,7,.36);c.fillStyle=lg(c,0,90,0,112,['#b9b4aa','#8a857d']);c.fillRect(14,90,52,20);c.fillStyle='#a39e94';c.fillRect(20,80,40,10);
    c.fillStyle=lg(c,20,20,60,80,['#c9c4ba','#908b82']);c.beginPath();c.moveTo(24,80);c.quadraticCurveTo(22,50,34,42);c.quadraticCurveTo(28,26,38,16);c.quadraticCurveTo(44,10,52,14);c.lineTo(60,18);c.lineTo(52,22);c.quadraticCurveTo(56,34,50,42);c.quadraticCurveTo(62,52,58,80);c.closePath();c.fill();
    c.beginPath();c.moveTo(34,48);c.quadraticCurveTo(10,34,8,56);c.quadraticCurveTo(20,52,30,60);c.closePath();c.fill();c.beginPath();c.moveTo(46,48);c.quadraticCurveTo(70,34,72,56);c.quadraticCurveTo(60,52,50,60);c.closePath();c.fill();
    c.fillStyle='#5a5650';c.beginPath();c.arc(52,17,1.4,0,6.3);c.fill();c.strokeStyle='rgba(40,40,40,.25)';c.lineWidth=1;c.beginPath();c.moveTo(34,48);c.lineTo(34,78);c.stroke()});
}

/* ---- field functions for scattering trees and picking shards on an island ---- */
const inRects=(x,y,rs)=>(rs||[]).some(q=>x>q[0]&&x<q[2]&&y>q[1]&&y<q[3]);
