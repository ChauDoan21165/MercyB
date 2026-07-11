# Synthetic Learner Run #9 — Verdict

**Run:** pipeline 2669223535, job 15296736908, commit `f84f27258`. Result 3/6 —
(a) 🟢, (e) 🟢, (f) 🟢; **(b) 🔴**, (c)/(d) blocked by (b).

## Verdict (one paragraph) — **SPEC**

The run-8b onboarding-pair fix worked: the tutor **fully mounted** with the vi→en
correction surface (ARIA snapshot: `heading "Sửa tiếng Anh với Mercy"`, the mode tab
**"Sửa câu" [active][pressed]**, the textbox `[ref=e67]` holding the seeded sentence
"She go to school every day and she don't likes it.", and the submit button **"Sửa câu
này" [ref=e69]**). But the correction **never rendered**: the output panel `[ref=e79-82]`
is still in its pristine empty state `✨ Sẵn sàng sửa câu` ("Ready to correct") — no
loading spinner, no correction, no error. Root cause is a **spec selector bug**: the
submit locator `getByRole("button",{name:/Sửa câu|Submit|Gửi|Kiểm tra/i}).first()` matches
**two** buttons — the mode-switcher **tab "Sửa câu"** (DOM-earlier) and the real submit
**"Sửa câu này"** — and `.first()` clicked the **already-active tab** (a no-op). The
sentence was therefore never submitted, the correction never ran, so `CorrectionFeedbackButtons`
never mounted and `getByTestId('correction-feedback-helpful')` timed out at 30s. This is the
**same wrong-button class as journey (a)** — a spec form-driving defect, **not** a product
break. **Fix the selector, merge on green.**

## Which of the three: **SPEC** (not REAL PRODUCT BREAK, not CONFIG)

- **REAL PRODUCT BREAK — ruled out.** The correction path was **never invoked** — the
  output panel is the pristine "Ready" state, not a post-submit empty/error state. The
  submit `onClick={onSubmit}` (CorrectionMode.tsx:141) never fired because the click landed
  on the mode tab. Nothing about correction rendering, feedback-button mounting, or the row
  write is disproven; that path simply never ran.
- **CONFIG — ruled out.** `VITE_FEEDBACK_BUTTONS_ENABLED` **does not exist anywhere in the
  codebase** (repo-wide grep: the only hits are my own prior run-8b report). The feedback
  buttons are gated **solely** by a non-empty `rule_or_detector_id`
  (`CorrectionFeedbackButtons.tsx:59` → `const id = …trim(); if (!id) return null;`). There
  is no prod flag to be off. The earlier "reconfirm the flag" concern was a phantom — it can
  be retired.
- **SPEC — confirmed.** The submit selector matched the mode tab. Fixed by targeting the full
  submit label.

## Sub-step walk (b / c / d)

- **(b) CORRECTION — reached the tutor, but never submitted.** The runner was in the vi→en
  tutor with the seeded sentence typed into the textbox (ARIA confirms text present). The
  submit **was not triggered** (wrong button). Mercy therefore returned no correction and
  nothing rendered on the "Sửa câu" surface. Screenshot/ARIA at failure = the correction
  form with the sentence still typed and the output panel showing "✨ Sẵn sàng sửa câu"
  (Ready) — i.e. pre-submit.
- **(c) FEEDBACK TAP — blocked by (b), untested.** No correction → no `rule_or_detector_id`
  → `CorrectionFeedbackButtons` returns null → the helpful control never mounts. Not a flag
  issue (no flag exists); purely downstream of (b).
- **(d) ROW LANDS — blocked by (c), untested.** The PostgREST `learning_events` poll never
  fired against a real feedback event. RLS select shape / async-row timing remain unverified
  pending a run that actually submits a correction and taps feedback.

## Fix (SPEC only, no app code) — MR

`tests/prod-synthetic-learner/journeys.spec.ts` — replace the loose submit locator with the
full submit label so it targets the submit button, not the mode tab:

```diff
- await page.getByRole("button", { name: /Sửa câu|Submit|Gửi|Kiểm tra/i }).or(page.locator('button[type="submit"]')).first().click();
+ await page.getByRole("button", { name: /Sửa câu này|Correct my sentence/i }).first().click();
```

- `ui.submit` = **"Sửa câu này"** (vi, tutorCopy.ts:129) / **"Correct my sentence"** (en,
  tutorCopy.ts:53). The mode tab is the bare **"Sửa câu"**, which the full-label regex no
  longer matches. This mirrors the existing unit test `staleSessionGuard.test.tsx:112`
  (`getByRole("button", { name: "Sửa câu này" })`).
- The dropped `.or(button[type="submit"])` never matched anyway (the submit is
  `type="button"`) — removing it eliminates a spurious alternative.

## What is still unproven (must hold until the next run confirms)

This fix makes (b) actually submit; it does **not yet prove** the downstream path. Now
verifiable on the next run:
1. Does Mercy return a correction that renders on the "Sửa câu" surface?
2. Does that correction carry a non-null `rule_or_detector_id` (→ feedback buttons mount)?
3. Does the tap land and the `learning_events` row appear with non-null `rule_or_detector_id`
   within the poll window, under the account's own-row RLS select?

If (2) or (3) fail on the next run despite a rendered correction, **that** would be the real
moat-feature signal — HOLD and report then.
