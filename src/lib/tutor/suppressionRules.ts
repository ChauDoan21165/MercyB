/**
 * Teacher Mercy — Suppression Rules
 *
 * Explicit catalog of WHY a skilled human teacher chooses NOT to correct.
 *
 * The correction timing engine (teacherMercyCorrectionTiming.ts) decides
 * WHEN to correct via the T1-T8 gate chain. This module provides the
 * complementary wisdom: the pedagogical principles behind deliberate
 * suppression decisions.
 *
 * Each rule answers: "A human teacher would skip this correction because ____."
 *
 * Design principles:
 *   1. Explicit over implicit — every SUPPRESS has a named reason.
 *   2. Learner-facing rationale — every rule has a Vietnamese explanation.
 *   3. Testable gates — every rule has a check function that can be tested.
 *   4. Layers on top — does not modify the timing engine; enriches its output.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import type { ErrorSeverity, LearnerConfidence } from "./teacherMercyCorrectionTiming";

// ─── Suppression Rule Types ────────────────────────────────────────────────

/**
 * Categories of suppression reasons.
 * Each rule belongs to exactly one category — this helps
 * the UI layer group and display suppression reasons.
 */
export type SuppressionCategory =
  | "fluency_first"       // prioritize communication flow over accuracy
  | "learner_state"       // respect learner's emotional / cognitive state
  | "error_nature"        // the error itself doesn't warrant correction
  | "conversation_flow"   // don't derail the conversation
  | "developmental";      // above the learner's current level

/**
 * A named suppression rule — one specific reason a human teacher
 * would choose NOT to correct in a given situation.
 */
export type SuppressionRule = {
  /** Unique rule ID (e.g., "S1_FLUENCY_FLOW"). */
  id: string;
  /** Priority score — higher = stronger reason to suppress. */
  priority: number;
  /** Vietnamese label (UI-facing). */
  labelVi: string;
  /** English label (for telemetry / internal use). */
  labelEn: string;
  /** Vietnamese pedagogical rationale — why this matters. */
  rationaleVi: string;
  /** English rationale for telemetry / logging. */
  rationaleEn: string;
  /** Which category this rule belongs to. */
  category: SuppressionCategory;
};

/**
 * Context for evaluating which suppression rules apply.
 */
export type SuppressionContext = {
  /** The learner's raw text in this turn. */
  learnerText: string;
  /** Severity of the primary detected error. */
  errorSeverity: ErrorSeverity;
  /** Known CEFR level (null = unknown, treated as beginner). */
  cefrLevel: string | null;
  /** The learner's apparent confidence. */
  learnerConfidence: LearnerConfidence;
  /** Whether the learner self-corrected in this turn. */
  didSelfCorrect: boolean;
  /** How many times this same error has appeared recently. */
  sameMistakeCount: number;
  /** Total corrections already delivered in this session. */
  previousCorrectionsThisSession: number;
  /** Whether the error is on the current lesson's target skill. */
  isCurrentLessonTarget: boolean;
  /** Whether the learner appears to be in storytelling / flow mode. */
  isInFlowMode?: boolean;
  /** Whether the learner is showing frustration markers. */
  isShowingFrustration?: boolean;
  /** Length of the learner's utterance in words (rough). */
  utteranceWordCount?: number;
};

/**
 * The result of evaluating a single suppression rule against a context.
 */
export type SuppressionEvaluation = {
  /** The rule that was evaluated. */
  rule: SuppressionRule;
  /** Whether the rule applies in this context. */
  applies: boolean;
  /** Specific reason why it applies (or doesn't) in THIS context. */
  reason: string;
};

/**
 * Complete suppression decision — which rules apply and why.
 */
export type SuppressionDecision = {
  /** Whether to suppress correction (true if any rule applies). */
  shouldSuppress: boolean;
  /** All applicable suppression rules, sorted by priority (highest first). */
  applicableRules: SuppressionEvaluation[];
  /** The single strongest (highest priority) applicable rule, or null. */
  primaryReason: SuppressionEvaluation | null;
  /** Vietnamese rationale for the learner — from the primary rule. */
  rationaleVi: string;
  /** English rationale for telemetry — from the primary rule. */
  rationaleEn: string;
};

// ─── Suppression Rule Catalog ──────────────────────────────────────────────

/**
 * S1 — Fluency Flow
 *
 * "Don't interrupt when the learner is communicating meaningfully."
 *
 * When a learner produces a long, flowing utterance (8+ words),
 * interrupting to fix a minor error damages fluency practice
 * more than the correction helps accuracy.
 *
 * SLA principle: In communicative tasks, fluency takes priority
 * over accuracy — especially when meaning is clear.
 */
const S1_FLUENCY_FLOW: SuppressionRule = {
  id: "S1_FLUENCY_FLOW",
  priority: 85,
  labelVi: "Giữ mạch nói tự nhiên",
  labelEn: "Preserve fluency flow",
  rationaleVi:
    "Bạn đang nói rất tự nhiên — Mercy không muốn cắt ngang mạch suy nghĩ của bạn. Lỗi nhỏ này không đáng để dừng lại.",
  rationaleEn:
    "Learner is in communication flow — interrupting a long, meaningful utterance for a minor correction damages fluency practice more than the correction helps.",
  category: "fluency_first",
};

/**
 * S2 — Isolated Slip
 *
 * "Don't correct a one-off performance error."
 *
 * If this error hasn't appeared before (sameMistakeCount = 1)
 * and the learner's level suggests they should know the rule,
 * it's likely a performance slip, not a competence gap.
 * One-off slips self-resolve; systematic errors need correction.
 */
const S2_ISOLATED_SLIP: SuppressionRule = {
  id: "S2_ISOLATED_SLIP",
  priority: 70,
  labelVi: "Lỗi sơ suất một lần",
  labelEn: "Isolated performance slip",
  rationaleVi:
    "Lỗi này có vẻ chỉ là sơ suất — bạn chưa lặp lại lần nào. Nếu nó xuất hiện lại, Mercy sẽ cùng bạn sửa sau.",
  rationaleEn:
    "This error appears to be a one-off performance slip — no repetition history. Systematic errors deserve correction; isolated slips often self-resolve.",
  category: "error_nature",
};

/**
 * S3 — Affective Filter
 *
 * "Don't correct when the learner is anxious or frustrated."
 *
 * Krashen's Affective Filter hypothesis: high anxiety blocks
 * language acquisition. A correction delivered to an anxious
 * learner is not just wasted — it's counterproductive.
 */
const S3_AFFECTIVE_FILTER: SuppressionRule = {
  id: "S3_AFFECTIVE_FILTER",
  priority: 90,
  labelVi: "Giữ tâm lý thoải mái",
  labelEn: "Lower affective filter",
  rationaleVi:
    "Mercy thấy bạn hơi căng thẳng — lúc này quan trọng nhất là bạn cảm thấy thoải mái khi nói. Mình bỏ qua lỗi nhỏ này nhé.",
  rationaleEn:
    "Learner shows signs of anxiety/frustration — correction during high affective filter blocks acquisition. Prioritize comfort and confidence.",
  category: "learner_state",
};

/**
 * S4 — Topic Deral
 *
 * "Don't derail the conversation topic for a minor form correction."
 *
 * When the learner is engaged in meaningful content (e.g., sharing
 * a story, explaining an opinion), correcting form derails their
 * train of thought. The conversation topic is the lesson;
 * don't sacrifice it for a grammar point.
 */
const S4_TOPIC_DERAIL: SuppressionRule = {
  id: "S4_TOPIC_DERAIL",
  priority: 75,
  labelVi: "Không làm lạc chủ đề",
  labelEn: "Avoid topic derailment",
  rationaleVi:
    "Bạn đang chia sẻ một ý rất hay — Mercy không muốn làm gián đoạn bằng một lỗi ngữ pháp nhỏ. Mình tiếp tục câu chuyện nhé.",
  rationaleEn:
    "Learner is engaged in meaningful content sharing — correcting form would derail their train of thought. The conversation topic matters more than a grammar point.",
  category: "conversation_flow",
};

/**
 * S5 — Developmental Readiness
 *
 * "Don't correct errors above the learner's current developmental stage."
 *
 * Pienemann's Processability Theory: learners can only acquire
 * structures they're developmentally ready for. Correcting a B1
 * structure at A1 level is wasted — the learner can't process it yet.
 */
const S5_DEVELOPMENTAL_READINESS: SuppressionRule = {
  id: "S5_DEVELOPMENTAL_READINESS",
  priority: 65,
  labelVi: "Trên trình độ hiện tại",
  labelEn: "Above developmental readiness",
  rationaleVi:
    "Điểm này hơi cao so với trình độ hiện tại của bạn — chưa cần lo. Mình tập trung vào những điểm vừa sức trước nhé.",
  rationaleEn:
    "This error involves a structure above the learner's current developmental stage — correcting it now would be ineffective per Processability Theory.",
  category: "developmental",
};

/**
 * S6 — Self-Repair Window
 *
 * "Give the learner space to self-correct before jumping in."
 *
 * Self-repair is more durable than teacher-correction. When the
 * learner shows signs of monitoring their own output (pauses,
 * reformulations), wait — they might catch it themselves.
 */
const S6_SELF_REPAIR_WINDOW: SuppressionRule = {
  id: "S6_SELF_REPAIR_WINDOW",
  priority: 80,
  labelVi: "Để bạn tự sửa",
  labelEn: "Self-repair window",
  rationaleVi:
    "Mercy thấy bạn đang tự điều chỉnh cách nói — rất tốt! Mình để bạn tự phát hiện và sửa lỗi này nhé.",
  rationaleEn:
    "Learner shows self-monitoring behavior — self-repair is more durable than teacher-correction. Give them space to catch it themselves.",
  category: "learner_state",
};

/**
 * S7 — Cognitive Load
 *
 * "Respect the learner's cognitive load limits."
 *
 * After many corrections in one session, the learner's working memory
 * for new corrections is saturated. Additional corrections don't stick
 * and create frustration. Better to note them for later.
 */
const S7_COGNITIVE_LOAD: SuppressionRule = {
  id: "S7_COGNITIVE_LOAD",
  priority: 78,
  labelVi: "Tránh quá tải",
  labelEn: "Respect cognitive load",
  rationaleVi:
    "Hôm nay mình đã học được nhiều điểm rồi — thêm một lỗi nữa sẽ hơi nhiều. Mercy ghi nhận lại, mình xem sau nhé.",
  rationaleEn:
    "Multiple corrections already delivered — learner's working memory for new corrections is likely saturated. Additional corrections won't stick.",
  category: "learner_state",
};

/**
 * S8 — Meaning Preserved
 *
 * "Don't correct form when meaning is successfully communicated."
 *
 * The primary purpose of language is communication. When the learner
 * has successfully conveyed their meaning, correcting form for form's
 * sake can feel nitpicky and demotivating.
 */
const S8_MEANING_PRESERVED: SuppressionRule = {
  id: "S8_MEANING_PRESERVED",
  priority: 72,
  labelVi: "Nghĩa vẫn rõ ràng",
  labelEn: "Meaning is preserved",
  rationaleVi:
    "Mercy hiểu rõ ý bạn muốn nói — lỗi nhỏ này không ảnh hưởng đến nghĩa. Quan trọng là bạn đã truyền đạt được ý.",
  rationaleEn:
    "Learner successfully communicated meaning — correcting form for form's sake when meaning is clear can feel nitpicky and demotivating.",
  category: "error_nature",
};

/**
 * S9 — Creative Expression
 *
 * "Don't correct creative attempts at expression."
 *
 * When a learner stretches beyond their comfort zone — trying a new
 * phrase, experimenting with an idiom, attempting humor — correcting
 * them punishes risk-taking. Encourage the attempt; refine later.
 */
const S9_CREATIVE_EXPRESSION: SuppressionRule = {
  id: "S9_CREATIVE_EXPRESSION",
  priority: 73,
  labelVi: "Khuyến khích sáng tạo",
  labelEn: "Encourage creative expression",
  rationaleVi:
    "Mercy thấy bạn đang thử một cách diễn đạt mới — rất đáng khen! Mình chưa cần sửa ngay, cứ tiếp tục sáng tạo nhé.",
  rationaleEn:
    "Learner is stretching beyond comfort zone with creative/experimental language — correcting now punishes risk-taking. Encourage the attempt.",
  category: "developmental",
};

/**
 * S10 — Listening Mode
 *
 * "Don't correct when the learner is in open-ended sharing mode."
 *
 * During storytelling, opinion-sharing, or personal anecdotes,
 * the learner's focus is on content, not form. Corrections in
 * this mode feel like the teacher wasn't really listening.
 */
const S10_LISTENING_MODE: SuppressionRule = {
  id: "S10_LISTENING_MODE",
  priority: 88,
  labelVi: "Đang lắng nghe bạn",
  labelEn: "In listening mode",
  rationaleVi:
    "Mercy đang tập trung nghe câu chuyện của bạn — câu chuyện hay quá, mình không muốn ngắt bằng một lỗi nhỏ.",
  rationaleEn:
    "Learner is in open-ended sharing mode (storytelling, opinion, anecdote) — correction would signal the teacher wasn't really listening to the content.",
  category: "conversation_flow",
};

// ─── Rule Catalog ──────────────────────────────────────────────────────────

/**
 * The complete catalog of suppression rules, ordered by priority.
 *
 * Each rule represents one pedagogical reason a human teacher
 * would deliberately choose NOT to correct.
 */
export const SUPPRESSION_RULES_CATALOG: ReadonlyArray<SuppressionRule> = [
  S3_AFFECTIVE_FILTER,
  S10_LISTENING_MODE,
  S1_FLUENCY_FLOW,
  S6_SELF_REPAIR_WINDOW,
  S7_COGNITIVE_LOAD,
  S4_TOPIC_DERAIL,
  S9_CREATIVE_EXPRESSION,
  S8_MEANING_PRESERVED,
  S2_ISOLATED_SLIP,
  S5_DEVELOPMENTAL_READINESS,
];

/**
 * Map rule ID → rule for fast lookup.
 */
export const SUPPRESSION_RULES_BY_ID: ReadonlyMap<string, SuppressionRule> =
  new Map(SUPPRESSION_RULES_CATALOG.map((r) => [r.id, r]));

/**
 * Map category → list of rules for filtering.
 */
export const SUPPRESSION_RULES_BY_CATEGORY: ReadonlyMap<
  SuppressionCategory,
  SuppressionRule[]
> = new Map(
  (["fluency_first", "learner_state", "error_nature", "conversation_flow", "developmental"] as const).map(
    (cat) => [cat, SUPPRESSION_RULES_CATALOG.filter((r) => r.category === cat)],
  ),
);

// ─── Rule Evaluation Functions ─────────────────────────────────────────────

/**
 * S1 — Fluency Flow check.
 * Applies when: utterance is long (8+ words), error is minor/fluency,
 * and the learner seems confident.
 */
function checkFluencyFlow(ctx: SuppressionContext): SuppressionEvaluation {
  const wordCount = ctx.utteranceWordCount ?? ctx.learnerText.split(/\s+/).filter(Boolean).length;
  const isLongUtterance = wordCount >= 8;
  const isMinorError =
    ctx.errorSeverity === "minor" || ctx.errorSeverity === "fluency";
  const applies = isLongUtterance && isMinorError && !ctx.isCurrentLessonTarget;

  return {
    rule: S1_FLUENCY_FLOW,
    applies,
    reason: applies
      ? `Long flowing utterance (${wordCount} words) with minor/fluency error — preserving communication flow over accuracy.`
      : !isLongUtterance
        ? `Utterance too short (${wordCount} words) — no flow to preserve.`
        : !isMinorError
          ? `Error severity "${ctx.errorSeverity}" is not minor/fluency — correction may be warranted.`
          : "Error is on the current lesson target — must correct.",
  };
}

/**
 * S2 — Isolated Slip check.
 * Applies when: sameMistakeCount = 1, learner is B1+, error is minor/fluency/word_choice.
 */
function checkIsolatedSlip(ctx: SuppressionContext): SuppressionEvaluation {
  const isFirstOccurrence = ctx.sameMistakeCount <= 1;
  const isAdvancedEnough =
    ctx.cefrLevel !== null &&
    !["A1", "A2"].includes(ctx.cefrLevel.toUpperCase());
  const isSlipError =
    ctx.errorSeverity === "minor" ||
    ctx.errorSeverity === "fluency" ||
    ctx.errorSeverity === "word_choice";
  const applies = isFirstOccurrence && isAdvancedEnough && isSlipError;

  return {
    rule: S2_ISOLATED_SLIP,
    applies,
    reason: applies
      ? `First occurrence at ${ctx.cefrLevel} level with ${ctx.errorSeverity} error — likely a performance slip, not a knowledge gap.`
      : !isFirstOccurrence
        ? `Error repeated ${ctx.sameMistakeCount} times — not an isolated slip; needs attention.`
        : !isAdvancedEnough
          ? `Learner at ${ctx.cefrLevel ?? "unknown"} level — can't reliably distinguish slips from gaps.`
          : `Error severity "${ctx.errorSeverity}" — may indicate a knowledge gap, not a slip.`,
  };
}

/**
 * S3 — Affective Filter check.
 * Applies when: learner is shy AND showing frustration, or shy + error is minor/fluency.
 */
function checkAffectiveFilter(ctx: SuppressionContext): SuppressionEvaluation {
  const isVulnerable =
    ctx.learnerConfidence === "shy" || ctx.isShowingFrustration === true;
  const isLowStakesError =
    ctx.errorSeverity === "minor" ||
    ctx.errorSeverity === "fluency" ||
    ctx.errorSeverity === "word_choice";
  const applies = isVulnerable && isLowStakesError && !ctx.isCurrentLessonTarget;

  return {
    rule: S3_AFFECTIVE_FILTER,
    applies,
    reason: applies
      ? `Learner is ${ctx.learnerConfidence === "shy" ? "shy" : "showing frustration"} with ${ctx.errorSeverity} error — protecting emotional safety over accuracy.`
      : !isVulnerable
        ? "Learner appears comfortable — no affective filter concern."
        : !isLowStakesError
          ? `Error severity "${ctx.errorSeverity}" is too significant to suppress despite learner state.`
          : "Error is on the current lesson target — must correct despite learner state.",
  };
}

/**
 * S4 — Topic Derail check.
 * Applies when: learner is in flow mode, error is not lesson target,
 * error severity is minor/fluency/word_choice.
 */
function checkTopicDerail(ctx: SuppressionContext): SuppressionEvaluation {
  const isEngagedInContent = ctx.isInFlowMode === true || ctx.learnerText.split(/\s+/).filter(Boolean).length >= 10;
  const isNonEssentialError =
    ctx.errorSeverity === "minor" ||
    ctx.errorSeverity === "fluency" ||
    ctx.errorSeverity === "word_choice";
  const applies = isEngagedInContent && isNonEssentialError && !ctx.isCurrentLessonTarget;

  return {
    rule: S4_TOPIC_DERAIL,
    applies,
    reason: applies
      ? "Learner is engaged in meaningful content — form correction would derail the conversation topic."
      : !isEngagedInContent
        ? "Utterance is brief — no conversation flow to protect."
        : !isNonEssentialError
          ? `Error severity "${ctx.errorSeverity}" — form correction may be worth the interruption.`
          : "Error is on the current lesson target — must correct.",
  };
}

/**
 * S5 — Developmental Readiness check.
 * Applies when: learner is A1-A2 and error is grammar/word_choice
 * involving a structure typically taught at B1+.
 *
 * This is a heuristic: we check known B1+ patterns.
 */
function checkDevelopmentalReadiness(ctx: SuppressionContext): SuppressionEvaluation {
  const isBeginner =
    ctx.cefrLevel !== null &&
    ["A1", "A2"].includes(ctx.cefrLevel.toUpperCase());

  // Heuristic: check for advanced structures in the learner text
  const hasAdvancedStructure =
    /\b(would have|should have|could have|had been|having been|were to|if I were|provided that|inasmuch|notwithstanding|whereas|thereby|hence|furthermore|consequently|nevertheless)\b/i.test(
      ctx.learnerText,
    );

  const isGrammarOrWordChoice =
    ctx.errorSeverity === "grammar" || ctx.errorSeverity === "word_choice";

  const applies = isBeginner && hasAdvancedStructure && isGrammarOrWordChoice;

  return {
    rule: S5_DEVELOPMENTAL_READINESS,
    applies,
    reason: applies
      ? `Beginner (${ctx.cefrLevel}) attempting a B1+ structure — above developmental readiness. Don't correct what they can't process yet.`
      : !isBeginner
        ? `Learner at ${ctx.cefrLevel ?? "unknown"} — not a beginner; may be ready for this structure.`
        : !hasAdvancedStructure
          ? "No advanced structure detected in text — within developmental reach."
          : "Error is not grammar/word_choice — may still be worth noting.",
  };
}

/**
 * S6 — Self-Repair Window check.
 * Applies when: learner showed self-correction, error is grammar/word_choice.
 */
function checkSelfRepairWindow(ctx: SuppressionContext): SuppressionEvaluation {
  const applies =
    ctx.didSelfCorrect &&
    (ctx.errorSeverity === "grammar" ||
      ctx.errorSeverity === "word_choice" ||
      ctx.errorSeverity === "fluency");

  return {
    rule: S6_SELF_REPAIR_WINDOW,
    applies,
    reason: applies
      ? "Learner showed self-correction behavior — give them space to catch this error on their own."
      : ctx.didSelfCorrect
        ? `Error severity "${ctx.errorSeverity}" — worth noting even after self-correction.`
        : "No self-correction detected in this turn.",
  };
}

/**
 * S7 — Cognitive Load check.
 * Applies when: 5+ corrections already in session, error is minor/fluency/word_choice.
 */
function checkCognitiveLoad(ctx: SuppressionContext): SuppressionEvaluation {
  const isHighLoad = ctx.previousCorrectionsThisSession >= 5;
  const isLowPriorityError =
    ctx.errorSeverity === "minor" ||
    ctx.errorSeverity === "fluency" ||
    ctx.errorSeverity === "word_choice";
  const applies = isHighLoad && isLowPriorityError && !ctx.isCurrentLessonTarget;

  return {
    rule: S7_COGNITIVE_LOAD,
    applies,
    reason: applies
      ? `${ctx.previousCorrectionsThisSession} corrections already in session — learner's working memory likely saturated. Suppress to avoid overload.`
      : !isHighLoad
        ? `Only ${ctx.previousCorrectionsThisSession} corrections so far — cognitive load is manageable.`
        : !isLowPriorityError
          ? `Error severity "${ctx.errorSeverity}" is significant enough to override load concerns.`
          : "Error is on the current lesson target — must correct.",
  };
}

/**
 * S8 — Meaning Preserved check.
 * Applies when: error is minor/fluency and not lesson target.
 */
function checkMeaningPreserved(ctx: SuppressionContext): SuppressionEvaluation {
  const isMeaningIntact =
    ctx.errorSeverity === "minor" || ctx.errorSeverity === "fluency";
  const applies = isMeaningIntact && !ctx.isCurrentLessonTarget;

  return {
    rule: S8_MEANING_PRESERVED,
    applies,
    reason: applies
      ? `Error is ${ctx.errorSeverity} — meaning is preserved. Correcting would be nitpicking.`
      : !isMeaningIntact
        ? `Error severity "${ctx.errorSeverity}" — meaning may be compromised; correction warranted.`
        : "Error is on the current lesson target — must correct.",
  };
}

/**
 * S9 — Creative Expression check.
 * Applies when: text shows signs of experimentation (idiom attempts,
 * novel phrasing, humor markers like "haha", "lol") and error is minor/fluency/word_choice.
 */
function checkCreativeExpression(ctx: SuppressionContext): SuppressionEvaluation {
  const hasCreativeMarkers =
    /\b(try|trying|attempt|maybe|perhaps|I think|I believe|in my opinion|what if|how about|let me try|haha|lol|just kidding|I mean like|sort of|kind of|ish)\b/i.test(
      ctx.learnerText,
    );
  const isCreativeError =
    ctx.errorSeverity === "minor" ||
    ctx.errorSeverity === "fluency" ||
    ctx.errorSeverity === "word_choice";
  const applies = hasCreativeMarkers && isCreativeError && !ctx.isCurrentLessonTarget;

  return {
    rule: S9_CREATIVE_EXPRESSION,
    applies,
    reason: applies
      ? "Learner shows creative/experimental language markers — encourage risk-taking; don't punish with correction."
      : !hasCreativeMarkers
        ? "No creative/experimental markers detected — routine production."
        : !isCreativeError
          ? `Error severity "${ctx.errorSeverity}" is too significant to let slide even in creative mode.`
          : "Error is on the current lesson target — must correct.",
  };
}

/**
 * S10 — Listening Mode check.
 * Applies when: utterance is long (12+ words), learner is sharing a narrative/personal content,
 * error is minor/fluency, and not lesson target.
 */
function checkListeningMode(ctx: SuppressionContext): SuppressionEvaluation {
  const wordCount = ctx.utteranceWordCount ?? ctx.learnerText.split(/\s+/).filter(Boolean).length;
  const isNarrativeLength = wordCount >= 12 || ctx.isInFlowMode === true;

  // Narrative markers: past tense stories, personal pronouns + actions
  const hasNarrativeMarkers =
    /\b(yesterday|last (week|month|year|night|time)|when I was|I (went|saw|did|had|got|felt|thought|decided|remember)|one (day|time)|my (friend|mom|dad|family|boss)|so then|and then|after that|later|suddenly|finally)\b/i.test(
      ctx.learnerText,
    );

  const isMinorError =
    ctx.errorSeverity === "minor" || ctx.errorSeverity === "fluency";
  const applies =
    isNarrativeLength && hasNarrativeMarkers && isMinorError && !ctx.isCurrentLessonTarget;

  return {
    rule: S10_LISTENING_MODE,
    applies,
    reason: applies
      ? `Learner is sharing a narrative/personal story (${wordCount} words) — prioritize listening over correcting.`
      : !isNarrativeLength
        ? `Utterance too brief (${wordCount} words) for narrative mode.`
        : !hasNarrativeMarkers
          ? "No narrative markers detected — not in storytelling mode."
        : !isMinorError
          ? `Error severity "${ctx.errorSeverity}" — correction may be more important than listening mode.`
          : "Error is on the current lesson target — must correct.",
  };
}

// ─── Evaluation Logic ──────────────────────────────────────────────────────

/**
 * The ordered list of suppression rule check functions.
 * Evaluated in priority order — the first applicable rule is the primary reason.
 */
const SUPPRESSION_CHECKS: ReadonlyArray<
  (ctx: SuppressionContext) => SuppressionEvaluation
> = [
  checkAffectiveFilter,       // S3 — priority 90
  checkListeningMode,         // S10 — priority 88
  checkFluencyFlow,           // S1 — priority 85
  checkSelfRepairWindow,      // S6 — priority 80
  checkCognitiveLoad,         // S7 — priority 78
  checkTopicDerail,           // S4 — priority 75
  checkCreativeExpression,    // S9 — priority 73
  checkMeaningPreserved,      // S8 — priority 72
  checkIsolatedSlip,          // S2 — priority 70
  checkDevelopmentalReadiness,// S5 — priority 65
];

/**
 * Evaluate all suppression rules against a given context.
 *
 * Returns a SuppressionDecision with all applicable rules,
 * sorted by priority (highest first). The primary reason is the
 * single strongest rule that applies.
 *
 * Pure function — deterministic, no side effects, no I/O.
 */
export function evaluateSuppressions(
  ctx: SuppressionContext,
): SuppressionDecision {
  const evaluations: SuppressionEvaluation[] = [];

  for (const check of SUPPRESSION_CHECKS) {
    const evaluation = check(ctx);
    evaluations.push(evaluation);
  }

  const applicableRules = evaluations
    .filter((e) => e.applies)
    .sort((a, b) => b.rule.priority - a.rule.priority);

  const primaryReason = applicableRules.length > 0 ? applicableRules[0] : null;

  return {
    shouldSuppress: applicableRules.length > 0,
    applicableRules,
    primaryReason,
    rationaleVi: primaryReason?.rule.rationaleVi ?? "",
    rationaleEn: primaryReason?.rule.rationaleEn ?? "",
  };
}

/**
 * Get suppression reasoning for a specific rule by ID.
 * Useful when the timing engine already decided to SUPPRESS
 * and you want to enrich with pedagogical reasoning.
 */
export function getSuppressionRuleById(id: string): SuppressionRule | undefined {
  return SUPPRESSION_RULES_BY_ID.get(id);
}

/**
 * Build a SuppressionContext from the fields available in
 * a typical correction pipeline.
 *
 * Convenience helper — callers can also construct SuppressionContext directly.
 */
export function buildSuppressionContext(fields: {
  learnerText: string;
  errorSeverity: ErrorSeverity;
  cefrLevel: string | null;
  learnerConfidence: LearnerConfidence;
  didSelfCorrect: boolean;
  sameMistakeCount: number;
  previousCorrectionsThisSession: number;
  isCurrentLessonTarget: boolean;
  isInFlowMode?: boolean;
  isShowingFrustration?: boolean;
}): SuppressionContext {
  return {
    ...fields,
    utteranceWordCount: fields.learnerText.split(/\s+/).filter(Boolean).length,
  };
}

// ─── Category Catalog ──────────────────────────────────────────────────────

export const SUPPRESSION_CATEGORY_CATALOG: ReadonlyArray<{
  category: SuppressionCategory;
  labelVi: string;
  labelEn: string;
  descriptionVi: string;
}> = [
  {
    category: "fluency_first",
    labelVi: "Ưu tiên mạch nói",
    labelEn: "Fluency first",
    descriptionVi: "Người học đang nói trôi chảy — ưu tiên giữ mạch giao tiếp hơn là sửa lỗi nhỏ.",
  },
  {
    category: "learner_state",
    labelVi: "Trạng thái người học",
    labelEn: "Learner state",
    descriptionVi: "Tôn trọng trạng thái cảm xúc và nhận thức của người học — không sửa khi đang căng thẳng hoặc quá tải.",
  },
  {
    category: "error_nature",
    labelVi: "Bản chất lỗi",
    labelEn: "Error nature",
    descriptionVi: "Bản thân lỗi không đáng để sửa — lỗi sơ suất một lần, hoặc nghĩa vẫn rõ ràng.",
  },
  {
    category: "conversation_flow",
    labelVi: "Mạch trò chuyện",
    labelEn: "Conversation flow",
    descriptionVi: "Không làm gián đoạn hoặc lạc chủ đề cuộc trò chuyện vì một lỗi nhỏ.",
  },
  {
    category: "developmental",
    labelVi: "Phát triển ngôn ngữ",
    labelEn: "Developmental readiness",
    descriptionVi: "Lỗi vượt quá giai đoạn phát triển hiện tại của người học — chưa cần sửa vội.",
  },
];
