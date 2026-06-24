// Punjabi B2 seal samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2SnapshotSamples,
  type PunjabiB2SnapshotSample,
  type PunjabiB2SnapshotSamplesFocus,
  type PunjabiB2SnapshotSamplesTopic,
} from "./b2SnapshotSamples";

export type PunjabiB2SealSamplesFocus = PunjabiB2SnapshotSamplesFocus;
export type PunjabiB2SealSamplesTopic = PunjabiB2SnapshotSamplesTopic;

export type PunjabiB2SealSample = {
  id: string;
  level: "B2";
  sealFocus: PunjabiB2SealSamplesFocus;
  topic: PunjabiB2SealSamplesTopic;
  sealPrompt_gurmukhi: string;
  sealPrompt_romanization: string;
  sealPrompt_vi: string;
  sealPrompt_en: string;
  sealAnswer_gurmukhi: string;
  sealAnswer_romanization: string;
  sealAnswer_vi: string;
  sealAnswer_en: string;
  preA11Seal_vi: string[];
  preA11Seal_en: string[];
  snapshotChecks_vi: string[];
  snapshotChecks_en: string[];
  closurePacketChecks_vi: string[];
  closurePacketChecks_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const sealByFocus: Record<
  PunjabiB2SealSamplesFocus,
  {
    sealVi: string[];
    sealEn: string[];
    snapshotVi: string[];
    snapshotEn: string[];
    closureVi: string[];
    closureEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    sealVi: ["Seal giữ stance", "Seal giữ evidence", "Seal giữ next step"],
    sealEn: ["Seal keeps the stance", "Seal keeps evidence", "Seal keeps the next step"],
    snapshotVi: ["Snapshot giữ claim", "Snapshot giữ public-service reason", "Snapshot giữ action"],
    snapshotEn: ["Snapshot keeps the claim", "Snapshot keeps the public-service reason", "Snapshot keeps the action"],
    closureVi: ["Closure-packet giữ deadline", "Closure-packet giữ documents", "Closure-packet giữ contact step"],
    closureEn: ["Closure packet keeps the deadline", "Closure packet keeps documents", "Closure packet keeps the contact step"],
    preVi: ["Không đổi opinion", "Không bỏ evidence", "Không thêm claim mới"],
    preEn: ["Do not change the opinion", "Do not drop evidence", "Do not add a new claim"],
  },
  comparison: {
    sealVi: ["Seal giữ two options", "Seal giữ tradeoff", "Seal giữ condition"],
    sealEn: ["Seal keeps two options", "Seal keeps the tradeoff", "Seal keeps the condition"],
    snapshotVi: ["Snapshot giữ rent", "Snapshot giữ commute", "Snapshot giữ transit reliability"],
    snapshotEn: ["Snapshot keeps rent", "Snapshot keeps commute", "Snapshot keeps transit reliability"],
    closureVi: ["Closure-packet giữ utilities", "Closure-packet giữ budget", "Closure-packet giữ cost"],
    closureEn: ["Closure packet keeps utilities", "Closure packet keeps budget", "Closure packet keeps cost"],
    preVi: ["Không một chiều", "Không bỏ option B", "Không đổi condition"],
    preEn: ["Do not make it one-sided", "Do not drop option B", "Do not change the condition"],
  },
  counterpoint: {
    sealVi: ["Seal giữ acknowledgement", "Seal giữ exception", "Seal giữ safety reason"],
    sealEn: ["Seal keeps acknowledgment", "Seal keeps the exception", "Seal keeps the safety reason"],
    snapshotVi: ["Snapshot giữ queue rule", "Snapshot giữ urgent symptom", "Snapshot giữ respectful tone"],
    snapshotEn: ["Snapshot keeps the queue rule", "Snapshot keeps urgent symptoms", "Snapshot keeps respectful tone"],
    closureVi: ["Closure-packet giữ no-blame wording", "Closure-packet giữ soft closing", "Closure-packet giữ limited exception"],
    closureEn: ["Closure packet keeps no-blame wording", "Closure packet keeps soft closing", "Closure packet keeps the limited exception"],
    preVi: ["Không dùng always/never", "Không phản bác gắt", "Không biến exception thành rule"],
    preEn: ["Do not use always/never", "Do not rebut harshly", "Do not turn the exception into a rule"],
  },
  recommendation: {
    sealVi: ["Seal giữ advice", "Seal giữ risk", "Seal giữ first step"],
    sealEn: ["Seal keeps advice", "Seal keeps risk", "Seal keeps the first step"],
    snapshotVi: ["Snapshot giữ fees", "Snapshot giữ schedule", "Snapshot giữ support check"],
    snapshotEn: ["Snapshot keeps fees", "Snapshot keeps schedule", "Snapshot keeps the support check"],
    closureVi: ["Closure-packet giữ condition", "Closure-packet giữ advisor step", "Closure-packet không overpromise"],
    closureEn: ["Closure packet keeps the condition", "Closure packet keeps the advisor step", "Closure packet does not overpromise"],
    preVi: ["Không bỏ budget", "Không đổi advice thành absolute", "Không bỏ first check"],
    preEn: ["Do not drop the budget", "Do not make advice absolute", "Do not drop the first check"],
  },
  workplace_fairness: {
    sealVi: ["Seal giữ process", "Seal giữ workload evidence", "Seal giữ review method"],
    sealEn: ["Seal keeps process", "Seal keeps workload evidence", "Seal keeps the review method"],
    snapshotVi: ["Snapshot giữ task board", "Snapshot giữ deadlines", "Snapshot giữ manager meeting"],
    snapshotEn: ["Snapshot keeps the task board", "Snapshot keeps deadlines", "Snapshot keeps the manager meeting"],
    closureVi: ["Closure-packet giữ professional tone", "Closure-packet giữ fair adjustment", "Closure-packet giữ no blame"],
    closureEn: ["Closure packet keeps professional tone", "Closure packet keeps fair adjustment", "Closure packet keeps no blame"],
    preVi: ["Không cá nhân hóa", "Không bỏ meeting purpose", "Không bỏ evidence"],
    preEn: ["Do not personalize", "Do not drop the meeting purpose", "Do not drop evidence"],
  },
};

const sealAnswerByFocus: Record<
  PunjabiB2SealSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "Pre-A11 seal sample stable ਹੈ ਜਦੋਂ public-service opinion ਵਿੱਚ stance, evidence ਅਤੇ next step seal ਤੋਂ ਬਾਅਦ ਵੀ ਇਕੋ ਰਹਿੰਦੇ ਹਨ।",
    r: "Pre-A11 seal sample stable hai jadon public-service opinion vich stance, evidence ate next step seal ton baad vii ikko rahinde han.",
    vi: "Sample pre-A11 seal ổn định khi opinion dịch vụ công giữ stance, evidence và next step sau seal.",
    en: "A pre-A11 seal sample is stable when the public-service opinion keeps stance, evidence, and next step after the seal.",
  },
  comparison: {
    g: "Pre-A11 seal comparison rent, commute, utilities ਅਤੇ transit reliability ਨੂੰ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ tradeoff seal ਤੋਂ ਬਾਅਦ ਵੀ stable ਰਹਿੰਦਾ ਹੈ।",
    r: "Pre-A11 seal comparison rent, commute, utilities ate transit reliability nu ikatthe rakhdaa hai, is lai tradeoff seal ton baad vii stable rahindaa hai.",
    vi: "Pre-A11 seal comparison giữ rent, commute, utilities và transit reliability cùng nhau, nên tradeoff vẫn ổn định sau seal.",
    en: "The pre-A11 seal comparison keeps rent, commute, utilities, and transit reliability together, so the tradeoff stays stable after the seal.",
  },
  counterpoint: {
    g: "Pre-A11 seal counterpoint queue rule ਨੂੰ ਮੰਨਦਾ ਹੈ, urgent symptom ਲਈ limited exception ਰੱਖਦਾ ਹੈ, ਅਤੇ safety reason ਨੂੰ preference ਨਹੀਂ ਬਣਾਉਂਦਾ।",
    r: "Pre-A11 seal counterpoint queue rule nu manndaa hai, urgent symptom lai limited exception rakhdaa hai, ate safety reason nu preference nahi banaaundaa.",
    vi: "Pre-A11 seal counterpoint công nhận queue rule, giữ ngoại lệ giới hạn cho triệu chứng khẩn, và không biến safety reason thành preference.",
    en: "The pre-A11 seal counterpoint accepts the queue rule, keeps a limited exception for urgent symptoms, and does not turn the safety reason into preference.",
  },
  recommendation: {
    g: "Pre-A11 seal recommendation part-time program ਨੂੰ conditional ਰੱਖਦਾ ਹੈ: fees, schedule ਅਤੇ support verify ਹੋਣ ਤੋਂ ਬਾਅਦ first advisor step ਆਉਂਦਾ ਹੈ।",
    r: "Pre-A11 seal recommendation part-time program nu conditional rakhdaa hai: fees, schedule ate support verify hon ton baad first advisor step aaundaa hai.",
    vi: "Pre-A11 seal recommendation giữ chương trình bán thời gian có điều kiện: sau khi verify fees, schedule và support thì có first advisor step.",
    en: "The pre-A11 seal recommendation keeps the part-time program conditional: after fees, schedule, and support are verified, the first advisor step follows.",
  },
  workplace_fairness: {
    g: "Pre-A11 seal workplace answer task board evidence, deadlines ਅਤੇ manager review meeting ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ fair adjustment request blame ਨਹੀਂ ਬਣਦੀ।",
    r: "Pre-A11 seal workplace answer task board evidence, deadlines ate manager review meeting rakhdaa hai, is lai fair adjustment request blame nahi bandii.",
    vi: "Pre-A11 seal workplace answer giữ task board evidence, deadlines và manager review meeting, nên request fair adjustment không thành blame.",
    en: "The pre-A11 seal workplace answer keeps task-board evidence, deadlines, and the manager review meeting, so the fair-adjustment request does not become blame.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2SealSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Canada example: a newcomer settlement worker checks forms, IDs, and the next contact step before leaving.",
    en: "Canada example: a newcomer settlement worker checks forms, IDs, and the next contact step before leaving.",
  },
  education: {
    vi: "Canada example: a student compares part-time study, tuition, and work schedule before applying.",
    en: "Canada example: a student compares part-time study, tuition, and work schedule before applying.",
  },
  healthcare_access: {
    vi: "Canada example: triage in a clinic uses symptom evidence to set priority safely.",
    en: "Canada example: triage in a clinic uses symptom evidence to set priority safely.",
  },
  housing: {
    vi: "Canada example: a renter checks rent, utilities, commute, and lease dates before signing.",
    en: "Canada example: a renter checks rent, utilities, commute, and lease dates before signing.",
  },
  transport: {
    vi: "Canada example: a commuter compares bus frequency, transfer risk, and monthly pass cost.",
    en: "Canada example: a commuter compares bus frequency, transfer risk, and monthly pass cost.",
  },
  public_service: {
    vi: "Canada example: a public-service call confirms eligibility, deadline, documents, and contact information.",
    en: "Canada example: a public-service call confirms eligibility, deadline, documents, and contact information.",
  },
  work: {
    vi: "Canada example: a team member uses task-board evidence to ask for a fair schedule adjustment.",
    en: "Canada example: a team member uses task-board evidence to ask for a fair schedule adjustment.",
  },
};

export const punjabiB2SealSamples: PunjabiB2SealSample[] =
  punjabiB2SnapshotSamples.map((item: PunjabiB2SnapshotSample, index: number) => {
    const seal = sealByFocus[item.snapshotFocus];
    const answer = sealAnswerByFocus[item.snapshotFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? { vi: item.canadaPracticalExample_vi, en: item.canadaPracticalExample_en }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("snapshot", "seal"),
      level: "B2",
      sealFocus: item.snapshotFocus,
      topic: item.topic,
      sealPrompt_gurmukhi: `${item.snapshotPrompt_gurmukhi} pre-A11-seal ਲਈ stable reasoning lock ਕਰੋ।`,
      sealPrompt_romanization: `${item.snapshotPrompt_romanization} pre-A11-seal lai stable reasoning lock karo.`,
      sealPrompt_vi: `${item.snapshotPrompt_vi} Hãy lock stable reasoning cho pre-A11-seal.`,
      sealPrompt_en: `${item.snapshotPrompt_en} Lock stable reasoning for the pre-A11 seal.`,
      sealAnswer_gurmukhi: answer.g,
      sealAnswer_romanization: answer.r,
      sealAnswer_vi: answer.vi,
      sealAnswer_en: answer.en,
      preA11Seal_vi: seal.sealVi,
      preA11Seal_en: seal.sealEn,
      snapshotChecks_vi: seal.snapshotVi,
      snapshotChecks_en: seal.snapshotEn,
      closurePacketChecks_vi: seal.closureVi,
      closurePacketChecks_en: seal.closureEn,
      preIntegration_vi: seal.preVi,
      preIntegration_en: seal.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} Seal trap: không gọi đây là integration step; chỉ lock reasoning ổn định cho later A11.`,
      learnerTrap_en: `${item.learnerTrap_en} Seal trap: do not call this an integration step; only lock stable reasoning for later A11.`,
      canadaPracticalExample_vi: canada.vi,
      canadaPracticalExample_en: canada.en,
      scriptAwareness_en:
        index === 0
          ? "Gurmukhi is primary; Shahmukhi is awareness only."
          : "Gurmukhi is primary; script awareness is awareness only.",
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2SealSamples;
