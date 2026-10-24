const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  for(const [nm,vp] of [['land',{width:1180,height:820}],['port',{width:820,height:1180}],['phone',{width:390,height:780}]]){
  const {b,page,errs}=await open({viewport:vp,touch:nm!=='land'});
  await page.waitForFunction(()=>window.EmberIsle);await create(page);
  await page.evaluate(()=>{const S=EmberIsle.state();S.settings.exploreAny=true;S.dragon.hatched=true;S.day.trained=true;S.days=Array.from({length:12},(_,i)=>'2026-09-'+String(i+1).padStart(2,'0'));S.inv.built=['foodstore'];EmberIsle.save();EmberIsle.Village.refresh()});
  await page.evaluate(()=>EmberIsle.Village.travelTo('green'));
  await page.waitForFunction(()=>EmberIsle.Village.zone().id==='green',null,{timeout:60000});await ready(page);await sleep(1200);
  await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});await sleep(500);
  console.log(nm,JSON.stringify(await page.evaluate(()=>{const V=EmberIsle.Village;return V.state?{P:V.state.P}:null})));
  await page.screenshot({path:'pshots/z2_'+nm+'.png'});
  await b.close();}
})();
