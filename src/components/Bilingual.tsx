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
// What this wrapper deliberately does NOT do:
//
//   - O2's `headingRef` + `tabIndex={-1}` focus-management pattern is
//     NOT supported. O2's <h1 ref={headingRef} tabIndex={-1}> for
//     post-step focus management is wizard-specific accessibility; a
//     generic wrapper that took refs would be overloaded. O2 stays
//     inline for now; if/when O2 needs to migrate, add a `primaryRef`
//     prop with deliberate scope (or carve out a separate
//     `<BilingualHeading>` variant).
//   - Empty-string handling. If either `vi` or `en` is an empty string,
//     the wrapper renders an empty lang-tagged element — the consumer's
//     responsibility to omit either side via conditional rendering. We
//     do not silently drop the side because that would hide a bug at
//     the data layer (one of the strings missing in a bilingual pair
//     should be loud, not quiet).
//
// Established test surface contracts:
//   - Both languages render in correct order based on `primary`.
//   - Both elements carry their `lang` attribute (default 'vi' / 'en').
//   - Per-side `className` / `style` / `viAs` / `enAs` honored.

import { createElement, type CSSProperties, type ReactNode } from "react";

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
}: BilingualProps) {
  // Resolve per-side element types — falls back to `as` when not
  // overridden.
  const viElement = viAs ?? as;
  const enElement = enAs ?? as;

  const viNode = createElement(
    viElement,
    {
      lang: viLang,
      className: viClassName,
      style: viStyle,
    },
    vi,
  );

  const enNode = createElement(
    enElement,
    {
      lang: enLang,
      className: enClassName,
      style: enStyle,
    },
    en,
  );

  if (primary === "en") {
    return (
      <>
        {enNode}
        {viNode}
      </>
    );
  }

  return (
    <>
      {viNode}
      {enNode}
    </>
  );
}

export default Bilingual;
