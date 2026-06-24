// Punjabi B2 pre-merge samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2PreA11ChecksumSamples,
  type PunjabiB2PreA11ChecksumSample,
  type PunjabiB2PreA11ChecksumSamplesFocus,
  type PunjabiB2PreA11ChecksumSamplesTopic,
} from "./b2PreA11ChecksumSamples";

export type PunjabiB2PreMergeSamplesFocus = PunjabiB2PreA11ChecksumSamplesFocus;
export type PunjabiB2PreMergeSamplesTopic = PunjabiB2PreA11ChecksumSamplesTopic;

export type PunjabiB2PreMergeSample = {
  id: string;
  level: "B2";
  preMergeFocus: PunjabiB2PreMergeSamplesFocus;
  topic: PunjabiB2PreMergeSamplesTopic;
  preMergePrompt_gurmukhi: string;
  preMergePrompt_romanization: string;
  preMergePrompt_vi: string;
  preMergePrompt_en: string;
  preMergeAnswer_gurmukhi: string;
  preMergeAnswer_romanization: string;
  preMergeAnswer_vi: string;
  preMergeAnswer_en: string;
  preMergeChecks_vi: string[];
  preMergeChecks_en: string[];
  preA11Checksum_vi: string[];
  preA11Checksum_en: string[];
  runnerReadinessChecks_vi: string[];
  runnerReadinessChecks_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const preMergeByFocus: Record<
  PunjabiB2PreMergeSamplesFocus,
  {
    mergeVi: string[];
    mergeEn: string[];
    checksumVi: string[];
    checksumEn: string[];
    runnerVi: string[];
    runnerEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    mergeVi: ["Pre-merge giữ stance", "Pre-merge giữ evidence", "Pre-merge giữ next step"],
    mergeEn: ["Pre-merge keeps the stance", "Pre-merge keeps evidence", "Pre-merge keeps the next step"],
    checksumVi: ["Checksum public-service claim", "Checksum deadline/documents", "Checksum contact step"],
    checksumEn: ["Checksum the public-service claim", "Checksum deadline/documents", "Checksum the contact step"],
    runnerVi: ["Runner pass claim", "Runner pass reason", "Runner pass action"],
    runnerEn: ["Runner passes the claim", "Runner passes the reason", "Runner passes the action"],
    preVi: ["Không đổi opinion", "Không bỏ evidence", "Không thêm claim mới"],
    preEn: ["Do not change the opinion", "Do not drop evidence", "Do not add a new claim"],
  },
  comparison: {
    mergeVi: ["Pre-merge giữ hai option", "Pre-merge giữ tradeoff", "Pre-merge giữ condition"],
    mergeEn: ["Pre-merge keeps two options", "Pre-merge keeps the tradeoff", "Pre-merge keeps the condition"],
    checksumVi: ["Checksum rent", "Checksum commute", "Checksum transit reliability"],
    checksumEn: ["Checksum rent", "Checksum commute", "Checksum transit reliability"],
    runnerVi: ["Runner pass utilities", "Runner pass budget", "Runner pass cost"],
    runnerEn: ["Runner passes utilities", "Runner passes budget", "Runner passes cost"],
    preVi: ["Không một chiều", "Không bỏ option B", "Không đổi condition"],
    preEn: ["Do not make it one-sided", "Do not drop option B", "Do not change the condition"],
  },
  counterpoint: {
    mergeVi: ["Pre-merge giữ acknowledgement", "Pre-merge giữ exception", "Pre-merge giữ safety reason"],
    mergeEn: ["Pre-merge keeps acknowledgment", "Pre-merge keeps the exception", "Pre-merge keeps the safety reason"],
    checksumVi: ["Checksum queue rule", "Checksum urgent symptom", "Checksum respectful tone"],
    checksumEn: ["Checksum the queue rule", "Checksum urgent symptoms", "Checksum respectful tone"],
    runnerVi: ["Runner pass no-blame wording", "Runner pass soft closing", "Runner pass limited exception"],
    runnerEn: ["Runner passes no-blame wording", "Runner passes soft closing", "Runner passes limited exception"],
    preVi: ["Không dùng always/never", "Không phản bác gắt", "Không biến exception thành rule"],
    preEn: ["Do not use always/never", "Do not rebut harshly", "Do not turn the exception into a rule"],
  },
  recommendation: {
    mergeVi: ["Pre-merge giữ advice", "Pre-merge giữ risk", "Pre-merge giữ first step"],
    mergeEn: ["Pre-merge keeps advice", "Pre-merge keeps risk", "Pre-merge keeps the first step"],
    checksumVi: ["Checksum fees", "Checksum schedule", "Checksum support check"],
    checksumEn: ["Checksum fees", "Checksum schedule", "Checksum the support check"],
    runnerVi: ["Runner pass condition", "Runner pass advisor step", "Runner pass no overpromise"],
    runnerEn: ["Runner passes condition", "Runner passes advisor step", "Runner passes no overpromise"],
    preVi: ["Không bỏ budget", "Không đổi advice thành absolute", "Không bỏ first check"],
    preEn: ["Do not drop the budget", "Do not make advice absolute", "Do not drop the first check"],
  },
  workplace_fairness: {
    mergeVi: ["Pre-merge giữ process", "Pre-merge giữ workload evidence", "Pre-merge giữ review method"],
    mergeEn: ["Pre-merge keeps process", "Pre-merge keeps workload evidence", "Pre-merge keeps the review method"],
    checksumVi: ["Checksum task board", "Checksum deadlines", "Checksum manager meeting"],
    checksumEn: ["Checksum the task board", "Checksum deadlines", "Checksum the manager meeting"],
    runnerVi: ["Runner pass professional tone", "Runner pass fair adjustment", "Runner pass no blame"],
    runnerEn: ["Runner passes professional tone", "Runner passes fair adjustment", "Runner passes no blame"],
    preVi: ["Không cá nhân hóa", "Không bỏ meeting purpose", "Không bỏ evidence"],
    preEn: ["Do not personalize", "Do not drop the meeting purpose", "Do not drop evidence"],
  },
};

const preMergeAnswerByFocus: Record<
  PunjabiB2PreMergeSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "Pre-merge sample stable ਹੈ ਜਦੋਂ public-service opinion ਵਿੱਚ stance, evidence ਅਤੇ next step merge ਤੋਂ ਪਹਿਲਾਂ ਵੀ ਨਹੀਂ ਬਦਲਦੇ।",
    r: "Pre-merge sample stable hai jadon public-service opinion vich stance, evidence ate next step merge ton pahilaan vii nahi badalde.",
    vi: "Sample pre-merge ổn định khi opinion dịch vụ công giữ stance, evidence và next step không đổi trước merge.",
    en: "A pre-merge sample is stable when the public-service opinion keeps stance, evidence, and next step unchanged before merge.",
  },
  comparison: {
    g: "Pre-merge comparison rent, commute, utilities ਅਤੇ transit reliability ਨੂੰ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ tradeoff merge ਤੋਂ ਪਹਿਲਾਂ testable ਰਹਿੰਦਾ ਹੈ।",
    r: "Pre-merge comparison rent, commute, utilities ate transit reliability nu ikatthe rakhdaa hai, is lai tradeoff merge ton pahilaan testable rahindaa hai.",
    vi: "Pre-merge comparison giữ rent, commute, utilities và transit reliability cùng nhau, nên tradeoff vẫn testable trước merge.",
    en: "The pre-merge comparison keeps rent, commute, utilities, and transit reliability together, so the tradeoff remains testable before merge.",
  },
  counterpoint: {
    g: "Pre-merge counterpoint queue rule ਨੂੰ ਮੰਨਦਾ ਹੈ ਅਤੇ urgent symptom ਲਈ limited exception ਰੱਖਦਾ ਹੈ; safety reason stable ਰਹਿੰਦਾ ਹੈ।",
    r: "Pre-merge counterpoint queue rule nu manndaa hai ate urgent symptom lai limited exception rakhdaa hai; safety reason stable rahindaa hai.",
    vi: "Pre-merge counterpoint công nhận queue rule và giữ ngoại lệ giới hạn cho triệu chứng khẩn; safety reason vẫn ổn định.",
    en: "The pre-merge counterpoint accepts the queue rule and keeps a limited exception for urgent symptoms; the safety reason stays stable.",
  },
  recommendation: {
    g: "Pre-merge recommendation part-time program ਨੂੰ conditional ਰੱਖਦਾ ਹੈ: fees, schedule ਅਤੇ support verify ਹੋਣ ਤੋਂ ਬਾਅਦ advisor step ਆਉਂਦਾ ਹੈ।",
    r: "Pre-merge recommendation part-time program nu conditional rakhdaa hai: fees, schedule ate support verify hon ton baad advisor step aaundaa hai.",
    vi: "Pre-merge recommendation giữ chương trình bán thời gian có điều kiện: sau khi verify fees, schedule và support thì có advisor step.",
    en: "The pre-merge recommendation keeps the part-time program conditional: after fees, schedule, and support are verified, the advisor step follows.",
  },
  workplace_fairness: {
    g: "Pre-merge workplace answer task board evidence, deadlines ਅਤੇ manager review meeting ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ fair adjustment request blame ਨਹੀਂ ਬਣਦੀ।",
    r: "Pre-merge workplace answer task board evidence, deadlines ate manager review meeting rakhdaa hai, is lai fair adjustment request blame nahi bandii.",
    vi: "Pre-merge workplace answer giữ task board evidence, deadlines và manager review meeting, nên request fair adjustment không thành blame.",
    en: "The pre-merge workplace answer keeps task-board evidence, deadlines, and the manager review meeting, so the fair-adjustment request does not become blame.",
  },
};

export const punjabiB2PreMergeSamples: PunjabiB2PreMergeSample[] =
  punjabiB2PreA11ChecksumSamples.map((item: PunjabiB2PreA11ChecksumSample) => {
    const merge = preMergeByFocus[item.checksumFocus];
    const answer = preMergeAnswerByFocus[item.checksumFocus];

    return {
      id: item.id.replace("pre_a11_checksum", "pre_merge"),
      level: "B2",
      preMergeFocus: item.checksumFocus,
      topic: item.topic,
      preMergePrompt_gurmukhi: `${item.checksumPrompt_gurmukhi} pre-merge ਲਈ stable reasoning ਚੈੱਕ ਕਰੋ।`,
      preMergePrompt_romanization: `${item.checksumPrompt_romanization} pre-merge lai stable reasoning check karo.`,
      preMergePrompt_vi: `${item.checksumPrompt_vi} Hãy kiểm tra stable reasoning cho pre-merge.`,
      preMergePrompt_en: `${item.checksumPrompt_en} Check stable reasoning for pre-merge.`,
      preMergeAnswer_gurmukhi: answer.g,
      preMergeAnswer_romanization: answer.r,
      preMergeAnswer_vi: answer.vi,
      preMergeAnswer_en: answer.en,
      preMergeChecks_vi: merge.mergeVi,
      preMergeChecks_en: merge.mergeEn,
      preA11Checksum_vi: merge.checksumVi,
      preA11Checksum_en: merge.checksumEn,
      runnerReadinessChecks_vi: merge.runnerVi,
      runnerReadinessChecks_en: merge.runnerEn,
      preIntegration_vi: merge.preVi,
      preIntegration_en: merge.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} Pre-merge trap: không đổi reasoning chỉ để làm wording trông mới hơn.`,
      learnerTrap_en: `${item.learnerTrap_en} Pre-merge trap: do not change reasoning just to make wording look newer.`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2PreMergeSamples;
