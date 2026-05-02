# Patch 03 - Focus Cleanup

## Files Changed

- `src/features/missions/routes/MissionsPage.tsx`
- `src/features/settings/routes/SettingsPage.tsx`
- `src/features/today/lib/todayRecommendations.ts`
- `src/features/today/lib/todayRecommendations.test.ts`
- `src/lib/settings/studyPreferences.ts`
- `src/lib/settings/studyPreferences.test.ts`

## Symbols Removed

- `StudyFocusMode`
- `StudyFocusModeOption`
- `STUDY_FOCUS_MODE_OPTIONS`
- `setStudyFocusMode`
- `StudyPreferencesRecord.focusMode`
- `TodayRecommendationOptions.studyFocusMode`
- `getStudyFocusMissionScore`
- `getClassPrepMissionScore`
- `buildStudyFocusReason`
- `withStudyFocusReason`

## Commands Run

- `npm run typecheck`
- `npm run test`
- `npm run build`

## Tests Added

- Today recommendations still surface capstone closeout when source packs are complete.
- Today recommendations still keep completed missions available as reinforcement.
- Legacy study-preference records containing `focusMode` parse safely while preserving `readingDisplayMode`.

## Manual QA

- Opened Today at `http://127.0.0.1:5173/`.
- Confirmed no Study focus / focus-mode control appears.
- Confirmed Today still renders a core plan action.
- Confirmed optional bonus practice still appears in the tested local state.
- Opened Settings and confirmed the old Study focus card is gone.
- Confirmed Reading display remains visible.
- Opened `mission-reading-starter-recognition` and confirmed the mission reader loads.
- Browser console error count: 0.

## Known Risks

- Existing localStorage records may still contain an unused `focusMode` property until rewritten, but app parsing now ignores it safely.
- Recommendation ordering is now driven only by curriculum/review/reinforcement signals; any learner who had selected a focus mode will no longer see that bias.

## Next Recommended Patch

Polish the optional bonus practice layout now that the broad focus toggle is gone, keeping Today plan completion semantics untouched.
