# Phase-2 audit — `src/components/mercy-guide/MercyGuidePanel.tsx`

**Surface:** the floating Mercy Guide panel shell — the dockable
overlay that hosts the Mercy tab system. Header pill (avatar +
title + fullscreen/close buttons) + a centered card body that
currently renders a single **Mercy Kids** entry-point card.

**Priority:** **YES** — named in
`docs/copy/bilingual-audit.md` §281 as part of the `mercy-guide/`
top-priority directory. Listed for batch-4 (Phase-2 #7) in the
!89 still-pending-list.

**Scope special note — CC2 kids-mode lane:** the panel body
renders a Mercy Kids landing card at lines 96–112 (`Mercy Kids` /
`Vào không gian học của bé` / `Vào Mercy Kids`) with an outbound
nav `href="/kids/vi-english"` (line 106). This card is the panel's
only body content today. **Per the dispatch's CC2 kids-mode rule,
the kids-card strings are out of scope for this audit** — they
belong in CC2's lane, NOT here. The audit covers only the
panel-shell strings (header subtitle + aria-labels + fallback
title).

**Scope:** 4 distinct non-kids surfaces (1 subtitle, 3
aria-labels — including the 2 states of the fullscreen toggle —
plus the default header title fallback).

**Method:** verdict column per `docs/copy/bilingual-audit.md`
§Method.

**Conclusion:** **3/4 OK + 1 revision candidate** — the header
subtitle (`Choose where you want to practice.`) is EN-only on a
Mercy-surface panel that otherwise routes through bilingual
sub-tabs. The aria-labels (EN-only) are correct per a11y
convention. The fallback title `Teacher Mercy` reads naturally
in either language. Plus one structural observation about the
kids-card-as-only-body design that may be a `vi-style-guide.md`
§1 register question for the panel architecture, not the copy.

---

## Catalog

### Header pill (lines 70, 78, 88, 183)

| Loc | VI | EN | Verdict | Proposed revision |
|---|---|---|---|---|
| 70 (header subtitle) | — (no VI companion) | `Choose where you want to practice.` | **awkward — EN-only on a Mercy-surface panel** | Add a VI subtitle line. The panel's tab content uses Mercy's warm-elder-sister `em` register (per `UnifiedMercyChat.tsx` §1.1 audit in !65); a natural pair would be `Chọn nơi em muốn luyện hôm nay.` (uses `em` to match the register). Alternative: drop the subtitle entirely — it's a header secondary line, dense, and the tab content immediately below tells the same story. |
| 78 (fullscreen toggle aria-label, 2 states) | — | `Exit full screen` / `Full screen` | **OK** — aria-labels are by convention EN-only on a11y APIs (screen readers in VN locales typically prefer the EN technical-control name). Matches the existing `MercySpeakTab.tsx` aria-labels pattern (lines 223, 233, 325, 365, 387). | — |
| 88 (close button aria-label) | — | `Close Mercy panel` | **OK** — same a11y convention. | — |
| 183 (fallback header title) | (none — runtime fallback) | `Teacher Mercy` | **OK** — `Teacher Mercy` is the brand-product name; reads natural in both languages. Matches `project_teacher_mercy` ([memory: the character is Teacher Mercy; never "host"]). | — |

### Kids-mode card (lines 96–112) — OUT OF SCOPE per CC2 lane

The panel's only body content today is a single Mercy Kids
entry-point card with three VI strings (`Mercy Kids`, `Vào không
gian học của bé`, `Vào Mercy Kids`) and an outbound nav to
`/kids/vi-english`. **The audit explicitly does NOT verdict these
strings** — they are CC2's territory. Documented here only so a
future contributor knows the lane boundary, not so a non-kids
auditor edits them.

---

## Cross-cutting observations

1. **The panel body is currently a kids-only entry point.** This
   is a structural finding, NOT a copy finding. The Mercy Guide
   panel's intended product role (per the !65 `mercy-guide/`
   architecture deep-dive at `docs/architecture/systems/mercy-guide.md`)
   is the in-context tutor surface that hosts 5 tabs (Teacher /
   Suggest / Speak / [Logic] / Guide). But this concrete file —
   `MercyGuidePanel.tsx` — renders a different body
   (`FloatingHelperLauncher`) that ONLY shows the Mercy Kids
   card. There may be a separate panel implementation
   (`UnifiedMercyChat.tsx` audited in !65) that hosts the tabs,
   with this file being a different / older code path. The copy
   audit cannot resolve which file is the "live" panel without
   reading the consumers. Flagged for cross-doc verification —
   does not change the verdict on the 4 in-scope strings.
2. **The header subtitle is the only non-kids defect on this
   surface** and is a low-cost fix (one-line addition or one-line
   drop). The audit's revision suggestion uses `em` to align with
   the `em`-pronoun thesis surfaced in `UnifiedMercyChat.tsx`
   (audit !65). **Em-pronoun thesis update:** this file confirms
   the thesis only weakly — `em` doesn't appear in the file
   today, but the proposed revision would extend the thesis to
   the panel-shell subtitle layer.
3. **No shame triggers, no MT-feel.** The 4 in-scope strings are
   clean. (Same finding cannot be reported for the kids-card
   strings — those are CC2's verdict, not this audit's.)
4. **a11y label convention is intact.** The 3 aria-labels follow
   the same EN-only-by-convention shape used across the mercy-
   guide directory (`MercySpeakTab.tsx`, `UnifiedMercyChat.tsx`).
   Internal consistency is high.

## References

- `docs/copy/bilingual-audit.md` §281 (mercy-guide/ top-priority
  entry — this file is the panel-shell member of that dir).
- `docs/copy/vi-style-guide.md` §1 (pronoun register — `em` for
  Mercy-conversational surfaces per the !65 thesis).
- `docs/copy/audits/UnifiedMercyChat.tsx.md` — sibling audit with
  the `em` thesis. The proposed revision here extends that
  thesis to the panel subtitle.
- `docs/copy/audits/MercySpeakTab.tsx.md` + `MercyEnglishTab.tsx.md`
  + `MercySuggestTab.tsx.md` (sibling audits in `mercy-guide/`).
- `docs/architecture/systems/mercy-guide.md` — the panel-system
  architecture deep-dive (relevant for the cross-cutting #1
  observation about the panel-body structure).
- `src/components/mercy-guide/shared.ts` — the `MERCY_HOST_IMAGE_*`
  constants this file pulls from.
- `[memory: project_teacher_mercy]` — the character is Teacher
  Mercy; `host` is legacy terminology.
