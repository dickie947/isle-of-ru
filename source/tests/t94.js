const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open();
  await page.waitForFunction(()=>window.EmberIsle);await create(page);
  await page.evaluate(()=>{const S=EmberIsle.state();S.dragon.hatched=true;S.day.trained=true;S.embers=50;
    for(const id of ['tower','fountain','statue','campfire','lantern','banner','millievik','henvik']) if(!S.inv.decor.includes(id)) S.inv.decor.push(id);});
  await page.evaluate(()=>EmberIsle.Village.reset&&EmberIsle.Village.reset());await sleep(1500);
  const say=async()=>page.evaluate(()=>{const d=document.getElementById('vdlg');return d?d.innerText.replace(/\n/g,' ').slice(0,200):null});
  const btn=async(re)=>{await page.evaluate(re=>{[...document.querySelectorAll('#vdbtn button')].find(b=>new RegExp(re).test(b.innerText)).click()},re);await sleep(600)};
  const emb=()=>page.evaluate(()=>EmberIsle.state().embers);
  const dismiss=async()=>{await page.evaluate(()=>document.querySelectorAll('#vdbtn button').forEach(b=>b.click()));await sleep(300)};
  await sleep(2500);await dismiss();
  for(const [id,clicks] of [['campfire',['Hear']],['lantern',['Light']],['statue',['Salute']],['fountain',['Make a wish']],['banner',['Blue']]]){
    const e0=await emb();
    await page.evaluate(id=>EmberIsle.Village.runAct('use:'+id),id);await sleep(3200);
    console.log(id,'>',(await say()));
    for(const c of clicks){await btn(c);}
    await sleep(3000);console.log('  after:',await say(),'embers',e0,'->',await emb());
    await dismiss();
    await page.evaluate(id=>EmberIsle.Village.runAct('use:'+id),id);await sleep(2500);console.log('  again:',(await say()));await dismiss();
  }
  // tower with counting
  await page.evaluate(()=>EmberIsle.Village.runAct('use:tower'));await sleep(3500);console.log('tower>',await say());
  const boats=await page.evaluate(()=>{const t=document.getElementById('vdlg').innerText;return (t.match(/⛵/g)||[]).length});
  const e0=await emb();await btn('^'+boats+'$');await sleep(3000);console.log('  tower after',await say(),e0,'->',await emb());
  await dismiss();
  // helmets on the green
  await page.evaluate(()=>EmberIsle.Village.travelTo('green'));
  await page.waitForFunction(()=>EmberIsle.Village.zone().id==='green',null,{timeout:60000});await ready(page);await sleep(1500);await dismiss();
  await page.screenshot({path:'pshots/t94_green.png'});
  console.log('errs',JSON.stringify(errs));await b.close();
})();
