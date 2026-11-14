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

function buildSite(){
  const f=Fam.get(), done=(f.projDone||[]).includes('lighthouse');
  const cur=Fam.current(f), p=cur&&cur.id==='lighthouse'?cur:null;
  if(!done&&!p) return;   /* nothing to show until the project starts */
  const n=Fam.bricks('lighthouse',f), proj=PROJECTS.find(x=>x.id==='lighthouse');
  const st=done?4:projStage(proj,n);
  const X=37.5, Y=13.95, tx=37, ty=13;
  addObj(SPR.lh[st],X,Y,45,163,Object.assign({},st===4?{glow:[45,46],glowR:60,glowCol:'255,226,140'}:{}));
  block([[tx,ty]],null,'use:lighthouse');
  hitArea(tx,ty,[[0,-1],[0,-2],[0,-3],[-1,0],[0,1],[-1,-1],[-1,1]]);
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
