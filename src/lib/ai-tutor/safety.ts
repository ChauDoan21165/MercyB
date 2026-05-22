/**
 * PB3 Safety Module — pure safety/privacy guardrails for AI Tutor.
 *
 * Phase B — pure functions only. No I/O, no provider calls, no Supabase,
 * no V5, no persistence, no streaming. All functions are deterministic:
 * same input → same output, every time. Regex/pattern matching only.
 *
 * This module provides input sanitization, output moderation, PII detection,
 * profanity/self-harm/injection detection, logging redaction, and refusal/
 * fallback response selection.
 *
 * AI_TUTOR_ENABLED=false — this module is tree-shaken in production.
 */

import type {
  TutorSafetyKind,
  TutorResponse,
  TutorConversationMode,
  TutorTier,
} from "./types";
import {
  TUTOR_LOG_REDACTION_RULES,
} from "./types";

// ─── Local Types ──────────────────────────────────────────────────────

export type SafetyContext = {
  mode: TutorConversationMode;
  tier: TutorTier;
  isKidsMode: boolean;
};

export type SanitizeResult =
  | { ok: true; cleaned: string }
  | { ok: false; block: TutorSafetyKind; messageVi: string };

export type ModerationResult =
  | { ok: true; response: TutorResponse }
  | { ok: false; block: TutorSafetyKind; replacementVi: string };

export type PiiCheckResult = {
  found: boolean;
  patterns: string[];
};

export type RedactionResult = {
  redacted: string;
  rulesApplied: string[];
};

export type CrisisResult = {
  detected: boolean;
  resourceVi: string;
};

// ─── Pattern Libraries ────────────────────────────────────────────────

const CRISIS_KEYWORDS_VI: RegExp[] = [
  /t[ựư]\s*t[ửư]/i,
  /k[ếế]t\s*th[uú]c\s*cu[ộô]c\s*s[ốô]ng/i,
  /t[ựư]\s*l[àa]m\s*h[ạa]i/i,
  /kh[ôo]ng\s*mu[ốô]n\s*s[ốô]ng/i,
  /v[ôo]\s*v[ọo]ng/i,
  /mu[ốô]n\s*ch[ếế]t/i,
  /k[ếế]t\s*li[ễễ]u/i,
];

const CRISIS_KEYWORDS_EN: RegExp[] = [
  /suicide/i,
  /kill\s*myself/i,
  /end\s*my\s*life/i,
  /want\s*to\s*die/i,
  /self[- ]?harm/i,
  /no\s*reason\s*to\s*live/i,
  /don['’]t\s*want\s*to\s*(?:be|live)/i,
  /going\s*to\s*kill\s*myself/i,
];

const PROMPT_INJECTION_PATTERNS: RegExp[] = [
  /ignore\s*(?:all\s*)?(?:previous|above|prior)\s*instructions/i,
  /you\s*are\s*(?:now|no\s*longer)/i,
  /system\s*prompt/i,
  /pretend\s*(?:you\s*are|to\s*be)/i,
  /act\s*as\s*(?:if|though)\s*you\s*are/i,
  /forget\s*(?:your|the)\s*(?:training|rules|guidelines)/i,
  /new\s*(?:instructions|directive|command)/i,
  /from\s*now\s*on\s*you\s*(?:are|will)/i,
  /your\s*(?:new\s*)?(?:name|identity|role)\s*is/i,
];

const PROFANITY_PATTERNS_VI: RegExp[] = [
  /đ[ụù]/, /đ[ĩỉ]/, /c[ặạ]c/, /l[ồô]n/,
  /v[ãa]i/, /đ[éẹ]o/, /m[ẹe]\s*(?:mày|kiếp)/,
  /ch[ửưở]i/, /t[ụù]c\s*t[ĩỉ]/,
];

const PROFANITY_PATTERNS_EN: RegExp[] = [
  /\bf[u*]ck\b/i, /\bsh[i*]t\b/i, /\b[a@]ss\b/i,
  /\bb[i*]tch\b/i, /\bd[a@]mn\b/i, /\bcrap\b/i,
  /\bp[i*]ss\b/i, /\bc[u*]nt\b/i, /\bd[i*]ck\b/i,
];

const HATE_SPEECH_PATTERNS: RegExp[] = [
  /\bn[i1]gg[ae][r2]\b/i,
  /\bf[a@]gg[o0]t\b/i,
  /\bk[i1]ll\s*(?:yourself|urself)\b/i,
  /\bret[a@]rd\b/i,
];

// ─── Input Sanitization ───────────────────────────────────────────────

/**
 * Sanitize learner input text.
 * Pipeline: truncate → normalize → crisis → injection → PII → URL → profanity → clean.
 * First-match-wins for blocks; lower-priority checks run after strip operations.
 */
export function sanitizeInput(
  text: string,
  context: SafetyContext,
): SanitizeResult {
  // 1. Length check: truncate to 2000 chars
  let cleaned = text.length > 2000 ? text.slice(0, 2000) : text;

  // 2. Unicode normalization
  cleaned = cleaned.normalize("NFC");

  // 3. Self-harm / crisis detection (stops here — highest priority block)
  for (const pattern of CRISIS_KEYWORDS_VI) {
    if (pattern.test(cleaned)) {
      return { ok: false, block: "self_harm", messageVi: getCrisisResource() };
    }
  }
  for (const pattern of CRISIS_KEYWORDS_EN) {
    if (pattern.test(cleaned)) {
      return { ok: false, block: "self_harm", messageVi: getCrisisResource() };
    }
  }

  // 4. Prompt injection detection (stops here)
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(cleaned)) {
      return {
        ok: false,
        block: "prompt_injection",
        messageVi: getRefusalResponse("prompt_injection"),
      };
    }
  }

  // 5. PII detection — strip, don't block
  const piiResult = detectPII(cleaned);
  if (piiResult.found) {
    cleaned = redactText(cleaned).redacted;
  }

  // 6. URL stripping
  cleaned = cleaned.replace(/https?:\/\/[^\s]+/gi, "(liên kết đã xóa)");

  // 7. Profanity / hate speech (stops here)
  for (const pattern of PROFANITY_PATTERNS_VI) {
    if (pattern.test(cleaned)) {
      return {
        ok: false,
        block: "profanity",
        messageVi: getRefusalResponse("profanity"),
      };
    }
  }
  for (const pattern of PROFANITY_PATTERNS_EN) {
    if (pattern.test(cleaned)) {
      return {
        ok: false,
        block: "profanity",
        messageVi: getRefusalResponse("profanity"),
      };
    }
  }
  for (const pattern of HATE_SPEECH_PATTERNS) {
    if (pattern.test(cleaned)) {
      return {
        ok: false,
        block: "hate_speech",
        messageVi: getRefusalResponse("hate_speech"),
      };
    }
  }

  // 8. All checks pass
  return { ok: true, cleaned };
}

// ─── Output Moderation ────────────────────────────────────────────────

/**
 * Moderate Mercy's response before it's shown to the learner.
 * Pipeline: profanity → PII → impersonation → advice → length → clean.
 */
export function moderateOutput(
  response: TutorResponse,
  _context: SafetyContext,
): ModerationResult {
  // Deep-clone to avoid mutating the input
  const r: TutorResponse = {
    vi: response.vi,
    en: response.en ?? undefined,
    correctedSentence: response.correctedSentence ?? undefined,
    enhancedSentence: response.enhancedSentence ?? undefined,
    grammarPoints: response.grammarPoints ? [...response.grammarPoints] : undefined,
    transferErrorNote: response.transferErrorNote ?? undefined,
    detailedExplanation: response.detailedExplanation ?? undefined,
    nextSteps: response.nextSteps ? [...response.nextSteps] : [],
    saveTargets: response.saveTargets ? [...response.saveTargets] : [],
    practiceSentence: response.practiceSentence ?? undefined,
  };

  // 1. Profanity / hate speech in vi or en
  const textToCheck = [r.vi, r.en ?? ""].filter(Boolean);
  for (const text of textToCheck) {
    for (const pattern of PROFANITY_PATTERNS_VI) {
      if (pattern.test(text)) {
        return {
          ok: false,
          block: "profanity",
          replacementVi: getRefusalResponse("profanity"),
        };
      }
    }
    for (const pattern of PROFANITY_PATTERNS_EN) {
      if (pattern.test(text)) {
        return {
          ok: false,
          block: "profanity",
          replacementVi: getRefusalResponse("profanity"),
        };
      }
    }
    for (const pattern of HATE_SPEECH_PATTERNS) {
      if (pattern.test(text)) {
        return {
          ok: false,
          block: "hate_speech",
          replacementVi: getRefusalResponse("hate_speech"),
        };
      }
    }
  }

  // 2. Hallucinated PII — strip from output
  const piiResult = detectPII(r.vi);
  if (piiResult.found) {
    r.vi = redactText(r.vi).redacted;
  }
  if (r.en) {
    const enPii = detectPII(r.en);
    if (enPii.found) {
      r.en = redactText(r.en).redacted;
    }
  }

  // 3. Model impersonation claims
  const impersonationPatterns = [
    /\bI\s*am\s*(?:a\s*)?(?:human|real\s*person)\b/i,
    /\bI(?:'m|\s+am)\s+(?:not\s+(?:an?\s+)?AI|a\s+(?:real\s+)?person)\b/i,
    /I\s+am\s+not\s+(?:an?\s+)?(?:AI|artificial\s+intelligence|language\s+model)/i,
  ];
  for (const pattern of impersonationPatterns) {
    if (pattern.test(r.vi)) {
      return {
        ok: false,
        block: "model_impersonation",
        replacementVi: getRefusalResponse("model_impersonation"),
      };
    }
  }

  // 4. Personal advice detection — append disclaimer
  const advicePatterns = [
    /\b(?:medical|health)\s*advice\b/i,
    /\b(?:you|you\s*should)\s*(?:take|get|try)\s*(?:medication|medicine|drugs?|treatment|aspirin|tylenol|ibuprofen|paracetamol|antibiotics?|pill)/i,
    /\bconsult\s+(?:a|your)\s*doctor\b/i,
    /\blegal\s*advice\b/i,
    /\byou\s*should\s*(?:sue|file|claim)\b/i,
    /\bfinancial\s*advice\b/i,
    /\byou\s*should\s*(?:invest|buy\s*stocks?|trade)\b/i,
  ];
  for (const pattern of advicePatterns) {
    if (pattern.test(r.vi)) {
      const disclaimer =
        "Lưu ý: Mình là gia sư tiếng Anh, không phải chuyên gia y tế / pháp lý / tài chính. " +
        "Lời khuyên trên chỉ mang tính tham khảo.";
      r.detailedExplanation = r.detailedExplanation
        ? `${r.detailedExplanation}\n\n${disclaimer}`
        : disclaimer;
      break; // one disclaimer only
    }
  }

  // 5. Length enforcement
  if (r.vi.length > 3000) {
    // Truncate at last sentence boundary before 3000
    const truncated = r.vi.slice(0, 3000);
    const lastPeriod = Math.max(
      truncated.lastIndexOf(". "),
      truncated.lastIndexOf("! "),
      truncated.lastIndexOf("? "),
    );
    r.vi = lastPeriod > 2000 ? truncated.slice(0, lastPeriod + 1) : truncated.slice(0, 3000) + "…";
  }

  // 6. All checks pass
  return { ok: true, response: r };
}

// ─── PII Detection ────────────────────────────────────────────────────

/**
 * Detect personally identifiable information in text.
 * Returns which patterns were found and whether any PII exists.
 */
export function detectPII(text: string): PiiCheckResult {
  const patterns: string[] = [];
  const checks: Array<{ label: string; regex: RegExp }> = [
    { label: "email", regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
    { label: "phone_vn", regex: /(?:\+84|0)[0-9]{9,10}/g },
    { label: "phone_intl", regex: /[0-9]{3}[-. ][0-9]{3}[-. ][0-9]{4}/g },
    { label: "address", regex: /(?:số|đường|phố|quận|huyện|tp\.?|tỉnh|thành\s*phố)\s+\d+/gi },
  ];

  for (const check of checks) {
    if (check.regex.test(text)) {
      patterns.push(check.label);
    }
  }

  return { found: patterns.length > 0, patterns };
}

// ─── Text Redaction ───────────────────────────────────────────────────

/**
 * Apply TUTOR_LOG_REDACTION_RULES to text before logging.
 * This is the MANDATORY pre-logging step for PB4 and PB5.
 * Never log raw learner text or raw provider output.
 */
export function redactText(text: string): RedactionResult {
  let redacted = text;
  const rulesApplied: string[] = [];

  for (const rule of TUTOR_LOG_REDACTION_RULES) {
    const regex = new RegExp(rule.pattern, "g");
    const before = redacted;
    redacted = redacted.replace(regex, rule.replacement);
    if (redacted !== before) {
      rulesApplied.push(rule.label);
    }
  }

  return { redacted, rulesApplied: [...new Set(rulesApplied)] };
}

// ─── Crisis Detection ─────────────────────────────────────────────────

/**
 * Detect self-harm / suicidal content in text.
 * Does NOT call external services. Returns a static crisis resource message.
 */
export function detectCrisis(text: string): CrisisResult {
  for (const pattern of CRISIS_KEYWORDS_VI) {
    if (pattern.test(text)) {
      return { detected: true, resourceVi: getCrisisResource() };
    }
  }
  for (const pattern of CRISIS_KEYWORDS_EN) {
    if (pattern.test(text)) {
      return { detected: true, resourceVi: getCrisisResource() };
    }
  }
  return { detected: false, resourceVi: "" };
}

// ─── Kids Mode Guard ──────────────────────────────────────────────────

/**
 * Check if kids mode allows AI tutor interaction.
 * Returns false when isKidsMode is true — no AI Tutor calls in kids mode.
 */
export function isKidsModeAllowed(context: SafetyContext): boolean {
  return !context.isKidsMode;
}

// ─── Refusal & Crisis Messages ────────────────────────────────────────

/**
 * Return the Vietnamese refusal message for a given safety kind.
 * All messages are polite, in Vietnamese, and redirect to learning.
 */
export function getRefusalResponse(kind: TutorSafetyKind): string {
  switch (kind) {
    case "profanity":
      return "Mình chỉ có thể giúp bạn học tiếng Anh. Bạn muốn thử một câu khác nhé?";
    case "hate_speech":
      return "Mình ở đây để giúp bạn học tiếng Anh. Hãy cùng tập trung vào việc học nhé.";
    case "self_harm":
      return getCrisisResource();
    case "pii_detected":
      return "Mình thấy có thông tin cá nhân trong câu này. Để an toàn, mình đã ẩn đi. Bạn thử viết lại nhé?";
    case "prompt_injection":
      return "Mình là Mercy, gia sư tiếng Anh của bạn. Mình chỉ có thể giúp bạn học tiếng Anh thôi.";
    case "off_topic":
      return "Câu hỏi này hơi xa chủ đề học tiếng Anh. Bạn muốn hỏi về ngữ pháp, phát âm, hay từ vựng không?";
    case "hallucinated_pii":
      return "Xin lỗi, mình cần thử lại. Bạn gửi lại câu hỏi nhé?";
    case "model_impersonation":
      return "Mình là Mercy — gia sư tiếng Anh, không phải người thật.";
  }
}

/**
 * Return the crisis resource message in Vietnamese.
 * Static string — no external service calls.
 */
export function getCrisisResource(): string {
  return [
    "Mercy là ứng dụng học tiếng Anh và không thể hỗ trợ khủng hoảng.",
    "Nếu bạn đang gặp khó khăn, hãy liên hệ với những nơi có thể giúp bạn:",
    "- Ngày mai Foundation: 09 7626 2828 (hỗ trợ sức khỏe tinh thần tại Việt Nam)",
    "- Samaritans: 116 123 (UK, tiếng Anh)",
    "- Crisis Text Line: nhắn HOME đến 741741 (US, tiếng Anh)",
  ].join("\n");
}

// ─── Public API ───────────────────────────────────────────────────────

export type { TutorSafetyKind };
