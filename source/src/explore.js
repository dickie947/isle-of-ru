/* ================= explore: a pseudo-3D (isometric) island to wander ================= */
const EX={on:false,raf:0,t0:0};
const GW=36, GH=36, TW=64, TH=32, ZH=13, SHARDS=6;
const hash2=(x,y,s=0)=>{let h=(Math.imul(x,374761393)+Math.imul(y,668265263)+Math.imul(s,1013904223))|0;h=Math.imul(h^(h>>>13),1274126177);return(((h^(h>>>16))>>>0)/4294967295);};
const ellip=(x,y,cx,cy,rx,ry)=>{const dx=(x-cx)/rx,dy=(y-cy)/ry;return dx*dx+dy*dy;};
const KEY={plaza:[17,19],house:[14,16,3,2],door:[15,18],tower:[24,12],campfire:[19,21],banner:[20,18],lantern:[16,22],pines:[9,18],dock:[15,26]};
const WORLD={built:false};
function lvlAt(x,y){
  const n=(hash2(x,y,3)-.5)*.34;
  const d=Math.min(ellip(x,y,18,18,11.5,9),ellip(x,y,12,20,7,6.5),ellip(x,y,24,15,7,6.2),ellip(x,y,17,11,6,4));
  if(d+n>1) return -1;
  if(ellip(x,y,13,21,1.7,1.3)<1) return -2;
  let l=0;
  if(ellip(x,y,23,13,4.8,4.2)+n*.5<1) l=1;
  if(ellip(x,y,12,13,3.8,3.2)+n*.5<1) l=1;
  if(ellip(x,y,23.5,12.5,2.4,2.1)+n*.3<1) l=2;
  return l;
}
function buildWorld(){
  if(WORLD.built) return; WORLD.built=true;
  const LV=[]; for(let y=0;y<GH;y++){const r=[];for(let x=0;x<GW;x++) r.push(lvlAt(x,y));LV.push(r);}
  const inb=(x,y)=>x>=0&&y>=0&&x<GW&&y<GH, land=(x,y)=>inb(x,y)&&LV[y][x]>=0;
  for(let pass=0;pass<2;pass++) for(let y=0;y<GH;y++) for(let x=0;x<GW;x++) if(LV[y][x]>=0){ const c=[[1,0],[-1,0],[0,1],[0,-1]].filter(([a,b])=>land(x+a,y+b)).length; if(c<2) LV[y][x]=-1; }
  const SAND=[],NEAR=[],BLOCK=[],PATH=[],DOCK={},DECO=[];
  for(let y=0;y<GH;y++){SAND.push([]);NEAR.push([]);BLOCK.push([]);PATH.push([]);for(let x=0;x<GW;x++){
    let sand=false; if(LV[y][x]===0){ for(let a=-1;a<=1;a++) for(let b=-1;b<=1;b++) if(!land(x+a,y+b)&&!(inb(x+a,y+b)&&LV[y+b][x+a]===-2)) sand=true; }
    SAND[y].push(sand); BLOCK[y].push(false); PATH[y].push(false);
    let near=false; if(LV[y][x]<0){ for(let a=-2;a<=2&&!near;a++) for(let b=-2;b<=2;b++) if(land(x+a,y+b)){near=true;break;} } NEAR[y].push(near);
  }}
  /* dock tiles over the water */
  for(let k=1;k<=3;k++) DOCK[(KEY.dock[0])+','+(KEY.dock[1]+k)]=true;
  const lev=(x,y)=>DOCK[x+','+y]?0:(inb(x,y)?(LV[y][x]>=0?LV[y][x]:-.5):-.5);
  const walkable=(x,y)=>inb(x,y)&&((LV[y][x]>=0&&!BLOCK[y][x])||DOCK[x+','+y]);
  const canStep=(ax,ay,bx,by)=>{ if(!walkable(bx,by)) return false; if(Math.abs(lev(ax,ay)-lev(bx,by))>1) return false; if(ax!==bx&&ay!==by){ if(!walkable(ax,by)||!walkable(bx,ay)) return false; if(Math.abs(lev(ax,ay)-lev(ax,by))>1||Math.abs(lev(ax,ay)-lev(bx,ay))>1) return false; } return true; };
  Object.assign(WORLD,{LV,SAND,NEAR,BLOCK,PATH,DOCK,lev,walkable,canStep,inb,land});
  /* buildings and plots block their tiles */
  const [hx,hy,hw,hd]=KEY.house; for(let y=hy;y<hy+hd;y++) for(let x=hx;x<hx+hw;x++) BLOCK[y][x]=true;
  for(const k of ['tower','campfire','banner','lantern','pines']) BLOCK[KEY[k][1]][KEY[k][0]]=true;
  /* dirt paths between the main places */
  const bfs=(sx,sy,tx,ty)=>{ const prev={}; const q=[[sx,sy]]; prev[sx+','+sy]=null; while(q.length){ const [x,y]=q.shift(); if(x===tx&&y===ty) break; for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1]]){ const nx=x+a,ny=y+b,k=nx+','+ny; if(k in prev||!inb(nx,ny)||LV[ny][nx]<0||Math.abs(lev(x,y)-lev(nx,ny))>1) continue; if(BLOCK[ny][nx]&&!(nx===tx&&ny===ty)) continue; prev[k]=[x,y]; q.push([nx,ny]); } } const out=[]; let c=[tx,ty]; while(c){ out.push(c); c=prev[c[0]+','+c[1]]; } return out; };
  const [px,py]=KEY.plaza;
  for(const [tx,ty] of [[KEY.door[0],KEY.door[1]],[KEY.dock[0],KEY.dock[1]],[KEY.tower[0],KEY.tower[1]+1],[KEY.campfire[0],KEY.campfire[1]-1],[KEY.pines[0]+1,KEY.pines[1]]]) for(const [x,y] of bfs(px,py,tx,ty)) if(LV[y][x]>=0) PATH[y][x]=true;
  PATH[py][px]=true;
  /* trees, rocks, flowers, bushes */
  const reserved=(x,y)=>{ if(PATH[y][x]) return true; if(Math.hypot(x-px,y-py)<2.4) return true; for(const k of ['campfire','banner','lantern','pines','tower']) if(Math.hypot(x-KEY[k][0],y-KEY[k][1])<1.6) return true; if(x>=hx-1&&x<=hx+hw&&y>=hy-1&&y<=hy+hd) return true; if(Math.abs(x-KEY.dock[0])<=1&&y>=KEY.dock[1]-1) return true; return false; };
  for(let y=0;y<GH;y++) for(let x=0;x<GW;x++){
    if(LV[y][x]<0||SAND[y][x]||reserved(x,y)) continue;
    const r=hash2(x,y,11), l=LV[y][x];
    if(l===2){ if(r<.05) DECO.push({t:'rock',x,y}); continue; }
    if(r<.17){ DECO.push({t:'pine',x,y,k:.8+hash2(x,y,5)*.5}); BLOCK[y][x]=true; }
    else if(r<.215){ DECO.push({t:'bush',x,y}); }
    else if(r<.245){ DECO.push({t:'rock',x,y}); BLOCK[y][x]=true; }
    else if(r<.37){ DECO.push({t:'flower',x,y,c:Math.floor(hash2(x,y,6)*4)}); }
  }
  WORLD.DECO=DECO;
  let minX=1e9,maxX=-1e9,minY=1e9,maxY=-1e9;
  for(let y=0;y<GH;y++) for(let x=0;x<GW;x++) if(LV[y][x]>=0){ const sx=(x-y)*TW/2, sy=(x+y)*TH/2; minX=Math.min(minX,sx);maxX=Math.max(maxX,sx);minY=Math.min(minY,sy);maxY=Math.max(maxY,sy); }
  WORLD.bounds={minX,maxX,minY:minY-120,maxY:maxY+80};
}

/* ---------- drawing helpers ---------- */
let XC=null, ctx=null, CW=0, CH=0, DPR=1, GLOWS=[];
const P=(x,y,z=0)=>[(x-y)*TW/2,(x+y)*TH/2-z];
function poly(pts,fill,stroke,lw){ ctx.beginPath(); pts.forEach(([a,b],i)=>i?ctx.lineTo(a,b):ctx.moveTo(a,b)); ctx.closePath(); if(fill){ctx.fillStyle=fill;ctx.fill();} if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=lw||1;ctx.stroke();} }
function palette(){
  const cs=getComputedStyle(document.documentElement), g=n=>cs.getPropertyValue(n).trim()||'#888888';
  const o={sky1:g('--sky1'),sky2:g('--sky2'),sea1:g('--sea1'),sea2:g('--sea2'),grass:g('--grass'),grass2:g('--grass2'),rock:g('--rock'),rock2:g('--rock2'),sand:g('--sand'),cloud:g('--cloud')};
  o.night=g('--moon-op')==='1'; for(const k in o) if(typeof o[k]==='string'&&!/^#[0-9a-f]{6}$/i.test(o[k])) o[k]='#888888'; return o;
}
function tileColor(x,y){
  const {LV,SAND,PATH}=WORLD, l=LV[y][x], C=EX.C, h=hash2(x,y,2);
  if(PATH[y][x]) return mix('#b9996a',C.grass2,.12+h*.12);
  if(SAND[y][x]) return mix(C.sand,'#ffffff',h*.12);
  let c=mix(C.grass,C.grass2,h*.55); if(l>0) c=tint(c,.07*l); return c;
}
function drawTile(x,y,time){
  const {LV,SAND,lev}=WORLD, l=LV[y][x]; if(l<0) return; const C=EX.C, z=l*ZH;
  const nL=lev(x,y+1), nR=lev(x+1,y), top=[P(x,y,z),P(x+1,y,z),P(x+1,y+1,z),P(x,y+1,z)];
  const sand=SAND[y][x];
  const faceCol=(side)=>sand?mix(C.sand,'#000',side?.32:.22):mix(C.rock,'#000',side?.30:.12);
  if(nL<l){ const zb=nL*ZH; poly([P(x,y+1,z),P(x+1,y+1,z),P(x+1,y+1,zb),P(x,y+1,zb)],faceCol(0)); if(!sand&&l>nL){ ctx.strokeStyle='rgba(0,0,0,.14)';ctx.lineWidth=1; for(let k=1;k<=Math.round((l-nL)*2);k++){ const zz=z-k*ZH*.5; const a=P(x,y+1,zz),b=P(x+1,y+1,zz); ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke(); } } }
  if(nR<l){ const zb=nR*ZH; poly([P(x+1,y,z),P(x+1,y+1,z),P(x+1,y+1,zb),P(x+1,y,zb)],faceCol(1)); }
  poly(top,tileColor(x,y),'rgba(0,0,0,.05)');
  if(!sand&&!WORLD.PATH[y][x]){
    ctx.strokeStyle=shade(C.grass2,.18); ctx.lineWidth=1.4; ctx.lineCap='round';
    for(let k=0;k<3;k++){ const a=hash2(x,y,20+k),b=hash2(x,y,30+k); const [bx,by]=P(x+.15+a*.7,y+.15+b*.7,z); const sw=Math.sin(time*1.6+x+k)*1.2; ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(bx+sw-1.5,by-5); ctx.moveTo(bx+2,by); ctx.lineTo(bx+sw+2,by-4); ctx.stroke(); }
  }
  /* foam where the sea meets the front edges */
  if(nL<0&&nL>-1){ const f=.45+.3*Math.sin(time*1.8+x*.7); ctx.strokeStyle=`rgba(255,255,255,${f})`;ctx.lineWidth=2.4;const a=P(x,y+1,-5),b=P(x+1,y+1,-5);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke(); }
  if(nR<0&&nR>-1){ const f=.45+.3*Math.sin(time*1.8+y*.7+1); ctx.strokeStyle=`rgba(255,255,255,${f})`;ctx.lineWidth=2.4;const a=P(x+1,y,-5),b=P(x+1,y+1,-5);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke(); }
}
function shadowAt(x,y,z,rx,ry,a=.22){ const [sx,sy]=P(x,y,z); ctx.fillStyle=`rgba(0,0,0,${a})`; ctx.beginPath(); ctx.ellipse(sx,sy,rx,ry,0,0,7); ctx.fill(); }
function glow(x,y,z,r,col,a=1){ const [sx,sy]=P(x,y,z); GLOWS.push([sx,sy,r,col,a]); }
function fadeNear(tx,ty,tz){ const D=EX.dr; if(!D) return; const a=P(tx,ty,tz), b=P(D.x,D.y,D.z*ZH); const inFront=(tx+ty)>(D.x+D.y)+.2; ctx.globalAlpha=(inFront&&Math.abs(a[0]-b[0])<46&&a[1]>b[1]&&a[1]-b[1]<80)?.38:1; }
function pine(x,y,k,time,lvl){
  fadeNear(x+.5,y+.5,lvl*ZH);
  const z=lvl*ZH, cx=x+.5, cy=y+.5, [sx,sy]=P(cx,cy,z), sw=Math.sin(time*1.3+x*1.7+y)*1.6*k, C=EX.C;
  shadowAt(cx+.1,cy+.1,z,16*k,7*k);
  ctx.fillStyle='#4a3624'; ctx.fillRect(sx-3*k,sy-12*k,6*k,13*k);
  const cols=['#2d5a3b','#357a4a','#3f8b55'];
  for(let i=0;i<3;i++){ const w=(26-i*6)*k, yb=sy-(8+i*17)*k, h=(26-i*2)*k, off=sw*(i+1)/3; ctx.fillStyle=cols[i]; ctx.beginPath(); ctx.moveTo(sx+off,yb-h); ctx.lineTo(sx+w,yb); ctx.lineTo(sx-w,yb); ctx.closePath(); ctx.fill(); ctx.fillStyle='rgba(255,255,255,.08)'; ctx.beginPath(); ctx.moveTo(sx+off,yb-h); ctx.lineTo(sx+w,yb); ctx.lineTo(sx+w*.2,yb); ctx.closePath(); ctx.fill(); }
  ctx.globalAlpha=1;
}
function bush(x,y,lvl){ const z=lvl*ZH,[sx,sy]=P(x+.5,y+.55,z); shadowAt(x+.55,y+.6,z,12,5); ctx.fillStyle=shade(EX.C.grass2,.25); ctx.beginPath(); ctx.arc(sx-6,sy-6,8,0,7); ctx.arc(sx+6,sy-6,8,0,7); ctx.arc(sx,sy-10,9,0,7); ctx.fill(); ctx.fillStyle='rgba(255,255,255,.1)'; ctx.beginPath(); ctx.arc(sx-2,sy-12,5,0,7); ctx.fill(); }
function rock(x,y,lvl){ const z=lvl*ZH,[sx,sy]=P(x+.5,y+.5,z); shadowAt(x+.55,y+.55,z,15,6); ctx.fillStyle=EX.C.rock2; poly([[sx-14,sy],[sx-10,sy-12],[sx+2,sy-16],[sx+13,sy-8],[sx+15,sy]],EX.C.rock2); poly([[sx+2,sy-16],[sx+13,sy-8],[sx+15,sy],[sx+2,sy-2]],shade(EX.C.rock,.2)); ctx.fillStyle='rgba(255,255,255,.15)'; poly([[sx-10,sy-12],[sx+2,sy-16],[sx-2,sy-8]],'rgba(255,255,255,.18)'); }
function flower(x,y,lvl,c){ const z=lvl*ZH,[sx,sy]=P(x+.3+hash2(x,y,8)*.4,y+.3+hash2(x,y,9)*.4,z); const col=['#fff6e0','#ff9ec2','#ffd36b','#b9a0ff'][c]; ctx.fillStyle='#3b7a4a'; ctx.fillRect(sx-.6,sy-6,1.2,6); ctx.fillStyle=col; ctx.beginPath(); ctx.arc(sx,sy-7,2.6,0,7); ctx.fill(); ctx.fillStyle='#e8a935'; ctx.beginPath(); ctx.arc(sx,sy-7,1,0,7); ctx.fill(); }
/* a simple isometric box; returns nothing, draws left (y+) face, right (x+) face and top */
function box(x0,y0,z0,w,d,h,cTop,cL,cR){
  poly([P(x0,y0+d,z0),P(x0+w,y0+d,z0),P(x0+w,y0+d,z0+h),P(x0,y0+d,z0+h)],cL,'rgba(0,0,0,.25)');
  poly([P(x0+w,y0,z0),P(x0+w,y0+d,z0),P(x0+w,y0+d,z0+h),P(x0+w,y0,z0+h)],cR,'rgba(0,0,0,.25)');
  if(cTop) poly([P(x0,y0,z0+h),P(x0+w,y0,z0+h),P(x0+w,y0+d,z0+h),P(x0,y0+d,z0+h)],cTop,'rgba(0,0,0,.2)');
}
function longhouse(time){
  const [x0,y0,w,d]=KEY.house, z0=WORLD.LV[y0][x0]*ZH, wh=34, rh=34, night=EX.C.night;
  shadowAt(x0+w/2+.2,y0+d/2+.2,z0,w*38,d*20,.2);
  box(x0,y0,z0,w,d,wh,null,'#a47a4a','#7d5a34');
  ctx.strokeStyle='rgba(60,36,16,.55)'; ctx.lineWidth=1.4;
  for(let k=1;k<5;k++){ const zz=z0+k*wh/5; let a=P(x0,y0+d,zz),b=P(x0+w,y0+d,zz); ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke(); a=P(x0+w,y0,zz);b=P(x0+w,y0+d,zz); ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke(); }
  /* door + shields + windows on the long face */
  const door=[[x0+w*.42,y0+d],[x0+w*.58,y0+d]]; poly([P(door[0][0],door[0][1],z0),P(door[1][0],door[1][1],z0),P(door[1][0],door[1][1],z0+24),P(door[0][0],door[0][1],z0+24)],'#3b2a1a','#24170c',1.5);
  const sh=[['#d9531e',.14],['#2f62b8',.28],['#e8a935',.72],['#3f8a4a',.86]];
  for(const [c,u] of sh){ const [sx,sy]=P(x0+w*u,y0+d,z0+18); ctx.fillStyle=c; ctx.beginPath(); ctx.ellipse(sx,sy,6.5,6.5*.9,0,0,7); ctx.fill(); ctx.strokeStyle='#4a3624'; ctx.lineWidth=1.6; ctx.stroke(); ctx.fillStyle='#4a3624'; ctx.beginPath(); ctx.arc(sx,sy,1.8,0,7); ctx.fill(); }
  const wg=night?'#ffd36b':'#e9c987'; const [wx,wy]=P(x0+w,y0+d*.5,z0+20); ctx.fillStyle=wg; ctx.fillRect(wx-3,wy-6,8,10);
  if(night){ glow(x0+w*.5,y0+d,z0+10,70,'255,200,110',.9); glow(x0+w,y0+d*.5,z0+18,40,'255,200,110',.7); }
  /* turf roof with a gable at the right-hand end */
  const zr=z0+wh, ym=y0+d/2, o=.18;
  poly([P(x0+w,y0-o,zr),P(x0+w,y0+d+o,zr),P(x0+w,ym,zr+rh)],'#8d6a3d','rgba(0,0,0,.3)');
  poly([P(x0-o,y0+d+o,zr-3),P(x0+w+o,y0+d+o,zr-3),P(x0+w+o,ym,zr+rh),P(x0-o,ym,zr+rh)],'#5d8a45','rgba(0,0,0,.3)',1.5);
  ctx.strokeStyle='rgba(30,60,20,.45)'; ctx.lineWidth=1.2; for(let k=1;k<4;k++){ const u=k/4; const a=P(x0-o,y0+d+o-(d/2+o)*u,zr-3+(rh+3)*u), b=P(x0+w+o,y0+d+o-(d/2+o)*u,zr-3+(rh+3)*u); ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke(); }
  ctx.strokeStyle='#4a3624'; ctx.lineWidth=4.5; ctx.lineCap='round'; let a=P(x0-o,ym,zr+rh),b=P(x0+w+o+.25,ym,zr+rh); ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
  /* crossed gable beams ending in little carved heads */
  const [gx,gy]=P(x0+w+.25,ym,zr+rh); ctx.lineWidth=3.6; ctx.beginPath(); ctx.moveTo(gx-16,gy+10); ctx.quadraticCurveTo(gx,gy-10,gx+14,gy-22); ctx.moveTo(gx-16,gy-14); ctx.quadraticCurveTo(gx,gy-4,gx+12,gy+10); ctx.stroke(); ctx.fillStyle='#4a3624'; ctx.beginPath(); ctx.arc(gx+14,gy-22,3.6,0,7); ctx.arc(gx+12,gy+10,3.6,0,7); ctx.fill();
  /* chimney smoke */
  const [cx,cy]=P(x0+w*.3,ym,zr+rh+6); ctx.fillStyle='#4a3624'; ctx.fillRect(cx-4,cy-6,8,12);
  for(let k=0;k<4;k++){ const ph=((time*.35+k/4)%1); ctx.fillStyle=`rgba(235,235,235,${.5*(1-ph)})`; ctx.beginPath(); ctx.arc(cx+ph*14+Math.sin(time+k)*3,cy-8-ph*46,4+ph*8,0,7); ctx.fill(); }
}
function tower(time,owned){
  const [tx,ty]=KEY.tower, z0=WORLD.LV[ty][tx]*ZH, night=EX.C.night;
  shadowAt(tx+.6,ty+.6,z0,34,14,.22);
  const e=.12; box(tx+e,ty+e,z0,.76,.76,78,null,'#9b8b73','#7c6e5a');
  ctx.strokeStyle='rgba(0,0,0,.22)'; ctx.lineWidth=1; for(let k=1;k<7;k++){ const zz=z0+k*11; let a=P(tx+e,ty+.88,zz),b=P(tx+.88,ty+.88,zz); ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke(); a=P(tx+.88,ty+e,zz);b=P(tx+.88,ty+.88,zz);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke(); }
  box(tx,ty,z0+78,.88+.12,.88+.12,9,'#8a7a64','#6d5f4d','#574b3c');
  const zr=z0+87, apex=P(tx+.5,ty+.5,zr+44);
  poly([P(tx-.02,ty+1.02,zr),P(tx+1.02,ty+1.02,zr),apex],'#b5533a','rgba(0,0,0,.3)',1.4);
  poly([P(tx+1.02,ty-.02,zr),P(tx+1.02,ty+1.02,zr),apex],'#8f3f2b','rgba(0,0,0,.3)',1.4);
  const [wx,wy]=P(tx+.88,ty+.5,z0+56); ctx.fillStyle=night?'#ffd36b':'#2b3a44'; ctx.beginPath(); ctx.ellipse(wx+1,wy,3.5,6,0,0,7); ctx.fill(); if(night) glow(tx+.88,ty+.5,z0+56,46,'255,200,110',.8);
  /* flag */
  ctx.strokeStyle='#4a3624'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(apex[0],apex[1]); ctx.lineTo(apex[0],apex[1]-26); ctx.stroke();
  const fw=Math.sin(time*3)*3; ctx.fillStyle='#e4572e'; ctx.beginPath(); ctx.moveTo(apex[0],apex[1]-26); ctx.quadraticCurveTo(apex[0]+12,apex[1]-28+fw,apex[0]+22,apex[1]-22+fw); ctx.quadraticCurveTo(apex[0]+12,apex[1]-20+fw,apex[0],apex[1]-14); ctx.fill();
}
function plotSign(x,y,lvl,label){ const z=lvl*ZH; poly([P(x+.1,y+.1,z),P(x+.9,y+.1,z),P(x+.9,y+.9,z),P(x+.1,y+.9,z)],'rgba(110,80,46,.55)'); const [sx,sy]=P(x+.5,y+.55,z); ctx.fillStyle='#6b4b2a'; ctx.fillRect(sx-1.5,sy-22,3,22); ctx.fillStyle='#a47a4a'; ctx.fillRect(sx-10,sy-30,20,11); ctx.strokeStyle='#4a3624'; ctx.lineWidth=1.4; ctx.strokeRect(sx-10,sy-30,20,11); ctx.fillStyle='#4a3624'; ctx.font='bold 9px Lexend,sans-serif'; ctx.textAlign='center'; ctx.fillText(label,sx,sy-21.5); }
function campfire(x,y,lvl,time){ const z=lvl*ZH,[sx,sy]=P(x+.5,y+.5,z); shadowAt(x+.5,y+.55,z,22,9); ctx.fillStyle='#8a8a82'; for(let k=0;k<8;k++){ const a=k/8*6.283; ctx.beginPath(); ctx.ellipse(sx+Math.cos(a)*17,sy+Math.sin(a)*8,5,3.4,0,0,7); ctx.fill(); }
  ctx.strokeStyle='#6b4b2a'; ctx.lineWidth=5; ctx.lineCap='round'; ctx.beginPath(); ctx.moveTo(sx-12,sy+2); ctx.lineTo(sx+12,sy-4); ctx.moveTo(sx-12,sy-4); ctx.lineTo(sx+12,sy+2); ctx.stroke();
  const f=1+Math.sin(time*9)*.1+Math.sin(time*13.3)*.06; ctx.fillStyle='#ff8a3d'; ctx.beginPath(); ctx.moveTo(sx,sy-2); ctx.bezierCurveTo(sx-14,sy-14,sx-6,sy-30*f,sx,sy-44*f); ctx.bezierCurveTo(sx+8,sy-30*f,sx+16,sy-14,sx,sy-2); ctx.fill(); ctx.fillStyle='#ffd36b'; ctx.beginPath(); ctx.moveTo(sx,sy-4); ctx.bezierCurveTo(sx-7,sy-12,sx-3,sy-22*f,sx,sy-30*f); ctx.bezierCurveTo(sx+4,sy-22*f,sx+8,sy-12,sx,sy-4); ctx.fill();
  for(let k=0;k<5;k++){ const ph=((time*.5+k*.21)%1); ctx.fillStyle=`rgba(255,190,90,${1-ph})`; ctx.beginPath(); ctx.arc(sx+Math.sin(k*3+time)*10,sy-20-ph*54,1.6,0,7); ctx.fill(); }
  glow(x+.5,y+.5,lvl*ZH+8,EX.C.night?120:60,'255,160,70',EX.C.night?1:.5); }
function banner(x,y,lvl,time){ const z=lvl*ZH,[sx,sy]=P(x+.5,y+.5,z); shadowAt(x+.55,y+.55,z,8,4); ctx.fillStyle='#6b4b2a'; ctx.fillRect(sx-2,sy-86,4,86); const w=Math.sin(time*2.4)*4; ctx.fillStyle='#d9531e'; ctx.beginPath(); ctx.moveTo(sx+2,sy-82); ctx.quadraticCurveTo(sx+22,sy-90+w,sx+40,sy-82); ctx.lineTo(sx+40,sy-48); ctx.lineTo(sx+21,sy-56-w); ctx.lineTo(sx+2,sy-48); ctx.closePath(); ctx.fill(); ctx.strokeStyle='#ffd36b'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(sx+10,sy-72); ctx.lineTo(sx+32,sy-72); ctx.moveTo(sx+10,sy-64); ctx.lineTo(sx+28,sy-64); ctx.stroke(); ctx.fillStyle='#ffd36b'; ctx.beginPath(); ctx.arc(sx,sy-88,4,0,7); ctx.fill(); }
function lantern(x,y,lvl,time){ const z=lvl*ZH,[sx,sy]=P(x+.5,y+.5,z); shadowAt(x+.55,y+.55,z,8,4); ctx.fillStyle='#3a4650'; ctx.fillRect(sx-2,sy-56,4,56); ctx.fillStyle='#2b343c'; ctx.beginPath(); ctx.moveTo(sx-10,sy-58); ctx.lineTo(sx+10,sy-58); ctx.lineTo(sx+6,sy-48); ctx.lineTo(sx-6,sy-48); ctx.fill(); const f=1+Math.sin(time*8)*.1; ctx.fillStyle='#ff8a3d'; ctx.beginPath(); ctx.moveTo(sx,sy-58); ctx.bezierCurveTo(sx-8,sy-68,sx-4,sy-74*f,sx,sy-84*f); ctx.bezierCurveTo(sx+5,sy-74*f,sx+8,sy-68,sx,sy-58); ctx.fill(); ctx.fillStyle='#ffd36b'; ctx.beginPath(); ctx.arc(sx,sy-64,3.4,0,7); ctx.fill(); glow(x+.5,y+.5,lvl*ZH+60,EX.C.night?90:34,'255,180,90',EX.C.night?1:.4); }
function dock(time){
  const [dx,dy]=KEY.dock;
  for(let k=1;k<=3;k++){ const y=dy+k; poly([P(dx+.18,y,0),P(dx+.82,y,0),P(dx+.82,y+1,0),P(dx+.18,y+1,0)],'#a47a4a','rgba(60,36,16,.6)',1.4); ctx.strokeStyle='rgba(60,36,16,.4)'; ctx.lineWidth=1; for(let j=1;j<4;j++){ const a=P(dx+.18,y+j/4,0),b=P(dx+.82,y+j/4,0); ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke(); }
    for(const u of [.18,.82]){ const a=P(dx+u,y+.5,0); ctx.fillStyle='#6b4b2a'; ctx.fillRect(a[0]-2,a[1]-1,4,22); } }
}
function longship(time){
  const [dx,dy]=KEY.dock, bob=Math.sin(time*1.6)*2.5; const [sx,sy]=P(dx+2.1,dy+3.2,-4); ctx.save(); ctx.translate(sx,sy+bob); ctx.rotate(Math.sin(time*1.1)*.03); shadowAt(0,0,0,0,0,0);
  ctx.fillStyle='rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(0,8,62,10,0,0,7); ctx.fill();
  ctx.fillStyle='#8d5a2b'; ctx.strokeStyle='#3a2415'; ctx.lineWidth=2.4; ctx.beginPath(); ctx.moveTo(-64,-16); ctx.quadraticCurveTo(-58,0,-34,6); ctx.lineTo(36,6); ctx.quadraticCurveTo(60,0,66,-16); ctx.quadraticCurveTo(40,-4,0,-4); ctx.quadraticCurveTo(-40,-4,-64,-16); ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.strokeStyle='#8d5a2b'; ctx.lineWidth=6; ctx.beginPath(); ctx.moveTo(-64,-16); ctx.quadraticCurveTo(-70,-30,-60,-38); ctx.stroke(); ctx.fillStyle='#8d5a2b'; ctx.beginPath(); ctx.arc(-58,-40,5,0,7); ctx.fill();
  ctx.fillStyle='#3a2415'; ctx.fillRect(-2,-70,4,66); ctx.fillStyle='#efe3c4'; ctx.fillRect(2,-66,42,38); ctx.strokeStyle='#3a2415'; ctx.lineWidth=2; ctx.strokeRect(2,-66,42,38); ctx.fillStyle='#c8451a'; ctx.fillRect(2,-66,14,38); ctx.fillRect(30,-66,14,38);
  for(let k=0;k<6;k++){ ctx.fillStyle=['#d9531e','#2f62b8'][k%2]; ctx.beginPath(); ctx.arc(-40+k*14,-6,4.4,0,7); ctx.fill(); }
  ctx.restore();
}
function nest(x,y,lvl,time){
  const z=lvl*ZH,[sx,sy]=P(x+.5,y+.5,z); ctx.fillStyle='#c9a96a'; ctx.beginPath(); ctx.ellipse(sx,sy,26,13,0,0,7); ctx.fill(); ctx.fillStyle='#a9874c'; ctx.beginPath(); ctx.ellipse(sx,sy+1,18,8.5,0,0,7); ctx.fill();
  for(let k=0;k<10;k++){ const a=k/10*6.283; const px=sx+Math.cos(a)*29, py=sy+Math.sin(a)*14.5; ctx.fillStyle=k%2?'#8b8a82':'#9c9b92'; ctx.beginPath(); ctx.ellipse(px,py,7,5,0,0,7); ctx.fill(); ctx.fillStyle='rgba(255,255,255,.18)'; ctx.beginPath(); ctx.ellipse(px-1,py-1.6,4,2,0,0,7); ctx.fill(); }
  ctx.strokeStyle='rgba(120,84,40,.8)'; ctx.lineWidth=1.4; for(let k=0;k<12;k++){ const a=k*2.4; ctx.beginPath(); ctx.moveTo(sx+Math.cos(a)*8,sy+Math.sin(a)*4); ctx.lineTo(sx+Math.cos(a)*17,sy+Math.sin(a)*8); ctx.stroke(); }
  glow(x+.5,y+.5,lvl*ZH+4,EX.C.night?70:26,'255,190,110',.5);
}
function shard(sh,time){
  const z=WORLD.lev(sh.x,sh.y)*ZH, bob=Math.sin(time*2+sh.x)*3, [sx,sy]=P(sh.x+.5,sh.y+.5,z);
  shadowAt(sh.x+.5,sh.y+.5,z,9,4,.2);
  const p=.5+.5*Math.sin(time*3+sh.y); ctx.fillStyle=`rgba(255,200,100,${.25+.2*p})`; ctx.beginPath(); ctx.arc(sx,sy-18+bob,16+p*3,0,7); ctx.fill();
  const g=ctx.createLinearGradient(sx,sy-34+bob,sx,sy-6+bob); g.addColorStop(0,'#ffe9a8'); g.addColorStop(1,'#ff8a3d');
  poly([[sx,sy-34+bob],[sx+9,sy-20+bob],[sx,sy-6+bob],[sx-9,sy-20+bob]],g,'#a8461a',1.5); poly([[sx,sy-34+bob],[sx+9,sy-20+bob],[sx,sy-20+bob]],'rgba(255,255,255,.35)');
  ctx.fillStyle='#fff'; const t=(time*1.4+sh.x)%1; ctx.globalAlpha=1-t; ctx.beginPath(); ctx.arc(sx+10*t,sy-34+bob-8*t,1.8,0,7); ctx.fill(); ctx.globalAlpha=1;
  glow(sh.x+.5,sh.y+.5,z+16,40,'255,190,90',.6);
}

/* ---------- the dragon ---------- */
function makeSprite(mood){
  let svg=dragonSVG(S.dragon,{mood,stage:dragonStage(),wear:S.inv.wear,uid:'ex'+mood});
  svg=svg.replace('<svg class="dragon"','<svg xmlns="http://www.w3.org/2000/svg" width="240" height="230"');
  const img=new Image(); img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(svg); return img;
}
function drawDragon(time){
  const D=EX.dr, z=D.z*ZH, [sx,sy]=P(D.x,D.y,z), moving=D.path.length>0;
  shadowAt(D.x,D.y,z,26,10,.28);
  const bob=moving?-Math.abs(Math.sin(time*9))*6:Math.sin(time*2)*1.6, sq=moving?1+Math.sin(time*9)*.03:1;
  const img=(EX.cheer>time)?EX.sprCheer:EX.sprHappy; if(!img||!img.complete||!img.naturalWidth) return;
  const s=.5*(1+dragonStage()*.04); ctx.save(); ctx.translate(sx,sy+bob); ctx.scale(D.flip?-s*sq:s*sq,s/sq); ctx.drawImage(img,-120,-208,240,230); ctx.restore();
}

/* ---------- main loop ---------- */
function frame(ts){
  if(!EX.on||screen!=='explore'){EX.raf=0;return;}
  const time=(ts-EX.t0)/1000, dt=Math.min(.05,(ts-(EX.last||ts))/1000); EX.last=ts;
  update(dt,time); draw(time); EX.raf=requestAnimationFrame(frame);
}
function update(dt,time){
  const D=EX.dr;
  if(D.path.length){
    const [tx,ty]=D.path[0], cx=tx+.5, cy=ty+.5, dx=cx-D.x, dy=cy-D.y, dist=Math.hypot(dx,dy), step=3.6*dt;
    const sdx=(dx-dy); if(Math.abs(sdx)>.01) D.flip=sdx<0;
    if(dist<=step){ D.x=cx; D.y=cy; D.path.shift(); D.z=WORLD.lev(tx,ty); if(!D.path.length) arrive(); }
    else { D.x+=dx/dist*step; D.y+=dy/dist*step; const nz=WORLD.lev(tx,ty); D.z+=(nz-D.z)*Math.min(1,dt*8); }
  }
  /* collect shards */
  for(const sh of EX.shards){ if(sh.got) continue; if(Math.hypot(D.x-(sh.x+.5),D.y-(sh.y+.5))<.75) collectShard(sh,time); }
  /* camera follows unless the player has dragged it away */
  const [tx,ty]=P(D.x,D.y,D.z*ZH-30);
  if(EX.follow){ EX.cam.x+=(tx-EX.cam.x)*Math.min(1,dt*3.2); EX.cam.y+=(ty-EX.cam.y)*Math.min(1,dt*3.2); }
  clampCam();
  if(EX.bubbleUntil&&time>EX.bubbleUntil){ EX.bubbleUntil=0; const b=$('#xbubble'); if(b) b.hidden=true; }
}
function clampCam(){ const b=WORLD.bounds,c=EX.cam; c.x=Math.max(b.minX-60,Math.min(b.maxX+60,c.x)); c.y=Math.max(b.minY,Math.min(b.maxY,c.y)); }
function say(text,time){ const b=$('#xbubble'); if(!b) return; b.textContent=text; b.hidden=false; EX.bubbleUntil=(performance.now()-EX.t0)/1000+4.2; }
function arrive(){
  const o=EX.pending; EX.pending=null; if(!o) return;
  say(o.text()); Audio_.fx('pop');
}
function collectShard(sh,time){
  sh.got=true; S.explore.found.push(sh.i); S.embers+=1; saveState(); Audio_.fx('good'); EX.cheer=time+1.2;
  const n=S.explore.found.length; const f=$('#xfound'); if(f) f.textContent=`Shards ${n} of ${SHARDS}`; const em=$('#xemb'); if(em) em.textContent=S.embers;
  if(n===SHARDS&&!S.explore.bonus){ S.explore.bonus=true; S.embers+=3; saveState(); if(em) em.textContent=S.embers; Audio_.fx('fanfare'); say(`You found every shard! ${S.dragon.name} is so happy. +3 bonus embers.`); }
  else say(pick([`An ember shard! +1`,`Look at it glow! +1`,`Ooh, shiny. +1`]));
}
function drawSky(w,h,time){
  const C=EX.C, hor=h*.2;
  const g=ctx.createLinearGradient(0,0,0,hor+40); g.addColorStop(0,C.sky1); g.addColorStop(1,C.sky2); ctx.fillStyle=g; ctx.fillRect(0,0,w,hor+40);
  /* sun or moon */
  const sx=w*.78+(EX.cam.x*-.02), sy=hor*.62; if(C.night){ ctx.fillStyle='#f4f1d8'; ctx.beginPath(); ctx.arc(sx,sy,24,0,7); ctx.fill(); ctx.fillStyle='rgba(255,255,255,.7)'; for(let k=0;k<26;k++){ ctx.fillRect(hash2(k,1,4)*w,hash2(k,2,4)*hor*.8,1.6,1.6); } } else { ctx.fillStyle='rgba(255,226,150,.35)'; ctx.beginPath(); ctx.arc(sx,sy,54,0,7); ctx.fill(); ctx.fillStyle='#ffe3a0'; ctx.beginPath(); ctx.arc(sx,sy,30,0,7); ctx.fill(); }
  /* distant mountains, drifting a little with the camera */
  for(let L=0;L<2;L++){ ctx.fillStyle=mix(C.rock,C.sky2,L?.25:.5); ctx.beginPath(); ctx.moveTo(0,hor+30); const par=EX.cam.x*(.03+L*.03); for(let x=-40;x<=w+40;x+=40){ const hh=(L?34:52)*(.5+hash2(Math.floor((x+par*8)/40),L,9)*.9); ctx.lineTo(x-par%40,hor+30-hh); } ctx.lineTo(w+40,hor+30); ctx.closePath(); ctx.fill(); }
  /* clouds */
  ctx.fillStyle=C.night?'rgba(130,130,170,.5)':'rgba(255,255,255,.7)'; for(let k=0;k<4;k++){ const cx=((time*8+k*w/3.5)%(w+260))-130, cy=hor*(.2+.18*k%.5); ctx.beginPath(); ctx.ellipse(cx,cy,70,12,0,0,7); ctx.ellipse(cx+40,cy-8,40,11,0,0,7); ctx.fill(); }
  /* gulls */
  ctx.strokeStyle=C.night?'rgba(220,220,240,.6)':'rgba(40,40,60,.55)'; ctx.lineWidth=1.6; for(let k=0;k<3;k++){ const gx=((time*26+k*220)%(w+100))-50, gy=hor*.5+Math.sin(time*.8+k*2)*18+k*14, fl=Math.sin(time*6+k)*4; ctx.beginPath(); ctx.moveTo(gx-8,gy-fl); ctx.quadraticCurveTo(gx-3,gy-4,gx,gy); ctx.quadraticCurveTo(gx+3,gy-4,gx+8,gy-fl); ctx.stroke(); }
}
function draw(time){
  const C=EX.C, w=CW, h=CH, Z=EX.zoom;
  ctx.setTransform(DPR,0,0,DPR,0,0);
  const sg=ctx.createLinearGradient(0,0,0,h); sg.addColorStop(0,C.sea1); sg.addColorStop(1,C.sea2); ctx.fillStyle=sg; ctx.fillRect(0,0,w,h);
  drawSky(w,h,time);
  /* world */
  ctx.save(); ctx.translate(w/2,h*.56); ctx.scale(Z,Z); ctx.translate(-EX.cam.x,-EX.cam.y);
  GLOWS=[];
  /* shallow water and sparkles */
  const {LV,NEAR}=WORLD, view={x0:EX.cam.x-w/2/Z-80,x1:EX.cam.x+w/2/Z+80,y0:EX.cam.y-h*.56/Z-140,y1:EX.cam.y+h*.44/Z+140};
  const vis=(x,y,z=0)=>{const [sx,sy]=P(x,y,z);return sx>view.x0&&sx<view.x1&&sy>view.y0&&sy<view.y1;};
  for(let y=0;y<GH;y++) for(let x=0;x<GW;x++){ if(LV[y][x]>=0||!(NEAR[y][x]||LV[y][x]===-2)||!vis(x,y)) continue; const pond=LV[y][x]===-2; const [sx,sy]=P(x+.5,y+.5,-6); const wob=.06*Math.sin(time*1.2+x*.8+y*.6); const g=ctx.createRadialGradient(sx,sy,0,sx,sy,TW*.62); const col=pond?'127,208,200':'159,227,220'; g.addColorStop(0,`rgba(${col},${(pond?.8:.5)+wob})`); g.addColorStop(1,`rgba(${col},0)`); ctx.fillStyle=g; ctx.save(); ctx.translate(sx,sy); ctx.scale(1,.5); ctx.translate(-sx,-sy); ctx.beginPath(); ctx.arc(sx,sy,TW*.62,0,7); ctx.fill(); ctx.restore(); }
  ctx.strokeStyle='rgba(255,255,255,.35)'; ctx.lineWidth=1.6; ctx.lineCap='round';
  for(let k=0;k<70;k++){ const bx=view.x0+hash2(k,3,7)*(view.x1-view.x0), by=view.y0+hash2(k,4,7)*(view.y1-view.y0); const a=Math.sin(time*1.5+k*2.1); if(a<.2) continue; ctx.globalAlpha=(a-.2)*.8; ctx.beginPath(); ctx.moveTo(bx-6,by); ctx.lineTo(bx+6,by); ctx.stroke(); } ctx.globalAlpha=1;
  /* fish jump */
  if(EX.fish&&time-EX.fish.t<.9){ const f=EX.fish, ph=(time-f.t)/.9, [fx,fy]=P(f.x+.5,f.y+.5,-6); ctx.fillStyle='#d9e8f2'; ctx.beginPath(); ctx.ellipse(fx+ph*20-10,fy-Math.sin(ph*3.14)*26,5,2.4,-.6+ph*1.4,0,7); ctx.fill(); ctx.strokeStyle='rgba(255,255,255,.7)'; ctx.lineWidth=1.6; ctx.beginPath(); ctx.ellipse(fx,fy,6+ph*14,2.5+ph*5,0,0,7); ctx.stroke(); }
  else if(!EX.fish||time-EX.fish.t>3.6){ const c=WORLD.fishSpots||(WORLD.fishSpots=[]); if(!c.length) for(let y=0;y<GH;y++) for(let x=0;x<GW;x++) if(NEAR[y][x]) c.push([x,y]); const s=c[Math.floor(Math.random()*c.length)]; EX.fish={x:s[0],y:s[1],t:time}; }
  /* ground and things standing on it, back to front */
  const buckets={}, push=(d,fn)=>{(buckets[d]||(buckets[d]=[])).push(fn);};
  const own=id=>S.inv.decor.includes(id);
  for(const o of WORLD.DECO){ const l=LV[o.y][o.x]; const d=o.x+o.y; if(o.t==='pine') push(d,()=>pine(o.x,o.y,o.k,time,l)); else if(o.t==='bush') push(d,()=>bush(o.x,o.y,l)); else if(o.t==='rock') push(d,()=>rock(o.x,o.y,l)); else push(d,()=>flower(o.x,o.y,l,o.c)); }
  const hs=KEY.house; push(hs[0]+hs[2]-1+hs[1]+hs[3]-1,()=>{ fadeNear(hs[0]+hs[2]-.5,hs[1]+hs[3]-.5,0); longhouse(time); ctx.globalAlpha=1; });
  push(KEY.tower[0]+KEY.tower[1],()=>{ if(own('tower')){ fadeNear(KEY.tower[0]+.5,KEY.tower[1]+.8,2*ZH); tower(time); ctx.globalAlpha=1; } else plotSign(KEY.tower[0],KEY.tower[1],2,'tower'); });
  const plots=[['campfire','fire',campfire],['banner','flag',banner],['lantern','lamp',lantern]];
  for(const [id,lab,fn] of plots){ const k=KEY[id]; push(k[0]+k[1],()=>{ if(own(id)) fn(k[0],k[1],LV[k[1]][k[0]],time); else plotSign(k[0],k[1],LV[k[1]][k[0]],lab); }); }
  push(KEY.pines[0]+KEY.pines[1],()=>{ if(own('pines')){ pine(KEY.pines[0],KEY.pines[1],1.25,time,0); pine(KEY.pines[0]+.0,KEY.pines[1]+1,1.05,time,0); } else plotSign(KEY.pines[0],KEY.pines[1],0,'trees'); });
  push(KEY.plaza[0]+KEY.plaza[1],()=>nest(KEY.plaza[0],KEY.plaza[1],0,time));
  for(const sh of EX.shards) if(!sh.got) push(sh.x+sh.y,()=>shard(sh,time));
  for(let d=0;d<GW+GH;d++){
    for(let x=Math.max(0,d-GH+1);x<=Math.min(GW-1,d);x++){ const y=d-x; if(LV[y][x]>=0&&vis(x,y,LV[y][x]*ZH)) drawTile(x,y,time); }
    if(d===KEY.dock[0]+KEY.dock[1]+1){ dock(time); }
    if(buckets[d]) for(const fn of buckets[d]) fn();
    const dd=EX.dr; if(Math.floor(dd.x+dd.y-1)===d||(d===0&&dd.x+dd.y<1)) drawDragon(time);
  }
  if(own('jetty')) longship(time);
  /* water in front of the island is already drawn; butterflies */
  if(!C.night){ for(let k=0;k<5;k++){ const bx=KEY.plaza[0]+Math.sin(time*.4+k*1.7)*7+k-2, by=KEY.plaza[1]+Math.cos(time*.33+k*2.3)*5; const [sx,sy]=P(bx,by,34+Math.sin(time*2+k)*6); const fl=Math.abs(Math.sin(time*14+k))*5; ctx.fillStyle=['#ff9ec2','#ffd36b','#b9a0ff','#ffffff','#ff9ec2'][k]; ctx.beginPath(); ctx.ellipse(sx-2,sy,fl+1,3,0,0,7); ctx.ellipse(sx+2,sy,fl+1,3,0,0,7); ctx.fill(); } }
  ctx.restore();
  /* evening tint, then lights on top */
  if(C.night){ ctx.fillStyle='rgba(8,16,48,.36)'; ctx.fillRect(0,0,w,h); }
  if(GLOWS.length){ ctx.save(); ctx.translate(w/2,h*.56); ctx.scale(Z,Z); ctx.translate(-EX.cam.x,-EX.cam.y); ctx.globalCompositeOperation='lighter'; for(const [gx,gy,r,col,a] of GLOWS){ const g=ctx.createRadialGradient(gx,gy,0,gx,gy,r); g.addColorStop(0,`rgba(${col},${.5*a})`); g.addColorStop(1,`rgba(${col},0)`); ctx.fillStyle=g; ctx.fillRect(gx-r,gy-r,r*2,r*2); } ctx.restore(); }
  /* soft vignette so the edges feel cinematic */
  const vg=ctx.createRadialGradient(w/2,h/2,Math.min(w,h)*.45,w/2,h/2,Math.max(w,h)*.78); vg.addColorStop(0,'rgba(0,0,0,0)'); vg.addColorStop(1,'rgba(10,20,30,.28)'); ctx.fillStyle=vg; ctx.fillRect(0,0,w,h);
}

/* ---------- input ---------- */
function screenToWorld(px,py){ const Z=EX.zoom; return [(px-CW/2)/Z+EX.cam.x,(py-CH*.56)/Z+EX.cam.y]; }
function tileAt(px,py){
  const [wx,wy]=screenToWorld(px,py), {LV,lev,DOCK}=WORLD;
  for(let d=GW+GH-2;d>=0;d--) for(let x=Math.max(0,d-GH+1);x<=Math.min(GW-1,d);x++){ const y=d-x; const l=DOCK[x+','+y]?0:LV[y][x]; if(l<0) continue; const z=l*ZH; const a=P(x,y,z),b=P(x+1,y,z),c=P(x+1,y+1,z),e=P(x,y+1,z);
    const cx=(a[0]+c[0])/2, cy=(a[1]+c[1])/2; if(Math.abs(wx-cx)/(TW/2)+Math.abs(wy-cy)/(TH/2)<=1) return [x,y]; }
  return null;
}
function objectAt(px,py){
  const [wx,wy]=screenToWorld(px,py), D=S.dragon.name, own=id=>S.inv.decor.includes(id);
  const hit=(tx,ty,tz,w,h,dx=0)=>{ const [sx,sy]=P(tx,ty,tz); return wx>sx-w/2+dx&&wx<sx+w/2+dx&&wy>sy-h&&wy<sy+12; };
  const list=[];
  for(const sh of EX.shards) if(!sh.got&&hit(sh.x+.5,sh.y+.5,WORLD.lev(sh.x,sh.y)*ZH,34,40)) return {tile:[sh.x,sh.y],text:()=>'An ember shard!'};
  const [hx,hy,hw,hd]=KEY.house; if(hit(hx+hw/2,hy+hd/2+.2,0,hw*58,100)) return {tile:KEY.door,text:()=>`${D}'s longhouse. It is warm inside and smells of smoked fish.`};
  if(hit(KEY.tower[0]+.5,KEY.tower[1]+.5,2*ZH,60,150)) return {tile:[KEY.tower[0],KEY.tower[1]+1],text:()=>own('tower')?'The lookout tower. You can see the whole sea from up here!':'A spot for a lookout tower. You can buy one in the Shop.'};
  if(hit(KEY.plaza[0]+.5,KEY.plaza[1]+.5,0,70,28)) return {tile:[KEY.plaza[0],KEY.plaza[1]+1],text:()=>`${D}'s nest. The stones are still warm.`};
  const names={campfire:['campfire','A cosy campfire. Dragons love a warm spot.'],banner:['banner','The island banner, flapping in the wind.'],lantern:['lantern','An iron torch. It lights up the path at dusk.'],pines:['pines','Tall whispery pines.']};
  for(const id in names){ const k=KEY[id]; if(hit(k[0]+.5,k[1]+.5,LV_(k),60,own(id)?100:40)) return {tile:[k[0],k[1]+1],text:()=>own(id)?names[id][1]:`An empty spot. Buy a ${names[id][0]} in the Shop to build it here.`}; }
  const dk=KEY.dock; if(hit(dk[0]+.5,dk[1]+2,0,50,40)) return {tile:[dk[0],dk[1]+3],text:()=>own('jetty')?'The dock. A longship is moored here, ready for adventures.':'The dock. Buy a longship in the Shop!'};
  return null;
}
const LV_=k=>WORLD.LV[k[1]][k[0]]*ZH;
function pathTo(tx,ty){
  const D=EX.dr, sx=Math.floor(D.x), sy=Math.floor(D.y), {walkable,canStep}=WORLD;
  const prev={}, dist={}; const q=[[sx,sy]]; prev[sx+','+sy]=null; dist[sx+','+sy]=0; let best=[sx,sy], bd=Math.hypot(tx-sx,ty-sy);
  while(q.length){ const [x,y]=q.shift(); const dd=Math.hypot(tx-x,ty-y); if(dd<bd-1e-6){bd=dd;best=[x,y];} if(x===tx&&y===ty){best=[x,y];break;}
    for(const [a,b] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){ const nx=x+a,ny=y+b,k=nx+','+ny; if(k in prev||!canStep(x,y,nx,ny)) continue; prev[k]=[x,y]; q.push([nx,ny]); } }
  const out=[]; let c=best; while(c&&!(c[0]===sx&&c[1]===sy)){ out.push(c); c=prev[c[0]+','+c[1]]; } out.reverse(); return out;
}
function goTo(tx,ty,pending){ EX.dr.path=pathTo(tx,ty); EX.pending=pending||null; EX.follow=true; if(!EX.dr.path.length&&pending) arrive(); }
function tap(px,py){
  const o=objectAt(px,py);
  if(o){ goTo(o.tile[0],o.tile[1],{text:o.text}); return; }
  const t=tileAt(px,py); if(t){ goTo(t[0],t[1],null); }
}
function resizeCanvas(){
  const st=$('#stage'); if(!st||!XC) return; const r=st.getBoundingClientRect(); DPR=Math.min(2,window.devicePixelRatio||1);
  CW=Math.max(300,Math.round(r.width)); CH=Math.max(300,Math.round(r.height)); XC.width=CW*DPR; XC.height=CH*DPR; XC.style.width=CW+'px'; XC.style.height=CH+'px';
}
function setZoom(z){ EX.zoom=Math.max(.55,Math.min(1.6,z)); }
function exploreKey(e){
  if(e.key==='Escape'){ exitExplore(); return true; }
  const m={ArrowUp:[0,-1],w:[0,-1],ArrowDown:[0,1],s:[0,1],ArrowLeft:[-1,0],a:[-1,0],ArrowRight:[1,0],d:[1,0]}[e.key]; if(!m) { if(e.key==='+'||e.key==='=') setZoom(EX.zoom+.1); if(e.key==='-') setZoom(EX.zoom-.1); return false; }
  /* screen-relative: up/down/left/right on the screen map to the diagonal grid directions */
  const map={'0,-1':[-1,-1],'0,1':[1,1],'-1,0':[-1,1],'1,0':[1,-1]}[m.join(',')]; const D=EX.dr; const tx=Math.floor(D.x)+map[0], ty=Math.floor(D.y)+map[1];
  if(WORLD.canStep(Math.floor(D.x),Math.floor(D.y),tx,ty)){ EX.dr.path=[[tx,ty]]; EX.pending=null; EX.follow=true; } return true;
}
function shardSpots(){
  const seed=(today().replace(/-/g,'')|0)%100000, cand=[]; const {LV,SAND,BLOCK,PATH}=WORLD;
  for(let y=0;y<GH;y++) for(let x=0;x<GW;x++) if(LV[y][x]>=0&&!BLOCK[y][x]&&!SAND[y][x]&&Math.hypot(x-KEY.plaza[0],y-KEY.plaza[1])>3) cand.push([x,y,hash2(x,y,seed)]);
  cand.sort((a,b)=>a[2]-b[2]); const out=[]; for(const c of cand){ if(out.length>=SHARDS) break; if(out.every(o=>Math.hypot(o.x-c[0],o.y-c[1])>6)) out.push({x:c[0],y:c[1],i:out.length,got:false}); } return out;
}
function enterExplore(){
  buildWorld(); rollDay();
  if(!S.explore||S.explore.date!==today()) S.explore={date:today(),found:[],bonus:false};
  EX.C=palette(); EX.on=true; screen='explore';
  EX.shards=shardSpots(); for(const sh of EX.shards) if(S.explore.found.includes(sh.i)) sh.got=true;
  const sx=KEY.plaza[0], sy=KEY.plaza[1]+1;
  EX.dr=EX.dr||{x:sx+.5,y:sy+.5,z:0,path:[],flip:false};
  EX.dr.x=sx+.5; EX.dr.y=sy+.5; EX.dr.z=0; EX.dr.path=[]; EX.pending=null; EX.follow=true; EX.cheer=0; EX.bubbleUntil=0; EX.fish=null;
  EX.zoom=window.innerWidth<700?.7:.95; const [cx,cy]=P(EX.dr.x,EX.dr.y,0); EX.cam={x:cx,y:cy-30};
  EX.sprHappy=makeSprite('happy'); EX.sprCheer=makeSprite('cheer');
  const n=S.explore.found.length, d=esc(S.dragon.name);
  $('#app').innerHTML=`<div class="screen"><div class="stage explore" id="stage"><canvas id="xcv" aria-label="Your island. Tap a place to fly there, or drag to look around."></canvas>
    <div class="hud"><div class="hud-l"><button class="btn btn-sm xbtn" data-act="explore-exit">${ic('home',18)} Back home</button></div>
    <div class="hud-r"><span class="pill gold num">${ic('ember',18)}<span id="xemb">${S.embers}</span></span><span class="pill num" id="xfound">Shards ${n} of ${SHARDS}</span>
    <button class="btn btn-icon btn-sm xbtn" data-act="xzoom" data-d="1" aria-label="Zoom in">+</button><button class="btn btn-icon btn-sm xbtn" data-act="xzoom" data-d="-1" aria-label="Zoom out">−</button>
    <button class="btn btn-icon btn-sm xbtn" data-act="xcenter" aria-label="Find ${d}">${ic('heart',18)}</button>
    <button class="btn btn-icon btn-sm xbtn" data-act="music" aria-pressed="${S.settings.music}" aria-label="Music" style="${S.settings.music?'':'opacity:.6'}">${ic('music',20)}</button></div></div>
    <div class="bubble" id="xbubble" hidden></div><div class="xhelp">Tap anywhere to fly there. Drag to look around.</div></div></div>`;
  XC=$('#xcv'); ctx=XC.getContext('2d'); resizeCanvas(); EX.t0=performance.now(); EX.last=0;
  const down={};
  XC.addEventListener('pointerdown',e=>{ XC.setPointerCapture(e.pointerId); down.x=e.clientX; down.y=e.clientY; down.cx=EX.cam.x; down.cy=EX.cam.y; down.drag=false; down.on=true; });
  XC.addEventListener('pointermove',e=>{ if(!down.on) return; const dx=e.clientX-down.x, dy=e.clientY-down.y; if(!down.drag&&Math.hypot(dx,dy)>7) down.drag=true; if(down.drag){ EX.follow=false; EX.cam.x=down.cx-dx/EX.zoom; EX.cam.y=down.cy-dy/EX.zoom; } });
  XC.addEventListener('pointerup',e=>{ if(!down.on) return; down.on=false; if(!down.drag){ const r=XC.getBoundingClientRect(); tap(e.clientX-r.left,e.clientY-r.top); } });
  XC.addEventListener('pointercancel',()=>{down.on=false;});
  XC.addEventListener('wheel',e=>{ e.preventDefault(); setZoom(EX.zoom*(e.deltaY<0?1.08:.93)); },{passive:false});
  window.addEventListener('resize',resizeCanvas);
  Audio_.ensure(); say(`Welcome to your island, ${S.dragon.name}!`); if(!EX.raf) EX.raf=requestAnimationFrame(frame);
}
function exitExplore(){ EX.on=false; if(EX.raf){cancelAnimationFrame(EX.raf);EX.raf=0;} window.removeEventListener('resize',resizeCanvas); goHome(); }
