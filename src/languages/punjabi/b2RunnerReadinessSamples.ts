// Punjabi B2 runner-readiness samples for automated upper-intermediate reasoning tests.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiB2PipelineReadinessSamples,
  type PunjabiB2PipelineReadinessSample,
  type PunjabiB2PipelineReadinessSamplesFocus,
  type PunjabiB2PipelineReadinessSamplesTopic,
} from "./b2PipelineReadinessSamples";

export type PunjabiB2RunnerReadinessSamplesFocus = PunjabiB2PipelineReadinessSamplesFocus;
export type PunjabiB2RunnerReadinessSamplesTopic = PunjabiB2PipelineReadinessSamplesTopic;

export type PunjabiB2RunnerReadinessSample = {
  id: string;
  level: "B2";
  runnerReadinessFocus: PunjabiB2RunnerReadinessSamplesFocus;
  topic: PunjabiB2RunnerReadinessSamplesTopic;
  runnerPrompt_gurmukhi: string;
  runnerPrompt_romanization: string;
  runnerPrompt_vi: string;
  runnerPrompt_en: string;
  runnerStableAnswer_gurmukhi: string;
  runnerStableAnswer_romanization: string;
  runnerStableAnswer_vi: string;
  runnerStableAnswer_en: string;
  runnerReadinessChecks_vi: string[];
  runnerReadinessChecks_en: string[];
  pipelineReadinessChecks_vi: string[];
  pipelineReadinessChecks_en: string[];
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

const runnerReadinessByFocus: Record<
  PunjabiB2RunnerReadinessSamplesFocus,
  {
    runnerVi: string[];
    runnerEn: string[];
    pipelineVi: string[];
    pipelineEn: string[];
    ciVi: string[];
    ciEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    runnerVi: ["Runner giữ stance", "Runner giữ evidence", "Runner giữ next step"],
    runnerEn: ["Runner keeps the stance", "Runner keeps evidence", "Runner keeps the next step"],
    pipelineVi: ["Pipeline có public-service chain", "Pipeline có deadline/documents", "Pipeline có action cuối"],
    pipelineEn: ["Pipeline has a public-service chain", "Pipeline has deadline/documents", "Pipeline has a final action"],
    ciVi: ["Test pass claim", "Test pass reason", "Test pass contact step"],
    ciEn: ["Test passes the claim", "Test passes the reason", "Test passes the contact step"],
    preVi: ["Không đổi opinion thành yes/no", "Không bỏ evidence", "Không bỏ action"],
    preEn: ["Do not turn the opinion into yes/no", "Do not drop evidence", "Do not drop the action"],
  },
  comparison: {
    runnerVi: ["Runner giữ option A", "Runner giữ option B", "Runner giữ tradeoff"],
    runnerEn: ["Runner keeps option A", "Runner keeps option B", "Runner keeps the tradeoff"],
    pipelineVi: ["Pipeline có rent", "Pipeline có commute", "Pipeline có transit reliability"],
    pipelineEn: ["Pipeline has rent", "Pipeline has commute", "Pipeline has transit reliability"],
    ciVi: ["Test pass utilities", "Test pass budget", "Test pass condition"],
    ciEn: ["Test passes utilities", "Test passes budget", "Test passes the condition"],
    preVi: ["Không bỏ cost", "Không biến thành preference", "Không đổi condition"],
    preEn: ["Do not drop cost", "Do not turn it into preference", "Do not change the condition"],
  },
  counterpoint: {
    runnerVi: ["Runner giữ acknowledgement", "Runner giữ exception", "Runner giữ respectful tone"],
    runnerEn: ["Runner keeps acknowledgment", "Runner keeps the exception", "Runner keeps respectful tone"],
    pipelineVi: ["Pipeline có queue rule", "Pipeline có urgent symptom", "Pipeline có safety reason"],
    pipelineEn: ["Pipeline has the queue rule", "Pipeline has urgent symptoms", "Pipeline has a safety reason"],
    ciVi: ["Test pass no-blame wording", "Test pass soft closing", "Test pass limited exception"],
    ciEn: ["Test passes no-blame wording", "Test passes soft closing", "Test passes the limited exception"],
    preVi: ["Không dùng always/never", "Không phản bác gắt", "Không biến exception thành rule"],
    preEn: ["Do not use always/never", "Do not rebut harshly", "Do not turn the exception into a rule"],
  },
  recommendation: {
    runnerVi: ["Runner giữ advice", "Runner giữ risk", "Runner giữ first step"],
    runnerEn: ["Runner keeps advice", "Runner keeps risk", "Runner keeps the first step"],
    pipelineVi: ["Pipeline có fees", "Pipeline có schedule", "Pipeline có support check"],
    pipelineEn: ["Pipeline has fees", "Pipeline has schedule", "Pipeline has a support check"],
    ciVi: ["Test pass condition", "Test pass advisor step", "Test pass no overpromise"],
    ciEn: ["Test passes condition", "Test passes advisor step", "Test passes no overpromiseing"],
    preVi: ["Không bỏ budget", "Không đổi thành absolute advice", "Không bỏ first check"],
    preEn: ["Do not drop budget", "Do not make advice absolute", "Do not drop the first check"],
  },
  workplace_fairness: {
    runnerVi: ["Runner giữ process", "Runner giữ workload evidence", "Runner giữ review method"],
    runnerEn: ["Runner keeps process", "Runner keeps workload evidence", "Runner keeps the review method"],
    pipelineVi: ["Pipeline có task board", "Pipeline có deadlines", "Pipeline có manager meeting"],
    pipelineEn: ["Pipeline has a task board", "Pipeline has deadlines", "Pipeline has a manager meeting"],
    ciVi: ["Test pass professional tone", "Test pass fair adjustment", "Test pass no blame"],
    ciEn: ["Test passes professional tone", "Test passes fair adjustment", "Test passes no blame"],
    preVi: ["Không cá nhân hóa", "Không bỏ meeting purpose", "Không bỏ evidence"],
    preEn: ["Do not personalize", "Do not drop the meeting purpose", "Do not drop evidence"],
  },
};

const runnerAnswerByFocus: Record<
  PunjabiB2RunnerReadinessSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "Runner-readiness sample stable ਹੈ ਜਦੋਂ public-service opinion ਵਿੱਚ stance, evidence ਅਤੇ next step automated test ਵਿੱਚ ਵੀ ਇਕੋ ਰਹਿੰਦੇ ਹਨ।",
    r: "Runner-readiness sample stable hai jadon public-service opinion vich stance, evidence ate next step automated test vich vii ikko rahinde han.",
    vi: "Sample runner-readiness ổn định khi opinion dịch vụ công giữ stance, evidence và next step trong automated test.",
    en: "A runner-readiness sample is stable when the public-service opinion keeps stance, evidence, and next step in automated tests.",
  },
  comparison: {
    g: "Runner-readiness sample comparison ਨੂੰ testable ਰੱਖਦਾ ਹੈ: rent, commute, utilities ਅਤੇ transit reliability ਨਾਲ condition ਸਪਸ਼ਟ ਰਹਿੰਦੀ ਹੈ।",
    r: "Runner-readiness sample comparison nu testable rakhdaa hai: rent, commute, utilities ate transit reliability naal condition spasht rahindii hai.",
    vi: "Sample runner-readiness giữ comparison testable: rent, commute, utilities và transit reliability làm condition rõ.",
    en: "A runner-readiness sample keeps the comparison testable: rent, commute, utilities, and transit reliability make the condition clear.",
  },
  counterpoint: {
    g: "Runner-readiness sample ਪਹਿਲਾਂ queue rule ਮੰਨਦਾ ਹੈ, ਫਿਰ urgent symptom ਲਈ limited exception ਦਿੰਦਾ ਹੈ, ਅਤੇ safety reason ਨੂੰ stable ਰੱਖਦਾ ਹੈ।",
    r: "Runner-readiness sample pahilaan queue rule manndaa hai, fir urgent symptom lai limited exception dindaa hai, ate safety reason nu stable rakhdaa hai.",
    vi: "Sample runner-readiness công nhận queue rule trước, rồi nêu ngoại lệ giới hạn cho triệu chứng khẩn, và giữ safety reason ổn định.",
    en: "A runner-readiness sample accepts the queue rule first, then gives a limited exception for urgent symptoms, and keeps the safety reason stable.",
  },
  recommendation: {
    g: "Runner-readiness sample recommendation ਨੂੰ conditional ਰੱਖਦਾ ਹੈ: fees, schedule ਅਤੇ support verify ਹੋਣ ਤੋਂ ਬਾਅਦ first advisor appointment ਲਓ।",
    r: "Runner-readiness sample recommendation nu conditional rakhdaa hai: fees, schedule ate support verify hon ton baad first advisor appointment lao.",
    vi: "Sample runner-readiness giữ recommendation có điều kiện: sau khi verify fees, schedule và support, đặt first advisor appointment.",
    en: "A runner-readiness sample keeps the recommendation conditional: after verifying fees, schedule, and support, book the first advisor appointment.",
  },
  workplace_fairness: {
    g: "Runner-readiness sample workplace fairness ਵਿੱਚ task board evidence, deadlines ਅਤੇ manager review meeting ਰੱਖਦਾ ਹੈ, ਤਾਂ request fair adjustment ਰਹਿੰਦੀ ਹੈ।",
    r: "Runner-readiness sample workplace fairness vich task board evidence, deadlines ate manager review meeting rakhdaa hai, taan request fair adjustment rahindii hai.",
    vi: "Sample runner-readiness trong workplace fairness giữ task board evidence, deadlines và manager review meeting, nên request vẫn là fair adjustment.",
    en: "A runner-readiness sample in workplace fairness keeps task-board evidence, deadlines, and the manager review meeting, so the request remains a fair adjustment.",
  },
};

export const punjabiB2RunnerReadinessSamples: PunjabiB2RunnerReadinessSample[] =
  punjabiB2PipelineReadinessSamples.map((item: PunjabiB2PipelineReadinessSample) => {
    const runner = runnerReadinessByFocus[item.pipelineReadinessFocus];
    const answer = runnerAnswerByFocus[item.pipelineReadinessFocus];

    return {
      id: item.id.replace("pipeline_readiness", "runner_readiness"),
      level: "B2",
      runnerReadinessFocus: item.pipelineReadinessFocus,
      topic: item.topic,
      runnerPrompt_gurmukhi: `${item.pipelinePrompt_gurmukhi} runner-readiness ਲਈ automated-test proof ਦਿਓ।`,
      runnerPrompt_romanization: `${item.pipelinePrompt_romanization} runner-readiness lai automated-test proof dio.`,
      runnerPrompt_vi: `${item.pipelinePrompt_vi} Hãy nêu automated-test proof cho runner-readiness.`,
      runnerPrompt_en: `${item.pipelinePrompt_en} Give automated-test proof for runner readiness.`,
      runnerStableAnswer_gurmukhi: answer.g,
      runnerStableAnswer_romanization: answer.r,
      runnerStableAnswer_vi: answer.vi,
      runnerStableAnswer_en: answer.en,
      runnerReadinessChecks_vi: runner.runnerVi,
      runnerReadinessChecks_en: runner.runnerEn,
      pipelineReadinessChecks_vi: runner.pipelineVi,
      pipelineReadinessChecks_en: runner.pipelineEn,
      ciReadinessChecks_vi: runner.ciVi,
      ciReadinessChecks_en: runner.ciEn,
      preIntegration_vi: runner.preVi,
      preIntegration_en: runner.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} Runner-readiness trap: không để automated test pass khi reasoning đã mất stance, tradeoff hoặc first step.`,
      learnerTrap_en: `${item.learnerTrap_en} Runner-readiness trap: do not let automated tests pass after reasoning loses the stance, tradeoff, or first step.`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2RunnerReadinessSamples;
