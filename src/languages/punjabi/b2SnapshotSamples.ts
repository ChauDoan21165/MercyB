// Punjabi B2 snapshot samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2ClosurePacketSamples,
  type PunjabiB2ClosurePacketSample,
  type PunjabiB2ClosurePacketSamplesFocus,
  type PunjabiB2ClosurePacketSamplesTopic,
} from "./b2ClosurePacketSamples";

export type PunjabiB2SnapshotSamplesFocus = PunjabiB2ClosurePacketSamplesFocus;
export type PunjabiB2SnapshotSamplesTopic = PunjabiB2ClosurePacketSamplesTopic;

export type PunjabiB2SnapshotSample = {
  id: string;
  level: "B2";
  snapshotFocus: PunjabiB2SnapshotSamplesFocus;
  topic: PunjabiB2SnapshotSamplesTopic;
  snapshotPrompt_gurmukhi: string;
  snapshotPrompt_romanization: string;
  snapshotPrompt_vi: string;
  snapshotPrompt_en: string;
  snapshotAnswer_gurmukhi: string;
  snapshotAnswer_romanization: string;
  snapshotAnswer_vi: string;
  snapshotAnswer_en: string;
  preA11Snapshot_vi: string[];
  preA11Snapshot_en: string[];
  closurePacketChecks_vi: string[];
  closurePacketChecks_en: string[];
  preMergeChecks_vi: string[];
  preMergeChecks_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const snapshotByFocus: Record<
  PunjabiB2SnapshotSamplesFocus,
  {
    snapshotVi: string[];
    snapshotEn: string[];
    closureVi: string[];
    closureEn: string[];
    mergeVi: string[];
    mergeEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    snapshotVi: ["Snapshot giữ stance", "Snapshot giữ evidence", "Snapshot giữ next step"],
    snapshotEn: ["Snapshot keeps the stance", "Snapshot keeps evidence", "Snapshot keeps the next step"],
    closureVi: ["Closure-packet giữ claim", "Closure-packet giữ evidence", "Closure-packet giữ action"],
    closureEn: ["Closure packet keeps the claim", "Closure packet keeps evidence", "Closure packet keeps the action"],
    mergeVi: ["Pre-merge giữ public-service reason", "Pre-merge giữ deadline/documents", "Pre-merge giữ contact step"],
    mergeEn: ["Pre-merge keeps the public-service reason", "Pre-merge keeps deadline/documents", "Pre-merge keeps the contact step"],
    preVi: ["Không đổi opinion", "Không bỏ evidence", "Không thêm claim mới"],
    preEn: ["Do not change the opinion", "Do not drop evidence", "Do not add a new claim"],
  },
  comparison: {
    snapshotVi: ["Snapshot giữ hai option", "Snapshot giữ tradeoff", "Snapshot giữ condition"],
    snapshotEn: ["Snapshot keeps two options", "Snapshot keeps the tradeoff", "Snapshot keeps the condition"],
    closureVi: ["Closure-packet giữ rent", "Closure-packet giữ commute", "Closure-packet giữ transit reliability"],
    closureEn: ["Closure packet keeps rent", "Closure packet keeps commute", "Closure packet keeps transit reliability"],
    mergeVi: ["Pre-merge giữ utilities", "Pre-merge giữ budget", "Pre-merge giữ cost"],
    mergeEn: ["Pre-merge keeps utilities", "Pre-merge keeps budget", "Pre-merge keeps cost"],
    preVi: ["Không làm một chiều", "Không bỏ option B", "Không đổi condition"],
    preEn: ["Do not make it one-sided", "Do not drop option B", "Do not change the condition"],
  },
  counterpoint: {
    snapshotVi: ["Snapshot giữ acknowledgement", "Snapshot giữ exception", "Snapshot giữ safety reason"],
    snapshotEn: ["Snapshot keeps acknowledgment", "Snapshot keeps the exception", "Snapshot keeps the safety reason"],
    closureVi: ["Closure-packet giữ queue rule", "Closure-packet giữ urgent symptom", "Closure-packet giữ respectful tone"],
    closureEn: ["Closure packet keeps the queue rule", "Closure packet keeps urgent symptoms", "Closure packet keeps respectful tone"],
    mergeVi: ["Pre-merge giữ no-blame wording", "Pre-merge giữ soft closing", "Pre-merge giữ limited exception"],
    mergeEn: ["Pre-merge keeps no-blame wording", "Pre-merge keeps soft closing", "Pre-merge keeps the limited exception"],
    preVi: ["Không dùng always/never", "Không phản bác gắt", "Không biến exception thành rule"],
    preEn: ["Do not use always/never", "Do not rebut harshly", "Do not turn the exception into a rule"],
  },
  recommendation: {
    snapshotVi: ["Snapshot giữ advice", "Snapshot giữ risk", "Snapshot giữ first step"],
    snapshotEn: ["Snapshot keeps advice", "Snapshot keeps risk", "Snapshot keeps the first step"],
    closureVi: ["Closure-packet giữ fees", "Closure-packet giữ schedule", "Closure-packet giữ support check"],
    closureEn: ["Closure packet keeps fees", "Closure packet keeps schedule", "Closure packet keeps the support check"],
    mergeVi: ["Pre-merge giữ condition", "Pre-merge giữ advisor step", "Pre-merge không overpromise"],
    mergeEn: ["Pre-merge keeps the condition", "Pre-merge keeps the advisor step", "Pre-merge does not overpromise"],
    preVi: ["Không bỏ budget", "Không đổi advice thành absolute", "Không bỏ first check"],
    preEn: ["Do not drop the budget", "Do not make advice absolute", "Do not drop the first check"],
  },
  workplace_fairness: {
    snapshotVi: ["Snapshot giữ process", "Snapshot giữ workload evidence", "Snapshot giữ review method"],
    snapshotEn: ["Snapshot keeps process", "Snapshot keeps workload evidence", "Snapshot keeps the review method"],
    closureVi: ["Closure-packet giữ task board", "Closure-packet giữ deadlines", "Closure-packet giữ manager meeting"],
    closureEn: ["Closure packet keeps the task board", "Closure packet keeps deadlines", "Closure packet keeps the manager meeting"],
    mergeVi: ["Pre-merge giữ professional tone", "Pre-merge giữ fair adjustment", "Pre-merge giữ no blame"],
    mergeEn: ["Pre-merge keeps professional tone", "Pre-merge keeps fair adjustment", "Pre-merge keeps no blame"],
    preVi: ["Không cá nhân hóa", "Không bỏ meeting purpose", "Không bỏ evidence"],
    preEn: ["Do not personalize", "Do not drop the meeting purpose", "Do not drop evidence"],
  },
};

const snapshotAnswerByFocus: Record<
  PunjabiB2SnapshotSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "Pre-A11 snapshot sample stable ਹੈ ਜਦੋਂ public-service opinion ਵਿੱਚ stance, evidence ਅਤੇ next step snapshot ਤੋਂ ਬਾਅਦ ਵੀ ਇਕੋ ਰਹਿੰਦੇ ਹਨ।",
    r: "Pre-A11 snapshot sample stable hai jadon public-service opinion vich stance, evidence ate next step snapshot ton baad vii ikko rahinde han.",
    vi: "Sample pre-A11 snapshot ổn định khi opinion dịch vụ công giữ stance, evidence và next step sau snapshot.",
    en: "A pre-A11 snapshot sample is stable when the public-service opinion keeps stance, evidence, and next step after the snapshot.",
  },
  comparison: {
    g: "Pre-A11 snapshot comparison rent, commute, utilities ਅਤੇ transit reliability ਨੂੰ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ tradeoff snapshot ਤੋਂ ਬਾਅਦ ਵੀ stable ਰਹਿੰਦਾ ਹੈ।",
    r: "Pre-A11 snapshot comparison rent, commute, utilities ate transit reliability nu ikatthe rakhdaa hai, is lai tradeoff snapshot ton baad vii stable rahindaa hai.",
    vi: "Pre-A11 snapshot comparison giữ rent, commute, utilities và transit reliability cùng nhau, nên tradeoff vẫn ổn định sau snapshot.",
    en: "The pre-A11 snapshot comparison keeps rent, commute, utilities, and transit reliability together, so the tradeoff stays stable after the snapshot.",
  },
  counterpoint: {
    g: "Pre-A11 snapshot counterpoint queue rule ਨੂੰ ਮੰਨਦਾ ਹੈ, urgent symptom ਲਈ limited exception ਰੱਖਦਾ ਹੈ, ਅਤੇ safety reason ਨੂੰ preference ਨਹੀਂ ਬਣਾਉਂਦਾ।",
    r: "Pre-A11 snapshot counterpoint queue rule nu manndaa hai, urgent symptom lai limited exception rakhdaa hai, ate safety reason nu preference nahi banaaundaa.",
    vi: "Pre-A11 snapshot cho counterpoint công nhận queue rule, giữ ngoại lệ giới hạn cho triệu chứng khẩn, và không biến safety reason thành preference.",
    en: "The pre-A11 snapshot counterpoint accepts the queue rule, keeps a limited exception for urgent symptoms, and does not turn the safety reason into preference.",
  },
  recommendation: {
    g: "Pre-A11 snapshot recommendation part-time program ਨੂੰ conditional ਰੱਖਦਾ ਹੈ: fees, schedule ਅਤੇ support verify ਹੋਣ ਤੋਂ ਬਾਅਦ first advisor step ਆਉਂਦਾ ਹੈ।",
    r: "Pre-A11 snapshot recommendation part-time program nu conditional rakhdaa hai: fees, schedule ate support verify hon ton baad first advisor step aaundaa hai.",
    vi: "Pre-A11 snapshot recommendation giữ chương trình bán thời gian có điều kiện: sau khi verify fees, schedule và support thì có first advisor step.",
    en: "The pre-A11 snapshot recommendation keeps the part-time program conditional: after fees, schedule, and support are verified, the first advisor step follows.",
  },
  workplace_fairness: {
    g: "Pre-A11 snapshot workplace answer task board evidence, deadlines ਅਤੇ manager review meeting ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ fair adjustment request blame ਨਹੀਂ ਬਣਦੀ।",
    r: "Pre-A11 snapshot workplace answer task board evidence, deadlines ate manager review meeting rakhdaa hai, is lai fair adjustment request blame nahi bandii.",
    vi: "Pre-A11 snapshot workplace answer giữ task board evidence, deadlines và manager review meeting, nên request fair adjustment không thành blame.",
    en: "The pre-A11 snapshot workplace answer keeps task-board evidence, deadlines, and the manager review meeting, so the fair-adjustment request does not become blame.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2SnapshotSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Canada example: newcomer settlement appointment at a community centre checks housing papers and transit options.",
    en: "Canada example: a newcomer settlement appointment at a community centre checks housing papers and transit options.",
  },
  education: {
    vi: "Canada example: a college student in Toronto compares part-time schedules before registration closes.",
    en: "Canada example: a college student in Toronto compares part-time schedules before registration closes.",
  },
  healthcare_access: {
    vi: "Canada example: a family on a waitlist asks a walk-in clinic about urgent access and follow-up steps.",
    en: "Canada example: a family on a waitlist asks a walk-in clinic about urgent access and follow-up steps.",
  },
  housing: {
    vi: "Canada example: a tenant in Vancouver reviews a rent increase and the notice date before replying.",
    en: "Canada example: a tenant in Vancouver reviews a rent increase and the notice date before replying.",
  },
  transport: {
    vi: "Canada example: a commuter in Calgary compares bus timing, transfer risk, and monthly pass cost.",
    en: "Canada example: a commuter in Calgary compares bus timing, transfer risk, and monthly pass cost.",
  },
  public_service: {
    vi: "Canada example: a Service Canada or CRA call checks deadlines, documents, and the next contact step.",
    en: "Canada example: a Service Canada or CRA call checks deadlines, documents, and the next contact step.",
  },
  work: {
    vi: "Canada example: a shift worker in Edmonton asks for a schedule adjustment using task-board evidence.",
    en: "Canada example: a shift worker in Edmonton asks for a schedule adjustment using task-board evidence.",
  },
};

export const punjabiB2SnapshotSamples: PunjabiB2SnapshotSample[] =
  punjabiB2ClosurePacketSamples.map((item: PunjabiB2ClosurePacketSample, index: number) => {
    const snapshot = snapshotByFocus[item.closurePacketFocus];
    const answer = snapshotAnswerByFocus[item.closurePacketFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? { vi: item.canadaPracticalExample_vi, en: item.canadaPracticalExample_en }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("closure_packet", "snapshot"),
      level: "B2",
      snapshotFocus: item.closurePacketFocus,
      topic: item.topic,
      snapshotPrompt_gurmukhi: `${item.closurePrompt_gurmukhi} pre-A11-snapshot ਲਈ stable reasoning freeze ਕਰੋ।`,
      snapshotPrompt_romanization: `${item.closurePrompt_romanization} pre-A11-snapshot lai stable reasoning freeze karo.`,
      snapshotPrompt_vi: `${item.closurePrompt_vi} Hãy freeze stable reasoning cho pre-A11-snapshot.`,
      snapshotPrompt_en: `${item.closurePrompt_en} Freeze stable reasoning for the pre-A11 snapshot.`,
      snapshotAnswer_gurmukhi: answer.g,
      snapshotAnswer_romanization: answer.r,
      snapshotAnswer_vi: answer.vi,
      snapshotAnswer_en: answer.en,
      preA11Snapshot_vi: snapshot.snapshotVi,
      preA11Snapshot_en: snapshot.snapshotEn,
      closurePacketChecks_vi: snapshot.closureVi,
      closurePacketChecks_en: snapshot.closureEn,
      preMergeChecks_vi: snapshot.mergeVi,
      preMergeChecks_en: snapshot.mergeEn,
      preIntegration_vi: snapshot.preVi,
      preIntegration_en: snapshot.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} Snapshot trap: không gọi đây là integration step; chỉ freeze stable reasoning cho later A11.`,
      learnerTrap_en: `${item.learnerTrap_en} Snapshot trap: do not call this an integration step; only freeze stable reasoning for later A11.`,
      canadaPracticalExample_vi: canada.vi,
      canadaPracticalExample_en: canada.en,
      scriptAwareness_en:
        index === 0
          ? "Gurmukhi is primary; Shahmukhi is awareness only."
          : "Gurmukhi is primary; script awareness is awareness only.",
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2SnapshotSamples;
