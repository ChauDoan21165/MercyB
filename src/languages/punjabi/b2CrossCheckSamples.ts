// Punjabi B2 cross-check samples for upper-intermediate review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2CrossCheckSamplesFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2CrossCheckSamplesTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2CrossCheckSample = {
  id: string;
  level: "B2";
  crossCheckFocus: PunjabiB2CrossCheckSamplesFocus;
  topic: PunjabiB2CrossCheckSamplesTopic;
  crossCheckPrompt_gurmukhi: string;
  crossCheckPrompt_romanization: string;
  crossCheckPrompt_vi: string;
  crossCheckPrompt_en: string;
  verifiedAnswer_gurmukhi: string;
  verifiedAnswer_romanization: string;
  verifiedAnswer_vi: string;
  verifiedAnswer_en: string;
  crossCheck_vi: string[];
  crossCheck_en: string[];
  verification_vi: string[];
  verification_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  coherenceCheck_vi: string[];
  coherenceCheck_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const crossCheckByFocus: Record<
  PunjabiB2CrossCheckSamplesFocus,
  {
    crossVi: string[];
    crossEn: string[];
    verifyVi: string[];
    verifyEn: string[];
    preVi: string[];
    preEn: string[];
    coherenceVi: string[];
    coherenceEn: string[];
  }
> = {
  structured_opinion: {
    crossVi: ["Opinion có stance rõ", "Evidence trả lời đúng stance", "Recommendation không đổi hướng"],
    crossEn: ["Opinion has a clear stance", "Evidence answers the stance", "Recommendation does not change direction"],
    verifyVi: ["Kiểm tra claim", "Kiểm tra reason", "Kiểm tra conclusion"],
    verifyEn: ["Verify the claim", "Verify the reason", "Verify the conclusion"],
    preVi: ["Giữ một opinion", "Thêm một evidence", "Chốt bằng action thực tế"],
    preEn: ["Keep one opinion", "Add one piece of evidence", "Close with a practical action"],
    coherenceVi: ["Stance dẫn tới reason", "Reason dẫn tới recommendation", "Topic không bị lệch"],
    coherenceEn: ["Stance leads to reason", "Reason leads to recommendation", "Topic does not drift"],
  },
  comparison: {
    crossVi: ["Hai phía đều có evidence", "Tradeoff có cost", "Recommendation có điều kiện"],
    crossEn: ["Both sides have evidence", "Tradeoff includes cost", "Recommendation has a condition"],
    verifyVi: ["Kiểm tra option A", "Kiểm tra option B", "Kiểm tra điều kiện chọn"],
    verifyEn: ["Verify option A", "Verify option B", "Verify the choosing condition"],
    preVi: ["Nêu hai lựa chọn", "So sánh cost", "Nêu khi nào chọn"],
    preEn: ["Name two choices", "Compare cost", "Say when to choose"],
    coherenceVi: ["Comparison không một chiều", "Cost nối với decision", "Conclusion cân bằng"],
    coherenceEn: ["Comparison is not one-sided", "Cost connects to decision", "Conclusion is balanced"],
  },
  counterpoint: {
    crossVi: ["Acknowledgement đứng trước", "Counterpoint có evidence", "Tone không blame"],
    crossEn: ["Acknowledgment comes first", "Counterpoint has evidence", "Tone avoids blame"],
    verifyVi: ["Kiểm tra điểm đồng ý", "Kiểm tra giới hạn", "Kiểm tra exception"],
    verifyEn: ["Verify the agreement point", "Verify the limit", "Verify the exception"],
    preVi: ["Công nhận", "Nêu phản hồi", "Giữ lời mềm"],
    preEn: ["Acknowledge", "State the response", "Keep wording soft"],
    coherenceVi: ["Công nhận nối với phản biện", "Evidence nối với exception", "Recommendation không gắt"],
    coherenceEn: ["Acknowledgment connects to rebuttal", "Evidence connects to exception", "Recommendation is not harsh"],
  },
  recommendation: {
    crossVi: ["Recommendation dựa trên evidence", "Tradeoff được nêu", "First step cụ thể"],
    crossEn: ["Recommendation is based on evidence", "Tradeoff is stated", "First step is specific"],
    verifyVi: ["Kiểm tra điều kiện", "Kiểm tra risk", "Kiểm tra next step"],
    verifyEn: ["Verify the condition", "Verify the risk", "Verify the next step"],
    preVi: ["Nêu giải pháp", "Nêu constraint", "Nêu bước kiểm tra đầu"],
    preEn: ["Name the solution", "Name the constraint", "Name the first check"],
    coherenceVi: ["Evidence dẫn tới advice", "Risk dẫn tới điều kiện", "Action phù hợp thực tế"],
    coherenceEn: ["Evidence leads to advice", "Risk leads to a condition", "Action fits the situation"],
  },
  workplace_fairness: {
    crossVi: ["Fairness dựa trên process", "Evidence là workload", "Recommendation là review method"],
    crossEn: ["Fairness is based on process", "Evidence is workload", "Recommendation is a review method"],
    verifyVi: ["Kiểm tra process", "Kiểm tra workload", "Kiểm tra review time"],
    verifyEn: ["Verify the process", "Verify the workload", "Verify the review time"],
    preVi: ["Nêu task board", "Nêu deadline", "Nêu meeting review"],
    preEn: ["Mention the task board", "Mention the deadline", "Mention the review meeting"],
    coherenceVi: ["Process nối với fairness", "Evidence nối với workload", "Tone chuyên nghiệp"],
    coherenceEn: ["Process connects to fairness", "Evidence connects to workload", "Tone is professional"],
  },
};

const crossCheckPromptByFocus: Record<
  PunjabiB2CrossCheckSamplesFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Cross-check xem opinion, evidence và recommendation có cùng một logic không.",
    en: "Cross-check whether the opinion, evidence, and recommendation share one logic.",
  },
  comparison: {
    vi: "Cross-check xem comparison có hai phía, tradeoff và điều kiện chọn nhất quán không.",
    en: "Cross-check whether the comparison has consistent sides, tradeoff, and choosing condition.",
  },
  counterpoint: {
    vi: "Cross-check xem counterpoint có công nhận trước, evidence sau và tone lịch sự không.",
    en: "Cross-check whether the counterpoint has acknowledgment first, evidence after, and a polite tone.",
  },
  recommendation: {
    vi: "Cross-check xem recommendation có evidence, tradeoff và bước đầu thực tế không.",
    en: "Cross-check whether the recommendation has evidence, tradeoff, and a practical first step.",
  },
  workplace_fairness: {
    vi: "Cross-check xem workplace answer có process, workload evidence và review method không.",
    en: "Cross-check whether the workplace answer has process, workload evidence, and a review method.",
  },
};

const verifiedAnswerByFocus: Record<
  PunjabiB2CrossCheckSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ public-service notice ਸਧਾਰਨ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ ਨਵੇਂ ਪਰਿਵਾਰ deadline, documents ਅਤੇ ਅਗਲਾ ਕਦਮ ਇਕੱਠੇ ਸਮਝਣਾ ਚਾਹੁੰਦੇ ਹਨ; ਇਸ ਲਈ notice ਵਿੱਚ short summary ਅਤੇ phone option ਦੇਣਾ ਠੀਕ ਹੈ।",
    r: "mere vichaar vich public-service notice sadhaaran honaa chaahiidaa hai, kiunki nave parivaar deadline, documents ate aglaa kadam ikatthe samajhnaa chaahunde han; is lai notice vich short summary ate phone option denaa ṭhiik hai.",
    vi: "Theo tôi, thông báo dịch vụ công nên đơn giản vì gia đình mới cần hiểu hạn chót, giấy tờ và bước tiếp theo cùng lúc; vì vậy nên có tóm tắt ngắn và lựa chọn gọi điện.",
    en: "In my view, a public-service notice should be simple because new families need to understand the deadline, documents, and next step together, so a short summary and phone option make sense.",
  },
  comparison: {
    g: "ਸਸਤਾ rent ਮਦਦ ਕਰਦਾ ਹੈ, ਪਰ ਜੇ ਘਰ transit ਤੋਂ ਦੂਰ ਹੈ ਤਾਂ commute ਅਤੇ taxi ਦਾ ਖਰਚ ਵੱਧ ਸਕਦਾ ਹੈ; ਇਸ ਲਈ housing decision rent ਨਾਲ ਨਾਲ route ਤੇ ਵੀ ਦੇਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
    r: "sastaa rent madad kardaa hai, par je ghar transit ton duur hai taan commute ate taxi daa kharch vadh sakdaa hai; is lai housing decision rent naal naal route te vii dekhṇaa chaahiidaa hai.",
    vi: "Tiền thuê rẻ có ích, nhưng nếu nhà xa transit thì chi phí đi lại và taxi có thể tăng; vì vậy quyết định nhà ở nên xét cả tiền thuê và tuyến đường.",
    en: "Lower rent helps, but if the home is far from transit, commute and taxi costs can rise; the housing decision should consider both rent and route.",
  },
  counterpoint: {
    g: "ਮੈਂ ਮੰਨਦਾ ਹਾਂ ਕਿ ਇੱਕੋ rule fair ਲੱਗਦਾ ਹੈ, ਪਰ healthcare ਵਿੱਚ urgent symptom ਲਈ exception ਲੋੜੀਂਦੀ ਹੈ; evidence ਦੇਖ ਕੇ priority ਬਦਲਣਾ unfair ਨਹੀਂ, ਸੁਰੱਖਿਆ ਲਈ ਹੈ।",
    r: "main manndaa haan ki ikko rule fair lagdaa hai, par healthcare vich urgent symptom lai exception lorindii hai; evidence dekh ke priority badalṇaa unfair nahi, surakhiaa lai hai.",
    vi: "Tôi đồng ý một quy tắc chung có vẻ công bằng, nhưng trong y tế cần ngoại lệ cho triệu chứng khẩn; đổi ưu tiên dựa trên bằng chứng không phải bất công mà là để an toàn.",
    en: "I agree that one rule can seem fair, but healthcare needs exceptions for urgent symptoms; changing priority based on evidence is not unfair, it is for safety.",
  },
  recommendation: {
    g: "ਜੇ learner ਕੰਮ, school ਅਤੇ childcare ਇਕੱਠੇ ਸੰਭਾਲਦਾ ਹੈ, ਤਾਂ part-time program ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ; ਪਹਿਲਾਂ fees, schedule ਅਤੇ support options cross-check ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    r: "je learner kamm, school ate childcare ikatthe sambhaaldaa hai, taan part-time program vadhiyaa ho sakdaa hai; pahilaan fees, schedule ate support options cross-check karne chaahiide han.",
    vi: "Nếu người học phải cân bằng việc làm, trường và giữ trẻ, chương trình bán thời gian có thể tốt hơn; trước hết nên cross-check học phí, lịch và các hỗ trợ.",
    en: "If a learner balances work, school, and childcare, a part-time program may be better; first cross-check fees, schedule, and support options.",
  },
  workplace_fairness: {
    g: "ਟੀਮ fairness ਲਈ ਸਿਰਫ਼ complaint ਕਾਫ਼ੀ ਨਹੀਂ; task board, deadlines ਅਤੇ review meeting ਨਾਲ evidence ਸਪਸ਼ਟ ਹੁੰਦਾ ਹੈ ਅਤੇ workload ਬਾਰੇ ਗੱਲ professional ਰਹਿੰਦੀ ਹੈ।",
    r: "team fairness lai sirf complaint kaafii nahi; task board, deadlines ate review meeting naal evidence spasht hundaa hai ate workload baare gall professional rahindii hai.",
    vi: "Để công bằng trong đội, chỉ phàn nàn là chưa đủ; task board, hạn chót và buổi review làm evidence rõ hơn và giữ cuộc nói chuyện về workload chuyên nghiệp.",
    en: "For team fairness, a complaint alone is not enough; the task board, deadlines, and review meeting make the evidence clear and keep the workload discussion professional.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2CrossCheckSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Ví dụ Canada: settlement notice nên cross-check form, ID, appointment và deadline trước khi gửi.",
    en: "Canada example: a settlement notice should cross-check forms, ID, appointments, and deadlines before sending.",
  },
  education: {
    vi: "Ví dụ Canada: so sánh full-time, part-time, fees và childcare support trước khi chọn chương trình.",
    en: "Canada example: compare full-time, part-time, fees, and childcare support before choosing a program.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: triage cần evidence về symptom để giải thích vì sao priority thay đổi.",
    en: "Canada example: triage needs symptom evidence to explain why priority changes.",
  },
  housing: {
    vi: "Ví dụ Canada: cross-check rent, commute, utilities và transit trước khi ký lease.",
    en: "Canada example: cross-check rent, commute, utilities, and transit before signing a lease.",
  },
  transport: {
    vi: "Ví dụ Canada: người làm ca cần kiểm tra route sáng sớm, tối muộn, cuối tuần và transfer.",
    en: "Canada example: shift workers need to check early routes, late routes, weekend service, and transfers.",
  },
  public_service: {
    vi: "Ví dụ Canada: public service forms nên ghi eligibility, deadline và contact rõ ràng.",
    en: "Canada example: public service forms should clearly state eligibility, deadline, and contact options.",
  },
  work: {
    vi: "Ví dụ Canada: task board và meeting notes giúp cross-check workload mà không blame cá nhân.",
    en: "Canada example: task boards and meeting notes help cross-check workload without personal blame.",
  },
};

export const punjabiB2CrossCheckSamples: PunjabiB2CrossCheckSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const checks = crossCheckByFocus[item.consistencyFocus];
    const prompt = crossCheckPromptByFocus[item.consistencyFocus];
    const answer = verifiedAnswerByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? {
            vi: item.canadaPracticalExample_vi,
            en: item.canadaPracticalExample_en,
          }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "cross_check"),
      level: "B2",
      crossCheckFocus: item.consistencyFocus,
      topic: item.topic,
      crossCheckPrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} cross-check ਲਈ opinion, evidence ਅਤੇ recommendation ਦੀ ਲੜੀ ਵੇਖੋ।`,
      crossCheckPrompt_romanization: `${item.consistencyPrompt_romanization} cross-check lai opinion, evidence ate recommendation dii larrii vekho.`,
      crossCheckPrompt_vi: `${item.consistencyPrompt_vi} Hãy cross-check chuỗi opinion, evidence và recommendation.`,
      crossCheckPrompt_en: `${item.consistencyPrompt_en} Cross-check the opinion, evidence, and recommendation chain.`,
      verifiedAnswer_gurmukhi: answer.g,
      verifiedAnswer_romanization: answer.r,
      verifiedAnswer_vi: answer.vi,
      verifiedAnswer_en: answer.en,
      crossCheck_vi: checks.crossVi,
      crossCheck_en: checks.crossEn,
      verification_vi: checks.verifyVi,
      verification_en: checks.verifyEn,
      preIntegration_vi: checks.preVi,
      preIntegration_en: checks.preEn,
      coherenceCheck_vi: checks.coherenceVi,
      coherenceCheck_en: checks.coherenceEn,
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

export default punjabiB2CrossCheckSamples;
