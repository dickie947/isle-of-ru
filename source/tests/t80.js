const {open,ready,create,trainAll,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open({viewport:{width:1180,height:820}});
  const txt=()=>page.evaluate(()=>document.body.innerText.replace(/\n+/g,' | ').slice(0,420));
  await page.waitForFunction(()=>window.EmberIsle);
  await create(page,'Ember','Ruan');
  // finish practice for real
  await page.evaluate(()=>{const S=EmberIsle.state();S.settings.exploreAny=true;EmberIsle.save();});
  const A=()=>page.evaluate(()=>JSON.stringify(EmberIsle.Allow.state()));
  console.log('allow at start',await A(),'limit',await page.evaluate(()=>EmberIsle.Allow.limit()));
  // move the clock: 5 minutes 10s left
  await page.evaluate(()=>{EmberIsle.Allow.state().used=1500-340});
  await page.evaluate(()=>window.dispatchEvent(new Event('pointerdown')));await sleep(1500);
  console.log('dusk start',await page.evaluate(()=>EmberIsle.Allow.dusk().toFixed(2)));
  await page.evaluate(()=>{EmberIsle.Allow.state().used=1500-160});
  await page.evaluate(()=>window.dispatchEvent(new Event('pointerdown')));await sleep(1800);
  console.log('dusk mid',await page.evaluate(()=>EmberIsle.Allow.dusk().toFixed(2)),'yawn',(await A()));
  await page.screenshot({path:'pshots/a1_dusk.png'});
  await page.evaluate(()=>{EmberIsle.Allow.state().used=1500-30});
  await page.evaluate(()=>window.dispatchEvent(new Event('pointerdown')));await sleep(1500);
  await page.screenshot({path:'pshots/a2_late.png'});
  await page.evaluate(()=>{EmberIsle.Allow.state().used=1500+2});
  await page.evaluate(()=>window.dispatchEvent(new Event('pointerdown')));await sleep(2500);
  console.log('screen',await page.evaluate(()=>document.querySelector('.sleep')?'sleep':'no sleep'),await txt());
  await page.screenshot({path:'pshots/a3_sleep.png'});
  await page.click('[data-act="goodnight"]');await sleep(500);
  console.log('pass:',await txt());
  await page.screenshot({path:'pshots/a4_pass.png'});
  // grown-up adds time
  await page.click('[data-act="sleep-more"]');await sleep(400);
  const sum=await page.evaluate(()=>{const t=document.querySelector('.sheet')?document.querySelector('.sheet').innerText:'';return t});
  const m=sum.match(/(\d+)\s*×\s*(\d+)/);console.log('gate',m&&m[0]);
  await page.fill('#gans',String(+m[1]*+m[2]));await page.click('[data-act="gate-go"]');await sleep(500);
  await page.screenshot({path:'pshots/a5_addtime.png'});
  await page.click('[data-act="addtime"][data-m="10"]');await ready(page);await sleep(800);
  console.log('after add',await A(),'dusk',await page.evaluate(()=>EmberIsle.Allow.dusk().toFixed(2)));
  await page.screenshot({path:'pshots/a6_awake.png'});
  console.log('errs',errs);
  await b.close();
})();
