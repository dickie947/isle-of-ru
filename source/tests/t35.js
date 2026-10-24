const {open,ready,create,trainAll,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open();
  await create(page);
  await page.evaluate(()=>EmberIsle.Village.goToSchool());
  await page.waitForSelector('#vdbtn button',{timeout:15000});await page.click('#vdbtn button');
  await page.waitForSelector('[data-act="face"]');
  await trainAll(page);
  await page.click('[data-act="hatch"]');await sleep(1200);
  await page.click('[data-act="endface"][data-v="3"]');await page.click('[data-act="home-after"]');await ready(page);
  await sleep(2600);
  const dlg=()=>page.evaluate(()=>{const d=document.getElementById('vdlg');return d&&!d.hidden?d.innerText.replace(/\n/g,' | '):null});
  console.log('joke after practice:',await dlg());
  // run through joke
  for(const t of ['Tell me!','Ha!']){await sleep(1500);const bt=page.locator('#vdbtn button',{hasText:t});if(await bt.count()){await bt.first().click()}}
  await sleep(500);console.log('after joke',await dlg());
  const m=await page.evaluate(()=>EmberIsle.state().millie);console.log('millie',JSON.stringify(m));
  await page.screenshot({path:'pshots/millie_a.png'});
  // walk next to her and trigger act
  const e0=await page.evaluate(()=>EmberIsle.state().embers);
  await page.evaluate(()=>EmberIsle.Village.runAct('millie'));await sleep(1800);
  console.log('millie dlg:',await dlg());
  await page.locator('#vdbtn button',{hasText:'Help her'}).click();
  for(let r=0;r<3;r++){
    await page.waitForSelector('#vq .vq-o',{timeout:4000});
    console.log(' puzzle',(await page.evaluate(()=>document.querySelector('#vq').innerText)).replace(/\n/g,' | ').slice(0,90));
    const os=await page.$$('#vq .vq-o');
    // try options until success
    for(let k=0;k<os.length;k++){const cur=await page.$$('#vq .vq-o');await cur[k].click({timeout:1500}).catch(()=>{});await sleep(300);const t=await page.evaluate(()=>document.querySelector('#vq .vq-msg').innerText);if(/Rung built|The rung is built/.test(t))break}
    await page.click('#vq [data-vq="ok"]');await sleep(300);
  }
  await sleep(2000);
  console.log('finish:',await dlg(),'embers',e0,'->',await page.evaluate(()=>EmberIsle.state().embers));
  await page.screenshot({path:'pshots/millie_b.png'});
  console.log('errs',errs);await b.close();
})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
