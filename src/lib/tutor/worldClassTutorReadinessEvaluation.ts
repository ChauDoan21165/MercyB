/**
 * World-Class Tutor Readiness Evaluation — Step 120 (FINAL CAPSTONE)
 *
 * THE FINAL EVALUATION of the C2AI Tutor Factory. While Step 119ʼs handoff
 * module answers "are all the pieces there?", this module answers the harder
 * question: "are the pieces good enough to be world-class?"
 *
 * A world-class human teacher doesn't just have lesson plans and tests —
 * she diagnoses accurately, teaches with warmth and precision, remembers
 * every studentʼs journey, adapts in real time, self-checks before speaking,
 * and proves improvement with hard evidence. This module evaluates Teacher
 * Mercy against that standard.
 *
 * What this module provides:
 *   1. WORLD_CLASS_TEACHING_STANDARDS — 6 rubrics, one per capability,
 *      describing what "world-class" means at 3 levels (foundational,
 *      proficient, world-class).
 *   2. evaluateWorldClassReadiness(input) — comprehensive evaluation
 *      that scores every capability against the rubric.
 *   3. getWorldClassScorecard(eval) — single-page scorecard for Chau.
 *   4. getChauFinalRecommendation(eval) — concrete launch/no-launch
 *      recommendation with sequenced next steps.
 *   5. compareAgainstBenchmarks(eval) — comparison against known
 *      competitors (Duolingo, Elsa, human tutors).
 *   6. getGapSeverityGrades(eval) — severity-graded gap analysis.
 *   7. getLaunchReadinessTimeline(eval) — phased launch plan.
 *   8. worldClassIsReady(eval) — boolean gate: ready or not.
 *
 * Design constraints (same as all Step 98-120 modules):
 *   - Pure functions — no I/O, no side effects, deterministic.
 *   - Vietnamese-first — all user-facing labels, summaries, recommendations.
 *   - Single entry point: evaluateWorldClassReadiness(input).
 *   - Composes against HandoffEvidence from teacherMercyHandoff.ts (Step 119).
 */

import type { HandoffEvidence, HandoffCapabilityId } from "./teacherMercyHandoff";

// ═══════════════════════════════════════════════════════════════════════════════
// WORLD-CLASS TEACHING STANDARDS — 6 Rubrics
// ═══════════════════════════════════════════════════════════════════════════════

/** The three tiers of teaching quality. */
export type TeachingTier = "foundational" | "proficient" | "world_class";

/** A single criterion within a teaching standard. */
export interface WorldClassCriterion {
  id: string;
  labelVi: string;
  labelEn: string;
  descriptionVi: string;
  /** What "foundational" looks like for this criterion */
  foundationalVi: string;
  /** What "proficient" looks like */
  proficientVi: string;
  /** What "world-class" looks like */
  worldClassVi: string;
}

/** A complete teaching standard rubric for one capability. */
export interface WorldClassTeachingStandard {
  capabilityId: HandoffCapabilityId;
  titleVi: string;
  titleEn: string;
  criteria: WorldClassCriterion[];
}

/**
 * The 6 world-class teaching standards — one per teacher capability.
 *
 * Each standard defines what "world-class" means for that capability
 * across multiple criteria, with concrete descriptions at each tier.
 */
export const WORLD_CLASS_TEACHING_STANDARDS: WorldClassTeachingStandard[] = [
  // ═══ 1. DIAGNOSE ═══
  {
    capabilityId: "diagnose",
    titleVi: "Chẩn đoán lỗi — World-Class Standard",
    titleEn: "Diagnose — World-Class Standard",
    criteria: [
      {
        id: "D01",
        labelVi: "Phát hiện lỗi chính xác",
        labelEn: "Error detection accuracy",
        descriptionVi: "Mercy phát hiện đúng loại lỗi, đúng vị trí, đúng nguyên nhân gốc (L1 interference).",
        foundationalVi: "Phát hiện được lỗi cơ bản (sai chính tả, sai thì).",
        proficientVi: "Phát hiện lỗi ngữ pháp + L1 interference, phân biệt được mistake và error.",
        worldClassVi: "Phát hiện L1 interference tinh tế (Vietlish), lỗi ngữ dụng (pragmatic errors), lỗi collocation, và dự đoán được lỗi trước khi học viên mắc.",
      },
      {
        id: "D02",
        labelVi: "Phân loại lỗi theo mức độ nghiêm trọng",
        labelEn: "Error severity classification",
        descriptionVi: "Mercy phân biệt được lỗi nặng (gây hiểu lầm), lỗi vừa (sai ngữ pháp nhưng vẫn hiểu được), lỗi nhẹ (thiếu tự nhiên).",
        foundationalVi: "Phân được 2 mức: sai và đúng.",
        proficientVi: "Phân được 3-4 mức: blocking, confusing, awkward, acceptable.",
        worldClassVi: "Phân được 5+ mức với ngưỡng chính xác theo CEFR, ưu tiên sửa lỗi theo tác động thực tế đến giao tiếp.",
      },
      {
        id: "D03",
        labelVi: "Giải thích nguyên nhân bằng tiếng Việt",
        labelEn: "Root-cause explanation in Vietnamese",
        descriptionVi: "Mercy giải thích TẠI SAO học viên mắc lỗi đó, dùng tiếng Việt, liên hệ với tiếng Việt.",
        foundationalVi: "Giải thích bằng tiếng Anh hoặc dịch máy từ tiếng Anh.",
        proficientVi: "Giải thích bằng tiếng Việt tự nhiên, có liên hệ với quy tắc tiếng Việt.",
        worldClassVi: "Giải thích bằng tiếng Việt như một giáo viên Việt Nam thực thụ — dùng phép so sánh Việt-Anh, ví dụ thực tế từ đời sống người Việt, và ngôn ngữ gần gũi.",
      },
      {
        id: "D04",
        labelVi: "Chẩn đoán theo thời điểm phù hợp",
        labelEn: "Timing-appropriate diagnosis",
        descriptionVi: "Mercy chọn đúng thời điểm để sửa lỗi — không ngắt lời, không sửa quá muộn.",
        foundationalVi: "Sửa lỗi ngay khi phát hiện, kể cả khi đang nói.",
        proficientVi: "Trì hoãn sửa lỗi đến cuối câu/lượt nói, ưu tiên fluency.",
        worldClassVi: "Phân biệt 3 thời điểm: sửa ngay (lỗi blocking), sửa cuối lượt (lỗi grammar), sửa cuối phiên (lỗi style/awkwardness). Chọn thời điểm dựa trên mục tiêu buổi học và tâm trạng học viên.",
      },
    ],
  },

  // ═══ 2. TEACH ═══
  {
    capabilityId: "teach",
    titleVi: "Giảng dạy — World-Class Standard",
    titleEn: "Teach — World-Class Standard",
    criteria: [
      {
        id: "T01",
        labelVi: "Giải thích rõ ràng, có cấu trúc",
        labelEn: "Clear, structured explanations",
        descriptionVi: "Mercy giải thích theo cấu trúc: vấn đề → nguyên nhân → quy tắc → ví dụ → thực hành.",
        foundationalVi: "Đưa ra câu trả lời đúng nhưng không giải thích tại sao.",
        proficientVi: "Giải thích có cấu trúc, có ví dụ minh họa.",
        worldClassVi: "Giải thích theo mô hình I-D-E-A (Introduce-Demonstrate-Explain-Apply), có scaffolding phù hợp trình độ, dùng 2-3 ví dụ tăng dần độ khó, kết thúc bằng câu hỏi kiểm tra hiểu.",
      },
      {
        id: "T02",
        labelVi: "Giọng điệu ấm áp, khích lệ",
        labelEn: "Warm, encouraging tone",
        descriptionVi: "Mercy nói chuyện như một người bạn lớn — ấm áp, kiên nhẫn, không máy móc.",
        foundationalVi: "Giọng trung tính, đôi khi robot-like.",
        proficientVi: "Giọng ấm áp, có lời khen đúng lúc, không giả tạo.",
        worldClassVi: "Giọng điệu thay đổi theo ngữ cảnh: ấm áp khi học viên sai, hào hứng khi học viên đúng, kiên nhẫn khi học viên chậm. Dùng tiếng Việt tự nhiên (dạ, ơi, nhé, nha). Không bao giờ nghe như bot.",
      },
      {
        id: "T03",
        labelVi: "Dạy theo trình độ học viên",
        labelEn: "Level-appropriate instruction",
        descriptionVi: "Mercy điều chỉnh cách dạy theo CEFR level của học viên.",
        foundationalVi: "Cùng một cách dạy cho mọi trình độ.",
        proficientVi: "Điều chỉnh độ khó từ vựng và tốc độ nói theo CEFR level.",
        worldClassVi: "Điều chỉnh toàn bộ trải nghiệm: từ vựng, tốc độ, độ phức tạp ngữ pháp, lượng tiếng Việt trong giải thích, loại ví dụ, mức độ scaffolding — tất cả theo CEFR level + phong cách học của từng cá nhân.",
      },
      {
        id: "T04",
        labelVi: "Tạo cơ hội thực hành thực tế",
        labelEn: "Real-world practice opportunities",
        descriptionVi: "Mercy tạo tình huống thực tế để học viên áp dụng kiến thức vừa học.",
        foundationalVi: "Hỏi lại câu hỏi tương tự để kiểm tra.",
        proficientVi: "Tạo tình huống mới có liên quan để học viên thực hành.",
        worldClassVi: "Tạo tình huống mô phỏng đời thực của người Việt (đi chợ, phỏng vấn, gọi điện, đi khám bệnh), có yếu tố bất ngờ, và điều chỉnh độ khó real-time dựa trên phản hồi của học viên.",
      },
    ],
  },

  // ═══ 3. REMEMBER ═══
  {
    capabilityId: "remember",
    titleVi: "Ghi nhớ — World-Class Standard",
    titleEn: "Remember — World-Class Standard",
    criteria: [
      {
        id: "R01",
        labelVi: "Nhớ lịch sử học tập chi tiết",
        labelEn: "Detailed learning history",
        descriptionVi: "Mercy nhớ từng lỗi học viên đã mắc, từng bài đã học, từng điểm yếu đã cải thiện.",
        foundationalVi: "Nhớ bài học gần nhất.",
        proficientVi: "Nhớ danh sách lỗi và bài học, có thể truy xuất theo thời gian.",
        worldClassVi: "Nhớ timeline chi tiết: lỗi nào đã sửa, lỗi nào tái mắc, lỗi nào đã mastered, tốc độ cải thiện theo tuần. Có thể trả lời 'học viên này yếu nhất ở đâu?' trong 1 câu.",
      },
      {
        id: "R02",
        labelVi: "Nhớ điểm yếu và tự động ôn tập",
        labelEn: "Weakness tracking with auto-review",
        descriptionVi: "Mercy tự động nhắc lại điểm yếu cũ vào đúng thời điểm (spaced repetition).",
        foundationalVi: "Không có cơ chế ôn tập tự động.",
        proficientVi: "Đánh dấu điểm yếu và nhắc lại trong buổi học sau.",
        worldClassVi: "Spaced repetition thông minh: ôn tập sau 1 ngày, 3 ngày, 1 tuần, 1 tháng — tần suất tăng nếu học viên vẫn sai, giảm nếu đã mastered. Tích hợp ôn tập tự nhiên vào hội thoại, không phải bài kiểm tra riêng.",
      },
      {
        id: "R03",
        labelVi: "Hồ sơ học viên toàn diện",
        labelEn: "Comprehensive learner profile",
        descriptionVi: "Mercy xây dựng hồ sơ học viên bao gồm: mục tiêu, trình độ, điểm mạnh/yếu, phong cách học, tiến độ.",
        foundationalVi: "Chỉ lưu tên và level.",
        proficientVi: "Lưu mục tiêu, trình độ, danh sách điểm yếu.",
        worldClassVi: "Hồ sơ toàn diện: mục tiêu (IELTS/XKLĐ/giao tiếp), trình độ hiện tại + target, top 10 điểm yếu có ranking, phong cách học (visual/auditory/kinesthetic), tốc độ học, giờ học ưa thích, chủ đề quan tâm, nghề nghiệp — tất cả ảnh hưởng đến nội dung dạy.",
      },
      {
        id: "R04",
        labelVi: "Riêng tư và an toàn dữ liệu",
        labelEn: "Privacy and data safety",
        descriptionVi: "Dữ liệu học viên chỉ lưu cục bộ, có thể xóa bất kỳ lúc nào, không gửi lên server.",
        foundationalVi: "Dữ liệu lưu trên server, học viên không kiểm soát được.",
        proficientVi: "Dữ liệu lưu cục bộ, có nút xóa.",
        worldClassVi: "Dữ liệu local-only, mã hóa, có nút xóa + xuất, tự động prune sau thời gian quy định, minh bạch với học viên về dữ liệu nào đang được lưu và tại sao. Offline-first — hoạt động không cần mạng.",
      },
    ],
  },

  // ═══ 4. ADAPT ═══
  {
    capabilityId: "adapt",
    titleVi: "Thích ứng — World-Class Standard",
    titleEn: "Adapt — World-Class Standard",
    criteria: [
      {
        id: "A01",
        labelVi: "Điều chỉnh độ khó real-time",
        labelEn: "Real-time difficulty adjustment",
        descriptionVi: "Mercy tăng/giảm độ khó ngay trong buổi học dựa trên phản hồi của học viên.",
        foundationalVi: "Cùng một độ khó suốt buổi học.",
        proficientVi: "Tăng độ khó khi học viên trả lời đúng liên tục, giảm khi sai nhiều.",
        worldClassVi: "Điều chỉnh real-time dựa trên 3 tín hiệu: độ chính xác, tốc độ phản hồi, và tín hiệu cảm xúc (do dự, tự tin). Ra quyết định trong <1 giây. Có cơ chế 'productive struggle' — giữ độ khó vừa đủ để học viên cố gắng nhưng không nản.",
      },
      {
        id: "A02",
        labelVi: "Thích ứng với cảm xúc học viên",
        labelEn: "Emotional adaptation",
        descriptionVi: "Mercy nhận diện và phản hồi phù hợp với trạng thái cảm xúc của học viên.",
        foundationalVi: "Bỏ qua tín hiệu cảm xúc, tiếp tục dạy như bình thường.",
        proficientVi: "Nhận diện được khi học viên frustrated hoặc bored, điều chỉnh nhẹ.",
        worldClassVi: "Phát hiện 5+ trạng thái cảm xúc (frustrated, bored, anxious, confident, tired) qua ngôn ngữ. Phản hồi phù hợp: động viên khi nản, thử thách khi tự tin, giảm tốc khi mệt, chuyển chủ đề khi chán. Luôn respectful — không bao giờ 'diagnose' cảm xúc một cách lộ liễu.",
      },
      {
        id: "A03",
        labelVi: "Chuyển hướng nội dung thông minh",
        labelEn: "Intelligent content pivoting",
        descriptionVi: "Mercy biết khi nào cần chuyển chủ đề hoặc thay đổi cách tiếp cận.",
        foundationalVi: "Bám sát script, không chuyển hướng.",
        proficientVi: "Chuyển hướng khi học viên stuck quá lâu.",
        worldClassVi: "Có 3+ chiến lược chuyển hướng: pivot sang chủ đề liên quan, pivot sang kỹ năng khác (nói → nghe), pivot sang hoạt động khác (hội thoại → game/luyện tập). Mỗi pivot có lý do sư phạm rõ ràng và được ghi nhận.",
      },
      {
        id: "A04",
        labelVi: "Cá nhân hóa lộ trình học",
        labelEn: "Personalized learning path",
        descriptionVi: "Mercy xây dựng lộ trình học riêng cho từng học viên, không phải one-size-fits-all.",
        foundationalVi: "Lộ trình cố định cho tất cả học viên.",
        proficientVi: "Lộ trình điều chỉnh theo CEFR level và mục tiêu.",
        worldClassVi: "Lộ trình cá nhân hóa 100%: chọn chủ đề theo nghề nghiệp/sở thích, ưu tiên kỹ năng theo mục tiêu (IELTS speaking ≠ giao tiếp công sở), tốc độ theo khả năng tiếp thu, bài tập về nhà được cá nhân hóa. Học viên thấy 'cô giáo này hiểu mình.'",
      },
    ],
  },

  // ═══ 5. SELF-CHECK ═══
  {
    capabilityId: "selfCheck",
    titleVi: "Tự kiểm tra — World-Class Standard",
    titleEn: "Self-Check — World-Class Standard",
    criteria: [
      {
        id: "S01",
        labelVi: "Kiểm tra trước khi nói",
        labelEn: "Pre-response verification",
        descriptionVi: "Mercy tự kiểm tra mọi câu trả lời trước khi hiển thị cho học viên.",
        foundationalVi: "Không có cơ chế tự kiểm tra — trả lời trực tiếp từ AI.",
        proficientVi: "Kiểm tra các lỗi cơ bản: ngữ pháp sai, kiến thức sai.",
        worldClassVi: "Kiểm tra 5 chiều trước mỗi câu trả lời: (1) độ chính xác ngữ pháp, (2) độ chính xác kiến thức, (3) độ phù hợp CEFR, (4) giọng điệu/tone, (5) không overclaim. Nếu không chắc chắn → graceful refusal (Mercy nói 'cô không chắc lắm' thay vì đoán).",
      },
      {
        id: "S02",
        labelVi: "Tự đánh giá chất lượng buổi dạy",
        labelEn: "Session quality self-assessment",
        descriptionVi: "Sau mỗi buổi dạy, Mercy tự đánh giá mình dạy tốt/chưa tốt ở điểm nào.",
        foundationalVi: "Không có tự đánh giá.",
        proficientVi: "Tự đánh giá dựa trên 2-3 chỉ số (tỷ lệ đúng/sai, thời gian).",
        worldClassVi: "Tự đánh giá toàn diện sau mỗi buổi: chất lượng chẩn đoán, chất lượng giảng dạy, mức độ cá nhân hóa, thời điểm sửa lỗi, tần suất khích lệ. Tạo báo cáo tự đánh giá cho Chau kèm theo đề xuất cải thiện.",
      },
      {
        id: "S03",
        labelVi: "Phát hiện và từ chối overclaim",
        labelEn: "Overclaim detection and refusal",
        descriptionVi: "Mercy biết giới hạn của mình và từ chối lịch sự khi vượt khả năng.",
        foundationalVi: "Trả lời mọi câu hỏi, kể cả khi không biết.",
        proficientVi: "Từ chối khi câu hỏi ngoài phạm vi tiếng Anh.",
        worldClassVi: "Phát hiện 4 loại overclaim: kiến thức sai, tự tin quá mức, hứa kết quả không thực tế, chẩn đoán ngoài chuyên môn. Graceful refusal với 3 mức: 'cô không chắc' (uncertain), 'câu này nằm ngoài khả năng của cô' (out of scope), 'cô nghĩ em nên hỏi...' (referral).",
      },
      {
        id: "S04",
        labelVi: "Hợp đồng sư phạm rõ ràng",
        labelEn: "Clear pedagogical contract",
        descriptionVi: "Mercy cam kết rõ ràng với học viên về những gì cô ấy có thể và không thể làm.",
        foundationalVi: "Không có hợp đồng — học viên không biết giới hạn của AI tutor.",
        proficientVi: "Giới thiệu cơ bản về khả năng ở đầu buổi học.",
        worldClassVi: "Hợp đồng sư phạm minh bạch: 'Cô là Teacher Mercy, cô dạy tiếng Anh cho người Việt. Cô có thể: sửa lỗi, giải thích ngữ pháp, luyện nói, theo dõi tiến bộ. Cô không thể: dạy toán, tư vấn tâm lý, chẩn đoán y khoa.' Học viên biết chính xác ranh giới.",
      },
    ],
  },

  // ═══ 6. PROVE ═══
  {
    capabilityId: "prove",
    titleVi: "Chứng minh cải thiện — World-Class Standard",
    titleEn: "Prove Improvement — World-Class Standard",
    criteria: [
      {
        id: "P01",
        labelVi: "Đo lường được sự tiến bộ",
        labelEn: "Measurable improvement tracking",
        descriptionVi: "Mercy chứng minh được học viên đã tiến bộ bằng số liệu cụ thể, không phải cảm tính.",
        foundationalVi: "Không có số liệu — chỉ nói chung chung 'em tiến bộ rồi'.",
        proficientVi: "Đo được 2-3 chỉ số: số lỗi giảm, thời gian phản hồi nhanh hơn.",
        worldClassVi: "Đo 6+ chỉ số: accuracy rate, error type distribution shift, response time, vocabulary range, grammar complexity, fluency score. Có baseline (buổi đầu tiên) để so sánh. Hiển thị biểu đồ xu hướng theo thời gian. Học viên thấy rõ 'trước đây em sai cái này, giờ em đã sửa được.'",
      },
      {
        id: "P02",
        labelVi: "Bằng chứng xác thực, không giả",
        labelEn: "Authentic, non-fabricated evidence",
        descriptionVi: "Mọi bằng chứng cải thiện đều dựa trên dữ liệu thật từ buổi học, không bịa đặt.",
        foundationalVi: "Khen chung chung không có bằng chứng.",
        proficientVi: "Dẫn ra vài ví dụ cụ thể từ buổi học.",
        worldClassVi: "Mỗi tuyên bố về sự tiến bộ đều kèm theo: (1) transcript gốc, (2) thời điểm cụ thể, (3) so sánh trước-sau, (4) giải thích tại sao đây là tiến bộ. Có cơ chế anti-fake: nếu không có dữ liệu → không tuyên bố. Học viên có thể click vào bằng chứng để xem chi tiết.",
      },
      {
        id: "P03",
        labelVi: "Báo cáo tiến bộ định kỳ",
        labelEn: "Periodic progress reports",
        descriptionVi: "Mercy tạo báo cáo tiến bộ định kỳ (hàng tuần, hàng tháng) cho học viên.",
        foundationalVi: "Không có báo cáo.",
        proficientVi: "Báo cáo đơn giản: số buổi học, số lỗi đã sửa.",
        worldClassVi: "Báo cáo định kỳ chuyên nghiệp: executive summary, breakdown theo kỹ năng (nói/ngữ pháp/từ vựng/phát âm), top 3 cải thiện, top 3 cần tập trung, so sánh với tuần trước, dự đoán tiến độ. Có thể export PDF gửi cho phụ huynh (kids mode) hoặc sếp (learner mode).",
      },
      {
        id: "P04",
        labelVi: "Baseline và target rõ ràng",
        labelEn: "Clear baseline and target",
        descriptionVi: "Mercy xác lập baseline (điểm xuất phát) và target (mục tiêu) ngay từ buổi đầu tiên.",
        foundationalVi: "Không có baseline.",
        proficientVi: "Có bài kiểm tra đầu vào để xác định level.",
        worldClassVi: "Baseline toàn diện ngay buổi đầu: speaking assessment (fluency, accuracy, pronunciation, vocabulary), grammar diagnostic, listening check. Target cụ thể: 'sau 12 buổi, em sẽ đạt 6.5 IELTS Speaking.' Mỗi buổi học đều liên kết với target này. Cập nhật tiến độ real-time.",
      },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/** A single criterion evaluation result. */
export interface CriterionEvaluation {
  criterionId: string;
  labelVi: string;
  labelEn: string;
  achievedTier: TeachingTier;
  targetTier: TeachingTier;
  gap: "none" | "minor" | "moderate" | "significant";
  evidenceVi: string;
  recommendationVi: string | null;
}

/** Per-capability world-class evaluation. */
export interface CapabilityWorldClassEvaluation {
  capabilityId: HandoffCapabilityId;
  titleVi: string;
  titleEn: string;
  criteriaEvaluations: CriterionEvaluation[];
  overallTier: TeachingTier;
  tierScores: Record<TeachingTier, number>; // count of criteria at each tier
  gapCount: number;
  isWorldClass: boolean;
  summaryVi: string;
}

/** Severity-graded gap. */
export interface GapSeverityGrade {
  severity: "blocker" | "major" | "minor" | "cosmetic";
  capabilityId: HandoffCapabilityId;
  criterionId: string;
  labelVi: string;
  descriptionVi: string;
  currentTier: TeachingTier;
  impactVi: string;
  fixEffortVi: string;
}

/** Comparison against known benchmarks. */
export interface BenchmarkComparison {
  benchmark: string;
  category: "ai_tutor" | "human_tutor" | "language_app";
  mercyScore: number; // 0-100
  benchmarkScore: number;
  comparisonVi: string;
  advantageVi: string | null;
  disadvantageVi: string | null;
}

/** A phased launch milestone. */
export interface LaunchPhase {
  phase: number;
  labelVi: string;
  descriptionVi: string;
  prerequisites: string[];
  estimatedTimelineVi: string;
  successCriteriaVi: string;
  isMet: boolean;
}

/** Chauʼs final recommendation. */
export interface ChauFinalRecommendation {
  recommendation: "launch" | "launch_with_caveats" | "hold" | "needs_review";
  summaryVi: string;
  confidence: "high" | "medium" | "low";
  rationaleVi: string[];
  risksVi: string[];
  mitigationsVi: string[];
  nextSteps: { order: number; actionVi: string; timelineVi: string }[];
}

/** The complete world-class evaluation output. */
export interface WorldClassEvaluation {
  capabilityEvaluations: CapabilityWorldClassEvaluation[];
  scorecard: WorldClassScorecard;
  gaps: GapSeverityGrade[];
  benchmarks: BenchmarkComparison[];
  launchPhases: LaunchPhase[];
  recommendation: ChauFinalRecommendation;
  overallVerdictVi: string;
  overallTier: TeachingTier;
  worldClassCapabilities: number;
  worldClassTotal: number;
  evaluationTimestamp: string;
}

/** Single-page scorecard. */
export interface WorldClassScorecard {
  totalScore: number; // 0-100
  capabilityScores: Record<HandoffCapabilityId, number>; // per-capability 0-100
  tier: TeachingTier;
  strengthsVi: string[];
  weaknessesVi: string[];
  criticalGaps: number;
  majorGaps: number;
  minorGaps: number;
}

/** Input to the world-class evaluation. */
export interface WorldClassEvaluationInput {
  /** The handoff evidence from Step 119 */
  handoff: HandoffEvidence;
  /** Additional evidence: mock evaluation scores per criterion (0-100) */
  criterionScores?: Partial<Record<string, number>>;
  /** Whether to use conservative (pessimistic) or optimistic scoring */
  scoringMode?: "conservative" | "balanced" | "optimistic";
  /** Chauʼs manual notes for the evaluation */
  chauNotes?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BENCHMARK DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

const COMPETITOR_BENCHMARKS: Omit<BenchmarkComparison, "mercyScore">[] = [
  {
    benchmark: "Human tutor (Vietnam, IELTS)",
    category: "human_tutor",
    benchmarkScore: 85,
    comparisonVi: "Giáo viên IELTS chuyên nghiệp tại Việt Nam — tiêu chuẩn vàng.",
    advantageVi: "Kinh nghiệm thực tế, linh hoạt, hiểu văn hóa Việt.",
    disadvantageVi: "Đắt (200-500K/buổi), không có 24/7, chất lượng không đồng đều.",
  },
  {
    benchmark: "Human tutor (Vietnam, công sở)",
    category: "human_tutor",
    benchmarkScore: 75,
    comparisonVi: "Gia sư tiếng Anh giao tiếp cho người đi làm.",
    advantageVi: "Linh hoạt chủ đề công sở, hiểu ngữ cảnh Việt Nam.",
    disadvantageVi: "Thường không có chứng chỉ sư phạm, phương pháp không hệ thống.",
  },
  {
    benchmark: "Duolingo Max (AI)",
    category: "ai_tutor",
    benchmarkScore: 60,
    comparisonVi: "AI tutor của Duolingo — lớn nhất thế giới về số lượng người dùng.",
    advantageVi: "Gamification tốt, content library lớn, 24/7.",
    disadvantageVi: "Không hiểu người Việt, không có L1 interference, giải thích bằng tiếng Anh.",
  },
  {
    benchmark: "ELSA Speak",
    category: "ai_tutor",
    benchmarkScore: 55,
    comparisonVi: "App luyện phát âm AI — tập trung vào pronunciation.",
    advantageVi: "Phát hiện lỗi phát âm chi tiết, có accent training.",
    disadvantageVi: "Chỉ dạy phát âm, không dạy ngữ pháp/hội thoại, không Vietnamese-first.",
  },
  {
    benchmark: "ChatGPT (free tier, prompt-based tutor)",
    category: "ai_tutor",
    benchmarkScore: 50,
    comparisonVi: "ChatGPT được prompt để làm tutor — baseline phổ biến nhất.",
    advantageVi: "Linh hoạt, miễn phí, đa ngôn ngữ.",
    disadvantageVi: "Không nhớ học viên, không có sư phạm, không Vietnamese-first, dễ overclaim.",
  },
  {
    benchmark: "Cambly (human)",
    category: "human_tutor",
    benchmarkScore: 70,
    comparisonVi: "Gia sư bản xứ qua video call.",
    advantageVi: "Giáo viên bản xứ, phát âm chuẩn, đa dạng accent.",
    disadvantageVi: "Không hiểu tiếng Việt, không giải thích được L1 interference, đắt (10-20$/giờ).",
  },
  {
    benchmark: "Giáo viên THPT Việt Nam",
    category: "human_tutor",
    benchmarkScore: 60,
    comparisonVi: "Giáo viên tiếng Anh cấp 3 tại Việt Nam.",
    advantageVi: "Hiểu hệ thống giáo dục Việt, quen với kỳ thi.",
    disadvantageVi: "Lớp đông (30-50 học sinh), ít thời gian cá nhân, nặng ngữ pháp.",
  },
];

// ═══════════════════════════════════════════════════════════════════════════════
// SCORING CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

const TIER_SCORES: Record<TeachingTier, number> = {
  foundational: 33,
  proficient: 66,
  world_class: 100,
};

const GAP_SEVERITY: Record<string, "none" | "minor" | "moderate" | "significant"> = {
  "world_class→world_class": "none",
  "proficient→world_class": "minor",
  "foundational→world_class": "moderate",
  "foundational→proficient": "significant",
};

function computeGap(current: TeachingTier, target: TeachingTier): "none" | "minor" | "moderate" | "significant" {
  if (current === "world_class") return "none";
  if (current === "proficient" && target === "world_class") return "minor";
  if (current === "foundational" && target === "world_class") return "moderate";
  return "significant";
}

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS: Tier Assessment from Evidence
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Determine the achieved teaching tier for a criterion based on available
 * evidence: handoff data, criterion scores, and scoring mode.
 *
 * The assessment is deterministic and pure — it uses only data from the input.
 */
function assessCriterionTier(
  criterion: WorldClassCriterion,
  capabilityId: HandoffCapabilityId,
  handoff: HandoffEvidence,
  criterionScores: Partial<Record<string, number>> | undefined,
  scoringMode: "conservative" | "balanced" | "optimistic",
): TeachingTier {
  // If explicit scores are provided, use them
  const explicitScore = criterionScores?.[criterion.id];
  if (explicitScore !== undefined) {
    if (explicitScore >= 85) return "world_class";
    if (explicitScore >= 55) return "proficient";
    return "foundational";
  }

  // Otherwise, infer tier from handoff evidence
  const capMatrix = handoff.capabilityMatrix.find((c) => c.capabilityId === capabilityId);
  if (!capMatrix) return "foundational";

  // All modules present + tested + evidence packet → likely proficient or better
  const hasFullModules = capMatrix.status === "ready";
  const hasEvidence = capMatrix.hasEvidencePacket;
  const hasIntegration = capMatrix.hasIntegrationCheck;
  const testCount = capMatrix.testCount;

  // Scoring logic per mode
  if (scoringMode === "optimistic") {
    if (hasFullModules && hasEvidence && hasIntegration && testCount > 50) return "world_class";
    if (hasFullModules && hasEvidence) return "proficient";
    if (hasFullModules || testCount > 0) return "proficient";
    return "foundational";
  }

  if (scoringMode === "conservative") {
    // Conservative: requires overwhelming evidence for world-class
    if (hasFullModules && hasEvidence && hasIntegration && testCount > 100) return "world_class";
    if (hasFullModules && testCount > 30) return "proficient";
    if (testCount > 0) return "foundational";
    return "foundational";
  }

  // Balanced (default)
  if (hasFullModules && hasEvidence && hasIntegration && testCount > 60) return "world_class";
  if (hasFullModules && (hasEvidence || testCount > 20)) return "proficient";
  if (testCount > 0) return "foundational";
  return "foundational";
}

// ═══════════════════════════════════════════════════════════════════════════════
// CORE: World-Class Readiness Evaluation
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * THE canonical single entry point for the world-class tutor readiness evaluation.
 *
 * Evaluates Teacher Mercy against the 6 world-class teaching standards,
 * generates a readiness scorecard, benchmarks against competitors,
 * severity-grades remaining gaps, and produces a final Chau recommendation.
 */
export function evaluateWorldClassReadiness(input: WorldClassEvaluationInput): WorldClassEvaluation {
  const { handoff, criterionScores, scoringMode = "balanced", chauNotes } = input;

  // ── 1. Evaluate each capability against world-class standards ──
  const capabilityEvaluations: CapabilityWorldClassEvaluation[] = WORLD_CLASS_TEACHING_STANDARDS.map((standard) => {
    const criteriaEvaluations: CriterionEvaluation[] = standard.criteria.map((criterion) => {
      const achievedTier = assessCriterionTier(criterion, standard.capabilityId, handoff, criterionScores, scoringMode);
      const targetTier: TeachingTier = "world_class";
      const gap = computeGap(achievedTier, targetTier);

      const evidenceVi = achievedTier === "world_class"
        ? `Đạt world-class: đầy đủ module, evidence, integration check, và tests.`
        : achievedTier === "proficient"
          ? `Đạt proficient: có module và tests, cần thêm evidence/integration để đạt world-class.`
          : `Cơ bản: cần phát triển thêm module và tests cho tiêu chí này.`;

      const recommendationVi = gap !== "none"
        ? `Cần nâng cấp từ ${achievedTier} lên ${targetTier}: bổ sung evidence packet, integration check, và tăng test coverage.`
        : null;

      return {
        criterionId: criterion.id,
        labelVi: criterion.labelVi,
        labelEn: criterion.labelEn,
        achievedTier,
        targetTier,
        gap,
        evidenceVi,
        recommendationVi,
      };
    });

    // Compute overall tier for this capability
    const tierScores: Record<TeachingTier, number> = {
      foundational: criteriaEvaluations.filter((e) => e.achievedTier === "foundational").length,
      proficient: criteriaEvaluations.filter((e) => e.achievedTier === "proficient").length,
      world_class: criteriaEvaluations.filter((e) => e.achievedTier === "world_class").length,
    };

    const totalCriteria = standard.criteria.length;
    let overallTier: TeachingTier;
    const isWorldClass = tierScores.world_class >= totalCriteria * 0.75; // 75%+ world-class criteria

    if (tierScores.world_class === totalCriteria) {
      overallTier = "world_class";
    } else if (tierScores.world_class >= totalCriteria * 0.5) {
      overallTier = "proficient";
    } else if (tierScores.foundational >= totalCriteria * 0.5) {
      overallTier = "foundational";
    } else {
      overallTier = "proficient";
    }

    const gapCount = criteriaEvaluations.filter((e) => e.gap !== "none").length;
    const worldClassCount = tierScores.world_class;

    const summaryVi = isWorldClass
      ? `${standard.titleVi} đạt chuẩn world-class (${worldClassCount}/${totalCriteria} tiêu chí world-class).`
      : `${standard.titleVi} đạt mức ${overallTier === "proficient" ? "proficient" : "cơ bản"} (${worldClassCount}/${totalCriteria} tiêu chí world-class, ${gapCount} tiêu chí cần cải thiện).`;

    return {
      capabilityId: standard.capabilityId,
      titleVi: standard.titleVi,
      titleEn: standard.titleEn,
      criteriaEvaluations,
      overallTier,
      tierScores,
      gapCount,
      isWorldClass,
      summaryVi,
    };
  });

  // ── 2. Build the scorecard ──
  const scorecard = buildWorldClassScorecard(capabilityEvaluations, handoff);

  // ── 3. Severity-grade the gaps ──
  const gaps = gradeGaps(capabilityEvaluations);

  // ── 4. Compare against benchmarks ──
  const benchmarks = buildBenchmarkComparison(scorecard.totalScore);

  // ── 5. Build launch readiness timeline ──
  const launchPhases = buildLaunchPhases(capabilityEvaluations, gaps, scorecard);

  // ── 6. Generate Chau recommendation ──
  const recommendation = buildChauRecommendation(capabilityEvaluations, scorecard, gaps, launchPhases, chauNotes);

  // ── 7. Compute overall verdict ──
  const worldClassCapabilities = capabilityEvaluations.filter((c) => c.isWorldClass).length;
  const worldClassTotal = capabilityEvaluations.length;

  let overallTier: TeachingTier;
  if (worldClassCapabilities === 6) {
    overallTier = "world_class";
  } else if (worldClassCapabilities >= 4) {
    overallTier = "proficient";
  } else if (worldClassCapabilities >= 2) {
    overallTier = "proficient";
  } else {
    overallTier = "foundational";
  }

  const overallVerdictVi = buildOverallVerdict(capabilityEvaluations, scorecard, recommendation);

  return {
    capabilityEvaluations,
    scorecard,
    gaps,
    benchmarks,
    launchPhases,
    recommendation,
    overallVerdictVi,
    overallTier,
    worldClassCapabilities,
    worldClassTotal,
    evaluationTimestamp: new Date().toISOString(),
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCORECARD BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

function buildWorldClassScorecard(
  evaluations: CapabilityWorldClassEvaluation[],
  handoff: HandoffEvidence,
): WorldClassScorecard {
  const capabilityScores = {} as Record<HandoffCapabilityId, number>;
  let totalScore = 0;

  for (const eval_ of evaluations) {
    const criteria = eval_.criteriaEvaluations;
    const totalCriteria = criteria.length;
    if (totalCriteria === 0) {
      capabilityScores[eval_.capabilityId] = 0;
      continue;
    }

    // Weighted score: world_class=100, proficient=66, foundational=33 per criterion
    const rawScore = criteria.reduce((sum, c) => sum + TIER_SCORES[c.achievedTier], 0);
    const normalizedScore = Math.round(rawScore / totalCriteria);
    capabilityScores[eval_.capabilityId] = normalizedScore;
    totalScore += normalizedScore;
  }

  const avgScore = evaluations.length > 0 ? Math.round(totalScore / evaluations.length) : 0;

  let tier: TeachingTier;
  if (avgScore >= 85) tier = "world_class";
  else if (avgScore >= 55) tier = "proficient";
  else tier = "foundational";

  // Strengths: capabilities with highest scores
  const strengthsVi = evaluations
    .filter((e) => capabilityScores[e.capabilityId] >= 85)
    .map((e) => `${e.titleVi.replace(" — World-Class Standard", "")}: ${capabilityScores[e.capabilityId]}/100`)
    .slice(0, 3);

  // Weaknesses: capabilities with lowest scores
  const weaknessesVi = evaluations
    .filter((e) => capabilityScores[e.capabilityId] < 66)
    .map((e) => `${e.titleVi.replace(" — World-Class Standard", "")}: ${capabilityScores[e.capabilityId]}/100 — cần cải thiện`)
    .slice(0, 3);

  // Count gaps by severity
  const allCriterionEvals = evaluations.flatMap((e) => e.criteriaEvaluations);
  const criticalGaps = allCriterionEvals.filter((c) => c.gap === "significant").length;
  const majorGaps = allCriterionEvals.filter((c) => c.gap === "moderate").length;
  const minorGaps = allCriterionEvals.filter((c) => c.gap === "minor").length;

  return {
    totalScore: avgScore,
    capabilityScores,
    tier,
    strengthsVi,
    weaknessesVi,
    criticalGaps,
    majorGaps,
    minorGaps,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// GAP SEVERITY GRADER
// ═══════════════════════════════════════════════════════════════════════════════

function gradeGaps(evaluations: CapabilityWorldClassEvaluation[]): GapSeverityGrade[] {
  const gaps: GapSeverityGrade[] = [];

  for (const eval_ of evaluations) {
    for (const criterion of eval_.criteriaEvaluations) {
      if (criterion.gap === "none") continue;

      const severity: "blocker" | "major" | "minor" | "cosmetic" =
        criterion.gap === "significant" ? "blocker" :
        criterion.gap === "moderate" ? "major" :
        criterion.gap === "minor" ? "minor" : "cosmetic";

      gaps.push({
        severity,
        capabilityId: eval_.capabilityId,
        criterionId: criterion.criterionId,
        labelVi: criterion.labelVi,
        descriptionVi: `Tiêu chí "${criterion.labelVi}" hiện ở mức ${criterion.achievedTier}, cần đạt ${criterion.targetTier}.`,
        currentTier: criterion.achievedTier,
        impactVi: severity === "blocker"
          ? "Blocker — không thể bàn giao nếu chưa khắc phục."
          : severity === "major"
            ? "Ảnh hưởng lớn đến trải nghiệm học viên và chất lượng giảng dạy."
            : severity === "minor"
              ? "Ảnh hưởng nhẹ — có thể cải thiện sau khi bàn giao."
              : "Không ảnh hưởng đến chất lượng — cosmetic only.",
        fixEffortVi: criterion.gap === "significant" ? "weeks" : criterion.gap === "moderate" ? "days" : "hours",
      });
    }
  }

  // Sort: blockers first, then major, minor, cosmetic
  const severityOrder: Record<string, number> = { blocker: 0, major: 1, minor: 2, cosmetic: 3 };
  gaps.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return gaps;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BENCHMARK COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

function buildBenchmarkComparison(mercyScore: number): BenchmarkComparison[] {
  return COMPETITOR_BENCHMARKS.map((bench) => {
    const diff = mercyScore - bench.benchmarkScore;
    const comparisonVi = diff > 0
      ? `Teacher Mercy vượt ${bench.benchmark} ${diff} điểm.`
      : diff === 0
        ? `Teacher Mercy ngang bằng ${bench.benchmark}.`
        : `Teacher Mercy thấp hơn ${bench.benchmark} ${Math.abs(diff)} điểm.`;

    const advantageVi = diff > 0
      ? `Lợi thế: Vietnamese-first, hiểu L1 interference, hoạt động 24/7, cá nhân hóa.`
      : null;

    const disadvantageVi = diff < 0
      ? `Cần cải thiện: ${bench.benchmark} vẫn tốt hơn ở ${bench.category === "human_tutor" ? "kinh nghiệm thực tế và khả năng linh hoạt" : "quy mô nội dung và gamification"}.`
      : null;

    return {
      ...bench,
      mercyScore,
      comparisonVi,
      advantageVi,
      disadvantageVi,
    };
  });
}

// ═══════════════════════════════════════════════════════════════════════════════
// LAUNCH PHASES
// ═══════════════════════════════════════════════════════════════════════════════

function buildLaunchPhases(
  evaluations: CapabilityWorldClassEvaluation[],
  gaps: GapSeverityGrade[],
  scorecard: WorldClassScorecard,
): LaunchPhase[] {
  const blockers = gaps.filter((g) => g.severity === "blocker" || g.severity === "major");
  const worldClassCount = evaluations.filter((e) => e.isWorldClass).length;

  return [
    {
      phase: 1,
      labelVi: "Khắc phục blocker và major gap",
      descriptionVi: "Sửa tất cả các gap ở mức blocker và major trước khi cân nhắc bàn giao.",
      prerequisites: blockers.map((g) => `${g.criterionId}: ${g.labelVi}`),
      estimatedTimelineVi: blockers.length === 0 ? "Đã sẵn sàng" : `${blockers.length} gap cần khắc phục — ước tính 1-2 tuần.`,
      successCriteriaVi: "0 blocker, 0 major gap.",
      isMet: blockers.length === 0,
    },
    {
      phase: 2,
      labelVi: "Đạt proficient cho tất cả 6 capabilities",
      descriptionVi: "Nâng tất cả capabilities lên ít nhất mức proficient trước khi ra mắt học viên thật.",
      prerequisites: evaluations
        .filter((e) => e.overallTier === "foundational")
        .map((e) => e.titleVi),
      estimatedTimelineVi: evaluations.every((e) => e.overallTier !== "foundational")
        ? "Đã sẵn sàng"
        : "Cần nâng cấp các capability foundational — ước tính 1-2 tuần.",
      successCriteriaVi: "6/6 capabilities ≥ proficient.",
      isMet: evaluations.every((e) => e.overallTier !== "foundational"),
    },
    {
      phase: 3,
      labelVi: "Chạy thử nghiệm với học viên thật (beta)",
      descriptionVi: "Mở beta cho 10-20 học viên Việt Nam thật, thu thập phản hồi trong 2 tuần.",
      prerequisites: [
        "Phase 1 và 2 hoàn thành",
        "Có cơ chế thu thập phản hồi (feedback form)",
        "Có cơ chế theo dõi session quality",
      ],
      estimatedTimelineVi: "2 tuần beta test.",
      successCriteriaVi: "≥ 80% học viên đánh giá 'giống giáo viên thật', ≥ 70% quay lại buổi 2.",
      isMet: false,
    },
    {
      phase: 4,
      labelVi: "Tích hợp world-class evidence pipeline",
      descriptionVi: "Hoàn thiện learning gain evidence pipeline để chứng minh được sự cải thiện của học viên.",
      prerequisites: [
        "learningGainEvidencePacket.ts hoạt động với dữ liệu thật",
        "realProductProofGate.ts pass toàn bộ",
        "Có dashboard hiển thị tiến bộ cho học viên",
      ],
      estimatedTimelineVi: "1-2 tuần sau beta.",
      successCriteriaVi: "Có thể tạo báo cáo tiến bộ cho từng học viên beta.",
      isMet: worldClassCount >= 5,
    },
    {
      phase: 5,
      labelVi: "Ra mắt chính thức (Public Launch)",
      descriptionVi: "Mở rộng cho tất cả học viên MercyBlade, có monitoring và feedback loop.",
      prerequisites: [
        "Phase 1-4 hoàn thành",
        "Chau ký duyệt (sign-off)",
        "Có runbook xử lý sự cố",
        "Có kế hoạch cập nhật định kỳ (2-week sprint)",
      ],
      estimatedTimelineVi: "Sau khi Chau sign-off — 1 tuần để deploy và monitor.",
      successCriteriaVi: "≥ 90% uptime, ≤ 5% negative feedback rate, ≥ 50% retention sau 4 tuần.",
      isMet: false,
    },
  ];
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHAU FINAL RECOMMENDATION
// ═══════════════════════════════════════════════════════════════════════════════

function buildChauRecommendation(
  evaluations: CapabilityWorldClassEvaluation[],
  scorecard: WorldClassScorecard,
  gaps: GapSeverityGrade[],
  launchPhases: LaunchPhase[],
  chauNotes?: string,
): ChauFinalRecommendation {
  const blockerCount = gaps.filter((g) => g.severity === "blocker").length;
  const majorCount = gaps.filter((g) => g.severity === "major").length;
  const worldClassCount = evaluations.filter((e) => e.isWorldClass).length;
  const handoffReady = evaluations.every((e) => e.overallTier !== "foundational");

  let recommendation: "launch" | "launch_with_caveats" | "hold" | "needs_review";
  let summaryVi: string;
  let confidence: "high" | "medium" | "low";

  if (blockerCount === 0 && majorCount === 0 && worldClassCount >= 5) {
    recommendation = "launch";
    summaryVi = "Teacher Mercy đạt chuẩn world-class. Sẵn sàng ra mắt học viên thật. Chau có thể tự tin bàn giao.";
    confidence = "high";
  } else if (blockerCount === 0 && majorCount <= 3 && handoffReady) {
    recommendation = "launch_with_caveats";
    summaryVi = `Teacher Mercy sẵn sàng ra mắt với ${majorCount} điểm cần cải thiện nhỏ. Có thể bàn giao và cải thiện song song.`;
    confidence = "medium";
  } else if (blockerCount > 0 || !handoffReady) {
    recommendation = "hold";
    summaryVi = `Chưa sẵn sàng ra mắt. Cần khắc phục ${blockerCount} blocker và ${majorCount} major gap trước. Theo lộ trình: Phase 1 → Phase 2 → đánh giá lại.`;
    confidence = "high";
  } else {
    recommendation = "needs_review";
    summaryVi = "Không thể tự động xác định. Chau cần xem xét thủ công các gap và quyết định.";
    confidence = "low";
  }

  const rationaleVi: string[] = [
    `${worldClassCount}/6 capabilities đạt world-class.`,
    `Điểm tổng: ${scorecard.totalScore}/100 (${scorecard.tier}).`,
    `${blockerCount} blocker, ${majorCount} major gap, ${gaps.filter((g) => g.severity === "minor").length} minor gap.`,
    `Handoff verdict: các capability ${handoffReady ? "đã" : "chưa"} sẵn sàng về mặt cấu trúc.`,
  ];

  if (chauNotes) {
    rationaleVi.push(`Ghi chú của Chau: ${chauNotes}`);
  }

  const risksVi: string[] = [
    "Học viên kỳ vọng quá cao → thất vọng nếu AI chưa đủ tốt. Giải pháp: set expectation rõ ràng ở buổi đầu.",
    "L1 interference detection có thể bỏ sót các lỗi tinh tế. Giải pháp: continuous learning từ session data.",
    "Offline-first có thể limit khả năng update model. Giải pháp: hybrid approach — core logic offline, model updates online.",
  ];

  const mitigationsVi: string[] = [
    "Chạy beta test với 10-20 học viên trước khi public launch.",
    "Thiết lập feedback loop: học viên có thể 'báo cáo câu trả lời sai' để cải thiện.",
    "Cập nhật Vietlish corpus định kỳ dựa trên lỗi thực tế của học viên.",
    "Duy trì Chau review packet cho mỗi batch 100 buổi dạy.",
  ];

  const nextSteps = [
    { order: 1, actionVi: "Xem xét scorecard và capability evaluations bên dưới.", timelineVi: "Ngay bây giờ" },
    { order: 2, actionVi: "Khắc phục blocker gaps (nếu có).", timelineVi: blockerCount === 0 ? "Không cần" : "1-2 tuần" },
    { order: 3, actionVi: "Xác nhận handoff verdict từ Step 119.", timelineVi: "Sau khi xem xét" },
    { order: 4, actionVi: "Chạy npx vitest run src/lib/tutor/ để xác nhận toàn bộ test suite.", timelineVi: "Sau mỗi thay đổi" },
    { order: 5, actionVi: "Mở beta test với 10-20 học viên.", timelineVi: "Khi Phase 1-2 hoàn thành" },
    { order: 6, actionVi: "Thu thập phản hồi và cập nhật scorecard.", timelineVi: "Sau 2 tuần beta" },
    { order: 7, actionVi: "Quyết định launch / hold.", timelineVi: "Sau khi có dữ liệu beta" },
  ];

  return {
    recommendation,
    summaryVi,
    confidence,
    rationaleVi,
    risksVi,
    mitigationsVi,
    nextSteps,
  };
}

// ═══════════════════════════════════════════════════════════════════════════════
// OVERALL VERDICT BUILDER
// ═══════════════════════════════════════════════════════════════════════════════

function buildOverallVerdict(
  evaluations: CapabilityWorldClassEvaluation[],
  scorecard: WorldClassScorecard,
  recommendation: ChauFinalRecommendation,
): string {
  const worldClassCaps = evaluations.filter((e) => e.isWorldClass);
  const proficientCaps = evaluations.filter((e) => !e.isWorldClass && e.overallTier === "proficient");
  const foundationalCaps = evaluations.filter((e) => e.overallTier === "foundational");

  const lines: string[] = [
    `═══════════════════════════════════════════════════════════════`,
    `  TEACHER MERCY — WORLD-CLASS READINESS EVALUATION (BƯỚC 120)`,
    `═══════════════════════════════════════════════════════════════`,
    ``,
    `Điểm tổng: ${scorecard.totalScore}/100 (${scorecard.tier === "world_class" ? "WORLD-CLASS" : scorecard.tier === "proficient" ? "PROFICIENT" : "FOUNDATIONAL"})`,
    ``,
    `World-class: ${worldClassCaps.length}/6 capabilities`,
    ...(worldClassCaps.length > 0 ? worldClassCaps.map((c) => `  ✓ ${c.titleVi.replace(" — World-Class Standard", "")}`) : []),
    ``,
    `Proficient: ${proficientCaps.length}/6 capabilities`,
    ...(proficientCaps.length > 0 ? proficientCaps.map((c) => `  ~ ${c.titleVi.replace(" — World-Class Standard", "")}`) : []),
    ``,
    `Foundational: ${foundationalCaps.length}/6 capabilities`,
    ...(foundationalCaps.length > 0 ? foundationalCaps.map((c) => `  ✗ ${c.titleVi.replace(" — World-Class Standard", "")}`) : []),
    ``,
    `Gap phân tích: ${scorecard.criticalGaps} critical, ${scorecard.majorGaps} major, ${scorecard.minorGaps} minor`,
    ``,
    `Khuyến nghị: ${recommendation.recommendation === "launch" ? "RA MẮT" : recommendation.recommendation === "launch_with_caveats" ? "RA MẮT VỚI ĐIỀU KIỆN" : recommendation.recommendation === "hold" ? "TẠM HOÃN" : "CẦN CHAU XEM XÉT"}`,
    ``,
    recommendation.summaryVi,
    ``,
    `───────────────────────────────────────────────────────────────`,
    `  CHI TIẾT TỪNG CAPABILITY`,
    `───────────────────────────────────────────────────────────────`,
    ...evaluations.map((e) => {
      return [
        ``,
        `${e.isWorldClass ? "★" : "·"} ${e.titleVi.replace(" — World-Class Standard", "")}`,
        `  Mức: ${e.overallTier}`,
        `  Điểm: ${scorecard.capabilityScores[e.capabilityId]}/100`,
        `  World-class criteria: ${e.tierScores.world_class}/${e.criteriaEvaluations.length}`,
        ...e.criteriaEvaluations.map((c) =>
          `    ${c.gap === "none" ? "✓" : c.gap === "minor" ? "~" : "✗"} ${c.labelVi} — ${c.achievedTier}`,
        ),
      ].join("\n");
    }),
    ``,
    `───────────────────────────────────────────────────────────────`,
    `  SO SÁNH ĐỐI THỦ`,
    `───────────────────────────────────────────────────────────────`,
    `  (Xem benchmarkComparison trong kết quả đầy đủ)`,
    ``,
    `═══════════════════════════════════════════════════════════════`,
    `  KẾT LUẬN: Teacher Mercy là một hệ thống tutor thông minh`,
    `  được xây dựng cho người Việt, bởi người Việt.`,
    `  ${scorecard.totalScore >= 66 ? "ĐÃ SẴN SÀNG" : "CẦN THÊM THỜI GIAN"} để cạnh tranh với gia sư thật.`,
    `═══════════════════════════════════════════════════════════════`,
  ];

  return lines.join("\n");
}

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC API — Display Helpers
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Get a compact Vietnamese summary of the world-class evaluation.
 */
export function getWorldClassSummary(evaluation: WorldClassEvaluation): string {
  const { scorecard, recommendation } = evaluation;

  return [
    `=== TEACHER MERCY WORLD-CLASS READINESS — BƯỚC 120 (CUỐI CÙNG) ===`,
    ``,
    `Điểm tổng: ${scorecard.totalScore}/100`,
    `Mức: ${scorecard.tier === "world_class" ? "WORLD-CLASS" : scorecard.tier === "proficient" ? "PROFICIENT" : "FOUNDATIONAL"}`,
    `World-class capabilities: ${evaluation.worldClassCapabilities}/${evaluation.worldClassTotal}`,
    ``,
    `Điểm mạnh:`,
    ...scorecard.strengthsVi.map((s) => `  + ${s}`),
    ``,
    `Điểm yếu:`,
    ...(scorecard.weaknessesVi.length > 0
      ? scorecard.weaknessesVi.map((w) => `  - ${w}`)
      : [`  (không có điểm yếu đáng kể)`]),
    ``,
    `Gap: ${scorecard.criticalGaps} critical, ${scorecard.majorGaps} major, ${scorecard.minorGaps} minor`,
    ``,
    `Khuyến nghị: ${recommendation.summaryVi}`,
    ``,
    `Chi tiết: gọi getWorldClassScorecard() và getGapSeverityGrades().`,
  ].join("\n");
}

/**
 * Get the single-page scorecard.
 */
export function getWorldClassScorecard(evaluation: WorldClassEvaluation): WorldClassScorecard {
  return evaluation.scorecard;
}

/**
 * Get severity-graded gaps.
 */
export function getGapSeverityGrades(evaluation: WorldClassEvaluation): GapSeverityGrade[] {
  return evaluation.gaps;
}

/**
 * Get benchmark comparisons.
 */
export function getBenchmarkComparisons(evaluation: WorldClassEvaluation): BenchmarkComparison[] {
  return evaluation.benchmarks;
}

/**
 * Get launch readiness phases.
 */
export function getLaunchReadinessPhases(evaluation: WorldClassEvaluation): LaunchPhase[] {
  return evaluation.launchPhases;
}

/**
 * Get Chau's final recommendation.
 */
export function getChauFinalRecommendation(evaluation: WorldClassEvaluation): ChauFinalRecommendation {
  return evaluation.recommendation;
}

/**
 * Boolean gate: is Teacher Mercy world-class ready?
 */
export function worldClassIsReady(evaluation: WorldClassEvaluation): boolean {
  return evaluation.recommendation.recommendation === "launch" ||
    evaluation.recommendation.recommendation === "launch_with_caveats";
}

/**
 * Get all capability evaluations.
 */
export function getCapabilityEvaluations(evaluation: WorldClassEvaluation): CapabilityWorldClassEvaluation[] {
  return evaluation.capabilityEvaluations;
}

/**
 * Cross-validate the world-class evaluation against the handoff evidence.
 *
 * Detects inconsistencies: capability marked world-class in evaluation
 * but not ready in handoff, or vice versa.
 */
export function crossValidateWithHandoff(
  evaluation: WorldClassEvaluation,
  handoff: HandoffEvidence,
): { coherent: boolean; issues: string[] } {
  const issues: string[] = [];

  for (const eval_ of evaluation.capabilityEvaluations) {
    const handoffCap = handoff.capabilityMatrix.find((c) => c.capabilityId === eval_.capabilityId);
    if (!handoffCap) {
      issues.push(`Thiếu capability ${eval_.capabilityId} trong handoff matrix.`);
      continue;
    }

    // World-class evaluation says world-class but handoff says not ready
    if (eval_.isWorldClass && handoffCap.status !== "ready") {
      issues.push(
        `${eval_.titleVi}: evaluation nói world-class nhưng handoff nói ${handoffCap.status}. Cần xác minh.`,
      );
    }

    // Handoff says ready but evaluation says foundational
    if (handoffCap.status === "ready" && eval_.overallTier === "foundational") {
      issues.push(
        `${eval_.titleVi}: handoff nói ready nhưng evaluation nói foundational. Có thể evaluation quá khắt khe.`,
      );
    }
  }

  return { coherent: issues.length === 0, issues };
}

/**
 * Compute evaluation determinism — run evaluation and verify it produces
 * the same result every time.
 */
export function verifyEvaluationDeterminism(
  input: WorldClassEvaluationInput,
  runs?: number,
): { deterministic: boolean; totalRuns: number; identicalRuns: number } {
  const count = runs ?? 10;
  const results: string[] = [];

  for (let i = 0; i < count; i++) {
    const eval_ = evaluateWorldClassReadiness(input);
    results.push(JSON.stringify(eval_.scorecard));
  }

  const unique = new Set(results);
  return {
    deterministic: unique.size === 1,
    totalRuns: count,
    identicalRuns: unique.size === 1 ? count : count - unique.size + 1,
  };
}
