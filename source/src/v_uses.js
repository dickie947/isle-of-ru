/* ===== little uses for the decorations: one calm thing to do with each, once a day ===== */
const useDay=()=>dayB().use||(dayB().use={});
const usedToday=id=>!!useDay()[id];
const markUsed=id=>{useDay()[id]=1;saveState()};
const STORIES=[
 "Long ago a tiny dragon named Pip was scared of the dark. Then Pip breathed one small flame, and found the dark was only a big, quiet blanket. Pip slept very well.",
 "A shy troll once built a bridge, one stone each day. The goats thought it would never end. On the hundredth day the goats walked over it, and the troll waved. Little by little gets there.",
 "The north wind lost her whistle on a snowy hill. A fox found it and gave it back. Ever since, the wind whistles a thank you every winter evening.",
 "Two dragons argued about who could count the most stars. They counted all night and both lost count at the same star. They laughed, and started again, together.",
 "An old longship sailed in circles for a week. The sailors were lost, but the tiny crew mouse knew the way. Everyone listens to the mouse now.",
 "A baby seal found a shiny shell and thought it was the moon. She kept it safe all night. In the morning the real moon smiled and said, keep it."];
function useItem(id){
  const D=S.dragon?S.dragon.name:'Your dragon';
  const once=(msg,e)=>{ if(usedToday(id)){vsay(msg);return false} markUsed(id); if(e)reward(e); return true };
  if(id==='tower'){
    if(usedToday('tower')){vsay("You have already looked out from the tower today. The sea is calm and the boats are heading home.");return}
    const boats=RR(3,6), opts=[boats,boats+1,boats-1>=2?boats-1:boats+2].sort(()=>Math.random()-.5);
    const ask=()=>vsay(`You climb to the top of the tower. The whole sea is spread out below. There are little boats sailing: ${'⛵'.repeat(boats)}  How many boats can you count?`,
      opts.map(n=>({label:String(n),fn:()=>{ if(n===boats){markUsed('tower');reward(2);vsay(`Yes, ${boats} boats! Good counting. ${D} watches them from the top and you find 2 embers in the lookout's old box.`)} else vsay('Have another look and count them one by one.',[{label:'Look again',fn:ask}]) }})));
    ask();return}
  if(id==='fountain'){
    if(usedToday('fountain')){vsay("The fountain sparkles. Your wish for today is already on its way.");return}
    if(S.embers<1){vsay("The fountain would like an ember to make a wish. You do not have one yet. Practise and you will!");return}
    vsay("Throw one ember into the fountain and make a wish?",[{label:'Make a wish',fn:()=>{markUsed('fountain');S.embers-=1;saveState();
      if(Math.random()<.65){reward(3);vsay("The water swirls and glows. Something shiny floats up: 3 embers! (You wished well.)")}
      else{const j=pick(JOKES);reward(0);vsay(`The fountain giggles and tells you a joke. ${j[0]} ... ${j[1]}`)}}},{label:'Not now'}]);return}
  if(id==='statue'){
    if(usedToday('statue')){vsay("The stone dragon stands proudly. It remembers your salute from earlier today.");return}
    const n=S.streak?S.streak.cur||0:0;
    vsay(`${D} strikes the same pose as the statue, wings out, chin up. ${n>1?`You have practised ${n} days in a row. The statue looks very proud.`:'The statue looks very proud of you both.'} Salute?`,[{label:'Salute',fn:()=>{markUsed('statue');reward(2);vsay(`${D} salutes. A tiny stone chip falls off and turns out to be 2 embers.`)}},{label:'Not now'}]);return}
  if(id==='campfire'){
    if(usedToday('campfire')){vsay("The fire crackles quietly. Story time was lovely earlier today.");return}
    vsay("The campfire crackles. It is story time. Sit by the fire?",[{label:'Hear a story',fn:()=>{markUsed('campfire');reward(2);vsay(`${pick(STORIES)}  (The fire gives you 2 warm embers.)`)}},{label:'Not now'}]);return}
  if(id==='lantern'){
    if(usedToday('lantern')){vsay("The dragon torch is lit and flickering. It will glow brighter when the sun goes down.");return}
    vsay("A dragon torch, not yet lit. Ask your dragon to light it?",[{label:'Light it',fn:()=>{markUsed('lantern');reward(1);vsay(`${D} takes a very small, very careful breath. Whoosh! The torch is lit. (+1 ember.)`)}},{label:'Not now'}]);return}
  if(id==='banner'){
    const cols=[['Orange','#e8743b','#c9431d','#ffd36b'],['Blue','#4b8fd9','#2a5aa8','#e8f3ff'],['Green','#5fae5a','#2f7a3a','#f3ffe0'],['Purple','#a366d9','#6b3aa8','#ffe8ff']];
    const cur=S.inv.bannerCol||0;
    vsay("Pick a colour for the island banner. Today's choice stays until you change it.",cols.map((c,i)=>({label:c[0]+(i===cur?' (now)':''),fn:()=>{S.inv.bannerCol=i;saveState();Village.refresh&&Village.refresh();if(!usedToday('banner')){markUsed('banner');reward(1)}vsay(`The banner is now ${c[0].toLowerCase()}.`)}})));return}
}

/* ===== dragon fishing trips from the jetty ===== */
SPR.fishpost=mk(46,60,c=>{shadowBlob(c,22,54,14,4,.3);
  c.fillStyle='#7a5230';c.beginPath();c.moveTo(8,36);c.lineTo(34,36);c.lineTo(31,54);c.lineTo(11,54);c.closePath();c.fill();
  c.strokeStyle='#4f3419';c.lineWidth=1.5;c.beginPath();c.moveTo(9,42);c.lineTo(33,42);c.moveTo(10,48);c.lineTo(32,48);c.stroke();
  c.fillStyle='#8aa4b8';for(let i=0;i<3;i++){c.beginPath();c.ellipse(15+i*7,34,3.6,1.8,0,0,6.3);c.fill()}
  c.strokeStyle='#6c4a2a';c.lineWidth=2.2;c.lineCap='round';c.beginPath();c.moveTo(34,50);c.lineTo(40,6);c.stroke();
  c.strokeStyle='#d8d2c0';c.lineWidth=.8;c.beginPath();c.moveTo(40,6);c.quadraticCurveTo(46,22,42,40);c.stroke();
  c.fillStyle='#d9342b';c.beginPath();c.arc(42,41,2.2,0,6.3);c.fill()});
const FISH_NEED_DAYS=4, FISH_COST=100;
const fishSt=()=>S.fishing||(S.fishing={unlocked:false,sent:null,total:0});
function fishJetty(){
  if(needDragon())return;
  const D=S.dragon.name, F=fishSt(), t=today();
  if(!F.unlocked){
    const days=S.days.length;
    if(days<FISH_NEED_DAYS){vsay(`A good spot for fishing! ${D} needs to learn first. Practise on ${FISH_NEED_DAYS} different days and come back. So far: ${days}.`);return}
    if(S.embers<FISH_COST){vsay(`${D} would love to learn fishing. It costs ${FISH_COST} embers and you have ${S.embers}. Keep collecting!`);return}
    vsay(`Teach ${D} to fish? A fishing lesson costs ${FISH_COST} embers. After that, ${D} can go out each day and bring fish back by the next day.`,[{label:`Pay ${FISH_COST} embers`,fn:()=>{S.embers-=FISH_COST;F.unlocked=true;saveState();hud();Audio_.fx('fanfare');vsay(`${D} learns to fish! A splash, a wiggle, a very surprised fish. Tap the bucket again to send ${D} out.`)}},{label:'Not yet'}]);return}
  if(F.sent===t){vsay(`${D} is out on the water, fishing. Come back tomorrow to see what was caught!`);return}
  if(!F.sent){sendFish();return}
  /* a trip is waiting: count the catch */
  const n=RR(3,8), a=RR(1,n-1), b=n-a;
  const opts=[n,n+1,n-1>=2?n-1:n+2].sort(()=>Math.random()-.5);
  const ask=()=>vsay(`${D} is back with a bucket of fish! Silver fish: ${'🐟'.repeat(a)}  Blue fish: ${'🐠'.repeat(b)}  How many fish altogether?`,
    opts.map(x=>({label:String(x),fn:()=>{ if(x===n){F.sent=null;F.total+=n;saveState();reward(n*2);
        vsay(`Yes, ${a} and ${b} make ${n}! The fish sell at the market for 2 embers each: +${n*2} embers.`,[{label:`Send ${D} out again`,fn:sendFish},{label:'OK'}]) }
      else vsay('Count them again, one at a time. Silver first, then blue.',[{label:'Count again',fn:ask}]) }})));
  ask();
}
function sendFish(){const D=S.dragon.name,F=fishSt();F.sent=today();saveState();Audio_.fx('pop');vsay(`${D} flaps off over the water with a tiny fishing net. Come back tomorrow!`)}
