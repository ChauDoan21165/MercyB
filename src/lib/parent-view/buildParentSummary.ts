// src/lib/parent-view/buildParentSummary.ts
//
// L6 — Parent / Family layer. Pure transform: L3 weakness aggregate →
// parent-facing summary model.
//
// This is the single place the parent view's data shape is decided. It is
// a PURE function (no I/O, no Supabase, no Date.now in the data path —
// the caller passes the already-read `LocalWeaknessMap`). It mirrors the
// posture of src/lib/stage-3a/aggregator.ts: the parent view is a
// downstream reader of the same aggregate that powers /weak-at.
//
// Decisions encoded here:
//   • Q3=B  — output is organized into category buckets (categories.ts).
//   • Q4=B  — NO time-on-task. We never read or emit minutes/day. Counts
//             here are firing-counts / sample-counts, not time.
//   • Q5=C  — every item carries BOTH a qualitative description (default
//             surface) and a numeric payload (drill-in only). The UI
//             decides which to show; this builder supplies both.
//   • Q9=A  — the headline is DESCRIPTIVE only. The "Mercy helped / two
//             more sessions" attribution clause is an L5-PENDING stub that
//             returns null until L4+L5 land (see attributionClause()).
//   • Q10=C — copy here is neutral/factual (in-app voice). Mercy's warmer
//             voice lives only in the digest email template.
//   • X3=B  — the L6_REPORT_TO_PARENT_THRESHOLD knob filters which
//             patterns are surfaced (thresholds.ts).

import {
  type L1PatternSummary,
  type LocalWeaknessMap,
  type PlacementWeaknessSummary,
  type PronunciationPainPointSummary,
  type WeaknessSeverity,
} from "@/lib/stage-3a/aggregator";
import {
  describeL1Tag,
  describePhonemeAxis,
  describePlacementWeakness,
} from "@/lib/stage-3a/taxonomy";
import {
  PARENT_CATEGORIES,
  type ParentCategoryConfig,
  type ParentCategoryId,
} from "./categories";
import { L6_REPORT_TO_PARENT_THRESHOLD } from "./thresholds";

/** Numeric drill-in payload (Q5=C — surfaced only on explicit drill-in). */
export interface ParentNumeric {
  /** Firing count (grammar) or pronunciation sample count. Undefined when
   *  the source carries no count (placement snapshot tags). */
  count?: number;
  /** Pronunciation error rate as a 0–100 percentage, rounded to nearest 10. */
  errorRatePct?: number;
  /** CEFR band when this item comes from the placement bucket. */
  cefr?: string;
  /** Coarse severity from the taxonomy — drill-in only, never a headline. */
  severity?: WeaknessSeverity;
}

export interface ParentSummaryItem {
  /** Stable key for React lists. */
  key: string;
  /** Qualitative VI description (default surface). */
  qualitativeVi: string;
  /** Qualitative EN description (secondary / EN-locale parents). */
  qualitativeEn: string;
  /** Optional concrete example, VI. */
  exampleVi?: string;
  /** Optional concrete example, EN. */
  exampleEn?: string;
  /** Numeric payload — UI shows only on drill-in (Q5=C). */
  numeric: ParentNumeric;
}

export interface ParentCategory {
  config: ParentCategoryConfig;
  items: ParentSummaryItem[];
  /** True when this bucket has no reportable items after thresholding. */
  isEmpty: boolean;
}

export interface ParentSummary {
  /** Descriptive one-sentence VI headline (Q9=A). */
  headlineVi: string;
  /** Descriptive one-sentence EN headline. */
  headlineEn: string;
  /**
   * L5-PENDING attribution clause ("two more sessions and this drops").
   * Null today — activates only when L4+L5 can ground the claim (Q9=A).
   */
  attributionClauseVi: string | null;
  attributionClauseEn: string | null;
  /** CEFR band if a placement snapshot exists, else null. */
  cefr: string | null;
  categories: ParentCategory[];
  /** True when no category has reportable items. */
  isEmpty: boolean;
}

export interface BuildParentSummaryOptions {
  /** Learner display name. Falls back to a neutral noun when absent. */
  learnerName?: string | null;
  /**
   * Override the report-to-parent threshold (test seam). Production omits
   * and uses the L5-PENDING knob in thresholds.ts.
   */
  reportThreshold?: number;
}

const FALLBACK_NAME_VI = "Con bạn";
const FALLBACK_NAME_EN = "Your learner";

/**
 * Build the parent-facing summary from an already-read L3 aggregate.
 * Pure — same input always yields the same output.
 */
export function buildParentSummary(
  map: LocalWeaknessMap,
  options: BuildParentSummaryOptions = {},
): ParentSummary {
  const threshold = options.reportThreshold ?? L6_REPORT_TO_PARENT_THRESHOLD;
  const nameVi = (options.learnerName || "").trim() || FALLBACK_NAME_VI;
  const nameEn = (options.learnerName || "").trim() || FALLBACK_NAME_EN;

  const cefr = readCefr(map.placementWeaknesses, map);

  const grammarItems = buildGrammarItems(map.topL1Patterns, threshold);
  const placementItems = buildPlacementItems(map.placementWeaknesses, cefr);
  const pronunciationItems = buildPronunciationItems(
    map.topPronunciationPainPoints,
    threshold,
  );

  const byId: Record<ParentCategoryId, ParentSummaryItem[]> = {
    grammar: grammarItems,
    placement: placementItems,
    pronunciation: pronunciationItems,
  };

  const categories: ParentCategory[] = PARENT_CATEGORIES.map((config) => {
    const items = byId[config.id];
    return { config, items, isEmpty: items.length === 0 };
  });

  const isEmpty = categories.every((c) => c.isEmpty);

  const lead = leadPattern(grammarItems, pronunciationItems, placementItems);

  return {
    headlineVi: buildHeadlineVi(nameVi, lead, isEmpty),
    headlineEn: buildHeadlineEn(nameEn, lead, isEmpty),
    // L5-PENDING — descriptive only today (Q9=A). attributionClause() is
    // wired but intentionally returns null until L4+L5 can ground it.
    attributionClauseVi: attributionClause("vi"),
    attributionClauseEn: attributionClause("en"),
    cefr,
    categories,
    isEmpty,
  };
}

// ── Category builders ──────────────────────────────────────────────────

function buildGrammarItems(
  patterns: readonly L1PatternSummary[],
  threshold: number,
): ParentSummaryItem[] {
  return patterns
    // X3=B — only surface patterns that cleared the report-to-parent bar.
    .filter((p) => p.count >= threshold)
    .map((p) => {
      const lang = describeL1Tag(p.tag);
      return {
        key: `grammar:${p.tag}`,
        qualitativeVi: lang.shortVi,
        qualitativeEn: lang.shortEn,
        exampleVi: lang.exampleVi,
        exampleEn: lang.exampleEn,
        numeric: { count: p.count, severity: lang.severity },
      };
    });
}

function buildPlacementItems(
  weaknesses: readonly PlacementWeaknessSummary[],
  cefr: string | null,
): ParentSummaryItem[] {
  // Placement tags come from a deliberate test result that already cleared
  // the placement engine's own bar — no firing-count to threshold on, so
  // they pass through. CEFR rides on each item's numeric drill-in.
  return weaknesses.map((w) => {
    const lang = describePlacementWeakness(w.tag);
    return {
      key: `placement:${w.tag}`,
      qualitativeVi: lang.shortVi,
      qualitativeEn: lang.shortEn,
      exampleVi: lang.exampleVi,
      exampleEn: lang.exampleEn,
      numeric: {
        severity: w.severity,
        ...(cefr ? { cefr } : {}),
      },
    };
  });
}

function buildPronunciationItems(
  painPoints: readonly PronunciationPainPointSummary[],
  threshold: number,
): ParentSummaryItem[] {
  return painPoints
    // X3=B — require enough samples before reporting to a parent.
    .filter((pp) => pp.samples >= threshold)
    .map((pp) => {
      const lang = describePhonemeAxis(pp.axis);
      // Round to nearest 10% so the number reads approximate, not clinical
      // (matches LocalWeaknessMap's treatment).
      const errorRatePct = Math.round((pp.errorRate * 100) / 10) * 10;
      return {
        key: `pron:${pp.axis}`,
        qualitativeVi: lang.shortVi,
        qualitativeEn: lang.shortEn,
        exampleVi: lang.exampleVi,
        exampleEn: lang.exampleEn,
        numeric: { count: pp.samples, errorRatePct, severity: lang.severity },
      };
    });
}

// ── Headline ───────────────────────────────────────────────────────────

interface LeadPattern {
  vi: string;
  en: string;
}

/** Pick the single pattern the headline names. Grammar > pronunciation >
 *  placement (most legible to a parent first). */
function leadPattern(
  grammar: ParentSummaryItem[],
  pronunciation: ParentSummaryItem[],
  placement: ParentSummaryItem[],
): LeadPattern | null {
  const first = grammar[0] ?? pronunciation[0] ?? placement[0];
  if (!first) return null;
  return { vi: lowerFirst(first.qualitativeVi), en: lowerFirst(first.qualitativeEn) };
}

function buildHeadlineVi(
  name: string,
  lead: LeadPattern | null,
  isEmpty: boolean,
): string {
  if (isEmpty || !lead) {
    return `Tuần này chưa đủ dữ liệu để tóm tắt cho ${name}. Hãy luyện thêm vài buổi.`;
  }
  return `Tuần này ${name} đang luyện: ${stripTrailingDot(lead.vi)}.`;
}

function buildHeadlineEn(
  name: string,
  lead: LeadPattern | null,
  isEmpty: boolean,
): string {
  if (isEmpty || !lead) {
    return `Not enough data to summarise ${name}'s week yet — a few more sessions will help.`;
  }
  return `This week ${name} is working on: ${stripTrailingDot(lead.en)}.`;
}

/**
 * L5-PENDING — the attribution clause ("two more sessions and this error
 * drops noticeably"). Requires the L4 planner + L5 significance test to
 * ground the claim honestly. Returns null until then, so the headline
 * stays purely descriptive (Q9=A). When L4+L5 land, return the localized
 * clause here and the UI appends it additively — no other change needed.
 */
function attributionClause(_locale: "vi" | "en"): string | null {
  // L5-PENDING: do not fabricate a forecast without L4/L5 evidence.
  return null;
}

// ── Helpers ──────────────────────────────────────────────────────────────

function readCefr(
  weaknesses: readonly PlacementWeaknessSummary[],
  map: LocalWeaknessMap,
): string | null {
  // The aggregator drops CEFR from its output shape; recover it from the
  // raw placement snapshot only if a future aggregator surfaces it. Today
  // it is not present, so we return null and the UI omits the CEFR chip.
  // (Kept as a typed seam so wiring CEFR through is a one-line change.)
  void weaknesses;
  void map;
  return null;
}

function lowerFirst(s: string): string {
  if (!s) return s;
  return s.charAt(0).toLowerCase() + s.slice(1);
}

function stripTrailingDot(s: string): string {
  return s.replace(/[.。]+\s*$/, "");
}
