// Punjabi B2 position refinement pack.
// Gurmukhi is primary; romanization stays in place for Vietnamese- and English-speaking learners.

import {
  punjabiArgumentStressTestsB2,
  type PunjabiArgumentStressTestB2,
  type PunjabiArgumentStressTestsB2Focus,
  type PunjabiArgumentStressTestsB2Topic,
} from "./argumentStressTestsB2";

export type PunjabiPositionRefinementB2Focus = PunjabiArgumentStressTestsB2Focus;
export type PunjabiPositionRefinementB2Topic = PunjabiArgumentStressTestsB2Topic;

export type PunjabiPositionRefinementB2Item = {
  id: string;
  level: "B2";
  refinementFocus: PunjabiPositionRefinementB2Focus;
  topic: PunjabiPositionRefinementB2Topic;
  weakPosition_gurmukhi: string;
  weakPosition_romanization: string;
  weakPosition_vi: string;
  weakPosition_en: string;
  refinedPosition_gurmukhi: string;
  refinedPosition_romanization: string;
  refinedPosition_vi: string;
  refinedPosition_en: string;
  finalHardening_vi: string[];
  finalHardening_en: string[];
  exportReadiness_vi: string;
  exportReadiness_en: string;
  review_vi: string[];
  review_en: string[];
  regressionWarning_vi: string[];
  regressionWarning_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const hardeningByFocus: Record<
  PunjabiPositionRefinementB2Focus,
  { vi: string[]; en: string[]; exportVi: string; exportEn: string }
> = {
  structured_opinion: {
    vi: ["Thêm một lý do cụ thể", "Giữ stance rõ", "Kết bằng recommendation"],
    en: ["Add one concrete reason", "Keep the stance clear", "End with a recommendation"],
    exportVi: "Sẵn sàng export nếu câu trả lời có stance, reason và câu chốt.",
    exportEn: "Ready for export if the answer has stance, reason, and a closing line.",
  },
  comparison: {
    vi: ["Nêu cả hai option", "Chỉ rõ tradeoff", "Tránh chọn tuyệt đối"],
    en: ["Name both options", "State the tradeoff", "Avoid an absolute choice"],
    exportVi: "Sẵn sàng export nếu comparison có cả hai phía và lý do chọn.",
    exportEn: "Ready for export if the comparison includes both sides and a reason for the choice.",
  },
  counterpoint: {
    vi: ["Công nhận điểm đúng", "Đưa ngoại lệ", "Giữ tone mềm"],
    en: ["Acknowledge the valid point", "Add an exception", "Keep the tone soft"],
    exportVi: "Sẵn sàng export nếu phản hồi có acknowledgement trước counterpoint.",
    exportEn: "Ready for export if the reply acknowledges before the counterpoint.",
  },
  recommendation: {
    vi: ["Thêm điều kiện thực tế", "Giảm lời hứa", "Nêu bước đầu tiên"],
    en: ["Add practical conditions", "Reduce overpromising", "Name the first step"],
    exportVi: "Sẵn sàng export nếu recommendation không quá cứng.",
    exportEn: "Ready for export if the recommendation is not over-absolute.",
  },
  workplace_fairness: {
    vi: ["Tránh blame", "Nói về process", "Đưa phương án kiểm tra lại"],
    en: ["Avoid blame", "Talk about process", "Offer a review method"],
    exportVi: "Sẵn sàng export nếu giọng điệu chuyên nghiệp và có quy trình.",
    exportEn: "Ready for export if the tone is professional and a process is given.",
  },
};

const reviewByFocus: Record<
  PunjabiPositionRefinementB2Focus,
  { vi: string[]; en: string[]; regressionVi: string[]; regressionEn: string[] }
> = {
  structured_opinion: {
    vi: ["Có quá chung không?", "Có thiếu reason không?", "Có kết luận không?"],
    en: ["Too generic?", "Missing a reason?", "Missing a conclusion?"],
    regressionVi: ["Đừng quay lại câu trả lời ngắn kiểu yes/no."],
    regressionEn: ["Do not fall back to short yes/no answers."],
  },
  comparison: {
    vi: ["Hai phía đủ rõ chưa?", "Tradeoff có cụ thể không?", "Có nói điều kiện không?"],
    en: ["Are both sides clear?", "Is the tradeoff concrete?", "Is a condition stated?"],
    regressionVi: ["Đừng biến comparison thành preference một chiều."],
    regressionEn: ["Do not turn the comparison into a one-sided preference."],
  },
  counterpoint: {
    vi: ["Đã công nhận điểm đúng chưa?", "Có exception chưa?", "Có mềm giọng không?"],
    en: ["Did you acknowledge the valid point?", "Is there an exception?", "Is the tone softened?"],
    regressionVi: ["Đừng phản bác bằng always/never."],
    regressionEn: ["Do not rebut with always/never language."],
  },
  recommendation: {
    vi: ["Recommendation rõ chưa?", "Có điều kiện thực tế chưa?", "Có bước đầu chưa?"],
    en: ["Is the recommendation clear?", "Are practical conditions included?", "Is a first step included?"],
    regressionVi: ["Đừng hứa quá mức hoặc quá rộng."],
    regressionEn: ["Do not overpromise or stay too broad."],
  },
  workplace_fairness: {
    vi: ["Tone đủ chuyên nghiệp chưa?", "Có nói process chưa?", "Có tránh blame chưa?"],
    en: ["Is the tone professional?", "Is a process named?", "Is blame avoided?"],
    regressionVi: ["Đừng chuyển sang accusation cá nhân."],
    regressionEn: ["Do not shift into a personal accusation."],
  },
};

const refinedByFocus: Record<
  PunjabiPositionRefinementB2Focus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ ਸਧਾਰਨ ਭਾਸ਼ਾ ਲਾਭਦਾਇਕ ਹੈ ਕਿਉਂਕਿ ਲੋਕਾਂ ਨੂੰ ਅਗਲਾ ਕਦਮ, ਮਿਤੀ ਅਤੇ ਫਾਰਮ ਸਮਝਣਾ ਹੁੰਦਾ ਹੈ।",
    r: "mere vichaar vich sadhaaran bhaashaa laabhdaayak hai kiunki lokaan nu aglaa kadam, mitii ate form samajhnaa hunda hai.",
    vi: "Theo tôi, ngôn ngữ đơn giản hữu ích vì người dân phải hiểu bước tiếp theo, ngày hạn và form.",
    en: "In my view, plain language is helpful because people need to understand the next step, the date, and the form.",
  },
  comparison: {
    g: "ਗੱਡੀ ਲਚਕ ਦਿੰਦੀ ਹੈ, ਪਰ transit ਸਸਤਾ ਹੋ ਸਕਦਾ ਹੈ ਜੇ route ਭਰੋਸੇਯੋਗ ਹੋਵੇ; ਫੈਸਲਾ ਕੰਮ ਦੇ ਸਥਾਨ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
    r: "gaddi lachak dindii hai, par transit sastaa ho sakdaa hai je route bharoseyog hove; faislaa kamm de sthaan te nirbhar kardaa hai.",
    vi: "Xe hơi linh hoạt, nhưng transit có thể rẻ hơn nếu tuyến đáng tin; quyết định tùy vị trí công việc.",
    en: "A car gives flexibility, but transit can be cheaper if the route is reliable; the decision depends on the work location.",
  },
  counterpoint: {
    g: "ਆਮ ਨਿਯਮ fair ਹੈ, ਪਰ urgent case ਲਈ exception ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ ਦੇਰੀ ਨਾਲ ਨੁਕਸਾਨ ਹੋ ਸਕਦਾ ਹੈ।",
    r: "aam niyam fair hai, par urgent case lai exception chaahiidaa hai, kiunki derii naal nuksaan ho sakdaa hai.",
    vi: "Quy tắc chung công bằng, nhưng cần ngoại lệ cho ca khẩn vì chậm trễ có thể gây hại.",
    en: "The general rule is fair, but an exception is needed for urgent cases because delay can cause harm.",
  },
  recommendation: {
    g: "ਜੇ ਗੱਡੀ ਨਹੀਂ, ਤਾਂ transit ਦੇ ਨੇੜੇ ਰਹਿਣਾ ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ budget ਪਹਿਲਾਂ ਚੈੱਕ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
    r: "je gaddi nahi, taan transit de nere rahinaa vadhiyaa ho sakdaa hai, par budget pahilaan check karnaa chaahiidaa hai.",
    vi: "Nếu không có xe, ở gần transit có thể tốt hơn, nhưng nên kiểm tra ngân sách trước.",
    en: "If there is no car, living near transit can be better, but the budget should be checked first.",
  },
  workplace_fairness: {
    g: "ਵੰਡ ਦੀ ਸੂਚੀ ਖੁੱਲ੍ਹੀ ਰੱਖੀ ਜਾਵੇ ਤਾਂ ਟੀਮ ਨੂੰ ਪਤਾ ਰਹਿੰਦਾ ਹੈ ਕਿ ਕੰਮ ਕਿਵੇਂ ਵੰਡਿਆ ਜਾ ਰਿਹਾ ਹੈ।",
    r: "vand di suuchii khullhii rakhii jaave taan team nu pataa rahindaa hai ki kamm kivein vandiaa jaa rihaa hai.",
    vi: "Giữ danh sách phân chia mở giúp đội biết việc đang được chia thế nào.",
    en: "Keeping the task list open helps the team see how work is being shared.",
  },
};

export const punjabiPositionRefinementB2: PunjabiPositionRefinementB2Item[] =
  punjabiArgumentStressTestsB2.map((item: PunjabiArgumentStressTestB2) => {
    const hardening = hardeningByFocus[item.stressFocus];
    const review = reviewByFocus[item.stressFocus];
    const refined = refinedByFocus[item.stressFocus];

    return {
      id: item.id.replace("stress", "refine"),
      level: "B2",
      refinementFocus: item.stressFocus,
      topic: item.topic,
      weakPosition_gurmukhi: item.stressPrompt_gurmukhi,
      weakPosition_romanization: item.stressPrompt_romanization,
      weakPosition_vi: item.stressPrompt_vi,
      weakPosition_en: item.stressPrompt_en,
      refinedPosition_gurmukhi: refined.g,
      refinedPosition_romanization: refined.r,
      refinedPosition_vi: refined.vi,
      refinedPosition_en: refined.en,
      finalHardening_vi: hardening.vi,
      finalHardening_en: hardening.en,
      exportReadiness_vi: hardening.exportVi,
      exportReadiness_en: hardening.exportEn,
      review_vi: review.vi,
      review_en: review.en,
      regressionWarning_vi: review.regressionVi,
      regressionWarning_en: review.regressionEn,
      learnerTrap_vi: `${item.learnerTrap_vi} ${hardening.vi.join(" ")}`,
      learnerTrap_en: `${item.learnerTrap_en} ${hardening.en.join(" ")}`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiPositionRefinementB2;
