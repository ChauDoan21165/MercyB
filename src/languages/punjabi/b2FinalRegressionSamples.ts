// Punjabi B2 final regression samples for upper-intermediate review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2FinalRegressionSamplesFocus =
  PunjabiConsistencyReviewB2Focus;
export type PunjabiB2FinalRegressionSamplesTopic =
  PunjabiConsistencyReviewB2Topic;

export type PunjabiB2FinalRegressionSample = {
  id: string;
  level: "B2";
  regressionFocus: PunjabiB2FinalRegressionSamplesFocus;
  topic: PunjabiB2FinalRegressionSamplesTopic;
  regressionPrompt_gurmukhi: string;
  regressionPrompt_romanization: string;
  regressionPrompt_vi: string;
  regressionPrompt_en: string;
  selectedAngle_gurmukhi: string;
  selectedAngle_romanization: string;
  selectedAngle_vi: string;
  selectedAngle_en: string;
  finalRegression_vi: string[];
  finalRegression_en: string[];
  sanityCheck_vi: string[];
  sanityCheck_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  finalReadiness_vi: string[];
  finalReadiness_en: string[];
  regressionNotes_vi: string[];
  regressionNotes_en: string[];
  selectorGuard_vi: string[];
  selectorGuard_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const regressionByFocus: Record<
  PunjabiB2FinalRegressionSamplesFocus,
  {
    regressionVi: string[];
    regressionEn: string[];
    sanityVi: string[];
    sanityEn: string[];
    preVi: string[];
    preEn: string[];
    readinessVi: string[];
    readinessEn: string[];
    notesVi: string[];
    notesEn: string[];
    guardVi: string[];
    guardEn: string[];
  }
> = {
  structured_opinion: {
    regressionVi: ["Giữ stance", "Giữ reason", "Giữ conclusion"],
    regressionEn: ["Keep the stance", "Keep the reason", "Keep the conclusion"],
    sanityVi: ["Không yes/no", "Không đổi ý", "Có câu chốt"],
    sanityEn: ["No yes/no", "No direction change", "Closing line present"],
    preVi: ["Chốt một stance", "Giữ một reason chính", "Giữ tone ổn"],
    preEn: ["Lock one stance", "Keep one main reason", "Keep the tone steady"],
    readinessVi: ["Stance ổn định", "Reason ổn định", "Kết luận rõ"],
    readinessEn: ["Stance stable", "Reason stable", "Conclusion clear"],
    notesVi: ["Dùng cho public issue", "Đừng làm câu trả lời lan man"],
    notesEn: ["Use for public issues", "Do not make the answer ramble"],
    guardVi: ["Không mơ hồ", "Không bỏ conclusion"],
    guardEn: ["No vagueness", "Do not drop the conclusion"],
  },
  comparison: {
    regressionVi: ["Giữ hai phía", "Giữ tradeoff", "Giữ điều kiện chọn"],
    regressionEn: ["Keep both sides", "Keep the tradeoff", "Keep the choosing condition"],
    sanityVi: ["Không biến thành preference", "Không quên cost", "Có kết luận cân bằng"],
    sanityEn: ["Do not become preference", "Do not forget cost", "Balanced conclusion present"],
    preVi: ["Nêu hai lựa chọn", "Nêu chi phí", "Nêu điều kiện"],
    preEn: ["Name two choices", "Name the cost", "Name the condition"],
    readinessVi: ["Hai phía rõ", "Chi phí rõ", "Điều kiện rõ"],
    readinessEn: ["Two sides clear", "Cost clear", "Condition clear"],
    notesVi: ["Hợp cho housing và transport", "Giữ sự công bằng"],
    notesEn: ["Good for housing and transport", "Keep fairness"],
    guardVi: ["Không một chiều", "Không bỏ chi phí"],
    guardEn: ["Do not be one-sided", "Do not drop the cost"],
  },
  counterpoint: {
    regressionVi: ["Công nhận trước", "Phản hồi sau", "Giữ tone mềm"],
    regressionEn: ["Acknowledge first", "Respond after", "Keep a soft tone"],
    sanityVi: ["Không always/never", "Không gắt", "Có exception"],
    sanityEn: ["No always/never", "No harsh tone", "Exception present"],
    preVi: ["Công nhận một điểm đúng", "Thêm phản hồi", "Tránh lời nặng"],
    preEn: ["Acknowledge one valid point", "Add the reply", "Avoid heavy wording"],
    readinessVi: ["Có acknowledgement", "Có exception", "Có giới hạn rõ"],
    readinessEn: ["Acknowledgment present", "Exception present", "Boundary clear"],
    notesVi: ["Dùng cho disagreement lịch sự", "Không đẩy căng thẳng"],
    notesEn: ["Use for polite disagreement", "Do not raise tension"],
    guardVi: ["Không phản bác gắt", "Không bỏ công nhận"],
    guardEn: ["No harsh rebuttal", "Do not skip acknowledgment"],
  },
  recommendation: {
    regressionVi: ["Có điều kiện", "Có bước đầu", "Không overclaim"],
    regressionEn: ["Has conditions", "Has a first step", "No overclaim"],
    sanityVi: ["Có budget", "Có commute", "Không tuyệt đối"],
    sanityEn: ["Budget included", "Commute included", "Not absolute"],
    preVi: ["Có giải pháp", "Có điều kiện thực tế", "Có bước đầu"],
    preEn: ["Have a solution", "Have practical conditions", "Have a first step"],
    readinessVi: ["Budget kiểm tra", "Commute kiểm tra", "Giải pháp thực tế"],
    readinessEn: ["Budget checked", "Commute checked", "Practical solution"],
    notesVi: ["Hợp cho settlement và public service", "Đừng hứa quá nhanh"],
    notesEn: ["Good for settlement and public service", "Do not promise too fast"],
    guardVi: ["Không tuyệt đối", "Không bỏ budget"],
    guardEn: ["No absolute claim", "Do not skip budget"],
  },
  workplace_fairness: {
    regressionVi: ["Nói process", "Tránh blame", "Đề xuất review"],
    regressionEn: ["Talk process", "Avoid blame", "Suggest review"],
    sanityVi: ["Tone chuyên nghiệp", "Không cá nhân hóa", "Có review method"],
    sanityEn: ["Professional tone", "No personalization", "Review method present"],
    preVi: ["Nói quy trình", "Nói cách kiểm tra", "Nói cách chia việc"],
    preEn: ["State process", "State how to check", "State how work is shared"],
    readinessVi: ["Tone chuyên nghiệp", "Quy trình rõ", "Cách kiểm tra rõ"],
    readinessEn: ["Professional tone", "Clear process", "Clear review method"],
    notesVi: ["Hợp cho team discussion", "Giữ fairness"],
    notesEn: ["Good for team discussion", "Keep fairness"],
    guardVi: ["Không công kích", "Không cảm tính"],
    guardEn: ["Do not attack people", "Do not become emotional"],
  },
};

const regressionPromptByFocus: Record<
  PunjabiB2FinalRegressionSamplesFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Chọn một ý kiến có stance, reason và conclusion rõ để kiểm tra regression.",
    en: "Select an opinion with a clear stance, reason, and conclusion for regression checking.",
  },
  comparison: {
    vi: "Chọn một so sánh giữ được hai phía và tradeoff để kiểm tra regression.",
    en: "Select a comparison that keeps both sides and the tradeoff for regression checking.",
  },
  counterpoint: {
    vi: "Chọn một phản hồi có công nhận trước rồi mới phản biện.",
    en: "Select a response that acknowledges first and then counters.",
  },
  recommendation: {
    vi: "Chọn một đề xuất thận trọng, có điều kiện và bước đầu tiên.",
    en: "Select a cautious recommendation with conditions and a first step.",
  },
  workplace_fairness: {
    vi: "Chọn một phản hồi công bằng, chuyên nghiệp và không blame.",
    en: "Select a fair, professional response that avoids blame.",
  },
};

const selectedAngleByFocus: Record<
  PunjabiB2FinalRegressionSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ plain language ਚਾਹੀਦੀ ਹੈ ਕਿਉਂਕਿ ਲੋਕਾਂ ਨੂੰ ਅਗਲਾ ਕਦਮ ਸਮਝਣਾ ਪੈਂਦਾ ਹੈ, ਇਸ ਲਈ form ਅਤੇ ਮਿਤੀ ਸਪਸ਼ਟ ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
    r: "mere vichaar vich plain language chaahiidii hai kiunki lokaan nu aglaa kadam samajhnaa paindaa hai, is lai form ate mitii spasht honii chaahiidii hai.",
    vi: "Theo tôi, cần ngôn ngữ đơn giản vì người dân phải hiểu bước tiếp theo, nên form và ngày hạn phải rõ.",
    en: "In my view, plain language is needed because people must understand the next step, so the form and date should be clear.",
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

const canadaExampleByTopic: Record<
  PunjabiB2FinalRegressionSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Ví dụ Canada: dịch vụ định cư, form và appointment cần ngôn ngữ rõ.",
    en: "Canada example: settlement services, forms, and appointments need clear language.",
  },
  education: {
    vi: "Ví dụ Canada: email trường, họp phụ huynh và report card phải dễ hiểu.",
    en: "Canada example: school emails, parent meetings, and report cards need to be understandable.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: walk-in clinic, family doctor và emergency room có mức ưu tiên khác nhau.",
    en: "Canada example: walk-in clinics, family doctors, and emergency rooms have different priorities.",
  },
  housing: {
    vi: "Ví dụ Canada: nhà rẻ nhưng xa transit có thể làm tổng chi phí tăng.",
    en: "Canada example: cheap housing far from transit can raise the total cost.",
  },
  transport: {
    vi: "Ví dụ Canada: người làm ca cần bus sớm và bus muộn để đi làm đúng giờ.",
    en: "Canada example: shift workers need early and late buses to arrive on time.",
  },
  public_service: {
    vi: "Ví dụ Canada: public service forms, notices và hotline cần rõ và dễ theo dõi.",
    en: "Canada example: public service forms, notices, and hotlines need to be clear and easy to follow.",
  },
  work: {
    vi: "Ví dụ Canada: team schedule, task board và review meeting cần process rõ.",
    en: "Canada example: team schedules, task boards, and review meetings need clear process.",
  },
};

export const punjabiB2FinalRegressionSamples: PunjabiB2FinalRegressionSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const regression = regressionByFocus[item.consistencyFocus];
    const prompt = regressionPromptByFocus[item.consistencyFocus];
    const selected = selectedAngleByFocus[item.consistencyFocus];
    const canada = item.canadaPracticalExample_vi && item.canadaPracticalExample_en
      ? {
          vi: item.canadaPracticalExample_vi,
          en: item.canadaPracticalExample_en,
        }
      : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "regression"),
      level: "B2",
      regressionFocus: item.consistencyFocus,
      topic: item.topic,
      regressionPrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} final regression ਲਈ ਵਰਤੋ।`,
      regressionPrompt_romanization: `${item.consistencyPrompt_romanization} final regression lai varto.`,
      regressionPrompt_vi: `${item.consistencyPrompt_vi} Dùng để kiểm tra regression cuối cùng.`,
      regressionPrompt_en: `${item.consistencyPrompt_en} Use it for the final regression check.`,
      selectedAngle_gurmukhi: selected.g,
      selectedAngle_romanization: selected.r,
      selectedAngle_vi: selected.vi,
      selectedAngle_en: selected.en,
      finalRegression_vi: regression.regressionVi,
      finalRegression_en: regression.regressionEn,
      sanityCheck_vi: regression.sanityVi,
      sanityCheck_en: regression.sanityEn,
      preIntegration_vi: regression.preVi,
      preIntegration_en: regression.preEn,
      finalReadiness_vi: regression.readinessVi,
      finalReadiness_en: regression.readinessEn,
      regressionNotes_vi: regression.notesVi,
      regressionNotes_en: regression.notesEn,
      selectorGuard_vi: regression.guardVi,
      selectorGuard_en: regression.guardEn,
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

export default punjabiB2FinalRegressionSamples;
