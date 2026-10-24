const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open({viewport:{width:1180,height:820}});
  await page.waitForFunction(()=>window.EmberIsle);await create(page);
  await page.evaluate(()=>{const S=EmberIsle.state();S.settings.exploreAny=true;S.dragon.hatched=true;S.day.trained=true;S.days=Array.from({length:12},(_,i)=>'2026-09-'+String(i+1).padStart(2,'0'));EmberIsle.save();EmberIsle.Village.refresh()});
  await page.evaluate(()=>EmberIsle.Village.travelTo('green'));
  await page.waitForFunction(()=>EmberIsle.Village.zone().id==='green',null,{timeout:60000});await ready(page);await sleep(1200);
  await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});await sleep(500);
  await page.screenshot({path:'pshots/z1_arrive.png'});
  console.log(JSON.stringify(await page.evaluate(()=>{const v=EmberIsle.Village;return {sprSign:typeof SPR!=='undefined'}})),errs);
  await b.close();
})();
