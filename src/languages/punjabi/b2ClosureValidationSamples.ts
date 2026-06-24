// Punjabi B2 closure validation samples for upper-intermediate review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2ClosureValidationSamplesFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2ClosureValidationSamplesTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2ClosureValidationSample = {
  id: string;
  level: "B2";
  closureFocus: PunjabiB2ClosureValidationSamplesFocus;
  topic: PunjabiB2ClosureValidationSamplesTopic;
  closurePrompt_gurmukhi: string;
  closurePrompt_romanization: string;
  closurePrompt_vi: string;
  closurePrompt_en: string;
  closureAnswer_gurmukhi: string;
  closureAnswer_romanization: string;
  closureAnswer_vi: string;
  closureAnswer_en: string;
  closureValidation_vi: string[];
  closureValidation_en: string[];
  finalCrossCheck_vi: string[];
  finalCrossCheck_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  reasoningFlow_vi: string[];
  reasoningFlow_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const closureByFocus: Record<
  PunjabiB2ClosureValidationSamplesFocus,
  {
    closureVi: string[];
    closureEn: string[];
    crossVi: string[];
    crossEn: string[];
    preVi: string[];
    preEn: string[];
    flowVi: string[];
    flowEn: string[];
  }
> = {
  structured_opinion: {
    closureVi: ["Opinion không đổi hướng", "Evidence trả lời đúng claim", "Recommendation đóng lại logic"],
    closureEn: ["Opinion does not change direction", "Evidence answers the claim", "Recommendation closes the logic"],
    crossVi: ["Stance", "Reason", "Conclusion"],
    crossEn: ["Stance", "Reason", "Conclusion"],
    preVi: ["Giữ một chủ đề", "Giữ một reason chính", "Kết bằng next step"],
    preEn: ["Keep one topic", "Keep one main reason", "End with a next step"],
    flowVi: ["Opinion -> evidence", "Evidence -> result", "Result -> recommendation"],
    flowEn: ["Opinion -> evidence", "Evidence -> result", "Result -> recommendation"],
  },
  comparison: {
    closureVi: ["Hai phía có evidence", "Tradeoff có cost", "Recommendation có điều kiện"],
    closureEn: ["Both sides have evidence", "Tradeoff has cost", "Recommendation has a condition"],
    crossVi: ["Option A", "Option B", "Điều kiện chọn"],
    crossEn: ["Option A", "Option B", "Choosing condition"],
    preVi: ["Nêu hai lựa chọn", "Nêu cost thực tế", "Chốt khi nào chọn"],
    preEn: ["Name two choices", "Name the practical cost", "Close with when to choose"],
    flowVi: ["Option -> benefit", "Cost -> tradeoff", "Condition -> recommendation"],
    flowEn: ["Option -> benefit", "Cost -> tradeoff", "Condition -> recommendation"],
  },
  counterpoint: {
    closureVi: ["Công nhận trước", "Counterpoint có evidence", "Kết luận vẫn lịch sự"],
    closureEn: ["Acknowledge first", "Counterpoint has evidence", "Conclusion stays polite"],
    crossVi: ["Acknowledgement", "Exception", "Tone"],
    crossEn: ["Acknowledgment", "Exception", "Tone"],
    preVi: ["Công nhận điểm đúng", "Nêu giới hạn", "Đề xuất cách xử lý"],
    preEn: ["Acknowledge the valid point", "State the limit", "Suggest how to handle it"],
    flowVi: ["Acknowledgement -> limit", "Limit -> evidence", "Evidence -> exception"],
    flowEn: ["Acknowledgment -> limit", "Limit -> evidence", "Evidence -> exception"],
  },
  recommendation: {
    closureVi: ["Advice dựa trên evidence", "Risk được nêu rõ", "First step có thể làm được"],
    closureEn: ["Advice is based on evidence", "Risk is clearly named", "First step is doable"],
    crossVi: ["Evidence", "Risk", "Next step"],
    crossEn: ["Evidence", "Risk", "Next step"],
    preVi: ["Nêu giải pháp", "Nêu constraint", "Nêu bước kiểm tra"],
    preEn: ["Name the solution", "Name the constraint", "Name the check step"],
    flowVi: ["Need -> option", "Option -> tradeoff", "Tradeoff -> first step"],
    flowEn: ["Need -> option", "Option -> tradeoff", "Tradeoff -> first step"],
  },
  workplace_fairness: {
    closureVi: ["Fairness dựa trên process", "Workload có evidence", "Review method đóng lại vấn đề"],
    closureEn: ["Fairness is based on process", "Workload has evidence", "Review method closes the issue"],
    crossVi: ["Process", "Workload", "Review"],
    crossEn: ["Process", "Workload", "Review"],
    preVi: ["Nêu task board", "Nêu deadline", "Nêu review meeting"],
    preEn: ["Mention the task board", "Mention the deadline", "Mention the review meeting"],
    flowVi: ["Concern -> evidence", "Evidence -> process", "Process -> adjustment"],
    flowEn: ["Concern -> evidence", "Evidence -> process", "Process -> adjustment"],
  },
};

const closurePromptByFocus: Record<
  PunjabiB2ClosureValidationSamplesFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Kiểm tra lần cuối xem opinion, evidence và recommendation có đóng lại cùng một logic không.",
    en: "Final-check whether the opinion, evidence, and recommendation close one coherent logic.",
  },
  comparison: {
    vi: "Kiểm tra lần cuối xem tradeoff và điều kiện chọn có đóng lại comparison không.",
    en: "Final-check whether the tradeoff and choosing condition close the comparison.",
  },
  counterpoint: {
    vi: "Kiểm tra lần cuối xem counterpoint có lịch sự và có evidence cho exception không.",
    en: "Final-check whether the counterpoint is polite and has evidence for the exception.",
  },
  recommendation: {
    vi: "Kiểm tra lần cuối xem recommendation có risk, condition và first step không.",
    en: "Final-check whether the recommendation has risk, condition, and a first step.",
  },
  workplace_fairness: {
    vi: "Kiểm tra lần cuối xem workplace answer có process, workload evidence và review method không.",
    en: "Final-check whether the workplace answer has process, workload evidence, and a review method.",
  },
};

const closureAnswerByFocus: Record<
  PunjabiB2ClosureValidationSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ public notice ਵਿੱਚ plain language ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ, ਕਿਉਂਕਿ ਨਵੇਂ ਪਰਿਵਾਰ deadline ਅਤੇ documents ਜਲਦੀ ਸਮਝਣਾ ਚਾਹੁੰਦੇ ਹਨ; ਇਸ ਲਈ notice ਦੇ ਅੰਤ ਵਿੱਚ clear next step ਲਿਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
    r: "mere vichaar vich public notice vich plain language honii chaahiidii hai, kiunki nave parivaar deadline ate documents jaldi samajhnaa chaahunde han; is lai notice de ant vich clear next step likhṇaa chaahiidaa hai.",
    vi: "Theo tôi, thông báo công nên dùng ngôn ngữ rõ vì gia đình mới cần hiểu hạn chót và giấy tờ nhanh; vì vậy cuối thông báo nên ghi bước tiếp theo rõ ràng.",
    en: "In my view, a public notice should use plain language because new families need to understand deadlines and documents quickly, so the notice should end with a clear next step.",
  },
  comparison: {
    g: "ਘੱਟ rent ਪਹਿਲਾਂ ਚੰਗਾ ਲੱਗਦਾ ਹੈ, ਪਰ ਜੇ transit ਦੂਰ ਹੋਵੇ ਤਾਂ commute ਦਾ ਖਰਚ ਅਤੇ ਸਮਾਂ ਵੱਧ ਸਕਦਾ ਹੈ; ਇਸ ਲਈ final choice rent, route ਅਤੇ work schedule ਦੇਖ ਕੇ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।",
    r: "ghatt rent pahilaan changaa lagdaa hai, par je transit duur hove taan commute daa kharch ate samaa vadh sakdaa hai; is lai final choice rent, route ate work schedule dekh ke karnii chaahiidii hai.",
    vi: "Tiền thuê thấp ban đầu có vẻ tốt, nhưng nếu transit xa thì chi phí và thời gian đi lại có thể tăng; vì vậy lựa chọn cuối nên xét tiền thuê, tuyến đường và lịch làm.",
    en: "Lower rent looks good at first, but if transit is far, commute cost and time can rise; the final choice should consider rent, route, and work schedule.",
  },
  counterpoint: {
    g: "ਤੁਹਾਡੀ ਗੱਲ ਠੀਕ ਹੈ ਕਿ service queue fair ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ, ਪਰ urgent healthcare case ਵਿੱਚ evidence ਦੇ ਆਧਾਰ ਤੇ priority ਬਦਲ ਸਕਦੀ ਹੈ; ਇਹ exception safety ਲਈ ਹੈ।",
    r: "tuhaadii gall ṭhiik hai ki service queue fair honii chaahiidii hai, par urgent healthcare case vich evidence de adhaar te priority badal sakdii hai; eh exception safety lai hai.",
    vi: "Bạn nói đúng là hàng chờ dịch vụ nên công bằng, nhưng trong ca y tế khẩn, ưu tiên có thể đổi dựa trên bằng chứng; ngoại lệ này là vì an toàn.",
    en: "You are right that a service queue should be fair, but in an urgent healthcare case, priority can change based on evidence; this exception is for safety.",
  },
  recommendation: {
    g: "ਜੇ learner ਕੰਮ ਅਤੇ school ਨੂੰ ਇਕੱਠੇ ਸੰਭਾਲਦਾ ਹੈ, ਤਾਂ part-time option practical ਹੋ ਸਕਦਾ ਹੈ; final decision ਤੋਂ ਪਹਿਲਾਂ fees, schedule ਅਤੇ childcare support ਚੈੱਕ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    r: "je learner kamm ate school nu ikatthe sambhaaldaa hai, taan part-time option practical ho sakdaa hai; final decision ton pahilaan fees, schedule ate childcare support check karne chaahiide han.",
    vi: "Nếu người học phải cân bằng việc làm và trường, lựa chọn bán thời gian có thể thực tế; trước quyết định cuối nên kiểm tra học phí, lịch và hỗ trợ giữ trẻ.",
    en: "If a learner balances work and school, a part-time option may be practical; before the final decision, fees, schedule, and childcare support should be checked.",
  },
  workplace_fairness: {
    g: "ਜੇ workload uneven ਲੱਗਦਾ ਹੈ, ਤਾਂ direct blame ਕਰਨ ਦੀ ਥਾਂ task board, deadlines ਅਤੇ meeting notes ਦੇਖੀਏ; ਫਿਰ review ਵਿੱਚ fair adjustment ਸੁਝਾਈ ਜਾ ਸਕਦੀ ਹੈ।",
    r: "je workload uneven lagdaa hai, taan direct blame karan dii thaan task board, deadlines ate meeting notes dekhie; phir review vich fair adjustment sujhaaii jaa sakdii hai.",
    vi: "Nếu workload có vẻ không đều, thay vì blame trực tiếp, hãy xem task board, hạn chót và ghi chú họp; sau đó có thể đề xuất điều chỉnh công bằng trong buổi review.",
    en: "If workload seems uneven, instead of direct blame, check the task board, deadlines, and meeting notes; then a fair adjustment can be suggested in the review.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2ClosureValidationSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Ví dụ Canada: trước appointment định cư, người học kiểm tra form, ID, deadline và nơi hỏi thêm.",
    en: "Canada example: before a settlement appointment, learners check the form, ID, deadline, and where to ask questions.",
  },
  education: {
    vi: "Ví dụ Canada: người học so sánh full-time, part-time, fees, childcare và lịch làm trước khi chọn.",
    en: "Canada example: learners compare full-time, part-time, fees, childcare, and work schedule before choosing.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: triage dùng symptom evidence để giải thích priority trong clinic hoặc emergency.",
    en: "Canada example: triage uses symptom evidence to explain priority in a clinic or emergency setting.",
  },
  housing: {
    vi: "Ví dụ Canada: trước khi ký lease, kiểm tra rent, utilities, commute và transit route.",
    en: "Canada example: before signing a lease, check rent, utilities, commute, and transit route.",
  },
  transport: {
    vi: "Ví dụ Canada: người làm ca kiểm tra bus sáng sớm, tối muộn, cuối tuần và transfer.",
    en: "Canada example: shift workers check early buses, late buses, weekend service, and transfers.",
  },
  public_service: {
    vi: "Ví dụ Canada: public-service notice cần đóng lại bằng eligibility, deadline, documents và contact.",
    en: "Canada example: a public-service notice should close with eligibility, deadline, documents, and contact.",
  },
  work: {
    vi: "Ví dụ Canada: task board và review notes giúp nói về workload mà vẫn giữ tone chuyên nghiệp.",
    en: "Canada example: task boards and review notes help discuss workload while keeping a professional tone.",
  },
};

export const punjabiB2ClosureValidationSamples: PunjabiB2ClosureValidationSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const closure = closureByFocus[item.consistencyFocus];
    const prompt = closurePromptByFocus[item.consistencyFocus];
    const answer = closureAnswerByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? {
            vi: item.canadaPracticalExample_vi,
            en: item.canadaPracticalExample_en,
          }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "closure_validation"),
      level: "B2",
      closureFocus: item.consistencyFocus,
      topic: item.topic,
      closurePrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} closure validation ਲਈ reasoning flow ਦਾ ਅੰਤ ਚੈੱਕ ਕਰੋ।`,
      closurePrompt_romanization: `${item.consistencyPrompt_romanization} closure validation lai reasoning flow daa ant check karo.`,
      closurePrompt_vi: `${item.consistencyPrompt_vi} Hãy kiểm tra phần kết của reasoning flow.`,
      closurePrompt_en: `${item.consistencyPrompt_en} Check the closure of the reasoning flow.`,
      closureAnswer_gurmukhi: answer.g,
      closureAnswer_romanization: answer.r,
      closureAnswer_vi: answer.vi,
      closureAnswer_en: answer.en,
      closureValidation_vi: closure.closureVi,
      closureValidation_en: closure.closureEn,
      finalCrossCheck_vi: closure.crossVi,
      finalCrossCheck_en: closure.crossEn,
      preIntegration_vi: closure.preVi,
      preIntegration_en: closure.preEn,
      reasoningFlow_vi: closure.flowVi,
      reasoningFlow_en: closure.flowEn,
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

export default punjabiB2ClosureValidationSamples;
