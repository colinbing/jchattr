# Patch 02: Today Plan Completion Semantics

## Files changed
- `src/features/today/routes/TodayPage.tsx`
- `src/features/review/routes/ReviewPage.tsx`
- `src/features/missions/components/CapstoneStoryPlayer.tsx`
- `src/features/today/lib/todayPlanCompletion.ts`
- `src/features/today/lib/todayPlanCompletion.test.ts`
- `src/features/today/lib/todayPlanKeys.ts`
- `src/features/today/lib/todayPlanKeys.test.ts`
- `src/lib/progress/dailySession.ts`
- `src/lib/progress/dailySession.test.ts`

## Summary
- Added per-study-day completed plan item key tracking to daily session storage.
- Added stable Today plan keys:
  - review: `review-loop`
  - mission: `mission:${missionId}:${sessionMode ?? 'default'}`
  - capstone: `capstone:${capstoneStoryId}:${capstoneMode ?? 'closeout'}`
- Updated Today mission, review, and capstone completion semantics so global progress still drives unlocks and recommendations, but a Today plan item is only complete when its exact current study-day plan key is complete.
- Marked the matching mission plan key complete when a mission returns to Today with `missionCompletion`.
- Marked `review-loop` complete when a review batch finishes.
- Marked the matching capstone mode key complete when a capstone/story pass finishes.
- Preserved older daily session records that do not have `completedPlanItemKeysByStudyDay`.
- Normalized stored legacy Today snapshot keys without changing layout.

## Commands run
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Tests added
- Previous mission completion does not auto-complete a Today reinforce mission item.
- Completing today’s reinforce key marks that reinforce item complete.
- Review is complete only when today’s review key is completed.
- Capstone is complete only when today’s capstone key is completed.
- Default and reinforce keys for the same mission are distinct.
- Closeout and recombination capstone keys for the same story are distinct.
- Daily session records without `completedPlanItemKeysByStudyDay` parse safely.
- 3 AM ET study-day rollover behavior remains intact.

## Manual QA
- Simulated a completed mission appearing as today’s reinforce item.
- Confirmed it was not marked done before being practiced today.
- Completed the reinforce item from Today and confirmed Today became complete.
- Simulated the same mission with only the reinforce key completed and confirmed the default key remained open.
- Simulated a review plan with no live weak points and confirmed it stayed open until `review-loop` was completed for today.
- Simulated a historically completed capstone in today’s plan and confirmed it stayed open until today’s capstone key was completed.
- Checked recent browser console logs after the final fix; no warnings or errors were emitted.

## Known risks
- Review completion now means a batch was completed today, even if unresolved weak points remain for a later retry.
- Capstone completion keys are written whenever a capstone/story pass finishes, including when launched outside Today; this is intentional because the item was practiced on the current study day.
- Older stored Today snapshots are normalized opportunistically when Today runs, but no explicit storage version bump was added.

## Next recommended patch
Address the desktop bonus layout separately without changing completion semantics.
