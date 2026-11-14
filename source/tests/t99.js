const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open();
  await page.waitForFunction(()=>window.EmberIsle);await create(page);
  await page.evaluate(()=>{const S=EmberIsle.state();S.dragon.hatched=true;S.day.trained=true;S.embers=0;});
  const shot=async(name)=>{await page.evaluate(()=>{EmberIsle.Village.reset();EmberIsle.Village.refresh()});await sleep(1800);await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click());EmberIsle.Village.warp(36.5,14.5)});await sleep(900);await page.screenshot({path:'pshots/t99_'+name+'.png'});};
  await shot('s0');
  for(let d=1;d<=9;d++){
    const r=await page.evaluate(()=>{const f=JSON.parse(localStorage.getItem('isleOfRu.family')||'{}');f.date='2000-01-01';f.bday={};localStorage.setItem('isleOfRu.family',JSON.stringify(f));
      EmberIsle.Fam.practiceDone();const lb=EmberIsle.Fam.lastBuild;return JSON.stringify(lb)+' embers='+EmberIsle.state().embers});
    console.log('day',d,r);
    if(d===2)await shot('s1');if(d===4)await shot('s2');if(d===6)await shot('s3');if(d===8)await shot('s4');
  }
  console.log('fam',await page.evaluate(()=>localStorage.getItem('isleOfRu.family')));
  await page.evaluate(()=>EmberIsle.Village.runAct('use:lighthouse'));await sleep(3200);
  console.log('say',await page.evaluate(()=>document.getElementById('vdlg').innerText.replace(/\n/g,' ')));
  console.log('errs',JSON.stringify(errs));await b.close();
})();
