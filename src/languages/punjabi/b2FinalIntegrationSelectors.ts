// Punjabi B2 final integration selectors for later wiring.
// Gurmukhi is primary; romanization helps Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2FinalIntegrationSelectorsFocus =
  PunjabiConsistencyReviewB2Focus;
export type PunjabiB2FinalIntegrationSelectorsTopic =
  PunjabiConsistencyReviewB2Topic;

export type PunjabiB2FinalIntegrationSelector = {
  id: string;
  level: "B2";
  selectorFocus: PunjabiB2FinalIntegrationSelectorsFocus;
  topic: PunjabiB2FinalIntegrationSelectorsTopic;
  selectorPrompt_gurmukhi: string;
  selectorPrompt_romanization: string;
  selectorPrompt_vi: string;
  selectorPrompt_en: string;
  selectedAngle_gurmukhi: string;
  selectedAngle_romanization: string;
  selectedAngle_vi: string;
  selectedAngle_en: string;
  preIntegration_vi: string[];
  preIntegration_en: string[];
  finalReadiness_vi: string[];
  finalReadiness_en: string[];
  integrationNotes_vi: string[];
  integrationNotes_en: string[];
  selectorGuard_vi: string[];
  selectorGuard_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const selectorByFocus: Record<
  PunjabiB2FinalIntegrationSelectorsFocus,
  {
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
    preVi: ["Giữ stance", "Giữ reason", "Giữ conclusion"],
    preEn: ["Keep the stance", "Keep the reason", "Keep the conclusion"],
    readinessVi: ["Stance không đổi", "Reason không đổi", "Kết luận rõ"],
    readinessEn: ["Stance stable", "Reason stable", "Conclusion clear"],
    notesVi: ["Dùng cho public topic", "Giữ giọng bình tĩnh"],
    notesEn: ["Use for public topics", "Keep a calm tone"],
    guardVi: ["Không yes/no", "Không mơ hồ"],
    guardEn: ["No yes/no", "No vagueness"],
  },
  comparison: {
    preVi: ["Nêu hai option", "Nêu tradeoff", "Nêu điều kiện"],
    preEn: ["Name two options", "Name the tradeoff", "Name the condition"],
    readinessVi: ["Hai phía rõ", "Có cost", "Có condition"],
    readinessEn: ["Two sides clear", "Cost included", "Condition included"],
    notesVi: ["Hợp cho transport và housing", "Giữ tính công bằng"],
    notesEn: ["Good for transport and housing", "Keep fairness"],
    guardVi: ["Không one-sided", "Không quên tradeoff"],
    guardEn: ["No one-sided answer", "Do not lose the tradeoff"],
  },
  counterpoint: {
    preVi: ["Công nhận trước", "Phản hồi sau", "Giữ tone mềm"],
    preEn: ["Acknowledge first", "Respond after", "Keep a soft tone"],
    readinessVi: ["Có acknowledgement", "Có exception", "Có tone phù hợp"],
    readinessEn: ["Acknowledgment present", "Exception present", "Tone fit"],
    notesVi: ["Dùng cho disagreement lịch sự", "Không nói quá gắt"],
    notesEn: ["Use for polite disagreement", "Do not sound harsh"],
    guardVi: ["Không always/never", "Không quá mạnh"],
    guardEn: ["No always/never", "No overly strong rebuttal"],
  },
  recommendation: {
    preVi: ["Có điều kiện", "Có bước đầu", "Không overclaim"],
    preEn: ["Has conditions", "Has a first step", "No overclaim"],
    readinessVi: ["Budget kiểm tra", "Commute kiểm tra", "Giải pháp thực tế"],
    readinessEn: ["Budget checked", "Commute checked", "Practical solution"],
    notesVi: ["Hợp cho settlement và public services", "Không hứa quá nhanh"],
    notesEn: ["Good for settlement and public services", "Do not promise too fast"],
    guardVi: ["Không absolute", "Không bỏ budget"],
    guardEn: ["No absolute claim", "Do not skip budget"],
  },
  workplace_fairness: {
    preVi: ["Nói process", "Tránh blame", "Đề xuất review"],
    preEn: ["Talk process", "Avoid blame", "Suggest review"],
    readinessVi: ["Tone chuyên nghiệp", "Quy trình rõ", "Cách kiểm tra rõ"],
    readinessEn: ["Professional tone", "Clear process", "Clear review method"],
    notesVi: ["Hợp cho team discussion", "Giữ fairness"],
    notesEn: ["Good for team discussion", "Keep fairness"],
    guardVi: ["Không cá nhân hóa", "Không cảm tính"],
    guardEn: ["Do not personalize", "Do not become emotional"],
  },
};

const selectorPromptByFocus: Record<
  PunjabiB2FinalIntegrationSelectorsFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Chọn một opinion đã có stance, reason và conclusion rõ.",
    en: "Select an opinion that already has a clear stance, reason, and conclusion.",
  },
  comparison: {
    vi: "Chọn một comparison giữ được hai phía và tradeoff.",
    en: "Select a comparison that keeps both sides and the tradeoff.",
  },
  counterpoint: {
    vi: "Chọn một counterpoint có acknowledgement trước phản biện.",
    en: "Select a counterpoint that acknowledges before rebutting.",
  },
  recommendation: {
    vi: "Chọn một recommendation có điều kiện và bước đầu tiên.",
    en: "Select a recommendation with conditions and a first step.",
  },
  workplace_fairness: {
    vi: "Chọn một response công bằng, chuyên nghiệp và không blame.",
    en: "Select a fair, professional response that avoids blame.",
  },
};

const selectedByFocus: Record<
  PunjabiB2FinalIntegrationSelectorsFocus,
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

export const punjabiB2FinalIntegrationSelectors: PunjabiB2FinalIntegrationSelector[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item) => {
    const selector = selectorByFocus[item.consistencyFocus];
    const prompt = selectorPromptByFocus[item.consistencyFocus];
    const selected = selectedByFocus[item.consistencyFocus];

    return {
      id: item.id.replace("consistency", "selector"),
      level: "B2",
      selectorFocus: item.consistencyFocus,
      topic: item.topic,
      selectorPrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} ਚੋਣ ਲਈ ਵਰਤੋ।`,
      selectorPrompt_romanization: `${item.consistencyPrompt_romanization} chon lai varto.`,
      selectorPrompt_vi: `${item.consistencyPrompt_vi} Dùng để chọn đầu vào tốt hơn.`,
      selectorPrompt_en: `${item.consistencyPrompt_en} Use it to choose a stronger input.`,
      selectedAngle_gurmukhi: selected.g,
      selectedAngle_romanization: selected.r,
      selectedAngle_vi: selected.vi,
      selectedAngle_en: selected.en,
      preIntegration_vi: selector.preVi,
      preIntegration_en: selector.preEn,
      finalReadiness_vi: selector.readinessVi,
      finalReadiness_en: selector.readinessEn,
      integrationNotes_vi: selector.notesVi,
      integrationNotes_en: selector.notesEn,
      selectorGuard_vi: selector.guardVi,
      selectorGuard_en: selector.guardEn,
      learnerTrap_vi: `${item.learnerTrap_vi} ${prompt.vi}`,
      learnerTrap_en: `${item.learnerTrap_en} ${prompt.en}`,
      canadaPracticalExample_vi: item.canadaPracticalExample_vi,
      canadaPracticalExample_en: item.canadaPracticalExample_en,
      scriptAwareness_en: item.scriptAwareness_en,
      nativeReview: item.nativeReview,
    };
  });

export default punjabiB2FinalIntegrationSelectors;
