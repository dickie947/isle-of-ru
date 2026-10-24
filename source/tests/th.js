const {chromium}=require('playwright');
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function open(opts={}){
  const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome',args:['--no-sandbox']});
  const ctx=await b.newContext({viewport:opts.viewport||{width:1280,height:800},hasTouch:!!opts.touch,isMobile:!!opts.touch,deviceScaleFactor:opts.dpr||1});
  const page=await ctx.newPage();
  const errs=[];page.on('console',m=>{if(m.type()==='error'&&!/ERR_FAILED|Failed to load/.test(m.text()))errs.push('console: '+m.text())});page.on('pageerror',e=>errs.push('pageerror: '+e.message));
  await page.route('**/*',r=>{const u=r.request().url();if(u.startsWith('file:'))r.continue();else r.abort()});
  if(opts.init)await page.addInitScript(opts.init);
  await page.goto('file:///home/claude/emberisle/test.html',{waitUntil:'domcontentloaded'});
  try{await page.waitForSelector('[data-act="splash-go"]',{timeout:15000});await page.click('[data-act="splash-go"]');await sleep(200)}catch(e){}
  return {b,ctx,page,errs};
}
const ready=page=>page.waitForFunction(()=>window.EmberIsle&&EmberIsle.Village.state.VS.ready&&document.getElementById('vcv')&&!document.getElementById('vload').style.display.includes('block')&&document.getElementById('vload').style.display==='none',null,{timeout:90000});
async function create(page,name='Ember',hero='Ruan'){
  if(await page.$('#hname')){await page.fill('#hname',hero);await page.click('[data-act=hero-go]');}
  await page.waitForSelector('#dname',{timeout:20000});await page.fill('#dname',name);await page.click('[data-act=create-go]');await ready(page)}
async function trainAll(page,maxQ=60){
  const Qinfo=()=>page.evaluate(()=>{const Q=EmberIsle.Q();return Q?{ans:Q.q.ans}:null});
  const typeAns=async n=>{for(const ch of String(n))await page.click(`[data-act="num"][data-d="${ch}"]`);await page.click('[data-act="check"]')};
  await page.click('[data-act="face"][data-v="3"]');
  if(await page.$('[data-act="tutorial-go"]'))await page.click('[data-act="tutorial-go"]');
  let n=0;
  while(n<maxQ){const q=await Qinfo();if(!q)break;n++;await typeAns(q.ans);await sleep(120);
    await page.waitForSelector('[data-act="next"],[data-act="close-next"],[data-act="breathe-next"]',{timeout:5000});
    await page.click('[data-act="next"]');await sleep(150);
    if(await page.$('[data-act="close-next"]'))await page.click('[data-act="close-next"]');
    if(await page.$('[data-act="hatch"]'))break;}
  return n;
}
module.exports={open,ready,create,trainAll,sleep};
