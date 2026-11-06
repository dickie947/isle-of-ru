const {open,ready,create,trainAll,sleep}=require('./th.js');
const S=process.env.S;
(async()=>{
  const {b,page,errs}=await open({viewport:{width:1180,height:820}});
  const shot=n=>page.screenshot({path:S+'/pshots/'+n+'.png'});
  const txt=()=>page.evaluate(()=>document.body.innerText.replace(/\n+/g,' | ').slice(0,500));
  await page.waitForFunction(()=>window.EmberIsle);
  async function practice(){
    await page.evaluate(()=>EmberIsle.Village.goToSchool());
    await page.waitForFunction(()=>document.getElementById('vdlg')&&!document.getElementById('vdlg').hidden,null,{timeout:15000});
    await page.waitForSelector('#vdbtn button',{timeout:8000});await page.click('#vdbtn button');
    await page.waitForSelector('[data-act="face"]',{timeout:5000});
    const n=await trainAll(page);
    if(await page.$('[data-act="hatch"]')){await page.click('[data-act="hatch"]');await sleep(1500);}
    console.log('trained',n,'| end:',(await txt()).slice(0,260));
    await page.click('[data-act="endface"][data-v="3"]');
  }
  // child A
  await create(page,'Ember','Ruan');
  await practice();
  await page.click('[data-act="home-after"]');await ready(page);await sleep(800);
  console.log('A embers',await page.evaluate(()=>EmberIsle.state().embers),'fam',await page.evaluate(()=>localStorage.getItem('isleOfRu.family')));
  // child B
  await page.click('[data-act="switch"]');await sleep(400);
  await page.click('[data-act="newplayer"]');await sleep(400);
  await create(page,'Frost','Lyra');
  console.log('B created; who banner check later');
  await practice();
  await shot('c1_end_B');
  await page.click('[data-act="home-after"]');await ready(page);await sleep(900);
  console.log('B embers',await page.evaluate(()=>EmberIsle.state().embers),'fam',await page.evaluate(()=>localStorage.getItem('isleOfRu.family')));
  await shot('c2_B_village');
  // switch back to A: claim bonus
  await page.click('[data-act="switch"]');await sleep(500);
  const keyA=await page.evaluate(()=>[...document.querySelectorAll('[data-act="play"]')].map(e=>e.dataset.key+':'+e.innerText.replace(/\n/g,'/')));console.log('who',keyA);
  await page.click('[data-act="play"][data-key="emberIsle.v2"]');await ready(page);await sleep(2500);
  console.log('A after switch:',await txt(),'embers',await page.evaluate(()=>EmberIsle.state().embers));
  await shot('c3_A_village');
  console.log('errs',errs);
  await b.close();
})().catch(e=>{console.error('FAIL',e);process.exit(1)});
