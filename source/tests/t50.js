const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open({autoConfirm:true});
  await page.waitForFunction(()=>window.EmberIsle);
  await create(page);
  const dl=()=>page.evaluate(()=>{const d=document.getElementById('vdlg');return d&&!d.hidden?d.innerText.replace(/\n/g,' | '):null});
  await page.evaluate(()=>{const S=EmberIsle.state();S.settings.exploreAny=true;S.dragon.hatched=true;S.days=Array.from({length:12},(_,i)=>'2026-09-'+String(i+1).padStart(2,'0'));S.embers=2000;S.inv.built=['forge'];S.log=S.log||[];EmberIsle.save();});
  // seed seen items so shard questions work
  await page.evaluate(()=>EmberIsle.Village.travelTo('green'));
  await page.waitForFunction(()=>EmberIsle.Village.zone().id==='green',null,{timeout:60000}).catch(e=>console.log('no travel',e.message));
  await ready(page);await sleep(800);
  await page.screenshot({path:'pshots/green_plots.png'});
  console.log('zone',await page.evaluate(()=>EmberIsle.Village.zone().id));
  // buy all
  for(const id of ['foodstore','coop','bath','library','bakery','workshop','arena']){
    await page.evaluate(i=>{EmberIsle.act('shop')},id);
    await page.evaluate(()=>EmberIsle.act('shoptab',{k:'build'}));
    await page.evaluate(i=>EmberIsle.act('buy',{id:i}),id);await sleep(250);
    await page.evaluate(()=>EmberIsle.act('close'));
  }
  console.log('built',await page.evaluate(()=>JSON.stringify(EmberIsle.state().inv.built)));
  await page.evaluate(()=>{EmberIsle.state().inv.crafted=['bench','birdhouse','flowercart'];EmberIsle.Village.refresh()});
  await sleep(600);await page.screenshot({path:'pshots/green_built.png'});
  await page.evaluate(()=>{window.scrollTo(0,0)});
  for(const a of ['bakery','coop','bath','library','arena']){
    await page.evaluate(x=>EmberIsle.Village.runAct(x),a);await sleep(2300);
    console.log(a,'->',await dl());
    await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>{if(/Bake|Check|Start|Read/.test(b.textContent))b.click()})});
    await sleep(500);
    if(await page.$('#vq .vq-o')){
      for(let r=0;r<4;r++){
        if(!await page.$('#vq .vq-o'))break;
        for(let k=0;k<3;k++){const cur=await page.$$('#vq .vq-o');if(!cur[k])break;await cur[k].click({timeout:1500}).catch(()=>{});await sleep(250);const t=await page.evaluate(()=>document.querySelector('#vq .vq-msg')&&document.querySelector('#vq .vq-msg').innerText);if(/Yes!|answer is|anyway|keep going|Perfect|counted|Measured/.test(t||''))break}
        await page.click('#vq [data-vq="ok"]',{timeout:1500}).catch(()=>{});await sleep(400);
      }
      await sleep(2300);console.log('  after:',await dl());
    }
    await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});await sleep(300);
  }
  console.log('inv',await page.evaluate(()=>JSON.stringify([EmberIsle.state().inv.bun,EmberIsle.state().inv.egg,EmberIsle.state().embers])));
  await page.evaluate(()=>EmberIsle.Village.runAct('arena'));await sleep(500);await page.screenshot({path:'pshots/arena_sheet.png'});
  await page.evaluate(()=>EmberIsle.act('close'));
  await page.evaluate(()=>EmberIsle.Village.runAct('workshop'));await sleep(500);await page.screenshot({path:'pshots/workshop_sheet.png'});
  await page.evaluate(()=>EmberIsle.act('close'));
  await page.evaluate(()=>EmberIsle.act('nest'));await sleep(400);console.log('nest treats',(await page.evaluate(()=>document.body.innerText)).includes('Honey bun'));
  console.log('errors',errs);
  await b.close();
})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
