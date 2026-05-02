# Patch 05 - Mission Summary Expected IDs

## Files Changed

- `src/app/router.tsx`
- `src/features/missions/components/GrammarMissionPlayer.tsx`
- `src/features/missions/components/ListeningMissionPlayer.tsx`
- `src/features/missions/components/OutputMissionPlayer.tsx`
- `src/features/missions/components/ReadingMissionPlayer.tsx`
- `src/features/missions/lib/missionCompletion.ts`
- `src/features/missions/lib/missionCompletion.test.ts`
- `src/features/today/routes/TodayQaFixturePage.tsx`

## Tests Added

- Mission summaries ignore stale keys outside the expected active item IDs.
- Mission summaries count by explicit expected IDs instead of object insertion order.
- Missing expected outcomes keep the mission incomplete even when stale keys are present.

## Commands Run

- `npm run typecheck`
- `npm run test`
- `npm run build`

## Manual QA Notes

- Opened DEV-only Today QA fixture route at `/dev/today-qa/one-bonus`; fixed fixture rendered without localStorage setup.
- Opened grammar mission and answered one drill correctly; saw `1/2 drills attempted · 1 correct`.
- Opened listening mission and revealed support; support/reveal copy stayed visible and no console error appeared.
- Opened output mission and answered incorrectly; incorrect/review-style copy appeared.
- Opened reading mission and answered one check correctly; saw `1/5 reading checks attempted · 1 correct`.
- Browser console error count after mission checks: 0.

## Known Risks

- The Today QA fixture is a DEV-only route and mirrors Today surfaces with fixed data; it is not a full integration render of `TodayPage` state wiring.
- Mission summary callers now pass session item ID arrays. If a future mission player tracks outcomes for a derived item without including its ID in the active session list, that item will be intentionally ignored.

## Next Recommended Patch

Add automated browser checks for `/dev/today-qa/no-bonus`, `/dev/today-qa/one-bonus`, `/dev/today-qa/review-return`, `/dev/today-qa/reinforce-plan`, and `/dev/today-qa/completed-summary`.
