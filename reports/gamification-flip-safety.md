# Gamification flip-safety review - FEATURE_GAMIFICATION

Date: 2026-06-09
Branch: `a5/gamification-flip-safety`
Source triage: old MR !391 (`d1/gamification-flip-safety`)

## Verdict

`FEATURE_GAMIFICATION` remains default-off and flip-safe for the tested surface.
No production source change was required.

Current main already had pure flag/streak-engine flip-safety coverage in
`src/features/gamification/__tests__/flipSafety.test.ts`. This refresh ports the
remaining live !391 verification gap as focused integration coverage:

- `GamificationPage` mounts when the flag is on.
- Streak, XP, daily-goal, and achievement widgets render with representative
  props.
- `gamificationNavItems()` exposes `/progress/play` only while the flag is on.
- `useGamification()` can load, record activity, award local gamification XP,
  set a goal, and complete a goal.
- IndexedDB absence falls back to the in-memory store, while the IndexedDB
  store remains no-op safe.
- Mocked live XP/streak writers are not called by render, activity, or
  goal-completion paths.

## Isolation Checked

The integration test mocks and asserts no calls to these live writer seams:

- `xpClient.awardXp`
- `awardXPEvent`
- `awardXPEventBackground`
- `publishXPAwarded`
- `setCachedStreak`
- `setStreakDays`

The page still reads canonical streak/points for display through
`pointsService.getStreakDays()` and `usePoints()`. Those reads are mocked in the
test so no auth, Supabase, or external service is required.

## Residual Risks

- The module still has its own local gamification XP/streak state. Do not wire
  `recordActivity()` or `awardXp()` into live learning flows until product
  decides whether gamification is a sandbox or a projection of canonical
  streak/points.
- The flag remains off by default.
- No analytics or server-backed gamification persistence is added here.

## Changed Files

- `src/features/gamification/__tests__/flipSafetyIntegration.test.tsx`
- `reports/gamification-flip-safety.md`
