/* ===== Isle of Ru: villagers, events, dragon skills, word problems ===== */
const GAME_NAME='Isle of Ru';
const WORDTHINGS=['fish','berries','gems','shells','eggs','apples'];
const RR=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
function wordProb(kind,who){const r=wordProb0(kind,who);r.text=r.text.replace(/\b1 berries\b/g,'1 berry').replace(/\b1 gems\b/g,'1 gem').replace(/\b1 shells\b/g,'1 shell').replace(/\b1 eggs\b/g,'1 egg').replace(/\b1 apples\b/g,'1 apple');return r}
function wordProb0(kind,who){
  const D=(S.dragon&&S.dragon.name)||'Your dragon', th=pick(WORDTHINGS); who=who||D;
  switch(kind){
    case 'add10':{const a=RR(1,8),b=RR(1,10-a);return {text:`${who} has ${a} ${th} and finds ${b} more. How many ${th} now?`,ans:a+b}}
    case 'bonds':{const a=RR(1,9);return {text:`The tray holds 10 ${th}. It has ${a}. How many more fill it up?`,ans:10-a}}
    case 'missing':{const n=RR(8,20),h=RR(2,n-2);return {text:`${who} needs ${n} ${th}. There are ${h}. How many more are needed?`,ans:n-h}}
    case 'add20':{const a=RR(6,9),b=RR(11-a,Math.min(9,20-a));return {text:`${who} has ${a} ${th} and gets ${b} more. How many altogether?`,ans:a+b}}
    case 'sub20':{const n=RR(11,20),m=RR(3,Math.min(9,n-1));return {text:`${who} has ${n} ${th} and eats ${m}. How many are left?`,ans:n-m}}
    case 'double':{const a=RR(2,10);return {text:`${who} puts ${a} ${th} in one basket and ${a} in another. How many in all?`,ans:2*a}}
    case 'half':{const n=2*RR(1,10);return {text:`${n} ${th} are shared equally between 2 dragons. How many does each get?`,ans:n/2}}
    case 'twostep':{const a=RR(5,12),b=RR(2,8),c=RR(1,Math.min(6,a+b-1));return {text:`${who} has ${a} ${th}, finds ${b} more, then eats ${c}. How many are left?`,ans:a+b-c}}
    case 'group':{const g=pick([2,5]),k=g===2?RR(2,6):RR(2,4);return {text:`There are ${k} nests. Each nest has ${g} eggs. How many eggs in all?`,ans:g*k}}
  }
  return {text:'1 + 1 = ?',ans:2};
}
/* what feeding time asks, by how many weeks he has practised */
function feedKinds(){const wk=Math.min(4,Math.floor(((S.days||[]).length)/7));
  return [['add10'],['add10','bonds','missing'],['add20','sub20','missing'],['double','half','twostep','sub20'],['group','twostep','half','add20','missing']][wk]}

/* ---- villagers: one arrives every 3 or 4 practice days ---- */
const VL=(build,skin,hair,style,tunic,scarf,wear)=>({build,skin,hair,style,tunic,scarf,wear:wear||{}});
const VILLAGERS=[
 {id:'tova',name:'Tova',role:'fisher',day:0,x:29.5,y:19.5,look:VL('girl','#d9a577','#6b3d1e','long','#3a6fc4','#f4f7fa'),
  intro:"Hello there! I'm Tova. I fish off the dock, and my nets are always in a muddle. Welcome to the Isle of Ru!",
  chat:["The fish are biting today.","Millie keeps stealing my catch. That cat is a menace.","Dragons love fish. Ask yours nicely!"],
  tip:"When you add small numbers, start with the bigger one and count on.",
  quest:{btn:'Can I help?',story:"I caught lots of fish, but I keep losing count. Can you help me with three problems?",kinds:['add10','add10','add10'],done:"Thank you! Here is some of my catch for your dragon.",embers:8,treats:{fish:4}}},
 {id:'mads',name:'Mads',role:'baker',day:3,x:12.5,y:15.5,look:VL('boy','#f2c9a0','#d9d2c2','short','#e8dcc0','#d9544a'),
  intro:"Morning! I'm Mads, the baker. The smell of my buns brings the whole island running.",
  chat:["Flour everywhere. Even in Millie's whiskers.","A good baker always counts twice.","Try the berry buns. Your dragon will thank you."],
  tip:"A missing number: ask yourself, what do I need to add to get there?",
  quest:{btn:'Need a hand?',story:"My oven shed needs planks, and I can never work out how many more. Help me with three?",kinds:['missing','bonds','missing'],done:"Marvellous! Take these berries for your dragon.",embers:10,treats:{berry:4}}},
 {id:'ingrid',name:'Ingrid',role:'mapmaker',day:7,x:9.5,y:13.5,look:VL('girl','#fbe0c4','#b8452c','bun','#2f8f8d','#e8743b'),
  intro:"I'm Ingrid. I draw maps of the islands. Snowcap Isle is on my map, and there are secrets on it.",
  chat:["Every island has a Number Stone. They hold good tips.","I mark each chest with a little X. Not that I tell anyone.","Maps are mostly counting, really."],
  tip:"Pairs that make ten are the best friends in maths. Learn them and the rest is easy.",
  quest:{btn:'What are you drawing?',story:"I am pinning my map and need some quick sums. Can you do three?",kinds:['bonds','add20','missing'],done:"Perfect pins! Here is a little something.",embers:12,treats:{}}},
 {id:'sigrun',name:'Sigrun',role:'dragon teacher',day:11,x:34.5,y:13.5,look:VL('girl','#b9814f','#d9d2c2','long','#6b3fa0','#f1d36b'),
  intro:"I am Sigrun, the dragon teacher. Dragons can learn wonderful skills, and I can show yours how. Open your dragon's nest to begin, or train at the arena on the Village Green.",
  chat:["A dragon learns best a little every day.","Fire breath melts ice. Digging finds treasure. Swift wings go far.","Patience. Even big dragons were eggs once."],
  tip:"Doubles are easy to remember: 5 + 5, 6 + 6, 7 + 7. Say them like a song.",
  quest:{btn:'Teach me!',story:"First, a warm-up for the mind. Three doubles and halves, then we talk skills.",kinds:['double','double','half'],done:"Well done! Your dragon can start training now. Look in the nest.",embers:15,treats:{}}},
 {id:'leif',name:'Leif',role:'trader',day:14,x:23.5,y:16.5,look:VL('boy','#8a5a38','#2a1d14','short','#c4472b','#ffd36b'),
  intro:"Leif the trader, at your service! I swap shells for berries and berries for gems.",
  chat:["Everything has a price, but friends get a discount.","The sea brings me odd things. Last week, a boot.","Always check your change."],
  tip:"To add across ten, make ten first. 8 + 5: take 2 from the 5 to make 10, then add the 3.",
  quest:{btn:'Got a deal?',story:"I need help counting my goods before the boat comes. Three quick ones?",kinds:['add20','sub20','add20'],done:"A fine job! Here is a little bonus.",embers:12,treats:{spice:2}}},
 {id:'freya',name:'Freya',role:'egg-keeper',day:18,x:5.5,y:18.5,look:VL('girl','#f2c9a0','#e0b45a','pony','#4f9a4a','#8ad06a'),
  intro:"Shh, gently! I'm Freya. I look after the eggs. Each nest must be counted so none are lost.",
  chat:["Eggs like warmth and quiet.","One day you'll find a very special egg.","Counting in twos and fives makes nests easy."],
  tip:"Counting in groups is faster. 2, 4, 6, 8. Or 5, 10, 15, 20.",
  quest:{btn:'Can I help count?',story:"I have lots of nests and each has the same number of eggs. Can you total them for me?",kinds:['group','group','group'],done:"All counted! Take these berries.",embers:15,treats:{berry:3}}},
 {id:'hilde',name:'Hilde',role:'builder',day:21,x:20.5,y:19.5,look:VL('girl','#d9a577','#4a7ad0','short','#d9a62e','#4a4f5a',{hand:'staff'}),
  intro:"I'm Hilde the builder. Give me wood and stone and I'll build you anything. Mostly I build things Millie knocks over.",
  chat:["Measure twice, build once.","That windmill plan is nearly done.","Planks, nails, and a dragon to carry things."],
  tip:"For two-step problems, do one step at a time and say the answer out loud.",
  quest:{btn:'Building something?',story:"I need to work out how much wood is left after each job. Three problems?",kinds:['twostep','twostep','sub20'],done:"Top work. A builder's bonus for you!",embers:18,treats:{}}},
 {id:'orla',name:'Orla',role:'cook',day:25,x:31.5,y:14.5,look:VL('girl','#b9814f','#2a1d14','bun','#c84b7a','#f4f7fa'),
  intro:"I'm Orla, and I cook for the whole island. The feast is coming and I need help with the sharing.",
  chat:["The secret ingredient is always more butter.","Fair shares keep the peace at dinner.","Taste this. No, not you, Millie."],
  tip:"To share between two, halve it. Half of 12 is 6, because 6 + 6 = 12.",
  quest:{btn:'Can I share the food?',story:"The feast must be shared fairly. Help me with three problems?",kinds:['half','half','twostep'],done:"Delicious maths! Have these berries.",embers:20,treats:{berry:6}}}
];
const villState=()=>{S.vill=S.vill||{met:[],done:[],ann:[],talks:{}};return S.vill};
const villDays=()=>(S.days||[]).length;
const villHere=v=>villDays()>=v.day;
const hasMet=id=>villState().met.includes(id);

/* ---- dragon skills (taught by Sigrun) ---- */
const ABILITIES=[
 {id:'fire',name:'Fire breath',cost:60,days:3,note:'Melts ice. Opens the frozen chest on Snowcap Isle.'},
 {id:'dig',name:'Treasure digging',cost:90,days:4,note:'Finds buried chests, and treasure mounds on your island each day.'},
 {id:'speed',name:'Swift wings',cost:120,days:5,note:'Flies faster, and reaches the far ledge on Cinder Peak.'}];
const skillOwned=(d,id)=>!!(d&&d.skills&&d.skills[id]&&d.skills[id].done);
function abilityTick(){
  const d=S.dragon;if(!d||!d.training||!d.skills)return;
  const sk=d.skills[d.training],ab=ABILITIES.find(a=>a.id===d.training);if(!sk||!ab)return;
  sk.prog=(sk.prog||0)+1;
  if(sk.prog>=ab.days){sk.done=true;d.training=null;S.msgQ=(S.msgQ||[]);S.msgQ.push(`${d.name} has learned ${ab.name}!`)}
}

/* ---- dates: seasonal events ---- */
const EVENTS=[
 {id:'halloween',name:'Spooky Week',from:[10,25],to:[11,1],msg:"Spooky Week has begun on the Isle of Ru! Look in the Clothes Shop for a pumpkin hat."},
 {id:'xmas',name:'Christmas',from:[12,1],to:[12,26],msg:"It's Christmas on the Isle of Ru! There's a tree in the village, a Santa hat in the Clothes Shop and Christmas pudding at the market."},
 {id:'newyear',name:'New Year',from:[12,31],to:[1,2],msg:"Happy New Year! There are party hats and a sparkly cloak waiting in the Clothes Shop."}];
function eventActive(id){
  const e=EVENTS.find(x=>x.id===id);if(!e)return false;
  const t=today(),m=+t.slice(5,7),d=+t.slice(8,10),v=m*100+d,a=e.from[0]*100+e.from[1],b=e.to[0]*100+e.to[1];
  return a<=b?(v>=a&&v<=b):(v>=a||v<=b);
}
const eventsNow=()=>EVENTS.filter(e=>eventActive(e.id));
