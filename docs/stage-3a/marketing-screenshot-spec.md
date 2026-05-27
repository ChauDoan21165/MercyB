# Stage 3A — Marketing Screenshot Spec

Operational spec for capturing the Stage 3A *"What I'm Weak At"*
launch screenshot. ROADMAP §3A names this as the marketing-visible
demo artifact:

> *"Duolingo tells you to keep a streak. MercyBlade tells Vietnamese
> learners why they keep making the same English mistake."*

This doc tells you (Chau) exactly what to seed, what viewport to use,
and which framing copy to caption the asset with. **It does not
generate the screenshot — agents cannot run a real device or
browser. Chau takes the actual capture.**

The screenshot exists to be a one-screen, one-story, one-sentence
asset for TikTok, Facebook, and Zalo. Not a feature explainer, not a
gameplay clip — a still that contrasts the streak-mechanic frame
against the diagnostic frame in a single glance.

---

## 1. Pre-screenshot seed data

The `/weak-at` route reads only `localStorage`; no server fetch, no
sign-in, no placement-completion required. Three keys feed the three
sections that `LocalWeaknessMap` renders. Paste this block into the
browser DevTools console **on the same origin as the app** (e.g.
`http://localhost:3107`) before navigating to `/weak-at`:

```javascript
// L1 grammar pattern ring buffer (50-entry FIFO; we seed 8 recent
// observations across 4 distinct tags so the top-L1 section reads
// dense without overflow).
const now = Date.now();
const mins = (n) => now - n * 60_000;
const hours = (n) => now - n * 3_600_000;
const days = (n) => now - n * 86_400_000;

localStorage.setItem(
  "mb.stage3a.l1.recent",
  JSON.stringify([
    { tag: "vi_l1_no_aux_negation", ts: mins(4) },
    { tag: "vi_l1_no_aux_negation", ts: hours(2) },
    { tag: "vi_l1_no_aux_negation", ts: hours(8) },
    { tag: "vi_l1_subject_gender", ts: hours(3) },
    { tag: "vi_l1_subject_gender", ts: days(1) },
    { tag: "vi_l1_topic_comment_fronting", ts: hours(5) },
    { tag: "vi_l1_future_adverb_bare", ts: days(2) },
    { tag: "vi_l1_co_transfer", ts: days(3) },
  ])
);

// Placement v3 snapshot. Single object — latest only. Use real tag
// IDs from `src/lib/stage-3a/taxonomy.ts` PLACEMENT_DESCRIPTIONS
// so the labels render in Vietnamese without "tag id" leakage.
localStorage.setItem(
  "mb.stage3a.placement.snapshot",
  JSON.stringify({
    cefr: "A2",
    weaknesses: [
      "th_stopping_and_fronting",
      "inflectional_s_ed_inaudible",
      "past_tense_unmarked",
    ],
    completedAt: days(4),
    sessionId: "seed-marketing-screenshot",
  })
);

// Pronunciation ring buffer (100-entry FIFO). Seed enough varied
// phonemes that the aggregator's 14-day rolling window surfaces
// realistic error rates per axis. Accuracies in 0..100; lower = worse.
localStorage.setItem(
  "mb.stage3a.pronunciation.recent",
  JSON.stringify([
    { phoneme: "θ", accuracy: 32, ts: mins(10), painPointAxis: "TH_T" },
    { phoneme: "θ", accuracy: 41, ts: hours(1), painPointAxis: "TH_T" },
    { phoneme: "θ", accuracy: 38, ts: hours(6), painPointAxis: "TH_T" },
    { phoneme: "θ", accuracy: 28, ts: days(1), painPointAxis: "TH_T" },
    { phoneme: "ɹ", accuracy: 55, ts: hours(3), painPointAxis: "R_L" },
    { phoneme: "l", accuracy: 48, ts: hours(7), painPointAxis: "R_L" },
    { phoneme: "ɹ", accuracy: 51, ts: days(2), painPointAxis: "R_L" },
    { phoneme: "t", accuracy: 64, ts: hours(2), painPointAxis: "ED_ENDINGS" },
    { phoneme: "d", accuracy: 59, ts: days(1), painPointAxis: "ED_ENDINGS" },
    { phoneme: "s", accuracy: 72, ts: hours(4), painPointAxis: "S_PLURALS" },
  ])
);
```

After pasting, reload `/weak-at`. All three sections (Lỗi ngữ pháp,
Kết quả kiểm tra, Phát âm) should render populated — no empty
state, no skeleton. If any section is empty, the corresponding
`localStorage` write failed silently (private browsing, quota); open
DevTools → Application → Local Storage and verify the three keys
exist.

## 2. Viewport

iPhone-portrait reference frame:

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
6. Wait ~1 second for the skeleton to swap for populated sections — the aggregator runs synchronously on mount but React batches the first paint.
7. Capture: DevTools three-dot menu → **Capture screenshot** (full viewport, no chrome). Save as `stage-3a-launch.png`.
8. Inspect the output: must contain VI-primary headings (Điểm yếu của bạn, Lỗi ngữ pháp, Kết quả kiểm tra, Phát âm), no gamification words, no Supabase loading indicators, no PII.

## 4. Framing copy

The asset is the screenshot **plus a caption**. Two language tracks, same beat:

**Vietnamese (primary track for VN-resident + diaspora audiences):**

> Duolingo nhắc bạn duy trì chuỗi.
> MercyBlade chỉ cho người Việt biết tại sao họ cứ mắc cùng một lỗi tiếng Anh.

**English (mirror caption for EN-language posts and bilingual diaspora posts):**

> Duolingo tells you to keep a streak.
> MercyBlade tells Vietnamese learners why they keep making the same English mistake.

The two lines are paired but not redundant — the VI line is the home-axis voice; the EN line is the bilingual mirror. Use VI alone for Zalo + TikTok-VN. Use the pair (VI primary, EN secondary) for Facebook diaspora posts. Use EN alone only when the surrounding post is English-speaker-targeted.

## 5. Posting checklist

For each platform, the asset is the same screenshot — only the caption + tags shift.

### TikTok / TikTok-VN

- Caption (VI line, no EN).
- Tags: `#hocTiengAnh #nguoiViet #IELTS #TiengAnhCoBan #MercyBlade`
- Format: 1080 × 1920 vertical. Pad the 375 × 812 capture with a centered crop on a soft gradient background (use the Stage 3A indigo/amber/teal palette already in the component) — do not stretch the screenshot itself.

### Facebook (diaspora groups + the MercyBlade page)

- Caption: VI line on first line, blank line, EN line on second line. Closes with `mercyblade.com/weak-at` as the CTA.
- Image: 1200 × 630 landscape or 1080 × 1080 square. Compose with the 375 × 812 capture left-aligned, framing copy right-aligned (mobile preview crops square anyway).

### Zalo

- Caption: VI line only. Zalo audience is Vietnam-resident; an EN line dilutes.
- Image: 1080 × 1080 square. No CTA link (Zalo strips most external links from preview cards); the caption mentions "Tại MercyBlade trên web" instead.

## 6. What this screenshot is NOT

- Not a viral guarantee. The asset is a launch input; the §1 mission test (named Vietnamese learner outcome) is its eventual output, not a result of any one post.
- Not a §15 Bar #7 closure. Bar #7 stays open until a real testimonial lands; reposts and engagement metrics don't count.
- Not a feature explainer. If the screenshot needs a paragraph of explanation to land, the framing copy is wrong, not the feature. Iterate on the copy first, the screenshot last.
- Not an outcome-claim asset. "Real learners use this" requires real learners. Until then, the asset is a positioning statement: *here is the diagnostic frame, contrasted with the streak frame.*

## 7. References

- ROADMAP §3A — *"What I'm Weak At" / Local Weakness Map* — describes the marketing-visible demo artifact requirement.
- `docs/stage-3a/local-weakness-map-design.md` — full design doc for the component.
- `src/components/stage-3a/LocalWeaknessMap.tsx` — the component being captured.
- `src/pages/WeakAt.tsx` — the `/weak-at` route shell.
- `src/lib/stage-3a/taxonomy.ts` — source of the Vietnamese learner-language strings the screenshot will display.
