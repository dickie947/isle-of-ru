const {open,create,sleep}=require('./th.js');
(async()=>{const {b,page,errs}=await open({});await page.waitForFunction(()=>window.EmberIsle);await create(page);
 await page.evaluate(()=>{const S=EmberIsle.state();S.dragon.hatched=true;S.day.trained=true;S.embers=0;if(!S.inv.decor.includes('garden'))S.inv.decor.push('garden');
  S.days=['2026-11-01','2026-11-02','2026-11-03','2026-11-04','2026-11-05'];S.story={ch:{1:{step:3,done:true,doneDays:0}},clues:[{id:'x',title:'t',text:'t'}],seen:true}});
 await page.evaluate(()=>{EmberIsle.Village.refresh()});await sleep(1200);
 await page.evaluate(()=>document.querySelectorAll('#vdbtn button').forEach(b=>b.click()));
 const say=()=>page.evaluate(()=>{const d=document.getElementById('vdlg');return d&&!d.hidden?document.getElementById('vdtxt').innerText:'(none)'});
 const waitBtns=async()=>{await page.waitForFunction(()=>document.querySelectorAll('#vdbtn button').length>0,null,{timeout:9000})};
 const click=async(label)=>{await waitBtns();const bs=await page.$$('#vdbtn button');for(const x of bs){if((await x.innerText()).startsWith(label)){await x.click();await sleep(250);return true}}console.log('NO BUTTON',label,await page.evaluate(()=>[...document.querySelectorAll('#vdbtn button')].map(x=>x.innerText)));return false};
 const solve=async(tag)=>{ // click through puzzle options until correct
   await sleep(300);await waitBtns();await sleep(250);const q=await say();const labs=await page.evaluate(()=>[...document.querySelectorAll('#vdbtn button')].map(x=>x.innerText));
   console.log(tag,'Q:',q.replace(/\n/g,' / ').slice(0,230),'opts',labs.join(','));
   for(let k=0;k<labs.length;k++){const bb=await page.$$('#vdbtn button');await bb[k].click();await sleep(300);await waitBtns().catch(()=>{});await sleep(150);const t=await say();if(!t.startsWith('Not quite')){console.log('  ->',t.slice(0,90),k===0?'(first try)':'(try '+(k+1)+')');return}}};
 const shot=n=>page.screenshot({path:'pshots/'+n+'.png'});
 // garden
 await page.evaluate(()=>EmberIsle.Village.warp(16.5,18));await sleep(900);await shot('u4_garden');
 await page.evaluate(()=>EmberIsle.Village.runAct('use:garden'));await sleep(1800);console.log('garden:',(await say()).slice(0,80));await click('Water');await solve('garden');await click('OK');
 console.log('honey',await page.evaluate(()=>EmberIsle.state().inv.honey),'embers',await page.evaluate(()=>EmberIsle.state().embers));
 await page.evaluate(()=>EmberIsle.Village.runAct('use:garden'));await sleep(1500);console.log('garden again:',(await say()).slice(0,70));await click('OK').catch(()=>{});
 // farm
 await page.evaluate(()=>EmberIsle.Village.warp(32,18.2));await sleep(900);await shot('u4_farm');
 await page.evaluate(()=>EmberIsle.Village.runAct('farm'));await sleep(1800);console.log('farm:',(await say()).slice(0,80));await click('Milk');await solve('farm');await click('OK');
 console.log('milk',await page.evaluate(()=>EmberIsle.state().inv.milk));
 await page.evaluate(()=>EmberIsle.Village.runAct('farm'));await sleep(1500);console.log('farm again:',(await say()).slice(0,70));await click('OK').catch(()=>{});
 // story chapter 2 : opens after 4 days since ch1 done (days.length 5 >= 4)
 console.log('errs',JSON.stringify(errs));await b.close()})();