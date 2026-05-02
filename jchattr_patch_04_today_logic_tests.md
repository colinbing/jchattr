# Patch 04 - Today Logic Tests

## Tests Added

- Urgent review appears before pushing farther into the path.
- Scenario/application missions are excluded from Today mission recommendations.
- Capstone closeout appears when source packs are complete.
- Capstone closeout does not appear before source missions are complete.
- Capstone closeout is held when Review is urgent.
- Completed missions remain available as reinforcement without focus-mode bias.
- Unresolved weak points remain available for future review even after a same-day review key can be satisfied.
- Default and reinforce daily plan keys for the same mission do not satisfy each other.
- Completed daily plan item keys remain separate across the 3 AM ET study-day rollover.
- Same-day plan snapshots persist when live recommendations shift after local study state exists.

## Behaviors Protected

- Historical mission completion does not auto-complete today's reinforce item.
- Completing `mission:<id>:reinforce` does not complete `mission:<id>:default`.
- Today plan keys stay exact per study day.
- Core Today recommendations stay app-directed by review pressure, curriculum order, capstone readiness, and reinforcement.
- Bonus filtering avoids duplicating a current core mission/capstone.

## Commands Run

- `npm run typecheck`
- `npm run test`
- `npm run build`

## Confirmed Bugs Found

- None.

## Next Recommended Patch

Add a lightweight Today QA fixture for rendering no-bonus, one-bonus, review-return, reinforce-plan, and completed-summary states without relying on manual browser localStorage setup.
