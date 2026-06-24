// Punjabi B2 go/no-go samples for upper-intermediate release review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2GoNoGoSamplesFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2GoNoGoSamplesTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2GoNoGoSample = {
  id: string;
  level: "B2";
  goNoGoFocus: PunjabiB2GoNoGoSamplesFocus;
  topic: PunjabiB2GoNoGoSamplesTopic;
  goNoGoPrompt_gurmukhi: string;
  goNoGoPrompt_romanization: string;
  goNoGoPrompt_vi: string;
  goNoGoPrompt_en: string;
  readyAnswer_gurmukhi: string;
  readyAnswer_romanization: string;
  readyAnswer_vi: string;
  readyAnswer_en: string;
  goCriteria_vi: string[];
  goCriteria_en: string[];
  noGoCriteria_vi: string[];
  noGoCriteria_en: string[];
  releaseCandidate_vi: string[];
  releaseCandidate_en: string[];
  closureValidation_vi: string[];
  closureValidation_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const goNoGoByFocus: Record<
  PunjabiB2GoNoGoSamplesFocus,
  {
    goVi: string[];
    goEn: string[];
    noGoVi: string[];
    noGoEn: string[];
    releaseVi: string[];
    releaseEn: string[];
    closureVi: string[];
    closureEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    goVi: ["Stance rõ", "Evidence trực tiếp", "Recommendation cùng hướng"],
    goEn: ["Clear stance", "Direct evidence", "Recommendation points the same way"],
    noGoVi: ["Chỉ yes/no", "Reason mơ hồ", "Conclusion đổi topic"],
    noGoEn: ["Only yes/no", "Vague reason", "Conclusion changes topic"],
    releaseVi: ["Opinion đủ dùng", "Evidence đủ kiểm tra", "Next step rõ"],
    releaseEn: ["Opinion is usable", "Evidence can be checked", "Next step is clear"],
    closureVi: ["Stance -> evidence", "Evidence -> action", "Action -> conclusion"],
    closureEn: ["Stance -> evidence", "Evidence -> action", "Action -> conclusion"],
    preVi: ["Giữ một claim", "Giữ một reason", "Giữ một next step"],
    preEn: ["Keep one claim", "Keep one reason", "Keep one next step"],
  },
  comparison: {
    goVi: ["Hai lựa chọn rõ", "Tradeoff có cost", "Điều kiện chọn cụ thể"],
    goEn: ["Two choices are clear", "Tradeoff has cost", "Choosing condition is specific"],
    noGoVi: ["Một chiều", "Bỏ cost", "Không nói khi nào chọn"],
    noGoEn: ["One-sided", "Drops cost", "Does not say when to choose"],
    releaseVi: ["Comparison cân bằng", "Cost thực tế", "Advice có điều kiện"],
    releaseEn: ["Balanced comparison", "Practical cost", "Advice has a condition"],
    closureVi: ["Option -> benefit", "Cost -> tradeoff", "Condition -> advice"],
    closureEn: ["Option -> benefit", "Cost -> tradeoff", "Condition -> advice"],
    preVi: ["Nêu option A", "Nêu option B", "Nêu condition"],
    preEn: ["Name option A", "Name option B", "Name the condition"],
  },
  counterpoint: {
    goVi: ["Công nhận trước", "Evidence cho exception", "Tone mềm"],
    goEn: ["Acknowledge first", "Evidence for the exception", "Soft tone"],
    noGoVi: ["Always/never", "Phản bác gắt", "Không công nhận điểm đúng"],
    noGoEn: ["Always/never", "Harsh rebuttal", "Does not acknowledge the valid point"],
    releaseVi: ["Counterpoint lịch sự", "Exception hợp lý", "Conclusion không blame"],
    releaseEn: ["Polite counterpoint", "Reasonable exception", "Conclusion does not blame"],
    closureVi: ["Acknowledgement -> limit", "Limit -> evidence", "Evidence -> exception"],
    closureEn: ["Acknowledgment -> limit", "Limit -> evidence", "Evidence -> exception"],
    preVi: ["Công nhận", "Nêu giới hạn", "Nêu exception"],
    preEn: ["Acknowledge", "State the limit", "State the exception"],
  },
  recommendation: {
    goVi: ["Advice có evidence", "Risk rõ", "First step thực tế"],
    goEn: ["Advice has evidence", "Risk is clear", "First step is practical"],
    noGoVi: ["Overclaim", "Bỏ budget", "Bỏ constraint"],
    noGoEn: ["Overclaims", "Skips budget", "Skips constraints"],
    releaseVi: ["Recommendation có điều kiện", "Tradeoff được nêu", "Action làm được"],
    releaseEn: ["Recommendation has a condition", "Tradeoff is named", "Action is doable"],
    closureVi: ["Need -> option", "Option -> risk", "Risk -> first step"],
    closureEn: ["Need -> option", "Option -> risk", "Risk -> first step"],
    preVi: ["Nêu solution", "Nêu condition", "Nêu first check"],
    preEn: ["Name the solution", "Name the condition", "Name the first check"],
  },
  workplace_fairness: {
    goVi: ["Process rõ", "Workload có evidence", "Review method cụ thể"],
    goEn: ["Clear process", "Workload has evidence", "Specific review method"],
    noGoVi: ["Blame cá nhân", "Chỉ than phiền", "Không có review method"],
    noGoEn: ["Personal blame", "Only complains", "No review method"],
    releaseVi: ["Fairness dựa trên process", "Evidence kiểm tra được", "Adjustment chuyên nghiệp"],
    releaseEn: ["Fairness is process-based", "Evidence can be checked", "Professional adjustment"],
    closureVi: ["Concern -> evidence", "Evidence -> process", "Process -> adjustment"],
    closureEn: ["Concern -> evidence", "Evidence -> process", "Process -> adjustment"],
    preVi: ["Task board", "Deadline", "Review meeting"],
    preEn: ["Task board", "Deadline", "Review meeting"],
  },
};

const goNoGoPromptByFocus: Record<PunjabiB2GoNoGoSamplesFocus, { vi: string; en: string }> = {
  structured_opinion: {
    vi: "Quyết định go/no-go xem opinion có stance, evidence và recommendation sẵn sàng chưa.",
    en: "Make a go/no-go decision on whether the opinion has ready stance, evidence, and recommendation.",
  },
  comparison: {
    vi: "Quyết định go/no-go xem comparison có tradeoff và điều kiện chọn đủ rõ chưa.",
    en: "Make a go/no-go decision on whether the comparison has clear tradeoff and choosing condition.",
  },
  counterpoint: {
    vi: "Quyết định go/no-go xem counterpoint có công nhận, evidence và tone phù hợp chưa.",
    en: "Make a go/no-go decision on whether the counterpoint has acknowledgment, evidence, and suitable tone.",
  },
  recommendation: {
    vi: "Quyết định go/no-go xem recommendation có risk, condition và first step chưa.",
    en: "Make a go/no-go decision on whether the recommendation has risk, condition, and first step.",
  },
  workplace_fairness: {
    vi: "Quyết định go/no-go xem workplace answer có process, evidence và review method chưa.",
    en: "Make a go/no-go decision on whether the workplace answer has process, evidence, and a review method.",
  },
};

const readyAnswerByFocus: Record<
  PunjabiB2GoNoGoSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ public-service notice ਸਧਾਰਨ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ ਨਵੇਂ ਪਰਿਵਾਰ deadline, documents ਅਤੇ ਅਗਲਾ ਕਦਮ ਇਕੱਠੇ ਸਮਝਣਾ ਚਾਹੁੰਦੇ ਹਨ; ਇਸ ਲਈ ਇਹ sample go ਹੈ।",
    r: "mere vichaar vich public-service notice sadhaaran honaa chaahiidaa hai, kiunki nave parivaar deadline, documents ate aglaa kadam ikatthe samajhnaa chaahunde han; is lai eh sample go hai.",
    vi: "Theo tôi, thông báo dịch vụ công nên đơn giản vì gia đình mới cần hiểu hạn chót, giấy tờ và bước tiếp theo cùng lúc; vì vậy mẫu này là go.",
    en: "In my view, a public-service notice should be simple because new families need to understand deadlines, documents, and the next step together; therefore this sample is go.",
  },
  comparison: {
    g: "ਘੱਟ rent go ਹੋ ਸਕਦਾ ਹੈ ਜੇ transit route ਭਰੋਸੇਯੋਗ ਹੋਵੇ; ਪਰ ਜੇ commute ਲੰਮਾ ਅਤੇ costly ਹੈ, ਤਾਂ no-go decision ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ।",
    r: "ghatt rent go ho sakdaa hai je transit route bharoseyog hove; par je commute lammaa ate costly hai, taan no-go decision vadhiyaa ho sakdaa hai.",
    vi: "Tiền thuê thấp có thể là go nếu tuyến transit đáng tin; nhưng nếu đi lại dài và tốn kém, quyết định no-go có thể tốt hơn.",
    en: "Lower rent can be go if the transit route is reliable; but if the commute is long and costly, a no-go decision may be better.",
  },
  counterpoint: {
    g: "ਮੈਂ ਮੰਨਦਾ ਹਾਂ ਕਿ queue rule fair ਹੈ, ਪਰ urgent healthcare symptom ਲਈ evidence ਦੇ ਆਧਾਰ ਤੇ priority ਬਦਲ ਸਕਦੀ ਹੈ; ਇਸ ਲਈ ਇਹ exception go ਹੈ।",
    r: "main manndaa haan ki queue rule fair hai, par urgent healthcare symptom lai evidence de adhaar te priority badal sakdii hai; is lai eh exception go hai.",
    vi: "Tôi đồng ý quy tắc xếp hàng là công bằng, nhưng với triệu chứng y tế khẩn, ưu tiên có thể đổi dựa trên evidence; vì vậy ngoại lệ này là go.",
    en: "I agree the queue rule is fair, but for an urgent healthcare symptom, priority can change based on evidence; therefore this exception is go.",
  },
  recommendation: {
    g: "ਜੇ learner ਕੰਮ ਅਤੇ childcare ਨਾਲ study ਕਰਦਾ ਹੈ, ਤਾਂ part-time program go ਹੋ ਸਕਦਾ ਹੈ; ਪਰ fees, schedule ਅਤੇ support options ਪਹਿਲਾਂ verify ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    r: "je learner kamm ate childcare naal study kardaa hai, taan part-time program go ho sakdaa hai; par fees, schedule ate support options pahilaan verify karne chaahiide han.",
    vi: "Nếu người học vừa làm, vừa giữ trẻ, vừa học, chương trình bán thời gian có thể là go; nhưng trước hết cần xác minh học phí, lịch và hỗ trợ.",
    en: "If a learner studies while working and handling childcare, a part-time program can be go; but fees, schedule, and support options should be verified first.",
  },
  workplace_fairness: {
    g: "ਜੇ workload uneven ਹੈ ਅਤੇ task board evidence ਦਿੰਦਾ ਹੈ, ਤਾਂ review meeting ਵਿੱਚ fair adjustment ਸੁਝਾਉਣਾ go ਹੈ; direct blame no-go ਰਹੇਗਾ।",
    r: "je workload uneven hai ate task board evidence dindaa hai, taan review meeting vich fair adjustment sujhaaunaa go hai; direct blame no-go rahegaa.",
    vi: "Nếu workload không đều và task board có evidence, đề xuất điều chỉnh công bằng trong buổi review là go; blame trực tiếp vẫn là no-go.",
    en: "If workload is uneven and the task board provides evidence, suggesting a fair adjustment in a review meeting is go; direct blame remains no-go.",
  },
};

const canadaExampleByTopic: Record<PunjabiB2GoNoGoSamplesTopic, { vi: string; en: string }> = {
  settlement: {
    vi: "Ví dụ Canada: go nếu notice định cư nêu rõ form, ID, deadline và contact; no-go nếu thiếu deadline.",
    en: "Canada example: go if a settlement notice clearly states form, ID, deadline, and contact; no-go if the deadline is missing.",
  },
  education: {
    vi: "Ví dụ Canada: go nếu lựa chọn học có schedule, fees và childcare support rõ.",
    en: "Canada example: go if an education choice has clear schedule, fees, and childcare support.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: go nếu priority y tế dựa trên symptom evidence và urgency.",
    en: "Canada example: go if healthcare priority is based on symptom evidence and urgency.",
  },
  housing: {
    vi: "Ví dụ Canada: go nếu rent, utilities, commute và transit đều đã được kiểm tra.",
    en: "Canada example: go if rent, utilities, commute, and transit have all been checked.",
  },
  transport: {
    vi: "Ví dụ Canada: go nếu người làm ca đã kiểm tra bus sớm, bus muộn, cuối tuần và transfer.",
    en: "Canada example: go if a shift worker checked early buses, late buses, weekend service, and transfers.",
  },
  public_service: {
    vi: "Ví dụ Canada: go nếu public-service reply có eligibility, documents, deadline và nơi hỏi thêm.",
    en: "Canada example: go if a public-service reply has eligibility, documents, deadline, and where to ask questions.",
  },
  work: {
    vi: "Ví dụ Canada: go nếu workload adjustment dựa trên task board, deadline và meeting notes.",
    en: "Canada example: go if workload adjustment is based on a task board, deadlines, and meeting notes.",
  },
};

export const punjabiB2GoNoGoSamples: PunjabiB2GoNoGoSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const decision = goNoGoByFocus[item.consistencyFocus];
    const prompt = goNoGoPromptByFocus[item.consistencyFocus];
    const answer = readyAnswerByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? { vi: item.canadaPracticalExample_vi, en: item.canadaPracticalExample_en }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "go_no_go"),
      level: "B2",
      goNoGoFocus: item.consistencyFocus,
      topic: item.topic,
      goNoGoPrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} go/no-go ਲਈ reasoning readiness ਦਾ ਫੈਸਲਾ ਕਰੋ।`,
      goNoGoPrompt_romanization: `${item.consistencyPrompt_romanization} go/no-go lai reasoning readiness daa faislaa karo.`,
      goNoGoPrompt_vi: `${item.consistencyPrompt_vi} Hãy quyết định go/no-go cho reasoning readiness.`,
      goNoGoPrompt_en: `${item.consistencyPrompt_en} Make a go/no-go decision for reasoning readiness.`,
      readyAnswer_gurmukhi: answer.g,
      readyAnswer_romanization: answer.r,
      readyAnswer_vi: answer.vi,
      readyAnswer_en: answer.en,
      goCriteria_vi: decision.goVi,
      goCriteria_en: decision.goEn,
      noGoCriteria_vi: decision.noGoVi,
      noGoCriteria_en: decision.noGoEn,
      releaseCandidate_vi: decision.releaseVi,
      releaseCandidate_en: decision.releaseEn,
      closureValidation_vi: decision.closureVi,
      closureValidation_en: decision.closureEn,
      preIntegration_vi: decision.preVi,
      preIntegration_en: decision.preEn,
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

export default punjabiB2GoNoGoSamples;
