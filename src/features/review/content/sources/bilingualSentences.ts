// src/features/review/content/sources/bilingualSentences.ts
//
// Source for the `en-vi` and `vi-en` flows, derived READ-ONLY from the
// Round-5 bilingual sentence library (src/data/bilingual-sentences.json,
// validated by bilingualSentencesSchema.ts). Each entry carries BOTH an
// English (`text_en`) and a Vietnamese (`vn_translation`) sentence, so it can
// drive both directions cleanly:
//
//   en-vi  → front = text_en (English),       back = vn_translation (Vietnamese)
//   vi-en  → front = vn_translation (Vietnamese), back = text_en (English)
//
// `vn_note`, when present, is authored in Vietnamese (a VN reviewer hint) → maps
// to `noteVi`. No audioKey: this dataset carries no canonical audio key.
//
// All items are kind "sentence" (the library is sentence-level by construction).

import type { ReviewFlowId, ReviewItem } from "@/features/review/types";
import { slugify } from "../slug";
import type { ReviewSource } from "./source";

// Minimal structural shape — a subset of BilingualSentence. Declared locally so
// tests inject fakes without importing/validating the real JSON.
export interface BilingualSentenceLike {
  id?: string;
  text_en: string;
  vn_translation: string;
  vn_note?: string;
}

const FLOWS: ReviewFlowId[] = ["en-vi", "vi-en"];

function clean(s: string | undefined): string | undefined {
  if (s == null) return undefined;
  const t = s.trim();
  return t.length ? t : undefined;
}

function buildItems(
  flow: ReviewFlowId,
  sentences: readonly BilingualSentenceLike[],
): ReviewItem[] {
  if (flow !== "en-vi" && flow !== "vi-en") return [];

  const out: ReviewItem[] = [];
  const seen = new Set<string>();

  for (const s of sentences) {
    const en = clean(s.text_en);
    const vi = clean(s.vn_translation);
    if (!en || !vi) continue;

    // Direction-aware front/back: en-vi → English front / Vietnamese back;
    // vi-en → Vietnamese front / English back.
    const front = flow === "en-vi" ? en : vi;
    const back = flow === "en-vi" ? vi : en;

    const id = `${flow}:sentence:${slugify(front)}`;
    if (seen.has(id)) continue;
    seen.add(id);

    const item: ReviewItem = {
      id,
      flow,
      kind: "sentence",
      front,
      back,
      source: "bilingual-sentences",
    };
    const noteVi = clean(s.vn_note);
    if (noteVi) item.noteVi = noteVi;
    out.push(item);
  }

  return out;
}

/**
 * Factory. Defaults to the real validated BILINGUAL_SENTENCES; tests pass fakes.
 */
export function createBilingualSentencesSource(
  sentences: readonly BilingualSentenceLike[],
): ReviewSource {
  // Pre-build both directions once.
  const byFlow = new Map<ReviewFlowId, ReviewItem[]>();
  for (const flow of FLOWS) byFlow.set(flow, buildItems(flow, sentences));

  return {
    name: "bilingual-sentences",
    flows: () => [...FLOWS],
    items: (flow) => byFlow.get(flow) ?? [],
  };
}
