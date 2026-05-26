// src/lib/writing-feedback/scoreEssayVN.ts
//
// Vietnamese-learner-aware IELTS Writing Task 2 feedback layer.
//
// Wraps the existing `scoreEssay` heuristic rubric (5 dimensions, 0–5)
// and adds three things on top:
//   1. Detection of high-precision Vietnamese-specific writing patterns
//      (article omission, comma-spliced run-ons, mechanical connectors,
//      under-developed body paragraphs, etc.). Detection is conservative
//      so false positives stay rare.
//   2. An IELTS band estimate (4.0–9.0 in 0.5 steps) derived from the
//      base rubric scores plus a small downward adjustment when VN
//      patterns recur.
//   3. A personalised half-band advice paragraph drawn from VN_BAND_RUBRIC
//      and ranked revision suggestions tied to the detected patterns.
//
// Pure + deterministic. No I/O. No AI. No network. Same input → same
// output. Existing scoreEssay() and its tests are not modified.

import {
  scoreEssay,
} from "./scoreEssay";
import type { WritingRubric } from "./rubric";
import {
  VN_WRITING_PATTERNS,
  type VnWritingPattern,
  type VnWritingPatternId,
} from "./vn-writing-patterns";
import {
  VN_BAND_RUBRIC,
  rubricForBand,
  snapToHalfBand,
  type IeltsBand,
  type VnBandRubricRow,
} from "./vn-band-rubric";

export interface DetectedVnPattern {
  pattern: VnWritingPattern;
  /**
   * 1-based line numbers (relative to the raw essay) where the pattern
   * was detected. Empty when the pattern is structural (e.g. thesis-in-
   * conclusion) and not tied to a specific line.
   */
  lineHits: number[];
  /** A short verbatim excerpt from the essay illustrating the hit. */
  excerpt: string | null;
}

export interface RevisionSuggestion {
  /** Pattern id this suggestion targets. Allows the UI to cross-link. */
  patternId: VnWritingPatternId | "global";
  vi: string;
  en: string;
  /** Higher = more likely to lift the band on the next revision. */
  priority: number;
}

export interface VnEnhancedFeedback {
  /** The base scoreEssay rubric — unchanged shape. */
  baseRubric: WritingRubric;
  /** IELTS Writing Task 2 band estimate (4.0–9.0 in 0.5 steps). */
  estimatedBand: IeltsBand;
  /** Patterns detected in the essay. */
  detectedPatterns: DetectedVnPattern[];
  /** Personalised band advice (next half-band). */
  bandRubric: VnBandRubricRow | null;
  /** Top-3 revision suggestions ranked by impact. */
  topRevisions: RevisionSuggestion[];
}

// ── Tokenisation helpers (kept local to keep this file deterministic) ─

const WORD_REGEX = /[A-Za-z]+(?:'[A-Za-z]+)?/g;

function tokenize(text: string): string[] {
  return (text.match(WORD_REGEX) ?? []).map((w) => w.toLowerCase());
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n+/g)
    .map((p) => p.trim())
    .filter(Boolean);
}

function splitLines(text: string): string[] {
  return text.split(/\n/g);
}

function findFirstLineMatching(
  rawText: string,
  predicate: (line: string) => boolean,
): { line: number; excerpt: string } | null {
  const lines = splitLines(rawText);
  for (let i = 0; i < lines.length; i++) {
    if (predicate(lines[i])) {
      return { line: i + 1, excerpt: lines[i].trim() };
    }
  }
  return null;
}

// ── Pattern detectors ─────────────────────────────────────────────────
//
// Each detector returns either a list of 1-based line numbers where the
// pattern was found OR an empty list (no hit). High-precision rules
// only — a borderline case never fires.

type PatternDetector = (text: string) => { lines: number[]; excerpt: string | null };

const DETECTORS: Record<VnWritingPatternId, PatternDetector> = {
  missing_articles: (text) => {
    const lines = splitLines(text);
    const hits: number[] = [];
    let firstExcerpt: string | null = null;
    // Conservative trigger: bare-noun "play role / important role" without
    // a / an / the immediately preceding a small whitelist of nouns.
    const re =
      /\b(play|have|is|are|was|were|become|becomes)\s+(important|essential|key|major|significant|crucial)\s+(role|impact|factor|reason|issue|problem)\b/i;
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i]) && !/\b(an?|the)\s+(important|essential|key|major|significant|crucial)\b/i.test(lines[i])) {
        hits.push(i + 1);
        firstExcerpt ??= lines[i].trim();
      }
    }
    return { lines: hits, excerpt: firstExcerpt };
  },
  plural_inconsistency: (text) => {
    const lines = splitLines(text);
    const hits: number[] = [];
    let firstExcerpt: string | null = null;
    // "many / several / two-ten + singular noun" — tight whitelist.
    const re =
      /\b(many|several|two|three|four|five|six|seven|eight|nine|ten|some|few)\s+(student|teacher|child|book|year|day|hour|minute|country|language|word|reason|problem|idea|example|issue)\b/i;
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) {
        hits.push(i + 1);
        firstExcerpt ??= lines[i].trim();
      }
    }
    return { lines: hits, excerpt: firstExcerpt };
  },
  run_on_with_comma: (text) => {
    const lines = splitLines(text);
    const hits: number[] = [];
    let firstExcerpt: string | null = null;
    // A sentence with 2+ subject-verb commas chained in a row, without
    // 'and' / 'or' / 'but' / 'because'. Detect ", I "/", we "/", they "
    // patterns inside one sentence.
    const sentences = text.split(/(?<=[.!?])\s+/g);
    for (const s of sentences) {
      const commaSubjects = (s.match(/,\s*(I|we|they|he|she|it)\s+(go|went|come|came|think|thought|see|saw|do|did|study|studied|work|worked|live|lived)\b/gi) ?? []).length;
      if (commaSubjects >= 2) {
        const found = findFirstLineMatching(text, (line) => line.includes(s.slice(0, 30)));
        if (found) {
          hits.push(found.line);
          firstExcerpt ??= found.excerpt;
        }
      }
    }
    return { lines: hits, excerpt: firstExcerpt };
  },
  overused_furthermore: (text) => {
    // Fires when 'furthermore' / 'moreover' / 'in addition' appear 3+
    // times across the essay, a clear sign of mechanical chaining.
    const lower = text.toLowerCase();
    const count =
      (lower.match(/\bfurthermore\b/g) ?? []).length +
      (lower.match(/\bmoreover\b/g) ?? []).length +
      (lower.match(/\bin addition\b/g) ?? []).length;
    if (count < 3) return { lines: [], excerpt: null };
    const found = findFirstLineMatching(text, (line) =>
      /\b(furthermore|moreover|in addition)\b/i.test(line),
    );
    return { lines: found ? [found.line] : [], excerpt: found?.excerpt ?? null };
  },
  thesis_in_conclusion: (text) => {
    // Heuristic: introduction paragraph (first paragraph) lacks any
    // first-person opinion verb, but the conclusion paragraph contains
    // 'I (strongly|firmly)? (agree|disagree|believe|think)'. Conservative
    // — only fires when both halves match.
    const paragraphs = splitParagraphs(text);
    if (paragraphs.length < 2) return { lines: [], excerpt: null };
    const first = paragraphs[0].toLowerCase();
    const last = paragraphs[paragraphs.length - 1].toLowerCase();
    const firstHasOpinion =
      /\bi\s+(strongly|firmly|partly|completely)?\s*(agree|disagree|believe|think|argue|maintain)\b/.test(first) ||
      /\bin my (opinion|view)\b/.test(first) ||
      /\bit is (my|widely)\b/.test(first);
    const lastHasOpinion =
      /\bi\s+(strongly|firmly|partly|completely)?\s*(agree|disagree|believe|think|argue|maintain)\b/.test(last) ||
      /\bin my (opinion|view)\b/.test(last);
    if (!firstHasOpinion && lastHasOpinion) {
      // Locate the conclusion line for the excerpt.
      const found = findFirstLineMatching(
        paragraphs[paragraphs.length - 1],
        () => true,
      );
      return { lines: [], excerpt: found?.excerpt ?? null };
    }
    return { lines: [], excerpt: null };
  },
  topic_sentence_missing: (text) => {
    // Heuristic: a body paragraph (not first, not last) starts with
    // 'For example' / 'For instance' — a pattern that's almost always a
    // missing topic sentence.
    const paragraphs = splitParagraphs(text);
    if (paragraphs.length < 3) return { lines: [], excerpt: null };
    const bodies = paragraphs.slice(1, -1);
    let firstExcerpt: string | null = null;
    let hit = false;
    for (const para of bodies) {
      if (/^\s*(for example|for instance|firstly|first,)/i.test(para) && !/^\s*(for example|for instance|firstly,?)\s*[A-Z]/.test(para)) {
        // Reject only when paragraph LITERALLY begins with the example-marker.
        hit = true;
        firstExcerpt ??= para.split(/[.!?]/)[0].trim();
        break;
      }
    }
    return { lines: [], excerpt: hit ? firstExcerpt : null };
  },
  under_developed_body: (text) => {
    // Heuristic: a body paragraph has < 3 sentences AND the essay has
    // at least 3 paragraphs. Single-sentence body paragraphs are the
    // signal.
    const paragraphs = splitParagraphs(text);
    if (paragraphs.length < 3) return { lines: [], excerpt: null };
    const bodies = paragraphs.slice(1, -1);
    let hit = false;
    let firstExcerpt: string | null = null;
    for (const para of bodies) {
      const sentenceCount = para.split(/(?<=[.!?])\s+/g).filter((s) => s.trim().length > 0).length;
      if (sentenceCount < 3) {
        hit = true;
        firstExcerpt ??= para.slice(0, 80);
        break;
      }
    }
    return { lines: [], excerpt: hit ? firstExcerpt : null };
  },
  vague_referent_pronouns: (text) => {
    // Only fire on clear vague-It openers: a paragraph starting with
    // "It is" without any earlier referent in the same paragraph.
    const paragraphs = splitParagraphs(text);
    let hit = false;
    let firstExcerpt: string | null = null;
    for (const para of paragraphs) {
      const sentences = para.split(/(?<=[.!?])\s+/g);
      for (let i = 0; i < sentences.length; i++) {
        if (/^\s*It is\s+(important|good|bad|essential|necessary|crucial)\b/.test(sentences[i]) && i === 0) {
          hit = true;
          firstExcerpt ??= sentences[i].trim();
          break;
        }
      }
      if (hit) break;
    }
    return { lines: [], excerpt: hit ? firstExcerpt : null };
  },
  literal_translation_idioms: (text) => {
    // High-precision string match for known literal-Vietnamese idioms.
    const triggers = [
      /\beat full and warm\b/i,
      /\bhave name on the list\b/i,
      /\bopen eyes wide\b/i,
      /\bwhite hand\b/i, // 'tay trắng' = empty-handed
    ];
    for (const re of triggers) {
      const found = findFirstLineMatching(text, (line) => re.test(line));
      if (found) return { lines: [found.line], excerpt: found.excerpt };
    }
    return { lines: [], excerpt: null };
  },
  weak_hedging_absolute: (text) => {
    // Fires when the essay contains 3+ instances of 'all + people/X' or
    // 'every + Y' or 'always' / 'never' across body without any 'tend to'
    // / 'often' / 'many' style hedge.
    const lower = text.toLowerCase();
    const absoluteCount =
      (lower.match(/\ball (people|students|teenagers|children|adults|workers|countries)\b/g) ?? []).length +
      (lower.match(/\bevery (person|student|teenager|child|adult|worker|country)\b/g) ?? []).length;
    const hedgeCount =
      (lower.match(/\b(tend to|often|frequently|many|some|generally|typically)\b/g) ?? []).length;
    if (absoluteCount >= 2 && hedgeCount === 0) {
      const found = findFirstLineMatching(text, (line) =>
        /\b(all (people|students|teenagers|children)|every (person|student))\b/i.test(line),
      );
      return { lines: found ? [found.line] : [], excerpt: found?.excerpt ?? null };
    }
    return { lines: [], excerpt: null };
  },
  list_without_synthesis: (text) => {
    // Heuristic: a body paragraph contains 'first', 'second', 'third'
    // chained AND fewer than 80 chars per item (i.e. listing without
    // analysis).
    const paragraphs = splitParagraphs(text);
    let hit = false;
    let firstExcerpt: string | null = null;
    for (const para of paragraphs) {
      if (/\bfirst\b.*\bsecond\b.*\bthird\b/i.test(para) && para.length < 240) {
        hit = true;
        firstExcerpt ??= para.slice(0, 80);
        break;
      }
    }
    return { lines: [], excerpt: hit ? firstExcerpt : null };
  },
  informal_register_in_essay: (text) => {
    const lines = splitLines(text);
    const hits: number[] = [];
    let firstExcerpt: string | null = null;
    // contractions OR 'I think' OR 'a lot of' OR 'kids' OR 'everybody knows'
    const re =
      /\b(don'?t|won'?t|can'?t|isn'?t|aren'?t|i'?m|i'?ve|i'?ll|i think|a lot of|kids|everybody knows|guys|stuff)\b/i;
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) {
        hits.push(i + 1);
        firstExcerpt ??= lines[i].trim();
      }
    }
    return { lines: hits, excerpt: firstExcerpt };
  },
  tense_inconsistency: (text) => {
    // Conservative: a single paragraph contains BOTH a clear past marker
    // (yesterday, last year, ago) AND a clear simple-present sentence
    // about the same subject ('I am ...', 'It is ...').
    const paragraphs = splitParagraphs(text);
    let firstExcerpt: string | null = null;
    let hit = false;
    for (const para of paragraphs) {
      const lower = para.toLowerCase();
      const hasPast = /\b(yesterday|last (year|month|week|night)|ago)\b/.test(lower);
      const hasPresent = /\b(i am|it is|they are|she is|he is)\b/.test(lower);
      if (hasPast && hasPresent) {
        hit = true;
        firstExcerpt ??= para.slice(0, 80);
        break;
      }
    }
    return { lines: [], excerpt: hit ? firstExcerpt : null };
  },
  comparison_structure_double: (text) => {
    const lines = splitLines(text);
    const hits: number[] = [];
    let firstExcerpt: string | null = null;
    const re = /\bmore\s+(better|bigger|smaller|faster|slower|stronger|weaker|nicer|happier|easier|harder|older|younger|taller|shorter)\b/i;
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) {
        hits.push(i + 1);
        firstExcerpt ??= lines[i].trim();
      }
    }
    return { lines: hits, excerpt: firstExcerpt };
  },
  noun_clause_that_drop: (text) => {
    // Conservative: 'I/we believe X is/are/will' without 'that'. Only
    // fires when the dropped 'that' is clearly the issue.
    const lines = splitLines(text);
    const hits: number[] = [];
    let firstExcerpt: string | null = null;
    const re = /\b(I|we) (believe|think|argue|maintain|claim) (it|he|she|they|the |many |this |these )/i;
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) {
        hits.push(i + 1);
        firstExcerpt ??= lines[i].trim();
      }
    }
    return { lines: hits, excerpt: firstExcerpt };
  },
  subject_verb_agreement_collective: (text) => {
    const lines = splitLines(text);
    const hits: number[] = [];
    let firstExcerpt: string | null = null;
    const re = /\b(government|family|team|company|committee|class)\s+(are|were|have)\b/i;
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) {
        hits.push(i + 1);
        firstExcerpt ??= lines[i].trim();
      }
    }
    return { lines: hits, excerpt: firstExcerpt };
  },
  preposition_at_in_on: (text) => {
    const lines = splitLines(text);
    const hits: number[] = [];
    let firstExcerpt: string | null = null;
    // High-precision: 'at + day-of-week / + Hanoi / + a city' or 'in + clock time'.
    const re = /\bat\s+(monday|tuesday|wednesday|thursday|friday|saturday|sunday|hanoi|saigon|tokyo|london)\b/i;
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) {
        hits.push(i + 1);
        firstExcerpt ??= lines[i].trim();
      }
    }
    return { lines: hits, excerpt: firstExcerpt };
  },
  uncountable_treated_countable: (text) => {
    const lines = splitLines(text);
    const hits: number[] = [];
    let firstExcerpt: string | null = null;
    const re = /\b(many|several|few|two|three)\s+(informations|advices|knowledges|equipments|furnitures|researches)\b|\ban?\s+(advice|information|knowledge|equipment|furniture|research)\b/i;
    for (let i = 0; i < lines.length; i++) {
      if (re.test(lines[i])) {
        hits.push(i + 1);
        firstExcerpt ??= lines[i].trim();
      }
    }
    return { lines: hits, excerpt: firstExcerpt };
  },
  and_then_chain: (text) => {
    const lower = text.toLowerCase();
    const count = (lower.match(/\band then\b/g) ?? []).length;
    if (count < 3) return { lines: [], excerpt: null };
    const found = findFirstLineMatching(text, (l) => /\band then\b/i.test(l));
    return { lines: found ? [found.line] : [], excerpt: found?.excerpt ?? null };
  },
  fronted_because_fragment: (text) => {
    const lines = splitLines(text);
    const hits: number[] = [];
    let firstExcerpt: string | null = null;
    // A line that is a single sentence starting with 'Because' and ending
    // with a period. Conservative — must be the entire line.
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (/^Because\b/.test(trimmed) && /\.$/.test(trimmed) && !/(,|;)/.test(trimmed)) {
        hits.push(i + 1);
        firstExcerpt ??= trimmed;
      }
    }
    return { lines: hits, excerpt: firstExcerpt };
  },
  always_never_overuse: (text) => {
    const lower = text.toLowerCase();
    const count = (lower.match(/\b(always|never)\b/g) ?? []).length;
    if (count < 3) return { lines: [], excerpt: null };
    const found = findFirstLineMatching(text, (l) => /\b(always|never)\b/i.test(l));
    return { lines: found ? [found.line] : [], excerpt: found?.excerpt ?? null };
  },
  phrasal_verb_avoidance: (text) => {
    // Heuristic: high-formal verbs (mention, demonstrate, illustrate,
    // utilise) used 3+ times AND zero phrasal verbs. Tells us the writer
    // is over-formalising.
    const lower = text.toLowerCase();
    const formalCount =
      (lower.match(/\b(mention|demonstrate|illustrate|utilise|utilize|elucidate)\b/g) ?? []).length;
    const phrasalCount =
      (lower.match(/\b(point out|come up with|rely on|deal with|set out|give up|put forward|carry out|look into|bring about|figure out|find out)\b/g) ?? []).length;
    if (formalCount >= 3 && phrasalCount === 0 && tokenize(text).length >= 200) {
      const found = findFirstLineMatching(text, (l) =>
        /\b(mention|demonstrate|illustrate|utilise|utilize)\b/i.test(l),
      );
      return { lines: found ? [found.line] : [], excerpt: found?.excerpt ?? null };
    }
    return { lines: [], excerpt: null };
  },
};

// ── Band estimation ──────────────────────────────────────────────────

function estimateBandFromRubric(rubric: WritingRubric, vnPenalty: number): IeltsBand {
  // Average of 5 dimensions (each 0–5). Map onto 4.0–8.0 IELTS band
  // before applying the VN penalty:
  //   avg 5.0 → 8.0   (perfect rubric, VN-aware)
  //   avg 3.0 → 6.0
  //   avg 1.0 → 4.0
  // Each detected VN pattern subtracts up to 0.25 band, capped at 1.5.
  const dims: number[] = [
    rubric.grammar.score,
    rubric.vocabulary.score,
    rubric.structure.score,
    rubric.spelling_punctuation.score,
    rubric.coherence.score,
  ];
  const avg = dims.reduce<number>((a, b) => a + b, 0) / dims.length;
  const baseBand = 4.0 + Math.max(0, Math.min(4.0, avg - 1.0));
  const adjusted = baseBand - Math.min(1.5, vnPenalty);
  return snapToHalfBand(adjusted);
}

// ── Public entry ─────────────────────────────────────────────────────

export function scoreEssayForVietnameseLearner(
  essay: string,
  prompt?: string,
): VnEnhancedFeedback {
  // `prompt` is accepted for the eventual on-topic check but not used
  // by the heuristic layer yet — keeping the signature future-proof.
  void prompt;

  const baseRubric = scoreEssay(essay);
  const trimmed = (essay ?? "").trim();

  if (trimmed.length === 0) {
    return {
      baseRubric,
      estimatedBand: 4.0,
      detectedPatterns: [],
      bandRubric: rubricForBand(4.0) ?? null,
      topRevisions: [],
    };
  }

  const detectedPatterns: DetectedVnPattern[] = [];
  let vnPenalty = 0;

  for (const pattern of VN_WRITING_PATTERNS) {
    const detect = DETECTORS[pattern.id];
    if (!detect) continue;
    const result = detect(essay);
    if (result.lines.length > 0 || result.excerpt !== null) {
      detectedPatterns.push({
        pattern,
        lineHits: result.lines,
        excerpt: result.excerpt,
      });
      // Recurring patterns hurt more — multi-hit gets full impact, single
      // hit gets half. This keeps single-typo-style hits from blowing up
      // the band estimate.
      const occurrences = result.lines.length || 1;
      const factor = occurrences >= 2 ? 1 : 0.5;
      vnPenalty += Math.abs(pattern.ielts_band_impact) * factor;
    }
  }

  const estimatedBand = estimateBandFromRubric(baseRubric, vnPenalty);
  const bandRubric = rubricForBand(estimatedBand) ?? null;

  // Ranked revision suggestions: detected patterns sorted by absolute
  // band impact, plus a global advice item from the band rubric.
  const ranked = detectedPatterns
    .slice()
    .sort(
      (a, b) =>
        Math.abs(b.pattern.ielts_band_impact) -
        Math.abs(a.pattern.ielts_band_impact),
    )
    .slice(0, 3)
    .map<RevisionSuggestion>((d) => ({
      patternId: d.pattern.id,
      vi: d.pattern.description_vi,
      en: d.pattern.description_en,
      priority: Math.abs(d.pattern.ielts_band_impact) * 100,
    }));

  const globalAdvice: RevisionSuggestion | null = bandRubric
    ? {
        patternId: "global",
        vi: bandRubric.next_half_band_steps_vi,
        en: bandRubric.next_half_band_steps_vi,
        priority: 50,
      }
    : null;

  const topRevisions = (
    globalAdvice ? [...ranked, globalAdvice] : ranked
  )
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3);

  return {
    baseRubric,
    estimatedBand,
    detectedPatterns,
    bandRubric,
    topRevisions,
  };
}

// Re-export commonly referenced types so consumers can import from a
// single module.
export type { VnWritingPattern, VnWritingPatternId } from "./vn-writing-patterns";
export { VN_WRITING_PATTERNS } from "./vn-writing-patterns";
export type { IeltsBand, VnBandRubricRow } from "./vn-band-rubric";
export { VN_BAND_RUBRIC, snapToHalfBand } from "./vn-band-rubric";
