// Punjabi B2 pre-A11 checksum samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2RunnerReadinessSamples,
  type PunjabiB2RunnerReadinessSample,
  type PunjabiB2RunnerReadinessSamplesFocus,
  type PunjabiB2RunnerReadinessSamplesTopic,
} from "./b2RunnerReadinessSamples";

export type PunjabiB2PreA11ChecksumSamplesFocus = PunjabiB2RunnerReadinessSamplesFocus;
export type PunjabiB2PreA11ChecksumSamplesTopic = PunjabiB2RunnerReadinessSamplesTopic;

export type PunjabiB2PreA11ChecksumSample = {
  id: string;
  level: "B2";
  checksumFocus: PunjabiB2PreA11ChecksumSamplesFocus;
  topic: PunjabiB2PreA11ChecksumSamplesTopic;
  checksumPrompt_gurmukhi: string;
  checksumPrompt_romanization: string;
  checksumPrompt_vi: string;
  checksumPrompt_en: string;
  checksumAnswer_gurmukhi: string;
  checksumAnswer_romanization: string;
  checksumAnswer_vi: string;
  checksumAnswer_en: string;
  preA11Checksum_vi: string[];
  preA11Checksum_en: string[];
  runnerReadinessChecks_vi: string[];
  runnerReadinessChecks_en: string[];
  pipelineReadinessChecks_vi: string[];
  pipelineReadinessChecks_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const checksumByFocus: Record<
  PunjabiB2PreA11ChecksumSamplesFocus,
  {
    checksumVi: string[];
    checksumEn: string[];
    runnerVi: string[];
    runnerEn: string[];
    pipelineVi: string[];
    pipelineEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    checksumVi: ["Checksum stance", "Checksum evidence", "Checksum next step"],
    checksumEn: ["Checksum the stance", "Checksum evidence", "Checksum the next step"],
    runnerVi: ["Runner giữ public-service claim", "Runner giữ deadline/documents", "Runner giữ contact step"],
    runnerEn: ["Runner keeps the public-service claim", "Runner keeps deadline/documents", "Runner keeps the contact step"],
    pipelineVi: ["Pipeline chain có reason", "Pipeline chain có action", "Pipeline chain không đổi topic"],
    pipelineEn: ["Pipeline chain has a reason", "Pipeline chain has an action", "Pipeline chain does not change topic"],
    preVi: ["Không đổi opinion", "Không bỏ evidence", "Không thêm claim mới"],
    preEn: ["Do not change the opinion", "Do not drop evidence", "Do not add a new claim"],
  },
  comparison: {
    checksumVi: ["Checksum hai option", "Checksum tradeoff", "Checksum condition"],
    checksumEn: ["Checksum two options", "Checksum the tradeoff", "Checksum the condition"],
    runnerVi: ["Runner giữ rent", "Runner giữ commute", "Runner giữ transit reliability"],
    runnerEn: ["Runner keeps rent", "Runner keeps commute", "Runner keeps transit reliability"],
    pipelineVi: ["Pipeline chain có utilities", "Pipeline chain có budget", "Pipeline chain có cost"],
    pipelineEn: ["Pipeline chain has utilities", "Pipeline chain has budget", "Pipeline chain has cost"],
    preVi: ["Không làm một chiều", "Không bỏ option B", "Không đổi condition"],
    preEn: ["Do not make it one-sided", "Do not drop option B", "Do not change the condition"],
  },
  counterpoint: {
    checksumVi: ["Checksum acknowledgement", "Checksum exception", "Checksum safety reason"],
    checksumEn: ["Checksum acknowledgment", "Checksum the exception", "Checksum the safety reason"],
    runnerVi: ["Runner giữ queue rule", "Runner giữ urgent symptom", "Runner giữ respectful tone"],
    runnerEn: ["Runner keeps the queue rule", "Runner keeps urgent symptoms", "Runner keeps respectful tone"],
    pipelineVi: ["Pipeline chain có no-blame wording", "Pipeline chain có soft closing", "Pipeline chain có limited exception"],
    pipelineEn: ["Pipeline chain has no-blame wording", "Pipeline chain has a soft closing", "Pipeline chain has a limited exception"],
    preVi: ["Không dùng always/never", "Không phản bác gắt", "Không biến exception thành rule"],
    preEn: ["Do not use always/never", "Do not rebut harshly", "Do not turn the exception into a rule"],
  },
  recommendation: {
    checksumVi: ["Checksum advice", "Checksum risk", "Checksum first step"],
    checksumEn: ["Checksum advice", "Checksum risk", "Checksum the first step"],
    runnerVi: ["Runner giữ fees", "Runner giữ schedule", "Runner giữ support check"],
    runnerEn: ["Runner keeps fees", "Runner keeps schedule", "Runner keeps the support check"],
    pipelineVi: ["Pipeline chain có condition", "Pipeline chain có advisor appointment", "Pipeline chain không overpromise"],
    pipelineEn: ["Pipeline chain has a condition", "Pipeline chain has an advisor appointment", "Pipeline chain does not overpromise"],
    preVi: ["Không bỏ budget", "Không đổi advice thành absolute", "Không bỏ first check"],
    preEn: ["Do not drop the budget", "Do not make advice absolute", "Do not drop the first check"],
  },
  workplace_fairness: {
    checksumVi: ["Checksum process", "Checksum workload evidence", "Checksum review method"],
    checksumEn: ["Checksum process", "Checksum workload evidence", "Checksum the review method"],
    runnerVi: ["Runner giữ task board", "Runner giữ deadlines", "Runner giữ manager meeting"],
    runnerEn: ["Runner keeps the task board", "Runner keeps deadlines", "Runner keeps the manager meeting"],
    pipelineVi: ["Pipeline chain có fair adjustment", "Pipeline chain không blame", "Pipeline chain có professional tone"],
    pipelineEn: ["Pipeline chain has fair adjustment", "Pipeline chain has no blame", "Pipeline chain has professional tone"],
    preVi: ["Không cá nhân hóa", "Không bỏ meeting purpose", "Không bỏ evidence"],
    preEn: ["Do not personalize", "Do not drop the meeting purpose", "Do not drop evidence"],
  },
};

const checksumAnswerByFocus: Record<
  PunjabiB2PreA11ChecksumSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "Pre-A11 checksum sample stable ਹੈ ਜਦੋਂ public-service opinion ਵਿੱਚ stance, evidence ਅਤੇ next step ਬਦਲੇ ਬਿਨਾਂ later A11 ਲਈ ਰੱਖੇ ਜਾਂਦੇ ਹਨ।",
    r: "Pre-A11 checksum sample stable hai jadon public-service opinion vich stance, evidence ate next step badle binaa later A11 lai rakhe jaande han.",
    vi: "Sample pre-A11 checksum ổn định khi opinion dịch vụ công giữ stance, evidence và next step không đổi cho A11 sau này.",
    en: "A pre-A11 checksum sample is stable when the public-service opinion keeps stance, evidence, and next step unchanged for later A11.",
  },
  comparison: {
    g: "Pre-A11 checksum comparison ਵਿੱਚ rent, commute, utilities ਅਤੇ transit reliability ਇਕੱਠੇ ਰਹਿੰਦੇ ਹਨ, ਤਾਂ tradeoff later A11 ਤੋਂ ਪਹਿਲਾਂ ਵੀ stable ਹੈ।",
    r: "Pre-A11 checksum comparison vich rent, commute, utilities ate transit reliability ikatthe rahinde han, taan tradeoff later A11 ton pahilaan vii stable hai.",
    vi: "Pre-A11 checksum cho comparison giữ rent, commute, utilities và transit reliability cùng nhau, nên tradeoff vẫn ổn định trước A11 sau này.",
    en: "The pre-A11 checksum comparison keeps rent, commute, utilities, and transit reliability together, so the tradeoff is stable before later A11.",
  },
  counterpoint: {
    g: "Pre-A11 checksum counterpoint queue rule ਨੂੰ ਮੰਨਦਾ ਹੈ, urgent symptom ਲਈ limited exception ਰੱਖਦਾ ਹੈ, ਅਤੇ safety reason ਨੂੰ preference ਨਹੀਂ ਬਣਾਉਂਦਾ।",
    r: "Pre-A11 checksum counterpoint queue rule nu manndaa hai, urgent symptom lai limited exception rakhdaa hai, ate safety reason nu preference nahi banaaundaa.",
    vi: "Pre-A11 checksum cho counterpoint công nhận queue rule, giữ ngoại lệ giới hạn cho triệu chứng khẩn, và không biến safety reason thành preference.",
    en: "The pre-A11 checksum counterpoint accepts the queue rule, keeps a limited exception for urgent symptoms, and does not turn the safety reason into preference.",
  },
  recommendation: {
    g: "Pre-A11 checksum recommendation part-time program ਨੂੰ conditional ਰੱਖਦਾ ਹੈ: fees, schedule ਅਤੇ support verify ਹੋਣ ਤੋਂ ਬਾਅਦ first advisor step ਆਉਂਦਾ ਹੈ।",
    r: "Pre-A11 checksum recommendation part-time program nu conditional rakhdaa hai: fees, schedule ate support verify hon ton baad first advisor step aaundaa hai.",
    vi: "Pre-A11 checksum cho recommendation giữ chương trình bán thời gian có điều kiện: sau khi verify fees, schedule và support thì có first advisor step.",
    en: "The pre-A11 checksum recommendation keeps the part-time program conditional: after fees, schedule, and support are verified, the first advisor step follows.",
  },
  workplace_fairness: {
    g: "Pre-A11 checksum workplace answer task board evidence, deadlines ਅਤੇ manager review meeting ਰੱਖਦਾ ਹੈ, ਇਸ ਲਈ fair adjustment request blame ਨਹੀਂ ਬਣਦੀ।",
    r: "Pre-A11 checksum workplace answer task board evidence, deadlines ate manager review meeting rakhdaa hai, is lai fair adjustment request blame nahi bandii.",
    vi: "Pre-A11 checksum cho workplace answer giữ task board evidence, deadlines và manager review meeting, nên request fair adjustment không thành blame.",
    en: "The pre-A11 checksum workplace answer keeps task-board evidence, deadlines, and the manager review meeting, so the fair-adjustment request does not become blame.",
  },
};

export const punjabiB2PreA11ChecksumSamples: PunjabiB2PreA11ChecksumSample[] =
  punjabiB2RunnerReadinessSamples.map((item: PunjabiB2RunnerReadinessSample) => {
    const checksum = checksumByFocus[item.runnerReadinessFocus];
    const answer = checksumAnswerByFocus[item.runnerReadinessFocus];

    return {
      id: item.id.replace("runner_readiness", "pre_a11_checksum"),
      level: "B2",
      checksumFocus: item.runnerReadinessFocus,
      topic: item.topic,
      checksumPrompt_gurmukhi: `${item.runnerPrompt_gurmukhi} pre-A11-checksum ਲਈ stable content verify ਕਰੋ।`,
      checksumPrompt_romanization: `${item.runnerPrompt_romanization} pre-A11-checksum lai stable content verify karo.`,
      checksumPrompt_vi: `${item.runnerPrompt_vi} Hãy verify stable content cho pre-A11-checksum.`,
      checksumPrompt_en: `${item.runnerPrompt_en} Verify stable content for the pre-A11 checksum.`,
      checksumAnswer_gurmukhi: answer.g,
      checksumAnswer_romanization: answer.r,
      checksumAnswer_vi: answer.vi,
      checksumAnswer_en: answer.en,
      preA11Checksum_vi: checksum.checksumVi,
      preA11Checksum_en: checksum.checksumEn,
      runnerReadinessChecks_vi: checksum.runnerVi,
      runnerReadinessChecks_en: checksum.runnerEn,
      pipelineReadinessChecks_vi: checksum.pipelineVi,
      pipelineReadinessChecks_en: checksum.pipelineEn,
      preIntegration_vi: checksum.preVi,
      preIntegration_en: checksum.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} Pre-A11-checksum trap: không gọi đây là bước tích hợp A11; chỉ xác nhận nội dung reasoning đã ổn định.`,
      learnerTrap_en: `${item.learnerTrap_en} Pre-A11-checksum trap: do not call this an A11 merge step; only confirm that reasoning content is stable.`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2PreA11ChecksumSamples;
