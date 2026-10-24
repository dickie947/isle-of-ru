const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open();
  await page.waitForFunction(()=>window.EmberIsle);await create(page);
  const dl=()=>page.evaluate(()=>{const d=document.getElementById('vdlg');return d&&!d.hidden?d.innerText.replace(/\n/g,' | '):null});
  await page.evaluate(()=>{const S=EmberIsle.state();S.settings.exploreAny=true;S.dragon.hatched=true;S.day.trained=true;S.embers=1000;S.days=Array.from({length:12},(_,i)=>'2026-09-'+String(i+1).padStart(2,'0'));S.inv.built=['forge','coop'];EmberIsle.save();EmberIsle.Village.refresh()});
  await sleep(500);
  console.log('cap',await page.evaluate(()=>typeof EXTRA_CAP!=='undefined'?EXTRA_CAP:'n/a'));
  // confirmation: buy a pumpkin patch
  await page.evaluate(()=>EmberIsle.act('shop'));await page.evaluate(()=>EmberIsle.act('shoptab',{k:'decor'}));await sleep(300);
  await page.screenshot({path:'pshots/u1_shop.png'});
  const btn=await page.$('[data-act="buy"][data-id="pumpkinpatch"]');console.log('buy btn',!!btn);
  await btn.click();await sleep(300);
  console.log('confirm shown',await page.evaluate(()=>!!document.getElementById('cfm')),await page.evaluate(()=>document.getElementById('cfm')&&document.getElementById('cfm').innerText.replace(/\n/g,' | ')));
  await page.screenshot({path:'pshots/u1_confirm.png'});
  await page.click('[data-cfm="no"]');await sleep(200);
  console.log('after No owned',await page.evaluate(()=>EmberIsle.state().inv.decor.includes('pumpkinpatch')),'embers',await page.evaluate(()=>EmberIsle.state().embers));
  await page.click('[data-act="buy"][data-id="pumpkinpatch"]');await page.click('[data-cfm="yes"]');await sleep(300);
  console.log('after Yes owned',await page.evaluate(()=>EmberIsle.state().inv.decor.includes('pumpkinpatch')),'embers',await page.evaluate(()=>EmberIsle.state().embers));
  for(const id of ['batbanner','jacklantern','cauldron','spooktree','milliecollar','milliehat','henbows','henhats']){
    await page.click(`[data-act="buy"][data-id="${id}"]`).catch(e=>console.log('no btn',id));await page.click('[data-cfm="yes"]').catch(()=>{});await sleep(150)}
  console.log('decor',await page.evaluate(()=>EmberIsle.state().inv.decor.join(',')),'embers',await page.evaluate(()=>EmberIsle.state().embers));
  await page.evaluate(()=>EmberIsle.act('close'));
  await page.evaluate(()=>EmberIsle.Village.travelTo('green'));
  await page.waitForFunction(()=>EmberIsle.Village.zone().id==='green',null,{timeout:60000});await ready(page);await sleep(900);
  await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});
  // hide and seek
  await page.evaluate(()=>EmberIsle.Village.runAct('hsboard'));await sleep(2600);
  console.log('hs clue:',await dl());
  const hs=await page.evaluate(()=>EmberIsle.state().day.hs);console.log('hs',JSON.stringify(hs));
  await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});
  // wrong flag first
  const wrong=hs.flags.findIndex(f=>f.n!==hs.ans);
  await page.evaluate(i=>EmberIsle.Village.runAct('hs:'+i),wrong);await sleep(2200);console.log('wrong:',await dl());
  await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>{if(/OK/.test(b.textContent))b.click()})});await sleep(300);
  const right=hs.flags.findIndex(f=>f.n===hs.ans);const e0=await page.evaluate(()=>EmberIsle.state().embers);
  await page.evaluate(i=>EmberIsle.Village.runAct('hs:'+i),right);await sleep(3000);console.log('right:',await dl(),'embers',e0,'->',await page.evaluate(()=>EmberIsle.state().embers),'found flag',await page.evaluate(()=>EmberIsle.state().day.bld.hide));
  await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>{if(/Good cat/.test(b.textContent))b.click()})});await sleep(2800);
  await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});
  // screenshots of green with decor + hens
  for(const [k,[x,y]] of Object.entries({a:[16,15],b:[31,15],c:[35,19],d:[22,19]})){
    await page.evaluate(([x,y])=>{const P=EmberIsle.Village.state.P;P.x=x;P.y=y;P.ex=x;P.ey=y},[x,y]);await sleep(800);
    await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});await page.screenshot({path:`pshots/u1_g_${k}.png`});}
  console.log('errors',errs);await b.close()})().catch(e=>{console.log('FAIL',e.message);process.exit(1)});
