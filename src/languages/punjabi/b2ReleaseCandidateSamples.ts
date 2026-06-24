// Punjabi B2 release-candidate samples for upper-intermediate review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2ReleaseCandidateSamplesFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2ReleaseCandidateSamplesTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2ReleaseCandidateSample = {
  id: string;
  level: "B2";
  releaseFocus: PunjabiB2ReleaseCandidateSamplesFocus;
  topic: PunjabiB2ReleaseCandidateSamplesTopic;
  releasePrompt_gurmukhi: string;
  releasePrompt_romanization: string;
  releasePrompt_vi: string;
  releasePrompt_en: string;
  candidateAnswer_gurmukhi: string;
  candidateAnswer_romanization: string;
  candidateAnswer_vi: string;
  candidateAnswer_en: string;
  releaseCandidate_vi: string[];
  releaseCandidate_en: string[];
  closureValidation_vi: string[];
  closureValidation_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  reasoningReadiness_vi: string[];
  reasoningReadiness_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const releaseByFocus: Record<
  PunjabiB2ReleaseCandidateSamplesFocus,
  {
    releaseVi: string[];
    releaseEn: string[];
    closureVi: string[];
    closureEn: string[];
    preVi: string[];
    preEn: string[];
    readinessVi: string[];
    readinessEn: string[];
  }
> = {
  structured_opinion: {
    releaseVi: ["Stance đủ rõ để dùng", "Evidence gắn trực tiếp", "Recommendation đóng logic"],
    releaseEn: ["Stance is clear enough to use", "Evidence connects directly", "Recommendation closes the logic"],
    closureVi: ["Không đổi topic", "Không bỏ reason", "Không mất conclusion"],
    closureEn: ["No topic drift", "Do not drop the reason", "Do not lose the conclusion"],
    preVi: ["Giữ claim", "Giữ reason", "Giữ next step"],
    preEn: ["Keep the claim", "Keep the reason", "Keep the next step"],
    readinessVi: ["Opinion -> evidence", "Evidence -> public action", "Action -> recommendation"],
    readinessEn: ["Opinion -> evidence", "Evidence -> public action", "Action -> recommendation"],
  },
  comparison: {
    releaseVi: ["Hai option rõ", "Tradeoff thực tế", "Điều kiện chọn cụ thể"],
    releaseEn: ["Two options are clear", "Tradeoff is practical", "Choosing condition is specific"],
    closureVi: ["Không một chiều", "Không bỏ cost", "Không tuyệt đối hóa"],
    closureEn: ["Not one-sided", "Do not drop cost", "Do not make it absolute"],
    preVi: ["Nêu option A", "Nêu option B", "Nêu condition"],
    preEn: ["Name option A", "Name option B", "Name the condition"],
    readinessVi: ["Choice -> benefit", "Cost -> tradeoff", "Condition -> final advice"],
    readinessEn: ["Choice -> benefit", "Cost -> tradeoff", "Condition -> final advice"],
  },
  counterpoint: {
    releaseVi: ["Acknowledgement trước", "Counterpoint có evidence", "Tone mềm"],
    releaseEn: ["Acknowledgment first", "Counterpoint has evidence", "Tone is soft"],
    closureVi: ["Không always/never", "Không phản bác gắt", "Không bỏ exception"],
    closureEn: ["No always/never", "No harsh rebuttal", "Do not drop the exception"],
    preVi: ["Công nhận", "Giới hạn", "Exception"],
    preEn: ["Acknowledge", "Limit", "Exception"],
    readinessVi: ["Acknowledgement -> limit", "Limit -> evidence", "Evidence -> safe exception"],
    readinessEn: ["Acknowledgment -> limit", "Limit -> evidence", "Evidence -> safe exception"],
  },
  recommendation: {
    releaseVi: ["Advice có evidence", "Risk được nêu", "First step thực tế"],
    releaseEn: ["Advice has evidence", "Risk is named", "First step is practical"],
    closureVi: ["Không overclaim", "Không bỏ budget", "Không bỏ constraint"],
    closureEn: ["Do not overclaim", "Do not skip budget", "Do not skip constraints"],
    preVi: ["Nêu solution", "Nêu condition", "Nêu first check"],
    preEn: ["Name the solution", "Name the condition", "Name the first check"],
    readinessVi: ["Need -> option", "Option -> risk", "Risk -> first step"],
    readinessEn: ["Need -> option", "Option -> risk", "Risk -> first step"],
  },
  workplace_fairness: {
    releaseVi: ["Process rõ", "Evidence là workload", "Review method cụ thể"],
    releaseEn: ["Process is clear", "Evidence is workload", "Review method is specific"],
    closureVi: ["Không blame", "Không cảm tính", "Không bỏ review"],
    closureEn: ["No blame", "Do not become emotional", "Do not drop the review"],
    preVi: ["Task board", "Deadline", "Review meeting"],
    preEn: ["Task board", "Deadline", "Review meeting"],
    readinessVi: ["Concern -> workload evidence", "Evidence -> process", "Process -> fair adjustment"],
    readinessEn: ["Concern -> workload evidence", "Evidence -> process", "Process -> fair adjustment"],
  },
};

const releasePromptByFocus: Record<
  PunjabiB2ReleaseCandidateSamplesFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Kiểm tra release-candidate xem opinion, evidence và recommendation đã sẵn sàng chưa.",
    en: "Check the release candidate for whether opinion, evidence, and recommendation are ready.",
  },
  comparison: {
    vi: "Kiểm tra release-candidate xem comparison có tradeoff và điều kiện chọn đủ rõ chưa.",
    en: "Check the release candidate for whether the comparison has a clear tradeoff and choosing condition.",
  },
  counterpoint: {
    vi: "Kiểm tra release-candidate xem counterpoint có công nhận trước và evidence sau chưa.",
    en: "Check the release candidate for whether the counterpoint acknowledges first and gives evidence after.",
  },
  recommendation: {
    vi: "Kiểm tra release-candidate xem recommendation có risk, condition và first step chưa.",
    en: "Check the release candidate for whether the recommendation has risk, condition, and first step.",
  },
  workplace_fairness: {
    vi: "Kiểm tra release-candidate xem workplace answer có process và review method chưa.",
    en: "Check the release candidate for whether the workplace answer has process and a review method.",
  },
};

const candidateAnswerByFocus: Record<
  PunjabiB2ReleaseCandidateSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ public-service notice ਸਧਾਰਨ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ ਨਵੇਂ ਪਰਿਵਾਰ deadline, documents ਅਤੇ ਅਗਲਾ ਕਦਮ ਇਕੱਠੇ ਸਮਝਣਾ ਚਾਹੁੰਦੇ ਹਨ; ਇਸ ਲਈ notice ਦੇ ਅੰਤ ਵਿੱਚ contact option ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
    r: "mere vichaar vich public-service notice sadhaaran honaa chaahiidaa hai, kiunki nave parivaar deadline, documents ate aglaa kadam ikatthe samajhnaa chaahunde han; is lai notice de ant vich contact option honii chaahiidii hai.",
    vi: "Theo tôi, thông báo dịch vụ công nên đơn giản vì gia đình mới cần hiểu hạn chót, giấy tờ và bước tiếp theo cùng lúc; vì vậy cuối thông báo nên có lựa chọn liên hệ.",
    en: "In my view, a public-service notice should be simple because new families need to understand deadlines, documents, and the next step together, so the notice should end with a contact option.",
  },
  comparison: {
    g: "ਘੱਟ rent ਮਦਦ ਕਰਦਾ ਹੈ, ਪਰ ਜੇ transit ਦੂਰ ਹੋਵੇ ਤਾਂ commute cost ਅਤੇ ਸਮਾਂ ਵੱਧ ਸਕਦਾ ਹੈ; ਇਸ ਲਈ final advice rent, route ਅਤੇ work schedule ਦੇ ਅਧਾਰ ਤੇ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
    r: "ghatt rent madad kardaa hai, par je transit duur hove taan commute cost ate samaa vadh sakdaa hai; is lai final advice rent, route ate work schedule de adhaar te honii chaahiidii hai.",
    vi: "Tiền thuê thấp có ích, nhưng nếu transit xa thì chi phí và thời gian đi lại có thể tăng; vì vậy lời khuyên cuối nên dựa trên tiền thuê, tuyến đường và lịch làm.",
    en: "Lower rent helps, but if transit is far, commute cost and time can rise; final advice should be based on rent, route, and work schedule.",
  },
  counterpoint: {
    g: "ਮੈਂ ਮੰਨਦਾ ਹਾਂ ਕਿ ਇੱਕੋ queue rule fair ਲੱਗਦਾ ਹੈ, ਪਰ urgent healthcare symptom ਲਈ priority ਬਦਲ ਸਕਦੀ ਹੈ; evidence ਹੋਵੇ ਤਾਂ exception safety ਲਈ ਸਹੀ ਹੈ।",
    r: "main manndaa haan ki ikko queue rule fair lagdaa hai, par urgent healthcare symptom lai priority badal sakdii hai; evidence hove taan exception safety lai sahii hai.",
    vi: "Tôi đồng ý một quy tắc xếp hàng chung có vẻ công bằng, nhưng triệu chứng y tế khẩn có thể đổi ưu tiên; nếu có bằng chứng, ngoại lệ vì an toàn là hợp lý.",
    en: "I agree that one queue rule seems fair, but an urgent healthcare symptom can change priority; with evidence, an exception for safety is reasonable.",
  },
  recommendation: {
    g: "ਜੇ learner ਕੰਮ, study ਅਤੇ childcare ਨੂੰ ਇਕੱਠੇ ਸੰਭਾਲਦਾ ਹੈ, ਤਾਂ part-time program practical ਹੋ ਸਕਦਾ ਹੈ; ਪਹਿਲਾਂ fees, schedule ਅਤੇ support options verify ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    r: "je learner kamm, study ate childcare nu ikatthe sambhaaldaa hai, taan part-time program practical ho sakdaa hai; pahilaan fees, schedule ate support options verify karne chaahiide han.",
    vi: "Nếu người học phải cân bằng việc làm, học và giữ trẻ, chương trình bán thời gian có thể thực tế; trước hết nên xác minh học phí, lịch và các hỗ trợ.",
    en: "If a learner balances work, study, and childcare, a part-time program may be practical; first verify fees, schedule, and support options.",
  },
  workplace_fairness: {
    g: "ਜੇ team workload uneven ਹੈ, ਤਾਂ blame ਕਰਨ ਦੀ ਥਾਂ task board, deadlines ਅਤੇ meeting notes ਵੇਖੀਏ; ਇਸ evidence ਨਾਲ review ਵਿੱਚ fair adjustment ਸੁਝਾਈ ਜਾ ਸਕਦੀ ਹੈ।",
    r: "je team workload uneven hai, taan blame karan dii thaan task board, deadlines ate meeting notes vekhiie; is evidence naal review vich fair adjustment sujhaaii jaa sakdii hai.",
    vi: "Nếu workload của đội không đều, thay vì blame, hãy xem task board, hạn chót và ghi chú họp; với evidence này có thể đề xuất điều chỉnh công bằng trong buổi review.",
    en: "If team workload is uneven, instead of blaming, check the task board, deadlines, and meeting notes; with this evidence, a fair adjustment can be suggested in the review.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2ReleaseCandidateSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Ví dụ Canada: release-candidate notice cho settlement cần form, ID, deadline và contact rõ.",
    en: "Canada example: a release-candidate settlement notice needs clear form, ID, deadline, and contact.",
  },
  education: {
    vi: "Ví dụ Canada: người học so sánh full-time, part-time, fees, childcare và lịch làm trước khi chọn.",
    en: "Canada example: learners compare full-time, part-time, fees, childcare, and work schedule before choosing.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: clinic cần giải thích priority bằng symptom evidence và mức khẩn cấp.",
    en: "Canada example: a clinic needs to explain priority with symptom evidence and urgency.",
  },
  housing: {
    vi: "Ví dụ Canada: quyết định thuê nhà cần rent, utilities, commute, transit và lịch làm.",
    en: "Canada example: a rental decision needs rent, utilities, commute, transit, and work schedule.",
  },
  transport: {
    vi: "Ví dụ Canada: người làm ca kiểm tra bus sớm, bus muộn, cuối tuần và transfer trước khi đổi việc.",
    en: "Canada example: shift workers check early buses, late buses, weekend service, and transfers before changing jobs.",
  },
  public_service: {
    vi: "Ví dụ Canada: public-service answer cần eligibility, deadline, documents và nơi hỏi thêm.",
    en: "Canada example: a public-service answer needs eligibility, deadline, documents, and where to ask questions.",
  },
  work: {
    vi: "Ví dụ Canada: task board, deadlines và review notes giúp đề xuất workload adjustment chuyên nghiệp.",
    en: "Canada example: task boards, deadlines, and review notes help suggest workload adjustments professionally.",
  },
};

export const punjabiB2ReleaseCandidateSamples: PunjabiB2ReleaseCandidateSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const release = releaseByFocus[item.consistencyFocus];
    const prompt = releasePromptByFocus[item.consistencyFocus];
    const candidate = candidateAnswerByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? {
            vi: item.canadaPracticalExample_vi,
            en: item.canadaPracticalExample_en,
          }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "release_candidate"),
      level: "B2",
      releaseFocus: item.consistencyFocus,
      topic: item.topic,
      releasePrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} release candidate ਲਈ reasoning readiness ਦੀ ਜਾਂਚ ਕਰੋ।`,
      releasePrompt_romanization: `${item.consistencyPrompt_romanization} release candidate lai reasoning readiness dii jaanch karo.`,
      releasePrompt_vi: `${item.consistencyPrompt_vi} Hãy kiểm tra reasoning readiness cho release-candidate.`,
      releasePrompt_en: `${item.consistencyPrompt_en} Check reasoning readiness for the release candidate.`,
      candidateAnswer_gurmukhi: candidate.g,
      candidateAnswer_romanization: candidate.r,
      candidateAnswer_vi: candidate.vi,
      candidateAnswer_en: candidate.en,
      releaseCandidate_vi: release.releaseVi,
      releaseCandidate_en: release.releaseEn,
      closureValidation_vi: release.closureVi,
      closureValidation_en: release.closureEn,
      preIntegration_vi: release.preVi,
      preIntegration_en: release.preEn,
      reasoningReadiness_vi: release.readinessVi,
      reasoningReadiness_en: release.readinessEn,
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

export default punjabiB2ReleaseCandidateSamples;
