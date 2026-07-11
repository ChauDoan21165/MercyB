# Synthetic Learner Run #8 (b/c/d) — Verdict

**Run:** pipeline commit `7eb22dfae` (!2595), job 15296034902. Result 3/6 — (a) 🟢, (e) 🟢, (f) 🟢; **(b) 🔴**, (c)/(d) blocked by (b).

## Verdict (one paragraph)

**Spec issue, not a feedback-path product break — fix the spec, merge on green.** For the
first time (a) is green (direct-API auth + session injection), so (b/c/d) fail *inside* the
tutor rather than downstream of sign-in — but the failure is **before** the correction path
even starts. The (b) action timeline shows `goto /ai-tutor` then `click internal:role=textbox
>> nth=0` timing out at 90s, and the captured `error-context.md` ARIA snapshot shows `/ai-tutor`
rendering the **language picker** (`heading "Choose Your Language"` / `link "Choose Language →"`),
**no textbox**. Root cause is an **onboarding-state gap**: `AiTutor.tsx` gates bare `/ai-tutor`
with `if (!hasUrlPair && !hasStoredPair) → "Choose Your Language"`, where `hasStoredPair =
localStorage.getItem("mercyblade.languagePair") !== null` and `hasUrlPair` = URL has
`native=`/`target=`. The synthetic account authenticates via API injection and **never runs
the picker**, so it has no stored pair → the correction tutor (and `getByRole('textbox')`)
never mounts. This is **purely presence-based on localStorage/URL — it does not read the
profile's `native_language`** — so it is fully spec-injectable and there is **no evidence of a
correction/feedback/row-write regression** (the path was never exercised). Correction render,
the feedback tap, and the `learning_events` row were **not reached**, so nothing about the
feedback path is disproven or broken; the earlier open questions (VITE_FEEDBACK_BUTTONS_ENABLED,
RLS select shape, async-row timing) remain **untested pending** a run that actually reaches the
tutor.

## Sub-step walk (b) / (c) / (d)

- **(b) CORRECTION — did NOT reach the tutor.** `/ai-tutor` rendered the "Choose Your Language"
  picker, not the correction surface. `field.click()` on `getByRole('textbox').first()` timed
  out at 90s because no textbox exists on the picker screen. The copula-drop trigger sentence
  was never entered; Mercy was never asked for a correction.
- **(c) FEEDBACK TAP — blocked by (b), untested.** Never reached the correction render, so the
  thumbs never appeared/tapped. `VITE_FEEDBACK_BUTTONS_ENABLED` in the live bundle is **still
  unconfirmed this round** — needs a run that reaches the correction.
- **(d) ROW LANDS — blocked by (c), untested.** The raw PostgREST poll never fired against a
  real feedback event. RLS select shape / async-row timing remain unverified pending a
  tutor-reaching run.

## Fix (spec only, no app code)

Inject the language pair a real onboarded user carries into the same `seedSession`
`addInitScript` that seeds the auth session:

- `localStorage["mercyblade.languagePair"] = {"native":"vi","targets":["en"]}` (exact
  `readAnonymousPair` shape, from `src/lib/languagePair/anonymousPair.ts`)
- `localStorage["mercyblade.nativeLang"] = "vi"` (the native mirror the app also writes)

vi→en matches the seeded English-grammar error sentence and journey (e)'s existing
`languagePair: { native: "vi", target: "en" }`. This bypasses the onboarding gate so
`/ai-tutor` mounts the correction tutor, letting (b/c/d) finally exercise the real
correction → feedback → row path.

## Distinguish (per task framing)

- **Real product break?** No. The correction/feedback/row path was never reached; the gate
  is a legitimate onboarding UX (bare /ai-tutor with no pair → pick one). No app-side
  regression is implicated → **not a HOLD**.
- **Spec issue?** Yes — the synthetic session lacks onboarding state the picker normally
  writes. Fixed in the spec by injecting the pair → **merge on green.**

## Next run's open items (now that the tutor will mount)

1. Does Mercy return a correction rendering for the copula-drop trigger?
2. Do the feedback thumbs appear/tap, and is `VITE_FEEDBACK_BUTTONS_ENABLED` on in the live bundle?
3. Does the `learning_events` row land with non-null `rule_or_detector_id` within the poll
   window, and does RLS select work for the synthetic uid?
