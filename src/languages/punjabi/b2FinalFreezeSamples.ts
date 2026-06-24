// Punjabi B2 final-freeze samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2FinalLockSamples,
  type PunjabiB2FinalLockSample,
  type PunjabiB2FinalLockSamplesFocus,
  type PunjabiB2FinalLockSamplesTopic,
} from "./b2FinalLockSamples";

export type PunjabiB2FinalFreezeSamplesFocus = PunjabiB2FinalLockSamplesFocus;
export type PunjabiB2FinalFreezeSamplesTopic = PunjabiB2FinalLockSamplesTopic;

export type PunjabiB2FinalFreezeSample = {
  id: string;
  level: "B2";
  finalFreezeFocus: PunjabiB2FinalFreezeSamplesFocus;
  topic: PunjabiB2FinalFreezeSamplesTopic;
  finalFreezePrompt_gurmukhi: string;
  finalFreezePrompt_romanization: string;
  finalFreezePrompt_vi: string;
  finalFreezePrompt_en: string;
  frozenAnswer_gurmukhi: string;
  frozenAnswer_romanization: string;
  frozenAnswer_vi: string;
  frozenAnswer_en: string;
  finalFreezeCriteria_vi: string[];
  finalFreezeCriteria_en: string[];
  finalLockEvidence_vi: string[];
  finalLockEvidence_en: string[];
  ownerAcceptance_vi: string[];
  ownerAcceptance_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const finalFreezeByFocus: Record<
  PunjabiB2FinalFreezeSamplesFocus,
  {
    freezeVi: string[];
    freezeEn: string[];
    lockVi: string[];
    lockEn: string[];
    ownerVi: string[];
    ownerEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    freezeVi: ["Freeze stance cuối", "Freeze evidence chính", "Freeze action không đổi"],
    freezeEn: ["Freeze the final stance", "Freeze the main evidence", "Freeze the unchanged action"],
    lockVi: ["Final-lock đã có claim", "Final-lock đã có evidence", "Final-lock đã có next step"],
    lockEn: ["Final lock has a claim", "Final lock has evidence", "Final lock has a next step"],
    ownerVi: ["Owner accepts plain-language reason", "Owner accepts public-service use", "Owner accepts stable conclusion"],
    ownerEn: ["Owner accepts the plain-language reason", "Owner accepts public-service use", "Owner accepts a stable conclusion"],
    preVi: ["Không đổi claim", "Không đổi evidence", "Không đổi action"],
    preEn: ["Do not change the claim", "Do not change the evidence", "Do not change the action"],
  },
  comparison: {
    freezeVi: ["Freeze hai option", "Freeze tradeoff", "Freeze condition chọn"],
    freezeEn: ["Freeze two options", "Freeze the tradeoff", "Freeze the choosing condition"],
    lockVi: ["Final-lock giữ commute", "Final-lock giữ utilities", "Final-lock giữ transit reliability"],
    lockEn: ["Final lock keeps commute", "Final lock keeps utilities", "Final lock keeps transit reliability"],
    ownerVi: ["Owner accepts balanced comparison", "Owner accepts cost rõ", "Owner accepts condition thực tế"],
    ownerEn: ["Owner accepts balanced comparison", "Owner accepts clear cost", "Owner accepts a practical condition"],
    preVi: ["Không biến thành preference", "Không bỏ một phía", "Không bỏ cost"],
    preEn: ["Do not turn it into preference", "Do not drop one side", "Do not drop the cost"],
  },
  counterpoint: {
    freezeVi: ["Freeze acknowledgement", "Freeze limited exception", "Freeze safety reason"],
    freezeEn: ["Freeze acknowledgment", "Freeze the limited exception", "Freeze the safety reason"],
    lockVi: ["Final-lock giữ tone mềm", "Final-lock giữ evidence", "Final-lock giữ giới hạn exception"],
    lockEn: ["Final lock keeps soft tone", "Final lock keeps evidence", "Final lock keeps the exception limit"],
    ownerVi: ["Owner accepts respectful disagreement", "Owner accepts urgent-context evidence", "Owner accepts no blame"],
    ownerEn: ["Owner accepts respectful disagreement", "Owner accepts urgent-context evidence", "Owner accepts no blame"],
    preVi: ["Không dùng always/never", "Không phản bác gắt", "Không biến exception thành rule"],
    preEn: ["Do not use always/never", "Do not argue harshly", "Do not turn the exception into a rule"],
  },
  recommendation: {
    freezeVi: ["Freeze advice có điều kiện", "Freeze risk", "Freeze first check"],
    freezeEn: ["Freeze conditional advice", "Freeze the risk", "Freeze the first check"],
    lockVi: ["Final-lock giữ fees", "Final-lock giữ schedule", "Final-lock giữ support check"],
    lockEn: ["Final lock keeps fees", "Final lock keeps schedule", "Final lock keeps the support check"],
    ownerVi: ["Owner accepts realistic recommendation", "Owner accepts constraint", "Owner accepts doable first step"],
    ownerEn: ["Owner accepts realistic recommendation", "Owner accepts the constraint", "Owner accepts a doable first step"],
    preVi: ["Không overpromise", "Không bỏ budget", "Không đổi first step"],
    preEn: ["Do not overpromise", "Do not drop the budget", "Do not change the first step"],
  },
  workplace_fairness: {
    freezeVi: ["Freeze process", "Freeze workload evidence", "Freeze review meeting"],
    freezeEn: ["Freeze the process", "Freeze workload evidence", "Freeze the review meeting"],
    lockVi: ["Final-lock giữ task board", "Final-lock giữ deadline", "Final-lock giữ fair adjustment"],
    lockEn: ["Final lock keeps the task board", "Final lock keeps the deadline", "Final lock keeps fair adjustment"],
    ownerVi: ["Owner accepts professional tone", "Owner accepts evidence-based request", "Owner accepts non-blaming wording"],
    ownerEn: ["Owner accepts professional tone", "Owner accepts an evidence-based request", "Owner accepts non-blaming wording"],
    preVi: ["Không blame cá nhân", "Không bỏ process", "Không bỏ review time"],
    preEn: ["Do not blame a person", "Do not drop the process", "Do not drop the review time"],
  },
};

const frozenAnswerByFocus: Record<
  PunjabiB2FinalFreezeSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਅੰਤਿਮ ਜਵਾਬ freeze ਹੈ: public-service ਚਿੱਠੀ plain language ਵਿੱਚ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ ਕਿਉਂਕਿ deadline, documents ਅਤੇ contact step ਨਾ ਬਦਲਣ ਨਾਲ learner ਅਗਲਾ ਕਦਮ ਸਮਝਦਾ ਹੈ।",
    r: "antim javaab freeze hai: public-service chitthi plain language vich honii chaahiidii hai kiunki deadline, documents ate contact step na badlan naal learner aglaa kadam samajhdaa hai.",
    vi: "Câu trả lời final-freeze: thư dịch vụ công nên dùng plain language vì deadline, giấy tờ và bước liên hệ không đổi giúp người học hiểu bước tiếp theo.",
    en: "The final-freeze answer is that a public-service letter should use plain language because unchanged deadlines, documents, and contact steps help the learner understand the next step.",
  },
  comparison: {
    g: "ਅੰਤਿਮ comparison freeze ਹੈ: ਘੱਟ rent ਤਦੋਂ ਹੀ ਵਧੀਆ ਹੈ ਜਦੋਂ commute, utilities ਅਤੇ transit reliability budget ਨਾਲ ਮਿਲਦੇ ਹਨ; ਨਹੀਂ ਤਾਂ ਦੂਜਾ option ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ।",
    r: "antim comparison freeze hai: ghatt rent tadon hii vadhiyaa hai jadon commute, utilities ate transit reliability budget naal milde han; nahi taan duujaa option vadhiyaa ho sakdaa hai.",
    vi: "Comparison final-freeze: rent thấp chỉ tốt khi commute, utilities và độ tin cậy transit phù hợp với ngân sách; nếu không, option khác có thể tốt hơn.",
    en: "The final-freeze comparison is that lower rent is better only when commute, utilities, and transit reliability fit the budget; otherwise another option may be better.",
  },
  counterpoint: {
    g: "ਅੰਤਿਮ counterpoint freeze ਹੈ: queue rule fair ਰਹਿੰਦਾ ਹੈ, ਪਰ urgent symptom ਲਈ limited exception safety ਕਰਕੇ ਠੀਕ ਹੈ; ਇਹ preference ਨਹੀਂ ਬਣਦਾ।",
    r: "antim counterpoint freeze hai: queue rule fair rahindaa hai, par urgent symptom lai limited exception safety karke thiik hai; eh preference nahi bandaa.",
    vi: "Counterpoint final-freeze: quy tắc xếp hàng vẫn công bằng, nhưng ngoại lệ giới hạn cho triệu chứng khẩn là hợp lý vì an toàn; điều đó không thành thiên vị.",
    en: "The final-freeze counterpoint is that the queue rule remains fair, but a limited exception for urgent symptoms is reasonable for safety; it does not become preference.",
  },
  recommendation: {
    g: "ਅੰਤਿਮ recommendation freeze ਹੈ: part-time program ਉਹਦੋਂ ਠੀਕ ਹੈ ਜਦੋਂ fees, schedule ਅਤੇ support verify ਹੋਣ; ਪਹਿਲਾ ਕਦਮ advisor ਨਾਲ appointment ਲੈਣਾ ਹੈ।",
    r: "antim recommendation freeze hai: part-time program odon thiik hai jadon fees, schedule ate support verify hon; pahilaa kadam advisor naal appointment lainaa hai.",
    vi: "Recommendation final-freeze: chương trình bán thời gian phù hợp khi fees, lịch và hỗ trợ đã được xác minh; bước đầu là đặt hẹn với advisor.",
    en: "The final-freeze recommendation is that a part-time program is suitable when fees, schedule, and support are verified; the first step is booking an advisor appointment.",
  },
  workplace_fairness: {
    g: "ਅੰਤਿਮ workplace answer freeze ਹੈ: task board evidence ਨਾਲ manager review meeting ਮੰਗੋ, deadline ਅਤੇ workload ਬਾਰੇ ਗੱਲ ਕਰੋ, ਅਤੇ fair adjustment ਮੰਗੋ ਬਿਨਾਂ blame ਦੇ।",
    r: "antim workplace answer freeze hai: task board evidence naal manager review meeting mango, deadline ate workload baare gall karo, ate fair adjustment mango binaa blame de.",
    vi: "Workplace answer final-freeze: dùng evidence từ task board để xin review meeting với manager, nói về deadline và workload, rồi yêu cầu điều chỉnh công bằng không blame.",
    en: "The final-freeze workplace answer is to use task-board evidence to request a manager review meeting, discuss deadlines and workload, and ask for a fair adjustment without blame.",
  },
};

export const punjabiB2FinalFreezeSamples: PunjabiB2FinalFreezeSample[] =
  punjabiB2FinalLockSamples.map((item: PunjabiB2FinalLockSample) => {
    const freeze = finalFreezeByFocus[item.finalLockFocus];
    const answer = frozenAnswerByFocus[item.finalLockFocus];

    return {
      id: item.id.replace("final_lock", "final_freeze"),
      level: "B2",
      finalFreezeFocus: item.finalLockFocus,
      topic: item.topic,
      finalFreezePrompt_gurmukhi: `${item.finalLockPrompt_gurmukhi} final-freeze ਤੋਂ ਪਹਿਲਾਂ stability ਸਾਬਤ ਕਰੋ।`,
      finalFreezePrompt_romanization: `${item.finalLockPrompt_romanization} final-freeze ton pahilaan stability saabat karo.`,
      finalFreezePrompt_vi: `${item.finalLockPrompt_vi} Hãy chứng minh stability trước final-freeze.`,
      finalFreezePrompt_en: `${item.finalLockPrompt_en} Prove stability before final freeze.`,
      frozenAnswer_gurmukhi: answer.g,
      frozenAnswer_romanization: answer.r,
      frozenAnswer_vi: answer.vi,
      frozenAnswer_en: answer.en,
      finalFreezeCriteria_vi: freeze.freezeVi,
      finalFreezeCriteria_en: freeze.freezeEn,
      finalLockEvidence_vi: freeze.lockVi,
      finalLockEvidence_en: freeze.lockEn,
      ownerAcceptance_vi: freeze.ownerVi,
      ownerAcceptance_en: freeze.ownerEn,
      preIntegration_vi: freeze.preVi,
      preIntegration_en: freeze.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} Final-freeze trap: không chỉnh wording đến mức đổi stance, evidence hoặc action.`,
      learnerTrap_en: `${item.learnerTrap_en} Final-freeze trap: do not revise wording so much that stance, evidence, or action changes.`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2FinalFreezeSamples;
