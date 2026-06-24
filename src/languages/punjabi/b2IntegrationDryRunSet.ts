// Punjabi B2 integration dry-run set for later wiring.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2IntegrationDryRunSetFocus =
  PunjabiConsistencyReviewB2Focus;
export type PunjabiB2IntegrationDryRunSetTopic =
  PunjabiConsistencyReviewB2Topic;

export type PunjabiB2IntegrationDryRunSetEntry = {
  id: string;
  level: "B2";
  dryRunFocus: PunjabiB2IntegrationDryRunSetFocus;
  topic: PunjabiB2IntegrationDryRunSetTopic;
  dryRunPrompt_gurmukhi: string;
  dryRunPrompt_romanization: string;
  dryRunPrompt_vi: string;
  dryRunPrompt_en: string;
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

const dryRunByFocus: Record<
  PunjabiB2IntegrationDryRunSetFocus,
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
    readinessVi: ["Stance ổn định", "Reason ổn định", "Kết luận rõ"],
    readinessEn: ["Stance stable", "Reason stable", "Conclusion clear"],
    notesVi: ["Dùng cho public issue", "Giữ logic đi tới cuối"],
    notesEn: ["Use for public issues", "Keep the logic through the end"],
    guardVi: ["Không yes/no", "Không mất câu chốt"],
    guardEn: ["No yes/no", "Do not lose the closing line"],
  },
  comparison: {
    preVi: ["Nêu hai lựa chọn", "Nêu tradeoff", "Nêu điều kiện chọn"],
    preEn: ["Name two choices", "Name the tradeoff", "Name the choosing condition"],
    readinessVi: ["Hai phía rõ", "Chi phí rõ", "Điều kiện rõ"],
    readinessEn: ["Two sides clear", "Cost clear", "Condition clear"],
    notesVi: ["Hợp cho housing và transport", "Giữ sự công bằng"],
    notesEn: ["Good for housing and transport", "Keep fairness"],
    guardVi: ["Không một chiều", "Không bỏ mất chi phí"],
    guardEn: ["Do not be one-sided", "Do not drop the cost"],
  },
  counterpoint: {
    preVi: ["Công nhận trước", "Phản hồi sau", "Giữ tone mềm"],
    preEn: ["Acknowledge first", "Respond after", "Keep a soft tone"],
    readinessVi: ["Có acknowledgement", "Có exception", "Có giới hạn rõ"],
    readinessEn: ["Acknowledgment present", "Exception present", "Boundary clear"],
    notesVi: ["Dùng cho disagreement lịch sự", "Tránh lời lẽ gắt"],
    notesEn: ["Use for polite disagreement", "Avoid harsh wording"],
    guardVi: ["Không always/never", "Không quá mạnh"],
    guardEn: ["No always/never", "No overly strong rebuttal"],
  },
  recommendation: {
    preVi: ["Có điều kiện", "Có bước đầu", "Không overclaim"],
    preEn: ["Has conditions", "Has a first step", "No overclaim"],
    readinessVi: ["Budget kiểm tra", "Commute kiểm tra", "Giải pháp thực tế"],
    readinessEn: ["Budget checked", "Commute checked", "Practical solution"],
    notesVi: ["Hợp cho settlement và public service", "Đừng hứa quá nhanh"],
    notesEn: ["Good for settlement and public service", "Do not promise too fast"],
    guardVi: ["Không tuyệt đối", "Không bỏ budget"],
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

const dryRunPromptByFocus: Record<
  PunjabiB2IntegrationDryRunSetFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Chọn một ý kiến có stance, reason và conclusion rõ để kiểm tra trước khi tích hợp.",
    en: "Select an opinion with a clear stance, reason, and conclusion before integration.",
  },
  comparison: {
    vi: "Chọn một so sánh giữ được hai phía và tradeoff để làm dry run.",
    en: "Select a comparison that keeps both sides and the tradeoff for a dry run.",
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
  PunjabiB2IntegrationDryRunSetFocus,
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
  PunjabiB2IntegrationDryRunSetTopic,
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

export const punjabiB2IntegrationDryRunSet: PunjabiB2IntegrationDryRunSetEntry[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const dryRun = dryRunByFocus[item.consistencyFocus];
    const prompt = dryRunPromptByFocus[item.consistencyFocus];
    const selected = selectedAngleByFocus[item.consistencyFocus];
    const canada = item.canadaPracticalExample_vi && item.canadaPracticalExample_en
      ? {
          vi: item.canadaPracticalExample_vi,
          en: item.canadaPracticalExample_en,
        }
      : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "dry_run"),
      level: "B2",
      dryRunFocus: item.consistencyFocus,
      topic: item.topic,
      dryRunPrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} ਡ੍ਰਾਈ ਰਨ ਲਈ ਵਰਤੋ।`,
      dryRunPrompt_romanization: `${item.consistencyPrompt_romanization} dry run lai varto.`,
      dryRunPrompt_vi: `${item.consistencyPrompt_vi} Dùng để chọn đầu vào trước khi tích hợp.`,
      dryRunPrompt_en: `${item.consistencyPrompt_en} Use it to choose an input before integration.`,
      selectedAngle_gurmukhi: selected.g,
      selectedAngle_romanization: selected.r,
      selectedAngle_vi: selected.vi,
      selectedAngle_en: selected.en,
      preIntegration_vi: dryRun.preVi,
      preIntegration_en: dryRun.preEn,
      finalReadiness_vi: dryRun.readinessVi,
      finalReadiness_en: dryRun.readinessEn,
      integrationNotes_vi: dryRun.notesVi,
      integrationNotes_en: dryRun.notesEn,
      selectorGuard_vi: dryRun.guardVi,
      selectorGuard_en: dryRun.guardEn,
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

export default punjabiB2IntegrationDryRunSet;
