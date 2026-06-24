// Punjabi B2 import-readiness samples for upper-intermediate review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2ImportReadinessSamplesFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2ImportReadinessSamplesTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2ImportReadinessSample = {
  id: string;
  level: "B2";
  importFocus: PunjabiB2ImportReadinessSamplesFocus;
  topic: PunjabiB2ImportReadinessSamplesTopic;
  importPrompt_gurmukhi: string;
  importPrompt_romanization: string;
  importPrompt_vi: string;
  importPrompt_en: string;
  sampleAnswer_gurmukhi: string;
  sampleAnswer_romanization: string;
  sampleAnswer_vi: string;
  sampleAnswer_en: string;
  importReadiness_vi: string[];
  importReadiness_en: string[];
  finalRegression_vi: string[];
  finalRegression_en: string[];
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

const importReadinessByFocus: Record<
  PunjabiB2ImportReadinessSamplesFocus,
  {
    readinessVi: string[];
    readinessEn: string[];
    regressionVi: string[];
    regressionEn: string[];
    preVi: string[];
    preEn: string[];
    coherenceVi: string[];
    coherenceEn: string[];
  }
> = {
  structured_opinion: {
    readinessVi: ["Claim rõ", "Evidence hỗ trợ claim", "Recommendation không đổi topic"],
    readinessEn: ["Claim is clear", "Evidence supports the claim", "Recommendation does not change topic"],
    regressionVi: ["Không yes/no", "Không bỏ reason", "Không mất conclusion"],
    regressionEn: ["No yes/no", "Do not drop the reason", "Do not lose the conclusion"],
    preVi: ["Giữ stance", "Thêm một bằng chứng", "Kết bằng bước thực tế"],
    preEn: ["Keep the stance", "Add one piece of evidence", "End with a practical step"],
    coherenceVi: ["Opinion nối với evidence", "Evidence nối với action", "Tone giữ lịch sự"],
    coherenceEn: ["Opinion connects to evidence", "Evidence connects to action", "Tone stays polite"],
  },
  comparison: {
    readinessVi: ["Hai phía cân bằng", "Tradeoff cụ thể", "Điều kiện chọn rõ"],
    readinessEn: ["Both sides are balanced", "Tradeoff is concrete", "Choosing condition is clear"],
    regressionVi: ["Không chỉ nêu preference", "Không bỏ cost", "Không bỏ điều kiện"],
    regressionEn: ["Do not only state preference", "Do not drop cost", "Do not drop the condition"],
    preVi: ["Nêu option A", "Nêu option B", "Nêu khi nào chọn mỗi option"],
    preEn: ["Name option A", "Name option B", "Name when each option fits"],
    coherenceVi: ["Tradeoff dẫn tới decision", "Cost có ví dụ", "Conclusion giữ cân bằng"],
    coherenceEn: ["Tradeoff leads to decision", "Cost has an example", "Conclusion stays balanced"],
  },
  counterpoint: {
    readinessVi: ["Acknowledgement trước", "Counterpoint mềm", "Evidence giải thích exception"],
    readinessEn: ["Acknowledgment first", "Soft counterpoint", "Evidence explains the exception"],
    regressionVi: ["Không always/never", "Không gắt", "Không bỏ điểm đúng của bên kia"],
    regressionEn: ["No always/never", "No harsh tone", "Do not drop the other side's valid point"],
    preVi: ["Công nhận", "Nêu giới hạn", "Đề xuất cách xử lý"],
    preEn: ["Acknowledge", "State the limit", "Suggest a way to handle it"],
    coherenceVi: ["Công nhận nối với disagreement", "Reason nối với exception", "Tone không blame"],
    coherenceEn: ["Acknowledgment connects to disagreement", "Reason connects to exception", "Tone does not blame"],
  },
  recommendation: {
    readinessVi: ["Recommendation có điều kiện", "Risk được nêu", "First step có thể làm ngay"],
    readinessEn: ["Recommendation has conditions", "Risk is named", "First step can be done now"],
    regressionVi: ["Không overclaim", "Không bỏ budget", "Không bỏ constraint"],
    regressionEn: ["Do not overclaim", "Do not skip budget", "Do not skip constraints"],
    preVi: ["Nêu giải pháp", "Nêu điều kiện", "Nêu bước kiểm tra đầu tiên"],
    preEn: ["Name the solution", "Name the condition", "Name the first check"],
    coherenceVi: ["Evidence dẫn tới recommendation", "Tradeoff dẫn tới condition", "Next step thực tế"],
    coherenceEn: ["Evidence leads to recommendation", "Tradeoff leads to condition", "Next step is practical"],
  },
  workplace_fairness: {
    readinessVi: ["Process rõ", "Workload có evidence", "Review method không blame"],
    readinessEn: ["Process is clear", "Workload has evidence", "Review method avoids blame"],
    regressionVi: ["Không cá nhân hóa", "Không cảm tính", "Không bỏ review method"],
    regressionEn: ["Do not personalize", "Do not become emotional", "Do not drop the review method"],
    preVi: ["Nêu process", "Nêu workload evidence", "Nêu thời điểm review"],
    preEn: ["State the process", "State workload evidence", "State the review time"],
    coherenceVi: ["Fairness nối với process", "Evidence nối với workload", "Action giữ chuyên nghiệp"],
    coherenceEn: ["Fairness connects to process", "Evidence connects to workload", "Action stays professional"],
  },
};

const importPromptByFocus: Record<
  PunjabiB2ImportReadinessSamplesFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Kiểm tra xem opinion có đủ claim, evidence và recommendation để import chưa.",
    en: "Check whether the opinion has enough claim, evidence, and recommendation to import.",
  },
  comparison: {
    vi: "Kiểm tra xem comparison có giữ hai phía, tradeoff và điều kiện chọn để import chưa.",
    en: "Check whether the comparison keeps both sides, the tradeoff, and the choosing condition for import.",
  },
  counterpoint: {
    vi: "Kiểm tra xem counterpoint có công nhận trước, giải thích sau và giữ tone lịch sự chưa.",
    en: "Check whether the counterpoint acknowledges first, explains after, and keeps a polite tone.",
  },
  recommendation: {
    vi: "Kiểm tra xem recommendation có điều kiện, constraint và first step thực tế chưa.",
    en: "Check whether the recommendation has conditions, constraints, and a practical first step.",
  },
  workplace_fairness: {
    vi: "Kiểm tra xem workplace response có process, evidence và review method để import chưa.",
    en: "Check whether the workplace response has process, evidence, and a review method for import.",
  },
};

const sampleAnswerByFocus: Record<
  PunjabiB2ImportReadinessSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ settlement form ਨਾਲ ਛੋਟੀ summary ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ, ਕਿਉਂਕਿ ਨਵੇਂ ਲੋਕ deadline ਅਤੇ required documents ਇਕੱਠੇ ਸਮਝਣਾ ਚਾਹੁੰਦੇ ਹਨ; ਇਸ ਲਈ notice ਵਿੱਚ next step ਵੀ ਲਿਖਣਾ ਚਾਹੀਦਾ ਹੈ।",
    r: "mere vichaar vich settlement form naal chhoṭii summary honii chaahiidii hai, kiunki nave lok deadline ate required documents ikatthe samajhnaa chaahunde han; is lai notice vich next step vii likhṇaa chaahiidaa hai.",
    vi: "Theo tôi, form định cư nên có tóm tắt ngắn vì người mới cần hiểu hạn chót và giấy tờ cần nộp cùng lúc; vì vậy thông báo cũng nên ghi bước tiếp theo.",
    en: "In my view, a settlement form should include a short summary because newcomers need to understand the deadline and required documents together, so the notice should also state the next step.",
  },
  comparison: {
    g: "College ਦਾ full-time program ਜਲਦੀ ਮੁਕ ਸਕਦਾ ਹੈ, ਪਰ part-time option ਕੰਮ ਅਤੇ childcare ਨਾਲ ਜ਼ਿਆਦਾ practical ਹੋ ਸਕਦਾ ਹੈ; ਚੋਣ schedule ਅਤੇ fees ਦੇ ਅਧਾਰ ਤੇ ਕਰਨੀ ਚਾਹੀਦੀ ਹੈ।",
    r: "college daa full-time program jaldi muk sakdaa hai, par part-time option kamm ate childcare naal ziaadaa practical ho sakdaa hai; choṇ schedule ate fees de adhaar te karnii chaahiidii hai.",
    vi: "Chương trình college toàn thời gian có thể xong nhanh hơn, nhưng lựa chọn bán thời gian có thể thực tế hơn với công việc và giữ trẻ; nên chọn dựa trên lịch và học phí.",
    en: "A full-time college program may finish faster, but a part-time option may be more practical with work and childcare; the choice should be based on schedule and fees.",
  },
  counterpoint: {
    g: "ਮੈਂ ਸਮਝਦਾ ਹਾਂ ਕਿ first-come rule fair ਲੱਗਦਾ ਹੈ, ਪਰ healthcare ਵਿੱਚ urgent symptom ਨੂੰ ਪਹਿਲਾਂ ਦੇਖਣਾ ਪੈਂਦਾ ਹੈ; ਇਸ ਲਈ priority evidence ਦੇ ਅਧਾਰ ਤੇ ਬਦਲ ਸਕਦੀ ਹੈ।",
    r: "main samajhdaa haan ki first-come rule fair lagdaa hai, par healthcare vich urgent symptom nu pahilaan dekhṇaa paindaa hai; is lai priority evidence de adhaar te badal sakdii hai.",
    vi: "Tôi hiểu quy tắc ai đến trước có vẻ công bằng, nhưng trong y tế triệu chứng khẩn phải được xem trước; vì vậy ưu tiên có thể đổi dựa trên bằng chứng.",
    en: "I understand that a first-come rule seems fair, but in healthcare an urgent symptom must be seen first, so priority can change based on evidence.",
  },
  recommendation: {
    g: "ਜੇ ਘਰ transit ਤੋਂ ਦੂਰ ਹੈ, ਤਾਂ lease sign ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ commute ਨੂੰ weekday morning ਵਿੱਚ test ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ; rent ਘੱਟ ਹੋ ਸਕਦਾ ਹੈ, ਪਰ total cost ਵੱਧ ਸਕਦੀ ਹੈ।",
    r: "je ghar transit ton duur hai, taan lease sign karan ton pahilaan commute nu weekday morning vich test karnaa chaahiidaa hai; rent ghatt ho sakdaa hai, par total cost vadh sakdii hai.",
    vi: "Nếu nhà xa transit, trước khi ký hợp đồng thuê nên thử đường đi vào sáng ngày thường; tiền thuê có thể thấp, nhưng tổng chi phí có thể tăng.",
    en: "If the home is far from transit, test the commute on a weekday morning before signing the lease; rent may be lower, but total cost can rise.",
  },
  workplace_fairness: {
    g: "ਜੇ workload ਬਰਾਬਰ ਨਹੀਂ ਲੱਗਦਾ, ਤਾਂ ਸਿੱਧਾ blame ਕਰਨ ਦੀ ਥਾਂ task board ਅਤੇ deadline ਵੇਖੀਏ; ਫਿਰ meeting ਵਿੱਚ fair adjustment ਸੁਝਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।",
    r: "je workload baraabar nahi lagdaa, taan siddhaa blame karan dii thaan task board ate deadline vekhiie; phir meeting vich fair adjustment sujhaaiaa jaa sakdaa hai.",
    vi: "Nếu workload có vẻ không đều, thay vì blame trực tiếp, hãy xem task board và hạn chót; sau đó có thể đề xuất điều chỉnh công bằng trong cuộc họp.",
    en: "If the workload does not seem even, instead of direct blame, check the task board and deadlines; then a fair adjustment can be suggested in the meeting.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2ImportReadinessSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Ví dụ Canada: settlement agency có thể yêu cầu form, ID, appointment và deadline trong cùng một notice.",
    en: "Canada example: a settlement agency may include forms, ID, appointments, and deadlines in one notice.",
  },
  education: {
    vi: "Ví dụ Canada: người học so sánh full-time, part-time, ESL bridge và hỗ trợ childcare.",
    en: "Canada example: learners compare full-time, part-time, ESL bridge, and childcare support.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: triage có thể ưu tiên triệu chứng khẩn hơn thứ tự đến trước.",
    en: "Canada example: triage may prioritize urgent symptoms over arrival order.",
  },
  housing: {
    vi: "Ví dụ Canada: trước khi ký lease, nên kiểm tra rent, commute, utilities và transit access.",
    en: "Canada example: before signing a lease, check rent, commute, utilities, and transit access.",
  },
  transport: {
    vi: "Ví dụ Canada: người làm ca cần route đáng tin vào sáng sớm, tối muộn và cuối tuần.",
    en: "Canada example: shift workers need reliable routes early morning, late evening, and weekends.",
  },
  public_service: {
    vi: "Ví dụ Canada: notice của public service nên ghi eligibility, deadline và nơi hỏi thêm.",
    en: "Canada example: a public-service notice should state eligibility, deadline, and where to ask questions.",
  },
  work: {
    vi: "Ví dụ Canada: task board, deadline và meeting notes giúp nói về fairness mà không blame cá nhân.",
    en: "Canada example: a task board, deadlines, and meeting notes help discuss fairness without personal blame.",
  },
};

export const punjabiB2ImportReadinessSamples: PunjabiB2ImportReadinessSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const readiness = importReadinessByFocus[item.consistencyFocus];
    const prompt = importPromptByFocus[item.consistencyFocus];
    const sample = sampleAnswerByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? {
            vi: item.canadaPracticalExample_vi,
            en: item.canadaPracticalExample_en,
          }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "import_readiness"),
      level: "B2",
      importFocus: item.consistencyFocus,
      topic: item.topic,
      importPrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} import readiness ਲਈ claim, evidence ਅਤੇ next step ਜੋੜੋ।`,
      importPrompt_romanization: `${item.consistencyPrompt_romanization} import readiness lai claim, evidence ate next step joro.`,
      importPrompt_vi: `${item.consistencyPrompt_vi} Hãy nối claim, evidence và next step để kiểm tra import-readiness.`,
      importPrompt_en: `${item.consistencyPrompt_en} Connect claim, evidence, and next step for import-readiness checking.`,
      sampleAnswer_gurmukhi: sample.g,
      sampleAnswer_romanization: sample.r,
      sampleAnswer_vi: sample.vi,
      sampleAnswer_en: sample.en,
      importReadiness_vi: readiness.readinessVi,
      importReadiness_en: readiness.readinessEn,
      finalRegression_vi: readiness.regressionVi,
      finalRegression_en: readiness.regressionEn,
      preIntegration_vi: readiness.preVi,
      preIntegration_en: readiness.preEn,
      coherenceCheck_vi: readiness.coherenceVi,
      coherenceCheck_en: readiness.coherenceEn,
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

export default punjabiB2ImportReadinessSamples;
