// Punjabi B2 ship-candidate samples for upper-intermediate release review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2ShipCandidateSamplesFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2ShipCandidateSamplesTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2ShipCandidateSample = {
  id: string;
  level: "B2";
  shipFocus: PunjabiB2ShipCandidateSamplesFocus;
  topic: PunjabiB2ShipCandidateSamplesTopic;
  shipPrompt_gurmukhi: string;
  shipPrompt_romanization: string;
  shipPrompt_vi: string;
  shipPrompt_en: string;
  shipAnswer_gurmukhi: string;
  shipAnswer_romanization: string;
  shipAnswer_vi: string;
  shipAnswer_en: string;
  shipCandidate_vi: string[];
  shipCandidate_en: string[];
  goNoGo_vi: string[];
  goNoGo_en: string[];
  releaseCandidate_vi: string[];
  releaseCandidate_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const shipByFocus: Record<
  PunjabiB2ShipCandidateSamplesFocus,
  {
    shipVi: string[];
    shipEn: string[];
    goVi: string[];
    goEn: string[];
    releaseVi: string[];
    releaseEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    shipVi: ["Stance ổn định", "Evidence kiểm tra được", "Recommendation đóng logic"],
    shipEn: ["Stable stance", "Checkable evidence", "Recommendation closes the logic"],
    goVi: ["Go nếu reason rõ", "No-go nếu chỉ yes/no", "Go nếu next step cụ thể"],
    goEn: ["Go if the reason is clear", "No-go if only yes/no", "Go if the next step is specific"],
    releaseVi: ["Opinion đủ dùng", "Evidence nối đúng", "Conclusion không lệch topic"],
    releaseEn: ["Opinion is usable", "Evidence connects correctly", "Conclusion does not drift"],
    preVi: ["Giữ claim", "Giữ reason", "Giữ action"],
    preEn: ["Keep the claim", "Keep the reason", "Keep the action"],
  },
  comparison: {
    shipVi: ["Hai lựa chọn rõ", "Tradeoff có cost", "Điều kiện chọn thực tế"],
    shipEn: ["Two choices are clear", "Tradeoff has cost", "Choosing condition is practical"],
    goVi: ["Go nếu cả hai phía có evidence", "No-go nếu một chiều", "Go nếu cost được nêu"],
    goEn: ["Go if both sides have evidence", "No-go if one-sided", "Go if cost is named"],
    releaseVi: ["Comparison cân bằng", "Advice có điều kiện", "Decision không tuyệt đối"],
    releaseEn: ["Comparison is balanced", "Advice has a condition", "Decision is not absolute"],
    preVi: ["Nêu option A", "Nêu option B", "Nêu condition"],
    preEn: ["Name option A", "Name option B", "Name the condition"],
  },
  counterpoint: {
    shipVi: ["Công nhận trước", "Counterpoint có evidence", "Tone lịch sự"],
    shipEn: ["Acknowledge first", "Counterpoint has evidence", "Tone is polite"],
    goVi: ["Go nếu acknowledgement rõ", "No-go nếu phản bác gắt", "Go nếu exception có reason"],
    goEn: ["Go if acknowledgment is clear", "No-go if rebuttal is harsh", "Go if exception has a reason"],
    releaseVi: ["Counterpoint không blame", "Evidence hợp lý", "Conclusion giữ mềm"],
    releaseEn: ["Counterpoint does not blame", "Evidence is reasonable", "Conclusion stays soft"],
    preVi: ["Công nhận", "Nêu giới hạn", "Nêu exception"],
    preEn: ["Acknowledge", "State the limit", "State the exception"],
  },
  recommendation: {
    shipVi: ["Advice dựa trên evidence", "Risk được nêu", "First step làm được"],
    shipEn: ["Advice is based on evidence", "Risk is named", "First step is doable"],
    goVi: ["Go nếu condition rõ", "No-go nếu overclaim", "Go nếu first check cụ thể"],
    goEn: ["Go if the condition is clear", "No-go if it overclaims", "Go if the first check is specific"],
    releaseVi: ["Recommendation có constraint", "Tradeoff không bị che", "Action thực tế"],
    releaseEn: ["Recommendation has a constraint", "Tradeoff is not hidden", "Action is practical"],
    preVi: ["Nêu solution", "Nêu risk", "Nêu first check"],
    preEn: ["Name the solution", "Name the risk", "Name the first check"],
  },
  workplace_fairness: {
    shipVi: ["Process rõ", "Workload có evidence", "Review method cụ thể"],
    shipEn: ["Process is clear", "Workload has evidence", "Review method is specific"],
    goVi: ["Go nếu có task board", "No-go nếu blame cá nhân", "Go nếu review time rõ"],
    goEn: ["Go if there is a task board", "No-go if there is personal blame", "Go if review time is clear"],
    releaseVi: ["Fairness dựa trên process", "Adjustment chuyên nghiệp", "Evidence kiểm tra được"],
    releaseEn: ["Fairness is process-based", "Adjustment is professional", "Evidence can be checked"],
    preVi: ["Task board", "Deadline", "Review meeting"],
    preEn: ["Task board", "Deadline", "Review meeting"],
  },
};

const shipPromptByFocus: Record<PunjabiB2ShipCandidateSamplesFocus, { vi: string; en: string }> = {
  structured_opinion: {
    vi: "Kiểm tra ship-candidate xem opinion, evidence và recommendation đã sẵn sàng chưa.",
    en: "Check the ship candidate for whether opinion, evidence, and recommendation are ready.",
  },
  comparison: {
    vi: "Kiểm tra ship-candidate xem comparison có tradeoff và điều kiện chọn rõ chưa.",
    en: "Check the ship candidate for whether comparison has clear tradeoff and choosing condition.",
  },
  counterpoint: {
    vi: "Kiểm tra ship-candidate xem counterpoint có công nhận trước và phản hồi lịch sự chưa.",
    en: "Check the ship candidate for whether counterpoint acknowledges first and replies politely.",
  },
  recommendation: {
    vi: "Kiểm tra ship-candidate xem recommendation có evidence, risk và first step chưa.",
    en: "Check the ship candidate for whether recommendation has evidence, risk, and first step.",
  },
  workplace_fairness: {
    vi: "Kiểm tra ship-candidate xem workplace answer có process, evidence và review method chưa.",
    en: "Check the ship candidate for whether workplace answer has process, evidence, and review method.",
  },
};

const shipAnswerByFocus: Record<
  PunjabiB2ShipCandidateSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ public-service notice ship-candidate ਹੈ ਜੇ deadline, documents ਅਤੇ contact step ਸਧਾਰਨ ਭਾਸ਼ਾ ਵਿੱਚ ਹਨ; ਇਸ ਨਾਲ ਨਵੇਂ ਪਰਿਵਾਰ ਅਗਲਾ ਕਦਮ ਸਮਝ ਸਕਦੇ ਹਨ।",
    r: "mere vichaar vich public-service notice ship-candidate hai je deadline, documents ate contact step sadhaaran bhaashaa vich han; is naal nave parivaar aglaa kadam samajh sakde han.",
    vi: "Theo tôi, thông báo dịch vụ công là ship-candidate nếu hạn chót, giấy tờ và bước liên hệ dùng ngôn ngữ đơn giản; điều này giúp gia đình mới hiểu bước tiếp theo.",
    en: "In my view, a public-service notice is a ship candidate if the deadline, documents, and contact step use plain language; this helps new families understand the next step.",
  },
  comparison: {
    g: "ਘੱਟ rent ship-candidate ਤਦੋਂ ਹੈ ਜਦੋਂ commute, utilities ਅਤੇ transit route ਵੀ clear ਹਨ; ਨਹੀਂ ਤਾਂ housing advice no-go ਹੋ ਸਕਦੀ ਹੈ।",
    r: "ghatt rent ship-candidate tadon hai jadon commute, utilities ate transit route vii clear han; nahi taan housing advice no-go ho sakdii hai.",
    vi: "Tiền thuê thấp chỉ là ship-candidate khi commute, utilities và tuyến transit cũng rõ; nếu không, lời khuyên nhà ở có thể là no-go.",
    en: "Lower rent is a ship candidate only when commute, utilities, and transit route are also clear; otherwise the housing advice may be no-go.",
  },
  counterpoint: {
    g: "ਮੈਂ ਮੰਨਦਾ ਹਾਂ ਕਿ queue rule fair ਹੈ, ਪਰ urgent symptom ਲਈ evidence ਦੇ ਆਧਾਰ ਤੇ exception ship-candidate ਹੈ; ਇਹ preference ਨਹੀਂ, safety ਦਾ ਮਾਮਲਾ ਹੈ।",
    r: "main manndaa haan ki queue rule fair hai, par urgent symptom lai evidence de adhaar te exception ship-candidate hai; eh preference nahi, safety daa maamlaa hai.",
    vi: "Tôi đồng ý quy tắc xếp hàng là công bằng, nhưng ngoại lệ cho triệu chứng khẩn dựa trên evidence là ship-candidate; đây không phải thiên vị mà là vấn đề an toàn.",
    en: "I agree the queue rule is fair, but an evidence-based exception for urgent symptoms is a ship candidate; this is not preference, it is a safety issue.",
  },
  recommendation: {
    g: "ਜੇ learner ਕੰਮ, study ਅਤੇ childcare ਸੰਭਾਲਦਾ ਹੈ, ਤਾਂ part-time program ship-candidate ਹੋ ਸਕਦਾ ਹੈ; ਪਰ fees, schedule ਅਤੇ support ਪਹਿਲਾਂ verify ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    r: "je learner kamm, study ate childcare sambhaaldaa hai, taan part-time program ship-candidate ho sakdaa hai; par fees, schedule ate support pahilaan verify karne chaahiide han.",
    vi: "Nếu người học phải cân bằng việc làm, học và giữ trẻ, chương trình bán thời gian có thể là ship-candidate; nhưng học phí, lịch và hỗ trợ cần được xác minh trước.",
    en: "If a learner balances work, study, and childcare, a part-time program can be a ship candidate; but fees, schedule, and support should be verified first.",
  },
  workplace_fairness: {
    g: "ਜੇ task board workload evidence ਦਿੰਦਾ ਹੈ, ਤਾਂ review meeting ਵਿੱਚ fair adjustment ship-candidate ਹੈ; direct blame no-go ਰਹੇਗਾ।",
    r: "je task board workload evidence dindaa hai, taan review meeting vich fair adjustment ship-candidate hai; direct blame no-go rahegaa.",
    vi: "Nếu task board cung cấp evidence về workload, đề xuất điều chỉnh công bằng trong buổi review là ship-candidate; blame trực tiếp vẫn là no-go.",
    en: "If the task board provides workload evidence, suggesting a fair adjustment in the review meeting is a ship candidate; direct blame remains no-go.",
  },
};

const canadaExampleByTopic: Record<PunjabiB2ShipCandidateSamplesTopic, { vi: string; en: string }> = {
  settlement: {
    vi: "Ví dụ Canada: ship-candidate nếu notice định cư nêu rõ form, ID, deadline và contact.",
    en: "Canada example: ship candidate if a settlement notice clearly states form, ID, deadline, and contact.",
  },
  education: {
    vi: "Ví dụ Canada: ship-candidate nếu lựa chọn học có schedule, fees và childcare support rõ.",
    en: "Canada example: ship candidate if the education choice has clear schedule, fees, and childcare support.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: ship-candidate nếu healthcare priority dựa trên symptom evidence và urgency.",
    en: "Canada example: ship candidate if healthcare priority is based on symptom evidence and urgency.",
  },
  housing: {
    vi: "Ví dụ Canada: ship-candidate nếu rent, utilities, commute và transit đều đã được kiểm tra.",
    en: "Canada example: ship candidate if rent, utilities, commute, and transit have all been checked.",
  },
  transport: {
    vi: "Ví dụ Canada: ship-candidate nếu người làm ca đã kiểm tra bus sớm, bus muộn, cuối tuần và transfer.",
    en: "Canada example: ship candidate if a shift worker checked early buses, late buses, weekend service, and transfers.",
  },
  public_service: {
    vi: "Ví dụ Canada: ship-candidate nếu public-service reply có eligibility, documents, deadline và nơi hỏi thêm.",
    en: "Canada example: ship candidate if a public-service reply has eligibility, documents, deadline, and where to ask questions.",
  },
  work: {
    vi: "Ví dụ Canada: ship-candidate nếu workload adjustment dựa trên task board, deadlines và meeting notes.",
    en: "Canada example: ship candidate if workload adjustment is based on a task board, deadlines, and meeting notes.",
  },
};

export const punjabiB2ShipCandidateSamples: PunjabiB2ShipCandidateSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const ship = shipByFocus[item.consistencyFocus];
    const prompt = shipPromptByFocus[item.consistencyFocus];
    const answer = shipAnswerByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? { vi: item.canadaPracticalExample_vi, en: item.canadaPracticalExample_en }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "ship_candidate"),
      level: "B2",
      shipFocus: item.consistencyFocus,
      topic: item.topic,
      shipPrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} ship-candidate ਲਈ reasoning readiness ਦੀ ਜਾਂਚ ਕਰੋ।`,
      shipPrompt_romanization: `${item.consistencyPrompt_romanization} ship-candidate lai reasoning readiness dii jaanch karo.`,
      shipPrompt_vi: `${item.consistencyPrompt_vi} Hãy kiểm tra reasoning readiness cho ship-candidate.`,
      shipPrompt_en: `${item.consistencyPrompt_en} Check reasoning readiness for the ship candidate.`,
      shipAnswer_gurmukhi: answer.g,
      shipAnswer_romanization: answer.r,
      shipAnswer_vi: answer.vi,
      shipAnswer_en: answer.en,
      shipCandidate_vi: ship.shipVi,
      shipCandidate_en: ship.shipEn,
      goNoGo_vi: ship.goVi,
      goNoGo_en: ship.goEn,
      releaseCandidate_vi: ship.releaseVi,
      releaseCandidate_en: ship.releaseEn,
      preIntegration_vi: ship.preVi,
      preIntegration_en: ship.preEn,
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

export default punjabiB2ShipCandidateSamples;
