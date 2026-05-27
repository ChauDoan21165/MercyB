# Stage 3B — Real-Device QA Test Plan

Manual QA pass for the Stage 3B *Suggested Practice* surface, runnable on iOS + Android real devices (or DevTools device emulation) in under 15 minutes. Treat existing code as canonical — the Expected columns are derived directly from the current source, not from product intent.

Source-of-truth files this plan was built against:
- `src/components/stage-3b/SuggestedPracticeList.tsx`
- `src/components/stage-3b/practiceRoutes.ts`
- `src/stage-3b/perfInstrumentation.ts`
- `src/stage-3b/viewCount.ts`
- `src/pages/WeakAt.tsx`
- Seed snippet: `docs/stage-3b/marketing-screenshot-spec.md` §1 (reused, not redefined here)

Browser-test seam: the route is `/weak-at`. The whole page is anon-viewable (no sign-in). Reload is the unit of "render" for counter purposes.

---

## 1. Empty-state path

| Field | Value |
|---|---|
| **Setup** | Fresh install **or** DevTools → Application → Local Storage → clear all `mb.stage3a.*` and `mb.stage3b.*` keys. |
| **Steps** | 1. Navigate to `/weak-at`. 2. Wait ~1 s for skeletons to swap. 3. Scroll to the Suggested Practice region. |
| **Expected** | Page does not crash. The Stage 3A *Local Weakness Map* shows its own empty state, and below it the Stage 3B card shows `data-testid="suggested-practice-empty"` containing the VI copy **"Chưa có gợi ý — hãy hoàn thành vài bài để nhận đề xuất luyện tập."** and the EN subtitle **"Suggestions appear after a few lessons."** No `suggested-practice-list` element is present. |
| **Actual / Notes** | |
| **Pass / Fail** | |

## 2. Populated-state path (all 3 kinds)

| Field | Value |
|---|---|
| **Setup** | Paste the seed snippet from `docs/stage-3b/marketing-screenshot-spec.md` §1 (the JS block under "Pre-screenshot seed data") into the DevTools Console on the same origin as the app. Reload `/weak-at`. |
| **Steps** | 1. Confirm the page reloads. 2. Scroll to the *Gợi ý luyện tập* card. 3. Read the three rows in order. 4. Tap each row in turn (note the destination route, then back-navigate). |
| **Expected** | Exactly **3 rows** in this order, VI primary + EN subtitle on each (both always rendered — there is no per-language toggle on this surface): 1. `suggested-practice-item-l1` (indigo BookOpen chip, *Ngữ pháp*) → tap navigates to **`/ai-tutor?focus=vi_l1_3rd_person_s`**. 2. `suggested-practice-item-placement` (amber ClipboardList chip, *Trình độ*) → tap navigates to **`/placement/results`**. 3. `suggested-practice-item-pronunciation` (teal Volume2 chip, *Phát âm*) → tap navigates to **`/practice/phoneme/th`** (via the `TH_T → th` mapping in `practiceRoutes.ts`). The rationale strings in each row come from the engine (`Mẫu này đã xuất hiện N lần…` / `Ghi nhận từ bài kiểm tra trình độ.` / `Tỉ lệ chưa đúng N% qua N lần luyện.`). |
| **Actual / Notes** | |
| **Pass / Fail** | |

## 3. Partial-state path (L1 only)

| Field | Value |
|---|---|
| **Setup** | Clear all `mb.stage3a.*` keys, then write **only** the L1 ring buffer (first `setItem` block from §1). Reload `/weak-at`. |
| **Steps** | 1. Reload. 2. Inspect the Suggested Practice card. |
| **Expected** | Exactly **1 row**: the L1 row only. No placement row, no pronunciation row. The card is still rendered (not empty state) because `items.length > 0`. |
| **Actual / Notes** | |
| **Pass / Fail** | |

## 4. View counter behavior (`mb.stage3b.viewCount`)

| Field | Value |
|---|---|
| **Setup** | Clear `localStorage.mb.stage3b.viewCount`. Have the §2 seed snippet ready. |
| **Steps** | 1. With the full seed, reload `/weak-at`. Read counter: `localStorage.getItem('mb.stage3b.viewCount')`. 2. Reload `/weak-at` again. Re-read counter. 3. Clear all `mb.stage3a.*` keys (empty state). Reload `/weak-at`. Re-read counter. 4. Re-paste the §2 seed. Reload `/weak-at`. Re-read counter. |
| **Expected** | Step 1: `"1"`. Step 2: `"2"`. Step 3: still `"2"` (empty render does **not** increment). Step 4: `"3"`. The key is **only** written when at least one row renders — this is the single allowed Stage 3B `localStorage.setItem` (see top-of-file comment in `src/stage-3b/viewCount.ts`). |
| **Actual / Notes** | |
| **Pass / Fail** | |

## 5. Perf instrumentation wiring

Sentry breadcrumbs are by design only persisted alongside a real `captureException`, and Stage 3B emits **zero** captures. The slow-path thresholds (engine >50 ms, UI mount >100 ms) are also unlikely to trigger on a healthy device. So the manual check is "wiring is live + no crash," with the unit suites (`src/stage-3b/__tests__/perfInstrumentation.test.ts` — 8/8) carrying the actual contract.

| Field | Value |
|---|---|
| **Setup** | Seed §2. Open DevTools → Console. |
| **Steps** | 1. Reload `/weak-at`. 2. In the console, run `window.Sentry?.getClient?.()` — confirm Sentry SDK is loaded (truthy) in environments where it is initialized. 3. Confirm no red `[Sentry]` error rows appear in the console while visiting `/weak-at`. 4. (Optional, dev only) Temporarily lower thresholds in `perfInstrumentation.ts` to 0 to force a breadcrumb, then verify the breadcrumb appears under `window.Sentry.getCurrentHub().getScope()._breadcrumbs` (API name varies by Sentry version). Revert before committing. |
| **Expected** | No errors. If Sentry is initialized, the breadcrumb categories (when they do fire) are exactly `stage3b.perf.engine` and `stage3b.perf.ui_mount`, with payloads carrying only `durationMs` (+ count fields for the engine breadcrumb) — no source tags, no rationale strings, no user IDs. The privacy invariant is asserted in unit tests; manual QA is just a smoke check. |
| **Actual / Notes** | |
| **Pass / Fail** | |

## 6. Network panel — zero remote calls

| Field | Value |
|---|---|
| **Setup** | DevTools → Network → clear, "Preserve log" ON, filter `Fetch/XHR`. Seed §2 already pasted. |
| **Steps** | 1. Hard-reload `/weak-at`. 2. Scroll through the surface for ~5 s. 3. Inspect the Network panel. |
| **Expected** | **Zero** requests to: any `*.supabase.co` host, any `/api/*` endpoint owned by the app, any external analytics endpoint (Pixel / GA4 / Clarity beacons aside — those are governed by [[project_marketing_consent_is_tracking]] and live outside Stage 3B). The Stage 3B surface itself MUST issue zero outbound HTTP. |
| **Actual / Notes** | |
| **Pass / Fail** | |

## 7. Bilingual rendering (VI primary + EN subtitle)

> **Note — deviation from a naïve "switch language" test.** `SuggestedPracticeList.tsx` renders **both** `viLabel` (line 168) and `enLabel` (line 171) on every row, plus the bilingual header *Gợi ý luyện tập* / *Suggested practice*. There is no per-language toggle for this surface; the empty state and the loading state also surface both languages. Validate that both render, not that one switches off.

| Field | Value |
|---|---|
| **Setup** | Seed §2. |
| **Steps** | 1. Reload `/weak-at`. 2. On each of the three rows, locate the VI label (larger, bold) and the EN subtitle (smaller, gray) directly under it. 3. Read the header: *Gợi ý luyện tập* / *Suggested practice*. 4. Empty-state pass: clear keys, reload, confirm the VI line + the EN line under it. |
| **Expected** | Every row carries both labels — VI on top, EN immediately under. Header is bilingual. Empty state is bilingual. If only one language renders, that is a regression (file an issue, link this QA section). |
| **Actual / Notes** | |
| **Pass / Fail** | |

## 8. Negative / malformed-data paths

| Field | Value |
|---|---|
| **Setup** | Clear all `mb.stage3a.*` keys. |
| **Steps** | For each row below, run the indicated `setItem`, then reload `/weak-at`, then observe. 1. **Malformed JSON:** `localStorage.setItem('mb.stage3a.l1.recent', '{nope')`. 2. **Wrong shape:** `localStorage.setItem('mb.stage3a.l1.recent', JSON.stringify({foo: 'bar'}))`. 3. **Malformed counter:** `localStorage.setItem('mb.stage3b.viewCount', 'banana')`, then render with §2 seed. 4. **Negative counter:** `localStorage.setItem('mb.stage3b.viewCount', '-7')`, then render with §2 seed. |
| **Expected** | Cases 1 + 2: page does not crash, no red console error, the surface falls back to the **empty state** (Stage 3A adapters return safe defaults on bad input). Case 3: next non-empty render writes `"1"` (counter parses `'banana'` as 0). Case 4: next non-empty render writes `"1"` (negative is clamped to 0 — see `readSuggestedPracticeViewCount`). |
| **Actual / Notes** | |
| **Pass / Fail** | |

## 9. Per-device acceptance checklist

Tick each box per device. Re-run the seed before each populated test on each device — `localStorage` is per-origin per-device.

| # | Section | iOS Safari (real) | iOS Chrome (real) | Android Chrome (real) | DevTools 375×812 |
|---|---|---|---|---|---|
| 1 | Empty-state path             | ☐ | ☐ | ☐ | ☐ |
| 2 | Populated all-3 path         | ☐ | ☐ | ☐ | ☐ |
| 3 | Partial-state (L1 only) path | ☐ | ☐ | ☐ | ☐ |
| 4 | View counter behavior        | ☐ | ☐ | ☐ | ☐ |
| 5 | Perf wiring smoke check      | ☐ | ☐ | ☐ | ☐ |
| 6 | Network panel — zero remote  | ☐ | ☐ | ☐ | ☐ |
| 7 | Bilingual rendering          | ☐ | ☐ | ☐ | ☐ |
| 8 | Negative / malformed paths   | ☐ | ☐ | ☐ | ☐ |

**Tester:** ______________________ **Build / commit:** ______________________ **Date:** ______________________

A device passes only when sections 1, 2, 4, 6, 8 all pass on it. Sections 3, 5, 7 are advisory regressions worth noting but not blockers for ship.
