# ASO (App Store Optimization) — strategy

> ASO = SEO for app stores. Three levers: **keywords**, **screenshots**, **first-screen description**. Conversion compounds with downloads, so the first 30 days post-launch matter disproportionately.

---

## 1. Keyword research

### Vietnam market — head terms

| Keyword (VI) | Monthly searches (Apple, est.) | Difficulty | Notes |
|---|---|---|---|
| học tiếng anh | very high (10k+) | very high | ELSA, Cake, Duolingo dominate. We can't outrank head; surface via subtitle. |
| luyện ielts | high (~5k) | high | More winnable than "học tiếng anh". |
| phát âm tiếng anh | medium (~2k) | medium | **Sweet spot** — our actual differentiator. |
| nói tiếng anh | high | high | Drives speaking-focused intent. |
| chấm điểm phát âm | low (~500) | low | **Long-tail win** — phoneme-scoring intent. |
| toeic | high (~3k) | high | Worth indexing as v1 ships TOEIC track. |
| vstep | medium (~1k) | medium | Small but un-contested at app level. |
| ngữ pháp tiếng anh | medium | medium | Secondary. |

### Vietnam market — tail / brand terms

These pad the 100-char keyword field without competing on head:

- `cô mercy` (brand association)
- `học tiếng anh online`
- `tiếng anh giao tiếp`
- `phát âm chuẩn`
- `tiếng anh cho người việt`

### US / Canada / Australia market

We are *not* trying to outrank generic English-learning apps in these markets. Goal: capture diaspora intent.

| Keyword (EN) | Monthly searches | Difficulty | Notes |
|---|---|---|---|
| english for vietnamese | low | low | Direct intent match — our biggest EN advantage. |
| vietnamese pronunciation english | very low | very low | Long-tail; high intent. |
| ielts vietnam | medium | low | Combines exam + nationality — winnable. |
| pronunciation app | high | high | Don't try; ELSA owns this. |

### Final 100-char keyword field (Apple, EN locale)

```
ielts,toeic,vstep,english,vietnamese,phát âm,học tiếng anh,pronunciation,grammar,mercy,speaking
```

Rationale (A6 §1.5):
- Apple ignores words already in title/subtitle, so omit "MercyBlade", "English", "Vietnamese learners".
- Vietnamese diacritics are searchable — include `phát âm` + `học tiếng anh`.
- Localize a separate keyword field for `vi-VN` if Apple Connect surfaces one (it doesn't always).

---

## 2. Competitor analysis

### ELSA (current market leader for Vietnamese learners)

- **What they nail:** AI pronunciation feedback, polished onboarding, brand recognition, premium pricing pages.
- **What they miss:** Generic "fix-your-accent" framing for any non-English speaker. Vietnamese is one of 30+ languages they support — never the protagonist.
- **Where MercyBlade wins:** Vietnamese cultural examples (phở, Tết, Honda Wave). Vietnamese-first UI. Vietnamese transfer-error grammar drills (articles, plurals). Lower price (VND-anchored, not USD-translated).
- **Where ELSA wins:** Brand trust, retention machinery, speech model trained on bigger corpus.
- **Implication for ASO:** lead screenshots with Vietnamese cultural examples + bilingual UI; lead description with "for Vietnamese learners — not translated."

### Cake (Korean import, popular in VN)

- **What they nail:** Short-form video lessons, social/discovery feel, free-tier hook.
- **What they miss:** No serious exam-prep track. Pronunciation feedback is light. No teacher persona.
- **Where MercyBlade wins:** Real exam tracks (IELTS / TOEIC / VSTEP), Mercy character, depth over snippets.
- **Implication for ASO:** lead with "500+ rooms" not "5-second clips" — explicitly differentiate length and depth.

### Duolingo (gravity)

- **What they nail:** Gamification, streaks, brand love.
- **What they miss:** Zero pronunciation depth, English-from-Vietnamese specifically is afterthought.
- **Where MercyBlade wins:** outcomes (IELTS scores, job interviews) over engagement (streaks).
- **Implication for ASO:** explicitly say "no streak-shaming" in description (already in copy). Counter-positions us against Duolingo's biggest user gripe.

### TFLAT, Helo English (local Vietnamese apps)

- **What they nail:** Localization, offline content.
- **What they miss:** Modern AI feedback, exam-prep depth, design polish.
- **Where MercyBlade wins:** Phoneme-level scoring + AI guidance.
- **Implication for ASO:** Don't out-cheap them — out-quality them. Position as "modern" without being "Western".

---

## 3. Screenshots — conversion priority

A6 §3 has the shot list. ASO addition: **the first screenshot drives ~80% of conversion**. Order matters.

Recommended order (different from listing field order):

1. **Pronunciation phoneme score** (the differentiator nobody else has at this depth)
2. **Mercy character + warm correction** (humanizes the app instantly)
3. **Vietnamese cultural example mid-lesson** (shows we mean it)
4. **IELTS / TOEIC / VSTEP track selector** (signals depth)
5. **500+ rooms grid** (signals breadth)
6. **Account control / privacy** (trust signal — Vietnamese users are privacy-aware post-cybersecurity-law)
7. *(optional)* Pricing in VND, not USD (price clarity)

---

## 4. Localization

| Market | Locale | Strategy |
|---|---|---|
| Vietnam (primary) | vi-VN | Vietnamese subtitle + description + screenshots. ASO bet: "phát âm" + "luyện ielts" + "vstep" tail terms. |
| US / Canada (diaspora) | en-US | English subtitle + description. ASO bet: "english for vietnamese" long-tail. Same screenshots — caption overlays already bilingual. |
| Australia | en-AU | Mirrors en-US. |
| UK | en-GB | Mirrors en-US (skip if Apple charges per-locale fee tier — verify). |

Don't localize into Korean / Japanese / Spanish in v1. Spread thin = no traction. Add locales only after the diaspora locale shows real conversions.

---

## 5. Conversion benchmarks (numbers to beat)

Apple App Store category averages (Education, 2025):

- **Listing → install conversion:** 22–32% (median ~26%)
- **Search → product page tap:** 4–7% (median ~5.5%)
- **Browse → product page tap:** 1–2%

MercyBlade goals for v1, first 30 days:

- Listing → install: **≥ 35%** (well-defined niche + strong differentiator)
- Search "phát âm" / "luyện ielts" → tap: **≥ 8%**
- Direct downloads from `mercyblade.com` web → install: **≥ 70%** (warm traffic)

If listing → install is below 25% after 7 days post-launch, the lead screenshot is the first thing to A/B test (Apple supports up to 3 product page versions for testing).

---

## 6. Post-launch plan

| Week | Action |
|---|---|
| Week 1 | Watch App Store Connect "Sources" daily. Tag downloads by source so paid VS organic vs direct can be measured. |
| Week 2 | If conversion < 25%, swap lead screenshot. Run for 7 days. |
| Week 3 | Submit minor metadata update (subtitle tweak) — Apple ranks fresh listings slightly higher. |
| Week 4 | Capture first 5 testimonials → add to description (replaces character headroom). |
| Month 2 | Localize for en-AU / en-GB if data supports. |
| Month 3 | Re-evaluate keyword field with Apple Connect's keyword tool — drop low-impression terms, add new ones from search-impressions data. |

---

## 7. Measurement

- **Primary metric:** activation = downloads × session-1 → day-7 retention. Anything that boosts downloads but kills retention is anti-ASO.
- **Secondary:** keyword rank for `phát âm tiếng anh`, `luyện ielts`, `english for vietnamese`. Tracked via App Store Connect (free) or Sensor Tower (paid).
- **Forbidden vanity metrics:** total downloads divorced from conversion. Five thousand junk downloads tank the algorithm.
