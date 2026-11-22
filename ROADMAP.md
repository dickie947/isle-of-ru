# Isle of Ru: weekly update plan

Eight weekly updates from 23 October 2026. Each has one new mini-game for after the daily practice, a batch of content, and small fixes. Everything due up to the date ships when Richard says "do the weekly update", after tests pass.

| Update | Friday | Mini-game | Also in this update |
| --- | --- | --- | --- |
| 1 | 30 Oct (live 24 Oct; 1.1 hotfix (hide and seek board) built 24 Oct) | Hide and seek: Millie or a baby dragon hides each day, number clues. Halloween-themed | "Are you sure?" on every ember purchase; extra-practice cap 30 to 90; real hen names (Skullcrusher, Hookfang, Channel, Floppsie) and a fourth hen; check other screens for unreadable buttons; autumn and Halloween items |
| 2 | 6 Nov | Treasure map digging: grid clues | Daily play allowance (25 min) and pass-the-iPad screen; two-key family chest; hide and seek flag tap fix; dad jokes rewrite (31 jokes); music variation step 1; Drop 2 maths begins (first batch) with spaced repetition for each new question type |
| 3 | 14 Nov (split agreed 14 Nov; built 14 Nov, version 2.1.0) | Fishing at the jetty | Dragon fishing trips; weekly shared build framework with the lighthouse as week 1; more Drop 2 maths (batch 2); small uses for the text-only items (tower, fountain, statue, campfire, dragon torch, banner); Viking helmets for Millie and the hens |
| 3b | 21 Nov (built 21 Nov, version 2.2.0; the 20 Nov slot was missed) | (none) | Gift swaps; calm check-up mode and weekly parents' summary (Grown-ups, This week tab); shared build longship repairs (project 2, starts 23 Nov). |
| 4 | 28 Nov | Garden and farm | Drop 2 island and number-door puzzle; island residents (Snowcap Isle, with Daddy, Uncle Andy and Crumpet) |
| 5 | 5 Dec | Dragon races | Drop 2 finished; eggs and new dragon species; orders board and two-good storehouse (resource management step 1); first island residents |
| 6 | 12 Dec | Island shopkeeper | Drop 3 begins; time strand starts (rungs 1 and 2) |
| 7 | 19 Dec | Build-a-den challenge | Drop 3 maths (more word problems) |
| 8 | 26 Dec | Sibling riddles | Drop 3 finished; New Year content |

## Rules
- Calm: no timers, no losing, wrong answers never cost embers.
- Mini-games start only after the daily practice is done.
- Original art only.
- About 500 embers of new things to buy per update; always something cheap (20 to 40), something for a week (100 to 150) and a big goal (250 to 300).

## Dragon fishing trips (Update 3)
A trained dragon is sent from the jetty and comes back the next real day with 3 to 8 fish. The children count them and answer a question or two to sell them (2 or 3 embers each). A forgotten day costs nothing. Skill costs about 100 embers and 4 practice days.

## Play allowance, pass-the-iPad and sibling co-operation (Update 2, 6 Nov; gift swaps Update 3)
Problem: the children fight over whose turn it is on the shared iPad.
- Design rules for anything co-operative: reward showing up, never accuracy; never show a comparison or who held things up; nothing is ever lost or reset if a sibling is ill or away. Ruan freezes under pressure, so no visible countdown and no pressure from a sibling depending on him.
- Daily play allowance per child, set by a grown-up in Settings (default 25 minutes, agreed 31 Oct). Counts active play only. A quiet moon or sun arc, no numbers. The dragon yawns about 3 minutes before the end. The current puzzle always finishes first. Soft ending (Richard, 31 Oct): no sudden lock or "time's up". Over the last 5 minutes the island slowly turns to sunset: the light warms and dims, lanterns light, the music softens and slows, the dragon yawns around 3 minutes out and curls up at the end. Final message: "[dragon name] is getting sleepy now, time for bed. See you again tomorrow!" The current puzzle always finishes first, and daily practice is never cut off mid-session. Reopening later the same day shows the dragon fast asleep. Text boxes stay fully readable through the sunset. Grown-up code can add time.
- Pass-the-iPad screen when a child's time ends: "Time for [name]'s turn", with a switch button. Remember who went first today and swap each day.
- Two-key family chest: each child's finished practice turns one key, shown on the pass-the-iPad screen. If one child does not play, the chest still opens at bedtime with a small base reward. Both playing adds a bonus (embers/gems). Rewards effort only.
- Gift swaps (moved to Update 3 on 31 Oct, with the shared build, so the sibling save access is built and tested once): each child can leave one free gift a day (a decoration or a treat) with a one-line message for the other's dragon. Needs the game to write to the other child's save slot; test carefully that neither save is damaged.
- STATUS 6 Nov: Update 2 built and tested, waiting for Richard's Go. Chest note: the family record is a small shared record on the device, so no save reads another save. First Drop 2 batch = four skills (adding tens, taking away tens, tens-and-ones plus ones, tens-and-ones take away ones) with a new Blocks tool and the usual spaced repetition. Treasure map = 5x5 dig game from the games board on the Village Green after practice.
- Scope decided 31 Oct: Update 2 = allowance, pass-the-iPad, chest, flag fix, music step 1, treasure map, first Drop 2 maths with spaced repetition. Moved to Update 3: gift swaps, weekly shared build, check-up mode and parents' summary (Update 4 if Update 3 is heavy). The chest needs read access to the other child's save to know they finished.

## Weekly shared build (framework built in Update 3, 14 Nov; runs to the end of February 2027)
STATUS 14 Nov: framework and project 1 (lighthouse) built. How it works as built: each child's finished practice adds 5 bricks once per day; the lighthouse needs 40 bricks (4 stages, shown on the east coast of the home island; the plot appears at once, the finished building lights up at night). It finishes when full, not on Sunday, and the finishing child gets 30 embers at once while the other child gets 30 the next time their game opens. Progress lives in the shared family record (not in either save). The lighthouse has a daily use: turn the lamp for 2 embers. Because the lighthouse started on release day (14 Nov) instead of 16 Nov, later projects should be added one at a time as their art is made: the project list is data-driven (PROJECTS in allow.js). Project 2 (longship repairs) is built in Update 3b (2.2.0): it appears on the beach in the south-east of the home island, starts 23 Nov (once the lighthouse is finished), 40 pieces in 4 stages, daily use: a short sail for 2 embers.
The two children build one island project together each week. Every day's practice adds bricks from each child. A single progress bar shows the total, never who added more. The finished project unlocks on Sunday as a shared item, then the next project starts. Missed days cost nothing, and a late build can still finish the following week. Rewards effort, not accuracy.
Planned content, 15 weekly projects so it runs without new work until the end of February:
1. Lighthouse (w/c 16 Nov)
2. Longship repairs (23 Nov)
3. Windmill (30 Nov)
4. Midwinter market stall (7 Dec)
5. Yule feast hall (14 Dec)
6. Christmas lights and tree (21 Dec)
7. New Year bonfire (28 Dec)
8. Snow slide (4 Jan)
9. Observatory (11 Jan)
10. Dragon treehouse (18 Jan)
11. Stone bridge (25 Jan)
12. Orchard and beehives (1 Feb)
13. Fishing pier (8 Feb)
14. Great hall (15 Feb)
15. Dragon festival stage (22 Feb)
Each project has 3 to 4 visible stages as it fills, original art for every stage, and a shared reward. Check that the Update 3 workload (fishing, trips, Drop 2 maths) is realistic alongside this; the build framework can ship in Update 3 with the first 3 projects and the rest follow in later updates.

## Maths plan: Drops 2 and 3 (moved here from the original 12-week plan on 1 Nov, so this file is the single source)
A week means 7 practice days, not calendar days, so a missed day never makes anyone miss content. Weeks 1 to 4 (practice days 0 to 27, Drop 1) are built: add and subtract to 20, make ten, fact families, doubles and halves. The update dates above say when content is built; the children reach it by practice days, so content is built ahead of them. Moving on assumes about 70% of a skill is steady; if a child goes slower, a week just takes longer. Fluency and engagement, not an exam syllabus.

| Week (practice days) | Skill focus | Example | Villager (on practice day) and quest maths |
| --- | --- | --- | --- |
| 5 (28-34) | Add and take away multiples of ten; 2-digit plus a ones digit | 30 + 20, 34 + 5 | Bjorn the diver (28): tens and ones. Solveig the shepherd (31): counting in tens |
| 6 (35-41) | 2-digit plus 2-digit without regrouping; counting in 2s, 5s, 10s | 23 + 14; 5, 10, 15 | Ivar the smith's apprentice (35): doubling. Dagny the beekeeper (38): times 5 |
| 7 (42-48) | Times tables 2, 5, 10, then 3 and 4, using arrays | 3 x 4 as three rows of four | Gunnar the postman (42): two-step routes. Estrid the potter (45): arrays |
| 8 (49-55) | Mixed times tables; sharing as division | 12 / 3 = 4 | Halvard the sailor (49): length in centimetres. Runa the weaver (52): number patterns |
| 9 (56-62) | Halves, quarters, thirds of shapes and numbers | Half of 14, a quarter of 8 | Torben the miller (56): times 4, sharing sacks. Liv the healer (59): halves and quarters |
| 10 (63-69) | Word problems: two-step, money, length, weight | 3 bags of 4 gems, then 5 lost | Knut the lighthouse keeper (63): time, o'clock and half past. Maren the singer (66): times 3 |
| 11 (70-76) | 2-digit plus a ones digit across ten; rounding to the nearest ten; number patterns | 47 + 8; 63 is nearest to 60 | Eirik the shipwright (70): plank lengths, adding sides. Sunniva the gardener (73): fractions of a garden |
| 12 (77-83) | Review and fluency check, spaced out | A mix of all earlier skills | Oskar the stargazer (77): number patterns to 100. Thora the storyteller (80): mixed word problems, opens the festival |

Islands, dragons, skills and shop items for Drops 2 and 3 are still in the frozen Claude Docs copy of the old plan until we move them here.

### What the time strand needs from Drops 2 and 3
Each rung opens only when the child has reached the practice day AND the listed skills are secure.

| Time rung | Needs first | Where it is in the plan | Earliest practice day |
| --- | --- | --- | --- |
| 1 My day | Nothing new | Any time | Any time |
| 2 Hour hand, o'clock | Reading and counting to 12 | Already known from Drop 1 | Any time |
| 3 Half past, quarter past and to | Halves and quarters | Week 9 | about 60. Knut's quest (day 63) already covers o'clock and half past |
| 4 Five-minute reading | Counting in 5s, 5 times table | Weeks 6 and 7 | about 49 |
| 5 To the minute, am and pm, 24-hour | 2-digit numbers, tens and ones | Week 5 | about 56 |
| 6 How long (timeline) | Counting on in jumps across ten, and across the hour | Weeks 5, 6 and 11, plus a gap (see below) | about 77 |
| 7 Adding and subtracting times | Counting on in tens and ones | Weeks 5, 6 and 11 | about 84 |
| 8 Speed, distance, time | Times tables 2, 3, 4, 5, 10; sharing as division; two-step problems | Weeks 7, 8 and 10 | about 84 |

Gaps found: these need adding to the plan, because nothing in Drops 2 and 3 covers them.
- Pairs that make 60 (for example 35 to 60 is 25), in fives and tens. Needed for "bridge to the next hour". Add to week 11, or earlier.
- A number-line "hop" tool for adding and subtracting in tens then ones. Introduce it in weeks 5 and 6 for ordinary sums so it is already familiar when the clock timeline uses the same tool.
- Short, calm practice with days, months and ordering events (rung 1), lightly across weeks 5 and 6.
- Kilometres and units for speed (rung 8), introduced after centimetres in week 8 and money and length in week 10.
- Decision 1 Nov: keep the rungs in teaching order. Rung 4 (five-minute reading) could open earlier than rung 3 (about day 49 against day 60) but waits for rung 3.
- The plan after week 12 (about practice day 84, mid-January if played daily) is empty. Time rungs 4 to 8 become Drop 4, alongside fluency review. Richard is happy for the roadmap to run to March and beyond as long as it helps. Drop 4 to be planned from real progress data once the children reach week 10.

## Time strand: reading and using time (requested 1 Nov; starts Update 6, 4 Dec, continues into January)
Covers digital time, analogue clock reading, adding and subtracting times, and speed, distance and time. Built as a slow ladder from concrete to abstract for a child who finds abstract maths hard. Each rung opens only when the one before is secure (same secure-item rule as the number facts), so each child moves at their own pace, and the 7-year-old can stay on the early rungs.
1. My day: times of day and the order of events (morning, afternoon, night; before and after; days of the week; hours in a day). No clock reading yet.
2. The one-handed clock: hour hand only, o'clock, matched to digital (3:00). A clock tower on the Village Green that the children can set by dragging the hand.
3. Half past, quarter past and quarter to. Links to the fraction work (half, quarter).
4. The minute hand: counting round the clock in fives, then reading five-minute times, analogue to digital. Needs the 5 times table secure first.
5. Reading to the minute; am and pm; the 24-hour digital clock.
6. How long: counting on along a timeline in whole hours, then half hours, then minutes, using "bridge to the next hour" (the same idea as the make-ten bridge).
7. Adding and subtracting times: start time plus how long, end time minus start; draggable timeline; no converting between hours and minutes by calculation until the timeline is secure.
8. Speed, distance and time: concrete dragon flights ("Ember flies 10 km each hour"), first as repeated groups, then distance for whole hours, then "how long will it take". Only after the multiplication facts are secure.
Design rules for the strand:
- Same colours and shapes on every clock throughout (short hour hand, long minute hand), analogue and digital always shown side by side at first, never digital alone.
- A set-the-clock tool the children can use at any time, like the other helper tools. Never timed, so answers are never rushed.
- Use time inside the game, not just in questions: dragon fishing trips return at set times, shop opening times, the sunset ending, the clock tower.
- Roughly one rung every two weeks, so about 16 weeks from 4 Dec (to late March 2027). Spaced repetition for every new question type, as for the rest of the maths.
- Question formats: read the clock and pick the time; set the hands by dragging; match analogue and digital; timeline word problems.
- Dependencies on Drops 2 and 3 are mapped in the table in the maths plan section above, with the gaps found.

## Dad jokes rewrite (Update 2, agreed 1 Nov)
Many of the 27 jokes did not make sense to the children. Replace with these 31, the 6 that worked plus 25 new. The fire-ithmetic joke was dropped because the children do not know the word arithmetic. More jokes to be added every few updates. The seen-list resets once, which is harmless.
Kept: six afraid of seven (seven ate nine); the sad maths book (too many problems); the dragon's ladder to school (high school); dragons and hide and seek (smoke signals); Millie on the computer (keeping an eye on the mouse).
New, dragons and Vikings: why did the dragon eat a candle (a light snack); what music do dragons like (heavy metal); what time is it when a dragon sits on your fence (time to get a new fence); why are dragons bad at fishing (they keep cooking the bait); how do Vikings send secret messages (by Norse code); why do dragons never feel the cold (they carry their own central heating); why did the dragon get full marks in every test (it was on fire).
New, maths and time: what did zero say to eight (nice belt); why did the student wear glasses in maths (it improves di-vision); what did the calculator say (you can count on me); why was the clock hungry (it went back four seconds); why did the clock get told off (it kept tocking); what do you call a hen who counts her eggs (a mathema-chicken).
New, bakery, farm and bees: why did the baker work so hard (he kneaded the dough); a bee that cannot make up its mind (a maybe); why did the hen join the band (she had the drumsticks); why do eggs not tell jokes (they would crack each other up).
New, fish and snow: a fish with no eyes (a fsh); why are fish clever (they live in schools); a fish in a bow tie (sofishticated); a snowman in summer (a puddle); what do snowmen eat for breakfast (snowflakes).
New, Millie: breakfast (mice Krispies); favourite colour (purr-ple); a pile of kittens (a meow-ntain); favourite subject (hiss-tory).

## Island residents (NPCs on every island; requested 1 Nov)
Today the other islands have no villagers (the game clears them on arrival), so each island needs a small amount of new setup. Plan: one or two residents per island, tied to the island's theme, each with an intro, chat lines and a short quest whose maths matches the skills secure when the island opens. Examples: a penguin keeper on Snowcap Isle, a crab fisher on Sunstone Cove, a smith's lizard on Cinder Peak. Characters are cheap to draw with the existing look generator. Add one island's residents per update so no week gets heavy: Snowcap Isle in Update 4, then one more island per update. Each new island from Drop 2 and 3 (Mossy Hollow, Crystal Reef, Stormcrest, Aurora Isle) gets its resident when it is built.

### Family cast (requested 8 Nov)
Four recurring comedy characters who turn up on different islands over several updates, so each island visit can hold a small surprise. Write them with running gags that build up and never mean or scary for the children (the fears are played for laughs, never frightening). Use first names or nicknames only in the game, since the site is public.
| Character | Traits | Gag ideas |
|---|---|---|
| Daddy | Obsessed with tea. Steals and hides biscuits. Pretends to be serious but is really a comedy character. Irrationally scared of cows. | Hidden biscuits to find on the Village Green, with a "who hid it" clue. Tries to look serious while a biscuit crumb gives him away. Runs off if a cow appears. |
| Mummy | Struggles to open round door handles. Irrationally scared of deer. Obsessed with tiramisu and cheese. | Stuck at a round-handled door until the child "helps" (a shape puzzle). Hides from a deer in the grove. Orders of tiramisu and cheese for the bakery and the orders board. |
| Uncle Andy | Kind. Owns Crumpet and is obsessed with how cute Crumpet is. Irrationally scared of geese. Often conned into Crumpet's schemes. | Shows endless Crumpet photos. Flaps off if geese turn up. Gives Crumpet alibis without realising. |
| Crumpet | Small fluffy dog. Everyone thinks he is cute but he is a criminal mastermind. Cons Uncle Andy into covering for him and joining in. | A detective mini-game: Crumpet "borrows" something from the island and the child works out who did it from clues (counting, comparing, simple logic). The villagers always blame the wrong person. |
Rules: each character appears on at most one island per update to keep the weekly workload small; the first two (Daddy and Crumpet and Uncle Andy together) arrive in Update 4 with Snowcap Isle; Mummy arrives in Update 5. Each gets a short quest tied to the maths secure at that point, a chat line pool of about 6 lines that rotates, and a drawing in the existing look generator.
Decided 8 Nov: cows, deer and geese appear as animals on the islands, and the characters run away from them (cows for Daddy, deer for Mummy, geese for Uncle Andy). Millie reacts to Crumpet. Plan the animals as wandering ambient creatures that appear on one island each, ahead of the character who fears them, so the gag works the first time. Keep the reactions funny and never frightening.

## Resource management with simple maths (requested 1 Nov; long term)
Goal: bring word-style problems into a practical setting. Rules: nothing ever runs out, spoils or blocks the fun; wrong answers cost nothing; the daily part is short enough to sit inside the 25-minute allowance; quantities shown as pictures and counters, not paragraphs of text (reading is a second hurdle for Ruan); a "show me" button lays out the counters, and a hint comes after a couple of tries so the answer is not found by guessing.
Step 1, Update 5 (5 Dec): an orders board at the market. Each day it shows 3 orders as pictures with counters (for example 4 fish and 3 eggs). Check the storehouse, work out "have 9, need 14, how many more?", collect the rest, hand in for embers. A two-good storehouse (fish and eggs), using add and subtract to 20 only.
Later steps, matched to the maths plan:
- Dragon pantry: "Ember eats 2 fish a day, we have 12, how many days?" (division; Drop 2). The dragon never goes hungry.
- Bakery recipes that scale: doubling and times tables (Drop 2). The bakery already takes orders.
- Garden rows: arrays and equal groups (Drop 2), with the Update 4 garden.
- Dragon trips: "10 fish a trip, 25 fish, how many trips?" (division with remainder). Trip times and distances feed the time strand, rung 8.
- Feast planning: "12 guests, 3 per table; half want fish" (sharing and fractions; Drop 3).
Shared family storehouse (idea, to test small first): both children gather into one storehouse; the weekly shared build's materials come from completed orders; gift swaps can pass goods as well as decorations. Risk: ties several features together, so ship a small version first.

## Every item and building has a use (requested 7 Nov)
Rule: nothing the children buy or build should be text-only. Each item gets one calm interaction, with a payout of at most once a day per item, so tapping the same thing over and over cannot farm embers. Audit on 7 Nov: working already = school house, forge, stables, clothes shop, bakery, coop, dock and longship. Text only today = lookout tower, fountain, windmill, dragon statue, flower garden, campfire, dragon torch (the iron torch), banner, pines. Dress-up only = Halloween items, Millie and hen outfits (these get a small reaction).
| Item | Planned use | When |
|---|---|---|
| Lookout tower | Climb up, see the open islands, count the boats | Update 3 |
| Fountain | Toss in an ember and wish; a small daily surprise | Update 3 |
| Dragon statue | The dragon copies the pose and says its streak out loud | Update 3 |
| Campfire | Story time: a short Nordic tale or a joke | Update 3 |
| Dragon torch | Tap to light it; glows more as the sunset arrives | Update 3 |
| Banner | Choose its colours and emblem | Update 3 |
| Jetty | Fishing (see the fishing section) | Update 3 |
| Flower garden | Water it, then collect honey for the honey buns | Update 4 (garden and farm) |
| Windmill | Grind grain into flour for the bakery (resource management step 1) | Update 5 |
| Lighthouse (new building) | Light the beacon to guide boats in; opens the time strand with Knut the keeper | Update 6 (4 Dec) with the weekly shared build lighthouse |
Note: there is no lighthouse in the game yet. The only lighthouse on the plan is the weekly shared build for the week of 16 Nov, so check how it fits with the Update 6 time strand when we get there.

## Viking helmets for Millie and the hens (requested 7 Nov, Update 3)
Two new shop items beside the existing Millie and hen outfits: a mini Viking helmet for Millie and mini Viking helmets for the hens (horned, decided 7 Nov). Same wearing system as the collar, hat and bows, same price band (about 35 to 45 embers). Small reaction when worn, for example Millie looking very serious.

## Open items
- Real hen names: given, to be added in Update 1.
- Refunds or undo for accidental purchases: backlog.
- Hide and seek flags: tap area is too small, took many taps around the base of the flag to register. Fix in Update 2 (bigger hit area, ideally the whole flag and cloth). Check other small tap targets on the Village Green at the same time.
- Music: the same tune loops (confirmed by Richard). The game has one built-in piece (D Dorian, A and B sections), so a shuffle alone would not help. Step 1, in Update 2: make the existing piece vary each time round (alternating section order, different keys, small melody variations, changing instruments, a rest bar now and then), so no two passes sound the same. Step 2, later (placed when planning, likely Updates 3 to 5): new tunes, with different moods for the home island, the Village Green, the other isles and the practice screen. Keep it calm and quiet during practice.


## Update 3b status (21 Nov, version 2.2.0)
- Gift swaps built without writing into the other child's save: gifts pass through the shared family record and are claimed when the other child's game opens. One free gift a day (fish snack, honey bun or shiny shell, 3 embers each) with a kind one-line message picked from a short list; the giver gets 1 ember. Left from the family chest (appears once two players have practised).
- Check-up mode: started by a grown-up from Grown-ups > This week. About 8 mixed questions from facts already practised, no embers, no streak, never changes the practice boxes; the child sees only a thank-you.
- Parents' summary: Grown-ups > This week lists every player on the device: days practised in the last 7, what they are working on, facts secure, calm-start time, how hard moments went, and the latest check-up with any weak skills.
- Draw fix (2.1.1): one bad picture can no longer hide the character and objects.

## The story: "Crumpet and the Case of the Missing Warm Stones" (requested 22 Nov)
Agreed 22 Nov: ten chapters of cosy caper (Part 1), ending on a cliffhanger that opens an epic Nordic quest (Part 2). Exciting, a cliffhanger at the end of every chapter, child friendly, in the spirit of Cressida Cowell's dragon and wizard books (funny narrator, footnotes, wild Viking names, an underdog hero, dragons with attitude, friendship over fighting). Everything is original: no characters, places or lines from her books.

### Rules (so the story never adds pressure)
- A chapter opens after about every 4 practised days (tune after seeing the real pace), never faster than one a day. Wrong answers, slow answers and missed days never block or undo it.
- Each child reads their own copy and has a saved Clue Book. Clues either child finds are pinned to a shared Case Board in the family record, as with the builds and gifts. Three chapters (3, 6, 9) have a shared finale that needs a clue from each child.
- Maths in a quest comes from skills that child already has secure (a little stretch at most), with the counting blocks always available, unlimited tries, and hints that never cost anything. No timers, no "failed" screen.
- Reading: short pages (about 60 words), large text, and an optional read-aloud button using the iPad's built-in voice (to test on Safari first).
- Gentle peril only. Nobody is hurt, the villain can be won round, the fears of Daddy, Mummy and Uncle Andy stay funny.
- Each chapter = opening page (the narrator) + 2 or 3 quest steps using things already in the game (dig, hide and seek, fishing, shared builds, the islands) + a clue puzzle + a cliffhanger page.

### Voice and cast
- **Narrator: Old Knut the Unreliable**, who tells the tale from his Book of Tall Tales, keeps correcting himself in footnotes ("*There were NOT forty geese. There were four. Possibly five.*") and breaks off at the exciting bit.
- **The child** is the island's new Detective, with their dragon as sidekick. Knut's Rules of Detecting appear as short lists ("Rule 1: Never trust a dog wearing a tiny hat").
- **Existing cast**: Crumpet (prime suspect, criminal mastermind), Uncle Andy (gives alibis without noticing), Daddy (tea, biscuits, scared of cows), Mummy (tiramisu, cheese, scared of deer, round door handles), Millie, the four hens.
- **New**: Grimble the gull, a gossiping witness who gets every detail slightly wrong but always the last one right; Vorgrim the Frostwyrm, asleep under Snowcap Isle (seen only at the end of Part 1).
- Calling card at every crime: a tiny paw print, a bite-sized bow, and a warm, humming orange stone swapped in for what was taken.

### Part 1: ten chapters (the caper)
Secret behind it all: the "crimes" are Crumpet quietly collecting the six pieces of the **Ember Crown**, which were hidden around the islands long ago. He is not stealing for himself. He is keeping them safe from the Frostwyrm waking, and he needs kind Uncle Andy (and a boat) to do it.
| Ch | Title (working) | What happens | Quest uses | Cliffhanger |
|---|---|---|---|---|
| 1 | The Biscuit Tin Is Empty | Daddy's secret biscuit stash has vanished. Crumb trail, paw prints, a warm orange stone in the sand. | Hide-and-seek style clues, digging | The trail ends at the jetty, where a boat is missing and the lighthouse lamp has switched itself on, pointing at the sea. |
| 2 | Suspect Number One | Everyone blames cows, deer or geese. Uncle Andy swears Crumpet was in bed all night. Grimble the gull saw "a small furry thing in a hat". | Counting clues, comparing quantities | Uncle Andy's alibi photo shows Crumpet in bed, but the bed is a pillow wearing a tiny hat. |
| 3 | The Cheese Cellar Job (shared finale) | Mummy's tiramisu and cheese go next. One child finds the trail, the other the lock. Together they open the cellar. | Number-door puzzle, both children's clues | The cellar is empty except for a note: "Thank you for the cheese. Do not follow me." Signed with a paw print. |
| 4 | Following Footprints | The paw prints lead across the island to a place no one has looked before. | Digging, mapping, simple routes | A tunnel under the lighthouse, and from inside it, the sound of a very small dog humming a sea shanty. |
| 5 | The Secret Lair | Crumpet's lair: maps, a tiny desk, shelves of labelled stones. He is gone, but his plan is on the table. | Sorting and patterns | The map shows six stones. Four are crossed out. Two have a snowflake beside them. |
| 6 | The Longship Sails (shared finale) | The mended longship (shared build) is needed to chase him. Uncle Andy is "only coming to carry the picnic". | Longship build, fishing, number line voyage | Halfway across, fog rolls in and a lantern ahead goes out, one light at a time. |
| 7 | Snowcap Mystery | Snowcap Isle's penguin keeper has seen "a dog in a scarf". The stones are warm because something under the mountain is cold. | Island resident quest, counting in steps | Footprints in the snow stop at a door nobody built. |
| 8 | Crumpet Confesses (nearly) | Cornered at last. Crumpet makes his case: he is not the thief, he is the guard. Uncle Andy faints from the cuteness of it. | Logic clues, who-said-what | Crumpet whispers "It is already waking" and the ground hums. |
| 9 | Five Stones and a Problem (shared finale) | The children bring their clues together to find the sixth stone, hidden in plain sight in Daddy's tea caddy. | Both children's clues, a gentle two-step puzzle | Six stones join into a crown-shaped key and the sea turns white. |
| 10 | The Mountain Opens One Eye | The crown-key hums and Snowcap's mountain cracks. A huge, sleepy, icy-blue eye looks out. | A short celebration quest and a feast | The eye blinks, a voice booms "WHO HAS WOKEN ME?", and the book closes on the narrator's line: "To be continued. Probably. Knut needs a lie-down." |

### Part 2: the epic quest (outline only, to write after Part 1)
"The Ember Crown": Vorgrim the Frostwyrm is not a monster, only the loneliest dragon in the world, and the crown is what keeps the long winter away. The children, Crumpet (now a reluctant ally and still a mastermind) and Uncle Andy travel through the four other islands to learn the crown's three rules and win back its lost warmth. Plan: about 12 chapters, one island trial per two chapters (Sunstone Cove, Cinder Peak, the Village Green, Snowcap), each trial tied to the maths that island teaches. It ends with a feast on the home island. Villain won over by friendship, not defeated.

### Delivery plan and effort (decide at the next weekly update)
- Framework (Story book screen, Clue Book, Case Board, chapter unlock rule, read-aloud test): one update.
- Writing and quests: about 2 or 3 chapters per update. Chapters 1 to 3 first, so the first shared finale (ch 3) lands early.
- Update 4 (28 Nov) is already heavy (garden and farm, Snowcap Isle, residents). Options for the story's start: (a) framework plus chapters 1 and 2 in Update 4 and push garden and farm back a week; (b) keep Update 4 as is and start the story in Update 5. Richard to choose.

## Story status (22 Nov, version 2.3.0, special update)
- Built: the Story button (bottom right of the island, pulses until first opened), Old Knut's Book of Tall Tales, the Clue Book, and Chapter 1 "The Biscuit Tin Is Empty" (opens straight away). Chapter 1 is a trail of four spots on the home island (empty tin, crumb trail, paw prints, warm stone), each marked by a bouncing "!" when it is next. Three small clue puzzles (add, subtract, number pattern) pitched by how much the child has practised, multiple choice with counters, unlimited tries, no penalty. Finishing gives 4 clues in the Clue Book and 6 embers, then the cliffhanger.
- Story progress is saved per child (own save slot). Chapter 2 opens after 4 more practised days once it is written; not yet built.
- Not yet built: shared Case Board (first needed for chapter 3), read-aloud button, chapters 2 onwards.
- Update 4 (28 Nov) keeps its scope (garden and farm, Snowcap Isle, residents) and adds Chapter 2.
