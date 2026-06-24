// Punjabi B2 owner-acceptance samples for upper-intermediate release review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2OwnerAcceptanceSamplesFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2OwnerAcceptanceSamplesTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2OwnerAcceptanceSample = {
  id: string;
  level: "B2";
  ownerAcceptanceFocus: PunjabiB2OwnerAcceptanceSamplesFocus;
  topic: PunjabiB2OwnerAcceptanceSamplesTopic;
  ownerPrompt_gurmukhi: string;
  ownerPrompt_romanization: string;
  ownerPrompt_vi: string;
  ownerPrompt_en: string;
  ownerAcceptedAnswer_gurmukhi: string;
  ownerAcceptedAnswer_romanization: string;
  ownerAcceptedAnswer_vi: string;
  ownerAcceptedAnswer_en: string;
  ownerAcceptance_vi: string[];
  ownerAcceptance_en: string[];
  finalAcceptance_vi: string[];
  finalAcceptance_en: string[];
  shipCandidate_vi: string[];
  shipCandidate_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const ownerAcceptanceByFocus: Record<
  PunjabiB2OwnerAcceptanceSamplesFocus,
  {
    ownerVi: string[];
    ownerEn: string[];
    finalVi: string[];
    finalEn: string[];
    shipVi: string[];
    shipEn: string[];
    preVi: string[];
    preEn: string[];
  }
> = {
  structured_opinion: {
    ownerVi: ["Owner accepts stance rõ", "Owner accepts evidence kiểm tra được", "Owner accepts next step cụ thể"],
    ownerEn: ["Owner accepts a clear stance", "Owner accepts checkable evidence", "Owner accepts a specific next step"],
    finalVi: ["Claim ổn định", "Reason nối đúng", "Conclusion không đổi topic"],
    finalEn: ["Claim is stable", "Reason connects correctly", "Conclusion does not change topic"],
    shipVi: ["Ship nếu public-service use rõ", "Ship nếu plain language đủ", "Ship nếu action có thể làm"],
    shipEn: ["Ship if public-service use is clear", "Ship if plain language is enough", "Ship if action is doable"],
    preVi: ["Giữ claim", "Giữ evidence", "Giữ action"],
    preEn: ["Keep the claim", "Keep the evidence", "Keep the action"],
  },
  comparison: {
    ownerVi: ["Owner accepts hai option", "Owner accepts tradeoff", "Owner accepts condition"],
    ownerEn: ["Owner accepts two options", "Owner accepts the tradeoff", "Owner accepts the condition"],
    finalVi: ["Hai phía cân bằng", "Cost rõ", "Advice có điều kiện"],
    finalEn: ["Both sides are balanced", "Cost is clear", "Advice has a condition"],
    shipVi: ["Ship nếu không một chiều", "Ship nếu cost không bị bỏ", "Ship nếu conclusion thực tế"],
    shipEn: ["Ship if not one-sided", "Ship if cost is not dropped", "Ship if conclusion is practical"],
    preVi: ["Nêu option A", "Nêu option B", "Nêu condition"],
    preEn: ["Name option A", "Name option B", "Name the condition"],
  },
  counterpoint: {
    ownerVi: ["Owner accepts acknowledgement", "Owner accepts evidence", "Owner accepts polite tone"],
    ownerEn: ["Owner accepts acknowledgment", "Owner accepts evidence", "Owner accepts polite tone"],
    finalVi: ["Công nhận trước", "Exception có reason", "Không blame"],
    finalEn: ["Acknowledge first", "Exception has a reason", "No blame"],
    shipVi: ["Ship nếu không always/never", "Ship nếu phản hồi mềm", "Ship nếu safety logic rõ"],
    shipEn: ["Ship if no always/never", "Ship if response is soft", "Ship if safety logic is clear"],
    preVi: ["Công nhận", "Nêu giới hạn", "Nêu exception"],
    preEn: ["Acknowledge", "State the limit", "State the exception"],
  },
  recommendation: {
    ownerVi: ["Owner accepts advice có evidence", "Owner accepts risk", "Owner accepts first step"],
    ownerEn: ["Owner accepts evidence-based advice", "Owner accepts risk", "Owner accepts first step"],
    finalVi: ["Solution rõ", "Constraint rõ", "Không overclaim"],
    finalEn: ["Solution is clear", "Constraint is clear", "No overclaiming"],
    shipVi: ["Ship nếu budget được nhắc", "Ship nếu support được verify", "Ship nếu step đầu làm được"],
    shipEn: ["Ship if budget is mentioned", "Ship if support is verified", "Ship if first step is doable"],
    preVi: ["Nêu solution", "Nêu risk", "Nêu first check"],
    preEn: ["Name the solution", "Name the risk", "Name the first check"],
  },
  workplace_fairness: {
    ownerVi: ["Owner accepts process", "Owner accepts workload evidence", "Owner accepts review method"],
    ownerEn: ["Owner accepts process", "Owner accepts workload evidence", "Owner accepts review method"],
    finalVi: ["Task board hỗ trợ claim", "Deadline rõ", "Adjustment chuyên nghiệp"],
    finalEn: ["Task board supports the claim", "Deadline is clear", "Adjustment is professional"],
    shipVi: ["Ship nếu không blame", "Ship nếu review time rõ", "Ship nếu evidence kiểm tra được"],
    shipEn: ["Ship if no blame", "Ship if review time is clear", "Ship if evidence can be checked"],
    preVi: ["Task board", "Deadline", "Review meeting"],
    preEn: ["Task board", "Deadline", "Review meeting"],
  },
};

const ownerPromptByFocus: Record<
  PunjabiB2OwnerAcceptanceSamplesFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Kiểm tra owner-acceptance xem stance, evidence và next step đã đủ chấp nhận chưa.",
    en: "Check owner acceptance: whether stance, evidence, and next step are acceptable.",
  },
  comparison: {
    vi: "Kiểm tra owner-acceptance xem comparison có hai option, tradeoff và condition chưa.",
    en: "Check owner acceptance: whether the comparison has two options, tradeoff, and condition.",
  },
  counterpoint: {
    vi: "Kiểm tra owner-acceptance xem counterpoint có acknowledgement, evidence và tone phù hợp chưa.",
    en: "Check owner acceptance: whether the counterpoint has acknowledgment, evidence, and suitable tone.",
  },
  recommendation: {
    vi: "Kiểm tra owner-acceptance xem recommendation có evidence, risk và first step chưa.",
    en: "Check owner acceptance: whether the recommendation has evidence, risk, and first step.",
  },
  workplace_fairness: {
    vi: "Kiểm tra owner-acceptance xem workplace answer có process, evidence và review method chưa.",
    en: "Check owner acceptance: whether the workplace answer has process, evidence, and review method.",
  },
};

const ownerAnswerByFocus: Record<
  PunjabiB2OwnerAcceptanceSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ public-service notice owner-accepted ਹੈ ਜੇ deadline, documents ਅਤੇ contact step ਸਧਾਰਨ ਭਾਸ਼ਾ ਵਿੱਚ ਹਨ; ਇਹ learner ਨੂੰ ਅਗਲਾ ਕਦਮ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ।",
    r: "mere vichaar vich public-service notice owner-accepted hai je deadline, documents ate contact step sadhaaran bhaashaa vich han; eh learner nu aglaa kadam spasht kardaa hai.",
    vi: "Theo tôi, thông báo dịch vụ công được owner-accepted nếu hạn chót, giấy tờ và bước liên hệ dùng ngôn ngữ đơn giản; điều này làm rõ bước tiếp theo cho người học.",
    en: "In my view, a public-service notice is owner-accepted if the deadline, documents, and contact step use plain language; this makes the next step clear for the learner.",
  },
  comparison: {
    g: "ਘੱਟ rent owner-accepted ਤਦੋਂ ਹੈ ਜਦੋਂ commute, utilities ਅਤੇ transit route ਵੀ clear ਹਨ; ਨਹੀਂ ਤਾਂ advice ship-candidate ਨਹੀਂ ਬਣਦੀ।",
    r: "ghatt rent owner-accepted tadon hai jadon commute, utilities ate transit route vii clear han; nahi taan advice ship-candidate nahi bandii.",
    vi: "Tiền thuê thấp chỉ được owner-accepted khi commute, utilities và tuyến transit cũng rõ; nếu không, lời khuyên chưa thành ship-candidate.",
    en: "Lower rent is owner-accepted only when commute, utilities, and transit route are also clear; otherwise the advice is not a ship candidate.",
  },
  counterpoint: {
    g: "ਮੈਂ ਮੰਨਦਾ ਹਾਂ ਕਿ queue rule fair ਹੈ, ਪਰ urgent symptom ਲਈ evidence-based exception owner-accepted ਹੈ; ਇਹ safety ਲਈ ਹੈ, preference ਲਈ ਨਹੀਂ।",
    r: "main manndaa haan ki queue rule fair hai, par urgent symptom lai evidence-based exception owner-accepted hai; eh safety lai hai, preference lai nahi.",
    vi: "Tôi đồng ý quy tắc xếp hàng là công bằng, nhưng ngoại lệ dựa trên evidence cho triệu chứng khẩn được owner-accepted; điều này vì an toàn, không phải thiên vị.",
    en: "I agree the queue rule is fair, but an evidence-based exception for urgent symptoms is owner-accepted; this is for safety, not preference.",
  },
  recommendation: {
    g: "ਜੇ learner ਕੰਮ, study ਅਤੇ childcare ਸੰਭਾਲਦਾ ਹੈ, ਤਾਂ part-time program owner-accepted ਹੋ ਸਕਦਾ ਹੈ; fees, schedule ਅਤੇ support ਪਹਿਲਾਂ verify ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    r: "je learner kamm, study ate childcare sambhaaldaa hai, taan part-time program owner-accepted ho sakdaa hai; fees, schedule ate support pahilaan verify karne chaahiide han.",
    vi: "Nếu người học cân bằng việc làm, học và giữ trẻ, chương trình bán thời gian có thể được owner-accepted; học phí, lịch và hỗ trợ cần được xác minh trước.",
    en: "If a learner balances work, study, and childcare, a part-time program can be owner-accepted; fees, schedule, and support should be verified first.",
  },
  workplace_fairness: {
    g: "ਜੇ task board workload evidence ਦਿੰਦਾ ਹੈ, ਤਾਂ review meeting ਵਿੱਚ fair adjustment owner-accepted ਹੈ; direct blame owner-accepted ਨਹੀਂ ਹੈ।",
    r: "je task board workload evidence dindaa hai, taan review meeting vich fair adjustment owner-accepted hai; direct blame owner-accepted nahi hai.",
    vi: "Nếu task board cung cấp evidence về workload, đề xuất điều chỉnh công bằng trong buổi review được owner-accepted; blame trực tiếp thì không.",
    en: "If the task board provides workload evidence, a fair adjustment in the review meeting is owner-accepted; direct blame is not owner-accepted.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2OwnerAcceptanceSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Ví dụ Canada: owner-accepted nếu notice định cư nêu rõ form, ID, deadline và contact.",
    en: "Canada example: owner-accepted if a settlement notice clearly states form, ID, deadline, and contact.",
  },
  education: {
    vi: "Ví dụ Canada: owner-accepted nếu lựa chọn học có schedule, fees và childcare support rõ.",
    en: "Canada example: owner-accepted if the education choice has clear schedule, fees, and childcare support.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: owner-accepted nếu healthcare priority dựa trên symptom evidence và urgency.",
    en: "Canada example: owner-accepted if healthcare priority is based on symptom evidence and urgency.",
  },
  housing: {
    vi: "Ví dụ Canada: owner-accepted nếu rent, utilities, commute và transit đều đã được kiểm tra.",
    en: "Canada example: owner-accepted if rent, utilities, commute, and transit have all been checked.",
  },
  transport: {
    vi: "Ví dụ Canada: owner-accepted nếu người làm ca đã kiểm tra bus sớm, bus muộn, cuối tuần và transfer.",
    en: "Canada example: owner-accepted if a shift worker checked early buses, late buses, weekend service, and transfers.",
  },
  public_service: {
    vi: "Ví dụ Canada: owner-accepted nếu public-service reply có eligibility, documents, deadline và nơi hỏi thêm.",
    en: "Canada example: owner-accepted if a public-service reply has eligibility, documents, deadline, and where to ask questions.",
  },
  work: {
    vi: "Ví dụ Canada: owner-accepted nếu workload adjustment dựa trên task board, deadlines và meeting notes.",
    en: "Canada example: owner-accepted if workload adjustment is based on a task board, deadlines, and meeting notes.",
  },
};

export const punjabiB2OwnerAcceptanceSamples: PunjabiB2OwnerAcceptanceSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const acceptance = ownerAcceptanceByFocus[item.consistencyFocus];
    const prompt = ownerPromptByFocus[item.consistencyFocus];
    const answer = ownerAnswerByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? { vi: item.canadaPracticalExample_vi, en: item.canadaPracticalExample_en }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "owner_acceptance"),
      level: "B2",
      ownerAcceptanceFocus: item.consistencyFocus,
      topic: item.topic,
      ownerPrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} owner-acceptance ਲਈ final acceptance ਚੈੱਕ ਕਰੋ।`,
      ownerPrompt_romanization: `${item.consistencyPrompt_romanization} owner-acceptance lai final acceptance check karo.`,
      ownerPrompt_vi: `${item.consistencyPrompt_vi} Hãy kiểm tra final acceptance cho owner-acceptance.`,
      ownerPrompt_en: `${item.consistencyPrompt_en} Check final acceptance for owner acceptance.`,
      ownerAcceptedAnswer_gurmukhi: answer.g,
      ownerAcceptedAnswer_romanization: answer.r,
      ownerAcceptedAnswer_vi: answer.vi,
      ownerAcceptedAnswer_en: answer.en,
      ownerAcceptance_vi: acceptance.ownerVi,
      ownerAcceptance_en: acceptance.ownerEn,
      finalAcceptance_vi: acceptance.finalVi,
      finalAcceptance_en: acceptance.finalEn,
      shipCandidate_vi: acceptance.shipVi,
      shipCandidate_en: acceptance.shipEn,
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

export default punjabiB2OwnerAcceptanceSamples;
