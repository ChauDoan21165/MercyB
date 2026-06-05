# MercyBlade — Press one-pager

**Stage 3 launch (May 27, 2026): a local-only diagnostic + practice-suggestion surface for Vietnamese learners of English.**

This page is neutral-tone and aimed at journalists and bloggers. It is not marketing copy. Every claim is verifiable against the production app at `https://mercyblade.com/weak-at`.

---

## TL;DR

MercyBlade shipped a feature called *"Điểm yếu của bạn"* (English: *What you're working on*), reachable at `/weak-at`. The surface does two things:

1. **Aggregates** a learner's recent English-language mistakes — grammar patterns, placement-test weaknesses, and pronunciation pain points — from data stored locally on their device.
2. **Suggests** at most three specific practice items to work on next, one per signal source, with a one-tap handoff to the corresponding practice surface.

The route requires no sign-in. It reads only `localStorage` — there are zero outbound network requests from the page itself. The diagnostic catalog is Vietnamese-first; English labels appear as subtitles.

---

## TL;DR (English)

MercyBlade shipped a feature called *"What you're working on"*, reachable at `/weak-at`. The surface does two things:

1. **Aggregates** a learner's recent English-language mistakes — grammar patterns, placement-test weaknesses, and pronunciation pain points — from data stored locally on the device.
2. **Suggests** at most three specific practice items to work on next, one per signal source, with a one-tap handoff to the corresponding practice surface.

The route requires no sign-in. It reads only `localStorage` — there are zero outbound network requests from the page itself. The diagnostic catalog is Vietnamese-first; English labels appear as subtitles.

---

## What Stage 3 ships (factual list)

| Component | What it does | Source file |
|---|---|---|
| `/weak-at` route | The page. Anon-viewable. | `src/pages/WeakAt.tsx` |
| `LocalWeaknessMap` | Three-section diagnostic UI — *Lỗi ngữ pháp*, *Kết quả kiểm tra*, *Phát âm*. | `src/components/stage-3a/LocalWeaknessMap.tsx` |
| `SuggestedPracticeList` | Three-row prescriptive UI — one row per signal kind (L1 grammar / placement / pronunciation). | `src/components/stage-3b/SuggestedPracticeList.tsx` |
| `selectSuggestedPractice` engine | Pure, deterministic function ranking the top signal per kind. | `src/stage-3b/suggestedPractice.ts` |
| `routeForSuggestedPractice` | Maps a suggestion to its existing practice surface: L1 → AI tutor, placement → result review, pronunciation → phoneme drill. | `src/components/stage-3b/practiceRoutes.ts` |
| Stage 3A taxonomy | The bilingual VI / EN catalog — 65 Vietnamese-L1 grammar patterns, 6 pronunciation pain-point axes, 31 placement-weakness patterns. | `src/lib/stage-3a/taxonomy.ts` |
| Stage 3A aggregator | Local-only reducer over three input adapters (L1 detector, placement snapshot, pronunciation FIFO). | `src/lib/stage-3a/aggregator.ts` |

---

## How it differs from existing English-learning apps

This section is *descriptive, not comparative*. The product does the following things; whether other apps do them differently is for the reader to evaluate.

- **Vietnamese-first.** The diagnostic labels were written in Vietnamese first, then translated to English — not the other way. The audit report at `docs/copy/bilingual-audit.md` walks the catalog.
- **Local-only on this surface.** The `/weak-at` route does not call Supabase, does not call any internal API, does not call any external analytics endpoint, while the page is open. This is verifiable by the reader via Chrome DevTools → Network → filter Fetch/XHR while loading the page.
- **L1-specific.** The 65 grammar patterns in the catalog name Vietnamese-language interference effects (e.g. *vi_l1_3rd_person_s* — "Hay quên thêm -s sau he, she, it" / "You often skip -s after he, she, it"). This is different from generic ESL grammar catalogues, which mix learner first languages.
- **No streak / no XP / no leaderboard on this surface.** The `/weak-at` page does not display a daily-streak counter, an experience-point total, or a leaderboard. MercyBlade's other surfaces use these mechanics; the diagnostic + suggestion surface deliberately does not.

---

## Privacy posture

- The `/weak-at` page reads three `localStorage` keys (`mb.stage3a.l1.recent`, `mb.stage3a.placement.snapshot`, `mb.stage3a.pronunciation.recent`) and writes one (`mb.stage3b.viewCount`, a local counter incremented only on populated renders).
- The page issues zero outbound HTTP requests for its own rendering. This is asserted in the QA test plan (`docs/stage-3b/qa-test-plan.md` §6) and is the documented invariant.
- Sentry breadcrumbs are emitted for slow-path performance events only (engine >50 ms, UI mount >100 ms). Breadcrumb payloads carry duration + count fields only — no source tags, no rationale strings, no user IDs.
- Other MercyBlade surfaces (AI Tutor, billing, account) do use server-side infrastructure. The `/weak-at` route is the exception by design.

---

## Founder

**Chau Doan** — software engineer based in Canada. Sole founder. Product is bootstrapped; no outside funding round disclosed. Email: `admin@mercyblade.com`.

---

## Available assets for press

| Asset | What it is | Location |
|---|---|---|
| Stage 3A screenshot | `LocalWeaknessMap` populated, 375 × 812 mobile capture. | Capture spec: `docs/stage-3a/marketing-screenshot-spec.md` |
| Stage 3B screenshot | `SuggestedPracticeList` scrolled into view, 375 × 812. | Capture spec: `docs/stage-3b/marketing-screenshot-spec.md` |
| Founder portrait | Available on request. | Email `admin@mercyblade.com` |
| Voice / shame-language guidelines | Public design doc. | `docs/voice-guidelines-vn.md` |
| Stylistic VI voice guide | Public design doc. | `docs/copy/vi-style-guide.md` |
| Bilingual copy audit | Public design doc — the diagnostic that informed the Stage 3 copy. | `docs/copy/bilingual-audit.md` |

---

## What MercyBlade is NOT claiming with this launch

This section is deliberately included so a journalist reading the page does not have to ask. The product is not making any of these claims:

- **No fluency promise.** MercyBlade ships a diagnostic and a suggestion list, not an outcome guarantee.
- **No IELTS / TOEIC / VSTEP score promise.** Test-prep surfaces exist as separate modules in the app; the `/weak-at` surface does not promise a specific score.
- **No claim about being better than [named competitor].** No competitor is named in any MercyBlade marketing language for this launch.
- **No claim of having paying users in [city / country].** Paying-user counts are not disclosed and are not a launch metric for Stage 3.
- **No named-learner success story.** Until a real Vietnamese learner publicly credits MercyBlade for an outcome, no testimonial is published. This is an intentional integrity gate (`CURRENT-STATE.md` §15 Bar #7).

If a journalist wants to write a story that requires any of the above claims, MercyBlade cannot supply them today — and would prefer the story did not run with fabricated numbers.

---

## How to verify the privacy claim independently

For a tech-savvy journalist who wants to verify the local-only invariant:

1. Open `https://mercyblade.com/` in Chrome.
2. Open DevTools (Cmd-Opt-I on Mac, F12 on Windows / Linux).
3. Click the **Network** tab. Filter to **Fetch/XHR**. Tick **Preserve log**.
4. Navigate to `/weak-at`.
5. Count requests originating from the page after navigation completes (ignore third-party SDK or analytics bootstraps initiated before the page change — those are common to the whole site, not specific to `/weak-at`).
6. The route's own surface (LocalWeaknessMap + SuggestedPracticeList rendering, the data-load path) should not add Fetch/XHR rows.

The QA section that asserts this is `docs/stage-3b/qa-test-plan.md` §6.

---

## Contact

`admin@mercyblade.com` for press questions, founder interview requests, asset requests. Response window: 1–3 business days, Pacific time. No PR agency intermediary.

---

## Last updated

2026-05-27. Re-verify against `main` if reading this more than a month after that date.
