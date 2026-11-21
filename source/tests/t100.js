const {open,ready,create,sleep}=require('./th.js');
const init=`(()=>{const R=Date;const off=new R('2026-11-24T10:00:00Z').getTime()-R.now();const N=function(...a){return a.length?new R(...a):new R(R.now()+off)};N.now=()=>R.now()+off;N.parse=R.parse;N.UTC=R.UTC;N.prototype=R.prototype;window.Date=N})()`;
(async()=>{
  const {b,page,errs}=await open({init});
  await page.waitForFunction(()=>window.EmberIsle);await create(page);
  await page.evaluate(()=>{const S=EmberIsle.state();S.dragon.hatched=true;S.day.trained=true;S.embers=0;
    localStorage.setItem('isleOfRu.family',JSON.stringify({projDone:['lighthouse'],bricks:{lighthouse:40}}));});
  const shot=async(name)=>{await page.evaluate(()=>{EmberIsle.Village.reset();EmberIsle.Village.refresh()});await sleep(1800);await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click());EmberIsle.Village.warp(32,17.2)});await sleep(700);await page.screenshot({path:'pshots/'+name+'.png'})};
  await shot('ls0');
  for(let d=1;d<=9;d++){
    const r=await page.evaluate(()=>{const f=JSON.parse(localStorage.getItem('isleOfRu.family')||'{}');f.date='2000-01-01';f.bday={};localStorage.setItem('isleOfRu.family',JSON.stringify(f));
      EmberIsle.Fam.practiceDone();const lb=EmberIsle.Fam.lastBuild;return JSON.stringify(lb)});
    console.log('day',d,r);
    if(d===2)await shot('ls1');if(d===4)await shot('ls2');if(d===6)await shot('ls3');if(d===8)await shot('ls4');
  }
  await page.evaluate(()=>{EmberIsle.Village.runAct('use:longship')});await sleep(3500);
  console.log('say',await page.evaluate(()=>document.getElementById('vdlg').innerText.replace(/\n/g,' ')));
  console.log('errs',JSON.stringify(errs));await b.close();
})();
