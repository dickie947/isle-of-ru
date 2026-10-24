const {open,ready,create,trainAll,sleep}=require('./th.js');
(async()=>{
 const {b,page,errs}=await open({autoConfirm:true});
 const shot=n=>page.screenshot({path:process.env.S+'/pshots/'+n+'.png'});
 const st=()=>page.evaluate(()=>{const S=EmberIsle.state();return{emb:S.embers,built:S.inv.built,extra:S.extra.map(e=>[e.name,e.hatched]),gear:S.dragon.gear,owned:S.inv.wear||S.inv.owned}});
 await create(page);
 await page.evaluate(()=>{const S=EmberIsle.state();S.embers=1500;S.dragon.hatched=true;EmberIsle.save();EmberIsle.Village.runAct('stall')});
 await page.click('[data-act=shoptab][data-k=build]');
 await page.click('[data-act=buy][data-id=forge]');await sleep(300);
 await page.click('[data-act=buy][data-id=stables]');await sleep(300);
 await shot('h1_shop');
 await page.click('[data-act=close]');await sleep(500);
 console.log('after build',JSON.stringify(await st()));
 await page.evaluate(()=>EmberIsle.Village.runAct('forge'));
 for(const id of ['helm','mail','blade'])await page.click(`[data-act=buyf][data-id=${id}]`);
 await sleep(300);await shot('h2_forge');
 await page.click(`[data-act=buyf][data-id=plate]`);await sleep(300);
 console.log('gear',JSON.stringify(await st()));await shot('h3_forge_worn');
 await page.click('[data-act=close]');await sleep(800);await shot('h4_village_built');
 // stables
 await page.evaluate(()=>EmberIsle.Village.runAct('stables'));await sleep(300);await shot('h5_stables');
 await page.click('[data-act=newegg]');await page.waitForSelector('#dname');
 await page.fill('#dname','Cinder');await page.click('[data-act=create-go]');await ready(page);await sleep(500);
 console.log('egg',JSON.stringify(await st()));await shot('h6_egg_in_stable');
 // next day: train -> hatch
 await page.evaluate(()=>{const S=EmberIsle.state();EmberIsle.setToday(new Date(Date.now()+86400000).toISOString().slice(0,10))});
 await page.evaluate(()=>EmberIsle.Village.goToSchool());
 await page.waitForSelector('#vdbtn button',{timeout:15000});await page.click('#vdbtn button');
 await page.waitForSelector('[data-act="face"]');
 let n=await trainAll(page).catch(()=>-1);console.log('q',n);
await shot('h7_end');console.log(await page.evaluate(()=>document.body.innerText.slice(0,400).replace(/\n+/g,' | ')));
 console.log(JSON.stringify(await page.evaluate(()=>EmberIsle.state().extra.map(e=>[e.name,e.hatched]))));
 if(await page.$('[data-act="endface"][data-v="3"]')){await page.click('[data-act="endface"][data-v="3"]');await page.click('[data-act="home-after"]');await ready(page);await sleep(3000);await shot('h8_home');}
 console.log(JSON.stringify(await page.evaluate(()=>EmberIsle.state().extra.map(e=>[e.name,e.hatched]))));
 console.log('errors',JSON.stringify(errs));
 await b.close();
})().catch(e=>{console.error('FAIL',e);process.exit(1)});
