const {open,create,sleep}=require('./th.js');
(async()=>{const {b,page,errs}=await open({});await page.waitForFunction(()=>window.EmberIsle);await create(page);
 await page.evaluate(()=>{const S=EmberIsle.state();S.dragon.hatched=true;S.days=['2026-11-01','2026-11-02','2026-11-03','2026-11-04','2026-11-05']});
 await page.evaluate(()=>{EmberIsle.Village.refresh()});await sleep(1200);
 await page.evaluate(()=>document.querySelectorAll('#vdbtn button').forEach(b=>b.click()));
 const vis=()=>page.evaluate(()=>{const d=document.getElementById('vdlg');return d&&!d.hidden});
 const say=()=>page.evaluate(()=>document.getElementById('vdtxt').innerText);
 const labs=()=>page.$$eval('#vdbtn button',bs=>bs.map(x=>x.innerText));
 let words=0,pages=0,maxLen=0;
 // plays the open dialog chain until it closes; solves puzzles by trying each numeric option
 const drive=async()=>{for(let g=0;g<80;g++){await sleep(220);if(!(await vis()))return;try{await page.waitForFunction(()=>document.querySelectorAll('#vdbtn button').length>0,null,{timeout:9000})}catch(e){return}const t=await say(),L=await labs();
   if(L.length&&L.every(x=>/^\d+$/.test(x))){for(let k=0;k<L.length;k++){const bs=await page.$$('#vdbtn button');await bs[k].click();await sleep(400);if(!(await vis()))break;try{await page.waitForFunction(()=>document.querySelectorAll('#vdbtn button').length>0,null,{timeout:9000})}catch(e){break}if(!(await say()).startsWith('Not quite'))break}continue}
   if(process.env.DBG)console.log('PG',L.join('|'),'::',t.slice(0,60).replace(/\n/g,' '));if(!/^(Not quite)/.test(t)){words+=t.split(/\s+/).length;pages++;maxLen=Math.max(maxLen,t.length)}
   const bs=await page.$$('#vdbtn button');if(!bs.length)return;await bs[0].click()}};
 const play=async(n,count,warps)=>{words=0;pages=0;maxLen=0;
  for(let i=0;i<count;i++){await page.evaluate(([x,y])=>EmberIsle.Village.warp(x-2.2,y+.8),warps[i]);await sleep(600);await page.screenshot({path:'pshots/c'+n+'_'+i+'.png'});
   await page.evaluate(([n,i])=>EmberIsle.Village.runAct('story:'+n+':'+i),[n,i]);await drive()}};
 // chapter 1
 await page.click('#vstory');await sleep(300);await drive();
 let st=await page.evaluate(()=>EmberIsle.state().story);console.log('after intro',JSON.stringify(st.ch));
 await play(1,5,[[24,14],[23,17],[21,18],[25,19],[18,21]]);
 st=await page.evaluate(()=>EmberIsle.state().story);console.log('ch1',JSON.stringify(st.ch[1]),'clues',st.clues.length,'story words(excl intro)',words,'pages',pages,'longest page',maxLen);
 // chapter 2
 await page.evaluate(()=>{const S=EmberIsle.state();S.story.ch[1].doneDays=0;S.days=['a','b','c','d','e','f']});
 await page.click('#vstory');await sleep(400);
 const L=await labs();console.log('book',JSON.stringify(L));
 const bs=await page.$$('#vdbtn button');for(let k=0;k<bs.length;k++){if((await bs[k].innerText()).startsWith('Chapter 2')){await bs[k].click();break}}
 await drive();
 await page.evaluate(()=>EmberIsle.Village.refresh());await sleep(800);
 await play(2,4,[[13,14],[30,14],[25,19],[26,12]]);
 st=await page.evaluate(()=>EmberIsle.state().story);console.log('ch2',JSON.stringify(st.ch[2]),'clues',st.clues.length,'words',words,'pages',pages,'longest page',maxLen,'embers',await page.evaluate(()=>EmberIsle.state().embers));
 // replay finished chapter 1 from the book
 words=0;pages=0;await page.click('#vstory');await sleep(400);
 const b2=await page.$$('#vdbtn button');for(let k=0;k<b2.length;k++){if((await b2[k].innerText()).startsWith('Chapter 1')){await b2[k].click();break}}
 await drive();console.log('replay ch1 words',words,'pages',pages);
 console.log('errs',JSON.stringify(errs));await b.close()})();
