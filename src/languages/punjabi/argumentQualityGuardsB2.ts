// Punjabi B2 argument quality guards for regression and export checks.
// Gurmukhi is primary; romanization stays useful for Vietnamese- and English-speaking learners.

import {
  punjabiPositionRefinementB2,
  type PunjabiPositionRefinementB2Focus,
  type PunjabiPositionRefinementB2Item,
  type PunjabiPositionRefinementB2Topic,
} from "./positionRefinementB2";

export type PunjabiArgumentQualityGuardsB2Focus = PunjabiPositionRefinementB2Focus;
export type PunjabiArgumentQualityGuardsB2Topic = PunjabiPositionRefinementB2Topic;

export type PunjabiArgumentQualityGuardB2 = {
  id: string;
  level: "B2";
  guardFocus: PunjabiArgumentQualityGuardsB2Focus;
  topic: PunjabiArgumentQualityGuardsB2Topic;
  weakArgument_gurmukhi: string;
  weakArgument_romanization: string;
  weakArgument_vi: string;
  weakArgument_en: string;
  guardedArgument_gurmukhi: string;
  guardedArgument_romanization: string;
  guardedArgument_vi: string;
  guardedArgument_en: string;
  finalSafety_vi: string[];
  finalSafety_en: string[];
  exportReadiness_vi: string;
  exportReadiness_en: string;
  regressionCheck_vi: string[];
  regressionCheck_en: string[];
  qualityCheck_vi: string[];
  qualityCheck_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const safetyByFocus: Record<
  PunjabiArgumentQualityGuardsB2Focus,
  {
    safetyVi: string[];
    safetyEn: string[];
    exportVi: string;
    exportEn: string;
    regressionVi: string[];
    regressionEn: string[];
  }
> = {
  structured_opinion: {
    safetyVi: ["Có stance rõ", "Có một reason cụ thể", "Không mơ hồ"],
    safetyEn: ["Clear stance", "One concrete reason", "Not vague"],
    exportVi: "Sẵn sàng export nếu stance, reason và kết luận đều rõ.",
    exportEn: "Ready for export if stance, reason, and conclusion are all clear.",
    regressionVi: ["Không quay về yes/no", "Không nói quá chung", "Không bỏ mất câu chốt"],
    regressionEn: ["Do not fall back to yes/no", "Do not stay too generic", "Do not drop the closing line"],
  },
  comparison: {
    safetyVi: ["Nêu cả hai option", "Chỉ ra tradeoff", "Có điều kiện"],
    safetyEn: ["Name both options", "State the tradeoff", "Include a condition"],
    exportVi: "Sẵn sàng export nếu comparison giữ được cả hai phía.",
    exportEn: "Ready for export if the comparison keeps both sides.",
    regressionVi: ["Không biến thành preference một chiều", "Không bỏ mất tradeoff"],
    regressionEn: ["Do not turn it into a one-sided preference", "Do not omit the tradeoff"],
  },
  counterpoint: {
    safetyVi: ["Công nhận điểm đúng", "Nêu exception", "Giữ giọng mềm"],
    safetyEn: ["Acknowledge the valid point", "Name an exception", "Keep a soft tone"],
    exportVi: "Sẵn sàng export nếu counterpoint đi sau acknowledgement.",
    exportEn: "Ready for export if the counterpoint follows acknowledgment.",
    regressionVi: ["Không dùng always/never", "Không phản bác quá mạnh", "Không bỏ acknowledgment"],
    regressionEn: ["Do not use always/never", "Do not rebut too strongly", "Do not skip acknowledgment"],
  },
  recommendation: {
    safetyVi: ["Thêm điều kiện", "Giảm lời hứa", "Nêu bước đầu tiên"],
    safetyEn: ["Add conditions", "Reduce overpromising", "Name the first step"],
    exportVi: "Sẵn sàng export nếu recommendation thực tế và có điều kiện.",
    exportEn: "Ready for export if the recommendation is practical and conditional.",
    regressionVi: ["Không hứa quá mức", "Không bỏ qua budget", "Không chọn tuyệt đối"],
    regressionEn: ["Do not overpromise", "Do not skip budget", "Do not choose absolutely"],
  },
  workplace_fairness: {
    safetyVi: ["Tránh blame", "Nói về process", "Đề xuất kiểm tra lại"],
    safetyEn: ["Avoid blame", "Talk about process", "Suggest a recheck"],
    exportVi: "Sẵn sàng export nếu tone chuyên nghiệp và công bằng.",
    exportEn: "Ready for export if the tone is professional and fair.",
    regressionVi: ["Không chuyển sang cá nhân", "Không nói cảm tính", "Không bỏ process"],
    regressionEn: ["Do not turn personal", "Do not become emotional", "Do not omit the process"],
  },
};

const qualityPromptByFocus: Record<
  PunjabiArgumentQualityGuardsB2Focus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Bảo vệ một ý kiến còn yếu bằng một lý do cụ thể.",
    en: "Defend a weak opinion with one concrete reason.",
  },
  comparison: {
    vi: "Giữ cân bằng khi so sánh hai lựa chọn có tradeoff.",
    en: "Stay balanced when comparing two options with a tradeoff.",
  },
  counterpoint: {
    vi: "Phản hồi lịch sự trước một ý kiến tuyệt đối.",
    en: "Respond politely to an absolute claim.",
  },
  recommendation: {
    vi: "Đề xuất một lựa chọn nhưng phải có điều kiện rõ.",
    en: "Recommend one option but keep the conditions clear.",
  },
  workplace_fairness: {
    vi: "Nói về công bằng mà không đổ lỗi cá nhân.",
    en: "Talk about fairness without blaming a person.",
  },
};

const guardedByFocus: Record<
  PunjabiArgumentQualityGuardsB2Focus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ plain language ਚਾਹੀਦੀ ਹੈ ਕਿਉਂਕਿ ਲੋਕਾਂ ਨੂੰ ਅਗਲਾ ਕਦਮ ਸਮਝਣਾ ਪੈਂਦਾ ਹੈ।",
    r: "mere vichaar vich plain language chaahiidii hai kiunki lokaan nu aglaa kadam samajhnaa paindaa hai.",
    vi: "Theo tôi, cần ngôn ngữ đơn giản vì người dân phải hiểu bước tiếp theo.",
    en: "In my view, plain language is needed because people must understand the next step.",
  },
  comparison: {
    g: "ਗੱਡੀ ਲਚਕ ਦਿੰਦੀ ਹੈ, ਪਰ transit ਘੱਟ ਖਰਚ ਵਾਲਾ ਹੋ ਸਕਦਾ ਹੈ; ਚੋਣ route ਅਤੇ schedule ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ।",
    r: "gaddi lachak dindii hai, par transit ghatt kharch vaalaa ho sakdaa hai; chon route ate schedule te nirbhar kardii hai.",
    vi: "Xe hơi linh hoạt, nhưng transit có thể ít tốn hơn; lựa chọn tùy tuyến và lịch.",
    en: "A car is flexible, but transit can cost less; the choice depends on route and schedule.",
  },
  counterpoint: {
    g: "ਆਮ ਨਿਯਮ ਠੀਕ ਹੈ, ਪਰ urgent case ਲਈ exception ਬਣਦੀ ਹੈ ਕਿਉਂਕਿ ਦੇਰੀ ਹਾਨੀ ਕਰ ਸਕਦੀ ਹੈ।",
    r: "aam niyam ṭhiik hai, par urgent case lai exception bandii hai kiunki derii haanii kar sakdii hai.",
    vi: "Quy tắc chung ổn, nhưng cần ngoại lệ cho ca khẩn vì chậm trễ có thể gây hại.",
    en: "The general rule is fine, but urgent cases need an exception because delay can cause harm.",
  },
  recommendation: {
    g: "ਜੇ ਗੱਡੀ ਨਹੀਂ ਹੈ, ਤਾਂ transit ਦੇ ਨੇੜੇ ਘਰ ਲੈਣਾ ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ budget ਪਹਿਲਾਂ ਚੈੱਕ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
    r: "je gaddi nahi hai, taan transit de nere ghar laiṇaa vadhiyaa ho sakdaa hai, par budget pahilaan check karnaa chaahiidaa hai.",
    vi: "Nếu không có xe, ở gần transit có thể tốt hơn, nhưng nên kiểm tra ngân sách trước.",
    en: "If there is no car, living near transit may be better, but the budget should be checked first.",
  },
  workplace_fairness: {
    g: "ਕੰਮ ਦੀ ਸੂਚੀ ਖੁੱਲ੍ਹੀ ਰੱਖੋ ਤਾਂ ਟੀਮ ਨੂੰ ਪਤਾ ਰਹੇ ਕਿ ਵੰਡ ਕਿਵੇਂ ਹੋ ਰਹੀ ਹੈ।",
    r: "kamm di suuchii khullhii rakho taan team nu pataa rahe ki vand kivein ho rahii hai.",
    vi: "Giữ danh sách việc mở để đội biết việc đang được chia thế nào.",
    en: "Keep the task list open so the team can see how work is being shared.",
  },
};

export const punjabiArgumentQualityGuardsB2: PunjabiArgumentQualityGuardB2[] =
  punjabiPositionRefinementB2.map((item: PunjabiPositionRefinementB2Item) => {
    const safety = safetyByFocus[item.refinementFocus];
    const prompt = qualityPromptByFocus[item.refinementFocus];
    const guarded = guardedByFocus[item.refinementFocus];

    return {
      id: item.id.replace("refine", "guard"),
      level: "B2",
      guardFocus: item.refinementFocus,
      topic: item.topic,
      weakArgument_gurmukhi: item.weakPosition_gurmukhi,
      weakArgument_romanization: item.weakPosition_romanization,
      weakArgument_vi: item.weakPosition_vi,
      weakArgument_en: item.weakPosition_en,
      guardedArgument_gurmukhi: guarded.g,
      guardedArgument_romanization: guarded.r,
      guardedArgument_vi: guarded.vi,
      guardedArgument_en: guarded.en,
      finalSafety_vi: safety.safetyVi,
      finalSafety_en: safety.safetyEn,
      exportReadiness_vi: safety.exportVi,
      exportReadiness_en: safety.exportEn,
      regressionCheck_vi: safety.regressionVi,
      regressionCheck_en: safety.regressionEn,
      qualityCheck_vi: [
        "Có reason rõ không?",
        "Có tradeoff hoặc exception không?",
        "Có câu chốt cuối không?",
      ],
      qualityCheck_en: [
        "Is the reason clear?",
        "Is there a tradeoff or exception?",
        "Is there a closing sentence?",
      ],
      learnerTrap_vi: `${item.learnerTrap_vi} ${prompt.vi}`,
      learnerTrap_en: `${item.learnerTrap_en} ${prompt.en}`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiArgumentQualityGuardsB2;
