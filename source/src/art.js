/* ================= art: colours, icons, dragon, egg, island ================= */
function hex2rgb(h){h=h.replace('#','');return [0,2,4].map(i=>parseInt(h.substr(i,2),16));}
function rgb2hex(r,g,b){return '#'+[r,g,b].map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');}
function mix(a,b,t){const A=hex2rgb(a),B=hex2rgb(b);return rgb2hex(A[0]+(B[0]-A[0])*t,A[1]+(B[1]-A[1])*t,A[2]+(B[2]-A[2])*t);}
const shade=(c,t)=>mix(c,'#000000',t), tint=(c,t)=>mix(c,'#ffffff',t);

const PAL=[
  {id:'teal',hex:'#2a9d8f',name:'Sea teal'},{id:'ember',hex:'#e4572e',name:'Ember red'},
  {id:'sun',hex:'#f2b134',name:'Sunny gold'},{id:'sky',hex:'#4a90d9',name:'Sky blue'},
  {id:'moss',hex:'#6aa84f',name:'Moss green'},{id:'plum',hex:'#8e5bb5',name:'Plum'},
  {id:'coral',hex:'#f07c8e',name:'Coral'},{id:'night',hex:'#34456b',name:'Night blue'}
];
const EYES=[{hex:'#2f9e5b',name:'Green'},{hex:'#2f6fd0',name:'Blue'},{hex:'#e0912f',name:'Amber'},{hex:'#8a4fbf',name:'Violet'}];
const HORNS=[['none','No horns'],['small','Little horns'],['big','Curly horns'],['crest','Head crest']];
const PATTERNS=[['none','Plain'],['spots','Spots'],['stripes','Stripes']];
const TAILS=[['flame','Flame tip'],['spade','Spade tip'],['club','Club tip']];

const ICONS={
  flame:'<path d="M12 2.5c.6 3.3 5.4 5.4 5.4 10.6a5.4 5.4 0 0 1-10.8 0c0-2.3 1-3.6 2.3-4.8.2 1.8 1 2.8 2.1 3.2-.6-3.4-.5-6.2 1-9z" fill="currentColor"/>',
  ember:'<path d="M12 2.5l7.5 6.5L12 21.5 4.5 9z" fill="currentColor"/><path d="M12 2.5l-2.6 6.5h5.2z" fill="#fff" opacity=".35"/>',
  sound:'<path d="M4 9.5v5h3.6l4.9 4V5.5l-4.9 4z" fill="currentColor"/><path d="M15.8 9.2a4 4 0 0 1 0 5.6M18.4 6.6a7.6 7.6 0 0 1 0 10.8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  mute:'<path d="M4 9.5v5h3.6l4.9 4V5.5l-4.9 4z" fill="currentColor"/><path d="M16 9.5l5 5M21 9.5l-5 5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  music:'<path d="M9 17.5V6.5l10-2v11" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="6.6" cy="17.6" r="2.6" fill="currentColor"/><circle cx="16.6" cy="15.6" r="2.6" fill="currentColor"/>',
  bag:'<path d="M5 8h14l-1 12H6z" fill="currentColor"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8" fill="none" stroke="currentColor" stroke-width="2"/>',
  bolt:'<path d="M13.5 2L5 13.5h6l-1.5 8.5L19 10h-6z" fill="currentColor"/>',
  close:'<path d="M6 6l12 12M18 6L6 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
  check:'<path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>',
  undo:'<path d="M9 7L4.5 11.5 9 16M5 11.5h8a6 6 0 0 1 6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>',
  help:'<path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.2 1.1 2.2h5c0-1 .4-1.6 1.1-2.2A6 6 0 0 0 12 3z" fill="currentColor"/><path d="M9.6 19h4.8M10.4 21.5h3.2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
  home:'<path d="M3.5 11.5L12 4l8.5 7.5M6 10.5V20h12v-9.5" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>',
  heart:'<path d="M12 20.5S3.5 15 3.5 9.2A4.6 4.6 0 0 1 12 7a4.6 4.6 0 0 1 8.5 2.2C20.5 15 12 20.5 12 20.5z" fill="currentColor"/>',
  lock:'<rect x="5" y="10.5" width="14" height="10" rx="2.5" fill="currentColor"/><path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" fill="none" stroke="currentColor" stroke-width="2"/>',
  wind:'<path d="M3 9h11a3 3 0 1 0-3-3M3 14h15a3 3 0 1 1-3 3M3 19h7" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>',
  compass:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/><path d="M16 8l-2.2 5.8L8 16l2.2-5.8z" fill="currentColor"/>',
  star:'<path d="M12 3l2.7 5.8 6.3.8-4.6 4.4 1.2 6.3L12 17.2 6.4 20.3l1.2-6.3L3 9.6l6.3-.8z" fill="currentColor"/>',
  next:'<path d="M5 12h13M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  back:'<path d="M19 12H6M11 6l-6 6 6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>',
  fish:'<path d="M3 12c3-5 9-6 13-2l5-3v10l-5-3c-4 4-10 3-13-2z" fill="currentColor"/><circle cx="8" cy="11" r="1.2" fill="#fff"/>',
  berry:'<circle cx="9" cy="14" r="5" fill="currentColor"/><circle cx="16" cy="14.5" r="4.2" fill="currentColor"/><path d="M12 9c0-3 1-4.5 3-5.5" stroke="#3f8f58" stroke-width="2" fill="none" stroke-linecap="round"/>',
  spice:'<path d="M7 9c2-3 7-3 9 0 2 3 0 8-4.5 12C7 17 5 12 7 9z" fill="currentColor"/><path d="M12 6c0-2 1-3 3-3.5" stroke="#3f8f58" stroke-width="2" fill="none" stroke-linecap="round"/>'
};
function ic(name,size=22){return `<svg class="ic" viewBox="0 0 24 24" width="${size}" height="${size}" aria-hidden="true">${ICONS[name]||''}</svg>`;}
function faceSVG(kind){
  const col={good:'#3f9c5a',ok:'#e0a52f',worried:'#5b8fd0'}[kind];
  const mouth={good:'M17 34 Q28 45 39 34',ok:'M18 37 L38 37',worried:'M18 41 Q28 33 38 41'}[kind];
  return `<svg viewBox="0 0 56 56"><circle cx="28" cy="28" r="25" fill="${col}"/><circle cx="20" cy="23" r="3.2" fill="#fff"/><circle cx="36" cy="23" r="3.2" fill="#fff"/><path d="${mouth}" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round"/></svg>`;
}

/* ---- dragon ---- */
function dragonSVG(d,o={}){
  const mood=o.mood||'happy', stage=o.stage==null?2:o.stage;
  const wr=typeof o.wear==='string'?{[GEAR_SLOT[o.wear]||'neck']:o.wear}:(o.wear||{});
  const id='dg'+(o.uid||Math.floor(Math.random()*1e6));
  const B=d.body, Bd=shade(B,.24), Bk=shade(B,.42), Bl=tint(B,.28), W=d.wing, Wd=shade(W,.26), Wl=tint(W,.3), belly=tint(B,.6), bellyLine=shade(belly,.16), eye=d.eyes, eyeD=shade(eye,.35);
  const wingS=[.78,.9,1,1.1][stage];
  let s='';
  /* big bat wings with finger bones */
  const wing=`<path d="M92 128 L12 46 Q8 80 2 100 Q20 98 26 118 Q32 126 22 140 Q46 130 54 152 Q70 144 90 164Z" fill="${W}" stroke="${Wd}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M92 128 L12 46 M92 130 L2 100 M92 132 L26 118 M92 136 L22 140 M92 140 L54 152" stroke="${Wd}" stroke-width="3.2" fill="none" stroke-linecap="round"/>
    <path d="M60 98 Q34 92 8 104 M62 110 Q40 112 28 124" stroke="${Wl}" stroke-width="2" fill="none" opacity=".5" stroke-linecap="round"/>`;
  s+=`<g transform="translate(120 130) scale(${wingS}) translate(-120 -130)"><g>${wing}</g><g transform="translate(240 0) scale(-1 1)">${wing}</g></g>`;
  /* tail, thick at base and curling */
  s+=`<path d="M146 196 C198 214 238 188 222 150 C218 140 211 132 204 126" fill="none" stroke="${Bd}" stroke-width="22" stroke-linecap="round"/><path d="M146 196 C198 214 238 188 222 150 C218 140 211 132 204 126" fill="none" stroke="${B}" stroke-width="16" stroke-linecap="round"/>`;
  s+=`<g fill="${Bk}"><path d="M170 208 l4 -12 l5 12z M196 206 l6 -12 l4 14z M216 190 l10 -8 l-2 12z M222 166 l12 -3 l-6 12z"/></g>`;
  if(d.tail==='flame') s+=`<g class="flame"><path d="M204 130 C186 116 196 100 204 78 C212 100 224 116 204 130Z" fill="#ff8a3d"/><path d="M204 126 C196 118 200 108 204 98 C209 108 213 118 204 126Z" fill="#ffd36b"/></g>`;
  else if(d.tail==='spade') s+=`<path d="M204 132 C186 122 178 104 188 88 C196 96 202 98 204 92 C206 98 212 96 220 88 C230 104 222 122 204 132Z" fill="${W}" stroke="${Wd}" stroke-width="2.5" stroke-linejoin="round"/><path d="M204 128 L204 98" stroke="${Wd}" stroke-width="2.5"/>`;
  else s+=`<circle cx="203" cy="120" r="13" fill="${Bd}"/><path d="M192 110l-8-8M214 110l8-8M203 106v-12M196 128l-10 4M212 128l10 4" stroke="${Bk}" stroke-width="4" stroke-linecap="round"/>`;
  /* body */
  s+=`<defs><linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${Bl}"/><stop offset="1" stop-color="${B}"/></linearGradient></defs>`;
  s+=`<ellipse cx="90" cy="204" rx="20" ry="10" fill="${Bd}"/><ellipse cx="150" cy="204" rx="20" ry="10" fill="${Bd}"/>`;
  s+=`<g fill="#fff5e0" stroke="${Bk}" stroke-width="1"><path d="M72 206 l-4 9 l8 -3z M85 210 l-1 10 l7 -5z M99 208 l3 10 l4 -7z"/><path d="M168 206 l4 9 l-8 -3z M155 210 l1 10 l-7 -5z M141 208 l-3 10 l-4 -7z"/></g>`;
  s+=`<path d="M120 100 C168 100 176 150 164 182 C156 200 140 206 120 206 C100 206 84 200 76 182 C64 150 72 100 120 100Z" fill="url(#${id}b)"/>`;
  s+=`<path d="M96 138 C96 120 144 120 144 138 C152 170 142 202 120 204 C98 202 88 170 96 138Z" fill="${belly}"/>`;
  s+=`<path d="M100 150 Q120 157 140 150M98 164 Q120 172 142 164M100 178 Q120 186 140 178M104 191 Q120 197 136 191" stroke="${bellyLine}" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
  s+=`<ellipse cx="68" cy="164" rx="12" ry="22" transform="rotate(16 68 164)" fill="${B}"/><ellipse cx="172" cy="164" rx="12" ry="22" transform="rotate(-16 172 164)" fill="${B}"/>`;
  s+=`<g fill="#fff5e0" stroke="${Bk}" stroke-width="1"><path d="M60 180 l-3 8 l7 -2z M68 184 l0 9 l6 -4z M76 181 l3 8 l4 -6z"/><path d="M180 180 l3 8 l-7 -2z M172 184 l0 9 l-6 -4z M164 181 l-3 8 l-4 -6z"/></g>`;
  if(d.pattern==='spots') s+=`<g fill="${Bd}" opacity=".5"><circle cx="82" cy="146" r="6"/><circle cx="160" cy="142" r="5"/><circle cx="154" cy="176" r="6"/><circle cx="86" cy="180" r="5"/><circle cx="76" cy="168" r="3.5"/></g>`;
  if(d.pattern==='stripes') s+=`<g stroke="${Bd}" stroke-width="5" opacity=".45" fill="none" stroke-linecap="round"><path d="M72 142 Q86 150 96 142"/><path d="M70 158 Q86 166 94 158"/><path d="M168 142 Q154 150 144 142"/><path d="M170 158 Q154 166 146 158"/></g>`;
  /* body armour */
  if(wr.body==='mail'){ s+=`<path d="M82 126 C102 116 138 116 158 126 C168 156 164 186 150 200 C136 206 104 206 90 200 C76 186 72 156 82 126Z" fill="#aeb7bf" stroke="#5a636b" stroke-width="2.4"/><g fill="none" stroke="#6e7881" stroke-width="1.6" opacity=".8">${[0,1,2,3,4].map(r=>`<path d="M${86+r*2} ${136+r*13} q8 6 16 0 q8 6 16 0 q8 6 16 0 q8 6 16 0"/>`).join('')}</g><path d="M96 126 Q120 140 144 126" stroke="#e6eef4" stroke-width="3" fill="none" opacity=".6" stroke-linecap="round"/>`; }
  if(wr.body==='plate'){ s+=`<path d="M80 124 C100 114 140 114 160 124 C170 156 166 188 152 202 C136 208 104 208 88 202 C74 188 70 156 80 124Z" fill="#c9a24a" stroke="#6b4e18" stroke-width="2.6"/>${[0,1,2,3].map(r=>`<path d="M${80+r*2} ${138+r*16} Q120 ${150+r*16} ${160-r*2} ${138+r*16}" fill="#d8b45a" stroke="#6b4e18" stroke-width="2"/>`).join('')}<g fill="#e4572e" stroke="#6b4e18" stroke-width="1"><circle cx="96" cy="140" r="3.4"/><circle cx="144" cy="140" r="3.4"/><circle cx="120" cy="146" r="4"/></g><path d="M70 126 Q60 138 76 148Q82 136 82 126Z M170 126 Q180 138 164 148Q158 136 158 126Z" fill="#b88f36" stroke="#6b4e18" stroke-width="2"/>`; }
  /* scarf */
  if(wr.neck==='scarf') s+=`<path d="M82 126 Q120 150 158 126 L155 143 Q120 164 85 143Z" fill="#e4572e"/><path d="M134 148 L148 182 L130 177 L125 154Z" fill="#c9431d"/><path d="M96 138 Q120 150 144 138" stroke="#ffb199" stroke-width="3" fill="none" opacity=".7"/>`;
  /* ear fins */
  const fin=`<path d="M70 82 L14 52 Q26 74 18 92 Q38 90 46 104 Q54 98 66 100Z" fill="${W}" stroke="${Wd}" stroke-width="2.6" stroke-linejoin="round"/><path d="M70 84 L16 54 M68 88 L20 90 M66 94 L46 104" stroke="${Wd}" stroke-width="2.2" fill="none" stroke-linecap="round" opacity=".8"/>`;
  s+=`<g>${fin}</g><g transform="translate(240 0) scale(-1 1)">${fin}</g>`;
  /* head: broad cheeks and a tapered muzzle */
  s+=`<path d="M120 36 C154 36 180 54 184 84 C187 106 172 122 152 130 C144 142 96 142 88 130 C68 122 53 106 56 84 C60 54 86 36 120 36Z" fill="url(#${id}b)"/>`;
  s+=`<path d="M64 98 Q70 118 90 128 M176 98 Q170 118 150 128" stroke="${Bd}" stroke-width="2.4" fill="none" opacity=".5" stroke-linecap="round"/>`;
  /* horns / crest */
  if(d.horn==='small') s+=`<path d="M86 52 L76 22 L102 44Z M154 52 L164 22 L138 44Z" fill="#f3e6c8" stroke="${Bk}" stroke-width="1.8" stroke-linejoin="round"/>`;
  if(d.horn==='big') s+=`<path d="M84 56 Q58 30 68 2 Q92 16 102 46Z M156 56 Q182 30 172 2 Q148 16 138 46Z" fill="#f3e6c8" stroke="${Bk}" stroke-width="1.8" stroke-linejoin="round"/><path d="M76 20 Q86 28 92 38M164 20 Q154 28 148 38" stroke="${Bk}" stroke-width="1.6" fill="none" opacity=".5"/>`;
  if(d.horn==='crest') s+=`<g fill="${Wd}" stroke="${Bk}" stroke-width="1.4" stroke-linejoin="round"><path d="M92 42 L96 20 L108 38Z"/><path d="M106 38 L114 8 L124 38Z"/><path d="M118 38 L130 6 L136 40Z"/><path d="M132 38 L144 20 L148 44Z"/></g>`;
  if(d.pattern==='spots') s+=`<g fill="${Bd}" opacity=".5"><circle cx="120" cy="56" r="5"/><circle cx="100" cy="64" r="3.5"/><circle cx="140" cy="64" r="3.5"/></g>`;
  if(d.pattern==='stripes') s+=`<g stroke="${Bd}" stroke-width="4.5" opacity=".45" stroke-linecap="round" fill="none"><path d="M120 44v16"/><path d="M106 48v12"/><path d="M134 48v12"/></g>`;
  /* muzzle */
  s+=`<ellipse cx="120" cy="112" rx="29" ry="18" fill="${Bl}"/><ellipse cx="111" cy="104" rx="3.2" ry="4.2" fill="${Bk}"/><ellipse cx="129" cy="104" rx="3.2" ry="4.2" fill="${Bk}"/>`;
  s+=`<circle cx="76" cy="108" r="8" fill="#ff8f9d" opacity=".38"/><circle cx="164" cy="108" r="8" fill="#ff8f9d" opacity=".38"/>`;
  /* eyes: big, glossy, slit pupils, with a brow ridge */
  const eyeOpen=(cx,sgn)=>`<path d="M${cx-17} ${70+sgn*2} Q${cx} ${58-sgn*0} ${cx+17} ${70-sgn*2}" stroke="${Bk}" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/><ellipse cx="${cx}" cy="84" rx="15" ry="17" fill="${eye}" stroke="${eyeD}" stroke-width="2.5"/><ellipse cx="${cx}" cy="85" rx="4" ry="12" fill="#101820"/><ellipse cx="${cx+sgn*(-5)}" cy="76" rx="5" ry="6" fill="#fff"/><circle cx="${cx+sgn*4}" cy="92" r="2.6" fill="#fff" opacity=".8"/>`;
  if(mood==='sleepy'){
    s+=`<path d="M82 86 Q97 98 112 86M128 86 Q143 98 158 86" stroke="#101820" stroke-width="4" fill="none" stroke-linecap="round"/>`;
    s+=`<path d="M108 124 Q120 128 132 124" stroke="${Bk}" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
    s+=`<g fill="${Bd}" font-family="Fredoka,sans-serif" font-weight="600"><text x="182" y="52" font-size="22">z</text><text x="196" y="36" font-size="17">z</text></g>`;
  }else{
    if(mood==='cheer') s+=`<path d="M82 88 Q97 72 112 88M128 88 Q143 72 158 88" stroke="#101820" stroke-width="4.2" fill="none" stroke-linecap="round"/>`;
    else s+=eyeOpen(97,1)+eyeOpen(143,-1);
    if(mood==='eat') s+=`<ellipse cx="120" cy="125" rx="14" ry="10" fill="#5a1f2a"/><ellipse cx="120" cy="130" rx="8" ry="4.5" fill="#e86a7a"/><path d="M110 118 l3 6 l3 -6z M124 118 l3 6 l3 -6z" fill="#fff"/>`;
    else if(mood==='cheer') s+=`<path d="M100 119 Q120 146 140 119Z" fill="#5a1f2a" stroke="${Bk}" stroke-width="2" stroke-linejoin="round"/><path d="M110 131 Q120 137 130 131 Q120 126 110 131Z" fill="#e86a7a"/><path d="M104 120 l3 6 l3 -6z M130 120 l3 6 l3 -6z" fill="#fff"/>`;
    else s+=`<path d="M102 121 Q120 134 138 121" stroke="${Bk}" stroke-width="3.6" fill="none" stroke-linecap="round"/><path d="M130 124 l3 6 l3 -7z" fill="#fff" stroke="${Bk}" stroke-width="1"/>`;
  }
  /* head wear */
  if(wr.head==='helm') s+=`<path d="M78 66 Q76 22 120 20 Q164 22 162 66 L158 74 L82 74Z" fill="#9aa4ad" stroke="#4e575f" stroke-width="3" stroke-linejoin="round"/><path d="M84 40 Q120 8 156 40" stroke="#e6eef4" stroke-width="4" fill="none" opacity=".55" stroke-linecap="round"/><path d="M80 62 H160" stroke="#4e575f" stroke-width="7"/><path d="M118 20 V44 M112 44 H128" stroke="#4e575f" stroke-width="5" stroke-linecap="round"/><g fill="#d6dde3" stroke="#4e575f" stroke-width="1"><circle cx="90" cy="62" r="2.6"/><circle cx="120" cy="62" r="2.6"/><circle cx="150" cy="62" r="2.6"/></g><path d="M98 20 Q118 -4 122 18Z" fill="#e4572e" opacity=".9"/>`;
  if(wr.tail==='blade') s+=`<g><path d="M192 132 L204 90 L216 132Z" fill="#c4ccd3" stroke="#4e575f" stroke-width="2.4" stroke-linejoin="round"/><path d="M204 94 V128" stroke="#fff" stroke-width="2" opacity=".6"/><rect x="190" y="128" width="28" height="9" rx="3" fill="#7a5a36" stroke="#3b2a1a" stroke-width="2"/><path d="M190 112 L176 104 L188 124Z M218 112 L232 104 L220 124Z" fill="#9aa4ad" stroke="#4e575f" stroke-width="1.6"/></g>`;
  if(wr.head==='hat') s+=`<ellipse cx="120" cy="50" rx="46" ry="9" fill="#9a6a34"/><path d="M90 50 Q90 18 120 18 Q150 18 150 50Z" fill="#c58f4d"/><path d="M91 44 Q120 52 149 44" stroke="#e4572e" stroke-width="6" fill="none"/>`;
  if(wr.head==='crown') s+=`<g><circle cx="84" cy="52" r="7" fill="#ff9ec2"/><circle cx="99" cy="42" r="7" fill="#ffe27a"/><circle cx="120" cy="38" r="7.5" fill="#ff9ec2"/><circle cx="141" cy="42" r="7" fill="#ffe27a"/><circle cx="156" cy="52" r="7" fill="#ff9ec2"/></g>`;
  const sc=[.66,.82,1,1.1][stage];
  const inner=`<g transform="translate(120 215) scale(${sc}) translate(-120 -215)">${s}</g>`;
  if(o.bare) return inner;
  return `<svg class="dragon" viewBox="0 0 240 230" role="img" aria-label="${(d.name||'Your dragon').replace(/[<>&"]/g,'')}">${inner}</svg>`;
}
function eggSVG(d,o={}){
  const B=d.body, W=d.wing, Bd=shade(B,.22);
  const id='eg'+Math.floor(Math.random()*1e6);
  const cls=o.wiggle?' class="wiggle"':'';
  const inner=`<defs><radialGradient id="${id}" cx=".35" cy=".3" r=".9"><stop offset="0" stop-color="${tint(B,.45)}"/><stop offset=".6" stop-color="${B}"/><stop offset="1" stop-color="${Bd}"/></radialGradient></defs>
  <ellipse cx="60" cy="152" rx="52" ry="12" fill="#8a6a43" opacity=".5"/>
  <g${cls}><path d="M60 14 C95 14 116 66 116 100 C116 136 92 154 60 154 C28 154 4 136 4 100 C4 66 25 14 60 14Z" fill="url(#${id})"/>
  ${d.pattern==='stripes'?`<g stroke="${W}" stroke-width="7" fill="none" opacity=".7" stroke-linecap="round"><path d="M10 92 Q60 108 110 92"/><path d="M12 116 Q60 132 108 116"/><path d="M26 66 Q60 78 94 66"/></g>`:`<g fill="${W}" opacity=".75"><circle cx="40" cy="70" r="9"/><circle cx="82" cy="96" r="11"/><circle cx="46" cy="118" r="8"/><circle cx="84" cy="56" r="6"/></g>`}
  <ellipse cx="42" cy="46" rx="10" ry="16" fill="#fff" opacity=".28" transform="rotate(24 42 46)"/></g>`;
  if(o.bare) return inner;
  return `<svg class="egg" viewBox="0 0 120 170" role="img" aria-label="Your dragon egg">${inner}</svg>`;
}


/* ---- dad jokes (shown after practice and after rescuing Millie) ---- */
const JOKES=[
["What is a dragon's favourite subject?","Fire-thmetic."],["Why was six afraid of seven?","Because seven eight nine."],
["Why did the dragon get a job at the bakery?","It was great at toasting things."],["What do dragons use to count?","Their fire-gers."],
["Why is the snowman so good at maths?","He keeps his cool."],["What did the egg say to the dragon?","\"You're hatching a plan!\""],
["Why did the baker count his rolls twice?","He was doughbting his sums."],["How does a dragon count its gold?","One scale at a time."],
["Why did the dragon take a ladder to school?","Because it was high school."],["Why do dragons never win at hide and seek?","They give themselves away with smoke signals."],
["How do you make a dragon laugh?","Tell it a fire-cracker of a joke."],["What do you call a clever dragon?","A bright spark."],
["Why was the cave great at multiplication?","Everything it said came back multiplied."],["Why did the bridge go to the doctor?","It had a crack in its span."],
["Why are Nordic maths teachers so calm?","They know how to rune a class."],["Why was the maths book sad?","It had too many problems."],
["What is a dragon's favourite meal?","Fish and flame-chips."],["Why did the fish swim away from the dragon?","It did not want to be a fire-side snack."],
["What did the dragon say to the hard sum?","\"I'll burn through you!\""],["Why did the number 8 like the dragon's nest?","It looked like two eggs."],
["Why did the ember feel important?","It was a bit of a hot shot."],["What do you call a dragon that never stops talking?","A chatter-flame."],
["Why did the plank join the bridge?","It wanted to be part of the team that gets people across."],["What did the dragon get on its maths test?","A burning desire to do it again."],
["Why did Millie sit on the computer?","To keep an eye on the mouse."],["What do you call a cat who loves maths?","A count-cat. No wait, a cat-culator."],
["Why does Millie hate sums?","Too many paws-ibilities."]
];

/* ---- treats / decor / accessories catalogue ---- */
const CATALOG={
  treats:[
    {id:'fish',name:'Silver fish',cost:5,note:'A crunchy snack.',icon:'fish',col:'#6db7d9'},
    {id:'berry',name:'Sun berries',cost:8,note:'Sweet and juicy.',icon:'berry',col:'#c0396b'},
    {id:'spice',name:'Ember pepper',cost:12,note:'Tickles the nose!',icon:'spice',col:'#e4572e'},
    {id:'bun',name:'Honey bun',cost:0,note:'Baked at the bakery.',icon:'berry',col:'#d9a45a',own:1},
    {id:'egg',name:'Fresh egg',cost:0,note:'From the chicken coop.',icon:'berry',col:'#f3e6c4',own:1},
    {id:'pudding',name:'Christmas pudding',cost:6,note:'Only at Christmas. Rich and spicy!',icon:'berry',col:'#6b3a2a',event:'xmas'}
  ],
  decor:[
    {id:'banner',name:'Island banner',cost:30,note:'Flaps in the wind.'},
    {id:'lantern',name:'Iron torch',cost:40,note:'Lights up at dusk.'},
    {id:'pines',name:'Pine trees',cost:50,note:'Tall and whispery.'},
    {id:'campfire',name:'Campfire',cost:60,note:'Warm and crackly.'},
    {id:'jetty',name:'Dock and longboat',cost:80,note:'For sea adventures.'},
    {id:'tower',name:'Lookout tower',cost:110,note:'See the whole sea.'},
    {id:'garden',name:'Flower garden',cost:90,note:'Bees love it.',spr:1},
    {id:'fountain',name:'Stone fountain',cost:140,note:'Splashy and sparkly.',spr:1},
    {id:'windmill',name:'Windmill',cost:200,note:'Its sails turn in the breeze.',spr:1},
    {id:'statue',name:'Dragon statue',cost:280,note:'A hero carved in stone.',spr:1}
  ],
  acc:[
    {id:'scarf',name:'Cosy scarf',cost:45,note:'Red and warm.',slot:'neck'},
    {id:'hat',name:'Explorer hat',cost:60,note:'Ready for a trek.',slot:'head'},
    {id:'crown',name:'Flower crown',cost:75,note:'Fresh from the meadow.',slot:'head'}
  ],
  build:[
    {id:'forge',name:'Forge',cost:120,note:'A blacksmith for metal armour.'},
    {id:'stables',name:'Stables',cost:200,note:'A home for more dragons.'},
    {id:'clothes',name:'Clothes shop',cost:100,note:'Outfits, hats, cloaks and gear for you.'},
    {id:'foodstore',name:'Dragon food store',cost:80,note:'Cheaper treats. Built on the Village Green.'},
    {id:'coop',name:'Chicken coop',cost:70,note:'Hens, eggs and egg counting. Built on the Village Green.'},
    {id:'bath',name:'Dragon bath',cost:90,note:'Bubbles for your dragon. Built on the Village Green.'},
    {id:'library',name:'Library',cost:100,note:'A new story page every day. Built on the Village Green.'},
    {id:'bakery',name:'Bakery',cost:110,note:'Bake buns to feed your dragon. Built on the Village Green.'},
    {id:'workshop',name:'Workshop',cost:130,note:'Build benches, birdhouses and more. Built on the Village Green.'},
    {id:'arena',name:'Dragon training arena',cost:150,note:'Where your dragon learns new skills. Built on the Village Green.'}
  ],
  wardrobe:[
    {id:'forest',name:'Woodland tunic',cost:40,note:'Green, for quiet walks.',slot:'outfit'},
    {id:'ocean',name:'Sailor top',cost:50,note:'Blue and white stripes.',slot:'outfit'},
    {id:'ember',name:'Ember jerkin',cost:60,note:'Flames along the hem.',slot:'outfit'},
    {id:'snow',name:'Snow tunic',cost:70,note:'Warm, with a furry collar.',slot:'outfit'},
    {id:'royal',name:'Royal tunic',cost:80,note:'Purple with gold trim.',slot:'outfit'},
    {id:'scale',name:'Scale tunic',cost:90,note:'Shimmering like a dragon.',slot:'outfit'},
    {id:'woolcap',name:'Woolly hat',cost:30,note:'Red, with a pom-pom.',slot:'head'},
    {id:'circlet',name:'Flower circlet',cost:40,note:'Picked from the meadow.',slot:'head'},
    {id:'ranger',name:'Ranger hood',cost:45,note:'A green hood for hiding in trees.',slot:'head'},
    {id:'horn',name:'Horned helm',cost:70,note:'A tough iron helm.',slot:'head'},
    {id:'goggles',name:'Flying goggles',cost:50,note:'For fast, windy flights.',slot:'face'},
    {id:'redcloak',name:'Red cloak',cost:60,note:'It flaps when you walk.',slot:'cloak'},
    {id:'greencloak',name:'Forest cloak',cost:60,note:'Soft and mossy.',slot:'cloak'},
    {id:'starcloak',name:'Starry cloak',cost:90,note:'The night sky on your back.',slot:'cloak'},
    {id:'satchel',name:'Satchel',cost:35,note:'For carrying treasure.',slot:'back'},
    {id:'shield',name:'Wooden shield',cost:55,note:'Painted red and gold.',slot:'back'},
    {id:'staff',name:'Walking staff',cost:40,note:'With a glowing green gem.',slot:'hand'},
    {id:'lantern',name:'Hand lantern',cost:45,note:'Lights the way.',slot:'hand'},
    {id:'sword',name:'Wooden sword',cost:50,note:'For pretend adventures.',slot:'hand'},
    /* tier 2: bigger savings goals */
    {id:'sunset',name:'Sunset tunic',cost:120,note:'Orange and gold.',slot:'outfit'},
    {id:'midnight',name:'Midnight tunic',cost:140,note:'Deep blue with silver stripes.',slot:'outfit'},
    {id:'golden',name:'Golden scale mail',cost:200,note:'Shines like treasure.',slot:'outfit'},
    {id:'wizard',name:'Wizard hat',cost:120,note:'Tall, with tiny stars.',slot:'head'},
    {id:'goldcrown',name:'Golden crown',cost:250,note:'Fit for a dragon rider.',slot:'head'},
    {id:'violetcloak',name:'Violet cloak',cost:140,note:'Rich and swishy.',slot:'cloak'},
    {id:'goldcloak',name:'Golden cloak',cost:220,note:'Dotted with sparkles.',slot:'cloak'},
    {id:'wand',name:'Star wand',cost:130,note:'It twinkles.',slot:'hand'},
    {id:'wings',name:'Dragon wings',cost:300,note:'Big leathery wings for your back.',slot:'back'},
    /* found on the islands (not for sale) */
    {id:'frostcloak',name:'Frost cloak',cost:0,found:'Snowcap Isle',note:'Shimmers like ice.',slot:'cloak'},
    {id:'sunhat',name:'Sun hat',cost:0,found:'Sunstone Cove',note:'A big straw hat.',slot:'head'},
    {id:'embercrown',name:'Ember crown',cost:0,found:'Cinder Peak',note:'It glows softly.',slot:'head'},
    /* earned by keeping going (free) */
    {id:'dawncloak',name:'Dawn cloak',cost:0,earn:{days:7},note:'For one week of practice.',slot:'cloak'},
    {id:'laurel',name:'Laurel wreath',cost:0,earn:{days:14},note:'For two weeks of practice.',slot:'head'},
    {id:'champion',name:'Champion tunic',cost:0,earn:{days:30},note:'For thirty days of practice.',slot:'outfit'},
    {id:'scholar',name:'Scholar robe',cost:0,earn:{secure:30},note:'For 30 secure facts.',slot:'outfit'},
    /* seasonal (free while the event lasts) */
    {id:'pumpkin',name:'Pumpkin hat',cost:0,event:'halloween',note:'Spooky Week only.',slot:'head'},
    {id:'santahat',name:'Santa hat',cost:0,event:'xmas',note:'Christmas only.',slot:'head'},
    {id:'partyhat',name:'Party hat',cost:0,event:'newyear',note:'New Year only.',slot:'head'},
    {id:'nycloak',name:'Sparkle cloak',cost:0,event:'newyear',note:'New Year only.',slot:'cloak'}
  ],
  forge:[
    {id:'helm',name:'Iron helm',cost:70,note:'Hammered and polished.',slot:'head'},
    {id:'mail',name:'Chain mail',cost:110,note:'Thousands of tiny rings.',slot:'body'},
    {id:'plate',name:'Dragon plate',cost:170,note:'Gold plates with ember rivets.',slot:'body'},
    {id:'blade',name:'Tail blade',cost:90,note:'A steel guard for your tail.',slot:'tail'}
  ]
};
/* ---- hero (the child's own character) ---- */
const OUTFIT={
  forest:{tun:'#3f8a4a',pat:'trim',trim:'#d9c27a'}, ocean:{tun:'#2f6fb3',pat:'stripe',trim:'#f3f6f8'},
  ember:{tun:'#c4472b',pat:'flame',trim:'#ffd36b'}, snow:{tun:'#8fb8d8',pat:'fur',scarf:'#f4f7fa'},
  royal:{tun:'#6b3fa0',pat:'trim',trim:'#f1d36b'}, scale:{tun:'#2a8f87',pat:'scale'},
  sunset:{tun:'#e0702f',pat:'trim',trim:'#ffe08a'}, midnight:{tun:'#243060',pat:'stripe',trim:'#9fb8ff'}, golden:{tun:'#c99a2e',pat:'scale'},
  champion:{tun:'#b8312b',pat:'trim',trim:'#ffd36b',scarf:'#ffd36b'}, scholar:{tun:'#3a4f8f',pat:'trim',trim:'#e8ecf4'}};
const CLOAKS={redcloak:{c1:'#d34a35',c2:'#8f2418'},greencloak:{c1:'#4c8a57',c2:'#2a5a34'},starcloak:{c1:'#2f3f8a',c2:'#171f52',star:1},
  violetcloak:{c1:'#7a4fb0',c2:'#4a2a78'},goldcloak:{c1:'#e0b040',c2:'#a07a1a',star:1},frostcloak:{c1:'#9fd4ee',c2:'#5a8fb8',star:1},dawncloak:{c1:'#f08a5a',c2:'#b84a6a'},nycloak:{c1:'#ffd36b',c2:'#b8860b',star:1}};
const HERO_SKIN=[{hex:'#fbe0c4',name:'Very light'},{hex:'#f2c9a0',name:'Light'},{hex:'#d9a577',name:'Tan'},{hex:'#b9814f',name:'Brown'},{hex:'#8a5a38',name:'Deep brown'},{hex:'#5e3a22',name:'Dark brown'}];
const HERO_HAIR=[{hex:'#2a1d14',name:'Black'},{hex:'#6b3d1e',name:'Brown'},{hex:'#a8672b',name:'Auburn'},{hex:'#e0b45a',name:'Blond'},{hex:'#b8452c',name:'Red'},{hex:'#d9d2c2',name:'Silver'},{hex:'#4a7ad0',name:'Blue'},{hex:'#d867a8',name:'Pink'}];
const HERO_STYLES=[['short','Short'],['long','Long'],['pony','Ponytail'],['bun','Bun']];
const HERO_TUNIC=[{hex:'#2f8f8d',name:'Teal'},{hex:'#3a6fc4',name:'Blue'},{hex:'#d95a3a',name:'Orange'},{hex:'#c84b7a',name:'Rose'},{hex:'#7a4fb0',name:'Purple'},{hex:'#4f9a4a',name:'Green'},{hex:'#d9a62e',name:'Gold'},{hex:'#4a4f5a',name:'Slate'}];
const HERO_SCARF=[{hex:'#e8743b',name:'Orange'},{hex:'#d34a4a',name:'Red'},{hex:'#f1d36b',name:'Yellow'},{hex:'#6fc0d8',name:'Sky'},{hex:'#8ad06a',name:'Lime'},{hex:'#f4f7fa',name:'White'},{hex:'#e58ab8',name:'Pink'},{hex:'#8b6bc9',name:'Violet'}];
const HERO_SLOTS={outfit:'Outfit',head:'Hat',face:'Face',cloak:'Cloak',back:'Back',hand:'In hand'};
const EGG_COSTS=[150,250];   /* price of the 2nd and 3rd dragon once the stables are built */
const SLOT_NAMES={head:'Head',neck:'Neck',body:'Body',tail:'Tail'};
function decorArt(id){
  switch(id){
    case 'banner': return `<g><rect x="-3" y="-90" width="6" height="94" rx="3" fill="#7a5a36"/><path d="M3 -86 q26 -10 46 0 q-8 14 0 28 q-22 -10 -46 0z" fill="#e4572e"><animate attributeName="d" dur="2.4s" repeatCount="indefinite" values="M3 -86 q26 -10 46 0 q-8 14 0 28 q-22 -10 -46 0z;M3 -86 q26 8 46 0 q-8 14 0 28 q-22 6 -46 0z;M3 -86 q26 -10 46 0 q-8 14 0 28 q-22 -10 -46 0z"/></path><path d="M12 -74 h28 M12 -66 h22" stroke="#ffd36b" stroke-width="3" stroke-linecap="round"/></g>`;
    case 'lantern': return `<g><rect x="-3" y="-58" width="6" height="62" rx="3" fill="#4a3624"/><path d="M-12 -58 h24 l-5 12 h-14z" fill="#3a4650"/><g class="flame"><path d="M0 -58 C-12 -70 -6 -82 0 -98 C6 -82 14 -70 0 -58Z" fill="#ff8a3d"/><path d="M0 -60 C-6 -68 -3 -76 0 -84 C4 -76 7 -68 0 -60Z" fill="#ffd36b"/></g><circle cx="0" cy="-78" r="22" fill="#ffb347" opacity=".18"/></g>`;
    case 'pines': return `<g><g transform="translate(-26 0)"><rect x="-4" y="-18" width="8" height="20" fill="#6b5436"/><path d="M0 -92 l22 40 h-12 l18 30 h-56 l18 -30 h-12z" fill="#2f7d4f"/></g><g transform="translate(22 6) scale(.78)"><rect x="-4" y="-18" width="8" height="20" fill="#6b5436"/><path d="M0 -92 l22 40 h-12 l18 30 h-56 l18 -30 h-12z" fill="#3b8f5e"/></g></g>`;
    case 'campfire': return `<g><path d="M-26 0 L26 -8 M-24 -8 L24 0" stroke="#7a5a36" stroke-width="9" stroke-linecap="round"/><g class="flame"><path d="M0 -8 C-16 -22 -8 -38 0 -58 C8 -38 18 -24 0 -8Z" fill="#ff8a3d"/><path d="M0 -10 C-8 -20 -4 -30 0 -40 C5 -30 9 -20 0 -10Z" fill="#ffd36b"/></g></g>`;
    case 'jetty': return `<g><rect x="-60" y="-8" width="120" height="12" rx="3" fill="#a07a48"/><g fill="#7a5a36"><rect x="-54" y="4" width="6" height="26"/><rect x="-14" y="4" width="6" height="26"/><rect x="30" y="4" width="6" height="26"/></g><path d="M30 14 q8 -18 16 -14 q30 22 70 0 q8 -4 16 14 q-50 24 -102 0z" fill="#8d5a2b" stroke="#4a3020" stroke-width="2"/><path d="M30 14 q-4 -22 10 -26" stroke="#8d5a2b" stroke-width="5" fill="none" stroke-linecap="round"/><rect x="80" y="-34" width="4" height="36" fill="#4a3020"/><path d="M84 -32 h34 v28 h-34z" fill="#e8dcc0" stroke="#4a3020" stroke-width="2"/><path d="M84 -32 h11 v28 h-11z M106 -32 h12 v28 h-12z" fill="#c8451a"/></g>`;
    case 'tower': return `<g><rect x="-22" y="-110" width="44" height="112" fill="#8a7458"/><rect x="-28" y="-124" width="56" height="18" fill="#6b5436"/><path d="M-34 -124 l34 -30 l34 30z" fill="#b5533a"/><rect x="-7" y="-92" width="14" height="22" rx="7" fill="#2b3a44"/><rect x="-7" y="-50" width="14" height="50" rx="4" fill="#5b4730"/></g>`;
  }
  return '';
}
function spriteURL(name){ try{ return (typeof SPR!=='undefined'&&SPR[name]&&SPR[name].toDataURL)?SPR[name].toDataURL():''; }catch(e){return '';} }
function catalogIcon(kind,it){
  if(kind==='treats') return `<svg viewBox="0 0 24 24" style="color:${it.col}">${ICONS[it.icon]}</svg>`;
  if(kind==='decor'&&it.spr){ const u=spriteURL(it.id); return u?`<img src="${u}" alt="" style="width:100%;height:84px;object-fit:contain">`:''; }
  if(kind==='decor') return `<svg viewBox="-70 -170 160 200" ><g>${decorArt(it.id)}</g></svg>`;
  if(kind==='build'){ const u=spriteURL(it.id); return u?`<img src="${u}" alt="" style="width:100%;height:84px;object-fit:contain">`:`<svg viewBox="0 0 24 24" style="color:#8a5f36">${ICONS.home}</svg>`; }
  const mock=dragonSVG({body:'#2a9d8f',wing:'#8e5bb5',eyes:'#2f6fd0',horn:'none',pattern:'none',tail:'club',name:''},{wear:{[it.slot||'neck']:it.id},mood:'happy',stage:2});
  const vb={head:'50 0 140 130',neck:'40 60 160 150',body:'40 70 160 150',tail:'120 60 120 150'}[it.slot||'neck'];
  return mock.replace('viewBox="0 0 240 230"','viewBox="'+vb+'"');
}

/* ---- island scene ---- */
const DECOR_POS={tower:[170,300,1],pines:[780,328,1],banner:[690,330,1],lantern:[285,356,1],campfire:[610,396,1],jetty:[820,456,1]};
function sceneSVG(o){
  const d=o.dragon, owned=o.owned||[];
  const dragonX=o.hatched?345:400, dragonY=o.hatched?172:236;
  const pine=(x,y,k,c)=>`<g transform="translate(${x} ${y}) scale(${k})"><rect x="-3" y="-10" width="6" height="14" fill="#4a3624"/><path d="M0 -84 l16 30 h-9 l14 24 h-12 l16 26 h-50 l16 -26 h-12 l14 -24 h-9z" fill="${c}"/></g>`;
  let s=`<svg class="scene" viewBox="0 0 960 560" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Your island">
  <defs>
   <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sky1)"/><stop offset="1" stop-color="var(--sky2)"/></linearGradient>
   <linearGradient id="sea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--sea1)"/><stop offset="1" stop-color="var(--sea2)"/></linearGradient>
   <linearGradient id="cliff" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--rock)"/><stop offset="1" stop-color="var(--rock2)"/></linearGradient>
  </defs>
  <rect width="960" height="560" fill="url(#sky)"/>
  <g opacity="var(--star-op)" fill="#fff"><circle cx="90" cy="60" r="2"/><circle cx="230" cy="110" r="1.6"/><circle cx="420" cy="48" r="2"/><circle cx="560" cy="96" r="1.5"/><circle cx="760" cy="52" r="2"/><circle cx="880" cy="120" r="1.8"/><circle cx="660" cy="150" r="1.4"/></g>
  <g opacity="var(--sun-op)"><circle cx="760" cy="190" r="54" fill="#ffe3a0"/><circle cx="760" cy="190" r="92" fill="#ffd27a" opacity=".28"/></g>
  <g opacity="var(--moon-op)"><circle cx="800" cy="104" r="40" fill="#f4f1d8"/><circle cx="786" cy="94" r="8" fill="#dcd8b8"/><circle cx="814" cy="116" r="5" fill="#dcd8b8"/></g>
  <g class="cloud" fill="var(--cloud)" opacity=".85"><ellipse cx="150" cy="96" rx="96" ry="18"/><ellipse cx="220" cy="84" rx="56" ry="16"/><ellipse cx="90" cy="108" rx="52" ry="12"/></g>
  <g class="cloud c2" fill="var(--cloud)" opacity=".7"><ellipse cx="580" cy="60" rx="90" ry="14"/><ellipse cx="640" cy="50" rx="46" ry="14"/></g>
  <g style="opacity:calc(var(--sun-op)*.22)" fill="#fff3c4"><path d="M760 190 L470 560 L600 560Z"/><path d="M760 190 L300 560 L400 560Z"/><path d="M760 190 L880 560 L960 560Z"/></g>
  <g fill="#2a2630" opacity=".5"><g transform="translate(560 128) scale(.5)"><path d="M0 0 C-8 -10 -22 -12 -34 -6 C-26 -4 -22 2 -20 8 C-14 2 -8 2 0 6 C8 2 14 2 20 8 C22 2 26 -4 34 -6 C22 -12 8 -10 0 0Z"/><path d="M0 2 q4 10 -2 22 q8 -8 6 -22z"/></g><g transform="translate(630 96) scale(.34)"><path d="M0 0 C-8 -10 -22 -12 -34 -6 C-26 -4 -22 2 -20 8 C-14 2 -8 2 0 6 C8 2 14 2 20 8 C22 2 26 -4 34 -6 C22 -12 8 -10 0 0Z"/></g><g transform="translate(486 90) scale(.28)"><path d="M0 0 C-8 -10 -22 -12 -34 -6 C-26 -4 -22 2 -20 8 C-14 2 -8 2 0 6 C8 2 14 2 20 8 C22 2 26 -4 34 -6 C22 -12 8 -10 0 0Z"/></g></g>
  <path d="M0 318 L70 250 L130 286 L210 214 L290 292 L370 246 L470 304 L560 236 L650 300 L740 222 L830 290 L900 244 L960 296 V340 H0Z" fill="var(--rock)" opacity=".5"/>
  <path d="M0 330 L90 276 L170 318 L260 262 L350 326 L440 290 L540 330 L640 274 L740 326 L840 284 L960 330 V350 H0Z" fill="var(--rock2)" opacity=".55"/>
  <rect y="316" width="960" height="244" fill="url(#sea)"/>
  <rect y="316" width="960" height="40" fill="var(--mist)" opacity=".22"/>
  <g fill="url(#cliff)" stroke="var(--rock2)" stroke-width="2"><path d="M14 346 L28 250 Q34 196 66 190 Q104 188 112 246 L126 346Z"/><path d="M262 340 L276 262 Q282 232 302 228 Q324 230 330 262 L346 340Z"/><path d="M846 346 L858 262 Q864 214 892 210 Q924 212 930 262 L944 346Z"/></g>
  <g fill="var(--grass2)"><path d="M62 194 Q88 180 108 198 Q92 204 62 194Z"/><path d="M290 232 Q304 224 322 234 Q306 240 290 232Z"/><path d="M886 214 Q906 204 926 218 Q906 224 886 214Z"/></g>
  <g fill="#2d5a3b"><path d="M80 190 l8 -28 l8 28z M92 192 l6 -22 l6 22z M906 214 l8 -30 l8 30z"/></g>
  <path d="M104 214 Q196 250 296 238" stroke="#4a3624" stroke-width="3.5" fill="none" stroke-linecap="round"/><path d="M104 224 Q196 262 296 246" stroke="#4a3624" stroke-width="2" fill="none" stroke-dasharray="4 5"/>
  <g stroke="#4a3624" stroke-width="2"><path d="M130 232 v-10 M160 245 v-12 M190 251 v-12 M222 250 v-12 M254 246 v-12"/></g>
  <path d="M866 228 q4 30 -2 70" stroke="#fff" stroke-width="5" fill="none" opacity=".6" stroke-linecap="round"/>
  <g class="ship" transform="translate(700 338) scale(.55)"><path d="M-60 0 q8 -22 18 -16 q40 26 84 0 q10 -6 18 16 q-60 28 -120 0z" fill="#8d5a2b" stroke="#3a2415" stroke-width="3"/><path d="M-60 0 q-6 -26 8 -32" stroke="#8d5a2b" stroke-width="7" fill="none" stroke-linecap="round"/><rect x="-2" y="-62" width="5" height="62" fill="#3a2415"/><path d="M3 -58 h44 v40 h-44z" fill="#efe3c4" stroke="#3a2415" stroke-width="3"/><path d="M3 -58 h14 v40 h-14z M31 -58 h16 v40 h-16z" fill="#c8451a"/></g>
  <g class="waves" opacity=".45" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M-80 360 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"/><path d="M-60 500 q20 -10 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0"/></g>
  <g transform="translate(0 -58)">
  <path d="M50 530 Q40 440 120 396 Q150 372 230 368 Q330 350 480 354 Q640 350 740 368 Q820 376 850 398 Q930 442 920 530 Z" fill="url(#cliff)"/>
  <g stroke="var(--rock2)" stroke-width="3" fill="none" opacity=".7" stroke-linecap="round"><path d="M84 470 q60 -14 130 -6"/><path d="M700 480 q80 -16 170 -4"/><path d="M150 500 q80 -10 150 0"/><path d="M560 500 q90 -12 190 2"/></g>
  <path d="M90 470 Q130 392 250 372 Q380 348 480 352 Q620 348 730 370 Q850 388 880 470 Z" fill="var(--grass2)"/>
  <path d="M112 442 Q170 392 280 378 Q390 358 480 362 Q610 358 720 378 Q830 394 860 442 Q700 424 480 428 Q260 424 112 442Z" fill="var(--grass)"/>
  <ellipse cx="480" cy="446" rx="400" ry="20" fill="var(--sand)" opacity=".4"/>
  <path d="M140 440 q40 -10 80 0" stroke="var(--sand)" stroke-width="10" fill="none" opacity=".4" stroke-linecap="round"/>`;
  /* pines at the back */
  s+=pine(110,420,.7,'#2d5a3b')+pine(140,412,.55,'#3a6d46')+pine(850,424,.7,'#2d5a3b')+pine(825,414,.5,'#3a6d46');
  /* longhouse with turf roof and carved gable beams */
  s+=`<g transform="translate(170 394)">
    <rect x="-60" y="-50" width="120" height="50" fill="#9c7447"/>
    <g stroke="#6a4a28" stroke-width="2" opacity=".7"><path d="M-60 -38 h120 M-60 -26 h120 M-60 -14 h120"/></g>
    <path d="M-72 -46 Q-66 -92 0 -100 Q66 -92 72 -46 Q0 -64 -72 -46Z" fill="#5d8a45"/>
    <path d="M-72 -46 Q0 -64 72 -46" stroke="#3d6030" stroke-width="3" fill="none"/>
    <g fill="#4f7a3a"><path d="M-40 -72 l4 -9 l4 9z M-6 -88 l4 -9 l4 9z M30 -76 l4 -9 l4 9z"/></g>
    <path d="M-2 -100 q-14 -16 -28 -10 M2 -100 q14 -16 28 -10" stroke="#5a3d1f" stroke-width="5" fill="none" stroke-linecap="round"/>
    <circle cx="-30" cy="-110" r="4" fill="#5a3d1f"/><circle cx="30" cy="-110" r="4" fill="#5a3d1f"/>
    <path d="M-14 0 v-30 a14 14 0 0 1 28 0 v30z" fill="#3b2a1a"/>
    <circle cx="-38" cy="-28" r="9" fill="#d9531e" stroke="#4a3624" stroke-width="2"/><circle cx="-38" cy="-28" r="3" fill="#4a3624"/>
    <circle cx="38" cy="-28" r="9" fill="#2f62b8" stroke="#4a3624" stroke-width="2"/><circle cx="38" cy="-28" r="3" fill="#4a3624"/>
    <circle cx="0" cy="-44" r="6" fill="#ffd36b" opacity=".9"/>
  </g>`;
  /* palisade fence with torches */
  s+=`<g fill="#7a5a36" stroke="#4a3624" stroke-width="1.5"><path d="M240 418 l0 -26 l7 -8 l7 8 l0 26z M258 418 l0 -26 l7 -8 l7 8 l0 26z M276 418 l0 -26 l7 -8 l7 8 l0 26z"/><path d="M652 424 l0 -26 l7 -8 l7 8 l0 26z M670 424 l0 -26 l7 -8 l7 8 l0 26z M688 424 l0 -26 l7 -8 l7 8 l0 26z"/></g>`;
  for(const id of owned){ const p=DECOR_POS[id]; if(p&&id!=='tower') s+=`<g transform="translate(${p[0]} ${p[1]}) scale(${p[2]})">${decorArt(id)}</g>`; }
  if(owned.includes('tower')){const p=DECOR_POS.tower; s+=`<g transform="translate(${p[0]+48} ${p[1]+86}) scale(.62)">${decorArt('tower')}</g>`;}
  /* stone nest + egg or dragon */
  if(!o.hatched){
    s+=`<g transform="translate(400 330)"><ellipse cx="80" cy="152" rx="92" ry="24" fill="#6b5a44"/><g fill="#8b8a82" stroke="#5b5a54" stroke-width="2"><ellipse cx="-4" cy="148" rx="16" ry="10"/><ellipse cx="22" cy="164" rx="14" ry="9"/><ellipse cx="62" cy="172" rx="16" ry="9"/><ellipse cx="102" cy="172" rx="16" ry="9"/><ellipse cx="140" cy="164" rx="14" ry="9"/><ellipse cx="164" cy="148" rx="16" ry="10"/></g><path d="M0 142 q80 34 160 0" stroke="#c9a96a" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
    s+=`<g class="hit" data-act="pet" transform="translate(402 306) scale(1.28)"><g class="dragon-bob">${eggSVG(d,{bare:true,wiggle:false})}</g></g>`;
  }else{
    s+=`<g transform="translate(400 330)"><ellipse cx="46" cy="132" rx="84" ry="20" fill="#6b5a44" opacity=".8"/><g fill="#8b8a82" stroke="#5b5a54" stroke-width="2"><ellipse cx="-24" cy="134" rx="15" ry="9"/><ellipse cx="116" cy="136" rx="15" ry="9"/><ellipse cx="-4" cy="150" rx="13" ry="8"/><ellipse cx="96" cy="152" rx="13" ry="8"/></g></g>`;
    s+=`<g class="hit" data-act="pet" transform="translate(${dragonX-60} ${dragonY}) scale(1.62)"><g class="dragon-bob">${dragonSVG(d,{bare:true,mood:o.mood,stage:o.stage,wear:o.wear,uid:'home'})}</g></g>`;
  }
  s+=`<g class="sparks" fill="#ffb347"><circle class="spark" cx="560" cy="420" r="3" style="animation-delay:0s"/><circle class="spark" cx="590" cy="430" r="2.4" style="animation-delay:1.3s"/><circle class="spark" cx="520" cy="436" r="2.6" style="animation-delay:2.6s"/><circle class="spark" cx="640" cy="426" r="2.2" style="animation-delay:3.4s"/><circle class="spark" cx="300" cy="430" r="2.6" style="animation-delay:.8s"/></g>`;
  s+=`<g fill="var(--grass2)"><path d="M120 452 l6 -16 l5 16z M300 438 l5 -14 l5 14z M690 446 l6 -16 l6 16z M820 450 l5 -14 l5 14z"/></g></g></svg>`;
  return s;
}
