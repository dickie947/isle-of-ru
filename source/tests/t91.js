const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open();
  await page.waitForFunction(()=>window.EmberIsle);await create(page);
  await page.evaluate(()=>{const S=EmberIsle.state();S.dragon.hatched=true;S.day.trained=true;});
  await page.evaluate(()=>EmberIsle.Village.travelTo('green'));
  await page.waitForFunction(()=>EmberIsle.Village.zone().id==='green',null,{timeout:60000});await ready(page);await sleep(900);
  await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});
  await page.evaluate(()=>EmberIsle.Village.runAct('hsboard'));await sleep(3500);
  console.log('btns',await page.evaluate(()=>[...document.querySelectorAll('#vdbtn button')].map(b=>b.innerText)));
  await page.evaluate(()=>[...document.querySelectorAll('#vdbtn button')].find(b=>/Treasure/.test(b.innerText)).click());await sleep(400);
  console.log('sheet',await page.evaluate(()=>document.querySelector('#overlay .sheet').innerText.replace(/\n/g,' ').slice(0,160)));
  await page.screenshot({path:'pshots/t91_dig.png'});
  const g=await page.evaluate(()=>EmberIsle.state().day.dig);console.log(JSON.stringify(g));
  // two misses
  const wrong=[[g.r%5+1,g.c],[g.r,g.c%5+1]];
  for(const [r,c] of wrong){await page.click(`[data-dig="${r},${c}"]`);await sleep(200);console.log('msg',await page.evaluate(()=>document.getElementById('digmsg').innerText));}
  await page.screenshot({path:'pshots/t91_dig2.png'});
  const e0=await page.evaluate(()=>EmberIsle.state().embers);
  await page.click(`[data-dig="${g.r},${g.c}"]`);await sleep(500);
  console.log('embers',e0,'->',await page.evaluate(()=>EmberIsle.state().embers),'dig flag',await page.evaluate(()=>EmberIsle.state().day.bld.dig));
  console.log('say',await page.evaluate(()=>{const d=document.getElementById('vdlg');return d&&d.innerText.replace(/\n/g,' ')}));
  console.log('errs',JSON.stringify(errs));await b.close();
})();
