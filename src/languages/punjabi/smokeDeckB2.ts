// Punjabi B2 smoke deck for quick content checks.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

export type PunjabiSmokeDeckB2Focus =
  | "opinion"
  | "comparison"
  | "counterpoint"
  | "recommendation"
  | "workplace_fairness";

export type PunjabiSmokeDeckB2Topic =
  | "settlement"
  | "education"
  | "healthcare_access"
  | "housing"
  | "transport"
  | "public_service"
  | "work";

export type PunjabiSmokeDeckB2Card = {
  id: string;
  level: "B2";
  focus: PunjabiSmokeDeckB2Focus;
  topic: PunjabiSmokeDeckB2Topic;
  task_gurmukhi: string;
  task_romanization: string;
  task_vi: string;
  task_en: string;
  smokeCheck_vi: string[];
  smokeCheck_en: string[];
  modelMove_gurmukhi: string;
  modelMove_romanization: string;
  modelMove_vi: string;
  modelMove_en: string;
  finalQa_vi: string[];
  finalQa_en: string[];
  integrationReadiness_vi: string;
  integrationReadiness_en: string;
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview?: "deferred";
};

export const punjabiSmokeDeckB2: PunjabiSmokeDeckB2Card[] = [
  {
    id: "pa_b2_smoke_public_plain_notice",
    level: "B2",
    focus: "opinion",
    topic: "public_service",
    task_gurmukhi: "ਸਰਕਾਰੀ notice ਸਧਾਰਨ ਭਾਸ਼ਾ ਵਿੱਚ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ: ਆਪਣੀ ਰਾਏ ਦਿਓ।",
    task_romanization: "sarkaarii notice sadhaaran bhaashaa vich honaa chaahiidaa hai: aapnii raae dio.",
    task_vi: "Nêu ý kiến về việc notice công quyền nên dùng ngôn ngữ đơn giản.",
    task_en: "Give an opinion on public notices using plain language.",
    smokeCheck_vi: ["stance rõ", "lý do thực tế", "một giới hạn"],
    smokeCheck_en: ["clear stance", "practical reason", "one limit"],
    modelMove_gurmukhi: "ਮੇਰੇ ਵਿਚਾਰ ਵਿੱਚ ਇਹ ਜ਼ਰੂਰੀ ਹੈ, ਕਿਉਂਕਿ ਲੋਕਾਂ ਨੂੰ ਮਿਤੀ, fee ਅਤੇ ਅਗਲਾ ਕਦਮ ਸਮਝਣਾ ਪੈਂਦਾ ਹੈ।",
    modelMove_romanization: "mere vichaar vich ih zaruurii hai, kiunki lokaan nu mitii, fee ate aglaa kadam samajhnaa paindaa hai.",
    modelMove_vi: "Theo tôi điều này cần thiết vì người dân phải hiểu ngày hạn, phí và bước tiếp theo.",
    modelMove_en: "In my view this is necessary because people must understand the date, fee, and next step.",
    finalQa_vi: ["Rõ stance?", "Có reason?", "Có next step?"],
    finalQa_en: ["Clear stance?", "Reason included?", "Next step included?"],
    integrationReadiness_vi: "Sẵn sàng nếu answer có thể đưa thẳng vào task kiểm tra B2.",
    integrationReadiness_en: "Ready if the answer can be used directly in a B2 check task.",
    learnerTrap_vi: "Đừng viết chung chung: thêm date, fee hoặc step.",
    learnerTrap_en: "Do not stay generic: add a date, fee, or step.",
    scriptAwareness_en: "Gurmukhi is primary; Shahmukhi is awareness only.",
    nativeReview: "deferred",
  },
  {
    id: "pa_b2_smoke_transport_car_transit",
    level: "B2",
    focus: "comparison",
    topic: "transport",
    task_gurmukhi: "ਗੱਡੀ ਅਤੇ ਪਬਲਿਕ ਟ੍ਰਾਂਜ਼ਿਟ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    task_romanization: "gaddi ate public transit di tulnaa karo.",
    task_vi: "So sánh xe hơi và giao thông công cộng.",
    task_en: "Compare a car and public transit.",
    smokeCheck_vi: ["cost", "time", "condition"],
    smokeCheck_en: ["cost", "time", "condition"],
    modelMove_gurmukhi: "ਗੱਡੀ ਲਚਕ ਦਿੰਦੀ ਹੈ, ਪਰ transit ਸਸਤਾ ਹੋ ਸਕਦਾ ਹੈ ਜੇ route ਭਰੋਸੇਯੋਗ ਹੋਵੇ।",
    modelMove_romanization: "gaddi lachak dindii hai, par transit sastaa ho sakdaa hai je route bharoseyog hove.",
    modelMove_vi: "Xe linh hoạt, nhưng transit có thể rẻ hơn nếu tuyến đáng tin.",
    modelMove_en: "A car gives flexibility, but transit can be cheaper if the route is reliable.",
    finalQa_vi: ["Hai sides?", "Tradeoff?", "Condition?"],
    finalQa_en: ["Two sides?", "Tradeoff?", "Condition?"],
    integrationReadiness_vi: "Sẵn sàng nếu comparison không biến thành preference một chiều.",
    integrationReadiness_en: "Ready if the comparison does not become a one-sided preference.",
    learnerTrap_vi: "Từ khóa: ਤੁਲਨਾ means comparison.",
    learnerTrap_en: "Keyword: ਤੁਲਨਾ means comparison.",
    canadaPracticalExample_vi: "Ví dụ Canada: winter và bus frequency ảnh hưởng commute.",
    canadaPracticalExample_en: "Canada example: winter and bus frequency affect commuting.",
  },
  {
    id: "pa_b2_smoke_housing_near_transit",
    level: "B2",
    focus: "recommendation",
    topic: "housing",
    task_gurmukhi: "ਦੂਰ ਸਸਤਾ ਘਰ ਜਾਂ transit ਦੇ ਨੇੜੇ ਘਰ: ਸਿਫ਼ਾਰਸ਼ ਕਰੋ।",
    task_romanization: "duur sastaa ghar jaan transit de nere ghar: sifaarash karo.",
    task_vi: "Khuyến nghị nhà rẻ ở xa hoặc nhà gần transit.",
    task_en: "Recommend cheaper housing far away or housing near transit.",
    smokeCheck_vi: ["recommendation", "rent", "commute"],
    smokeCheck_en: ["recommendation", "rent", "commute"],
    modelMove_gurmukhi: "ਜੇ ਗੱਡੀ ਨਹੀਂ, ਤਾਂ ਮੇਰੀ ਸਿਫ਼ਾਰਸ਼ transit ਦੇ ਨੇੜੇ ਘਰ ਹੈ, ਭਾਵੇਂ rent ਵੱਧ ਹੋਵੇ।",
    modelMove_romanization: "je gaddi nahi, taan merii sifaarash transit de nere ghar hai, bhaave rent vadh hove.",
    modelMove_vi: "Nếu không có xe, tôi khuyến nghị nhà gần transit dù tiền thuê cao hơn.",
    modelMove_en: "If there is no car, I recommend housing near transit even if rent is higher.",
    finalQa_vi: ["Clear choice?", "Reason?", "Tradeoff?"],
    finalQa_en: ["Clear choice?", "Reason?", "Tradeoff?"],
    integrationReadiness_vi: "Sẵn sàng nếu recommendation có điều kiện rõ.",
    integrationReadiness_en: "Ready if the recommendation has a clear condition.",
    learnerTrap_vi: "Không chỉ nói cheap; phải nói commute.",
    learnerTrap_en: "Do not only say cheap; mention commute.",
    canadaPracticalExample_vi: "Ví dụ Canada: winter commute làm vị trí nhà quan trọng hơn.",
    canadaPracticalExample_en: "Canada example: winter commuting makes location more important.",
  },
  {
    id: "pa_b2_smoke_settlement_first_visit",
    level: "B2",
    focus: "recommendation",
    topic: "settlement",
    task_gurmukhi: "ਨਵੇਂ ਆਏ ਵਿਅਕਤੀ ਨੂੰ settlement service ਨਾਲ ਮਿਲਣ ਦੀ ਸਲਾਹ ਦਿਓ।",
    task_romanization: "nave aaye viakti nu settlement service naal milan di salaah dio.",
    task_vi: "Khuyên người mới đến gặp dịch vụ định cư.",
    task_en: "Advise a newcomer to meet a settlement service.",
    smokeCheck_vi: ["benefit", "limit", "next step"],
    smokeCheck_en: ["benefit", "limit", "next step"],
    modelMove_gurmukhi: "ਸੇਵਾ forms, school ਅਤੇ housing ਬਾਰੇ ਰਾਹ ਦਿਖਾ ਸਕਦੀ ਹੈ, ਪਰ ਫੈਸਲਾ ਹਾਲਾਤ ਤੇ ਨਿਰਭਰ ਕਰਦਾ ਹੈ।",
    modelMove_romanization: "sevaa forms, school ate housing baare raah dikhaa sakdii hai, par faislaa haalaat te nirbhar kardaa hai.",
    modelMove_vi: "Dịch vụ có thể hướng dẫn form, trường học và nhà ở, nhưng quyết định tùy hoàn cảnh.",
    modelMove_en: "The service can guide forms, school, and housing, but the decision depends on circumstances.",
    finalQa_vi: ["Practical?", "No overpromise?", "Next step?"],
    finalQa_en: ["Practical?", "No overpromise?", "Next step?"],
    integrationReadiness_vi: "Sẵn sàng nếu không hứa giải quyết mọi vấn đề.",
    integrationReadiness_en: "Ready if it does not promise to solve every problem.",
    learnerTrap_vi: "ਨਿਰਭਰ = depends; dùng khi cần nuance.",
    learnerTrap_en: "ਨਿਰਭਰ means depends; use it for nuance.",
    canadaPracticalExample_vi: "Ví dụ Canada: settlement workers can explain local forms.",
    canadaPracticalExample_en: "Canada example: settlement workers can explain local forms.",
  },
  {
    id: "pa_b2_smoke_work_task_fairness",
    level: "B2",
    focus: "workplace_fairness",
    topic: "work",
    task_gurmukhi: "ਟੀਮ ਵਿੱਚ ਕੰਮ ਦੀ ਵੰਡ ਅਸਮਾਨ ਹੈ। ਨਰਮ ਸੁਝਾਅ ਦਿਓ।",
    task_romanization: "team vich kamm di vand asamaan hai. naram sujhaav dio.",
    task_vi: "Phân việc không đều trong đội. Hãy góp ý mềm.",
    task_en: "Task distribution is uneven in the team. Give a tactful suggestion.",
    smokeCheck_vi: ["polite", "process", "fairness"],
    smokeCheck_en: ["polite", "process", "fairness"],
    modelMove_gurmukhi: "ਕੀ ਅਸੀਂ ਹਫ਼ਤੇ ਵਿੱਚ ਇੱਕ ਵਾਰ ਕੰਮ ਦੀ ਸੂਚੀ ਦੇਖ ਸਕਦੇ ਹਾਂ ਤਾਂ ਜੋ ਵੰਡ ਨਿਆਇਕ ਰਹੇ?",
    modelMove_romanization: "kii asii hafte vich ikk vaar kamm di suuchii dekh sakde haan taan jo vand niaaik rahe?",
    modelMove_vi: "Chúng ta có thể xem danh sách việc mỗi tuần để phân chia công bằng hơn không?",
    modelMove_en: "Could we review the task list weekly so the distribution stays fair?",
    finalQa_vi: ["No blame?", "Concrete process?", "Fair tone?"],
    finalQa_en: ["No blame?", "Concrete process?", "Fair tone?"],
    integrationReadiness_vi: "Sẵn sàng nếu tone đủ chuyên nghiệp cho workplace.",
    integrationReadiness_en: "Ready if the tone is professional enough for the workplace.",
    learnerTrap_vi: "ਅਸਮਾਨ = uneven; đừng biến thành accusation.",
    learnerTrap_en: "ਅਸਮਾਨ means uneven; do not turn it into an accusation.",
  },
  {
    id: "pa_b2_smoke_work_shift_counter",
    level: "B2",
    focus: "counterpoint",
    topic: "work",
    task_gurmukhi: "ਸ਼ਿਫਟ ਬਦਲਣਾ ਹਮੇਸ਼ਾ ਮਾੜਾ ਹੈ: ਸੰਤੁਲਿਤ ਜਵਾਬ ਦਿਓ।",
    task_romanization: "shift badalnaa hameshaa maarraa hai: santulit javaab dio.",
    task_vi: "Đổi ca luôn xấu: hãy phản hồi cân bằng.",
    task_en: "Changing shifts is always bad: give a balanced response.",
    smokeCheck_vi: ["acknowledge", "exception", "rule"],
    smokeCheck_en: ["acknowledge", "exception", "rule"],
    modelMove_gurmukhi: "ਚਿੰਤਾ ਵਾਜਬ ਹੈ, ਪਰ ਜੇ ਬੇਨਤੀ ਜਲਦੀ ਆਵੇ ਅਤੇ coverage ਹੋਵੇ, ਤਾਂ ਬਦਲਾਅ ਸੰਭਵ ਹੈ।",
    modelMove_romanization: "chintaa vaajab hai, par je benatii jaldi aave ate coverage hove, taan badlaa sambhav hai.",
    modelMove_vi: "Mối lo hợp lý, nhưng nếu yêu cầu đến sớm và có người thay, việc đổi ca có thể khả thi.",
    modelMove_en: "The concern is reasonable, but if the request comes early and coverage exists, a change can be workable.",
    finalQa_vi: ["Concern?", "Counterpoint?", "Practical rule?"],
    finalQa_en: ["Concern?", "Counterpoint?", "Practical rule?"],
    integrationReadiness_vi: "Sẵn sàng nếu tránh always/never và có rule.",
    integrationReadiness_en: "Ready if it avoids always/never and includes a rule.",
    learnerTrap_vi: "ਵਾਜਬ = reasonable; dùng trước counterpoint.",
    learnerTrap_en: "ਵਾਜਬ means reasonable; use it before a counterpoint.",
    canadaPracticalExample_vi: "Ví dụ Canada: childcare hoặc transit có thể ảnh hưởng ca làm.",
    canadaPracticalExample_en: "Canada example: child care or transit may affect shifts.",
  },
  {
    id: "pa_b2_smoke_education_parent_progress",
    level: "B2",
    focus: "recommendation",
    topic: "education",
    task_gurmukhi: "ਅਧਿਆਪਕ ਨੂੰ ਬੱਚੇ ਦੀ ਤਰੱਕੀ ਬਾਰੇ ਦੋ ਸਪਸ਼ਟ ਸਵਾਲ ਪੁੱਛੋ।",
    task_romanization: "adhyaapak nu bachche di tarakki baare do spasht savaal puchho.",
    task_vi: "Hỏi giáo viên hai câu rõ về tiến bộ của con.",
    task_en: "Ask a teacher two clear questions about a child's progress.",
    smokeCheck_vi: ["polite", "specific", "home support"],
    smokeCheck_en: ["polite", "specific", "home support"],
    modelMove_gurmukhi: "ਉਹ ਕਿੱਥੇ ਮਜ਼ਬੂਤ ਹੈ? ਘਰ ਵਿੱਚ ਹੋਰ ਅਭਿਆਸ ਲਈ ਅਸੀਂ ਕੀ ਕਰ ਸਕਦੇ ਹਾਂ?",
    modelMove_romanization: "oh kithe mazbuut hai? ghar vich hor abhyaas lai asii kii kar sakde haan?",
    modelMove_vi: "Con mạnh ở đâu? Ở nhà chúng tôi có thể làm gì để luyện thêm?",
    modelMove_en: "Where are they strong? What can we do at home for more practice?",
    finalQa_vi: ["Two questions?", "Polite?", "Actionable?"],
    finalQa_en: ["Two questions?", "Polite?", "Actionable?"],
    integrationReadiness_vi: "Sẵn sàng nếu câu hỏi đủ cụ thể cho meeting.",
    integrationReadiness_en: "Ready if the questions are specific enough for a meeting.",
    learnerTrap_vi: "ਤਰੱਕੀ = progress; tránh hỏi quá rộng.",
    learnerTrap_en: "ਤਰੱਕੀ means progress; avoid asking too broadly.",
    canadaPracticalExample_vi: "Ví dụ Canada: parent-teacher interviews cần câu hỏi cụ thể.",
    canadaPracticalExample_en: "Canada example: parent-teacher interviews need specific questions.",
  },
  {
    id: "pa_b2_smoke_education_course_compare",
    level: "B2",
    focus: "comparison",
    topic: "education",
    task_gurmukhi: "ਕਮਿਊਨਟੀ ਕਲਾਸ ਅਤੇ ਕਾਲਜ ਕੋਰਸ ਦੀ ਤੁਲਨਾ ਕਰੋ।",
    task_romanization: "community class ate college course di tulnaa karo.",
    task_vi: "So sánh lớp cộng đồng và khóa college.",
    task_en: "Compare a community class and a college course.",
    smokeCheck_vi: ["cost", "formality", "goal"],
    smokeCheck_en: ["cost", "formality", "goal"],
    modelMove_gurmukhi: "ਕਮਿਊਨਟੀ ਕਲਾਸ ਲਚਕਦਾਰ ਹੈ, ਪਰ ਕਾਲਜ ਕੋਰਸ career ਲਈ ਹੋਰ ਰਸਮੀ ਹੋ ਸਕਦਾ ਹੈ।",
    modelMove_romanization: "community class lachkdaar hai, par college course career lai hor rasmii ho sakdaa hai.",
    modelMove_vi: "Lớp cộng đồng linh hoạt, nhưng khóa college có thể chính thức hơn cho nghề nghiệp.",
    modelMove_en: "A community class is flexible, but a college course may be more formal for a career.",
    finalQa_vi: ["Two options?", "Goal?", "No absolute answer?"],
    finalQa_en: ["Two options?", "Goal?", "No absolute answer?"],
    integrationReadiness_vi: "Sẵn sàng nếu comparison dựa trên mục tiêu học.",
    integrationReadiness_en: "Ready if the comparison is based on learning goals.",
    learnerTrap_vi: "ਲਚਕਦਾਰ = flexible; đừng chọn tuyệt đối.",
    learnerTrap_en: "ਲਚਕਦਾਰ means flexible; do not choose absolutely.",
  },
  {
    id: "pa_b2_smoke_health_wait_access",
    level: "B2",
    focus: "opinion",
    topic: "healthcare_access",
    task_gurmukhi: "ਲੰਬੀ ਉਡੀਕ ਵਿੱਚ ਮਰੀਜ਼ਾਂ ਨੂੰ ਕਿਹੜੀ ਜਾਣਕਾਰੀ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ?",
    task_romanization: "lambii udiik vich mariizaan nu kihri jaankaari milnii chaahiidii hai?",
    task_vi: "Khi chờ lâu, bệnh nhân nên nhận thông tin gì?",
    task_en: "During a long wait, what information should patients receive?",
    smokeCheck_vi: ["wait time", "next step", "no diagnosis"],
    smokeCheck_en: ["wait time", "next step", "no diagnosis"],
    modelMove_gurmukhi: "ਉਹਨਾਂ ਨੂੰ ਅੰਦਾਜ਼ੇ ਵਾਲਾ ਸਮਾਂ, ਅਗਲਾ ਕਦਮ ਅਤੇ urgent cases ਬਾਰੇ ਸਧਾਰਨ ਜਾਣਕਾਰੀ ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ।",
    modelMove_romanization: "ohnaanu andaaze vaalaa samaa, aglaa kadam ate urgent cases baare sadhaaran jaankaari milnii chaahiidii hai.",
    modelMove_vi: "Họ nên nhận thời gian ước tính, bước tiếp theo và thông tin đơn giản về ca khẩn.",
    modelMove_en: "They should receive an estimated time, next step, and simple information about urgent cases.",
    finalQa_vi: ["Process only?", "Wait info?", "Next step?"],
    finalQa_en: ["Process only?", "Wait info?", "Next step?"],
    integrationReadiness_vi: "Sẵn sàng nếu giữ ở mức access/process, không chẩn đoán.",
    integrationReadiness_en: "Ready if it stays at access/process level, not diagnosis.",
    learnerTrap_vi: "ਉਡੀਕ = wait; không đưa lời khuyên y tế.",
    learnerTrap_en: "ਉਡੀਕ means wait; do not give medical advice.",
    canadaPracticalExample_vi: "Ví dụ Canada: walk-in clinic cần thông báo wait rõ.",
    canadaPracticalExample_en: "Canada example: a walk-in clinic needs clear wait notices.",
  },
  {
    id: "pa_b2_smoke_health_priority_counter",
    level: "B2",
    focus: "counterpoint",
    topic: "healthcare_access",
    task_gurmukhi: "ਪਹਿਲਾਂ ਆਉਣ ਵਾਲੇ ਨੂੰ ਪਹਿਲਾਂ ਸੇਵਾ ਮਿਲੇ: urgent cases ਬਾਰੇ ਜਵਾਬ ਦਿਓ।",
    task_romanization: "pahilaan aaun vaale nu pahilaan sevaa mile: urgent cases baare javaab dio.",
    task_vi: "Ai đến trước phục vụ trước: phản hồi về ca khẩn.",
    task_en: "First come, first served: respond about urgent cases.",
    smokeCheck_vi: ["general rule", "exception", "clear explanation"],
    smokeCheck_en: ["general rule", "exception", "clear explanation"],
    modelMove_gurmukhi: "ਆਮ ਹਾਲਾਤ ਵਿੱਚ ਇਹ fair ਹੈ, ਪਰ urgent cases ਨੂੰ ਪਹਿਲ ਮਿਲ ਸਕਦੀ ਹੈ ਕਿਉਂਕਿ ਦੇਰੀ ਨੁਕਸਾਨ ਕਰ ਸਕਦੀ ਹੈ।",
    modelMove_romanization: "aam haalaat vich ih fair hai, par urgent cases nu pahal mil sakdii hai kiunki derii nuksaan kar sakdii hai.",
    modelMove_vi: "Trong tình huống thường thì công bằng, nhưng ca khẩn có thể được ưu tiên vì chậm trễ gây hại.",
    modelMove_en: "In ordinary situations it is fair, but urgent cases may receive priority because delay can cause harm.",
    finalQa_vi: ["Acknowledge?", "Exception?", "No medical advice?"],
    finalQa_en: ["Acknowledge?", "Exception?", "No medical advice?"],
    integrationReadiness_vi: "Sẵn sàng nếu giải thích priority mà không tư vấn điều trị.",
    integrationReadiness_en: "Ready if it explains priority without treatment advice.",
    learnerTrap_vi: "ਪਹਿਲ = priority; không tranh luận cực đoan.",
    learnerTrap_en: "ਪਹਿਲ means priority; do not argue in extremes.",
  },
  {
    id: "pa_b2_smoke_public_online_access",
    level: "B2",
    focus: "counterpoint",
    topic: "public_service",
    task_gurmukhi: "ਸਾਰੀਆਂ ਸੇਵਾਵਾਂ online ਹੋਣੀਆਂ ਚਾਹੀਦੀਆਂ ਹਨ: ਸੰਤੁਲਿਤ ਜਵਾਬ ਦਿਓ।",
    task_romanization: "saariiaan sevaavaan online honiiaan chaahiidiiaan han: santulit javaab dio.",
    task_vi: "Mọi dịch vụ nên online: hãy phản hồi cân bằng.",
    task_en: "All services should be online: give a balanced response.",
    smokeCheck_vi: ["benefit", "access barrier", "hybrid option"],
    smokeCheck_en: ["benefit", "access barrier", "hybrid option"],
    modelMove_gurmukhi: "Online ਸੇਵਾ ਤੇਜ਼ ਹੈ, ਪਰ ਹਰ ਕਿਸੇ ਲਈ ਆਸਾਨ ਨਹੀਂ; phone ਜਾਂ office support ਵੀ ਰਹਿਣਾ ਚਾਹੀਦਾ ਹੈ।",
    modelMove_romanization: "online sevaa tez hai, par har kise lai aasaan nahi; phone jaan office support vii rahinaa chaahiidaa hai.",
    modelMove_vi: "Dịch vụ online nhanh, nhưng không dễ cho tất cả; nên giữ hỗ trợ qua điện thoại hoặc văn phòng.",
    modelMove_en: "Online service is fast, but it is not easy for everyone; phone or office support should remain.",
    finalQa_vi: ["Benefit?", "Barrier?", "Hybrid solution?"],
    finalQa_en: ["Benefit?", "Barrier?", "Hybrid solution?"],
    integrationReadiness_vi: "Sẵn sàng nếu answer bảo toàn cả efficiency và access.",
    integrationReadiness_en: "Ready if the answer preserves both efficiency and access.",
    learnerTrap_vi: "ਦੋਵੇਂ = both; giữ cả hai phía.",
    learnerTrap_en: "ਦੋਵੇਂ means both; keep both sides.",
    canadaPracticalExample_vi: "Ví dụ Canada: libraries can help residents use online forms.",
    canadaPracticalExample_en: "Canada example: libraries can help residents use online forms.",
  },
];

export default punjabiSmokeDeckB2;
