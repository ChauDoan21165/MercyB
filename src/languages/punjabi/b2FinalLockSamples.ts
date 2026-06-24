// Punjabi B2 final-lock samples for upper-intermediate release review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2FinalLockSamplesFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2FinalLockSamplesTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2FinalLockSample = {
  id: string;
  level: "B2";
  finalLockFocus: PunjabiB2FinalLockSamplesFocus;
  topic: PunjabiB2FinalLockSamplesTopic;
  finalLockPrompt_gurmukhi: string;
  finalLockPrompt_romanization: string;
  finalLockPrompt_vi: string;
  finalLockPrompt_en: string;
  lockedAnswer_gurmukhi: string;
  lockedAnswer_romanization: string;
  lockedAnswer_vi: string;
  lockedAnswer_en: string;
  finalLockCriteria_vi: string[];
  finalLockCriteria_en: string[];
  ownerAcceptance_vi: string[];
  ownerAcceptance_en: string[];
  finalAcceptance_vi: string[];
  finalAcceptance_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const finalLockByFocus: Record<
  PunjabiB2FinalLockSamplesFocus,
  {
    lockVi: string[];
    lockEn: string[];
    ownerVi: string[];
    ownerEn: string[];
    finalVi: string[];
    finalEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    lockVi: ["Lock stance chính", "Lock evidence kiểm tra được", "Lock next step cụ thể"],
    lockEn: ["Lock the main stance", "Lock checkable evidence", "Lock the specific next step"],
    ownerVi: ["Owner accepts claim rõ", "Owner accepts public-service context", "Owner accepts action thực tế"],
    ownerEn: ["Owner accepts a clear claim", "Owner accepts the public-service context", "Owner accepts a practical action"],
    finalVi: ["Reason không đổi topic", "Conclusion nối với evidence", "Không thêm claim mới"],
    finalEn: ["Reason does not change topic", "Conclusion connects to evidence", "No new claim is added"],
    preVi: ["Freeze claim", "Freeze evidence", "Freeze action"],
    preEn: ["Freeze the claim", "Freeze the evidence", "Freeze the action"],
  },
  comparison: {
    lockVi: ["Lock hai lựa chọn", "Lock tradeoff và cost", "Lock condition để chọn"],
    lockEn: ["Lock two choices", "Lock tradeoff and cost", "Lock the choosing condition"],
    ownerVi: ["Owner accepts balance", "Owner accepts cost rõ", "Owner accepts advice có điều kiện"],
    ownerEn: ["Owner accepts balance", "Owner accepts clear cost", "Owner accepts conditional advice"],
    finalVi: ["Không thiên một phía", "Không bỏ commute hoặc budget", "Conclusion dựa trên condition"],
    finalEn: ["Not one-sided", "Does not drop commute or budget", "Conclusion is based on the condition"],
    preVi: ["Freeze option A", "Freeze option B", "Freeze condition"],
    preEn: ["Freeze option A", "Freeze option B", "Freeze the condition"],
  },
  counterpoint: {
    lockVi: ["Lock acknowledgement trước", "Lock exception có evidence", "Lock tone lịch sự"],
    lockEn: ["Lock acknowledgment first", "Lock an evidence-based exception", "Lock polite tone"],
    ownerVi: ["Owner accepts respectful disagreement", "Owner accepts safety reason", "Owner accepts no-blame wording"],
    ownerEn: ["Owner accepts respectful disagreement", "Owner accepts the safety reason", "Owner accepts no-blame wording"],
    finalVi: ["Không dùng always/never", "Không phản bác gắt", "Exception có giới hạn"],
    finalEn: ["No always/never wording", "No harsh rebuttal", "Exception has a limit"],
    preVi: ["Freeze acknowledgement", "Freeze exception", "Freeze soft closing"],
    preEn: ["Freeze acknowledgment", "Freeze exception", "Freeze the soft closing"],
  },
  recommendation: {
    lockVi: ["Lock recommendation có điều kiện", "Lock risk", "Lock first step"],
    lockEn: ["Lock a conditional recommendation", "Lock the risk", "Lock the first step"],
    ownerVi: ["Owner accepts evidence-based advice", "Owner accepts budget or schedule constraint", "Owner accepts first check"],
    ownerEn: ["Owner accepts evidence-based advice", "Owner accepts the budget or schedule constraint", "Owner accepts the first check"],
    finalVi: ["Không hứa quá mức", "Không bỏ constraint", "Step đầu có thể làm"],
    finalEn: ["Does not overpromise", "Does not drop the constraint", "First step is doable"],
    preVi: ["Freeze advice", "Freeze risk", "Freeze first check"],
    preEn: ["Freeze the advice", "Freeze the risk", "Freeze the first check"],
  },
  workplace_fairness: {
    lockVi: ["Lock process", "Lock workload evidence", "Lock review method"],
    lockEn: ["Lock the process", "Lock workload evidence", "Lock the review method"],
    ownerVi: ["Owner accepts professional tone", "Owner accepts task-board evidence", "Owner accepts fair adjustment"],
    ownerEn: ["Owner accepts professional tone", "Owner accepts task-board evidence", "Owner accepts fair adjustment"],
    finalVi: ["Không blame cá nhân", "Deadline rõ", "Meeting purpose rõ"],
    finalEn: ["No personal blame", "Deadlines are clear", "Meeting purpose is clear"],
    preVi: ["Freeze task board", "Freeze deadline", "Freeze review meeting"],
    preEn: ["Freeze the task board", "Freeze the deadline", "Freeze the review meeting"],
  },
};

const finalLockPromptByFocus: Record<
  PunjabiB2FinalLockSamplesFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Final-lock kiểm tra stance, evidence và action trước khi đóng nội dung.",
    en: "Final lock checks stance, evidence, and action before freezing the content.",
  },
  comparison: {
    vi: "Final-lock kiểm tra comparison có hai option, tradeoff và condition ổn định chưa.",
    en: "Final lock checks whether the comparison has stable options, tradeoff, and condition.",
  },
  counterpoint: {
    vi: "Final-lock kiểm tra counterpoint có acknowledgement, evidence và tone mềm chưa.",
    en: "Final lock checks whether the counterpoint has acknowledgment, evidence, and soft tone.",
  },
  recommendation: {
    vi: "Final-lock kiểm tra recommendation có evidence, risk và first step thực tế chưa.",
    en: "Final lock checks whether the recommendation has evidence, risk, and a practical first step.",
  },
  workplace_fairness: {
    vi: "Final-lock kiểm tra workplace answer có process, evidence và review method chưa.",
    en: "Final lock checks whether the workplace answer has process, evidence, and review method.",
  },
};

const lockedAnswerByFocus: Record<
  PunjabiB2FinalLockSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ settlement office ਦੀ ਚਿੱਠੀ final-lock ਲਈ ਤਿਆਰ ਹੈ ਜੇ deadline, documents ਅਤੇ contact step ਸਧਾਰਨ ਭਾਸ਼ਾ ਵਿੱਚ ਰਹਿੰਦੇ ਹਨ; learner ਨੂੰ ਅਗਲਾ ਕਦਮ ਬਿਨਾਂ ਅਨੁਮਾਨ ਦੇ ਮਿਲਦਾ ਹੈ।",
    r: "mere vichaar vich settlement office di chitthi final-lock lai tiaar hai je deadline, documents ate contact step sadhaaran bhaashaa vich rahinde han; learner nu aglaa kadam binaa anumaan de mildaa hai.",
    vi: "Theo tôi, thư của văn phòng định cư sẵn sàng final-lock nếu hạn chót, giấy tờ và bước liên hệ vẫn dùng ngôn ngữ đơn giản; người học biết bước tiếp theo mà không phải đoán.",
    en: "In my view, a settlement office letter is ready for final lock if the deadline, documents, and contact step stay in plain language; the learner gets the next step without guessing.",
  },
  comparison: {
    g: "ਘੱਟ rent final-lock ਤਦੋਂ ਹੀ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ ਜਦੋਂ commute, utilities ਅਤੇ transit reliability ਵੀ ਦਰਜ ਹਨ; ਨਹੀਂ ਤਾਂ ਸਸਤਾ option ਅਸਲ ਵਿੱਚ ਮਹਿੰਗਾ ਪੈ ਸਕਦਾ ਹੈ।",
    r: "ghatt rent final-lock tadon hii honaa chaahiidaa hai jadon commute, utilities ate transit reliability vii daraj han; nahi taan sastaa option asal vich mehangaa pai sakdaa hai.",
    vi: "Tiền thuê thấp chỉ nên được final-lock khi commute, utilities và độ tin cậy của transit cũng được ghi rõ; nếu không, lựa chọn rẻ có thể thành đắt.",
    en: "Lower rent should be final-locked only when commute, utilities, and transit reliability are also recorded; otherwise the cheaper option may become expensive in practice.",
  },
  counterpoint: {
    g: "ਮੈਂ queue rule ਨੂੰ ਠੀਕ ਮੰਨਦਾ ਹਾਂ, ਪਰ urgent healthcare symptom ਲਈ limited exception final-lock ਹੋ ਸਕਦੀ ਹੈ; reason safety ਹੈ, preference ਨਹੀਂ।",
    r: "main queue rule nu thiik manndaa haan, par urgent healthcare symptom lai limited exception final-lock ho sakdii hai; reason safety hai, preference nahi.",
    vi: "Tôi đồng ý quy tắc xếp hàng là đúng, nhưng ngoại lệ giới hạn cho triệu chứng y tế khẩn có thể được final-lock; lý do là an toàn, không phải sở thích.",
    en: "I accept the queue rule as fair, but a limited exception for urgent healthcare symptoms can be final-locked; the reason is safety, not preference.",
  },
  recommendation: {
    g: "ਜੇ student ਕੰਮ ਅਤੇ childcare ਨਾਲ study ਕਰਦਾ ਹੈ, ਤਾਂ part-time program final-lock ਹੋ ਸਕਦਾ ਹੈ; fees, schedule ਅਤੇ advising support ਪਹਿਲਾਂ verify ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    r: "je student kamm ate childcare naal study kardaa hai, taan part-time program final-lock ho sakdaa hai; fees, schedule ate advising support pahilaan verify karne chaahiide han.",
    vi: "Nếu học viên vừa làm, chăm trẻ và học, chương trình bán thời gian có thể được final-lock; học phí, lịch học và hỗ trợ tư vấn cần được xác minh trước.",
    en: "If a student studies while working and handling childcare, a part-time program can be final-locked; fees, schedule, and advising support should be verified first.",
  },
  workplace_fairness: {
    g: "ਜੇ task board workload evidence ਦਿਖਾਉਂਦਾ ਹੈ, ਤਾਂ manager ਨਾਲ review meeting final-lock answer ਹੈ; request fair adjustment ਲਈ ਹੈ, blame ਲਈ ਨਹੀਂ।",
    r: "je task board workload evidence dikhaaundaa hai, taan manager naal review meeting final-lock answer hai; request fair adjustment lai hai, blame lai nahi.",
    vi: "Nếu task board cho thấy evidence về workload, buổi review với manager là câu trả lời final-lock; yêu cầu nhằm điều chỉnh công bằng, không phải blame.",
    en: "If the task board shows workload evidence, a review meeting with the manager is the final-lock answer; the request is for fair adjustment, not blame.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2FinalLockSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Ví dụ Canada: final-lock khi thư định cư có form, ID, deadline và contact rõ.",
    en: "Canada example: final lock when a settlement letter has clear form, ID, deadline, and contact.",
  },
  education: {
    vi: "Ví dụ Canada: final-lock khi lựa chọn học nêu schedule, fees, advising và childcare support.",
    en: "Canada example: final lock when an education choice names schedule, fees, advising, and childcare support.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: final-lock khi healthcare exception dựa trên symptom evidence và urgency rõ.",
    en: "Canada example: final lock when a healthcare exception is based on clear symptom evidence and urgency.",
  },
  housing: {
    vi: "Ví dụ Canada: final-lock khi rent, utilities, commute và transit reliability đều được kiểm tra.",
    en: "Canada example: final lock when rent, utilities, commute, and transit reliability are all checked.",
  },
  transport: {
    vi: "Ví dụ Canada: final-lock khi người làm ca kiểm tra early bus, late bus, weekend service và transfer.",
    en: "Canada example: final lock when a shift worker checks early buses, late buses, weekend service, and transfers.",
  },
  public_service: {
    vi: "Ví dụ Canada: final-lock khi public-service reply có eligibility, documents, deadline và nơi hỏi thêm.",
    en: "Canada example: final lock when a public-service reply has eligibility, documents, deadline, and where to ask questions.",
  },
  work: {
    vi: "Ví dụ Canada: final-lock khi workload adjustment dựa trên task board, deadline và meeting notes.",
    en: "Canada example: final lock when workload adjustment is based on a task board, deadlines, and meeting notes.",
  },
};

export const punjabiB2FinalLockSamples: PunjabiB2FinalLockSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const lock = finalLockByFocus[item.consistencyFocus];
    const prompt = finalLockPromptByFocus[item.consistencyFocus];
    const answer = lockedAnswerByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? { vi: item.canadaPracticalExample_vi, en: item.canadaPracticalExample_en }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "final_lock"),
      level: "B2",
      finalLockFocus: item.consistencyFocus,
      topic: item.topic,
      finalLockPrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} final-lock ਲਈ freeze check ਕਰੋ।`,
      finalLockPrompt_romanization: `${item.consistencyPrompt_romanization} final-lock lai freeze check karo.`,
      finalLockPrompt_vi: `${item.consistencyPrompt_vi} Hãy kiểm tra final-lock trước khi đóng nội dung.`,
      finalLockPrompt_en: `${item.consistencyPrompt_en} Check final lock before freezing the content.`,
      lockedAnswer_gurmukhi: answer.g,
      lockedAnswer_romanization: answer.r,
      lockedAnswer_vi: answer.vi,
      lockedAnswer_en: answer.en,
      finalLockCriteria_vi: lock.lockVi,
      finalLockCriteria_en: lock.lockEn,
      ownerAcceptance_vi: lock.ownerVi,
      ownerAcceptance_en: lock.ownerEn,
      finalAcceptance_vi: lock.finalVi,
      finalAcceptance_en: lock.finalEn,
      preIntegration_vi: lock.preVi,
      preIntegration_en: lock.preEn,
      learnerTrap_vi: `${item.learnerTrap_vi} ${prompt.vi}`,
      learnerTrap_en: `${item.learnerTrap_en} ${prompt.en}`,
      canadaPracticalExample_vi: canada.vi,
      canadaPracticalExample_en: canada.en,
      scriptAwareness_en:
        index === 0
          ? "Gurmukhi is primary; Shahmukhi is awareness only."
          : "Gurmukhi is primary; script awareness is awareness only.",
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2FinalLockSamples;
