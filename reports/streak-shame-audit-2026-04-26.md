---
title: Streak / leaderboard / progress copy — shame audit
agent: A7
date: 2026-04-26
branch: feat/streak-shame-audit
scope: src/components/streak/, src/components/leaderboard/, src/components/home/{TodaysLessonCard, WeeklyProgressWidget}, src/pages/Progress.tsx
---

# Streak shame audit

## Headline

The copy is **mostly already careful** — Chau and earlier reviewers stripped the worst shame patterns ("Don't lose your streak!", "Streak broken!", "X days behind average") before they shipped. There are no copy strings telling the user they're failing.

But there are real shame triggers in **visual treatment** that the copy review wouldn't have caught:

1. **Red-as-failure color coding.** A weekly average of 58 renders in alarm-red on the Progress hero. A negative score-delta on the home widget renders in red with a downward arrow. Older / lower-confidence Vietnamese users read this as "bad student" — same instinct that comes from school report cards.
2. **⚠️ warning emoji on streak "last day of grace" state**, paired with amber background. Functions as a countdown-to-loss visual.
3. **A few specific strings** that slipped through: `"Almost lost · Sắp mất chuỗi"`, `"Study anything today to protect your streak!"`, and `"Top learners"` — each leans into pressure or comparison.

There are also **forgiveness mechanisms that exist but stay hidden** until a user happens to hover the StreakBadge: freeze day, vacation mode, streak insurance. These are the antidote to shame; they should be promoted on the panel where they matter (the warning / reset states), not buried in a tooltip.

This audit lists every finding with `file:line`, why it triggers in VN learners, and the proposed replacement. Commit 2 in this PR ships the fixes.

---

## What I checked

| Surface | File | Strings reviewed |
|---------|------|------------------|
| Streak copy dictionary | `src/components/streak/streakCopy.ts` | 11 strings |
| Streak badge (home top-right) | `src/components/streak/StreakBadge.tsx` | inline labels |
| Streak history panel (Account) | `src/components/streak/StreakHistoryPanel.tsx` | status visuals + grace note |
| Today's lesson card | `src/components/home/TodaysLessonCard.tsx` | 8 strings |
| Weekly progress widget (home) | `src/components/home/WeeklyProgressWidget.tsx` | label + delta visuals |
| Weekly leaderboard | `src/components/leaderboard/weeklyLeaderboardCopy.ts` | 21 strings |
| Leaderboard card (home) | `src/components/leaderboard/leaderboardCopy.ts` | 14 strings |
| Progress dashboard | `src/pages/Progress.tsx` | 18 strings + visual color coding |

Total: ~100 user-visible strings across 7 components, plus visual / color treatment.

---

## Findings ranked by severity

### S1 — Shame triggers that actually fire today (fix in this PR)

#### F-1. "Almost lost · Sắp mất chuỗi" status pill
- **Where**: `src/components/streak/streakCopy.ts:25` (`statusPills.warning`)
- **Renders in**: `StreakHistoryPanel.tsx:138` as a yellow pill on the warning state (last day of the grace window)
- **Why it shames**: "Sắp mất chuỗi" / "Almost lost" frames a 2-day gap as imminent loss. For a Vietnamese learner who studied steadily for 30 days then took a weekend off, the panel says they're about to lose what they built. The grace mechanism is supposed to be a kindness; the pill makes it feel like a countdown.
- **Replacement**: `"Còn 1 ngày ân hạn · Grace day open"` — factual, names the kindness, no loss word
- **VN voice rationale**: "Ân hạn" (grace) is a positive Vietnamese concept ("ân" = gift, kindness). Lead with that, not with "mất" (lose).

#### F-2. "Study anything today to protect your streak!" grace message
- **Where**: `src/components/streak/streakCopy.ts:30-32` (`graceMessage`)
- **Renders in**: `StreakHistoryPanel.tsx:328-331` as a yellow note on warning state
- **Why it shames**: "Protect your streak" is the imminent-loss frame. The implicit threat is: "if you don't study, you lose what you built." Vietnamese learners under work / family pressure already feel this without the app reinforcing it.
- **Replacement**:
  - EN: `"Bạn còn ngày ân hạn — học vài phút hôm nay là đủ. Mệt thì cũng không sao."`
  - VN: `"You still have a grace day — a few minutes today is enough. If you're tired, that's okay too."`
- **VN voice rationale**: Permission to rest IS the kindness. Saying "mệt thì cũng không sao" out loud cuts the guilt at the root.

#### F-3. ⚠️ warning emoji on "last day of grace" status
- **Where**: `src/components/streak/StreakHistoryPanel.tsx:138`
- **Why it shames**: Pure visual urgency. ⚠️ is the Western road-sign for danger. On a learning app, paired with amber background, it reads as "ALERT — your streak is about to die." That's exactly the pressure framing the rest of the copy avoids.
- **Replacement**: 🌿 (gentle, "still alive") or 💤 (rest) — removes alarm signal, reads as "calm but noted"
- **Note**: keep the amber-ish color but soften it (`#fef3c7` → `#fef9c3` is fine; the emoji change is the load-bearing fix)

#### F-4. Negative score-delta painted red with ↓ arrow
- **Where**: `src/components/home/WeeklyProgressWidget.tsx:103` and `src/pages/Progress.tsx:518` (HeroCard delta)
- **Renders as**: e.g. `↓ -3` in `#dc2626` red text next to the weekly score
- **Why it shames**: Red + downward arrow is universally encoded as "loss / failure." A learner whose score dropped from 78 → 75 sees a red ↓ -3 and reads it as "I got worse." For a Vietnamese learner especially older users carrying school-era report-card associations, red marks = bad grade. The technical metric is fine to show; the *color* is the shame signal.
- **Replacement**: keep the number, lose the alarm color. Use neutral slate (`#64748b`) for negative delta; reserve green (`#059669`) for positive only. Arrow stays — informational. This matches how Apple Health and Garmin show "down" trends — value visible, no red panic.

#### F-5. Weekly average score painted red below 60
- **Where**: `src/components/home/WeeklyProgressWidget.tsx:46-51` and `src/pages/Progress.tsx:167-172` (`scoreColor`)
- **Renders as**: a 56px-tall score painted `#dc2626` (alarm red) when below 60
- **Why it shames**: The number itself is fine — the user wants to see their score. The choice to paint *the user's own number* in alarm-red when they're learning is a strong "you're failing" signal. A 55 is *normal* for a beginner; rendering it as a red emergency is shame coding.
- **Replacement**: gradient-soften the bands. Keep green (`#059669`) for ≥80. Use a warmer amber (`#d97706`) for 60–79. Below 60: use neutral slate (`#64748b`) NOT red. The user gets the same information without the "danger" coloring.
- **Adult-room rationale**: Phoneme practice for an L2 learner produces 50s and 60s for the first weeks. Painting that scarlet teaches the user that being a beginner is wrong. We don't want that lesson.

#### F-6. "Still working on" badge in alarm red
- **Where**: `src/pages/Progress.tsx:843-851` (`weakBadge` section header) + `:866-872` (list items)
- **Renders as**: section header + emoji 🎯 in `#dc2626` red, items on `#fef2f2` (red-50) backgrounds
- **Why it shames**: The copy "Still working on / Vẫn cần luyện" is *good* — it's growth-mindset framing. But then the visual treatment paints the entire card in alarm red, undoing the warm copy. The user reads "STILL WORKING ON: TH, R, V" in red and feels chastised.
- **Replacement**: keep the copy, swap the color. Section header → neutral `#0f172a` (slate-900). List background → `#f8fafc` (slate-50). The `scoreColor()` paint on the per-phoneme score can stay (that's a single number, not a whole card).

#### F-7. "Top learners" leaderboard subtitle (EN only)
- **Where**: `src/components/leaderboard/leaderboardCopy.ts:13` (`subtitle.en`)
- **Why it shames**: "Top learners" implicitly creates a bottom. The Vietnamese version is already perfect ("Cứ luyện đều, vị trí sẽ tới." / "Just keep practicing — your spot will come."). The EN was a literal label, missed in the original review.
- **Replacement**: `"This week's leaderboard, refreshed every Monday."` — neutral, factual, no winner/loser hierarchy

#### F-8. "Hidden" forgiveness mechanisms during warning / reset states
- **Where**: `src/components/streak/StreakHistoryPanel.tsx:328-331` (the only note shown on warning state is the grace message)
- **Why this is a missed opportunity**: When a user is on day-2 of grace or has just reset, that's the moment they need permission-to-rest, not a countdown. Today the panel doesn't surface freeze / vacation / insurance unless the user happens to hover the badge. Add a one-line hint to the panel: "Mệt thì có thể bật chế độ nghỉ phép — chuỗi sẽ tạm dừng / Tired? Turn on vacation mode — your streak pauses."
- **Replacement**: append a `restPermissionMessage` constant to `streakCopy.ts` and render it on warning + reset states (alongside, not replacing, the grace note)

---

### S2 — Borderline patterns kept on a watchlist (no fix this PR)

These are *not* shame triggers today, but they're close enough to flag if behavior changes.

| Pattern | Where | Why I left it | When to revisit |
|---------|-------|---------------|-----------------|
| `streakTooltip` "Keep it going 🔥 / Cố lên nhé 🔥" | `streakCopy.ts:11-12` | "Cố lên" is encouragement, not pressure. EN "keep it going" is mild. | If users complain about the 🔥 emoji on the badge. Some users associate fire with urgency. |
| `WEEKLY_LB_COPY.pageIntro` "Real-time as everyone practises Speak." | `weeklyLeaderboardCopy.ts:14` | Mild "everyone is doing it" peer-pressure subtext, but factually accurate and the VN version is balanced | If we add notification surfaces ("8 friends are on the leaderboard right now"). At that point this becomes nudge-territory. |
| `leaderboardCopy.emptyBody` "claim rank #1" | `leaderboardCopy.ts:52` | Competitive framing, but only shown when board is empty (i.e. no one to compete with) | If we add similar copy to non-empty states |
| `TodaysLessonCard` 🔥 emoji on uncompleted state | `TodaysLessonCard.tsx:107` | Standard "today's task" emoji; not pressure framing. The completed state is warm. | If we add a "you missed yesterday" flow that re-uses this card |
| Progress dashboard `mostImproved.delta` shown as `+12 pts` | `Progress.tsx:832` | Only positive deltas appear in this list (mostImproved is filtered ≥0). No shame risk. | — |

---

### S3 — Patterns that are already correct (kept as voice reference)

These were considered and confirmed warm. Future agents should match this voice.

- `emptyState` ("Start learning today to build your streak!" / "Học hôm nay để bắt đầu xây dựng chuỗi của bạn nhé!") — invitation, not pressure
- `freezeMessage` ("Your streak is safe today — no need to study.") — explicit permission to rest
- `vacationMessage` ("Your streak is paused until you're back.") — agency-respecting, no implied judgment
- `insuranceMessage` ("Tap to bring your streak back this once.") — no shame for using it
- `WEEKLY_LB_COPY.empty` ("Hit Speak to be the first.") — playful, low-stakes
- `Progress.tsx COPY.weeklyHero` ("Bạn đã luyện X câu tuần này") — pure factual positive
- `Progress.tsx COPY.improvedBadge` ("Tiến bộ nhanh nhất") with green color — positive paired with positive visual ✓

---

## Strategic rationale

**Why this matters for MercyBlade specifically:**

1. **ELSA's complaint cluster** ("made me feel guilty", "I quit because the streak shaming") is a real user pain. The differentiator MercyBlade is shipping is *not* "we don't shame" as a marketing line — it's that the product itself doesn't shame. Visual color choices are part of the product.

2. **Vietnamese learners and red marks.** Vietnamese school culture uses red ink for corrections. Red on a learner's own score, in a learning app, reproduces an experience many users left school to escape. The fix is not to remove the score; it's to remove the red.

3. **Older / lower-confidence learners are the highest-attrition cohort** for any language app. They're also the cohort MercyBlade most needs (parent generation explaining English to grandparent generation; mid-career professionals with school-era English shame). Every shame trigger removed lowers their drop-off probability.

4. **The forgiveness mechanisms are the moat.** Freeze / vacation / insurance are MercyBlade's real differentiator. Promoting them on the warning state — when the user actually needs permission — is the difference between "the app understands me" and "the app catches me failing." Today they're hidden in a hover-tooltip on a badge. Surfacing them in the panel converts the warning state from "you're about to lose" to "rest is built in."

---

## What ships in commit 2 (the fix commit)

Below is the diff plan. Each line is a copy or color change; no behavior, no test logic, no schema.

| File | Change |
|------|--------|
| `streakCopy.ts:25` | `statusPills.warning`: `"Almost lost · Sắp mất chuỗi"` → `"Grace day open · Còn ngày ân hạn"` |
| `streakCopy.ts:30-32` | `graceMessage`: rewrite to permission-to-rest framing (see F-2) |
| `streakCopy.ts` | new export `restPermissionMessage` for warning / reset states |
| `StreakHistoryPanel.tsx:138` | `warning` emoji `⚠️` → `🌿` |
| `StreakHistoryPanel.tsx:135-141` (visual map) | warning bg `#fef3c7` → `#fef9c3` (softer) |
| `StreakHistoryPanel.tsx` | render `restPermissionMessage` on warning + reset states |
| `WeeklyProgressWidget.tsx:101-105` | negative delta color `#dc2626` → `#64748b` (neutral slate) |
| `WeeklyProgressWidget.tsx:48` | `scoreColor` below-60 branch `#dc2626` → `#64748b` |
| `Progress.tsx:170` | same `scoreColor` change as above |
| `Progress.tsx:518` | HeroCard `deltaColor` negative branch `#dc2626` → `#64748b` |
| `Progress.tsx:843-872` | `weakBadge` section header color `#dc2626` → `#0f172a`; list bg `#fef2f2` → `#f8fafc` |
| `leaderboardCopy.ts:13` | `subtitle.en` "Top learners, refreshed every Monday." → "This week's leaderboard, refreshed every Monday." |

Total: ~12 edits across 5 files. No test changes needed (visual / copy only). `npm run typecheck` clean.

---

## What this audit deliberately does NOT do

- **Does not remove the streak system.** Streaks are a product choice; the brief said keep behavior, change copy.
- **Does not remove score-color coding entirely.** Green for ≥80 is still useful — that's positive feedback, not shame. The neutralization is below-60 only.
- **Does not change leaderboard rankings or behavior.** Users who opt in still see ranks; users who don't are still hidden.
- **Does not add new positive-framing animations.** Per the brief: just remove negative ones. No celebratory confetti. Calm wins.
- **Does not touch admin views.** Admins still see raw scores in raw colors — that's a different audience with a different need.

---

## Where streak-loss IS appropriate to mention (edge cases)

There ARE places "lose / mất / break" framing is OK because the user explicitly opted in:

1. **Streak insurance UI** when the user *taps to use it*: "Bạn đã dùng 1 lượt bảo hiểm — chuỗi được khôi phục." The user invoked the loss-prevention mechanism; acknowledging it directly is fine.
2. **Vacation mode** confirmation: "Chế độ nghỉ phép đang bật. Chuỗi của bạn được giữ nguyên đến khi bạn quay lại." Also fine — user-initiated.
3. **Admin reports**: the schema has `streak_current` resets, which admins need to see for retention analysis. Internal-only, not user-facing.

The voice rule is: **the system never volunteers loss framing; only acknowledges it when the user already named it.**

---

## Voice guidelines doc

Commit 2 also adds `docs/voice-guidelines-vn.md` codifying:
- The 4 rules I extracted from this audit (no loss-volunteering, no red-as-failure, surface forgiveness mechanisms early, permission-to-rest is a feature not a fallback)
- 6 good/bad copy pairs as before/after examples
- A short checklist future agents and content writers run before shipping any streak / leaderboard / progress copy

That doc is the durable artifact. This audit gets archived; the guidelines stay.
