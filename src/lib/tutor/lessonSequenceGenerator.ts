/**
 * Teacher Mercy — Personalized Lesson Sequence Generator
 *
 * A human teacher doesn't just recommend one next lesson. She plans a COHERENT
 * multi-session path tailored to the learner: "First we'll fix your articles
 * (2 sessions), then we'll work on past tense (3 sessions), then we'll put it
 * all together in a restaurant conversation."
 *
 * This module generates that sequence — an ordered, reasoned curriculum path
 * built from the learner's profile, weaknesses, goals, CEFR level, and cadence.
 *
 * Vietnamese-first: all user-facing labels, reasons, and notes are in
 * Vietnamese because Teacher Mercy communicates with VN learners in VN.
 *
 * Pure functions — no I/O, no side effects, deterministic.
 */

import type { LearnerHistoryProfile } from "./learnerHistoryProfile";
import type {
  CefrLevel,
  ChallengeLevel,
  LearnerGoal,
  RecommendationStrategy,
} from "./lessonRecommendationIntelligence";
import type { TodayLessonMode } from "./todayLessonPlanner";

// ─── Sequence Types ──────────────────────────────────────────────────────────

/**
 * One phase in a personalized lesson sequence.
 *
 * A phase represents a focused block of sessions targeting a specific skill
 * or topic. Phases are ordered — each one builds on what came before.
 */
export type LessonSequencePhase = {
  /** 1-based position in the sequence. */
  position: number;

  /** The skill or topic tag this phase targets (kebab-case). */
  skillTag: string;

  /** Vietnamese lesson title — what the learner sees as the phase label. */
  titleVi: string;

  /** Estimated number of sessions needed for this phase (1–5). */
  sessionCount: number;

  /**
   * Why this phase is in this position — teacher-quality rationale in
   * Vietnamese. Explains the pedagogical reasoning, not just the data.
   */
  reasonVi: string;

  /** Which Mercy mode this phase uses (grammar, speak, journey, logic). */
  suggestedMode: TodayLessonMode;

  /**
   * Skill tag this phase builds on, or null if this is a foundational phase.
   * Used to communicate dependencies to the learner.
   */
  prerequisiteSkillTag: string | null;

  /** How challenging this phase should feel to the learner. */
  challengeLevel: ChallengeLevel;

  /** Which teaching strategy this phase employs. */
  strategy: RecommendationStrategy;

  /**
   * Specific Vietnamese interference pattern this phase addresses, if any.
   * Example: "missing-article", "tense-omission".
   */
  addressesInterference: string | null;

  /**
   * Whether this phase directly serves at least one of the learner's
   * stated goals.
   */
  alignedWithGoals: boolean;
};

/**
 * A complete personalized lesson sequence — Teacher Mercy's curriculum
 * plan for one learner.
 */
export type PersonalizedLessonSequence = {
  /** Ordered list of lesson phases — each is a skill block to master. */
  phases: LessonSequencePhase[];

  /** Total sessions across all phases. */
  totalSessions: number;

  /**
   * Estimated weeks to complete the sequence, based on the learner's
   * practice cadence. null if cadence is unknown.
   */
  estimatedWeeks: number | null;

  /**
   * One-paragraph Vietnamese summary of the entire sequence — like a
   * human teacher explaining the plan to the learner.
   */
  summaryVi: string;

  /**
   * A short, warm note to the learner, personalized to their situation.
   * Examples: "Bạn mới bắt đầu nên mình đi từng bước nhỏ." or
   * "Bạn đang có đà tốt — mình tận dụng nó."
   */
  learnerNoteVi: string;

  /**
   * Context about what the sequence was adapted for — useful for
   * debugging and for showing the learner why this path was chosen.
   */
  adaptedFor: {
    cefrLevel: CefrLevel | null;
    goals: LearnerGoal[];
    cadenceDays: number | null;
    interferenceCount: number;
    lowMasteryTopicCount: number;
  };

  /**
   * The sequence "fingerprint" used in rule selection — which priority
   * tier drove the ordering (useful for testing dispatch).
   */
  dispatchLabel: string;
};

// ─── Input Types ─────────────────────────────────────────────────────────────

export type SequenceGeneratorInput = {
  /** Learner's history profile. */
  profile: LearnerHistoryProfile;

  /** Known CEFR level, or null. */
  cefrLevel: CefrLevel | null;

  /** Stated or inferred learner goals. */
  goals: LearnerGoal[];

  /** Recently practiced topics (most recent first). */
  recentPractice: Array<{
    topic: string;
    practicedAt: number;
    mode: TodayLessonMode;
  }>;

  /** Average days between sessions, or null if unknown. */
  avgDaysBetweenSessions: number | null;

  /** Override timestamp (injectable for testing). */
  now?: number;

  /** Maximum number of phases in the sequence (default 6). */
  maxPhases?: number;
};

// ─── Phase Templates ─────────────────────────────────────────────────────────
// Each interference tag has a pre-written lesson phase template.
// These are the "lesson prescriptions" Mercy fills in for each learner.

type PhaseTemplate = {
  skillTag: string;
  titleVi: string;
  reasonViTemplate: (count: number, cefr: CefrLevel | null) => string;
  suggestedMode: TodayLessonMode;
  typicalSessions: (count: number, cefr: CefrLevel | null) => number;
  prerequisiteSkillTag: string | null;
  challengeLevelForCefr: (cefr: CefrLevel | null) => ChallengeLevel;
};

// ─── Interference Pattern → Phase Templates ──────────────────────────────────

const INTERFERENCE_PHASE_TEMPLATES: Record<string, PhaseTemplate> = {
  "missing-article": {
    skillTag: "missing-article",
    titleVi: "Làm chủ mạo từ a, an, the",
    reasonViTemplate: (count: number) =>
      `Mình thấy ${count} lần bạn bỏ sót mạo từ (a, an, the). Tiếng Việt không dùng mạo từ, nhưng tiếng Anh luôn cần. Đây là lỗi hệ thống — giải quyết nó trước sẽ giúp mọi câu của bạn tự nhiên hơn ngay.`,
    suggestedMode: "grammar",
    typicalSessions: (count: number) => Math.min(4, Math.max(1, Math.ceil(count / 2))),
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "A1" ? "easy" : cefr === "A2" ? "comfortable" : "moderate"),
  },
  "tense-omission": {
    skillTag: "tense-omission",
    titleVi: "Đánh dấu thời gian trong động từ",
    reasonViTemplate: (count: number) =>
      `Mình thấy ${count} câu thiếu dấu hiệu thì trên động từ. Tiếng Việt dùng từ chỉ thời gian riêng (hôm qua, đã, sẽ), nhưng tiếng Anh bắt buộc động từ phải thay đổi. Sửa điểm này là chìa khóa để bạn nói tiếng Anh đúng thì.`,
    suggestedMode: "grammar",
    typicalSessions: (count: number) => Math.min(4, Math.max(2, Math.ceil(count / 1.5))),
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "A1" ? "comfortable" : "moderate"),
  },
  "preposition-calque": {
    skillTag: "preposition-calque",
    titleVi: "Giới từ đúng: in, on, at cho thời gian và nơi chốn",
    reasonViTemplate: (count: number) =>
      `Mình thấy ${count} lỗi giới từ do dịch thẳng từ tiếng Việt (ví dụ "at the morning" thay vì "in the morning"). Đây là lỗi rất phổ biến và dễ thấy trong giao tiếp — sửa xong là bạn tự tin hơn hẳn.`,
    suggestedMode: "grammar",
    typicalSessions: (count: number) => Math.min(3, Math.max(1, Math.ceil(count / 2))),
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "A1" ? "comfortable" : "moderate"),
  },
  "subj-verb-agreement": {
    skillTag: "subj-verb-agreement",
    titleVi: "Chủ ngữ và động từ phải khớp nhau",
    reasonViTemplate: (count: number) =>
      `Mình thấy ${count} lần động từ không khớp với chủ ngữ (ví dụ "she go" thay vì "she goes"). Tiếng Việt không chia động từ theo ngôi, nên đây là phản xạ cần luyện.`,
    suggestedMode: "grammar",
    typicalSessions: (count: number) => Math.min(3, Math.max(1, Math.ceil(count / 2))),
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "A2" ? "moderate" : "comfortable"),
  },
  "word-order": {
    skillTag: "word-order",
    titleVi: "Trật tự từ: tính từ đứng trước danh từ",
    reasonViTemplate: (count: number) =>
      `Mình thấy ${count} lỗi trật tự từ — thường là tính từ đặt sau danh từ theo kiểu tiếng Việt. Tiếng Anh đặt tính từ trước danh từ, và đây là thói quen cần luyện.`,
    suggestedMode: "grammar",
    typicalSessions: (count: number) => Math.min(2, Math.max(1, Math.ceil(count / 2))),
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "B1" ? "moderate" : "comfortable"),
  },
  "zero-copula": {
    skillTag: "zero-copula",
    titleVi: "Không bao giờ bỏ 'to be': is, are, was, were",
    reasonViTemplate: (count: number) =>
      `Mình thấy ${count} câu thiếu động từ "to be" (ví dụ "She tired" thay vì "She is tired"). Trong tiếng Việt có thể bỏ "là", nhưng tiếng Anh bắt buộc phải có.`,
    suggestedMode: "grammar",
    typicalSessions: (count: number) => Math.min(2, Math.max(1, Math.ceil(count / 2))),
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "A2" ? "comfortable" : "moderate"),
  },
  "double-negation": {
    skillTag: "double-negation",
    titleVi: "Một phủ định một lần: cách phủ định trong tiếng Anh",
    reasonViTemplate: (count: number) =>
      `Mình thấy ${count} lần bạn dùng phủ định kép (ví dụ "I don't know nothing"). Tiếng Việt dùng phủ định kép bình thường, nhưng tiếng Anh chỉ dùng một yếu tố phủ định mỗi mệnh đề.`,
    suggestedMode: "grammar",
    typicalSessions: (count: number) => Math.min(2, Math.max(1, Math.ceil(count / 2))),
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "B1" ? "moderate" : "comfortable"),
  },
};

// ─── Low Mastery → Phase Templates ───────────────────────────────────────────

const LOW_MASTERY_PHASE_TEMPLATES: Record<string, PhaseTemplate> = {
  "past-tense": {
    skillTag: "past-tense",
    titleVi: "Ôn tập thì quá khứ",
    reasonViTemplate: () =>
      "Điểm mastery của bạn ở thì quá khứ đang thấp — ôn lại phần này sẽ giúp bạn kể chuyện quá khứ trôi chảy hơn.",
    suggestedMode: "grammar",
    typicalSessions: () => 2,
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "A1" ? "comfortable" : "moderate"),
  },
  "present-perfect": {
    skillTag: "present-perfect",
    titleVi: "Ôn tập thì hiện tại hoàn thành",
    reasonViTemplate: () =>
      "Thì hiện tại hoàn thành là điểm nhiều người học tiếng Anh gặp khó — mình muốn bạn ôn lại để chắc phần này.",
    suggestedMode: "grammar",
    typicalSessions: () => 2,
    prerequisiteSkillTag: "past-tense",
    challengeLevelForCefr: (cefr) => (cefr === "A2" ? "moderate" : cefr === "B1" ? "stretch" : "moderate"),
  },
  articles: {
    skillTag: "articles",
    titleVi: "Ôn tập mạo từ trong ngữ cảnh thực tế",
    reasonViTemplate: () =>
      "Điểm mastery về mạo từ của bạn cần được củng cố — lần này mình luyện trong câu thực tế thay vì bài tập khô.",
    suggestedMode: "grammar",
    typicalSessions: () => 2,
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "A1" ? "easy" : "comfortable"),
  },
  prepositions: {
    skillTag: "prepositions",
    titleVi: "Ôn tập giới từ trong giao tiếp",
    reasonViTemplate: () =>
      "Giới từ là phần bạn cần thêm thời gian để thấm — mình ôn lại trong các tình huống giao tiếp thực tế.",
    suggestedMode: "grammar",
    typicalSessions: () => 2,
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "A1" ? "comfortable" : "moderate"),
  },
};

// ─── Goal-Aligned → Phase Templates ──────────────────────────────────────────
// When no interference or low-mastery issues fire, we build goal-aligned phases.

const GOAL_PHASE_TEMPLATES: Partial<Record<LearnerGoal, PhaseTemplate[]>> = {
  daily_conversation: [
    {
      skillTag: "daily-conversation-introductions",
      titleVi: "Tự giới thiệu bản thân — trôi chảy và tự nhiên",
      reasonViTemplate: () =>
        "Đây là kỹ năng giao tiếp cơ bản nhất và cũng là thứ bạn dùng nhiều nhất. Mình muốn bạn giới thiệu bản thân một cách tự nhiên, không cần suy nghĩ.",
      suggestedMode: "speak",
      typicalSessions: () => 2,
      prerequisiteSkillTag: null,
      challengeLevelForCefr: (cefr) => (cefr === "A1" ? "easy" : "comfortable"),
    },
    {
      skillTag: "daily-conversation-ordering",
      titleVi: "Gọi món và mua sắm bằng tiếng Anh",
      reasonViTemplate: () =>
        "Tình huống gọi món và mua sắm là thứ bạn gặp hằng ngày. Luyện phần này giúp bạn tự tin trong mọi tình huống đời thường.",
      suggestedMode: "journey",
      typicalSessions: () => 2,
      prerequisiteSkillTag: null,
      challengeLevelForCefr: (cefr) => (cefr === "A1" ? "comfortable" : "moderate"),
    },
    {
      skillTag: "daily-conversation-small-talk",
      titleVi: "Nói chuyện phiếm — small talk tự nhiên",
      reasonViTemplate: () =>
        "Small talk là 'chất bôi trơn' trong giao tiếp tiếng Anh. Biết cách nói chuyện phiếm giúp bạn kết nối với người khác dễ dàng hơn.",
      suggestedMode: "speak",
      typicalSessions: () => 2,
      prerequisiteSkillTag: "daily-conversation-introductions",
      challengeLevelForCefr: (cefr) => (cefr === "A2" ? "moderate" : "comfortable"),
    },
  ],
  workplace_english: [
    {
      skillTag: "workplace-email",
      titleVi: "Viết email công việc chuyên nghiệp",
      reasonViTemplate: () =>
        "Email là công cụ giao tiếp chính trong môi trường công sở. Mình giúp bạn viết email lịch sự, rõ ràng, đúng văn phong.",
      suggestedMode: "grammar",
      typicalSessions: () => 2,
      prerequisiteSkillTag: null,
      challengeLevelForCefr: (cefr) => (cefr === "A2" ? "moderate" : cefr === "B1" ? "stretch" : "moderate"),
    },
    {
      skillTag: "workplace-meeting",
      titleVi: "Phát biểu trong cuộc họp tiếng Anh",
      reasonViTemplate: () =>
        "Phát biểu trong cuộc họp là kỹ năng giúp bạn thể hiện năng lực. Mình luyện cho bạn các mẫu câu chuẩn để tự tin lên tiếng.",
      suggestedMode: "speak",
      typicalSessions: () => 2,
      prerequisiteSkillTag: "workplace-email",
      challengeLevelForCefr: (cefr) => (cefr === "B1" ? "stretch" : "moderate"),
    },
  ],
  ielts_preparation: [
    {
      skillTag: "ielts-writing-task1",
      titleVi: "IELTS Writing Task 1 — mô tả biểu đồ và số liệu",
      reasonViTemplate: () =>
        "Task 1 yêu cầu mô tả dữ liệu — một kỹ năng có công thức rõ ràng. Mình giúp bạn nắm vững cấu trúc và từ vựng cho phần này.",
      suggestedMode: "grammar",
      typicalSessions: () => 3,
      prerequisiteSkillTag: null,
      challengeLevelForCefr: (cefr) => (cefr === "B1" ? "stretch" : "moderate"),
    },
    {
      skillTag: "ielts-speaking-part2",
      titleVi: "IELTS Speaking Part 2 — nói 2 phút không ngắt quãng",
      reasonViTemplate: () =>
        "Part 2 là phần nhiều thí sinh lo nhất vì phải nói liên tục 2 phút. Mình luyện cho bạn kỹ thuật 'mở-ý-chính-kết' để không bí ý.",
      suggestedMode: "speak",
      typicalSessions: () => 3,
      prerequisiteSkillTag: "ielts-writing-task1",
      challengeLevelForCefr: (cefr) => (cefr === "B1" ? "stretch" : "hard"),
    },
  ],
  travel_english: [
    {
      skillTag: "travel-airport",
      titleVi: "Tiếng Anh ở sân bay — từ check-in đến lên máy bay",
      reasonViTemplate: () =>
        "Sân bay là nơi bạn chắc chắn cần tiếng Anh. Mình luyện cho bạn từ lúc check-in, qua hải quan, đến khi lên máy bay.",
      suggestedMode: "journey",
      typicalSessions: () => 2,
      prerequisiteSkillTag: null,
      challengeLevelForCefr: (cefr) => (cefr === "A2" ? "comfortable" : "moderate"),
    },
    {
      skillTag: "travel-restaurant-hotel",
      titleVi: "Đặt phòng khách sạn và gọi món khi đi du lịch",
      reasonViTemplate: () =>
        "Sau sân bay, khách sạn và nhà hàng là nơi bạn dùng tiếng Anh nhiều nhất. Mình luyện các mẫu câu thực tế cho cả hai tình huống.",
      suggestedMode: "speak",
      typicalSessions: () => 2,
      prerequisiteSkillTag: "travel-airport",
      challengeLevelForCefr: (cefr) => (cefr === "A2" ? "comfortable" : "moderate"),
    },
  ],
  job_interview: [
    {
      skillTag: "job-interview-intro",
      titleVi: "Giới thiệu bản thân trong phỏng vấn — Tell me about yourself",
      reasonViTemplate: () =>
        '"Tell me about yourself" là câu hỏi đầu tiên trong mọi buổi phỏng vấn. Mình giúp bạn chuẩn bị câu trả lời ấn tượng, có cấu trúc rõ ràng.',
      suggestedMode: "speak",
      typicalSessions: () => 2,
      prerequisiteSkillTag: null,
      challengeLevelForCefr: (cefr) => (cefr === "B1" ? "stretch" : "moderate"),
    },
    {
      skillTag: "job-interview-questions",
      titleVi: "Trả lời câu hỏi phỏng vấn phổ biến bằng tiếng Anh",
      reasonViTemplate: () =>
        "Mình luyện cho bạn 10 câu hỏi phỏng vấn phổ biến nhất — từ 'strengths and weaknesses' đến 'where do you see yourself in 5 years'.",
      suggestedMode: "speak",
      typicalSessions: () => 3,
      prerequisiteSkillTag: "job-interview-intro",
      challengeLevelForCefr: (cefr) => (cefr === "B1" ? "stretch" : "hard"),
    },
  ],
  general_improvement: [
    {
      skillTag: "general-grammar-foundation",
      titleVi: "Củng cố ngữ pháp nền tảng",
      reasonViTemplate: () =>
        "Mình bắt đầu với ngữ pháp cơ bản nhất — đây là nền móng cho mọi kỹ năng khác.",
      suggestedMode: "grammar",
      typicalSessions: () => 3,
      prerequisiteSkillTag: null,
      challengeLevelForCefr: (cefr) => (cefr === "A1" ? "easy" : "comfortable"),
    },
    {
      skillTag: "general-speaking-practice",
      titleVi: "Luyện nói — từ câu đơn đến hội thoại",
      reasonViTemplate: () =>
        "Sau khi có nền ngữ pháp, mình chuyển sang luyện nói — từ câu đơn giản đến hội thoại ngắn.",
      suggestedMode: "speak",
      typicalSessions: () => 2,
      prerequisiteSkillTag: "general-grammar-foundation",
      challengeLevelForCefr: (cefr) => (cefr === "A1" ? "comfortable" : "moderate"),
    },
    {
      skillTag: "general-real-world",
      titleVi: "Áp dụng vào tình huống thực tế",
      reasonViTemplate: () =>
        "Bây giờ mình ráp mọi thứ lại — bạn sẽ dùng tiếng Anh trong một tình huống thực tế như đi chợ, gọi món, hay hỏi đường.",
      suggestedMode: "journey",
      typicalSessions: () => 2,
      prerequisiteSkillTag: "general-speaking-practice",
      challengeLevelForCefr: (cefr) => (cefr === "A2" ? "moderate" : "comfortable"),
    },
  ],
};

// ─── Fallback Phase Templates ────────────────────────────────────────────────
// When no specific needs are detected, we generate a balanced default sequence.

const FALLBACK_PHASES: PhaseTemplate[] = [
  {
    skillTag: "starter-sentence",
    titleVi: "Bắt đầu với một câu đơn giản mỗi ngày",
    reasonViTemplate: () =>
      "Mình chưa có đủ dữ liệu về điểm mạnh và điểm yếu của bạn, nên mình bắt đầu nhẹ nhàng — mỗi ngày một câu.",
    suggestedMode: "grammar",
    typicalSessions: () => 3,
    prerequisiteSkillTag: null,
    challengeLevelForCefr: (cefr) => (cefr === "A1" ? "easy" : "comfortable"),
  },
  {
    skillTag: "daily-life-vocabulary",
    titleVi: "Xây dựng từ vựng đời sống hằng ngày",
    reasonViTemplate: () =>
      "Sau khi quen với việc viết câu mỗi ngày, mình mở rộng vốn từ vựng trong các chủ đề bạn thực sự dùng.",
    suggestedMode: "journey",
    typicalSessions: () => 2,
    prerequisiteSkillTag: "starter-sentence",
    challengeLevelForCefr: (cefr) => (cefr === "A1" ? "comfortable" : "moderate"),
  },
  {
    skillTag: "speaking-basics",
    titleVi: "Luyện nói — từ đọc to đến hội thoại ngắn",
    reasonViTemplate: () =>
      "Có từ vựng rồi thì phải nói được. Mình luyện cho bạn từ đọc to câu đúng đến hội thoại ngắn.",
    suggestedMode: "speak",
    typicalSessions: () => 2,
    prerequisiteSkillTag: "daily-life-vocabulary",
    challengeLevelForCefr: (cefr) => (cefr === "A1" ? "comfortable" : "moderate"),
  },
];

// ─── Sequencing Helpers ──────────────────────────────────────────────────────

type PhaseSeed = {
  template: PhaseTemplate;
  priority: number; // Lower = more urgent, appears earlier in sequence
  obsCount: number; // Observation count for interference patterns, 0 otherwise
  lowMasteryScore: number; // Mastery score if this is a review, 0 otherwise
};

/**
 * Collect phase seeds from all sources: interference patterns, low mastery
 * topics, and goal-aligned topics.
 */
function collectPhaseSeeds(input: SequenceGeneratorInput): PhaseSeed[] {
  const { profile, goals, cefrLevel } = input;
  const seeds: PhaseSeed[] = [];

  // ── Source 1: Interference patterns (highest priority) ──
  for (const pattern of profile.interferencePatterns) {
    const template = INTERFERENCE_PHASE_TEMPLATES[pattern.tag];
    if (!template) continue;
    if (pattern.observedCount < 2) continue; // Need ≥2 observations to confirm pattern

    const priority = pattern.observedCount >= 5 ? 5
      : pattern.observedCount >= 3 ? 10
      : 20; // 2 observations → lower urgency

    seeds.push({
      template,
      priority,
      obsCount: pattern.observedCount,
      lowMasteryScore: 0,
    });
  }

  // ── Source 2: Low mastery topics (medium priority) ──
  for (const [topic, score] of Object.entries(profile.topicMastery)) {
    if (score >= 50) continue; // Only topics below 50% mastery

    // Try exact match first, then prefix match
    let template = LOW_MASTERY_PHASE_TEMPLATES[topic];
    if (!template) {
      // Check if any key is a substring match
      for (const [key, tmpl] of Object.entries(LOW_MASTERY_PHASE_TEMPLATES)) {
        if (topic.includes(key) || key.includes(topic)) {
          template = tmpl;
          break;
        }
      }
    }
    if (!template) continue;

    // Lower score → higher priority
    const priority = score < 30 ? 25 : score < 40 ? 30 : 35;

    seeds.push({
      template,
      priority,
      obsCount: 0,
      lowMasteryScore: score,
    });
  }

  // ── Source 3: Goal-aligned phases (lower priority — fill gaps) ──
  // Add goal-aligned phases when there's room for at least one more phase
  // beyond the interference + mastery seeds already collected.
  // Default maxPhases is 6 — we want at least 2 goal phases when possible.
  if (seeds.length < 4 && goals.length > 0) {
    for (const goal of goals) {
      const templates = GOAL_PHASE_TEMPLATES[goal];
      if (!templates) continue;

      for (const template of templates) {
        // Only add if we don't already have a seed for this skill
        if (seeds.some((s) => s.template.skillTag === template.skillTag)) continue;

        seeds.push({
          template,
          priority: 40 + (templates.indexOf(template) * 5), // Preserve template order within goal
          obsCount: 0,
          lowMasteryScore: 0,
        });
      }
    }
  }

  // ── Source 4: Mode preference as a seed (only if profile has enough data) ──
  if (profile.preferredMode && profile.sessionCount >= 5 && seeds.length < 3) {
    const modeToSkill: Record<TodayLessonMode, string> = {
      grammar: "grammar-practice",
      speak: "speaking-practice",
      journey: "real-world-scenario",
      logic: "logic-reasoning",
    };
    const skillTag = modeToSkill[profile.preferredMode];
    const titleMap: Record<TodayLessonMode, string> = {
      grammar: "Luyện ngữ pháp — chế độ bạn học tốt nhất",
      speak: "Luyện nói — chế độ bạn học tốt nhất",
      journey: "Tình huống thực tế — chế độ bạn học tốt nhất",
      logic: "Tư duy logic — chế độ bạn học tốt nhất",
    };

    seeds.push({
      template: {
        skillTag,
        titleVi: titleMap[profile.preferredMode],
        reasonViTemplate: () =>
          `Mình thấy bạn học tốt nhất ở chế độ này — tiếp tục luyện theo cách bạn thấy hiệu quả nhất.`,
        suggestedMode: profile.preferredMode!,
        typicalSessions: () => 2,
        prerequisiteSkillTag: null,
        challengeLevelForCefr: (cefr) =>
          cefr === "A1" ? "easy" : cefr === "C1" || cefr === "C2" ? "stretch" : "moderate",
      },
      priority: 50,
      obsCount: 0,
      lowMasteryScore: 0,
    });
  }

  // Sort by priority (lower = more urgent).
  // Tiebreaker: higher obsCount first (for interference), then lower mastery score
  // (more urgent), then alphabetically for determinism.
  seeds.sort((a, b) => {
    if (a.priority !== b.priority) return a.priority - b.priority;
    if (a.obsCount !== b.obsCount) return b.obsCount - a.obsCount;
    if (a.lowMasteryScore !== b.lowMasteryScore) return a.lowMasteryScore - b.lowMasteryScore;
    return a.template.skillTag.localeCompare(b.template.skillTag);
  });

  return seeds;
}

// ─── Session Count Calibration ───────────────────────────────────────────────

function calibrateSessions(
  template: PhaseTemplate,
  obsCount: number,
  cefrLevel: CefrLevel | null,
  cadenceDays: number | null,
): number {
  let sessions = template.typicalSessions(obsCount, cefrLevel);

  // Cadence adjustment: infrequent learners need fewer sessions per phase
  // because they forget more between sessions — compress the plan.
  if (cadenceDays !== null && cadenceDays > 5) {
    sessions = Math.max(1, sessions - 1);
  }

  // Advanced learners can absorb more per session — compress.
  if (cefrLevel === "C1" || cefrLevel === "C2") {
    sessions = Math.max(1, Math.ceil(sessions * 0.7));
  }

  return Math.max(1, Math.min(5, sessions));
}

// ─── Challenge Calibration ───────────────────────────────────────────────────

function calibrateChallenge(
  template: PhaseTemplate,
  cefrLevel: CefrLevel | null,
  positionInSequence: number,
): ChallengeLevel {
  // Base challenge from template
  const base = template.challengeLevelForCefr(cefrLevel);

  // First phase for beginners: ease in to build confidence
  if (positionInSequence === 1 && (cefrLevel === "A1" || cefrLevel === "A2")) {
    return base === "moderate" ? "comfortable" : base === "stretch" ? "moderate" : base;
  }

  return base;
}

// ─── Strategy Assignment ─────────────────────────────────────────────────────

function assignStrategy(
  template: PhaseTemplate,
  positionInSequence: number,
  cefrLevel: CefrLevel | null,
  cadenceDays: number | null,
): RecommendationStrategy {
  // First phase for beginners → build_confidence
  if (positionInSequence === 1 && (cefrLevel === "A1" || cefrLevel === "A2")) {
    return "build_confidence";
  }

  // First phase after long gap → review_and_consolidate
  if (positionInSequence === 1 && cadenceDays !== null && cadenceDays > 5) {
    return "review_and_consolidate";
  }

  // Interference-targeting phases → target_weakness
  if (template.skillTag in INTERFERENCE_PHASE_TEMPLATES) {
    return "target_weakness";
  }

  // Low mastery phases → cement_foundation
  if (template.skillTag in LOW_MASTERY_PHASE_TEMPLATES) {
    return "cement_foundation";
  }

  // Speaking mode → real_world_practice if not A1
  if (template.suggestedMode === "speak" && cefrLevel !== "A1") {
    return "real_world_practice";
  }

  // Later phases for intermediates → stretch_zone
  if (positionInSequence >= 3 && (cefrLevel === "B1" || cefrLevel === "B2")) {
    return "stretch_zone";
  }

  // Default
  return "maintain_momentum";
}

// ─── Goal Alignment Check ────────────────────────────────────────────────────

// Local copy of the goal-skill map (GOAL_SKILL_MAP from lessonRecommendationIntelligence
// is not exported, so we maintain a parallel map here for sequence generation).
const GOAL_SKILL_MAP_LOCAL: Record<string, string[]> = {
  ielts_preparation: [
    "missing-article", "tense-omission", "subj-verb-agreement",
    "preposition-calque", "word-order", "zero-copula", "double-negation",
    "grammar", "writing", "speaking", "ielts",
  ],
  daily_conversation: [
    "speak", "introductions", "food-ordering", "shopping",
    "daily-life", "family", "social", "daily-conversation", "small-talk",
  ],
  workplace_english: [
    "work-job", "phone-call", "email", "meeting",
    "customer-service", "presentation", "workplace",
  ],
  travel_english: [
    "travel", "hotel", "airport", "transportation",
    "directions", "restaurant", "shopping", "travel-",
  ],
  customer_service: [
    "customer-service", "phone-call", "politeness-register",
    "service", "complaints",
  ],
  job_interview: [
    "job-interview", "introductions", "work-job",
    "past-tense", "subj-verb-agreement",
  ],
  study_abroad: [
    "ielts", "writing", "speaking", "academic",
    "missing-article", "tense-omission",
  ],
  parent_teacher_communication: [
    "school", "childcare", "introductions", "phone-call",
    "daily-life",
  ],
  healthcare_visits: [
    "health", "doctor", "pharmacy", "symptoms", "appointment",
  ],
  general_improvement: [
    "speak", "grammar", "journey", "logic", "general",
  ],
};

function checkGoalAlignmentLocal(skillTag: string, goals: LearnerGoal[]): boolean {
  if (goals.length === 0) return false;

  const lowerSkill = skillTag.toLowerCase();
  for (const goal of goals) {
    const relevantSkills = GOAL_SKILL_MAP_LOCAL[goal] ?? [];
    if (relevantSkills.some((s) => lowerSkill.includes(s.toLowerCase()))) {
      return true;
    }
  }
  return false;
}

// ─── Recency Filter ──────────────────────────────────────────────────────────

/**
 * Check if a skill was recently practiced (within 3 days).
 * If so, and it's not a persistent weakness, delay it in the sequence.
 */
function wasRecentlyPracticed(
  skillTag: string,
  recentPractice: SequenceGeneratorInput["recentPractice"],
  now: number,
): boolean {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const lowerSkill = skillTag.toLowerCase();

  for (const entry of recentPractice.slice(0, 3)) {
    const age = (now - entry.practicedAt) / DAY_MS;
    if (age > 3) continue;

    const lowerTopic = entry.topic.toLowerCase();
    if (lowerTopic.includes(lowerSkill) || lowerSkill.includes(lowerTopic)) {
      return true;
    }
  }
  return false;
}

// ─── Summary Building ────────────────────────────────────────────────────────

function buildSequenceSummary(
  phases: LessonSequencePhase[],
  totalSessions: number,
  estimatedWeeks: number | null,
  cefrLevel: CefrLevel | null,
  cadenceDays: number | null,
): string {
  const phaseList = phases
    .map((p) => `  ${p.position}. ${p.titleVi} (${p.sessionCount} buổi)`)
    .join("\n");

  const cefrNote = cefrLevel ? `ở trình độ ${cefrLevel}` : "";
  const cadenceNote = estimatedWeeks !== null
    ? `Nếu bạn giữ nhịp học đều, mình ước tính bạn sẽ hoàn thành lộ trình này trong khoảng ${estimatedWeeks} tuần.`
    : "Mình chưa biết nhịp học của bạn nên chưa ước tính được thời gian — nhưng đừng lo, mình sẽ điều chỉnh khi có thêm dữ liệu.";

  return (
    `Đây là lộ trình học cá nhân của bạn ${cefrNote}:\n${phaseList}\n\n` +
    `Tổng cộng: ${totalSessions} buổi học.\n${cadenceNote}\n\n` +
    "Mỗi buổi học là một viên gạch — mình xây cùng nhau từng bước một. " +
    "Không cần vội, quan trọng là đều đặn và chắc từng bước."
  );
}

function buildLearnerNote(
  phases: LessonSequencePhase[],
  cefrLevel: CefrLevel | null,
  cadenceDays: number | null,
  sessionCount: number,
): string {
  // New learner → encouraging note
  if (sessionCount <= 3 && (cefrLevel === "A1" || cefrLevel === "A2" || cefrLevel === null)) {
    return "Bạn mới bắt đầu nên mình đi từng bước nhỏ, dễ thành công. Mình không cần bạn giỏi ngay — mình chỉ cần bạn xuất hiện và luyện đều đặn. Mỗi buổi một chút, vài tuần sau bạn sẽ ngạc nhiên với sự tiến bộ của mình.";
  }

  // Returning after gap → warm welcome-back
  if (cadenceDays !== null && cadenceDays > 5) {
    return "Mình biết bạn đã có một khoảng nghỉ — không sao cả. Mình thiết kế lộ trình này để bạn ôn lại nhẹ nhàng trước, rồi từ từ tiến lên. Quan trọng là bạn đã quay lại, và mình ở đây để giúp bạn.";
  }

  // Active learner with good cadence → momentum note
  if (cadenceDays !== null && cadenceDays <= 3 && sessionCount >= 5) {
    return "Bạn đang có đà rất tốt! Mình tận dụng nhịp học đều đặn này để đẩy bạn lên từng bước. Lộ trình này được thiết kế để thử thách bạn vừa đủ — không quá dễ, không quá khó.";
  }

  // Advanced learner → polish note
  if (cefrLevel === "C1" || cefrLevel === "C2") {
    return "Ở trình độ của bạn, mình không tập trung sửa lỗi nữa — mình tập trung vào độ tự nhiên, tinh tế, và trôi chảy. Lộ trình này giúp bạn nói và viết tiếng Anh như người bản xứ.";
  }

  // Default middle-ground note
  return `Mình thiết kế lộ trình ${phases.length} giai đoạn này dựa trên những gì mình biết về bạn — điểm mạnh, điểm yếu, mục tiêu, và nhịp học. Mỗi giai đoạn là một viên gạch. Học đều, không bỏ buổi, và bạn sẽ thấy sự khác biệt.`;
}

// ─── Weeks Estimation ────────────────────────────────────────────────────────

function estimateWeeks(totalSessions: number, cadenceDays: number | null): number | null {
  if (cadenceDays === null) return null;
  if (cadenceDays <= 0) return null;

  const sessionsPerWeek = 7 / cadenceDays;
  return Math.max(1, Math.ceil(totalSessions / sessionsPerWeek));
}

// ─── Disqualification by Recency ─────────────────────────────────────────────
// A recently-practiced skill should NOT appear as the first phase unless it's
// a strong interference pattern (obsCount >= 5) — in which case it's a
// persistent weakness that needs more work regardless.

function shouldDelayForRecency(
  seed: PhaseSeed,
  recentPractice: SequenceGeneratorInput["recentPractice"],
  now: number,
): boolean {
  // Strong interference patterns always get priority — they're systematic
  if (seed.obsCount >= 5) return false;

  return wasRecentlyPracticed(seed.template.skillTag, recentPractice, now);
}

// ─── Main Entry Point ────────────────────────────────────────────────────────

/**
 * Generate a personalized lesson sequence for a learner.
 *
 * This is the MAIN ENTRY POINT. It:
 *   1. Collects phase seeds from interference patterns, low mastery, and goals
 *   2. Sorts by priority (systematic errors → weak topics → goals)
 *   3. Filters out recently-practiced skills (unless they're persistent weaknesses)
 *   4. Builds each phase with calibrated session counts, challenge levels, and strategies
 *   5. Applies recency-aware ordering — recently practiced non-critical skills shift later
 *   6. Falls back to a balanced default sequence if no specific needs found
 *   7. Builds Vietnamese teacher-quality summary and learner note
 *
 * Pure function — deterministic, no I/O, no side effects.
 *
 * @param input — full learner context
 * @returns A complete personalized lesson sequence
 */
export function generateLessonSequence(
  input: SequenceGeneratorInput,
): PersonalizedLessonSequence {
  const currentTime = input.now ?? Date.now();
  const maxPhases = Math.min(8, Math.max(2, input.maxPhases ?? 6));

  // 1. Collect and sort phase seeds
  const allSeeds = collectPhaseSeeds(input);

  // 2. Split seeds: non-recency-delayed first, then delayed
  const immediateSeeds: PhaseSeed[] = [];
  const delayedSeeds: PhaseSeed[] = [];

  for (const seed of allSeeds) {
    if (shouldDelayForRecency(seed, input.recentPractice, currentTime)) {
      delayedSeeds.push(seed);
    } else {
      immediateSeeds.push(seed);
    }
  }

  // 3. Combine: immediate first, then delayed (if room)
  const orderedSeeds: PhaseSeed[] = [
    ...immediateSeeds,
    ...delayedSeeds,
  ].slice(0, maxPhases);

  // 4. Build phases
  const phases: LessonSequencePhase[] = [];
  let dispatchLabel = "";

  if (orderedSeeds.length === 0) {
    // ── No specific needs detected → fallback sequence ──
    dispatchLabel = "fallback:balanced-default";
    for (let i = 0; i < Math.min(maxPhases, FALLBACK_PHASES.length); i++) {
      const template = FALLBACK_PHASES[i];
      const position = i + 1;
      phases.push({
        position,
        skillTag: template.skillTag,
        titleVi: template.titleVi,
        sessionCount: calibrateSessions(template, 0, input.cefrLevel, input.avgDaysBetweenSessions),
        reasonVi: template.reasonViTemplate(0, input.cefrLevel),
        suggestedMode: template.suggestedMode,
        prerequisiteSkillTag: template.prerequisiteSkillTag,
        challengeLevel: calibrateChallenge(template, input.cefrLevel, position),
        strategy: assignStrategy(template, position, input.cefrLevel, input.avgDaysBetweenSessions),
        addressesInterference: null,
        alignedWithGoals: checkGoalAlignmentLocal(template.skillTag, input.goals),
      });
    }
  } else {
    // ── Build phases from seeds ──
    // Determine dispatch label from the first seed
    const firstSeed = orderedSeeds[0];
    if (firstSeed.obsCount >= 3) {
      dispatchLabel = `interference:${firstSeed.template.skillTag}`;
    } else if (firstSeed.lowMasteryScore > 0) {
      dispatchLabel = `mastery:${firstSeed.template.skillTag}`;
    } else if (firstSeed.obsCount >= 2) {
      dispatchLabel = `interference-mild:${firstSeed.template.skillTag}`;
    } else {
      dispatchLabel = `goal:${firstSeed.template.skillTag}`;
    }

    for (let i = 0; i < orderedSeeds.length; i++) {
      const seed = orderedSeeds[i];
      const position = i + 1;
      const template = seed.template;
      const obsCount = seed.obsCount;

      // Determine prerequisite from earlier phases
      const prerequisiteSkill =
        i > 0 ? orderedSeeds[i - 1].template.skillTag
        : template.prerequisiteSkillTag;

      phases.push({
        position,
        skillTag: template.skillTag,
        titleVi: template.titleVi,
        sessionCount: calibrateSessions(
          template,
          obsCount,
          input.cefrLevel,
          input.avgDaysBetweenSessions,
        ),
        reasonVi: template.reasonViTemplate(obsCount, input.cefrLevel),
        suggestedMode: template.suggestedMode,
        prerequisiteSkillTag: prerequisiteSkill,
        challengeLevel: calibrateChallenge(template, input.cefrLevel, position),
        strategy: assignStrategy(
          template,
          position,
          input.cefrLevel,
          input.avgDaysBetweenSessions,
        ),
        addressesInterference:
          seed.obsCount > 0 ? template.skillTag : null,
        alignedWithGoals: checkGoalAlignmentLocal(
          template.skillTag,
          input.goals,
        ),
      });
    }
  }

  const totalSessions = phases.reduce((sum, p) => sum + p.sessionCount, 0);
  const estimatedWeeks = estimateWeeks(totalSessions, input.avgDaysBetweenSessions);
  const summaryVi = buildSequenceSummary(
    phases,
    totalSessions,
    estimatedWeeks,
    input.cefrLevel,
    input.avgDaysBetweenSessions,
  );
  const learnerNoteVi = buildLearnerNote(
    phases,
    input.cefrLevel,
    input.avgDaysBetweenSessions,
    input.profile.sessionCount,
  );

  return {
    phases,
    totalSessions,
    estimatedWeeks,
    summaryVi,
    learnerNoteVi,
    adaptedFor: {
      cefrLevel: input.cefrLevel,
      goals: input.goals,
      cadenceDays: input.avgDaysBetweenSessions,
      interferenceCount: input.profile.interferencePatterns.filter(
        (p) => p.observedCount >= 2,
      ).length,
      lowMasteryTopicCount: Object.values(input.profile.topicMastery).filter(
        (s) => s < 50,
      ).length,
    },
    dispatchLabel,
  };
}

/**
 * Generate a quick, short-form lesson sequence with just the essentials.
 *
 * Useful for UI previews or when you need a lightweight plan.
 * Returns at most 3 phases.
 */
export function generateQuickSequence(
  input: SequenceGeneratorInput,
): PersonalizedLessonSequence {
  return generateLessonSequence({ ...input, maxPhases: 3 });
}

/**
 * Get a human-readable label for a dispatch label (for UI/debugging).
 */
export function getDispatchLabelVi(dispatchLabel: string): string {
  if (dispatchLabel.startsWith("interference:")) {
    const tag = dispatchLabel.slice("interference:".length);
    const tagDisplay = tag.replace(/-/g, " ");
    return `Phát hiện lỗi hệ thống: ${tagDisplay}`;
  }
  if (dispatchLabel.startsWith("interference-mild:")) {
    const tag = dispatchLabel.slice("interference-mild:".length);
    const tagDisplay = tag.replace(/-/g, " ");
    return `Phát hiện lỗi nhẹ: ${tagDisplay}`;
  }
  if (dispatchLabel.startsWith("mastery:")) {
    const tag = dispatchLabel.slice("mastery:".length);
    const tagDisplay = tag.replace(/-/g, " ");
    return `Điểm mastery thấp: ${tagDisplay}`;
  }
  if (dispatchLabel.startsWith("goal:")) {
    const tag = dispatchLabel.slice("goal:".length);
    const tagDisplay = tag.replace(/-/g, " ");
    return `Theo mục tiêu: ${tagDisplay}`;
  }
  if (dispatchLabel === "fallback:balanced-default") {
    return "Lộ trình mặc định — chưa đủ dữ liệu cá nhân hóa";
  }
  return dispatchLabel;
}

// ─── Sequence Catalog (for documentation and UI) ─────────────────────────────

export const LESSON_SEQUENCE_STRATEGY_CATALOG: ReadonlyArray<{
  key: string;
  titleVi: string;
  titleEn: string;
  descriptionVi: string;
}> = [
  {
    key: "interference-first",
    titleVi: "Ưu tiên lỗi hệ thống",
    titleEn: "Systematic error first",
    descriptionVi: "Lỗi do ảnh hưởng tiếng mẹ đẻ (ví dụ: thiếu mạo từ, sai thì) được ưu tiên cao nhất vì đây là lỗi hệ thống — sửa được sẽ cải thiện toàn bộ kỹ năng.",
  },
  {
    key: "mastery-gap-review",
    titleVi: "Ôn tập điểm mastery thấp",
    titleEn: "Low mastery review",
    descriptionVi: "Chủ đề có điểm mastery dưới 50% được đưa vào lộ trình để ngăn lỗ hổng kiến thức lan rộng.",
  },
  {
    key: "goal-aligned-padding",
    titleVi: "Điền chủ đề theo mục tiêu",
    titleEn: "Goal-aligned padding",
    descriptionVi: "Khi không có đủ lỗi hoặc điểm yếu, các chủ đề phục vụ mục tiêu của người học được thêm vào để lộ trình vẫn có ý nghĩa.",
  },
  {
    key: "recency-aware-ordering",
    titleVi: "Sắp xếp theo độ mới",
    titleEn: "Recency-aware ordering",
    descriptionVi: "Kỹ năng vừa được luyện gần đây (trong 3 ngày) được đẩy xuống cuối lộ trình, trừ khi đó là lỗi hệ thống nghiêm trọng.",
  },
  {
    key: "cadence-calibration",
    titleVi: "Điều chỉnh theo nhịp học",
    titleEn: "Cadence calibration",
    descriptionVi: "Người học thưa (>5 ngày/lần) được giao ít buổi hơn mỗi giai đoạn để tránh quên giữa chừng. Người học nâng cao cũng được rút gọn vì hấp thụ nhanh hơn.",
  },
  {
    key: "cefr-challenge-gradient",
    titleVi: "Độ khó tăng dần theo trình độ",
    titleEn: "CEFR challenge gradient",
    descriptionVi: "Giai đoạn đầu dễ hơn để tạo tự tin, giai đoạn sau khó dần. A1 luôn bắt đầu với 'easy', C1-C2 luôn bắt đầu với 'moderate' trở lên.",
  },
  {
    key: "strategy-per-phase",
    titleVi: "Chiến lược riêng cho từng giai đoạn",
    titleEn: "Per-phase strategy",
    descriptionVi: "Mỗi giai đoạn có một chiến lược sư phạm riêng (củng cố nền tảng, nhắm điểm yếu, thực hành thực tế...) thay vì một chiến lược cho toàn bộ lộ trình.",
  },
];

export const LESSON_SEQUENCE_DIMENSIONS = [
  {
    id: "weakness_priority" as const,
    titleVi: "Ưu tiên điểm yếu",
    titleEn: "Weakness prioritization",
    descriptionVi: "Lỗi hệ thống (≥3 lần) được ưu tiên cao nhất. Lỗi nhẹ (2 lần) được ưu tiên thấp hơn. Điểm mastery thấp được xếp sau lỗi hệ thống.",
  },
  {
    id: "recency_awareness" as const,
    titleVi: "Nhận biết bài vừa học",
    titleEn: "Recency awareness",
    descriptionVi: "Bài vừa luyện trong 3 ngày không bị lặp lại, trừ khi là lỗi hệ thống nghiêm trọng (≥5 lần) cần luyện thêm.",
  },
  {
    id: "session_calibration" as const,
    titleVi: "Điều chỉnh số buổi",
    titleEn: "Session count calibration",
    descriptionVi: "Số buổi mỗi giai đoạn được điều chỉnh theo: mức độ nghiêm trọng của lỗi, trình độ CEFR, và nhịp học của người dùng.",
  },
  {
    id: "prerequisite_chaining" as const,
    titleVi: "Chuỗi điều kiện tiên quyết",
    titleEn: "Prerequisite chaining",
    descriptionVi: "Mỗi giai đoạn xây dựng trên giai đoạn trước hoặc có điều kiện tiên quyết rõ ràng — giống như giáo trình thật.",
  },
  {
    id: "personalized_messaging" as const,
    titleVi: "Lời nhắn cá nhân hóa",
    titleEn: "Personalized messaging",
    descriptionVi: "Lời nhắn cho người học thay đổi theo: trình độ, nhịp học, số buổi đã học, và khoảng cách từ buổi trước — không phải tin nhắn mẫu cứng.",
  },
];
