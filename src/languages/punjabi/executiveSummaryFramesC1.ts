export type PunjabiExecutiveSummaryFocus =
  | "summarize_issue"
  | "key_finding"
  | "implication"
  | "limitation"
  | "recommendation"
  | "next_step"
  | "professional_context"
  | "public_service_context";

export type PunjabiExecutiveSummaryMode = "review" | "remediation" | "readiness" | "final_quality";

export type PunjabiExecutiveSummaryPhrase = {
  pa: string;
  rom: string;
  vi: string;
  en: string;
};

export type PunjabiExecutiveSummaryFrameC1 = {
  id: string;
  level: "C1";
  focus: PunjabiExecutiveSummaryFocus;
  mode: PunjabiExecutiveSummaryMode;
  title_pa: string;
  title_rom: string;
  title_vi: string;
  title_en: string;
  summary_goal_vi: string;
  summary_goal_en: string;
  register_note_vi: string;
  register_note_en: string;
  frame: PunjabiExecutiveSummaryPhrase;
  expansion_moves: readonly PunjabiExecutiveSummaryPhrase[];
  canada_example: PunjabiExecutiveSummaryPhrase & {
    context_vi: string;
    context_en: string;
  };
  final_quality_check_vi: readonly string[];
  final_quality_check_en: readonly string[];
  learner_traps_vi: readonly string[];
  learner_traps_en: readonly string[];
};

export const executiveSummaryScriptAwareness = {
  vi: "Khóa Wave 17 dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để người học biết có hệ chữ khác, không phải phần luyện viết chính.",
  en: "Wave 17 uses Gurmukhi as the primary script. Shahmukhi is mentioned only for awareness, not as the writing course script.",
};

export const executiveSummaryFramesC1: PunjabiExecutiveSummaryFrameC1[] = [
  {
    id: "pa_c1_exec_summarize_issue",
    level: "C1",
    focus: "summarize_issue",
    mode: "review",
    title_pa: "ਮੁੱਦੇ ਦਾ ਸੰਖੇਪ",
    title_rom: "mudde da sankhep",
    title_vi: "Tóm tắt vấn đề",
    title_en: "Summarizing the issue",
    summary_goal_vi: "Mở executive summary bằng vấn đề chính, phạm vi và lý do người đọc cần quan tâm.",
    summary_goal_en: "Open an executive summary with the issue, scope, and reason the reader should care.",
    register_note_vi: "Dùng giọng trang trọng, trung lập; tránh kể chuyện dài hoặc đổ lỗi.",
    register_note_en: "Use a formal, neutral register; avoid long narration or blame.",
    frame: {
      pa: "ਇਸ ਸੰਖੇਪ ਦਾ ਕੇਂਦਰ ਉਹ ਮੁੱਦਾ ਹੈ ਜਿਸ ਨੇ ਸੇਵਾ ਦੀ ਪਹੁੰਚ ਅਤੇ ਸਮੇਂ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕੀਤਾ ਹੈ।",
      rom: "is sankhep da kendar oh mudda hai jis ne seva di pahunch ate samen nu prabhavit kita hai.",
      vi: "Trọng tâm của bản tóm tắt này là vấn đề đã ảnh hưởng đến khả năng tiếp cận dịch vụ và thời gian xử lý.",
      en: "This summary focuses on the issue that has affected service access and timing.",
    },
    expansion_moves: [
      {
        pa: "ਮੁੱਦੇ ਦੀ ਹੱਦ ਸਪਸ਼ਟ ਕਰਨ ਲਈ, ਇਹ ਰਿਪੋਰਟ ਤਿੰਨ ਮੁੱਖ ਸੰਕੇਤਾਂ ਨੂੰ ਵੇਖਦੀ ਹੈ।",
        rom: "mudde di hadd spasht karan lai, ih report tin mukh sanketan nu vekhdi hai.",
        vi: "Để làm rõ phạm vi vấn đề, báo cáo này xem xét ba chỉ báo chính.",
        en: "To clarify the scope of the issue, this report examines three main indicators.",
      },
      {
        pa: "ਇਸ ਸਮੇਂ ਸਭ ਤੋਂ ਵੱਡੀ ਚਿੰਤਾ ਪ੍ਰਕਿਰਿਆ ਦੀ ਅਸਮਾਨਤਾ ਹੈ।",
        rom: "is samen sabh ton vaddi chinta prakiria di asamanta hai.",
        vi: "Mối quan ngại lớn nhất hiện nay là sự không đồng đều trong quy trình.",
        en: "The main current concern is inconsistency in the process.",
      },
      {
        pa: "ਪਿਛੋਕੜ ਸੰਖੇਪ ਰੱਖਿਆ ਗਿਆ ਹੈ ਤਾਂ ਜੋ ਫੈਸਲਾ ਕਰਨ ਵਾਲਾ ਪਾਠਕ ਮੁੱਖ ਬਿੰਦੂ ਤੇ ਆ ਸਕੇ।",
        rom: "pichhokar sankhep rakhia gia hai tan jo faisla karan vala pathak mukh bindu te aa sake.",
        vi: "Bối cảnh được giữ ngắn để người ra quyết định có thể vào thẳng điểm chính.",
        en: "The background is kept brief so the decision-maker can reach the main point quickly.",
      },
    ],
    canada_example: {
      context_vi: "Executive summary cho một nhóm dịch vụ cộng đồng tại Canada.",
      context_en: "Executive summary for a community service team in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੇਂ ਆਏ ਪਰਿਵਾਰਾਂ ਲਈ ਸੇਵਾ ਸਮਾਂ ਅਸਮਾਨ ਹੈ, ਇਸ ਲਈ ਪ੍ਰਕਿਰਿਆ ਦੀ ਸਮੀਖਿਆ ਜ਼ਰੂਰੀ ਹੈ।",
      rom: "Canada vich nave aye parivaran lai seva sama asaman hai, is lai prakiria di samikhia zaruri hai.",
      vi: "Tại Canada, thời gian phục vụ cho các gia đình mới đến chưa đồng đều, vì vậy cần rà soát quy trình.",
      en: "In Canada, service timing for newly arrived families is uneven, so process review is necessary.",
    },
    final_quality_check_vi: ["Nêu vấn đề trong một câu.", "Giữ phạm vi rõ.", "Không biến phần mở đầu thành lịch sử dài."],
    final_quality_check_en: ["State the issue in one sentence.", "Keep the scope clear.", "Do not turn the opening into a long history."],
    learner_traps_vi: ["Dịch từng chữ từ tiếng Việt làm câu Punjabi quá dài.", "Dùng giọng cảm xúc thay vì giọng điều hành trung lập."],
    learner_traps_en: ["Word-for-word translation can make the Punjabi sentence too long.", "Avoid emotional tone when a neutral executive tone is needed."],
  },
  {
    id: "pa_c1_exec_key_finding",
    level: "C1",
    focus: "key_finding",
    mode: "review",
    title_pa: "ਮੁੱਖ ਨਤੀਜਾ",
    title_rom: "mukh natija",
    title_vi: "Kết quả chính",
    title_en: "Key finding",
    summary_goal_vi: "Nêu phát hiện quan trọng nhất và chỉ rõ nó dựa trên dữ liệu hoặc quan sát nào.",
    summary_goal_en: "State the most important finding and signal the evidence behind it.",
    register_note_vi: "Ưu tiên động từ chắc nhưng không phóng đại: cho thấy, chỉ ra, gợi ý.",
    register_note_en: "Prefer firm but measured verbs: shows, indicates, suggests.",
    frame: {
      pa: "ਮੁੱਖ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਅਰਜ਼ੀਆਂ ਦੀ ਗਿਣਤੀ ਵਧੀ ਹੈ, ਪਰ ਜਵਾਬ ਦੇਣ ਦੀ ਸਮਰੱਥਾ ਉਸੇ ਦਰ ਨਾਲ ਨਹੀਂ ਵਧੀ।",
      rom: "mukh natija ih hai ki arzian di ginti vadhi hai, par jawab den di samarthta use dar nal nahin vadhi.",
      vi: "Kết quả chính là số lượng hồ sơ đã tăng, nhưng năng lực phản hồi không tăng cùng tốc độ.",
      en: "The key finding is that applications have increased, but response capacity has not grown at the same rate.",
    },
    expansion_moves: [
      {
        pa: "ਅੰਕੜੇ ਦਰਸਾਉਂਦੇ ਹਨ ਕਿ ਮੰਗ ਵਿੱਚ ਵਾਧਾ ਲਗਾਤਾਰ ਹੈ।",
        rom: "ankre darsaunde han ki mang vich vadha lagatar hai.",
        vi: "Số liệu cho thấy nhu cầu đang tăng liên tục.",
        en: "The figures indicate sustained growth in demand.",
      },
      {
        pa: "ਇਹ ਨਤੀਜਾ ਇੱਕੋ ਸਰੋਤ ਤੇ ਨਹੀਂ, ਸਗੋਂ ਕਈ ਰਿਪੋਰਟਾਂ ਤੇ ਆਧਾਰਿਤ ਹੈ।",
        rom: "ih natija ikko srot te nahin, sago kai reportan te adharit hai.",
        vi: "Kết quả này không dựa vào một nguồn duy nhất mà dựa trên nhiều báo cáo.",
        en: "This finding is based on several reports rather than a single source.",
      },
      {
        pa: "ਇਸ ਬਿੰਦੂ ਨੂੰ ਅਗਲੇ ਫੈਸਲੇ ਦਾ ਆਧਾਰ ਬਣਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।",
        rom: "is bindu nu agle faisle da adhar banaya ja sakda hai.",
        vi: "Điểm này có thể làm cơ sở cho quyết định tiếp theo.",
        en: "This point can serve as the basis for the next decision.",
      },
    ],
    canada_example: {
      context_vi: "Tóm tắt phát hiện trong báo cáo dịch vụ học thuật tại Canada.",
      context_en: "Finding summary in an academic-service report in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਵਿਦਿਆਰਥੀ ਸਹਾਇਤਾ ਕੇਂਦਰ ਵਿੱਚ ਮੁੱਖ ਨਤੀਜਾ ਇਹ ਹੈ ਕਿ ਆਨਲਾਈਨ ਬੁਕਿੰਗ ਨੇ ਉਡੀਕ ਘਟਾਈ ਹੈ।",
      rom: "Canada de vidyarthi sahaita kendar vich mukh natija ih hai ki online booking ne udik ghatai hai.",
      vi: "Tại trung tâm hỗ trợ sinh viên ở Canada, kết quả chính là đặt lịch trực tuyến đã giảm thời gian chờ.",
      en: "At a student support centre in Canada, the key finding is that online booking reduced wait times.",
    },
    final_quality_check_vi: ["Nêu một phát hiện chính.", "Gắn phát hiện với bằng chứng.", "Không biến phát hiện thành đề xuất quá sớm."],
    final_quality_check_en: ["Name one key finding.", "Link it to evidence.", "Do not turn the finding into a recommendation too early."],
    learner_traps_vi: ["Dùng quá nhiều số liệu trong câu mở.", "Nói chắc tuyệt đối khi dữ liệu chỉ gợi ý xu hướng."],
    learner_traps_en: ["Avoid overloading the opening sentence with numbers.", "Do not state certainty when the data only suggests a trend."],
  },
  {
    id: "pa_c1_exec_implication",
    level: "C1",
    focus: "implication",
    mode: "readiness",
    title_pa: "ਅਰਥ ਅਤੇ ਪ੍ਰਭਾਵ",
    title_rom: "arth ate prabhav",
    title_vi: "Hàm ý và tác động",
    title_en: "Implication and effect",
    summary_goal_vi: "Giải thích tại sao phát hiện quan trọng đối với quyết định, rủi ro hoặc nguồn lực.",
    summary_goal_en: "Explain why the finding matters for decisions, risk, or resources.",
    register_note_vi: "Dùng cấu trúc nhân quả rõ, nhưng tránh dự đoán quá mức.",
    register_note_en: "Use clear cause-effect language while avoiding overprediction.",
    frame: {
      pa: "ਇਸ ਦਾ ਅਰਥ ਹੈ ਕਿ ਮੌਜੂਦਾ ਸਰੋਤ ਛੋਟੇ ਸਮੇਂ ਵਿੱਚ ਦਬਾਅ ਹੇਠ ਰਹਿਣਗੇ।",
      rom: "is da arth hai ki maujuda srot chhote samen vich dabao heth rehnge.",
      vi: "Điều này có nghĩa là nguồn lực hiện tại sẽ chịu áp lực trong ngắn hạn.",
      en: "This means current resources will remain under pressure in the short term.",
    },
    expansion_moves: [
      {
        pa: "ਜੇ ਪ੍ਰਾਥਮਿਕਤਾ ਸਪਸ਼ਟ ਨਾ ਹੋਈ, ਤਾਂ ਜਵਾਬ ਦੀ ਗੁਣਵੱਤਾ ਘਟ ਸਕਦੀ ਹੈ।",
        rom: "je prathmikta spasht na hoi, tan jawab di gunvatta ghat sakdi hai.",
        vi: "Nếu ưu tiên không rõ, chất lượng phản hồi có thể giảm.",
        en: "If priorities are unclear, response quality may decline.",
      },
      {
        pa: "ਪ੍ਰਭਾਵ ਸਿਰਫ ਖਰਚੇ ਤੇ ਨਹੀਂ, ਸੇਵਾ ਦੇ ਭਰੋਸੇ ਤੇ ਵੀ ਪੈਂਦਾ ਹੈ।",
        rom: "prabhav sirf kharche te nahin, seva de bharose te vi painda hai.",
        vi: "Tác động không chỉ nằm ở chi phí mà còn ở độ tin cậy của dịch vụ.",
        en: "The effect is not only on cost but also on trust in the service.",
      },
      {
        pa: "ਇਸ ਲਈ ਫੈਸਲਾ ਸਮੇਂ ਅਤੇ ਸਮਰੱਥਾ ਦੋਹਾਂ ਨੂੰ ਧਿਆਨ ਵਿੱਚ ਰੱਖੇ।",
        rom: "is lai faisla samen ate samarthta dohan nu dhian vich rakhe.",
        vi: "Vì vậy, quyết định nên tính đến cả thời gian và năng lực.",
        en: "Therefore, the decision should account for both timing and capacity.",
      },
    ],
    canada_example: {
      context_vi: "Hàm ý nguồn lực cho một văn phòng chương trình tại Canada.",
      context_en: "Resource implication for a program office in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਫਾਲ ਟਰਮ ਤੋਂ ਪਹਿਲਾਂ ਸਟਾਫ ਦੀ ਘਾਟ ਦਾ ਅਰਥ ਹੈ ਕਿ ਵਿਦਿਆਰਥੀ ਜਵਾਬ ਦੇਰ ਨਾਲ ਲੈ ਸਕਦੇ ਹਨ।",
      rom: "Canada vich fall term ton pahilan staff di ghat da arth hai ki vidyarthi jawab der nal lai sakde han.",
      vi: "Tại Canada, thiếu nhân sự trước kỳ mùa thu có nghĩa là sinh viên có thể nhận phản hồi muộn.",
      en: "In Canada, staff shortages before the fall term mean students may receive delayed responses.",
    },
    final_quality_check_vi: ["Nối phát hiện với tác động.", "Nêu mức độ chắc chắn.", "Không thêm thông tin ngoài phạm vi dữ liệu."],
    final_quality_check_en: ["Connect finding to effect.", "Signal confidence level.", "Do not add claims beyond the data."],
    learner_traps_vi: ["Nhầm implication với recommendation.", "Dùng câu quá mạnh như chắc chắn sẽ xảy ra."],
    learner_traps_en: ["Do not confuse implication with recommendation.", "Avoid overly strong language such as saying something will certainly happen."],
  },
  {
    id: "pa_c1_exec_limitation",
    level: "C1",
    focus: "limitation",
    mode: "final_quality",
    title_pa: "ਸੀਮਾ ਅਤੇ ਸਾਵਧਾਨੀ",
    title_rom: "sima ate savdhani",
    title_vi: "Giới hạn và thận trọng",
    title_en: "Limitation and caution",
    summary_goal_vi: "Nêu giới hạn của dữ liệu hoặc phạm vi để executive summary đáng tin cậy hơn.",
    summary_goal_en: "State data or scope limitations so the executive summary remains credible.",
    register_note_vi: "Giới hạn nên ngắn, chính xác, không làm yếu toàn bộ lập luận.",
    register_note_en: "A limitation should be brief and precise without weakening the whole argument.",
    frame: {
      pa: "ਇਸ ਵਿਸ਼ਲੇਸ਼ਣ ਦੀ ਮੁੱਖ ਸੀਮਾ ਇਹ ਹੈ ਕਿ ਡਾਟਾ ਸਿਰਫ ਪਿਛਲੇ ਛੇ ਮਹੀਨਿਆਂ ਨੂੰ ਕਵਰ ਕਰਦਾ ਹੈ।",
      rom: "is vishleshan di mukh sima ih hai ki data sirf pichhle chhe mahinian nu cover karda hai.",
      vi: "Giới hạn chính của phân tích này là dữ liệu chỉ bao phủ sáu tháng gần đây.",
      en: "The main limitation of this analysis is that the data covers only the past six months.",
    },
    expansion_moves: [
      {
        pa: "ਇਸ ਕਾਰਨ ਲੰਬੇ ਸਮੇਂ ਦੇ ਰੁਝਾਨ ਬਾਰੇ ਦਾਅਵਾ ਸਾਵਧਾਨੀ ਨਾਲ ਕੀਤਾ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ।",
        rom: "is karan lambe samen de rujhan bare daava savdhani nal kita jana chahida hai.",
        vi: "Vì vậy, các nhận định về xu hướng dài hạn nên được đưa ra thận trọng.",
        en: "For this reason, claims about long-term trends should be made cautiously.",
      },
      {
        pa: "ਫਿਰ ਵੀ, ਉਪਲਬਧ ਸਬੂਤ ਤੁਰੰਤ ਕਦਮ ਲਈ ਕਾਫੀ ਦਿਸ਼ਾ ਦਿੰਦੇ ਹਨ।",
        rom: "phir vi, uplabdh sabut turant kadam lai kafi disha dinde han.",
        vi: "Tuy vậy, bằng chứng hiện có vẫn cung cấp đủ định hướng cho bước hành động trước mắt.",
        en: "Even so, the available evidence gives enough direction for an immediate step.",
      },
      {
        pa: "ਅਗਲੀ ਸਮੀਖਿਆ ਵਿੱਚ ਹੋਰ ਨਮੂਨੇ ਸ਼ਾਮਲ ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
        rom: "agli samikhia vich hor namune shamil karne chahide han.",
        vi: "Lần rà soát tiếp theo nên bao gồm thêm mẫu dữ liệu.",
        en: "The next review should include additional samples.",
      },
    ],
    canada_example: {
      context_vi: "Giới hạn dữ liệu trong một bản tóm tắt chính sách tại Canada.",
      context_en: "Data limitation in a policy summary in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੀ ਇਸ ਸਮੀਖਿਆ ਵਿੱਚ ਛੋਟੇ ਸ਼ਹਿਰਾਂ ਦਾ ਡਾਟਾ ਘੱਟ ਹੈ, ਇਸ ਲਈ ਨਤੀਜੇ ਸਾਵਧਾਨੀ ਨਾਲ ਪੜ੍ਹੇ ਜਾਣ।",
      rom: "Canada di is samikhia vich chhote shahiran da data ghatt hai, is lai natije savdhani nal parhe jan.",
      vi: "Trong rà soát tại Canada này, dữ liệu từ các thành phố nhỏ còn ít, vì vậy kết quả nên được đọc thận trọng.",
      en: "In this Canadian review, data from smaller cities is limited, so the findings should be read cautiously.",
    },
    final_quality_check_vi: ["Nêu một giới hạn thật.", "Giữ giọng chuyên nghiệp.", "Bù bằng bước tiếp theo hoặc phạm vi dùng kết quả."],
    final_quality_check_en: ["State a real limitation.", "Keep a professional tone.", "Balance it with a next step or proper use of the finding."],
    learner_traps_vi: ["Bỏ qua giới hạn để nghe có vẻ mạnh hơn.", "Viết giới hạn dài hơn cả phát hiện chính."],
    learner_traps_en: ["Do not omit limitations just to sound stronger.", "Do not make the limitation longer than the main finding."],
  },
  {
    id: "pa_c1_exec_recommendation",
    level: "C1",
    focus: "recommendation",
    mode: "readiness",
    title_pa: "ਸਿਫਾਰਸ਼",
    title_rom: "sifarash",
    title_vi: "Khuyến nghị",
    title_en: "Recommendation",
    summary_goal_vi: "Đưa ra khuyến nghị rõ, khả thi, gắn với phát hiện và bối cảnh.",
    summary_goal_en: "Give a clear, feasible recommendation tied to the finding and context.",
    register_note_vi: "Tránh mệnh lệnh gắt; dùng nên, được khuyến nghị, bước phù hợp là.",
    register_note_en: "Avoid harsh commands; use should, is recommended, or the appropriate step is.",
    frame: {
      pa: "ਸਿਫਾਰਸ਼ ਕੀਤੀ ਜਾਂਦੀ ਹੈ ਕਿ ਟੀਮ ਪਹਿਲਾਂ ਉੱਚ-ਜੋਖਮ ਮਾਮਲਿਆਂ ਲਈ ਵੱਖਰੀ ਕਤਾਰ ਬਣਾਏ।",
      rom: "sifarash kiti jandi hai ki team pahilan uch-jokham mamlian lai vakhri katar banae.",
      vi: "Khuyến nghị nhóm trước tiên tạo hàng xử lý riêng cho các trường hợp rủi ro cao.",
      en: "It is recommended that the team first create a separate queue for high-risk cases.",
    },
    expansion_moves: [
      {
        pa: "ਇਹ ਕਦਮ ਘੱਟ ਖਰਚ ਨਾਲ ਤੁਰੰਤ ਲਾਗੂ ਕੀਤਾ ਜਾ ਸਕਦਾ ਹੈ।",
        rom: "ih kadam ghatt kharch nal turant lagu kita ja sakda hai.",
        vi: "Bước này có thể được triển khai nhanh với chi phí thấp.",
        en: "This step can be implemented quickly at low cost.",
      },
      {
        pa: "ਸਿਫਾਰਸ਼ ਦਾ ਉਦੇਸ਼ ਸਾਰੇ ਮਾਮਲੇ ਤੇਜ਼ ਕਰਨਾ ਨਹੀਂ, ਸਗੋਂ ਜੋਖਮ ਘਟਾਉਣਾ ਹੈ।",
        rom: "sifarash da uddesh sare mamle tez karna nahin, sago jokham ghatauna hai.",
        vi: "Mục tiêu của khuyến nghị không phải tăng tốc mọi hồ sơ mà là giảm rủi ro.",
        en: "The aim of the recommendation is not to speed every case, but to reduce risk.",
      },
      {
        pa: "ਜੇ ਨਤੀਜੇ ਸਕਾਰਾਤਮਕ ਰਹੇ, ਤਾਂ ਮਾਡਲ ਨੂੰ ਹੋਰ ਖੇਤਰਾਂ ਵਿੱਚ ਵਧਾਇਆ ਜਾ ਸਕਦਾ ਹੈ।",
        rom: "je natije sakaratmak rahe, tan model nu hor khetaran vich vadhaya ja sakda hai.",
        vi: "Nếu kết quả tích cực, mô hình có thể được mở rộng sang các lĩnh vực khác.",
        en: "If results are positive, the model can be expanded to other areas.",
      },
    ],
    canada_example: {
      context_vi: "Khuyến nghị cho một quy trình tiếp nhận dịch vụ tại Canada.",
      context_en: "Recommendation for a service intake process in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਸੇਵਾ ਕੇਂਦਰ ਲਈ ਸਿਫਾਰਸ਼ ਹੈ ਕਿ ਨਵੇਂ ਅਰਜ਼ੀਕਾਰਾਂ ਨੂੰ ਸਪਸ਼ਟ ਸਮਾਂ-ਰੇਖਾ ਭੇਜੀ ਜਾਵੇ।",
      rom: "Canada vich seva kendar lai sifarash hai ki nave arzikaran nu spasht sama-rekha bheji jave.",
      vi: "Tại Canada, khuyến nghị cho trung tâm dịch vụ là gửi mốc thời gian rõ ràng cho người nộp hồ sơ mới.",
      en: "In Canada, the recommendation for the service centre is to send a clear timeline to new applicants.",
    },
    final_quality_check_vi: ["Khuyến nghị có thể làm được.", "Có liên kết với phát hiện.", "Có giới hạn phạm vi hoặc điều kiện."],
    final_quality_check_en: ["The recommendation is feasible.", "It links to the finding.", "It includes scope or conditions."],
    learner_traps_vi: ["Viết khuyến nghị quá chung như cải thiện giao tiếp.", "Dùng giọng ra lệnh không phù hợp môi trường chuyên nghiệp."],
    learner_traps_en: ["Avoid generic recommendations such as improve communication.", "Avoid command-like tone in professional settings."],
  },
  {
    id: "pa_c1_exec_next_step",
    level: "C1",
    focus: "next_step",
    mode: "remediation",
    title_pa: "ਅਗਲਾ ਕਦਮ",
    title_rom: "agla kadam",
    title_vi: "Bước tiếp theo",
    title_en: "Next step",
    summary_goal_vi: "Kết thúc bằng hành động tiếp theo, chủ thể phụ trách và thời điểm nếu phù hợp.",
    summary_goal_en: "Close with the next action, owner, and timing where appropriate.",
    register_note_vi: "Câu nên thực tế, cụ thể, không mở thêm tranh luận mới.",
    register_note_en: "The sentence should be practical and specific, without opening a new debate.",
    frame: {
      pa: "ਅਗਲਾ ਕਦਮ ਇਹ ਹੈ ਕਿ ਪ੍ਰੋਗਰਾਮ ਟੀਮ ਦੋ ਹਫਤਿਆਂ ਵਿੱਚ ਸੰਸ਼ੋਧਿਤ ਯੋਜਨਾ ਪੇਸ਼ ਕਰੇ।",
      rom: "agla kadam ih hai ki program team do haftian vich sanshodhit yojna pesh kare.",
      vi: "Bước tiếp theo là nhóm chương trình trình kế hoạch đã chỉnh sửa trong hai tuần.",
      en: "The next step is for the program team to present a revised plan within two weeks.",
    },
    expansion_moves: [
      {
        pa: "ਇਸ ਤੋਂ ਬਾਅਦ ਫੈਸਲਾ ਲਾਗੂ ਕਰਨ ਦੀ ਤਾਰੀਖ ਨਿਰਧਾਰਤ ਕੀਤੀ ਜਾਵੇਗੀ।",
        rom: "is ton baad faisla lagu karan di tarikh nirdharat kiti javegi.",
        vi: "Sau đó, ngày triển khai quyết định sẽ được xác định.",
        en: "After that, the implementation date will be set.",
      },
      {
        pa: "ਜ਼ਿੰਮੇਵਾਰੀ ਸਪਸ਼ਟ ਰੱਖਣ ਲਈ ਇੱਕ ਸੰਪਰਕ ਵਿਅਕਤੀ ਨਿਯੁਕਤ ਕੀਤਾ ਜਾਵੇ।",
        rom: "zimmevari spasht rakhan lai ik sampark vyakti niyukt kita jave.",
        vi: "Để giữ trách nhiệm rõ ràng, nên chỉ định một người liên hệ.",
        en: "To keep accountability clear, one contact person should be assigned.",
      },
      {
        pa: "ਅਗਲੀ ਰਿਪੋਰਟ ਵਿੱਚ ਨਤੀਜੇ ਅਤੇ ਬਾਕੀ ਜੋਖਮ ਦੋਵੇਂ ਦਰਜ ਹੋਣ।",
        rom: "agli report vich natije ate baki jokham dovein darj hon.",
        vi: "Báo cáo tiếp theo nên ghi cả kết quả và rủi ro còn lại.",
        en: "The next report should record both outcomes and remaining risks.",
      },
    ],
    canada_example: {
      context_vi: "Bước tiếp theo trong summary gửi cho đối tác tại Canada.",
      context_en: "Next step in a summary sent to a partner in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਾਲੀ ਭਾਗੀਦਾਰ ਟੀਮ ਅਗਲੇ ਸ਼ੁੱਕਰਵਾਰ ਤੱਕ ਅਪਡੇਟ ਕੀਤਾ ਸਮਾਂ-ਪੱਤਰ ਭੇਜੇਗੀ।",
      rom: "Canada vali bhagidar team agle shukkarvar takk update kita sama-pattar bhejegi.",
      vi: "Nhóm đối tác tại Canada sẽ gửi lịch trình cập nhật trước thứ Sáu tới.",
      en: "The partner team in Canada will send the updated timeline by next Friday.",
    },
    final_quality_check_vi: ["Có hành động cụ thể.", "Có người hoặc nhóm phụ trách.", "Không thêm claim mới ở cuối."],
    final_quality_check_en: ["There is a concrete action.", "An owner or team is named.", "No new claim is added at the end."],
    learner_traps_vi: ["Kết thúc bằng câu mơ hồ như chúng ta sẽ xem xét.", "Thiếu deadline hoặc chủ thể khi ngữ cảnh cần."],
    learner_traps_en: ["Avoid vague endings such as we will consider it.", "Do not omit owner or deadline when the context requires them."],
  },
  {
    id: "pa_c1_exec_professional_context",
    level: "C1",
    focus: "professional_context",
    mode: "final_quality",
    title_pa: "ਪੇਸ਼ਾਵਰ ਸੰਦਰਭ",
    title_rom: "peshavar sandarbh",
    title_vi: "Bối cảnh chuyên nghiệp",
    title_en: "Professional context",
    summary_goal_vi: "Điều chỉnh summary cho người đọc trong tổ chức, nơi cần tính trách nhiệm và quyết định nhanh.",
    summary_goal_en: "Adapt the summary for organizational readers who need accountability and quick decisions.",
    register_note_vi: "Giữ sự tôn trọng, tránh nói quá thân mật hoặc quá học thuật.",
    register_note_en: "Remain respectful; avoid being too casual or too academic.",
    frame: {
      pa: "ਪੇਸ਼ਾਵਰ ਸੰਦਰਭ ਵਿੱਚ, ਇਹ ਸੰਖੇਪ ਫੈਸਲੇ ਲਈ ਲੋੜੀਂਦੇ ਸਬੂਤ ਅਤੇ ਜੋਖਮ ਇਕੱਠੇ ਰੱਖਦਾ ਹੈ।",
      rom: "peshavar sandarbh vich, ih sankhep faisle lai lorinde sabut ate jokham ikatthe rakhda hai.",
      vi: "Trong bối cảnh chuyên nghiệp, bản tóm tắt này đặt bằng chứng và rủi ro cần cho quyết định ở cùng một chỗ.",
      en: "In a professional context, this summary brings together the evidence and risks needed for a decision.",
    },
    expansion_moves: [
      {
        pa: "ਭੂਮਿਕਾਵਾਂ ਸਪਸ਼ਟ ਹੋਣ ਕਰਕੇ ਅਗਲਾ ਕਦਮ ਜਲਦੀ ਲਿਆ ਜਾ ਸਕਦਾ ਹੈ।",
        rom: "bhumikavan spasht hon karke agla kadam jaldi lia ja sakda hai.",
        vi: "Vì vai trò rõ ràng, bước tiếp theo có thể được thực hiện nhanh hơn.",
        en: "Because roles are clear, the next step can be taken more quickly.",
      },
      {
        pa: "ਸੰਖੇਪ ਵਿੱਚ ਸਿਰਫ ਉਹ ਜਾਣਕਾਰੀ ਰੱਖੀ ਗਈ ਹੈ ਜੋ ਮੈਨੇਜਰ ਨੂੰ ਲੋੜੀਂਦੀ ਹੈ।",
        rom: "sankhep vich sirf oh jankari rakhi gai hai jo manager nu lorindi hai.",
        vi: "Bản tóm tắt chỉ giữ thông tin mà người quản lý cần.",
        en: "The summary keeps only the information the manager needs.",
      },
      {
        pa: "ਸੰਵੇਦਨਸ਼ੀਲ ਬਿੰਦੂ ਨਿਮਰ ਅਤੇ ਤੱਥ-ਆਧਾਰਿਤ ਭਾਸ਼ਾ ਵਿੱਚ ਲਿਖੇ ਗਏ ਹਨ।",
        rom: "sanvedanshil bindu nimar ate tath-adharit bhasha vich likhe gaye han.",
        vi: "Các điểm nhạy cảm được viết bằng ngôn ngữ lịch sự và dựa trên sự thật.",
        en: "Sensitive points are written in polite, evidence-based language.",
      },
    ],
    canada_example: {
      context_vi: "Bối cảnh summary cho quản lý chương trình tại Canada.",
      context_en: "Summary context for a program manager in Canada.",
      pa: "ਕੈਨੇਡਾ ਦੇ ਦਫਤਰ ਵਿੱਚ ਮੈਨੇਜਰ ਲਈ ਇਹ ਸੰਖੇਪ ਖਰਚੇ, ਸਮਾਂ ਅਤੇ ਜੋਖਮ ਨੂੰ ਇੱਕ ਥਾਂ ਰੱਖਦਾ ਹੈ।",
      rom: "Canada de daftar vich manager lai ih sankhep kharche, sama ate jokham nu ik tha rakhda hai.",
      vi: "Trong văn phòng tại Canada, bản tóm tắt này đặt chi phí, thời gian và rủi ro ở cùng một nơi cho quản lý.",
      en: "In a Canadian office, this summary puts cost, time, and risk in one place for the manager.",
    },
    final_quality_check_vi: ["Phù hợp người đọc chuyên nghiệp.", "Có bằng chứng và rủi ro.", "Giọng không thân mật quá mức."],
    final_quality_check_en: ["It fits a professional reader.", "It includes evidence and risk.", "The tone is not too casual."],
    learner_traps_vi: ["Viết như email thân mật.", "Dùng thuật ngữ học thuật dày đặc khi người đọc cần quyết định."],
    learner_traps_en: ["Do not write it like a casual email.", "Avoid dense academic wording when the reader needs a decision."],
  },
  {
    id: "pa_c1_exec_public_service_context",
    level: "C1",
    focus: "public_service_context",
    mode: "remediation",
    title_pa: "ਜਨਤਕ ਸੇਵਾ ਸੰਦਰਭ",
    title_rom: "jantak seva sandarbh",
    title_vi: "Bối cảnh dịch vụ công",
    title_en: "Public-service context",
    summary_goal_vi: "Viết summary cho bối cảnh dịch vụ công, nơi cần minh bạch, công bằng và dễ hiểu.",
    summary_goal_en: "Write for public-service contexts where transparency, fairness, and clarity matter.",
    register_note_vi: "Ngôn ngữ nên trang trọng nhưng dễ hiểu; tránh làm người đọc thấy bị loại trừ.",
    register_note_en: "Language should be formal but accessible; avoid excluding the reader.",
    frame: {
      pa: "ਜਨਤਕ ਸੇਵਾ ਸੰਦਰਭ ਵਿੱਚ, ਸੰਖੇਪ ਨੂੰ ਨਤੀਜੇ, ਨਿਆਂ ਅਤੇ ਪਹੁੰਚ ਨੂੰ ਸਾਫ ਤਰੀਕੇ ਨਾਲ ਜੋੜਨਾ ਚਾਹੀਦਾ ਹੈ।",
      rom: "jantak seva sandarbh vich, sankhep nu natije, nian ate pahunch nu saf tarike nal jorna chahida hai.",
      vi: "Trong bối cảnh dịch vụ công, summary nên nối kết kết quả, công bằng và khả năng tiếp cận một cách rõ ràng.",
      en: "In a public-service context, the summary should clearly connect outcomes, fairness, and access.",
    },
    expansion_moves: [
      {
        pa: "ਪਾਠਕ ਨੂੰ ਇਹ ਸਮਝ ਆਉਣੀ ਚਾਹੀਦੀ ਹੈ ਕਿ ਫੈਸਲਾ ਕਿਨ੍ਹਾਂ ਲੋਕਾਂ ਨੂੰ ਪ੍ਰਭਾਵਿਤ ਕਰੇਗਾ।",
        rom: "pathak nu ih samajh auni chahidi hai ki faisla kinnhan lokan nu prabhavit karega.",
        vi: "Người đọc nên hiểu quyết định sẽ ảnh hưởng đến những nhóm nào.",
        en: "The reader should understand which groups the decision will affect.",
      },
      {
        pa: "ਜਨਤਕ ਲਾਭ ਅਤੇ ਸੰਭਾਵੀ ਜੋਖਮ ਦੋਵੇਂ ਸਪਸ਼ਟ ਲਿਖੇ ਜਾਣ।",
        rom: "jantak labh ate sambhavi jokham dovein spasht likhe jan.",
        vi: "Lợi ích công và rủi ro tiềm tàng đều nên được viết rõ.",
        en: "Public benefit and potential risk should both be stated clearly.",
      },
      {
        pa: "ਸੰਖੇਪ ਦਾ ਅੰਤ ਅਗਲੇ ਸੰਚਾਰ ਜਾਂ ਸਮੀਖਿਆ ਦੇ ਕਦਮ ਨਾਲ ਹੋਵੇ।",
        rom: "sankhep da ant agle sanchar ja samikhia de kadam nal hove.",
        vi: "Phần cuối nên nêu bước truyền thông hoặc rà soát tiếp theo.",
        en: "The summary should end with the next communication or review step.",
      },
    ],
    canada_example: {
      context_vi: "Bản tóm tắt dịch vụ công cho một thông báo cộng đồng tại Canada.",
      context_en: "Public-service summary for a community notice in Canada.",
      pa: "ਕੈਨੇਡਾ ਵਿੱਚ ਨਵੀਂ ਸੇਵਾ ਜਾਣਕਾਰੀ ਲਈ ਇਹ ਸੰਖੇਪ ਪਹੁੰਚ, ਭਾਸ਼ਾ ਸਹਾਇਤਾ ਅਤੇ ਅਗਲੇ ਕਦਮ ਨੂੰ ਸਪਸ਼ਟ ਕਰਦਾ ਹੈ।",
      rom: "Canada vich navi seva jankari lai ih sankhep pahunch, bhasha sahaita ate agle kadam nu spasht karda hai.",
      vi: "Tại Canada, đối với thông tin dịch vụ mới, bản tóm tắt này làm rõ cách tiếp cận, hỗ trợ ngôn ngữ và bước tiếp theo.",
      en: "In Canada, for new service information, this summary clarifies access, language support, and the next step.",
    },
    final_quality_check_vi: ["Dễ hiểu cho người không chuyên.", "Có yếu tố công bằng và tiếp cận.", "Nêu bước truyền thông tiếp theo."],
    final_quality_check_en: ["It is accessible to non-specialists.", "It includes fairness and access.", "It names the next communication step."],
    learner_traps_vi: ["Dùng văn phong quá nội bộ.", "Quên người đọc có thể không biết thuật ngữ tổ chức."],
    learner_traps_en: ["Avoid internal-only wording.", "Remember the reader may not know organizational terminology."],
  },
];
