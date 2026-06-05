# Stage 3B — Marketing Screenshot Spec

Operational spec for capturing the Stage 3B *Suggested Practice*
launch screenshot. `layer-model.md` §3B names the next-step suggestion list
as the marketing-visible artifact for this stage — the screen below
the Local Weakness Map that turns *"here is what's still rough"* into
*"here are three things to practice next."*

> *"Duolingo tells you to keep practicing.
> MercyBlade tells Vietnamese learners exactly what to practice next."*

This doc tells you (Chau) exactly what to seed, what viewport to use,
where to scroll, and which framing copy to caption the asset with.
**It does not generate the screenshot — agents cannot run a real
device or browser. Chau takes the actual capture.**

The screenshot exists as a one-screen, one-story, one-sentence asset
for TikTok, Facebook, and Zalo. The story is the contrast between
*"keep your streak alive"* (the engagement frame) and *"here are the
specific three things to work on next"* (the prescriptive frame).
Not a feature explainer, not a gameplay clip — a still that contrasts
those two postures in a single glance.

The companion Stage 3A asset (`docs/stage-3a/marketing-screenshot-spec.md`)
captures the diagnostic frame ("why you keep making the mistake"); this
asset captures the prescriptive frame ("what to do about it"). The two
ship as a pair when a thread or carousel benefits from both, but each
also stands alone.

---

## 1. Pre-screenshot seed data

The `/weak-at` route reads only `localStorage` — no server fetch, no
sign-in, no placement-completion required. The same three keys that
feed `LocalWeaknessMap` feed the Stage 3B engine `selectSuggestedPractice`,
which renders one row per source (L1 → placement → pronunciation).

The seed below differs from the Stage 3A seed: it is tuned so each of
the three rows in `SuggestedPracticeList` lands on a **distinct
domain** (subject-verb agreement / past-tense morphology / the *th*
sound). The Stage 3A seed clusters two of its strongest signals on
*th*, which is correct for the LocalWeaknessMap story but reads as
repetitive in the three-row suggestion frame. Reuse this seed for the
3B capture; use the 3A seed for the 3A capture.

Paste this block into the browser DevTools console **on the same
origin as the app** (e.g. `http://localhost:3107`) before navigating
to `/weak-at`:

```javascript
// L1 grammar pattern ring buffer (50-entry FIFO). Top tag drives the
// L1 row in SuggestedPracticeList. vi_l1_3rd_person_s is seeded with
// the highest count so the engine ranks it first.
const now = Date.now();
const mins = (n) => now - n * 60_000;
const hours = (n) => now - n * 3_600_000;
const days = (n) => now - n * 86_400_000;

localStorage.setItem(
  "mb.stage3a.l1.recent",
  JSON.stringify([
    { tag: "vi_l1_3rd_person_s", ts: mins(5) },
    { tag: "vi_l1_3rd_person_s", ts: hours(1) },
    { tag: "vi_l1_3rd_person_s", ts: hours(4) },
    { tag: "vi_l1_3rd_person_s", ts: days(1) },
    { tag: "vi_l1_missing_be", ts: hours(2) },
    { tag: "vi_l1_missing_be", ts: hours(7) },
    { tag: "vi_l1_question_no_aux", ts: days(2) },
    { tag: "vi_l1_plural_s", ts: days(3) },
  ])
);

// Placement v3 snapshot. The first entry in `weaknesses` becomes the
// placement row (the local snapshot carries no severity, so the
// engine takes the head). past_tense_unmarked is a real
// VN_L1_INTERFERENCE_PATTERNS id resolved by
// PLACEMENT_DESCRIPTIONS in stage-3a/taxonomy.ts.
localStorage.setItem(
  "mb.stage3a.placement.snapshot",
  JSON.stringify({
    cefr: "A2",
    weaknesses: [
      "past_tense_unmarked",
      "missing_articles",
      "copula_be_omission",
    ],
    completedAt: days(4),
    sessionId: "seed-stage3b-screenshot",
  })
);

// Pronunciation ring buffer (100-entry FIFO). The aggregator sorts
// pain-point axes by error rate desc; TH_T is seeded with the lowest
// accuracies so it heads the list — the resulting row reads
// "Âm th tiếng Anh hay bị nhầm thành t."
localStorage.setItem(
  "mb.stage3a.pronunciation.recent",
  JSON.stringify([
    { phoneme: "θ", accuracy: 30, ts: mins(12), painPointAxis: "TH_T" },
    { phoneme: "θ", accuracy: 36, ts: hours(2), painPointAxis: "TH_T" },
    { phoneme: "θ", accuracy: 33, ts: hours(8), painPointAxis: "TH_T" },
    { phoneme: "θ", accuracy: 28, ts: days(1), painPointAxis: "TH_T" },
    { phoneme: "s", accuracy: 68, ts: hours(3), painPointAxis: "S_PLURALS" },
    { phoneme: "s", accuracy: 71, ts: hours(9), painPointAxis: "S_PLURALS" },
    { phoneme: "t", accuracy: 74, ts: hours(5), painPointAxis: "ED_ENDINGS" },
    { phoneme: "d", accuracy: 79, ts: days(2), painPointAxis: "ED_ENDINGS" },
  ])
);
```

After pasting, reload `/weak-at`. The Local Weakness Map should
render all three sections (Lỗi ngữ pháp, Kết quả kiểm tra, Phát âm).
Scrolling down past the map should reveal the *Gợi ý luyện tập* card
with exactly three rows in this order:

| # | Kind chip | VI label | EN label | Rationale (VI) |
|---|---|---|---|---|
| 1 | Ngữ pháp (indigo, BookOpen) | Hay quên thêm -s sau he, she, it. | You often skip -s after he, she, it. | Mẫu này đã xuất hiện 4 lần gần đây. |
| 2 | Trình độ (amber, ClipboardList) | Hành động quá khứ cần dấu hiệu trên động từ. | Past actions need a past-tense verb form. | Ghi nhận từ bài kiểm tra trình độ. |
| 3 | Phát âm (teal, Volume2) | Âm th tiếng Anh hay bị nhầm thành t. | The English th often comes out as t. | Tỉ lệ chưa đúng 68% qua 4 lần luyện. |

The exact pronunciation-row percentage (68%) is computed by the
aggregator from the four seeded TH_T samples; if your seed differs,
the percentage drifts but the row order should not. If any row is
missing, the corresponding `localStorage` write failed silently
(private browsing, quota). Open DevTools → Application → Local
Storage and verify the three `mb.stage3a.*` keys exist.

## 2. Viewport

Same reference frame as Stage 3A — keeping the pair visually
consistent matters more than chasing a different device.

| Dimension | Value | Notes |
|---|---|---|
| Width  | **375 px** | iPhone 14 / SE class viewport |
| Height | **812 px** | Full screen incl. notch reserve |
| DPR    | 2× or 3×  | Use device-pixel ratio matching the target device for crisp text |

Recommended capture environment:

- Chrome DevTools → **Toggle device toolbar** → choose **iPhone 13 mini** (375 × 812 at 3×).
- OR: a real iPhone via Safari on macOS Web Inspector (cleaner font rendering, but device-pixel-ratio depends on the actual device).

## 3. Capture procedure

1. Start the dev server: `npm run dev` (listens on `127.0.0.1:3107`).
2. Open the app in Chrome at `http://127.0.0.1:3107/`.
3. Open DevTools → Console. Paste the seed block from §1.
4. Switch to device toolbar (Cmd-Shift-M); pick **iPhone 13 mini** (375 × 812).
5. Navigate to `/weak-at`.
6. Wait ~1 second for the skeletons to swap for populated content — both `LocalWeaknessMap` and `SuggestedPracticeList` run their aggregations synchronously on mount but React batches the first paint.
7. **Scroll until `Gợi ý luyện tập` sits roughly 120 px from the top of the viewport.** The intent: the *Phát âm* section (last block of LocalWeaknessMap) is partly visible at the top of the frame so the viewer reads *"this card is below the diagnostic map"*, and all three suggestion rows are fully visible below. If `SuggestedPracticeList` is the only thing in frame, scroll up ~80 px to let the LWM context bleed in.
8. Capture: DevTools three-dot menu → **Capture screenshot** (visible viewport, not full page). Save as `stage-3b-launch.png`.
9. Inspect the output: must contain the *Gợi ý luyện tập* heading + *Suggested practice* subtitle, three rows with the three kind chips (indigo / amber / teal), Vietnamese-primary labels with English subtitles, no `console.log` overlays, no Supabase loading indicators, no PII.

## 4. Framing copy

The asset is the screenshot **plus a caption**. Two language tracks,
same beat:

**Vietnamese (primary track for VN-resident + diaspora audiences):**

> Duolingo nhắc bạn luyện đều mỗi ngày.
> MercyBlade nói rõ ba điều người Việt nên luyện tiếp theo.

**English (mirror caption for EN-language posts and bilingual diaspora posts):**

> Duolingo tells you to keep practicing.
> MercyBlade tells Vietnamese learners exactly what to practice next.

The lines pair but are not redundant — the VI line is the home-axis
voice; the EN line is the bilingual mirror. The angle is *what* over
*that*: a streak-mechanic frame tells you *that* you should
practice; the screenshot literally shows the *what* — three named
items, three domains, three rationales. Don't claim outcomes
("learners improved by X%") — the asset shows the suggestion list,
not the result of acting on it.

Use VI alone for Zalo + TikTok-VN. Use the pair (VI primary, EN
secondary) for Facebook diaspora posts. Use EN alone only when the
surrounding post is English-speaker-targeted.

## 5. Posting checklist

For each platform, the asset is the same screenshot — only the
caption + tags shift.

### TikTok / TikTok-VN

- Caption (VI line, no EN).
- Tags: `#hocTiengAnh #nguoiViet #IELTS #TiengAnhCoBan #MercyBlade`
- Format: 1080 × 1920 vertical. Pad the 375 × 812 capture with a centered crop on a soft gradient background (the Stage 3B card uses a violet/white gradient — match the surrounding pad to it, or use the shared Stage 3A indigo/amber/teal palette to read as one launch wave). Do not stretch the screenshot itself.
- If posting alongside the Stage 3A asset (carousel or thread), put 3A first ("why you keep making the mistake") and 3B second ("what to practice next"). Reversing the order breaks the narrative.

### Facebook (diaspora groups + the MercyBlade page)

- Caption: VI line on first line, blank line, EN line on second line. Closes with `mercyblade.com/weak-at` as the CTA.
- Image: 1200 × 630 landscape or 1080 × 1080 square. Compose with the 375 × 812 capture left-aligned, framing copy right-aligned (mobile preview crops square anyway).
- If posting both 3A + 3B, prefer a 2-image Facebook post (3A first, 3B second) over a stitched composite — the screenshots are dense and a stitch loses readability at mobile-preview size.

### Zalo

- Caption: VI line only. Zalo audience is Vietnam-resident; an EN line dilutes.
- Image: 1080 × 1080 square. No CTA link (Zalo strips most external links from preview cards); the caption mentions "Tại MercyBlade trên web" instead.

## 6. What this screenshot is NOT

- Not a viral guarantee. The asset is a launch input; the §1 mission test (named Vietnamese learner outcome) is its eventual output, not a result of any one post.
- Not a §15 Bar #7 closure. Bar #7 stays open until a real testimonial lands; reposts and engagement metrics don't count.
- Not an outcome claim. The card literally shows *three named items the local engine surfaced*. It does not show — and the caption must not claim — that acting on them improved a learner's score, retention, or fluency. Until a real learner credits this surface for a real outcome, the asset is a positioning statement: *here is the prescriptive frame, contrasted with the engagement frame.*
- Not a feature explainer. The card surface and the three rows do all the explaining the screenshot needs. If the caption needs a paragraph to land, the framing copy is wrong, not the feature. Iterate on copy first, screenshot last.
- Not a routing demo. The row `onClick` is currently a `console.log` stub — the practice handoff ships in a later brick. Don't film a "tap goes to a drill" follow-up against this build.
- Not a Stage 3A replacement. The 3A asset (`docs/stage-3a/marketing-screenshot-spec.md`) carries the diagnostic story; this asset carries the prescriptive story. They pair, they don't substitute.

## 7. References

- `layer-model.md` §3B — *Suggested Practice* — describes the prescriptive surface that turns the Stage 3A diagnostic into a "what to do next" list.
- `docs/stage-3a/marketing-screenshot-spec.md` — companion spec for the diagnostic-frame screenshot.
- `src/stage-3b/suggestedPractice.ts` — the ranking engine (pure, one-per-kind cap, head element per source).
- `src/stage-3b/types.ts` — `SuggestedPracticeItem` shape (what each row renders from).
- `src/components/stage-3b/SuggestedPracticeList.tsx` — the component being captured.
- `src/pages/WeakAt.tsx` — the `/weak-at` route shell that mounts `LocalWeaknessMap` followed by `SuggestedPracticeList`.
- `src/lib/stage-3a/taxonomy.ts` — source of the Vietnamese learner-language strings that the engine surfaces verbatim in row labels.
