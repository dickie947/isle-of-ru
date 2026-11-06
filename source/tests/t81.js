const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open({viewport:{width:1180,height:820}});
  await page.waitForFunction(()=>window.EmberIsle);
  await create(page,'Ember','Ruan');
  await page.evaluate(()=>{const S=EmberIsle.state();S.settings.exploreAny=true;EmberIsle.save();EmberIsle.Village.setHour(12)});
  for(const [nm,rem] of [['d0',400],['d1',240],['d2',120],['d3',40]]){
    await page.evaluate(r=>{EmberIsle.Allow.state().used=1500-r},rem);
    await page.evaluate(()=>window.dispatchEvent(new Event('pointerdown')));await sleep(900);
    await page.evaluate(()=>{document.querySelectorAll('#vtoast').forEach(t=>t.classList.remove('on'))});
    await page.screenshot({path:'pshots/b_'+nm+'.png',clip:{x:300,y:250,width:500,height:300}});
    console.log(nm,await page.evaluate(()=>EmberIsle.Allow.dusk().toFixed(2)));
  }
  await b.close();
})();
