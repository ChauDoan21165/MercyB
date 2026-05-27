# Onboarding & Language Pair — Deep Dive

> **Sibling of** [system-overview.md §14](../system-overview.md#14-onboarding--language-pair).
>
> The onboarding flow is the **anonymous entry point** at
> mercyblade.com (locked #14). Before signup, a visitor picks a
> language pair (native + target); that pick is stored in
> localStorage; the next visit skips the picker and goes straight to
> Home. The same flow runs for a signed-in user whose profile
> native_language is still NULL. This doc covers the FSM, the
> `AnonymousOnboardingGate` doctrine, the localStorage seam, the
> contract with the marketing landing's `?direction=vn` CTA, and the
> reversal of PR #590's default-'vi' migration.
>
> **Read first:**
> - `src/router/AnonymousOnboardingGate.tsx` (file head — the
>   doctrine block is load-bearing)
> - `src/pages/onboarding/OnboardingPage.tsx` (file head — explains
>   the flow + the `?direction=vn` contract + the column-freeze
>   discipline)
> - `src/lib/languagePair/anonymousPair.ts` (the localStorage seam)
> - `src/lib/onboarding/types.ts` (FSM step ids, bilingual labels,
>   `TARGET_META`)
> - `STRATEGY.md` §4 ("Learning-Pair Matrix") + §7 Step 10
>   (pair-selection onboarding as a future deepening dispatch)

---

## 1. What it does, and why it matters strategically

The onboarding flow's job is to capture the **(native, target)** pair
that the rest of the app routes on:

- Which language is the lesson pedagogy authored *for* (native side).
- Which language(s) the learner wants to *study* (target side).

That pair drives:

- Home routing (which surface to render first).
- Lesson selection (`pickFirstLesson` for English; `/languages/{slug}`
  for the other six target tracks).
- Tutor / detector / pronunciation flavor (Vietnamese learners get
  vi-pack detectors; English-native learners get en-vn rule packs).
- Chrome UI language (the top-bar copy follows native_language).

Why it matters strategically:

- **`STRATEGY.md` §4 (Learning-Pair Matrix)** — MercyBlade is a
  matrix product (2 native × 8 target = up to 16 pairs). The picker
  is the screen where the matrix becomes real for a learner — they
  pick a pair and the app becomes specific to it.
- **`STRATEGY.md` §7 Step 10** — *"Pair-selection onboarding +
  deepen lighter pairs."* The flow that exists today is the Duolingo-
  style multi-select; deepening the lighter pairs is the next phase.
- **`STRATEGY.md` §6 ("As of 2026-05-19" entry)** — *"Roadmap Step 10
  reframed: this is **not** an en→vi sequel — it's two concrete
  pieces of work: (a) ship the Duolingo-style onboarding so a user
  explicitly picks native + target, and (b) deepen the English-native
  pairs whose content is lighter today."* The onboarding flow today
  is the (a) piece, shipped.
- **Locked #14 (Chau-confirmed doctrine).** *"The picker is the
  anonymous entry point pre-signup."* This is the directive that
  reverses PR #590's *"DEFAULT 'vi' on signup"* migration. The
  picker exists precisely because we **don't** want to silently
  default a user's pedagogy axis.
- **Memory: [[project_onboarding_default_reversal]]** — *"#590
  REVERSED (locked #14): picker is the anonymous entry point
  pre-signup; NEVER apply #590's DEFAULT 'vi' migration."*

---

## 2. The two doctrines that drive this design

### 2a. Doctrine A — the picker is anonymous-first (Locked #14)

The picker runs **before** signup. It writes to localStorage, not to
Supabase. This is the only place in the app where an anonymous
visitor produces persistent state that survives a page reload.

Why this matters:

- The flow has no JWT, no row in `profiles`, no RLS gates. Every
  Supabase write inside `OnboardingPage` is guarded by `user?.id` —
  no user means localStorage only.
- A returning anonymous visitor skips the picker entirely. The
  `AnonymousOnboardingGate` reads `hasAnonymousPair()` from
  localStorage; if true, render Home; if false, render the marketing
  landing (which CTAs into `/onboarding`).
- A signup later promotes the localStorage pair into `profiles`
  via a one-time sync (PR 3 of the rollout). The picker doesn't
  re-run on signup if the pair was already chosen anonymously.

### 2b. Doctrine B — `AnonymousOnboardingGate` is the post-2026-05-18 layer

Before the marketing-landing audit (2026-05-18), `/` was wrapped to
*"if anon + no pair → redirect to /onboarding"*. That made the picker
the de facto landing page.

Chau's directive (marketing landing audit) reversed that disposition.
The picker is **still the entry to learning setup**, but it's now
reached via the marketing landing's CTA, not via an unconditional
redirect. The `AnonymousOnboardingGate.tsx` file head documents this:

> *"DOCTRINE UPDATE (Chau-directed 2026-05-18, marketing landing
> audit strategic ask #1 — answered 'yes, build the landing page').
> This SUPERSEDES the earlier reading of locked #14 that 'the picker
> IS the anonymous entry point'. The picker is unchanged and still
> owns learning setup; it is now reached via the landing page's CTA
> and is still directly addressable at /onboarding. A first-time
> anonymous visitor now sees the marketing landing (the
> `firstTimeAnonymous` element) instead of being bounced straight
> into the survey — do not 'restore' the old /onboarding redirect;
> this is the intended design."*

The two doctrines coexist: **Locked #14 says the picker is the
anonymous entry point for *learning setup*; the marketing-landing
doctrine says the *visitor* lands on marketing first, then chooses
to enter learning setup.**

---

## 3. Key files and their roles

### 3a. Routing gate

| File                                                    | Role                                                                                                                                  |
|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `src/router/AnonymousOnboardingGate.tsx`                | Root-route gate. First-time anonymous visitor → marketing landing (`firstTimeAnonymous`). Returning anonymous (has stored pair) OR signed-in → Home. CTA escape hatch (`?trypron=1`) forces Home regardless. |
| `src/router/AppRouter.tsx` (~line 794)                  | Mounts `AnonymousOnboardingGate` around `/` only. Kids mode, deep links, /pricing, /auth, blog, and SEO pages are **not** gated.       |
| `src/pages/MarketingLandingPage.tsx`                    | The `firstTimeAnonymous` element passed to the gate. Two CTAs: *"Tôi học ngoại ngữ"* → `/onboarding`; *"I'm learning Vietnamese"* → `/onboarding?direction=vn`. |

### 3b. Onboarding flow

| File                                                    | Role                                                                                                                                  |
|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `src/pages/onboarding/OnboardingPage.tsx`               | The flat 3-step picker. Steps: `native` → `target` → `start_with` (only if >1 target). Reads `?direction=vn` to seed an en→vi entry. Writes localStorage (anon) + `profiles` (signed-in). |
| `src/lib/onboarding/types.ts`                           | Shape contracts: `NativeLang`, `TargetLang`, `OnboardingStepId`, `OnboardingDraft`, `OnboardingGoal`, `OnboardingProfession`, `OnboardingLevel`, `ContentReadiness`. `NATIVE_OPTIONS`, `TARGET_META`, `ONBOARDING_STEPS`. |
| `src/pages/onboarding/__tests__/`                       | Tests for the FSM transitions + the `?direction=vn` seed.                                                                              |

### 3c. Language-pair persistence

| File                                                    | Role                                                                                                                                  |
|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `src/lib/languagePair/anonymousPair.ts`                 | `readAnonymousPair`, `hasAnonymousPair`, `writeAnonymousPair`, `clearAnonymousPair`. localStorage key `mercyblade.languagePair`. Mirrors native into `mercyblade.nativeLang` for the pedagogy-axis context. |
| `src/lib/languagePair/languagePair.ts`                  | `parseLanguagePair(row)` — the canonical parser used by BOTH `anonymousPair.ts` (anon side) and the profile read path. One-owner-per-function. Plus `withPrimary(targets, t)`. |
| `src/lib/languagePair/usePairMutation.ts`               | React hook that mutates the signed-in user's pair on `profiles`. Used by Settings's language-pair panel + the post-signup sync.        |

### 3d. Consumers — where the pair is read

| File                                                    | Role                                                                                                                                  |
|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| `src/pages/Home.tsx`                                    | Reads the pair to render pair-aware UI (which target track to surface first).                                                          |
| `src/components/LanguageSwitcher.tsx`                   | Top-bar switcher for the primary target.                                                                                              |
| `src/pages/LanguagesIndexPage.tsx` / `src/pages/languages/` | Per-language tracks (KO, JA, ZH, FR, DE, ES, VN-for-foreigners). Indexed at `/languages` and per-track at `/languages/{slug}`.       |
| `src/contexts/NativeLanguageContext.tsx`                | Pedagogy-axis context. Reads `mercyblade.nativeLang` (the mirror written by `writeAnonymousPair`) so anonymous visitors hydrate without a Supabase call. |
| `src/components/LessonUiLangToggle.tsx`                 | Top-bar VI / EN toggle. Distinct from native language — this is the lesson-display gloss (memory: [[project_chrome_glosstoggle_vs_nativelang]]). |

### 3e. Settings re-entry

| File                                                    | Role                                                                                                                                  |
|---------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------|
| Settings → "Đổi ngôn ngữ / Change language"             | Re-entry point. Calls `clearAnonymousPair()` for anonymous; calls `usePairMutation` for signed-in. Re-routes to `/onboarding`.        |

### 3f. Profile columns the flow writes

| Column                            | When written                                                | Notes                                                                                              |
|-----------------------------------|-------------------------------------------------------------|----------------------------------------------------------------------------------------------------|
| `native_language`                 | On every finish (signed-in path).                            | The pedagogy axis. NULL until the picker completes. Privilege-frozen per #578 (memory: [[project_578_rls_applied]]). |
| `target_languages`                | On every finish.                                             | Ordered, deduped. Index 0 = primary. Privilege-frozen per #578.                                    |
| `onboarded_at`                    | On every finish.                                             | Marks the user as having completed picker. Privilege-frozen per #578.                              |
| `primary_goal` / `profession` / `english_level` | ONLY when primary target is English.                | Optional structure for English-native track. NULL otherwise. Privilege-frozen per #578.            |

Memory: [[project_goalpicker_not_fully_dead]] — *"#611 deleted the
dead UI only; primary_goal / profession / english_level stay (LIVE
privilege-frozen profiles columns read by MercyGuide / DailyCoach);
don't drop the columns / draft / payload as 'dead code'."*

---

## 4. Public API / surface contracts

### 4a. Onboarding FSM

```ts
// src/lib/onboarding/types.ts
export type OnboardingStepId = "native" | "target" | "start_with";

export const ONBOARDING_STEPS: OnboardingStepId[] = ["native", "target", "start_with"];

export interface OnboardingDraft {
  native_language: NativeLang | null;
  target_languages: TargetLang[];
  primary_goal: OnboardingGoal | null;
  profession: OnboardingProfession | null;
  english_level: OnboardingLevel | null;
}
```

Transitions (from `OnboardingPage.tsx`):

- `native` → `target` always.
- `target` → `start_with` iff `target_languages.length > 1`.
- `target` → finish iff `target_languages.length === 1` (single-target
  Continue completes onboarding).
- `start_with` → finish on tap of the primary card.

The previously documented `welcome` and `confirmation` steps were
removed (A32 audit 2026-05-18) as "guaranteed dead clicks". Mercy's
greeting is now inlined into the `native` step header
(`ONBOARDING_COPY.greeting`). Finish happens straight off the last
pick — no echo screen.

### 4b. `?direction=vn` contract

```text
/onboarding             → default vi-first entry (start at `native`,
                           nothing seeded).
/onboarding?direction=vn → English-speaker-learning-Vietnamese entry.
                           SEEDS draft { native_language: "en",
                                         target_languages: ["vi"] }
                           and STARTS at `target`. Skip preserves
                           this seed so a direction=vn visitor cannot
                           be enrolled as vi-native (the A32 trap).
/onboarding?direction=vi → same as default (vi-first).
```

The seed is what closes the failure mode A32 audit named: without it,
an English-native visitor who clicked *"I'm learning Vietnamese"* on
the landing and then accidentally hit Skip would be silently enrolled
as vi-native — the **inverse** of their intent.

### 4c. localStorage seam

```ts
// src/lib/languagePair/anonymousPair.ts

export interface AnonymousPair {
  native: NativeLang;
  targets: TargetLang[];  // ordered, deduped, validated
}

// LocalStorage keys (both managed by writeAnonymousPair):
//   - mercyblade.languagePair  → JSON blob { native, targets }
//   - mercyblade.nativeLang    → mirror of native, used by the
//                                pedagogy-axis context's cache

export function readAnonymousPair(): AnonymousPair | null;
export function hasAnonymousPair(): boolean;
export function writeAnonymousPair(native: NativeLang, targets: TargetLang[]): void;
export function clearAnonymousPair(): void;
```

### 4d. Parsing contract (one-owner-per-function)

```ts
// src/lib/languagePair/languagePair.ts
export interface LanguagePair {
  nativeLanguage: NativeLang | null;
  targets: TargetLang[];
  primaryTarget: TargetLang | null;
}

// THE canonical parser. Used by:
//   - readAnonymousPair (anon side, parses the localStorage blob)
//   - useProfileQuery   (signed-in side, parses the profiles row)
//
// Tolerates: NULLs, non-arrays, unknown codes, mixed validity.
// Returns clean, validated, deduped values. Never throws.
export function parseLanguagePair(row: {
  native_language?: unknown;
  target_languages?: unknown;
}): LanguagePair;

// Re-order targets so `t` is at index 0. Idempotent. Used when the
// learner picks a new primary in `start_with`.
export function withPrimary(targets: TargetLang[], t: TargetLang): TargetLang[];
```

### 4e. Gate signal contract

```ts
// src/router/AnonymousOnboardingGate.tsx — the decision tree:
//
// 1. hasResolvedRef.current === false  (auth not yet resolved)
//      → render children (Home), which shows its own skeleton.
//      Never blank or bounce on a transient first-paint flip.
//
// 2. effectiveUser !== null  (signed-in)
//      → render children (Home). Home's own profile gate handles
//      onboarding for logged-in users whose profile.native_language
//      IS NULL.
//
// 3. hasAnonymousPair() === true  (returning anonymous)
//      → render children (Home). Home reads the localStorage pair.
//
// 4. searchHasCtaSignal(location.search) === true
//      → render children (Home). CTA escape hatch for the
//      landing→Home transition; `?trypron=1` today.
//
// 5. else  (first-time anonymous, no pair, no CTA signal)
//      → render firstTimeAnonymous (marketing landing).
//      Falls back to Navigate("/onboarding") when the prop is absent.
```

The `CTA_GATE_PARAMS` array (`["trypron"]` today) is the defensive
fallback: if the localStorage write fails silently (private mode,
extension shim), the URL param still gets the visitor into Home.

---

## 5. Invariants

### 5a. The "never" list

- **Never apply PR #590's `DEFAULT 'vi'` migration.** Reversed under
  Locked #14. Memory:
  [[project_onboarding_default_reversal]]. The picker is the
  anonymous entry point precisely because we don't want a silent
  default.
- **Never re-add the unconditional `/onboarding` redirect to
  `AnonymousOnboardingGate`.** The marketing-landing doctrine
  (2026-05-18) supersedes that pattern. First-time anon sees the
  landing, not the picker.
- **Never write `profiles.tier` from the onboarding flow.** It's not
  the picker's column; it's billing's. The profile freeze (#578)
  blocks it server-side anyway.
- **Never write to `profiles` without a guard on `user?.id`.** The
  picker runs anonymously by design; an unauthenticated write would
  fail at the RLS layer AND blow up the flow. Anonymous writes go
  to localStorage only.
- **Never drop the `primary_goal` / `profession` / `english_level`
  columns or types.** UI is dead; columns are alive. Memory:
  [[project_goalpicker_not_fully_dead]].
- **Never invent an alternate localStorage key.** The pair key is
  `mercyblade.languagePair`; the native mirror is
  `mercyblade.nativeLang`. The mirror is byte-compatible with
  `NativeLanguageContext`'s cache key. Splitting these into two
  separate paths re-creates a class of hydration races.
- **Never read `profiles.native_language` directly in render.** Go
  through `useProfileQuery` + `parseLanguagePair` (the parser handles
  NULL / unknown values cleanly). Direct reads on render break
  during cache-miss.
- **Never store a target code outside `TARGET_META`'s keys.**
  `parseLanguagePair` filters unknown codes silently, but writing
  garbage is still wrong. The eight valid codes are `en, ja, ko, zh,
  fr, de, es, vi`.

### 5b. The "always" list

- **Always use `parseLanguagePair`** for read-side validation.
  `anonymousPair.ts:readAnonymousPair` delegates to it; so should
  any new consumer.
- **Always honour `?direction=vn` when present.** The seed prevents
  the A32 inverse-enrolment trap.
- **Always mirror `native` into `mercyblade.nativeLang`** on write.
  Without it, the pedagogy-axis context starts cold on cold-load.
- **Always re-validate on read.** Local storage can be poisoned by
  an extension, a prior bad write, or a hand-edit. `parseLanguagePair`
  is forward-compatible — it tolerates a new code shipping later.
- **Always write `onboarded_at` on finish.** It's the signal that
  prevents Home from re-bouncing the user back to the picker.
- **Always include `native_language` in the write payload, even on
  Skip.** The recommended-target write on Skip must include native
  too, so the `native_language IS NULL` Home gate cannot loop.

### 5c. Storage / sync boundaries

| Where                            | Local? | Server? | Notes                                                                                  |
|----------------------------------|--------|---------|----------------------------------------------------------------------------------------|
| `mercyblade.languagePair`        | ✓      | —       | Anonymous source of truth for the pair. Synced to `profiles` on signup.                |
| `mercyblade.nativeLang`          | ✓      | —       | Mirror for `NativeLanguageContext`'s cache. Kept byte-compatible.                      |
| `profiles.native_language`       | —      | ✓       | Signed-in source of truth. NULL until picker completes. Privilege-frozen per #578.     |
| `profiles.target_languages`      | —      | ✓       | Ordered (primary first). Privilege-frozen per #578.                                    |
| `profiles.onboarded_at`          | —      | ✓       | Signal that the picker completed. Privilege-frozen per #578.                           |
| `profiles.primary_goal` / `profession` / `english_level` | — | ✓ | Optional English-track structure. Privilege-frozen per #578.                |

### 5d. The picker is auth-less by design

This is the single property that distinguishes onboarding from every
other write path in the app:

- The picker has no JWT.
- Its writes go to localStorage, not Supabase, when no user is
  present.
- When a user IS present (signed-in user with NULL `native_language`),
  the picker writes both localStorage AND the profile, guarded by
  `user?.id`.
- A future signup syncs localStorage → profile.

If a new feature wants to write *anything* from the picker
unconditionally to Supabase, it's wrong shape. The picker is the
only Supabase-optional write surface; treat it as such.

---

## 6. Known gotchas / pitfalls

### 6a. `nativeLang` (chrome) ≠ `lessonUiLang` (gloss)

Memory: [[project_chrome_glosstoggle_vs_nativelang]] — *"top-bar
VI/EN toggle is `lessonUiLang` (gloss, public-route load-bearing),
NOT `nativeLang` (chrome nav, auto-follows #594); 'move toggle to
Settings' dispatch was a wrong premise, cancelled."*

There are two language axes:

- **`native_language`** — the **pedagogy axis**. Set once by the
  picker. Read by `NativeLanguageContext` to decide which language
  the lesson is *taught in*.
- **`lessonUiLang`** — the **gloss axis**. Toggled at runtime via
  the top-bar VI/EN toggle. Decides which gloss is shown next to a
  vocabulary item. Per-session, not persisted across pair changes.

Conflating these breaks five different surfaces. If a brief says
"move the language toggle from the top bar to Settings", refuse —
that's `nativeLang` advice misapplied to `lessonUiLang`.

### 6b. The `welcome` and `confirmation` interstitials are gone

The 3-step FSM used to be 5 steps (`welcome` → `native` → `target` →
`start_with` → `confirmation`). The two interstitials were removed
as "guaranteed dead clicks" (A32 audit 2026-05-18). Mercy's greeting
is now in the `native` header. Finish happens straight off the last
pick.

If you find old code or docs referencing `welcome` or `confirmation`
step ids, that's pre-A32 state — out of date.

### 6c. The `?direction=vn` seed must survive Skip

A direction=vn visitor who Skips should still be enrolled with
`native_language: "en"` and a recommended Vietnamese target — NOT
with the default `native_language: "vi"`. The seed must be honoured
in Skip's write payload. This is the failure mode A32 named.

When you touch the Skip path, verify the seed survives.

### 6d. Goal-picker UI is dead but the columns aren't

PR #611 deleted the dead goal-picker UI. The columns
(`primary_goal`, `profession`, `english_level`) **stay** — they're
live, read by MercyGuide and DailyCoach. Memory:
[[project_goalpicker_not_fully_dead]]. Don't drop them.

The write path for these columns is conditional in
`OnboardingPage.tsx`: only when the primary target is English. For
non-English targets, the columns stay NULL — that's correct.

### 6e. Signed-in users with NULL `native_language` get bounced here

Home's profile gate detects `native_language IS NULL` and redirects
to `/onboarding`. This is what handles the legacy account case (a
user who signed up before the picker existed and has NULL pair
fields). The picker accommodates them: same FSM, but the write goes
to both localStorage AND `profiles` (since `user?.id` is set).

If you see a confusing "signed-in user hit the picker" report,
that's correct behavior for NULL pair fields — not a bug.

### 6f. The `?trypron=1` escape hatch is defensive

`CTA_GATE_PARAMS` in `AnonymousOnboardingGate.tsx`:

> *"Defensive fallback so the CTA's landing→Home transition cannot
> get stuck on the landing even if the localStorage write silently
> fails for any reason."*

If you add a new landing CTA, consider whether it needs its own URL
param in `CTA_GATE_PARAMS`. The pattern is: any CTA whose target is
Home AND whose state depends on a localStorage write that could
fail.

### 6g. `parseLanguagePair` is forward-compatible

If a future build ships with a new target code (say `pt`) that the
current build doesn't know, `parseLanguagePair` silently drops it on
read. This is **correct** — the alternative (throwing on unknown
code) would brick anyone whose localStorage was poisoned by an
ahead-of-time write.

The pair set in `TARGET_META` is the **current** valid set. To add a
new code:

1. Add it to `TargetLang` union in `src/lib/onboarding/types.ts`.
2. Add the `TARGET_META` entry.
3. Add the `profiles.target_languages` CHECK domain entry in the
   migration that defines the column (or a follow-up migration that
   extends it).

### 6h. Settings re-entry clears the anonymous pair completely

`clearAnonymousPair()` removes BOTH `mercyblade.languagePair` AND
`mercyblade.nativeLang`. This means after a re-entry, the
pedagogy-axis context cold-loads on its next read. That's
intentional — the user is explicitly opting to redo the pair, so the
context should mirror that.

Don't add a "partial clear" mode that keeps the mirror — it would
leave the context locked to the old native while the picker runs.

### 6i. The picker write is NOT idempotent on Supabase

If a signed-in user finishes the picker twice (e.g. they're in a
weird state and Home keeps bouncing them), each finish does a full
`profiles` update — `native_language`, `target_languages`,
`onboarded_at` (current timestamp), and optionally
`primary_goal` / `profession` / `english_level` (NULL on subsequent
runs unless the primary target is English).

The second finish overwrites `onboarded_at` with the new timestamp.
That's accepted — `onboarded_at` is "completion signal," not
"completion record." If you ever need the original timestamp,
add a separate column rather than re-shaping `onboarded_at`.

### 6j. The native-lang mirror IS NOT the user's chrome language

Memory: [[project_chrome_glosstoggle_vs_nativelang]] again — the
mirror is the **pedagogy axis** cache, not the chrome UI language.
The chrome UI language follows the same value via #594 ("chrome nav
auto-follows native"), but they are conceptually separate. Don't
remove the mirror thinking it's redundant with the chrome state.

---

## 7. Cross-references

- **[system-overview.md §14](../system-overview.md#14-onboarding--language-pair)** — one-paragraph version.
- **[data-flow.md §1a](../data-flow.md#1a-anonymous-visitor--the-localstorage-seam)** —
  where this fits in the broader anon-localStorage-seam picture.
- **`STRATEGY.md`** §4 (Learning-Pair Matrix), §7 Step 10 (pair
  selection + deepen lighter pairs).
- **Marketing landing**: `src/pages/MarketingLandingPage.tsx` + the
  audit memory [[project_marketing_landing_decisions]].
- **Sibling deep-dives:**
  - [`billing-entitlement.md`](./billing-entitlement.md) — the
    picker writes are unrelated to entitlement, but
    `profiles.tier` (billing) and `profiles.native_language` (picker)
    are both privilege-frozen by #578.
  - [`study-os-stage-3.md`](./study-os-stage-3.md) — Stage 3A's
    `mb.stage3a.*` localStorage namespace is parallel to the picker's
    `mercyblade.languagePair` / `mercyblade.nativeLang` keys. Same
    anon-localStorage seam, different domain.
  - [`ai-tutor.md`](./ai-tutor.md) — the tutor reads
    `vietnameseL1Profile` for prompt injection (Bar #3); the
    profile is selected based on the picker's native_language.
  - [`observability.md`](./observability.md) — auth-resolution
    transitions are one of Sentry's activation triggers; the gate's
    "wait for resolved auth" UX interacts with that pull.

---

## 8. How to extend this — checklist

### 8a. Adding a new pair (e.g. a new target language)

- [ ] Add the code to `TargetLang` union in `src/lib/onboarding/types.ts`.
- [ ] Add the `TARGET_META[<code>]` entry: `labelVi`, `labelEn`,
      `flag`, `slug` (route segment, or null if delivered via the
      rooms corpus like English).
- [ ] Migration: extend the `profiles.target_languages` CHECK
      domain (or add a new migration if the CHECK has a constant
      list). Hand-applied via SQL Editor per memory:
      [[project_db_schema_drift_audit]].
- [ ] Wire the `/languages/<slug>` route in `AppRouter.tsx` (per
      [`system-overview.md §11`](../system-overview.md#11-per-language-tracks-c-side-ko-ja-zh-fr-de-es-vn-for-foreigners)).
- [ ] Add the per-language data directory under `src/languages/<lang>/`
      with at least `lessons.ts` and the `<LANG>_TOTAL_LESSONS`
      constant.
- [ ] Update the readiness-matrix doc (`reports/RECON-content-readiness-matrix.md`).
- [ ] Update the `ContentReadiness` filtering in `OnboardingPage`
      so the new pair appears for the right native(s).

### 8b. Adding a new step to the FSM

- [ ] Append the id to `OnboardingStepId` AND `ONBOARDING_STEPS`.
- [ ] Define the transitions in `OnboardingPage.tsx:nextStep`.
- [ ] Add a copy block to `ONBOARDING_COPY`.
- [ ] If the new step writes to `profiles`, add the columns to the
      finish payload AND verify the #578 freeze trigger does NOT
      revert them (memory: [[project_578_rls_applied]]).
- [ ] Avoid adding interstitial / confirmation steps without a
      concrete reason — they're guaranteed dead clicks (A32 audit).
- [ ] Tests under `__tests__/`.

### 8c. Adding a new entry URL param (like `?direction=vn`)

- [ ] Define the seed shape in `OnboardingPage.tsx`'s
      query-param parsing.
- [ ] Pick a starting step (don't default to `native` if the param
      already implies it).
- [ ] **Make sure Skip preserves the seed.** The A32 inverse-enrolment
      trap is the named failure mode.
- [ ] Add a test that the param seeds the correct draft AND that
      Skip writes the seeded native, not the default.

### 8d. Changing the localStorage shape

- [ ] DO NOT change the existing keys (`mercyblade.languagePair`,
      `mercyblade.nativeLang`). Existing users have data under
      them. Migrate via `parseLanguagePair`'s forward-compatibility.
- [ ] If you add a NEW key, follow the `mercyblade.*` namespace.
- [ ] Update `parseLanguagePair` if the parse rules change.
- [ ] Update `readAnonymousPair` to read the new shape AND
      fall back to the old shape for at least one release.

### 8e. Modifying the gate decision tree

- [ ] Preserve the `hasResolvedRef.current` "wait for first
      resolved" semantics. Never bounce on a transient first-paint
      flip.
- [ ] If you add a new escape hatch param, add it to
      `CTA_GATE_PARAMS`.
- [ ] Test BOTH the gate ON (first-time anon, no CTA) AND OFF
      (signed-in, returning anon, CTA-signaled) paths.

### 8f. Re-syncing localStorage → profile on signup

- [ ] The signup conversion path (`src/lib/auth/conversion.ts`)
      reads localStorage and writes the pair to `profiles` in the
      same transaction as the user creation. **Don't add a delay or
      conditional** — the user must not see a one-frame flash of
      Home-as-NULL-pair.
- [ ] Confirm `onboarded_at` is set to NOW on the sync (the
      anonymous user already "completed onboarding"; we're just
      promoting that signal to the row).
- [ ] If localStorage is empty at signup (edge case: someone signed
      up from an Auth page directly), Home's profile gate will
      bounce them to the picker. That's correct.

---

## 9. The two-line summary

> The onboarding picker is the anonymous entry point for *learning
> setup* — it captures `(native, target)` into localStorage
> (`mercyblade.languagePair` + `mercyblade.nativeLang` mirror) BEFORE
> signup, with a one-time post-signup sync to `profiles`. It is
> reached via the marketing landing's CTA (not via an unconditional
> redirect — that disposition was reversed 2026-05-18); a returning
> anonymous visitor with a stored pair skips it entirely. PR #590's
> default-'vi' migration was reversed under Locked #14 — never
> re-apply.

If you ever need to explain onboarding in two sentences, those are
them.
