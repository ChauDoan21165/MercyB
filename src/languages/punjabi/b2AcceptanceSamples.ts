// Punjabi B2 acceptance samples for upper-intermediate release review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2AcceptanceSamplesFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2AcceptanceSamplesTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2AcceptanceSample = {
  id: string;
  level: "B2";
  acceptanceFocus: PunjabiB2AcceptanceSamplesFocus;
  topic: PunjabiB2AcceptanceSamplesTopic;
  acceptancePrompt_gurmukhi: string;
  acceptancePrompt_romanization: string;
  acceptancePrompt_vi: string;
  acceptancePrompt_en: string;
  acceptedAnswer_gurmukhi: string;
  acceptedAnswer_romanization: string;
  acceptedAnswer_vi: string;
  acceptedAnswer_en: string;
  acceptanceCriteria_vi: string[];
  acceptanceCriteria_en: string[];
  shipCandidate_vi: string[];
  shipCandidate_en: string[];
  goNoGo_vi: string[];
  goNoGo_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const acceptanceByFocus: Record<
  PunjabiB2AcceptanceSamplesFocus,
  {
    acceptanceVi: string[];
    acceptanceEn: string[];
    shipVi: string[];
    shipEn: string[];
    goVi: string[];
    goEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    acceptanceVi: ["Stance rõ và ổn định", "Evidence kiểm tra được", "Recommendation cùng logic"],
    acceptanceEn: ["Clear and stable stance", "Checkable evidence", "Recommendation follows the same logic"],
    shipVi: ["Ship nếu conclusion không đổi topic", "Ship nếu next step cụ thể", "Ship nếu reason không mơ hồ"],
    shipEn: ["Ship if the conclusion does not change topic", "Ship if the next step is specific", "Ship if the reason is not vague"],
    goVi: ["Go: claim + reason + action", "No-go: yes/no only", "Go: public-service use is clear"],
    goEn: ["Go: claim + reason + action", "No-go: yes/no only", "Go: public-service use is clear"],
    preVi: ["Giữ claim", "Giữ evidence", "Giữ action"],
    preEn: ["Keep the claim", "Keep the evidence", "Keep the action"],
  },
  comparison: {
    acceptanceVi: ["Hai lựa chọn cân bằng", "Tradeoff có cost", "Điều kiện chọn thực tế"],
    acceptanceEn: ["Two choices are balanced", "Tradeoff has cost", "Choosing condition is practical"],
    shipVi: ["Ship nếu cả hai phía có evidence", "Ship nếu cost được nêu", "Ship nếu advice có điều kiện"],
    shipEn: ["Ship if both sides have evidence", "Ship if cost is named", "Ship if advice has a condition"],
    goVi: ["Go: option A + option B", "No-go: một chiều", "Go: condition rõ"],
    goEn: ["Go: option A + option B", "No-go: one-sided", "Go: clear condition"],
    preVi: ["Nêu option A", "Nêu option B", "Nêu condition"],
    preEn: ["Name option A", "Name option B", "Name the condition"],
  },
  counterpoint: {
    acceptanceVi: ["Acknowledgement trước", "Counterpoint có evidence", "Tone lịch sự"],
    acceptanceEn: ["Acknowledgment first", "Counterpoint has evidence", "Tone is polite"],
    shipVi: ["Ship nếu exception có reason", "Ship nếu không blame", "Ship nếu kết luận mềm"],
    shipEn: ["Ship if the exception has a reason", "Ship if there is no blame", "Ship if the conclusion stays soft"],
    goVi: ["Go: acknowledge + limit", "No-go: always/never", "Go: evidence cho exception"],
    goEn: ["Go: acknowledge + limit", "No-go: always/never", "Go: evidence for the exception"],
    preVi: ["Công nhận", "Nêu giới hạn", "Nêu exception"],
    preEn: ["Acknowledge", "State the limit", "State the exception"],
  },
  recommendation: {
    acceptanceVi: ["Advice dựa trên evidence", "Risk được nêu", "First step cụ thể"],
    acceptanceEn: ["Advice is based on evidence", "Risk is named", "First step is specific"],
    shipVi: ["Ship nếu condition rõ", "Ship nếu không overclaim", "Ship nếu first check làm được"],
    shipEn: ["Ship if the condition is clear", "Ship if it does not overclaim", "Ship if the first check is doable"],
    goVi: ["Go: solution + risk", "No-go: bỏ budget", "Go: first step rõ"],
    goEn: ["Go: solution + risk", "No-go: skips budget", "Go: clear first step"],
    preVi: ["Nêu solution", "Nêu risk", "Nêu first check"],
    preEn: ["Name the solution", "Name the risk", "Name the first check"],
  },
  workplace_fairness: {
    acceptanceVi: ["Process rõ", "Workload có evidence", "Review method cụ thể"],
    acceptanceEn: ["Process is clear", "Workload has evidence", "Review method is specific"],
    shipVi: ["Ship nếu task board hỗ trợ claim", "Ship nếu deadline rõ", "Ship nếu adjustment chuyên nghiệp"],
    shipEn: ["Ship if the task board supports the claim", "Ship if deadlines are clear", "Ship if adjustment is professional"],
    goVi: ["Go: process + evidence", "No-go: blame cá nhân", "Go: review time rõ"],
    goEn: ["Go: process + evidence", "No-go: personal blame", "Go: clear review time"],
    preVi: ["Task board", "Deadline", "Review meeting"],
    preEn: ["Task board", "Deadline", "Review meeting"],
  },
};

const acceptancePromptByFocus: Record<
  PunjabiB2AcceptanceSamplesFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Kiểm tra acceptance xem opinion có stance, evidence và recommendation đủ chấp nhận chưa.",
    en: "Check acceptance: whether the opinion has acceptable stance, evidence, and recommendation.",
  },
  comparison: {
    vi: "Kiểm tra acceptance xem comparison có tradeoff, cost và điều kiện chọn chưa.",
    en: "Check acceptance: whether the comparison has tradeoff, cost, and choosing condition.",
  },
  counterpoint: {
    vi: "Kiểm tra acceptance xem counterpoint có công nhận trước, evidence và tone lịch sự chưa.",
    en: "Check acceptance: whether the counterpoint has acknowledgment first, evidence, and polite tone.",
  },
  recommendation: {
    vi: "Kiểm tra acceptance xem recommendation có evidence, risk và first step chưa.",
    en: "Check acceptance: whether the recommendation has evidence, risk, and first step.",
  },
  workplace_fairness: {
    vi: "Kiểm tra acceptance xem workplace answer có process, workload evidence và review method chưa.",
    en: "Check acceptance: whether the workplace answer has process, workload evidence, and review method.",
  },
};

const acceptedAnswerByFocus: Record<
  PunjabiB2AcceptanceSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ public-service notice accepted ਹੈ ਜੇ deadline, documents ਅਤੇ contact step ਸਧਾਰਨ ਭਾਸ਼ਾ ਵਿੱਚ ਹਨ; ਇਸ ਨਾਲ ਨਵੇਂ ਪਰਿਵਾਰ ਅਗਲਾ ਕਦਮ ਸਮਝਦੇ ਹਨ।",
    r: "mere vichaar vich public-service notice accepted hai je deadline, documents ate contact step sadhaaran bhaashaa vich han; is naal nave parivaar aglaa kadam samajhde han.",
    vi: "Theo tôi, thông báo dịch vụ công được chấp nhận nếu hạn chót, giấy tờ và bước liên hệ dùng ngôn ngữ đơn giản; điều này giúp gia đình mới hiểu bước tiếp theo.",
    en: "In my view, a public-service notice is accepted if the deadline, documents, and contact step use plain language; this helps new families understand the next step.",
  },
  comparison: {
    g: "ਘੱਟ rent accepted ਤਦੋਂ ਹੈ ਜਦੋਂ commute, utilities ਅਤੇ transit route ਵੀ ਸਪਸ਼ਟ ਹਨ; ਨਹੀਂ ਤਾਂ housing advice ਅਧੂਰੀ ਰਹਿੰਦੀ ਹੈ।",
    r: "ghatt rent accepted tadon hai jadon commute, utilities ate transit route vii spasht han; nahi taan housing advice adhuurii rahindii hai.",
    vi: "Tiền thuê thấp chỉ được chấp nhận khi commute, utilities và tuyến transit cũng rõ; nếu không, lời khuyên nhà ở vẫn chưa đủ.",
    en: "Lower rent is accepted only when commute, utilities, and transit route are also clear; otherwise the housing advice remains incomplete.",
  },
  counterpoint: {
    g: "ਮੈਂ ਮੰਨਦਾ ਹਾਂ ਕਿ queue rule fair ਹੈ, ਪਰ urgent healthcare symptom ਲਈ evidence-based exception accepted ਹੈ; ਇਹ safety ਲਈ ਹੈ, preference ਲਈ ਨਹੀਂ।",
    r: "main manndaa haan ki queue rule fair hai, par urgent healthcare symptom lai evidence-based exception accepted hai; eh safety lai hai, preference lai nahi.",
    vi: "Tôi đồng ý quy tắc xếp hàng là công bằng, nhưng ngoại lệ dựa trên evidence cho triệu chứng y tế khẩn được chấp nhận; điều này vì an toàn, không phải thiên vị.",
    en: "I agree the queue rule is fair, but an evidence-based exception for urgent healthcare symptoms is accepted; this is for safety, not preference.",
  },
  recommendation: {
    g: "ਜੇ learner ਕੰਮ, study ਅਤੇ childcare ਸੰਭਾਲਦਾ ਹੈ, ਤਾਂ part-time program accepted ਹੋ ਸਕਦਾ ਹੈ; fees, schedule ਅਤੇ support ਪਹਿਲਾਂ verify ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    r: "je learner kamm, study ate childcare sambhaaldaa hai, taan part-time program accepted ho sakdaa hai; fees, schedule ate support pahilaan verify karne chaahiide han.",
    vi: "Nếu người học cân bằng việc làm, học và giữ trẻ, chương trình bán thời gian có thể được chấp nhận; học phí, lịch và hỗ trợ cần được xác minh trước.",
    en: "If a learner balances work, study, and childcare, a part-time program can be accepted; fees, schedule, and support should be verified first.",
  },
  workplace_fairness: {
    g: "ਜੇ task board workload evidence ਦਿੰਦਾ ਹੈ, ਤਾਂ review meeting ਵਿੱਚ fair adjustment accepted ਹੈ; direct blame accepted ਨਹੀਂ ਹੈ।",
    r: "je task board workload evidence dindaa hai, taan review meeting vich fair adjustment accepted hai; direct blame accepted nahi hai.",
    vi: "Nếu task board cung cấp evidence về workload, đề xuất điều chỉnh công bằng trong buổi review được chấp nhận; blame trực tiếp thì không.",
    en: "If the task board provides workload evidence, a fair adjustment in the review meeting is accepted; direct blame is not accepted.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2AcceptanceSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Ví dụ Canada: accepted nếu notice định cư nêu form, ID, deadline và contact rõ.",
    en: "Canada example: accepted if a settlement notice clearly states form, ID, deadline, and contact.",
  },
  education: {
    vi: "Ví dụ Canada: accepted nếu lựa chọn học có schedule, fees và childcare support rõ.",
    en: "Canada example: accepted if the education choice has clear schedule, fees, and childcare support.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: accepted nếu healthcare priority dựa trên symptom evidence và urgency.",
    en: "Canada example: accepted if healthcare priority is based on symptom evidence and urgency.",
  },
  housing: {
    vi: "Ví dụ Canada: accepted nếu rent, utilities, commute và transit đều đã được kiểm tra.",
    en: "Canada example: accepted if rent, utilities, commute, and transit have all been checked.",
  },
  transport: {
    vi: "Ví dụ Canada: accepted nếu người làm ca đã kiểm tra bus sớm, bus muộn, cuối tuần và transfer.",
    en: "Canada example: accepted if a shift worker checked early buses, late buses, weekend service, and transfers.",
  },
  public_service: {
    vi: "Ví dụ Canada: accepted nếu public-service reply có eligibility, documents, deadline và nơi hỏi thêm.",
    en: "Canada example: accepted if a public-service reply has eligibility, documents, deadline, and where to ask questions.",
  },
  work: {
    vi: "Ví dụ Canada: accepted nếu workload adjustment dựa trên task board, deadlines và meeting notes.",
    en: "Canada example: accepted if workload adjustment is based on a task board, deadlines, and meeting notes.",
  },
};

export const punjabiB2AcceptanceSamples: PunjabiB2AcceptanceSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const acceptance = acceptanceByFocus[item.consistencyFocus];
    const prompt = acceptancePromptByFocus[item.consistencyFocus];
    const answer = acceptedAnswerByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? { vi: item.canadaPracticalExample_vi, en: item.canadaPracticalExample_en }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "acceptance"),
      level: "B2",
      acceptanceFocus: item.consistencyFocus,
      topic: item.topic,
      acceptancePrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} acceptance ਲਈ reasoning readiness ਚੈੱਕ ਕਰੋ।`,
      acceptancePrompt_romanization: `${item.consistencyPrompt_romanization} acceptance lai reasoning readiness check karo.`,
      acceptancePrompt_vi: `${item.consistencyPrompt_vi} Hãy kiểm tra reasoning readiness để acceptance.`,
      acceptancePrompt_en: `${item.consistencyPrompt_en} Check reasoning readiness for acceptance.`,
      acceptedAnswer_gurmukhi: answer.g,
      acceptedAnswer_romanization: answer.r,
      acceptedAnswer_vi: answer.vi,
      acceptedAnswer_en: answer.en,
      acceptanceCriteria_vi: acceptance.acceptanceVi,
      acceptanceCriteria_en: acceptance.acceptanceEn,
      shipCandidate_vi: acceptance.shipVi,
      shipCandidate_en: acceptance.shipEn,
      goNoGo_vi: acceptance.goVi,
      goNoGo_en: acceptance.goEn,
      preIntegration_vi: acceptance.preVi,
      preIntegration_en: acceptance.preEn,
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

export default punjabiB2AcceptanceSamples;
