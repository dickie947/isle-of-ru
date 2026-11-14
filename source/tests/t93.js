const {open,ready,create,sleep}=require('./th.js');
(async()=>{
  const {b,page,errs}=await open();
  await page.waitForFunction(()=>window.EmberIsle);await create(page);
  const r=await page.evaluate(()=>{
    const {SKILLS,makeQ}=EmberIsle; const bad=[];let n=0;
    for(const sk of SKILLS.slice(-7)) for(const it of sk.items){ for(let k=0;k<30;k++){ const q=makeQ(it); n++;
      const t=q.tens; if(q.kind!=='tens'&&q.kind!=='skip'){bad.push('nokind '+it.id);break;}
      if(q.kind==='skip'){ if(q.ans!==q.skip.st*q.skip.n||q.ans>99) bad.push('skip '+it.id); continue; } if(!t){bad.push('not tens '+it.id);break;} const exp=t.add?t.a+t.b:t.a-t.b; if(q.ans!==exp||q.ans<0||q.ans>99) bad.push(it.id+' '+JSON.stringify(t)+' ans '+q.ans);
      if(t&&t.tensOnly&&(t.a%10||t.b%10)) bad.push('notens '+it.id);
      if(!t.tensOnly&&(it.kind==='oadd'||it.kind==='osub')&&(Math.floor((t.add?t.a:t.a-t.b)/10)!==Math.floor(q.ans/10))) bad.push('crossed '+it.id+JSON.stringify(t));
    }}
    return {n,bad:bad.slice(0,11),counts:SKILLS.slice(-7).map(s=>s.id+':'+s.items.length)};
  });
  console.log(JSON.stringify(r));
  await page.evaluate((PN)=>{const S=EmberIsle.state(); const d=new Date().toISOString().slice(0,10); for(const sk of EmberIsle.SKILLS.slice(0,EmberIsle.SKILLS.length-PN)) for(const it of sk.items) S.items[it.id]={box:3,due:'2099-01-01',seen:3,ok:3,miss:0}; S.tutorialSeen=true; S.settings.newPerDay=6; S.day.trained=false; },+process.env.PN||3);
  const plan=await page.evaluate(()=>EmberIsle.buildPlan(10,6).map(e=>e.id+':'+e.role).join(','));console.log('plan',plan);
  await page.evaluate(()=>EmberIsle.act('train'));await sleep(300);
  await page.click('[data-act="face"][data-v="3"]');await sleep(400);
  for(let qn=0;qn<10;qn++){
    const info=await page.evaluate(()=>({id:EmberIsle.Q().q.id,kind:EmberIsle.Q().q.kind,story:document.querySelector('.story').innerText,tabs:[...document.querySelectorAll('.tab')].map(t=>t.innerText+'|'+t.style.display),note:document.querySelector('[data-note]').innerText}));
    console.log(JSON.stringify(info));
    if(qn<2) await page.screenshot({path:'pshots/t90_q'+qn+'.png'});
    let tapped=0; for(let k=0;k<30;k++){ const el=await page.$('.blk[data-f]:not([tabindex]):not(.off), .skip-tile[data-i]:not(.lit)'); if(!el) break; if(await page.evaluate(()=>EmberIsle.Q().counters.strategyUsed&&EmberIsle.Q().counters.strategyUsed())) break; await el.click(); tapped++; }
    const ans=await page.evaluate(()=>String(EmberIsle.Q().q.ans));
    for(const d of ans) await page.click(`[data-act="num"][data-d="${d}"]`);
    await page.click('[data-act="check"]');await sleep(300);
    console.log(' tapped',tapped,'fb',await page.evaluate(()=>document.getElementById('fb').innerText.replace(/\n/g,' ')));
    if(qn===0) await page.screenshot({path:'pshots/t90_done0.png'});
    const nx=await page.$('[data-act="next"]'); if(!nx) break; await nx.click(); await sleep(300);
    if(await page.$('[data-act="close-next"]')) await page.click('[data-act="close-next"]');
  }
  console.log('errs',JSON.stringify(errs));
  await b.close();
})();
