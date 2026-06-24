// Punjabi B2 MR-readiness evidence for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2FinalFreezeSamples,
  type PunjabiB2FinalFreezeSample,
  type PunjabiB2FinalFreezeSamplesFocus,
  type PunjabiB2FinalFreezeSamplesTopic,
} from "./b2FinalFreezeSamples";

export type PunjabiB2MrReadinessEvidenceFocus = PunjabiB2FinalFreezeSamplesFocus;
export type PunjabiB2MrReadinessEvidenceTopic = PunjabiB2FinalFreezeSamplesTopic;

export type PunjabiB2MrReadinessEvidenceItem = {
  id: string;
  level: "B2";
  mrReadinessFocus: PunjabiB2MrReadinessEvidenceFocus;
  topic: PunjabiB2MrReadinessEvidenceTopic;
  mrReadinessPrompt_gurmukhi: string;
  mrReadinessPrompt_romanization: string;
  mrReadinessPrompt_vi: string;
  mrReadinessPrompt_en: string;
  evidenceAnswer_gurmukhi: string;
  evidenceAnswer_romanization: string;
  evidenceAnswer_vi: string;
  evidenceAnswer_en: string;
  mrReadinessEvidence_vi: string[];
  mrReadinessEvidence_en: string[];
  finalFreezeEvidence_vi: string[];
  finalFreezeEvidence_en: string[];
  finalLockEvidence_vi: string[];
  finalLockEvidence_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const mrReadinessByFocus: Record<
  PunjabiB2MrReadinessEvidenceFocus,
  {
    mrVi: string[];
    mrEn: string[];
    freezeVi: string[];
    freezeEn: string[];
    lockVi: string[];
    lockEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    mrVi: ["MR-ready: stance ổn định", "MR-ready: evidence rõ nguồn", "MR-ready: action không đổi"],
    mrEn: ["MR-ready: stable stance", "MR-ready: evidence source is clear", "MR-ready: action does not change"],
    freezeVi: ["Final-freeze giữ claim", "Final-freeze giữ reason", "Final-freeze giữ closing action"],
    freezeEn: ["Final freeze keeps the claim", "Final freeze keeps the reason", "Final freeze keeps the closing action"],
    lockVi: ["Final-lock có public-service context", "Final-lock có deadline/documents", "Final-lock có contact step"],
    lockEn: ["Final lock has public-service context", "Final lock has deadline/documents", "Final lock has a contact step"],
    preVi: ["Không đổi stance khi review", "Không thêm claim mới", "Không bỏ next step"],
    preEn: ["Do not change stance during review", "Do not add a new claim", "Do not drop the next step"],
  },
  comparison: {
    mrVi: ["MR-ready: hai option cân bằng", "MR-ready: tradeoff có cost", "MR-ready: condition quyết định rõ"],
    mrEn: ["MR-ready: two balanced options", "MR-ready: tradeoff has cost", "MR-ready: deciding condition is clear"],
    freezeVi: ["Final-freeze giữ option A", "Final-freeze giữ option B", "Final-freeze giữ budget/commute"],
    freezeEn: ["Final freeze keeps option A", "Final freeze keeps option B", "Final freeze keeps budget/commute"],
    lockVi: ["Final-lock có rent", "Final-lock có utilities", "Final-lock có transit reliability"],
    lockEn: ["Final lock has rent", "Final lock has utilities", "Final lock has transit reliability"],
    preVi: ["Không làm một chiều", "Không bỏ cost", "Không đổi condition"],
    preEn: ["Do not make it one-sided", "Do not drop cost", "Do not change the condition"],
  },
  counterpoint: {
    mrVi: ["MR-ready: acknowledgement trước", "MR-ready: exception có evidence", "MR-ready: tone lịch sự"],
    mrEn: ["MR-ready: acknowledgment first", "MR-ready: exception has evidence", "MR-ready: polite tone"],
    freezeVi: ["Final-freeze giữ queue rule", "Final-freeze giữ urgent context", "Final-freeze giữ safety reason"],
    freezeEn: ["Final freeze keeps the queue rule", "Final freeze keeps urgent context", "Final freeze keeps the safety reason"],
    lockVi: ["Final-lock có limited exception", "Final-lock có no-blame wording", "Final-lock có soft closing"],
    lockEn: ["Final lock has a limited exception", "Final lock has no-blame wording", "Final lock has a soft closing"],
    preVi: ["Không dùng always/never", "Không biến exception thành preference", "Không phản bác gắt"],
    preEn: ["Do not use always/never", "Do not turn the exception into preference", "Do not rebut harshly"],
  },
  recommendation: {
    mrVi: ["MR-ready: advice có điều kiện", "MR-ready: risk rõ", "MR-ready: first step làm được"],
    mrEn: ["MR-ready: conditional advice", "MR-ready: risk is clear", "MR-ready: first step is doable"],
    freezeVi: ["Final-freeze giữ fees", "Final-freeze giữ schedule", "Final-freeze giữ advisor step"],
    freezeEn: ["Final freeze keeps fees", "Final freeze keeps schedule", "Final freeze keeps the advisor step"],
    lockVi: ["Final-lock có support check", "Final-lock có budget constraint", "Final-lock không overpromise"],
    lockEn: ["Final lock has a support check", "Final lock has a budget constraint", "Final lock does not overpromise"],
    preVi: ["Không bỏ constraint", "Không đổi advice thành absolute", "Không bỏ first check"],
    preEn: ["Do not drop the constraint", "Do not make the advice absolute", "Do not drop the first check"],
  },
  workplace_fairness: {
    mrVi: ["MR-ready: process rõ", "MR-ready: evidence từ task board", "MR-ready: review method cụ thể"],
    mrEn: ["MR-ready: clear process", "MR-ready: task-board evidence", "MR-ready: specific review method"],
    freezeVi: ["Final-freeze giữ workload evidence", "Final-freeze giữ manager meeting", "Final-freeze giữ fair adjustment"],
    freezeEn: ["Final freeze keeps workload evidence", "Final freeze keeps the manager meeting", "Final freeze keeps fair adjustment"],
    lockVi: ["Final-lock có deadline", "Final-lock không blame", "Final-lock có professional tone"],
    lockEn: ["Final lock has deadlines", "Final lock has no blame", "Final lock has professional tone"],
    preVi: ["Không blame cá nhân", "Không bỏ process", "Không bỏ meeting purpose"],
    preEn: ["Do not blame a person", "Do not drop the process", "Do not drop the meeting purpose"],
  },
};

const evidenceAnswerByFocus: Record<
  PunjabiB2MrReadinessEvidenceFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "MR-readiness evidence ਇਹ ਹੈ ਕਿ public-service answer ਵਿੱਚ stance, reason ਅਤੇ next step ਇੱਕੋ ਰਹਿੰਦੇ ਹਨ; deadline ਅਤੇ documents ਸਾਫ਼ ਹੋਣ ਕਰਕੇ learner action ਲੈ ਸਕਦਾ ਹੈ।",
    r: "MR-readiness evidence eh hai ki public-service answer vich stance, reason ate next step ikko rahinde han; deadline ate documents saaf hon karke learner action lai sakdaa hai.",
    vi: "Evidence cho MR-readiness là câu trả lời dịch vụ công giữ cùng stance, reason và next step; deadline và giấy tờ rõ nên người học có thể hành động.",
    en: "The MR-readiness evidence is that the public-service answer keeps the same stance, reason, and next step; because deadlines and documents are clear, the learner can act.",
  },
  comparison: {
    g: "MR-readiness evidence comparison ਵਿੱਚ ਹੈ: rent, utilities, commute ਅਤੇ transit reliability ਇਕੱਠੇ ਰਹਿੰਦੇ ਹਨ, ਇਸ ਲਈ tradeoff practical ਹੈ, ਸਿਰਫ਼ preference ਨਹੀਂ।",
    r: "MR-readiness evidence comparison vich hai: rent, utilities, commute ate transit reliability ikatthe rahinde han, is lai tradeoff practical hai, sirf preference nahi.",
    vi: "Evidence MR-readiness nằm trong comparison: rent, utilities, commute và độ tin cậy transit đi cùng nhau, nên tradeoff thực tế chứ không chỉ là preference.",
    en: "The MR-readiness evidence is in the comparison: rent, utilities, commute, and transit reliability stay together, so the tradeoff is practical, not just preference.",
  },
  counterpoint: {
    g: "MR-readiness evidence ਇਹ ਹੈ ਕਿ answer ਪਹਿਲਾਂ queue rule ਨੂੰ ਮੰਨਦਾ ਹੈ, ਫਿਰ urgent symptom ਲਈ limited exception ਦਿੰਦਾ ਹੈ; tone respectful ਰਹਿੰਦੀ ਹੈ।",
    r: "MR-readiness evidence eh hai ki answer pahilaan queue rule nu manndaa hai, fir urgent symptom lai limited exception dindaa hai; tone respectful rahindii hai.",
    vi: "Evidence MR-readiness là câu trả lời công nhận quy tắc xếp hàng trước, rồi nêu ngoại lệ giới hạn cho triệu chứng khẩn; tone vẫn tôn trọng.",
    en: "The MR-readiness evidence is that the answer first accepts the queue rule, then gives a limited exception for urgent symptoms; the tone stays respectful.",
  },
  recommendation: {
    g: "MR-readiness evidence recommendation ਵਿੱਚ ਹੈ: part-time program ਸਿਰਫ਼ ਤਦੋਂ recommend ਹੁੰਦਾ ਹੈ ਜਦੋਂ fees, schedule ਅਤੇ advising support verify ਹੋਣ; first step appointment ਹੈ।",
    r: "MR-readiness evidence recommendation vich hai: part-time program sirf tadon recommend hunda hai jadon fees, schedule ate advising support verify hon; first step appointment hai.",
    vi: "Evidence MR-readiness trong recommendation là chỉ đề xuất chương trình bán thời gian khi fees, schedule và advising support đã được verify; first step là đặt hẹn.",
    en: "The MR-readiness evidence in the recommendation is that a part-time program is recommended only when fees, schedule, and advising support are verified; the first step is an appointment.",
  },
  workplace_fairness: {
    g: "MR-readiness evidence workplace answer ਵਿੱਚ ਹੈ: task board, deadlines ਅਤੇ review meeting ਇਕੱਠੇ ਰਹਿੰਦੇ ਹਨ, ਇਸ ਲਈ request fair adjustment ਲਈ ਹੈ, blame ਲਈ ਨਹੀਂ।",
    r: "MR-readiness evidence workplace answer vich hai: task board, deadlines ate review meeting ikatthe rahinde han, is lai request fair adjustment lai hai, blame lai nahi.",
    vi: "Evidence MR-readiness trong câu workplace là task board, deadlines và review meeting đi cùng nhau, nên request nhằm điều chỉnh công bằng, không blame.",
    en: "The MR-readiness evidence in the workplace answer is that the task board, deadlines, and review meeting stay together, so the request is for fair adjustment, not blame.",
  },
};

export const punjabiB2MrReadinessEvidence: PunjabiB2MrReadinessEvidenceItem[] =
  punjabiB2FinalFreezeSamples.map((item: PunjabiB2FinalFreezeSample) => {
    const evidence = mrReadinessByFocus[item.finalFreezeFocus];
    const answer = evidenceAnswerByFocus[item.finalFreezeFocus];

    return {
      id: item.id.replace("final_freeze", "mr_readiness"),
      level: "B2",
      mrReadinessFocus: item.finalFreezeFocus,
      topic: item.topic,
      mrReadinessPrompt_gurmukhi: `${item.finalFreezePrompt_gurmukhi} MR-readiness ਲਈ evidence ਦਿਓ।`,
      mrReadinessPrompt_romanization: `${item.finalFreezePrompt_romanization} MR-readiness lai evidence dio.`,
      mrReadinessPrompt_vi: `${item.finalFreezePrompt_vi} Hãy nêu evidence cho MR-readiness.`,
      mrReadinessPrompt_en: `${item.finalFreezePrompt_en} Give evidence for MR readiness.`,
      evidenceAnswer_gurmukhi: answer.g,
      evidenceAnswer_romanization: answer.r,
      evidenceAnswer_vi: answer.vi,
      evidenceAnswer_en: answer.en,
      mrReadinessEvidence_vi: evidence.mrVi,
      mrReadinessEvidence_en: evidence.mrEn,
      finalFreezeEvidence_vi: evidence.freezeVi,
      finalFreezeEvidence_en: evidence.freezeEn,
      finalLockEvidence_vi: evidence.lockVi,
      finalLockEvidence_en: evidence.lockEn,
      preIntegration_vi: evidence.preVi,
      preIntegration_en: evidence.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} MR-readiness trap: không dùng evidence chung chung; phải chỉ rõ stance, tradeoff, counterpoint hoặc step đã ổn định.`,
      learnerTrap_en: `${item.learnerTrap_en} MR-readiness trap: do not use generic evidence; name which stance, tradeoff, counterpoint, or step is stable.`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2MrReadinessEvidence;
