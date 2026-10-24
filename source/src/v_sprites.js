/* ===== Painted sprites: buildings, trees, props ===== */
function mk(w,h,fn){const c=document.createElement('canvas');c.width=Math.ceil(w*SC);c.height=Math.ceil(h*SC);
  const x=c.getContext('2d');x.scale(SC,SC);fn(x,w,h);return c}
function lg(c,x0,y0,x1,y1,stops){const g=c.createLinearGradient(x0,y0,x1,y1);stops.forEach((s,i)=>g.addColorStop(i/(stops.length-1),s));return g}
function ell(c,x,y,rx,ry,fill){c.fillStyle=fill;c.beginPath();c.ellipse(x,y,rx,ry,0,0,6.3);c.fill()}
function shadowBlob(c,x,y,rx,ry,a=.3){const g=c.createRadialGradient(x,y,1,x,y,rx);g.addColorStop(0,'rgba(18,34,24,'+a+')');g.addColorStop(1,'rgba(18,34,24,0)');
  c.save();c.translate(0,y);c.scale(1,ry/rx);c.translate(0,-y);c.fillStyle=g;c.beginPath();c.arc(x,y,rx,0,6.3);c.fill();c.restore()}

const SPR={};
function makeSprites(){
  /* ---- pines (3 looks) ---- */
  SPR.pine=[0,1,2].map(v=>mk(70,104,(c,w,h)=>{
    const cols=[['#2e5d3f','#3f7a4b','#58995a'],['#2a553f','#386f4c','#4f8c58'],['#34603a','#47794a','#68a05c']][v];
    shadowBlob(c,38,96,26,9,.38);
    c.fillStyle=lg(c,30,0,40,0,['#7b5634','#5a3b22']);c.fillRect(31,76,9,22);
    const tiers=[[96-22,36,30],[96-42,36,25],[96-62,36,19],[96-80,36,13]];
    [[80,34,26,22],[60,31,23,22],[40,28,20,22],[20,24,16,22]].forEach((t,i)=>{
      const by=t[0]+14,half=t[2]+6-i*1.5;
      c.fillStyle=lg(c,35-half,0,35+half,0,[cols[2],cols[1],cols[0]]);
      c.beginPath();c.moveTo(35,by-t[3]-14);c.lineTo(35+half,by);c.quadraticCurveTo(35,by+6,35-half,by);c.closePath();c.fill();
      c.strokeStyle='rgba(255,255,220,.16)';c.lineWidth=1.4;c.beginPath();
      for(let k=0;k<3;k++){const yy=by-6-k*8;c.moveTo(35-half*.55+k*3,yy);c.quadraticCurveTo(35-half*.2,yy-4,35,yy-2)}c.stroke();
      c.strokeStyle='rgba(10,40,24,.28)';c.beginPath();c.moveTo(35+half*.4,by-4);c.lineTo(35+half*.9,by-1);c.stroke()});
  }));
  /* ---- round bush, boulder ---- */
  SPR.bush=mk(46,34,(c)=>{shadowBlob(c,23,29,18,6,.3);
    [[14,20,11],[26,18,12],[20,13,10],[32,23,8]].forEach(([x,y,r],i)=>{const g=c.createRadialGradient(x-3,y-4,2,x,y,r);g.addColorStop(0,'#7fb15c');g.addColorStop(1,'#3e7342');c.fillStyle=g;c.beginPath();c.arc(x,y,r,0,6.3);c.fill()});
    c.fillStyle='#ff9fb4';[[12,16],[24,12],[30,20],[18,22]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,1.5,0,6.3);c.fill()})});
  SPR.rock=mk(46,34,(c)=>{shadowBlob(c,23,29,19,6,.35);
    c.fillStyle=lg(c,8,8,38,30,['#a7a29c','#77726e','#58544f']);c.beginPath();c.moveTo(6,28);c.quadraticCurveTo(4,12,16,8);c.quadraticCurveTo(28,4,38,14);c.quadraticCurveTo(44,24,38,29);c.closePath();c.fill();
    c.strokeStyle='rgba(255,255,255,.2)';c.lineWidth=1.3;c.beginPath();c.moveTo(12,14);c.quadraticCurveTo(22,8,32,14);c.stroke();
    c.fillStyle='rgba(90,130,60,.55)';c.beginPath();c.ellipse(14,26,9,3,0,0,6.3);c.fill()});

  /* ---- the school house ---- */
  SPR.house=mk(280,236,(c,w,h)=>{
    const L=28,R=252,B=224;
    shadowBlob(c,150,B+2,130,13,.38);
    // stone foundation
    c.fillStyle=lg(c,0,196,0,B,['#8d8680','#6c6661']);c.fillRect(L-4,196,R-L+8,B-196);
    c.strokeStyle='rgba(30,26,24,.35)';c.lineWidth=1;
    for(let r=0;r<3;r++){const y=196+r*9;c.beginPath();c.moveTo(L-4,y);c.lineTo(R+4,y);c.stroke();
      for(let x=L+(r%2)*9;x<R;x+=18){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+9);c.stroke()}}
    // timber wall
    for(let x=L;x<R;x+=8){const t=((x/8)|0)%3;c.fillStyle=['#c89a62','#bd8d56','#cfa26b'][t];c.fillRect(x,118,8,80)}
    c.fillStyle='rgba(60,34,14,.22)';for(let x=L;x<R;x+=8)c.fillRect(x,118,1,80);
    c.fillStyle=lg(c,0,118,0,200,['rgba(60,30,10,.28)','rgba(255,220,160,.05)']);c.fillRect(L,118,R-L,80);
    // dark timber frame
    c.fillStyle='#4a2f1b';c.fillRect(L-3,114,6,84);c.fillRect(R-3,114,6,84);c.fillRect(L-3,194,R-L+6,5);
    // windows
    [[52,150],[196,150]].forEach(([x,y])=>{
      c.fillStyle='#3a2415';c.fillRect(x-4,y-4,42,42);
      c.fillStyle=lg(c,x,y,x,y+34,['#ffe9a8','#ffbf5c']);c.fillRect(x,y,34,34);
      c.fillStyle='#3a2415';c.fillRect(x+16,y,3,34);c.fillRect(x,y+15,34,3);
      c.fillStyle='#2f6b6a';c.fillRect(x-12,y-2,10,38);c.fillRect(x+36,y-2,10,38);
      c.fillStyle='rgba(255,255,255,.25)';c.fillRect(x+3,y+3,8,3);
      const g=c.createRadialGradient(x+17,y+17,2,x+17,y+17,40);g.addColorStop(0,'rgba(255,200,100,.35)');g.addColorStop(1,'rgba(255,200,100,0)');c.fillStyle=g;c.fillRect(x-24,y-24,82,82)});
    // door
    c.fillStyle='#2b1a0f';c.beginPath();c.moveTo(114,B);c.lineTo(114,166);c.quadraticCurveTo(114,142,140,142);c.quadraticCurveTo(166,142,166,166);c.lineTo(166,B);c.fill();
    c.fillStyle=lg(c,118,0,162,0,['#8a5a30','#a8743d','#7a4c27']);c.beginPath();c.moveTo(119,B);c.lineTo(119,167);c.quadraticCurveTo(119,147,140,147);c.quadraticCurveTo(161,147,161,167);c.lineTo(161,B);c.fill();
    c.strokeStyle='rgba(40,22,10,.5)';c.lineWidth=1;for(let x=127;x<161;x+=8.5){c.beginPath();c.moveTo(x,150);c.lineTo(x,B);c.stroke()}
    c.strokeStyle='#2b2b30';c.lineWidth=3;[170,196].forEach(y=>{c.beginPath();c.moveTo(119,y);c.lineTo(161,y);c.stroke()});
    c.fillStyle='#d9a441';c.beginPath();c.arc(154,196,2.6,0,6.3);c.fill();
    const dg=c.createRadialGradient(140,B,4,140,B,40);dg.addColorStop(0,'rgba(255,205,110,.5)');dg.addColorStop(1,'rgba(255,205,110,0)');c.fillStyle=dg;c.fillRect(90,170,100,60);
    // porch gable
    c.fillStyle='#5a3920';c.beginPath();c.moveTo(100,150);c.lineTo(140,112);c.lineTo(180,150);c.closePath();c.fill();
    c.fillStyle=lg(c,100,112,180,150,['#3f7a78','#2c5a5a']);c.beginPath();c.moveTo(96,152);c.lineTo(140,106);c.lineTo(184,152);c.lineTo(176,152);c.lineTo(140,116);c.lineTo(104,152);c.closePath();c.fill();
    // main roof
    const roofRows=9;
    for(let i=0;i<roofRows;i++){
      const t0=i/roofRows,t1=(i+1)/roofRows;
      const y0=34+t0*98,y1=34+t1*98,xl0=64-t0*60,xr0=216+t0*60,xl1=64-t1*60,xr1=216+t1*60;
      c.fillStyle=lg(c,0,y0,0,y1,[i%2?'#3b6f73':'#356569',i%2?'#2c5559':'#274c50']);
      c.beginPath();c.moveTo(xl0,y0);c.lineTo(xr0,y0);c.lineTo(xr1,y1);c.lineTo(xl1,y1);c.closePath();c.fill();
      const n=Math.round((xr1-xl1)/15);
      for(let k=0;k<=n;k++){const x=xl1+k*(xr1-xl1)/n;
        c.fillStyle=(k+i)%2?'#3f7b7c':'#315f62';c.beginPath();c.arc(x,y1-1,(xr1-xl1)/n/2+.5,0,Math.PI);c.fill();
        c.strokeStyle='rgba(8,30,34,.35)';c.lineWidth=.9;c.beginPath();c.arc(x,y1-1,(xr1-xl1)/n/2+.5,0,Math.PI);c.stroke()}
    }
    c.fillStyle=lg(c,0,34,0,48,['rgba(255,255,255,.28)','rgba(255,255,255,0)']);c.fillRect(64,34,152,14);
    // roof edge boards
    c.strokeStyle='#4a2f1b';c.lineWidth=6;c.lineCap='round';c.beginPath();c.moveTo(64,34);c.lineTo(4,132);c.moveTo(216,34);c.lineTo(276,132);c.stroke();
    c.lineWidth=3;c.strokeStyle='#7a5230';c.beginPath();c.moveTo(66,36);c.lineTo(8,130);c.moveTo(214,36);c.lineTo(272,130);c.stroke();
    // eave shadow on wall
    c.fillStyle=lg(c,0,132,0,150,['rgba(20,10,4,.45)','rgba(20,10,4,0)']);c.fillRect(L-8,132,R-L+16,18);
    // ridge beam + dragon heads
    c.fillStyle='#4a2f1b';c.fillRect(56,28,168,8);
    [[56,1],[224,-1]].forEach(([x,d])=>{c.fillStyle='#4a2f1b';c.beginPath();c.moveTo(x,36);c.quadraticCurveTo(x+d*2,6,x+d*14,4);c.quadraticCurveTo(x+d*22,4,x+d*24,10);c.quadraticCurveTo(x+d*16,12,x+d*13,16);c.quadraticCurveTo(x+d*10,26,x+d*8,36);c.closePath();c.fill();
      c.fillStyle='#e9c46a';c.beginPath();c.arc(x+d*17,8,1.8,0,6.3);c.fill();
      c.strokeStyle='#7a5230';c.lineWidth=1.4;c.beginPath();c.moveTo(x+d*3,32);c.quadraticCurveTo(x+d*5,14,x+d*13,7);c.stroke()});
    // chimney
    c.fillStyle=lg(c,0,0,18,0,['#8d8680','#6c6661']);c.fillRect(176,12,20,40);c.fillStyle='#4f4a46';c.fillRect(173,8,26,7);
    // banners with ten-frames
    [[84],[196]].forEach(([x])=>{
      c.fillStyle='#4a2f1b';c.fillRect(x-4,150,34,3);
      c.fillStyle=lg(c,x,153,x,200,['#f4e7c4','#e3cf9c']);c.beginPath();c.moveTo(x,153);c.lineTo(x+26,153);c.lineTo(x+26,198);c.lineTo(x+13,190);c.lineTo(x,198);c.closePath();c.fill();
      c.strokeStyle='rgba(90,60,30,.5)';c.lineWidth=1;c.stroke();
      for(let r=0;r<2;r++)for(let k=0;k<5;k++){const cx=x+4.5+k*4.3,cy=164+r*8;
        c.fillStyle=(r==0)?'#e8743b':'rgba(120,90,60,.35)';c.beginPath();c.arc(cx,cy,1.8,0,6.3);c.fill()}
      c.fillStyle='#2f6b6a';c.fillRect(x+3,177,20,2);});
    // flowerboxes
    [[48,190],[192,190]].forEach(([x,y])=>{c.fillStyle='#5a3920';c.fillRect(x,y,50,9);
      for(let k=0;k<9;k++){c.fillStyle=['#ff9fb4','#ffd25c','#fff'][k%3];c.beginPath();c.arc(x+5+k*5.2,y-1,3,0,6.3);c.fill();c.fillStyle='#4a8a47';c.fillRect(x+4+k*5.2,y,2,4)}});
    // doorstep
    c.fillStyle='#9b958e';c.fillRect(106,B-1,68,6);c.fillStyle='#b4aea6';c.fillRect(106,B-1,68,2);
  });

  /* ---- dragon nest ---- */
  SPR.nest=mk(130,92,(c)=>{
    shadowBlob(c,65,76,58,16,.35);
    for(let a=0;a<18;a++){const an=a/18*6.28,x=65+Math.cos(an)*44,y=56+Math.sin(an)*17;
      c.fillStyle=lg(c,x-9,y-9,x+9,y+9,['#a8a29a','#6c6661']);c.beginPath();c.ellipse(x,y,11,8,an,0,6.3);c.fill();
      c.fillStyle='rgba(255,255,255,.25)';c.beginPath();c.ellipse(x-2,y-3,4,2,0,0,6.3);c.fill()}
    ell(c,65,56,38,14,'#6a4a28');
    for(let n=0;n<70;n++){const an=hash(n,3)*6.28,rr=Math.sqrt(hash(n,5))*34;const x=65+Math.cos(an)*rr,y=56+Math.sin(an)*rr*.36;
      c.strokeStyle=['#d6a94e','#b98a3c','#e6c06a'][n%3];c.lineWidth=1.6;c.beginPath();c.moveTo(x-6,y);c.lineTo(x+6,y+(hash(n,9)-.5)*4);c.stroke()}
    [[55,52,'#ff8a3d'],[75,56,'#ffc04a'],[66,48,'#ff6b5a']].forEach(([x,y,col])=>{
      const g=c.createRadialGradient(x,y,1,x,y,18);g.addColorStop(0,col+'aa');g.addColorStop(1,col+'00');c.fillStyle=g;c.fillRect(x-18,y-18,36,36);
      c.fillStyle=lg(c,x-6,y-9,x+6,y+8,['#fff2c8',col,'#8a3a1c']);c.beginPath();c.ellipse(x,y-2,6,8,0,0,6.3);c.fill();
      c.strokeStyle='rgba(255,255,255,.5)';c.lineWidth=1;c.beginPath();c.arc(x,y-2,4,3.6,4.6);c.stroke()});
    // leaf ring
    for(let n=0;n<10;n++){const an=n/10*6.28+.2,x=65+Math.cos(an)*54,y=60+Math.sin(an)*21;c.fillStyle='#4f8c4c';c.beginPath();c.ellipse(x,y,6,2.6,an,0,6.3);c.fill()}});

  /* ---- market stall ---- */
  SPR.stall=mk(130,120,(c)=>{
    shadowBlob(c,65,104,56,12,.35);
    c.fillStyle='#5a3920';c.fillRect(12,38,6,66);c.fillRect(112,38,6,66);
    c.fillStyle=lg(c,0,68,0,104,['#b98550','#8a5a30']);c.fillRect(14,70,102,34);
    c.fillStyle='rgba(40,20,6,.3)';for(let x=14;x<116;x+=10)c.fillRect(x,70,1,34);
    c.fillStyle='#d9b06a';c.fillRect(10,66,110,7);
    // goods
    [['#e8743b',30],['#ffd25c',48],['#7bc47f',66],['#ff9fb4',84]].forEach(([col,x])=>{c.fillStyle=col;c.beginPath();c.arc(x,64,6,0,6.3);c.fill();c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.arc(x-2,62,2,0,6.3);c.fill()});
    // jewel
    c.fillStyle='#6fd3ff';c.beginPath();c.moveTo(100,56);c.lineTo(106,64);c.lineTo(100,72);c.lineTo(94,64);c.closePath();c.fill();
    // awning
    for(let i=0;i<7;i++){c.fillStyle=i%2?'#f4e7c4':'#2f8f8d';c.beginPath();c.moveTo(8+i*16,16);c.lineTo(24+i*16,16);c.lineTo(28+i*16,44);c.arc(20+i*16,44,8,0,Math.PI);c.lineTo(8+i*16-4,44);c.closePath();c.fill()}
    c.fillStyle=lg(c,0,12,0,24,['rgba(255,255,255,.3)','rgba(255,255,255,0)']);c.fillRect(8,12,112,12);
    c.fillStyle='#4a2f1b';c.fillRect(4,10,122,7);});

  /* ---- lookout tower ---- */
  SPR.tower=mk(120,190,(c)=>{
    shadowBlob(c,60,178,46,12,.38);
    c.fillStyle=lg(c,0,0,120,0,['#6c4a2a','#8a5f36','#5a3b22']);c.beginPath();c.moveTo(30,176);c.lineTo(38,68);c.lineTo(82,68);c.lineTo(90,176);c.closePath();c.fill();
    c.strokeStyle='rgba(30,16,6,.45)';c.lineWidth=1;for(let y=76;y<176;y+=12){c.beginPath();c.moveTo(34,y);c.lineTo(86,y);c.stroke()}
    c.strokeStyle='#4a2f1b';c.lineWidth=5;c.beginPath();c.moveTo(34,170);c.lineTo(84,76);c.moveTo(86,170);c.lineTo(36,76);c.stroke();
    c.fillStyle='#5a3920';c.fillRect(24,60,72,12);c.fillStyle='#8a5f36';c.fillRect(24,60,72,4);
    for(let x=28;x<96;x+=12){c.fillStyle='#6c4a2a';c.fillRect(x,40,9,22)}
    c.fillStyle='#4a2f1b';c.fillRect(24,38,72,5);
    c.fillStyle=lg(c,0,6,0,38,['#3f7a78','#2c5a5a']);c.beginPath();c.moveTo(18,40);c.lineTo(60,2);c.lineTo(102,40);c.closePath();c.fill();
    c.fillStyle='#4a2f1b';c.fillRect(59,-6,2.6,14);
    c.fillStyle='#e8743b';c.beginPath();c.moveTo(61,-6);c.lineTo(82,-1);c.lineTo(61,5);c.closePath();c.fill();
    c.fillStyle='#6c4a2a';c.fillRect(52,134,16,42);c.fillStyle='#2b1a0f';c.beginPath();c.arc(60,134,8,Math.PI,0);c.fill();});

  /* ---- lantern post, sign post, fence stub, log seat, longship, boulders ---- */
  SPR.lantern=mk(40,84,(c)=>{shadowBlob(c,20,78,10,4,.3);c.fillStyle='#3a2a1c';c.fillRect(18,20,4,58);
    c.fillStyle='#2b2b30';c.fillRect(11,12,18,4);c.fillStyle=lg(c,0,16,0,34,['#ffe29a','#ffb347']);c.fillRect(14,16,12,16);
    c.strokeStyle='#2b2b30';c.lineWidth=1.5;c.strokeRect(14,16,12,16);c.beginPath();c.moveTo(20,16);c.lineTo(20,32);c.stroke();
    c.fillStyle='#2b2b30';c.beginPath();c.moveTo(10,16);c.lineTo(20,8);c.lineTo(30,16);c.fill()});
  SPR.sign=mk(60,70,(c)=>{shadowBlob(c,30,64,16,5,.3);c.fillStyle='#5a3920';c.fillRect(27,22,6,42);
    c.fillStyle=lg(c,6,10,54,34,['#c89a62','#a9784a']);c.fillRect(6,10,48,24);c.strokeStyle='#4a2f1b';c.lineWidth=2;c.strokeRect(6,10,48,24);
    c.fillStyle='#4a2f1b';for(let k=0;k<3;k++){c.fillRect(12+k*13,16,8,2);c.fillRect(12+k*13,23,5,2)}});
  SPR.logs=mk(70,34,(c)=>{shadowBlob(c,35,28,30,6,.3);[[10,10,50],[18,22,40]].forEach(([x,y,l])=>{
    c.fillStyle=lg(c,0,y,0,y+10,['#a9784a','#6c4a2a']);c.fillRect(x,y,l,10);c.fillStyle='#e0b878';c.beginPath();c.ellipse(x,y+5,3,5,0,0,6.3);c.fill()})});
  SPR.ship=mk(180,150,(c)=>{
    shadowBlob(c,90,128,80,12,.35);
    c.fillStyle=lg(c,0,70,0,128,['#9a6b3d','#5a3b22']);c.beginPath();c.moveTo(8,86);c.quadraticCurveTo(70,132,172,86);c.quadraticCurveTo(160,118,100,130);c.quadraticCurveTo(40,128,8,86);c.fill();
    c.fillStyle='#4a2f1b';c.beginPath();c.moveTo(8,86);c.quadraticCurveTo(0,64,12,50);c.quadraticCurveTo(22,48,22,56);c.quadraticCurveTo(14,62,16,84);c.fill();
    c.fillStyle='#e9c46a';c.beginPath();c.arc(16,54,2,0,6.3);c.fill();
    for(let k=0;k<7;k++){c.fillStyle=k%2?'#e8743b':'#2f8f8d';c.beginPath();c.arc(38+k*18,96+Math.sin(k/6*3)*6,7.5,0,6.3);c.fill();c.strokeStyle='#2b1a0f';c.lineWidth=1.2;c.stroke()}
    c.fillStyle='#5a3920';c.fillRect(88,14,5,78);
    c.fillStyle=lg(c,62,0,120,0,['#f4e7c4','#e3cf9c']);c.beginPath();c.moveTo(66,26);c.quadraticCurveTo(92,40,118,26);c.lineTo(112,64);c.quadraticCurveTo(92,72,72,64);c.closePath();c.fill();
    c.fillStyle='#2f8f8d';c.fillRect(70,40,44,5);});
  SPR.fenceGate=null;
}
