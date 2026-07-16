/**
 * EN-language register-error detector (Step 18 full implementation).
 *
 * Detects high-confidence, surface-visible register errors in English text
 * produced by Vietnamese L1 learners, mapped to the 10 patterns in the
 * EN→VN register taxonomy (src/lib/feedback/rule-packs/en-vn-register/taxonomy.ts).
 *
 * ABSTAIN DEFAULT — trust floor principle (C6):
 *   Nine of the ten taxonomy patterns are context-required: whether "can you"
 *   is wrong depends on whether the addressee is a superior, which the
 *   detector does NOT know. A wrong register correction is worse than silence.
 *   Only patterns whose error is unambiguous from surface text alone fire.
 *
 * Currently surface-detectable EN patterns (4 of 10):
 *   • formal_opener_peer_ban — over-formal Vietnamese calques ("I beg to notify",
 *     "Most Respected and Esteemed", "accept my humble greetings")
 *   • toi_self_with_elder — bureaucratic third-person self-reference
 *     ("the undersigned hereby", "this person wishes to", "this humble employee")
 *   • peer_ban_to_elder — casual opener to professional address
 *     ("Hey teacher,", "Hey doctor,")
 *   • apology_with_peer_form_to_superior — clear slang apology
 *     ("my bad")
 *
 * Context-required patterns (ABSTAIN):
 *   missing_a_particle_to_superior, blunt_request_to_superior,
 *   bare_refusal_to_superior, thanks_with_peer_form_to_superior,
 *   favor_request_no_softener, direct_command_to_elder
 *
 * ── WIRING SPEC for Sửa câu explanation panel (A1) ─────────────────────────
 *
 * When the correction engine has already produced a corrected sentence and the
 * caller wants to show a register-layer explanation in the Sửa câu panel:
 *
 *   1. Call `detectRegisterError({ learnerText: rawLearnerInput })` AFTER the
 *      correction engine has confirmed the sentence is wrong.
 *   2. If `result.matched === true`:
 *      - Show `result.explanationVi` as the primary explanation block (it is
 *        specific, Vietnamese-first, and generated from the taxonomy — never generic).
 *      - Show `result.explanationEn` as a secondary teaching note (English).
 *      - Tag the display with `result.tag` for telemetry (same namespace as the
 *        existing L1 weakness tags — prefix `en_l1_register_`).
 *   3. If `result.matched === false` (ABSTAIN):
 *      - Fall through to the existing grammar-feedback pipeline; do NOT show a
 *        generic "register error" message.
 *   4. `detectRegisterError` is < 1 ms synchronous — safe to call inline.
 *
 * Telemetry: emit the `tag` as a `register_correction_shown` event so the
 * team can measure how often each pattern fires in prod.
 *
 * ── End wiring spec ─────────────────────────────────────────────────────────
 */

import { REGISTER_TAXONOMY } from './rule-packs/en-vn-register/taxonomy.js';
import type { RegisterPattern } from './rule-packs/en-vn-register/taxonomy.js';

export type RegisterDetectionInput = {
  learnerText: string;
};

export type RegisterScenario =
  | 'professional_request'
  | 'instruction'
  | 'professional_apology'
  | 'professional_refusal'
  | 'casual_refusal';

export type RegisterDetectionWithContextInput = {
  learnerText: string;
  expectedText?: string;
  scenario: RegisterScenario;
};

export type RegisterDetectionResult =
  | {
      matched: true;
      /** Maps to RegisterPattern.id in taxonomy.ts */
      patternId: string;
      /** Detection tag — en_l1_register_ namespace */
      tag: string;
      /** Specific Vietnamese-first explanation from the taxonomy entry */
      explanationVi: string;
      /** English teaching note from the taxonomy entry */
      explanationEn: string;
    }
  | { matched: false };

// ── Surface-detectable signal sets ───────────────────────────────────────────

/**
 * Over-formal calque signals — formal_opener_peer_ban.
 *
 * Vietnamese formal writing stacks respectful particles and formulaic deference
 * phrases. Learners calque these directly into English, producing over-formal
 * opening sequences that never occur in standard EN business writing.
 *
 * Guard: each regex is anchored or phrase-specific to minimise FP on legitimate
 * English sentences that happen to share surface words.
 */
const OVER_FORMAL_CALQUE_SIGNALS = [
  // "I beg to notify/inform/advise/report/draw your attention" — very high confidence
  /\bi\s+beg\s+to\s+(?:notify|inform|advise|report|draw\s+your\s+attention)\b/i,
  // "Most Respected and Esteemed" / "Most Honoured" — stacked deference
  /\bmost\s+(?:honoured|honored|respected)\s+and\s+(?:esteemed|valued|dear)\b/i,
  // "accept my humble greetings/respects/regards"
  /\baccept\s+my\s+humble\s+(?:greetings|respects|regards)\b/i,
  // "Respectfully and humbly" as opening
  /^respectfully\s+and\s+humbly\b/i,
  // "humbly request/submit/notify/inform" — formulaic deference verb
  /\bhumbly\s+(?:request|submit|notify|inform|beg)\b/i,
];

/**
 * Third-person self-reference signals — toi_self_with_elder.
 *
 * Vietnamese formal prose uses distancing self-reference ("kẻ dưới", "người này",
 * "nhân viên này"). Learners calque these as "the undersigned", "this person",
 * "this humble employee" — all wrong in modern English where direct "I" is standard.
 */
const THIRD_PERSON_SELF_SIGNALS = [
  // "the undersigned hereby/would like/wishes/requests" — bureaucratic self
  /\bthe\s+undersigned\s+(?:hereby|would\s+like|wishes|requests|submits)\b/i,
  // "this person (would like|wishes|hereby|wants|is writing)" — third-person self
  /\bthis\s+person\s+(?:would\s+like|wishes|hereby|wants|is\s+writing)\b/i,
  // "this humble (employee|worker|student|person|staff member)" — self-deprecating self
  /\bthis\s+humble\s+(?:employee|worker|student|person|staff)\b/i,
  // "it is this humble …" — distancing third-person opening
  /\bit\s+is\s+this\s+humble\b/i,
];

/**
 * Casual opener to professional address — peer_ban_to_elder.
 *
 * Vietnamese learners transfer the casual peer-opener "bạn ơi" or "ơi" as
 * "Hey" before a professional title. "Hey teacher" / "Hey doctor" is always
 * a register mismatch in English when addressing a professional.
 *
 * Anchored to sentence start to avoid firing on mid-sentence use ("I said 'hey'").
 */
const CASUAL_OPENER_PROFESSIONAL = /^(?:hey|yo)\s+(?:teacher|professor|dr\.?\s*|doctor|prof\.?\s*|headmaster|principal|sir\b|madam\b|ma'am\b)/i;

/**
 * Slang apology — apology_with_peer_form_to_superior.
 *
 * "My bad" is clear colloquial slang with no formal equivalent. In any context
 * where a correction engine has flagged text for improvement, "my bad" is a
 * surface-detectable register error (the learner has directly calqued informal
 * spoken Vietnamese apology style into professional English).
 */
const SLANG_APOLOGY = /\bmy\s+bad\b/i;

const DIRECT_REQUEST_TRANSFER = /^\s*(?:you\s+(?:send|give|bring|tell|call|email|show|help|check|make|finish|open|close)|give\s+me|send\s+me)\b/i;
const POLITE_REQUEST_FORMULA = /\b(?:could|would)\s+you\b|\bplease\b|\bwould\s+you\s+mind\b|\bcan\s+you\s+please\b/i;
const APOLOGY_START = /^\s*(?:i['’]?\s*m\s+sorry|sorry|apologies|my\s+apologies)\b/i;
const EXPLANATION_BEFORE_APOLOGY = /\b(?:traffic|train|bus|weather|because|so|therefore|late|delayed)\b/i;
const BARE_REFUSAL = /^\s*(?:no\b|i\s+(?:do\s+not|don['’]?t)\s+(?:go|come|join|attend|help|do)|i\s+can['’]?t\b|cannot\b)/i;
const SOFT_REFUSAL_FORMULA = /\b(?:thanks?|thank\s+you|unfortunately|i\s+appreciate|i\s+wish\s+i\s+could|but\s+i\s+can['’]?t|i\s+can['’]?t\s+this)\b/i;

// ── Lookup table ────────────────────────────────────────────────────────────

/**
 * Detection entry: a signal set + the taxonomy pattern it maps to.
 * Ordered from highest confidence to lowest (first match wins).
 */
type DetectionEntry = {
  signals: readonly RegExp[];
  patternId: string;
};

const DETECTION_ENTRIES: DetectionEntry[] = [
  { signals: OVER_FORMAL_CALQUE_SIGNALS,   patternId: 'formal_opener_peer_ban' },
  { signals: THIRD_PERSON_SELF_SIGNALS,    patternId: 'toi_self_with_elder' },
  { signals: [CASUAL_OPENER_PROFESSIONAL], patternId: 'peer_ban_to_elder' },
  { signals: [SLANG_APOLOGY],              patternId: 'apology_with_peer_form_to_superior' },
];

// Taxonomy pattern map (computed once on first use, lazy init)
let _taxonomyMap: Map<string, RegisterPattern> | null = null;
function getTaxonomyPattern(id: string): RegisterPattern | undefined {
  if (!_taxonomyMap) {
    _taxonomyMap = new Map(REGISTER_TAXONOMY.map((p) => [p.id, p]));
  }
  return _taxonomyMap.get(id);
}

function makeContextMatch(
  patternId: string,
  tag: string,
  explanationVi: string,
  explanationEn: string,
): RegisterDetectionResult {
  return {
    matched: true,
    patternId,
    tag,
    explanationVi,
    explanationEn,
  };
}

// ── Public API ───────────────────────────────────────────────────────────────

/**
 * Detect high-confidence register errors in English learner text.
 *
 * Returns `matched: false` (ABSTAIN) unless a surface signal is present that is
 * unambiguous regardless of addressee context. The caller MUST NOT show any
 * register feedback on `matched: false` — do not substitute a generic message.
 *
 * Perf: synchronous, < 1 ms. Safe to call inline in the correction pipeline.
 *
 * See the WIRING SPEC comment at the top of this file for integration guidance.
 */
export function detectRegisterError(
  input: RegisterDetectionInput,
): RegisterDetectionResult {
  const { learnerText } = input;

  for (const { signals, patternId } of DETECTION_ENTRIES) {
    for (const signal of signals) {
      if (signal.test(learnerText)) {
        const pattern = getTaxonomyPattern(patternId);
        if (!pattern) continue;
        return {
          matched: true,
          patternId,
          tag: pattern.tag,
          explanationVi: pattern.descriptionVi,
          explanationEn: pattern.descriptionEn,
        };
      }
    }
  }

  return { matched: false };
}

/**
 * Context-aware register detector for cases where the caller already knows the
 * scenario/addressee contract. This deliberately does not broaden
 * detectRegisterError(): context-free direct requests/refusals still abstain.
 */
export function detectRegisterErrorWithContext(
  input: RegisterDetectionWithContextInput,
): RegisterDetectionResult {
  const learnerText = input.learnerText.trim();
  const expectedText = input.expectedText?.trim() ?? '';

  const surfaceOnly = detectRegisterError({ learnerText });
  if (surfaceOnly.matched) return surfaceOnly;

  if (
    input.scenario === 'professional_request' &&
    DIRECT_REQUEST_TRANSFER.test(learnerText) &&
    POLITE_REQUEST_FORMULA.test(expectedText)
  ) {
    return makeContextMatch(
      'direct_request_transfer',
      'en_l1_register_direct_request_transfer',
      'Trong bối cảnh công việc, câu yêu cầu trực tiếp kiểu "You send me..." nghe như ra lệnh. Dùng "Could you..." hoặc "Would you..." để mềm hơn.',
      'In a professional request, a bare command like "You send me..." sounds like an order. Use a soft request form such as "Could you..." or "Would you...".',
    );
  }

  if (
    input.scenario === 'professional_apology' &&
    !APOLOGY_START.test(learnerText) &&
    APOLOGY_START.test(expectedText) &&
    EXPLANATION_BEFORE_APOLOGY.test(learnerText)
  ) {
    return makeContextMatch(
      'apology_explanation_before_responsibility',
      'en_l1_register_apology_explanation_order',
      'Trong email hoặc lời xin lỗi công việc, nhận trách nhiệm trước rồi mới giải thích lý do. Mở đầu bằng "Sorry/Apologies" trước phần lý do.',
      'In a professional apology, take responsibility first and then explain. Start with "Sorry/Apologies" before the reason.',
    );
  }

  if (
    input.scenario === 'professional_refusal' &&
    BARE_REFUSAL.test(learnerText) &&
    SOFT_REFUSAL_FORMULA.test(expectedText)
  ) {
    return makeContextMatch(
      'refusal_softening_gap',
      'en_l1_register_refusal_softening_gap',
      'Khi từ chối trong bối cảnh công việc, đừng chỉ nói "No". Thêm lời cảm ơn hoặc lý do ngắn để câu nghe lịch sự hơn.',
      'In a professional refusal, do not answer with a bare "No." Add thanks, a brief reason, or a softener.',
    );
  }

  return { matched: false };
}
