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
- Listening-audio manifest workflow with checked-in asset coverage and sync script support

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
- User can complete 56 starter missions across 4 mission types:
  - 17 grammar
  - 17 listening
  - 17 output
  - 5 reading
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
  - simple adjective lines like `ほんはおもしろいです`, `へやはしずかです`, and `あたらしいカメラです`
  - short location answers with `ここ / そこ / あそこ` and existing location phrases
  - simple reading questions and answers like `これはなんですか`, `これはほんです`, and `たべものはなにがすきですか`
  - location-focused reading prompts like `かぎはどこですか`, `トイレはあそこです`, and `せんせいはじむしょにいます`
  - preference-focused reading prompts like `えいががすきですか`, `アニメがすきです`, and `わたしはコーヒーがきらいです`
  - identity and daily-routine reading prompts like `わたしはがくせいです`, `うちでにほんごをべんきょうします`, and `まいにちがっこうにいきます`

## Known Limitations / Gaps

- Content is still small starter content only:
  - 34 grammar lessons
  - 179 example sentences
  - 188 vocab items
  - 84 listening items
  - 56 missions
- Mission completion is manual; there is no auto-complete logic
- Continue state restores mission/step only, not in-progress answers
- Output evaluation is still intentionally narrow; it now supports explicit token-pattern checks and close-answer feedback, but it still does not do broad semantic grading or AI feedback
- Listening checks are translation-choice only after reveal; no pre-reveal comprehension scoring
- Reading slice is still intentionally small: 5 reading missions with 25 total multiple-choice checks, all built from existing example sentences
- Verb-form coverage is now instrumented across present, negative present, polite past, and simple negative past, but it is still a narrow beginner slice rather than broad conjugation coverage
- Permission and request coverage now exists, but it is still a narrow beginner slice rather than broad command / request / politeness coverage
- Shopping coverage now exists, but it is still a narrow beginner slice rather than broader money, quantity, price, or transaction coverage
- Time and schedule coverage now exists, but it is still a narrow beginner slice rather than broader calendar, day-of-week, or time-range coverage
- Weekday plan coverage now exists, but it is still a narrow beginner slice rather than broader future-planning or calendar expression coverage
- Transport and movement coverage now exists, but it is still a narrow beginner slice rather than broader travel-planning, directions, or comparison coverage
- Direction and navigation coverage now exists, but it is still a narrow beginner slice rather than broader route-following, landmarks, or multi-step navigation coverage
- Invitation and plan-making coverage now exists, but it is still a narrow beginner slice rather than broader suggestion, availability, or future-planning coverage
- Meeting-place coordination coverage now exists, but it is still a narrow beginner slice rather than broader schedule negotiation, lateness handling, or route-specific meetup talk
- Adjective coverage is now present, but it is still one narrow beginner pack rather than broad adjective contrast or tense coverage
- Current listening audio coverage is complete again for the current worktree content set
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

1. Implement the next narrow content pack in the current schema before adding new systems, especially another grammar/listening/output pack for repeated daily use.
2. Expand output content using the current token-pattern evaluation path rather than broadening into AI grading.
3. Deepen review usefulness with more deterministic retry/recommendation refinements only if they stay explicit and local-first.
4. Improve the current kana assist only if it stays dependency-light and explicit rather than turning into a broad IME system.
5. Keep BUILD_STATUS and the listening-audio manifest updated whenever content or generated assets change.

## Important Architecture Constraints

- Preserve local-first MVP architecture; there is no backend dependency in the current app loop
- Keep TypeScript-only and avoid adding dependencies without a narrow reason
- Keep content schema-driven and hand-editable
- Content currently lives in TypeScript modules under `src/content`, not JSON or a CMS
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
  - simple shopping request and buying patterns with `これをください`, `このほんをください`, and `X をかいます`
  - simple time-question and schedule patterns with `なんじですか`, `Xじです`, and `Xじに ...`
  - simple weekday plan patterns with `Xようびに ...` and `Xようびになにをしますか`
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
  - five reading-recognition missions that reuse existing example sentences for Japanese-first comprehension checks

## Audio / TTS Notes

- Listening items may include `audioRef`; all 84 current listening items point to static files under `public/audio/listening`
- Matching MP3 files currently exist for all 84 listening items
- Manifest-backed listening-audio coverage is fully aligned with the current worktree content set
- Settings currently reports full listening-audio coverage for the existing content set
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
