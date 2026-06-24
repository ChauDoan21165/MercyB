// Punjabi B2 CI-readiness samples for stable upper-intermediate reasoning tests.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2MrReadinessEvidence,
  type PunjabiB2MrReadinessEvidenceFocus,
  type PunjabiB2MrReadinessEvidenceItem,
  type PunjabiB2MrReadinessEvidenceTopic,
} from "./b2MrReadinessEvidence";

export type PunjabiB2CiReadinessSamplesFocus = PunjabiB2MrReadinessEvidenceFocus;
export type PunjabiB2CiReadinessSamplesTopic = PunjabiB2MrReadinessEvidenceTopic;

export type PunjabiB2CiReadinessSample = {
  id: string;
  level: "B2";
  ciReadinessFocus: PunjabiB2CiReadinessSamplesFocus;
  topic: PunjabiB2CiReadinessSamplesTopic;
  ciReadinessPrompt_gurmukhi: string;
  ciReadinessPrompt_romanization: string;
  ciReadinessPrompt_vi: string;
  ciReadinessPrompt_en: string;
  testStableAnswer_gurmukhi: string;
  testStableAnswer_romanization: string;
  testStableAnswer_vi: string;
  testStableAnswer_en: string;
  ciReadinessChecks_vi: string[];
  ciReadinessChecks_en: string[];
  mrReadinessEvidence_vi: string[];
  mrReadinessEvidence_en: string[];
  finalFreezeEvidence_vi: string[];
  finalFreezeEvidence_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const ciReadinessByFocus: Record<
  PunjabiB2CiReadinessSamplesFocus,
  {
    ciVi: string[];
    ciEn: string[];
    mrVi: string[];
    mrEn: string[];
    freezeVi: string[];
    freezeEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    ciVi: ["Test giữ stance", "Test giữ evidence", "Test giữ next step"],
    ciEn: ["Test keeps the stance", "Test keeps evidence", "Test keeps the next step"],
    mrVi: ["MR evidence có claim", "MR evidence có public-service reason", "MR evidence có action"],
    mrEn: ["MR evidence has a claim", "MR evidence has a public-service reason", "MR evidence has an action"],
    freezeVi: ["Final-freeze không đổi conclusion", "Final-freeze không thêm claim", "Final-freeze giữ plain language"],
    freezeEn: ["Final freeze does not change the conclusion", "Final freeze adds no new claim", "Final freeze keeps plain language"],
    preVi: ["Không bỏ deadline", "Không bỏ documents", "Không bỏ contact step"],
    preEn: ["Do not drop the deadline", "Do not drop documents", "Do not drop the contact step"],
  },
  comparison: {
    ciVi: ["Test giữ hai option", "Test giữ tradeoff", "Test giữ condition"],
    ciEn: ["Test keeps two options", "Test keeps the tradeoff", "Test keeps the condition"],
    mrVi: ["MR evidence có rent", "MR evidence có commute", "MR evidence có utilities"],
    mrEn: ["MR evidence has rent", "MR evidence has commute", "MR evidence has utilities"],
    freezeVi: ["Final-freeze không biến thành preference", "Final-freeze giữ cost", "Final-freeze giữ transit reliability"],
    freezeEn: ["Final freeze does not become preference", "Final freeze keeps cost", "Final freeze keeps transit reliability"],
    preVi: ["Không bỏ option B", "Không bỏ budget", "Không đổi advice thành absolute"],
    preEn: ["Do not drop option B", "Do not drop the budget", "Do not make the advice absolute"],
  },
  counterpoint: {
    ciVi: ["Test giữ acknowledgement", "Test giữ exception", "Test giữ soft tone"],
    ciEn: ["Test keeps acknowledgment", "Test keeps the exception", "Test keeps soft tone"],
    mrVi: ["MR evidence có queue rule", "MR evidence có urgent symptom", "MR evidence có safety reason"],
    mrEn: ["MR evidence has the queue rule", "MR evidence has urgent symptoms", "MR evidence has a safety reason"],
    freezeVi: ["Final-freeze không dùng always/never", "Final-freeze không blame", "Final-freeze giữ giới hạn exception"],
    freezeEn: ["Final freeze uses no always/never", "Final freeze has no blame", "Final freeze keeps the exception limit"],
    preVi: ["Không phản bác gắt", "Không bỏ acknowledgement", "Không biến exception thành preference"],
    preEn: ["Do not rebut harshly", "Do not drop acknowledgment", "Do not turn the exception into preference"],
  },
  recommendation: {
    ciVi: ["Test giữ advice", "Test giữ risk", "Test giữ first step"],
    ciEn: ["Test keeps advice", "Test keeps risk", "Test keeps the first step"],
    mrVi: ["MR evidence có fees", "MR evidence có schedule", "MR evidence có support check"],
    mrEn: ["MR evidence has fees", "MR evidence has schedule", "MR evidence has a support check"],
    freezeVi: ["Final-freeze không overpromise", "Final-freeze giữ condition", "Final-freeze giữ advisor appointment"],
    freezeEn: ["Final freeze does not overpromise", "Final freeze keeps the condition", "Final freeze keeps the advisor appointment"],
    preVi: ["Không bỏ budget", "Không bỏ constraint", "Không đổi first check"],
    preEn: ["Do not drop the budget", "Do not drop the constraint", "Do not change the first check"],
  },
  workplace_fairness: {
    ciVi: ["Test giữ process", "Test giữ workload evidence", "Test giữ review method"],
    ciEn: ["Test keeps process", "Test keeps workload evidence", "Test keeps the review method"],
    mrVi: ["MR evidence có task board", "MR evidence có deadlines", "MR evidence có manager meeting"],
    mrEn: ["MR evidence has a task board", "MR evidence has deadlines", "MR evidence has a manager meeting"],
    freezeVi: ["Final-freeze không blame", "Final-freeze giữ professional tone", "Final-freeze giữ fair adjustment"],
    freezeEn: ["Final freeze has no blame", "Final freeze keeps professional tone", "Final freeze keeps fair adjustment"],
    preVi: ["Không bỏ meeting purpose", "Không cá nhân hóa", "Không bỏ evidence"],
    preEn: ["Do not drop the meeting purpose", "Do not personalize", "Do not drop evidence"],
  },
};

const testStableAnswerByFocus: Record<
  PunjabiB2CiReadinessSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "CI-readiness sample pass ਕਰਦਾ ਹੈ ਜਦੋਂ opinion ਵਿੱਚ public-service stance, evidence ਅਤੇ next step test ਤੋਂ ਬਾਅਦ ਵੀ ਇੱਕੋ ਰਹਿੰਦੇ ਹਨ।",
    r: "CI-readiness sample pass kardaa hai jadon opinion vich public-service stance, evidence ate next step test ton baad vii ikko rahinde han.",
    vi: "Sample CI-readiness đạt khi opinion giữ nguyên stance dịch vụ công, evidence và next step sau khi chạy test.",
    en: "A CI-readiness sample passes when the opinion keeps the same public-service stance, evidence, and next step after the test.",
  },
  comparison: {
    g: "CI-readiness sample pass ਕਰਦਾ ਹੈ ਜਦੋਂ comparison rent, commute, utilities ਅਤੇ transit reliability ਨੂੰ ਇਕੱਠੇ test ਕਰਦਾ ਹੈ।",
    r: "CI-readiness sample pass kardaa hai jadon comparison rent, commute, utilities ate transit reliability nu ikatthe test kardaa hai.",
    vi: "Sample CI-readiness đạt khi comparison kiểm tra rent, commute, utilities và độ tin cậy transit cùng nhau.",
    en: "A CI-readiness sample passes when the comparison tests rent, commute, utilities, and transit reliability together.",
  },
  counterpoint: {
    g: "CI-readiness sample pass ਕਰਦਾ ਹੈ ਜਦੋਂ answer queue rule ਨੂੰ ਮੰਨ ਕੇ urgent symptom ਲਈ limited exception ਸਿਰਫ਼ safety reason ਨਾਲ ਦਿੰਦਾ ਹੈ।",
    r: "CI-readiness sample pass kardaa hai jadon answer queue rule nu mann ke urgent symptom lai limited exception sirf safety reason naal dindaa hai.",
    vi: "Sample CI-readiness đạt khi câu trả lời công nhận queue rule rồi nêu ngoại lệ giới hạn cho triệu chứng khẩn chỉ vì lý do an toàn.",
    en: "A CI-readiness sample passes when the answer accepts the queue rule and gives a limited exception for urgent symptoms only for a safety reason.",
  },
  recommendation: {
    g: "CI-readiness sample pass ਕਰਦਾ ਹੈ ਜਦੋਂ recommendation fees, schedule ਅਤੇ support verify ਕਰਕੇ part-time program ਨੂੰ conditional advice ਬਣਾਉਂਦੀ ਹੈ।",
    r: "CI-readiness sample pass kardaa hai jadon recommendation fees, schedule ate support verify karke part-time program nu conditional advice banaaundii hai.",
    vi: "Sample CI-readiness đạt khi recommendation xác minh fees, schedule và support rồi biến chương trình bán thời gian thành advice có điều kiện.",
    en: "A CI-readiness sample passes when the recommendation verifies fees, schedule, and support, then makes the part-time program conditional advice.",
  },
  workplace_fairness: {
    g: "CI-readiness sample pass ਕਰਦਾ ਹੈ ਜਦੋਂ workplace answer task board evidence, deadlines ਅਤੇ review meeting ਨਾਲ fair adjustment ਮੰਗਦਾ ਹੈ।",
    r: "CI-readiness sample pass kardaa hai jadon workplace answer task board evidence, deadlines ate review meeting naal fair adjustment mangdaa hai.",
    vi: "Sample CI-readiness đạt khi workplace answer dùng task board evidence, deadlines và review meeting để yêu cầu điều chỉnh công bằng.",
    en: "A CI-readiness sample passes when the workplace answer uses task-board evidence, deadlines, and a review meeting to request a fair adjustment.",
  },
};

export const punjabiB2CiReadinessSamples: PunjabiB2CiReadinessSample[] =
  punjabiB2MrReadinessEvidence.map((item: PunjabiB2MrReadinessEvidenceItem) => {
    const ci = ciReadinessByFocus[item.mrReadinessFocus];
    const answer = testStableAnswerByFocus[item.mrReadinessFocus];

    return {
      id: item.id.replace("mr_readiness", "ci_readiness"),
      level: "B2",
      ciReadinessFocus: item.mrReadinessFocus,
      topic: item.topic,
      ciReadinessPrompt_gurmukhi: `${item.mrReadinessPrompt_gurmukhi} CI-readiness ਲਈ test-stable answer ਦਿਓ।`,
      ciReadinessPrompt_romanization: `${item.mrReadinessPrompt_romanization} CI-readiness lai test-stable answer dio.`,
      ciReadinessPrompt_vi: `${item.mrReadinessPrompt_vi} Hãy nêu câu trả lời test-stable cho CI-readiness.`,
      ciReadinessPrompt_en: `${item.mrReadinessPrompt_en} Give a test-stable answer for CI readiness.`,
      testStableAnswer_gurmukhi: answer.g,
      testStableAnswer_romanization: answer.r,
      testStableAnswer_vi: answer.vi,
      testStableAnswer_en: answer.en,
      ciReadinessChecks_vi: ci.ciVi,
      ciReadinessChecks_en: ci.ciEn,
      mrReadinessEvidence_vi: ci.mrVi,
      mrReadinessEvidence_en: ci.mrEn,
      finalFreezeEvidence_vi: ci.freezeVi,
      finalFreezeEvidence_en: ci.freezeEn,
      preIntegration_vi: ci.preVi,
      preIntegration_en: ci.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} CI-readiness trap: không để test chỉ đếm từ khóa; phải kiểm tra reasoning có ổn định không.`,
      learnerTrap_en: `${item.learnerTrap_en} CI-readiness trap: do not let tests only count keywords; check whether reasoning stays stable.`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2CiReadinessSamples;
