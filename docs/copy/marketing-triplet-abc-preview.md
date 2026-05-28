# MarketingLanding triplet — A / B / C option preview

> **Source-of-truth references:**
> - `docs/copy/bilingual-audit.md` §"Tier-2 blocked-on-shape-decision" (lines 770–784) — where the A/B/C options are first named.
> - `src/pages/MarketingLandingPage.tsx` lines 25–47 — the current `ValueCol` triplet (the affected JSX).
> - `src/components/Bilingual.tsx` — the existing 2-element wrapper that Option A would lean on.

## What the triplet is

`ValueCol` in `MarketingLandingPage.tsx` renders 3 elements per column (and there are 3 columns in the "Vì sao MercyBlade" / "Why MercyBlade" section, so 9 elements total in scope):

| Element | Lang | Role | CSS class |
|---|---|---|---|
| 1. `<h3>` | `vi` | Column heading (VI only — no EN heading peer) | `.mb-ml-col-h` |
| 2. `<p>` | `vi` | VI body (Vietnamese-primary copy) | `.mb-ml-col-vi` |
| 3. `<p>` | `en` | EN body (English peer of the VI body) | `.mb-ml-col-en` |

The shape is **VI-heading + VI-body + EN-body**, not a clean bilingual pair. The existing `<Bilingual>` wrapper covers VI/EN pairs in 2 elements — it has no slot for a 3rd "heading-without-EN-peer" element. That's why this column shape is "Tier-2 blocked-on-shape-decision" in `bilingual-audit.md`.

## Why this matters

The audit doc has migrated every other inline bilingual pair (W2, O2, P4, Home) to `<Bilingual>` for the WCAG 3.1.2 `lang`-attribute contract. MarketingLanding's column triplet is the one shape that doesn't fit. **Three options are on the table; this doc renders each so you can eyeball before picking.**

Concrete sample used for all three previews — the first column from `MarketingLandingPage.tsx:159–163` (real strings, real classes):

```
titleVi = "Học bằng tiếng Việt"
bodyVi  = "AI thầy giáo của bạn nói tiếng Việt như thầy giáo thật.
           Sửa lỗi tiếng Anh của người Việt, không phải lỗi chung chung."
bodyEn  = "Your AI teacher speaks Vietnamese like a real teacher —
           fixing the mistakes Vietnamese learners actually make,
           not generic ones."
```

---

## Option A — split into 2 elements per concept

**Concept:** the `<h3>` is a single-language element (just VI, no EN peer), so it stays as a plain inline `<h3 lang="vi">`. The VI-body / EN-body pair is the only true bilingual pair → migrate THAT through `<Bilingual>`.

### Source (what the contributor writes)

```tsx
function ValueCol({ titleVi, bodyVi, bodyEn }: Props) {
  return (
    <div className="mb-ml-col">
      <h3 lang="vi" className="mb-ml-col-h">
        {titleVi}
      </h3>
      <Bilingual
        vi={bodyVi}
        en={bodyEn}
        viClassName="mb-ml-col-vi"
        enClassName="mb-ml-col-en"
      />
    </div>
  );
}
```

### Rendered DOM (what the browser sees)

```html
<div class="mb-ml-col">
  <h3 lang="vi" class="mb-ml-col-h">
    Học bằng tiếng Việt
  </h3>
  <p lang="vi" class="mb-ml-col-vi">
    AI thầy giáo của bạn nói tiếng Việt như thầy giáo thật.
    Sửa lỗi tiếng Anh của người Việt, không phải lỗi chung chung.
  </p>
  <p lang="en" class="mb-ml-col-en">
    Your AI teacher speaks Vietnamese like a real teacher —
    fixing the mistakes Vietnamese learners actually make,
    not generic ones.
  </p>
</div>
```

### Visual

Identical to today — same fonts, same colors, same spacing. The `<Bilingual>` wrapper renders as a React Fragment, so it adds **zero** DOM container around the two `<p>` elements. The DOM tree above is byte-for-byte the same as Option C.

### Trade-offs
- **Pro:** Uses the existing wrapper for the actual bilingual pair (the only thing `<Bilingual>` is for).
- **Pro:** Pure JSX change, no new component, no new test surface.
- **Pro:** Two of the three triplet's elements have peer-language pairing semantics; this matches it.
- **Con:** The heading and the body pair are physically split in the source — you lose "all three column-level concerns sit inside one wrapper call" as a grouping cue.
- **Con:** Still requires touching `MarketingLandingPage.tsx` (small diff: ~6 lines around `ValueCol`).

---

## Option B — new `<BilingualSection>` variant

**Concept:** author a new wrapper that takes a `viHeading` + `vi` + `en` triplet and renders three lang-tagged elements together. The wrapper internalises the column's element shape.

### Source (what the contributor writes)

```tsx
function ValueCol({ titleVi, bodyVi, bodyEn }: Props) {
  return (
    <div className="mb-ml-col">
      <BilingualSection
        viHeading={titleVi}
        viHeadingAs="h3"
        viHeadingClassName="mb-ml-col-h"
        vi={bodyVi}
        en={bodyEn}
        viClassName="mb-ml-col-vi"
        enClassName="mb-ml-col-en"
      />
    </div>
  );
}
```

### Rendered DOM (what the browser sees)

```html
<div class="mb-ml-col">
  <h3 lang="vi" class="mb-ml-col-h">
    Học bằng tiếng Việt
  </h3>
  <p lang="vi" class="mb-ml-col-vi">
    AI thầy giáo của bạn nói tiếng Việt như thầy giáo thật.
    Sửa lỗi tiếng Anh của người Việt, không phải lỗi chung chung.
  </p>
  <p lang="en" class="mb-ml-col-en">
    Your AI teacher speaks Vietnamese like a real teacher —
    fixing the mistakes Vietnamese learners actually make,
    not generic ones.
  </p>
</div>
```

### Visual

Identical to today + Option A. Same DOM, same visual. The differentiator is **author ergonomics + maintenance surface**, not the rendered output.

### Trade-offs
- **Pro:** One wrapper call captures the whole column-content semantic. Reads like a unit at the call site.
- **Pro:** Future column-shape consumers (if any) get a typed shape to fill out.
- **Con:** New component to author: file + props type + tests (mirror of `<Bilingual>`'s 11-test surface).
- **Con:** Adds API surface for ONE consumer (this triplet is the only known site).
- **Con:** Heading element is mostly the asymmetric piece — a `viHeading`+`viHeadingAs`+`viHeadingClassName` API trio plus the existing `vi`/`en`/`viClassName`/`enClassName` API trio means **the wrapper has 7+ named slots**. Wider API than `<Bilingual>`'s 18 but with bigger asymmetric branches (`viHeading*` are heading-shaped; `vi`/`en` are body-shaped).
- **Con:** Premature abstraction risk — if MarketingLanding stays the only consumer, the wrapper outlives its useful scope.

### Audit cite from bilingual-audit.md
> "Net-new component; design + test surface to author."

---

## Option C — leave inline (current state)

**Concept:** the existing inline `<h3 lang="vi">` + `<p lang="vi">` + `<p lang="en">` shape is already WCAG 3.1.2-correct (each element has its own `lang`). Don't fix what isn't broken.

### Source (what the contributor writes — UNCHANGED from today)

```tsx
function ValueCol({ titleVi, bodyVi, bodyEn }: Props) {
  return (
    <div className="mb-ml-col">
      <h3 lang="vi" className="mb-ml-col-h">
        {titleVi}
      </h3>
      <p lang="vi" className="mb-ml-col-vi">
        {bodyVi}
      </p>
      <p lang="en" className="mb-ml-col-en">
        {bodyEn}
      </p>
    </div>
  );
}
```

### Rendered DOM (UNCHANGED from today)

```html
<div class="mb-ml-col">
  <h3 lang="vi" class="mb-ml-col-h">
    Học bằng tiếng Việt
  </h3>
  <p lang="vi" class="mb-ml-col-vi">
    AI thầy giáo của bạn nói tiếng Việt như thầy giáo thật.
    Sửa lỗi tiếng Anh của người Việt, không phải lỗi chung chung.
  </p>
  <p lang="en" class="mb-ml-col-en">
    Your AI teacher speaks Vietnamese like a real teacher —
    fixing the mistakes Vietnamese learners actually make,
    not generic ones.
  </p>
</div>
```

### Visual

Identical to today (it IS today).

### Trade-offs
- **Pro:** Zero diff. Zero risk. Zero new code surface.
- **Pro:** Each language already has its `lang` attribute — WCAG 3.1.2 already passes.
- **Pro:** `MarketingLandingPage` is low-churn — the mechanical-sweep benefit may not pay off.
- **Con:** Loses consistency with the rest of the codebase that has now migrated to `<Bilingual>` (W2 / O2 / P4 / Home all use the wrapper).
- **Con:** Future contributors copy-pasting this column shape elsewhere may forget the `lang` attrs (the wrapper would have enforced them).

### Audit cite from bilingual-audit.md
> "The MarketingLandingPage pattern is stable + low-churn; the existing inline `<h1 lang="vi">` + `<p lang="en">` style is already a11y-correct (each side has lang). The mechanical-sweep benefit may not justify the new-variant cost."

---

## Side-by-side decision matrix

| Dimension | A — split | B — new wrapper | C — leave inline |
|---|---|---|---|
| Rendered DOM | identical to today | identical to today | identical to today |
| Visual appearance | identical | identical | identical |
| Source file diff | ~6 lines in `ValueCol` | new component file + ~10 lines in `ValueCol` | **0 lines** |
| New components to author | 0 | 1 (`<BilingualSection>`) | 0 |
| Test surface added | 0 (uses existing `<Bilingual>` tests) | ~11 tests (mirror of `<Bilingual>` shape) | 0 |
| WCAG 3.1.2 status | passes | passes | **already passes today** |
| Uses existing wrapper | yes — for the bilingual pair only | no — new wrapper | no |
| Heading + body grouping in source | split into 2 sibling reads | one wrapper call | one block |
| Future-proof for more triplet consumers | wrapper covers half (the bilingual half) | wrapper covers whole shape | each consumer reinvents inline |
| Premature-abstraction risk | low | **medium-high** (single known consumer) | none |

## What changes for the rendered learner

**For all three options: nothing.** The DOM trees are byte-for-byte identical. Same fonts, same colours, same spacing, same screen-reader output (each element has its own `lang` in every case).

The decision is **purely about source-code shape + author ergonomics + consistency with the rest of the codebase's bilingual-wrapper adoption**, not about what shows up on screen.

## What this MR does NOT do

- Does NOT change `MarketingLandingPage.tsx` source.
- Does NOT add `<BilingualSection>` or any new component.
- Does NOT pre-commit to any of A / B / C.

**Once you pick an option, dispatch a follow-up MR to land it.** Option A is the smallest-diff, lowest-risk path. Option B is the most-internally-consistent-API path but only justifies the new wrapper if more triplet consumers appear. Option C is the do-nothing path.
