# MercyBlade voice guidelines — Vietnamese-first, never shaming

This is the durable artifact from the streak shame audit
(`reports/streak-shame-audit-2026-04-26.md`). Read this before
shipping any copy or visual treatment that touches streaks,
leaderboards, daily lessons, or progress dashboards.

---

## Why this matters

ELSA's biggest user complaint cluster is "made me feel guilty" / "I
quit because of the streak shaming." MercyBlade's positioning is
**warm, never shaming** — and the positioning is the product, not
just the marketing.

Vietnamese learners — especially older users, lower-confidence
learners, and the parent generation — drop apps that reproduce the
school-era shame they left school to escape. Red ink on a learner's
own score is the most direct version of that.

The four rules below were extracted from auditing ~100 strings
across streak, leaderboard, daily-lesson, and progress surfaces.

---

## The four rules

### Rule 1 — Never volunteer loss framing

The system never says **first** that something is "broken,"
"missed," "lost," or "almost lost." Loss-framing is allowed only
when the user has *already* invoked the loss mechanism (e.g.
tapping streak insurance to use a save).

| ❌ Don't | ✅ Do |
|---------|------|
| "Don't lose your streak!" | "Học hôm nay là đủ rồi nha." |
| "Streak broken!" | (don't surface this at all — show next-step UI) |
| "Almost lost · Sắp mất chuỗi" | "Grace day open · Còn ngày ân hạn" |
| "Study anything today to protect your streak!" | "Học vài phút hôm nay là đủ. Mệt thì cũng không sao." |
| "You missed yesterday." | (silent — the dashboard already shows the gap; don't narrate it) |
| "X days behind average" | "Bạn đã luyện X câu tuần này." |

**Rationale**: Vietnamese learners under work and family pressure
already feel the time anxiety. Volunteering "you'll lose this if
you don't act" lands as nagging, not motivation. Permission to
rest, named explicitly, is the kindness.

---

### Rule 2 — Red is not a failure color

Red on a user's own score is the strongest shame signal we ship.
For Vietnamese learners with school-era report-card associations,
red ink on a number means "wrong / bad student." Use red for:

- ✅ **Errors** in error states (form validation, network failures)
- ✅ **Warnings** that require user action (subscription expired)

Do **not** use red for:

- ❌ User's own score below an arbitrary threshold (a 55 is normal
  for a beginner — paint it neutral, not red)
- ❌ Negative score deltas (`-3 points this week` — show the number
  in slate, not red)
- ❌ Lists of phonemes the user is "still working on" — that's a
  growth-zone, not an emergency
- ❌ "Down" arrows on trend lines — the arrow itself is the signal;
  the color stops being information and starts being judgment

**Color palette for learning data:**

```
≥80   #059669  (emerald — genuine win)
60–79 #d97706  (warm amber — progressing)
<60   #64748b  (neutral slate — beginner zone, no panic)
n/a   #94a3b8  (cool gray — no data)
```

---

### Rule 3 — Surface forgiveness mechanisms early

MercyBlade has three forgiveness mechanisms: **freeze day**,
**vacation mode**, **streak insurance**. They exist because we
believe rest is a feature, not a fallback.

Treat them as first-class options, not as escape hatches you
mention only when something is breaking:

- **In the streak panel's warning + reset states**, show the
  `restPermissionMessage` from `streakCopy.ts` — name vacation mode
  by name.
- **In settings**, surface freeze day and vacation toggle prominently,
  not buried under "advanced".
- **In the badge tooltip**, the existing `freezeMessage`, `vacationMessage`,
  `insuranceMessage` are correctly framed — do not add loss language
  to them.

**Voice for forgiveness copy**: warm, agency-respecting, no implied
judgment for using them.

> ✅ "Vacation mode on. Your streak is paused until you're back."
> ✅ "Bạn có 1 lượt bảo hiểm chuỗi. Nhấn để khôi phục chuỗi."
> ❌ "You used your last save. Don't slip again!"  (judgment for
>    using a feature we built)

---

### Rule 4 — Permission to rest is named, not implied

The single highest-leverage line in the whole audit:

> **Mệt thì cũng không sao.**
> *"If you're tired, that's okay too."*

When we wrote this into the grace-day note, the entire frame of the
panel shifted from "countdown" to "calm." Use this pattern:

- After any activity prompt, when the user might be tired or busy,
  consider whether the copy needs a permission line.
- "Học vài phút" (a few minutes) is better than "Học một bài" (a
  whole lesson). Lower the implied bar.
- Avoid "đầy đủ" / "complete" / "finish" framings on daily streak
  copy — those words make rest feel like quitting.

---

## Pre-ship checklist for streak / leaderboard / progress copy

Before merging a PR that touches any of these surfaces, walk through
this checklist:

- [ ] **Read every new string aloud in Vietnamese.** If it makes you
      feel rushed, guilty, or pressured, rewrite it.
- [ ] **No loss-framing initiated by the system.** The user only
      hears about loss when they invoked it themselves (e.g., tapped
      "use insurance").
- [ ] **No red color on user's own scores below 60.** Slate, not red.
- [ ] **No red color on negative deltas.** Arrow does the signaling.
- [ ] **No ⚠️ emoji on streak / progress / leaderboard surfaces.**
      That emoji is reserved for genuine errors (network down,
      payment failed). For "you took a break," use 🌿 / 💤 / ⏸.
- [ ] **Forgiveness mechanisms named where they're relevant.** If
      the surface is the warning state, vacation/freeze should be
      visible, not hidden in a tooltip.
- [ ] **VN copy is the primary voice; EN follows.** If the VN reads
      warm and the EN reads neutral-or-better, that's the right
      polarity. Don't ship strings where EN is warmer than VN.
- [ ] **No "Top learners" / "Falling behind" / "Best performers"
      hierarchical labels.** "Bảng xếp hạng tuần này" / "This week's
      leaderboard" is the neutral standard.
- [ ] **No comparisons to other users' performance** unless the user
      explicitly opted in (leaderboard).

---

## Known edge cases where loss framing IS allowed

These are the only cases where "lost / mất / used / dùng" appears,
and only because the user invoked the mechanism:

1. **Streak insurance use confirmation**: "Bạn đã dùng 1 lượt bảo hiểm
   — chuỗi được khôi phục."
2. **Vacation mode confirmation**: "Chế độ nghỉ phép đang bật. Chuỗi
   của bạn được giữ nguyên."
3. **Freeze day confirmation**: "Đã đóng băng ngày hôm nay. Chuỗi của
   bạn vẫn an toàn."
4. **Admin / metrics screens**: raw `streak_current` resets are
   shown for retention analysis. Internal-only, not user-facing.
5. **Audit logs / debug screens**: developers reading the data
   need precise terminology. Not user-facing.

The rule again: **the system never volunteers loss framing; only
acknowledges it when the user already named it.**

---

## Where to look for shame regressions

When reviewing a PR that touches these areas, scan for these red
flags (pun intended):

- A new `#dc2626` color reference where the data is a user's own
  metric (not an error)
- A new `⚠️` emoji where the surface is learning, not infrastructure
- New strings containing: `lose`, `lost`, `broken`, `missed`,
  `behind`, `falling`, `mất`, `gãy`, `bỏ`, `chậm hơn`
- Comparisons phrased as "you vs them" outside the explicit
  leaderboard surface
- Countdown-anxiety patterns: progress bars labeled "X days until
  reset", numerical "days remaining", flashing animations

If you spot any of these, link this doc in the review comment and
ask the author to revisit.

---

## Source audit

This doc was extracted from
`reports/streak-shame-audit-2026-04-26.md`, which inventories every
shame trigger found in the 7 surfaces audited and the specific
`file:line` references. The fix commit landed in PR
`feat/streak-shame-audit`. If you find a new shame pattern, add it
to a follow-up audit report and link from this doc.
