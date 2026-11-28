const {open,create,sleep}=require('./th.js');
(async()=>{const {b,page,errs}=await open({});await page.waitForFunction(()=>window.EmberIsle);await create(page);
 await page.evaluate(()=>{const S=EmberIsle.state();S.dragon.hatched=true;S.day.trained=true;S.days=['a','b','c','d','e'];S.embers=0});
 await page.evaluate(()=>{EmberIsle.Village.refresh()});await sleep(1200);
 await page.evaluate(()=>document.querySelectorAll('#vdbtn button').forEach(b=>b.click()));
 await page.evaluate(()=>EmberIsle.Village.travelTo('snow'));await sleep(6000);
 const vis=()=>page.evaluate(()=>{const d=document.getElementById('vdlg');return d&&!d.hidden});
 const say=()=>page.evaluate(()=>document.getElementById('vdtxt').innerText);
 const btns=async()=>{try{await page.waitForFunction(()=>document.querySelectorAll('#vdbtn button').length>0,null,{timeout:9000})}catch(e){return []}return page.$$eval('#vdbtn button',bs=>bs.map(x=>x.innerText))};
 const clickL=async(label)=>{await btns();const bs=await page.$$('#vdbtn button');for(const x of bs){if((await x.innerText()).startsWith(label)){await x.click();await sleep(300);return true}}console.log('NO BUTTON',label);return false};
 const q=async()=>{ // play the #vq quiz box until it closes
   for(let g=0;g<20;g++){await sleep(300);const open=await page.evaluate(()=>{const b=document.getElementById('vq');return b&&!b.hidden&&b.innerHTML.length>0});if(!open)return;
     const txt=await page.evaluate(()=>document.querySelector('.vq-eq').innerText);if(g===0)console.log('   Q:',txt.slice(0,110));
     const ok=await page.$('[data-vq="ok"]');if(ok){await ok.click();continue}
     const os=await page.$$('.vq-o:not([disabled])');if(os.length)await os[g%os.length].click()}};
 const shot=n=>page.screenshot({path:'pshots/'+n+'.png'});
 const sc=await page.evaluate(()=>EmberIsle.Village.zone().id);console.log('zone',sc);
 const spots={daddy:[12.6,14.6],andy:[19.7,13.7],crumpet:[19.5,15.5]};
 for(const id of ['daddy','andy','crumpet']){
  await page.evaluate(([x,y])=>EmberIsle.Village.warp(x-1.6,y+.4),spots[id]);await sleep(900);await shot('cast_'+id);
  await page.evaluate((id)=>EmberIsle.Village.runAct('vill:'+id),id);await sleep(1200);
  console.log(id,'intro:',(await say()).slice(0,90).replace(/\n/g,' '),'|',JSON.stringify(await btns()));
  await clickL('Bye');await sleep(300);
  await page.evaluate((id)=>EmberIsle.Village.runAct('vill:'+id),id);await sleep(1000);console.log('  chat:',(await say()).slice(0,80).replace(/\n/g,' '));
  const L=await btns();const qb=L.find(x=>!/Bye|tips/i.test(x));await clickL(qb);await sleep(500);console.log('  story:',(await say()).slice(0,70).replace(/\n/g,' '));
  await clickL("Let's do it");await sleep(500);for(let k=0;k<3;k++)await q();
  await sleep(500);console.log('  done:',(await say()).slice(0,120).replace(/\n/g,' '));await clickL('Thank you').catch(()=>{});await sleep(400);
  console.log('  embers',await page.evaluate(()=>EmberIsle.state().embers),'done list',JSON.stringify(await page.evaluate(()=>EmberIsle.state().vill.done)));
 }
 await page.evaluate(()=>EmberIsle.Village.runAct('vill:daddy'));await sleep(900);console.log('after quest buttons:',JSON.stringify(await btns()));await clickL('Bye');
 console.log('errs',JSON.stringify(errs));await b.close()})();
