/**
 * Failure Taxonomy for Weak Tutoring Behavior
 *
 * Categorizes specific ways Teacher Mercy can exhibit weak tutoring behavior
 * across the 6 teacher intelligence dimensions. Each failure mode has:
 *
 *   - A unique ID with dimension prefix
 *   - Vietnamese + English labels
 *   - Severity classification (critical / major / minor)
 *   - Concrete detection criteria
 *   - Detectability category (data / review / prompt)
 *   - Targeted remedy with remedy type
 *
 * Designed so Chau can answer the question:
 *
 *   "What specifically went wrong in this session?"
 *
 * Rather than just knowing "diagnosis score is low", Chau knows:
 *   → "F-DIAG-01: Mercy missed 6 errors that a human teacher would catch."
 *
 * All pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first in all user-facing labels, descriptions, and remedies.
 *
 * Integrates with:
 *   - TranscriptCorrectionEvent (for data-detectable failures)
 *   - AuditResult (for self-check failures)
 *   - ChauReviewPacket (for session-level scanning)
 *   - TeacherIntelligenceDashboard (for cross-session failure trends)
 *
 * Key APIs:
 *   scanSessionForFailures(events, audits, rubricResult, memorySnapshot)
 *   detectFailuresByDimension(dimensionId, events, context)
 *   getFailureById(failureId)
 *   classifySessionFailureProfile(failures)
 *   getRemediesForFailures(failures)
 *   getFailureTaxonomyCatalog()
 *   computeSessionFailureScore(failures)
 *   aggregateFailuresAcrossSessions(sessions)
 */

import type { TranscriptCorrectionEvent } from "./transcriptCorrectionTypes";
import type { AuditResult } from "./teacherMercyAuditGate";
import type { RubricResult } from "./teacherMercyRubric";
import type { ContractRuleCheck } from "./teacherMercyContract";
import type { ChauMemorySnapshot } from "./chauReviewPacket";
import type { TeacherIntelligenceDimensionId } from "./teacherIntelligenceDashboard";

// ─── Failure Taxonomy Types ─────────────────────────────────────────────────

/** Severity of a failure mode */
export type FailureSeverity = "critical" | "major" | "minor";

/** How a failure mode can be detected */
export type FailureDetectability =
  | "data_detectable"
  | "requires_review"
  | "prompt_auditable";

/** The type of remedy to apply */
export type FailureRemedyType =
  | "prompt_fix"
  | "contract_update"
  | "data_fix"
  | "escalate_to_chau"
  | "retrain_memory"
  | "adjust_timing_policy";

/** Classification of a failure profile across a session */
export type SessionFailureProfile =
  | "clean"
  | "minor_issues"
  | "needs_attention"
  | "serious_problems"
  | "critical_intervention";

// ─── Failure Mode Definition ─────────────────────────────────────────────────

/**
 * A single failure mode in the taxonomy.
 *
 * Describes one specific way Teacher Mercy can exhibit weak tutoring behavior,
 * along with how to detect and fix it.
 */
export interface TutorFailureMode {
  /** Unique failure ID (e.g., "F-DIAG-01") */
  failureId: string;
  /** Vietnamese name of the failure */
  titleVi: string;
  /** English name of the failure */
  titleEn: string;
  /** Which teacher intelligence dimension this maps to */
  dimensionId: TeacherIntelligenceDimensionId;
  /** Vietnamese description of what the failure looks like in practice */
  descriptionVi: string;
  /** How severe this failure is */
  severity: FailureSeverity;
  /** How this failure can be detected */
  detectability: FailureDetectability;
  /** Concrete Vietnamese detection criteria */
  detectionCriteriaVi: string[];
  /** What the learner experiences when this failure occurs (Vietnamese) */
  learnerImpactVi: string;
  /** Vietnamese remedy instructions */
  remedyVi: string;
  /** Category of remedy */
  remedyType: FailureRemedyType;
  /** Vietnamese root cause analysis — why this failure happens */
  rootCauseVi: string;
  /** Examples of this failure in practice (Vietnamese) */
  examplesVi: string[];
}

// ─── Detection Result ────────────────────────────────────────────────────────

/**
 * Result of checking a single failure mode against session data.
 */
export interface FailureDetectionResult {
  /** The failure mode that was checked */
  failureMode: TutorFailureMode;
  /** Whether this failure was detected */
  detected: boolean;
  /** Detection confidence (0–1), only meaningful when detected */
  confidence: number;
  /** Evidence — what was found in the data */
  evidenceVi: string[];
  /** Count of occurrences */
  occurrenceCount: number;
  /** Timestamps or turn numbers where detected */
  detectedAt: Array<{ turnNumber: number; timestamp: number }>;
}

/**
 * The full failure scan result for one session.
 */
export interface SessionFailureScan {
  /** Session identifier */
  sessionId: string;
  /** When the scan was performed (ISO) */
  scannedAt: string;
  /** Total number of failure modes checked */
  totalChecks: number;
  /** Detected failures */
  detectedFailures: FailureDetectionResult[];
  /** How many failures were detected */
  failureCount: number;
  /** Breakdown by severity */
  bySeverity: {
    critical: FailureDetectionResult[];
    major: FailureDetectionResult[];
    minor: FailureDetectionResult[];
  };
  /** Breakdown by dimension */
  byDimension: Record<TeacherIntelligenceDimensionId, FailureDetectionResult[]>;
  /** Session failure score — sum of weighted failures (0–100, lower = better) */
  failureScore: number;
  /** Overall failure profile classification */
  profile: SessionFailureProfile;
  /** Vietnamese summary of the scan */
  summaryVi: string;
  /** Prioritized remedies (critical first) */
  remedies: Array<{
    failureId: string;
    titleVi: string;
    remedyVi: string;
    remedyType: FailureRemedyType;
    priority: number;
  }>;
  /** Whether Chau should review this session urgently */
  requiresChauReview: boolean;
}

/**
 * Aggregated failure counts across multiple sessions.
 */
export interface CrossSessionFailureSummary {
  /** Number of sessions scanned */
  sessionCount: number;
  /** Per-failure-mode count across all sessions */
  failureCounts: Record<string, number>;
  /** Most common failures (top 10) */
  topFailures: Array<{ failureId: string; titleVi: string; count: number }>;
  /** Failures that are getting worse (increasing) */
  worsening: string[];
  /** Failures that are improving (decreasing) */
  improving: string[];
  /** Vietnamese summary */
  summaryVi: string;
}

// ─── Failure Weights (contribute to failure score) ───────────────────────────

const FAILURE_SEVERITY_WEIGHT: Record<FailureSeverity, number> = {
  critical: 15,
  major: 7,
  minor: 2,
};

// ─── The Failure Taxonomy Catalog ────────────────────────────────────────────

/**
 * Complete taxonomy of weak tutoring behavior failures.
 *
 * Organized by teacher intelligence dimension, with 25 failure modes
 * covering the full spectrum of how Teacher Mercy can fail as a tutor.
 */
export const TUTOR_FAILURE_TAXONOMY: ReadonlyArray<TutorFailureMode> = [
  // ═══════════════════════════════════════════════════════════════════════════
  // DIAGNOSIS FAILURES (F-DIAG)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    failureId: "F-DIAG-01",
    titleVi: "Bỏ sót lỗi",
    titleEn: "Missed errors",
    dimensionId: "diagnosis",
    descriptionVi:
      "Mercy không phát hiện lỗi trong câu trả lời của người học dù lỗi đó rõ ràng " +
      "và một giáo viên thật sẽ phát hiện ra. Người học tiếp tục mắc lỗi mà không " +
      "được sửa, dẫn đến cố hóa lỗi sai.",
    severity: "critical",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "≥3 lượt không có correction nào dù người học đang ở trình độ thấp (điểm match score trung bình < 60)",
      "Số correction/turn < 0.3 khi match score trung bình < 60",
      "Không có weakness tag nào được gắn dù có ≥5 lượt",
    ],
    learnerImpactVi:
      "Người học không biết mình sai. Lỗi tiếp tục lặp lại và trở thành thói quen.",
    remedyVi:
      "Kiểm tra prompt chẩn đoán — đảm bảo prompt yêu cầu Mercy luôn kiểm tra lỗi " +
      "trong mọi lượt, kể cả khi người học có vẻ tự tin. Hạ ngưỡng tự tin sửa lỗi " +
      "nếu đang quá cao.",
    remedyType: "prompt_fix",
    rootCauseVi:
      "Prompt chẩn đoán quá lỏng, hoặc Mercy được lập trình để chỉ sửa lỗi khi " +
      "rất tự tin (>0.85), dẫn đến bỏ sót lỗi nhỏ nhưng quan trọng.",
    examplesVi: [
      'Người học nói "I go to school yesterday" → Mercy không sửa "go" → "went".',
      'Người học nói "He don\'t like it" → Mercy bỏ qua, không gắn nhãn ngữ pháp.',
    ],
  },

  {
    failureId: "F-DIAG-02",
    titleVi: "Gắn nhãn sai loại lỗi",
    titleEn: "Wrong error classification",
    dimensionId: "diagnosis",
    descriptionVi:
      "Mercy phát hiện lỗi nhưng gắn sai nhãn. Ví dụ: lỗi phát âm bị gắn nhãn " +
      "là lỗi ngữ pháp, hoặc lỗi từ vựng bị gắn nhãn là lỗi vietlish. " +
      "Dẫn đến cách sửa không phù hợp với loại lỗi thực tế.",
    severity: "major",
    detectability: "requires_review",
    detectionCriteriaVi: [
      "Correction source không khớp với loại lỗi thực tế (vd: lỗi rõ ràng là ngữ pháp nhưng source là 'phonetic-confusable')",
      "Weakness tag mâu thuẫn với nội dung correction (vd: tag 'pronunciation' nhưng correction là về thì động từ)",
      "≥30% correction có source và weakness tag không nhất quán",
    ],
    learnerImpactVi:
      "Người học nhận được cách sửa sai hướng — ví dụ được sửa phát âm khi vấn đề thực sự là ngữ pháp.",
    remedyVi:
      "Rà soát logic phân loại lỗi trong prompt chẩn đoán. Đảm bảo có bước " +
      "phân biệt rõ: lỗi phát âm, lỗi ngữ pháp, lỗi từ vựng, lỗi vietlish. " +
      "Thêm ví dụ mẫu cho từng loại trong prompt.",
    remedyType: "prompt_fix",
    rootCauseVi:
      "Prompt chẩn đoán không có hướng dẫn rõ ràng về cách phân biệt các loại lỗi, " +
      "hoặc logic engine chọn source dựa trên độ khớp bề mặt thay vì bản chất lỗi.",
    examplesVi: [
      'Người học nói "I very like it" (lỗi vietlish: rất thích → like very much) nhưng bị gắn nhãn "grammar".',
      'Người học phát âm "th" thành "t" nhưng bị gắn nhãn "vocabulary".',
    ],
  },

  {
    failureId: "F-DIAG-03",
    titleVi: "Sửa lỗi ảo",
    titleEn: "Ghost corrections",
    dimensionId: "diagnosis",
    descriptionVi:
      "Mercy sửa những thứ người học nói đúng, hoặc sửa theo cách không cần thiết. " +
      "Người học bị sửa những câu vốn đã đúng, gây hoang mang và mất tự tin.",
    severity: "critical",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "≥1 correction có confidence > 0.7 nhưng original và corrected gần như giống hệt (Levenshtein distance < 2)",
      "≥2 correction mà corrected khác biệt về nghĩa hoặc phong cách, không phải lỗi thực sự",
      "Correction source là 'semantic-implausibility' nhưng câu gốc hoàn toàn hợp lý",
    ],
    learnerImpactVi:
      "Người học bị sửa những câu đúng → mất tự tin, không biết đâu là đúng thật sự.",
    remedyVi:
      "Thêm bước kiểm tra: trước khi đưa ra correction, Mercy phải xác nhận " +
      "câu gốc THỰC SỰ sai. Tăng ngưỡng trigger cho 'semantic-implausibility'. " +
      "Thêm rule: nếu original ≈ corrected (khác < 3 ký tự), bỏ qua.",
    remedyType: "contract_update",
    rootCauseVi:
      "Công cụ phát hiện lỗi quá nhạy (over-triggering), hoặc không có bước " +
      "xác nhận rằng sửa lỗi là cần thiết trước khi áp dụng.",
    examplesVi: [
      'Người học nói "I went to the store" → Mercy sửa "went" → "traveled" (không cần thiết).',
      'Người học nói "She is a doctor" → Mercy gắn cờ "semantic-implausibility" (sai).',
    ],
  },

  {
    failureId: "F-DIAG-04",
    titleVi: "Sửa lỗi với độ tự tin thấp",
    titleEn: "Low-confidence corrections",
    dimensionId: "diagnosis",
    descriptionVi:
      "Mercy đưa ra quá nhiều correction với độ tự tin thấp (<0.5), cho thấy " +
      "Mercy không chắc chắn về chẩn đoán của mình. Điều này làm giảm uy tín " +
      "của giáo viên và có thể sửa sai.",
    severity: "major",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      ">40% correction có confidence < 0.5",
      "≥5 correction/turn với confidence trung bình < 0.4",
      "Không có bước xác nhận hoặc kiểm tra chéo khi confidence thấp",
    ],
    learnerImpactVi:
      "Người học nhận được những sửa lỗi không đáng tin cậy — Mercy giống như đang đoán hơn là dạy.",
    remedyVi:
      "Đặt ngưỡng confidence tối thiểu (≥0.6) cho correction được hiển thị. " +
      "Correction dưới ngưỡng → chuyển sang chế độ gợi ý ('Có thể bạn muốn nói...') " +
      "thay vì khẳng định.",
    remedyType: "adjust_timing_policy",
    rootCauseVi:
      "Không có confidence threshold trong pipeline hiển thị correction, " +
      "hoặc prompt khuyến khích Mercy sửa mọi thứ kể cả khi không chắc.",
    examplesVi: [
      "8/10 correction trong buổi học có confidence < 0.5 — Mercy đang đoán.",
      "Correction với confidence 0.2 vẫn được hiển thị như một sửa lỗi chắc chắn.",
    ],
  },

  {
    failureId: "F-DIAG-05",
    titleVi: "Chỉ dùng một nguồn sửa lỗi",
    titleEn: "Single-source correction bias",
    dimensionId: "diagnosis",
    descriptionVi:
      "Mercy chỉ dùng một nguồn sửa lỗi duy nhất (vd: chỉ grammar-rule) " +
      "mà bỏ qua các nguồn khác như phát âm, vietlish, hay ngữ nghĩa. " +
      "Dẫn đến chẩn đoán một chiều, bỏ sót nhiều loại lỗi khác.",
    severity: "minor",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "≥80% correction đến từ cùng một source",
      "Có ≥5 lượt nhưng chỉ 1 source xuất hiện",
      "Không có correction từ 'vietlish-pattern' hoặc 'phonetic-readback' dù người học là người Việt",
    ],
    learnerImpactVi:
      "Chỉ một loại lỗi được sửa. Các loại lỗi khác (phát âm, vietlish) bị bỏ qua.",
    remedyVi:
      "Đảm bảo prompt yêu cầu Mercy kiểm tra đa dạng nguồn lỗi: ngữ pháp, " +
      "phát âm, vietlish, từ vựng. Thêm checklist trong prompt: 'Đã kiểm tra " +
      "phát âm chưa? Đã kiểm tra vietlish chưa?'",
    remedyType: "prompt_fix",
    rootCauseVi:
      "Prompt chỉ tập trung vào một loại lỗi (thường là ngữ pháp) mà không " +
      "yêu cầu kiểm tra toàn diện các loại lỗi khác.",
    examplesVi: [
      "15/15 correction đều là 'grammar-rule' dù người học có lỗi phát âm rõ ràng.",
      "Không có correction vietlish nào dù người học dùng cấu trúc tiếng Việt trong tiếng Anh.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // TEACHING FAILURES (F-TEACH)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    failureId: "F-TEACH-01",
    titleVi: "Giải thích không rõ ràng",
    titleEn: "Unclear explanations",
    dimensionId: "teaching",
    descriptionVi:
      "Mercy đưa ra lời giải thích mơ hồ, chung chung, hoặc quá kỹ thuật " +
      "khiến người học không hiểu được lỗi của mình và cách sửa.",
    severity: "major",
    detectability: "requires_review",
    detectionCriteriaVi: [
      "Giải thích ngắn hơn 20 ký tự hoặc không chứa ví dụ cụ thể",
      "Giải thích dùng thuật ngữ ngữ pháp tiếng Anh mà không có bản dịch tiếng Việt",
      "Giải thích không liên kết với lỗi cụ thể của người học (giải thích mẫu)",
      "Không có ví dụ minh họa trong giải thích",
    ],
    learnerImpactVi:
      "Người học thấy giải thích khó hiểu, không biết mình sai ở đâu và sửa thế nào.",
    remedyVi:
      "Thêm yêu cầu trong prompt: mỗi giải thích phải có (1) lỗi là gì, " +
      "(2) tại sao sai, (3) sửa thế nào, (4) ví dụ cụ thể. Dùng tiếng Việt " +
      "cho phần giải thích ngữ pháp phức tạp.",
    remedyType: "prompt_fix",
    rootCauseVi:
      "Prompt không có cấu trúc giải thích rõ ràng, hoặc Mercy mặc định dùng " +
      "mẫu giải thích chung chung cho mọi lỗi.",
    examplesVi: [
      '"Bạn sai ngữ pháp rồi. Hãy sửa lại nhé." (không nói sai gì, sửa thế nào)',
      'Giải thích bằng tiếng Anh: "The past perfect tense requires..." trong khi người học mới trình độ A2.',
    ],
  },

  {
    failureId: "F-TEACH-02",
    titleVi: "Sửa quá nhiều cùng lúc",
    titleEn: "Over-correction",
    dimensionId: "teaching",
    descriptionVi:
      "Mercy sửa quá nhiều lỗi trong một lượt, làm người học choáng ngợp " +
      "và nản lòng. Một giáo viên giỏi sẽ ưu tiên 1–2 lỗi quan trọng nhất.",
    severity: "major",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      ">3 correction trong một turn duy nhất",
      ">60% số turn có correction (người học bị sửa gần như mọi lúc)",
      "Tỉ lệ sửa lỗi > 0.8 trên ≥5 turn (80% lượt đều bị sửa)",
    ],
    learnerImpactVi:
      "Người học cảm thấy mình sai mọi thứ, mất động lực, có thể bỏ cuộc.",
    remedyVi:
      "Giới hạn số correction tối đa mỗi turn (≤2 với trình độ thấp, ≤3 với trình độ cao). " +
      "Ưu tiên sửa lỗi ảnh hưởng đến nghĩa trước, lỗi nhỏ để sau.",
    remedyType: "adjust_timing_policy",
    rootCauseVi:
      "Không có cơ chế ưu tiên lỗi — Mercy sửa tất cả lỗi tìm thấy thay vì " +
      "chọn lọc lỗi quan trọng nhất.",
    examplesVi: [
      "Một turn — Mercy sửa 5 lỗi: ngữ pháp, phát âm, từ vựng, vietlish, dấu câu.",
      "10/10 turn đều bị sửa — người học không có lượt nào 'sạch'.",
    ],
  },

  {
    failureId: "F-TEACH-03",
    titleVi: "Khen giả",
    titleEn: "Fake praise",
    dimensionId: "teaching",
    descriptionVi:
      "Mercy khen ngợi câu trả lời sai hoặc khen quá mức cho câu trả lời " +
      "trung bình. Đây là hành vi 'yes-man' — khen để làm hài lòng thay vì " +
      "dạy thật. Vi phạm quy tắc an toàn R3.",
    severity: "critical",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "Tutor response chứa từ khen ('tốt', 'giỏi', 'xuất sắc', 'tuyệt vời') nhưng match score < 50",
      "Tutor response chứa 'rất tốt' hoặc 'hoàn hảo' nhưng có ≥2 correction trong cùng turn",
      "Câu trả lời sai rõ ràng nhưng Mercy không sửa mà khen",
    ],
    learnerImpactVi:
      "Người học tin rằng mình đúng khi thực sự sai → học sai kiến thức.",
    remedyVi:
      "Kích hoạt R3_NO_FAKE_PRAISE trong contract. Thêm rule: " +
      "nếu match score < 60, KHÔNG được khen. Nếu có ≥1 correction, " +
      "chỉ khen nỗ lực ('Cố gắng tốt!'), không khen độ chính xác.",
    remedyType: "contract_update",
    rootCauseVi:
      "Contract không chặn được lời khen giả, hoặc Mercy được prompt " +
      "yêu cầu 'luôn khích lệ người học' mà không có điều kiện ràng buộc.",
    examplesVi: [
      'Người học nói "I goes to school" → Mercy: "Rất tốt! Bạn giỏi quá!" (không sửa).',
      'Match score = 30, đầy lỗi → Mercy: "Tuyệt vời, bạn nói đúng hết rồi!"',
    ],
  },

  {
    failureId: "F-TEACH-04",
    titleVi: "Sửa lỗi gây mất thể diện",
    titleEn: "Face-threatening correction",
    dimensionId: "teaching",
    descriptionVi:
      "Mercy sửa lỗi theo cách khiến người học xấu hổ hoặc mất thể diện — " +
      "ví dụ: nhấn mạnh lỗi quá mức, so sánh với người khác, hoặc dùng " +
      "giọng điệu chê bai. Vi phạm quy tắc an toàn R8.",
    severity: "critical",
    detectability: "requires_review",
    detectionCriteriaVi: [
      "Correction chứa từ ngữ tiêu cực: 'sai rồi', 'không đúng', 'dở quá', 'học mãi mà vẫn sai'",
      "So sánh với người học khác: 'bạn khác làm được rồi'",
      "Giọng điệu mỉa mai hoặc chê bai",
      "Nhấn mạnh cùng một lỗi ≥3 lần trong buổi học",
    ],
    learnerImpactVi:
      "Người học xấu hổ, mất tự tin, có thể bỏ học vì cảm thấy bị đánh giá.",
    remedyVi:
      "Kích hoạt R8_FACE_SAVING. Yêu cầu mọi correction phải mở đầu bằng " +
      "lời khích lệ hoặc công nhận nỗ lực. Cấm so sánh với người học khác. " +
      "Dùng mẫu: 'Bạn đã cố gắng rất tốt! Một điểm nhỏ mình có thể cải thiện là...'",
    remedyType: "contract_update",
    rootCauseVi:
      "Contract thiếu quy tắc về giữ thể diện, hoặc prompt không có hướng dẫn " +
      "về văn hóa Việt Nam (thể diện rất quan trọng).",
    examplesVi: [
      '"Sai rồi! Tại sao lúc nào bạn cũng quên \'s\' vậy?"',
      '"Người học trước mình làm được rồi mà bạn vẫn chưa làm được à?"',
    ],
  },

  {
    failureId: "F-TEACH-05",
    titleVi: "Cho đáp án thay vì hướng dẫn",
    titleEn: "Answer-spooning instead of guiding",
    dimensionId: "teaching",
    descriptionVi:
      "Mercy đưa ra đáp án đúng ngay lập tức thay vì dẫn dắt người học " +
      "tự tìm ra câu trả lời. Điều này làm mất cơ hội học sâu và tư duy.",
    severity: "major",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "Correction được surfacing ngay lập tức (timingMode = 'IMMEDIATE') cho các lỗi nhỏ, không ảnh hưởng nghĩa",
      "≥70% correction là 'IMMEDIATE' thay vì 'DELAYED', 'FOLLOW_UP_FIRST', hoặc 'EXPLAIN_PATTERN'",
      "Không có guiding mode nào (FOLLOW_UP_FIRST, EXPLAIN_PATTERN) được dùng trong cả buổi học dù có cơ hội",
      "Giải thích chứa đáp án đầy đủ thay vì gợi ý từng bước",
    ],
    learnerImpactVi:
      "Người học không phải suy nghĩ, không nhớ lâu, và phụ thuộc vào Mercy thay vì tự sửa.",
    remedyVi:
      "Điều chỉnh timing policy: ưu tiên 'hint' cho lỗi nhỏ, 'delayed' cho lỗi vừa, " +
      "chỉ 'immediate' cho lỗi nghiêm trọng ảnh hưởng nghĩa. Thêm bước: " +
      "'Trước khi đưa đáp án, hãy thử gợi ý trước.'",
    remedyType: "adjust_timing_policy",
    rootCauseVi:
      "Timing policy thiên về 'immediate' để tối ưu trải nghiệm, " +
      "nhưng đánh đổi mất cơ hội học sâu.",
    examplesVi: [
      'Người học nói "I go yesterday" → Mercy ngay: "Phải là I went yesterday." (đáng lẽ nên gợi ý: "Hôm qua là quá khứ, động từ cần...")',
      "Cả buổi — 12/12 correction đều IMMEDIATE, 0 guiding mode.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // MEMORY FAILURES (F-MEM)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    failureId: "F-MEM-01",
    titleVi: "Mất trí nhớ người học",
    titleEn: "Learner amnesia",
    dimensionId: "memory",
    descriptionVi:
      "Mercy không nhớ gì về người học — không biết điểm mạnh, điểm yếu, " +
      "hay lịch sử học tập. Mỗi buổi học như buổi đầu tiên, không có " +
      "tính liên tục. Đây là lỗi phổ biến nhất của AI tutor.",
    severity: "critical",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "Memory snapshot = null hoặc rỗng (không strengths, không needsReview)",
      "Session không reference đến bất kỳ weakness nào từ session trước",
      "totalCorrections trong memory = 0 nhưng đã có ≥1 session trước đó",
      "Không có nextRecommendedFocus",
    ],
    learnerImpactVi:
      "Người học cảm thấy Mercy không quan tâm đến mình. Phải lặp lại những gì đã học.",
    remedyVi:
      "Kiểm tra pipeline lưu trữ memory — đảm bảo memory được persist sau mỗi session. " +
      "Kiểm tra memory retrieval — đảm bảo session mới load được memory cũ. " +
      "Nếu là người dùng mới thực sự, đánh dấu rõ 'first_session'.",
    remedyType: "data_fix",
    rootCauseVi:
      "Memory không được lưu hoặc không được load giữa các session. " +
      "Có thể do bug trong persistence layer hoặc sai user ID.",
    examplesVi: [
      "Buổi 3 — Mercy vẫn hỏi 'Bạn đã học tiếng Anh bao lâu rồi?'",
      "Memory snapshot rỗng dù learner đã có 5 buổi học trước đó.",
    ],
  },

  {
    failureId: "F-MEM-02",
    titleVi: "Bộ nhớ cũ, không cập nhật",
    titleEn: "Stale memory",
    dimensionId: "memory",
    descriptionVi:
      "Mercy có nhớ về người học nhưng thông tin đã cũ (>7 ngày không cập nhật). " +
      "Điểm yếu đã được khắc phục vẫn bị nhắc lại, điểm mạnh mới không được ghi nhận.",
    severity: "major",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "lastUpdatedAt > 7 ngày so với thời điểm session hiện tại",
      "Memory chứa weakness tag mà session hiện tại không còn xuất hiện",
      "Confidence trend không thay đổi qua ≥3 session",
    ],
    learnerImpactVi:
      "Mercy nhắc đến lỗi cũ đã sửa được → người học thấy Mercy không theo dõi sát.",
    remedyVi:
      "Cập nhật memory sau mỗi session. Thêm timestamp vào mỗi memory entry. " +
      "Cảnh báo nếu memory > 7 ngày không được cập nhật.",
    remedyType: "retrain_memory",
    rootCauseVi:
      "Memory update không được trigger sau session, hoặc logic update " +
      "chỉ ghi đè khi có thay đổi lớn.",
    examplesVi: [
      "Memory lastUpdatedAt = 15 ngày trước. Người học đã tiến bộ nhiều nhưng Mercy không biết.",
      "Mercy nhắc 'bạn hay quên \'s\' lắm' dù 3 buổi gần đây learner không còn mắc lỗi này.",
    ],
  },

  {
    failureId: "F-MEM-03",
    titleVi: "Nhầm lẫn người học",
    titleEn: "Learner confusion",
    dimensionId: "memory",
    descriptionVi:
      "Mercy nhầm lẫn giữa các người học — áp dụng memory của người A cho người B. " +
      "Cực kỳ nguy hiểm vì đưa ra lời khuyên sai đối tượng.",
    severity: "critical",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "Memory chứa weakness không khớp với bất kỳ session nào của learner hiện tại",
      "Strengths trong memory mâu thuẫn với performance trong session hiện tại",
      "Correction pattern không khớp với lịch sử lỗi của learner",
    ],
    learnerImpactVi:
      "Mercy nói về những lỗi người học chưa từng mắc, hoặc bỏ qua lỗi thường xuyên.",
    remedyVi:
      "Kiểm tra khóa user ID trong memory lookup. Đảm bảo memory được " +
      "scope chính xác theo user_id. Thêm assertion: weakness tags trong " +
      "memory phải xuất hiện ít nhất 1 lần trong lịch sử learner.",
    remedyType: "data_fix",
    rootCauseVi:
      "Bug trong lookup memory — dùng sai user ID, hoặc memory store " +
      "không phân biệt đúng user.",
    examplesVi: [
      "Mercy nói 'Bạn hay sai giới từ lắm' nhưng learner này chưa từng sai giới từ.",
      "Memory reference đến lỗi phát âm giọng miền Trung nhưng learner là người Hà Nội.",
    ],
  },

  {
    failureId: "F-MEM-04",
    titleVi: "Bỏ qua điểm yếu đã biết",
    titleEn: "Ignoring known weaknesses",
    dimensionId: "memory",
    descriptionVi:
      "Mercy có memory về điểm yếu của learner nhưng không áp dụng trong buổi học. " +
      "Ví dụ: biết learner yếu phát âm 'th' nhưng không chú ý sửa khi learner mắc lỗi này.",
    severity: "major",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "Memory có ≥1 needsReview, nhưng không weakness tag nào trong session khớp",
      "Learner mắc lỗi đã được ghi trong memory, nhưng Mercy không correction",
      "NextRecommendedFocus trong memory không được nhắc đến trong session",
    ],
    learnerImpactVi:
      "Người học tiếp tục mắc lỗi cũ. Mercy như 'biết mà không nói' — thiếu trách nhiệm.",
    remedyVi:
      "Thêm bước: đầu mỗi session, đọc memory và tạo checklist các điểm cần chú ý. " +
      "Trong prompt, yêu cầu Mercy ưu tiên sửa các lỗi đã được ghi trong memory.",
    remedyType: "prompt_fix",
    rootCauseVi:
      "Memory được load nhưng không được inject vào prompt giảng dạy, " +
      "hoặc Mercy không được hướng dẫn ưu tiên sửa lỗi từ memory.",
    examplesVi: [
      "Memory: learner yếu 'th/s/sh'. Trong session, learner nói 'sink' thay vì 'think' → Mercy bỏ qua.",
      "NextRecommendedFocus = 'past tense' nhưng cả buổi không có reference nào đến past tense.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADAPTATION FAILURES (F-ADAPT)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    failureId: "F-ADAPT-01",
    titleVi: "Độ khó không thay đổi",
    titleEn: "Rigid difficulty",
    dimensionId: "adaptation",
    descriptionVi:
      "Mercy không điều chỉnh độ khó dựa trên performance của người học. " +
      "Dù learner trả lời đúng hết hay sai hết, độ khó vẫn giữ nguyên. " +
      "Quá dễ → chán. Quá khó → nản.",
    severity: "major",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "Không có sự thay đổi về số lượng correction giữa nửa đầu và nửa sau buổi học (chênh lệch < 10%)",
      "Match score trung bình nửa sau không thay đổi so với nửa đầu (chênh lệch < 5 điểm)",
      "Weakness tags vẫn giữ nguyên số lượng và loại qua toàn bộ session",
      "Không có difficultyAdjusted = true trong review packet",
    ],
    learnerImpactVi:
      "Người học không được thử thách đúng mức — quá dễ gây chán, quá khó gây nản.",
    remedyVi:
      "Thêm cơ chế dynamic difficulty: sau mỗi 5 turn, đánh giá performance và " +
      "điều chỉnh. Nếu ≥80% đúng → tăng độ khó. Nếu ≤40% đúng → giảm độ khó. " +
      "Ghi nhận sự điều chỉnh trong observation.",
    remedyType: "adjust_timing_policy",
    rootCauseVi:
      "Không có cơ chế theo dõi performance để trigger điều chỉnh, " +
      "hoặc lesson plan được fix cứng không cho phép thay đổi.",
    examplesVi: [
      "10 turn liên tiếp learner đúng hết → Mercy vẫn cho bài tập cùng độ khó.",
      "Learner sai 7/10 turn → Mercy không giảm độ khó, tiếp tục bài khó.",
    ],
  },

  {
    failureId: "F-ADAPT-02",
    titleVi: "Không giảm can thiệp khi learner tiến bộ",
    titleEn: "Not reducing intervention on progress",
    dimensionId: "adaptation",
    descriptionVi:
      "Mercy tiếp tục sửa lỗi với tần suất cao dù learner đã cải thiện rõ rệt. " +
      "Đáng lẽ càng về cuối buổi, Mercy nên để learner tự do hơn, ít can thiệp hơn.",
    severity: "minor",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "Tỉ lệ correction nửa sau ≥ tỉ lệ nửa đầu (không giảm)",
      "Match score nửa sau tăng ≥10 điểm nhưng correction vẫn nhiều",
      "Correction rate không đổi qua 3+ session liên tiếp dù match score tăng",
    ],
    learnerImpactVi:
      "Người học bị 'bám đuôi' — đã giỏi hơn nhưng vẫn bị sửa như cũ, mất tự do.",
    remedyVi:
      "Thêm cơ chế fading: khi match score > 70 trong 3 turn liên tiếp, " +
      "giảm 50% correction. Khi > 85, chỉ sửa lỗi nghiêm trọng.",
    remedyType: "adjust_timing_policy",
    rootCauseVi:
      "Timing policy không có cơ chế fading — Mercy sửa lỗi với cùng " +
      "tần suất bất kể trình độ thực tế của learner.",
    examplesVi: [
      "Nửa đầu: match score = 45. Nửa sau: match score = 78. Correction rate không giảm.",
      "Session 5: learner đã giỏi hơn nhiều, nhưng correction rate vẫn 80%.",
    ],
  },

  {
    failureId: "F-ADAPT-03",
    titleVi: "Không chuyển sang tiếng Việt khi cần",
    titleEn: "Not switching to Vietnamese when needed",
    dimensionId: "adaptation",
    descriptionVi:
      "Mercy tiếp tục giải thích bằng tiếng Anh dù learner rõ ràng không hiểu " +
      "(match score thấp, learner yêu cầu giải thích lại). Người Việt học " +
      "tiếng Anh cần được giải thích ngữ pháp phức tạp bằng tiếng Việt.",
    severity: "major",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "Match score < 50 trong ≥3 turn liên tiếp nhưng giải thích vẫn bằng tiếng Anh hoàn toàn",
      "Learner hỏi lại 'là sao ạ?' hoặc 'em không hiểu' nhưng Mercy vẫn trả lời bằng tiếng Anh",
      "≥2 'unclear' hoặc 'confused' signal từ learner mà không chuyển ngôn ngữ",
    ],
    learnerImpactVi:
      "Người học không hiểu giải thích → không học được gì từ lỗi sai.",
    remedyVi:
      "Thêm quy tắc: nếu match score < 50 hoặc learner yêu cầu giải thích lại, " +
      "tự động chuyển giải thích sang tiếng Việt. Prompt phải nhấn mạnh: " +
      "'Giải thích ngữ pháp phức tạp LUÔN dùng tiếng Việt.'",
    remedyType: "prompt_fix",
    rootCauseVi:
      "Prompt không có quy tắc chuyển ngôn ngữ dựa trên mức độ hiểu của learner, " +
      "hoặc Mercy mặc định dùng tiếng Anh như một AI tutor phổ thông.",
    examplesVi: [
      "Learner nói 'Em không hiểu ạ' → Mercy trả lời bằng tiếng Anh dài dòng.",
      "Giải thích past perfect tense bằng tiếng Anh cho learner A2.",
    ],
  },

  {
    failureId: "F-ADAPT-04",
    titleVi: "Tốc độ không phù hợp",
    titleEn: "Pace mismatch",
    dimensionId: "adaptation",
    descriptionVi:
      "Mercy dạy quá nhanh (learner chưa kịp hiểu đã chuyển bài) hoặc quá chậm " +
      "(learner đã sẵn sàng nhưng Mercy vẫn lặp lại).",
    severity: "minor",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "≤1 turn giữa correction và bài tiếp theo — learner không có thời gian xử lý (quá nhanh)",
      "≥5 correction cho cùng một loại lỗi mà không tăng độ khó (quá chậm)",
      "Số turn trung bình cho mỗi chủ đề < 3 hoặc > 10",
    ],
    learnerImpactVi:
      "Quá nhanh → learner không theo kịp. Quá chậm → learner chán và mất thời gian.",
    remedyVi:
      "Theo dõi acknowledgment rate: nếu learner không acknowledge correction, " +
      "chậm lại. Nếu acknowledgment rate > 90% và match score > 80, tăng tốc.",
    remedyType: "adjust_timing_policy",
    rootCauseVi:
      "Không có pacing algorithm dựa trên learner response time và acknowledgment rate.",
    examplesVi: [
      "Mercy đưa 5 bài tập trong 2 phút — learner chưa kịp đọc đã chuyển.",
      "Mercy sửa cùng 1 lỗi 8 lần — learner đã sửa được từ lần thứ 3.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SELF-CHECK FAILURES (F-SELF)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    failureId: "F-SELF-01",
    titleVi: "Không tự kiểm tra trước khi trả lời",
    titleEn: "No self-audit before responding",
    dimensionId: "selfCheck",
    descriptionVi:
      "Mercy gửi câu trả lời cho learner mà không tự kiểm tra chất lượng " +
      "trước. Không chạy contract check, không chạy rubric. Giống như " +
      "giáo viên nói mà không suy nghĩ.",
    severity: "critical",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "auditCount = 0 trong review packet",
      "Không có AuditResult nào được tạo trong session",
      "overclaimGuardActive = false",
      "Rubric result = null khi có ≥1 tutor response",
    ],
    learnerImpactVi:
      "Learner nhận được câu trả lời chưa được kiểm duyệt — có thể chứa lỗi hoặc " +
      "nội dung không an toàn.",
    remedyVi:
      "Đảm bảo auditResponse() được gọi TRƯỚC MỖI tutor response. " +
      "Thêm assertion trong code: nếu audit chưa chạy, không gửi response.",
    remedyType: "contract_update",
    rootCauseVi:
      "Pipeline không tích hợp audit gate, hoặc audit gate bị skip " +
      "trong một số code path (vd: fallback response).",
    examplesVi: [
      "Mercy trả lời 15 turn nhưng không có audit result nào được log.",
      "Rubric result = null cho toàn bộ session.",
    ],
  },

  {
    failureId: "F-SELF-02",
    titleVi: "Giả vờ chắc chắn",
    titleEn: "Fake certainty",
    dimensionId: "selfCheck",
    descriptionVi:
      "Mercy khẳng định điều gì đó một cách chắc chắn dù thực tế không có " +
      "đủ cơ sở. Ví dụ: khẳng định một cách dùng từ là 'luôn luôn đúng' " +
      "trong khi thực tế có ngoại lệ. Vi phạm quy tắc O1-O8 (overclaim).",
    severity: "critical",
    detectability: "requires_review",
    detectionCriteriaVi: [
      "Tutor response chứa từ khẳng định tuyệt đối ('luôn luôn', 'không bao giờ', 'tất cả', 'chắc chắn 100%')",
      "Correction confidence = 1.0 nhưng correction đó thực sự gây tranh cãi",
      "Không có caveat hoặc disclaimer cho các quy tắc có ngoại lệ",
    ],
    learnerImpactVi:
      "Người học tin vào thông tin sai lệch hoặc quá đơn giản hóa → áp dụng sai.",
    remedyVi:
      "Thêm overclaim guard: cấm dùng từ tuyệt đối trừ khi quy tắc thực sự " +
      "không có ngoại lệ. Yêu cầu thêm caveat: 'Thường thì...', 'Đa số trường hợp...' " +
      "cho các quy tắc có ngoại lệ.",
    remedyType: "contract_update",
    rootCauseVi:
      "Không có overclaim guard, hoặc prompt khuyến khích Mercy 'trả lời tự tin' " +
      "mà không cân nhắc đến độ chính xác.",
    examplesVi: [
      '"Từ \'the\' luôn luôn đứng trước danh từ xác định." (thực tế có ngoại lệ)',
      'Correction confidence = 1.0: "Câu này chắc chắn 100% là sai." (quá tự tin)',
    ],
  },

  {
    failureId: "F-SELF-03",
    titleVi: "Cho qua câu trả lời không an toàn",
    titleEn: "Passing unsafe responses",
    dimensionId: "selfCheck",
    descriptionVi:
      "Mercy tự kiểm tra nhưng vẫn cho qua câu trả lời có vi phạm an toàn. " +
      "Audit gate báo không an toàn nhưng Mercy vẫn gửi cho learner.",
    severity: "critical",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "auditsPassed < auditCount (có audit fail) nhưng response vẫn được gửi",
      "safetyFailures > 0 — vi phạm an toàn bị bỏ qua",
      "contract có R3/R7/R8 violations nhưng không bị block",
    ],
    learnerImpactVi:
      "Người học nhận được nội dung không an toàn — khen giả, mất thể diện, " +
      "hoặc thông tin sai.",
    remedyVi:
      "Chuyển audit gate sang BLOCK_UNSAFE mode. Nếu safety failure, " +
      "KHÔNG gửi response — thay vào đó gửi fallback an toàn hoặc yêu cầu " +
      "Mercy viết lại.",
    remedyType: "contract_update",
    rootCauseVi:
      "Audit gate đang ở chế độ 'audit' (chỉ log, không chặn) " +
      "thay vì 'block_unsafe'.",
    examplesVi: [
      "Audit: R3_NO_FAKE_PRAISE → FAILED. Nhưng response vẫn được gửi cho learner.",
      "3 safety failures trong session, tất cả đều đến được learner.",
    ],
  },

  {
    failureId: "F-SELF-04",
    titleVi: "Tự đánh giá không khớp thực tế",
    titleEn: "Self-assessment mismatch",
    dimensionId: "selfCheck",
    descriptionVi:
      "Mercy tự đánh giá response của mình là tốt (rubric classification = " +
      "'exemplary'), nhưng Chau đánh giá response đó có vấn đề. Khoảng cách " +
      "giữa tự đánh giá và đánh giá thực tế quá lớn.",
    severity: "major",
    detectability: "requires_review",
    detectionCriteriaVi: [
      "Rubric tự đánh giá: 'exemplary' nhưng Chau review: 'needs_improvement' hoặc 'concerning'",
      "≥3 dimension trong rubric tự đánh giá score=3 nhưng Chau score=1",
      "Tự đánh giá tổng thể lệch ≥2 bậc so với Chau đánh giá",
    ],
    learnerImpactVi:
      "Mercy không nhận thức được chất lượng thực sự của mình → không cải thiện.",
    remedyVi:
      "So sánh rubric tự đánh giá với Chau review packet. Nếu lệch > 1 bậc, " +
      "gắn cờ để Chau xem xét. Phân tích pattern: Mercy thiên về tự đánh giá " +
      "quá cao hay quá thấp? Điều chỉnh prompt tự đánh giá.",
    remedyType: "escalate_to_chau",
    rootCauseVi:
      "Prompt tự đánh giá quá dễ dãi, hoặc Mercy không có đủ tiêu chí " +
      "khách quan để tự đánh giá chính xác.",
    examplesVi: [
      "Mercy tự chấm: xuất sắc (3/3). Chau chấm: cần cải thiện (1/3).",
      "Cả 6 dimension tự đánh giá đều score=3, nhưng Chau thấy 4/6 ở mức 1.",
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LEARNING GAIN FAILURES (F-GAIN)
  // ═══════════════════════════════════════════════════════════════════════════

  {
    failureId: "F-GAIN-01",
    titleVi: "Không có tiến bộ đo được",
    titleEn: "No measurable progress",
    dimensionId: "learningGain",
    descriptionVi:
      "Sau buổi học, không có bằng chứng nào cho thấy learner đã cải thiện. " +
      "Match score không tăng, correction rate không giảm, weakness tags " +
      "không giảm. Buổi học không tạo ra giá trị.",
    severity: "critical",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "LearningGainResult.sufficientData = true nhưng overall classification = 'no_measurable_gain' hoặc 'regression'",
      "Không có improvement dimension nào có score ≥ 2",
      "Tất cả 7 learning gain dimension đều score ≤ 1",
      "Match score cuối buổi ≤ match score đầu buổi",
    ],
    learnerImpactVi:
      "Người học đầu tư thời gian nhưng không tiến bộ. Sẽ bỏ học.",
    remedyVi:
      "Phân tích nguyên nhân gốc: có phải do chẩn đoán sai? Dạy không hiệu quả? " +
      "Không thích ứng? Xem failure nào dominate nhất trong session và sửa " +
      "nguyên nhân gốc trước khi đánh giá lại.",
    remedyType: "escalate_to_chau",
    rootCauseVi:
      "Thường là hậu quả của nhiều failure khác cộng dồn — " +
      "chẩn đoán sai + dạy kém + không thích ứng = không tiến bộ.",
    examplesVi: [
      "Buổi 45 phút — match score đầu: 52, cuối: 51. Không thay đổi.",
      "Learning gain: 'no_measurable_gain' dù session có 20 turn.",
    ],
  },

  {
    failureId: "F-GAIN-02",
    titleVi: "Thụt lùi",
    titleEn: "Regression",
    dimensionId: "learningGain",
    descriptionVi:
      "Người học tệ đi sau buổi học — mắc nhiều lỗi hơn, match score giảm, " +
      "hoặc bắt đầu mắc lỗi mới mà trước đây không có. Buổi học gây hại.",
    severity: "critical",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "Learning gain overall = 'regression'",
      "Match score nửa sau thấp hơn nửa đầu ≥10 điểm",
      "Correction rate nửa sau cao hơn nửa đầu ≥30%",
      "Ít nhất 1 learning gain dimension score = 0 (declining)",
    ],
    learnerImpactVi:
      "Người học tệ hơn sau buổi học — mất tự tin nghiêm trọng, có thể bỏ học vĩnh viễn.",
    remedyVi:
      "Dừng ngay pattern dạy hiện tại. Kiểm tra: có phải Mercy đang nhồi nhét " +
      "quá nhiều? Sửa quá nhiều gây quá tải? Chuyển sang session 'chữa lành': " +
      "ôn tập nhẹ nhàng, tập trung vào điểm mạnh.",
    remedyType: "escalate_to_chau",
    rootCauseVi:
      "Mercy dạy quá nhiều, quá nhanh, gây quá tải. Hoặc Mercy sửa sai " +
      "(ghost corrections) khiến learner học sai.",
    examplesVi: [
      "Đầu buổi: match score = 68. Cuối buổi: match score = 41.",
      "Classification: 'regression' — learner bắt đầu mắc lỗi mới.",
    ],
  },

  {
    failureId: "F-GAIN-03",
    titleVi: "Tiến bộ ảo",
    titleEn: "Placebo gain",
    dimensionId: "learningGain",
    descriptionVi:
      "Dữ liệu cho thấy có vẻ learner tiến bộ, nhưng thực chất là do " +
      "bài tập quá dễ, hoặc match score tăng do may mắn (ít mẫu). " +
      "Tiến bộ không có ý nghĩa thống kê.",
    severity: "minor",
    detectability: "requires_review",
    detectionCriteriaVi: [
      "Learning gain 'significant_gain' nhưng chỉ dựa trên < 5 turn so sánh",
      "Match score tăng nhưng độ khó bài tập giảm rõ rệt",
      "Chỉ 1-2 dimension cải thiện, còn lại không đổi — thiếu consistency",
      "Gain được phát hiện trong session đầu tiên (chưa có baseline thực sự)",
    ],
    learnerImpactVi:
      "Cảm giác tiến bộ giả tạo → khi gặp bài khó thực tế, learner sẽ thất vọng.",
    remedyVi:
      "Yêu cầu ít nhất 8 turn để tính learning gain. So sánh với độ khó " +
      "bài tập — nếu độ khó giảm >20%, không tính là gain. " +
      "Đánh dấu gain là 'tentative' nếu dữ liệu < 10 turn.",
    remedyType: "data_fix",
    rootCauseVi:
      "Learning gain calculation không kiểm soát độ khó, hoặc sample size " +
      "quá nhỏ dẫn đến kết luận sai.",
    examplesVi: [
      "Gain = 'significant' dựa trên 3 turn đầu vs 3 turn cuối (quá ít).",
      "Match score tăng 20 điểm nhưng bài tập chuyển từ câu dài → câu ngắn.",
    ],
  },

  {
    failureId: "F-GAIN-04",
    titleVi: "Không đủ dữ liệu để đo tiến bộ",
    titleEn: "Insufficient data for gain measurement",
    dimensionId: "learningGain",
    descriptionVi:
      "Session quá ngắn hoặc quá ít turn để có thể đo lường tiến bộ " +
      "một cách có ý nghĩa. Learning gain result trả về 'insufficient_data'.",
    severity: "minor",
    detectability: "data_detectable",
    detectionCriteriaVi: [
      "< 8 events trong session",
      "LearningGainResult.sufficientData = false",
      "Session dài < 5 phút",
      "Không có đủ cả baseline và outcome snapshot",
    ],
    learnerImpactVi:
      "Không biết được buổi học có hiệu quả không. Lãng phí cơ hội đo lường.",
    remedyVi:
      "Khuyến khích session tối thiểu 10 turn. Nếu session quá ngắn, " +
      "gộp dữ liệu với session trước để có đủ mẫu. Đánh dấu 'not enough data' " +
      "thay vì cố tính gain từ dữ liệu ít.",
    remedyType: "data_fix",
    rootCauseVi:
      "Session quá ngắn (learner thoát sớm), hoặc pipeline đo lường " +
      "yêu cầu sample size tối thiểu chưa được đáp ứng.",
    examplesVi: [
      "Session có 4 turn — không đủ để so sánh trước/sau.",
      "sufficientData = false vì chỉ có baseline, không có outcome.",
    ],
  },

  {
    failureId: "F-GAIN-05",
    titleVi: "Tập trung sai chiều",
    titleEn: "Wrong dimension focus",
    dimensionId: "learningGain",
    descriptionVi:
      "Mercy tập trung cải thiện chiều này (vd: phát âm) trong khi learner " +
      "cần cải thiện chiều khác hơn (vd: ngữ pháp). Dẫn đến cải thiện không " +
      "đúng chỗ learner cần nhất.",
    severity: "major",
    detectability: "requires_review",
    detectionCriteriaVi: [
      "Memory có needsReview nhưng session tập trung vào dimension khác",
      "Dimension cải thiện nhất không khớp với điểm yếu lớn nhất của learner",
      "Learning gain dimension scores: dimension yếu nhất của learner = 0, " +
        "nhưng dimension mạnh nhất = 3 (Mercy cải thiện cái đã tốt)",
    ],
    learnerImpactVi:
      "Learner giỏi hơn ở cái đã giỏi, nhưng vẫn yếu ở cái cần cải thiện.",
    remedyVi:
      "Đảm bảo lesson sequence ưu tiên điểm yếu từ memory. " +
      "Trước mỗi session, chọn 1-2 weakness từ needsReview làm trọng tâm. " +
      "Không chọn dimension đã có score ≥ 2.5 làm trọng tâm.",
    remedyType: "prompt_fix",
    rootCauseVi:
      "Lesson planner không dùng memory để chọn trọng tâm, hoặc " +
      "Mercy mặc định tập trung vào dimension dễ dạy nhất.",
    examplesVi: [
      "Learner yếu ngữ pháp (needsReview: [past tense, articles]), nhưng Mercy tập trung phát âm.",
      "Pronunciation score = 3 (đã giỏi), Grammar score = 0 (vẫn yếu).",
    ],
  },
];

// ─── Failure Taxonomy Lookup ─────────────────────────────────────────────────

const FAILURE_INDEX: Map<string, TutorFailureMode> = new Map(
  TUTOR_FAILURE_TAXONOMY.map((f) => [f.failureId, f]),
);

/**
 * Get a failure mode by its ID.
 * Returns null if the failure ID doesn't exist.
 */
export function getFailureById(failureId: string): TutorFailureMode | null {
  return FAILURE_INDEX.get(failureId) ?? null;
}

/**
 * Get all failure modes for a specific teacher intelligence dimension.
 */
export function getFailuresByDimension(
  dimensionId: TeacherIntelligenceDimensionId,
): TutorFailureMode[] {
  return TUTOR_FAILURE_TAXONOMY.filter((f) => f.dimensionId === dimensionId);
}

/**
 * Get all failure modes of a specific severity.
 */
export function getFailuresBySeverity(
  severity: FailureSeverity,
): TutorFailureMode[] {
  return TUTOR_FAILURE_TAXONOMY.filter((f) => f.severity === severity);
}

/**
 * Get the complete failure taxonomy catalog.
 */
export function getFailureTaxonomyCatalog(): ReadonlyArray<TutorFailureMode> {
  return TUTOR_FAILURE_TAXONOMY;
}

// ─── Detection Functions ─────────────────────────────────────────────────────

/**
 * Context passed to failure detection functions.
 */
export interface FailureDetectionContext {
  events: TranscriptCorrectionEvent[];
  auditResults: AuditResult[];
  rubricResult: RubricResult | null;
  memorySnapshot: ChauMemorySnapshot | null;
  sessionId: string;
}

/**
 * Detect F-DIAG-01: Missed errors
 */
function detectMissedErrors(ctx: FailureDetectionContext): FailureDetectionResult {
  const failure = getFailureById("F-DIAG-01")!;
  const evidence: string[] = [];
  const detectedAt: Array<{ turnNumber: number; timestamp: number }> = [];

  const events = ctx.events;
  if (events.length < 3) {
    return { failureMode: failure, detected: false, confidence: 0, evidenceVi: ["⚠ Không đủ lượt để phát hiện."], occurrenceCount: 0, detectedAt: [] };
  }

  // Check match scores
  const scores = events
    .map((e) => e.matchScore)
    .filter((s): s is number => s !== null);
  const avgScore =
    scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 100;

  let missedCount = 0;
  for (const e of events) {
    if (e.corrections.length === 0 && (e.matchScore ?? 100) < 60) {
      missedCount++;
      detectedAt.push({ turnNumber: e.turnNumber, timestamp: e.timestamp });
    }
  }

  const correctionRate =
    events.filter((e) => e.corrections.length > 0).length / events.length;
  const weaknessTagsTotal = events.flatMap((e) => e.weaknessTags).length;

  if (avgScore < 60 && correctionRate < 0.3) {
    evidence.push(
      `⚠ Điểm trung bình thấp (${Math.round(avgScore)}) nhưng tỉ lệ sửa lỗi chỉ ${Math.round(correctionRate * 100)}% — Mercy bỏ sót nhiều lỗi.`,
    );
  }

  if (missedCount >= 3) {
    evidence.push(
      `⚠ ${missedCount} lượt có điểm < 60 nhưng không được sửa lỗi.`,
    );
  }

  if (events.length >= 5 && weaknessTagsTotal === 0) {
    evidence.push(
      `⚠ ${events.length} lượt nhưng không có weakness tag nào được gắn.`,
    );
  }

  const detected = evidence.length > 0;

  return {
    failureMode: failure,
    detected,
    confidence: detected ? Math.min(0.9, missedCount / events.length + 0.3) : 0,
    evidenceVi: evidence.length > 0 ? evidence : ["✓ Mercy phát hiện lỗi tốt."],
    occurrenceCount: missedCount,
    detectedAt,
  };
}

/**
 * Detect F-DIAG-03: Ghost corrections
 */
function detectGhostCorrections(ctx: FailureDetectionContext): FailureDetectionResult {
  const failure = getFailureById("F-DIAG-03")!;
  const evidence: string[] = [];
  const detectedAt: Array<{ turnNumber: number; timestamp: number }> = [];

  let ghostCount = 0;

  for (const e of ctx.events) {
    for (const c of e.corrections) {
      // Check if original and corrected are nearly identical
      const original = c.originalToken.trim().toLowerCase();
      const corrected = c.correctedToken.trim().toLowerCase();

      if (original === corrected) {
        ghostCount++;
        detectedAt.push({ turnNumber: e.turnNumber, timestamp: e.timestamp });
      } else {
        // Simple Levenshtein-like check: very short edit distance
        const lenDiff = Math.abs(original.length - corrected.length);
        const minLen = Math.min(original.length, corrected.length);
        if (minLen > 3 && lenDiff <= 1 && c.confidence > 0.7) {
          // Suspicious — nearly identical but with high confidence
          ghostCount++;
          detectedAt.push({ turnNumber: e.turnNumber, timestamp: e.timestamp });
        }
      }
    }
  }

  if (ghostCount > 0) {
    evidence.push(
      `⚠ ${ghostCount} correction có vẻ không cần thiết — original và corrected gần như giống hệt.`,
    );
  }

  // Check semantic-implausibility overuse
  const semanticCorrections = ctx.events.flatMap((e) =>
    e.corrections.filter((c) => c.source === "semantic-implausibility"),
  );
  if (semanticCorrections.length >= 2) {
    evidence.push(
      `⚠ ${semanticCorrections.length} correction từ 'semantic-implausibility' — kiểm tra xem có thực sự phi lý không.`,
    );
  }

  return {
    failureMode: failure,
    detected: ghostCount > 0,
    confidence: ghostCount > 2 ? 0.8 : ghostCount > 0 ? 0.5 : 0,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : ["✓ Không phát hiện sửa lỗi ảo."],
    occurrenceCount: ghostCount,
    detectedAt,
  };
}

/**
 * Detect F-DIAG-04: Low-confidence corrections
 */
function detectLowConfidenceCorrections(
  ctx: FailureDetectionContext,
): FailureDetectionResult {
  const failure = getFailureById("F-DIAG-04")!;
  const evidence: string[] = [];
  const detectedAt: Array<{ turnNumber: number; timestamp: number }> = [];

  const allCorrections = ctx.events.flatMap((e) => e.corrections);
  if (allCorrections.length === 0) {
    return {
      failureMode: failure,
      detected: false,
      confidence: 0,
      evidenceVi: ["✓ Không có correction nào."],
      occurrenceCount: 0,
      detectedAt: [],
    };
  }

  const lowConf = allCorrections.filter((c) => c.confidence < 0.5);
  const lowConfRate = lowConf.length / allCorrections.length;

  if (lowConfRate > 0.4) {
    evidence.push(
      `⚠ ${Math.round(lowConfRate * 100)}% correction có confidence < 0.5 (${lowConf.length}/${allCorrections.length}) — Mercy không chắc về chẩn đoán.`,
    );
  }

  const avgConf =
    allCorrections.reduce((s, c) => s + c.confidence, 0) / allCorrections.length;
  if (avgConf < 0.5 && allCorrections.length >= 5) {
    evidence.push(
      `⚠ Độ tự tin trung bình thấp (${Math.round(avgConf * 100)}%) trên ${allCorrections.length} correction.`,
    );
  }

  return {
    failureMode: failure,
    detected: lowConfRate > 0.4 || (avgConf < 0.5 && allCorrections.length >= 5),
    confidence: lowConfRate > 0.6 ? 0.9 : lowConfRate > 0.4 ? 0.7 : 0,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : [`✓ Độ tự tin sửa lỗi ổn (trung bình ${Math.round(avgConf * 100)}%).`],
    occurrenceCount: lowConf.length,
    detectedAt,
  };
}

/**
 * Detect F-DIAG-05: Single-source correction bias
 */
function detectSingleSourceBias(ctx: FailureDetectionContext): FailureDetectionResult {
  const failure = getFailureById("F-DIAG-05")!;
  const evidence: string[] = [];

  const allCorrections = ctx.events.flatMap((e) => e.corrections);
  if (allCorrections.length < 5) {
    return {
      failureMode: failure,
      detected: false,
      confidence: 0,
      evidenceVi: ["⚠ Chưa đủ correction để đánh giá đa dạng nguồn."],
      occurrenceCount: 0,
      detectedAt: [],
    };
  }

  const sourceCounts: Record<string, number> = {};
  for (const c of allCorrections) {
    sourceCounts[c.source] = (sourceCounts[c.source] ?? 0) + 1;
  }

  const sources = Object.keys(sourceCounts);
  const topSource = sources.sort((a, b) => sourceCounts[b] - sourceCounts[a])[0];
  const topRatio = sourceCounts[topSource] / allCorrections.length;

  if (sources.length === 1) {
    evidence.push(
      `⚠ Chỉ dùng 1 nguồn sửa lỗi: "${topSource}" cho tất cả ${allCorrections.length} correction.`,
    );
  } else if (topRatio > 0.8) {
    evidence.push(
      `⚠ ${Math.round(topRatio * 100)}% correction từ cùng một nguồn "${topSource}" — thiếu đa dạng.`,
    );
  }

  // Check for missing vietlish source (important for Vietnamese learners)
  if (!sources.includes("vietlish-pattern") && ctx.events.length >= 5) {
    evidence.push(
      "⚠ Không có correction vietlish nào — có thể bỏ sót lỗi do ảnh hưởng tiếng Việt.",
    );
  }

  return {
    failureMode: failure,
    detected: sources.length === 1 || topRatio > 0.8,
    confidence: sources.length === 1 ? 0.9 : topRatio > 0.8 ? 0.7 : 0,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : [`✓ ${sources.length} nguồn sửa lỗi khác nhau — đa dạng.`],
    occurrenceCount: sources.length === 1 ? allCorrections.length : 0,
    detectedAt: [],
  };
}

/**
 * Detect F-TEACH-02: Over-correction
 */
function detectOverCorrection(ctx: FailureDetectionContext): FailureDetectionResult {
  const failure = getFailureById("F-TEACH-02")!;
  const evidence: string[] = [];
  const detectedAt: Array<{ turnNumber: number; timestamp: number }> = [];

  let overCorrectionTurns = 0;
  for (const e of ctx.events) {
    if (e.corrections.length > 3) {
      overCorrectionTurns++;
      detectedAt.push({ turnNumber: e.turnNumber, timestamp: e.timestamp });
    }
  }

  const totalTurns = ctx.events.length;
  const correctionRate =
    totalTurns > 0
      ? ctx.events.filter((e) => e.corrections.length > 0).length / totalTurns
      : 0;

  if (overCorrectionTurns > 0) {
    evidence.push(
      `⚠ ${overCorrectionTurns} lượt có >3 correction — Mercy sửa quá nhiều cùng lúc.`,
    );
  }

  if (correctionRate > 0.8 && totalTurns >= 5) {
    evidence.push(
      `⚠ ${Math.round(correctionRate * 100)}% lượt bị sửa lỗi — người học bị sửa gần như mọi lúc.`,
    );
  }

  return {
    failureMode: failure,
    detected: overCorrectionTurns > 0 || correctionRate > 0.8,
    confidence: overCorrectionTurns >= 3 ? 0.9 : overCorrectionTurns > 0 ? 0.7 : correctionRate > 0.8 ? 0.6 : 0,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : [`✓ Mật độ sửa lỗi phù hợp (${Math.round(correctionRate * 100)}% lượt).`],
    occurrenceCount: overCorrectionTurns,
    detectedAt,
  };
}

/**
 * Detect F-TEACH-03: Fake praise
 */
function detectFakePraise(ctx: FailureDetectionContext): FailureDetectionResult {
  const failure = getFailureById("F-TEACH-03")!;
  const evidence: string[] = [];

  // This requires audit results with R3_NO_FAKE_PRAISE violations
  const praiseViolations = ctx.auditResults.filter(
    (a) =>
      !a.safe &&
      a.contractResult.rules.some(
        (c: ContractRuleCheck) =>
          c.ruleId === "R3_NO_FAKE_PRAISE" && !c.passed,
      ),
  );

  if (praiseViolations.length > 0) {
    evidence.push(
      `⚠ ${praiseViolations.length} vi phạm R3_NO_FAKE_PRAISE — Mercy khen câu trả lời không xứng đáng.`,
    );
  }

  // Heuristic: look at events with low match score but any praise words in the same session
  // (This is a heuristic since we can't access the exact tutor response text from events alone.
  //  For precise detection, always pair with audit results.)
  if (ctx.auditResults.length === 0 && ctx.events.length > 0) {
    evidence.push(
      "⚠ Không có audit result — không thể xác nhận R3_NO_FAKE_PRAISE. Chạy audit gate để kiểm tra.",
    );
  }

  return {
    failureMode: failure,
    detected: praiseViolations.length > 0,
    confidence: praiseViolations.length > 0 ? 0.9 : 0,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : ["✓ Không phát hiện khen giả (R3_NO_FAKE_PRAISE passed)."],
    occurrenceCount: praiseViolations.length,
    detectedAt: [],
  };
}

/**
 * Detect F-TEACH-05: Answer-spooning (no hints, all immediate)
 */
function detectAnswerSpooning(ctx: FailureDetectionContext): FailureDetectionResult {
  const failure = getFailureById("F-TEACH-05")!;
  const evidence: string[] = [];
  const detectedAt: Array<{ turnNumber: number; timestamp: number }> = [];

  const eventsWithCorrections = ctx.events.filter(
    (e) => e.corrections.length > 0,
  );

  if (eventsWithCorrections.length === 0) {
    return {
      failureMode: failure,
      detected: false,
      confidence: 0,
      evidenceVi: ["✓ Không có correction nào — không thể đánh giá."],
      occurrenceCount: 0,
      detectedAt: [],
    };
  }

  const immediateCount = eventsWithCorrections.filter(
    (e) => e.timingMode === "IMMEDIATE",
  ).length;
  // Guiding modes: FOLLOW_UP_FIRST and EXPLAIN_PATTERN are the "hint" equivalents
  const guidingCount = eventsWithCorrections.filter(
    (e) => e.timingMode === "FOLLOW_UP_FIRST" || e.timingMode === "EXPLAIN_PATTERN",
  ).length;
  const immediateRate = immediateCount / eventsWithCorrections.length;

  if (immediateRate > 0.7 && eventsWithCorrections.length >= 5) {
    evidence.push(
      `⚠ ${Math.round(immediateRate * 100)}% correction là 'IMMEDIATE' — Mercy cho đáp án ngay thay vì gợi ý.`,
    );
  }

  if (guidingCount === 0 && eventsWithCorrections.length >= 5) {
    evidence.push(
      `⚠ Không có guiding mode nào (FOLLOW_UP_FIRST / EXPLAIN_PATTERN) trong ${eventsWithCorrections.length} lượt có correction — Mercy không dẫn dắt learner tự tìm ra đáp án.`,
    );
  }

  for (const e of eventsWithCorrections) {
    if (e.timingMode === "IMMEDIATE") {
      detectedAt.push({ turnNumber: e.turnNumber, timestamp: e.timestamp });
    }
  }

  return {
    failureMode: failure,
    detected: immediateRate > 0.7 || (guidingCount === 0 && eventsWithCorrections.length >= 5),
    confidence: immediateRate > 0.9 ? 0.9 : immediateRate > 0.7 ? 0.7 : guidingCount === 0 ? 0.5 : 0,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : [
            `✓ Timing đa dạng: ${immediateCount} immediate, ${guidingCount} guiding, ${
              eventsWithCorrections.length - immediateCount - guidingCount
            } khác.`,
          ],
    occurrenceCount: immediateCount,
    detectedAt,
  };
}

/**
 * Detect F-MEM-01: Learner amnesia
 */
function detectLearnerAmnesia(ctx: FailureDetectionContext): FailureDetectionResult {
  const failure = getFailureById("F-MEM-01")!;
  const evidence: string[] = [];

  const memory = ctx.memorySnapshot;

  if (!memory) {
    return {
      failureMode: failure,
      detected: true,
      confidence: 0.95,
      evidenceVi: [
        "⚠ Memory snapshot = null — Mercy không nhớ gì về người học này.",
        "Mỗi buổi học như buổi đầu tiên — không có tính liên tục.",
      ],
      occurrenceCount: 1,
      detectedAt: [],
    };
  }

  const hasData =
    (memory.strengths && memory.strengths.length > 0) ||
    (memory.needsReview && memory.needsReview.length > 0) ||
    (memory.commonMistakePatterns && memory.commonMistakePatterns.length > 0) ||
    memory.totalCorrections > 0;

  if (!hasData) {
    evidence.push(
      "⚠ Memory tồn tại nhưng trống rỗng — không có strengths, needsReview, hay mistake patterns.",
    );
  }

  if (memory.totalCorrections === 0) {
    evidence.push(
      "⚠ Memory.totalCorrections = 0 — chưa ghi nhận correction nào.",
    );
  }

  if (!memory.nextRecommendedFocus) {
    evidence.push(
      "⚠ Không có nextRecommendedFocus — Mercy không có kế hoạch cho buổi sau.",
    );
  }

  return {
    failureMode: failure,
    detected: !hasData,
    confidence: !hasData ? 0.9 : 0.4,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : [
            `✓ Memory có dữ liệu: ${memory.strengths.length} strengths, ${memory.needsReview.length} needs review.`,
          ],
    occurrenceCount: !hasData ? 1 : 0,
    detectedAt: [],
  };
}

/**
 * Detect F-MEM-02: Stale memory
 */
function detectStaleMemory(ctx: FailureDetectionContext): FailureDetectionResult {
  const failure = getFailureById("F-MEM-02")!;
  const evidence: string[] = [];

  const memory = ctx.memorySnapshot;

  if (!memory || !memory.lastUpdatedAt) {
    return {
      failureMode: failure,
      detected: false,
      confidence: 0,
      evidenceVi: ["⚠ Không có memory hoặc timestamp — không thể kiểm tra độ cũ."],
      occurrenceCount: 0,
      detectedAt: [],
    };
  }

  const lastUpdate = new Date(memory.lastUpdatedAt).getTime();
  const now = Date.now();
  const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

  if (daysSinceUpdate > 7) {
    evidence.push(
      `⚠ Memory cập nhật lần cuối cách đây ${Math.round(daysSinceUpdate)} ngày (>7 ngày) — thông tin có thể đã cũ.`,
    );
  }

  // Check if memory weaknesses still appear in current session
  if (memory.needsReview && memory.needsReview.length > 0 && ctx.events.length > 0) {
    const currentWeaknessTags = new Set(
      ctx.events.flatMap((e) => e.weaknessTags),
    );
    const staleWeaknesses = memory.needsReview.filter(
      (w) => !currentWeaknessTags.has(w),
    );

    if (staleWeaknesses.length === memory.needsReview.length && memory.needsReview.length > 0) {
      evidence.push(
        `⚠ Tất cả ${memory.needsReview.length} điểm yếu trong memory không còn xuất hiện trong session hiện tại — learner có thể đã khắc phục.`,
      );
    }
  }

  return {
    failureMode: failure,
    detected: daysSinceUpdate > 7 || evidence.length > 1,
    confidence: daysSinceUpdate > 14 ? 0.9 : daysSinceUpdate > 7 ? 0.7 : 0,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : [
            `✓ Memory được cập nhật cách đây ${Math.round(daysSinceUpdate * 10) / 10} ngày — còn tương đối mới.`,
          ],
    occurrenceCount: daysSinceUpdate > 7 ? 1 : 0,
    detectedAt: [],
  };
}

/**
 * Detect F-SELF-01: No self-audit before responding
 */
function detectNoSelfAudit(ctx: FailureDetectionContext): FailureDetectionResult {
  const failure = getFailureById("F-SELF-01")!;
  const evidence: string[] = [];

  if (ctx.auditResults.length === 0) {
    evidence.push(
      "⚠ Không có audit result nào — Mercy không tự kiểm tra trước khi trả lời.",
    );

    if (ctx.events.length > 0) {
      evidence.push(
        `⚠ Có ${ctx.events.length} event nhưng 0 audit — pipeline thiếu audit gate.`,
      );
    }
  }

  if (!ctx.rubricResult) {
    evidence.push(
      "⚠ Không có rubric result — không có đánh giá chất lượng câu trả lời.",
    );
  }

  return {
    failureMode: failure,
    detected: ctx.auditResults.length === 0 && ctx.events.length > 0,
    confidence: ctx.auditResults.length === 0 && ctx.events.length >= 3 ? 0.9 : 0,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : [
            `✓ Có ${ctx.auditResults.length} audit results — Mercy đang tự kiểm tra.`,
          ],
    occurrenceCount: ctx.auditResults.length === 0 ? 1 : 0,
    detectedAt: [],
  };
}

/**
 * Detect F-SELF-03: Passing unsafe responses
 */
function detectPassingUnsafe(ctx: FailureDetectionContext): FailureDetectionResult {
  const failure = getFailureById("F-SELF-03")!;
  const evidence: string[] = [];

  const safetyFailures = ctx.auditResults.filter((a) => !a.safe);

  if (safetyFailures.length > 0) {
    evidence.push(
      `⚠ ${safetyFailures.length} audit result không an toàn — Mercy có thể đã gửi nội dung không an toàn cho learner.`,
    );

    for (const sf of safetyFailures.slice(0, 3)) {
      evidence.push(
        `  ⚠ Chi tiết: ${sf.summaryVi || "không có chi tiết"}`,
      );
    }
  }

  return {
    failureMode: failure,
    detected: safetyFailures.length > 0,
    confidence: safetyFailures.length >= 3 ? 0.9 : safetyFailures.length > 0 ? 0.7 : 0,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : ["✓ Không có vi phạm an toàn nào — tất cả audit đều safe."],
    occurrenceCount: safetyFailures.length,
    detectedAt: [],
  };
}

/**
 * Detect F-GAIN-01: No measurable progress
 */
function detectNoMeasurableProgress(
  ctx: FailureDetectionContext,
): FailureDetectionResult {
  const failure = getFailureById("F-GAIN-01")!;
  const evidence: string[] = [];

  const events = ctx.events;
  if (events.length < 8) {
    return {
      failureMode: failure,
      detected: false,
      confidence: 0,
      evidenceVi: [`⚠ Chỉ ${events.length} event — không đủ để đo tiến bộ (cần ≥8).`],
      occurrenceCount: 0,
      detectedAt: [],
    };
  }

  const mid = Math.floor(events.length / 2);
  const firstHalf = events.slice(0, mid);
  const secondHalf = events.slice(mid);

  const firstScores = firstHalf
    .map((e) => e.matchScore)
    .filter((s): s is number => s !== null);
  const secondScores = secondHalf
    .map((e) => e.matchScore)
    .filter((s): s is number => s !== null);

  if (firstScores.length >= 2 && secondScores.length >= 2) {
    const firstAvg =
      firstScores.reduce((a, b) => a + b, 0) / firstScores.length;
    const secondAvg =
      secondScores.reduce((a, b) => a + b, 0) / secondScores.length;
    const delta = secondAvg - firstAvg;

    if (delta <= 0) {
      evidence.push(
        `⚠ Điểm trung bình không tăng: ${Math.round(firstAvg)} → ${Math.round(secondAvg)} (${delta > 0 ? "+" : ""}${Math.round(delta)}).`,
      );
    } else if (delta < 5) {
      evidence.push(
        `⚠ Tiến bộ không đáng kể: ${Math.round(firstAvg)} → ${Math.round(secondAvg)} (+${Math.round(delta)}).`,
      );
    }
  }

  const firstCorrections = firstHalf.filter((e) => e.corrections.length > 0).length;
  const secondCorrections = secondHalf.filter((e) => e.corrections.length > 0).length;
  const firstRate = firstCorrections / Math.max(1, firstHalf.length);
  const secondRate = secondCorrections / Math.max(1, secondHalf.length);

  if (secondRate >= firstRate) {
    evidence.push(
      `⚠ Tỉ lệ sửa lỗi không giảm: ${Math.round(firstRate * 100)}% → ${Math.round(secondRate * 100)}%.`,
    );
  }

  const firstWeaknessCount = new Set(firstHalf.flatMap((e) => e.weaknessTags)).size;
  const secondWeaknessCount = new Set(secondHalf.flatMap((e) => e.weaknessTags)).size;

  if (secondWeaknessCount >= firstWeaknessCount && firstWeaknessCount > 0) {
    evidence.push(
      `⚠ Số loại điểm yếu không giảm: ${firstWeaknessCount} → ${secondWeaknessCount}.`,
    );
  }

  return {
    failureMode: failure,
    detected: evidence.length >= 2, // need multiple signals to confirm
    confidence: evidence.length >= 3 ? 0.9 : evidence.length >= 2 ? 0.7 : 0,
    evidenceVi:
      evidence.length > 0
        ? evidence
        : ["✓ Có dấu hiệu tiến bộ trong buổi học."],
    occurrenceCount: evidence.length >= 2 ? 1 : 0,
    detectedAt: [],
  };
}

// ─── Failure Detection Registry ──────────────────────────────────────────────

/**
 * All data-detectable failure detection functions.
 * Ordered so cheaper checks run first.
 */
const DATA_DETECTORS: Array<
  (ctx: FailureDetectionContext) => FailureDetectionResult
> = [
  detectMissedErrors,          // F-DIAG-01
  detectGhostCorrections,      // F-DIAG-03
  detectLowConfidenceCorrections, // F-DIAG-04
  detectSingleSourceBias,      // F-DIAG-05
  detectOverCorrection,        // F-TEACH-02
  detectFakePraise,            // F-TEACH-03
  detectAnswerSpooning,        // F-TEACH-05
  detectLearnerAmnesia,        // F-MEM-01
  detectStaleMemory,           // F-MEM-02
  detectNoSelfAudit,           // F-SELF-01
  detectPassingUnsafe,         // F-SELF-03
  detectNoMeasurableProgress,  // F-GAIN-01
];

// ─── Failure Profile Classification ──────────────────────────────────────────

function classifyFailureProfile(
  criticalCount: number,
  majorCount: number,
  minorCount: number,
  failureScore: number,
): SessionFailureProfile {
  if (criticalCount >= 3 || failureScore >= 70) return "critical_intervention";
  if (criticalCount >= 1 || majorCount >= 5 || failureScore >= 40)
    return "serious_problems";
  if (majorCount >= 2 || minorCount >= 5 || failureScore >= 15)
    return "needs_attention";
  if (minorCount >= 1 || failureScore >= 5) return "minor_issues";
  return "clean";
}

// ─── Main API: Scan Session for Failures ─────────────────────────────────────

/**
 * Scan a tutoring session for weak tutoring behavior failures.
 *
 * Runs all data-detectable checks against the session data and produces
 * a structured failure report with severity breakdowns, remedies, and
 * a failure profile classification.
 *
 * Pure function — no I/O, no side effects, deterministic.
 *
 * @param ctx — Session context including events, audits, rubric, and memory.
 * @returns A complete SessionFailureScan with all detected failures.
 *
 * @example
 * ```ts
 * const scan = scanSessionForFailures({
 *   events: sessionEvents,
 *   auditResults: sessionAudits,
 *   rubricResult: sessionRubric,
 *   memorySnapshot: learnerMemory,
 *   sessionId: "abc-123",
 * });
 *
 * if (scan.requiresChauReview) {
 *   console.log("Chau cần xem buổi học này!");
 *   for (const remedy of scan.remedies) {
 *     console.log(`- ${remedy.titleVi}: ${remedy.remedyVi}`);
 *   }
 * }
 * ```
 */
export function scanSessionForFailures(
  ctx: FailureDetectionContext,
): SessionFailureScan {
  const scannedAt = new Date().toISOString();

  // Run all data-detectable checks
  const allResults = DATA_DETECTORS.map((detector) => detector(ctx));

  const detectedFailures = allResults.filter((r) => r.detected);

  const bySeverity = {
    critical: detectedFailures.filter((f) => f.failureMode.severity === "critical"),
    major: detectedFailures.filter((f) => f.failureMode.severity === "major"),
    minor: detectedFailures.filter((f) => f.failureMode.severity === "minor"),
  };

  // Build by-dimension breakdown
  const byDimension: Record<TeacherIntelligenceDimensionId, FailureDetectionResult[]> = {
    diagnosis: [],
    teaching: [],
    memory: [],
    adaptation: [],
    selfCheck: [],
    learningGain: [],
  };

  for (const f of detectedFailures) {
    byDimension[f.failureMode.dimensionId].push(f);
  }

  // Compute failure score (weighted sum)
  const failureScore = Math.min(
    100,
    detectedFailures.reduce(
      (sum, f) => sum + FAILURE_SEVERITY_WEIGHT[f.failureMode.severity],
      0,
    ),
  );

  const profile = classifyFailureProfile(
    bySeverity.critical.length,
    bySeverity.major.length,
    bySeverity.minor.length,
    failureScore,
  );

  // Build prioritized remedies (critical first, then major, then minor)
  const remedies = [
    ...bySeverity.critical,
    ...bySeverity.major,
    ...bySeverity.minor,
  ].map((f, index) => ({
    failureId: f.failureMode.failureId,
    titleVi: f.failureMode.titleVi,
    remedyVi: f.failureMode.remedyVi,
    remedyType: f.failureMode.remedyType,
    priority: index + 1,
  }));

  // Build summary
  const summaryParts: string[] = [];
  const totalFailures = detectedFailures.length;

  if (totalFailures === 0) {
    summaryParts.push("✓ Không phát hiện lỗi dạy yếu nào trong buổi học này.");
  } else {
    summaryParts.push(
      `⚠ Phát hiện ${totalFailures} lỗi dạy yếu: ${bySeverity.critical.length} nghiêm trọng, ${bySeverity.major.length} lớn, ${bySeverity.minor.length} nhỏ.`,
    );

    // Mention worst dimension
    const worstDim = (Object.entries(byDimension) as [TeacherIntelligenceDimensionId, FailureDetectionResult[]][])
      .filter(([, failures]) => failures.length > 0)
      .sort(([, a], [, b]) => b.length - a.length)[0];

    if (worstDim) {
      const dimNames: Record<string, string> = {
        diagnosis: "Chẩn đoán",
        teaching: "Giảng dạy",
        memory: "Ghi nhớ",
        adaptation: "Thích ứng",
        selfCheck: "Tự kiểm",
        learningGain: "Chứng minh tiến bộ",
      };
      summaryParts.push(
        `Chiều yếu nhất: ${dimNames[worstDim[0]]} (${worstDim[1].length} lỗi).`,
      );
    }
  }

  const profileLabels: Record<SessionFailureProfile, string> = {
    clean: "Sạch — không có lỗi dạy yếu.",
    minor_issues: "Vấn đề nhỏ — vài lỗi nhẹ, chưa cần can thiệp gấp.",
    needs_attention: "Cần chú ý — có lỗi cần sửa trong tuần này.",
    serious_problems: "Vấn đề nghiêm trọng — Chau nên xem sớm.",
    critical_intervention: "Can thiệp khẩn cấp — Chau phải xem ngay.",
  };

  return {
    sessionId: ctx.sessionId,
    scannedAt,
    totalChecks: allResults.length,
    detectedFailures,
    failureCount: totalFailures,
    bySeverity,
    byDimension,
    failureScore,
    profile,
    summaryVi: `${summaryParts.join(" ")} ${profileLabels[profile]}`,
    remedies,
    requiresChauReview:
      profile === "critical_intervention" || profile === "serious_problems",
  };
}

/**
 * Detect failures for a specific dimension only.
 *
 * Useful for focused diagnostics when Chau wants to investigate
 * one dimension in depth.
 */
export function detectFailuresByDimension(
  dimensionId: TeacherIntelligenceDimensionId,
  ctx: FailureDetectionContext,
): FailureDetectionResult[] {
  const scan = scanSessionForFailures(ctx);
  return scan.byDimension[dimensionId];
}

/**
 * Get a deduplicated, prioritized list of remedies for a set of failures.
 */
export function getRemediesForFailures(
  failures: FailureDetectionResult[],
): SessionFailureScan["remedies"] {
  const seen = new Set<string>();
  const remedies: SessionFailureScan["remedies"] = [];

  const sorted = [...failures].sort((a, b) => {
    const severityOrder = { critical: 0, major: 1, minor: 2 };
    return (
      severityOrder[a.failureMode.severity] -
      severityOrder[b.failureMode.severity]
    );
  });

  for (const f of sorted) {
    if (!seen.has(f.failureMode.failureId)) {
      seen.add(f.failureMode.failureId);
      remedies.push({
        failureId: f.failureMode.failureId,
        titleVi: f.failureMode.titleVi,
        remedyVi: f.failureMode.remedyVi,
        remedyType: f.failureMode.remedyType,
        priority: remedies.length + 1,
      });
    }
  }

  return remedies;
}

/**
 * Compute a simple failure score (0–100) for a set of detected failures.
 * 0 = perfect, 100 = all failures triggered. Lower is better.
 */
export function computeSessionFailureScore(
  failures: FailureDetectionResult[],
): number {
  return Math.min(
    100,
    failures.reduce(
      (sum, f) =>
        sum + FAILURE_SEVERITY_WEIGHT[f.failureMode.severity],
      0,
    ),
  );
}

/**
 * Classify the overall failure profile for a session.
 */
export function classifySessionFailureProfile(
  failures: FailureDetectionResult[],
): SessionFailureProfile {
  const critical = failures.filter((f) => f.failureMode.severity === "critical").length;
  const major = failures.filter((f) => f.failureMode.severity === "major").length;
  const minor = failures.filter((f) => f.failureMode.severity === "minor").length;
  const score = computeSessionFailureScore(failures);

  return classifyFailureProfile(critical, major, minor, score);
}

// ─── Cross-Session Aggregation ───────────────────────────────────────────────

/**
 * Aggregate failure data across multiple tutoring sessions.
 *
 * Detects patterns: which failures are most common, which are getting worse,
 * and which are improving over time.
 */
export function aggregateFailuresAcrossSessions(
  scans: SessionFailureScan[],
): CrossSessionFailureSummary {
  if (scans.length === 0) {
    return {
      sessionCount: 0,
      failureCounts: {},
      topFailures: [],
      worsening: [],
      improving: [],
      summaryVi: "Chưa có dữ liệu buổi học nào.",
    };
  }

  // Count failures across all sessions
  const failureCounts: Record<string, number> = {};
  const failureAppearances: Record<string, boolean[]> = {};

  for (let i = 0; i < scans.length; i++) {
    const scan = scans[i];
    for (const f of scan.detectedFailures) {
      const id = f.failureMode.failureId;
      failureCounts[id] = (failureCounts[id] ?? 0) + 1;
      if (!failureAppearances[id]) {
        failureAppearances[id] = new Array(scans.length).fill(false);
      }
      failureAppearances[id][i] = true;
    }
  }

  // Top failures
  const topFailures = Object.entries(failureCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([failureId, count]) => {
      const f = getFailureById(failureId);
      return {
        failureId,
        titleVi: f?.titleVi ?? failureId,
        count,
      };
    });

  // Detect trends: worsening vs improving
  const worsening: string[] = [];
  const improving: string[] = [];

  for (const [failureId, appearances] of Object.entries(failureAppearances)) {
    if (appearances.length < 3) continue;

    const mid = Math.floor(appearances.length / 2);
    const firstHalf = appearances.slice(0, mid);
    const secondHalf = appearances.slice(mid);

    const firstRate = firstHalf.filter(Boolean).length / firstHalf.length;
    const secondRate = secondHalf.filter(Boolean).length / secondHalf.length;

    if (secondRate > firstRate + 0.3) {
      worsening.push(failureId);
    } else if (secondRate < firstRate - 0.3) {
      improving.push(failureId);
    }
  }

  // Build summary
  const parts: string[] = [];
  parts.push(`${scans.length} buổi học được quét.`);
  parts.push(`Lỗi phổ biến nhất: ${topFailures[0]?.titleVi ?? "không có"}.`);
  if (worsening.length > 0) {
    parts.push(`${worsening.length} lỗi đang tăng dần.`);
  }
  if (improving.length > 0) {
    parts.push(`${improving.length} lỗi đang giảm dần.`);
  }

  return {
    sessionCount: scans.length,
    failureCounts,
    topFailures,
    worsening,
    improving,
    summaryVi: parts.join(" "),
  };
}

// ─── Convenience: Quick Session Check ────────────────────────────────────────

/**
 * Quick check: does this session have any critical failures?
 * Returns true if Chau should look at this session immediately.
 */
export function hasCriticalFailures(scan: SessionFailureScan): boolean {
  return scan.bySeverity.critical.length > 0;
}

/**
 * Quick check: is this session "clean" (no failures detected)?
 */
export function isSessionClean(scan: SessionFailureScan): boolean {
  return scan.profile === "clean";
}

/**
 * Get a one-line Vietnamese status for a session scan.
 * Suitable for dashboard or notification previews.
 */
export function getScanStatusVi(scan: SessionFailureScan): string {
  if (scan.profile === "clean") return "✓ Sạch";
  if (scan.profile === "minor_issues") return "⚡ Vài lỗi nhỏ";
  if (scan.profile === "needs_attention") return "⚠ Cần chú ý";
  if (scan.profile === "serious_problems") return "🛑 Nghiêm trọng";
  return "🚨 Khẩn cấp";
}

// ─── Summary Statistics ──────────────────────────────────────────────────────

/**
 * Get summary statistics from a failure scan.
 */
export function getScanStatistics(scan: SessionFailureScan): {
  totalDetected: number;
  criticalCount: number;
  majorCount: number;
  minorCount: number;
  failureScore: number;
  worstDimension: TeacherIntelligenceDimensionId | null;
  profileLabelVi: string;
  requiresChauReview: boolean;
} {
  const profileLabels: Record<SessionFailureProfile, string> = {
    clean: "Sạch",
    minor_issues: "Vấn đề nhỏ",
    needs_attention: "Cần chú ý",
    serious_problems: "Nghiêm trọng",
    critical_intervention: "Khẩn cấp",
  };

  let worstDimension: TeacherIntelligenceDimensionId | null = null;
  let worstCount = 0;
  for (const [dimId, failures] of Object.entries(scan.byDimension) as [TeacherIntelligenceDimensionId, FailureDetectionResult[]][]) {
    if (failures.length > worstCount) {
      worstCount = failures.length;
      worstDimension = dimId;
    }
  }

  return {
    totalDetected: scan.failureCount,
    criticalCount: scan.bySeverity.critical.length,
    majorCount: scan.bySeverity.major.length,
    minorCount: scan.bySeverity.minor.length,
    failureScore: scan.failureScore,
    worstDimension,
    profileLabelVi: profileLabels[scan.profile],
    requiresChauReview: scan.requiresChauReview,
  };
}
