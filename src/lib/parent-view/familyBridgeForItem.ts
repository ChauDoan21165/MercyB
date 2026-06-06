// src/lib/parent-view/familyBridgeForItem.ts
//
// L6 — Parent / Family layer. Resolves the rich, family-facing explainer
// (why / how-to-help / encouragement) for a parent-summary item.
//
// The parent view's per-tag items are keyed "<category>:<tag>" (see
// buildParentSummary.ts) — e.g. "grammar:vi_l1_3rd_person_s". This maps an
// item key to its FamilyBridgeExplanation, but ONLY when that entry has been
// validated (Chau-approved). Unvalidated drafts return null, so the parent
// view never renders copy Chau hasn't signed off — the validation gate is
// enforced at the read boundary, not just by convention.

import type { FamilyBridgeExplanation } from "@/lib/feedback/family-bridge/types";
import { getViGrammarFamilyBridgeExplanation } from "@/lib/feedback/family-bridge/vi-grammar";
import { getVnInterferenceFamilyBridgeExplanation } from "@/lib/feedback/family-bridge/interference-explanations";

/**
 * Return the VALIDATED family-bridge explainer for a parent-summary item key,
 * or null. Filters on `validated === true` — the parent view shows nothing
 * Chau has not approved.
 */
export function familyBridgeForItemKey(
  key: string,
): FamilyBridgeExplanation | null {
  const sep = key.indexOf(":");
  if (sep < 0) return null;
  const category = key.slice(0, sep);
  const tag = key.slice(sep + 1);
  if (!tag) return null;

  let entry: FamilyBridgeExplanation | null = null;
  if (category === "grammar") {
    entry = getViGrammarFamilyBridgeExplanation(tag);
  } else {
    // Forward-compat: interference-keyed items resolve against E2's set.
    entry =
      getVnInterferenceFamilyBridgeExplanation(tag) ??
      getViGrammarFamilyBridgeExplanation(tag);
  }

  return entry && entry.validated ? entry : null;
}
