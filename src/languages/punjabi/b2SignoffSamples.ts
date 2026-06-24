// Punjabi B2 signoff samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2SealSamples,
  type PunjabiB2SealSample,
  type PunjabiB2SealSamplesFocus,
  type PunjabiB2SealSamplesTopic,
} from "./b2SealSamples";

export type PunjabiB2SignoffSamplesFocus = PunjabiB2SealSamplesFocus;
export type PunjabiB2SignoffSamplesTopic = PunjabiB2SealSamplesTopic;

export type PunjabiB2SignoffSample = {
  id: string;
  level: "B2";
  signoffFocus: PunjabiB2SignoffSamplesFocus;
  topic: PunjabiB2SignoffSamplesTopic;
  signoffPrompt_gurmukhi: string;
  signoffPrompt_romanization: string;
  signoffPrompt_vi: string;
  signoffPrompt_en: string;
  signoffAnswer_gurmukhi: string;
  signoffAnswer_romanization: string;
  signoffAnswer_vi: string;
  signoffAnswer_en: string;
  preA11Signoff_vi: string[];
  preA11Signoff_en: string[];
  sealChecks_vi: string[];
  sealChecks_en: string[];
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

const signoffByFocus: Record<
  PunjabiB2SignoffSamplesFocus,
  {
    signoffVi: string[];
    signoffEn: string[];
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
    signoffVi: ["Signoff giữ stance", "Signoff giữ evidence", "Signoff giữ next step"],
    signoffEn: ["Signoff keeps the stance", "Signoff keeps evidence", "Signoff keeps the next step"],
    sealVi: ["Seal giữ claim", "Seal giữ public-service reason", "Seal giữ action"],
    sealEn: ["Seal keeps the claim", "Seal keeps the public-service reason", "Seal keeps the action"],
    snapshotVi: ["Snapshot giữ deadline", "Snapshot giữ documents", "Snapshot giữ contact step"],
    snapshotEn: ["Snapshot keeps the deadline", "Snapshot keeps documents", "Snapshot keeps the contact step"],
    closureVi: ["Closure-packet giữ summary", "Closure-packet giữ evidence", "Closure-packet giữ conclusion"],
    closureEn: ["Closure packet keeps the summary", "Closure packet keeps evidence", "Closure packet keeps the conclusion"],
    preVi: ["Không đổi opinion", "Không bỏ evidence", "Không thêm claim mới"],
    preEn: ["Do not change the opinion", "Do not drop evidence", "Do not add a new claim"],
  },
  comparison: {
    signoffVi: ["Signoff giữ two options", "Signoff giữ tradeoff", "Signoff giữ condition"],
    signoffEn: ["Signoff keeps two options", "Signoff keeps the tradeoff", "Signoff keeps the condition"],
    sealVi: ["Seal giữ rent", "Seal giữ commute", "Seal giữ transit reliability"],
    sealEn: ["Seal keeps rent", "Seal keeps commute", "Seal keeps transit reliability"],
    snapshotVi: ["Snapshot giữ utilities", "Snapshot giữ budget", "Snapshot giữ cost"],
    snapshotEn: ["Snapshot keeps utilities", "Snapshot keeps budget", "Snapshot keeps cost"],
    closureVi: ["Closure-packet giữ option B", "Closure-packet giữ route", "Closure-packet giữ work schedule"],
    closureEn: ["Closure packet keeps option B", "Closure packet keeps route", "Closure packet keeps work schedule"],
    preVi: ["Không một chiều", "Không bỏ option B", "Không đổi condition"],
    preEn: ["Do not make it one-sided", "Do not drop option B", "Do not change the condition"],
  },
  counterpoint: {
    signoffVi: ["Signoff giữ acknowledgement", "Signoff giữ exception", "Signoff giữ safety reason"],
    signoffEn: ["Signoff keeps acknowledgment", "Signoff keeps the exception", "Signoff keeps the safety reason"],
    sealVi: ["Seal giữ queue rule", "Seal giữ urgent symptom", "Seal giữ respectful tone"],
    sealEn: ["Seal keeps the queue rule", "Seal keeps urgent symptoms", "Seal keeps respectful tone"],
    snapshotVi: ["Snapshot giữ no-blame wording", "Snapshot giữ soft closing", "Snapshot giữ limited exception"],
    snapshotEn: ["Snapshot keeps no-blame wording", "Snapshot keeps soft closing", "Snapshot keeps the limited exception"],
    closureVi: ["Closure-packet giữ limit", "Closure-packet giữ evidence", "Closure-packet giữ polite reply"],
    closureEn: ["Closure packet keeps the limit", "Closure packet keeps evidence", "Closure packet keeps a polite reply"],
    preVi: ["Không dùng always/never", "Không phản bác gắt", "Không biến exception thành rule"],
    preEn: ["Do not use always/never", "Do not rebut harshly", "Do not turn the exception into a rule"],
  },
  recommendation: {
    signoffVi: ["Signoff giữ advice", "Signoff giữ risk", "Signoff giữ first step"],
    signoffEn: ["Signoff keeps advice", "Signoff keeps risk", "Signoff keeps the first step"],
    sealVi: ["Seal giữ fees", "Seal giữ schedule", "Seal giữ support check"],
    sealEn: ["Seal keeps fees", "Seal keeps schedule", "Seal keeps the support check"],
    snapshotVi: ["Snapshot giữ condition", "Snapshot giữ advisor step", "Snapshot không overpromise"],
    snapshotEn: ["Snapshot keeps the condition", "Snapshot keeps the advisor step", "Snapshot does not overpromise"],
    closureVi: ["Closure-packet giữ budget", "Closure-packet giữ first check", "Closure-packet giữ practical action"],
    closureEn: ["Closure packet keeps the budget", "Closure packet keeps the first check", "Closure packet keeps practical action"],
    preVi: ["Không bỏ budget", "Không đổi advice thành absolute", "Không bỏ first check"],
    preEn: ["Do not drop the budget", "Do not make advice absolute", "Do not drop the first check"],
  },
  workplace_fairness: {
    signoffVi: ["Signoff giữ process", "Signoff giữ workload evidence", "Signoff giữ review method"],
    signoffEn: ["Signoff keeps process", "Signoff keeps workload evidence", "Signoff keeps the review method"],
    sealVi: ["Seal giữ task board", "Seal giữ deadlines", "Seal giữ manager meeting"],
    sealEn: ["Seal keeps the task board", "Seal keeps deadlines", "Seal keeps the manager meeting"],
    snapshotVi: ["Snapshot giữ professional tone", "Snapshot giữ fair adjustment", "Snapshot giữ no blame"],
    snapshotEn: ["Snapshot keeps professional tone", "Snapshot keeps fair adjustment", "Snapshot keeps no blame"],
    closureVi: ["Closure-packet giữ evidence", "Closure-packet giữ meeting purpose", "Closure-packet giữ adjustment"],
    closureEn: ["Closure packet keeps evidence", "Closure packet keeps the meeting purpose", "Closure packet keeps adjustment"],
    preVi: ["Không cá nhân hóa", "Không bỏ meeting purpose", "Không bỏ evidence"],
    preEn: ["Do not personalize", "Do not drop the meeting purpose", "Do not drop evidence"],
  },
};

const signoffAnswerByFocus: Record<
  PunjabiB2SignoffSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "Pre-A11 signoff sample stable ਹੈ ਜਦੋਂ public-service opinion ਵਿੱਚ stance, evidence ਅਤੇ next step signoff ਤੋਂ ਬਾਅਦ ਵੀ ਇਕੋ ਰਹਿੰਦੇ ਹਨ।",
    r: "Pre-A11 signoff sample stable hai jadon public-service opinion vich stance, evidence ate next step signoff ton baad vii ikko rahinde han.",
    vi: "Sample pre-A11 signoff ổn định khi opinion dịch vụ công giữ stance, evidence và next step sau signoff.",
    en: "A pre-A11 signoff sample is stable when the public-service opinion keeps stance, evidence, and next step after signoff.",
  },
  comparison: {
    g: "Pre-A11 signoff comparison rent, commute, utilities ਅਤੇ transit reliability ਨੂੰ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ tradeoff signoff ਤੋਂ ਬਾਅਦ ਵੀ stable ਰਹਿੰਦਾ ਹੈ।",
    r: "Pre-A11 signoff comparison rent, commute, utilities ate transit reliability nu ikatthe rakhdaa hai, is lai tradeoff signoff ton baad vii stable rahindaa hai.",
    vi: "Pre-A11 signoff comparison giữ rent, commute, utilities và transit reliability cùng nhau, nên tradeoff vẫn ổn định sau signoff.",
    en: "The pre-A11 signoff comparison keeps rent, commute, utilities, and transit reliability together, so the tradeoff stays stable after signoff.",
  },
  counterpoint: {
    g: "Pre-A11 signoff counterpoint queue rule ਨੂੰ ਮੰਨਦਾ ਹੈ, urgent symptom ਲਈ limited exception ਰੱਖਦਾ ਹੈ, ਅਤੇ safety reason ਨੂੰ preference ਨਹੀਂ ਬਣਾਉਂਦਾ।",
    r: "Pre-A11 signoff counterpoint queue rule nu manndaa hai, urgent symptom lai limited exception rakhdaa hai, ate safety reason nu preference nahi banaaundaa.",
    vi: "Pre-A11 signoff counterpoint công nhận queue rule, giữ ngoại lệ giới hạn cho triệu chứng khẩn, và không biến safety reason thành preference.",
    en: "The pre-A11 signoff counterpoint accepts the queue rule, keeps a limited exception for urgent symptoms, and does not turn the safety reason into preference.",
  },
  recommendation: {
    g: "Pre-A11 signoff recommendation part-time program ਨੂੰ conditional ਰੱਖਦਾ ਹੈ: fees, schedule ਅਤੇ support verify ਹੋਣ ਤੋਂ ਬਾਅਦ first advisor step ਆਉਂਦਾ ਹੈ।",
    r: "Pre-A11 signoff recommendation part-time program nu conditional rakhdaa hai: fees, schedule ate support verify hon ton baad first advisor step aaundaa hai.",
    vi: "Pre-A11 signoff recommendation giữ chương trình bán thời gian có điều kiện: sau khi verify fees, schedule và support thì có first advisor step.",
    en: "The pre-A11 signoff recommendation keeps the part-time program conditional: after fees, schedule, and support are verified, the first advisor step follows.",
  },
  workplace_fairness: {
    g: "Pre-A11 signoff workplace answer task board evidence, deadlines ਅਤੇ manager review meeting ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ fair adjustment request blame ਨਹੀਂ ਬਣਦੀ।",
    r: "Pre-A11 signoff workplace answer task board evidence, deadlines ate manager review meeting rakhdaa hai, is lai fair adjustment request blame nahi bandii.",
    vi: "Pre-A11 signoff workplace answer giữ task board evidence, deadlines và manager review meeting, nên request fair adjustment không thành blame.",
    en: "The pre-A11 signoff workplace answer keeps task-board evidence, deadlines, and the manager review meeting, so the fair-adjustment request does not become blame.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2SignoffSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Canada example: a settlement helper checks forms, ID, and contact steps before signoff.",
    en: "Canada example: a settlement helper checks forms, ID, and contact steps before signoff.",
  },
  education: {
    vi: "Canada example: a student signs off on part-time study only after checking tuition and schedule.",
    en: "Canada example: a student signs off on part-time study only after checking tuition and schedule.",
  },
  healthcare_access: {
    vi: "Canada example: signoff on triage depends on symptom evidence and safe priority.",
    en: "Canada example: signoff on triage depends on symptom evidence and safe priority.",
  },
  housing: {
    vi: "Canada example: a renter signs off after checking rent, utilities, commute, and lease date.",
    en: "Canada example: a renter signs off after checking rent, utilities, commute, and lease date.",
  },
  transport: {
    vi: "Canada example: a commuter signs off on a route after checking bus timing and transfer risk.",
    en: "Canada example: a commuter signs off on a route after checking bus timing and transfer risk.",
  },
  public_service: {
    vi: "Canada example: a public-service call signs off when eligibility, deadline, documents, and contact are clear.",
    en: "Canada example: a public-service call signs off when eligibility, deadline, documents, and contact are clear.",
  },
  work: {
    vi: "Canada example: a worker signs off on a schedule adjustment after checking task-board evidence.",
    en: "Canada example: a worker signs off on a schedule adjustment after checking task-board evidence.",
  },
};

export const punjabiB2SignoffSamples: PunjabiB2SignoffSample[] =
  punjabiB2SealSamples.map((item: PunjabiB2SealSample, index: number) => {
    const signoff = signoffByFocus[item.sealFocus];
    const answer = signoffAnswerByFocus[item.sealFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? { vi: item.canadaPracticalExample_vi, en: item.canadaPracticalExample_en }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("seal", "signoff"),
      level: "B2",
      signoffFocus: item.sealFocus,
      topic: item.topic,
      signoffPrompt_gurmukhi: `${item.sealPrompt_gurmukhi} pre-A11-signoff ਲਈ stable reasoning finalize ਕਰੋ।`,
      signoffPrompt_romanization: `${item.sealPrompt_romanization} pre-A11-signoff lai stable reasoning finalize karo.`,
      signoffPrompt_vi: `${item.sealPrompt_vi} Hãy finalize stable reasoning cho pre-A11-signoff.`,
      signoffPrompt_en: `${item.sealPrompt_en} Finalize stable reasoning for the pre-A11 signoff.`,
      signoffAnswer_gurmukhi: answer.g,
      signoffAnswer_romanization: answer.r,
      signoffAnswer_vi: answer.vi,
      signoffAnswer_en: answer.en,
      preA11Signoff_vi: signoff.signoffVi,
      preA11Signoff_en: signoff.signoffEn,
      sealChecks_vi: signoff.sealVi,
      sealChecks_en: signoff.sealEn,
      snapshotChecks_vi: signoff.snapshotVi,
      snapshotChecks_en: signoff.snapshotEn,
      closurePacketChecks_vi: signoff.closureVi,
      closurePacketChecks_en: signoff.closureEn,
      preIntegration_vi: signoff.preVi,
      preIntegration_en: signoff.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} Signoff trap: không gọi đây là integration step; chỉ finalize stable reasoning cho later A11.`,
      learnerTrap_en: `${item.learnerTrap_en} Signoff trap: do not call this an integration step; only finalize stable reasoning for later A11.`,
      canadaPracticalExample_vi: canada.vi,
      canadaPracticalExample_en: canada.en,
      scriptAwareness_en:
        index === 0
          ? "Gurmukhi is primary; Shahmukhi is awareness only."
          : "Gurmukhi is primary; script awareness is awareness only.",
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2SignoffSamples;
