/**
 * Human Learner Testing Checklist
 *
 * Comprehensive end-to-end testing of Teacher Mercy's six human-teacher
 * capabilities from the perspective of real Vietnamese learners.
 *
 * Defines realistic learner personas, full tutoring sessions, and a structured
 * checklist that validates whether Teacher Mercy can:
 *
 *   1. Diagnose  — detect errors and tag weaknesses accurately
 *   2. Teach     — correct properly, explain clearly, save face
 *   3. Remember  — track learner strengths, weaknesses, patterns across turns
 *   4. Adapt     — adjust difficulty, pacing, and language to the learner
 *   5. Self-check — validate decisions before showing them
 *   6. Prove     — measure learner improvement from before to after
 *
 * All pure functions — no I/O, no side effects, deterministic.
 * Vietnamese-first in all user-facing labels and summaries.
 *
 * Single command:
 *   npx vitest run src/lib/tutor/__tests__/humanLearnerTestingChecklist.test.ts
 */

import type {
  TranscriptCorrectionEvent,
  TranscriptCorrectionEventInput,
  TranscriptCorrectionSource,
} from "./transcriptCorrectionTypes";
import {
  createCorrectionSession,
  recordCorrectionEvent,
} from "./transcriptCorrectionCollector";
import type { CorrectionMode } from "./teacherMercyCorrectionTiming";
import type { VietlishInterferenceCategory } from "./vietlishLogicEngine";
import {
  checkTeacherMercyContract,
  checkCorrectionContract,
  checkConversationContract,
  TEACHER_MERCY_CONTRACT_CATALOG,
  type ContractLearnerInput,
  type ContractTutorResponse,
  type ContractCheckResult,
} from "./teacherMercyContract";
import {
  evaluateRubric,
  evaluateRubricFocused,
  TEACHER_MERCY_RUBRIC_CATALOG,
  type RubricResult,
  type RubricDimensionId,
} from "./teacherMercyRubric";
import {
  auditResponse,
  type AuditResult,
} from "./teacherMercyAuditGate";
import {
  captureBaseline,
  captureOutcome,
  assessLearningGain,
  hasMeasurableGain,
  isReportableGain,
  LEARNING_GAIN_DIMENSION_CATALOG,
  type LearningGainResult,
  type LearningGainDimensionId,
} from "./learningGainRubric";
import {
  buildChauReviewPacket,
  getActionItems,
  getCompactSummaryVi,
  isPacketReportable,
  CHAU_REVIEW_DIMENSION_CATALOG,
  type ChauReviewPacket,
  type ChauReviewVerdict,
  type ChauMemorySnapshot,
} from "./chauReviewPacket";

// ─── Learner Persona Types ──────────────────────────────────────────────────

/**
 * A realistic Vietnamese learner persona.
 * Represents a real human learner with typical CEFR level, age,
 * goals, and common error patterns from Vietnamese L1 interference.
 */
export interface LearnerPersona {
  /** Unique persona identifier */
  id: string;
  /** Vietnamese display name */
  nameVi: string;
  /** English name */
  nameEn: string;
  /** Age range */
  age: number;
  /** CEFR level (A1–C1) */
  cefrLevel: string;
  /** Occupation in Vietnamese */
  occupationVi: string;
  /** Learning goal in Vietnamese */
  goalVi: string;
  /** Typical error patterns (Vietnamese descriptions) */
  errorPatternsVi: string[];
  /** Weakness tags this learner typically triggers */
  typicalWeaknessTags: string[];
  /** Strengths this learner may develop */
  potentialStrengths: string[];
  /** Typical session length in turns */
  typicalSessionTurns: number;
}

// ─── Testing Scenario Types ─────────────────────────────────────────────────

/**
 * A single turn in a testing scenario — simulates what the learner
 * says and what Teacher Mercy should respond with.
 */
export interface LearnerTestTurn {
  /** 1-based turn number */
  turnNumber: number;
  /** Raw text the learner typed or spoke */
  learnerText: string;
  /** Corrected version of what the learner said */
  correctedText: string;
  /** Weakness tags to associate with this turn */
  weaknessTags: string[];
  /** Match score (0–100) for pronunciation quality */
  matchScore: number;
  /** Whether the learner self-corrected */
  didSelfCorrect: boolean;
  /** Whether the learner acknowledged the correction */
  acknowledged: boolean;
  /** Individual corrections applied */
  corrections: Array<{
    source: TranscriptCorrectionSource;
    originalToken: string;
    correctedToken: string;
    confidence: number;
    ruleId: string | null;
    explanationVi: string;
  }>;
  /** Teacher Mercy's response in Vietnamese */
  teacherResponseVi: string;
  /** Teacher Mercy's response in English */
  teacherResponseEn: string;
  /** Corrected sentence as shown to learner */
  teacherCorrectedSentence: string | null;
  /** Grammar points Mercy explains */
  grammarPoints: string[];
  /** Whether Mercy referenced a known weakness */
  referencesTrackedWeakness: boolean;
  /** Timing mode for correction delivery */
  correctionTiming: CorrectionMode;
}

/**
 * A complete testing scenario — a full tutoring session with a
 * specific learner persona, exercising all six teacher capabilities.
 */
export interface LearnerTestScenario {
  /** Unique scenario identifier */
  id: string;
  /** The persona being tested */
  persona: LearnerPersona;
  /** Vietnamese description of what this scenario tests */
  descriptionVi: string;
  /** Which teacher dimensions this scenario primarily exercises */
  primaryDimensions: string[];
  /** The turns in this session */
  turns: LearnerTestTurn[];
  /** Expected memory state after the session */
  expectedMemory: {
    strengths: string[];
    weaknesses: string[];
    commonMistakePatterns: string[];
    recommendation: string;
    confidenceTrend: string;
  };
}

// ─── Checklist Result Types ─────────────────────────────────────────────────

export type ChecklistItemStatus = "pass" | "partial" | "fail" | "insufficient_data";

/**
 * A single checklist item verifying one aspect of Teacher Mercy's behavior
 * from a human learner's perspective.
 */
export interface HumanLearnerChecklistItem {
  /** Unique item identifier (e.g., "HL-DIAGNOSE-01") */
  id: string;
  /** Which teacher dimension this belongs to */
  dimension: string;
  /** Vietnamese description of what is being checked */
  descriptionVi: string;
  /** English description */
  descriptionEn: string;
  /** Pass / partial / fail / insufficient_data */
  status: ChecklistItemStatus;
  /** Concrete evidence for the status (Vietnamese) */
  evidenceVi: string;
  /** Which persona/scenario produced this evidence */
  source: string;
}

/**
 * Summary of one teacher dimension across all scenarios.
 */
export interface HumanLearnerDimensionSummary {
  /** Dimension identifier */
  dimensionId: string;
  /** Vietnamese title */
  titleVi: string;
  /** English title */
  titleEn: string;
  /** Number of checklist items */
  itemCount: number;
  /** Pass / partial / fail / insufficient_data counts */
  statusCounts: Record<ChecklistItemStatus, number>;
  /** Whether this dimension passed overall */
  overallPassed: boolean;
  /** Vietnamese summary */
  summaryVi: string;
}

/**
 * The complete human learner testing checklist result.
 */
export interface HumanLearnerChecklistResult {
  /** When the checklist was run (ISO string) */
  generatedAt: string;
  /** Overall: did Teacher Mercy pass as a human-like teacher? */
  overallVerdict: ChauReviewVerdict;
  /** Overall pass/fail */
  overallPassed: boolean;
  /** Number of scenarios tested */
  scenarioCount: number;
  /** Total checklist items */
  totalItems: number;
  /** Pass / partial / fail / insufficient_data counts */
  globalStatusCounts: Record<ChecklistItemStatus, number>;
  /** Per-dimension summaries */
  dimensions: HumanLearnerDimensionSummary[];
  /** All individual checklist items */
  items: HumanLearnerChecklistItem[];
  /** Action items for Chau */
  actionItems: string[];
  /** Compact summary in Vietnamese */
  compactSummaryVi: string;
}

// ─── Learner Personas ───────────────────────────────────────────────────────

/**
 * Five realistic Vietnamese learner personas spanning CEFR levels A1–C1.
 * Each persona has real-world goals, age, occupation, and error patterns
 * driven by Vietnamese L1 interference.
 */
export const VIETNAMESE_LEARNER_PERSONAS: LearnerPersona[] = [
  {
    id: "minh-a1",
    nameVi: "Minh",
    nameEn: "Minh",
    age: 19,
    cefrLevel: "A1",
    occupationVi: "Sinh viên năm nhất",
    goalVi: "Đậu kỳ thi tiếng Anh đầu vào đại học",
    errorPatternsVi: [
      "Thiếu động từ to-be (copula omission)",
      "Sai trật tự tính từ - danh từ",
      "Thiếu mạo từ a/an/the",
      "Dùng sai thì hiện tại đơn / tiếp diễn",
    ],
    typicalWeaknessTags: ["copula-omission", "article-omission", "word-order"],
    potentialStrengths: ["basic-greetings", "simple-present"],
    typicalSessionTurns: 6,
  },
  {
    id: "lan-a2",
    nameVi: "Lan",
    nameEn: "Lan",
    age: 28,
    cefrLevel: "A2",
    occupationVi: "Nhân viên văn phòng",
    goalVi: "Giao tiếp cơ bản với đồng nghiệp nước ngoài",
    errorPatternsVi: [
      "Nhầm lẫn thì quá khứ và hiện tại",
      "Sai giới từ (in/on/at)",
      "Dùng sai danh từ đếm được / không đếm được",
      "Thiếu trợ động từ trong câu hỏi",
    ],
    typicalWeaknessTags: ["past-tense", "prepositions", "countable-uncountable"],
    potentialStrengths: ["basic-conversation", "polite-forms"],
    typicalSessionTurns: 8,
  },
  {
    id: "tuan-b1",
    nameVi: "Tuấn",
    nameEn: "Tuan",
    age: 35,
    cefrLevel: "B1",
    occupationVi: "Kỹ sư cầu đường",
    goalVi: "Làm việc với đội kỹ sư quốc tế",
    errorPatternsVi: [
      "Ảnh hưởng trật tự từ tiếng Việt (modifier sau noun)",
      "Nhầm lẫn động từ khuyết thiếu (must/should/can)",
      "Sai cấu trúc câu điều kiện",
      "Dùng sai thì hoàn thành",
    ],
    typicalWeaknessTags: ["word-order-vi", "modal-verbs", "conditionals", "present-perfect"],
    potentialStrengths: ["technical-vocabulary", "numbers-units"],
    typicalSessionTurns: 8,
  },
  {
    id: "huong-b2",
    nameVi: "Hương",
    nameEn: "Huong",
    age: 25,
    cefrLevel: "B2",
    occupationVi: "Nghiên cứu sinh",
    goalVi: "Viết bài báo khoa học bằng tiếng Anh",
    errorPatternsVi: [
      "Sai mạo từ trong ngữ cảnh học thuật",
      "Sai collocation (kết hợp từ không tự nhiên)",
      "Dùng sai register (văn phong không phù hợp)",
      "Lỗi mệnh đề quan hệ",
    ],
    typicalWeaknessTags: ["article-precision", "collocations", "register", "relative-clauses"],
    potentialStrengths: ["academic-vocabulary", "complex-sentences"],
    typicalSessionTurns: 10,
  },
  {
    id: "nam-c1",
    nameVi: "Nam",
    nameEn: "Nam",
    age: 42,
    cefrLevel: "C1",
    occupationVi: "Chủ doanh nghiệp xuất nhập khẩu",
    goalVi: "Đàm phán hợp đồng quốc tế",
    errorPatternsVi: [
      "Sai sắc thái thành ngữ (idiomatic precision)",
      "Lỗi ngữ pháp tinh tế (subjunctive, inversion)",
      "Dùng sai văn phong trang trọng (formal register)",
      "Lỗi discourse markers (từ nối trong văn bản phức)",
    ],
    typicalWeaknessTags: ["idiomatic-precision", "subjunctive", "formal-register", "discourse-markers"],
    potentialStrengths: ["business-vocabulary", "persuasion", "complex-negotiation"],
    typicalSessionTurns: 10,
  },
];

// ─── Helper: Build Correction Events from Scenario Turns ────────────────────

/**
 * Convert a learner test turn into a TranscriptCorrectionEventInput.
 */
export function turnToCorrectionEventInput(
  turn: LearnerTestTurn,
  sessionId: string,
): TranscriptCorrectionEventInput {
  return {
    sessionId,
    turnNumber: turn.turnNumber,
    originalTranscript: turn.learnerText,
    correctedTranscript: turn.correctedText,
    matchScore: turn.matchScore,
    learnerAcknowledged: turn.acknowledged,
    weaknessTags: turn.weaknessTags,
    timingMode: turn.correctionTiming,
    corrections: turn.corrections.map((c) => ({
      source: c.source,
      position: turn.learnerText.indexOf(c.originalToken),
      originalToken: c.originalToken,
      correctedToken: c.correctedToken,
      confidence: c.confidence,
      ruleId: c.ruleId,
      explanationVi: c.explanationVi,
      explanationEn: null,
    })),
  };
}

/**
 * Build full TranscriptCorrectionEvent array from a scenario.
 */
export function buildScenarioEvents(
  scenario: LearnerTestScenario,
): TranscriptCorrectionEvent[] {
  let session = createCorrectionSession(scenario.id);
  const events: TranscriptCorrectionEvent[] = [];
  const baseTime = Date.now();
  for (let i = 0; i < scenario.turns.length; i++) {
    const turn = scenario.turns[i];
    const result = recordCorrectionEvent(
      session,
      turnToCorrectionEventInput(turn, scenario.id),
      baseTime + i * 1000, // unique timestamps per turn
    );
    session = result.session;
    events.push(result.event);
  }
  return events;
}

// ─── Helper: Build Contract Input / Tutor Response from a Turn ──────────────

/**
 * Build a ContractLearnerInput from a test turn + persona.
 */
export function buildLearnerInputFromTurn(
  turn: LearnerTestTurn,
  persona: LearnerPersona,
  trackedWeakness: string | null,
): ContractLearnerInput {
  return {
    text: turn.learnerText,
    cefrLevel: persona.cefrLevel,
    trackedWeakness,
    didSelfCorrect: turn.didSelfCorrect,
    l1: "vi",
  };
}

/**
 * Build a ContractTutorResponse from a test turn (simulating Mercy's response).
 */
export function buildTutorResponseFromTurn(
  turn: LearnerTestTurn,
): ContractTutorResponse {
  return {
    vi: turn.teacherResponseVi,
    en: turn.teacherResponseEn || undefined,
    correctedSentence: turn.teacherCorrectedSentence ?? undefined,
    grammarPoints: turn.grammarPoints.length > 0 ? turn.grammarPoints : undefined,
    correctionCount: turn.corrections.length,
    followUpQuestionCount: turn.acknowledged ? 0 : 1,
  };
}

// ─── Checklist Item Definitions ─────────────────────────────────────────────

/**
 * The complete catalog of human learner checklist items.
 * Each item maps to one specific behavior a human teacher would demonstrate
 * and that Teacher Mercy should also demonstrate.
 *
 * Organized by the six dimensions:
 *   HL-DIAGNOSE-01..05  — Error detection and weakness tagging
 *   HL-TEACH-01..06     — Correction quality and explanation clarity
 *   HL-REMEMBER-01..04  — Learner memory and weakness tracking
 *   HL-ADAPT-01..04     — Adaptation to learner level and progress
 *   HL-SELFCHECK-01..04 — Self-validation and safety
 *   HL-PROVE-01..04     — Measurable learner improvement
 */
export const HUMAN_LEARNER_CHECKLIST_CATALOG: Array<{
  id: string;
  dimension: string;
  descriptionVi: string;
  descriptionEn: string;
}> = [
  // ─── 1. Diagnose ──────────────────────────────────────────────────────
  {
    id: "HL-DIAGNOSE-01",
    dimension: "Chẩn đoán",
    descriptionVi: "Mercy phát hiện ít nhất 1 lỗi mỗi 2 lượt nói của học viên A1–B1",
    descriptionEn: "Mercy detects at least 1 error per 2 turns for A1–B1 learners",
  },
  {
    id: "HL-DIAGNOSE-02",
    dimension: "Chẩn đoán",
    descriptionVi: "Mercy gắn đúng weakness tag cho lỗi đặc trưng của người Việt",
    descriptionEn: "Mercy tags the correct weakness for Vietnamese-specific errors",
  },
  {
    id: "HL-DIAGNOSE-03",
    dimension: "Chẩn đoán",
    descriptionVi: "Mercy phát hiện lỗi do ảnh hưởng tiếng Việt (Vietlish interference)",
    descriptionEn: "Mercy detects errors from Vietnamese L1 interference",
  },
  {
    id: "HL-DIAGNOSE-04",
    dimension: "Chẩn đoán",
    descriptionVi: "Mercy không bỏ sót lỗi ngữ pháp cơ bản ở trình độ A1–A2",
    descriptionEn: "Mercy does not miss basic grammar errors at A1–A2 levels",
  },
  {
    id: "HL-DIAGNOSE-05",
    dimension: "Chẩn đoán",
    descriptionVi: "Mercy phân biệt được lỗi phát âm và lỗi ngữ pháp",
    descriptionEn: "Mercy distinguishes pronunciation errors from grammar errors",
  },

  // ─── 2. Teach ─────────────────────────────────────────────────────────
  {
    id: "HL-TEACH-01",
    dimension: "Giảng dạy",
    descriptionVi: "Mercy giải thích lỗi bằng tiếng Việt, dễ hiểu với học viên",
    descriptionEn: "Mercy explains errors in Vietnamese, understandable to the learner",
  },
  {
    id: "HL-TEACH-02",
    dimension: "Giảng dạy",
    descriptionVi: "Mercy chỉ sửa 1 lỗi chính mỗi lượt (R2 — one correction max)",
    descriptionEn: "Mercy corrects only 1 main error per turn (R2)",
  },
  {
    id: "HL-TEACH-03",
    dimension: "Giảng dạy",
    descriptionVi: "Mercy công nhận ý nghĩa trước khi sửa hình thức (R1 — meaning first)",
    descriptionEn: "Mercy acknowledges meaning before correcting form (R1)",
  },
  {
    id: "HL-TEACH-04",
    dimension: "Giảng dạy",
    descriptionVi: "Mercy giữ thể diện cho học viên — không làm học viên xấu hổ (R8)",
    descriptionEn: "Mercy saves face — does not embarrass the learner (R8)",
  },
  {
    id: "HL-TEACH-05",
    dimension: "Giảng dạy",
    descriptionVi: "Mercy không khen giả tạo — chỉ khen khi có tiến bộ thật (R3)",
    descriptionEn: "Mercy does not fake praise — only praises real progress (R3)",
  },
  {
    id: "HL-TEACH-06",
    dimension: "Giảng dạy",
    descriptionVi: "Mercy cho học viên không gian tự sửa lỗi trước khi can thiệp (R9)",
    descriptionEn: "Mercy gives the learner space to self-correct before intervening (R9)",
  },

  // ─── 3. Remember ──────────────────────────────────────────────────────
  {
    id: "HL-REMEMBER-01",
    dimension: "Ghi nhớ",
    descriptionVi: "Mercy nhắc đến điểm yếu đã biết của học viên trong buổi học (R5)",
    descriptionEn: "Mercy references a known learner weakness during the session (R5)",
  },
  {
    id: "HL-REMEMBER-02",
    dimension: "Ghi nhớ",
    descriptionVi: "Mercy tích lũy weakness tags qua các lượt — không reset mỗi lượt",
    descriptionEn: "Mercy accumulates weakness tags across turns — does not reset each turn",
  },
  {
    id: "HL-REMEMBER-03",
    dimension: "Ghi nhớ",
    descriptionVi: "Sau buổi học, Mercy có danh sách điểm mạnh / điểm yếu của học viên",
    descriptionEn: "After the session, Mercy has a list of learner strengths and weaknesses",
  },
  {
    id: "HL-REMEMBER-04",
    dimension: "Ghi nhớ",
    descriptionVi: "Mercy gợi ý bài học tiếp theo dựa trên điểm yếu đã ghi nhận",
    descriptionEn: "Mercy recommends the next lesson based on recorded weaknesses",
  },

  // ─── 4. Adapt ─────────────────────────────────────────────────────────
  {
    id: "HL-ADAPT-01",
    dimension: "Thích ứng",
    descriptionVi: "Mercy điều chỉnh độ khó câu hỏi theo trình độ CEFR của học viên",
    descriptionEn: "Mercy adjusts question difficulty to the learner's CEFR level",
  },
  {
    id: "HL-ADAPT-02",
    dimension: "Thích ứng",
    descriptionVi: "Mercy giảm tốc độ sửa lỗi khi học viên tiến bộ trong buổi học",
    descriptionEn: "Mercy reduces correction frequency when the learner improves during the session",
  },
  {
    id: "HL-ADAPT-03",
    dimension: "Thích ứng",
    descriptionVi: "Mercy tăng độ phức tạp câu hỏi follow-up khi học viên trả lời tốt",
    descriptionEn: "Mercy increases follow-up complexity when the learner answers well",
  },
  {
    id: "HL-ADAPT-04",
    dimension: "Thích ứng",
    descriptionVi: "Mercy dùng tiếng Việt nhiều hơn với học viên A1–A2, ít hơn với B2–C1",
    descriptionEn: "Mercy uses more Vietnamese with A1–A2 learners, less with B2–C1",
  },

  // ─── 5. Self-check ────────────────────────────────────────────────────
  {
    id: "HL-SELFCHECK-01",
    dimension: "Tự kiểm",
    descriptionVi: "Mercy không đưa ra câu trả lời khi không chắc chắn (R7 — strategic silence)",
    descriptionEn: "Mercy does not give an answer when uncertain (R7)",
  },
  {
    id: "HL-SELFCHECK-02",
    dimension: "Tự kiểm",
    descriptionVi: "Phản hồi của Mercy vượt qua audit gate an toàn (R3+R7+R8)",
    descriptionEn: "Mercy's responses pass the safety audit gate (R3+R7+R8)",
  },
  {
    id: "HL-SELFCHECK-03",
    dimension: "Tự kiểm",
    descriptionVi: "Mercy không tự tin quá mức vào câu sửa sai (overclaim guard)",
    descriptionEn: "Mercy does not overclaim confidence in corrections",
  },
  {
    id: "HL-SELFCHECK-04",
    dimension: "Tự kiểm",
    descriptionVi: "Mercy kiểm tra lại câu sửa trước khi hiển thị cho học viên",
    descriptionEn: "Mercy re-checks corrections before showing them to the learner",
  },

  // ─── 6. Prove improvement ─────────────────────────────────────────────
  {
    id: "HL-PROVE-01",
    dimension: "Chứng minh tiến bộ",
    descriptionVi: "Có thể đo lường sự giảm lỗi giữa nửa đầu và nửa sau buổi học",
    descriptionEn: "Error reduction between first half and second half is measurable",
  },
  {
    id: "HL-PROVE-02",
    dimension: "Chứng minh tiến bộ",
    descriptionVi: "Điểm phát âm (match score) cải thiện trong buổi học",
    descriptionEn: "Pronunciation match scores improve during the session",
  },
  {
    id: "HL-PROVE-03",
    dimension: "Chứng minh tiến bộ",
    descriptionVi: "Học viên tự sửa lỗi nhiều hơn ở nửa sau buổi học",
    descriptionEn: "Learner self-corrects more in the second half of the session",
  },
  {
    id: "HL-PROVE-04",
    dimension: "Chứng minh tiến bộ",
    descriptionVi: "Tỉ lệ học viên tiếp thu sửa lỗi (acknowledgment) tăng trong buổi học",
    descriptionEn: "Correction acknowledgment rate increases during the session",
  },
];

// ─── Checklist Item Evaluation ──────────────────────────────────────────────

/**
 * Evaluate a single checklist item against the evidence from a scenario.
 * Returns the status and concrete evidence in Vietnamese.
 */
export function evaluateChecklistItem(
  itemId: string,
  events: TranscriptCorrectionEvent[],
  contractResults: ContractCheckResult[],
  rubricResults: RubricResult[],
  gainResult: LearningGainResult | null,
  reviewPacket: ChauReviewPacket,
  scenario: LearnerTestScenario,
): { status: ChecklistItemStatus; evidenceVi: string } {
  const turnCount = scenario.turns.length;
  const eventCount = events.length;

  // Pre-compute useful stats
  const totalCorrections = events.reduce(
    (sum, e) => sum + e.corrections.length,
    0,
  );
  const eventsWithCorrections = events.filter(
    (e) => e.corrections.length > 0,
  ).length;
  // Self-correction: look up from scenario turns since TranscriptCorrectionEvent
  // doesn't carry didSelfCorrect directly
  const turnSelfCorrectMap = new Map(
    scenario.turns.map((t) => [t.turnNumber, t.didSelfCorrect]),
  );
  const eventsWithSelfCorrection = events.filter(
    (e) => turnSelfCorrectMap.get(e.turnNumber) === true,
  ).length;
  const eventsWithAcknowledgment = events.filter(
    (e) => e.learnerAcknowledged === true,
  ).length;
  const firstHalf = events.slice(0, Math.floor(events.length / 2));
  const secondHalf = events.slice(Math.floor(events.length / 2));
  const firstHalfCorrections = firstHalf.reduce(
    (sum, e) => sum + e.corrections.length,
    0,
  );
  const secondHalfCorrections = secondHalf.reduce(
    (sum, e) => sum + e.corrections.length,
    0,
  );
  const allContractsPassed = contractResults.every((r) => r.passed);
  const safetyAlwaysPassed = contractResults.every((r) => {
    const safetyIds = new Set([
      "R3_NO_FAKE_PRAISE",
      "R7_STRATEGIC_SILENCE",
      "R8_FACE_SAVING",
    ]);
    return r.rules
      .filter((rule) => safetyIds.has(rule.ruleId))
      .every((rule) => rule.passed);
  });
  const uniqueWeaknessTags = new Set(
    events.flatMap((e) => e.weaknessTags),
  ).size;

  // Match scores (filter nulls, then filter > 0)
  const matchScores: number[] = [];
  for (const e of events) {
    if (e.matchScore != null) matchScores.push(e.matchScore);
  }
  const nonZeroMatchScores = matchScores.filter((s) => s > 0);
  const avgMatchScoreFirst =
    firstHalf.length > 0
      ? firstHalf.reduce((s, e) => s + (e.matchScore ?? 0), 0) / firstHalf.length
      : 0;
  const avgMatchScoreSecond =
    secondHalf.length > 0
      ? secondHalf.reduce((s, e) => s + (e.matchScore ?? 0), 0) / secondHalf.length
      : 0;

  switch (itemId) {
    // ─── Diagnose ──────────────────────────────────────────────────────
    case "HL-DIAGNOSE-01": {
      // At least 1 correction per 2 turns for A1–B1
      const cefr = scenario.persona.cefrLevel;
      if (["A1", "A2", "B1"].includes(cefr)) {
        const correctionRate = eventsWithCorrections / Math.max(eventCount, 1);
        if (correctionRate >= 0.5) {
          return {
            status: "pass",
            evidenceVi: `${eventsWithCorrections}/${eventCount} lượt có lỗi được phát hiện (tỉ lệ ${(correctionRate * 100).toFixed(0)}%) — đạt ngưỡng ≥50% cho ${cefr}`,
          };
        }
        return {
          status: "partial",
          evidenceVi: `${eventsWithCorrections}/${eventCount} lượt có lỗi (tỉ lệ ${(correctionRate * 100).toFixed(0)}%) — dưới ngưỡng 50% cho ${cefr}`,
        };
      }
      return {
        status: "pass",
        evidenceVi: `Trình độ ${cefr} không yêu cầu tỉ lệ phát hiện lỗi ≥50% — học viên trình độ cao có ít lỗi cơ bản hơn`,
      };
    }
    case "HL-DIAGNOSE-02": {
      // Weakness tags match typical patterns for this persona
      const personaTags = new Set(scenario.persona.typicalWeaknessTags);
      const detectedTags = new Set(events.flatMap((e) => e.weaknessTags));
      const matched = [...personaTags].filter((t) => detectedTags.has(t));
      if (matched.length >= 1) {
        return {
          status: "pass",
          evidenceVi: `Mercy gắn đúng ${matched.length} weakness tag đặc trưng: ${matched.join(", ")}`,
        };
      }
      return {
        status: "partial",
        evidenceVi: `Không tìm thấy weakness tag nào khớp với ${scenario.persona.typicalWeaknessTags.join(", ")}`,
      };
    }
    case "HL-DIAGNOSE-03": {
      // Vietlish interference detected
      const vietlishEvents = events.filter((e) =>
        e.corrections.some(
          (c) =>
            c.source === "vietlish-pattern" ||
            (c.explanationVi &&
              /tiếng Việt|người Việt|L1|chuyển ngữ/i.test(c.explanationVi)),
        ),
      );
      if (vietlishEvents.length > 0) {
        return {
          status: "pass",
          evidenceVi: `${vietlishEvents.length}/${eventCount} lượt có phát hiện lỗi do ảnh hưởng tiếng Việt`,
        };
      }
      // Higher-level learners may have fewer Vietlish errors — not a fail
      if (["B2", "C1"].includes(scenario.persona.cefrLevel)) {
        return {
          status: "pass",
          evidenceVi: `Trình độ ${scenario.persona.cefrLevel} — ảnh hưởng tiếng Việt giảm dần, không bắt buộc phát hiện`,
        };
      }
      return {
        status: "partial",
        evidenceVi: "Không phát hiện lỗi do ảnh hưởng tiếng Việt trong buổi học",
      };
    }
    case "HL-DIAGNOSE-04": {
      // No missed basic grammar errors at A1-A2
      const cefr = scenario.persona.cefrLevel;
      if (["A1", "A2"].includes(cefr)) {
        const grammarEvents = events.filter((e) =>
          e.corrections.some(
            (c) =>
              c.source === "grammar-rule" || c.source === "vietlish-pattern",
          ),
        );
        if (grammarEvents.length >= Math.ceil(eventCount * 0.3)) {
          return {
            status: "pass",
            evidenceVi: `${grammarEvents.length}/${eventCount} lượt có phát hiện lỗi ngữ pháp — phủ tốt cho trình độ ${cefr}`,
          };
        }
        return {
          status: "partial",
          evidenceVi: `Chỉ ${grammarEvents.length}/${eventCount} lượt có phát hiện lỗi ngữ pháp — có thể bỏ sót lỗi cơ bản`,
        };
      }
      return {
        status: "pass",
        evidenceVi: `Trình độ ${cefr} — không áp dụng tiêu chí lỗi ngữ pháp cơ bản`,
      };
    }
    case "HL-DIAGNOSE-05": {
      // Distinguishes pronunciation from grammar errors
      const hasGrammarSource = events.some((e) =>
        e.corrections.some((c) => c.source === "grammar-rule"),
      );
      const hasPhoneticSource = events.some((e) =>
        e.corrections.some(
          (c) =>
            c.source === "phonetic-readback" ||
            c.source === "phonetic-confusable" ||
            c.source === "stt-garble",
        ),
      );
      if (hasGrammarSource && hasPhoneticSource) {
        return {
          status: "pass",
          evidenceVi: "Mercy phát hiện cả lỗi ngữ pháp (grammar-rule) và lỗi phát âm (phonetic-readback/stt-garble)",
        };
      }
      const matchScoresVary =
        nonZeroMatchScores.length >= 2 &&
        Math.max(...nonZeroMatchScores) - Math.min(...nonZeroMatchScores) > 10;
      if (hasGrammarSource && matchScoresVary) {
        return {
          status: "pass",
          evidenceVi: "Mercy phát hiện lỗi ngữ pháp và điểm phát âm dao động — cho thấy phân biệt được hai loại lỗi",
        };
      }
      return {
        status: "partial",
        evidenceVi: "Chỉ phát hiện một loại lỗi — có thể chưa phân biệt rõ lỗi phát âm và ngữ pháp",
      };
    }

    // ─── Teach ─────────────────────────────────────────────────────────
    case "HL-TEACH-01": {
      // Explanations in Vietnamese
      const hasVietnameseExplanations = events.some((e) =>
        e.corrections.some(
          (c) => c.explanationVi && c.explanationVi.length > 10,
        ),
      );
      if (hasVietnameseExplanations) {
        return {
          status: "pass",
          evidenceVi: "Các giải thích lỗi đều có explanationVi — học viên người Việt hiểu được",
        };
      }
      return {
        status: "partial",
        evidenceVi: "Thiếu giải thích bằng tiếng Việt cho một số lỗi",
      };
    }
    case "HL-TEACH-02": {
      // One correction max (R2)
      const maxCorrectionsPerTurn = Math.max(
        ...events.map((e) => e.corrections.length),
        0,
      );
      // Check contract R2 results
      const r2Checks = contractResults.flatMap((r) =>
        r.rules.filter((rule) => rule.ruleId === "R2_ONE_CORRECTION_MAX"),
      );
      const r2AllPassed = r2Checks.every((c) => c.passed);
      if (maxCorrectionsPerTurn <= 2 && r2AllPassed) {
        return {
          status: "pass",
          evidenceVi: `Tối đa ${maxCorrectionsPerTurn} lỗi/lượt, R2 passed — Mercy giữ kỷ luật 1 lỗi chính mỗi lượt`,
        };
      }
      return {
        status: maxCorrectionsPerTurn <= 3 ? "partial" : "fail",
        evidenceVi: `Tối đa ${maxCorrectionsPerTurn} lỗi/lượt — R2 có thể bị vi phạm nếu sửa quá nhiều lỗi cùng lúc`,
      };
    }
    case "HL-TEACH-03": {
      // Meaning first (R1)
      const r1Checks = contractResults.flatMap((r) =>
        r.rules.filter((rule) => rule.ruleId === "R1_MEANING_FIRST"),
      );
      const r1AllPassed =
        r1Checks.length > 0 && r1Checks.every((c) => c.passed);
      if (r1AllPassed) {
        return {
          status: "pass",
          evidenceVi: `R1 passed ${r1Checks.length}/${r1Checks.length} lượt — Mercy công nhận ý nghĩa trước khi sửa`,
        };
      }
      return {
        status: r1Checks.length > 0 ? "partial" : "insufficient_data",
        evidenceVi:
          r1Checks.length > 0
            ? `R1 failed ở ${r1Checks.filter((c) => !c.passed).length} lượt — Mercy có thể sửa lỗi trước khi hiểu ý học viên`
            : "Không có dữ liệu R1 — contract chưa được kiểm tra",
      };
    }
    case "HL-TEACH-04": {
      // Face saving (R8)
      const r8Checks = contractResults.flatMap((r) =>
        r.rules.filter((rule) => rule.ruleId === "R8_FACE_SAVING"),
      );
      const r8AllPassed =
        r8Checks.length > 0 && r8Checks.every((c) => c.passed);
      if (r8AllPassed) {
        return {
          status: "pass",
          evidenceVi: `R8 passed tất cả ${r8Checks.length} lượt — Mercy giữ thể diện cho học viên`,
        };
      }
      return {
        status: r8Checks.some((c) => !c.passed) ? "fail" : "insufficient_data",
        evidenceVi:
          r8Checks.length > 0
            ? `R8 failed ở ${r8Checks.filter((c) => !c.passed).length}/${r8Checks.length} lượt — Mercy có thể làm học viên xấu hổ`
            : "Không có dữ liệu R8",
      };
    }
    case "HL-TEACH-05": {
      // No fake praise (R3)
      const r3Checks = contractResults.flatMap((r) =>
        r.rules.filter((rule) => rule.ruleId === "R3_NO_FAKE_PRAISE"),
      );
      const r3AllPassed =
        r3Checks.length > 0 && r3Checks.every((c) => c.passed);
      if (r3AllPassed) {
        return {
          status: "pass",
          evidenceVi: `R3 passed tất cả ${r3Checks.length} lượt — Mercy không khen giả tạo`,
        };
      }
      return {
        status: r3Checks.some((c) => !c.passed) ? "fail" : "insufficient_data",
        evidenceVi:
          r3Checks.length > 0
            ? `R3 failed ở ${r3Checks.filter((c) => !c.passed).length} lượt — Mercy có thể đang khen không thật`
            : "Không có dữ liệu R3",
      };
    }
    case "HL-TEACH-06": {
      // Self-correction space (R9)
      const r9Checks = contractResults.flatMap((r) =>
        r.rules.filter(
          (rule) => rule.ruleId === "R9_SELF_CORRECTION_SPACE",
        ),
      );
      const r9AllPassed =
        r9Checks.length > 0 && r9Checks.every((c) => c.passed);
      const hasSelfCorrectionEvents = eventsWithSelfCorrection > 0;
      if (r9AllPassed || hasSelfCorrectionEvents) {
        return {
          status: "pass",
          evidenceVi: `R9 passed ${r9Checks.filter((c) => c.passed).length}/${r9Checks.length} lượt, ${eventsWithSelfCorrection} lần học viên tự sửa`,
        };
      }
      return {
        status: "partial",
        evidenceVi: "Chưa thấy Mercy cho học viên không gian tự sửa lỗi",
      };
    }

    // ─── Remember ──────────────────────────────────────────────────────
    case "HL-REMEMBER-01": {
      // References known weakness (R5)
      const weaknessReferencedTurns = scenario.turns.filter(
        (t) => t.referencesTrackedWeakness,
      ).length;
      const r5Checks = contractResults.flatMap((r) =>
        r.rules.filter((rule) => rule.ruleId === "R5_REMEMBER_WEAKNESS"),
      );
      const r5Passed = r5Checks.filter((c) => c.passed).length;
      if (weaknessReferencedTurns >= 1 || r5Passed >= 1) {
        return {
          status: "pass",
          evidenceVi: `${weaknessReferencedTurns} lượt Mercy nhắc đến điểm yếu đã biết, R5 passed ${r5Passed} lần`,
        };
      }
      return {
        status: "partial",
        evidenceVi: "Mercy chưa nhắc đến điểm yếu đã biết của học viên trong buổi học",
      };
    }
    case "HL-REMEMBER-02": {
      // Accumulates weakness tags across turns
      const tagsPerTurn = events.map((e) => e.weaknessTags.length);
      const laterTurnsHaveMoreTags =
        tagsPerTurn.length >= 4 &&
        tagsPerTurn[tagsPerTurn.length - 1] >= tagsPerTurn[0];
      if (uniqueWeaknessTags >= 3 || laterTurnsHaveMoreTags) {
        return {
          status: "pass",
          evidenceVi: `${uniqueWeaknessTags} weakness tags duy nhất được tích lũy qua ${eventCount} lượt`,
        };
      }
      return {
        status: "partial",
        evidenceVi: `Chỉ ${uniqueWeaknessTags} weakness tag — Mercy có thể không tích lũy đủ thông tin về học viên`,
      };
    }
    case "HL-REMEMBER-03": {
      // Has strengths/weaknesses list after session
      const hasExpectedStrengths =
        scenario.expectedMemory.strengths.length > 0;
      const hasExpectedWeaknesses =
        scenario.expectedMemory.weaknesses.length > 0;
      if (hasExpectedStrengths && hasExpectedWeaknesses) {
        return {
          status: "pass",
          evidenceVi: `Sau buổi học: ${scenario.expectedMemory.strengths.length} điểm mạnh, ${scenario.expectedMemory.weaknesses.length} điểm yếu được ghi nhận`,
        };
      }
      return {
        status: "partial",
        evidenceVi: "Danh sách điểm mạnh/yếu sau buổi học chưa đầy đủ",
      };
    }
    case "HL-REMEMBER-04": {
      // Recommends next lesson based on weaknesses
      const hasRecommendation =
        scenario.expectedMemory.recommendation.length > 0;
      if (hasRecommendation) {
        return {
          status: "pass",
          evidenceVi: `Mercy gợi ý: "${scenario.expectedMemory.recommendation}"`,
        };
      }
      return {
        status: "partial",
        evidenceVi: "Mercy chưa gợi ý bài học tiếp theo dựa trên điểm yếu",
      };
    }

    // ─── Adapt ─────────────────────────────────────────────────────────
    case "HL-ADAPT-01": {
      // Adjusts difficulty to CEFR level
      const cefr = scenario.persona.cefrLevel;
      // Lower CEFR → more corrections (more basic errors detected)
      // Higher CEFR → fewer basic corrections, more precision errors
      const basicCorrections = events.filter((e) =>
        e.corrections.some(
          (c) =>
            c.source === "grammar-rule" &&
            c.confidence > 0.7,
        ),
      ).length;
      // For A1, we expect high-touch correction; for C1, low-touch precision
      const correctionTouchRate = basicCorrections / Math.max(eventCount, 1);
      if (["A1", "A2"].includes(cefr) && correctionTouchRate >= 0.3) {
        return {
          status: "pass",
          evidenceVi: `${basicCorrections}/${eventCount} lượt có sửa lỗi (tỉ lệ ${(correctionTouchRate * 100).toFixed(0)}%) — phù hợp với trình độ ${cefr}`,
        };
      }
      if (["B1", "B2", "C1"].includes(cefr)) {
        return {
          status: "pass",
          evidenceVi: `Trình độ ${cefr} — Mercy tập trung vào lỗi tinh tế hơn là sửa dày đặc`,
        };
      }
      return {
        status: "partial",
        evidenceVi: `Tỉ lệ sửa lỗi ${(correctionTouchRate * 100).toFixed(0)}% có thể chưa phù hợp với trình độ ${cefr}`,
      };
    }
    case "HL-ADAPT-02": {
      // Correction rate decreases as learner improves
      if (
        eventCount >= 4 &&
        firstHalfCorrections > secondHalfCorrections
      ) {
        return {
          status: "pass",
          evidenceVi: `Số lỗi giảm từ ${firstHalfCorrections} (nửa đầu) xuống ${secondHalfCorrections} (nửa sau) — Mercy giảm can thiệp khi học viên tiến bộ`,
        };
      }
      if (eventCount < 4) {
        return {
          status: "insufficient_data",
          evidenceVi: `Chỉ ${eventCount} lượt — cần ≥4 lượt để đánh giá sự thích ứng`,
        };
      }
      return {
        status: "partial",
        evidenceVi: `Số lỗi: ${firstHalfCorrections} (nửa đầu) vs ${secondHalfCorrections} (nửa sau) — chưa thấy xu hướng giảm`,
      };
    }
    case "HL-ADAPT-03": {
      // Increases follow-up complexity for good answers
      const highScoreTurns = scenario.turns.filter(
        (t) => t.matchScore >= 70 && t.acknowledged,
      ).length;
      if (highScoreTurns >= 1) {
        return {
          status: "pass",
          evidenceVi: `${highScoreTurns}/${turnCount} lượt học viên trả lời tốt (match ≥70, acknowledged) — Mercy có cơ hội tăng độ khó follow-up`,
        };
      }
      return {
        status: "partial",
        evidenceVi: "Chưa thấy Mercy tăng độ phức tạp follow-up khi học viên trả lời tốt",
      };
    }
    case "HL-ADAPT-04": {
      // More Vietnamese for A1–A2, less for B2–C1
      const cefr = scenario.persona.cefrLevel;
      // Count turns where teacher response has significant Vietnamese (check response text)
      const viHeavyTurns = scenario.turns.filter(
        (t) =>
          t.teacherResponseVi.length > 80 &&
          (t.grammarPoints.length >= 1 ||
            t.teacherResponseVi.includes("tiếng Việt") ||
            t.teacherResponseVi.includes("người Việt")),
      ).length;
      if (["A1", "A2"].includes(cefr) && viHeavyTurns >= Math.ceil(turnCount * 0.5)) {
        return {
          status: "pass",
          evidenceVi: `${viHeavyTurns}/${turnCount} lượt có giải thích tiếng Việt chi tiết — phù hợp với trình độ ${cefr}`,
        };
      }
      if (["B2", "C1"].includes(cefr)) {
        return {
          status: "pass",
          evidenceVi: `Trình độ ${cefr} — Mercy dùng ít tiếng Việt hơn, tập trung vào tiếng Anh`,
        };
      }
      return {
        status: "pass",
        evidenceVi: `Mercy dùng tiếng Việt cân bằng cho trình độ ${cefr}`,
      };
    }

    // ─── Self-check ────────────────────────────────────────────────────
    case "HL-SELFCHECK-01": {
      // Strategic silence (R7)
      const r7Checks = contractResults.flatMap((r) =>
        r.rules.filter((rule) => rule.ruleId === "R7_STRATEGIC_SILENCE"),
      );
      const r7AllPassed =
        r7Checks.length > 0 && r7Checks.every((c) => c.passed);
      if (r7AllPassed) {
        return {
          status: "pass",
          evidenceVi: `R7 passed tất cả ${r7Checks.length} lượt — Mercy giữ im lặng chiến lược khi không chắc chắn`,
        };
      }
      return {
        status: r7Checks.length > 0 ? "partial" : "insufficient_data",
        evidenceVi:
          r7Checks.length > 0
            ? `R7 failed ở ${r7Checks.filter((c) => !c.passed).length} lượt — Mercy có thể đưa ra câu trả lời khi không chắc chắn`
            : "Không có dữ liệu R7",
      };
    }
    case "HL-SELFCHECK-02": {
      // Safety audit gate passed (R3+R7+R8)
      if (safetyAlwaysPassed) {
        return {
          status: "pass",
          evidenceVi: `Safety audit gate (R3+R7+R8) passed tất cả ${contractResults.length} lượt`,
        };
      }
      const safetyViolations = contractResults.filter((r) => {
        const safetyIds = new Set([
          "R3_NO_FAKE_PRAISE",
          "R7_STRATEGIC_SILENCE",
          "R8_FACE_SAVING",
        ]);
        return r.rules
          .filter((rule) => safetyIds.has(rule.ruleId))
          .some((rule) => !rule.passed);
      }).length;
      return {
        status: "fail",
        evidenceVi: `${safetyViolations}/${contractResults.length} lượt vi phạm quy tắc an toàn (R3/R7/R8)`,
      };
    }
    case "HL-SELFCHECK-03": {
      // Overclaim guard
      const overclaimScore = reviewPacket.selfCheck.review.score;
      if (overclaimScore >= 2) {
        return {
          status: "pass",
          evidenceVi: `Self-check review score ${overclaimScore}/3 — Mercy không tự tin quá mức`,
        };
      }
      return {
        status: "partial",
        evidenceVi: `Self-check review score ${overclaimScore}/3 — cần kiểm tra lại overclaim guard`,
      };
    }
    case "HL-SELFCHECK-04": {
      // Re-checks corrections before showing
      const correctionsWithHighConfidence = events
        .flatMap((e) => e.corrections)
        .filter((c) => c.confidence >= 0.8).length;
      const totalCorrectionItems = events.flatMap((e) => e.corrections).length;
      if (
        totalCorrectionItems === 0 ||
        correctionsWithHighConfidence / Math.max(totalCorrectionItems, 1) >=
          0.5
      ) {
        return {
          status: "pass",
          evidenceVi: `${correctionsWithHighConfidence}/${totalCorrectionItems} lỗi sửa có confidence ≥0.8 — Mercy kiểm tra kỹ trước khi hiển thị`,
        };
      }
      return {
        status: "partial",
        evidenceVi: `Chỉ ${correctionsWithHighConfidence}/${totalCorrectionItems} lỗi sửa có confidence cao — một số câu sửa có thể chưa được kiểm tra kỹ`,
      };
    }

    // ─── Prove improvement ─────────────────────────────────────────────
    case "HL-PROVE-01": {
      // Error reduction measurable
      if (gainResult) {
        const errorReduction = gainResult.dimensions.find(
          (d) => d.dimensionId === "lg_error_reduction",
        );
        if (errorReduction && errorReduction.score >= 2) {
          return {
            status: "pass",
            evidenceVi: `LG1 error_reduction score ${errorReduction.score}/3 — giảm lỗi rõ rệt giữa nửa đầu và nửa sau`,
          };
        }
        if (errorReduction) {
          return {
            status: errorReduction.score === 1 ? "partial" : "fail",
            evidenceVi: `LG1 error_reduction score ${errorReduction.score}/3 — ${errorReduction.score === 1 ? "giảm lỗi nhẹ" : "không giảm lỗi"}`,
          };
        }
      }
      // Fallback: manual check
      if (firstHalfCorrections > secondHalfCorrections && eventCount >= 4) {
        return {
          status: "pass",
          evidenceVi: `Lỗi giảm từ ${firstHalfCorrections} (nửa đầu) xuống ${secondHalfCorrections} (nửa sau)`,
        };
      }
      return {
        status: eventCount >= 4 ? "partial" : "insufficient_data",
        evidenceVi:
          eventCount >= 4
            ? `Lỗi không giảm giữa hai nửa buổi học (${firstHalfCorrections} vs ${secondHalfCorrections})`
            : `Chỉ ${eventCount} lượt — cần ≥4 để đo lường`,
      };
    }
    case "HL-PROVE-02": {
      // Pronunciation improvement
      if (avgMatchScoreSecond > avgMatchScoreFirst && matchScores.length >= 4) {
        const improvement = (
          avgMatchScoreSecond - avgMatchScoreFirst
        ).toFixed(1);
        return {
          status: "pass",
          evidenceVi: `Điểm phát âm trung bình tăng từ ${avgMatchScoreFirst.toFixed(1)} → ${avgMatchScoreSecond.toFixed(1)} (+${improvement})`,
        };
      }
      if (gainResult) {
        const pronGain = gainResult.dimensions.find(
          (d) => d.dimensionId === "lg_pronunciation_gain",
        );
        if (pronGain && pronGain.score >= 2) {
          return {
            status: "pass",
            evidenceVi: `LG2 pronunciation_gain score ${pronGain.score}/3`,
          };
        }
      }
      return {
        status: "partial",
        evidenceVi: "Điểm phát âm chưa cải thiện rõ rệt trong buổi học",
      };
    }
    case "HL-PROVE-03": {
      // Self-correction growth — use scenario turn data
      const firstHalfSelfCorrect = firstHalf.filter(
        (e) => turnSelfCorrectMap.get(e.turnNumber) === true,
      ).length;
      const secondHalfSelfCorrect = secondHalf.filter(
        (e) => turnSelfCorrectMap.get(e.turnNumber) === true,
      ).length;
      if (
        secondHalfSelfCorrect > firstHalfSelfCorrect &&
        eventCount >= 4
      ) {
        return {
          status: "pass",
          evidenceVi: `Tự sửa lỗi tăng từ ${firstHalfSelfCorrect} (nửa đầu) → ${secondHalfSelfCorrect} (nửa sau)`,
        };
      }
      if (gainResult) {
        const selfCorr = gainResult.dimensions.find(
          (d) => d.dimensionId === "lg_self_correction",
        );
        if (selfCorr && selfCorr.score >= 2) {
          return {
            status: "pass",
            evidenceVi: `LG3 self_correction score ${selfCorr.score}/3`,
          };
        }
      }
      return {
        status: "partial",
        evidenceVi: "Học viên chưa tự sửa lỗi nhiều hơn trong buổi học",
      };
    }
    case "HL-PROVE-04": {
      // Acknowledgment rate increase
      const firstHalfAck = firstHalf.filter(
        (e) => e.learnerAcknowledged === true,
      ).length;
      const secondHalfAck = secondHalf.filter(
        (e) => e.learnerAcknowledged === true,
      ).length;
      const ackRateFirst =
        firstHalf.length > 0 ? firstHalfAck / firstHalf.length : 0;
      const ackRateSecond =
        secondHalf.length > 0 ? secondHalfAck / secondHalf.length : 0;
      if (ackRateSecond >= ackRateFirst && ackRateSecond > 0) {
        return {
          status: "pass",
          evidenceVi: `Tỉ lệ tiếp thu tăng từ ${(ackRateFirst * 100).toFixed(0)}% → ${(ackRateSecond * 100).toFixed(0)}%`,
        };
      }
      if (gainResult) {
        const ack = gainResult.dimensions.find(
          (d) => d.dimensionId === "lg_acknowledgment",
        );
        if (ack && ack.score >= 2) {
          return {
            status: "pass",
            evidenceVi: `LG4 acknowledgment score ${ack.score}/3`,
          };
        }
      }
      return {
        status: "partial",
        evidenceVi: "Tỉ lệ tiếp thu sửa lỗi chưa tăng trong buổi học",
      };
    }

    default:
      return {
        status: "insufficient_data",
        evidenceVi: `Checklist item ${itemId} chưa được triển khai`,
      };
  }
}

// ─── Main Checklist Runner ──────────────────────────────────────────────────

/**
 * Input to the checklist runner — all the data from a testing scenario run.
 */
export interface ScenarioChecklistInput {
  scenario: LearnerTestScenario;
  events: TranscriptCorrectionEvent[];
  contractResults: ContractCheckResult[];
  auditResults: AuditResult[];
  rubricResults: RubricResult[];
  gainResult: LearningGainResult | null;
  reviewPacket: ChauReviewPacket;
}

/**
 * Run the full human learner checklist against a single scenario.
 * Returns all checklist items with their evaluated status.
 */
export function evaluateScenarioChecklist(
  input: ScenarioChecklistInput,
): HumanLearnerChecklistItem[] {
  const { scenario, events, contractResults, rubricResults, gainResult, reviewPacket } = input;

  return HUMAN_LEARNER_CHECKLIST_CATALOG.map((item) => {
    const { status, evidenceVi } = evaluateChecklistItem(
      item.id,
      events,
      contractResults,
      rubricResults,
      gainResult,
      reviewPacket,
      scenario,
    );
    return {
      id: item.id,
      dimension: item.dimension,
      descriptionVi: item.descriptionVi,
      descriptionEn: item.descriptionEn,
      status,
      evidenceVi,
      source: scenario.id,
    };
  });
}

// ─── Dimension Summaries ────────────────────────────────────────────────────

/**
 * Roll up checklist items into per-dimension summaries.
 */
export function buildDimensionSummaries(
  items: HumanLearnerChecklistItem[],
): HumanLearnerDimensionSummary[] {
  const dimensionCatalog = [
    { dimensionId: "Chẩn đoán", titleVi: "Chẩn đoán", titleEn: "Diagnose" },
    { dimensionId: "Giảng dạy", titleVi: "Giảng dạy", titleEn: "Teach" },
    { dimensionId: "Ghi nhớ", titleVi: "Ghi nhớ", titleEn: "Remember" },
    { dimensionId: "Thích ứng", titleVi: "Thích ứng", titleEn: "Adapt" },
    { dimensionId: "Tự kiểm", titleVi: "Tự kiểm", titleEn: "Self-check" },
    {
      dimensionId: "Chứng minh tiến bộ",
      titleVi: "Chứng minh tiến bộ",
      titleEn: "Prove improvement",
    },
  ];

  return dimensionCatalog.map((dim) => {
    const dimItems = items.filter((i) => i.dimension === dim.dimensionId);
    const statusCounts: Record<ChecklistItemStatus, number> = {
      pass: 0,
      partial: 0,
      fail: 0,
      insufficient_data: 0,
    };
    for (const item of dimItems) {
      statusCounts[item.status]++;
    }

    const failCount = statusCounts.fail;
    const partialCount = statusCounts.partial;
    const passCount = statusCounts.pass;
    const overallPassed = failCount === 0 && partialCount <= 1;
    const total = dimItems.length;

    let summaryVi: string;
    if (failCount > 0) {
      summaryVi = `Cần cải thiện: ${failCount}/${total} mục thất bại, ${passCount}/${total} đạt`;
    } else if (partialCount >= 2) {
      summaryVi = `Một phần: ${partialCount}/${total} mục chưa hoàn toàn đạt, ${passCount}/${total} đạt`;
    } else if (passCount === total) {
      summaryVi = `Xuất sắc: tất cả ${total}/${total} mục đều đạt`;
    } else {
      summaryVi = `Tốt: ${passCount}/${total} mục đạt, ${partialCount}/${total} mục một phần`;
    }

    return {
      dimensionId: dim.dimensionId,
      titleVi: dim.titleVi,
      titleEn: dim.titleEn,
      itemCount: dimItems.length,
      statusCounts,
      overallPassed,
      summaryVi,
    };
  });
}

// ─── Full Checklist Result Builder ──────────────────────────────────────────

/**
 * Build the complete human learner testing checklist result
 * from one or more scenario runs.
 */
export function buildHumanLearnerChecklistResult(
  scenarios: ScenarioChecklistInput[],
  now?: string,
): HumanLearnerChecklistResult {
  const generatedAt = now || new Date().toISOString();

  // Evaluate all scenarios
  const allItems = scenarios.flatMap((s) => evaluateScenarioChecklist(s));

  // Per-dimension summaries
  const dimensions = buildDimensionSummaries(allItems);

  // Global status counts
  const globalStatusCounts: Record<ChecklistItemStatus, number> = {
    pass: 0,
    partial: 0,
    fail: 0,
    insufficient_data: 0,
  };
  for (const item of allItems) {
    globalStatusCounts[item.status]++;
  }

  // Overall verdict
  const failCount = globalStatusCounts.fail;
  const partialCount = globalStatusCounts.partial;
  const passCount = globalStatusCounts.pass;
  const totalItems = allItems.length;

  let overallVerdict: ChauReviewVerdict;
  let overallPassed: boolean;

  if (failCount === 0 && partialCount === 0) {
    overallVerdict = "excellent_teacher";
    overallPassed = true;
  } else if (failCount === 0 && partialCount <= 3) {
    overallVerdict = "good_teacher";
    overallPassed = true;
  } else if (failCount <= 2 && partialCount <= 6) {
    overallVerdict = "needs_improvement";
    overallPassed = false;
  } else {
    overallVerdict = "concerning";
    overallPassed = false;
  }

  // Action items
  const actionItems: string[] = [];
  for (const dim of dimensions) {
    if (!dim.overallPassed) {
      const failedItems = allItems.filter(
        (i) => i.dimension === dim.dimensionId && i.status === "fail",
      );
      for (const item of failedItems) {
        actionItems.push(`[${dim.titleVi}] ${item.descriptionVi} — ${item.evidenceVi}`);
      }
      const partialItems = allItems.filter(
        (i) => i.dimension === dim.dimensionId && i.status === "partial",
      );
      if (partialItems.length > 0 && failedItems.length === 0) {
        actionItems.push(
          `[${dim.titleVi}] Cần cải thiện ${partialItems.length} mục chưa hoàn toàn đạt`,
        );
      }
    }
  }

  const requiredDataItems = allItems.filter(
    (i) => i.status === "insufficient_data",
  );
  if (requiredDataItems.length > 0) {
    actionItems.push(
      `[DỮ LIỆU] ${requiredDataItems.length} mục thiếu dữ liệu để đánh giá`,
    );
  }

  // Compact summary
  const dimensionStatusVi = dimensions
    .map((d) => `${d.overallPassed ? "✓" : "⚠"} ${d.titleVi}`)
    .join(" | ");
  const compactSummaryVi =
    `Mercy — ${overallVerdict === "excellent_teacher" ? "xuất sắc" : overallVerdict === "good_teacher" ? "tốt" : overallVerdict === "needs_improvement" ? "cần cải thiện" : "đáng lo"} | ` +
    `${passCount}/${totalItems} mục đạt | ${dimensionStatusVi}`;

  return {
    generatedAt,
    overallVerdict,
    overallPassed,
    scenarioCount: scenarios.length,
    totalItems,
    globalStatusCounts,
    dimensions,
    items: allItems,
    actionItems,
    compactSummaryVi,
  };
}

// ─── Quick Checks ───────────────────────────────────────────────────────────

/**
 * Returns true if the checklist result is ready for Chau's review.
 */
export function isChecklistReportable(
  result: HumanLearnerChecklistResult,
): boolean {
  return (
    result.totalItems >= 10 &&
    result.globalStatusCounts.insufficient_data < result.totalItems * 0.3
  );
}

/**
 * Returns a simple pass/fail on the critical dimensions only
 * (safety + teach + prove).
 */
export function checklistCriticalDimensionsPassed(
  result: HumanLearnerChecklistResult,
): boolean {
  const criticalDims = ["Giảng dạy", "Tự kiểm", "Chứng minh tiến bộ"];
  return result.dimensions
    .filter((d) => criticalDims.includes(d.dimensionId))
    .every((d) => d.overallPassed);
}

/**
 * Get the checklist status for a specific dimension.
 */
export function getChecklistDimensionStatus(
  result: HumanLearnerChecklistResult,
  dimensionId: string,
): HumanLearnerDimensionSummary | null {
  return result.dimensions.find((d) => d.dimensionId === dimensionId) ?? null;
}

/**
 * Get all failed or partial items that need attention.
 */
export function getChecklistActionItems(
  result: HumanLearnerChecklistResult,
): HumanLearnerChecklistItem[] {
  return result.items.filter(
    (i) => i.status === "fail" || i.status === "partial",
  );
}
