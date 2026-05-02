# Patch 02b: Today Bonus Layout

## Files changed
- `src/features/today/routes/TodayPage.tsx`
- `src/styles/global.css`

## Summary
- Removed the Today focus toggle from the bonus section.
- Changed the mission-finished return card into a compact disclosure that is collapsed by default.
- Added the high-level finished mission stat line to the disclosure summary:
  - attempted count
  - correct count
  - review item count
- Kept the detailed mission recap available inside the expanded disclosure.
- Changed the bonus section so bonus recommendations are visible directly instead of hidden behind a collapsed details row.
- Made the bonus section span the Today content grid so it no longer reads as a narrow half-width card after mission completion.

## Commands run
- `npm run typecheck`
- `npm run test`
- `npm run build`

## Visual QA notes
- Desktop wide: bonus section spans the Today content row and visible bonus cards align with the main Today module.
- Laptop-ish: mission completion disclosure stays compact, with detailed recap hidden until expanded.
- iPhone-like: bonus card remains a single stacked section; the removed focus toggle keeps the section shorter.
- One bonus option: visible directly with CTA; no collapsed details row.
- Multiple bonus options: visible directly in the bonus section; cards flow into the responsive bonus grid.
- Mission completion return: closed summary shows `7/7 attempted · 6 correct · 1 review item`; expanded state shows the existing recap details.
- Console: no recent warnings or errors during QA.

## Known risks
- The focus mode preference still exists in settings storage and recommendation utilities, but Today no longer exposes or reads it.
- No new wrong-item detail capture was added; the completion disclosure only uses the summary data already returned from mission completion.

## Next recommended patch
Add item-level mission completion detail capture only if the mission player can provide stable missed-item summaries without changing the daily plan semantics.
