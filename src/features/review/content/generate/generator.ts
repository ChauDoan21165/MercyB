// src/features/review/content/generate/generator.ts
//
// The build-time candidate generator for generation-backed flows.
//
// Given raw items that carry an AUTHORED target-language `back` (the trusted
// anchor) but lack a Vietnamese front and/or a reading, this produces
// ReviewCandidate[] with the missing pieces GENERATED:
//   - front (vi gloss)  ← t.toVietnamese(back, targetLang)
//   - reading (ja)      ← deriveRomaji(back)        (deterministic, via wanakana)
//   - reading (zh/ko)   ← supplied on the raw item, or t-derived if absent
//
// Every output is stamped provenance:"generated" so the gate routes it through
// the back-translation round-trip. Ids are built with candidateId (stable,
// namespaced). The function is pure aside from the injected async Translator —
// no Date.now(), no I/O, no model construction here.
//
// A raw item MAY pre-supply `front` (e.g. a human already glossed it); when
// present we keep it verbatim and skip the toVietnamese call. The same goes for
// `reading`. This lets a seed batch mix machine- and human-generated fields
// while still flowing through the generated-card round-trip for safety.

import type { ReviewCandidate } from "../validate";
import type { ReviewFlowId, ReviewItemKind } from "@/features/review/types";
import type { CefrLevel } from "../validate";
import { candidateId } from "../ingestion/candidate";
import type { Translator, TargetLang } from "./translator";
import { deriveRomaji } from "./romaji";

/** A raw, pre-candidate item: authored target text + metadata; vi/reading TBD. */
export interface RawGenItem {
  flow: ReviewFlowId;
  kind: ReviewItemKind;
  /** Authored target-language answer text (the trusted anchor). */
  back: string;
  /** Optional pre-authored Vietnamese front; generated if absent. */
  front?: string;
  /** Optional pre-supplied reading (romaji/romaja/pinyin); derived if absent. */
  reading?: string;
  /** Optional worked example (answer language) carried straight through. */
  example?: string;
  /** Optional Vietnamese note carried straight through. */
  noteVi?: string;
  cefr: CefrLevel;
  /** Provenance string for the resulting item (e.g. "japanese/lessons-a1"). */
  source: string;
}

export interface GenerateOptions {
  /** Injected MT seam. Required: generation is meaningless without it. */
  translator: Translator;
}

/** Map a flow id to the target-language code the Translator expects. */
function flowTarget(flow: ReviewFlowId): TargetLang | null {
  switch (flow) {
    case "vi-ja":
      return "ja";
    case "vi-ko":
      return "ko";
    case "vi-zh":
      return "zh";
    case "vi-de":
      return "de";
    default:
      return null;
  }
}

/**
 * Generate ReviewCandidates from raw target-anchored items. For each item:
 *   1. front  — use raw.front if given, else t.toVietnamese(back).
 *   2. reading — vi-ja: raw.reading ?? deriveRomaji(back).romaji;
 *                vi-zh/vi-ko: raw.reading (supplied), else t-derived not
 *                  attempted here (no deterministic transliterator) → left
 *                  undefined so the gate quarantines MISSING_READING loudly
 *                  rather than guessing.
 *   3. id     — candidateId(flow, kind, front).
 *   4. stamp provenance:"generated", carry cefr/source/example/noteVi.
 *
 * Items on a flow this harness doesn't govern are skipped (returns no candidate
 * for them) rather than throwing, so a mixed input list degrades gracefully.
 */
export async function generateCandidates(
  rawItems: readonly RawGenItem[],
  opts: GenerateOptions,
): Promise<ReviewCandidate[]> {
  const { translator } = opts;
  const out: ReviewCandidate[] = [];

  for (const raw of rawItems) {
    const target = flowTarget(raw.flow);
    if (target === null) continue; // ungoverned flow — skip, don't throw

    const back = raw.back;

    // 1. front (vi)
    const front =
      raw.front != null && raw.front.trim().length > 0
        ? raw.front
        : await translator.toVietnamese(back, target);

    // 2. reading
    let pronunciation: string | undefined = raw.reading;
    if (pronunciation == null || pronunciation.trim().length === 0) {
      if (raw.flow === "vi-ja") {
        const { romaji } = deriveRomaji(back);
        pronunciation = romaji;
      } else {
        // zh/ko: no deterministic transliterator available here. Leave absent
        // so the gate flags MISSING_READING instead of fabricating one.
        pronunciation = undefined;
      }
    }

    const candidate: ReviewCandidate = {
      id: candidateId(raw.flow, raw.kind, front),
      flow: raw.flow,
      kind: raw.kind,
      front,
      back,
      pronunciation,
      example: raw.example,
      noteVi: raw.noteVi,
      cefr: raw.cefr,
      provenance: "generated",
      source: raw.source,
    };
    out.push(candidate);
  }

  return out;
}
