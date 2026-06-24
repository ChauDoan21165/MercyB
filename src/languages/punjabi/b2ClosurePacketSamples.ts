// Punjabi B2 closure-packet samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2PreMergeSamples,
  type PunjabiB2PreMergeSample,
  type PunjabiB2PreMergeSamplesFocus,
  type PunjabiB2PreMergeSamplesTopic,
} from "./b2PreMergeSamples";

export type PunjabiB2ClosurePacketSamplesFocus = PunjabiB2PreMergeSamplesFocus;
export type PunjabiB2ClosurePacketSamplesTopic = PunjabiB2PreMergeSamplesTopic;

export type PunjabiB2ClosurePacketSample = {
  id: string;
  level: "B2";
  closurePacketFocus: PunjabiB2ClosurePacketSamplesFocus;
  topic: PunjabiB2ClosurePacketSamplesTopic;
  closurePrompt_gurmukhi: string;
  closurePrompt_romanization: string;
  closurePrompt_vi: string;
  closurePrompt_en: string;
  closureAnswer_gurmukhi: string;
  closureAnswer_romanization: string;
  closureAnswer_vi: string;
  closureAnswer_en: string;
  preA11Closure_vi: string[];
  preA11Closure_en: string[];
  preMergeChecks_vi: string[];
  preMergeChecks_en: string[];
  ciReadinessChecks_vi: string[];
  ciReadinessChecks_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const closureByFocus: Record<
  PunjabiB2ClosurePacketSamplesFocus,
  {
    closureVi: string[];
    closureEn: string[];
    mergeVi: string[];
    mergeEn: string[];
    ciVi: string[];
    ciEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    closureVi: ["Closure giữ stance", "Closure giữ evidence", "Closure giữ next step"],
    closureEn: ["Closure keeps the stance", "Closure keeps evidence", "Closure keeps the next step"],
    mergeVi: ["Pre-merge pass claim", "Pre-merge pass reason", "Pre-merge pass action"],
    mergeEn: ["Pre-merge passes the claim", "Pre-merge passes the reason", "Pre-merge passes the action"],
    ciVi: ["CI-ready public-service context", "CI-ready deadline/documents", "CI-ready contact step"],
    ciEn: ["CI-ready public-service context", "CI-ready deadline/documents", "CI-ready contact step"],
    preVi: ["Không đổi opinion", "Không bỏ evidence", "Không thêm claim mới"],
    preEn: ["Do not change the opinion", "Do not drop evidence", "Do not add a new claim"],
  },
  comparison: {
    closureVi: ["Closure giữ hai option", "Closure giữ tradeoff", "Closure giữ condition"],
    closureEn: ["Closure keeps two options", "Closure keeps the tradeoff", "Closure keeps the condition"],
    mergeVi: ["Pre-merge pass rent", "Pre-merge pass commute", "Pre-merge pass utilities"],
    mergeEn: ["Pre-merge passes rent", "Pre-merge passes commute", "Pre-merge passes utilities"],
    ciVi: ["CI-ready transit reliability", "CI-ready budget", "CI-ready cost"],
    ciEn: ["CI-ready transit reliability", "CI-ready budget", "CI-ready cost"],
    preVi: ["Không một chiều", "Không bỏ option B", "Không đổi condition"],
    preEn: ["Do not make it one-sided", "Do not drop option B", "Do not change the condition"],
  },
  counterpoint: {
    closureVi: ["Closure giữ acknowledgement", "Closure giữ exception", "Closure giữ safety reason"],
    closureEn: ["Closure keeps acknowledgment", "Closure keeps the exception", "Closure keeps the safety reason"],
    mergeVi: ["Pre-merge pass queue rule", "Pre-merge pass urgent symptom", "Pre-merge pass respectful tone"],
    mergeEn: ["Pre-merge passes the queue rule", "Pre-merge passes urgent symptoms", "Pre-merge passes respectful tone"],
    ciVi: ["CI-ready no-blame wording", "CI-ready soft closing", "CI-ready limited exception"],
    ciEn: ["CI-ready no-blame wording", "CI-ready soft closing", "CI-ready limited exception"],
    preVi: ["Không dùng always/never", "Không phản bác gắt", "Không biến exception thành rule"],
    preEn: ["Do not use always/never", "Do not rebut harshly", "Do not turn the exception into a rule"],
  },
  recommendation: {
    closureVi: ["Closure giữ advice", "Closure giữ risk", "Closure giữ first step"],
    closureEn: ["Closure keeps advice", "Closure keeps risk", "Closure keeps the first step"],
    mergeVi: ["Pre-merge pass fees", "Pre-merge pass schedule", "Pre-merge pass support check"],
    mergeEn: ["Pre-merge passes fees", "Pre-merge passes schedule", "Pre-merge passes the support check"],
    ciVi: ["CI-ready condition", "CI-ready advisor step", "CI-ready no overpromise"],
    ciEn: ["CI-ready condition", "CI-ready advisor step", "CI-ready no overpromise"],
    preVi: ["Không bỏ budget", "Không đổi advice thành absolute", "Không bỏ first check"],
    preEn: ["Do not drop the budget", "Do not make advice absolute", "Do not drop the first check"],
  },
  workplace_fairness: {
    closureVi: ["Closure giữ process", "Closure giữ workload evidence", "Closure giữ review method"],
    closureEn: ["Closure keeps process", "Closure keeps workload evidence", "Closure keeps the review method"],
    mergeVi: ["Pre-merge pass task board", "Pre-merge pass deadlines", "Pre-merge pass manager meeting"],
    mergeEn: ["Pre-merge passes the task board", "Pre-merge passes deadlines", "Pre-merge passes the manager meeting"],
    ciVi: ["CI-ready professional tone", "CI-ready fair adjustment", "CI-ready no blame"],
    ciEn: ["CI-ready professional tone", "CI-ready fair adjustment", "CI-ready no blame"],
    preVi: ["Không cá nhân hóa", "Không bỏ meeting purpose", "Không bỏ evidence"],
    preEn: ["Do not personalize", "Do not drop the meeting purpose", "Do not drop evidence"],
  },
};

const closureAnswerByFocus: Record<
  PunjabiB2ClosurePacketSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "Closure packet sample stable ਹੈ ਜਦੋਂ public-service opinion ਵਿੱਚ stance, evidence ਅਤੇ next step ਬਾਅਦ ਦੇ A11 ਕੰਮ ਲਈ ਵੀ ਨਹੀਂ ਬਦਲਦੇ।",
    r: "Closure packet sample stable hai jadon public-service opinion vich stance, evidence ate next step baad de A11 kamm lai vii nahi badalde.",
    vi: "Sample closure packet ổn định khi opinion dịch vụ công giữ stance, evidence và next step không đổi cho công việc A11 sau này.",
    en: "A closure packet sample is stable when the public-service opinion keeps stance, evidence, and next step unchanged for later A11 work.",
  },
  comparison: {
    g: "Closure packet comparison rent, commute, utilities ਅਤੇ transit reliability ਨੂੰ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ tradeoff closure ਤੋਂ ਬਾਅਦ ਵੀ clear ਰਹਿੰਦਾ ਹੈ।",
    r: "Closure packet comparison rent, commute, utilities ate transit reliability nu ikatthe rakhdaa hai, is lai tradeoff closure ton baad vii clear rahindaa hai.",
    vi: "Closure packet comparison giữ rent, commute, utilities và transit reliability cùng nhau, nên tradeoff vẫn rõ sau closure.",
    en: "The closure packet comparison keeps rent, commute, utilities, and transit reliability together, so the tradeoff stays clear after closure.",
  },
  counterpoint: {
    g: "Closure packet counterpoint queue rule ਨੂੰ ਮੰਨਦਾ ਹੈ ਅਤੇ urgent symptom ਲਈ limited exception ਰੱਖਦਾ ਹੈ; safety reason preference ਨਹੀਂ ਬਣਦਾ।",
    r: "Closure packet counterpoint queue rule nu manndaa hai ate urgent symptom lai limited exception rakhdaa hai; safety reason preference nahi bandaa.",
    vi: "Closure packet counterpoint công nhận queue rule và giữ ngoại lệ giới hạn cho triệu chứng khẩn; safety reason không thành preference.",
    en: "The closure packet counterpoint accepts the queue rule and keeps a limited exception for urgent symptoms; the safety reason does not become preference.",
  },
  recommendation: {
    g: "Closure packet recommendation part-time program ਨੂੰ conditional ਰੱਖਦਾ ਹੈ: fees, schedule ਅਤੇ support verify ਹੋਣ ਤੋਂ ਬਾਅਦ advisor step ਆਉਂਦਾ ਹੈ।",
    r: "Closure packet recommendation part-time program nu conditional rakhdaa hai: fees, schedule ate support verify hon ton baad advisor step aaundaa hai.",
    vi: "Closure packet recommendation giữ chương trình bán thời gian có điều kiện: sau khi verify fees, schedule và support thì có advisor step.",
    en: "The closure packet recommendation keeps the part-time program conditional: after fees, schedule, and support are verified, the advisor step follows.",
  },
  workplace_fairness: {
    g: "Closure packet workplace answer task board evidence, deadlines ਅਤੇ manager review meeting ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ fair adjustment request blame ਨਹੀਂ ਬਣਦੀ।",
    r: "Closure packet workplace answer task board evidence, deadlines ate manager review meeting rakhdaa hai, is lai fair adjustment request blame nahi bandii.",
    vi: "Closure packet workplace answer giữ task board evidence, deadlines và manager review meeting, nên request fair adjustment không thành blame.",
    en: "The closure packet workplace answer keeps task-board evidence, deadlines, and the manager review meeting, so the fair-adjustment request does not become blame.",
  },
};

export const punjabiB2ClosurePacketSamples: PunjabiB2ClosurePacketSample[] =
  punjabiB2PreMergeSamples.map((item: PunjabiB2PreMergeSample) => {
    const closure = closureByFocus[item.preMergeFocus];
    const answer = closureAnswerByFocus[item.preMergeFocus];

    return {
      id: item.id.replace("pre_merge", "closure_packet"),
      level: "B2",
      closurePacketFocus: item.preMergeFocus,
      topic: item.topic,
      closurePrompt_gurmukhi: `${item.preMergePrompt_gurmukhi} pre-A11-closure packet ਲਈ stable reasoning ਸੰਭਾਲੋ।`,
      closurePrompt_romanization: `${item.preMergePrompt_romanization} pre-A11-closure packet lai stable reasoning sambhaalo.`,
      closurePrompt_vi: `${item.preMergePrompt_vi} Hãy giữ stable reasoning cho pre-A11-closure packet.`,
      closurePrompt_en: `${item.preMergePrompt_en} Preserve stable reasoning for the pre-A11 closure packet.`,
      closureAnswer_gurmukhi: answer.g,
      closureAnswer_romanization: answer.r,
      closureAnswer_vi: answer.vi,
      closureAnswer_en: answer.en,
      preA11Closure_vi: closure.closureVi,
      preA11Closure_en: closure.closureEn,
      preMergeChecks_vi: closure.mergeVi,
      preMergeChecks_en: closure.mergeEn,
      ciReadinessChecks_vi: closure.ciVi,
      ciReadinessChecks_en: closure.ciEn,
      preIntegration_vi: closure.preVi,
      preIntegration_en: closure.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} Closure-packet trap: không gọi đây là bước tích hợp; chỉ đóng gói reasoning ổn định cho later A11.`,
      learnerTrap_en: `${item.learnerTrap_en} Closure-packet trap: do not call this an integration step; only package stable reasoning for later A11.`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2ClosurePacketSamples;
