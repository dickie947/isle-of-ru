const {open,ready,create,trainAll,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open({viewport:{width:1180,height:820}});
  const txt=()=>page.evaluate(()=>document.body.innerText.replace(/\n+/g,' | ').slice(0,600));
  const say=()=>page.evaluate(()=>{const d=document.getElementById('vdlg');return d&&!d.hidden?document.getElementById('vdtxt').innerText:''});
  const btns=()=>page.evaluate(()=>[...document.querySelectorAll('#vdbtn button')].map(x=>x.innerText));
  await page.waitForFunction(()=>window.EmberIsle);
  async function practice(){
    await page.evaluate(()=>EmberIsle.Village.goToSchool());
    await page.waitForFunction(()=>document.getElementById('vdlg')&&!document.getElementById('vdlg').hidden,null,{timeout:15000});
    await page.waitForSelector('#vdbtn button',{timeout:8000});await page.click('#vdbtn button');
    await page.waitForSelector('[data-act="face"]',{timeout:5000});
    await trainAll(page);
    if(await page.$('[data-act="hatch"]')){await page.click('[data-act="hatch"]');await sleep(1500);}
    await page.click('[data-act="endface"][data-v="3"]');
  }
  await create(page,'Ember','Ruan');await practice();
  await page.click('[data-act="home-after"]');await ready(page);await sleep(800);
  const keyA=await page.evaluate(()=>EmberIsle.state&&localStorage.getItem('isleOfRu.family'));
  await page.click('[data-act="switch"]');await sleep(400);
  await page.click('[data-act="newplayer"]');await sleep(400);
  await create(page,'Frost','Lyra');await practice();
  await page.click('[data-act="home-after"]');await ready(page);await sleep(900);
  const emB0=await page.evaluate(()=>EmberIsle.state().embers);
  // Lyra tapped the family chest: leave a gift for Ruan
  await page.evaluate(()=>EmberIsle.Village.runAct('famchest'));await sleep(3500);
  console.log('chest say:',await say(),await btns());
  await page.click('#vdbtn button');await sleep(2500);console.log('gift pick:',await say(),await btns());
  await page.click('#vdbtn button:nth-child(2)');await sleep(2800);console.log('msg pick:',await say(),await btns());
  await page.click('#vdbtn button:nth-child(3)');await sleep(3800);console.log('sent:',await say(),await btns());
  const emB1=await page.evaluate(()=>EmberIsle.state().embers);console.log('B embers',emB0,'->',emB1);
  await page.click('#vdbtn button');await sleep(300);
  await page.evaluate(()=>EmberIsle.Village.runAct('famchest'));await sleep(3500);console.log('again:',await say());
  await page.click('#vdbtn button');await sleep(300);
  const saveB=await page.evaluate(()=>localStorage.getItem('emberIsle.p2'));
  // switch to Ruan: receives gift
  await page.click('[data-act="switch"]');await sleep(500);
  const saveB2=await page.evaluate(()=>localStorage.getItem('emberIsle.p2'));
  const emA0=await page.evaluate(()=>JSON.parse(localStorage.getItem('emberIsle.v2')).embers);
  await page.click('[data-act="play"][data-key="emberIsle.v2"]');await ready(page);await sleep(4500);
  console.log('A gets 1:',await say());await page.click('#vdbtn button');await sleep(900);console.log('A gets 2:',await say());
  console.log('A embers',emA0,'->',await page.evaluate(()=>EmberIsle.state().embers));
  console.log('fam gifts after',await page.evaluate(()=>JSON.stringify(JSON.parse(localStorage.getItem('isleOfRu.family')).gifts)));
  await page.click('#vdbtn button').catch(()=>{});await sleep(300);
  // B's save unchanged by A's session?
  {const nb=await page.evaluate(()=>localStorage.getItem('emberIsle.p2'));console.log('B save untouched',saveB2===nb);if(saveB2!==nb){const a=JSON.parse(saveB2),c=JSON.parse(nb);for(const k of Object.keys(c)){if(JSON.stringify(a[k])!==JSON.stringify(c[k]))console.log('  diff key',k,JSON.stringify(a[k]).slice(0,120),'=>',JSON.stringify(c[k]).slice(0,120))}}}
  // week tab
  await page.evaluate(()=>EmberIsle.act('gtab',{k:'week'}));await sleep(500);
  console.log('WEEK:',(await txt()).slice(0,900));
  await page.screenshot({path:'pshots/week.png'});
  // check-up
  await page.evaluate(()=>{const S=EmberIsle.state();const t=new Date().toISOString().slice(0,10);EmberIsle.SKILLS.slice(0,3).flatMap(k=>k.items.map(x=>x.id)).forEach((id,i)=>{const it={id};if(!S.items[it.id])S.items[it.id]={box:i%4,due:t,seen:2,ok:1,fail:0,last:t,first:t,prom:null}});});
  await page.evaluate(()=>{});
  const before=await page.evaluate(()=>JSON.stringify(EmberIsle.state().items));const emC0=await page.evaluate(()=>EmberIsle.state().embers);
  await page.evaluate(()=>EmberIsle.act('checkup-go'));await sleep(900);console.log('CK start:',(await txt()).slice(0,300));await page.screenshot({path:'pshots/ck.png'});
  let n=0;
  for(;n<12;n++){const q=await page.evaluate(()=>{const Q=EmberIsle.Q();return Q?{ans:Q.q.ans}:null});if(!q)break;
    if(!(await page.$('[data-act="num"]'))){console.log('no keypad:',await page.evaluate(()=>EmberIsle.Q().q.kind+' ans '+EmberIsle.Q().q.ans+' '+[...new Set([...document.querySelectorAll('[data-act]')].map(e=>e.dataset.act))].join(',')));break}
    for(const ch of String(q.ans))await page.click(`[data-act="num"][data-d="${ch}"]`);await page.click('[data-act="check"]');await sleep(150);
    await page.waitForSelector('[data-act="next"],[data-act="close-next"]',{timeout:5000});await page.click('[data-act="next"]');await sleep(200);}
  await sleep(1500);
  console.log('check-up questions',n,'| end:',(await txt()).slice(0,200));
  console.log('items unchanged',before===await page.evaluate(()=>JSON.stringify(EmberIsle.state().items)),'embers',emC0,'->',await page.evaluate(()=>EmberIsle.state().embers));
  console.log('checkups',await page.evaluate(()=>JSON.stringify(EmberIsle.state().checkups).slice(0,200)));
  await page.click('[data-act="close"]').catch(()=>{});await sleep(300);
  await page.evaluate(()=>EmberIsle.act('gtab',{k:'week'}));await sleep(500);
  console.log('WEEK2:',(await page.evaluate(()=>document.querySelector('.gu').innerText.replace(/\n+/g,' | ')))); await page.screenshot({path:'pshots/week2.png'});
  console.log('errs',JSON.stringify(errs));await b.close();
})();
