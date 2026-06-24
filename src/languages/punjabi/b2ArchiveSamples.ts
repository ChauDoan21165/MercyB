// Punjabi B2 archive samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2SignoffSamples,
  type PunjabiB2SignoffSample,
  type PunjabiB2SignoffSamplesFocus,
  type PunjabiB2SignoffSamplesTopic,
} from "./b2SignoffSamples";

export type PunjabiB2ArchiveSamplesFocus = PunjabiB2SignoffSamplesFocus;
export type PunjabiB2ArchiveSamplesTopic = PunjabiB2SignoffSamplesTopic;

export type PunjabiB2ArchiveSample = {
  id: string;
  level: "B2";
  archiveFocus: PunjabiB2ArchiveSamplesFocus;
  topic: PunjabiB2ArchiveSamplesTopic;
  archivePrompt_gurmukhi: string;
  archivePrompt_romanization: string;
  archivePrompt_vi: string;
  archivePrompt_en: string;
  archiveAnswer_gurmukhi: string;
  archiveAnswer_romanization: string;
  archiveAnswer_vi: string;
  archiveAnswer_en: string;
  preA11Archive_vi: string[];
  preA11Archive_en: string[];
  signoffChecks_vi: string[];
  signoffChecks_en: string[];
  sealChecks_vi: string[];
  sealChecks_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const archiveByFocus: Record<
  PunjabiB2ArchiveSamplesFocus,
  {
    archiveVi: string[];
    archiveEn: string[];
    signoffVi: string[];
    signoffEn: string[];
    sealVi: string[];
    sealEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    archiveVi: ["Archive giữ stance", "Archive giữ evidence", "Archive giữ next step"],
    archiveEn: ["Archive keeps the stance", "Archive keeps evidence", "Archive keeps the next step"],
    signoffVi: ["Signoff giữ claim", "Signoff giữ public-service reason", "Signoff giữ action"],
    signoffEn: ["Signoff keeps the claim", "Signoff keeps the public-service reason", "Signoff keeps the action"],
    sealVi: ["Seal giữ deadline", "Seal giữ documents", "Seal giữ contact step"],
    sealEn: ["Seal keeps the deadline", "Seal keeps documents", "Seal keeps the contact step"],
    preVi: ["Không đổi opinion", "Không bỏ evidence", "Không thêm claim mới"],
    preEn: ["Do not change the opinion", "Do not drop evidence", "Do not add a new claim"],
  },
  comparison: {
    archiveVi: ["Archive giữ two options", "Archive giữ tradeoff", "Archive giữ condition"],
    archiveEn: ["Archive keeps two options", "Archive keeps the tradeoff", "Archive keeps the condition"],
    signoffVi: ["Signoff giữ rent", "Signoff giữ commute", "Signoff giữ transit reliability"],
    signoffEn: ["Signoff keeps rent", "Signoff keeps commute", "Signoff keeps transit reliability"],
    sealVi: ["Seal giữ utilities", "Seal giữ budget", "Seal giữ cost"],
    sealEn: ["Seal keeps utilities", "Seal keeps budget", "Seal keeps cost"],
    preVi: ["Không một chiều", "Không bỏ option B", "Không đổi condition"],
    preEn: ["Do not make it one-sided", "Do not drop option B", "Do not change the condition"],
  },
  counterpoint: {
    archiveVi: ["Archive giữ acknowledgement", "Archive giữ exception", "Archive giữ safety reason"],
    archiveEn: ["Archive keeps acknowledgment", "Archive keeps the exception", "Archive keeps the safety reason"],
    signoffVi: ["Signoff giữ queue rule", "Signoff giữ urgent symptom", "Signoff giữ respectful tone"],
    signoffEn: ["Signoff keeps the queue rule", "Signoff keeps urgent symptoms", "Signoff keeps respectful tone"],
    sealVi: ["Seal giữ no-blame wording", "Seal giữ soft closing", "Seal giữ limited exception"],
    sealEn: ["Seal keeps no-blame wording", "Seal keeps soft closing", "Seal keeps the limited exception"],
    preVi: ["Không dùng always/never", "Không phản bác gắt", "Không biến exception thành rule"],
    preEn: ["Do not use always/never", "Do not rebut harshly", "Do not turn the exception into a rule"],
  },
  recommendation: {
    archiveVi: ["Archive giữ advice", "Archive giữ risk", "Archive giữ first step"],
    archiveEn: ["Archive keeps advice", "Archive keeps risk", "Archive keeps the first step"],
    signoffVi: ["Signoff giữ fees", "Signoff giữ schedule", "Signoff giữ support check"],
    signoffEn: ["Signoff keeps fees", "Signoff keeps schedule", "Signoff keeps the support check"],
    sealVi: ["Seal giữ condition", "Seal giữ advisor step", "Seal không overpromise"],
    sealEn: ["Seal keeps the condition", "Seal keeps the advisor step", "Seal does not overpromise"],
    preVi: ["Không bỏ budget", "Không đổi advice thành absolute", "Không bỏ first check"],
    preEn: ["Do not drop the budget", "Do not make advice absolute", "Do not drop the first check"],
  },
  workplace_fairness: {
    archiveVi: ["Archive giữ process", "Archive giữ workload evidence", "Archive giữ review method"],
    archiveEn: ["Archive keeps process", "Archive keeps workload evidence", "Archive keeps the review method"],
    signoffVi: ["Signoff giữ task board", "Signoff giữ deadlines", "Signoff giữ manager meeting"],
    signoffEn: ["Signoff keeps the task board", "Signoff keeps deadlines", "Signoff keeps the manager meeting"],
    sealVi: ["Seal giữ professional tone", "Seal giữ fair adjustment", "Seal giữ no blame"],
    sealEn: ["Seal keeps professional tone", "Seal keeps fair adjustment", "Seal keeps no blame"],
    preVi: ["Không cá nhân hóa", "Không bỏ meeting purpose", "Không bỏ evidence"],
    preEn: ["Do not personalize", "Do not drop the meeting purpose", "Do not drop evidence"],
  },
};

const archiveAnswerByFocus: Record<
  PunjabiB2ArchiveSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "Pre-A11 archive sample stable ਹੈ ਜਦੋਂ public-service opinion ਵਿੱਚ stance, evidence ਅਤੇ next step archive ਤੋਂ ਬਾਅਦ ਵੀ ਇਕੋ ਰਹਿੰਦੇ ਹਨ।",
    r: "Pre-A11 archive sample stable hai jadon public-service opinion vich stance, evidence ate next step archive ton baad vii ikko rahinde han.",
    vi: "Sample pre-A11 archive ổn định khi opinion dịch vụ công giữ stance, evidence và next step sau archive.",
    en: "A pre-A11 archive sample is stable when the public-service opinion keeps stance, evidence, and next step after archiving.",
  },
  comparison: {
    g: "Pre-A11 archive comparison rent, commute, utilities ਅਤੇ transit reliability ਨੂੰ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ tradeoff archive ਤੋਂ ਬਾਅਦ ਵੀ stable ਰਹਿੰਦਾ ਹੈ।",
    r: "Pre-A11 archive comparison rent, commute, utilities ate transit reliability nu ikatthe rakhdaa hai, is lai tradeoff archive ton baad vii stable rahindaa hai.",
    vi: "Pre-A11 archive comparison giữ rent, commute, utilities và transit reliability cùng nhau, nên tradeoff vẫn ổn định sau archive.",
    en: "The pre-A11 archive comparison keeps rent, commute, utilities, and transit reliability together, so the tradeoff stays stable after archiving.",
  },
  counterpoint: {
    g: "Pre-A11 archive counterpoint queue rule ਨੂੰ ਮੰਨਦਾ ਹੈ, urgent symptom ਲਈ limited exception ਰੱਖਦਾ ਹੈ, ਅਤੇ safety reason ਨੂੰ preference ਨਹੀਂ ਬਣਾਉਂਦਾ।",
    r: "Pre-A11 archive counterpoint queue rule nu manndaa hai, urgent symptom lai limited exception rakhdaa hai, ate safety reason nu preference nahi banaaundaa.",
    vi: "Pre-A11 archive counterpoint công nhận queue rule, giữ ngoại lệ giới hạn cho triệu chứng khẩn, và không biến safety reason thành preference.",
    en: "The pre-A11 archive counterpoint accepts the queue rule, keeps a limited exception for urgent symptoms, and does not turn the safety reason into preference.",
  },
  recommendation: {
    g: "Pre-A11 archive recommendation part-time program ਨੂੰ conditional ਰੱਖਦਾ ਹੈ: fees, schedule ਅਤੇ support verify ਹੋਣ ਤੋਂ ਬਾਅਦ first advisor step ਆਉਂਦਾ ਹੈ।",
    r: "Pre-A11 archive recommendation part-time program nu conditional rakhdaa hai: fees, schedule ate support verify hon ton baad first advisor step aaundaa hai.",
    vi: "Pre-A11 archive recommendation giữ chương trình bán thời gian có điều kiện: sau khi verify fees, schedule và support thì có first advisor step.",
    en: "The pre-A11 archive recommendation keeps the part-time program conditional: after fees, schedule, and support are verified, the first advisor step follows.",
  },
  workplace_fairness: {
    g: "Pre-A11 archive workplace answer task board evidence, deadlines ਅਤੇ manager review meeting ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ fair adjustment request blame ਨਹੀਂ ਬਣਦੀ।",
    r: "Pre-A11 archive workplace answer task board evidence, deadlines ate manager review meeting rakhdaa hai, is lai fair adjustment request blame nahi bandii.",
    vi: "Pre-A11 archive workplace answer giữ task board evidence, deadlines và manager review meeting, nên request fair adjustment không thành blame.",
    en: "The pre-A11 archive workplace answer keeps task-board evidence, deadlines, and the manager review meeting, so the fair-adjustment request does not become blame.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2ArchiveSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Canada example: archive notes for a newcomer settlement meeting include forms, ID, and the next contact step.",
    en: "Canada example: archive notes for a newcomer settlement meeting include forms, ID, and the next contact step.",
  },
  education: {
    vi: "Canada example: archive a student plan after checking tuition, part-time study, and schedule.",
    en: "Canada example: archive a student plan after checking tuition, part-time study, and schedule.",
  },
  healthcare_access: {
    vi: "Canada example: archive triage notes only after symptom evidence and priority are clear.",
    en: "Canada example: archive triage notes only after symptom evidence and priority are clear.",
  },
  housing: {
    vi: "Canada example: archive a housing decision after checking rent, utilities, commute, and lease date.",
    en: "Canada example: archive a housing decision after checking rent, utilities, commute, and lease date.",
  },
  transport: {
    vi: "Canada example: archive route notes after checking bus frequency, transfer risk, and monthly pass cost.",
    en: "Canada example: archive route notes after checking bus frequency, transfer risk, and monthly pass cost.",
  },
  public_service: {
    vi: "Canada example: archive a public-service call summary with eligibility, deadline, documents, and contact.",
    en: "Canada example: archive a public-service call summary with eligibility, deadline, documents, and contact.",
  },
  work: {
    vi: "Canada example: archive a work schedule request after checking task-board evidence and meeting notes.",
    en: "Canada example: archive a work schedule request after checking task-board evidence and meeting notes.",
  },
};

export const punjabiB2ArchiveSamples: PunjabiB2ArchiveSample[] =
  punjabiB2SignoffSamples.map((item: PunjabiB2SignoffSample, index: number) => {
    const archive = archiveByFocus[item.signoffFocus];
    const answer = archiveAnswerByFocus[item.signoffFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? { vi: item.canadaPracticalExample_vi, en: item.canadaPracticalExample_en }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("signoff", "archive"),
      level: "B2",
      archiveFocus: item.signoffFocus,
      topic: item.topic,
      archivePrompt_gurmukhi: `${item.signoffPrompt_gurmukhi} pre-A11-archive ਲਈ stable reasoning store ਕਰੋ।`,
      archivePrompt_romanization: `${item.signoffPrompt_romanization} pre-A11-archive lai stable reasoning store karo.`,
      archivePrompt_vi: `${item.signoffPrompt_vi} Hãy store stable reasoning cho pre-A11-archive.`,
      archivePrompt_en: `${item.signoffPrompt_en} Store stable reasoning for the pre-A11 archive.`,
      archiveAnswer_gurmukhi: answer.g,
      archiveAnswer_romanization: answer.r,
      archiveAnswer_vi: answer.vi,
      archiveAnswer_en: answer.en,
      preA11Archive_vi: archive.archiveVi,
      preA11Archive_en: archive.archiveEn,
      signoffChecks_vi: archive.signoffVi,
      signoffChecks_en: archive.signoffEn,
      sealChecks_vi: archive.sealVi,
      sealChecks_en: archive.sealEn,
      preIntegration_vi: archive.preVi,
      preIntegration_en: archive.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} Archive trap: không gọi đây là integration step; chỉ store reasoning ổn định cho later A11.`,
      learnerTrap_en: `${item.learnerTrap_en} Archive trap: do not call this an integration step; only store stable reasoning for later A11.`,
      canadaPracticalExample_vi: canada.vi,
      canadaPracticalExample_en: canada.en,
      scriptAwareness_en:
        index === 0
          ? "Gurmukhi is primary; Shahmukhi is awareness only."
          : "Gurmukhi is primary; script awareness is awareness only.",
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2ArchiveSamples;
