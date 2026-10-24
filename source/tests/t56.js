const {open,ready,create,trainAll,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open();await page.emulateMedia({colorScheme:'dark'});
  await create(page);
  await page.evaluate(()=>EmberIsle.Village.goToSchool());
  await page.waitForSelector('#vdbtn button',{timeout:15000});await page.click('#vdbtn button');
  await page.waitForSelector('[data-act="face"]');
  await trainAll(page);
  await page.click('[data-act="hatch"]');await sleep(1200);
  await page.click('[data-act="endface"][data-v="3"]');await page.click('[data-act="home-after"]');await ready(page);
  await sleep(2600);
  await page.evaluate(()=>EmberIsle.Village.runAct('millie'));await sleep(2600);
 await page.locator('#vdbtn button',{hasText:'Help her'}).click();
 await page.waitForSelector('#vq .vq-o',{timeout:5000});await sleep(300);
 await page.screenshot({path:'pshots/btn_dark_puzzle2.png'});
 await page.locator('#vq .vq-o').first().click();await sleep(400);
 await page.screenshot({path:'pshots/btn_dark_puzzle3.png'});
 console.log(errs);await b.close()})();