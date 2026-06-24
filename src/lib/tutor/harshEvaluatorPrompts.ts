/**
 * Final Harsh Evaluator Prompts — Step 112
 *
 * LLM-as-judge prompt templates that evaluate Teacher Mercy's tutoring output
 * against harsh human-teacher standards. These are the FINAL evaluation prompts
 * — the strictest, most unforgiving prompts that can be used to grade every
 * tutor response across all 6 teacher intelligence dimensions.
 *
 * These prompts are designed to be sent to an LLM (Claude, GPT-4, etc.) as the
 * system prompt for a harsh evaluation pass. They embody the question:
 *
 *   "Would a strong, experienced human teacher accept this response?"
 *
 * If the answer is no, the prompt demands specific, actionable critique.
 *
 * Architecture:
 *   - 6 per-dimension evaluator prompts (one per intelligence dimension)
 *   - 1 unified composite evaluator prompt (all 6 dimensions at once)
 *   - 6 adversarial evaluator prompts (devil's advocate, looking for failure)
 *   - 1 scenario-anchored evaluator prompt builder
 *   - Utility functions for harshness calibration, catalog access, and ID lookup
 *
 * All prompt builders are pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first in all evaluator instructions and output schemas.
 *
 * Integrates with:
 *   - teacherMercyContract (R1-R10) — contract rules inform evaluation criteria
 *   - teacherMercyRubric — rubric dimensions map to harshness thresholds
 *   - tutorFailureTaxonomy — known failure patterns the evaluator should watch for
 *   - realProductProofGate — proof sub-gates inform composite evaluation
 *   - humanQualityScenarioBank — scenarios provide evaluation context
 *   - overclaimGuard (O1-O8) — overclaim patterns the evaluator must flag
 *   - teacherMercySelfAuditGate (S1-S8) — self-audit gates inform harshness
 *
 * Key APIs:
 *   buildDiagnosisEvaluatorPrompt(input)       — evaluate diagnosis quality
 *   buildTeachingEvaluatorPrompt(input)         — evaluate teaching quality
 *   buildMemoryEvaluatorPrompt(input)           — evaluate memory/recall quality
 *   buildAdaptationEvaluatorPrompt(input)       — evaluate adaptation quality
 *   buildSelfCheckEvaluatorPrompt(input)        — evaluate self-check quality
 *   buildLearningGainEvaluatorPrompt(input)     — evaluate learning gain proof
 *   buildCompositeEvaluatorPrompt(input)        — unified 6-dimension evaluation
 *   buildAdversarialEvaluatorPrompt(input, dim) — devil's advocate perspective
 *   buildScenarioAnchoredEvaluatorPrompt(input) — scenario-benchmarked evaluation
 *   getHarshnessConfig(level)                   — harshness calibration params
 *   getEvaluatorPromptCatalog()                 — full catalog of evaluator prompts
 *   getEvaluatorPromptById(id)                  — single prompt by ID
 */

import type { ContractRuleId } from "./teacherMercyContract";
import type { RubricDimensionId } from "./teacherMercyRubric";
import type { TeacherIntelligenceDimensionId } from "./teacherIntelligenceDashboard";

// ─── Harsh Evaluator Types ────────────────────────────────────────────────────

/** The 6 teacher intelligence dimensions (canonical from dashboard) */
export type HarshEvaluatorDimension = TeacherIntelligenceDimensionId;

/** Harshness calibration levels */
export type HarshnessLevel = "strict" | "harsh" | "merciless";

/** The role the evaluator prompt plays */
export type EvaluatorPromptRole = "judge" | "adversary" | "benchmark";

/** Context about the learner for the evaluator */
export interface EvaluatorLearnerContext {
  /** Learner's CEFR level (A1, A2, B1, B2, C1, C2, or null if unknown) */
  cefrLevel: string | null;
  /** Learner's native language (default "vi") */
  l1: string;
  /** Known weakness patterns this learner has */
  knownWeaknesses: string[];
  /** Whether this is a kids-mode session */
  isKidsMode: boolean;
  /** Session number (1-indexed) */
  sessionNumber: number;
}

/** The tutor response being evaluated */
export interface EvaluatorTutorResponse {
  /** Vietnamese commentary/explanation — the primary response */
  vi: string;
  /** English reference text (optional) */
  en?: string;
  /** Corrected version of learner's sentence (if applicable) */
  correctedSentence?: string;
  /** Grammar points the tutor addressed */
  grammarPoints?: string[];
  /** Vietnamese L1 transfer-error explanation */
  transferErrorNote?: string;
  /** The tutor's action for this turn */
  action?: string;
}

/** The full input for building a harsh evaluator prompt */
export interface HarshEvaluatorInput {
  /** The learner's original text that the tutor is responding to */
  learnerText: string;
  /** The tutor's response to evaluate */
  tutorResponse: EvaluatorTutorResponse;
  /** Context about the learner */
  learnerContext: EvaluatorLearnerContext;
  /** Previous tutor turns (for context on repetition, memory, etc.) */
  previousTurns?: string[];
  /** Known contract rule violations from automated checks */
  knownViolations?: ContractRuleId[];
  /** The harshness level to apply */
  harshness: HarshnessLevel;
  /** Optional: a reference scenario ID from the human quality bank */
  referenceScenarioId?: string;
  /** Optional: session transcript turns for multi-turn context */
  transcriptTurns?: Array<{ role: "learner" | "tutor"; text: string }>;
}

/** Structured evaluation output schema the prompt asks the LLM to produce */
export interface HarshEvaluationOutputSchema {
  /** Overall verdict */
  verdict: "PASS" | "FAIL" | "BORDERLINE";
  /** Overall score 0–100 */
  score: number;
  /** Per-dimension scores (only dimensions evaluated) */
  dimensionScores: Partial<Record<HarshEvaluatorDimension, number>>;
  /** Specific failures found */
  failures: HarshEvaluationFailure[];
  /** What the tutor did well (if anything) */
  strengths: string[];
  /** Concrete improvement actions */
  improvements: string[];
  /** Whether this response should be shown to a learner as-is */
  showToLearner: boolean;
  /** Vietnamese summary of the evaluation */
  summaryVi: string;
}

/** A single failure found by the harsh evaluator */
export interface HarshEvaluationFailure {
  /** Which dimension this failure belongs to */
  dimension: HarshEvaluatorDimension;
  /** Failure severity */
  severity: "critical" | "major" | "minor";
  /** Vietnamese description of the failure */
  descriptionVi: string;
  /** Which contract rule(s) were violated */
  violatedRules: ContractRuleId[];
  /** Specific quote from the tutor response that's problematic */
  evidenceQuote: string;
}

/** Harshness calibration parameters */
export interface HarshnessConfig {
  level: HarshnessLevel;
  /** Minimum score to pass (0–100) */
  passThreshold: number;
  /** Minimum score for borderline */
  borderlineThreshold: number;
  /** Whether to require all dimensions to pass individually */
  requireAllDimensions: boolean;
  /** Minimum per-dimension score */
  minDimensionScore: number;
  /** Whether to penalize missing contract rules */
  penalizeMissingRules: boolean;
  /** Maximum allowed failures before auto-FAIL */
  maxFailures: number;
  /** Description of this harshness level in Vietnamese */
  descriptionVi: string;
}

/** A catalog entry for an evaluator prompt */
export interface EvaluatorPromptCatalogEntry {
  /** Unique prompt ID */
  id: string;
  /** Which dimension this prompt evaluates (or "composite") */
  dimension: HarshEvaluatorDimension | "composite";
  /** The evaluator role */
  role: EvaluatorPromptRole;
  /** Vietnamese title */
  titleVi: string;
  /** English title */
  titleEn: string;
  /** Vietnamese description of what this prompt evaluates */
  descriptionVi: string;
  /** Which harshness levels this prompt supports */
  supportedLevels: HarshnessLevel[];
}

// ─── Harshness Calibration ────────────────────────────────────────────────────

const HARSHNESS_CONFIGS: Record<HarshnessLevel, HarshnessConfig> = {
  strict: {
    level: "strict",
    passThreshold: 70,
    borderlineThreshold: 55,
    requireAllDimensions: false,
    minDimensionScore: 50,
    penalizeMissingRules: true,
    maxFailures: 3,
    descriptionVi:
      "Nghiêm khắc — như một giáo viên kỳ cựu chấm bài. Yêu cầu cơ bản phải đúng, phát hiện lỗi rõ ràng.",
  },
  harsh: {
    level: "harsh",
    passThreshold: 80,
    borderlineThreshold: 65,
    requireAllDimensions: true,
    minDimensionScore: 60,
    penalizeMissingRules: true,
    maxFailures: 1,
    descriptionVi:
      "Khắt khe — như một giám khảo chấm thi. Từng lỗi nhỏ đều bị trừ điểm, không có chỗ cho sự tầm thường.",
  },
  merciless: {
    level: "merciless",
    passThreshold: 90,
    borderlineThreshold: 80,
    requireAllDimensions: true,
    minDimensionScore: 75,
    penalizeMissingRules: true,
    maxFailures: 0,
    descriptionVi:
      "Tàn nhẫn — như một phản biện gia. Mọi sai sót đều là thất bại. Chỉ có sự xuất sắc mới được chấp nhận.",
  },
};

/**
 * Get the harshness calibration configuration for a given level.
 * Pure function — deterministic, no side effects.
 */
export function getHarshnessConfig(level: HarshnessLevel): HarshnessConfig {
  return { ...HARSHNESS_CONFIGS[level] };
}

// ─── Contract Rule Reference for Prompts ──────────────────────────────────────

const CONTRACT_RULE_VI: Record<ContractRuleId, string> = {
  R1_MEANING_FIRST: "R1 — Công nhận ý nghĩa trước khi sửa lỗi",
  R2_ONE_CORRECTION_MAX: "R2 — Tối đa một lần sửa lỗi mỗi lượt",
  R3_NO_FAKE_PRAISE: "R3 — Không khen giả tạo",
  R4_ONE_FOLLOW_UP: "R4 — Tối đa một câu hỏi tiếp nối",
  R5_REMEMBER_WEAKNESS: "R5 — Ghi nhớ điểm yếu người học",
  R6_VIETNAMESE_INTERFERENCE: "R6 — Giải thích can thiệp tiếng Việt",
  R7_STRATEGIC_SILENCE: "R7 — Im lặng chiến lược khi không chắc",
  R8_FACE_SAVING: "R8 — Giữ thể diện cho người học",
  R9_SELF_CORRECTION_SPACE: "R9 — Cho không gian tự sửa lỗi",
  R10_NEXT_PRACTICE_WHEN_HELPFUL: "R10 — Gợi ý bài tập tiếp theo khi hữu ích",
};

const DIMENSION_LABEL_VI: Record<HarshEvaluatorDimension, string> = {
  diagnosis: "Chẩn đoán",
  teaching: "Giảng dạy",
  memory: "Ghi nhớ",
  adaptation: "Thích ứng",
  selfCheck: "Tự kiểm",
  learningGain: "Tiến bộ",
};

const DIMENSION_LABEL_EN: Record<HarshEvaluatorDimension, string> = {
  diagnosis: "Diagnosis",
  teaching: "Teaching",
  memory: "Memory",
  adaptation: "Adaptation",
  selfCheck: "Self-Check",
  learningGain: "Learning Gain",
};

// ─── Shared Prompt Sections ───────────────────────────────────────────────────

/**
 * Build the evaluator persona section — who the LLM is acting as.
 */
function buildEvaluatorPersona(level: HarshnessLevel, role: EvaluatorPromptRole): string {
  const harshnessDesc = HARSHNESS_CONFIGS[level].descriptionVi;

  const basePersona = [
    "Bạn là một GIÁM KHẢO ĐÁNH GIÁ GIÁO VIÊN — một chuyên gia sư phạm tiếng Anh",
    "có hơn 20 năm kinh nghiệm dạy người Việt học tiếng Anh.",
    "",
    "Nhiệm vụ của bạn: ĐÁNH GIÁ NGHIÊM KHẮC câu trả lời của một AI tutor (Teacher Mercy)",
    "cho người học tiếng Anh người Việt. Bạn phải tìm ra MỌI LỖI SAI, MỌI THIẾU SÓT,",
    "và MỌI CƠ HỘI BỊ BỎ LỠ trong câu trả lời.",
    "",
    `Mức độ nghiêm khắc: ${harshnessDesc}`,
    "",
    "Nguyên tắc đánh giá của bạn:",
    "1. KHÔNG khoan nhượng — lỗi nhỏ cũng là lỗi.",
    "2. KHÔNG đoán mò — chỉ đánh giá dựa trên bằng chứng trong câu trả lời.",
    "3. KHÔNG thiên vị — AI tutor không được ưu ái hơn giáo viên thật.",
    "4. LUÔNG đưa ra dẫn chứng cụ thể — trích dẫn nguyên văn câu trả lời.",
    "5. LUÔNG đề xuất cách sửa — không chỉ trích mà không chỉ ra cách làm tốt hơn.",
  ];

  if (role === "adversary") {
    basePersona.push(
      "",
      "VAI TRÒ ĐẶC BIỆT — PHẢN BIỆN GIA:",
      "Bạn đóng vai trò PHẢN BIỆN. Nhiệm vụ của bạn là CHỨNG MINH câu trả lời này TỆ.",
      "Hãy giả định câu trả lời này SAI cho đến khi bạn tìm được bằng chứng nó ĐÚNG.",
      "Bạn được PHÉP nghi ngờ mọi thứ. Bạn phải ĐÀO SÂU vào từng từ, từng câu.",
      "Nếu bạn KHÔNG tìm thấy lỗi nào sau khi kiểm tra kỹ lưỡng, hãy nói rõ điều đó —",
      "nhưng chỉ sau khi bạn đã THỰC SỰ cố gắng tìm lỗi.",
    );
  }

  return basePersona.join("\n");
}

/**
 * Build the evaluation criteria section shared across dimension prompts.
 */
function buildSharedEvaluationCriteria(harshness: HarshnessLevel): string {
  const config = HARSHNESS_CONFIGS[harshness];
  return [
    "TIÊU CHUẨN ĐÁNH GIÁ CHUNG:",
    `- Ngưỡng đậu: ${config.passThreshold}/100`,
    `- Ngưỡng borderline: ${config.borderlineThreshold}/100`,
    `- Điểm tối thiểu mỗi chiều: ${config.minDimensionScore}/100`,
    `- Số lỗi tối đa cho phép: ${config.maxFailures}`,
    `- Yêu cầu tất cả các chiều đạt: ${config.requireAllDimensions ? "CÓ" : "KHÔNG"}`,
    "",
    "Các quy tắc hợp đồng giáo viên (R1-R10) phải được tuân thủ:",
    ...Object.entries(CONTRACT_RULE_VI).map(([id, desc]) => `  - ${desc}`),
    "",
    "Các hành vi bị CẤM TUYỆT ĐỐI:",
    "- Khen giả tạo (R3) — 'very good' khi câu sai, khen khi không có gì để khen.",
    "- Bịa thống kê (O2) — '90% learners', 'research shows', số liệu không nguồn.",
    "- Cam kết quá mức (O3) — 'you'll never make this mistake again', bảo đảm kết quả.",
    "- Đọc suy nghĩ (O4) — 'bạn đang bối rối', 'you're thinking', suy diễn nội tâm.",
    "- Tự nhận là chuyên gia tuyệt đối (O8) — 'cô biết chắc', 'tin cô đi'.",
    "- Sửa quá nhiều lỗi cùng lúc (R2) — quá 1 lỗi/lượt làm người học quá tải.",
    "- Hỏi quá nhiều câu cùng lúc (R4) — quá 1 câu hỏi/lượt làm người học rối.",
    "- Không công nhận ý nghĩa trước khi sửa (R1) — sửa ngay mà không hiểu ý.",
    "- Giải thích dài dòng cho lỗi đơn giản — quá 3 câu giải thích cho 1 lỗi A1.",
    "- Bỏ qua can thiệp tiếng Việt khi nó là nguyên nhân gốc rễ (R6).",
  ].join("\n");
}

/**
 * Build the output format instructions — what structured output the LLM must produce.
 */
function buildOutputFormatInstructions(dimensions: HarshEvaluatorDimension[]): string {
  const dimList = dimensions
    .map((d) => `  - ${DIMENSION_LABEL_VI[d]} (${d}): 0–100`)
    .join("\n");

  return [
    "ĐỊNH DẠNG KẾT QUẢ ĐÁNH GIÁ (phải tuân thủ NGHIÊM NGẶT):",
    "",
    "Trả về kết quả theo cấu trúc SAU ĐÂY (dùng tiếng Việt cho tất cả mô tả):",
    "",
    "```",
    "KẾT LUẬN: PASS | FAIL | BORDERLINE",
    "ĐIỂM TỔNG: <0-100>",
    "",
    "ĐIỂM TỪNG CHIỀU:",
    dimList,
    "",
    "LỖI TÌM THẤY:",
    "  (nếu không có lỗi, ghi: KHÔNG CÓ LỖI NÀO)",
    "  - [mức_độ: critical|major|minor] [chiều: ...] [quy_tắc_vi_phạm: R1-R10]",
    "    Mô tả: <mô tả lỗi bằng tiếng Việt>",
    "    Dẫn chứng: \"<trích dẫn nguyên văn từ câu trả lời>\"",
    "",
    "ĐIỂM MẠNH (nếu có):",
    "  - <điểm mạnh>",
    "",
    "CẢI THIỆN CỤ THỂ:",
    "  - <hành động cải thiện cụ thể>",
    "",
    "HIỂN THỊ CHO NGƯỜI HỌC: CÓ | KHÔNG",
    "",
    "TÓM TẮT TIẾNG VIỆT:",
    "  <2-3 câu tóm tắt đánh giá bằng tiếng Việt>",
    "```",
  ].join("\n");
}

// ─── Per-Dimension Prompt Sections ─────────────────────────────────────────────

/**
 * Build the diagnosis-specific evaluation criteria.
 * Harsh focus: Did the tutor correctly identify the learner's error(s)?
 * Did they miss any errors? Did they over-diagnose?
 */
function buildDiagnosisCriteria(harshness: HarshnessLevel): string {
  const config = HARSHNESS_CONFIGS[harshness];
  return [
    "TIÊU CHÍ ĐÁNH GIÁ CHẨN ĐOÁN:",
    "",
    "1. PHÁT HIỆN LỖI (quan trọng nhất):",
    "   - Tutor có phát hiện ĐÚNG lỗi của người học không?",
    "   - Có BỎ SÓT lỗi nào trong câu của người học không?",
    "   - Nếu câu có NHIỀU lỗi, tutor có chọn ĐÚNG lỗi quan trọng nhất để sửa không?",
    `   - Điểm tối thiểu để qua: ${config.minDimensionScore}/100`,
    "",
    "2. PHÂN LOẠI LỖI:",
    "   - Tutor có phân loại đúng loại lỗi (ngữ pháp, từ vựng, phát âm, can thiệp L1)?",
    "   - Có NHẦM LẪN giữa lỗi ngữ pháp và lỗi can thiệp tiếng Việt không?",
    "",
    "3. NGUYÊN NHÂN GỐC RỄ:",
    "   - Nếu lỗi xuất phát từ can thiệp tiếng Việt, tutor có NHẬN RA không?",
    "   - Tutor có giải thích TẠI SAO người Việt mắc lỗi này không (R6)?",
    "",
    "4. CHẨN ĐOÁN QUÁ MỨC (OVER-DIAGNOSIS):",
    "   - Tutor có SỬA CÂU ĐÚNG thành sai không? (lỗi NGHIÊM TRỌNG NHẤT)",
    "   - Tutor có thêm lỗi không tồn tại không?",
    "   - Tutor có áp dụng quy tắc SAI ngữ cảnh không?",
    "",
    "5. ĐỘ CHÍNH XÁC CỦA CÂU SỬA:",
    "   - Câu sửa lại có ĐÚNG 100% về ngữ pháp không?",
    "   - Câu sửa có GIỮ NGUYÊN Ý của người học không?",
    "   - Câu sửa có TỰ NHIÊN với trình độ của người học không?",
    "",
    "ĐẶC BIỆT CHÚ Ý — lỗi chẩn đoán người Việt thường gặp:",
    "- Thiếu động từ to-be (copula omission): 'She beautiful' → cần phát hiện.",
    "- Thiếu mạo từ (article omission): 'I go to store' → cần phát hiện.",
    "- Sai thì (tense): 'Yesterday I go' → cần phát hiện.",
    "- Sai giới từ (preposition mapping VN→EN): 'I wait you' → cần phát hiện.",
    "- Thiếu -s/-es (3rd person singular): 'He work hard' → cần phát hiện.",
    "- Câu hỏi thiếu trợ động từ: 'Where you go?' → cần phát hiện.",
  ].join("\n");
}

/**
 * Build the teaching-specific evaluation criteria.
 * Harsh focus: Was the teaching effective? Did the tutor explain clearly?
 * Was the explanation level-appropriate? Was meaning acknowledged first?
 */
function buildTeachingCriteria(harshness: HarshnessLevel): string {
  const config = HARSHNESS_CONFIGS[harshness];
  return [
    "TIÊU CHÍ ĐÁNH GIÁ GIẢNG DẠY:",
    "",
    "1. CÔNG NHẬN Ý NGHĨA TRƯỚC (R1 — quan trọng nhất):",
    "   - Tutor có THỂ HIỆN đã hiểu ý người học muốn nói gì không?",
    "   - Có cụm từ nào như 'ý bạn là', 'mình hiểu bạn muốn nói' không?",
    "   - Việc công nhận ý nghĩa có XUẤT HIỆN TRƯỚC khi sửa lỗi không?",
    `   - Điểm tối thiểu để qua: ${config.minDimensionScore}/100`,
    "",
    "2. CHẤT LƯỢNG GIẢI THÍCH:",
    "   - Giải thích có RÕ RÀNG không? Người học trình độ này có hiểu được không?",
    "   - Giải thích có QUÁ DÀI không? (quá 3 câu cho 1 lỗi A1/A2 = trừ điểm)",
    "   - Giải thích có DÙNG THUẬT NGỮ phù hợp trình độ không?",
    "   - Có ví dụ CỤ THỂ không? Hay chỉ nói lý thuyết suông?",
    "",
    "3. MỘT LỖI MỘT LƯỢT (R2):",
    "   - Tutor có CHỈ SỬA MỘT LỖI không?",
    "   - Nếu câu có nhiều lỗi, tutor có CHỌN ĐÚNG lỗi ưu tiên không?",
    "",
    "4. GIỮ THỂ DIỆN (R8):",
    "   - Cách sửa có làm người học XẤU HỔ không?",
    "   - Có dùng ngôn ngữ TÍCH CỰC, khích lệ thật sự không?",
    "   - Có câu nào như 'câu này dùng tự nhiên hơn là...' thay vì 'bạn sai' không?",
    "",
    "5. KHÔNG GIAN TỰ SỬA (R9):",
    "   - Tutor có CHO CƠ HỘI để người học tự sửa trước khi đưa đáp án không?",
    "   - Với lỗi đơn giản (A1/A2), tutor có gợi ý để người học tự tìm ra không?",
    "",
    "ĐẶC BIỆT CHÚ Ý — lỗi giảng dạy thường gặp:",
    "- Giải thích bằng tiếng Anh cho người A1/A2 (họ KHÔNG HIỂU).",
    "- Dùng thuật ngữ ngữ pháp phức tạp với người mới học.",
    "- Đưa đáp án ngay mà không để người học thử.",
    "- Giải thích lan man, không vào trọng tâm.",
    "- So sánh với tiếng Việt SAI (gây hiểu lầm thêm).",
  ].join("\n");
}

/**
 * Build the memory-specific evaluation criteria.
 * Harsh focus: Does the tutor remember and use past interactions?
 */
function buildMemoryCriteria(harshness: HarshnessLevel): string {
  const config = HARSHNESS_CONFIGS[harshness];
  return [
    "TIÊU CHÍ ĐÁNH GIÁ GHI NHỚ:",
    "",
    "1. NHỚ ĐIỂM YẾU (R5):",
    "   - Tutor có THAM CHIẾU đến điểm yếu đã biết của người học không?",
    "   - Nếu người học có lỗi lặp lại, tutor có NHẬN RA đó là pattern không?",
    `   - Điểm tối thiểu để qua: ${config.minDimensionScore}/100`,
    "",
    "2. LIÊN KẾT XUYÊN BUỔI:",
    "   - Tutor có nhắc đến điều đã học ở buổi trước không?",
    "   - Có xây dựng trên kiến thức cũ không? Hay mỗi buổi như buổi đầu?",
    "",
    "3. TRÁNH LẶP LẠI VÔ ÍCH:",
    "   - Tutor có lặp lại chính mình từ các lượt trước không?",
    "   - Tutor có lặp lại giải thích mà người học đã hiểu không?",
    "   - Tutor có hỏi lại câu đã hỏi không?",
    "",
    "4. NHẬN DIỆN PATTERN:",
    "   - Nếu người học mắc lỗi cùng loại, tutor có CHỈ RA pattern không?",
    "   - Tutor có kết nối các lỗi rời rạc thành một điểm yếu hệ thống không?",
    "",
    "5. THEO DÕI TIẾN BỘ:",
    "   - Tutor có ghi nhận khi người học sửa được lỗi cũ không?",
    "   - Có so sánh với hiệu suất trước đây không?",
    "",
    "ĐẶC BIỆT CHÚ Ý — lỗi ghi nhớ thường gặp:",
    "- Mỗi buổi như buổi đầu — không tham chiếu gì đến quá khứ.",
    "- Lặp lại giải thích giống hệt từ lượt trước (copy-paste).",
    "- Không nhận ra người học đã tiến bộ ở điểm yếu cũ.",
    "- Hỏi 'bạn đã học về... chưa?' thay vì NHỚ người học đã học gì.",
  ].join("\n");
}

/**
 * Build the adaptation-specific evaluation criteria.
 * Harsh focus: Does the tutor adapt pace, language, and approach?
 */
function buildAdaptationCriteria(harshness: HarshnessLevel): string {
  const config = HARSHNESS_CONFIGS[harshness];
  return [
    "TIÊU CHÍ ĐÁNH GIÁ THÍCH ỨNG:",
    "",
    "1. ĐIỀU CHỈNH THEO TRÌNH ĐỘ:",
    "   - Ngôn ngữ tutor dùng có PHÙ HỢP với trình độ CEFR của người học không?",
    "   - Với A1/A2: tutor có dùng tiếng Việt là chính không?",
    "   - Với B2/C1: tutor có thử thách đủ cao không?",
    `   - Điểm tối thiểu để qua: ${config.minDimensionScore}/100`,
    "",
    "2. ĐIỀU CHỈNH THEO TÍN HIỆU:",
    "   - Nếu người học tỏ ra BỐI RỐI, tutor có CHẬM LẠI không?",
    "   - Nếu người học trả lời NHANH/ĐÚNG, tutor có TĂNG TỐC không?",
    "   - Tutor có phản ứng với tín hiệu cảm xúc không? (nản, hào hứng, mệt)",
    "",
    "3. CHUYỂN ĐỔI CHIẾN LƯỢC:",
    "   - Khi một cách giải thích không hiệu quả, tutor có THỬ CÁCH KHÁC không?",
    "   - Tutor có linh hoạt giữa các phương pháp không? (ví dụ, gợi ý, so sánh)",
    "",
    "4. CHUYỂN NGỮ HỢP LÝ:",
    "   - Tutor có chuyển sang tiếng Việt khi người học không hiểu tiếng Anh không?",
    "   - Tutor có dùng tiếng Anh khi người học cần luyện tập không?",
    "   - Việc chuyển đổi ngôn ngữ có CHỦ ĐÍCH không? Hay ngẫu nhiên?",
    "",
    "5. PHÙ HỢP VỚI TRẺ EM (nếu là Kids mode):",
    "   - Ngôn ngữ có PHÙ HỢP với trẻ em không?",
    "   - Có dùng hoạt động VUI, hình ảnh, trò chơi không?",
    "   - Có GIỮ AN TOÀN tuyệt đối không?",
    "",
    "ĐẶC BIỆT CHÚ Ý — lỗi thích ứng thường gặp:",
    "- Dùng tiếng Anh giải thích ngữ pháp cho người A1 (họ KHÔNG HIỂU).",
    "- Dùng tiếng Việt cho người B2 muốn luyện nói (bỏ lỡ cơ hội luyện tập).",
    "- Không nhận ra người học đang nản — tiếp tục dạy như thường.",
    "- Dùng cùng một cách giải thích sau khi cách đó đã thất bại.",
    "- Dùng ngôn ngữ người lớn với trẻ em.",
  ].join("\n");
}

/**
 * Build the self-check-specific evaluation criteria.
 * Harsh focus: Does the tutor show appropriate uncertainty, admit limits?
 */
function buildSelfCheckCriteria(harshness: HarshnessLevel): string {
  const config = HARSHNESS_CONFIGS[harshness];
  return [
    "TIÊU CHÍ ĐÁNH GIÁ TỰ KIỂM:",
    "",
    "1. IM LẶNG CHIẾN LƯỢC (R7):",
    "   - Khi KHÔNG CHẮC, tutor có NÓI LÀ KHÔNG CHẮC không?",
    "   - Hay tutor GIẢ VỜ BIẾT và đưa ra câu trả lời sai?",
    "   - Khi vượt quá chuyên môn, tutor có TỪ CHỐI lịch sự không?",
    `   - Điểm tối thiểu để qua: ${config.minDimensionScore}/100`,
    "",
    "2. THỪA NHẬN GIỚI HẠN:",
    "   - Tutor có tự nhận mình là AI tutor không? Hay giả làm người thật?",
    "   - Tutor có thừa nhận khi câu hỏi ngoài phạm vi không?",
    "   - Có cụm từ như 'mình không chắc lắm', 'để mình kiểm tra lại' không?",
    "",
    "3. KHÔNG BỊA ĐẶT (O1-O8):",
    "   - Tutor có DÙNG NGÔN NGỮ TUYỆT ĐỐI không? ('luôn luôn', 'không bao giờ')",
    "   - Có bịa SỐ LIỆU không? ('90% người học', 'nghiên cứu chỉ ra')",
    "   - Có CAM KẾT QUÁ MỨC không? ('bạn sẽ không bao giờ sai nữa')",
    "   - Có TỰ NHẬN LÀ CHUYÊN GIA TUYỆT ĐỐI không? ('cô biết chắc')",
    "",
    "4. TỰ SỬA LỖI:",
    "   - Nếu tutor vừa nói sai, có TỰ PHÁT HIỆN và SỬA không?",
    "   - Tutor có làm mẫu việc tự sửa lỗi cho người học thấy không?",
    "",
    "5. NGÔN NGỮ KHIÊM TỐN:",
    "   - Tutor có dùng ngôn ngữ KHIÊM TỐN, CỞI MỞ không?",
    "   - Có dùng 'mình nghĩ', 'theo mình biết', 'có thể' thay vì khẳng định tuyệt đối?",
    "",
    "ĐẶC BIỆT CHÚ Ý — lỗi tự kiểm thường gặp:",
    "- Giải thích SAI nhưng rất TỰ TIN (tệ nhất — gây hại cho người học).",
    "- Bịa quy tắc ngữ pháp không tồn tại.",
    "- Không phân biệt được đâu là ý kiến, đâu là sự thật.",
    "- Từ chối thừa nhận sai dù đã bị chỉ ra.",
    "- Dùng từ 'always', 'never', '100%' khi nói về ngữ pháp tiếng Anh.",
  ].join("\n");
}

/**
 * Build the learning-gain-specific evaluation criteria.
 * Harsh focus: Can the tutor prove the learner improved?
 */
function buildLearningGainCriteria(harshness: HarshnessLevel): string {
  const config = HARSHNESS_CONFIGS[harshness];
  return [
    "TIÊU CHÍ ĐÁNH GIÁ TIẾN BỘ:",
    "",
    "1. ĐO LƯỜNG ĐƯỢC:",
    "   - Tutor có GHI NHẬN sự tiến bộ của người học không?",
    "   - Có so sánh TRƯỚC-SAU không? (trước khi dạy và sau khi dạy)",
    `   - Điểm tối thiểu để qua: ${config.minDimensionScore}/100`,
    "",
    "2. BẰNG CHỨNG CỤ THỂ:",
    "   - Tutor có đưa ra VÍ DỤ CỤ THỂ về sự tiến bộ không?",
    "   - 'Bạn đã sửa được lỗi X' tốt hơn 'bạn tiến bộ nhiều'.",
    "   - Có DẪN CHỨNG từ câu trả lời của người học không?",
    "",
    "3. MỤC TIÊU RÕ RÀNG:",
    "   - Tutor có đặt ra mục tiêu CỤ THỂ cho buổi học không?",
    "   - Có kiểm tra xem mục tiêu đã ĐẠT ĐƯỢC chưa vào cuối buổi không?",
    "",
    "4. KẾ HOẠCH TIẾP THEO (R10):",
    "   - Tutor có đề xuất bài tập/hoạt động TIẾP THEO không?",
    "   - Đề xuất có PHÙ HỢP với điểm yếu vừa học không?",
    "   - Đề xuất có KHẢ THI không? Hay chung chung?",
    "",
    "5. ĐỘNG LỰC HỌC TẬP:",
    "   - Tutor có tạo ĐỘNG LỰC thật sự không? (không phải khen giả)",
    "   - Có cho người học thấy họ ĐÃ TIẾN BỘ NHƯ THẾ NÀO không?",
    "",
    "ĐẶC BIỆT CHÚ Ý — lỗi đánh giá tiến bộ thường gặp:",
    "- Khen chung chung 'tốt lắm', 'giỏi quá' không có dẫn chứng.",
    "- Không đo lường được gì — chỉ nói chuyện mà không đánh giá.",
    "- Không có mục tiêu buổi học — dạy lang thang không định hướng.",
    "- Đề xuất bài tập không liên quan đến lỗi vừa học.",
    "- Nói 'bạn tiến bộ' nhưng không chỉ ra TIẾN BỘ Ở ĐÂU.",
  ].join("\n");
}

// ─── Primary Prompt Builders ───────────────────────────────────────────────────

/**
 * Build a harsh evaluator prompt for the DIAGNOSIS dimension.
 *
 * Evaluates whether Teacher Mercy correctly identified, classified, and
 * addressed the learner's errors. Catches over-diagnosis, under-diagnosis,
 * and missed L1 interference patterns.
 */
export function buildDiagnosisEvaluatorPrompt(input: HarshEvaluatorInput): string {
  const persona = buildEvaluatorPersona(input.harshness, "judge");
  const sharedCriteria = buildSharedEvaluationCriteria(input.harshness);
  const diagnosisCriteria = buildDiagnosisCriteria(input.harshness);
  const outputFormat = buildOutputFormatInstructions(["diagnosis"]);

  const contextSection = buildLearnerContextSection(input);
  const responseSection = buildTutorResponseSection(input);
  const previousTurnsSection = input.previousTurns?.length
    ? buildPreviousTurnsSection(input.previousTurns)
    : "";

  return [
    persona,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "ĐÁNH GIÁ CHẨN ĐOÁN — KIỂM TRA KHẢ NĂNG PHÁT HIỆN VÀ PHÂN LOẠI LỖI",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    sharedCriteria,
    "",
    diagnosisCriteria,
    "",
    "CÂU HỎI ĐÁNH GIÁ CHÍNH:",
    "1. Tutor có phát hiện ĐÚNG lỗi của người học không? Nếu sai → FAIL ngay.",
    "2. Tutor có BỎ SÓT lỗi nào không? Nếu có → trừ điểm nặng.",
    "3. Tutor có CHẨN ĐOÁN SAI không? (sửa câu đúng thành sai) → CRITICAL FAILURE.",
    "4. Tutor có nhận ra can thiệp tiếng Việt không? Nếu lỗi từ L1 mà tutor không nói → trừ điểm.",
    "5. Câu sửa lại có ĐÚNG 100% không? Nếu sai → FAIL.",
    "",
    previousTurnsSection,
    contextSection,
    responseSection,
    "",
    outputFormat,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Build a harsh evaluator prompt for the TEACHING dimension.
 *
 * Evaluates whether Teacher Mercy's explanation was clear, level-appropriate,
 * face-saving, and pedagogically sound.
 */
export function buildTeachingEvaluatorPrompt(input: HarshEvaluatorInput): string {
  const persona = buildEvaluatorPersona(input.harshness, "judge");
  const sharedCriteria = buildSharedEvaluationCriteria(input.harshness);
  const teachingCriteria = buildTeachingCriteria(input.harshness);
  const outputFormat = buildOutputFormatInstructions(["teaching"]);

  const contextSection = buildLearnerContextSection(input);
  const responseSection = buildTutorResponseSection(input);
  const previousTurnsSection = input.previousTurns?.length
    ? buildPreviousTurnsSection(input.previousTurns)
    : "";

  return [
    persona,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "ĐÁNH GIÁ GIẢNG DẠY — KIỂM TRA CHẤT LƯỢNG SƯ PHẠM",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    sharedCriteria,
    "",
    teachingCriteria,
    "",
    "CÂU HỎI ĐÁNH GIÁ CHÍNH:",
    "1. Tutor có công nhận ý nghĩa TRƯỚC khi sửa lỗi không? (R1) → nếu không, FAIL.",
    "2. Giải thích có PHÙ HỢP trình độ không? A1 mà dùng tiếng Anh giải thích → FAIL.",
    "3. Tutor có sửa QUÁ NHIỀU lỗi không? (R2) → nếu có, trừ điểm nặng.",
    "4. Cách sửa có GIỮ THỂ DIỆN không? (R8) → nếu làm người học xấu hổ, FAIL.",
    "5. Tutor có cho KHÔNG GIAN TỰ SỬA không? (R9) → nếu đưa đáp án ngay, trừ điểm.",
    "",
    previousTurnsSection,
    contextSection,
    responseSection,
    "",
    outputFormat,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Build a harsh evaluator prompt for the MEMORY dimension.
 *
 * Evaluates whether Teacher Mercy remembers and references past learner
 * interactions, weaknesses, and progress.
 */
export function buildMemoryEvaluatorPrompt(input: HarshEvaluatorInput): string {
  const persona = buildEvaluatorPersona(input.harshness, "judge");
  const sharedCriteria = buildSharedEvaluationCriteria(input.harshness);
  const memoryCriteria = buildMemoryCriteria(input.harshness);
  const outputFormat = buildOutputFormatInstructions(["memory"]);

  const contextSection = buildLearnerContextSection(input);
  const responseSection = buildTutorResponseSection(input);
  const previousTurnsSection = input.previousTurns?.length
    ? buildPreviousTurnsSection(input.previousTurns)
    : "";

  return [
    persona,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "ĐÁNH GIÁ GHI NHỚ — KIỂM TRA KHẢ NĂNG NHỚ VÀ LIÊN KẾT",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    sharedCriteria,
    "",
    memoryCriteria,
    "",
    "CÂU HỎI ĐÁNH GIÁ CHÍNH:",
    "1. Tutor có THAM CHIẾU điểm yếu đã biết không? (R5) → nếu không, trừ điểm.",
    "2. Tutor có LIÊN KẾT với buổi trước không? → nếu mỗi buổi như buổi đầu, trừ điểm.",
    "3. Tutor có LẶP LẠI chính mình không? → nếu copy-paste, FAIL.",
    "4. Tutor có NHẬN RA pattern lỗi lặp lại không? → nếu bỏ qua, trừ điểm.",
    "5. Nếu đây là buổi đầu tiên, tutor có ĐẶT NỀN MÓNG để nhớ không?",
    "",
    previousTurnsSection,
    contextSection,
    responseSection,
    "",
    outputFormat,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Build a harsh evaluator prompt for the ADAPTATION dimension.
 *
 * Evaluates whether Teacher Mercy adjusts pace, language, and approach
 * based on learner signals, CEFR level, and mode (adult/kids).
 */
export function buildAdaptationEvaluatorPrompt(input: HarshEvaluatorInput): string {
  const persona = buildEvaluatorPersona(input.harshness, "judge");
  const sharedCriteria = buildSharedEvaluationCriteria(input.harshness);
  const adaptationCriteria = buildAdaptationCriteria(input.harshness);
  const outputFormat = buildOutputFormatInstructions(["adaptation"]);

  const contextSection = buildLearnerContextSection(input);
  const responseSection = buildTutorResponseSection(input);
  const previousTurnsSection = input.previousTurns?.length
    ? buildPreviousTurnsSection(input.previousTurns)
    : "";

  return [
    persona,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "ĐÁNH GIÁ THÍCH ỨNG — KIỂM TRA KHẢ NĂNG ĐIỀU CHỈNH",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    sharedCriteria,
    "",
    adaptationCriteria,
    "",
    "CÂU HỎI ĐÁNH GIÁ CHÍNH:",
    "1. Ngôn ngữ tutor dùng có PHÙ HỢP CEFR không? A1 mà tiếng Anh → FAIL.",
    "2. Tutor có phản ứng với TÍN HIỆU CẢM XÚC không? Người học nản mà tutor phớt lờ → FAIL.",
    "3. Tutor có THAY ĐỔI cách giải thích khi cần không? Hay lặp lại cách cũ?",
    "4. Chuyển đổi Việt-Anh có CHỦ ĐÍCH không? Hay ngẫu nhiên?",
    input.learnerContext.isKidsMode
      ? "5. NGÔN NGỮ CÓ PHÙ HỢP TRẺ EM KHÔNG? Nếu không → CRITICAL FAILURE."
      : "5. Tutor có THỬ THÁCH đủ cao với trình độ của người học không?",
    "",
    previousTurnsSection,
    contextSection,
    responseSection,
    "",
    outputFormat,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Build a harsh evaluator prompt for the SELF-CHECK dimension.
 *
 * Evaluates whether Teacher Mercy shows appropriate uncertainty,
 * admits limits, avoids overclaiming, and self-corrects when wrong.
 */
export function buildSelfCheckEvaluatorPrompt(input: HarshEvaluatorInput): string {
  const persona = buildEvaluatorPersona(input.harshness, "judge");
  const sharedCriteria = buildSharedEvaluationCriteria(input.harshness);
  const selfCheckCriteria = buildSelfCheckCriteria(input.harshness);
  const outputFormat = buildOutputFormatInstructions(["selfCheck"]);

  const contextSection = buildLearnerContextSection(input);
  const responseSection = buildTutorResponseSection(input);

  return [
    persona,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "ĐÁNH GIÁ TỰ KIỂM — KIỂM TRA TÍNH TRUNG THỰC VÀ KHIÊM TỐN",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    sharedCriteria,
    "",
    selfCheckCriteria,
    "",
    "CÂU HỎI ĐÁNH GIÁ CHÍNH:",
    "1. Tutor có DÙNG NGÔN NGỮ TUYỆT ĐỐI không? 'luôn luôn', 'không bao giờ' → trừ điểm.",
    "2. Tutor có BỊA SỐ LIỆU/THỐNG KÊ không? '90%', 'research shows' → CRITICAL FAILURE.",
    "3. Tutor có CAM KẾT QUÁ MỨC không? 'bạn sẽ không bao giờ sai nữa' → CRITICAL FAILURE.",
    "4. Nếu tutor nói sai, có TỰ SỬA không?",
    "5. Tutor có TỪ CHỐI đúng lúc không? Hay cố trả lời câu hỏi ngoài chuyên môn?",
    "",
    contextSection,
    responseSection,
    "",
    outputFormat,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Build a harsh evaluator prompt for the LEARNING GAIN dimension.
 *
 * Evaluates whether Teacher Mercy can prove the learner improved
 * with concrete before/after evidence and clear next steps.
 */
export function buildLearningGainEvaluatorPrompt(input: HarshEvaluatorInput): string {
  const persona = buildEvaluatorPersona(input.harshness, "judge");
  const sharedCriteria = buildSharedEvaluationCriteria(input.harshness);
  const gainCriteria = buildLearningGainCriteria(input.harshness);
  const outputFormat = buildOutputFormatInstructions(["learningGain"]);

  const contextSection = buildLearnerContextSection(input);
  const responseSection = buildTutorResponseSection(input);
  const previousTurnsSection = input.previousTurns?.length
    ? buildPreviousTurnsSection(input.previousTurns)
    : "";

  return [
    persona,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "ĐÁNH GIÁ TIẾN BỘ — KIỂM TRA BẰNG CHỨNG CẢI THIỆN",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    sharedCriteria,
    "",
    gainCriteria,
    "",
    "CÂU HỎI ĐÁNH GIÁ CHÍNH:",
    "1. Tutor có ĐO LƯỜNG được sự tiến bộ không? Hay chỉ nói chung chung?",
    "2. Có BẰNG CHỨNG TRƯỚC-SAU không? Nếu không → trừ điểm nặng.",
    "3. Tutor có đặt MỤC TIÊU CỤ THỂ không? Hay dạy lang thang?",
    "4. Có KẾ HOẠCH TIẾP THEO không? (R10) Nếu không → trừ điểm.",
    "5. Động lực tutor tạo ra có THẬT không? Hay khen giả tạo?",
    "",
    previousTurnsSection,
    contextSection,
    responseSection,
    "",
    outputFormat,
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Build the UNIFIED COMPOSITE evaluator prompt — evaluates ALL 6 dimensions
 * simultaneously in a single harsh evaluation pass.
 *
 * This is the most powerful evaluator prompt. It demands the LLM grade every
 * dimension and produce a unified verdict.
 */
export function buildCompositeEvaluatorPrompt(input: HarshEvaluatorInput): string {
  const persona = buildEvaluatorPersona(input.harshness, "judge");
  const sharedCriteria = buildSharedEvaluationCriteria(input.harshness);
  const allDimensions: HarshEvaluatorDimension[] = [
    "diagnosis",
    "teaching",
    "memory",
    "adaptation",
    "selfCheck",
    "learningGain",
  ];
  const outputFormat = buildOutputFormatInstructions(allDimensions);

  const contextSection = buildLearnerContextSection(input);
  const responseSection = buildTutorResponseSection(input);
  const previousTurnsSection = input.previousTurns?.length
    ? buildPreviousTurnsSection(input.previousTurns)
    : "";

  return [
    persona,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "ĐÁNH GIÁ TỔNG HỢP 6 CHIỀU — TOÀN DIỆN VÀ KHÔNG KHOAN NHƯỢNG",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "Bạn phải đánh giá câu trả lời của Teacher Mercy trên TẤT CẢ 6 CHIỀU",
    "năng lực của một giáo viên thực thụ:",
    "  1. Chẩn đoán — phát hiện lỗi CHÍNH XÁC.",
    "  2. Giảng dạy — giải thích RÕ RÀNG, phù hợp trình độ.",
    "  3. Ghi nhớ — LIÊN KẾT với điểm yếu đã biết.",
    "  4. Thích ứng — ĐIỀU CHỈNH theo tín hiệu người học.",
    "  5. Tự kiểm — TRUNG THỰC, không bịa đặt, không overclaim.",
    "  6. Tiến bộ — ĐO LƯỜNG được sự cải thiện.",
    "",
    sharedCriteria,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "CHIỀU 1: CHẨN ĐOÁN",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    buildDiagnosisCriteria(input.harshness),
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "CHIỀU 2: GIẢNG DẠY",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    buildTeachingCriteria(input.harshness),
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "CHIỀU 3: GHI NHỚ",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    buildMemoryCriteria(input.harshness),
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "CHIỀU 4: THÍCH ỨNG",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    buildAdaptationCriteria(input.harshness),
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "CHIỀU 5: TỰ KIỂM",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    buildSelfCheckCriteria(input.harshness),
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "CHIỀU 6: TIẾN BỘ",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    buildLearningGainCriteria(input.harshness),
    "",
    previousTurnsSection,
    contextSection,
    responseSection,
    "",
    outputFormat,
    "",
    "LƯU Ý CUỐI CÙNG:",
    `- Mức độ nghiêm khắc: ${input.harshness.toUpperCase()}.`,
    `- Ngưỡng đậu: ${HARSHNESS_CONFIGS[input.harshness].passThreshold}/100.`,
    "- Nếu BẤT KỲ chiều nào FAIL, tổng thể là FAIL.",
    "- Đừng NGẠI cho điểm thấp. Đây là đánh giá THẬT, không phải động viên.",
    "- Mỗi lỗi tìm thấy PHẢI CÓ dẫn chứng trích dẫn NGUYÊN VĂN từ câu trả lời.",
  ].join("\n");
}

// ─── Adversarial (Devil's Advocate) Prompts ────────────────────────────────────

/**
 * Build an ADVERSARIAL evaluator prompt — the evaluator takes a devil's advocate
 * role, actively trying to PROVE the response is BAD.
 *
 * This is the harshest possible evaluation mode. The prompt instructs the LLM
 * to assume the response fails until proven otherwise.
 */
export function buildAdversarialEvaluatorPrompt(
  input: HarshEvaluatorInput,
  dimension?: HarshEvaluatorDimension,
): string {
  const persona = buildEvaluatorPersona(input.harshness, "adversary");
  const sharedCriteria = buildSharedEvaluationCriteria(input.harshness);
  const dims: HarshEvaluatorDimension[] = dimension
    ? [dimension]
    : ["diagnosis", "teaching", "memory", "adaptation", "selfCheck", "learningGain"];
  const outputFormat = buildOutputFormatInstructions(dims);

  const contextSection = buildLearnerContextSection(input);
  const responseSection = buildTutorResponseSection(input);

  const dimLabel = dimension
    ? DIMENSION_LABEL_VI[dimension]
    : "TỔNG HỢP 6 CHIỀU";

  return [
    persona,
    "",
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `ĐÁNH GIÁ PHẢN BIỆN — ${dimLabel}`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
    "",
    "VAI TRÒ CỦA BẠN: Bạn là LUẬT SƯ CÔNG TỐ. Câu trả lời của tutor là BỊ CÁO.",
    "Bạn phải CHỨNG MINH bị cáo CÓ TỘI (câu trả lời TỆ).",
    "",
    "CHIẾN LƯỢC PHẢN BIỆN:",
    "1. ĐỌC TỪNG TỪ trong câu trả lời. Mỗi từ có CHẮC ĐÚNG không?",
    "2. TÌM MÂU THUẪN trong câu trả lời. Có câu nào mâu thuẫn với câu khác không?",
    "3. KIỂM TRA TỪNG QUY TẮC R1-R10. Có quy tắc nào bị vi phạm không?",
    "4. ĐẶT MÌNH VÀO VỊ TRÍ NGƯỜI HỌC. Họ có THỰC SỰ HIỂU không?",
    "5. SO SÁNH với giáo viên THẬT. Giáo viên thật có trả lời thế này không?",
    "6. TÌM ĐIỀU BỊ BỎ SÓT. Tutor đã KHÔNG nói điều gì quan trọng?",
    "7. TÌM ĐIỀU BỊ NÓI SAI. Có sự thật nào bị bóp méo không?",
    "8. TÌM CƠ HỘI BỊ BỎ LỠ. Tutor có thể làm gì tốt hơn mà đã không làm?",
    "",
    sharedCriteria,
    "",
    "CÂU HỎI PHẢN BIỆN (bạn PHẢI trả lời từng câu):",
    "1. Câu trả lời này có ĐIỀU GÌ SAI không? (ngữ pháp, sự thật, logic)",
    "2. Câu trả lời này có ĐIỀU GÌ GÂY HẠI không? (hiểu lầm, overclaim, sai kiến thức)",
    "3. Câu trả lời này có ĐIỀU GÌ VÔ DỤNG không? (không giúp ích, lạc đề, lan man)",
    "4. Câu trả lời này có ĐIỀU GÌ THIẾU không? (bỏ sót lỗi, bỏ sót cơ hội dạy)",
    "5. Nếu tôi là NGƯỜI HỌC, tôi có THỰC SỰ HIỂU không sau khi đọc câu này?",
    "6. Một GIÁO VIÊN THẬT có trả lời như thế này không? Nếu không, KHÁC Ở ĐÂU?",
    "",
    contextSection,
    responseSection,
    "",
    outputFormat,
    "",
    "LƯU Ý PHẢN BIỆN:",
    "- Bạn được PHÉP nghi ngờ mọi thứ. Không có gì là hiển nhiên đúng.",
    "- Bạn được THƯỞNG vì tìm ra lỗi. Mỗi lỗi tìm thấy là một chiến thắng.",
    "- Nếu bạn KHÔNG TÌM THẤY LỖI NÀO sau khi kiểm tra KỸ LƯỠNG,",
    "  hãy KẾT LUẬN PASS một cách MIỄN CƯỠNG — nhưng giải thích TẠI SAO.",
    "- Đừng BAO GIỜ cho qua dễ dàng. Đây là bài kiểm tra KHÓ NHẤT.",
  ].join("\n");
}

// ─── Scenario-Anchored Evaluator Prompt ────────────────────────────────────────

/**
 * Build a SCENARIO-ANCHORED evaluator prompt that evaluates a tutor response
 * against a specific human-quality scenario from the scenario bank.
 *
 * The prompt includes the scenario's expected behavior as a benchmark,
 * making the evaluation more concrete and grounded.
 */
export function buildScenarioAnchoredEvaluatorPrompt(input: HarshEvaluatorInput): string {
  const persona = buildEvaluatorPersona(input.harshness, "benchmark");
  const sharedCriteria = buildSharedEvaluationCriteria(input.harshness);
  const allDimensions: HarshEvaluatorDimension[] = [
    "diagnosis",
    "teaching",
    "memory",
    "adaptation",
    "selfCheck",
    "learningGain",
  ];
  const outputFormat = buildOutputFormatInstructions(allDimensions);

  const contextSection = buildLearnerContextSection(input);
  const responseSection = buildTutorResponseSection(input);

  const scenarioRef = input.referenceScenarioId
    ? `Kịch bản tham chiếu: ${input.referenceScenarioId}`
    : "Không có kịch bản tham chiếu.";

  return [
    persona,
    "",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "ĐÁNH GIÁ THEO KỊCH BẢN CHUẨN — SO SÁNH VỚI GIÁO VIÊN LÝ TƯỞNG",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "",
    "Bạn được cung cấp một KỊCH BẢN CHUẨN — mô tả cách một GIÁO VIÊN LÝ TƯỞNG",
    "sẽ phản ứng trong tình huống này. Nhiệm vụ của bạn là SO SÁNH câu trả lời",
    "của Teacher Mercy với CHUẨN MỰC LÝ TƯỞNG đó.",
    "",
    scenarioRef,
    "",
    "PHƯƠNG PHÁP SO SÁNH:",
    "1. Đọc kỹ câu trả lời THỰC TẾ của tutor.",
    "2. So sánh với cách một GIÁO VIÊN LÝ TƯỞNG sẽ trả lời.",
    "3. Tìm ra KHOẢNG CÁCH giữa thực tế và lý tưởng.",
    "4. Đánh giá: khoảng cách đó có CHẤP NHẬN ĐƯỢC không?",
    "",
    sharedCriteria,
    "",
    "CÂU HỎI SO SÁNH:",
    "1. Tutor có LÀM ĐƯỢC điều mà giáo viên lý tưởng sẽ làm không?",
    "2. Tutor có LÀM THÊM điều gì mà giáo viên lý tưởng KHÔNG làm không? (có thể tốt hoặc xấu)",
    "3. Tutor có BỎ SÓT điều gì mà giáo viên lý tưởng sẽ làm không?",
    "4. Mức độ GIỐNG với giáo viên lý tưởng: 0–100%?",
    "5. Điều gì cần THAY ĐỔI để đạt chuẩn lý tưởng?",
    "",
    contextSection,
    responseSection,
    "",
    outputFormat,
  ].join("\n");
}

// ─── Helper Section Builders ───────────────────────────────────────────────────

function buildLearnerContextSection(input: HarshEvaluatorInput): string {
  const ctx = input.learnerContext;
  const lines = [
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "BỐI CẢNH NGƯỜI HỌC",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `- Trình độ CEFR: ${ctx.cefrLevel ?? "không rõ"}`,
    `- Ngôn ngữ mẹ đẻ: ${ctx.l1}`,
    `- Điểm yếu đã biết: ${ctx.knownWeaknesses.length > 0 ? ctx.knownWeaknesses.join(", ") : "chưa có"}`,
    `- Chế độ trẻ em: ${ctx.isKidsMode ? "CÓ" : "KHÔNG"}`,
    `- Buổi học thứ: ${ctx.sessionNumber}`,
  ];

  if (input.knownViolations?.length) {
    lines.push(
      `- Quy tắc đã vi phạm (từ kiểm tra tự động): ${input.knownViolations.join(", ")}`,
    );
  }

  return lines.join("\n");
}

function buildTutorResponseSection(input: HarshEvaluatorInput): string {
  const resp = input.tutorResponse;
  const lines = [
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "CÂU TRẢ LỜI CỦA TUTOR (ĐỐI TƯỢNG ĐÁNH GIÁ)",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    `- Câu của người học: "${input.learnerText}"`,
    `- Nội dung tiếng Việt (vi): "${resp.vi}"`,
  ];

  if (resp.en) {
    lines.push(`- Nội dung tiếng Anh (en): "${resp.en}"`);
  }

  if (resp.correctedSentence) {
    lines.push(`- Câu đã sửa: "${resp.correctedSentence}"`);
  }

  if (resp.grammarPoints?.length) {
    lines.push(`- Điểm ngữ pháp: ${resp.grammarPoints.join(", ")}`);
  }

  if (resp.transferErrorNote) {
    lines.push(`- Ghi chú can thiệp L1: "${resp.transferErrorNote}"`);
  }

  if (resp.action) {
    lines.push(`- Hành động tutor: ${resp.action}`);
  }

  return lines.join("\n");
}

function buildPreviousTurnsSection(previousTurns: string[]): string {
  const lines = [
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    "CÁC LƯỢT TRƯỚC (để kiểm tra lặp lại và liên kết)",
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ...previousTurns.map((t, i) => `Lượt ${i + 1}: "${t}"`),
  ];
  return lines.join("\n");
}

// ─── Catalog & Lookup ──────────────────────────────────────────────────────────

const EVALUATOR_PROMPT_CATALOG: EvaluatorPromptCatalogEntry[] = [
  {
    id: "eval-diag-judge",
    dimension: "diagnosis",
    role: "judge",
    titleVi: "Đánh giá chẩn đoán — Giám khảo",
    titleEn: "Diagnosis Evaluator — Judge",
    descriptionVi:
      "Đánh giá khả năng phát hiện và phân loại lỗi của tutor. Kiểm tra over-diagnosis, under-diagnosis, và can thiệp L1.",
    supportedLevels: ["strict", "harsh", "merciless"],
  },
  {
    id: "eval-teach-judge",
    dimension: "teaching",
    role: "judge",
    titleVi: "Đánh giá giảng dạy — Giám khảo",
    titleEn: "Teaching Evaluator — Judge",
    descriptionVi:
      "Đánh giá chất lượng sư phạm: giải thích rõ ràng, phù hợp trình độ, giữ thể diện.",
    supportedLevels: ["strict", "harsh", "merciless"],
  },
  {
    id: "eval-mem-judge",
    dimension: "memory",
    role: "judge",
    titleVi: "Đánh giá ghi nhớ — Giám khảo",
    titleEn: "Memory Evaluator — Judge",
    descriptionVi:
      "Đánh giá khả năng nhớ và liên kết điểm yếu người học xuyên buổi.",
    supportedLevels: ["strict", "harsh", "merciless"],
  },
  {
    id: "eval-adapt-judge",
    dimension: "adaptation",
    role: "judge",
    titleVi: "Đánh giá thích ứng — Giám khảo",
    titleEn: "Adaptation Evaluator — Judge",
    descriptionVi:
      "Đánh giá khả năng điều chỉnh ngôn ngữ, tốc độ, và chiến lược theo người học.",
    supportedLevels: ["strict", "harsh", "merciless"],
  },
  {
    id: "eval-self-judge",
    dimension: "selfCheck",
    role: "judge",
    titleVi: "Đánh giá tự kiểm — Giám khảo",
    titleEn: "Self-Check Evaluator — Judge",
    descriptionVi:
      "Đánh giá tính trung thực: tutor có thừa nhận giới hạn, tránh overclaim không.",
    supportedLevels: ["strict", "harsh", "merciless"],
  },
  {
    id: "eval-gain-judge",
    dimension: "learningGain",
    role: "judge",
    titleVi: "Đánh giá tiến bộ — Giám khảo",
    titleEn: "Learning Gain Evaluator — Judge",
    descriptionVi:
      "Đánh giá khả năng đo lường và chứng minh sự tiến bộ của người học.",
    supportedLevels: ["strict", "harsh", "merciless"],
  },
  {
    id: "eval-composite-judge",
    dimension: "composite",
    role: "judge",
    titleVi: "Đánh giá tổng hợp 6 chiều — Giám khảo",
    titleEn: "Composite 6-Dimension Evaluator — Judge",
    descriptionVi:
      "Đánh giá toàn diện tất cả 6 chiều năng lực giáo viên trong một lần.",
    supportedLevels: ["strict", "harsh", "merciless"],
  },
  {
    id: "eval-diag-adversary",
    dimension: "diagnosis",
    role: "adversary",
    titleVi: "Đánh giá chẩn đoán — Phản biện",
    titleEn: "Diagnosis Evaluator — Adversary",
    descriptionVi:
      "Phản biện gay gắt khả năng chẩn đoán. Tìm mọi lỗi sai, bỏ sót, chẩn đoán quá mức.",
    supportedLevels: ["harsh", "merciless"],
  },
  {
    id: "eval-teach-adversary",
    dimension: "teaching",
    role: "adversary",
    titleVi: "Đánh giá giảng dạy — Phản biện",
    titleEn: "Teaching Evaluator — Adversary",
    descriptionVi:
      "Phản biện chất lượng giảng dạy. Tìm giải thích khó hiểu, không phù hợp, thiếu sư phạm.",
    supportedLevels: ["harsh", "merciless"],
  },
  {
    id: "eval-mem-adversary",
    dimension: "memory",
    role: "adversary",
    titleVi: "Đánh giá ghi nhớ — Phản biện",
    titleEn: "Memory Evaluator — Adversary",
    descriptionVi:
      "Phản biện khả năng ghi nhớ. Tìm bằng chứng tutor không nhớ, không liên kết.",
    supportedLevels: ["harsh", "merciless"],
  },
  {
    id: "eval-adapt-adversary",
    dimension: "adaptation",
    role: "adversary",
    titleVi: "Đánh giá thích ứng — Phản biện",
    titleEn: "Adaptation Evaluator — Adversary",
    descriptionVi:
      "Phản biện khả năng thích ứng. Tìm chỗ tutor không điều chỉnh khi cần.",
    supportedLevels: ["harsh", "merciless"],
  },
  {
    id: "eval-self-adversary",
    dimension: "selfCheck",
    role: "adversary",
    titleVi: "Đánh giá tự kiểm — Phản biện",
    titleEn: "Self-Check Evaluator — Adversary",
    descriptionVi:
      "Phản biện tính trung thực. Tìm mọi dấu hiệu overclaim, bịa đặt, ngụy tạo.",
    supportedLevels: ["harsh", "merciless"],
  },
  {
    id: "eval-gain-adversary",
    dimension: "learningGain",
    role: "adversary",
    titleVi: "Đánh giá tiến bộ — Phản biện",
    titleEn: "Learning Gain Evaluator — Adversary",
    descriptionVi:
      "Phản biện bằng chứng tiến bộ. Tìm chỗ tutor tuyên bố tiến bộ không có căn cứ.",
    supportedLevels: ["harsh", "merciless"],
  },
  {
    id: "eval-composite-adversary",
    dimension: "composite",
    role: "adversary",
    titleVi: "Đánh giá tổng hợp 6 chiều — Phản biện",
    titleEn: "Composite 6-Dimension Evaluator — Adversary",
    descriptionVi:
      "Phản biện toàn diện — tìm mọi lỗi có thể có trên tất cả 6 chiều.",
    supportedLevels: ["harsh", "merciless"],
  },
  {
    id: "eval-scenario-benchmark",
    dimension: "composite",
    role: "benchmark",
    titleVi: "Đánh giá theo kịch bản chuẩn",
    titleEn: "Scenario-Anchored Evaluator — Benchmark",
    descriptionVi:
      "So sánh câu trả lời của tutor với chuẩn mực giáo viên lý tưởng trong kịch bản cụ thể.",
    supportedLevels: ["strict", "harsh", "merciless"],
  },
];

/**
 * Get the full catalog of evaluator prompts.
 * Pure function — always returns the same catalog, no side effects.
 */
export function getEvaluatorPromptCatalog(): EvaluatorPromptCatalogEntry[] {
  return [...EVALUATOR_PROMPT_CATALOG];
}

/**
 * Get a single evaluator prompt catalog entry by ID.
 * Returns null if the ID is not found.
 * Pure function — deterministic, no side effects.
 */
export function getEvaluatorPromptById(id: string): EvaluatorPromptCatalogEntry | null {
  return EVALUATOR_PROMPT_CATALOG.find((e) => e.id === id) ?? null;
}

/**
 * Get catalog entries filtered by dimension.
 * Pure function — deterministic, no side effects.
 */
export function getEvaluatorPromptsByDimension(
  dimension: HarshEvaluatorDimension | "composite",
): EvaluatorPromptCatalogEntry[] {
  return EVALUATOR_PROMPT_CATALOG.filter((e) => e.dimension === dimension);
}

/**
 * Get catalog entries filtered by role.
 * Pure function — deterministic, no side effects.
 */
export function getEvaluatorPromptsByRole(
  role: EvaluatorPromptRole,
): EvaluatorPromptCatalogEntry[] {
  return EVALUATOR_PROMPT_CATALOG.filter((e) => e.role === role);
}

// ─── Dimension-to-Prompt Builder Mapping ───────────────────────────────────────

/**
 * Map of dimension IDs to their prompt builder functions.
 * Use this to dynamically invoke the right builder for a dimension.
 */
export const DIMENSION_PROMPT_BUILDERS: Record<
  HarshEvaluatorDimension,
  (input: HarshEvaluatorInput) => string
> = {
  diagnosis: buildDiagnosisEvaluatorPrompt,
  teaching: buildTeachingEvaluatorPrompt,
  memory: buildMemoryEvaluatorPrompt,
  adaptation: buildAdaptationEvaluatorPrompt,
  selfCheck: buildSelfCheckEvaluatorPrompt,
  learningGain: buildLearningGainEvaluatorPrompt,
};

/**
 * Build evaluator prompts for ALL 6 dimensions at once.
 * Returns a record mapping dimension → prompt string.
 * Pure function — deterministic, no side effects.
 */
export function buildAllDimensionEvaluatorPrompts(
  input: HarshEvaluatorInput,
): Record<HarshEvaluatorDimension, string> {
  return {
    diagnosis: buildDiagnosisEvaluatorPrompt(input),
    teaching: buildTeachingEvaluatorPrompt(input),
    memory: buildMemoryEvaluatorPrompt(input),
    adaptation: buildAdaptationEvaluatorPrompt(input),
    selfCheck: buildSelfCheckEvaluatorPrompt(input),
    learningGain: buildLearningGainEvaluatorPrompt(input),
  };
}

/**
 * Build a specific evaluator prompt by catalog ID.
 * Returns null if the ID is not recognized.
 * Pure function — deterministic, no side effects.
 */
export function buildEvaluatorPromptById(
  id: string,
  input: HarshEvaluatorInput,
): string | null {
  switch (id) {
    case "eval-diag-judge":
      return buildDiagnosisEvaluatorPrompt(input);
    case "eval-teach-judge":
      return buildTeachingEvaluatorPrompt(input);
    case "eval-mem-judge":
      return buildMemoryEvaluatorPrompt(input);
    case "eval-adapt-judge":
      return buildAdaptationEvaluatorPrompt(input);
    case "eval-self-judge":
      return buildSelfCheckEvaluatorPrompt(input);
    case "eval-gain-judge":
      return buildLearningGainEvaluatorPrompt(input);
    case "eval-composite-judge":
      return buildCompositeEvaluatorPrompt(input);
    case "eval-diag-adversary":
      return buildAdversarialEvaluatorPrompt(input, "diagnosis");
    case "eval-teach-adversary":
      return buildAdversarialEvaluatorPrompt(input, "teaching");
    case "eval-mem-adversary":
      return buildAdversarialEvaluatorPrompt(input, "memory");
    case "eval-adapt-adversary":
      return buildAdversarialEvaluatorPrompt(input, "adaptation");
    case "eval-self-adversary":
      return buildAdversarialEvaluatorPrompt(input, "selfCheck");
    case "eval-gain-adversary":
      return buildAdversarialEvaluatorPrompt(input, "learningGain");
    case "eval-composite-adversary":
      return buildAdversarialEvaluatorPrompt(input);
    case "eval-scenario-benchmark":
      return buildScenarioAnchoredEvaluatorPrompt(input);
    default:
      return null;
  }
}

// ─── Convenience Builders ──────────────────────────────────────────────────────

/**
 * Create a minimal HarshEvaluatorInput for quick testing.
 * Pure function — deterministic, no side effects.
 */
export function createMinimalEvaluatorInput(
  overrides: Partial<HarshEvaluatorInput> = {},
): HarshEvaluatorInput {
  return {
    learnerText: "Yesterday I go to market.",
    tutorResponse: {
      vi: "Ý bạn là 'Yesterday I went to the market.' Trong tiếng Anh, khi nói về quá khứ, động từ cần chia ở thì quá khứ. 'Go' trở thành 'went'. Đây là lỗi phổ biến vì tiếng Việt không chia thì.",
      en: "You mean 'Yesterday I went to the market.' In English, past tense requires the verb to change form.",
      correctedSentence: "Yesterday I went to the market.",
      grammarPoints: ["past tense", "verb conjugation"],
      transferErrorNote:
        "Tiếng Việt không chia động từ theo thì, người Việt thường quên chia thì trong tiếng Anh.",
      action: "correct",
    },
    learnerContext: {
      cefrLevel: "A2",
      l1: "vi",
      knownWeaknesses: ["past tense"],
      isKidsMode: false,
      sessionNumber: 3,
    },
    harshness: "harsh",
    ...overrides,
  };
}

/**
 * Build a summary of all harsh evaluator prompt statistics.
 * Pure function — deterministic, no side effects.
 */
export function getEvaluatorPromptStatistics(): {
  totalPrompts: number;
  byRole: Record<EvaluatorPromptRole, number>;
  byDimension: Record<string, number>;
  byLevel: Record<HarshnessLevel, number>;
  supportedDimensions: string[];
} {
  const byRole: Record<string, number> = { judge: 0, adversary: 0, benchmark: 0 };
  const byDimension: Record<string, number> = {};
  const byLevel: Record<string, number> = { strict: 0, harsh: 0, merciless: 0 };

  for (const entry of EVALUATOR_PROMPT_CATALOG) {
    byRole[entry.role] = (byRole[entry.role] || 0) + 1;
    byDimension[entry.dimension] = (byDimension[entry.dimension] || 0) + 1;
    for (const level of entry.supportedLevels) {
      byLevel[level] = (byLevel[level] || 0) + 1;
    }
  }

  return {
    totalPrompts: EVALUATOR_PROMPT_CATALOG.length,
    byRole: byRole as Record<EvaluatorPromptRole, number>,
    byDimension,
    byLevel: byLevel as Record<HarshnessLevel, number>,
    supportedDimensions: [
      ...new Set(EVALUATOR_PROMPT_CATALOG.map((e) => e.dimension)),
    ],
  };
}

/**
 * Check if a harshness level is valid.
 * Pure function — deterministic, no side effects.
 */
export function isValidHarshnessLevel(level: string): level is HarshnessLevel {
  return level === "strict" || level === "harsh" || level === "merciless";
}

/**
 * Check if a dimension is valid for evaluation.
 * Pure function — deterministic, no side effects.
 */
export function isValidEvaluatorDimension(
  dim: string,
): dim is HarshEvaluatorDimension {
  return (
    dim === "diagnosis" ||
    dim === "teaching" ||
    dim === "memory" ||
    dim === "adaptation" ||
    dim === "selfCheck" ||
    dim === "learningGain"
  );
}

/**
 * Get the Vietnamese label for a harsh evaluator dimension.
 * Pure function — deterministic, no side effects.
 */
export function getEvaluatorDimensionLabelVi(dim: HarshEvaluatorDimension): string {
  return DIMENSION_LABEL_VI[dim];
}

/**
 * Get the English label for a harsh evaluator dimension.
 * Pure function — deterministic, no side effects.
 */
export function getEvaluatorDimensionLabelEn(dim: HarshEvaluatorDimension): string {
  return DIMENSION_LABEL_EN[dim];
}

/**
 * Get the Vietnamese description of a contract rule.
 * Pure function — deterministic, no side effects.
 */
export function getContractRuleDescriptionVi(ruleId: ContractRuleId): string {
  return CONTRACT_RULE_VI[ruleId];
}
