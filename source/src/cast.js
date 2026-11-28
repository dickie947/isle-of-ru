/* ===== Family cast on the islands: Daddy, Uncle Andy and Crumpet visit Snowcap Isle (v2.4.1) =====
   Same talk-and-quest pattern as the home villagers. Quests are three short word problems, never timed,
   and never touch the maths practice or the story. Each character lists the island(s) they appear on. */
const CAST_THINGS={daddy:'biscuits',andy:'photos',crumpet:'bones'};
function castProb(kind,v){
  const who=v.name,th=CAST_THINGS[v.id];
  switch(kind){
    case 'add10':{const a=RR(1,8),b=RR(1,10-a);return {text:`${who} has ${a} ${th} and finds ${b} more. How many ${th} now?`,ans:a+b}}
    case 'bonds':{const a=RR(1,9);return {text:`The tin holds 10 ${th}. It has ${a}. How many more fill it up?`,ans:10-a}}
    case 'missing':{const n=RR(8,20),h=RR(2,n-2);return {text:`${who} needs ${n} ${th}. There are ${h}. How many more are needed?`,ans:n-h}}
    case 'double':{const a=RR(2,10);return {text:`${who} puts ${a} ${th} on one page and ${a} on the next. How many in all?`,ans:2*a}}
    case 'half':{const n=2*RR(1,10);return {text:`${n} ${th} are shared equally between 2 albums. How many go in each?`,ans:n/2}}
    case 'group':{const g=pick([2,5]),k=g===2?RR(2,6):RR(2,4);return {text:`There are ${k} piles. Each pile has ${g} ${th}. How many ${th} in all?`,ans:g*k}}
  }
  return {text:'1 + 1 = ?',ans:2};
}
const CAST=[
 {id:'daddy',name:'Daddy',role:'tea drinker',isle:'snow',x:12.6,y:14.6,
  look:{build:'boy',skin:'#f2c9a0',hair:'#5a3a22',style:'short',tunic:'#7a4a2a',scarf:'#d9342b',wear:{}},prop:'cup',
  intro:"Ah! A visitor. I am here on extremely serious business. I am drinking tea. In the snow. Seriously. (A biscuit crumb is stuck to his chin.)",
  chat:["I am not hiding any biscuits. Please ignore the bulge in my pocket.","Tea tastes best in the snow. It goes cold in one minute, so there is no waiting.","Have you seen a small fluffy dog? No reason. Just asking. Seriously.","I am being extremely serious. (A crumb falls off my chin. It is a snow crumb. Obviously.)","If you see any cows, tell me from a long, long way away.","My teapot is wearing a woolly hat. It was cold. It had feelings."],
  tip:"When you share biscuits out, count in twos: 2, 4, 6, 8. It is quicker than one at a time.",
  quest:{btn:'Can I help?',story:"I have hidden some biscuits in the snow, for tea. I cannot remember how many. Can you help me with three problems? Seriously.",kinds:['add10','bonds','missing'],done:"Splendid! A detective AND a mathematician. Take these, and do not tell Uncle Andy where I keep them.",embers:10,treats:{berry:3}}},
 {id:'andy',name:'Uncle Andy',role:'dog owner',isle:'snow',x:19.7,y:13.7,
  look:{build:'boy',skin:'#e8bd94',hair:'#6a4a30',style:'short',tunic:'#3a6fc4',scarf:'#f4f7fa',wear:{}},prop:'photo',
  intro:"Hello, hello! Have you met Crumpet? Of course you have, he is the cutest dog on any island. Look at his ears. LOOK at them.",
  chat:["I have 412 photos of Crumpet today. Would you like to see photos 1 to 412?","Crumpet never gets up to mischief. He is far too cute for mischief.","Funny thing. Crumpet was right here a minute ago, and so was my sandwich.","Geese! Are there geese? There are no geese, are there? ...Good. Carry on.","I knitted Crumpet a hat. He took it somewhere. I am sure it is fine.","Crumpet was with me ALL morning. I was asleep for some of it, but I am sure."],
  tip:"Count photos in tens: 10, 20, 30, 40. It is much faster than counting one by one.",
  quest:{btn:'Show me the photos',story:"I am putting Crumpet's photos into albums, and I keep losing count. Can you help me with three problems?",kinds:['double','half','group'],done:"Wonderful! Each one even cuter than the last. Take these embers.",embers:12,treats:{}}},
 {id:'crumpet',name:'Crumpet',role:'dog',isle:'snow',x:19.5,y:15.5,
  intro:"A very small, very fluffy dog with a red bow sits very still and looks as innocent as a snowflake. “Woof,” says Crumpet, which means: ‘I have never seen a biscuit in my life.’",
  chat:["Crumpet wags his tail. A biscuit falls out of his fur. He looks at the biscuit. He looks at you. He eats the evidence.","Crumpet sits on a snow drift looking at the clouds, extremely innocent. There are paw prints leading to Daddy's pocket.","Crumpet tilts his head. Behind him, Uncle Andy's sandwich has quietly disappeared.","Crumpet yawns. He is not planning anything. His little red bow is perfectly straight.","Crumpet gives a tiny woof. In dog this means: ‘Count my bones, but do not count my biscuits.’","Crumpet trots in a very smug circle, then sits down as if nothing happened."],
  tip:"Crumpet's tail says: count in twos and fives, and you will never lose a bone.",
  quest:{btn:'What have you got?',story:"Crumpet leads you to a snow drift and starts to dig. Out come bones, buried in neat piles. Can you count them for him?",kinds:['group','add10','bonds'],done:"Crumpet licks your hand and looks very pleased with himself. He drops a shiny pebble at your feet. (Do not ask where he got it.)",embers:10,treats:{fish:2}}}];
const castSay=(v,t)=>v.id==='crumpet'?t:`${v.name} the ${v.role}: ${t}`;
function castSprites(){
  if(SPR.cast)return;SPR.cast={};
  CAST.forEach(v=>{
    if(v.id==='crumpet'){
      SPR.cast.crumpet=mk(56,50,c=>{shadowBlob(c,28,44,16,4,.3);
        c.fillStyle='#f2dcb0';c.beginPath();c.ellipse(28,32,15,10,0,0,6.3);c.fill();c.beginPath();c.arc(28,20,11,0,6.3);c.fill();
        [[-8,6],[8,6]].forEach(([dx,dy])=>{c.fillStyle='#d9b878';c.beginPath();c.ellipse(28+dx*1.2,20+dy-4,4.4,8,dx<0?.35:-.35,0,6.3);c.fill()});
        c.fillStyle='#fff3d6';c.beginPath();c.ellipse(28,24,6,4.4,0,0,6.3);c.fill();c.fillStyle='#2a1a10';c.beginPath();c.ellipse(28,22.6,2.2,1.5,0,0,6.3);c.fill();
        c.beginPath();c.arc(23.4,17.4,1.4,0,6.3);c.arc(32.6,17.4,1.4,0,6.3);c.fill();c.strokeStyle='#2a1a10';c.lineWidth=.9;c.beginPath();c.moveTo(21.5,15.4);c.lineTo(25,16.2);c.moveTo(34.5,15.4);c.lineTo(31,16.2);c.stroke();
        c.fillStyle='#d9342b';c.beginPath();c.moveTo(28,29);c.lineTo(21,26);c.lineTo(21,32);c.closePath();c.fill();c.beginPath();c.moveTo(28,29);c.lineTo(35,26);c.lineTo(35,32);c.closePath();c.fill();c.fillStyle='#a8241c';c.beginPath();c.arc(28,29,1.8,0,6.3);c.fill();
        c.fillStyle='#e6c88e';[[17,40],[22,41],[34,41],[39,40]].forEach(([x,y])=>{c.beginPath();c.ellipse(x,y,3,2,0,0,6.3);c.fill()});
        c.strokeStyle='#f2dcb0';c.lineWidth=4;c.lineCap='round';c.beginPath();c.moveTo(42,32);c.quadraticCurveTo(50,24,46,17);c.stroke()});
    }else{
      SPR.cast[v.id]=mk(60,92,c=>{shadowBlob(c,30,80,17,4.4,.3);c.translate(30,76);c.scale(1.55,1.55);
        drawKid(c,'d',0,false,{hero:{name:v.name,look:v.look,wear:v.look.wear||{}}});
        if(v.prop==='cup'){c.fillStyle='#f4efe4';c.strokeStyle='#8a7a60';c.lineWidth=.8;c.beginPath();c.rect(9,-17,6,5);c.fill();c.stroke();c.beginPath();c.arc(15.2,-14.5,2,-1.4,1.4);c.stroke();c.fillStyle='#b88a52';c.fillRect(9.6,-16.6,5,1.3);
          c.fillStyle='#c79556';c.beginPath();c.arc(-3,-27,.9,0,6.3);c.arc(-1,-26,.7,0,6.3);c.fill()}
        if(v.prop==='photo'){c.fillStyle='#fff8e6';c.strokeStyle='#6b4a2a';c.lineWidth=.9;c.beginPath();c.rect(8,-22,9,11);c.fill();c.stroke();c.fillStyle='#f2dcb0';c.beginPath();c.arc(12.5,-17,2.8,0,6.3);c.fill();c.fillStyle='#d9342b';c.fillRect(11,-14.6,3,1)}})
    }})
}
function castBuild(isle){
  castSprites();const st=villState();
  CAST.forEach(v=>{if(v.isle!==isle)return;
    let [x,y]=nearestWalkable(v.x,v.y);
    addObj(SPR.cast[v.id],x,y+.2,v.id==='crumpet'?28:30,v.id==='crumpet'?44:80,{});
    if(!st.done.includes(v.id))addObj(SPR.excl,x,y-(v.id==='crumpet'?.9:1.55),10,20,{});
    block([[Math.floor(x),Math.floor(y-.3)]],null,'vill:'+v.id)})}
