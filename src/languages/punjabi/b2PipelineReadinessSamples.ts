// Punjabi B2 pipeline-readiness samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2CiReadinessSamples,
  type PunjabiB2CiReadinessSample,
  type PunjabiB2CiReadinessSamplesFocus,
  type PunjabiB2CiReadinessSamplesTopic,
} from "./b2CiReadinessSamples";

export type PunjabiB2PipelineReadinessSamplesFocus = PunjabiB2CiReadinessSamplesFocus;
export type PunjabiB2PipelineReadinessSamplesTopic = PunjabiB2CiReadinessSamplesTopic;

export type PunjabiB2PipelineReadinessSample = {
  id: string;
  level: "B2";
  pipelineReadinessFocus: PunjabiB2PipelineReadinessSamplesFocus;
  topic: PunjabiB2PipelineReadinessSamplesTopic;
  pipelinePrompt_gurmukhi: string;
  pipelinePrompt_romanization: string;
  pipelinePrompt_vi: string;
  pipelinePrompt_en: string;
  pipelineStableAnswer_gurmukhi: string;
  pipelineStableAnswer_romanization: string;
  pipelineStableAnswer_vi: string;
  pipelineStableAnswer_en: string;
  pipelineReadinessChecks_vi: string[];
  pipelineReadinessChecks_en: string[];
  ciReadinessChecks_vi: string[];
  ciReadinessChecks_en: string[];
  mrReadinessEvidence_vi: string[];
  mrReadinessEvidence_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const pipelineReadinessByFocus: Record<
  PunjabiB2PipelineReadinessSamplesFocus,
  {
    pipelineVi: string[];
    pipelineEn: string[];
    ciVi: string[];
    ciEn: string[];
    mrVi: string[];
    mrEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    pipelineVi: ["Pipeline giữ stance", "Pipeline giữ evidence", "Pipeline giữ action cuối"],
    pipelineEn: ["Pipeline keeps the stance", "Pipeline keeps evidence", "Pipeline keeps the final action"],
    ciVi: ["CI-readiness pass stance", "CI-readiness pass evidence", "CI-readiness pass next step"],
    ciEn: ["CI readiness passes stance", "CI readiness passes evidence", "CI readiness passes next step"],
    mrVi: ["MR evidence có public-service reason", "MR evidence có deadline", "MR evidence có contact step"],
    mrEn: ["MR evidence has a public-service reason", "MR evidence has a deadline", "MR evidence has a contact step"],
    preVi: ["Không đổi claim", "Không bỏ documents", "Không thêm topic mới"],
    preEn: ["Do not change the claim", "Do not drop documents", "Do not add a new topic"],
  },
  comparison: {
    pipelineVi: ["Pipeline giữ hai option", "Pipeline giữ tradeoff", "Pipeline giữ condition"],
    pipelineEn: ["Pipeline keeps two options", "Pipeline keeps the tradeoff", "Pipeline keeps the condition"],
    ciVi: ["CI-readiness pass rent", "CI-readiness pass commute", "CI-readiness pass cost"],
    ciEn: ["CI readiness passes rent", "CI readiness passes commute", "CI readiness passes cost"],
    mrVi: ["MR evidence có utilities", "MR evidence có transit reliability", "MR evidence có budget"],
    mrEn: ["MR evidence has utilities", "MR evidence has transit reliability", "MR evidence has budget"],
    preVi: ["Không một chiều", "Không bỏ option B", "Không đổi condition"],
    preEn: ["Do not make it one-sided", "Do not drop option B", "Do not change the condition"],
  },
  counterpoint: {
    pipelineVi: ["Pipeline giữ acknowledgement", "Pipeline giữ limited exception", "Pipeline giữ safety reason"],
    pipelineEn: ["Pipeline keeps acknowledgment", "Pipeline keeps the limited exception", "Pipeline keeps the safety reason"],
    ciVi: ["CI-readiness pass queue rule", "CI-readiness pass urgent symptom", "CI-readiness pass respectful tone"],
    ciEn: ["CI readiness passes the queue rule", "CI readiness passes urgent symptoms", "CI readiness passes respectful tone"],
    mrVi: ["MR evidence có no-blame wording", "MR evidence có soft closing", "MR evidence có exception limit"],
    mrEn: ["MR evidence has no-blame wording", "MR evidence has a soft closing", "MR evidence has an exception limit"],
    preVi: ["Không dùng always/never", "Không phản bác gắt", "Không biến exception thành rule"],
    preEn: ["Do not use always/never", "Do not rebut harshly", "Do not turn the exception into a rule"],
  },
  recommendation: {
    pipelineVi: ["Pipeline giữ advice", "Pipeline giữ risk", "Pipeline giữ first check"],
    pipelineEn: ["Pipeline keeps advice", "Pipeline keeps risk", "Pipeline keeps the first check"],
    ciVi: ["CI-readiness pass fees", "CI-readiness pass schedule", "CI-readiness pass support"],
    ciEn: ["CI readiness passes fees", "CI readiness passes schedule", "CI readiness passes support"],
    mrVi: ["MR evidence có condition", "MR evidence có advisor step", "MR evidence không overpromise"],
    mrEn: ["MR evidence has a condition", "MR evidence has an advisor step", "MR evidence does not overpromise"],
    preVi: ["Không bỏ budget", "Không đổi advice thành absolute", "Không bỏ appointment step"],
    preEn: ["Do not drop the budget", "Do not make advice absolute", "Do not drop the appointment step"],
  },
  workplace_fairness: {
    pipelineVi: ["Pipeline giữ process", "Pipeline giữ task-board evidence", "Pipeline giữ review method"],
    pipelineEn: ["Pipeline keeps process", "Pipeline keeps task-board evidence", "Pipeline keeps the review method"],
    ciVi: ["CI-readiness pass deadlines", "CI-readiness pass workload", "CI-readiness pass professional tone"],
    ciEn: ["CI readiness passes deadlines", "CI readiness passes workload", "CI readiness passes professional tone"],
    mrVi: ["MR evidence có manager meeting", "MR evidence có fair adjustment", "MR evidence không blame"],
    mrEn: ["MR evidence has a manager meeting", "MR evidence has fair adjustment", "MR evidence has no blame"],
    preVi: ["Không cá nhân hóa", "Không bỏ meeting purpose", "Không bỏ evidence"],
    preEn: ["Do not personalize", "Do not drop the meeting purpose", "Do not drop evidence"],
  },
};

const pipelineAnswerByFocus: Record<
  PunjabiB2PipelineReadinessSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "Pipeline-readiness answer ਤਦੋਂ stable ਹੈ ਜਦੋਂ public-service opinion test, review ਅਤੇ integration ਤੋਂ ਪਹਿਲਾਂ ਵੀ stance, evidence ਅਤੇ next step ਨਹੀਂ ਬਦਲਦਾ।",
    r: "Pipeline-readiness answer tadon stable hai jadon public-service opinion test, review ate integration ton pahilaan vii stance, evidence ate next step nahi badalda.",
    vi: "Câu trả lời pipeline-readiness ổn định khi opinion dịch vụ công vẫn giữ stance, evidence và next step trước test, review và integration.",
    en: "A pipeline-readiness answer is stable when the public-service opinion keeps its stance, evidence, and next step before testing, review, and integration.",
  },
  comparison: {
    g: "Pipeline-readiness answer comparison ਨੂੰ stable ਰੱਖਦਾ ਹੈ: rent, commute, utilities ਅਤੇ transit reliability ਇਕੱਠੇ ਰਹਿੰਦੇ ਹਨ, ਇਸ ਕਰਕੇ tradeoff testable ਹੈ।",
    r: "Pipeline-readiness answer comparison nu stable rakhdaa hai: rent, commute, utilities ate transit reliability ikatthe rahinde han, is karke tradeoff testable hai.",
    vi: "Câu trả lời pipeline-readiness giữ comparison ổn định: rent, commute, utilities và transit reliability đi cùng nhau, nên tradeoff có thể test.",
    en: "A pipeline-readiness answer keeps the comparison stable: rent, commute, utilities, and transit reliability stay together, so the tradeoff is testable.",
  },
  counterpoint: {
    g: "Pipeline-readiness answer queue rule ਨੂੰ ਮੰਨਦਾ ਹੈ ਅਤੇ urgent symptom ਲਈ limited exception ਦਿੰਦਾ ਹੈ; safety reason ਰਹਿੰਦਾ ਹੈ, preference ਨਹੀਂ।",
    r: "Pipeline-readiness answer queue rule nu manndaa hai ate urgent symptom lai limited exception dindaa hai; safety reason rahindaa hai, preference nahi.",
    vi: "Câu trả lời pipeline-readiness công nhận queue rule và nêu ngoại lệ giới hạn cho triệu chứng khẩn; lý do vẫn là an toàn, không phải preference.",
    en: "A pipeline-readiness answer accepts the queue rule and gives a limited exception for urgent symptoms; the reason remains safety, not preference.",
  },
  recommendation: {
    g: "Pipeline-readiness answer part-time program ਨੂੰ conditional recommendation ਰੱਖਦਾ ਹੈ: fees, schedule ਅਤੇ support verify ਹੋਣ ਤੋਂ ਬਾਅਦ first appointment ਲਓ।",
    r: "Pipeline-readiness answer part-time program nu conditional recommendation rakhdaa hai: fees, schedule ate support verify hon ton baad first appointment lao.",
    vi: "Câu trả lời pipeline-readiness giữ chương trình bán thời gian là recommendation có điều kiện: sau khi verify fees, schedule và support, đặt first appointment.",
    en: "A pipeline-readiness answer keeps the part-time program as a conditional recommendation: after verifying fees, schedule, and support, book the first appointment.",
  },
  workplace_fairness: {
    g: "Pipeline-readiness answer workplace fairness ਲਈ task board evidence, deadlines ਅਤੇ manager review meeting ਜੋੜਦਾ ਹੈ; request fair adjustment ਲਈ ਹੈ, blame ਲਈ ਨਹੀਂ।",
    r: "Pipeline-readiness answer workplace fairness lai task board evidence, deadlines ate manager review meeting joddyaa hai; request fair adjustment lai hai, blame lai nahi.",
    vi: "Câu trả lời pipeline-readiness cho workplace fairness nối task board evidence, deadlines và manager review meeting; request nhằm fair adjustment, không blame.",
    en: "A pipeline-readiness answer for workplace fairness connects task-board evidence, deadlines, and a manager review meeting; the request is for fair adjustment, not blame.",
  },
};

export const punjabiB2PipelineReadinessSamples: PunjabiB2PipelineReadinessSample[] =
  punjabiB2CiReadinessSamples.map((item: PunjabiB2CiReadinessSample) => {
    const pipeline = pipelineReadinessByFocus[item.ciReadinessFocus];
    const answer = pipelineAnswerByFocus[item.ciReadinessFocus];

    return {
      id: item.id.replace("ci_readiness", "pipeline_readiness"),
      level: "B2",
      pipelineReadinessFocus: item.ciReadinessFocus,
      topic: item.topic,
      pipelinePrompt_gurmukhi: `${item.ciReadinessPrompt_gurmukhi} pipeline-readiness ਲਈ stable chain ਦਿਖਾਓ।`,
      pipelinePrompt_romanization: `${item.ciReadinessPrompt_romanization} pipeline-readiness lai stable chain dikhaao.`,
      pipelinePrompt_vi: `${item.ciReadinessPrompt_vi} Hãy chỉ ra stable chain cho pipeline-readiness.`,
      pipelinePrompt_en: `${item.ciReadinessPrompt_en} Show the stable chain for pipeline readiness.`,
      pipelineStableAnswer_gurmukhi: answer.g,
      pipelineStableAnswer_romanization: answer.r,
      pipelineStableAnswer_vi: answer.vi,
      pipelineStableAnswer_en: answer.en,
      pipelineReadinessChecks_vi: pipeline.pipelineVi,
      pipelineReadinessChecks_en: pipeline.pipelineEn,
      ciReadinessChecks_vi: pipeline.ciVi,
      ciReadinessChecks_en: pipeline.ciEn,
      mrReadinessEvidence_vi: pipeline.mrVi,
      mrReadinessEvidence_en: pipeline.mrEn,
      preIntegration_vi: pipeline.preVi,
      preIntegration_en: pipeline.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} Pipeline-readiness trap: không đổi nội dung khi chuyển từ CI-readiness sang integration-prep.`,
      learnerTrap_en: `${item.learnerTrap_en} Pipeline-readiness trap: do not change content when moving from CI readiness to integration prep.`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2PipelineReadinessSamples;
