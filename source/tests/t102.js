const {open,create,sleep}=require('./th.js');
(async()=>{const {b,page,errs}=await open({});await page.waitForFunction(()=>window.EmberIsle);await create(page);
 await page.evaluate(()=>{EmberIsle.state().dragon.hatched=true});
 await page.evaluate(()=>{EmberIsle.Village.refresh()});await sleep(1200);
 await page.evaluate(()=>document.querySelectorAll('#vdbtn button').forEach(b=>b.click()));
 const say=()=>page.evaluate(()=>{const d=document.getElementById('vdlg');return d&&!d.hidden?document.getElementById('vdtxt').innerText:'(none)'});
 const waitBtns=async()=>{await page.waitForFunction(()=>document.querySelectorAll('#vdbtn button').length>0,null,{timeout:8000})};
 const click=async(label)=>{await waitBtns();const bs=await page.$$('#vdbtn button');for(const x of bs){if((await x.innerText()).startsWith(label)){await x.click();await sleep(250);return true}}console.log('NO BUTTON',label,await page.evaluate(()=>[...document.querySelectorAll('#vdbtn button')].map(x=>x.innerText)));return false};
 const shot=n=>page.screenshot({path:'pshots/'+n+'.png'});
 // open the book: intro pages
 await page.click('#vstory');await sleep(300);
 for(let i=0;i<3;i++){await waitBtns();console.log('page',i+1,(await say()).slice(0,70));await click(i<2?'Turn':'On we go').catch(()=>{});}
 // after intro: 'On we go' was last; click again?
 await waitBtns();console.log('after intro:',(await say()).slice(0,80));await click('OK');
 console.log('story',JSON.stringify(await page.evaluate(()=>EmberIsle.state().story)));
 const spots=[[24,14],[23,17],[21,18],[18,21]];
 for(let i=0;i<4;i++){
   await page.evaluate(([x,y])=>{EmberIsle.Village.warp(x,y+1.6)},spots[i]);await sleep(900);await shot('st_spot'+i);
   // try later spot first on step 0 to test the hint
   if(i===0){await page.evaluate(()=>EmberIsle.Village.runAct('story:2'));await sleep(1200);console.log('too early:',await say());await click('OK');}
   await page.evaluate((i)=>EmberIsle.Village.runAct('story:'+i),i);await sleep(1500);
   console.log('spot',i,(await say()).slice(0,90));
   if(i<3){await click(['Count them','Count the crumbs','Read the numbers'][i]);await sleep(300);await waitBtns();await sleep(200);
     // wrong answer first
     const q=await say();const bs=await page.$$('#vdbtn button');
     const labs=await Promise.all(bs.map(x=>x.innerText()));console.log('  q:',q.replace(/\n/g,' / ').slice(0,200),'opts',labs.join(','));
     // find correct by trying each; wrong shows 'Not quite'
     for(let k=0;k<labs.length;k++){const bb=await page.$$('#vdbtn button');await bb[k].click();await sleep(300);await waitBtns().catch(()=>{});await sleep(100);const t=await say();if(!t.startsWith('Not quite')){console.log('  right on try',k+1,'->',t.slice(0,70));break}else{console.log('  wrong:',labs[k])}}
     await click('OK');
   }else{
     for(let p=0;p<4;p++){await waitBtns();console.log('  end page',p+1,(await say()).slice(0,60));await click(p<3?'Turn':'On we go');}
   }
   await sleep(500);
 }
 console.log('story',JSON.stringify(await page.evaluate(()=>EmberIsle.state().story)).slice(0,400),'embers',await page.evaluate(()=>EmberIsle.state().embers));
 await page.click('#vstory');await sleep(300);await waitBtns();console.log('book now:',await say(),await page.evaluate(()=>[...document.querySelectorAll('#vdbtn button')].map(x=>x.innerText)));
 await click('Clue Book');await sleep(500);await shot('st_clues');
 console.log('errs',JSON.stringify(errs));await b.close()})();
