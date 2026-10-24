const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open({viewport:{width:1180,height:820}});
  await page.waitForFunction(()=>window.EmberIsle);await create(page);
  await page.evaluate(()=>{const S=EmberIsle.state();S.settings.exploreAny=true;S.dragon.hatched=true;S.day.trained=true;S.inv.built=['foodstore'];S.days=Array.from({length:12},(_,i)=>'2026-09-'+String(i+1).padStart(2,'0'));EmberIsle.save();EmberIsle.Village.refresh()});
  await sleep(600);
  await page.evaluate(()=>{const S=EmberIsle.state();S.millie={date:S.day.date,spot:0,rescued:true,total:1};});
  await page.evaluate(()=>EmberIsle.Village.runAct('millie'));await sleep(2500);
  console.log('btns',await page.evaluate(()=>[...document.querySelectorAll('#vdbtn button')].map(b=>b.innerText)));
  await page.evaluate(()=>{[...document.querySelectorAll('#vdbtn button')].find(b=>/hide/i.test(b.innerText)).click()});
  await page.waitForFunction(()=>EmberIsle.Village.zone().id==='green',null,{timeout:60000});await ready(page);await sleep(1500);
  console.log('zone',await page.evaluate(()=>EmberIsle.Village.zone().id));
  await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});await sleep(500);
  console.log(JSON.stringify(await page.evaluate(()=>{const P=EmberIsle.Village.state.P;return [P.x,P.y]})));
  await page.screenshot({path:'pshots/z4_millie.png'});
  console.log(errs);
  await b.close();
})();
