# N5 Curriculum Plan

## Purpose

This document operationalizes Phase 3 of Japanese OS.

The roadmap already says "content expansion," but that phrase is too vague on its own.
This file defines what "N5-comprehensive" should mean in this repo, how we get there without curriculum drift, how future content should be batched, and how local QA should keep the expansion honest.

This plan is intentionally:

- grammar-first
- practical rather than test-crammed
- mobile-session friendly
- local-first and schema-driven
- strict about progression, reuse, and review

It is not a promise to mirror every textbook ordering.
It is a repo-specific plan for building a practical N5-scale curriculum that still fits the product constitution.

---

## Current Baseline

As of the current cleaned baseline:

- `17` grammar/listening/output packs are shipped
- `34` grammar lessons are shipped
- `58` missions are shipped
- `7` reading missions are shipped
- `188` vocab items are shipped
- `179` example sentences are shipped
- `84` listening items are shipped

What is already strong:

- the core app loop exists and works
- grammar/listening/output all exist as real mission types
- recommendation, review, and progress are already usable
- content is explicit, inspectable, typed, and schema-validated
- the recent packs form a coherent beginner lane around time, plans, transport, directions, invitations, and meeting places

What is still weak:

- reading is still too small
- the curriculum is still too concentrated around movement/planning scenarios
- important N5 grammar families are still missing or only partially represented
- the app does not yet have enough contrastive reinforcement to make the grammar feel durable
- the repo has structural content validation, but not enough curriculum-level QA

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

---

## Grammar Families Still Needed

The current repo already covers:

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

The major remaining families needed for a credible N5-scale curriculum are:

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

This does not mean every possible N5 edge case must be turned into a separate pack.
It means these families must be represented clearly enough that the learner is not blindsided by core beginner Japanese.

---

## Roadmap Structure

The recommended expansion from here is:

- `33` future packs
- packs `18` through `50`
- grouped into `11` three-pack implementation batches
- audited every `5` packs
- reinforced with `6` reading checkpoints, each adding `2` reading missions

If this full plan lands, the repo should end roughly around:

- `50` total packs
- `100` grammar lessons
- `150` grammar/listening/output missions
- `19` reading missions
- `169` total missions

That is the scale where a repo-level N5-comprehensive claim starts becoming defendable.

---

## Future Pack Roadmap

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

## Reading Expansion Policy

Reading cannot remain seven missions while the rest of the app keeps growing.

From this point onward:

- after every `2` implementation batches, add `2` reading missions
- each reading mission should reuse only already-shipped example sentences
- reading should recombine at least the previous `5-8` packs
- reading should mix old and recent material instead of clustering only the newest examples

Target by the end of this plan:

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

Refactors during Phase 3 should be curriculum refactors, not architecture rewrites.

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

Suggested refactor cadence:

- light refactor every `10` packs
- small cleanup refactor whenever an audit reveals real drift
- one final consolidation refactor near the end of Phase 3 before stronger Phase 4 work

---

## Prompt Templates

These are the prompt templates that should govern future expansion work.

### 1. Implementation Batch Prompt

Use this for a planned `2-3` pack batch.

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

Use this after every `5` newly landed packs.

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

Use this after an audit shows drift or before a new major expansion block.

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

---

## Clean Stopping Points

The roadmap should not feel all-or-nothing.
These are clean pause points where the curriculum would still feel coherent:

- after Batch 2: strong social planning and scheduling beginner lane
- after Batch 4: meaningful transaction depth plus real te-form foundations
- after Batch 6: better descriptive, comparative, and explanatory breadth
- after Batch 8: strong daily-life usefulness with desire, ability, and experience
- after Batch 10: broader real-life friction handling plus plain-form prep
- after Batch 11: final N5-comprehensive claim audit point

If development pauses at one of these points, the curriculum still makes sense.
That matters for a long-running AI-assisted build.

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
