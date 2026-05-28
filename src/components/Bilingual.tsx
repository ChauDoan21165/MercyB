// src/components/Bilingual.tsx
//
// Shared wrapper for the recurring inline VI-primary + EN-secondary
// (or EN-primary + VI-secondary) bilingual pattern with per-language
// `lang` attributes for WCAG 3.1.2 (language of parts).
//
// Extracted post-!96/!110 once the W2 (WeakAt taxonomy), O2 (onboarding
// peer header), and P4 (Pricing) inline implementations established the
// shape three times — Rule of Three satisfied.
//
// Pattern this replaces:
//
//   <p lang="vi" className="…">{vi}</p>
//   <p lang="en" className="…">{en}</p>
//
// Common across:
//   - W2: stage-3a/LocalWeaknessMap.tsx + stage-3b/SuggestedPracticeList.tsx
//     (Tailwind utility classes, <p> elements, VI first)
//   - O2: pages/onboarding/OnboardingPage.tsx
//     (inline style objects, mixed elements, VI first — out of scope for
//      this MR's wrapper, retained as a future-sweep target because of
//      its `headingRef` focus-management coupling)
//   - P4: screens/Pricing.tsx (BiText helper + inline pairs)
//     (inline style objects, <span> elements, EN first — `BiText` is the
//      established local helper that this wrapper generalizes)
//   - Home: components/home/PracticeRecommendationCard.tsx
//     (inline style objects, <div>/<p> elements, VI first — not currently
//      lang-tagged; migrating to <Bilingual> ADDS the lang attrs)
//
// API design notes (decided post-survey of the four call-site shapes):
//
//   - `primary` controls DOM order. Default 'vi' (the house-style
//     VI-primary contract per vi-style-guide.md §2). P4's BiText is the
//     deliberate EN-primary exception (brand-product naming —
//     "Free" / "Full Access" — Monthly read as English brand labels
//     with VI descriptions underneath).
//   - `as` + `viAs` / `enAs` cover the element-type variation. Default
//     `<p>`; per-side override is the escape hatch for cases like P4's
//     `<span>` or Home's `<div>`.
//   - `viClassName` / `enClassName` + `viStyle` / `enStyle` are
//     parallel — the wrapper doesn't decide which styling approach a
//     consumer uses; consumers already mix Tailwind + inline-style.
//   - `viLang` / `enLang` default to `'vi'` / `'en'` but accept any
//     BCP 47 tag (e.g. `'vi-VN'`, `'en-US'`) for future regionalization.
//   - The wrapper renders a React Fragment (no container element). The
//     caller already wraps with their own `<div>` / `<section>` / `<h3>` —
//     adding a wrapper here would break every existing consumer's
//     surrounding markup. The lang attributes go on the VI/EN children
//     directly, which is what WCAG 3.1.2 actually requires.
//
// Post-!115 extensions (this dispatch):
//
//   - `primaryRef` — forwarded to the rendered element on whichever
//     side `primary` resolves to (VI when primary='vi'; EN when
//     primary='en'). Enables O2's wizard focus-management pattern
//     (the parent calls `headingRef.current?.focus()` on step
//     transition so a keyboard / SR user lands on the new content
//     instead of `<body>`, WCAG 2.4.3).
//   - `tabIndex` — applied to the PRIMARY element ONLY (not the
//     secondary). O2 uses `tabIndex={-1}` to make the heading
//     programmatically focusable without entering the regular tab
//     order. The asymmetry is deliberate: the secondary element
//     never wants tabIndex in any consumer audited.
//   - `separator` — optional ReactNode rendered BETWEEN the primary
//     and secondary elements. Default undefined (no separator,
//     backward-compatible — every pre-!115 consumer keeps its
//     Fragment-of-two-siblings shape). O2's pre-pick screens use
//     this to render a `<PeerDivider />` between equal-weight
//     language sections (Chau's spec: "stacked with a visual
//     separator" so the two languages read as peers, not headline +
//     translation).
//
// What this wrapper still deliberately does NOT do:
//
//   - Empty-string handling. If either `vi` or `en` is an empty string,
//     the wrapper renders an empty lang-tagged element — the consumer's
//     responsibility to omit either side via conditional rendering. We
//     do not silently drop the side because that would hide a bug at
//     the data layer (one of the strings missing in a bilingual pair
//     should be loud, not quiet).
//   - Secondary-side ref / tabIndex. The audited consumers only ever
//     need the primary side to be focus-managed; adding a
//     `secondaryRef` would double the API surface for no real use case.
//     If a future consumer needs it, add the prop with the same
//     "deliberate scope" framing.
//
// Established test surface contracts:
//   - Both languages render in correct order based on `primary`.
//   - Both elements carry their `lang` attribute (default 'vi' / 'en').
//   - Per-side `className` / `style` / `viAs` / `enAs` honored.
//   - `primaryRef` forwards to the primary side's rendered element
//     and follows `primary` when the value flips.
//   - `tabIndex` applied to primary side only.
//   - `separator` renders between sides when present; absent when
//     undefined (regression-protected for the !115 pilot consumers).

import { createElement, type CSSProperties, type ReactNode, type Ref } from "react";

export type BilingualElement =
  | "p"
  | "span"
  | "div"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6";

export interface BilingualProps {
  /** Vietnamese-language content. */
  vi: ReactNode;
  /** English-language content. */
  en: ReactNode;
  /**
   * Which language renders first in DOM order. Default 'vi' — the
   * VI-primary house-style contract per `vi-style-guide.md` §2. Pass
   * 'en' for the P4 Pricing-style brand-label-first pattern where the
   * English string is the brand-product name and Vietnamese is the
   * explanation underneath.
   */
  primary?: "vi" | "en";
  /**
   * Default element for BOTH sides. Override per-side with `viAs`
   * / `enAs`. Default 'p'.
   */
  as?: BilingualElement;
  /** Override the element type for the VI side specifically. */
  viAs?: BilingualElement;
  /** Override the element type for the EN side specifically. */
  enAs?: BilingualElement;
  viClassName?: string;
  enClassName?: string;
  viStyle?: CSSProperties;
  enStyle?: CSSProperties;
  /**
   * BCP 47 language tag for the VI side. Default 'vi'. Pass
   * 'vi-VN' if a regional variant becomes load-bearing for a
   * screen-reader voice mapping.
   */
  viLang?: string;
  /**
   * BCP 47 language tag for the EN side. Default 'en'. Pass
   * 'en-US' / 'en-GB' similarly.
   */
  enLang?: string;
  /**
   * Ref forwarded to the PRIMARY side's rendered DOM element (the one
   * that renders first per `primary`). Typed as `Ref<HTMLElement>`
   * because every supported `BilingualElement` value extends
   * HTMLElement; consumers that need a narrower type (e.g.
   * `HTMLHeadingElement` for O2's `useRef<HTMLHeadingElement | null>`)
   * can pass a narrowed ref — TypeScript's structural ref typing
   * accepts the widening at the boundary.
   *
   * Use case: O2's wizard focus management. The onboarding step's
   * `useEffect` calls `headingRef.current?.focus()` on mount so a
   * keyboard/SR user lands on the new step's heading instead of
   * `<body>` (WCAG 2.4.3). Without this prop, the heading-as-h1 would
   * have to stay inline.
   */
  primaryRef?: Ref<HTMLElement>;
  /**
   * `tabIndex` applied to the PRIMARY element only. Asymmetric by
   * design — the secondary element never wants tabIndex in any
   * audited consumer. O2 uses `tabIndex={-1}` so the heading is
   * programmatically focusable (via `primaryRef.current?.focus()`)
   * without entering the regular tab order.
   */
  tabIndex?: number;
  /**
   * Optional ReactNode rendered BETWEEN the primary and secondary
   * elements. Default undefined (no separator — backward-compatible
   * with every pre-!115 pilot consumer).
   *
   * Use case: O2's pre-pick `<StepHeader>` renders a hairline
   * `<PeerDivider />` between the two languages so the pair reads as
   * "two language sections" (peers) rather than "headline +
   * translation". Without this prop, migrating O2 would silently
   * drop a load-bearing visual semantic.
   */
  separator?: ReactNode;
  /**
   * When `true`, an empty side (one of `vi` / `en` is `""`, `null`,
   * `undefined`, or `false`) renders NOTHING for that side — no
   * element, no `lang` attr, no DOM impact. If both sides are empty,
   * the wrapper returns `null`.
   *
   * Default `false` — !115's deliberate-NO-silent-drop contract
   * stays the law. An empty string with `dropEmpty=false` still
   * renders an empty `<p lang="vi"></p>` so the missing-half is
   * visible at the data layer.
   *
   * Use case: conditional one-side-missing patterns like
   * LocalWeaknessMap's L1Row example-pair (`{exampleVi && <p>…</p>}`
   * separately from `{exampleEn && <p>…</p>}`) and Pricing's
   * plan-card bullets where `plan.bulletsVi?.[i]` may be undefined
   * per-bullet. Migrating these to `<Bilingual>` without
   * `dropEmpty` would emit empty paragraphs when only one side had
   * content — a regression.
   *
   * When `dropEmpty` drops one side, the `separator` is also
   * omitted — a separator between one rendered element and nothing
   * is presentational noise.
   */
  dropEmpty?: boolean;
  /**
   * Arbitrary props spread onto the VI side's rendered element.
   * Escape hatch for `id`, `aria-*`, `data-*`, `role`, and other
   * attributes the wrapper doesn't model individually.
   *
   * **Merge order:** `viProps` is spread first; the wrapper's
   * explicit per-side props (`lang`, `className`, `style`, `ref`,
   * `tabIndex`) then overlay. This means a caller passing
   * `viProps={{ lang: 'fr' }}` does NOT defeat the `viLang` contract
   * — `viLang` (or its default) always wins. Pass `viLang="fr"` if
   * you need to override the language.
   *
   * Use case: SuggestedPracticeList's heading carries
   * `id="suggested-practice-heading"` referenced by the parent
   * `<section aria-labelledby="…">`. Pass via
   * `viProps={{ id: 'suggested-practice-heading' }}`.
   */
  viProps?: Record<string, unknown>;
  /**
   * Arbitrary props spread onto the EN side's rendered element. See
   * `viProps` for merge-order semantics — `enProps` is spread first,
   * the wrapper's explicit per-side props then overlay.
   */
  enProps?: Record<string, unknown>;
}

/**
 * Whether a `ReactNode` content side is "empty" for `dropEmpty`
 * purposes. Mirrors React's "renders nothing" semantics — falsy
 * primitives (empty string, null, undefined, false) count as empty.
 * `0` does NOT count, because `0` renders as visible text "0".
 */
function isEmptyContent(node: ReactNode): boolean {
  return node === "" || node === null || node === undefined || node === false;
}

export function Bilingual({
  vi,
  en,
  primary = "vi",
  as = "p",
  viAs,
  enAs,
  viClassName,
  enClassName,
  viStyle,
  enStyle,
  viLang = "vi",
  enLang = "en",
  primaryRef,
  tabIndex,
  separator,
  dropEmpty = false,
  viProps,
  enProps,
}: BilingualProps) {
  // Resolve per-side element types — falls back to `as` when not
  // overridden.
  const viElement = viAs ?? as;
  const enElement = enAs ?? as;

  // The PRIMARY side gets `ref` + `tabIndex`; the SECONDARY side gets
  // neither. Build per-side prop bags here so the conditional belongs
  // to the data, not to the JSX.
  const isViPrimary = primary !== "en";

  // `dropEmpty` semantics. When false (default), preserve !115's
  // no-silent-drop contract — empty halves still render. When true,
  // render nothing for an empty side; if both sides are empty, the
  // wrapper returns null.
  const dropVi = dropEmpty && isEmptyContent(vi);
  const dropEn = dropEmpty && isEmptyContent(en);
  if (dropVi && dropEn) return null;

  // viProps / enProps are spread FIRST; the wrapper's explicit
  // per-side props (lang/className/style/ref/tabIndex) then overlay.
  // This protects the `viLang` / `enLang` contract from being
  // accidentally overridden by an arbitrary `viProps={{ lang: '…' }}`.
  const viNode = dropVi
    ? null
    : createElement(
        viElement,
        {
          ...viProps,
          lang: viLang,
          className: viClassName,
          style: viStyle,
          // `ref` is forwarded only when this side is primary; React's
          // createElement accepts undefined ref cleanly (no warning, no
          // attached ref).
          ref: isViPrimary ? primaryRef : undefined,
          tabIndex: isViPrimary ? tabIndex : undefined,
        },
        vi,
      );

  const enNode = dropEn
    ? null
    : createElement(
        enElement,
        {
          ...enProps,
          lang: enLang,
          className: enClassName,
          style: enStyle,
          ref: isViPrimary ? undefined : primaryRef,
          tabIndex: isViPrimary ? undefined : tabIndex,
        },
        en,
      );

  // Separator only renders when BOTH sides actually rendered. A
  // separator between one element and `null` is presentational noise.
  const showSeparator = separator !== undefined && viNode !== null && enNode !== null;

  if (primary === "en") {
    return (
      <>
        {enNode}
        {showSeparator ? separator : null}
        {viNode}
      </>
    );
  }

  return (
    <>
      {viNode}
      {showSeparator ? separator : null}
      {enNode}
    </>
  );
}

export default Bilingual;
