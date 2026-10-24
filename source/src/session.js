/* ================= training session + Dragon Dash ================= */
const THINGS=[{many:'fish'},{many:'berries'},{many:'gems'},{many:'eggs'},{many:'shells'}];
let SESS=null, Q=null, DASH=null;

function makeQ(it,opts={}){
  const D=S.dragon.name, th=pick(THINGS), q={it,kind:it.kind,ans:it.ans,th,id:it.id};
  if(it.kind==='wadd'||it.kind==='tadd'){
    const teen=it.kind==='tadd', big=teen?it.T:it.x, small=teen?it.u:it.y, sum=big+small;
    const flip=Math.random()<.5, first=flip?small:big, second=flip?big:small;
    q.kind='add'; q.noBridge=true; q.big=big; q.small=small; q.land=sum; if(teen) q.teen={o:it.o,u:it.u};
    q.eq=[{t:first},{op:'+'},{t:second},{op:'='},{ans:1}];
    q.story=`${esc(D)} found <b>${first}</b> ${th.many}, then <b>${second}</b> more. How many ${th.many} altogether?`;
    if(teen){
      q.nudge={counters:`The first frame is a full ten. Add the ${small} to the ones in the second frame. Tap empty circles.`,line:`Start on ${big}. Hop on ${small}.`};
      q.explain=`<b>${big}</b> is a ten and <b>${it.o}</b>. <b>${it.o} + ${small} = ${it.o+small}</b>, so <b>10 + ${it.o+small} = ${sum}</b>.`;
    }else{
      q.nudge={counters:`Move the counters from the second frame across to the first. Then count them all.`,line:`Start on the bigger number, ${big}. Hop on ${small}.`};
      q.explain=`<b>${big}</b> and <b>${small}</b> together make <b>${sum}</b>.`;
    }
  }else if(it.kind==='wsub'||it.kind==='tsub'){
    const teen=it.kind==='tsub', askX=!teen&&it.x!==it.y&&Math.random()<.5, m=teen?it.u:(askX?it.x:it.y);
    q.kind='sub'; q.noBridge=true; q.sub={n:it.c,m}; q.ans=teen?it.T:(askX?it.y:it.x); q.land=it.c-m;
    q.hintLine=`You know <b>${teen?it.T:it.x} + ${it.y===undefined?it.u:it.y} = ${it.c}</b>.`;
    q.eq=[{t:it.c},{op:'−'},{t:m},{op:'='},{ans:1}];
    q.story=`${esc(D)} has <b>${it.c}</b> ${th.many}. <b>${m}</b> of them roll away. How many are left?`;
    q.nudge=teen?{counters:`Take the ${m} away from the ones in the second frame.`,line:`Start on ${it.c}. Hop back ${m}.`}
                :{counters:`You have ${it.c} counters. Tap ${m} of them to take them away.`,line:`Start on ${it.c}. Hop back ${m}.`};
    q.explain=teen?`<b>${it.c} − ${m} = ${q.ans}</b>. Take ${m} from the ${it.c-10} ones and the ten stays.`:`${q.hintLine} So <b>${it.c} − ${m} = ${q.ans}</b>.`;
  }else if(it.kind==='bond'){
    q.a=it.a; q.eq=[{t:it.a},{op:'+'},{ans:1},{op:'='},{t:10}];
    q.story=`${esc(D)}'s feeding tray has <b>${it.a}</b> ${th.many}. How many more fill it up to ten?`;
    q.nudge={counters:'Fill the tray up to ten. Tap an empty circle to add a counter.',line:'Hop to 10. How far is it from your starting number?'};
    q.explain=`${it.a} and <b>${10-it.a}</b> make <b>10</b>.`;
  }else if(it.kind==='add'){
    const flip=Math.random()<.5, first=flip?it.y:it.x, second=flip?it.x:it.y;
    q.big=it.x; q.small=it.y; q.eq=[{t:first},{op:'+'},{t:second},{op:'='},{ans:1}];
    q.story=`${esc(D)} found <b>${first}</b> ${th.many}, then <b>${second}</b> more. How many ${th.many} altogether?`;
    const need=10-it.x;
    q.nudge={counters:'Fill the first frame up to ten. Tap counters in the second frame to move them across.',line:'Start on the bigger number. Hop to 10 first, then hop the rest.'};
    q.explain=`<b>${it.x}</b> needs <b>${need}</b> to make ten. <b>${it.y}</b> gives <b>${need}</b> and has <b>${it.y-need}</b> left. <b>10 + ${it.y-need} = ${it.ans}</b>.`;
  }else if(it.kind==='sub'){
    q.sub={n:it.n,m:it.m}; q.eq=[{t:it.n},{op:'−'},{t:it.m},{op:'='},{ans:1}];
    const verb=pick(['ate','gave away','lost']);
    q.story=`${esc(D)} had <b>${it.n}</b> ${th.many} and ${verb} <b>${it.m}</b>. How many are left?`;
    const r0=it.n-10;
    q.nudge={counters:'First take away enough to get back to ten. Tap the counters in the small frame.',line:'Hop back to 10 first, then hop back the rest.'};
    q.explain=`Take away <b>${r0}</b> to get back to <b>10</b>. Then take away <b>${it.m-r0}</b> more. <b>10 − ${it.m-r0} = ${it.ans}</b>.`;
  }else{
    const askX=it.x!==it.y&&Math.random()<.5, m=askX?it.x:it.y;
    q.sub={n:it.c,m}; q.ans=askX?it.y:it.x; q.hintLine=`You know <b>${it.x} + ${it.y} = ${it.c}</b>.`;
    q.eq=[{t:it.c},{op:'−'},{t:m},{op:'='},{ans:1}];
    q.story=`${esc(D)} has <b>${it.c}</b> ${th.many}. <b>${m}</b> of them are shiny. How many are not shiny?`;
    const r0=it.c-10;
    q.nudge={counters:'Use what you know: '+`${it.x} + ${it.y} = ${it.c}. Or take away to get back to ten first.`,line:'Hop back to 10 first, then hop back the rest.'};
    q.explain=`${q.hintLine} So <b>${it.c} − ${m} = ${q.ans}</b>. Or: take away <b>${r0}</b> to reach 10, then <b>${m-r0}</b> more.`;
  }
  return q;
}
function eqHTML(q,answer,has){
  return q.eq.map(t=>t.op?`<span class="op">${t.op}</span>`:t.ans?`<span class="slot-ans${answer?' has':''}" aria-label="your answer">${answer||''}</span>`:`<span>${t.t}</span>`).join('');
}
function fbHTML(kind,html,icon){return `<div class="fb ${kind}" role="status" aria-live="polite">${icon?ic(icon,26):''}<div>${html}</div></div>`;}

/* ---- start ---- */
const EXTRA_CAP=30;   /* most embers extra practice can earn in a day: keeps it calm, not a grind */
function extraLeft(){ return Math.max(0,EXTRA_CAP-(S.day.extra||0)); }
function startTraining(bonus){
  rollDay(); Audio_.ensure();
  SESS={bonus:!!bonus,plan:null,idx:0,startedAt:Date.now(),startDelayMs:HOME_SHOWN?Date.now()-HOME_SHOWN:null,faceStart:null,faceEnd:null,firstAnswerMs:null,
        qShownAt:null,earned:0,ok:0,clean:0,help:0,strat:0,hardAsked:0,hardGuess:0,hardTry:0,struggleRun:0,newItems:0,total:0,capAt:Date.now()+11*60000,pips:[]};
  if(bonus){ beginPlan(); return; }
  screen='face'; renderFace('start');
}
function renderFace(when){
  const start=when==='start';
  const app=$('#app');
  app.innerHTML=`<div class="screen"><div class="center">
    <div class="hero-dragon">${S.dragon.hatched?dragonSVG(S.dragon,{mood:'happy',stage:dragonStage(),wear:S.dragon.gear,uid:'face'}):eggSVG(S.dragon)}</div>
    <h1>${start?`Hi! How does maths feel today?`:`How was that?`}</h1>
    <p style="color:var(--ink2)">${start?'There is no right answer. This just helps us train in the right way.':'Tap one. There is no wrong answer.'}</p>
    <div class="faces">
      <button class="face" data-act="face" data-v="3">${faceSVG('good')}Good</button>
      <button class="face" data-act="face" data-v="2">${faceSVG('ok')}Okay</button>
      <button class="face" data-act="face" data-v="1">${faceSVG('worried')}A bit worried</button>
    </div>
    <button class="btn btn-ghost btn-sm" data-act="face" data-v="0">Skip</button>
  </div></div>`;
}
function beginPlan(){
  let max=S.settings.sessionMax, nw=S.settings.newPerDay;
  if(SESS.faceStart===1){ max=Math.min(max,8); nw=Math.max(1,nw-1); }
  SESS.max=max;
  SESS.plan=buildPlan(max,nw);
  SESS.newItems=SESS.plan.filter(e=>e.role==='new').length;
  if(!SESS.plan.length){ toast('Nothing to practise yet.'); goHome(); return; }
  if(!S.tutorialSeen){ showTutorial(); return; }
  nextQuestion();
}
function showTutorial(){
  openSheet(`<h2>How training works</h2><p class="sub">Three things to know. Then we start with an easy one.</p>
  <div class="gu" style="gap:12px">
   <div class="row">${ic('ember',34)}<div><b>Work it out your way.</b><br>Move the counters, or hop on the number line.</div></div>
   <div class="row">${ic('check',34)}<div><b>Type your answer</b> with the number keys.</div></div>
   <div class="row">${ic('help',34)}<div><b>Stuck? Press "Not sure yet".</b><br>Asking for help is a clever move. ${esc(S.dragon.name)} loves it.</div></div>
  </div><div class="row" style="justify-content:flex-end;margin-top:18px"><button class="btn btn-primary btn-big" data-act="tutorial-go">Let's go</button></div>`);
}

/* ---- the question screen ---- */
function nextQuestion(){
  if(SESS.idx>=SESS.plan.length||(Date.now()>SESS.capAt&&SESS.idx>=6)) return finishSession();
  const entry=SESS.plan[SESS.idx]; SESS.idx++;
  const it=ITEM[entry.id]; const q=makeQ(it);
  const st=S.items[entry.id];
  const sugg=(st&&st.seen>=2&&st.seen%2===0)?'line':'counters';
  Q={entry,q,t0:Date.now(),lastAct:Date.now(),attempts:0,hints:0,guided:entry.role==='new',rapid:0,done:false,answer:'',hard:null,tool:'counters',sugg,
     touched:false,counters:null,line:null,toolsUsed:new Set(),demo:false,locked:false,gap:null};
  if(SESS.qShownAt==null) SESS.qShownAt=Date.now();
  screen='question'; renderQuestion();
}
function pipsHTML(){
  let h=''; for(let i=0;i<SESS.plan.length;i++){ const p=SESS.pips[i]; h+=`<i class="pip ${p||''}${i===SESS.idx-1&&!p?' now':''}"></i>`; } return h;
}
function renderQuestion(){
  const q=Q.q, app=$('#app');
  app.innerHTML=`<div class="screen">
   <div class="sess-top">
     <button class="btn btn-ghost btn-sm" data-act="quit">${ic('close',18)} Stop for now</button>
     <div class="pips" id="pips" aria-label="Progress">${pipsHTML()}</div>
     <span class="pill gold num" title="Embers">${ic('ember',18)}<span id="emb">${S.embers}</span></span>
     <button class="btn btn-ghost btn-sm" data-act="breathe" title="Take a breather">${ic('wind',18)} Breathe</button>
   </div>
   <div class="desk">
    <section class="panel" aria-label="Tools">
      <div class="tool-head">
        <div class="tabs" role="tablist" style="margin:0">
          <button class="tab" role="tab" data-act="tool" data-t="counters" aria-selected="true" id="tab-counters">Counters${Q.sugg==='counters'?'':''}</button>
          <button class="tab" role="tab" data-act="tool" data-t="line" aria-selected="false" id="tab-line">Number line${Q.sugg==='line'?'<span class="star">'+ic('star',14)+'</span>':''}</button>
        </div>
        <button class="btn btn-ghost btn-sm" data-act="reset">${ic('undo',18)} Start again</button>
      </div>
      <div class="tool-body"><div id="tool-counters"></div><div id="tool-line" hidden></div></div>
    </section>
    <section class="panel" aria-label="Question">
      <div class="story">${q.story}</div>
      <div class="eq" id="eq" aria-live="polite">${eqHTML(q,Q.answer)}</div>
      <div id="fb">${fbHTML('','Take your time. Use the tools, or just type what you know.')}</div>
      <div id="rightbottom"></div>
    </section>
   </div></div>`;
  const cb={onTouch:()=>{Q.touched=true;Q.lastAct=Date.now();}};
  Q.counters=new CounterTool($('#tool-counters'),q,cb); Q.line=new LineTool($('#tool-line'),q,cb);
  if(Q.sugg==='line') switchTool('line',true);
  renderRight();
  if(Q.guided){ const t=Q.tool==='line'?Q.line:Q.counters; t.note(esc(q.nudge[Q.tool])); if(Q.tool==='counters') highlightTool(); else Q.line.setHighlight(); setFb('info',`New one! Let's try it together. ${esc(q.nudge[Q.tool])}`,'help'); }
}
function highlightTool(){ const q=Q.q; if(q.kind==='bond') Q.counters.setHighlight('A'); else if(q.kind==='add') Q.counters.setHighlight(q.teen?'B':'A'); else Q.counters.setHighlight(q.sub.n<=10?'A':'B'); }
function setFb(kind,html,icon){ const el=$('#fb'); if(el) el.innerHTML=fbHTML(kind,html,icon); }
function renderRight(){
  const el=$('#rightbottom'); if(!el) return;
  if(Q.done){
    el.innerHTML=`<button class="btn btn-primary btn-big" data-act="next" style="width:100%">${SESS.idx>=SESS.plan.length?'Finish training':'Next'} ${ic('next',24)}</button>`;
    return;
  }
  let pad='';
  for(const d of [1,2,3,4,5,6,7,8,9]) pad+=`<button class="btn" data-act="num" data-d="${d}" aria-label="${d}">${d}</button>`;
  pad+=`<button class="btn" data-act="back" aria-label="Delete">${ic('back',22)}</button><button class="btn" data-act="num" data-d="0" aria-label="0">0</button><button class="btn btn-primary" data-act="check" aria-label="Check">${ic('check',26)}</button>`;
  el.innerHTML=`<div class="pad">${pad}</div><div style="margin-top:8px"><button class="btn btn-soft" style="width:100%" data-act="help" id="helpbtn">${ic('help',22)} ${Q.hints>=1?'Show me how':'Not sure yet'}</button></div>`;
}
function setAnswer(a){ Q.answer=a; const e=$('#eq'); if(e) e.innerHTML=eqHTML(Q.q,a); }
function switchTool(t,silent){
  Q.tool=t; Q.toolsUsed.add(t);
  $('#tool-counters').hidden=t!=='counters'; $('#tool-line').hidden=t!=='line';
  $('#tab-counters').setAttribute('aria-selected',t==='counters'); $('#tab-line').setAttribute('aria-selected',t==='line');
  if(!silent) Audio_.fx('tap');
  if(!silent&&Q.guided&&!Q.done&&Q.attempts===0&&Q.hints===0&&!Q.touched) setFb('info',`New one! Let's try it together. ${esc(Q.q.nudge[t])}`,'help');
}
function activeTool(){return Q.tool==='line'?Q.line:Q.counters;}

function pressHelp(auto){
  if(Q.done||Q.locked) return;
  Q.hints++; Q.lastAct=Date.now();
  if(!Q.hard&&!auto){Q.hard='asked';SESS.hardAsked++;}
  if(Q.hints===1){
    const t=activeTool(); t.reset(); t.note(esc(Q.q.nudge[Q.tool]));
    if(Q.tool==='counters') highlightTool(); else Q.line.setHighlight();
    setFb('info',`Good thinking. Let's look together. ${esc(Q.q.nudge[Q.tool])}`,'help');
    $('#helpbtn').innerHTML=`${ic('help',22)} Show me how`;
  }else{
    runDemo();
  }
}
async function runDemo(){
  Q.locked=true; Q.demo=true; setFb('info','Watch how it works.','help');
  const t=activeTool(); await t.demo();
  Q.locked=false; setFb('info',`${Q.q.explain}<br>Now you type the answer.`,'help');
}
function submitAnswer(){
  if(!Q||Q.done||Q.locked||screen!=='question') return;
  if(Q.answer==='') return;
  const val=parseInt(Q.answer,10), now=Date.now();
  if(SESS.firstAnswerMs==null) SESS.firstAnswerMs=now-SESS.qShownAt;
  if(val===Q.q.ans) return answerRight();
  /* wrong */
  const quick=(now-Q.lastAct)<2500&&!Q.touched&&Q.attempts===0&&Q.hints===0&&Q.rapid===0;
  if(quick){
    Q.rapid++; if(!Q.hard){Q.hard='guess';SESS.hardGuess++;}
    Audio_.fx('soft'); setAnswer(''); Q.lastAct=now;
    setFb('soft','That was speedy! Check it with the counters or the number line first.','help'); return;
  }
  Q.attempts++; if(!Q.hard){Q.hard=Q.hints>0?'asked':'tried'; if(Q.hard==='tried') SESS.hardTry++;}
  Audio_.fx('soft'); setAnswer(''); Q.lastAct=now;
  if(Q.attempts===1&&Q.hints===0) setFb('soft','Not yet. Check it with the counters, then try again.','help');
  else { setFb('soft','Not yet. Let us look at it together.','help'); if(Q.hints<2) pressHelp(true); }
}
function answerRight(){
  Q.done=true; const q=Q.q, entry=Q.entry;
  const clean=Q.attempts===0&&Q.hints===0, strat=Q.counters.strategyUsed()||Q.line.strategyUsed();
  const toolUsed=Q.counters.touched?'counters':Q.line.touched?'line':'none';
  const fast=clean&&!S.items[entry.id]&&!!(SKILLS.find(k=>k.id===q.it.skill)||{}).easy;
  const gap=applyResult(entry.id,{clean,kind:'train',fast});
  const ms=Date.now()-Q.t0;
  let gain=clean?3:1; if(clean&&strat) gain+=1;
  if(SESS.bonus){ gain=Math.min(clean?2:1,extraLeft()); S.day.extra=(S.day.extra||0)+gain; }
  if(gain){S.embers+=gain; SESS.earned+=gain;}
  SESS.ok++; SESS.total++; if(clean) SESS.clean++; else SESS.help++; if(strat&&clean) SESS.strat++;
  SESS.pips[SESS.idx-1]=clean?'done':'help';
  if(!clean){ SESS.struggleRun++; } else SESS.struggleRun=0;
  S.log.push({t:Date.now(),id:entry.id,ok:true,clean,hints:Q.hints,att:Q.attempts,rapid:Q.rapid,ms,tool:toolUsed,strat:!!strat,hard:Q.hard,gap,role:entry.role,kind:'train'});
  /* come back to it later in the same session if it needed help */
  if(!clean&&entry.role!=='repeat'&&entry.role!=='rebuild'&&!entry.again){ SESS.plan.splice(Math.min(SESS.plan.length,SESS.idx+3),0,{id:entry.id,role:'repeat',again:true}); }
  /* feedback */
  let msg;
  if(clean&&strat&&q.noBridge) msg=q.kind==='add'?'You worked it out step by step. Nice!':'You took them away and counted what was left. Nice!';
  else if(clean&&strat) msg=q.kind==='sub'||q.kind==='fam'?'You stepped back to ten first. Smart strategy!':q.kind==='bond'?'You filled the tray to ten. Nice work!':'You made ten first, then added the rest. That is the trick!';
  else if(clean&&toolUsed!=='none') msg=`You checked it with the ${toolUsed==='line'?'number line':'counters'}. That is a good habit.`;
  else if(clean) msg='You just knew that one! Can you tell someone how?';
  else msg=`You got there. That is what practising is for. ${esc(S.dragon.name)} will bring this one back soon.`;
  setFb('good',`${msg}${gain?` <b>+${gain}</b> ${ic('ember',16)}`:''}`,'check');
  Audio_.fx('good');
  const em=$('#emb'); if(em) em.textContent=S.embers;
  const p=$('#pips'); if(p) p.innerHTML=pipsHTML();
  $('#eq').innerHTML=q.eq.map(t=>t.op?`<span class="op">${t.op}</span>`:t.ans?`<span class="slot-ans has" style="border-color:var(--good);color:var(--good)">${q.ans}</span>`:`<span>${t.t}</span>`).join('');
  renderRight(); saveState();
}
function afterQuestion(){
  /* two tough ones in a row: put an easy one next and offer a breather */
  if(SESS.struggleRun>=2&&SESS.idx<SESS.plan.length+1){
    SESS.struggleRun=0;
    const easy=easiestKnown(SESS.plan.slice(SESS.idx).map(e=>e.id));
    if(easy) SESS.plan.splice(SESS.idx,0,{id:easy,role:'rebuild'});
    openSheet(`<h2>That was a tricky bit</h2><p class="sub">Tricky ones are how brains grow. Want a quick breather before the next one?</p>
      <div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-act="close-next">Keep going</button><button class="btn btn-primary" data-act="breathe-next">${ic('wind',20)} Take a breather</button></div>`);
    return;
  }
  nextQuestion();
}
function showBreather(then){
  openSheet(`<div class="center"><h2>Breathe with ${esc(S.dragon.name)}</h2><p class="sub">In through your nose while the circle grows. Out slowly while it shrinks.</p><div class="breathe" aria-hidden="true"></div><button class="btn btn-primary btn-big" data-act="${then||'close'}">I'm ready</button></div>`);
}
function quitTraining(){
  openSheet(`<h2>Stop for now?</h2><p class="sub">Your embers and progress so far are saved.</p><div class="row" style="justify-content:flex-end"><button class="btn btn-ghost" data-act="close">Keep going</button><button class="btn btn-primary" data-act="quit-yes">Stop for now</button></div>`);
}
function finishSession(partial){
  const bonus=SESS.bonus; let bonusEmbers=0;
  const rec={id:Date.now(),date:today(),start:SESS.startedAt,end:Date.now(),q:SESS.total,ok:SESS.ok,clean:SESS.clean,help:SESS.help,strat:SESS.strat,hardAsked:SESS.hardAsked,hardGuess:SESS.hardGuess,hardTry:SESS.hardTry,
    firstAnswerMs:SESS.firstAnswerMs,startDelayMs:SESS.startDelayMs,faceStart:SESS.faceStart,faceEnd:null,newItems:SESS.newItems,embers:SESS.earned,partial:!!partial,bonus};
  SESS.rec=rec;
  if(SESS.total>0) S.sessions.push(rec);
  if(!partial&&bonus&&SESS.total>=3){ bonusEmbers=Math.min(3,extraLeft()); S.day.extra=(S.day.extra||0)+bonusEmbers; S.embers+=bonusEmbers; SESS.earned+=bonusEmbers; rec.embers=SESS.earned; }
  if(!partial&&!bonus){
    bonusEmbers=5+(S.day.trained?0:0); S.embers+=bonusEmbers; SESS.earned+=bonusEmbers; rec.embers=SESS.earned;
    S.day.trained=true; bumpStreak(); abilityTick();
    SESS.newborn=[]; S.extra.forEach(e=>{ if(!e.hatched){ e.hatched=true; e.since=S.days.length; SESS.newborn.push(e.name); } });
  }
  snapshot(); saveState();
  if(partial){ goHome(); return; }
  renderEnd();
}
function renderEnd(stage){
  screen='end'; const app=$('#app'); const D=esc(S.dragon.name);
  if(!S.dragon.hatched&&stage!=='hatched'){
    app.innerHTML=`<div class="screen"><div class="center">
      <h1>Something is happening!</h1><p style="color:var(--ink2)">Your egg is wobbling. Tap it to help it hatch.</p>
      <button class="hero-dragon" data-act="hatch" aria-label="Hatch the egg" style="cursor:pointer"><span class="wiggle-wrap">${eggSVG(S.dragon,{wiggle:true})}</span></button>
    </div></div>`; return;
  }
  const strat=SESS.strat;
  app.innerHTML=`<div class="screen"><div class="center">
    <div class="hero-dragon">${dragonSVG(S.dragon,{mood:'cheer',stage:dragonStage(),wear:S.dragon.gear,uid:'end'})}</div>
    <h1>${stage==='hatched'?`Meet ${D}!`:'Training done!'}</h1>
    <p style="color:var(--ink2);max-width:520px">${stage==='hatched'?`${D} hatched because of your hard work today.`:strat>0?`You used the "make ten" trick on ${strat} question${strat===1?'':'s'}.`:`${D} is proud of you for trying.`}</p>
    ${SESS.newborn&&SESS.newborn.length?`<p style="max-width:520px"><b>${esc(SESS.newborn.join(' and '))} just hatched in the stables!</b> Go and say hello.</p>`:''}
    <div class="stat-row">
      <div class="stat"><b class="num">${SESS.total}</b><span>questions done</span></div>
      <div class="stat"><b class="num">+${SESS.earned}</b><span>embers earned</span></div>
      ${SESS.bonus?'':`<div class="stat"><b class="num">${S.streak.cur}</b><span>day flame ${ic('flame',16)}</span></div>`}
    </div>
    <div style="margin-top:6px"><p style="color:var(--ink2)">How was that?</p>
    <div class="faces" style="margin:6px 0" id="endfaces">
      <button class="face" data-act="endface" data-v="3" style="width:96px;padding:8px">${faceSVG('good')}Good</button>
      <button class="face" data-act="endface" data-v="2" style="width:96px;padding:8px">${faceSVG('ok')}Okay</button>
      <button class="face" data-act="endface" data-v="1" style="width:96px;padding:8px">${faceSVG('worried')}Tricky</button>
    </div></div>
    <button class="btn btn-ember btn-big" data-act="home-after">Back to the island ${ic('next',24)}</button>
  </div></div>`;
  Audio_.fx('fanfare');
}

/* ---- Dragon Dash ---- */
function dashUnlocked(){ return S.day.trained && ALL_ITEMS.filter(it=>boxOf(it.id)>=2).length>=6; }
function dashLockedReason(){
  if(!S.day.trained) return 'Opens after today\'s training.';
  const n=ALL_ITEMS.filter(it=>boxOf(it.id)>=2).length; if(n<6) return `Opens when you know 6 facts well (${n} so far).`;
  if(S.day.dashDone) return 'Done for today. Come back tomorrow!';
  return '';
}
function showDashIntro(){
  screen='dashintro'; const D=esc(S.dragon.name), choice=S.settings.dashMode==='choice';
  $('#app').innerHTML=`<div class="screen"><div class="center">
   <div class="hero-dragon">${dragonSVG(S.dragon,{mood:'happy',stage:dragonStage(),wear:S.dragon.gear,uid:'dash'})}</div>
   <h1>Dragon Dash</h1>
   <p style="max-width:540px;color:var(--ink2)">Ten quick ones, all facts you already know. Every right answer catches a treat for ${D}. Nothing is ever taken away, and you only race your own best${S.dash.best?` (best so far: <b>${S.dash.best}</b>)`:''}.</p>
   <div class="row" style="justify-content:center">
     <button class="btn btn-ember btn-big" data-act="dash-go" data-clock="0">Start, no clock</button>
     ${choice?`<button class="btn btn-primary btn-big" data-act="dash-go" data-clock="1">Gentle clock (75 seconds)</button>`:''}
   </div>
   <button class="btn btn-ghost" data-act="home">Not now</button>
  </div></div>`;
}
function startDash(clock){
  Audio_.ensure();
  let pool=ALL_ITEMS.filter(it=>boxOf(it.id)>=2); if(!pool.length) pool=ALL_ITEMS.filter(it=>isSeen(it.id));
  let ids=shuffle(pool.map(i=>i.id)); while(ids.length<10) ids=ids.concat(shuffle(pool.map(i=>i.id)));
  ids=ids.slice(0,10);
  DASH={ids,i:0,correct:0,clock:!!clock,limit:75000,t0:Date.now(),qStart:0,ans:'',locked:false,done:false,treats:0,timer:null,results:[]};
  screen='dash'; nextDash();
  if(clock) DASH.timer=setInterval(dashTick,200);
}
function dashTick(){
  if(!DASH||DASH.done){return;}
  const left=Math.max(0,DASH.limit-(Date.now()-DASH.t0)), bar=$('#sunbar i'); if(bar) bar.style.width=(left/DASH.limit*100)+'%';
  if(left<=0&&!DASH.locked) endDash();
}
function nextDash(){
  if(DASH.i>=DASH.ids.length) return endDash();
  const it=ITEM[DASH.ids[DASH.i]]; DASH.q=makeQ(it); DASH.qStart=Date.now(); DASH.ans=''; DASH.locked=false;
  renderDash();
}
function renderDash(fbHtml){
  const q=DASH.q; let pad='';
  for(const d of [1,2,3,4,5,6,7,8,9]) pad+=`<button class="btn" data-act="dnum" data-d="${d}">${d}</button>`;
  pad+=`<button class="btn" data-act="dback" aria-label="Delete">${ic('back',22)}</button><button class="btn" data-act="dnum" data-d="0">0</button><button class="btn btn-primary" data-act="dcheck" aria-label="Check">${ic('check',26)}</button>`;
  let treats=''; for(let k=0;k<DASH.treats;k++) treats+=`<svg viewBox="0 0 24 24" style="color:#6db7d9">${ICONS.fish}</svg>`;
  $('#app').innerHTML=`<div class="screen">
   <div class="sess-top"><button class="btn btn-ghost btn-sm" data-act="dash-quit">${ic('close',18)} Stop</button>
    <div class="dash-top" style="flex:1"><b class="num" style="font-size:1.2rem">${Math.min(DASH.i+1,10)} of 10</b>${DASH.clock?`<div class="sunbar" id="sunbar" aria-label="Time left"><i style="width:${Math.max(0,100-(Date.now()-DASH.t0)/DASH.limit*100)}%"></i></div>`:''}</div></div>
   <div class="desk" style="grid-template-columns:minmax(0,.8fr) minmax(0,1fr)">
    <section class="panel"><div class="center" style="padding:0"><div class="hero-dragon">${dragonSVG(S.dragon,{mood:DASH.mood||'happy',stage:dragonStage(),wear:S.dragon.gear,uid:'dd'})}</div>
      <p style="color:var(--ink2)">Treats caught</p><div class="treats">${treats}</div></div></section>
    <section class="panel"><div class="eq" style="font-size:clamp(2.6rem,6vw,4.2rem)">${eqHTML(q,DASH.ans)}</div>
      <div class="fb ${DASH.fbk||''}" style="min-height:52px" id="dfb">${fbHtml||''}</div><div class="pad">${pad}</div></section>
   </div></div>`;
}
function dashAnswer(){
  if(!DASH||DASH.locked||DASH.done||DASH.ans==='') return;
  const val=parseInt(DASH.ans,10), q=DASH.q, ms=Date.now()-DASH.qStart, ok=val===q.ans; DASH.locked=true;
  applyResult(DASH.ids[DASH.i],{clean:ok,kind:'dash'});
  S.log.push({t:Date.now(),id:DASH.ids[DASH.i],ok,clean:ok,hints:0,att:ok?0:1,ms,tool:'none',kind:'dash',gap:null});
  if(ok){ DASH.correct++; DASH.treats++; Audio_.fx('good'); DASH.fbk='good'; DASH.mood='cheer'; }
  else { Audio_.fx('soft'); DASH.fbk='soft'; DASH.mood='happy'; }
  renderDash(ok?`${ic('check',22)} Caught one!`:`The answer was <b>${q.ans}</b>. On to the next.`);
  DASH.i++; setTimeout(()=>{ if(DASH&&!DASH.done&&screen==='dash'){ DASH.fbk=''; DASH.mood='happy'; nextDash(); } },ok?650:1500);
}
function endDash(){
  if(!DASH||DASH.done) return; DASH.done=true; clearInterval(DASH.timer);
  const n=DASH.correct, newBest=n>S.dash.best&&n>0; let gain=n+(newBest?3:0);
  S.dash.plays.push({date:today(),correct:n,total:Math.min(DASH.i,10),clock:DASH.clock,ms:Date.now()-DASH.t0}); if(newBest) S.dash.best=n;
  S.embers+=gain; S.day.dashDone=true; saveState(); screen='dashend';
  const D=esc(S.dragon.name); let treats=''; for(let k=0;k<n;k++) treats+=`<svg viewBox="0 0 24 24" style="color:#6db7d9">${ICONS.fish}</svg>`;
  $('#app').innerHTML=`<div class="screen"><div class="center">
    <div class="hero-dragon">${dragonSVG(S.dragon,{mood:'eat',stage:dragonStage(),wear:S.dragon.gear,uid:'de'})}</div>
    <h1>${D} caught ${n} treat${n===1?'':'s'}!</h1><div class="treats" style="justify-content:center">${treats}</div>
    <p style="color:var(--ink2)">${newBest?'That is your best Dash so far!':S.dash.best?`Your best is ${S.dash.best}. Tomorrow you can beat it.`:''}</p>
    <div class="stat-row"><div class="stat"><b class="num">+${gain}</b><span>embers earned</span></div></div>
    <button class="btn btn-ember btn-big" data-act="home">Back to the island ${ic('next',24)}</button></div></div>`;
  Audio_.fx('munch'); setTimeout(()=>Audio_.fx('fanfare'),500);
}
