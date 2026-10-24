import re,os,shutil,json
from PIL import Image,ImageDraw,ImageFont
os.system('python3 /home/claude/emberisle/build.py >/dev/null')
s=open('/home/claude/emberisle/test.html').read()
s=s.replace(':root{color-scheme:light}','',1)
head=('<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#1f4f55">'
 '<meta name="apple-mobile-web-app-capable" content="yes"><meta name="mobile-web-app-capable" content="yes"><meta name="apple-mobile-web-app-title" content="Isle of Ru">'
 '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">'
 '<link rel="manifest" href="manifest.webmanifest"><link rel="apple-touch-icon" href="apple-touch-icon.png"><link rel="icon" href="icon-192.png">')
s=re.sub(r'<meta name="viewport"[^>]*>',head,s,1)
out='/home/claude/emberisle/release'
shutil.rmtree(out,ignore_errors=True);os.makedirs(out)
open(out+'/index.html','w').write(s)
open(out+'/.nojekyll','w').write('')
json.dump({"name":"Isle of Ru","short_name":"Isle of Ru","start_url":"./","scope":"./","display":"standalone","background_color":"#14303a","theme_color":"#1f4f55",
 "icons":[{"src":"icon-192.png","sizes":"192x192","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png"},{"src":"icon-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}]},open(out+'/manifest.webmanifest','w'),indent=1)
def icon(n):
    im=Image.new('RGB',(n,n));d=ImageDraw.Draw(im)
    for y in range(n):
        t=y/n;d.line([(0,y),(n,y)],fill=(int(20+190*t*t),int(48+90*t),int(58+20*t)))
    # simple dragon-egg shape and title
    cx,cy=n//2,int(n*.52);rx,ry=int(n*.2),int(n*.27)
    d.ellipse([cx-rx,cy-ry,cx+rx,cy+ry],fill=(42,157,143),outline=(255,233,184),width=max(2,n//64))
    for k,(dx,dy) in enumerate([(-.08,-.08),(.06,-.02),(-.02,.1),(.09,.12)]):
        r=int(n*.035);d.ellipse([cx+int(dx*n)-r,cy+int(dy*n)-r,cx+int(dx*n)+r,cy+int(dy*n)+r],fill=(30,120,112))
    try: f=ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf',int(n*.17))
    except: f=ImageFont.load_default()
    t='Ru';w=d.textlength(t,font=f);d.text(((n-w)/2,int(n*.06)),t,font=f,fill=(255,233,184))
    return im
icon(512).save(out+'/icon-512.png');icon(192).save(out+'/icon-192.png');icon(180).save(out+'/apple-touch-icon.png')
open(out+'/README.md','w').write('''# Isle of Ru

A calm maths adventure for children. Single page, no server, no accounts. Progress is saved in the browser on each device.

## Put it online with GitHub Pages
1. On github.com create a new repository (for example `isle-of-ru`). Public is simplest; Pages on private repos needs a paid plan.
2. Click "Add file" then "Upload files" and drag in everything in this folder: `index.html`, `manifest.webmanifest`, the three `.png` icons, `.nojekyll`, and this `README.md`.
3. Commit the upload.
4. Go to Settings, then Pages. Under "Build and deployment" choose "Deploy from a branch", branch `main`, folder `/ (root)`. Save.
5. After a minute the game is at `https://YOUR-USERNAME.github.io/isle-of-ru/`.

## On the iPad
Open the link in Safari, tap Share, then "Add to Home Screen". This matters: Safari can delete a website's saved progress after about a week of not using it, but a Home Screen app is not treated that way.

## Moving progress between devices
Progress is not shared automatically. Open the lock button (grown-ups), choose the Settings tab, and tap "Copy save code". On the other device open grown-ups, Settings, paste into "Restore from code" and tap the button. Do this every few weeks as a backup too.

## Updating the game
Replace `index.html` in the repository with the new version. Saves are versioned and are upgraded automatically, so progress is kept, as long as the address stays the same. A new address means a fresh start, because saves live under the address.
''')
print(len(s),os.listdir(out))
