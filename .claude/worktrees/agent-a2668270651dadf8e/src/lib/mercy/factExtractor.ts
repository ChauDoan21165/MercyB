// Heuristic fact extractor.
//
// Intentionally NOT an LLM call: this is the bootstrap layer for the
// long-term memory system, designed to run client-side, free, deterministic,
// and fast. It misses a lot — that's fine. The idea is:
//
//   1. Catch the obvious "I work as a..." / "I want to..." / "I don't like..."
//      patterns that account for most user-stated facts.
//   2. Tag them with confidence: 0.5 (inferred — half-trust).
//   3. Surface candidates to a UI (or a mute autosaver) so Chau can decide
//      whether to upgrade them to user_stated facts later.
//
// Future: replace internals with an LLM extractor (see
// reports/a2-memory-design.md "Future LLM-extractor migration path").
// The exported function signature stays stable so callers don't change.
//
// Both English and Vietnamese patterns. VN patterns are kept intentionally
// narrow — Vietnamese topic-comment grammar means false positives are
// easy, and a wrong "context" fact is more harmful than a missing one.

import type { FactType } from "./userFacts";

export type FactCandidate = {
  factType: FactType;
  content: string;
  /** Always 0.5 from the heuristic extractor. */
  confidence: 0.5;
  /** The original substring that matched — useful for debugging / UI. */
  matchedText: string;
};

/**
 * Extract candidate facts from a single user message.
 *
 * Returns an array (possibly empty). The same message can yield multiple
 * candidates ("I work as a teacher and I want to pass IELTS"). Duplicates
 * within a single call are deduped by (factType, normalized content).
 */
export function extractFactsFromMessage(messageContent: string): FactCandidate[] {
  if (!messageContent || typeof messageContent !== "string") return [];
  const text = messageContent.trim();
  if (!text) return [];

  const candidates: FactCandidate[] = [];
  for (const rule of RULES) {
    for (const match of text.matchAll(rule.pattern)) {
      const captured = (match[1] ?? "").trim();
      const content = rule.format(captured);
      if (!content || content.length > 200) continue;
      candidates.push({
        factType: rule.factType,
        content,
        confidence: 0.5,
        matchedText: match[0],
      });
    }
  }

  return dedupe(candidates);
}

// ── Rule table ────────────────────────────────────────────────────────────
//
// Order matters slightly: more-specific rules before more-general. We
// run them all in order, then dedupe at the end.
//
// Pattern guidelines:
//   - Use ([^.,!?\n]+?) for the captured fragment so we don't drag the
//     rest of the sentence in.
//   - Cap at ~80 characters via the format() filter — if a match yields
//     a longer string the user probably wasn't stating a fact.
//   - English patterns: case-insensitive, word boundaries.
//   - Vietnamese patterns: NOT case-insensitive (Vietnamese tone marks
//     don't have casing semantics; lowercased input is normal).

type Rule = {
  pattern: RegExp;
  factType: FactType;
  format: (captured: string) => string;
};

const RULES: Rule[] = [
  // ── AVOIDANCE (run first — "I don't like X" is more specific than "I like X") ──
  {
    pattern: /\bi\s+(?:don'?t|do not)\s+(?:like|want|enjoy)\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/gi,
    factType: "avoidance",
    format: (s) => `dislikes ${cleanTail(s)}`,
  },
  {
    pattern: /\bi\s+hate\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/gi,
    factType: "avoidance",
    format: (s) => `hates ${cleanTail(s)}`,
  },
  {
    pattern: /\bplease\s+(?:don'?t|do not|stop)\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/gi,
    factType: "avoidance",
    format: (s) => `requests no ${cleanTail(s)}`,
  },
  // VN: "đừng X cho tôi" / "tôi không thích X"
  {
    pattern: /(?:Tôi|tôi|Toi|toi)\s+(?:không|khong)\s+(?:thích|thich)\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/g,
    factType: "avoidance",
    format: (s) => `dislikes ${cleanTail(s)}`,
  },
  {
    pattern: /(?:Đừng|đừng|Dung|dung)\s+([^.,!?\n]+?)\s+cho\s+(?:tôi|toi)(?=[.,!?\n]|$)/g,
    factType: "avoidance",
    format: (s) => `requests no ${cleanTail(s)}`,
  },

  // ── GOAL ───────────────────────────────────────────────────────────────
  {
    pattern: /\bi\s+(?:want|need|plan|hope|aim)\s+to\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/gi,
    factType: "goal",
    format: (s) => `wants to ${cleanTail(s)}`,
  },
  {
    pattern: /\bmy\s+goal\s+is\s+(?:to\s+)?([^.,!?\n]+?)(?=[.,!?\n]|$)/gi,
    factType: "goal",
    format: (s) => `goal: ${cleanTail(s)}`,
  },
  // VN: "tôi muốn X" / "mục tiêu của tôi là X"
  {
    pattern: /(?:Tôi|tôi|Toi|toi)\s+(?:muốn|muon)\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/g,
    factType: "goal",
    format: (s) => `wants to ${cleanTail(s)}`,
  },
  {
    pattern: /(?:Mục|mục|Muc|muc)\s+(?:tiêu|tieu)\s+(?:của|cua)\s+(?:tôi|toi)\s+(?:là|la)\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/g,
    factType: "goal",
    format: (s) => `goal: ${cleanTail(s)}`,
  },

  // ── PREFERENCE ─────────────────────────────────────────────────────────
  {
    pattern: /\bi\s+prefer\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/gi,
    factType: "preference",
    format: (s) => `prefers ${cleanTail(s)}`,
  },
  {
    pattern: /\bi\s+(?:really\s+)?like\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/gi,
    factType: "preference",
    format: (s) => `likes ${cleanTail(s)}`,
  },
  // VN: "tôi thích X"
  {
    pattern: /(?:Tôi|tôi|Toi|toi)\s+(?:thích|thich)\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/g,
    factType: "preference",
    format: (s) => `likes ${cleanTail(s)}`,
  },

  // ── CONTEXT ────────────────────────────────────────────────────────────
  {
    pattern: /\bi\s+(?:work|am\s+working)\s+as\s+(?:an?\s+)?([^.,!?\n]+?)(?=[.,!?\n]|$)/gi,
    factType: "context",
    format: (s) => `works as ${cleanTail(s)}`,
  },
  {
    pattern: /\bi\s+am\s+(?:a|an)\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/gi,
    factType: "context",
    format: (s) => `is a ${cleanTail(s)}`,
  },
  {
    pattern: /\bi\s+live\s+in\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/gi,
    factType: "context",
    format: (s) => `lives in ${cleanTail(s)}`,
  },
  {
    pattern: /\bi\s+have\s+(\d+\s+(?:kid|kids|child|children|son|daughter)[^.,!?\n]*?)(?=[.,!?\n]|$)/gi,
    factType: "context",
    format: (s) => `has ${cleanTail(s)}`,
  },
  // VN: "tôi làm X" / "tôi sống ở X"
  {
    pattern: /(?:Tôi|tôi|Toi|toi)\s+(?:làm|lam)\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/g,
    factType: "context",
    format: (s) => `works as ${cleanTail(s)}`,
  },
  {
    pattern: /(?:Tôi|tôi|Toi|toi)\s+(?:sống|song)\s+(?:ở|o)\s+([^.,!?\n]+?)(?=[.,!?\n]|$)/g,
    factType: "context",
    format: (s) => `lives in ${cleanTail(s)}`,
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────

function cleanTail(s: string): string {
  return s
    .replace(/\s+/g, " ")
    .replace(/^(?:to\s+|the\s+|a\s+|an\s+)/i, "")
    .trim()
    .slice(0, 80);
}

function dedupe(cands: FactCandidate[]): FactCandidate[] {
  const seen = new Set<string>();
  const out: FactCandidate[] = [];
  for (const c of cands) {
    const key = `${c.factType}::${c.content.toLowerCase()}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(c);
  }
  return out;
}
