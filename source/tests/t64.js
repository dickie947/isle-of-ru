const {open,ready,create,sleep}=require('./th.js');
(async()=>{const {b,page,errs}=await open();await page.waitForFunction(()=>window.EmberIsle);await create(page);
await page.evaluate(()=>{const S=EmberIsle.state();S.settings.exploreAny=true;S.dragon.hatched=true;S.day.trained=true;EmberIsle.save();EmberIsle.Village.travelTo('green')});
await page.waitForFunction(()=>EmberIsle.Village.zone().id==='green',null,{timeout:60000});await ready(page);
await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});
await page.evaluate(()=>EmberIsle.Village.runAct('hsboard'));await sleep(2600);await page.evaluate(()=>{document.querySelectorAll('#vdbtn button').forEach(b=>b.click())});
for(const [k,[x,y]] of Object.entries({a:[20,19],b:[29,17],c:[15,15]})){await page.evaluate(([x,y])=>{const P=EmberIsle.Village.state.P;P.x=x;P.y=y;P.ex=x;P.ey=y},[x,y]);await sleep(700);await page.screenshot({path:`pshots/u1_flags_${k}.png`})}
console.log(errs);await b.close()})().catch(e=>{console.log('FAIL',e.message)});
