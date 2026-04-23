# BUILD STATUS

## Project

- Name: Japanese OS
- Repo: local-first Japanese learning MVP for short daily beginner study loops

## Current Phase / Status

- Phase: early Phase 3
- Status: the core MVP loop is working end-to-end with starter content, a real mission library, local progress, weak-point tracking, and a deterministic review/recommendation loop
- Interpretation: this now feels like a usable local MVP with repeatable mission flow and several coherent beginner content lanes; the biggest gaps are content breadth and deeper review/personalization, not missing core study surfaces

## Completed Major Slices

- App shell with mobile-first route structure: Today, Missions, Progress, Review, Settings, Mission detail
- Typed content model with Zod validation and relation checks at load time
- Starter content pack wired through a loader and `byId` indexes
- Today screen with deterministic recommendations and continue-mission resume
- Today recommendation heuristics updated to be more review-aware about fresh/repeated weak points and recent review completion
- Missions page with real library state for recommended, unlocked, locked, completed, and weak-point pressure
- Settings page with local study-data reset controls and listening-audio coverage status
- Grammar mission player
- Listening mission player with staged reveal and optional audio playback
- Output mission player with local rule-based answer checking and short diagnostic feedback
- Reading mission player v1 with Japanese-first comprehension checks and compact reveal
- Reading slice v2 with a second beginner reading mission for simple questions and answers
- Reading slice v3 with a third beginner reading mission for location questions and answers
- Reading slice v4 with a fourth beginner reading mission for preferences and simple opinion questions
- Reading slice v5 with a fifth beginner reading mission for identity and daily routine lines
- Reading slice v6 with a sixth beginner reading mission for time, weekday-plan, and transport lines from packs 12 to 14
- Reading slice v7 with a seventh beginner reading mission for navigation, invitation, and meetup lines from packs 15 to 17
- Reading slice v8 with an eighth beginner reading mission for time-range and calendar lines from packs 21 to 23
- Reading slice v9 with a ninth beginner reading mission for invitation, meetup, and appointment recombination from packs 19 to 23
- Reading slice v10 with a tenth beginner reading mission for shopping quantities and prices from packs 11 and 24 to 25
- Reading slice v11 with an eleventh beginner reading mission for store availability and choice lines from packs 11, 24, and 26
- Reading slice v12 with a twelfth beginner reading mission for shop lines with prices, decisions, and simple action flow from packs 25 to 29
- Reading slice v13 with a thirteenth beginner reading mission for routines, action order, and current-state lines from packs 28 to 29
- Reading slice v14 with a fourteenth beginner reading mission for adjective contrast and past descriptions from packs 8, 30, and 31
- Reading slice v15 with a fifteenth beginner reading mission for comparison and stronger preference lines from packs 4, 8, and 32
- Local mission completion persistence
- Weak-point tracking from incorrect answers
- Review page with focused retry batches
- Review page now summarizes the last completed batch and immediately surfaces the next deterministic retry batch when weak points remain
- Progress page with simple skill-map tiers derived from completions and misses
- Content expansion pack 3 around existence and room/object locations
- Content expansion pack 4 around likes, dislikes, and simple preference questions
- Content expansion pack 5 around where-questions with `どこですか` and simple location answers
- Content expansion pack 6 around possession and family/object identification with `の`
- Content expansion pack 7 around simple everyday verb forms with `ます` and `ません`
- Content expansion pack 8 around simple descriptive adjective lines for daily objects, places, and people
- Content expansion pack 9 around polite past-tense recent-action lines with `ました` and `ませんでした`
- Content expansion pack 10 around simple permission and request lines with `てもいいですか` and `てください`
- Content expansion pack 11 around simple shopping and buying basics with `をください` and `をかいます`
- Content expansion pack 12 around time and schedule basics with `なんじですか` and time + `に`
- Content expansion pack 13 around weekdays and simple plans with `Xようびに` and `なにをしますか`
- Content expansion pack 14 around transport and movement basics with transport `で` and destination `まで`
- UX polish slice to tighten the Today session summary and give the Progress skill map a page-specific, non-overflowing layout
- Local romaji-to-kana assist plus kana-equivalent answer normalization for typed Japanese entry across grammar and output flows
- Content expansion pack 15 around simple directions and navigation basics with `みぎにまがります`, `まっすぐいきます`, and short place answers
- Content expansion pack 16 around simple invitations and plan-making basics with `いっしょにいきますか`, `なんじにあいますか`, and short yes / no plan responses
- Content expansion pack 17 around simple meeting-place coordination with `どこであいますか`, `えきであいます`, and `えきまえであいます`
- Content expansion pack 18 around short arrival and waiting status updates with `つきました`, `いまえきです`, and `えきでまっています`
- Content expansion pack 19 around polite suggestions with `〜ませんか` for simple meetup, food, drink, and study plans
- Content expansion pack 20 around direct plan proposals with `〜ましょう` and short decision questions with `〜ましょうか`
- Content expansion pack 21 around simple time-range control with `から / まで` and short start/end time questions
- Content expansion pack 22 around date planning with `いつ`, `なんがつ`, `なんにち`, and practical month/day lines
- Content expansion pack 23 around fuller calendar appointment and plan-recombination lines that combine dates, times, and meetup language
- Content expansion pack 24 around simple quantity questions with `いくつ` and short request lines with `ひとつ / ふたつ / みっつ`
- Content expansion pack 25 around basic price questions with `いくらですか` and fixed `X円です` price answers
- Content expansion pack 26 around store availability and short choice lines like `みずはありますか`, `それをください`, and `これでいいです`
- Content expansion pack 27 around a tightly scoped everyday て-form core with practical request and permission lines
- Content expansion pack 28 around short action-sequence lines with `〜て、それから...` and `〜てから`
- Content expansion pack 29 around carefully limited `〜ています` lines for current actions, waiting status, and stable present states
- Content expansion pack 30 around adjective negatives with `くないです` and `じゃないです` for more honest everyday descriptions
- Content expansion pack 31 around adjective past descriptions with `かったです` and `でした` for recalling impressions and conditions
- Content expansion pack 32 around comparison with `より / のほうが` for food, place, transport, and preference contrasts
- Listening-audio manifest workflow with checked-in asset coverage and sync script support
- Dev-only shipped-pack registry for shipped content packs to support curriculum QA and planning integrity
- Local QA report scripts for content coverage, reading reuse, and BUILD_STATUS summary verification
- Local QA report scripts for progression gaps and content-overlap/template-drift checks
- Reading mission QA cleanup to reduce single-pack concentration in two early reading slices and align pack-registry reinforcement tags with repo-native grammar metadata

## Current App Capabilities

- User can open Today and get up to 3 recommendations:
  - review first if weak points exist
  - next unlocked incomplete mission
  - one support slot that stabilizes urgent weak-point missions or falls back to reinforcement / light pass
- User can open Missions and see all current missions with:
  - recommended-today membership
  - unlocked / locked state
  - completed state
  - weak-point pressure by mission
  - plain-language unlock requirements
- User can open Settings and:
  - reset mission progress, weak points, review loop, or continue state independently
  - reset all local study data with explicit confirmation
  - see listening-audio coverage based on a checked-in manifest
- User can resume the last active mission from local continue state
- User can complete 111 starter missions across 4 mission types:
  - 32 grammar
  - 32 listening
  - 32 output
  - 15 reading
- Grammar missions currently include:
  - lesson intro
  - example sentences
  - common mistakes
  - interactive drills
- Listening missions currently include:
  - optional audio player if static file exists
  - staged reveal for transcript, reading, translation, focus point
  - one multiple-choice meaning check per listening item
- Output missions currently include:
  - short prompt
  - optional hint
  - textarea response
  - optional local romaji-to-hiragana assist for Latin-keyboard entry
  - local evaluation with normalization, explicit accepted answers, and token-pattern diagnostics for close answers
- Typed Japanese entry currently used in grammar and output flows:
  - supports optional local romaji-to-hiragana assist
  - accepts hiragana and katakana as equivalent for answer checking
  - still preserves canonical spellings from content in prompts, examples, and expected-answer feedback
- Reading missions currently include:
  - Japanese text shown first
  - one local multiple-choice comprehension decision per line before reveal
  - compact reveal of reading, meaning, and a short support note after submission
- Review loop currently:
  - selects top weak points by miss count, then recency
  - caps batch size at 3
  - decrements or clears weak points on successful retry
  - supports grammar drills, listening checks, output tasks, and reading checks
  - shows last-batch clearance vs unresolved items and whether another short retry batch is ready
- Today heuristics currently:
  - mark review as more urgent when weak points are fresh, repeated, or numerous
  - keep the same small 3-slot plan: review, next step, then one support slot
  - turn the third slot into a mission-level stabilize recommendation when unresolved weak points are urgent
  - avoid immediately reusing just-reviewed missions for generic reinforcement when review pressure is low
- Progress screen currently shows:
  - mission completion totals
  - weak-point totals
  - skill tiers for particles, verb forms, sentence structure, listening comprehension, reading recognition, and output confidence
- Current content themes now include:
  - topic statements with `は` / `です`
  - place of action with `で`
  - `なんですか` classroom questions
  - destination with `に` + `いきます`
  - existence with `あります` / `います`
  - room/object position with `の + うえ / した / なか + に`
  - likes and dislikes with `が すきです / きらいです`
  - simple preference questions like `なにがすきですか`
  - where-questions with `どこですか`
  - possession and family/object lines like `これはわたしのほんです` and `それはあねのかばんです`
  - simple daily-life verb-form lines like `あさパンをたべます` and `きょうコーヒーをのみません`
  - simple recent-action verb-form lines like `きのうほんをよみました` and `きのうコーヒーをのみませんでした`
  - simple permission and request lines like `みずをのんでもいいですか` and `ちょっとまってください`
  - simple shopping lines like `これをください`, `みずをかいます`, and `コンビニでおかしをかいます`
  - simple time and schedule lines like `なんじですか`, `しちじです`, and `はちじにがっこうにいきます`
  - simple weekday plan lines like `げつようびにがっこうにいきます`, `どようびになにをしますか`, and `にちようびはうちでやすみます`
  - simple transport and movement lines like `バスでいきます`, `どこまでいきますか`, and `えきまであるきます`
  - simple navigation and direction lines like `みぎにまがります`, `まっすぐいきます`, and `えきはあそこです`
  - simple invitation and plan lines like `いっしょにいきますか`, `どようびにいきますか`, `なんじにあいますか`, `はい、いきます`, and `いいえ、いきません`
  - simple meeting-place coordination lines like `どこであいますか`, `えきであいます`, `えきまえであいます`, and short landmark answers like `としょかんのまえであいます`
  - short meetup status lines like `つきました`, `いまえきです`, `かいさつのまえでまっています`, and `すぐいきます`
  - polite suggestion lines with `〜ませんか` like `ろくじにあいませんか`, `コーヒーをのみませんか`, and `いっしょにべんきょうしませんか`
  - direct plan proposals with `〜ましょう` and short decision questions with `〜ましょうか` like `ろくじにあいましょう`, `えきであいましょう`, and `なにをしましょうか`
  - simple time-range lines with `から / まで` like `じゅぎょうはくじからです`, `くじからごじまでです`, and `なんじからなんじまでですか`
  - simple date and month planning lines like `いつあいますか`, `なんがつにいきますか`, `しがつみっかにあいます`, and `ごがつようかにとしょかんにいきます`
  - fuller calendar appointment and plan lines like `しがつみっかのろくじにあいます`, `いつあいましょうか`, and `ごがつようかにとしょかんにいきましょうか`
  - simple quantity and counter lines like `いくつかいますか`, `ひとつください`, and `パンをみっつください`
  - simple price lines like `これはいくらですか`, `これはひゃくえんです`, and `このほんはごひゃくえんです`
  - short store availability and selection lines like `みずはありますか`, `はい、あります`, `それをください`, and `これでいいです`
  - a tightly scoped everyday て-form core in familiar request and permission lines like `パンをたべてください`, `えきにいってもいいですか`, and `これをかってください`
  - short action-sequence lines with `〜て、それから...` and `〜てから` like `あさパンをたべて、それからがっこうにいきます` and `コーヒーをのんでからべんきょうします`
  - carefully limited `〜ています` lines for current actions and stable-present states like `いまほんをよんでいます`, `いまえきでまっています`, and `とうきょうにすんでいます`
  - simple adjective lines like `ほんはおもしろいです`, `へやはしずかです`, and `あたらしいカメラです`
  - adjective negative lines like `ほんはおもしろくないです`, `へやはしずかじゃないです`, and `このみせはやすくないです`
  - adjective past lines like `ほんはおもしろかったです`, `パンはおいしかったです`, and `へやはしずかでした`
  - simple comparison lines with `より / のほうが` like `コーヒーよりおちゃのほうがすきです`, `えきよりとしょかんのほうがしずかです`, and `バスよりでんしゃのほうがはやいです`
  - short location answers with `ここ / そこ / あそこ` and existing location phrases
  - simple reading questions and answers like `これはなんですか`, `これはほんです`, and `たべものはなにがすきですか`
  - location-focused reading prompts like `かぎはどこですか`, `トイレはあそこです`, and `せんせいはじむしょにいます`
  - preference-focused reading prompts like `えいががすきですか`, `アニメがすきです`, and `わたしはコーヒーがきらいです`
  - identity and daily-routine reading prompts like `わたしはがくせいです`, `うちでにほんごをべんきょうします`, and `まいにちがっこうにいきます`
  - time, weekday-plan, and travel reading prompts like `なんじですか`, `どようびになにをしますか`, and `どこまでいきますか`
  - directions, invitation, and meetup reading prompts like `まっすぐいきます`, `いっしょにいきますか`, and `どこであいますか`
  - calendar and time-range reading prompts like `くじからごじまでです`, `いつあいますか`, and `しがつみっかにあいます`
  - fuller appointment and plan reading prompts like `しがつみっかのろくじにあいます`, `えきであいましょう`, and `ごがつようかにとしょかんにいきましょうか`
  - shopping quantity and price reading prompts like `りんごをふたつかいます`, `これはいくらですか`, and `パンはにひゃくえんです`
  - store availability and choice reading prompts like `みずはありますか`, `はい、あります`, and `これでいいです`

## Known Limitations / Gaps

- Content is still small starter content only:
  - 64 grammar lessons
  - 331 example sentences
  - 270 vocab items
  - 159 listening items
  - 111 missions
- Mission completion is manual; there is no auto-complete logic
- Continue state restores mission/step only, not in-progress answers
- Output evaluation is still intentionally narrow; it now supports explicit token-pattern checks and close-answer feedback, but it still does not do broad semantic grading or AI feedback
- Listening checks are translation-choice only after reveal; no pre-reveal comprehension scoring
- Reading slice is still intentionally small: 15 reading missions with 75 total multiple-choice checks, all built from existing example sentences
- Verb-form coverage is now instrumented across present, negative present, polite past, and simple negative past, but it is still a narrow beginner slice rather than broad conjugation coverage
- Permission and request coverage now exists, but it is still a narrow beginner slice rather than broad command / request / politeness coverage
- Shopping coverage now includes quantities, prices, availability checks, and short choice lines, but it is still a narrow beginner slice rather than broader payment, returns, or service-interaction coverage
- Time and schedule coverage now includes clock time, weekday plans, time ranges, and basic calendar dates, but it is still a narrow beginner slice rather than broader availability, recurrence, or full real-world scheduling coverage
- Weekday and calendar planning coverage now exists, but it is still a narrow beginner slice rather than broader future-planning, comparison, or negotiation coverage
- Transport and movement coverage now exists, but it is still a narrow beginner slice rather than broader travel-planning, directions, or comparison coverage
- Direction and navigation coverage now exists, but it is still a narrow beginner slice rather than broader route-following, landmarks, or multi-step navigation coverage
- Invitation and plan-making coverage now exists, but it is still a narrow beginner slice rather than broader suggestion, availability, or future-planning coverage
- Meeting-place coordination coverage now exists, but it is still a narrow beginner slice rather than broader schedule negotiation, lateness handling, or route-specific meetup talk
- Arrival and waiting status coverage now exists, but it is still a narrow beginner slice rather than broader delay handling, travel-problem language, or full `〜ています` coverage
- Suggestion coverage with `〜ませんか` now exists, but it is still a narrow beginner slice rather than broader refusal, availability, or negotiation coverage
- Proposal coverage with `〜ましょう / 〜ましょうか` now includes simple calendar recombination, but it is still a narrow beginner slice rather than broader decision-making or comparison-driven planning coverage
- Date and appointment coverage now exists, but it is still a narrow beginner slice rather than broader reservations, deadlines, or schedule-change language
- The new て-form family is intentionally narrow: it covers a small practical verb set, short sequencing, and limited `〜ています`, but it is not yet broad te-form utility, contrastive verb-family training, or wider connective grammar
- Adjective coverage now includes negatives, past descriptions, and beginner comparison, but it is still a narrow descriptive slice rather than full adjective tense/degree nuance or open-ended opinion language
- Comparison coverage now exists, but it is still limited to short `より / のほうが` lines rather than rankings, reasons, or multi-clause justification
- Current listening audio coverage is partial again for the expanded worktree content set until a manual audio pass lands for packs 30 to 32
- Typed Japanese input now has a local romaji-to-kana assist and kana-equivalent answer matching, but it is intentionally basic, hiragana-first, and not a full IME or kanji conversion system
- Review loop is deterministic but simple; no spaced repetition, scheduling, or recommendation weighting beyond current heuristics
- Review flow is now deeper inside the Review page itself, but it still does not do multi-stage scheduling, spaced repetition, or hidden urgency scoring
- Today is now more review-aware, but recommendation logic is still intentionally simple and deterministic rather than adaptive or scheduled
- Skill map heuristics are intentionally rough and based only on completions + recorded misses
- No speech input or pronunciation scoring
- Settings is intentionally small; there is still no broader preferences system beyond reset controls and audio status
- No account, sync, backend, analytics, or CMS
- No automated tests are present in the inspected slice

## Next Recommended Slices

1. Generate and sync listening audio for the 15 new listening items from packs 30 to 32 when doing the next manual audio pass.
2. Implement Batch 6 from `N5_CURRICULUM_PLAN.md`: `いちばん`, frequency adverbs, and simple reasons with `から`, then add the planned reading follow-up in the same pass.
3. Run the planned five-pack curriculum audit now that packs 28 to 32 are shipped, with special attention to adjective naturalness and English-shaped comparison lines.
4. Keep expanding output content through the current token-pattern evaluation path rather than broadening into AI grading.
5. Keep BUILD_STATUS, the pack registry, and the listening-audio manifest updated whenever content or generated assets change.

## Important Architecture Constraints

- Preserve local-first MVP architecture; there is no backend dependency in the current app loop
- Keep TypeScript-only and avoid adding dependencies without a narrow reason
- Keep content schema-driven and hand-editable
- Content currently lives in TypeScript modules under `src/content`, not JSON or a CMS
- `src/content/contentPacks.ts` is a dev-only curriculum manifest for planning and QA; it does not drive runtime mission flow
- `src/lib/content/loader.ts` validates schema shape, duplicate IDs, and cross-reference integrity at load time
- Progress stores use `useSyncExternalStore` + `localStorage`, not hidden global state
- Recommendation/review logic is intentionally deterministic and readable; avoid opaque adaptive logic unless explicitly requested
- Thin vertical slices fit the repo better than broad refactors

## Local Persistence Keys In Use

- `japanese-os.mission-progress.v1`
- `japanese-os.weak-points.v1`
- `japanese-os.review-loop.v1`
- `japanese-os.continue-state.v1`

## Content-Model Notes

- Mission types: `grammar`, `listening`, `output`, `reading`
- Target skills: `particles`, `verb-forms`, `sentence-structure`, `listening-comprehension`, `reading-recognition`, `output-confidence`
- Grammar drills support `multiple-choice`, `reorder`, and `fill-in`
- Missions reference content through explicit `contentRefs`
- Output prompts are embedded directly in mission records as `outputTasks`
- Reading checks are embedded directly in mission records as `readingChecks`
- Output tasks may include optional local evaluation token patterns for more forgiving rule-based checking
- Unlock rules currently support `requiredMissionIds`
- Current starter content is beginner/N5-oriented and centered on:
  - topic statements with `は` / `です`
  - place of action with `で`
  - `なんですか` classroom questions
  - destination with `に` + `いきます`
  - existence with `あります` / `います`
  - position words with `の + うえ / した / なか + に`
  - possession with `noun + の + noun`
  - polite present and negative daily-life verbs with `ます` / `ません`
  - polite recent-action and negative-past verbs with `ました` / `ませんでした`
  - simple permission and request patterns with `てもいいですか` and `てください`
  - a tightly scoped everyday て-form core with familiar request/permission lines, short action sequencing with `て / てから`, and carefully limited `〜ています`
  - simple shopping request and buying patterns with `これをください`, `このほんをください`, and `X をかいます`
  - simple quantity patterns with `いくつ`, `ひとつ / ふたつ / みっつ`, and short counter requests with `ください`
  - simple price patterns with `いくらですか` and fixed `X円です` answers
  - simple store availability and choice patterns with `Xはありますか`, `はい、あります`, `それをください`, and `これでいいです`
  - simple time-question and schedule patterns with `なんじですか`, `Xじです`, and `Xじに ...`
  - simple weekday plan patterns with `Xようびに ...` and `Xようびになにをしますか`
  - simple time-range patterns with `Xじから`, `Xじまで`, and `なんじからなんじまでですか`
  - simple calendar question patterns with `いつ`, `なんがつに`, and `なんにちに`
  - simple appointment recombination patterns with `date + の + time + に`
  - simple transport and movement patterns with transport `で`, destination `まで`, and questions like `どこまでいきますか`
  - simple direction and navigation patterns with `みぎにまがります`, `ひだりにまがります`, `まっすぐいきます`, and place answers like `えきはあそこです`
  - simple invitation and plan-making patterns with `いっしょにいきますか`, `Xようびにいきますか`, `なんじにあいますか`, and short yes / no plan responses
  - simple meeting-place coordination patterns with `どこであいますか`, `Xであいます`, `えきまえであいます`, and short landmark meetup lines
  - simple adjective predicates like `ほんはおもしろいです` and `へやはしずかです`
  - adjective plus noun phrases like `あたらしいカメラ` and `しずかなへや`
  - preferences with `が すきです / きらいです`
  - category questions like `たべものはなにがすきですか`
  - where-questions like `トイレはどこですか`
  - location answers like `トイレはあそこです` and `かぎはつくえのうえにあります`
  - family/object ownership like `これはちちのカメラです` and `それはははのかさです`
  - fifteen reading-recognition missions that reuse existing example sentences for Japanese-first comprehension checks

## Audio / TTS Notes

- Listening items may include `audioRef`; all 159 current listening items point to static files under `public/audio/listening`
- Matching MP3 files currently exist for 144 of the 159 listening items
- Manifest-backed listening-audio coverage is currently partial for the expanded worktree content set
- Settings currently reports partial listening-audio coverage until the new pack 30 to 32 files are generated and synced
- Settings derives audio coverage from a checked-in manifest in `src/lib/audio/listeningAudioAssets.ts`, not from runtime filesystem checks
- Listening audio generation script exists at `scripts/generate-listening-audio.ts`
- Manifest sync script exists at `scripts/sync-listening-audio-manifest.ts`
- `npm run generate:listening-audio` now syncs the manifest after a generation run
- `npm run sync:listening-audio-manifest` rewrites the manifest from the current `public/audio/listening` folder
- Current generator uses the OpenAI Speech API with defaults:
  - model `gpt-4o-mini-tts`
  - voice `marin`
  - format `mp3`
- If audio is missing or fails to load, the app falls back to the transcript-first listening flow
- There is no in-app TTS generation or audio preference UI yet

## How To Continue Safely In Codex

- Re-read `constitution.md`, `PRODUCT_SPEC.md`, `ROADMAP.md`, and `PROMPTS/README.md` before changing implementation
- Prefer one thin slice at a time; do not broaden scope into backend, AI tutor, or major architecture changes
- Use repo reality over roadmap assumptions; inspect the current route/component/content files first
- Preserve the existing typed content and local-store patterns unless the task explicitly calls for change
- Avoid unrelated refactors while expanding missions, progress, or review behavior
- When extending content, keep IDs explicit and let the existing loader/schema checks enforce integrity
- For audio work, check `public/audio/listening` before assuming a referenced `audioRef` file already exists
