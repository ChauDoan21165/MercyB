// Punjabi B2 final validation set for upper-intermediate review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2FinalValidationSetFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2FinalValidationSetTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2FinalValidationSetEntry = {
  id: string;
  level: "B2";
  validationFocus: PunjabiB2FinalValidationSetFocus;
  topic: PunjabiB2FinalValidationSetTopic;
  validationPrompt_gurmukhi: string;
  validationPrompt_romanization: string;
  validationPrompt_vi: string;
  validationPrompt_en: string;
  finalAnswer_gurmukhi: string;
  finalAnswer_romanization: string;
  finalAnswer_vi: string;
  finalAnswer_en: string;
  finalValidation_vi: string[];
  finalValidation_en: string[];
  crossCheck_vi: string[];
  crossCheck_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  publicServiceLink_vi: string[];
  publicServiceLink_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const validationByFocus: Record<
  PunjabiB2FinalValidationSetFocus,
  {
    finalVi: string[];
    finalEn: string[];
    crossVi: string[];
    crossEn: string[];
    preVi: string[];
    preEn: string[];
    publicVi: string[];
    publicEn: string[];
  }
> = {
  structured_opinion: {
    finalVi: ["Stance giữ nguyên", "Evidence hỗ trợ stance", "Conclusion nêu bước thực tế"],
    finalEn: ["Stance stays stable", "Evidence supports the stance", "Conclusion names a practical step"],
    crossVi: ["Opinion nối với evidence", "Evidence nối với recommendation", "Topic không bị lệch"],
    crossEn: ["Opinion connects to evidence", "Evidence connects to recommendation", "Topic does not drift"],
    preVi: ["Giữ một claim", "Thêm một reason", "Chốt bằng action"],
    preEn: ["Keep one claim", "Add one reason", "Close with action"],
    publicVi: ["Có thể dùng cho notice", "Có thể dùng cho form", "Có thể dùng cho appointment"],
    publicEn: ["Works for notices", "Works for forms", "Works for appointments"],
  },
  comparison: {
    finalVi: ["Hai lựa chọn rõ", "Tradeoff có cost", "Recommendation có điều kiện"],
    finalEn: ["Two choices are clear", "Tradeoff includes cost", "Recommendation has a condition"],
    crossVi: ["Không một chiều", "Cost nối với decision", "Điều kiện chọn cụ thể"],
    crossEn: ["Not one-sided", "Cost connects to decision", "Choosing condition is specific"],
    preVi: ["Nêu option A", "Nêu option B", "Nêu khi nào chọn"],
    preEn: ["Name option A", "Name option B", "Say when to choose"],
    publicVi: ["Hợp cho housing", "Hợp cho transport", "Hợp cho education choices"],
    publicEn: ["Fits housing", "Fits transport", "Fits education choices"],
  },
  counterpoint: {
    finalVi: ["Acknowledgement trước", "Counterpoint có evidence", "Tone lịch sự"],
    finalEn: ["Acknowledgment comes first", "Counterpoint has evidence", "Tone is polite"],
    crossVi: ["Công nhận nối với phản biện", "Evidence nối với exception", "Recommendation không gắt"],
    crossEn: ["Acknowledgment connects to rebuttal", "Evidence connects to exception", "Recommendation is not harsh"],
    preVi: ["Công nhận điểm đúng", "Nêu giới hạn", "Đề xuất cách xử lý"],
    preEn: ["Acknowledge the valid point", "State the limit", "Suggest how to handle it"],
    publicVi: ["Hợp cho healthcare", "Hợp cho public-office queue", "Hợp cho service complaint"],
    publicEn: ["Fits healthcare", "Fits public-office queues", "Fits service complaints"],
  },
  recommendation: {
    finalVi: ["Advice dựa trên evidence", "Risk được nêu", "First step cụ thể"],
    finalEn: ["Advice is based on evidence", "Risk is named", "First step is specific"],
    crossVi: ["Evidence dẫn tới advice", "Tradeoff dẫn tới condition", "Action phù hợp thực tế"],
    crossEn: ["Evidence leads to advice", "Tradeoff leads to condition", "Action fits the situation"],
    preVi: ["Nêu giải pháp", "Nêu constraint", "Nêu bước kiểm tra đầu"],
    preEn: ["Name the solution", "Name the constraint", "Name the first check"],
    publicVi: ["Hợp cho settlement", "Hợp cho school support", "Hợp cho service navigation"],
    publicEn: ["Fits settlement", "Fits school support", "Fits service navigation"],
  },
  workplace_fairness: {
    finalVi: ["Fairness dựa trên process", "Workload có evidence", "Review method rõ"],
    finalEn: ["Fairness is based on process", "Workload has evidence", "Review method is clear"],
    crossVi: ["Process nối với fairness", "Evidence nối với workload", "Tone chuyên nghiệp"],
    crossEn: ["Process connects to fairness", "Evidence connects to workload", "Tone is professional"],
    preVi: ["Nêu task board", "Nêu deadline", "Nêu review meeting"],
    preEn: ["Mention the task board", "Mention the deadline", "Mention the review meeting"],
    publicVi: ["Hợp cho workplace meeting", "Hợp cho schedule discussion", "Hợp cho workload review"],
    publicEn: ["Fits workplace meetings", "Fits schedule discussions", "Fits workload reviews"],
  },
};

const validationPromptByFocus: Record<
  PunjabiB2FinalValidationSetFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Final-validate xem stance, evidence và recommendation có cùng một hướng không.",
    en: "Final-validate whether the stance, evidence, and recommendation point in the same direction.",
  },
  comparison: {
    vi: "Final-validate xem hai lựa chọn, tradeoff và điều kiện chọn có rõ không.",
    en: "Final-validate whether the two choices, tradeoff, and choosing condition are clear.",
  },
  counterpoint: {
    vi: "Final-validate xem counterpoint có công nhận trước và phản hồi lịch sự không.",
    en: "Final-validate whether the counterpoint acknowledges first and replies politely.",
  },
  recommendation: {
    vi: "Final-validate xem recommendation có evidence, risk và first step thực tế không.",
    en: "Final-validate whether the recommendation has evidence, risk, and a practical first step.",
  },
  workplace_fairness: {
    vi: "Final-validate xem workplace response có process, evidence và review method không.",
    en: "Final-validate whether the workplace response has process, evidence, and a review method.",
  },
};

const finalAnswerByFocus: Record<
  PunjabiB2FinalValidationSetFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ service notice ਸਧਾਰਨ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ ਨਵੇਂ ਪਰਿਵਾਰ deadline ਅਤੇ documents ਜਲਦੀ ਸਮਝਣਾ ਚਾਹੁੰਦੇ ਹਨ; ਇਸ ਲਈ notice ਵਿੱਚ short summary ਅਤੇ contact step ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ।",
    r: "mere vichaar vich service notice sadhaaran honaa chaahiidaa hai, kiunki nave parivaar deadline ate documents jaldi samajhnaa chaahunde han; is lai notice vich short summary ate contact step denaa chaahiidaa hai.",
    vi: "Theo tôi, thông báo dịch vụ nên đơn giản vì gia đình mới cần hiểu hạn chót và giấy tờ nhanh; vì vậy nên có tóm tắt ngắn và bước liên hệ.",
    en: "In my view, a service notice should be simple because new families need to understand deadlines and documents quickly, so it should include a short summary and contact step.",
  },
  comparison: {
    g: "ਘੱਟ rent ਚੰਗਾ ਲੱਗ ਸਕਦਾ ਹੈ, ਪਰ ਜੇ commute ਲੰਮਾ ਹੋਵੇ ਤਾਂ transport cost ਵੱਧ ਸਕਦੀ ਹੈ; ਇਸ ਲਈ housing decision rent ਅਤੇ route ਦੋਵੇਂ ਦੇਖ ਕੇ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
    r: "ghatt rent changaa lag sakdaa hai, par je commute lammaa hove taan transport cost vadh sakdii hai; is lai housing decision rent ate route dovein dekh ke karnaa chaahiidaa hai.",
    vi: "Tiền thuê thấp có thể hấp dẫn, nhưng nếu đường đi làm dài thì chi phí đi lại có thể tăng; vì vậy quyết định nhà ở nên xét cả tiền thuê và tuyến đường.",
    en: "Lower rent can look attractive, but if the commute is long, transport cost can rise; the housing decision should consider both rent and route.",
  },
  counterpoint: {
    g: "ਮੈਂ ਮੰਨਦਾ ਹਾਂ ਕਿ first-come rule ਆਮ ਤੌਰ ਤੇ fair ਹੈ, ਪਰ healthcare ਵਿੱਚ urgent symptom ਲਈ priority ਬਦਲ ਸਕਦੀ ਹੈ; ਇਹ exception safety ਲਈ ਹੈ, preference ਲਈ ਨਹੀਂ।",
    r: "main manndaa haan ki first-come rule aam taur te fair hai, par healthcare vich urgent symptom lai priority badal sakdii hai; eh exception safety lai hai, preference lai nahi.",
    vi: "Tôi đồng ý quy tắc ai đến trước thường công bằng, nhưng trong y tế triệu chứng khẩn có thể đổi ưu tiên; ngoại lệ này vì an toàn, không phải vì thiên vị.",
    en: "I agree that first-come rules are usually fair, but in healthcare an urgent symptom can change priority; this exception is for safety, not preference.",
  },
  recommendation: {
    g: "ਜੇ adult learner ਕੰਮ ਅਤੇ study ਇਕੱਠੇ ਕਰਦਾ ਹੈ, ਤਾਂ part-time program practical ਹੋ ਸਕਦਾ ਹੈ; ਪਹਿਲਾਂ schedule, fees ਅਤੇ childcare support final-check ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    r: "je adult learner kamm ate study ikatthe kardaa hai, taan part-time program practical ho sakdaa hai; pahilaan schedule, fees ate childcare support final-check karne chaahiide han.",
    vi: "Nếu người học trưởng thành vừa làm vừa học, chương trình bán thời gian có thể thực tế hơn; trước hết nên kiểm tra lần cuối lịch, học phí và hỗ trợ giữ trẻ.",
    en: "If an adult learner works and studies at the same time, a part-time program may be practical; first final-check the schedule, fees, and childcare support.",
  },
  workplace_fairness: {
    g: "ਜੇ workload uneven ਲੱਗਦਾ ਹੈ, ਤਾਂ blame ਕਰਨ ਦੀ ਥਾਂ task board ਅਤੇ deadlines ਵੇਖੀਏ; ਫਿਰ review meeting ਵਿੱਚ fair adjustment ਸੁਝਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।",
    r: "je workload uneven lagdaa hai, taan blame karan dii thaan task board ate deadlines vekhiie; phir review meeting vich fair adjustment sujhaaiaa jaa sakdaa hai.",
    vi: "Nếu workload có vẻ không đều, thay vì blame, hãy xem task board và hạn chót; sau đó có thể đề xuất điều chỉnh công bằng trong buổi review.",
    en: "If workload seems uneven, instead of blaming, check the task board and deadlines; then a fair adjustment can be suggested in the review meeting.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2FinalValidationSetTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Ví dụ Canada: final-check form định cư, deadline, giấy tờ và nơi liên hệ trước appointment.",
    en: "Canada example: final-check a settlement form, deadline, documents, and contact point before an appointment.",
  },
  education: {
    vi: "Ví dụ Canada: so sánh part-time, full-time, fees và childcare trước khi chọn chương trình.",
    en: "Canada example: compare part-time, full-time, fees, and childcare before choosing a program.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: urgent symptoms có thể thay đổi thứ tự ưu tiên trong clinic hoặc emergency.",
    en: "Canada example: urgent symptoms can change priority order in a clinic or emergency setting.",
  },
  housing: {
    vi: "Ví dụ Canada: kiểm tra rent, utilities, commute và transit trước khi ký lease.",
    en: "Canada example: check rent, utilities, commute, and transit before signing a lease.",
  },
  transport: {
    vi: "Ví dụ Canada: người làm ca nên kiểm tra bus sáng sớm, tối muộn, cuối tuần và transfer.",
    en: "Canada example: shift workers should check early buses, late buses, weekend service, and transfers.",
  },
  public_service: {
    vi: "Ví dụ Canada: public-service notice cần eligibility, deadline, documents và contact rõ.",
    en: "Canada example: a public-service notice needs clear eligibility, deadline, documents, and contact.",
  },
  work: {
    vi: "Ví dụ Canada: task board, deadline và review notes giúp nói về workload chuyên nghiệp.",
    en: "Canada example: a task board, deadlines, and review notes help discuss workload professionally.",
  },
};

export const punjabiB2FinalValidationSet: PunjabiB2FinalValidationSetEntry[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const validation = validationByFocus[item.consistencyFocus];
    const prompt = validationPromptByFocus[item.consistencyFocus];
    const answer = finalAnswerByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? {
            vi: item.canadaPracticalExample_vi,
            en: item.canadaPracticalExample_en,
          }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "final_validation"),
      level: "B2",
      validationFocus: item.consistencyFocus,
      topic: item.topic,
      validationPrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} final validation ਲਈ opinion, evidence ਅਤੇ next step ਨੂੰ ਮਿਲਾਓ।`,
      validationPrompt_romanization: `${item.consistencyPrompt_romanization} final validation lai opinion, evidence ate next step nu milao.`,
      validationPrompt_vi: `${item.consistencyPrompt_vi} Hãy final-validate opinion, evidence và next step.`,
      validationPrompt_en: `${item.consistencyPrompt_en} Final-validate the opinion, evidence, and next step.`,
      finalAnswer_gurmukhi: answer.g,
      finalAnswer_romanization: answer.r,
      finalAnswer_vi: answer.vi,
      finalAnswer_en: answer.en,
      finalValidation_vi: validation.finalVi,
      finalValidation_en: validation.finalEn,
      crossCheck_vi: validation.crossVi,
      crossCheck_en: validation.crossEn,
      preIntegration_vi: validation.preVi,
      preIntegration_en: validation.preEn,
      publicServiceLink_vi: validation.publicVi,
      publicServiceLink_en: validation.publicEn,
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

export default punjabiB2FinalValidationSet;
