# Phase-2 audit — `src/pages/Tiers.tsx`

**Surface:** `/tiers` — renders a per-tier room-count visualization
(level0 → level9 + premium_month + premium_year + kids_1..3 +
unknown). Five VI section headers, two VI-paired "Coming soon"
notices, and a VI/EN fallback label for the "Unknown" bucket.

**Priority:** named **YES — priority** in
`docs/copy/bilingual-audit.md` §255, with the rationale *"pricing
copy directly affects conversion."*

**⚠ Audit re-categorization needed.** This file is **not** the
consumer-facing pricing surface. It is an internal tier/room-count
diagnostic page (likely admin or contributor tooling — page H1 is
literally `Tiers` in English; the body is *"Rooms: {N}"* + a list of
tier slugs with their counts; the data source is annotated *"Source:
`getAllRooms()` (runtime room loader). Unknown is shown explicitly."*).
The consumer pricing surface is `src/screens/Pricing.tsx` (the file
that handles the `Privacy Policy / Chính sách bảo mật` link line, the
upgrade flow, etc.) — that file should take this entry's "priority"
slot in the Phase-2 queue.

**Scope:** every user-facing VI string in `Tiers.tsx`. Cataloged 7
distinct surfaces.

**Method:** verdict column per `docs/copy/bilingual-audit.md` §Method.

**Conclusion:** **7/7 OK.** No revisions warranted. File is a
low-stakes diagnostic surface; copy is well-crafted regardless of
audience.

---

## Catalog

| Loc | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|
| line 147 (SectionHeader) | `Tiếng Anh hằng ngày` | `Daily English` | **OK** — natural section heading, mirrors EN concisely. | — |
| line 150 (SectionHeader) | `Tiếng Anh cho trẻ em` | `Kids English` | **OK** — standard idiom. | — |
| line 153 (SectionHeader) | `Luyện thi` | `Exams (VSTEP · TOEIC · IELTS)` | **OK** — `Luyện thi` ("exam practice") is the natural VI for what the EN explicitly enumerates. Asymmetric (VI heading, EN enumerates the three tests) but defensible — the EN list is information-dense; VI heading is concept-dense. | — |
| line 154 (placeholder) | `Sắp ra mắt · Coming soon.` (inline bilingual) | (inline) | **OK** — standard "coming soon" idiom, VI · EN ordering correct per `vi-style-guide.md` §2. | — |
| line 156 (SectionHeader) | `Luyện nói` | `Speaking practice` | **OK** — natural. | — |
| line 157 (placeholder) | `Sắp ra mắt · Coming soon.` (inline bilingual) | (inline) | **OK** — duplicate of 154; consistent. | — |
| line 189 (TierGrid fallback label) | `Unknown / Chưa rõ` | (inline; EN-first, `/` separator) | **OK** with note — EN-first ordering on a single fallback label. Distinct from the surface-wide `VI · EN` convention but defensible as a diagnostic-bucket label (the developer-facing meaning dominates). Could be flipped to `Chưa rõ / Unknown` for surface consistency; not a defect. | (optional) `Chưa rõ / Unknown` (flip ordering) |

---

## Cross-cutting observations

1. **This file is mis-categorized in `bilingual-audit.md` §255 as a
   "Pricing surface".** It is not. The page is a diagnostic
   tier/room-count visualization with an English-only `<h1>Tiers</h1>`
   headline, a debug source-of-truth annotation, and tier slugs
   shown verbatim (e.g. `LEVEL0`, `KIDS_2`). The consumer pricing
   surface lives in `src/screens/Pricing.tsx` (see `Pricing.tsx:903`
   which renders the `Privacy Policy / Chính sách bảo mật` link).
   The Phase-2 priority slot in `bilingual-audit.md` §255 should be
   reassigned to `src/screens/Pricing.tsx` in a follow-up audit.

2. **Most page chrome is English-only** by design — this is
   diagnostic tooling, not a learner surface. The five VI section
   headers (lines 147/150/153/156) and the two `Sắp ra mắt` notices
   are the only VI footprint. All seven are on-voice.

3. **No shame triggers, no MT-feel, no register drift.** The VI
   here is short, declarative, and consistent — the kind of copy
   that survives the "read it aloud" test from `vi-style-guide.md`
   §5.

4. **The `vi="Sắp ra mắt"` placeholder pattern is worth keeping
   consistent across the codebase.** Future "Coming soon" sites
   should use the same `VI · EN` inline-bilingual shape rather than
   inventing new variants.

## References

- `docs/copy/bilingual-audit.md` §255 (file's priority entry —
  needs reassignment to `src/screens/Pricing.tsx`).
- `docs/copy/vi-style-guide.md` §2 (bilingual pairing — VI · EN).
