const {open,ready,create,trainAll,sleep}=require('./th.js');
(async()=>{
 const {b,page,errs}=await open();
 const shot=n=>page.screenshot({path:process.env.S+'/pshots/'+n+'.png'});
 await create(page);
 // walk to school and start training through the door
 await page.evaluate(()=>EmberIsle.Village.goToSchool());
 await page.waitForFunction(()=>document.getElementById('vdlg')&&!document.getElementById('vdlg').hidden,null,{timeout:15000});
 await page.waitForSelector('#vdbtn button',{timeout:8000});await shot('g1_door');
 await page.click('#vdbtn button');
 await page.waitForSelector('[data-act="face"]',{timeout:5000});
 const n=await trainAll(page);console.log('questions',n);
 await page.click('[data-act="hatch"]');await sleep(1500);
 await page.click('[data-act="endface"][data-v="3"]');
 await page.click('[data-act="home-after"]');
 await ready(page);await sleep(3500);await shot('g2_after');
 console.log(JSON.stringify(await page.evaluate(()=>{const S=EmberIsle.state(),V=EmberIsle.Village.state;return{trained:S.day.trained,hatched:S.dragon.hatched,bridge:V.G.bridge,embers:S.embers,quest:document.querySelector('#vquest span').textContent,fly:document.getElementById('vfly').textContent}})));
 console.log('errors',JSON.stringify(errs));
 await b.close();
})().catch(e=>{console.error('FAIL',e);process.exit(1)});
