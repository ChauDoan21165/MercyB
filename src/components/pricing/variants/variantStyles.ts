// src/components/pricing/variants/variantStyles.ts
//
// Tiny shared style helpers so the five A/B variants don't each
// re-spell the same Tailwind class strings. Variants stay distinct
// in LAYOUT and COPY; this just keeps the common pieces honest.

export const PAGE_WRAP =
  "max-w-3xl mx-auto px-4 py-6";

export const PRIMARY_CTA =
  "block w-full text-center px-4 py-3 rounded-xl bg-emerald-600 text-white font-semibold no-underline transition hover:bg-emerald-700";

export const SECONDARY_CTA =
  "block w-full text-center px-4 py-3 rounded-xl border border-black/15 text-black/85 font-semibold no-underline transition hover:bg-black/5";

export const CARD =
  "rounded-2xl border border-black/10 bg-white p-5 shadow-sm";

export const CARD_HIGHLIGHT =
  "rounded-2xl border-2 border-emerald-300 bg-emerald-50 p-5 shadow-md";

export const SUBTLE =
  "text-xs text-black/55 mt-1";

export const BULLET_LIST =
  "text-sm text-black/80 list-disc pl-5 space-y-1";
