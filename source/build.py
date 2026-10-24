import re,sys
d='/home/claude/emberisle/src/'
head=open(d+'head.html').read()
rd=lambda f:open(d+f).read()+'\n'
vil='const Village=(function(){\n'+''.join(rd(f) for f in ['v_world.js','v_sprites.js','v_sprites2.js','v_isles.js','v_green.js','v_chars.js','village.js'])+'\n})();\n'
js=''.join(rd(f) for f in ['art.js','audio.js','core.js','tools.js','session.js','content.js'])+vil+rd('main.js')
body='<div id="app"></div>\n<div id="overlay"></div>\n'
frag=head+body+'<script>\n(function(){\n\'use strict\';\n'+js+'\n})();\n</script>\n'
open('/home/claude/emberisle/app.html','w').write(frag)
# test wrapper: full document
title=re.search(r'<title>.*?</title>',head).group(0)
full='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>:root{color-scheme:light}body{margin:0}[hidden]{display:none!important}</style></head><body>'+frag+'</body></html>'
open('/home/claude/emberisle/test.html','w').write(full)
print(len(frag),'bytes')
