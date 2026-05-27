# Stage 3 launch content kit

Post-launch marketing assets for the Stage 3 *"What I'm Weak At" + Suggested Practice"* surface that landed on `/weak-at`. This is the operator handbook — Chau (or a future marketing operator) uses these files to ship coordinated posts across TikTok, Facebook, Zalo, press contacts, and the in-product FAQ.

## What's in this kit

| File | Audience | Format | Length per piece |
|---|---|---|---|
| [`tiktok-vn-scripts.md`](./tiktok-vn-scripts.md) | TikTok-VN + diaspora-VN | Short-form video scripts | <30 s each, 5 scripts |
| [`facebook-diaspora-posts.md`](./facebook-diaspora-posts.md) | Vietnamese diaspora (US / CA / AU) | Long-form text posts | ~150–300 words each, 5 posts |
| [`zalo-share-cards.md`](./zalo-share-cards.md) | Vietnam-resident, Zalo-native | One-liner share cards | <100 chars each, 5 cards |
| [`press-one-pager.md`](./press-one-pager.md) | Vietnamese-tech journalists, English-language bloggers | One-page bilingual brief | One file |
| [`faq.md`](./faq.md) | Learners visiting `/weak-at` for the first time | Bilingual FAQ | One file |

## What's anchored to shipped code

Every claim in every file in this kit is verified against `main` as of 2026-05-27. The anchors:

- `src/pages/WeakAt.tsx` — the route. Anon-viewable, no sign-in.
- `src/components/stage-3a/LocalWeaknessMap.tsx` — the diagnostic surface (three sections: *Lỗi ngữ pháp*, *Kết quả kiểm tra*, *Phát âm*).
- `src/components/stage-3b/SuggestedPracticeList.tsx` — the prescriptive surface (three rows max: *Ngữ pháp*, *Trình độ*, *Phát âm*).
- `src/components/stage-3b/practiceRoutes.ts` — the one-tap handoff: L1 row → `/ai-tutor?focus=<tag>`, placement row → `/placement/results`, pronunciation row → `/practice/phoneme/<slug>` (TH_T / R_L / ED_ENDINGS / S_PLURALS / STRESS); INTONATION + unknown axes fall back to `/weak-at?focus=pronunciation:<axis>`.
- `src/stage-3a/aggregator.ts` + `src/stage-3a/taxonomy.ts` — the local-only reducer + the bilingual label catalog the surfaces read from.
- `src/stage-3b/perfInstrumentation.ts` + `src/stage-3b/viewCount.ts` — Sentry slow-path breadcrumbs + the single allowed `localStorage.setItem` (`mb.stage3b.viewCount`).
- Local-only invariant — zero outbound HTTP from `/weak-at` (verified in QA plan §6).

**If shipped behavior changes, the kit must follow.** A revision PR title that touches `/weak-at` or any of the files above is the signal to re-audit this kit before reposting.

## Constraints all six files honor

1. **No outcome promises.** No "guaranteed fluency", "you will pass IELTS", "fluent in X weeks". The surface ships a diagnostic + a suggestion list. Outcome claims belong with named-learner testimonials that don't exist yet (per §15 Bar #7).
2. **No competitor trademark.** No "Duolingo" trademark in any user-facing line in this kit. Where the contrast frame matters, generic phrasing ("ứng dụng nhắc chuỗi", "the streak-based apps") substitutes.
3. **VI clears the shame regex** per `docs/copy/vi-style-guide.md` — no *yếu / kém / dốt / lười / tệ / sai bét* as user-facing labels for the learner. The route name `điểm yếu` is rescued by its EN companion *What you're working on*; the kit copy reframes deliberately.
4. **Mercy-as-companion voice** for any line written in Mercy's voice — "mình" for Mercy, "bạn" for the learner, no formal hotel-lobby pronouns, no diminutives for adult learners.
5. **Bilingual pairing** per the style guide — VI primary; EN secondary serves one of three jobs (identity signal / deliberate reframe / diaspora safety net), never a translation aid for VI-natives.
6. **Mobile-first composition.** TikTok captions stay on one screen at 375 px; Facebook posts assume thumb-scroll reading; Zalo cards survive Zalo's no-link-preview behavior; press one-pager prints to a single A4 page.

## How to use this kit

1. **Pick a platform.** The platforms shape the format; the format shapes the messaging.
2. **Read the corresponding file front-to-back.** Each file's intro carries platform-specific posting guidance — TikTok hashtag conventions, Facebook image specs, Zalo no-link-preview tactics.
3. **Pair with a screenshot.** Most pieces reference the existing capture specs:
   - `docs/stage-3a/marketing-screenshot-spec.md` — the diagnostic-frame screenshot (LocalWeaknessMap populated).
   - `docs/stage-3b/marketing-screenshot-spec.md` — the prescriptive-frame screenshot (SuggestedPracticeList scrolled into view).
4. **Don't mix and match across platforms.** A TikTok caption posted on Facebook reads as a thin afterthought; a Facebook long-form posted as a TikTok caption is unreadable. The platform tax is real.
5. **Cadence ≠ urgency.** Stage 3 shipped; there is no deadline that beats accuracy. A delayed post that names a real shipped capability is worth more than a fast post that overpromises.
6. **Re-audit after any feature change.** When a Stage 3 component changes, re-walk this kit's claims before reposting old assets.

## What's NOT in this kit (intentional omissions)

- **No paid-ad copy.** Paid amplification is a separate decision and a separate budget; the kit is organic-first.
- **No influencer / partner outreach drafts.** Outreach is one-to-one and the right voice depends on the relationship; templating it dilutes.
- **No email marketing drafts.** Email lives under a separate compliance gate (no unsubscribe footer in the campaign templates yet, per CLAUDE.md "Email system"); do not send a marketing email until that footer ships.
- **No "before / after" outcome stories.** Per constraint #1.
- **No testimonials.** Per §15 Bar #7 — no real Vietnamese learner has publicly credited MercyBlade for an outcome. Fabricating one breaks the mission and the trust contract.
- **No screenshots inline.** The kit is text; the capture specs at `docs/stage-3a/` and `docs/stage-3b/` produce the visuals.

## References

- `STRATEGY.md` §6 — current state, including the 2026-05-27 entries that landed Stage 3.
- `docs/copy/vi-style-guide.md` — the stylistic voice canon for any VI copy in this kit.
- `docs/voice-guidelines-vn.md` — the anti-shame voice canon (authoritative on streak / leaderboard / progress framing).
- `docs/stage-3a/marketing-screenshot-spec.md` — the diagnostic screenshot capture spec.
- `docs/stage-3b/marketing-screenshot-spec.md` — the prescriptive screenshot capture spec.
- `docs/stage-3b/qa-test-plan.md` — manual QA against `/weak-at`. Re-walks shipped behavior the kit makes claims about.
