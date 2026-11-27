/* ===== Update 4: the flower garden (honey) and the cow paddock (milk). Each is a calm once-a-day job with a small
   counting puzzle: equal rows and equal groups, pitched by how much the child has practised. ===== */
SPR.cow=mk(64,48,c=>{shadowBlob(c,32,44,24,4.5,.3);
  c.strokeStyle='#e8e4da';c.lineWidth=4;c.lineCap='round';[[18,34,18,43],[26,35,26,44],[42,35,42,44],[50,34,50,43]].forEach(([a,b,d,e])=>{c.beginPath();c.moveTo(a,b);c.lineTo(d,e);c.stroke()});
  c.fillStyle='#3a2a20';[[18,43],[26,44],[42,44],[50,43]].forEach(([x,y])=>{c.fillRect(x-2.2,y-1,4.4,2.4)});
  c.fillStyle='#f6f2ea';c.beginPath();c.ellipse(34,28,21,11,0,0,6.3);c.fill();c.fillStyle='#e9a8b0';c.beginPath();c.ellipse(36,38,5,3,0,0,6.3);c.fill();
  c.save();c.beginPath();c.ellipse(34,28,21,11,0,0,6.3);c.clip();c.fillStyle='#4a3326';[[28,22,8,6],[44,30,9,6],[20,32,6,5],[40,20,6,4]].forEach(([x,y,w,h])=>{c.beginPath();c.ellipse(x,y,w,h,0,0,6.3);c.fill()});c.restore();
  c.fillStyle='#f6f2ea';c.beginPath();c.ellipse(11,28,8,7,.2,0,6.3);c.fill();c.fillStyle='#4a3326';c.beginPath();c.ellipse(9,26,4,3.5,0,0,6.3);c.fill();
  c.fillStyle='#e9a8b0';c.beginPath();c.ellipse(6,31,4.2,3,0,0,6.3);c.fill();c.fillStyle='#3a2a20';c.beginPath();c.arc(4.8,30.6,.7,0,6.3);c.arc(7.4,30.6,.7,0,6.3);c.fill();
  c.fillStyle='#fff';c.beginPath();c.arc(10,25.5,1.8,0,6.3);c.fill();c.fillStyle='#111';c.beginPath();c.arc(9.6,25.8,.9,0,6.3);c.fill();
  c.fillStyle='#d9c8a0';c.beginPath();c.moveTo(11,21);c.lineTo(9,16);c.lineTo(13,20);c.closePath();c.moveTo(16,21);c.lineTo(18,16);c.lineTo(14,20.5);c.closePath();c.fill();
  c.strokeStyle='#e8e4da';c.lineWidth=2;c.beginPath();c.moveTo(55,24);c.quadraticCurveTo(62,28,59,38);c.stroke();c.fillStyle='#4a3326';c.beginPath();c.arc(59,39,2,0,6.3);c.fill()});
const COWS=[[30.6,16.5],[32.9,15.9],[34.9,16.7]];
function farmBuild(){
  COWS.forEach(([x,y])=>{addObj(SPR.cow,x,y,32,42,{});block([[Math.floor(x),Math.floor(y-.3)]],null,'farm');hitArea(Math.floor(x),Math.floor(y-.3),[[0,-1],[-1,0],[1,0],[0,1]])});
}
function farmAct(){
  const D=S.dragon?S.dragon.name:'Your dragon';
  if(usedToday('farm')){vsay("The cows chew calmly. They have given all the milk they have today. One of them gives you a very long, very slow look.");return}
  vsay("Three cows graze in the meadow and one of them gives a gentle MOO. Would you like to milk them?",[{label:'Milk the cows',fn:()=>stPuzzle(
    {kind:'grp',e:['🥛'],q:(r,c)=>`${r} cows each give ${c} jugs of milk. How many jugs is that altogether?`},
    ()=>{markUsed('farm');reward(2,'milk');vsay(`The jugs are full to the brim. (+2 embers, +1 fresh milk.) ${D} would love a drink. Find it in the nest under Treats.`)})},{label:'Not now'}]);
}
function gardenAct(){
  const D=S.dragon?S.dragon.name:'Your dragon';
  if(usedToday('garden')){vsay("The flowers are watered and the bees are busy. Come back tomorrow for more honey.");return}
  vsay("The flower garden is a little dry and there is space for new seedlings. Water it and plant a new bed?",[{label:'Water and plant',fn:()=>stPuzzle(
    {kind:'grp',e:['🌼'],q:(r,c)=>`You plant ${r} rows of flowers, with ${c} flowers in each row. How many flowers is that altogether?`},
    ()=>{markUsed('garden');reward(2,'honey');vsay(`The flowers perk up and the bees come humming. They leave a jar of golden honey. (+2 embers, +1 honey jar.) ${D} would love it. Find it in the nest under Treats.`)})},{label:'Not now'}]);
}
