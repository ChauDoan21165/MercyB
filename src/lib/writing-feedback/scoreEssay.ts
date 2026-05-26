// src/lib/writing-feedback/scoreEssay.ts
//
// Pure deterministic essay scorer. No I/O, no AI, no network. Same
// input → same output. Designed to give learners actionable feedback
// in <100 ms even on a slow phone.
//
// What this file is NOT:
//   - It's not a replacement for an LLM-based rubric. The detection
//     heuristics here are tuned for high-precision on signature
//     Vietnamese-English transfer errors; they will miss subtler issues.
//   - It is not a grader of "good writing" in an absolute sense. It
//     scores along five dimensions whose criteria a learner can act on.
//
// Why we don't call detectL1Error from feedback/l1-error-detector.ts:
//   That detector requires a known `expectedAnswer` (it's designed for
//   short prompted exercises). Free essays have no expected answer.
//   We instead reuse the L1WeaknessTag taxonomy and run essay-specific
//   patterns that fire on the user's text alone.

import type {
  L1WeaknessTag,
} from "@/lib/feedback/l1-error-detector";
import {
  emptyRubric,
  toDimensionScore,
  type CefrLevel,
  type DimensionScore,
  type WritingRubric,
} from "./rubric";

// ── Public API ────────────────────────────────────────────────────────────

export function scoreEssay(text: string): WritingRubric {
  const trimmed = (text ?? "").trim();
  if (!trimmed) return emptyRubric();

  const tokens = tokenize(trimmed);
  if (tokens.length === 0) return emptyRubric();

  const sentences = splitSentences(trimmed);
  const paragraphs = splitParagraphs(trimmed);

  const grammar = scoreGrammar(tokens, sentences);
  const vocabulary = scoreVocabulary(tokens);
  const structure = scoreStructure(paragraphs, sentences, tokens);
  const spelling = scoreSpellingPunctuation(tokens, trimmed);
  const coherence = scoreCoherence(sentences, paragraphs, tokens);

  return {
    grammar,
    vocabulary,
    structure,
    spelling_punctuation: spelling,
    coherence,
  };
}

// ── Tokenisation helpers ──────────────────────────────────────────────────

const WORD_REGEX = /[A-Za-z]+(?:'[A-Za-z]+)?/g;

function tokenize(text: string): string[] {
  return (text.match(WORD_REGEX) ?? []).map((w) => w.toLowerCase());
}

function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/g)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function splitParagraphs(text: string): string[] {
  return text
    .split(/\n\s*\n+/g)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);
}

// ── Grammar dimension ─────────────────────────────────────────────────────
//
// Pattern bank tuned for high precision on Vietnamese-English transfer
// errors that show up in essays. Each detector returns a tag if it
// fires anywhere in the text. We dedupe and order by first appearance.

type EssayDetector = (params: {
  tokens: string[];
  sentences: string[];
}) => boolean;

const ESSAY_DETECTORS: ReadonlyArray<{
  tag: L1WeaknessTag;
  detect: EssayDetector;
}> = [
  // 3rd-person -s: "he go", "she think", "it work" with bare verb
  {
    tag: "vi_l1_3rd_person_s",
    detect: ({ sentences }) =>
      sentences.some((s) =>
        /\b(he|she|it)\s+(go|come|think|want|need|like|love|hate|see|do|run|talk|walk|work|live|play|study|learn|teach|know|say|tell)\b/i.test(
          s,
        ),
      ),
  },
  // Past-tense missed: "yesterday/last week/ago" with bare verb
  {
    tag: "vi_l1_past_ed",
    detect: ({ sentences }) =>
      sentences.some((s) => {
        const hasPastMarker = /\b(yesterday|last\s+(week|month|year|night)|ago)\b/i.test(s);
        if (!hasPastMarker) return false;
        return /\b(i|we|they|he|she|it|you)\s+(go|come|see|do|work|live|study|play|learn|think|want|like|talk|walk)\b/i.test(
          s,
        );
      }),
  },
  // Plural -s missed: "two/three/many/several + singular noun"
  {
    tag: "vi_l1_plural_s",
    detect: ({ sentences }) =>
      sentences.some((s) =>
        /\b(two|three|four|five|six|seven|eight|nine|ten|many|several|few)\s+(book|apple|friend|child|day|year|hour|minute|teacher|student|country|language|word|sentence|question|problem|idea|reason|example|thing)\b/i.test(
          s,
        ),
      ),
  },
  // Missing be-verb: "I tired", "she happy", "we ready"
  {
    tag: "vi_l1_missing_be",
    detect: ({ sentences }) =>
      sentences.some((s) =>
        /\b(i|you|he|she|it|we|they)\s+(tired|happy|sad|angry|hungry|thirsty|ready|busy|free|sick|fine|okay|ok|cold|hot|young|old|smart|kind)\b/i.test(
          s,
        ) &&
        // not already preceded by am/is/are
        !/\b(am|is|are|was|were|be|been|being)\s+(tired|happy|sad|angry|hungry|thirsty|ready|busy|free|sick|fine|okay|ok|cold|hot|young|old|smart|kind)\b/i.test(
          s,
        ),
      ),
  },
  // Question with no auxiliary: rough heuristic — sentence ends with ?
  // and starts with subject + bare verb (not what/where/when/who etc.)
  {
    tag: "vi_l1_question_no_aux",
    detect: ({ sentences }) =>
      sentences.some(
        (s) =>
          s.endsWith("?") &&
          /^\s*(i|you|he|she|it|we|they)\s+(go|come|like|love|want|need|have|see|know|think|study|work)\b/i.test(
            s,
          ),
      ),
  },
  // Missing article: heuristic — capital-A "I want apple" / "I have car"
  {
    tag: "vi_l1_missing_article",
    detect: ({ sentences }) =>
      sentences.some((s) =>
        /\b(want|have|need|buy|see|find|get)\s+(apple|book|car|cat|dog|house|job|phone|laptop|key|bag|pen|table|chair)\b/i.test(
          s,
        ),
      ),
  },
  // After modal: "can goes", "should works", "will plays"
  {
    tag: "vi_l1_can_no_infinitive",
    detect: ({ sentences }) =>
      sentences.some((s) =>
        /\b(can|could|will|would|should|may|might|must)\s+(goes|comes|works|plays|studies|likes|loves|wants|needs|sees|does|knows|thinks)\b/i.test(
          s,
        ),
      ),
  },
  // Double past: "didn't/did + ed verb"
  {
    tag: "vi_l1_double_past",
    detect: ({ sentences }) =>
      sentences.some((s) =>
        /\b(didn'?t|did\s+not|did)\s+(went|came|saw|did|worked|lived|studied|played|learned|thought|wanted|liked|talked|walked|known|made|took|got)\b/i.test(
          s,
        ),
      ),
  },
  // a vs an before vowel: "a apple", "a hour"
  {
    tag: "vi_l1_a_vs_an_vowel",
    detect: ({ tokens }) => {
      for (let i = 0; i < tokens.length - 1; i++) {
        if (tokens[i] === "a") {
          const next = tokens[i + 1];
          if (/^[aeiou]/.test(next) && next !== "one" && next !== "uniform" && next !== "user" && next !== "european") {
            return true;
          }
        }
      }
      return false;
    },
  },
  // Double comparative: "more better", "more bigger"
  {
    tag: "vi_l1_comparative_double",
    detect: ({ sentences }) =>
      sentences.some((s) =>
        /\bmore\s+(better|bigger|smaller|faster|slower|stronger|weaker|nicer|happier|easier|harder|older|younger|taller|shorter)\b/i.test(
          s,
        ),
      ),
  },
];

function scoreGrammar(
  tokens: string[],
  sentences: string[],
): WritingRubric["grammar"] {
  const hits: L1WeaknessTag[] = [];
  for (const det of ESSAY_DETECTORS) {
    if (det.detect({ tokens, sentences })) hits.push(det.tag);
  }

  // Score: start at 5, lose 1 per hit, floor at 0. Two extra ramps:
  // ≥ 4 hits → max 1; tiny essays (< 30 tokens) cap at 3 because we
  // didn't see enough text to confidently call it strong.
  let score = 5 - hits.length;
  if (hits.length >= 4) score = Math.min(score, 1);
  if (tokens.length < 30) score = Math.min(score, 3);

  return { score: toDimensionScore(score), issues: hits };
}

// ── Vocabulary dimension ──────────────────────────────────────────────────
//
// Heuristic: combines unique-token ratio (lexical variety) and average
// word length. CEFR estimate uses crude length + variety bands.

function scoreVocabulary(tokens: string[]): WritingRubric["vocabulary"] {
  const notes: string[] = [];

  if (tokens.length < 10) {
    notes.push("Bài quá ngắn để đánh giá từ vựng.");
    return {
      score: toDimensionScore(1),
      level_estimate: "A1",
      notes,
    };
  }

  const unique = new Set(tokens);
  const ttr = unique.size / tokens.length; // type-token ratio
  const avgLen =
    tokens.reduce((sum, w) => sum + w.length, 0) / tokens.length;

  // Variety: 0.6+ is rich for short essays; 0.3 is repetitive.
  let varietyScore: number;
  if (ttr >= 0.6) varietyScore = 5;
  else if (ttr >= 0.5) varietyScore = 4;
  else if (ttr >= 0.4) varietyScore = 3;
  else if (ttr >= 0.3) varietyScore = 2;
  else varietyScore = 1;

  // Word length: 4.0–5.5 is typical learner range. Penalise both extremes.
  let lengthScore: number;
  if (avgLen >= 4.5 && avgLen <= 5.5) lengthScore = 5;
  else if (avgLen >= 4.0 && avgLen <= 6.0) lengthScore = 4;
  else if (avgLen >= 3.5 && avgLen <= 6.5) lengthScore = 3;
  else lengthScore = 2;

  const blended = Math.round((varietyScore + lengthScore) / 2);

  if (ttr < 0.4) notes.push("Lặp từ nhiều — thử dùng từ đồng nghĩa.");
  if (avgLen < 4.0) notes.push("Từ vựng còn ngắn, đa số là từ ngắn cơ bản.");
  if (avgLen > 6.5) notes.push("Từ trung bình rất dài — kiểm tra đã viết tự nhiên chưa.");
  if (notes.length === 0) notes.push("Từ vựng đa dạng và phù hợp.");

  const level_estimate: CefrLevel = estimateCefr(tokens, ttr, avgLen);

  return { score: toDimensionScore(blended), level_estimate, notes };
}

function estimateCefr(
  tokens: string[],
  ttr: number,
  avgLen: number,
): CefrLevel {
  // Crude bands. Real CEFR estimation needs vocabulary lists; here we
  // hand the UI a band the learner can mentally adjust.
  const totalWords = tokens.length;
  if (totalWords < 30) return "A1";
  if (ttr < 0.35 && avgLen < 4.2) return "A2";
  if (ttr < 0.45) return "B1";
  if (ttr < 0.55 || avgLen < 5.0) return "B2";
  if (ttr < 0.65) return "C1";
  return "C2";
}

// ── Structure dimension ───────────────────────────────────────────────────
//
// "Intro" = first paragraph contains a thesis-shaped sentence (declarative,
// 6+ words). "Conclusion" = last paragraph contains a summarising
// transition word ("in conclusion", "to sum up", "overall", "finally").

const CONCLUSION_MARKERS = [
  "in conclusion",
  "to sum up",
  "to summarize",
  "to summarise",
  "overall",
  "finally",
  "in summary",
  "all in all",
  "in short",
];

function scoreStructure(
  paragraphs: string[],
  sentences: string[],
  tokens: string[],
): WritingRubric["structure"] {
  const paragraph_count = paragraphs.length;

  const firstPara = paragraphs[0] ?? "";
  const lastPara = paragraphs[paragraphs.length - 1] ?? "";

  // Intro signal: first paragraph has at least one full sentence (>=6 tokens)
  const firstSentences = splitSentences(firstPara);
  const has_intro = firstSentences.some(
    (s) => tokenize(s).length >= 6 && !s.endsWith("?"),
  );

  const lastLower = lastPara.toLowerCase();
  const has_conclusion = CONCLUSION_MARKERS.some((m) => lastLower.includes(m));

  // Score: 5 if intro + conclusion + 3+ paragraphs, scale down.
  let score = 0;
  if (paragraph_count >= 1 && tokens.length >= 30) score += 1;
  if (paragraph_count >= 2) score += 1;
  if (paragraph_count >= 3) score += 1;
  if (has_intro) score += 1;
  if (has_conclusion) score += 1;
  if (sentences.length < 3) score = Math.min(score, 2);

  return {
    score: toDimensionScore(score),
    has_intro,
    has_conclusion,
    paragraph_count,
  };
}

// ── Spelling + punctuation dimension ──────────────────────────────────────
//
// We can't bundle a full English dictionary (size + license). Instead
// we flag a curated list of high-frequency Vietnamese-learner typos and
// look for blatant punctuation issues (no terminal punctuation, double
// spaces, missing capital after period).

const COMMON_TYPOS: Record<string, string> = {
  becouse: "because",
  becuase: "because",
  alot: "a lot",
  untill: "until",
  wich: "which",
  recieve: "receive",
  occured: "occurred",
  occuring: "occurring",
  beleive: "believe",
  begining: "beginning",
  enviroment: "environment",
  goverment: "government",
  diffrent: "different",
  finaly: "finally",
  realy: "really",
  succesful: "successful",
  rememeber: "remember",
  remeber: "remember",
  tommorow: "tomorrow",
  tomorow: "tomorrow",
  thier: "their",
  freind: "friend",
  freinds: "friends",
  studing: "studying",
  studyed: "studied",
  beautifull: "beautiful",
  carefull: "careful",
  usefull: "useful",
};

function scoreSpellingPunctuation(
  tokens: string[],
  rawText: string,
): WritingRubric["spelling_punctuation"] {
  const errors: string[] = [];

  for (const tok of tokens) {
    if (COMMON_TYPOS[tok]) errors.push(tok);
  }

  // Punctuation signals (each adds an "error" to the count for scoring).
  let punctErrors = 0;
  // Trailing sentence with no terminal punctuation.
  if (rawText.length > 0 && !/[.!?]\s*$/.test(rawText.trim())) {
    punctErrors += 1;
  }
  // Double spaces.
  if (/ {2,}/.test(rawText)) punctErrors += 1;
  // Missing capital after period: "word. word"
  if (/\.\s+[a-z]/.test(rawText)) punctErrors += 1;
  // Sentence-initial lowercase letter (very common VN-learner habit).
  if (/^[a-z]/.test(rawText.trim())) punctErrors += 1;

  const totalIssues = errors.length + punctErrors;

  let score: number;
  if (totalIssues === 0) score = 5;
  else if (totalIssues === 1) score = 4;
  else if (totalIssues <= 3) score = 3;
  else if (totalIssues <= 5) score = 2;
  else score = 1;

  // Dedupe errors so the UI doesn't repeat.
  const uniqueErrors = Array.from(new Set(errors));
  return { score: toDimensionScore(score), errors: uniqueErrors };
}

// ── Coherence dimension ───────────────────────────────────────────────────
//
// Heuristic blend:
//   - Transition words across sentences (however, therefore, also, ...)
//   - Pronoun-density check (too many pronouns → unclear references)
//   - Average sentence length (very long sentences hurt clarity)

const TRANSITION_WORDS = [
  "however",
  "therefore",
  "moreover",
  "furthermore",
  "additionally",
  "for example",
  "for instance",
  "in addition",
  "on the other hand",
  "as a result",
  "consequently",
  "meanwhile",
  "first",
  "second",
  "third",
  "next",
  "then",
  "also",
  "finally",
  "in fact",
  "of course",
  "for this reason",
  "because of this",
];

const PRONOUNS = [
  "i",
  "you",
  "he",
  "she",
  "it",
  "we",
  "they",
  "him",
  "her",
  "them",
  "us",
  "his",
  "hers",
  "its",
  "our",
  "their",
  "this",
  "that",
  "these",
  "those",
];

function scoreCoherence(
  sentences: string[],
  paragraphs: string[],
  tokens: string[],
): WritingRubric["coherence"] {
  const notes: string[] = [];

  if (tokens.length < 30) {
    notes.push("Bài quá ngắn để đánh giá tính liên kết.");
    return { score: toDimensionScore(1), notes };
  }

  const lower = sentences.join(" ").toLowerCase();
  const transitionsFound = TRANSITION_WORDS.filter((w) =>
    new RegExp(`\\b${w.replace(/\s+/g, "\\s+")}\\b`).test(lower),
  );

  const pronounCount = tokens.filter((t) => PRONOUNS.includes(t)).length;
  const pronounRatio = pronounCount / tokens.length;

  const avgSentLen =
    sentences.length === 0 ? 0 : tokens.length / sentences.length;

  let score = 3;
  if (transitionsFound.length >= 3) score += 1;
  if (transitionsFound.length === 0) score -= 1;
  if (pronounRatio > 0.25) score -= 1;
  if (avgSentLen >= 8 && avgSentLen <= 22) score += 1;
  if (avgSentLen > 30) score -= 1;
  if (paragraphs.length >= 3 && transitionsFound.length >= 2) score += 1;

  if (transitionsFound.length === 0) {
    notes.push("Thử thêm từ nối (however, therefore, also) để mạch văn rõ hơn.");
  } else {
    notes.push(`Đã dùng ${transitionsFound.length} từ nối — tốt.`);
  }
  if (pronounRatio > 0.25) {
    notes.push("Có nhiều đại từ — hãy kiểm tra xem 'it / they / this' đang chỉ vào đâu.");
  }
  if (avgSentLen > 30) {
    notes.push("Câu trung bình hơi dài; cân nhắc tách câu để dễ theo dõi.");
  }

  return {
    score: toDimensionScore(score) as DimensionScore,
    notes,
  };
}
