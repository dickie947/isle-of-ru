/* ===== More painted sprites: forge, stables, dock, banner, dash arch, fire pit, plots, egg ===== */
function makeSprites2(){
  /* ---- forge ---- */
  SPR.forge=mk(190,160,(c)=>{
    shadowBlob(c,95,148,86,12,.36);
    // stone body
    c.fillStyle=lg(c,0,70,0,148,['#8d8680','#625d59']);c.fillRect(24,70,128,78);
    c.strokeStyle='rgba(20,16,14,.4)';c.lineWidth=1;
    for(let r=0;r<8;r++){const y=70+r*10;c.beginPath();c.moveTo(24,y);c.lineTo(152,y);c.stroke();for(let x=24+(r%2)*10;x<152;x+=20){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+10);c.stroke()}}
    c.fillStyle='rgba(255,255,255,.08)';c.fillRect(24,70,128,8);
    // roof (dark slate, lean-to)
    for(let i=0;i<5;i++){const y0=34+i*14,y1=y0+14,xl0=34-i*5,xr0=142+i*5;
      c.fillStyle=i%2?'#4a5360':'#434b57';c.beginPath();c.moveTo(xl0,y0);c.lineTo(xr0,y0);c.lineTo(xl0-5,y1);c.lineTo(xr0+5,y1);c.closePath();c.fill();
      c.fillStyle='rgba(255,255,255,.1)';for(let x=xl0-4;x<xr0+4;x+=14)c.fillRect(x,y1-3,9,2)}
    c.fillStyle='#2b2f36';c.fillRect(30,30,116,6);
    // chimney with glow
    c.fillStyle=lg(c,0,0,26,0,['#8d8680','#625d59']);c.fillRect(118,4,26,40);c.fillStyle='#4f4a46';c.fillRect(114,0,34,8);
    const sg=c.createRadialGradient(131,0,2,131,0,22);sg.addColorStop(0,'rgba(255,140,50,.55)');sg.addColorStop(1,'rgba(255,140,50,0)');c.fillStyle=sg;c.fillRect(100,-24,62,50);
    // big forge mouth
    c.fillStyle='#1c1613';c.beginPath();c.moveTo(60,148);c.lineTo(60,104);c.quadraticCurveTo(60,84,88,84);c.quadraticCurveTo(116,84,116,104);c.lineTo(116,148);c.fill();
    const fg=c.createRadialGradient(88,124,4,88,124,34);fg.addColorStop(0,'#fff1b0');fg.addColorStop(.35,'#ffa13c');fg.addColorStop(1,'rgba(200,60,20,.1)');c.fillStyle=fg;
    c.beginPath();c.moveTo(66,148);c.lineTo(66,106);c.quadraticCurveTo(66,90,88,90);c.quadraticCurveTo(110,90,110,106);c.lineTo(110,148);c.fill();
    c.strokeStyle='#2b2f36';c.lineWidth=5;c.beginPath();c.moveTo(60,148);c.lineTo(60,104);c.quadraticCurveTo(60,84,88,84);c.quadraticCurveTo(116,84,116,104);c.lineTo(116,148);c.stroke();
    // hanging tools + sign (hammer and anvil)
    c.fillStyle='#4a2f1b';c.fillRect(126,80,3,22);c.fillRect(134,80,3,22);
    c.fillStyle='#9aa4ad';c.fillRect(122,96,16,6);c.fillStyle='#6c4a2a';c.fillRect(129,80,2,18);
    // anvil outside
    c.fillStyle='#4a4f57';c.beginPath();c.moveTo(148,138);c.lineTo(180,138);c.lineTo(176,146);c.lineTo(152,146);c.closePath();c.fill();
    c.fillStyle=lg(c,150,0,184,0,['#7a828c','#4e555d']);c.beginPath();c.moveTo(144,126);c.lineTo(184,126);c.quadraticCurveTo(190,128,186,132);c.lineTo(176,134);c.lineTo(172,140);c.lineTo(156,140);c.lineTo(152,134);c.lineTo(144,134);c.closePath();c.fill();
    c.fillStyle='rgba(255,255,255,.3)';c.fillRect(146,127,36,2.4);
    c.fillStyle='#ff9d3c';c.beginPath();c.ellipse(166,125,5,2,0,0,6.3);c.fill();
    // barrel + embers
    c.fillStyle='#6c4a2a';c.fillRect(30,128,18,20);c.strokeStyle='#2b2f36';c.lineWidth=2;c.beginPath();c.moveTo(30,134);c.lineTo(48,134);c.moveTo(30,142);c.lineTo(48,142);c.stroke();
  });


  /* ---- clothes shop: a tailor's cottage with a striped awning and a mannequin ---- */
  SPR.clothes=mk(180,160,(c)=>{
    shadowBlob(c,90,150,80,11,.34);
    // timber and plaster walls
    c.fillStyle=lg(c,0,64,0,148,['#efe2c0','#d6c498']);c.fillRect(22,64,136,84);
    c.fillStyle='#6b4524';c.fillRect(22,64,136,4);c.fillRect(22,144,136,5);[22,70,114,152].forEach(x=>c.fillRect(x,64,6,84));
    c.strokeStyle='#6b4524';c.lineWidth=3;c.beginPath();c.moveTo(28,104);c.lineTo(70,70);c.moveTo(152,104);c.lineTo(114,70);c.stroke();
    // plum roof
    for(let i=0;i<4;i++){const y0=24+i*12,y1=y0+12,xl=44-i*8,xr=136+i*8;
      c.fillStyle=i%2?'#8a3f6a':'#7a355d';c.beginPath();c.moveTo(xl,y0);c.lineTo(xr,y0);c.lineTo(xl-8,y1);c.lineTo(xr+8,y1);c.closePath();c.fill();
      c.fillStyle='rgba(255,255,255,.12)';for(let x=xl-6;x<xr+6;x+=14)c.fillRect(x,y1-3,9,2)}
    c.fillStyle='#4f2340';c.fillRect(42,20,96,6);
    // door
    c.fillStyle='#5b3a1f';c.beginPath();c.roundRect(46,96,32,52,[16,16,0,0]);c.fill();c.fillStyle='#7a5230';c.beginPath();c.roundRect(50,100,24,48,[12,12,0,0]);c.fill();
    c.fillStyle='#e9c46a';c.beginPath();c.arc(70,124,2.2,0,6.3);c.fill();
    // window with a dress on show
    c.fillStyle='#6b4524';c.fillRect(100,86,44,42);c.fillStyle='#bfe3ee';c.fillRect(104,90,36,34);
    c.fillStyle='#d9544a';c.beginPath();c.moveTo(114,98);c.lineTo(130,98);c.lineTo(136,122);c.lineTo(108,122);c.closePath();c.fill();c.fillStyle='#f3e6c4';c.fillRect(114,98,16,3);
    // awning
    for(let k=0;k<8;k++){c.fillStyle=k%2?'#f7f0dc':'#c8483a';c.beginPath();c.moveTo(18+k*18,78);c.lineTo(36+k*18,78);c.lineTo(34+k*18,90+(k%2?0:0));c.quadraticCurveTo(27+k*18,96,20+k*18,90);c.closePath();c.fill()}
    c.fillStyle='rgba(0,0,0,.15)';c.fillRect(18,88,144,3);
    // hanging sign with a needle and thread
    c.fillStyle='#4a2f1b';c.fillRect(150,40,4,34);c.fillRect(138,40,16,3);
    c.fillStyle='#e8d6a8';c.beginPath();c.roundRect(130,48,22,18,3);c.fill();c.strokeStyle='#6b4524';c.lineWidth=1.4;c.stroke();
    c.strokeStyle='#8a3f6a';c.lineWidth=2;c.beginPath();c.moveTo(134,62);c.lineTo(148,52);c.stroke();c.fillStyle='#8a3f6a';c.beginPath();c.arc(135,60,1.6,0,6.3);c.fill();
    // mannequin outside
    c.fillStyle='#6b4524';c.fillRect(158,126,3,22);c.fillRect(150,146,19,3);
    c.fillStyle='#4f9a4a';c.beginPath();c.moveTo(152,104);c.quadraticCurveTo(160,98,168,104);c.lineTo(170,128);c.lineTo(150,128);c.closePath();c.fill();c.fillStyle='#e9c46a';c.fillRect(150,120,20,3);
    c.fillStyle='#d9b88c';c.beginPath();c.arc(160,96,5,0,6.3);c.fill();
    // flower box
    c.fillStyle='#7a5230';c.fillRect(84,134,12,10);[[86,131],[90,129],[94,132]].forEach(([x,y],i)=>{c.fillStyle=['#ff8fb1','#ffd36b','#fff'][i];c.beginPath();c.arc(x,y,2.4,0,6.3);c.fill()});
  });

  /* ---- stables ---- */
  SPR.stables=mk(220,160,(c)=>{
    shadowBlob(c,110,148,100,12,.36);
    // timber wall
    for(let x=18;x<202;x+=8){const t=((x/8)|0)%3;c.fillStyle=['#c0925a','#b5864f','#c89a62'][t];c.fillRect(x,72,8,76)}
    c.fillStyle='rgba(60,34,14,.22)';for(let x=18;x<202;x+=8)c.fillRect(x,72,1,76);
    c.fillStyle='#4a2f1b';c.fillRect(14,68,6,82);c.fillRect(200,68,6,82);c.fillRect(100,68,6,82);c.fillRect(14,144,192,6);
    // three open bays with hay
    [[26,64],[116,64]].forEach(([x,w],i)=>{c.fillStyle='#2a1b12';c.beginPath();c.moveTo(x,148);c.lineTo(x,100);c.quadraticCurveTo(x,86,x+w/2-4,86);c.quadraticCurveTo(x+w-8,86,x+w-8,100);c.lineTo(x+w-8,148);c.fill();
      c.fillStyle='#d9b45a';for(let k=0;k<22;k++){const hx=x+4+hash(k,i+3)*(w-18),hy=134+hash(k,i+9)*12;c.fillRect(hx,hy,8,1.6)}
      c.strokeStyle='#4a2f1b';c.lineWidth=4;c.beginPath();c.moveTo(x,148);c.lineTo(x,100);c.quadraticCurveTo(x,86,x+w/2-4,86);c.quadraticCurveTo(x+w-8,86,x+w-8,100);c.lineTo(x+w-8,148);c.stroke();
      // name board
      c.fillStyle='#8a5f36';c.fillRect(x+10,74,40,9);c.strokeStyle='#3b2616';c.lineWidth=1.5;c.strokeRect(x+10,74,40,9)});
    // roof
    for(let i=0;i<7;i++){const t0=i/7,t1=(i+1)/7,y0=22+t0*52,y1=22+t1*52,xl0=52-t0*40,xr0=168+t0*40,xl1=52-t1*40,xr1=168+t1*40;
      c.fillStyle=lg(c,0,y0,0,y1,[i%2?'#3b6f73':'#356569','#274c50']);c.beginPath();c.moveTo(xl0,y0);c.lineTo(xr0,y0);c.lineTo(xr1,y1);c.lineTo(xl1,y1);c.closePath();c.fill();
      const n=Math.round((xr1-xl1)/14);for(let k=0;k<=n;k++){const x=xl1+k*(xr1-xl1)/n;c.fillStyle=(k+i)%2?'#3f7b7c':'#315f62';c.beginPath();c.arc(x,y1-1,(xr1-xl1)/n/2+.5,0,Math.PI);c.fill()}}
    c.strokeStyle='#4a2f1b';c.lineWidth=5;c.lineCap='round';c.beginPath();c.moveTo(52,22);c.lineTo(12,74);c.moveTo(168,22);c.lineTo(208,74);c.stroke();
    c.fillStyle='#4a2f1b';c.fillRect(46,16,128,7);
    // dragon-head gable posts
    [[46,1],[174,-1]].forEach(([x,d])=>{c.fillStyle='#4a2f1b';c.beginPath();c.moveTo(x,24);c.quadraticCurveTo(x+d*2,0,x+d*12,-2);c.quadraticCurveTo(x+d*20,-2,x+d*22,4);c.quadraticCurveTo(x+d*14,6,x+d*11,12);c.quadraticCurveTo(x+d*8,20,x+d*6,24);c.closePath();c.fill();c.fillStyle='#e9c46a';c.beginPath();c.arc(x+d*15,2,1.7,0,6.3);c.fill()});
    // hanging banner with a dragon egg
    c.fillStyle='#e8743b';c.beginPath();c.moveTo(96,76);c.lineTo(110,76);c.lineTo(110,106);c.lineTo(103,100);c.lineTo(96,106);c.closePath();c.fill();
    c.fillStyle='#fff2c8';c.beginPath();c.ellipse(103,88,4,6,0,0,6.3);c.fill();
    // lantern
    c.fillStyle='#2b2b30';c.fillRect(100,52,2,8);c.fillStyle='#ffd27a';c.fillRect(96,60,10,12);c.strokeStyle='#2b2b30';c.lineWidth=1.5;c.strokeRect(96,60,10,12);
  });

  /* ---- dock (flat on the water) ---- */
  SPR.dock=mk(66,190,(c)=>{
    c.fillStyle='rgba(10,50,70,.28)';c.fillRect(7,7,60,182);
    for(let j=0;j<23;j++){const y=j*8;c.fillStyle=j%2?'#9a6b3d':'#a9784a';c.fillRect(2,y,60,7);c.fillStyle='rgba(60,36,16,.5)';c.fillRect(2,y+7,60,1);c.fillStyle='rgba(255,230,180,.18)';c.fillRect(5+hash(j,2)*24,y+2,10+hash(j,5)*14,1)}
    c.fillStyle='#5b3b1f';for(let j=0;j<5;j++){const y=8+j*37;c.fillRect(-1,y,5,5);c.fillRect(59,y,5,5)}
  });

  /* ---- banner on a tall pole ---- */
  SPR.banner=mk(70,130,(c)=>{shadowBlob(c,22,122,14,5,.3);c.fillStyle='#6c4a2a';c.fillRect(20,12,5,110);c.fillStyle='#d9a441';c.beginPath();c.arc(22.5,10,4,0,6.3);c.fill();
    c.fillStyle=lg(c,24,0,64,0,['#e8743b','#c9431d']);c.beginPath();c.moveTo(25,16);c.quadraticCurveTo(46,8,62,16);c.quadraticCurveTo(54,32,62,50);c.quadraticCurveTo(44,42,25,50);c.closePath();c.fill();
    c.fillStyle='#ffd36b';for(let r=0;r<2;r++)for(let k=0;k<5;k++){c.beginPath();c.arc(32+k*5.4,26+r*8,1.7,0,6.3);c.fill()}});

  /* ---- Dragon Dash arch ---- */
  SPR.dashgate=mk(120,120,(c)=>{shadowBlob(c,60,110,50,8,.35);
    [[22],[98]].forEach(([x])=>{c.fillStyle=lg(c,x-5,0,x+5,0,['#8a5f36','#5a3b22']);c.fillRect(x-5,26,10,84);c.fillStyle='#d9a441';c.beginPath();c.arc(x,24,6,0,6.3);c.fill()});
    c.fillStyle='#5a3b22';c.beginPath();c.moveTo(14,34);c.quadraticCurveTo(60,6,106,34);c.lineTo(106,46);c.quadraticCurveTo(60,18,14,46);c.closePath();c.fill();
    for(let k=0;k<7;k++){const t=k/6,x=18+t*84,y=36-Math.sin(t*Math.PI)*22;c.fillStyle=k%2?'#2f8f8d':'#e8743b';c.beginPath();c.moveTo(x-6,y+8);c.lineTo(x+6,y+8);c.lineTo(x,y+26);c.closePath();c.fill()}
    c.fillStyle='#f4e7c4';c.fillRect(34,60,52,18);c.strokeStyle='#4a2f1b';c.lineWidth=2;c.strokeRect(34,60,52,18);
    c.fillStyle='#e8743b';c.beginPath();c.moveTo(42,76);c.lineTo(50,64);c.lineTo(52,70);c.lineTo(60,62);c.lineTo(62,70);c.lineTo(70,66);c.lineTo(78,76);c.closePath();c.fill();});

  /* ---- fire pit (flame is drawn live) ---- */
  SPR.firepit=mk(60,34,(c)=>{for(let a=0;a<9;a++){const an=a/9*6.28,x=30+Math.cos(an)*14,y=17+Math.sin(an)*7;
      c.fillStyle='#6f6a66';c.beginPath();c.ellipse(x,y,4.4,3.2,0,0,6.3);c.fill();c.fillStyle='rgba(255,255,255,.2)';c.beginPath();c.ellipse(x-1,y-1,2,1.2,0,0,6.3);c.fill()}
    c.fillStyle='rgba(40,28,24,.85)';c.beginPath();c.ellipse(30,17,10,5.2,0,0,6.3);c.fill()});

  /* ---- plot marker: a staked-out square with a little sign ---- */
  SPR.plot=mk(100,86,(c)=>{
    c.strokeStyle='rgba(255,246,214,.9)';c.lineWidth=2.4;c.setLineDash([7,5]);c.beginPath();c.moveTo(10,64);c.lineTo(90,64);c.lineTo(80,36);c.lineTo(20,36);c.closePath();c.stroke();c.setLineDash([]);
    [[10,64],[90,64],[80,36],[20,36]].forEach(([x,y])=>{c.fillStyle='#8a5f36';c.fillRect(x-2,y-9,4,11)});
    shadowBlob(c,50,66,30,6,.2);
    c.fillStyle='#6c4a2a';c.fillRect(48,22,4,42);c.fillStyle=lg(c,32,10,68,32,['#e8c88a','#c8a25a']);c.fillRect(34,8,32,18);c.strokeStyle='#4a2f1b';c.lineWidth=2;c.strokeRect(34,8,32,18);
    c.fillStyle='#4a2f1b';c.fillRect(40,13,20,2.4);c.fillRect(40,19,12,2.4);});
}

/* A small egg in the dragon's own colours, sitting in the nest */
function eggSprite(d){
  return mk(46,58,(c)=>{
    shadowBlob(c,23,52,17,5,.3);
    const B=d.body,W=d.wing;
    const gr=c.createRadialGradient(17,18,2,24,30,30);gr.addColorStop(0,tint(B,.45));gr.addColorStop(.6,B);gr.addColorStop(1,shade(B,.28));
    c.fillStyle=gr;c.beginPath();c.moveTo(23,4);c.bezierCurveTo(37,4,44,26,44,36);c.bezierCurveTo(44,48,35,54,23,54);c.bezierCurveTo(11,54,2,48,2,36);c.bezierCurveTo(2,26,9,4,23,4);c.fill();
    c.fillStyle=W;c.globalAlpha=.75;
    if(d.pattern==='stripes'){c.lineWidth=3;c.strokeStyle=W;c.lineCap='round';[[4,34,23,40,42,34],[5,43,23,49,41,43],[10,24,23,29,36,24]].forEach(p=>{c.beginPath();c.moveTo(p[0],p[1]);c.quadraticCurveTo(p[2],p[3],p[4],p[5]);c.stroke()})}
    else{[[15,24,3.4],[31,34,4.2],[17,43,3],[30,17,2.4]].forEach(([x,y,r])=>{c.beginPath();c.arc(x,y,r,0,6.3);c.fill()})}
    c.globalAlpha=1;c.fillStyle='rgba(255,255,255,.3)';c.beginPath();c.ellipse(15,16,3.6,6,.4,0,6.3);c.fill();
  });
}
