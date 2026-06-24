// Punjabi B2 consistency review for stable opinion practice.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiOpinionCalibrationChecklistB2,
  type PunjabiOpinionCalibrationChecklistB2Focus,
  type PunjabiOpinionCalibrationChecklistB2Item,
  type PunjabiOpinionCalibrationChecklistB2Topic,
} from "./opinionCalibrationChecklistB2";

export type PunjabiConsistencyReviewB2Focus =
  PunjabiOpinionCalibrationChecklistB2Focus;
export type PunjabiConsistencyReviewB2Topic =
  PunjabiOpinionCalibrationChecklistB2Topic;

export type PunjabiConsistencyReviewB2Item = {
  id: string;
  level: "B2";
  consistencyFocus: PunjabiConsistencyReviewB2Focus;
  topic: PunjabiConsistencyReviewB2Topic;
  consistencyPrompt_gurmukhi: string;
  consistencyPrompt_romanization: string;
  consistencyPrompt_vi: string;
  consistencyPrompt_en: string;
  consistentOpinion_gurmukhi: string;
  consistentOpinion_romanization: string;
  consistentOpinion_vi: string;
  consistentOpinion_en: string;
  finalConsistency_vi: string[];
  finalConsistency_en: string[];
  finalGuardrail_vi: string[];
  finalGuardrail_en: string[];
  integrationReadiness_vi: string;
  integrationReadiness_en: string;
  reviewNotes_vi: string[];
  reviewNotes_en: string[];
  regressionWarnings_vi: string[];
  regressionWarnings_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const consistencyByFocus: Record<
  PunjabiConsistencyReviewB2Focus,
  {
    consistencyVi: string[];
    consistencyEn: string[];
    guardrailVi: string[];
    guardrailEn: string[];
    readinessVi: string;
    readinessEn: string;
    reviewVi: string[];
    reviewEn: string[];
    regressionVi: string[];
    regressionEn: string[];
  }
> = {
  structured_opinion: {
    consistencyVi: ["Giữ stance", "Giữ reason chính", "Giữ conclusion"],
    consistencyEn: ["Keep the stance", "Keep the main reason", "Keep the conclusion"],
    guardrailVi: ["Không đổi ý giữa chừng", "Không thêm quá nhiều nhánh"],
    guardrailEn: ["Do not change direction mid-answer", "Do not add too many branches"],
    readinessVi: "Sẵn sàng tích hợp nếu stance, reason và conclusion luôn đi cùng nhau.",
    readinessEn: "Ready to integrate if stance, reason, and conclusion stay together.",
    reviewVi: ["Có nhất quán không?", "Có reason lặp lại quá nhiều không?", "Có kết luận rõ không?"],
    reviewEn: ["Is it consistent?", "Is the reason repeated too much?", "Is the conclusion clear?"],
    regressionVi: ["Không quay về yes/no", "Không mất câu chốt"],
    regressionEn: ["Do not fall back to yes/no", "Do not lose the closing line"],
  },
  comparison: {
    consistencyVi: ["Giữ hai phía", "Giữ tradeoff", "Giữ điều kiện chọn"],
    consistencyEn: ["Keep both sides", "Keep the tradeoff", "Keep the choosing condition"],
    guardrailVi: ["Không một chiều", "Không bỏ mất chi phí"],
    guardrailEn: ["Not one-sided", "Do not drop the cost"],
    readinessVi: "Sẵn sàng tích hợp nếu comparison vẫn có hai phía và điều kiện.",
    readinessEn: "Ready to integrate if the comparison keeps both sides and a condition.",
    reviewVi: ["Hai lựa chọn có công bằng không?", "Có tradeoff cụ thể không?", "Có điều kiện quyết định không?"],
    reviewEn: ["Are the two choices fair?", "Is the tradeoff concrete?", "Is the deciding condition present?"],
    regressionVi: ["Không biến comparison thành preference", "Không quên một phía"],
    regressionEn: ["Do not turn comparison into preference", "Do not forget one side"],
  },
  counterpoint: {
    consistencyVi: ["Công nhận trước", "Phản hồi sau", "Giữ tone mềm"],
    consistencyEn: ["Acknowledge first", "Respond after", "Keep a soft tone"],
    guardrailVi: ["Không always/never", "Không phản bác gắt"],
    guardrailEn: ["No always/never", "No harsh rebuttal"],
    readinessVi: "Sẵn sàng tích hợp nếu acknowledgement luôn xuất hiện trước phản biện.",
    readinessEn: "Ready to integrate if acknowledgment always appears before the counterpoint.",
    reviewVi: ["Có công nhận điểm đúng không?", "Có ngoại lệ không?", "Có giọng điệu phù hợp không?"],
    reviewEn: ["Is the valid point acknowledged?", "Is there an exception?", "Is the tone appropriate?"],
    regressionVi: ["Không bỏ acknowledgement", "Không dùng giọng cứng"],
    regressionEn: ["Do not skip acknowledgment", "Do not use a hard tone"],
  },
  recommendation: {
    consistencyVi: ["Có điều kiện", "Có bước đầu", "Không hứa quá mức"],
    consistencyEn: ["Has conditions", "Has a first step", "Does not overpromise"],
    guardrailVi: ["Không chọn tuyệt đối", "Không bỏ budget"],
    guardrailEn: ["Not absolute", "Do not skip budget"],
    readinessVi: "Sẵn sàng tích hợp nếu recommendation có điều kiện và bước đầu rõ.",
    readinessEn: "Ready to integrate if the recommendation has conditions and a clear first step.",
    reviewVi: ["Có điều kiện thực tế không?", "Có bước đầu tiên không?", "Có overclaim không?"],
    reviewEn: ["Are practical conditions included?", "Is there a first step?", "Is there overclaiming?"],
    regressionVi: ["Không hứa quá nhanh", "Không quá rộng"],
    regressionEn: ["Do not promise too fast", "Do not stay too broad"],
  },
  workplace_fairness: {
    consistencyVi: ["Nói process", "Tránh blame", "Đưa review method"],
    consistencyEn: ["Talk process", "Avoid blame", "Offer a review method"],
    guardrailVi: ["Không cá nhân hóa", "Không cảm tính"],
    guardrailEn: ["Do not personalize", "Do not become emotional"],
    readinessVi: "Sẵn sàng tích hợp nếu process và fairness luôn đi cùng tone chuyên nghiệp.",
    readinessEn: "Ready to integrate if process and fairness always come with a professional tone.",
    reviewVi: ["Có quy trình rõ không?", "Có tránh blame không?", "Có cách kiểm tra lại không?"],
    reviewEn: ["Is the process clear?", "Is blame avoided?", "Is there a recheck method?"],
    regressionVi: ["Không chuyển sang công kích", "Không bỏ quy trình"],
    regressionEn: ["Do not attack people", "Do not drop the process"],
  },
};

const consistencyPromptByFocus: Record<
  PunjabiConsistencyReviewB2Focus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Soi xem ý kiến có nhất quán từ đầu đến cuối không.",
    en: "Check whether the opinion stays consistent from start to finish.",
  },
  comparison: {
    vi: "Soi xem so sánh có giữ cả hai phía không.",
    en: "Check whether the comparison keeps both sides.",
  },
  counterpoint: {
    vi: "Soi xem phản hồi có giữ sự tôn trọng khi disagree không.",
    en: "Check whether the reply stays respectful when disagreeing.",
  },
  recommendation: {
    vi: "Soi xem đề xuất có giữ được sự thận trọng qua các câu không.",
    en: "Check whether the recommendation stays cautious across sentences.",
  },
  workplace_fairness: {
    vi: "Soi xem cách nói có giữ công bằng và chuyên nghiệp không.",
    en: "Check whether the wording stays fair and professional.",
  },
};

const consistentByFocus: Record<
  PunjabiConsistencyReviewB2Focus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ plain language ਚਾਹੀਦੀ ਹੈ ਕਿਉਂਕਿ ਲੋਕਾਂ ਨੂੰ ਅਗਲਾ ਕਦਮ, ਮਿਤੀ ਅਤੇ form ਸਮਝਣਾ ਪੈਂਦਾ ਹੈ; ਇਹੀ ਗੱਲ ਪਹਿਲੇ ਵਾਕ ਤੋਂ ਆਖ਼ਰੀ ਵਾਕ ਤੱਕ ਇਕਸਾਰ ਰਹਿਣੀ ਚਾਹੀਦੀ ਹੈ।",
    r: "mere vichaar vich plain language chaahiidii hai kiunki lokaan nu aglaa kadam, mitii ate form samajhnaa paindaa hai; ehii gall pahile vaak ton aakhrii vaak tak iksaar rahinī chaahiidii hai.",
    vi: "Theo tôi, cần ngôn ngữ đơn giản vì người dân phải hiểu bước tiếp theo, ngày hạn và form; điều này phải nhất quán từ đầu đến cuối.",
    en: "In my view, plain language is needed because people must understand the next step, the date, and the form; that should stay consistent from start to finish.",
  },
  comparison: {
    g: "ਗੱਡੀ ਲਚਕ ਦਿੰਦੀ ਹੈ, ਪਰ transit ਘੱਟ ਖਰਚ ਵਾਲਾ ਹੋ ਸਕਦਾ ਹੈ; ਜੇ route ਭਰੋਸੇਯੋਗ ਹੋਵੇ, ਤਾਂ ਦੂਜਾ ਵਿਕਲਪ ਵਧੀਆ ਲੱਗ ਸਕਦਾ ਹੈ।",
    r: "gaddi lachak dindii hai, par transit ghatt kharch vaalaa ho sakdaa hai; je route bharoseyog hove, taan duujaa vikalp vadhiyaa lag sakdaa hai.",
    vi: "Xe hơi linh hoạt, nhưng transit có thể ít tốn hơn; nếu tuyến đáng tin, phương án kia có thể tốt hơn.",
    en: "A car is flexible, but transit can cost less; if the route is reliable, the other option may be better.",
  },
  counterpoint: {
    g: "ਆਮ ਨਿਯਮ ਠੀਕ ਹੈ, ਪਰ urgent case ਲਈ exception ਬਣਦੀ ਹੈ ਕਿਉਂਕਿ ਦੇਰੀ ਹਾਨੀ ਕਰ ਸਕਦੀ ਹੈ; ਇਸ ਲਈ ਮਾਮਲਾ ਗਲਤ ਨਹੀਂ, ਸਿਰਫ਼ context ਵੱਖਰਾ ਹੈ।",
    r: "aam niyam ṭhiik hai, par urgent case lai exception bandii hai kiunki derii haanii kar sakdii hai; is lai maamlaa galat nahi, sirf context vakhraa hai.",
    vi: "Quy tắc chung ổn, nhưng cần ngoại lệ cho ca khẩn vì chậm trễ có thể gây hại; vì vậy không phải sai, chỉ là bối cảnh khác.",
    en: "The general rule is fine, but urgent cases need an exception because delay can cause harm; so it is not wrong, just a different context.",
  },
  recommendation: {
    g: "ਜੇ ਗੱਡੀ ਨਹੀਂ ਹੈ, ਤਾਂ transit ਦੇ ਨੇੜੇ ਘਰ ਲੈਣਾ ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ budget ਅਤੇ commute ਪਹਿਲਾਂ ਚੈੱਕ ਕਰਨਾ ਲਾਜ਼ਮੀ ਹੈ।",
    r: "je gaddi nahi hai, taan transit de nere ghar laiṇaa vadhiyaa ho sakdaa hai, par budget ate commute pahilaan check karnaa laazmii hai.",
    vi: "Nếu không có xe, ở gần transit có thể tốt hơn, nhưng phải kiểm tra ngân sách và đường đi làm trước.",
    en: "If there is no car, living near transit may be better, but budget and commute must be checked first.",
  },
  workplace_fairness: {
    g: "ਕੰਮ ਦੀ ਸੂਚੀ ਖੁੱਲ੍ਹੀ ਰੱਖੀਏ ਤਾਂ ਟੀਮ ਨੂੰ ਪਤਾ ਰਹੇ ਕਿ ਵੰਡ ਕਿਵੇਂ ਹੋ ਰਹੀ ਹੈ ਅਤੇ ਕਦੋਂ review ਹੋਣਾ ਹੈ।",
    r: "kamm di suuchii khullhii rakhiiye taan team nu pataa rahe ki vand kivein ho rahii hai ate kado review honaa hai.",
    vi: "Giữ danh sách việc mở để đội biết việc đang được chia thế nào và khi nào cần xem lại.",
    en: "Keep the task list open so the team knows how work is being shared and when a review should happen.",
  },
};

export const punjabiConsistencyReviewB2: PunjabiConsistencyReviewB2Item[] =
  punjabiOpinionCalibrationChecklistB2.map((item: PunjabiOpinionCalibrationChecklistB2Item) => {
    const consistency = consistencyByFocus[item.calibrationFocus];
    const prompt = consistencyPromptByFocus[item.calibrationFocus];
    const consistent = consistentByFocus[item.calibrationFocus];

    return {
      id: item.id.replace("calibration", "consistency"),
      level: "B2",
      consistencyFocus: item.calibrationFocus,
      topic: item.topic,
      consistencyPrompt_gurmukhi: `${item.checklistPrompt_gurmukhi} ਇਕਸਾਰਤਾ ਦੀ ਜਾਂਚ ਕਰੋ।`,
      consistencyPrompt_romanization: `${item.checklistPrompt_romanization} iksaarataa dii jaanch karo.`,
      consistencyPrompt_vi: `${item.checklistPrompt_vi} Hãy kiểm tra tính nhất quán.`,
      consistencyPrompt_en: `${item.checklistPrompt_en} Check the consistency.`,
      consistentOpinion_gurmukhi: consistent.g,
      consistentOpinion_romanization: consistent.r,
      consistentOpinion_vi: consistent.vi,
      consistentOpinion_en: consistent.en,
      finalConsistency_vi: consistency.consistencyVi,
      finalConsistency_en: consistency.consistencyEn,
      finalGuardrail_vi: consistency.guardrailVi,
      finalGuardrail_en: consistency.guardrailEn,
      integrationReadiness_vi: consistency.readinessVi,
      integrationReadiness_en: consistency.readinessEn,
      reviewNotes_vi: consistency.reviewVi,
      reviewNotes_en: consistency.reviewEn,
      regressionWarnings_vi: consistency.regressionVi,
      regressionWarnings_en: consistency.regressionEn,
      learnerTrap_vi: `${item.learnerTrap_vi} ${prompt.vi}`,
      learnerTrap_en: `${item.learnerTrap_en} ${prompt.en}`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiConsistencyReviewB2;
