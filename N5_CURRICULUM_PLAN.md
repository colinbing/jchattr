# N5 Curriculum Plan

## Purpose

This document originally operationalized Phase 3 of Japanese OS.

The roadmap already says "content expansion," but that phrase is too vague on its own.
This file defines what "N5-comprehensive" should mean in this repo, how we get there without curriculum drift, how future content should be batched, and how local QA should keep the expansion honest.

Phase 3 content expansion and the post-claim-gap remediation work are now complete. This document should therefore be read as:

- the historical curriculum plan that got the repo to the current N5-scale content set
- the durable curriculum-quality standard for any future content work
- a set of historical prompt templates that should not be treated as the active implementation queue unless a new content expansion decision is made

For current repo totals and active product direction, use `BUILD_STATUS.md` as the source of truth.

This plan is intentionally:

- grammar-first
- practical rather than test-crammed
- mobile-session friendly
- local-first and schema-driven
- strict about progression, reuse, and review

It is not a promise to mirror every textbook ordering.
It is a repo-specific plan for building a practical N5-scale curriculum that still fits the product constitution.

---

## Current Repo Reality

As of the current Phase 4 baseline:

- `50` grammar/listening/output packs are shipped
- `100` grammar lessons are shipped
- `199` missions are shipped
- `49` reading missions are shipped
- `550` vocab items are shipped
- `731` example sentences are shipped
- `349` listening items are shipped
- `245` reading checks are shipped
- listening audio manifest coverage is complete for the shipped `349` listening items

What is already strong:

- the core app loop exists and works
- grammar/listening/output all exist as real mission types
- recommendation, review, and progress are already usable
- content is explicit, inspectable, typed, and schema-validated
- the full pack set forms a coherent beginner lane across identity, locations, routines, transport, plans, shopping, time, te-form, descriptions, comparison, desire, ability, experience, health, weather, daily friction, plain-style recognition, and connected speech

What remains intentionally limited or worth watching:

- reading is now substantial but still lighter than the total example corpus, so denser recombination remains optional future polish
- content QA scripts cover structural and progression signals, but human review is still needed for naturalness and pedagogy
- Phase 4 product work is now about mobile flow, clarity, and personalization, not reopening Phase 3 content coverage by default

---

## What "N5-Comprehensive" Means In This Repo

Japanese OS should not claim "N5-comprehensive" just because it has a lot of content.
It should only claim it when the curriculum can credibly support repeated beginner study across the full early-N5 range.

For this repo, "N5-comprehensive" means all of the following are true:

### Coverage

- core polite grammar is covered across statements, questions, negatives, and past forms
- the main beginner particle functions are introduced, contrasted, and reused
- time, dates, routines, plans, movement, shopping, food, home, school/work, health, weather, and social coordination all exist as usable scenario lanes
- core N5 grammar families are represented, not just touched once
- reading is no longer a token add-on and meaningfully recombines prior content
- listening is no longer mostly isolated starter lines and includes broader daily-use variation
- output remains controlled, but covers the main taught patterns with forgiving local evaluation

### Depth

- each major grammar family appears in at least `3` separate communicative contexts
- each new grammar family is reinforced in a later batch before another big family replaces it
- recent packs are reused in reading within `2` reading slices, not left stranded in grammar/listening/output only
- beginner confusion pairs are explicitly revisited instead of assumed
- the learner can see the same grammar move inside different real-world situations

### Repo-Level Targets

These are target ranges, not rigid laws:

- `45-50` total grammar/listening/output packs
- `90-100` grammar lessons
- `150-170` total missions
- `18-22` reading missions
- `550-650` vocab items
- `500-650` example sentences
- `240-300` listening items

Why these ranges:

- below them, the repo will likely still feel obviously thin
- above them, the app can credibly feel like a broad N5 training environment rather than a starter sampler

### Claim Threshold

The repo is ready to call itself "N5-comprehensive" when:

- the planned grammar families below are implemented
- the target ranges above are roughly met
- the final N5 coverage audit shows no major missing beginner lane
- the reading/listening imbalance is no longer obvious
- BUILD_STATUS and QA reports agree with the actual content set

---

## Curriculum Design Rules

### 1. Spiral, Not Linear

The app should not move from topic to topic as if a learner only needs to see a pattern once.
New packs should revisit old grammar in new scenarios and revisit old scenarios with new grammar.

### 2. Communicative Coherence

Each pack should feel like one practical mini-cluster, not a random list of N5 points.
The learner should be able to answer "what real thing does this help me do?"

### 3. Two New Moves Maximum

Each pack should introduce at most:

- `2` grammar lessons
- `1` main new grammar family, or
- `2` very closely related beginner moves

If a pack needs more than that, it is too wide.

### 4. Listening And Output Stay Honest

- listening should remain beginner-safe and transcript-backed
- output should stay narrow and rule-based
- output tasks should not require grammar that has not been taught cleanly
- token-pattern evaluation should be used wherever word-order variation is plausible

### 5. Reading Is Reinforcement, Not Decoration

Reading slices should recombine existing material.
They should not become a separate neglected lane or a place to silently introduce new grammar.

### 6. Scenario Rotation

To avoid overconcentration, every `5` packs should span more than one domain.
The main recurring scenario lanes should be:

- daily routine
- home and objects
- school/class
- town navigation and transport
- plans and meetups
- food and ordering
- shopping and money
- hobbies and preferences
- health and comfort
- weather and clothing

### 7. Recognition Before Broad Production

For trickier areas like plain-form exposure, the app should move from:

1. recognition
2. controlled choice/discrimination
3. limited output

It should not jump straight from zero exposure to open typing.

### 8. Capstones Are The Five-Pack Payoff

Each five-pack chapter should eventually end with one short capstone story, dialogue, or message thread. The capstone is not a separate reading curriculum. It is the payoff artifact that proves the learner can recombine the chapter's mission practice into a small coherent scene.

The right density is spiral review:

- mostly already-learned language, so the story remains readable
- current-chapter grammar as the main comprehension challenge
- no hidden future grammar unless the line is explicitly recognition-only and documented

For production quality, capstones should feel like Genki-quality beginner material: natural enough to be worth reading, short enough for a mobile session, explicit enough that a beginner can parse it, and conservative about grammar that has not been taught.

Recommended ratio per capstone:

- `60-75%` earlier grammar/vocab
- `20-35%` current five-pack grammar/vocab
- `0-5%` intentional preview or stretch material

Every production capstone should include:

- `8-14` short lines
- `3-5` comprehension checks
- source references through `sourceExampleIds` wherever possible
- a content audit covering grammar scope, vocab scope, source reuse, and known risks

### 9. Capstone Spine For Packs 1-50

This is the intended breadth plan for the capstone library. Chapters 1-10 are now implemented as production capstones across packs 1-50.

| Chapter | Packs | Working Story Shape | Main Payoff |
| --- | ---: | --- | --- |
| 1 | 1-5 | First day basics in class | identity, questions, destinations, existence, preferences, place answers |
| 2 | 6-10 | Home and daily routine | possession, daily verbs, adjectives, past actions, requests/permission |
| 3 | 11-15 | Errand run through town | shopping basics, time, weekdays, transport, directions |
| 4 | 16-20 | Making and adjusting a meetup plan | invitations, meeting places, waiting/status, suggestions, proposals |
| 5 | 21-25 | Scheduling and paying for a simple outing | time ranges, dates, appointments, quantities, prices |
| 6 | 26-30 | Store request and follow-up actions | availability, te-form requests, action sequence, ongoing state, adjective negatives |
| 7 | 31-35 | Choosing where to go and explaining why | adjective past, comparisons, superlatives, frequency, reasons |
| 8 | 36-40 | Talking about wants, ability, experience, and company | desire, object desire, ability, experience, with whom/how |
| 9 | 41-45 | Handling choices, health, weather, travel, and delay | choices, condition, weather/clothing, travel steps, contacting others |
| 10 | 46-50 | Late N5 flow and recognition wrap-up | before/after, plain recognition, connected flow, flexible listing |

Future capstone batches should not try to write only with the newest grammar. Earlier grammar is the floor; the newest chapter is the point of tension.

---

## Original Phase 3 Grammar Gap List

This section is historical. It records the major grammar families that were still needed when the Phase 3 plan was written.

The current repo now covers the intended beginner families from this list across the shipped Pack `1-50` set:

- polite statements and questions
- basic particles and location patterns
- existence
- possession
- present, negative present, past, negative past
- adjectives in simple predicate / noun-modifying use
- permission and request basics
- shopping basics
- time, weekdays, transport, navigation
- invitations and meeting coordination

The original remaining-family checklist was:

- suggestions with `〜ませんか`
- inclusive planning with `〜ましょう / 〜ましょうか`
- time ranges with `から / まで`
- dates, months, and calendar expressions
- counters and quantities
- prices and simple transaction language
- te-form as a real grammar family
- sequencing with `〜て / 〜てから`
- ongoing state with `〜ています`
- prohibition with `〜てはいけません`
- adjective negative and adjective past contrast
- comparison with `より / ほうが`
- superlatives with `いちばん`
- frequency adverbs and routine variation
- reasons with `から`
- desire with `〜たいです`
- object desire with `〜がほしいです`
- ability with `〜ことができます`
- experience with `〜たことがあります`
- choice expressions like `どれ / どの / どちら`
- social coordination expansions like arrival, delay, waiting, and status updates
- health and condition basics
- weather / clothing / comfort basics
- before / after planning with `まえに / あとで`
- light connected-speech handling in reading/listening
- plain-style recognition for nouns, adjectives, and verbs

This did not mean every possible N5 edge case needed a separate pack.
It meant these families needed to be represented clearly enough that the learner would not be blindsided by core beginner Japanese.

---

## Roadmap Structure

The implemented Phase 3 expansion was:

- `33` additional packs beyond the then-current baseline
- packs `18` through `50`
- grouped into `11` three-pack implementation batches
- audited every `5` packs
- reinforced with `6` reading checkpoints, each adding `2` reading missions

This plan has landed and was later followed by post-claim-gap reinforcement. The current repo now exceeds the original rough scale target in reading and total mission count:

- `50` total packs
- `100` grammar lessons
- `150` grammar/listening/output missions
- `49` reading missions
- `199` total missions

That is the scale where the repo-level N5-comprehensive claim became defendable, subject to the limitations documented in `BUILD_STATUS.md`.

---

## Implemented Pack Roadmap

This roadmap is historical. It documents the intended Phase 3 pack sequence that has now shipped.

### Batch 1: Packs 18-20

Focus:
- social coordination beyond basic invitation
- practical meetup status
- soft suggestion language

Packs:

1. `Pack 18 — Arrival And Waiting Basics`
   - core patterns: `つきました`, `いま X です`, `まっています`
   - communicative goal: tell someone where you are and whether you are waiting
   - notes: natural continuation from packs 16-17

2. `Pack 19 — Suggestions With ませんか`
   - core patterns: `いっしょに ... ませんか`, `Xに ... ませんか`
   - communicative goal: invite more naturally than yes/no confirmation only
   - notes: keep it polite and narrow

3. `Pack 20 — Inclusive Plans With ましょう / ましょうか`
   - core patterns: `Xじにあいましょう`, `なにをしましょうか`
   - communicative goal: move from asking to proposing
   - notes: contrast clearly with `ませんか`

### Batch 2: Packs 21-23

Focus:
- time range control
- dates and calendar basics
- tighter plan-making language

Packs:

1. `Pack 21 — Time Ranges With から / まで`
   - core patterns: `Xじから`, `Xじまで`, `なんじからなんじまで`
   - communicative goal: state availability windows and event times

2. `Pack 22 — Dates, Months, And When`
   - core patterns: `いつ`, `なんがつ`, `なんにち`
   - communicative goal: handle practical date planning

3. `Pack 23 — Calendar Plans And Appointments`
   - core patterns: date + time + meetup / outing lines
   - communicative goal: combine packs 16-22 into fuller plans
   - notes: this should be a recombination pack, not a grammar dump

Reading follow-up after Batch 2:

- add `2` reading missions that recombine packs 16-23
- one should be schedule-heavy
- one should be invite/meetup-heavy

Audit gate after Pack 22:

- confirm the curriculum is not still over-clustering around plans alone
- confirm date and time-range language is staying practical rather than textbook-listy

Clean stop point:

- the app can now handle simple invitation, suggestion, date, and time-range coordination

### Batch 3: Packs 24-26

Focus:
- money and quantities
- more useful shopping depth
- more practical daily transactions

Packs:

1. `Pack 24 — Counters And Quantity Basics`
   - core patterns: `ひとつ / ふたつ`, `いくつ`
   - communicative goal: ask for and understand simple quantities

2. `Pack 25 — Price And Payment Basics`
   - core patterns: `いくらですか`, `X円です`
   - communicative goal: handle basic price questions and simple buying lines

3. `Pack 26 — Store Availability And Item Requests`
   - core patterns: `Xはありますか`, `Xをください`, `これでいいです`
   - communicative goal: ask whether something is available and request it politely

### Batch 4: Packs 27-29

Focus:
- te-form core
- action sequencing
- ongoing state

Packs:

1. `Pack 27 — Te-Form Core For Everyday Verbs`
   - core patterns: tightly scoped te-form formation on a small verb set
   - communicative goal: make the learner comfortable seeing and using te-form productively
   - notes: this must be contrast-heavy and carefully leveled

2. `Pack 28 — Action Sequence With て / てから`
   - core patterns: `Xして、それから...`, `XてからYします`
   - communicative goal: describe short action chains

3. `Pack 29 — Ongoing State With ています`
   - core patterns: `まっています`, `べんきょうしています`, `すんでいます`
   - communicative goal: describe what is happening now or stable present states

Reading follow-up after Batch 4:

- add `2` reading missions that recombine packs 24-29
- one should be shopping/transactional
- one should be routine / sequence / current-state focused

Audit gate after Pack 27:

- confirm te-form is not being used too broadly too fast
- confirm output remains constrained to taught verbs

Clean stop point:

- the repo now has a real te-form family instead of isolated memorized set phrases

### Batch 5: Packs 30-32

Focus:
- adjective depth
- comparison
- stronger preference language

Packs:

1. `Pack 30 — Adjective Negative And Contrast`
   - core patterns: `たかくないです`, `しずかじゃないです`
   - communicative goal: describe and compare things more honestly

2. `Pack 31 — Adjective Past And Description Recall`
   - core patterns: `たかかったです`, `しずかでした`
   - communicative goal: talk about past impressions and conditions

3. `Pack 32 — Comparison With より / ほうが`
   - core patterns: `AよりBのほうが...`
   - communicative goal: compare food, places, routes, and preferences

### Batch 6: Packs 33-35

Focus:
- superlatives
- frequency
- reasons

Packs:

1. `Pack 33 — Superlatives With いちばん`
   - core patterns: `いちばんすきです`, `いちばんやすいです`
   - communicative goal: say what you like best or find easiest / best

2. `Pack 34 — Frequency Adverbs And Routine Variation`
   - core patterns: `いつも`, `よく`, `ときどき`, `あまり ... ません`
   - communicative goal: describe real routines instead of single canned lines

3. `Pack 35 — Simple Reasons With から`
   - core patterns: `XからYです`
   - communicative goal: explain small choices, refusals, and preferences
   - notes: keep this narrow and beginner-safe, not abstract

Reading follow-up after Batch 6:

- add `2` reading missions that recombine packs 30-35
- one should emphasize description and comparison
- one should emphasize routine and reasons

Audit gate after Pack 32:

- check adjective naturalness carefully
- check comparison lines for English-shaped phrasing

Clean stop point:

- the app can now handle description, comparison, frequency, and simple explanation at a real beginner level

### Batch 7: Packs 36-38

Focus:
- desire
- wanting objects
- ability

Packs:

1. `Pack 36 — Desire With たいです`
   - core patterns: `Xにいきたいです`, `Yをたべたいです`
   - communicative goal: express plans and wants more naturally than only invitation/response language

2. `Pack 37 — Object Desire With ほしいです`
   - core patterns: `Xがほしいです`
   - communicative goal: express wanted things in shopping and daily-life contexts

3. `Pack 38 — Ability With ことができます`
   - core patterns: `にほんごをよむことができます`
   - communicative goal: talk about what you can do in daily contexts

### Batch 8: Packs 39-41

Focus:
- experience
- choice language
- companions and methods

Packs:

1. `Pack 39 — Experience With たことがあります`
   - core patterns: `Xにいったことがあります`
   - communicative goal: discuss prior experience in a beginner-safe way

2. `Pack 40 — With Whom / How`
   - core patterns: `だれと`, `どうやって`, `Xと`, transport review
   - communicative goal: answer natural beginner follow-up questions

3. `Pack 41 — Choosing Things With どれ / どの / どちら`
   - core patterns: short choosing questions and answers
   - communicative goal: navigate simple decisions in shops, meals, and plans

Reading follow-up after Batch 8:

- add `2` reading missions that recombine packs 36-41
- one should emphasize wants / ability / experience
- one should emphasize choice, company, and transport/plans

Audit gate after Pack 37:

- confirm `たいです`, `ほしいです`, and `ことができます` are clearly separated
- check that example sentences stay learner-natural rather than textbook-stiff

Clean stop point:

- the app can now support desire, ability, and prior experience, which materially expands real beginner usefulness

### Batch 9: Packs 42-44

Focus:
- body / health / comfort
- weather and clothing
- travel disruption

Packs:

1. `Pack 42 — Health And Condition Basics`
   - core patterns: `だいじょうぶです`, `あたまがいたいです`, `げんきです`
   - communicative goal: express simple physical condition and check on others

2. `Pack 43 — Weather, Clothing, And Comfort`
   - core patterns: `あついです`, `さむいです`, `コートをきます`
   - communicative goal: connect conditions to practical choices

3. `Pack 44 — Travel Steps And Movement Changes`
   - core patterns: getting on/off, changing transport, arriving/leaving
   - communicative goal: deepen movement language beyond "I go by bus"

### Batch 10: Packs 45-47

Focus:
- problems and delays
- before/after coordination
- plain-form recognition

Packs:

1. `Pack 45 — Delays, Problems, And Contacting Others`
   - core patterns: `おくれます`, `ちょっとむずかしいです`, `れんらくします`
   - communicative goal: handle basic real-life friction

2. `Pack 46 — Before / After With まえに / あとで`
   - core patterns: `Xのまえに`, `Yのあとで`
   - communicative goal: coordinate order and timing more naturally

3. `Pack 47 — Plain-Style Recognition I`
   - core patterns: noun / adjective short-form recognition in reading and listening
   - communicative goal: reduce beginner shock when formal textbook style ends
   - notes: recognition-first, very limited production

Reading follow-up after Batch 10:

- add `2` reading missions that recombine packs 42-47
- one should emphasize health/weather/problem handling
- one should emphasize before/after and plain-form recognition

Audit gate after Pack 42:

- confirm the curriculum is not still skewing too far toward plans/navigation
- check whether reading has kept pace with new content

Clean stop point:

- the app now handles more realistic life friction and begins plain-style preparation

### Batch 11: Packs 48-50

Focus:
- plain-form recognition depth
- connected speech
- final N5-scale reinforcement

Packs:

1. `Pack 48 — Plain-Style Recognition II`
   - core patterns: short-form verb recognition in reading/listening
   - communicative goal: recognize common beginner plain statements and questions

2. `Pack 49 — Connected Speech For Everyday Flow`
   - core patterns: `そして`, `でも`, `それから`, `だから`
   - communicative goal: understand and produce short, connected everyday speech
   - notes: keep this practical and sentence-level

3. `Pack 50 — Listing And Flexible Choice Language`
   - core patterns: `と`, `や`, short selection / preference combinations
   - communicative goal: talk about more than one thing without sounding trapped in one-slot sentences

Reading follow-up after Batch 11:

- add `2` reading missions that recombine packs 48-50 with earlier review material
- use one mission as a final polite/plain contrast checkpoint
- use one mission as a final mixed-scenario consolidation slice

Audit gate after Pack 47:

- confirm plain-form recognition remains recognition-first
- confirm connected-speech packs do not introduce hidden N4 complexity

Final claim gate after Pack 50:

- run a full coverage audit
- run a reading/listening balance audit
- run a BUILD_STATUS accuracy pass
- decide whether the repo can honestly use "N5-comprehensive"

---

## Post-Claim-Gap Expansion Plan

This section is historical. It documents the follow-on reinforcement plan that was created after the first Pack `50` claim gate.

At that time, the repo was broad, coherent, and structurally sound, but it still missed the repo-defined `N5-comprehensive` claim threshold in two concrete ways:

- vocab breadth is too low
- reading reuse density is still too light relative to total content volume

The follow-on plan closed that gap without changing the app architecture or widening beyond N5.

### Historical Gap Snapshot

As of the post-Pack-50 audit:

- `334` vocab items are shipped
- `512` example sentences are shipped
- `249` listening items are shipped
- `27` reading missions are shipped
- `123 / 512` example sentences are currently reused in reading

The minimum shortfall to the repo's own vocab floor is:

- `+216` vocab items to reach `550`

The biggest reading-density weaknesses are not the newest packs.
They are the under-reused earlier and mid-curriculum packs, especially:

- zero-reuse packs: `6`, `7`, `9`, `10`
- very light reuse packs: `13`, `15`, `19`, `20`

### Current Outcome

As of the current Phase 4 baseline:

- `550` vocab items are shipped
- `731` example sentences are shipped
- `349` listening items are shipped
- `49` reading missions are shipped
- `245` reading checks are shipped
- `232 / 731` example sentences are reused in reading
- the latest pack set has no missing reading-reuse follow-up in the current report
- listening audio manifest coverage is complete for the shipped listening set

The post-claim-gap expansion plan should therefore not be treated as an active backlog.
Future content work should start from a fresh audit and an explicit decision to reopen content expansion.

### Non-Goals

This follow-on plan is intentionally narrow.
It should not be used as permission to quietly expand scope.

Do not use this phase to:

- add new grammar families beyond the existing Pack `1-50` scope
- add new mission types
- add runtime features, backend work, sync, analytics, or AI grading
- broaden into N4 grammar
- rewrite the pack architecture
- dump large vocab lists without sentence-level integration

### Historical Success Threshold For This Phase

This follow-on phase is complete when all of the following are true:

- vocab reaches at least `550`
- reading missions reach roughly `33-37`
- reading checks reach roughly `165-185`
- reading reuse rises to at least `170` reused example sentences overall
- no shipped pack from `1-50` remains at `0%` reading reuse
- the currently weak early packs have visible recovery:
  - packs `6`, `7`, `9`, and `10` should each reach at least `2` reused linked examples
  - packs `13`, `15`, `19`, and `20` should each rise above their current thin baseline
- new reading slices still obey the existing concentration rule:
  - no single source pack should exceed `40%` of one reading mission
- new listening additions remain manifest-synced as they ship

### Historical Execution Shape

Do not start a new large grammar roadmap.
Use the existing Pack `1-50` structure and densify it in controlled reinforcement blocks.

Recommended shape:

- `5` post-claim-gap reinforcement blocks
- each block covers `10` existing packs
- each block adds vocab breadth, example breadth, light listening reinforcement, and reading recombination

Per block targets:

- add `44-46` new vocab items
- add `25-35` new example sentences using only already-taught grammar moves
- add `10-15` new listening items using the same grammar families
- add `2` new reading missions that recombine the target block with nearby review material

Why this shape:

- `5` blocks at `44-46` vocab each adds `220-230` vocab items total
- that moves the repo from `334` to roughly `554-564` vocab items
- the reading lane grows without requiring a new runtime surface
- the work stays auditable and pack-native instead of turning into an uncontrolled appendix

### Historical Block Plan

#### Block A: Packs 1-10

Purpose:

- close the earliest reading-reuse holes
- add more classroom, home, family, daily-verb, and adjective-support vocab
- strengthen the foundation before later densification

High-priority packs:

- `6`, `7`, `9`, `10`

Required reading emphasis:

- one reading mission should recombine identity, location, possession, and daily routine
- one reading mission should recombine recent action, request/permission, and simple descriptions

#### Block B: Packs 11-20

Purpose:

- deepen shopping, time, transport, directions, invitations, and meetup language
- add more practical plan and status vocabulary without introducing new grammar families

High-priority packs:

- `13`, `15`, `19`, `20`

Required reading emphasis:

- one reading mission should center practical errands and movement
- one reading mission should center invitations, proposals, and meetup status updates

#### Block C: Packs 21-30

Purpose:

- densify calendar, transaction, te-form, sequencing, ongoing-state, and adjective-negative coverage
- add more reusable daily-life nouns and verbs inside already taught patterns

Required reading emphasis:

- one reading mission should center dates, times, and transactions
- one reading mission should center te-form, sequence, current state, and honest description

#### Block D: Packs 31-40

Purpose:

- deepen comparison, frequency, reasons, wants, ability, experience, companions, and methods
- make the middle N5 lane feel less like one-line pattern exposure and more like everyday recombination

Required reading emphasis:

- one reading mission should center description, comparison, and reasons
- one reading mission should center wants, ability, experience, and simple follow-up questions

#### Block E: Packs 41-50

Purpose:

- strengthen the newest daily-friction and plain-style lane without adding harder grammar
- add more practical choice, condition, weather, communication, and connected-speech vocabulary

Required reading emphasis:

- one reading mission should center realistic daily friction and response language
- one reading mission should center polite/plain recognition, connected flow, and list-based choice language

### Content Rules For This Phase

Every new vocab item added in this phase must:

- belong to an already-shipped pack or a clearly adjacent pack theme
- appear in at least `1` new example sentence
- avoid introducing a new untaught grammar move
- prefer practical daily-use nouns, verbs, expressions, and question words over abstract filler

Every new example sentence added in this phase must:

- reuse existing grammar families from Pack `1-50`
- stay beginner-natural rather than textbook-stiff
- improve domain breadth or contrastive reinforcement, not just pad counts

Every new reading mission added in this phase must:

- reuse only already-shipped example sentences
- intentionally pull from weak-reuse packs, not only the latest block
- stay within the `40%` single-pack concentration cap
- include at least one real confusion-pair distractor

### QA Gates For Each Block

After each reinforcement block lands:

- run `npm run typecheck`
- run `npm run build`
- run `npm run report:build-status-summary`
- run `npm run report:content-coverage`
- run `npm run report:reading-reuse`
- run `npm run report:progression-gaps`
- run `npm run report:content-overlap`

Each block should be treated as incomplete if any of the following are true:

- a targeted weak-reuse pack did not materially improve
- a new reading mission exceeds the `40%` concentration cap
- new vocab was added without sentence-level integration
- new content silently assumes untaught grammar
- BUILD_STATUS no longer matches repo reality

### Clean Stop Points

This phase should remain pausable.

Useful stop points are:

- after Blocks A-B: the earliest reading-reuse holes are closed and foundational vocab breadth is materially better
- after Blocks C-D: the mid-curriculum becomes denser and more durable without new grammar families
- after Block E: rerun the final claim gate and decide whether the repo can now honestly claim `N5-comprehensive`

---

## Reading Expansion Policy

This policy was written when reading had only seven missions.
It succeeded: the current repo has `49` reading missions and `245` reading checks.

For future content expansion, keep the same principle:

- reading must grow alongside new grammar/listening/output content
- each reading mission should reuse only already-shipped example sentences
- reading should recombine nearby and earlier packs
- reading should mix old and recent material instead of clustering only the newest examples

Historical target by the end of the original plan:

- `19` total reading missions
- more domain variety
- more grammar contrast inside reading checks

Reading mission design rules:

- no silent new grammar
- no English-first phrasing
- at least one distractor should test a real learner confusion, not just random wrongness
- support notes should explain the decision in one short useful line

---

## Safe Batch Rules

Every implementation batch should obey these rules:

1. No batch should introduce more than one big new conjugation family.
2. No batch should lean entirely on one scenario domain.
3. At least one pack in a batch should visibly reinforce an earlier area, not only introduce something new.
4. Output tasks should stay within locally checkable patterns.
5. At least one listening item per pack should sound like a real beginner daily-use line, not a grammar demo sentence.
6. BUILD_STATUS should only be updated after the batch content is actually landed and counted.

---

## Local Content QA Tooling Strategy

The loader already gives structural validation.
What is missing is curriculum validation.

The right strategy is to add a thin local QA layer that checks content quality signals without changing the runtime architecture.

### First Small Refactor: Add A Pack Registry

Before aggressive multi-pack expansion, add a small dev-facing manifest such as:

- `src/content/contentPacks.ts`

Each pack record should include:

- `packId`
- `title`
- `theme`
- `batch`
- `grammarLessonIds`
- `vocabIds`
- `exampleIds`
- `listeningItemIds`
- `missionIds`
- `introducedGrammarTags`
- `reinforcedGrammarTags`
- `scenarioTags`
- `status`

This registry should not drive UI behavior.
It should exist to support QA, reporting, and future planning integrity.

### Tool 1: Coverage Report

Suggested file:

- `scripts/report-content-coverage.ts`

Responsibilities:

- print current totals
- print totals by mission type
- print totals by pack
- print grammar-tag frequency
- print scenario-lane frequency
- print vocab part-of-speech distribution
- print reading reuse coverage for recent packs

Questions it should answer:

- which grammar families are underrepresented?
- which scenario lanes are overrepresented?
- which recent packs have no reading reuse yet?

### Tool 2: Progression Gap Report

Suggested file:

- `scripts/report-progression-gaps.ts`

Responsibilities:

- detect when a pack references grammar tags that have not been introduced or reinforced yet
- detect when output tasks require untaught word order or untaught particles
- detect when reading missions lean too heavily on material from only one recent pack

Questions it should answer:

- are later packs assuming too much?
- did a new pack skip a prerequisite?

### Tool 3: Overlap And Template Drift Report

Suggested file:

- `scripts/report-content-overlap.ts`

Responsibilities:

- flag duplicate or near-duplicate Japanese strings
- flag duplicate English glosses
- flag repeated sentence skeletons above a threshold
- flag repeated output tasks with only noun swaps

Questions it should answer:

- is repetition intentional?
- are we accidentally mass-producing the same pack in different clothing?

### Tool 4: Reading Reuse Report

Suggested file:

- `scripts/report-reading-reuse.ts`

Responsibilities:

- list example sentences that have never appeared in reading
- list example sentences introduced in the last `5` packs that still have no reading reuse
- show per-pack reading reuse ratios

Questions it should answer:

- are new packs actually reaching the reading lane?

### Tool 5: Status Summary Report

Suggested file:

- `scripts/report-build-status-summary.ts`

Responsibilities:

- output the exact current totals
- output mission type counts
- output listening-audio coverage counts from the manifest
- output the latest pack numbers and reading slice counts

Questions it should answer:

- what should BUILD_STATUS actually say right now?

### Tool 6: Pack Policy Checker

Suggested file:

- `scripts/check-pack-policy.ts`

Responsibilities:

- enforce pack-level floor/ceiling rules
- flag packs with fewer than `2` lessons or more than `2`
- flag packs with too few examples or listening items
- flag packs whose output tasks lack token patterns where multiple polite word orders are acceptable

Questions it should answer:

- does each pack still match the intended slice shape?

### Suggested QA Command Set

Eventually the repo should have a simple local QA pass like:

```bash
npm run typecheck
npm run build
npx tsx scripts/report-content-coverage.ts
npx tsx scripts/report-progression-gaps.ts
npx tsx scripts/report-content-overlap.ts
npx tsx scripts/report-reading-reuse.ts
npx tsx scripts/report-build-status-summary.ts
npx tsx scripts/check-pack-policy.ts
```

### What Local Tooling Will Not Catch

No local script will reliably judge:

- whether a line sounds natural to a Japanese speaker
- whether a distractor is pedagogically sharp
- whether a sequence feels motivating rather than stale

That still requires a human audit rubric.

So the correct model is:

- scripts for structural and curriculum signals
- human audit for naturalness, difficulty, and pedagogy

---

## Five-Pack Audit Rubric

After every `5` packs, run a manual audit that answers these questions:

### Progression

- did the new packs assume untaught grammar?
- were prerequisites actually reinforced before expansion?
- does the sequence still feel learnable rather than jagged?

### Naturalness

- are the example sentences clear and beginner-natural?
- do any lines feel translated from English rather than written as Japanese?
- are we relying too much on one sentence shell?

### Coverage Balance

- did we overproduce one scenario lane?
- did reading and listening keep pace with grammar/output growth?
- did the new batch improve weak areas or just deepen already-strong areas?

### Output Honesty

- do output tasks remain locally checkable?
- are token-patterns present where they should be?
- are we asking for more free production than the learner has earned?

### Reading Health

- are recent packs being reused in reading?
- are distractors testing real confusion points?

### Status Accuracy

- do BUILD_STATUS totals match reality?
- do the limitation notes still describe the repo honestly?

If the answer to any of these is "not really," fix that before adding another large batch.

---

## Periodic Refactor Policy

During Phase 3, refactors were curriculum refactors, not architecture rewrites.
For future content work, keep the same rule unless the roadmap explicitly changes.

Allowed periodic refactors:

- add or clean pack metadata
- standardize tag naming
- improve content QA scripts
- tighten awkward sentences
- rebalance reading reuse
- fix skill-map mapping gaps
- improve BUILD_STATUS accuracy

Not allowed without an explicit separate decision:

- changing the app architecture
- changing persistence shape without cause
- adding backend or sync
- turning output grading into AI evaluation
- broad mission-player redesign

Historical suggested refactor cadence:

- light refactor every `10` packs
- small cleanup refactor whenever an audit reveals real drift
- one final consolidation refactor near the end of Phase 3 before stronger Phase 4 work

---

## Historical Prompt Templates

These templates governed Phase 3 curriculum expansion and post-claim-gap reinforcement.
They are preserved as examples for future content work, but they are not the active Phase 4 implementation queue.

For current Phase 4 product work, start from `BUILD_STATUS.md` and `Japanese_OS_feedback_plan.md`, then choose a narrow slice only from a concrete user-test or mobile-loop finding.

### 1. Implementation Batch Prompt

Use this only if content expansion is explicitly reopened for a planned `2-3` pack batch.

```md
Context:
This repo is for Japanese OS, a local-first Japanese learning MVP. Follow:
- `constitution.md`
- `PRODUCT_SPEC.md`
- `ROADMAP.md`
- `BUILD_STATUS.md`
- `N5_CURRICULUM_PLAN.md`
- `PROMPTS/README.md`

Preserve the current architecture and avoid unrelated edits.
Inspect the repo first and treat repo reality as the source of truth.

Task:
Implement Batch [X] from `N5_CURRICULUM_PLAN.md`, covering packs [A]-[B].

Batch scope:
- [Pack A title]
- [Pack B title]
- [Pack C title if applicable]

Goal:
- land one coherent batch that broadens the curriculum without breaking progression

Constraints:
- TypeScript only.
- Do not add dependencies.
- Do not add backend, sync, accounts, analytics, AI grading, or speech features.
- Preserve the current local-first architecture.
- Keep content schema-driven and hand-editable.
- Reuse the current schema and mission-player patterns.
- Avoid broad refactors.
- Do not redesign Today, Missions, Review, Progress, Settings, or reading/player UX.
- Do not generate MP3 files in this pass.

Content targets per pack:
- 2 new grammar lessons
- 10-15 new vocab items
- 8-14 new example sentences
- 4-6 new listening items with `audioRef`
- 3 new missions total:
  - 1 grammar
  - 1 listening
  - 1 output

Batch quality rules:
- Keep the batch progression-safe.
- Reuse and reinforce earlier grammar where helpful.
- Keep Japanese phrasing practical and N5-safe.
- Add `evaluation.tokenPatterns` where useful.
- Do not introduce grammar in output that is not taught in the batch or cleanly established earlier.

Verification:
- Run `npm run typecheck`
- Run `npm run build`
- Update `BUILD_STATUS.md` in the same pass so totals and notes match the actual repo state.

Output:
- Summarize files changed.
- List the new grammar lesson ids, vocab ids, example sentence ids, listening item ids, output task ids, and mission ids.
- Note any tiny heuristic or wiring changes beyond content authoring.
- Summarize exactly what changed in `BUILD_STATUS.md`.
- Call out any lines you intentionally rewrote for naturalness.
- State whether listening audio files still need to be generated manually after the pass.
```

### 2. Five-Pack Audit Prompt

Use this only after newly landed content packs.

```md
Context:
This repo is Japanese OS. Follow:
- `constitution.md`
- `PRODUCT_SPEC.md`
- `ROADMAP.md`
- `BUILD_STATUS.md`
- `N5_CURRICULUM_PLAN.md`

Inspect the actual repo and treat repo reality as the source of truth.

Task:
Audit the quality of the most recent 5 landed packs, plus any reading slices added alongside them.

Audit goals:
- progression quality
- Japanese naturalness
- content overlap quality
- difficulty control
- coverage balance
- reading reuse health
- BUILD_STATUS accuracy

Instructions:
- Default to a code/content review mindset.
- Findings must come first.
- Prioritize bugs, curriculum risks, awkward Japanese, missing reinforcement, misleading BUILD_STATUS notes, and weak reading/listening balance.
- Give file references and line references where possible.
- Do not make edits yet unless explicitly asked.

Required checks:
- Did later packs assume untaught grammar or vocab?
- Did repetition stay intentional?
- Are any example sentences or output tasks too English-shaped or templated?
- Did reading meaningfully reuse the new content?
- Did one scenario lane dominate too much?
- Do mission counts and content totals in `BUILD_STATUS.md` match repo reality?

Output:
- Findings first, ordered by severity.
- Then open questions / assumptions.
- Then a brief high-level health summary.
```

### 3. Periodic Refactor Prompt

Use this only after a content audit shows drift or before a new major expansion block.

```md
Context:
This repo is Japanese OS. Follow:
- `constitution.md`
- `PRODUCT_SPEC.md`
- `ROADMAP.md`
- `BUILD_STATUS.md`
- `N5_CURRICULUM_PLAN.md`
- `PROMPTS/README.md`

Preserve the architecture and avoid unrelated edits.
Inspect the repo first and treat repo reality as the source of truth.

Task:
Implement a narrow Phase 3 curriculum-maintenance refactor based on the current audit findings.

Allowed scope:
- pack metadata / manifest improvements
- content QA tooling
- tag cleanup
- awkward sentence fixes
- reading reuse improvements
- skill-map mapping corrections
- BUILD_STATUS accuracy fixes

Hard constraints:
- TypeScript only.
- No new dependencies.
- No backend or sync changes.
- No broad UI redesign.
- No broad content rewrite across the whole repo unless explicitly requested.

Verification:
- Run `npm run typecheck`
- Run `npm run build`
- If scripts are added, run the new local QA script(s) and summarize what they report.

Output:
- Summarize files changed.
- State exactly what drift or integrity problem this refactor addressed.
- List any follow-up issues that should be handled before the next content batch.
```

### 4. Post-Claim-Gap Expansion Prompt

This prompt is historical. The post-claim-gap reinforcement work is complete.

```md
Context:
This repo is Japanese OS. Follow:
- `constitution.md`
- `PRODUCT_SPEC.md`
- `ROADMAP.md`
- `BUILD_STATUS.md`
- `N5_CURRICULUM_PLAN.md`
- `PROMPTS/README.md`

Inspect the repo first and treat repo reality as the source of truth.
Preserve the existing local-first architecture and avoid unrelated edits.

Task:
Implement one post-claim-gap reinforcement block from `N5_CURRICULUM_PLAN.md`.

Scope for this pass:
- target packs: `[choose one 10-pack block]`
- goal: increase vocab breadth inside already-shipped grammar families and raise reading reuse for the target packs

Hard constraints:
- TypeScript only.
- No new dependencies.
- No backend, sync, analytics, AI grading, or new runtime features.
- Do not introduce new grammar families beyond the existing Pack `1-50` scope.
- Every new vocab item must be integrated into at least one new example sentence.
- Reading missions must reuse only already-shipped example sentences.
- No reading mission may exceed `40%` concentration from a single source pack.

Required work:
- add pack-native vocab breadth across the target block
- add supporting example sentences and light listening reinforcement
- add `2` reading missions that intentionally improve weak reading reuse in the target block
- update `BUILD_STATUS.md` in the same pass

Verification:
- Run `npm run typecheck`
- Run `npm run build`
- Run `npm run report:build-status-summary`
- Run `npm run report:content-coverage`
- Run `npm run report:reading-reuse`
- Run `npm run report:progression-gaps`
- Run `npm run report:content-overlap`

Output:
- Summarize files changed.
- List the new vocab ids, example sentence ids, listening item ids, reading mission ids, and any mission ids added.
- State which weak-reuse packs improved and by how much.
- Summarize exactly what changed in `BUILD_STATUS.md`.
- State validation results from all required scripts.
```

---

## Historical Clean Stopping Points

The Phase 3 roadmap was intentionally not all-or-nothing.
These were the clean pause points where the curriculum would still have felt coherent:

- after Batch 2: strong social planning and scheduling beginner lane
- after Batch 4: meaningful transaction depth plus real te-form foundations
- after Batch 6: better descriptive, comparative, and explanatory breadth
- after Batch 8: strong daily-life usefulness with desire, ability, and experience
- after Batch 10: broader real-life friction handling plus plain-form prep
- after Batch 11: final N5-comprehensive claim audit point

Development has passed these points. The current clean stop is the completed Phase 3 / active Phase 4 boundary documented in `BUILD_STATUS.md`.

---

## Final Rule

Do not treat this plan as permission to dump content.

The purpose of the plan is the opposite:

- define the target clearly
- expand in safe batches
- audit regularly
- refactor lightly
- keep the app useful and honest while it grows

If a future implementation pass conflicts with this document, the right response is to pause, audit, and correct the plan or the batch before continuing.
