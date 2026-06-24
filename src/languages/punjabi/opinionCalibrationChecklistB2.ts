// Punjabi B2 opinion calibration checklist for stable argument practice.
// Gurmukhi is primary; romanization remains useful for Vietnamese- and English-speaking learners.

import {
  punjabiArgumentQualityGuardsB2,
  type PunjabiArgumentQualityGuardB2,
  type PunjabiArgumentQualityGuardsB2Focus,
  type PunjabiArgumentQualityGuardsB2Topic,
} from "./argumentQualityGuardsB2";

export type PunjabiOpinionCalibrationChecklistB2Focus =
  PunjabiArgumentQualityGuardsB2Focus;
export type PunjabiOpinionCalibrationChecklistB2Topic =
  PunjabiArgumentQualityGuardsB2Topic;

export type PunjabiOpinionCalibrationChecklistB2Item = {
  id: string;
  level: "B2";
  calibrationFocus: PunjabiOpinionCalibrationChecklistB2Focus;
  topic: PunjabiOpinionCalibrationChecklistB2Topic;
  checklistPrompt_gurmukhi: string;
  checklistPrompt_romanization: string;
  checklistPrompt_vi: string;
  checklistPrompt_en: string;
  calibratedOpinion_gurmukhi: string;
  calibratedOpinion_romanization: string;
  calibratedOpinion_vi: string;
  calibratedOpinion_en: string;
  finalStability_vi: string[];
  finalStability_en: string[];
  boundaryCheck_vi: string[];
  boundaryCheck_en: string[];
  checklistItem_vi: string[];
  checklistItem_en: string[];
  regressionGuard_vi: string[];
  regressionGuard_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const calibrationByFocus: Record<
  PunjabiOpinionCalibrationChecklistB2Focus,
  {
    stabilityVi: string[];
    stabilityEn: string[];
    boundaryVi: string[];
    boundaryEn: string[];
    checklistVi: string[];
    checklistEn: string[];
    regressionVi: string[];
    regressionEn: string[];
  }
> = {
  structured_opinion: {
    stabilityVi: ["Có stance", "Có reason", "Có kết luận"],
    stabilityEn: ["Has a stance", "Has a reason", "Has a conclusion"],
    boundaryVi: ["Không đoán mò", "Không quá rộng"],
    boundaryEn: ["No guessing", "Not overly broad"],
    checklistVi: ["Nêu ý kiến rõ", "Giữ một lý do chính", "Kết bằng câu chốt"],
    checklistEn: ["State the opinion clearly", "Keep one main reason", "End with a closing line"],
    regressionVi: ["Không rơi về yes/no", "Không thiếu câu chốt"],
    regressionEn: ["Do not fall back to yes/no", "Do not lose the closing line"],
  },
  comparison: {
    stabilityVi: ["Có hai phía", "Có tradeoff", "Có điều kiện"],
    stabilityEn: ["Two sides present", "Tradeoff present", "Condition present"],
    boundaryVi: ["Không một chiều", "Không quá tuyệt đối"],
    boundaryEn: ["Not one-sided", "Not overly absolute"],
    checklistVi: ["Đặt hai lựa chọn cạnh nhau", "Nêu lợi/hại", "Nói điều kiện quyết định"],
    checklistEn: ["Place the two choices side by side", "Name pros/cons", "State the deciding condition"],
    regressionVi: ["Không biến thành sở thích", "Không quên tradeoff"],
    regressionEn: ["Do not turn into preference", "Do not forget the tradeoff"],
  },
  counterpoint: {
    stabilityVi: ["Công nhận trước", "Rồi mới phản hồi", "Giữ tone mềm"],
    stabilityEn: ["Acknowledge first", "Then respond", "Keep a soft tone"],
    boundaryVi: ["Không always/never", "Không phản bác gắt"],
    boundaryEn: ["No always/never", "No harsh rebuttal"],
    checklistVi: ["Chọn một điểm đúng", "Thêm ngoại lệ", "Tránh đẩy cao giọng"],
    checklistEn: ["Choose one valid point", "Add an exception", "Avoid raising the tone"],
    regressionVi: ["Không bỏ acknowledgement", "Không nói quá cứng"],
    regressionEn: ["Do not skip acknowledgment", "Do not become rigid"],
  },
  recommendation: {
    stabilityVi: ["Có điều kiện", "Có bước đầu tiên", "Không hứa quá mức"],
    stabilityEn: ["Has conditions", "Has a first step", "Does not overpromise"],
    boundaryVi: ["Không chọn tuyệt đối", "Không bỏ budget"],
    boundaryEn: ["Not absolute", "Do not skip budget"],
    checklistVi: ["Nói giải pháp", "Nói điều kiện thực tế", "Nhắc việc kiểm tra trước"],
    checklistEn: ["State the solution", "State the practical condition", "Mention checking first"],
    regressionVi: ["Không overclaim", "Không bỏ mất điều kiện"],
    regressionEn: ["Do not overclaim", "Do not lose the condition"],
  },
  workplace_fairness: {
    stabilityVi: ["Nói process", "Tránh blame", "Đề xuất review"],
    stabilityEn: ["Talk process", "Avoid blame", "Suggest a review"],
    boundaryVi: ["Không cá nhân hóa", "Không cảm tính"],
    boundaryEn: ["Do not personalize", "Do not become emotional"],
    checklistVi: ["Nói cách chia việc", "Nói cách kiểm tra", "Nói cách theo dõi"],
    checklistEn: ["State how to share work", "State how to check", "State how to track"],
    regressionVi: ["Không chuyển sang công kích", "Không bỏ quy trình"],
    regressionEn: ["Do not attack people", "Do not drop the process"],
  },
};

const checklistPromptByFocus: Record<
  PunjabiOpinionCalibrationChecklistB2Focus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Kiểm tra xem ý kiến đã có stance, reason và conclusion chưa.",
    en: "Check whether the opinion already has a stance, reason, and conclusion.",
  },
  comparison: {
    vi: "Kiểm tra xem hai lựa chọn có được so sánh công bằng không.",
    en: "Check whether two choices are compared fairly.",
  },
  counterpoint: {
    vi: "Kiểm tra xem câu phản hồi có công nhận trước khi phản biện không.",
    en: "Check whether the reply acknowledges before countering.",
  },
  recommendation: {
    vi: "Kiểm tra xem đề xuất có đủ thận trọng và có điều kiện không.",
    en: "Check whether the recommendation is cautious and conditional enough.",
  },
  workplace_fairness: {
    vi: "Kiểm tra xem giọng điệu có công bằng và chuyên nghiệp không.",
    en: "Check whether the tone is fair and professional.",
  },
};

const calibratedByFocus: Record<
  PunjabiOpinionCalibrationChecklistB2Focus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ plain language ਚਾਹੀਦੀ ਹੈ ਕਿਉਂਕਿ ਲੋਕਾਂ ਨੂੰ ਅਗਲਾ ਕਦਮ ਸਮਝਣਾ ਪੈਂਦਾ ਹੈ, ਇਸ ਲਈ form ਅਤੇ ਮਿਤੀ ਸਪਸ਼ਟ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
    r: "mere vichaar vich plain language chaahiidii hai kiunki lokaan nu aglaa kadam samajhnaa paindaa hai, is lai form ate mitii spasht honii chaahiidii hai.",
    vi: "Theo tôi, cần ngôn ngữ đơn giản vì người dân phải hiểu bước tiếp theo, nên form và ngày hạn phải rõ.",
    en: "In my view, plain language is needed because people must understand the next step, so the form and date should be clear.",
  },
  comparison: {
    g: "ਗੱਡੀ ਲਚਕ ਦਿੰਦੀ ਹੈ, ਪਰ transit ਘੱਟ ਖਰਚ ਵਾਲਾ ਹੋ ਸਕਦਾ ਹੈ; ਫੈਸਲਾ route, budget ਅਤੇ schedule ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
    r: "gaddi lachak dindii hai, par transit ghatt kharch vaalaa ho sakdaa hai; faislaa route, budget ate schedule te nirbhar kardaa hai.",
    vi: "Xe hơi linh hoạt, nhưng transit có thể ít tốn hơn; quyết định tùy tuyến, ngân sách và lịch.",
    en: "A car is flexible, but transit can cost less; the decision depends on route, budget, and schedule.",
  },
  counterpoint: {
    g: "ਆਮ ਨਿਯਮ ਠੀਕ ਹੈ, ਪਰ urgent case ਲਈ exception ਬਣਦੀ ਹੈ ਕਿਉਂਕਿ ਦੇਰੀ ਹਾਨੀ ਕਰ ਸਕਦੀ ਹੈ, ਇਸ ਗੱਲ ਨੂੰ ਸਪਸ਼ਟ ਕਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।",
    r: "aam niyam ṭhiik hai, par urgent case lai exception bandii hai kiunki derii haanii kar sakdii hai, is gall nu spasht kahinaa chaahiidaa hai.",
    vi: "Quy tắc chung ổn, nhưng cần ngoại lệ cho ca khẩn vì chậm trễ có thể gây hại, và điều này nên được nói rõ.",
    en: "The general rule is fine, but urgent cases need an exception because delay can cause harm, and this should be stated clearly.",
  },
  recommendation: {
    g: "ਜੇ ਗੱਡੀ ਨਹੀਂ ਹੈ, ਤਾਂ transit ਦੇ ਨੇੜੇ ਘਰ ਲੈਣਾ ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ budget ਅਤੇ commute ਪਹਿਲਾਂ ਚੈੱਕ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    r: "je gaddi nahi hai, taan transit de nere ghar laiṇaa vadhiyaa ho sakdaa hai, par budget ate commute pahilaan check karne chaahiide han.",
    vi: "Nếu không có xe, ở gần transit có thể tốt hơn, nhưng nên kiểm tra ngân sách và đường đi làm trước.",
    en: "If there is no car, living near transit may be better, but budget and commute should be checked first.",
  },
  workplace_fairness: {
    g: "ਕੰਮ ਦੀ ਸੂਚੀ ਖੁੱਲ੍ਹੀ ਰੱਖੋ ਤਾਂ ਟੀਮ ਨੂੰ ਪਤਾ ਰਹੇ ਕਿ ਵੰਡ ਕਿਵੇਂ ਹੋ ਰਹੀ ਹੈ ਅਤੇ ਕਦੋਂ review ਕਰਨਾ ਹੈ।",
    r: "kamm di suuchii khullhii rakho taan team nu pataa rahe ki vand kivein ho rahii hai ate kado review karnaa hai.",
    vi: "Giữ danh sách việc mở để đội biết việc đang được chia thế nào và khi nào cần xem lại.",
    en: "Keep the task list open so the team can see how work is being shared and when to review it.",
  },
};

export const punjabiOpinionCalibrationChecklistB2: PunjabiOpinionCalibrationChecklistB2Item[] =
  punjabiArgumentQualityGuardsB2.map((item: PunjabiArgumentQualityGuardB2) => {
    const calibration = calibrationByFocus[item.guardFocus];
    const prompt = checklistPromptByFocus[item.guardFocus];
    const calibrated = calibratedByFocus[item.guardFocus];

    return {
      id: item.id.replace("guard", "calibration"),
      level: "B2",
      calibrationFocus: item.guardFocus,
      topic: item.topic,
      checklistPrompt_gurmukhi: `${item.weakArgument_gurmukhi} ${prompt.en === "Check whether the opinion already has a stance, reason, and conclusion." ? "ਚੈਕਲਿਸਟ ਨਾਲ ਅੰਕਨ ਕਰੋ।" : "ਚੈਕਲਿਸਟ ਨਾਲ ਜਾਂਚ ਕਰੋ।"}`,
      checklistPrompt_romanization: `${item.weakArgument_romanization} checklist naal aankan karo.`,
      checklistPrompt_vi: `${item.weakArgument_vi} Hãy kiểm tra theo checklist để tránh câu trả lời yếu.`,
      checklistPrompt_en: `${item.weakArgument_en} Check it against the checklist to avoid a weak answer.`,
      calibratedOpinion_gurmukhi: calibrated.g,
      calibratedOpinion_romanization: calibrated.r,
      calibratedOpinion_vi: calibrated.vi,
      calibratedOpinion_en: calibrated.en,
      finalStability_vi: calibration.stabilityVi,
      finalStability_en: calibration.stabilityEn,
      boundaryCheck_vi: calibration.boundaryVi,
      boundaryCheck_en: calibration.boundaryEn,
      checklistItem_vi: calibration.checklistVi,
      checklistItem_en: calibration.checklistEn,
      regressionGuard_vi: calibration.regressionVi,
      regressionGuard_en: calibration.regressionEn,
      learnerTrap_vi: `${item.learnerTrap_vi} ${calibration.checklistVi.join(" ")}`,
      learnerTrap_en: `${item.learnerTrap_en} ${calibration.checklistEn.join(" ")}`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiOpinionCalibrationChecklistB2;
