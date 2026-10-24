const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open({viewport:{width:1180,height:820}});
  await page.waitForFunction(()=>window.EmberIsle);await create(page);
  await page.evaluate(()=>{const S=EmberIsle.state();S.settings.exploreAny=true;S.dragon.hatched=true;S.day.trained=true;S.days=Array.from({length:12},(_,i)=>'2026-09-'+String(i+1).padStart(2,'0'));EmberIsle.save();EmberIsle.Village.refresh()});
  await sleep(600);
  await page.evaluate(()=>{const S=EmberIsle.state();S.millie={date:S.day.date,spot:0,rescued:true,total:1};});
  await page.evaluate(()=>EmberIsle.Village.runAct('millie'));await sleep(2500);
  await page.evaluate(()=>{[...document.querySelectorAll('#vdbtn button')].find(b=>/hide/i.test(b.innerText)).click()});
  await page.waitForFunction(()=>EmberIsle.Village.zone().id==='green',null,{timeout:60000});await ready(page);await sleep(900);
  await page.screenshot({path:'pshots/z4_a_arrive.png'});
  await sleep(1500);
  const dl=()=>page.evaluate(()=>{const d=document.getElementById('vdlg');return d&&!d.hidden?d.innerText.replace(/\n/g,' | '):null});
  console.log('dlg',await dl());
  await page.screenshot({path:'pshots/z4_b_clue.png'});
  console.log('hs',JSON.stringify(await page.evaluate(()=>EmberIsle.state().day.hs)));
  console.log(errs);
  await b.close();
})();
