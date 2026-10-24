/* ===== Characters: Ruan's adventurer + his dragon (all drawn in code) ===== */
const DRG={body:'#38b2a0',body2:'#1f7f78',belly:'#f3dd9a',mem:'#e0764a',mem2:'#a8402c',horn:'#f3e6c4',eye:'#9be84a',spine:'#ef9b3e'};
let LK={horn:'small',pattern:'none',tail:'flame',gear:{}};
const DEFAULT_LOOK={body:'#38b2a0',wing:'#e0764a',eyes:'#2f9e5b',horn:'small',pattern:'spots',tail:'flame'};
function setLook(d){ d=d||DEFAULT_LOOK; const B=d.body,Wg=d.wing;
  Object.assign(DRG,{body:B,body2:shade(B,.3),belly:tint(B,.6),mem:Wg,mem2:shade(Wg,.32),horn:'#f3e6c4',eye:tint(d.eyes,.3),spine:tint(Wg,.15)});
  LK={horn:d.horn||'small',pattern:d.pattern||'none',tail:d.tail||'flame',gear:d.gear||{}}; }
const STAGE_SC=[.7,.85,1,1.12];
function stroke(c,col,w){c.strokeStyle=col;c.lineWidth=w;c.lineCap='round';c.lineJoin='round'}

/* ---- the hero: colours and look come from the player's saved character (S.hero) ---- */
function heroPal(h){
  h=h||{}; const L=h.look||{}, W=h.wear||{};
  const of=OUTFIT[W.outfit]||{};
  const tun=of.tun||L.tunic||'#2f8f8d';
  return {skin:L.skin||'#f2c9a0',hair:L.hair||'#6b3d1e',hairL:tint(L.hair||'#6b3d1e',.22),style:L.style||'long',
    tun,tunD:shade(tun,.3),trim:of.trim||null,pat:of.pat||null,scarf:of.scarf||L.scarf||'#e8743b',scarfD:shade(of.scarf||L.scarf||'#e8743b',.18),
    boot:'#5a3920',girl:L.build==='girl',W,cloak:CLOAKS[W.cloak]||null,hat:W.head||null,back:W.back||null,hand:W.hand||null,face:W.face||null};
}
function drawKid(c,dir,ph,moving,o={}){
  const P_=heroPal(o.hero||(typeof S!=='undefined'&&S&&S.hero)||{});
  const s=moving?Math.sin(ph):0, bob=moving?Math.abs(Math.sin(ph))*-1.6:0;
  const skin=P_.skin,hair=P_.hair,hairL=P_.hairL,tun=P_.tun,tunD=P_.tunD,boot=P_.boot,sty=P_.style;
  c.save();c.translate(0,bob);
  const side=(dir==='l'||dir==='r');
  if(dir==='l')c.scale(-1,1);
  const top=-28, hy=-36, sw=Math.sin(ph*.7);
  // ---- things worn behind the body
  if(P_.cloak&&dir!=='u'){ const k=P_.cloak,w=side?9:13;
    c.fillStyle=lg(c,0,top,0,-4,[k.c1,k.c2]);c.beginPath();c.moveTo(-9,top+2);c.lineTo(9,top+2);c.lineTo(w+2+(moving?sw*1.5:0),-5);c.quadraticCurveTo(0,-2+(moving?sw:0),-w-2,-5);c.closePath();c.fill();
    if(k.star){c.fillStyle='#ffe28a';[[-6,-14],[5,-9],[-1,-20],[7,-17]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,1.2,0,6.3);c.fill()})}}
  if(P_.back&&(side||(dir==='d'&&P_.back==='wings'))){ backItem(c,P_.back,side?-1:0,top) }
  if(!o.sit){
    // legs
    if(!side){[[-4.2,1],[4.2,-1]].forEach(([x,m])=>{const up=s*m*3.2;
      c.fillStyle='#4a3524';c.fillRect(x-2.6,-12-Math.min(0,up),5.2,8);
      c.fillStyle=boot;c.beginPath();c.roundRect(x-3.2,-6+Math.min(0,up)*.2-(up>0?up*.6:0),6.4,7,2);c.fill()})}
    else{[[-1,tunD],[1,tun]].forEach(([m,_],i)=>{const off=s*m*4.4;
      c.fillStyle='#4a3524';c.fillRect(off-2.4,-12,5,7);
      c.fillStyle=i?boot:'#47301c';c.beginPath();c.roundRect(off-2.8,-6,8,7,2.5);c.fill()})}
  }
  // body
  c.fillStyle=lg(c,-9,top,9,-8,[tun,tunD]);c.beginPath();c.moveTo(-8,top+2);c.quadraticCurveTo(0,top-2,8,top+2);c.lineTo(10,-9);c.quadraticCurveTo(0,-6,-10,-9);c.closePath();c.fill();
  if(P_.girl){const w=side?10.5:13.5;c.fillStyle=lg(c,0,-20,0,-6,[tun,tunD]);c.beginPath();c.moveTo(-9.6,-19);c.lineTo(9.6,-19);c.lineTo(w,-6.5+(moving?s*.8:0));c.quadraticCurveTo(0,-3.5,-w,-6.5-(moving?s*.8:0));c.closePath();c.fill();
    c.strokeStyle='rgba(255,255,255,.22)';c.lineWidth=1;c.beginPath();c.moveTo(-3,-17);c.lineTo(-5,-6);c.moveTo(3,-17);c.lineTo(5,-6);c.stroke()}
  // outfit pattern
  if(P_.pat==='stripe'){c.fillStyle=P_.trim||'#fff';for(let y=top+5;y<-10;y+=6)c.fillRect(-9.6,y,19.2,2.6)}
  else if(P_.pat==='scale'){c.fillStyle='rgba(255,255,255,.22)';for(let y=top+6;y<-9;y+=5)for(let x=-8+(((y-top)/5|0)%2)*3;x<9;x+=6){c.beginPath();c.arc(x,y,2.4,0,3.14);c.fill()}}
  else if(P_.pat==='flame'){c.fillStyle=P_.trim||'#ffd36b';c.beginPath();c.moveTo(-9.4,-9);for(let x=-9.4;x<=9.4;x+=4.7){c.lineTo(x+2.3,-17-(x%9.4?0:3));c.lineTo(x+4.7,-9)}c.closePath();c.fill()}
  else if(P_.pat==='trim'){c.fillStyle=P_.trim||'#f1d36b';c.fillRect(-9.6,-11,19.2,2.4);if(dir==='d')c.fillRect(-1.2,top+3,2.4,19)}
  else if(P_.pat==='fur'){c.fillStyle='#f4f7fa';c.beginPath();c.ellipse(0,top+2,9,4,0,0,6.3);c.fill();c.fillStyle='#dce6ee';c.beginPath();c.arc(-5,top+3,2,0,6.3);c.arc(4,top+4,2,0,6.3);c.fill()}
  c.fillStyle='#8a5a30';c.fillRect(-9.2,-17,18.4,3);c.fillStyle='#e9c46a';if(dir==='d')c.fillRect(-1.6,-17.4,3.2,3.8);
  // scarf
  if(P_.pat!=='fur'){c.fillStyle=P_.scarf;c.beginPath();c.ellipse(0,top+1.5,7.5,3.2,0,0,6.3);c.fill();
    if(dir==='u'||side){c.fillStyle=P_.scarfD;c.beginPath();c.moveTo(-2,top+3);c.lineTo(-9,top+13+sw*1.5);c.lineTo(-4,top+11);c.closePath();c.fill()}}
  // back view: cloak and packs go over the body
  if(dir==='u'){
    if(P_.cloak){const k=P_.cloak;c.fillStyle=lg(c,0,top,0,-4,[k.c1,k.c2]);c.beginPath();c.moveTo(-10,top+1);c.lineTo(10,top+1);c.lineTo(14+(moving?sw*1.5:0),-5);c.quadraticCurveTo(0,-1+(moving?sw:0),-14,-5);c.closePath();c.fill();
      if(k.star){c.fillStyle='#ffe28a';[[-6,-14],[5,-9],[-1,-20],[7,-17],[-8,-8]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,1.2,0,6.3);c.fill()})}}
    if(P_.back)backItem(c,P_.back,0,top);
  }
  if(dir==='d'&&P_.cloak){c.fillStyle='#e9c46a';c.beginPath();c.arc(0,top+3,2,0,6.3);c.fill()}
  if(dir==='d'&&P_.back&&P_.back!=='wings'){c.strokeStyle='#6b4524';c.lineWidth=2.2;c.beginPath();c.moveTo(-8,top+3);c.lineTo(7,-12);c.stroke()}
  // arms
  const as=moving?s*3.4:0;
  if(!side){[[-1],[1]].forEach(([m])=>{c.fillStyle=tunD;c.beginPath();c.roundRect(m*10-2.4,top+3+(m*as*.6),4.8,12,2.4);c.fill();c.fillStyle=skin;c.beginPath();c.arc(m*10,top+16+(m*as*.6),2.4,0,6.3);c.fill()})}
  else{c.fillStyle=tunD;c.beginPath();c.roundRect(-2.4+as*.7,top+3,4.8,12,2.4);c.fill();c.fillStyle=skin;c.beginPath();c.arc(as*.7,top+16,2.4,0,6.3);c.fill()}
  // held item
  if(P_.hand){const hx=side?as*.7:(dir==='u'?-10:10),hyy=side?top+16:top+16+(dir==='u'?-1:1)*as*.6;handItem(c,P_.hand,hx,hyy,dir)}
  // ---- head
  c.fillStyle=skin;c.beginPath();c.arc(0,hy,9.4,0,6.3);c.fill();
  if(sty==='bun'&&dir!=='d'||sty==='bun'){c.fillStyle=hair;c.beginPath();c.arc(side?-4:0,hy-11.4,4.4,0,6.3);c.fill();c.fillStyle=hairL;c.beginPath();c.arc(side?-5:-1,hy-12.4,1.6,0,6.3);c.fill()}
  if(dir==='d'){
    c.fillStyle=hair;c.beginPath();c.moveTo(-10,hy+1);c.quadraticCurveTo(-11,hy-12,0,hy-11.5);c.quadraticCurveTo(11,hy-12,10,hy+1);c.quadraticCurveTo(7,hy-5,2,hy-6);c.quadraticCurveTo(-4,hy-4,-10,hy+1);c.fill();
    if(sty==='long'){c.fillStyle=hair;c.beginPath();c.roundRect(-11,hy-2,4.2,17+sw*1,2);c.roundRect(6.8,hy-2,4.2,17-sw*1,2);c.fill()}
    if(sty==='pony'){c.fillStyle=P_.scarf;c.beginPath();c.arc(8.4,hy-5,1.6,0,6.3);c.fill();c.fillStyle=hair;c.beginPath();c.ellipse(10.4,hy+1,2.4,5,0,0,6.3);c.fill()}
    c.fillStyle='#1d1d22';c.beginPath();c.arc(-3.6,hy+1.6,1.3,0,6.3);c.arc(3.6,hy+1.6,1.3,0,6.3);c.fill();
    c.fillStyle='rgba(240,120,110,.5)';c.beginPath();c.arc(-6,hy+4.6,1.8,0,6.3);c.arc(6,hy+4.6,1.8,0,6.3);c.fill();
    stroke(c,'#a85a44',1);c.beginPath();c.arc(0,hy+4.4,2,0.2,2.9);c.stroke();
  }else if(dir==='u'){
    c.fillStyle=hair;c.beginPath();c.arc(0,hy-.4,9.8,0,6.3);c.fill();
    if(sty==='long'){c.beginPath();c.roundRect(-9.6,hy,19.2,17+sw,5);c.fill()}
    if(sty==='pony'){c.beginPath();c.ellipse(0,hy+10,3.6,9,sw*.25,0,6.3);c.fill();c.fillStyle=P_.scarf;c.beginPath();c.arc(0,hy+1.5,1.8,0,6.3);c.fill()}
    c.fillStyle=hairL;c.beginPath();c.ellipse(-2.5,hy-4,4.5,2.4,-.4,0,6.3);c.fill();
    if(!P_.cloak||true){c.fillStyle=P_.scarf;c.fillRect(-9.6,hy+1,19.2,2.4)}
  }else{
    c.fillStyle=hair;c.beginPath();c.arc(-1.8,hy-.8,9.9,.6,5.6,false);c.lineTo(3,hy-3);c.quadraticCurveTo(7,hy-6,9,hy-1);c.quadraticCurveTo(6,hy-6,0,hy-6);c.closePath();c.fill();
    if(sty==='long'){c.fillStyle=hair;c.beginPath();c.moveTo(-8,hy+1);c.quadraticCurveTo(-13,hy+7,-9,hy+13+sw*1.2);c.lineTo(-6.5,hy+11);c.quadraticCurveTo(-8,hy+6,-6,hy+1);c.fill()}
    else if(sty==='pony'){c.fillStyle=hair;c.beginPath();c.moveTo(-8,hy-2);c.quadraticCurveTo(-17-sw*2,hy+2,-12-sw*3,hy+13);c.quadraticCurveTo(-8,hy+6,-6,hy-1);c.fill();c.fillStyle=P_.scarf;c.beginPath();c.arc(-8,hy-1,1.6,0,6.3);c.fill()}
    c.fillStyle='#1d1d22';c.beginPath();c.arc(4.4,hy+1.4,1.3,0,6.3);c.fill();
    c.fillStyle='rgba(240,120,110,.5)';c.beginPath();c.arc(2.6,hy+4.8,1.7,0,6.3);c.fill();
    stroke(c,'#a85a44',1);c.beginPath();c.moveTo(5.6,hy+5.2);c.lineTo(7,hy+4.8);c.stroke();
  }
  if(P_.face==='goggles'){
    c.strokeStyle='#5a3a22';c.lineWidth=2.2;c.beginPath();if(dir==='d'){c.moveTo(-9.6,hy+1.4);c.lineTo(9.6,hy+1.4)}else if(dir==='u'){c.moveTo(-9.6,hy+1.4);c.lineTo(9.6,hy+1.4)}else{c.moveTo(-9.4,hy+1);c.lineTo(5,hy+1.4)}c.stroke();
    if(dir==='d'){[[-3.8],[3.8]].forEach(([x])=>{c.fillStyle='#8ad4e8';c.strokeStyle='#8a6a3a';c.lineWidth=1.6;c.beginPath();c.arc(x,hy+1.6,3.3,0,6.3);c.fill();c.stroke()})}
    else if(dir!=='u'){c.fillStyle='#8ad4e8';c.strokeStyle='#8a6a3a';c.lineWidth=1.6;c.beginPath();c.arc(4.6,hy+1.6,3.3,0,6.3);c.fill();c.stroke()}}
  if(P_.hat)hatItem(c,P_.hat,dir,hy,P_);
  c.restore();
}
function backItem(c,id,x0,top){
  if(id==='satchel'){c.fillStyle='#8a5a30';c.beginPath();c.roundRect(x0-6.5,top+8,13,11,2.5);c.fill();c.fillStyle='#a8743d';c.beginPath();c.roundRect(x0-6.5,top+8,13,5,2.5);c.fill();c.fillStyle='#e9c46a';c.fillRect(x0-1,top+11.5,2,2.4)}
  else if(id==='wings'){[-1,1].forEach(m=>{c.fillStyle='#8e5bb5';c.strokeStyle='#4a2a6a';c.lineWidth=1.2;c.beginPath();c.moveTo(m*4,top+6);c.quadraticCurveTo(m*22,top-14,m*27,top-4);c.quadraticCurveTo(m*22,top+0,m*24,top+6);c.quadraticCurveTo(m*18,top+4,m*18,top+11);c.quadraticCurveTo(m*12,top+8,m*10,top+14);c.quadraticCurveTo(m*6,top+12,m*4,top+14);c.closePath();c.fill();c.stroke();
      c.strokeStyle='rgba(255,255,255,.35)';c.beginPath();c.moveTo(m*5,top+8);c.lineTo(m*26,top-3);c.moveTo(m*5,top+9);c.lineTo(m*18,top+6);c.stroke()})}
  else if(id==='shield'){c.fillStyle='#c4452d';c.beginPath();c.arc(x0,top+13,9,0,6.3);c.fill();c.fillStyle='#e8c46a';c.beginPath();c.arc(x0,top+13,9,0,3.14);c.fill();c.fillStyle='#c4452d';c.beginPath();c.arc(x0,top+13,7,0,3.14);c.fill();c.fillStyle='#e8c46a';c.beginPath();c.arc(x0,top+13,3.6,0,6.3);c.fill();c.strokeStyle='#6b4524';c.lineWidth=1.6;c.beginPath();c.arc(x0,top+13,9,0,6.3);c.stroke()}
}
function handItem(c,id,x,y,dir){
  c.save();c.translate(x,y);
  if(id==='staff'){c.strokeStyle='#7a5430';c.lineWidth=2.4;c.lineCap='round';c.beginPath();c.moveTo(0,14);c.lineTo(0,-34);c.stroke();c.fillStyle='#7be0b8';c.beginPath();c.arc(0,-36,3.4,0,6.3);c.fill();c.fillStyle='rgba(255,255,255,.6)';c.beginPath();c.arc(-1,-37,1,0,6.3);c.fill()}
  else if(id==='wand'){c.strokeStyle='#5a3a22';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(0,6);c.lineTo(0,-20);c.stroke();const tw=.7+.3*Math.sin(Date.now()/160);c.fillStyle='#ffe28a';c.beginPath();for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,r=(k%2?3:7)*tw;c.lineTo(Math.cos(a)*r,-24+Math.sin(a)*r)}c.closePath();c.fill()}
  else if(id==='lantern'){c.strokeStyle='#4a3624';c.lineWidth=1.2;c.beginPath();c.moveTo(0,0);c.lineTo(0,4);c.stroke();const fl=.5+.5*Math.sin(Date.now()/130);c.fillStyle='rgba(255,190,90,'+(.18+.08*fl)+')';c.beginPath();c.arc(0,10,11,0,6.3);c.fill();c.fillStyle='#3a4650';c.fillRect(-3.6,3.6,7.2,1.8);c.fillStyle='#ffb347';c.beginPath();c.roundRect(-3.2,5.4,6.4,8,1.6);c.fill();c.fillStyle='#fff1b0';c.beginPath();c.arc(0,9.6,1.8,0,6.3);c.fill();c.fillStyle='#3a4650';c.fillRect(-3.6,13.4,7.2,1.6)}
  else if(id==='sword'){c.rotate(dir==='u'?.0:-.0);c.fillStyle='#8a5a30';c.fillRect(-1.4,-3,2.8,7);c.fillStyle='#d9b45a';c.fillRect(-4.6,-5,9.2,2.4);c.fillStyle='#c9a46e';c.beginPath();c.moveTo(-2,-5);c.lineTo(0,-26);c.lineTo(2,-5);c.closePath();c.fill();c.strokeStyle='#8a6a3a';c.lineWidth=.8;c.stroke()}
  c.restore();
}
function hatItem(c,id,dir,hy,P_){
  const f=dir==='d',u=dir==='u';
  if(id==='woolcap'){c.fillStyle='#d9544a';c.beginPath();c.moveTo(-9.8,hy-3);c.quadraticCurveTo(-10,hy-14,0,hy-14.5);c.quadraticCurveTo(10,hy-14,9.8,hy-3);c.closePath();c.fill();c.fillStyle='#f3e6c4';c.beginPath();c.roundRect(-10.2,hy-5.6,20.4,4.4,2);c.fill();c.fillStyle='#f3e6c4';c.beginPath();c.arc(0,hy-15,2.8,0,6.3);c.fill()}
  else if(id==='ranger'){c.fillStyle='#3f7a47';c.beginPath();c.moveTo(-11,hy+7);c.quadraticCurveTo(-13,hy-14,0,hy-17);c.quadraticCurveTo(13,hy-14,11,hy+7);c.lineTo(8,hy+2);c.quadraticCurveTo(6,hy-9,0,hy-10);c.quadraticCurveTo(-6,hy-9,-8,hy+2);c.closePath();c.fill();if(u){c.fillStyle='#3f7a47';c.beginPath();c.arc(0,hy-.4,10.2,0,6.3);c.fill()}c.fillStyle='#2f5e38';c.beginPath();c.moveTo(-11,hy+7);c.lineTo(-8,hy+2);c.lineTo(-7,hy+8);c.closePath();c.fill()}
  else if(id==='horn'){c.fillStyle='#9aa4ad';c.beginPath();c.moveTo(-10,hy-1);c.quadraticCurveTo(-10,hy-14,0,hy-14.5);c.quadraticCurveTo(10,hy-14,10,hy-1);c.closePath();c.fill();c.fillStyle='#7e8891';c.fillRect(-10.4,hy-4,20.8,3);
    c.fillStyle='#f3e6c4';[[-1],[1]].forEach(([m])=>{c.beginPath();c.moveTo(m*9,hy-8);c.quadraticCurveTo(m*15,hy-10,m*13,hy-19);c.quadraticCurveTo(m*10,hy-12,m*7,hy-11);c.closePath();c.fill()});
    if(f){c.fillStyle='#7e8891';c.fillRect(-1.2,hy-4,2.4,8)}}
  else if(id==='wizard'){c.fillStyle='#3b3f9a';c.beginPath();c.moveTo(-14,hy-4);c.quadraticCurveTo(-4,hy-8,-3,hy-12);c.quadraticCurveTo(0,hy-26,8,hy-34);c.quadraticCurveTo(6,hy-18,5,hy-12);c.quadraticCurveTo(8,hy-8,14,hy-4);c.quadraticCurveTo(0,hy-1,-14,hy-4);c.closePath();c.fill();c.fillStyle='#ffe28a';[[-1,-14],[3,-20],[0,-8]].forEach(([x,y])=>{c.beginPath();c.arc(x,hy+y,1.2,0,6.3);c.fill()})}
  else if(id==='goldcrown'){c.fillStyle='#f0c23a';c.strokeStyle='#8a6a10';c.lineWidth=1;c.beginPath();c.moveTo(-8,hy-6);c.lineTo(-9,hy-16);c.lineTo(-4,hy-11);c.lineTo(0,hy-18);c.lineTo(4,hy-11);c.lineTo(9,hy-16);c.lineTo(8,hy-6);c.closePath();c.fill();c.stroke();c.fillStyle='#e4572e';c.beginPath();c.arc(0,hy-9,1.6,0,6.3);c.fill()}
  else if(id==='embercrown'){const fl=.6+.4*Math.sin(Date.now()/170);c.fillStyle='rgba(255,150,60,'+(.25*fl)+')';c.beginPath();c.arc(0,hy-12,13,0,6.3);c.fill();c.fillStyle='#b8452a';c.strokeStyle='#5a1f10';c.lineWidth=1;c.beginPath();c.moveTo(-8,hy-6);c.lineTo(-9,hy-17);c.lineTo(-4,hy-11);c.lineTo(0,hy-19);c.lineTo(4,hy-11);c.lineTo(9,hy-17);c.lineTo(8,hy-6);c.closePath();c.fill();c.stroke();c.fillStyle='#ffd36b';[[-9,-17],[0,-19],[9,-17]].forEach(([x,y])=>{c.beginPath();c.arc(x,hy+y,1.6+.5*fl,0,6.3);c.fill()})}
  else if(id==='sunhat'){c.fillStyle='#e4c066';c.strokeStyle='#a8842c';c.lineWidth=1;c.beginPath();c.ellipse(0,hy-4,15,5,0,0,6.3);c.fill();c.stroke();c.fillStyle='#ecce7a';c.beginPath();c.moveTo(-8,hy-4);c.quadraticCurveTo(-8,hy-15,0,hy-15);c.quadraticCurveTo(8,hy-15,8,hy-4);c.closePath();c.fill();c.fillStyle='#d9544a';c.fillRect(-8,hy-7,16,2.4)}
  else if(id==='laurel'){c.fillStyle='#5a9a48';for(let k=0;k<9;k++){const a=Math.PI*(1.05+k*.113),x=Math.cos(a)*9.6,y=hy+Math.sin(a)*9.6;c.save();c.translate(x,y);c.rotate(a+Math.PI/2);c.beginPath();c.ellipse(0,0,3.4,1.5,0,0,6.3);c.fill();c.restore()}}
  else if(id==='santahat'){c.fillStyle='#d9342b';c.beginPath();c.moveTo(-10,hy-4);c.quadraticCurveTo(-8,hy-16,6,hy-18);c.quadraticCurveTo(14,hy-14,12,hy-6);c.quadraticCurveTo(0,hy-9,-10,hy-4);c.closePath();c.fill();c.fillStyle='#fff';c.beginPath();c.roundRect(-11,hy-7,22,4.6,2.3);c.fill();c.beginPath();c.arc(12,hy-6,3.2,0,6.3);c.fill()}
  else if(id==='pumpkin'){c.fillStyle='#e8751a';c.beginPath();c.ellipse(0,hy-8,11,8,0,0,6.3);c.fill();c.strokeStyle='#b8530c';c.lineWidth=1;[-5,0,5].forEach(x=>{c.beginPath();c.moveTo(x,hy-15);c.quadraticCurveTo(x*1.6,hy-8,x,hy-1);c.stroke()});c.fillStyle='#4a7a2a';c.fillRect(-1.2,hy-18,2.4,4);if(f){c.fillStyle='#3a1a08';c.beginPath();c.moveTo(-5,hy-9);c.lineTo(-2.6,hy-9);c.lineTo(-3.8,hy-6.6);c.closePath();c.moveTo(5,hy-9);c.lineTo(2.6,hy-9);c.lineTo(3.8,hy-6.6);c.closePath();c.fill()}}
  else if(id==='partyhat'){c.fillStyle='#8b5cf6';c.beginPath();c.moveTo(-8,hy-4);c.lineTo(0,hy-24);c.lineTo(8,hy-4);c.closePath();c.fill();c.fillStyle='#ffd36b';[[-3,-11],[2,-16],[3,-8]].forEach(([x,y])=>{c.beginPath();c.arc(x,hy+y,1.5,0,6.3);c.fill()});c.fillStyle='#ff8fb1';c.beginPath();c.arc(0,hy-25,2.4,0,6.3);c.fill()}
  else if(id==='circlet'){const cols=['#ff8fb1','#ffd36b','#fff','#9be84a','#8fd0ff'];for(let k=0;k<7;k++){const a=Math.PI*(1.08+k*.14),x=Math.cos(a)*9.4,y=hy+Math.sin(a)*9.4;c.fillStyle=cols[k%5];c.beginPath();c.arc(x,y,2.4,0,6.3);c.fill();c.fillStyle='#ffe9a0';c.beginPath();c.arc(x,y,.9,0,6.3);c.fill()}}
}
/* a small picture of a character, for menus (cached by look) */
const HERO_PIC=new Map();
function heroPic(h,w=110,hgt=130,dir='d'){
  const key=JSON.stringify([h,w,hgt,dir]);if(HERO_PIC.has(key))return HERO_PIC.get(key);
  const cv=document.createElement('canvas');cv.width=w*2;cv.height=hgt*2;const c=cv.getContext('2d');
  c.scale(2,2);c.translate(w/2,hgt-14);const k=Math.min(w/40,hgt/62);c.scale(k,k);
  c.fillStyle='rgba(20,40,40,.2)';c.beginPath();c.ellipse(0,1,11,4,0,0,6.3);c.fill();
  drawKid(c,dir,0,false,{hero:h});
  const u=cv.toDataURL();if(HERO_PIC.size>60)HERO_PIC.clear();HERO_PIC.set(key,u);return u;
}

/* scalloped bat-style wing: shoulder SC, tip T, trailing root R */
function wing(c,S0,T0,R0,dark){
  const [sx,sy]=S0,[tx,ty]=T0,[rx,ry]=R0;
  const pts=[];for(let k=1;k<=3;k++)pts.push([tx+(rx-tx)*k/3,ty+(ry-ty)*k/3]);
  c.fillStyle=lg(c,sx,sy,tx,ty,dark?[DRG.mem2,'#7e2f22']:[DRG.mem,DRG.mem2]);
  c.beginPath();c.moveTo(sx,sy);c.lineTo(tx,ty);
  let px=tx,py=ty;
  pts.forEach(([x,y])=>{const mx=(px+x)/2+(sx-(px+x)/2)*.16,my=(py+y)/2+(sy-(py+y)/2)*.16;c.quadraticCurveTo(mx,my,x,y);px=x;py=y});
  c.lineTo(sx,sy);c.closePath();c.fill();
  stroke(c,'rgba(70,24,16,.7)',1.3);c.beginPath();c.moveTo(sx,sy);c.lineTo(tx,ty);c.stroke();
  pts.slice(0,2).forEach(([x,y])=>{c.beginPath();c.moveTo(sx,sy);c.lineTo(x,y);c.stroke()});
  c.fillStyle='rgba(255,255,255,.14)';c.beginPath();c.moveTo(sx,sy);c.lineTo(tx,ty);c.lineTo((tx+rx)/2,(ty+ry)/2);c.closePath();c.fill();
}
function tailTip(c,x,y,dx,dy){
  const L=Math.hypot(dx,dy)||1,ux=dx/L,uy=dy/L,px=-uy,py=ux;
  if(LK.gear&&LK.gear.tail==='blade'){
    c.fillStyle='#c4ccd3';c.strokeStyle='#4e575f';c.lineWidth=1.2;c.beginPath();c.moveTo(x+px*4,y+py*4);c.lineTo(x+ux*17,y+uy*17);c.lineTo(x-px*4,y-py*4);c.closePath();c.fill();c.stroke();
    c.fillStyle='#7a5a36';c.beginPath();c.arc(x,y,4.2,0,6.3);c.fill();c.strokeStyle='#fff';c.globalAlpha=.6;c.beginPath();c.moveTo(x+ux*3,y+uy*3);c.lineTo(x+ux*14,y+uy*14);c.stroke();c.globalAlpha=1;return}
  if(LK.tail==='flame'){const fl=1+.18*Math.sin(Date.now()/90);
    c.fillStyle='#ff8a3d';c.beginPath();c.moveTo(x-5,y+1);c.quadraticCurveTo(x-6,y-9*fl,x,y-16*fl);c.quadraticCurveTo(x+6,y-9*fl,x+5,y+1);c.closePath();c.fill();
    c.fillStyle='#ffd36b';c.beginPath();c.moveTo(x-2.6,y+1);c.quadraticCurveTo(x-3,y-5,x,y-9*fl);c.quadraticCurveTo(x+3,y-5,x+2.6,y+1);c.closePath();c.fill();return}
  if(LK.tail==='club'){c.fillStyle=DRG.body2;c.beginPath();c.arc(x+ux*3,y+uy*3,6,0,6.3);c.fill();
    c.strokeStyle=shade(DRG.body,.5);c.lineWidth=2.2;c.lineCap='round';[[1,0],[-1,0],[0,1],[0,-1]].forEach(([a,b])=>{c.beginPath();c.moveTo(x+ux*3+a*5,y+uy*3+b*5);c.lineTo(x+ux*3+a*9,y+uy*3+b*9);c.stroke()});return}
  c.fillStyle=DRG.mem2;c.beginPath();c.moveTo(x-px*2,y-py*2);c.lineTo(x-px*8+ux*6,y-py*8+uy*6);c.lineTo(x+ux*14,y+uy*14);c.lineTo(x+px*8+ux*6,y+py*8+uy*6);c.lineTo(x+px*2,y+py*2);c.closePath();c.fill();
}
/* body markings + armour + head gear, per view */
function bodyMarks(c,v){
  if(LK.pattern==='none')return; c.save();c.globalAlpha=.5;
  if(LK.pattern==='spots'){c.fillStyle=DRG.body2;[[-8,-20,2.6],[4,-22,2],[-2,-12,2.4],[9,-14,2.2],[-12,-12,1.8]].forEach(([x,y,r])=>{const k=v==='side'?1:.7;c.beginPath();c.arc(x*k,y,r,0,6.3);c.fill()})}
  else{c.strokeStyle=DRG.body2;c.lineWidth=2.4;c.lineCap='round';[-10,-4,2,8].forEach(x=>{const k=v==='side'?1:.7;c.beginPath();c.moveTo(x*k,-25);c.quadraticCurveTo(x*k+2,-20,x*k,-15);c.stroke()})}
  c.restore();
}
function bodyArmour(c,v){
  const g=LK.gear||{};if(!g.body)return;
  const rx=v==='side'?19:14.5,ry=v==='side'?11.5:12.5,cy=-16+(v==='side'?0:1);
  if(g.body==='mail'){const gr=c.createLinearGradient(0,cy-ry,0,cy+ry);gr.addColorStop(0,'#cdd5db');gr.addColorStop(1,'#8e98a1');c.fillStyle=gr;c.beginPath();c.ellipse(0,cy,rx-1.5,ry-1,0,0,6.3);c.fill();
    c.strokeStyle='rgba(60,70,80,.5)';c.lineWidth=.9;for(let r=0;r<4;r++){c.beginPath();for(let x=-rx+4;x<rx-3;x+=4){c.arc(x,cy-ry+5+r*5,2.1,0,Math.PI)}c.stroke()}
    c.strokeStyle='#5a636b';c.lineWidth=1.6;c.beginPath();c.ellipse(0,cy,rx-1.5,ry-1,0,0,6.3);c.stroke()}
  else{const gr=c.createLinearGradient(0,cy-ry,0,cy+ry);gr.addColorStop(0,'#f0d27a');gr.addColorStop(1,'#b8902f');c.fillStyle=gr;c.beginPath();c.ellipse(0,cy,rx-1.5,ry-1,0,0,6.3);c.fill();
    c.strokeStyle='#6b4e18';c.lineWidth=1.4;for(let r=1;r<4;r++){c.beginPath();c.moveTo(-rx+3,cy-ry+r*5.5);c.quadraticCurveTo(0,cy-ry+r*5.5+3,rx-3,cy-ry+r*5.5);c.stroke()}
    c.fillStyle='#e4572e';[[-6,-1],[6,-1],[0,3]].forEach(([x,y])=>{c.beginPath();c.arc(x,cy+y,1.5,0,6.3);c.fill()});
    c.strokeStyle='#6b4e18';c.lineWidth=1.6;c.beginPath();c.ellipse(0,cy,rx-1.5,ry-1,0,0,6.3);c.stroke()}
}
function headGear(c,v,hx,hy,hw,hh){
  const g=LK.gear||{};
  if(g.head==='helm'){const gr=c.createLinearGradient(hx-hw,0,hx+hw,0);gr.addColorStop(0,'#d8dfe5');gr.addColorStop(1,'#8e98a1');c.fillStyle=gr;
    c.beginPath();c.ellipse(hx,hy-hh*.2,hw*1.02,hh*.95,0,Math.PI,0);c.lineTo(hx+hw,hy+hh*.18);c.lineTo(hx-hw,hy+hh*.18);c.closePath();c.fill();
    c.strokeStyle='#4e575f';c.lineWidth=1.6;c.stroke();c.fillStyle='#4e575f';c.fillRect(hx-hw,hy+hh*.02,hw*2,2.6);
    c.fillStyle='#e4572e';c.beginPath();c.moveTo(hx-3,hy-hh*1.1);c.quadraticCurveTo(hx,hy-hh*1.9,hx+3,hy-hh*1.1);c.closePath();c.fill();
    if(v==='front'){c.fillStyle='#4e575f';c.fillRect(hx-1.2,hy+hh*.1,2.4,hh*.55)}}
  else if(g.head==='hat'){c.fillStyle='#9a6a34';c.beginPath();c.ellipse(hx,hy-hh*.55,hw*1.35,hh*.34,0,0,6.3);c.fill();
    c.fillStyle='#c58f4d';c.beginPath();c.moveTo(hx-hw*.85,hy-hh*.55);c.quadraticCurveTo(hx-hw*.85,hy-hh*1.7,hx,hy-hh*1.7);c.quadraticCurveTo(hx+hw*.85,hy-hh*1.7,hx+hw*.85,hy-hh*.55);c.closePath();c.fill();
    c.strokeStyle='#e4572e';c.lineWidth=2.4;c.beginPath();c.moveTo(hx-hw*.85,hy-hh*.8);c.quadraticCurveTo(hx,hy-hh*.6,hx+hw*.85,hy-hh*.8);c.stroke()}
  else if(g.head==='crown'){[['#ff9ec2',-1],['#ffe27a',-.5],['#ff9ec2',0],['#ffe27a',.5],['#ff9ec2',1]].forEach(([col,t])=>{c.fillStyle=col;c.beginPath();c.arc(hx+t*hw*.95,hy-hh*(.7+.25*(1-Math.abs(t))),2.7,0,6.3);c.fill()})}
}
function neckGear(c,v,nx,ny,nw){
  if(!(LK.gear&&LK.gear.neck==='scarf'))return;
  c.fillStyle='#e4572e';c.beginPath();c.ellipse(nx,ny,nw,3.4,v==='side'?-.7:0,0,6.3);c.fill();
  c.fillStyle='#c9431d';const fl=Math.sin(Date.now()/160)*2;
  c.beginPath();c.moveTo(nx-nw*.4,ny);c.lineTo(nx-nw-6,ny+4+fl);c.lineTo(nx-nw-2,ny+8+fl);c.lineTo(nx-nw*.3,ny+3);c.closePath();c.fill();
}
function crestSpikes(c,hx,hy,w){
  if(LK.horn!=='crest')return; c.fillStyle=DRG.mem2;c.strokeStyle=shade(DRG.body,.5);c.lineWidth=1;
  [[-.6,8],[-.2,12],[.2,12],[.6,8]].forEach(([t,h])=>{c.beginPath();c.moveTo(hx+t*w-2.4,hy);c.lineTo(hx+t*w,hy-h);c.lineTo(hx+t*w+2.4,hy);c.closePath();c.fill();c.stroke()});
}
function hornShape(c,x,y,dx,dy,len){
  if(LK.horn==='none'||LK.horn==='crest')return; if(LK.horn==='big'){dx*=1.5;dy*=1.45} else {dx*=.8;dy*=.8}
  c.fillStyle=DRG.horn;c.beginPath();c.moveTo(x-1.8*Math.sign(dx||1),y);c.quadraticCurveTo(x+dx*.4,y+dy*.9,x+dx,y+dy);c.quadraticCurveTo(x+dx*.9,y+dy*.4,x+1.8*Math.sign(dx||1),y);c.closePath();c.fill()}

/* o: {dir, ph, flying, flap (radians), bank, rider(fn)} drawn with feet at origin */
function drawDragon(c,o){
  const dir=o.dir,fly=!!o.flying,f=fly?Math.sin(o.flap):0;
  setLook(o.look);
  c.save();const _sc=STAGE_SC[o.stage==null?2:o.stage];c.scale(_sc,_sc);
  const side=(dir==='l'||dir==='r');
  if(dir==='l')c.scale(-1,1);
  if(o.bank)c.rotate(o.bank);
  const walkS=(!fly&&o.moving)?Math.sin(o.ph):0;
  const bodyG=(x0,y0,x1,y1)=>lg(c,x0,y0,x1,y1,[DRG.body,DRG.body2]);
  if(side){
    // far wing
    if(fly)wing(c,[-2,-26],[-6-26*.5*(1+.3*-f),-26-33*(-f)*.9-4],[-17,-14],true);
    // tail
    const tw=Math.sin((o.t||0)*(fly?5:3.2))*(fly?4:5);
    stroke(c,DRG.body2,9);c.beginPath();c.moveTo(-12,-14);c.quadraticCurveTo(-30,-10+tw,-44,-16+tw*1.3);c.stroke();
    stroke(c,DRG.body,6);c.beginPath();c.moveTo(-12,-14);c.quadraticCurveTo(-30,-10+tw,-44,-16+tw*1.3);c.stroke();
    tailTip(c,-44,-16+tw*1.3,-1,-.25);
    // legs (far)
    if(!fly){c.fillStyle=DRG.body2;c.beginPath();c.roundRect(-11-walkS*3.5,-9,6,9,3);c.fill();c.beginPath();c.roundRect(5+walkS*3.5,-9,6,9,3);c.fill()}
    else{c.fillStyle=DRG.body2;c.beginPath();c.roundRect(-9,-9,6,8,3);c.fill();c.beginPath();c.roundRect(7,-9,6,8,3);c.fill()}
    // body
    c.fillStyle=bodyG(0,-30,0,-4);c.beginPath();c.ellipse(0,-16,19,11.5,-.05,0,6.3);c.fill();
    c.fillStyle=DRG.belly;c.beginPath();c.ellipse(4,-11,14,6.4,.05,0,6.3);c.fill();
    c.strokeStyle='rgba(120,90,30,.3)';c.lineWidth=1;for(let k=0;k<4;k++){c.beginPath();c.moveTo(-6+k*6,-15);c.lineTo(-6+k*6,-8);c.stroke()}
    // spines
    c.fillStyle=DRG.spine;for(let k=0;k<6;k++){const x=-14+k*5;c.beginPath();c.moveTo(x-2.4,-26.4+Math.abs(k-2.5)*.7);c.lineTo(x+.4,-31.5+Math.abs(k-2.5)*.7);c.lineTo(x+2.8,-26.4+Math.abs(k-2.5)*.7);c.fill()}
    bodyMarks(c,'side');bodyArmour(c,'side');
    // neck + head
    stroke(c,DRG.body,10);c.beginPath();c.moveTo(11,-20);c.quadraticCurveTo(18,-26,22,-29);c.stroke();
    c.fillStyle=bodyG(0,-40,0,-20);c.beginPath();c.ellipse(25,-30,10.4,8.4,-.1,0,6.3);c.fill();
    c.fillStyle=DRG.body;c.beginPath();c.ellipse(33,-27,6.6,5,.1,0,6.3);c.fill();
    c.fillStyle=DRG.belly;c.beginPath();c.ellipse(33,-24.4,5.6,2.4,.1,0,6.3);c.fill();
    c.fillStyle='rgba(30,50,40,.7)';c.beginPath();c.arc(37,-29,1,0,6.3);c.fill();
    // ear fin + horns
    c.fillStyle=DRG.mem;c.beginPath();c.moveTo(18,-33);c.quadraticCurveTo(10,-40,7,-31);c.quadraticCurveTo(13,-33,16,-27);c.closePath();c.fill();
    hornShape(c,21,-37,-9,-9,12);hornShape(c,25,-38,-3,-12,10);
    // eye
    c.fillStyle=DRG.eye;c.beginPath();c.ellipse(27,-32,3.3,3.5,0,0,6.3);c.fill();
    c.fillStyle='#1a2b1c';c.beginPath();c.ellipse(27.4,-32,1,3,0,0,6.3);c.fill();
    c.fillStyle='#fff';c.beginPath();c.arc(26.2,-33.4,1,0,6.3);c.fill();
    stroke(c,'rgba(20,50,40,.6)',1.4);c.beginPath();c.moveTo(23,-36);c.lineTo(30,-35);c.stroke();
    crestSpikes(c,22,-37.5,8);headGear(c,'side',25,-30,10.4,8.4);neckGear(c,'side',14,-21,6);
    if(o.mouthOpen){c.fillStyle='#7a2a2a';c.beginPath();c.ellipse(34,-24,4,2,0,0,3.14);c.fill()}
    // near legs
    c.fillStyle=DRG.body;if(!fly){c.beginPath();c.roundRect(-8+walkS*3.5,-9,7,10,3);c.fill();c.beginPath();c.roundRect(8-walkS*3.5,-9,7,10,3);c.fill();
      c.fillStyle=DRG.horn;[[-4+walkS*3.5],[11-walkS*3.5]].forEach(([x])=>{c.fillRect(x-3,0,1.3,2);c.fillRect(x,0,1.3,2);c.fillRect(x+3,0,1.3,2)})}
    else{c.beginPath();c.roundRect(-5,-10,7,8,3);c.fill();c.beginPath();c.roundRect(11,-10,7,8,3);c.fill()}
    // rider here (between body and near wing)
    if(o.rider)o.rider(-4,-26);
    // near wing
    if(fly)wing(c,[-2,-25],[-8-26*.5*(1+.3*f),-25-33*f*.9-4],[-18,-12],false);
    else{c.fillStyle=DRG.mem;c.beginPath();c.moveTo(-6,-26);c.lineTo(-18,-35);c.lineTo(-12,-24);c.lineTo(-17,-20);c.lineTo(-7,-21);c.closePath();c.fill()}
  }else if(dir==='d'){
    // tail curl at right
    const tw=Math.sin((o.t||0)*3)*3;
    stroke(c,DRG.body2,8);c.beginPath();c.moveTo(8,-6);c.quadraticCurveTo(24,-2+tw,26,-12);c.stroke();
    stroke(c,DRG.body,5);c.beginPath();c.moveTo(8,-6);c.quadraticCurveTo(24,-2+tw,26,-12);c.stroke();
    tailTip(c,26,-12,.6,-.8);
    if(fly){const a=f;wing(c,[-9,-24],[-9-38*Math.cos(.15+.7*a),-24-38*Math.sin(.15+.7*a)-2],[-13,-6],true);wing(c,[9,-24],[9+38*Math.cos(.15+.7*a),-24-38*Math.sin(.15+.7*a)-2],[13,-6],true)}
    else{c.fillStyle=DRG.mem2;[-1,1].forEach(m=>{c.beginPath();c.moveTo(m*10,-20);c.lineTo(m*17,-32);c.lineTo(m*17,-16);c.lineTo(m*12,-12);c.closePath();c.fill()})}
    // feet
    c.fillStyle=DRG.body2;if(!fly){c.beginPath();c.roundRect(-11-walkS*0,-8+walkS*2,8,9,3);c.fill();c.beginPath();c.roundRect(3,-8-walkS*2,8,9,3);c.fill();
      c.fillStyle=DRG.horn;[-9,-6,-3,5,8,11].forEach(x=>c.fillRect(x-.6,1,1.3,2))}
    else{c.beginPath();c.roundRect(-10,-8,8,8,3);c.fill();c.beginPath();c.roundRect(2,-8,8,8,3);c.fill()}
    // body
    c.fillStyle=bodyG(0,-28,0,-2);c.beginPath();c.ellipse(0,-15,14.5,12.5,0,0,6.3);c.fill();
    c.fillStyle=DRG.belly;c.beginPath();c.ellipse(0,-11,8.4,8.4,0,0,6.3);c.fill();
    c.strokeStyle='rgba(120,90,30,.3)';c.lineWidth=1;for(let k=0;k<3;k++){c.beginPath();c.moveTo(-6,-15+k*4);c.quadraticCurveTo(0,-13+k*4,6,-15+k*4);c.stroke()}
    bodyMarks(c,'front');bodyArmour(c,'front');
    if(o.rider)o.rider(0,-31);
    neckGear(c,'front',0,-19.5,10);
    // head
    c.fillStyle=bodyG(0,-40,0,-18);c.beginPath();c.ellipse(0,-28,11.6,9.6,0,0,6.3);c.fill();
    [-1,1].forEach(m=>{c.fillStyle=DRG.mem;c.beginPath();c.moveTo(m*10,-31);c.quadraticCurveTo(m*19,-34,m*17,-24);c.quadraticCurveTo(m*14,-27,m*10,-24);c.closePath();c.fill();hornShape(c,m*6.5,-36,m*5,-9,11)});
    c.fillStyle=DRG.body;c.beginPath();c.ellipse(0,-23.6,7.2,5.2,0,0,6.3);c.fill();
    c.fillStyle=DRG.belly;c.beginPath();c.ellipse(0,-21.6,5.4,3,0,0,6.3);c.fill();
    c.fillStyle='rgba(30,50,40,.7)';c.beginPath();c.arc(-2.4,-24.6,.9,0,6.3);c.arc(2.4,-24.6,.9,0,6.3);c.fill();
    [-1,1].forEach(m=>{c.fillStyle=DRG.eye;c.beginPath();c.ellipse(m*5.8,-30,3.4,3.7,0,0,6.3);c.fill();c.fillStyle='#1a2b1c';c.beginPath();c.ellipse(m*5.8,-30,1,3.1,0,0,6.3);c.fill();c.fillStyle='#fff';c.beginPath();c.arc(m*5.8-.9,-31.4,1,0,6.3);c.fill()});
    stroke(c,'rgba(20,50,40,.6)',1.3);c.beginPath();c.moveTo(-9,-34);c.lineTo(-3,-33);c.moveTo(9,-34);c.lineTo(3,-33);c.stroke();
    crestSpikes(c,0,-37,9);headGear(c,'front',0,-28,11.6,9.6);
  }else{ // back view
    if(fly){const a=f;wing(c,[-9,-24],[-9-38*Math.cos(.15+.7*a),-24-38*Math.sin(.15+.7*a)-2],[-13,-6],true);wing(c,[9,-24],[9+38*Math.cos(.15+.7*a),-24-38*Math.sin(.15+.7*a)-2],[13,-6],true)}
    else{c.fillStyle=DRG.mem2;[-1,1].forEach(m=>{c.beginPath();c.moveTo(m*10,-20);c.lineTo(m*17,-32);c.lineTo(m*17,-16);c.lineTo(m*12,-12);c.closePath();c.fill()})}
    c.fillStyle=DRG.body2;if(!fly){c.beginPath();c.roundRect(-11,-8-walkS*2,8,9,3);c.fill();c.beginPath();c.roundRect(3,-8+walkS*2,8,9,3);c.fill()}
    else{c.beginPath();c.roundRect(-10,-8,8,8,3);c.fill();c.beginPath();c.roundRect(2,-8,8,8,3);c.fill()}
    // head peeking
    c.fillStyle=bodyG(0,-40,0,-24);c.beginPath();c.ellipse(0,-31,9.6,8,0,0,6.3);c.fill();
    [-1,1].forEach(m=>hornShape(c,m*6,-36,m*5,-8,11));
    c.fillStyle=DRG.mem;[-1,1].forEach(m=>{c.beginPath();c.moveTo(m*8,-31);c.quadraticCurveTo(m*17,-33,m*15,-25);c.quadraticCurveTo(m*12,-27,m*8,-24);c.closePath();c.fill()});
    crestSpikes(c,0,-38,8);headGear(c,'back',0,-31,9.6,8);
    // body
    c.fillStyle=bodyG(0,-28,0,-2);c.beginPath();c.ellipse(0,-15,14.5,12.5,0,0,6.3);c.fill();
    bodyMarks(c,'back');bodyArmour(c,'back');
    c.fillStyle=DRG.spine;for(let k=0;k<4;k++){c.beginPath();c.moveTo(-2.4,-25+k*5);c.lineTo(0,-29+k*5);c.lineTo(2.4,-25+k*5);c.fill()}
    neckGear(c,'back',0,-22,10);
    // tail toward viewer
    const tw=Math.sin((o.t||0)*3)*3;
    stroke(c,DRG.body2,8);c.beginPath();c.moveTo(0,-7);c.quadraticCurveTo(tw,0,2+tw,6);c.stroke();
    stroke(c,DRG.body,5);c.beginPath();c.moveTo(0,-7);c.quadraticCurveTo(tw,0,2+tw,6);c.stroke();
    tailTip(c,2+tw,5,0,1);
    if(o.rider)o.rider(0,-22);
  }
  c.restore();
}
