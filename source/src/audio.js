/* ================= audio: soft effects + optional gentle music ================= */
const Audio_={
  ctx:null,master:null,music:null,musicTimer:null,musicOn:false,
  ensure(){
    if(this.ctx) { if(this.ctx.state==='suspended'){try{this.ctx.resume();}catch(e){}} return true; }
    try{
      const AC=window.AudioContext||window.webkitAudioContext; if(!AC) return false;
      this.ctx=new AC(); this.master=this.ctx.createGain(); this.master.connect(this.ctx.destination);
      this.music=this.ctx.createGain(); this.music.gain.value=1.1; this.music.connect(this.master);
      this.setVol(S.settings.vol); return true;
    }catch(e){return false;}
  },
  setVol(v){ if(this.master) this.master.gain.value=Math.max(0,Math.min(1,v))*0.5; },
  tone(freq,t0,dur,{type='sine',vol=.25,attack=.01,to=null,dest=null}={}){
    const c=this.ctx; if(!c) return;
    const o=c.createOscillator(), g=c.createGain();
    o.type=type; o.frequency.setValueAtTime(freq,t0);
    if(to) o.frequency.exponentialRampToValueAtTime(to,t0+dur);
    g.gain.setValueAtTime(0.0001,t0); g.gain.linearRampToValueAtTime(vol,t0+attack); g.gain.exponentialRampToValueAtTime(0.0001,t0+dur);
    o.connect(g); g.connect(dest||this.master); o.start(t0); o.stop(t0+dur+.05);
  },
  fx(name){
    if(!S.settings.sfx) return; if(!this.ensure()) return;
    const c=this.ctx, t=c.currentTime;
    try{
      switch(name){
        case 'pop': this.tone(520,t,.12,{type:'sine',vol:.22,to:760}); break;
        case 'tap': this.tone(380,t,.07,{type:'triangle',vol:.14}); break;
        case 'good': [523.25,659.25,783.99].forEach((f,i)=>this.tone(f,t+i*.09,.35,{type:'triangle',vol:.2})); break;
        case 'soft': this.tone(330,t,.22,{type:'sine',vol:.16}); this.tone(294,t+.12,.28,{type:'sine',vol:.14}); break;
        case 'ten': [392,523.25,659.25,880].forEach((f,i)=>this.tone(f,t+i*.07,.4,{type:'sine',vol:.2})); break;
        case 'munch': for(let i=0;i<3;i++) this.tone(180-i*14,t+i*.13,.09,{type:'square',vol:.08,to:100}); break;
        case 'hatch': for(let i=0;i<4;i++) this.tone(900+i*60,t+i*.12,.05,{type:'square',vol:.07}); [523.25,659.25,783.99,1046.5].forEach((f,i)=>this.tone(f,t+.6+i*.12,.5,{type:'triangle',vol:.22})); break;
        case 'fanfare': [523.25,659.25,783.99,1046.5,783.99,1046.5].forEach((f,i)=>this.tone(f,t+i*.13,.45,{type:'triangle',vol:.22})); break;
        case 'heart': this.tone(700,t,.15,{type:'sine',vol:.15,to:1000}); this.tone(1000,t+.1,.2,{type:'sine',vol:.12}); break;
        case 'buy': [660,880].forEach((f,i)=>this.tone(f,t+i*.08,.25,{type:'triangle',vol:.18})); break;
      }
    }catch(e){}
  },
  startMusic(){
    if(this.musicOn) return; if(!this.ensure()) return; this.musicOn=true;
    const c=this.ctx;
    if(!this.rev){ try{ this.rev=NORSE.makeReverb(c); this.music.connect(this.rev.in); this.rev.out.connect(this.master); }catch(e){} }
    this.A={ctx:c,dest:this.music,noise:NORSE.noiseBuf(c)};
    this.bar=0; this.nextT=c.currentTime+.2;
    const tick=()=>{ if(!this.musicOn||!S.settings.music||!this.ctx) return; while(this.nextT<c.currentTime+2.2){ try{ NORSE.bar(this.A,this.nextT,this.bar); }catch(e){} this.nextT+=NORSE.BAR; this.bar++; } };
    tick(); this.musicTimer=setInterval(tick,500);
  },
  stopMusic(){ this.musicOn=false; if(this.musicTimer){clearInterval(this.musicTimer);this.musicTimer=null;} },
  syncMusic(){ if(S.settings.music) this.startMusic(); else this.stopMusic(); }
};

/* ================= an original folk-style Nordic theme, built from oscillators =================
   6/8, D Dorian. A and B sections of 8 bars each. Soft whistle melody, plucked harp, string pad, a low drone,
   a gentle frame drum, and a fiddle joining in the second half. Everything is quiet and slow on purpose. */
const NORSE=(()=>{
  const E=60/70/3, BAR=E*6, f=n=>293.66*Math.pow(2,n/12);
  const CH={Dm:[146.83,174.61,220.0,73.42],Bb:[116.54,146.83,174.61,58.27*2],F:[174.61,220.0,261.63,87.31],C:[130.81,164.81,196.0,65.41*2],Gm:[196.0,233.08,293.66,98.0]};
  const PROG_A=['Dm','Bb','F','C','Dm','Bb','C','Dm'], PROG_B=['Gm','Dm','Bb','F','Gm','Dm','C','Dm'];
  const MEL_A=[[[7,3],[5,1],[3,1],[2,1]],[[3,3],[5,2],[7,1]],[[10,3],[7,1],[5,1],[3,1]],[[2,2],[5,1],[7,3]],[[12,3],[10,1],[7,1],[5,1]],[[3,1],[5,1],[7,1],[10,3]],[[12,2],[10,1],[7,2],[5,1]],[[5,2],[2,1],[0,3]]];
  const MEL_B=[[[14,3],[12,1],[10,1],[7,1]],[[12,3],[10,2],[7,1]],[[15,3],[12,1],[10,1],[12,1]],[[15,2],[12,1],[10,3]],[[19,3],[17,1],[15,1],[14,1]],[[12,2],[14,1],[12,2],[10,1]],[[10,3],[7,1],[5,1],[2,1]],[[7,2],[2,1],[0,3]]];
  function noiseBuf(c){ const n=c.sampleRate*.6, b=c.createBuffer(1,n,c.sampleRate), d=b.getChannelData(0); for(let i=0;i<n;i++) d[i]=Math.random()*2-1; return b; }
  function makeReverb(c){
    const len=Math.floor(c.sampleRate*2.6), b=c.createBuffer(2,len,c.sampleRate);
    for(let ch=0;ch<2;ch++){ const d=b.getChannelData(ch); for(let i=0;i<len;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.6); }
    const conv=c.createConvolver(); conv.buffer=b; const inp=c.createGain(), wet=c.createGain(); wet.gain.value=.34; inp.connect(conv); conv.connect(wet); return {in:inp,out:wet};
  }
  function env(g,t,a,dur,rel,vol){ g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(vol,t+a); g.gain.setValueAtTime(vol,t+Math.max(a,dur-.02)); g.gain.exponentialRampToValueAtTime(.0001,t+dur+rel); }
  function whistle(A,t,fr,dur,vol){
    const c=A.ctx,g=c.createGain(),o1=c.createOscillator(),o2=c.createOscillator(),m=c.createGain(),lfo=c.createOscillator(),lg=c.createGain();
    o1.type='sine'; o2.type='triangle'; o1.frequency.value=fr; o2.frequency.value=fr; m.gain.value=.25;
    lfo.frequency.value=5.2; lg.gain.setValueAtTime(0,t); lg.gain.linearRampToValueAtTime(fr*.008,t+Math.min(.5,dur)); lfo.connect(lg); lg.connect(o1.frequency); lg.connect(o2.frequency);
    env(g,t,.07,dur,.28,vol); o1.connect(g); o2.connect(m); m.connect(g); g.connect(A.dest);
    for(const o of [o1,o2,lfo]){ o.start(t); o.stop(t+dur+.4); }
  }
  function fiddle(A,t,fr,dur,vol){
    const c=A.ctx,g=c.createGain(),lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=1500; lp.Q.value=.6; env(g,t,.13,dur,.3,vol); lp.connect(g); g.connect(A.dest);
    for(const dt of [-7,7]){ const o=c.createOscillator(); o.type='sawtooth'; o.frequency.value=fr; o.detune.value=dt; const l=c.createOscillator(),lg=c.createGain(); l.frequency.value=5.6; lg.gain.value=fr*.006; l.connect(lg); lg.connect(o.frequency); o.connect(lp); o.start(t); l.start(t); o.stop(t+dur+.5); l.stop(t+dur+.5); }
  }
  function pluck(A,t,fr,vol){
    const c=A.ctx,g=c.createGain(),o=c.createOscillator(),o2=c.createOscillator(),m=c.createGain(); o.type='triangle'; o2.type='sine'; o.frequency.value=fr; o2.frequency.value=fr*2; m.gain.value=.3;
    g.gain.setValueAtTime(.0001,t); g.gain.linearRampToValueAtTime(vol,t+.008); g.gain.exponentialRampToValueAtTime(.0001,t+1.1); o.connect(g); o2.connect(m); m.connect(g); g.connect(A.dest); o.start(t); o2.start(t); o.stop(t+1.2); o2.stop(t+1.2);
  }
  function pad(A,t,fr,dur,vol){
    const c=A.ctx,g=c.createGain(),lp=c.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=900; env(g,t,.9,dur,1.3,vol); lp.connect(g); g.connect(A.dest);
    for(const dt of [-5,5]){ const o=c.createOscillator(); o.type='triangle'; o.frequency.value=fr; o.detune.value=dt; o.connect(lp); o.start(t); o.stop(t+dur+1.5); }
  }
  function drone(A,t,vol){
    const c=A.ctx,g=c.createGain(); env(g,t,.8,BAR+.2,1.4,vol); g.connect(A.dest);
    for(const [fr,ty,k] of [[73.42,'sine',1],[110,'sine',.7],[146.83,'triangle',.35]]){ const o=c.createOscillator(),m=c.createGain(); o.type=ty; o.frequency.value=fr; m.gain.value=k; o.connect(m); m.connect(g); o.start(t); o.stop(t+BAR+1.8); }
  }
  function drum(A,t,vol){
    const c=A.ctx,o=c.createOscillator(),g=c.createGain(); o.type='sine'; o.frequency.setValueAtTime(130,t); o.frequency.exponentialRampToValueAtTime(58,t+.16); g.gain.setValueAtTime(vol,t); g.gain.exponentialRampToValueAtTime(.0001,t+.3); o.connect(g); g.connect(A.dest); o.start(t); o.stop(t+.35);
    const n=c.createBufferSource(),bp=c.createBiquadFilter(),ng=c.createGain(); n.buffer=A.noise; bp.type='bandpass'; bp.frequency.value=220; bp.Q.value=.8; ng.gain.setValueAtTime(vol*.55,t); ng.gain.exponentialRampToValueAtTime(.0001,t+.12); n.connect(bp); bp.connect(ng); ng.connect(A.dest); n.start(t); n.stop(t+.15);
  }
  function bar(A,t0,b){
    const sec=Math.floor(b/8)%2, i=b%8, name=(sec?PROG_B:PROG_A)[i], ch=CH[name], intro=b<4, cyc=b%16;
    drone(A,t0,.05);
    pad(A,t0,ch[0],BAR,.03); pad(A,t0,ch[1],BAR,.028); pad(A,t0,ch[2],BAR,.026);
    const arp=[0,1,2,1,2,1]; for(let k=0;k<6;k++){ pluck(A,t0+k*E,ch[arp[k]]*2,(k===0?.07:.045)*(intro?.7:1)); }
    if(cyc>=4){ drum(A,t0,.17); drum(A,t0+3*E,.11); if(sec){ drum(A,t0+2*E,.05); drum(A,t0+5*E,.05); } }
    const mel=(sec?MEL_B:MEL_A)[i]; let t=t0;
    for(const [n,d] of mel){ const dur=d*E; whistle(A,t,f(n),dur*.97,.075); if(sec||b>=8) fiddle(A,t,f(n-12),dur*.97,.032); t+=dur; }
  }
  return {BAR,bar,noiseBuf,makeReverb};
})();
