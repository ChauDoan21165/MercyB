// Punjabi B2 merge-readiness samples for upper-intermediate review.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

import {
  punjabiConsistencyReviewB2,
  type PunjabiConsistencyReviewB2Focus,
  type PunjabiConsistencyReviewB2Item,
  type PunjabiConsistencyReviewB2Topic,
} from "./consistencyReviewB2";

export type PunjabiB2MergeReadinessSamplesFocus = PunjabiConsistencyReviewB2Focus;
export type PunjabiB2MergeReadinessSamplesTopic = PunjabiConsistencyReviewB2Topic;

export type PunjabiB2MergeReadinessSample = {
  id: string;
  level: "B2";
  mergeFocus: PunjabiB2MergeReadinessSamplesFocus;
  topic: PunjabiB2MergeReadinessSamplesTopic;
  mergePrompt_gurmukhi: string;
  mergePrompt_romanization: string;
  mergePrompt_vi: string;
  mergePrompt_en: string;
  modelAnswer_gurmukhi: string;
  modelAnswer_romanization: string;
  modelAnswer_vi: string;
  modelAnswer_en: string;
  mergeReadiness_vi: string[];
  mergeReadiness_en: string[];
  finalRegression_vi: string[];
  finalRegression_en: string[];
  preIntegration_vi: string[];
  preIntegration_en: string[];
  coherenceCheck_vi: string[];
  coherenceCheck_en: string[];
  selectorGuard_vi: string[];
  selectorGuard_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

const readinessByFocus: Record<
  PunjabiB2MergeReadinessSamplesFocus,
  {
    readinessVi: string[];
    readinessEn: string[];
    regressionVi: string[];
    regressionEn: string[];
    preVi: string[];
    preEn: string[];
    coherenceVi: string[];
    coherenceEn: string[];
    guardVi: string[];
    guardEn: string[];
  }
> = {
  structured_opinion: {
    readinessVi: ["Stance rõ", "Evidence nối trực tiếp", "Conclusion không đổi hướng"],
    readinessEn: ["Clear stance", "Evidence connects directly", "Conclusion does not change direction"],
    regressionVi: ["Không quay về yes/no", "Không bỏ reason", "Không mất câu chốt"],
    regressionEn: ["Do not return to yes/no", "Do not drop the reason", "Do not lose the closing line"],
    preVi: ["Giữ một claim", "Thêm một evidence", "Chốt bằng recommendation nhẹ"],
    preEn: ["Keep one claim", "Add one piece of evidence", "Close with a light recommendation"],
    coherenceVi: ["Opinion dẫn tới evidence", "Evidence dẫn tới recommendation", "Topic giữ nguyên"],
    coherenceEn: ["Opinion leads to evidence", "Evidence leads to recommendation", "Topic stays stable"],
    guardVi: ["Không mơ hồ", "Không thêm topic mới"],
    guardEn: ["No vagueness", "Do not add a new topic"],
  },
  comparison: {
    readinessVi: ["Hai lựa chọn rõ", "Tradeoff có cost", "Điều kiện chọn cụ thể"],
    readinessEn: ["Two choices clear", "Tradeoff includes cost", "Choosing condition is specific"],
    regressionVi: ["Không biến thành preference", "Không bỏ một phía", "Không quên điều kiện"],
    regressionEn: ["Do not become preference only", "Do not drop one side", "Do not forget the condition"],
    preVi: ["Nêu option A", "Nêu option B", "Nêu khi nào chọn"],
    preEn: ["Name option A", "Name option B", "Name when to choose"],
    coherenceVi: ["So sánh công bằng", "Cost nối với decision", "Recommendation có điều kiện"],
    coherenceEn: ["Comparison is fair", "Cost connects to decision", "Recommendation has a condition"],
    guardVi: ["Không một chiều", "Không tuyệt đối hóa"],
    guardEn: ["Do not be one-sided", "Do not make it absolute"],
  },
  counterpoint: {
    readinessVi: ["Công nhận trước", "Counterpoint mềm", "Exception có lý do"],
    readinessEn: ["Acknowledge first", "Soft counterpoint", "Exception has a reason"],
    regressionVi: ["Không dùng always/never", "Không phản bác gắt", "Không bỏ context"],
    regressionEn: ["No always/never", "No harsh rebuttal", "Do not drop context"],
    preVi: ["Công nhận một điểm đúng", "Nêu giới hạn", "Đề xuất cách xử lý"],
    preEn: ["Acknowledge one valid point", "State the limit", "Suggest how to handle it"],
    coherenceVi: ["Acknowledgement nối với disagreement", "Exception nối với evidence", "Tone giữ lịch sự"],
    coherenceEn: ["Acknowledgment connects to disagreement", "Exception connects to evidence", "Tone stays polite"],
    guardVi: ["Không công kích", "Không bỏ acknowledgement"],
    guardEn: ["Do not attack", "Do not skip acknowledgment"],
  },
  recommendation: {
    readinessVi: ["Recommendation có điều kiện", "Bước đầu rõ", "Risk không bị che"],
    readinessEn: ["Recommendation has conditions", "First step is clear", "Risk is not hidden"],
    regressionVi: ["Không hứa quá mức", "Không bỏ budget", "Không bỏ commute"],
    regressionEn: ["Do not overpromise", "Do not skip budget", "Do not skip commute"],
    preVi: ["Nêu giải pháp", "Nêu điều kiện", "Nêu bước kiểm tra đầu"],
    preEn: ["Name the solution", "Name the condition", "Name the first check"],
    coherenceVi: ["Evidence dẫn tới recommendation", "Tradeoff dẫn tới điều kiện", "Next step thực tế"],
    coherenceEn: ["Evidence leads to recommendation", "Tradeoff leads to condition", "Next step is practical"],
    guardVi: ["Không tuyệt đối", "Không hứa thay agency"],
    guardEn: ["Do not make absolute claims", "Do not promise on behalf of an agency"],
  },
  workplace_fairness: {
    readinessVi: ["Process rõ", "Không blame", "Review method có thể làm được"],
    readinessEn: ["Process is clear", "No blame", "Review method is doable"],
    regressionVi: ["Không cá nhân hóa", "Không cảm tính", "Không bỏ cách kiểm tra"],
    regressionEn: ["Do not personalize", "Do not become emotional", "Do not drop the checking method"],
    preVi: ["Nói quy trình", "Nói phân công", "Nói review time"],
    preEn: ["State the process", "State the assignment split", "State the review time"],
    coherenceVi: ["Fairness nối với process", "Evidence nối với workload", "Recommendation giữ tone chuyên nghiệp"],
    coherenceEn: ["Fairness connects to process", "Evidence connects to workload", "Recommendation keeps a professional tone"],
    guardVi: ["Không công kích đồng nghiệp", "Không chỉ than phiền"],
    guardEn: ["Do not attack coworkers", "Do not only complain"],
  },
};

const mergePromptByFocus: Record<
  PunjabiB2MergeReadinessSamplesFocus,
  { vi: string; en: string }
> = {
  structured_opinion: {
    vi: "Kiểm tra xem opinion, evidence và recommendation đã nối với nhau trước khi merge chưa.",
    en: "Check whether the opinion, evidence, and recommendation connect before merge.",
  },
  comparison: {
    vi: "Kiểm tra xem hai phía, tradeoff và điều kiện chọn đã đủ rõ trước khi merge chưa.",
    en: "Check whether both sides, the tradeoff, and the choosing condition are clear before merge.",
  },
  counterpoint: {
    vi: "Kiểm tra xem counterpoint có công nhận trước và phản hồi lịch sự trước khi merge không.",
    en: "Check whether the counterpoint acknowledges first and responds politely before merge.",
  },
  recommendation: {
    vi: "Kiểm tra xem recommendation có điều kiện, evidence và bước đầu thực tế trước khi merge không.",
    en: "Check whether the recommendation has conditions, evidence, and a practical first step before merge.",
  },
  workplace_fairness: {
    vi: "Kiểm tra xem fairness, process và review method đã đủ rõ trước khi merge chưa.",
    en: "Check whether fairness, process, and review method are clear before merge.",
  },
};

const modelByFocus: Record<
  PunjabiB2MergeReadinessSamplesFocus,
  { g: string; r: string; vi: string; en: string }
> = {
  structured_opinion: {
    g: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ public notice ਸਧਾਰਨ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਕਿਉਂਕਿ ਨਵੇਂ ਪਰਿਵਾਰ deadline ਅਤੇ ਅਗਲਾ ਕਦਮ ਜਲਦੀ ਸਮਝਣਾ ਚਾਹੁੰਦੇ ਹਨ; ਇਸ ਲਈ notice ਵਿੱਚ short summary ਅਤੇ contact option ਹੋਣੀ ਚਾਹੀਦੀ ਹੈ।",
    r: "mere vichaar vich public notice sadhaaran honaa chaahiidaa hai, kiunki nave parivaar deadline ate aglaa kadam jaldi samajhnaa chaahunde han; is lai notice vich short summary ate contact option honii chaahiidii hai.",
    vi: "Theo tôi, thông báo công nên đơn giản vì gia đình mới cần hiểu hạn chót và bước tiếp theo nhanh; vì vậy nên có tóm tắt ngắn và cách liên hệ.",
    en: "In my view, a public notice should be simple because new families need to understand the deadline and next step quickly, so it should include a short summary and a contact option.",
  },
  comparison: {
    g: "ਸਸਤਾ ਘਰ ਪਹਿਲਾਂ ਚੰਗਾ ਲੱਗਦਾ ਹੈ, ਪਰ ਜੇ transit ਕਮਜ਼ੋਰ ਹੋਵੇ ਤਾਂ time ਅਤੇ taxi ਦਾ ਖਰਚ ਵੱਧ ਸਕਦਾ ਹੈ; ਇਸ ਲਈ ਫੈਸਲਾ rent ਨਾਲ ਨਾਲ commute ਦੇ ਅਧਾਰ ਤੇ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
    r: "sastaa ghar pahilaan changaa lagdaa hai, par je transit kamzor hove taan time ate taxi daa kharch vadh sakdaa hai; is lai faislaa rent naal naal commute de adhaar te karnaa chaahiidaa hai.",
    vi: "Nhà rẻ ban đầu có vẻ tốt, nhưng nếu transit yếu thì thời gian và tiền taxi có thể tăng; vì vậy nên quyết định dựa trên cả tiền thuê và đường đi làm.",
    en: "A cheaper home looks good at first, but if transit is weak, time and taxi costs can rise; the decision should consider both rent and commute.",
  },
  counterpoint: {
    g: "ਤੁਹਾਡੀ ਗੱਲ ਠੀਕ ਹੈ ਕਿ rule ਸਭ ਲਈ ਇੱਕੋ ਜਿਹਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ, ਪਰ medical urgency ਵਿੱਚ exception ਬਣਦੀ ਹੈ; evidence ਦੇ ਆਧਾਰ ਤੇ priority ਬਦਲ ਸਕਦੀ ਹੈ।",
    r: "tuhaadii gall ṭhiik hai ki rule sabh lai ikko jihaa honaa chaahiidaa hai, par medical urgency vich exception bandii hai; evidence de adhaar te priority badal sakdii hai.",
    vi: "Bạn nói đúng là quy tắc nên giống nhau cho mọi người, nhưng trong trường hợp y tế khẩn thì cần ngoại lệ; mức ưu tiên có thể đổi dựa trên bằng chứng.",
    en: "You are right that a rule should be the same for everyone, but a medical urgency needs an exception; priority can change based on evidence.",
  },
  recommendation: {
    g: "ਜੇ learner ਨੂੰ ਕੰਮ ਅਤੇ school ਦੋਵੇਂ ਸੰਭਾਲਣੇ ਹਨ, ਤਾਂ part-time course ਵਧੀਆ ਹੋ ਸਕਦਾ ਹੈ; ਪਹਿਲਾਂ schedule, fees ਅਤੇ childcare support ਚੈੱਕ ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
    r: "je learner nu kamm ate school dovein sambhaalne han, taan part-time course vadhiyaa ho sakdaa hai; pahilaan schedule, fees ate childcare support check karnaa chaahiidaa hai.",
    vi: "Nếu người học phải cân bằng công việc và trường, khóa bán thời gian có thể tốt hơn; trước hết cần kiểm tra lịch, học phí và hỗ trợ giữ trẻ.",
    en: "If a learner must balance work and school, a part-time course may be better; first check the schedule, fees, and childcare support.",
  },
  workplace_fairness: {
    g: "ਟੀਮ ਵਿੱਚ fairness ਲਈ ਸਿਰਫ਼ ਸ਼ਿਕਾਇਤ ਕਰਨੀ ਕਾਫ਼ੀ ਨਹੀਂ; task list, deadline ਅਤੇ review meeting ਸਾਂਝੇ ਕਰੀਏ ਤਾਂ workload ਸਪਸ਼ਟ ਰਹੇਗਾ।",
    r: "team vich fairness lai sirf shikaait karnii kaafii nahi; task list, deadline ate review meeting saanjhe kariie taan workload spasht rahegaa.",
    vi: "Để công bằng trong đội, chỉ phàn nàn là chưa đủ; chia sẻ danh sách việc, hạn chót và buổi review sẽ làm workload rõ hơn.",
    en: "For fairness in a team, only complaining is not enough; sharing the task list, deadline, and review meeting will keep the workload clear.",
  },
};

const canadaExampleByTopic: Record<
  PunjabiB2MergeReadinessSamplesTopic,
  { vi: string; en: string }
> = {
  settlement: {
    vi: "Ví dụ Canada: dịch vụ định cư thường cần giải thích form, deadline và appointment bằng ngôn ngữ rõ.",
    en: "Canada example: settlement services often need forms, deadlines, and appointments explained clearly.",
  },
  education: {
    vi: "Ví dụ Canada: người học có thể phải cân bằng ESL, college, childcare và ca làm.",
    en: "Canada example: learners may need to balance ESL, college, childcare, and work shifts.",
  },
  healthcare_access: {
    vi: "Ví dụ Canada: walk-in clinic, family doctor và emergency room cần được so sánh theo mức khẩn cấp.",
    en: "Canada example: walk-in clinics, family doctors, and emergency rooms should be compared by urgency.",
  },
  housing: {
    vi: "Ví dụ Canada: tiền thuê thấp có thể không rẻ nếu xa transit hoặc xa việc làm.",
    en: "Canada example: lower rent may not be cheaper if it is far from transit or work.",
  },
  transport: {
    vi: "Ví dụ Canada: bus sớm, bus muộn và transfer ảnh hưởng trực tiếp đến người làm ca.",
    en: "Canada example: early buses, late buses, and transfers directly affect shift workers.",
  },
  public_service: {
    vi: "Ví dụ Canada: public-service notice cần nêu rõ ai đủ điều kiện, hạn chót và nơi hỏi thêm.",
    en: "Canada example: a public-service notice should state eligibility, deadline, and where to ask questions.",
  },
  work: {
    vi: "Ví dụ Canada: task board và review meeting giúp team nói về workload mà không blame cá nhân.",
    en: "Canada example: a task board and review meeting help a team discuss workload without personal blame.",
  },
};

export const punjabiB2MergeReadinessSamples: PunjabiB2MergeReadinessSample[] =
  punjabiConsistencyReviewB2.map((item: PunjabiConsistencyReviewB2Item, index: number) => {
    const readiness = readinessByFocus[item.consistencyFocus];
    const prompt = mergePromptByFocus[item.consistencyFocus];
    const model = modelByFocus[item.consistencyFocus];
    const canada =
      item.canadaPracticalExample_vi && item.canadaPracticalExample_en
        ? {
            vi: item.canadaPracticalExample_vi,
            en: item.canadaPracticalExample_en,
          }
        : canadaExampleByTopic[item.topic];

    return {
      id: item.id.replace("consistency", "merge_readiness"),
      level: "B2",
      mergeFocus: item.consistencyFocus,
      topic: item.topic,
      mergePrompt_gurmukhi: `${item.consistencyPrompt_gurmukhi} merge readiness ਲਈ opinion, evidence ਅਤੇ recommendation ਜੋੜੋ।`,
      mergePrompt_romanization: `${item.consistencyPrompt_romanization} merge readiness lai opinion, evidence ate recommendation joro.`,
      mergePrompt_vi: `${item.consistencyPrompt_vi} Hãy nối opinion, evidence và recommendation để kiểm tra merge-readiness.`,
      mergePrompt_en: `${item.consistencyPrompt_en} Connect opinion, evidence, and recommendation for merge-readiness checking.`,
      modelAnswer_gurmukhi: model.g,
      modelAnswer_romanization: model.r,
      modelAnswer_vi: model.vi,
      modelAnswer_en: model.en,
      mergeReadiness_vi: readiness.readinessVi,
      mergeReadiness_en: readiness.readinessEn,
      finalRegression_vi: readiness.regressionVi,
      finalRegression_en: readiness.regressionEn,
      preIntegration_vi: readiness.preVi,
      preIntegration_en: readiness.preEn,
      coherenceCheck_vi: readiness.coherenceVi,
      coherenceCheck_en: readiness.coherenceEn,
      selectorGuard_vi: readiness.guardVi,
      selectorGuard_en: readiness.guardEn,
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

export default punjabiB2MergeReadinessSamples;
