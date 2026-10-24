/* ===== World: fields, painted ground, walk grid ===== */
const T=40, SC=2;
let W=40, H=28, PW=W*T*SC, PH=H*T*SC;
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const rnd=mulberry(20261022);
const lat=new Float32Array(65536); for(let i=0;i<65536;i++) lat[i]=rnd();
const sm=t=>t*t*(3-2*t);
function vn(x,y){const xi=Math.floor(x),yi=Math.floor(y),fx=sm(x-xi),fy=sm(y-yi);
  const x0=xi&255,x1=(xi+1)&255,y0=(yi&255)<<8,y1=((yi+1)&255)<<8;
  const a=lat[y0|x0],b=lat[y0|x1],c=lat[y1|x0],d=lat[y1|x1];
  return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy}
function fbm(x,y){return (vn(x,y)*.5+vn(x*2.03+5.2,y*2.03+1.3)*.25+vn(x*4.1+9.7,y*4.1+3.1)*.125)/.875}
function hash(x,y){let h=(x*374761393+y*668265263)|0;h=(h^(h>>>13))*1274126177|0;return((h^(h>>>16))>>>0)/4294967296}
const clamp=(v,a,b)=>v<a?a:v>b?b:v;
const ss=(a,b,v)=>{const t=clamp((v-a)/(b-a),0,1);return t*t*(3-2*t)};

const ISL={x:20,y:14.2,rx:17.5,ry:11};
function hLandV(x,y){const ex=(x-ISL.x)/ISL.rx,ey=(y-ISL.y)/ISL.ry;
  return 1-Math.sqrt(ex*ex+ey*ey)+(fbm(x*.21+3,y*.21+7)-.5)*.2}
function hRockV(x,y){return 4.9+(fbm(x*.28,y*.28+9)-.5)*3.6-y}
function hPondV(x,y){return 1-Math.sqrt(((x-9)/2.7)**2+((y-17.4)/1.9)**2)+(fbm(x*.5,y*.5)-.5)*.25}
function chanX(y){return 27+(vn(y*.35,11.5)-.5)*1.5}
function hChanV(x,y){return 1-Math.abs(x-chanX(y))/1.25}
const SEGS=[ // x1,y1,x2,y2,halfwidth
 [18,11.4,18,14.8,1.0],[21,15.2,25.2,14.9,.95],[28.8,14.9,31.8,14.4,.95],
 [31.8,14.4,31.8,12.8,.95],[31.9,14.4,32.2,22.2,.85],[32,13.6,35.2,10.6,.8],
 [14.6,15.2,7.6,14.8,.9],[7.6,14.8,7.2,12.4,.9],[18,17.4,18,20.6,.8]];
function segD(px,py,s){const dx=s[2]-s[0],dy=s[3]-s[1];const t=clamp(((px-s[0])*dx+(py-s[1])*dy)/(dx*dx+dy*dy),0,1);
  return Math.hypot(px-(s[0]+dx*t),py-(s[1]+dy*t))}
function segsPath(x,y,SEGS_,plaza){let m=-9;for(const s of SEGS_){const v=1-segD(x,y,s)/s[4];if(v>m)m=v}
  if(!plaza)return m;const pl=1-Math.sqrt(((x-plaza[0])/plaza[2])**2+((y-plaza[1])/plaza[3])**2);
  return Math.max(m,pl)}
function hPathV(x,y){return segsPath(x,y,SEGS,[18,15.3,3.5,2.5])}


/* ---- zones: the home island and the islands you can fly to ---- */
const PAL_HOME={seaA:[96,200,196],seaB:[22,96,134],sand:[226,206,158],gA:[88,138,66],gB:[118,164,78],gdk:.14,rock:[118,112,108],path:[206,172,118],pondA:[88,188,190],pondB:[40,128,150],tuft:['rgba(52,96,46,.55)','rgba(150,196,92,.55)'],flowers:['#fff6df','#ffd25c','#ff9fb4','#a9c7ff','#ffffff','#ffb36b'],foam:1};
const HOME={id:'home',name:'Home Isle',W:40,H:28,landV:hLandV,rockV:hRockV,pondV:hPondV,chanV:hChanV,pathV:hPathV,pal:PAL_HOME,home:true};
let Z=HOME;
const landV=(x,y)=>Z.landV(x,y), rockV=(x,y)=>Z.rockV(x,y), pondV=(x,y)=>Z.pondV(x,y), chanV=(x,y)=>Z.chanV(x,y), pathV=(x,y)=>Z.pathV(x,y);
/* build the field functions for a small island from a handful of numbers */
function mkIsle(c){
  const sx=c.seed||3;
  return {id:c.id,W:c.W,H:c.H,pal:c.pal,
    landV:(x,y)=>{const ex=(x-c.cx)/c.rx,ey=(y-c.cy)/c.ry;return 1-Math.sqrt(ex*ex+ey*ey)+(fbm(x*.21+sx,y*.21+sx*2)-.5)*(c.wob||.2)},
    rockV:(x,y)=>{let m=-9;for(const b of c.rocks||[]){const v=b[2]-Math.hypot(x-b[0],y-b[1])+(fbm(x*.3+sx,y*.3)-.5)*3;if(v>m)m=v}return m},
    pondV:(x,y)=>{let m=-9;for(const p of c.ponds||[]){const v=1-Math.sqrt(((x-p[0])/p[2])**2+((y-p[1])/p[3])**2)+(fbm(x*.5+sx,y*.5)-.5)*.25;if(v>m)m=v}return m},
    chanV:()=>-9,
    pathV:(x,y)=>segsPath(x,y,c.segs||[],c.plaza)};
}
function setZone(z){
  Z=z;W=z.W;H=z.H;PW=W*T*SC;PH=H*T*SC;
  walk.length=0;blocked.length=0;for(let j=0;j<H;j++){walk.push(new Array(W).fill(false));blocked.push(new Array(W).fill(false))}
  WATERSPOTS.length=0;
}

/* ---- paint the ground once ---- */
async function paintGround(onProg){
  const P=Z.pal;
  const base=document.createElement('canvas');base.width=PW;base.height=PH;
  const bc=base.getContext('2d');
  const GS=4,gw=Math.ceil(PW/GS)+2,gh=Math.ceil(PH/GS)+2;
  const FL=new Float32Array(gw*gh),FR=new Float32Array(gw*gh),FP=new Float32Array(gw*gh),FC=new Float32Array(gw*gh),FH=new Float32Array(gw*gh);
  const k=1/(SC*T);
  for(let gy=0;gy<gh;gy++)for(let gx=0;gx<gw;gx++){const x=gx*GS*k,y=gy*GS*k,i=gy*gw+gx;
    FL[i]=landV(x,y);FR[i]=rockV(x,y);FP[i]=pondV(x,y);FC[i]=chanV(x,y);FH[i]=pathV(x,y)}
  const img=bc.createImageData(PW,PH),d32=new Uint32Array(img.data.buffer);
  const mix=(a,b,t)=>a+(b-a)*t;
  let tSlice=performance.now();
  for(let py=0;py<PH;py++){
    if(py%16===0&&performance.now()-tSlice>28){ if(onProg)onProg(py/PH); await new Promise(r=>setTimeout(r,0)); tSlice=performance.now(); }
    const gy=(py/GS)|0,fy=py/GS-gy,y=py*k;
    for(let px=0;px<PW;px++){
      const gx=(px/GS)|0,fx=px/GS-gx,x=px*k,i=gy*gw+gx;
      const w00=(1-fx)*(1-fy),w10=fx*(1-fy),w01=(1-fx)*fy,w11=fx*fy;
      const lv=FL[i]*w00+FL[i+1]*w10+FL[i+gw]*w01+FL[i+gw+1]*w11;
      const rv=FR[i]*w00+FR[i+1]*w10+FR[i+gw]*w01+FR[i+gw+1]*w11;
      const pv=FP[i]*w00+FP[i+1]*w10+FP[i+gw]*w01+FP[i+gw+1]*w11;
      const cv_=FC[i]*w00+FC[i+1]*w10+FC[i+gw]*w01+FC[i+gw+1]*w11;
      const hv=FH[i]*w00+FH[i+1]*w10+FH[i+gw]*w01+FH[i+gw+1]*w11;
      // sea
      const dd=ss(0,1,clamp(-lv/.34,0,1));
      let r=mix(P.seaA[0],P.seaB[0],dd),g=mix(P.seaA[1],P.seaB[1],dd),b=mix(P.seaA[2],P.seaB[2],dd);
      const wav=(vn(x*1.4,y*5.5)-.5)*14;r+=wav*.4;g+=wav;b+=wav*.8;
      if(lv<-.05){d32[py*PW+px]=0xFF000000|((clamp(b,0,255)|0)<<16)|((clamp(g,0,255)|0)<<8)|(clamp(r,0,255)|0);continue}
      const n1=vn(x*2.6,y*2.6),brush=vn(x*10,y*2.4)-.5,fine=hash(px,py)-.5,big=fbm(x*.45,y*.45);
      // sand
      const sw=ss(0,.013,lv);
      let sr=P.sand[0]+brush*26+fine*8,sg=P.sand[1]+brush*24+fine*8,sb=P.sand[2]+brush*22+fine*8;
      sr-=ss(.05,0,lv)*0;
      r=mix(r,sr,sw);g=mix(g,sg,sw);b=mix(b,sb,sw);
      // grass
      const gm=ss(.06,.115,lv+(n1-.5)*.03);
      const gl=mix(0,1,ss(.3,.7,big));
      let gr=mix(P.gA[0],P.gB[0],gl)+brush*26+fine*10-(n1-.5)*10;
      let gg=mix(P.gA[1],P.gB[1],gl)+brush*30+fine*12-(n1-.5)*10;
      let gb=mix(P.gA[2],P.gB[2],gl)+brush*14+fine*8;
      // cliff shadow on grass south of rocks
      const cs=ss(-1.6,0,rv)*(1-ss(0,.2,rv));gr*=1-cs*.34;gg*=1-cs*.3;gb*=1-cs*.2;
      // tree-ish darker meadow patches
      const dk=ss(.62,.8,fbm(x*.33+40,y*.33+8));gr*=1-dk*P.gdk;gg*=1-dk*P.gdk*.6;gb*=1-dk*P.gdk;
      r=mix(r,gr,gm*sw);g=mix(g,gg,gm*sw);b=mix(b,gb,gm*sw);
      // rock
      const rw=ss(-.05,.28,rv)*sw;
      const strata=vn(x*1.8,y*7)-.5;
      let kr=P.rock[0]+strata*34+fine*14+n1*10,kg=P.rock[1]+strata*30+fine*12+n1*8,kb=P.rock[2]+strata*26+fine*10+n1*6;
      const lit=ss(.2,2.2,rv);kr+=lit*14;kg+=lit*14;kb+=lit*12;
      const edge=1-ss(.05,.6,rv);kr*=1-edge*.22;kg*=1-edge*.22;kb*=1-edge*.2;
      r=mix(r,kr,rw);g=mix(g,kg,rw);b=mix(b,kb,rw);
      // pond + channel water
      const pw=ss(0,.09,pv),cw=ss(0,.1,cv_)*sw;
      const rimP=ss(-.2,0,pv)*(1-pw),rimC=ss(-.22,0,cv_)*(1-cw)*sw;
      r*=1-(rimP+rimC)*.18;g*=1-(rimP+rimC)*.12;b*=1-(rimP+rimC)*.1;
      const pd=ss(0,.75,pv);
      const pr=mix(P.pondA[0],P.pondB[0],pd)+wav*.4,pg=mix(P.pondA[1],P.pondB[1],pd)+wav,pb=mix(P.pondA[2],P.pondB[2],pd)+wav*.8;
      r=mix(r,pr,pw);g=mix(g,pg,pw);b=mix(b,pb,pw);
      const cdp=ss(0,.9,cv_);
      const cr=mix(92,44,cdp)+wav*.4,cg=mix(196,140,cdp)+wav,cb=mix(196,160,cdp)+wav*.8;
      r=mix(r,cr,cw);g=mix(g,cg,cw);b=mix(b,cb,cw);
      // foam at the coast
      const fo=Math.exp(-(((lv+.004)/.011)**2))*(.55+.45*vn(x*3,y*3));
      r=mix(r,246,fo*.8);g=mix(g,250,fo*.8);b=mix(b,248,fo*.8);
      // path
      const hw=ss(.02,.3,hv+(n1-.5)*.35)*sw*(1-pw)*(1-cw)*(1-rw);
      const cob=vn(x*5.2,y*5.2);
      let hr=P.path[0]+fine*9+brush*18+(cob-.5)*26,hg=P.path[1]+fine*9+brush*16+(cob-.5)*22,hb=P.path[2]+fine*8+brush*10+(cob-.5)*16;
      const rim=ss(.02,.14,hv)*(1-ss(.14,.3,hv));hr-=rim*18;hg-=rim*20;hb-=rim*20;
      r=mix(r,hr,hw);g=mix(g,hg,hw);b=mix(b,hb,hw);
      d32[py*PW+px]=0xFF000000|((clamp(b,0,255)|0)<<16)|((clamp(g,0,255)|0)<<8)|(clamp(r,0,255)|0);
    }
  }
  bc.putImageData(img,0,0);
  bc.save();bc.scale(SC,SC);
  decals(bc);
  bc.restore();
  return base;
}

/* ---- little hand-placed ground details ---- */
const WATERSPOTS=[];
function isGrass(x,y,m=0){return landV(x,y)>.14&&rockV(x,y)<-.6&&pathV(x,y)<-.25-m&&pondV(x,y)<-.3&&chanV(x,y)<-.4}
function decals(c){
  const r=mulberry(77);
  // grass tufts
  for(let n=0;n<2600;n++){const x=r()*W,y=r()*H;if(!isGrass(x,y))continue;
    const px=x*T,py=y*T,h=3+r()*5,col=r()<.5?Z.pal.tuft[0]:Z.pal.tuft[1];
    c.strokeStyle=col;c.lineWidth=1.2;c.beginPath();
    for(let b=-1;b<=1;b++){c.moveTo(px+b*2,py);c.quadraticCurveTo(px+b*2+b*1.5,py-h*.6,px+b*3.4,py-h)}
    c.stroke()}
  // flower clumps
  const cols=Z.pal.flowers||[];
  for(let n=0;cols.length&&n<420;n++){const x=r()*W,y=r()*H;if(!isGrass(x,y,.1))continue;
    const col=cols[(r()*cols.length)|0];
    for(let k=0;k<4+(r()*4|0);k++){const fx=x*T+(r()-.5)*18,fy=y*T+(r()-.5)*12;
      c.fillStyle='rgba(40,80,40,.5)';c.fillRect(fx-.4,fy,.8,4);
      c.fillStyle=col;c.beginPath();c.arc(fx,fy,1.7,0,6.3);c.fill();
      c.fillStyle='#e8b23a';c.beginPath();c.arc(fx,fy,.6,0,6.3);c.fill()}}
  // pebbles on and beside paths
  for(let n=0;n<700;n++){const x=r()*W,y=r()*H;const hv=pathV(x,y);if(hv<-.05||hv>.5||landV(x,y)<.1||chanV(x,y)>-.1||pondV(x,y)>-.1)continue;
    c.fillStyle=r()<.5?'rgba(120,98,70,.55)':'rgba(236,218,184,.6)';
    c.beginPath();c.ellipse(x*T,y*T,1+r()*1.8,.8+r()*1,0,0,6.3);c.fill()}
  // reeds round the pond
  for(let n=0;Z.home&&n<160;n++){const a=r()*6.3,rx=2.9+r()*.3,ry=2.1+r()*.3;const x=9+Math.cos(a)*rx,y=17.4+Math.sin(a)*ry;
    if(pondV(x,y)>-.02||pondV(x,y)<-.5||pathV(x,y)>0)continue;
    const px=x*T,py=y*T;c.strokeStyle='#4f7a3a';c.lineWidth=1.3;c.beginPath();
    for(let b=0;b<3;b++){c.moveTo(px+b*2,py);c.quadraticCurveTo(px+b*2+(r()-.5)*4,py-10,px+b*2+(r()-.5)*6,py-14-r()*6)}c.stroke();
    if(r()<.4){c.fillStyle='#7a5a34';c.fillRect(px+2,py-18,2.4,6)}}
  // lily pads
  for(let n=0;Z.home&&n<7;n++){const x=7.9+r()*2.4,y=16.8+r()*1.3;if(pondV(x,y)<.25)continue;
    c.fillStyle='#4c9a52';c.beginPath();c.arc(x*T,y*T,5+r()*3,.4,6.3-.1);c.lineTo(x*T,y*T);c.fill();
    if(r()<.5){c.fillStyle='#ffd9e6';c.beginPath();c.arc(x*T+1,y*T-1,2,0,6.3);c.fill()}}
  // water sparkle spots (animated live)
  const r2=mulberry(5);
  for(let n=0;n<900&&WATERSPOTS.length<110;n++){const x=r2()*W,y=r2()*H;
    if(landV(x,y)<-.03||(pondV(x,y)>.15)||(chanV(x,y)>.2&&landV(x,y)>.1))WATERSPOTS.push([x*T,y*T,r2()*6.3])}
}

/* ---- what can be walked on ---- */
const walk=[];for(let j=0;j<H;j++){walk.push(new Array(W).fill(false))}
const bridgeCells=[];for(let i=25;i<=28;i++){bridgeCells.push([i,14],[i,15])}
const dockCells=[[31,21],[32,21],[31,22],[32,22],[31,23],[32,23],[31,24],[32,24]];   /* walkable only once the dock is built */
function buildWalk(){
  for(let j=0;j<H;j++)for(let i=0;i<W;i++){const x=i+.5,y=j+.5;
    walk[j][i]=landV(x,y)>.05&&rockV(x,y)<-.55&&pondV(x,y)<-.1&&chanV(x,y)<-.12}
}
