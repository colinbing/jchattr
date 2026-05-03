> Archived historical document. Not current source of truth.

# Patch 02 — jp-immersion Stabilization

Patch 02 starts from Patch 01's stabilized local curriculum/review/progress loop. The goal is to harden the boundary for scenario/application practice before any broader `jp-immersion`, AI, chat, account, sync, analytics, or backend work.

## Boundary

- Preserve local-first architecture.
- Keep TypeScript-only app/runtime code.
- Treat existing scenario/application missions as deterministic output missions.
- Do not add backend, accounts, sync, analytics, or AI/chat runtime behavior.
- Do not add dependencies unless a slice explicitly requires them.
- Stabilize contracts before adding new scenario content or new scenario UI.

## End Goal

Patch 02 is complete when `jchattr` has a stable, auditable, local-first boundary for deterministic `jp-immersion` style scenario/application practice.

That means:

- existing scenario missions are validated as deterministic output missions;
- scenario coverage and gaps are visible before new content is added;
- at least one new scenario target has a review-only source-traceable draft outside `src/content`;
- the draft promotion path is documented before production content changes;
- no runtime AI, chat, backend, account, sync, analytics, or schema expansion has been added.

Patch 02 does **not** need to ship a full scenario library. It prepares the repo to add or import scenario content safely.

## Non-goals

- Do not port open chat, AI tutor, or `jp-immersion` runtime behavior.
- Do not add API endpoints, OpenAI calls, hidden browser keys, accounts, sync, analytics, or backend persistence.
- Do not change Today core recommendation behavior.
- Do not add new mission types or scenario UI surfaces unless a later gate explicitly approves it.
- Do not copy drafts into `src/content` until human review is complete.
- Do not treat coverage gaps as blockers; they are planning data.

## Patch 02 Gates

1. Scenario contract validation: ensure local scenario metadata cannot drift from deterministic output tasks.
2. Scenario inventory: report coverage by pack/setting and flag unsupported gaps.
3. Source-of-truth plan plus first review-only scenario draft: choose one uncovered range and draft one deterministic scenario outside `src/content`.
4. Human review checklist: review Japanese, readings, English, token patterns, source traceability, unlock point, and weak-point IDs for the draft.
5. Production promotion, optional and later: copy one reviewed scenario into `src/content`, run contract validation, content reports, tests, typecheck, build, and mobile QA.

Stop cleanly after any gate if the next action would add production Japanese, schema changes, runtime behavior, or broader UI changes.

## Validation Requirements

For code/tooling gates:

- `npm run test`
- `npm run typecheck`
- `npm run build`
- any focused test or report command added by the slice

For review-only draft gates:

- confirm the draft stays outside `src/content`;
- list source grammar lessons, vocab IDs, example IDs, and target pack IDs;
- include production promotion blockers;
- run `npm run report:scenario-inventory` if coverage status changes or is referenced.

For any production content promotion gate:

- `npm run report:scenario-inventory`
- `npm run report:content-coverage`
- `npm run report:progression-gaps`
- `npm run test`
- `npm run typecheck`
- `npm run build`
- mobile QA through Missions and the promoted scenario

## Draft Promotion Rules

A review-only scenario draft may become production content only after a human review confirms:

- every Japanese line is beginner-safe and natural enough for the app;
- every line is traceable to existing source examples or approved existing vocabulary;
- every token pattern matches the intended deterministic evaluator behavior;
- the scenario uses an existing supported setting and typed learner moves;
- the unlock requirement follows already completed local missions;
- weak-point IDs are unique and match output task IDs;
- the production object would satisfy `assertScenarioMissionContract`.

## Gate 1 audit — 2026-05-02 11:20 EDT

- Completed: Added pure validation for existing scenario/application mission contracts and wired it into content loading. Scenario missions now fail fast if metadata drifts from the linked output tasks or from mirrored mission content refs.
- Files changed: `src/lib/content/scenarioContracts.ts`, `src/lib/content/scenarioContracts.test.ts`, `src/lib/content/loader.ts`, `jchattr_patch_02_jp_immersion_stabilization.md`.
- Behavior changed: No UI behavior changed. Valid existing content loads as before; invalid local scenario content now throws during starter content loading.
- Contracts enforced: scenario missions remain output missions; current scenario moves must be learner typed moves; scenario source packs must be sorted and unique; scenario grammar/vocab/example refs must mirror `contentRefs`; scenario step order must match output task order; acceptable answers and token patterns must match linked output tasks; optional `weakPointItemId` must match the linked output task id.
- Commands run: `npm run test -- src/lib/content/scenarioContracts.test.ts`; `npm run test`; `npm run typecheck`; `npm run build`.
- Results: Focused scenario contract test passed (1 file, 7 tests). Full `npm run test` passed (12 files, 66 tests). `npm run typecheck` passed. `npm run build` passed with the existing Vite large chunk warning for `dist/assets/index-*.js`.
- Known issues: This does not import or model any `jp-immersion` runtime yet. It intentionally keeps scenarios as local deterministic output missions.
- Next recommended slice: Add a small scenario inventory/report test or script that summarizes current scenario coverage by pack/setting and flags unsupported gaps before any new scenario content is added.

## Gate 2 audit — 2026-05-02 11:43 EDT

- Completed: Added a local scenario inventory helper and report script so current application-practice coverage can be audited before adding or importing new scenario content.
- Files changed: `src/lib/content/scenarioInventory.ts`, `src/lib/content/scenarioInventory.test.ts`, `scripts/report-scenario-inventory.ts`, `package.json`, `jchattr_patch_02_jp_immersion_stabilization.md`.
- Behavior changed: No app/runtime behavior changed. This adds a developer-facing report command only.
- Report added: `npm run report:scenario-inventory` summarizes scenario mission count, setting distribution, per-pack coverage, uncovered pack ranges, and source-pack registry gaps.
- Current inventory result: 6 scenario missions; 12/50 packs covered; settings covered are classroom, meetup, store, health, and travel; uncovered ranges are packs 4-15, 18-24, 27-35, 37, 39-41, 43, and 46-50.
- Commands run: `npm run test -- src/lib/content/scenarioInventory.test.ts src/lib/content/scenarioContracts.test.ts`; `npm run report:scenario-inventory`; `npm run test`; `npm run typecheck`; `npm run build`.
- Results: Focused tests passed (2 files, 11 tests). Scenario inventory report ran successfully and returned the current known gaps above. Full `npm run test` passed (13 files, 70 tests). `npm run typecheck` passed. `npm run build` passed with the existing Vite large chunk warning for `dist/assets/index-*.js`.
- Known issues: Coverage gaps are warnings for planning, not release blockers. The report does not imply every pack needs a scenario before Patch 02 can proceed.
- Next recommended slice: Decide the first scenario content target from the inventory gaps, then add only a review-only draft/spec for one deterministic local scenario before touching production `src/content`.

## Gate 3 audit — 2026-05-02 11:49 EDT

- Completed: Expanded this Patch 02 document into the source-of-truth plan with end goal, non-goals, gates, validation requirements, and draft promotion rules. Added the first review-only deterministic scenario draft for Pack 4, the earliest uncovered inventory range.
- Files changed: `jchattr_patch_02_jp_immersion_stabilization.md`, `drafts/review-only/scenarios/pack-04-preference-chat.md`.
- Behavior changed: No app/runtime behavior changed. No production content changed.
- Draft added: `drafts/review-only/scenarios/pack-04-preference-chat.md`.
- Draft target: Pack 4 preference chat, candidate `mission-scenario-preference-chat`, setting `meetup`, unlock after `mission-output-preference-questions`.
- Source basis: `grammar-preference-suki-kirai`, `grammar-preference-questions`, `vocab-suki`, `vocab-yakyuu`, `vocab-nomimono`, `vocab-cha`, `ex-nomimono-nani-suki`, `ex-cha-suki`, and `ex-yakyuu-ga-suki-desu-ka`.
- Commands run: `npm run report:scenario-inventory`.
- Results: Scenario inventory still reports 6 production scenario missions, 12/50 packs covered, and the same uncovered ranges because this gate added only a review-only draft outside `src/content`.
- Known issues: The draft is not reviewed by a human, not copied into `src/content`, not validated as production content, and not mobile QA'd. It may be rejected or revised.
- Clean stop point: Stop here before any production content promotion or broader update. The next action should be human review of the Pack 4 draft or an explicit decision to choose a different uncovered range.

## Gate 4 audit — 2026-05-02 12:04 EDT

- Completed: Promoted the human-approved Pack 4 preference-chat draft into production content as one deterministic local scenario/application mission.
- Files changed: `src/content/missions.ts`, `drafts/review-only/scenarios/pack-04-preference-chat.md`, `jchattr_patch_02_jp_immersion_stabilization.md`.
- Behavior changed: Added one optional scenario mission, `mission-scenario-preference-chat`, unlocked after `mission-output-preference-questions`. No Today core recommendation behavior, runtime AI/chat behavior, backend, accounts, sync, analytics, or schema behavior changed.
- Production scenario: `Scenario: ask about simple preferences`; setting `meetup`; source packs `[4]`; 3 typed learner moves; deterministic output task evaluation; weak-point IDs match output task IDs.
- Commands run: `npm run report:scenario-inventory`; `npm run report:content-coverage`; `npm run report:progression-gaps`; `npm run test`; `npm run typecheck`; `npm run build`; `npm run dev -- --host 127.0.0.1`.
- Results: Scenario inventory passed and now reports 7 production scenario missions with 13/50 packs covered; Pack 4 is covered and the first uncovered range now starts at packs 5-15. Content coverage passed with 206 missions and no capstone coverage regression. Progression gaps passed with 0 issues and 0 metadata warnings. Full `npm run test` passed (13 files, 70 tests). `npm run typecheck` passed. `npm run build` passed with the existing Vite large chunk warning for `dist/assets/index-*.js`.
- Mobile QA: Passed in a temporary Chrome CDP mobile viewport (`390x844`, DPR 3). Seeded only `mission-output-preference-questions` as completed, opened Missions, confirmed the promoted scenario appears under the optional application block for Chapter 1 and is unlocked, opened `mission-scenario-preference-chat`, confirmed scenario brief/goal/moves/pack scope, submitted an incorrect first answer and confirmed weak-point creation, edited to a correct answer, completed the remaining two prompts, returned to Today, confirmed exposure completion with 3/3 attempted, 2 correct, 1 review item, not mastered. No app console/runtime errors were captured. Screenshot: `/tmp/jchattr-patch02-scenario-mobile.png`.
- Known issues: Existing Vite large chunk warning remains. Scenario inventory still has planning gaps across packs 5-15, 18-24, 27-35, 37, 39-41, 43, and 46-50. These are not release blockers.
- Clean stop point: Stop here before adding another production scenario or starting any broader `jp-immersion` runtime/UI update.
