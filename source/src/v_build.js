/* ===== the shared island project (lighthouse first): drawn in four stages ===== */
function lhDraw(c,stage){
  const cx=45, base=160;
  shadowBlob(c,cx,base+3,34,7,.34);
  if(stage===0){
    /* staked-out plot: corner stakes, rope, a pile of stones and bricks */
    c.strokeStyle='#d9d2b8';c.lineWidth=1.4;c.setLineDash([4,3]);c.beginPath();c.moveTo(18,base-4);c.lineTo(72,base-4);c.lineTo(80,base+4);c.lineTo(10,base+4);c.closePath();c.stroke();c.setLineDash([]);
    c.fillStyle='#8a5f36';[[18,base-4],[72,base-4],[80,base+4],[10,base+4]].forEach(([x,y])=>c.fillRect(x-1.5,y-12,3,13));
    c.fillStyle='#9a9ea3';[[34,base-2,9],[43,base-4,7],[52,base-1,8],[40,base+2,6]].forEach(([x,y,r])=>{c.beginPath();c.ellipse(x,y,r,r*.6,0,0,6.3);c.fill()});
    c.fillStyle='#b5533a';c.fillRect(56,base-8,10,5);c.fillRect(58,base-13,10,5);
    c.fillStyle='#8a6a3a';c.fillRect(44,base-34,3,32);c.fillStyle='#e8d9a8';c.fillRect(30,base-48,32,16);c.fillStyle='#6b4a1a';c.fillRect(34,base-44,24,2);c.fillRect(34,base-39,18,2);
    return;
  }
  /* tower height and half-width per stage */
  const H=[0,44,88,122,122][stage], wB=24, wT=15;
  const topY=base-H;
  const halfAt=y=>wB-(wB-wT)*((base-y)/122);
  /* body */
  c.beginPath();c.moveTo(cx-wB,base);c.lineTo(cx+wB,base);c.lineTo(cx+halfAt(topY),topY);c.lineTo(cx-halfAt(topY),topY);c.closePath();
  c.fillStyle=lg(c,cx-wB,0,cx+wB,0,['#f2ede0','#dcd4c0','#b9b09a']);c.fill();
  /* red stripes */
  c.save();c.clip();
  c.fillStyle='#c9432b';for(let k=0;k<4;k++){const y1=base-14-k*34;c.fillRect(cx-40,y1-14,80,14)}
  c.fillStyle='rgba(0,0,0,.12)';c.fillRect(cx+6,topY,30,H);c.restore();
  /* stone footing */
  c.fillStyle='#8a8f96';c.beginPath();c.moveTo(cx-wB-5,base);c.lineTo(cx+wB+5,base);c.lineTo(cx+wB+2,base-9);c.lineTo(cx-wB-2,base-9);c.closePath();c.fill();
  c.strokeStyle='rgba(40,44,50,.45)';c.lineWidth=1;for(let k=0;k<5;k++){c.beginPath();c.moveTo(cx-wB-4+k*12,base-9);c.lineTo(cx-wB-4+k*12+2,base);c.stroke()}
  /* door */
  if(stage>=2){c.fillStyle='#6b4a2a';c.beginPath();c.moveTo(cx-6,base-9);c.lineTo(cx-6,base-24);c.arc(cx,base-24,6,Math.PI,0);c.lineTo(cx+6,base-9);c.closePath();c.fill()}
  /* scaffold in the early stages */
  if(stage<3){c.strokeStyle='#8a5f36';c.lineWidth=2;const sx=cx+wB+6;c.beginPath();c.moveTo(sx,base);c.lineTo(sx,topY-6);c.moveTo(sx-60,base);c.lineTo(sx-60,topY-6);c.stroke();
    c.lineWidth=1.6;for(let y=base-16;y>topY-4;y-=24){c.beginPath();c.moveTo(sx-60,y);c.lineTo(sx,y);c.stroke()}}
  if(stage>=3){
    /* gallery, lamp room, roof */
    c.fillStyle='#4a4f57';c.fillRect(cx-halfAt(topY)-6,topY-5,2*halfAt(topY)+12,6);
    c.fillStyle='#3a3f46';c.fillRect(cx-halfAt(topY)-6,topY-12,2*halfAt(topY)+12,2);
    const lampOn=stage>=4;
    c.fillStyle=lampOn?'#ffe48a':'#5a6770';c.fillRect(cx-9,topY-30,18,24);
    c.strokeStyle='#3a3f46';c.lineWidth=1.6;c.strokeRect(cx-9,topY-30,18,24);c.beginPath();c.moveTo(cx,topY-30);c.lineTo(cx,topY-6);c.moveTo(cx-9,topY-18);c.lineTo(cx+9,topY-18);c.stroke();
    c.fillStyle='#c9432b';c.beginPath();c.moveTo(cx-13,topY-30);c.lineTo(cx,topY-46);c.lineTo(cx+13,topY-30);c.closePath();c.fill();
    c.fillStyle='#d9a441';c.beginPath();c.arc(cx,topY-48,2.6,0,6.3);c.fill();
    /* little windows */
    c.fillStyle='#35505e';[[base-60],[base-95]].forEach(([y])=>{c.beginPath();c.arc(cx,y,4,0,6.3);c.fill()});
  }
}
SPR.lh=[0,1,2,3,4].map(st=>mk(90,170,c=>lhDraw(c,st)));

/* ===== project 2: the longship on the beach, mended in stages ===== */
function shipDraw(c,stage){
  const W=150, by=118;            /* waterline y */
  shadowBlob(c,76,by+6,58,8,.32);
  /* sand mound and props under the hull */
  c.fillStyle='#d9c48e';c.beginPath();c.ellipse(76,by+2,62,9,0,0,6.3);c.fill();
  const hull=(x0,x1)=>{ /* hull outline as a curved boat shape, left/right bow rise */
    c.beginPath();c.moveTo(14,by-40);c.quadraticCurveTo(26,by-6,76,by-2);c.quadraticCurveTo(126,by-6,138,by-40);c.lineTo(126,by-36);c.quadraticCurveTo(112,by-18,76,by-16);c.quadraticCurveTo(40,by-18,26,by-36);c.closePath()};
  if(stage===0){
    /* a broken keel, a few ribs and a pile of planks */
    c.strokeStyle='#6b4a2a';c.lineWidth=5;c.beginPath();c.moveTo(22,by-8);c.quadraticCurveTo(76,by+2,130,by-8);c.stroke();
    c.lineWidth=4;for(const x of [38,54,70,86,102]){c.beginPath();c.moveTo(x,by-4);c.quadraticCurveTo(x-6,by-24,x-12+(x>70?24:0),by-40);c.stroke()}
    c.fillStyle='#a87a45';[[104,by-4,34,6,-.08],[108,by-11,30,6,.05],[100,by-17,28,6,-.04]].forEach(([x,y,w,h,r])=>{c.save();c.translate(x,y);c.rotate(r);c.fillRect(0,0,w,h);c.restore()});
    c.fillStyle='#8a5f36';c.fillRect(124,by-34,3,30);c.fillStyle='#e8d9a8';c.fillRect(112,by-48,26,14);c.fillStyle='#6b4a1a';c.fillRect(115,by-44,20,2);c.fillRect(115,by-39,14,2);
    return;
  }
  /* planks fill in as the stages go up */
  const frac=[0,.4,.75,1,1][stage];
  c.save();hull();c.clip();
  c.fillStyle=lg(c,0,by-44,0,by,['#b98b52','#8a5f36']);c.fillRect(0,by-44*frac-4,150,60);
  c.strokeStyle='rgba(60,36,16,.55)';c.lineWidth=1.2;for(let k=0;k<5;k++){c.beginPath();c.moveTo(0,by-8-k*9);c.lineTo(150,by-8-k*9);c.stroke()}
  if(stage>=3){c.fillStyle='#b8452e';for(let x=34;x<126;x+=12){c.fillRect(x,by-34,6,8)}}
  c.restore();
  c.strokeStyle='#4a3018';c.lineWidth=2;hull();c.stroke();
  /* shields on the side when finished */
  if(stage>=4){[['#c9432b'],['#e8d9a8'],['#3f6f8a'],['#d9a441'],['#c9432b'],['#e8d9a8']].forEach(([col],k)=>{const x=36+k*15;c.fillStyle=col;c.beginPath();c.arc(x,by-24,6,0,6.3);c.fill();c.strokeStyle='#4a3018';c.lineWidth=1.2;c.stroke();c.fillStyle='#4a3018';c.beginPath();c.arc(x,by-24,1.6,0,6.3);c.fill()})}
  /* scaffold props while building */
  if(stage<3){c.strokeStyle='#8a5f36';c.lineWidth=3;[[30,by-2],[122,by-2]].forEach(([x,y])=>{c.beginPath();c.moveTo(x,y);c.lineTo(x+(x<76?-10:10),by-46);c.stroke()});c.lineWidth=2.4;c.beginPath();c.moveTo(20,by-30);c.lineTo(132,by-30);c.stroke()}
  if(stage>=3){
    /* mast */
    c.fillStyle='#5a3a1a';c.fillRect(73,by-100,5,86);
    c.fillStyle='#3a2410';c.fillRect(56,by-96,40,3);
  }
  if(stage>=4){
    /* striped sail */
    c.beginPath();c.moveTo(58,by-94);c.lineTo(94,by-94);c.quadraticCurveTo(100,by-64,92,by-40);c.lineTo(60,by-40);c.quadraticCurveTo(52,by-66,58,by-94);c.closePath();
    c.save();c.clip();c.fillStyle='#f2ede0';c.fillRect(40,by-100,80,70);c.fillStyle='#c9432b';for(let k=0;k<4;k++)c.fillRect(40+k*20,by-100,10,70);c.restore();
    c.strokeStyle='#4a3018';c.lineWidth=1.6;c.stroke();
  }
  if(stage>=3){
    /* dragon head prow (left) and tail (right) */
    c.fillStyle='#2f7d5a';c.beginPath();c.moveTo(14,by-40);c.quadraticCurveTo(6,by-58,16,by-72);c.quadraticCurveTo(26,by-76,30,by-70);c.quadraticCurveTo(22,by-64,22,by-52);c.quadraticCurveTo(24,by-44,26,by-36);c.closePath();c.fill();
    c.strokeStyle='#1f5a40';c.lineWidth=1.4;c.stroke();
    c.fillStyle='#fff8e6';c.beginPath();c.arc(20,by-68,2.4,0,6.3);c.fill();c.fillStyle='#222';c.beginPath();c.arc(20.6,by-68,1.1,0,6.3);c.fill();
    c.fillStyle='#d9a441';c.beginPath();c.moveTo(15,by-72);c.lineTo(10,by-82);c.lineTo(20,by-76);c.closePath();c.fill();
    c.fillStyle='#2f7d5a';c.beginPath();c.moveTo(138,by-40);c.quadraticCurveTo(144,by-52,136,by-60);c.quadraticCurveTo(132,by-52,126,by-36);c.closePath();c.fill();
  }
}
SPR.ship2=[0,1,2,3,4].map(st=>mk(150,130,c=>shipDraw(c,st)));

/* ===== where each shared project stands on the island, and what tapping it does ===== */
const BUILDS={
  lighthouse:{spr:()=>SPR.lh,X:37.5,Y:13.95,ax:45,ay:163,cells:[[37,13]],hit:[[0,-1],[0,-2],[0,-3],[-1,0],[0,1],[-1,-1],[-1,1]],glow:{glow:[45,46],glowR:60,glowCol:'255,226,140'}},
  longship:{spr:()=>SPR.ship2,X:33.6,Y:18.9,ax:76,ay:118,cells:[[32,18],[33,18],[34,18]],hit:[[0,-1],[0,-2],[-1,-1],[1,-1]]}
};
function buildSite(){
  const f=Fam.get(), cur=Fam.current(f);
  PROJECTS.forEach(proj=>{
    const B=BUILDS[proj.id]; if(!B) return;
    const done=(f.projDone||[]).includes(proj.id), mine=cur&&cur.id===proj.id;
    if(!done&&!mine) return;   /* nothing to show until the project starts */
    const n=Fam.bricks(proj.id,f), st=done?4:projStage(proj,n);
    addObj(B.spr()[st],B.X,B.Y,B.ax,B.ay,Object.assign({},st===4&&B.glow?B.glow:{}));
    block(B.cells,null,'use:'+proj.id);
    hitArea(B.cells[0][0],B.cells[0][1],B.hit);
  });
}
function useLongship(){
  const f=Fam.get(), proj=PROJECTS.find(x=>x.id==='longship'), done=(f.projDone||[]).includes('longship');
  const n=Fam.bricks('longship',f), st=done?4:projStage(proj,n), D=S.dragon?S.dragon.name:'Your dragon';
  if(!done){
    const left=proj.need-n, goes=Math.ceil(left/BRICKS_EACH);
    vsay(`${proj.stageText[st]} It has ${n} of ${proj.need} planks and nails. Each child's finished practice adds ${BRICKS_EACH}, so you are mending it together.${goes>0?` ${goes} more practice${goes>1?'s':''} to go.`:''} Missed days cost nothing.`);return}
  if(usedToday('longship')){vsay("The mended longship rocks gently on the sand. It is ready for tomorrow's sail.");return}
  vsay(`${proj.stageText[4]} Take it for a short sail around the bay?`,[{label:'Set sail',fn:()=>{markUsed('longship');reward(2);vsay(`${D} sits proudly at the front like a figurehead. The sail fills, the gulls cheer, and you find 2 embers in a lobster pot. (+2 embers.)`)}},{label:'Not now'}]);
}
function useLighthouse(){
  const f=Fam.get(), proj=PROJECTS.find(x=>x.id==='lighthouse'), done=(f.projDone||[]).includes('lighthouse');
  const n=Fam.bricks('lighthouse',f), st=done?4:projStage(proj,n), D=S.dragon?S.dragon.name:'Your dragon';
  if(!done){
    const left=proj.need-n;
    vsay(`${proj.stageText[st]} It has ${n} of ${proj.need} bricks. Each child's finished practice adds ${BRICKS_EACH} bricks, so you are building it together. ${left>0?`${Math.ceil(left/BRICKS_EACH)} more practice${Math.ceil(left/BRICKS_EACH)>1?'s':''} to go.`:''} Missed days cost nothing.`);return}
  if(usedToday('lighthouse')){vsay("The lighthouse beam is sweeping slowly across the sea. The boats are safe.");return}
  vsay(`${proj.stageText[4]} Turn the great lamp?`,[{label:'Turn the lamp',fn:()=>{markUsed('lighthouse');reward(2);vsay(`${D} flaps up beside you. The beam sweeps the sea, and a little boat answers with a toot. (+2 embers.)`)}},{label:'Not now'}]);
}
