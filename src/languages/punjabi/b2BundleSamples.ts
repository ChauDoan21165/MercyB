// Punjabi B2 bundle samples for stable upper-intermediate reasoning.
// Gurmukhi is primary; romanization supports Vietnamese- and English-speaking learners.

export type PunjabiB2BundleSamplesFocus =
  | "structured_opinion"
  | "evidence"
  | "counterpoint"
  | "tradeoff"
  | "recommendation"
  | "settlement";

export type PunjabiB2BundleSamplesTopic =
  | "work"
  | "education"
  | "healthcare"
  | "housing"
  | "transport"
  | "public_service";

export type PunjabiB2BundleReasoningMove =
  | "position"
  | "evidence"
  | "counterpoint"
  | "tradeoff"
  | "recommendation"
  | "settlement_step";

export type PunjabiB2BundleReasoningLine = {
  move: PunjabiB2BundleReasoningMove;
  line_gurmukhi: string;
  line_romanization: string;
  line_vi: string;
  line_en: string;
};

export type PunjabiB2BundleSample = {
  id: string;
  level: "B2";
  bundleFocus: PunjabiB2BundleSamplesFocus;
  topic: PunjabiB2BundleSamplesTopic;
  prompt_gurmukhi: string;
  prompt_romanization: string;
  prompt_vi: string;
  prompt_en: string;
  modelAnswer_gurmukhi: string;
  modelAnswer_romanization: string;
  modelAnswer_vi: string;
  modelAnswer_en: string;
  reasoningLines: PunjabiB2BundleReasoningLine[];
  bundleChecks_vi: string[];
  bundleChecks_en: string[];
  learnerTrap_vi: string;
  learnerTrap_en: string;
  canadaPracticalExample_vi?: string;
  canadaPracticalExample_en?: string;
  scriptAwareness_en?: string;
  nativeReview: "deferred";
};

export const punjabiB2BundleSamples: PunjabiB2BundleSample[] = [
  {
    id: "pa_b2_bundle_work_fair_schedule",
    level: "B2",
    bundleFocus: "structured_opinion",
    topic: "work",
    prompt_gurmukhi: "ਕੰਮ ਵਾਲੀ ਟੀਮ ਵਿੱਚ shift schedule ਬਦਲਣ ਬਾਰੇ ਸੰਤੁਲਿਤ ਰਾਏ ਦਿਓ।",
    prompt_romanization: "Kamm vaalii team vich shift schedule badalan baare santulit rae dio.",
    prompt_vi: "Hãy đưa ra opinion cân bằng về việc đổi lịch ca trong nhóm làm việc.",
    prompt_en: "Give a balanced opinion about changing the shift schedule in a work team.",
    modelAnswer_gurmukhi:
      "ਮੇਰੀ ਰਾਏ ਹੈ ਕਿ schedule ਬਦਲ ਸਕਦਾ ਹੈ, ਪਰ ਪਹਿਲਾਂ workload, childcare ਅਤੇ transit timing ਦਾ evidence ਦੇਖਣਾ ਚਾਹੀਦਾ ਹੈ। ਇਸ ਨਾਲ fairness ਵੀ ਰਹਿੰਦੀ ਹੈ ਅਤੇ service coverage ਵੀ ਨਹੀਂ ਟੁੱਟਦੀ।",
    modelAnswer_romanization:
      "Merii rae hai ki schedule badal sakdaa hai, par pahilan workload, childcare ate transit timing daa evidence dekhnaa chaahiidaa hai. Is naal fairness vii rahindii hai ate service coverage vii nahin tuttdii.",
    modelAnswer_vi:
      "Opinion nói có thể đổi lịch, nhưng trước hết phải xem evidence về workload, childcare và giờ transit để giữ công bằng và không làm hỏng coverage.",
    modelAnswer_en:
      "The opinion allows a schedule change, but first checks evidence about workload, childcare, and transit timing so fairness and service coverage stay intact.",
    reasoningLines: [
      {
        move: "position",
        line_gurmukhi: "ਬਦਲਾਅ ਸੰਭਵ ਹੈ, ਪਰ process ਸਭ ਲਈ ਇਕੋ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
        line_romanization: "Badlaa sambhav hai, par process sabh lai ikko honaa chaahiidaa hai.",
        line_vi: "Thay doi co the duoc, nhung process phai giong nhau cho tat ca moi nguoi.",
        line_en: "Change is possible, but the process should be the same for everyone.",
      },
      {
        move: "evidence",
        line_gurmukhi: "Team board ਅਤੇ attendance records ਨਾਲ pressure ਸਾਫ਼ ਹੋ ਜਾਂਦਾ ਹੈ।",
        line_romanization: "Team board ate attendance records naal pressure saaf ho jaandaa hai.",
        line_vi: "Team board va attendance records lam ro ap luc cong viec.",
        line_en: "The team board and attendance records make the pressure clear.",
      },
      {
        move: "recommendation",
        line_gurmukhi: "Manager trial period ਰੱਖੇ ਅਤੇ ਦੋ ਹਫ਼ਤਿਆਂ ਬਾਅਦ review ਕਰੇ।",
        line_romanization: "Manager trial period rakhe ate do haftiaan baad review kare.",
        line_vi: "Manager nen dat trial period va review sau hai tuan.",
        line_en: "The manager should set a trial period and review it after two weeks.",
      },
    ],
    bundleChecks_vi: [
      "Pre-A11 bundle giữ stance, evidence và recommendation.",
      "Receipt check giữ workplace fairness không thành complaint cá nhân.",
      "Ledger check giữ Canada transit/childcare detail trước pre-integration.",
    ],
    bundleChecks_en: [
      "Pre-A11 bundle keeps stance, evidence, and recommendation.",
      "Receipt check keeps workplace fairness from becoming a personal complaint.",
      "Ledger check keeps Canada transit/childcare detail before pre-integration.",
    ],
    learnerTrap_vi: "Learner hay nói quá trực tiếp kiểu 'manager wrong'; B2 cần process, evidence và tone chuyên nghiệp.",
    learnerTrap_en: "Learners often say 'manager wrong' too directly; B2 needs process, evidence, and professional tone.",
    canadaPracticalExample_vi: "Ví dụ thực tế Canada: ca làm phải khớp lịch bus hoặc lịch daycare.",
    canadaPracticalExample_en: "Canada-practical example: shifts may need to match bus routes or daycare pickup times.",
    scriptAwareness_en: "Shahmukhi awareness only: this sample is stored in Gurmukhi for the app.",
    nativeReview: "deferred",
  },
  {
    id: "pa_b2_bundle_education_pathway",
    level: "B2",
    bundleFocus: "recommendation",
    topic: "education",
    prompt_gurmukhi: "ਨਵੇਂ learner ਲਈ college program ਜਾਂ short certificate ਵਿਚੋਂ ਚੋਣ ਦੀ ਸਿਫਾਰਸ਼ ਕਰੋ।",
    prompt_romanization: "Nave learner lai college program jaan short certificate vichon chon di sifaarash karo.",
    prompt_vi: "Hãy recommend chọn college program hay short certificate cho learner mới.",
    prompt_en: "Recommend whether a new learner should choose a college program or a short certificate.",
    modelAnswer_gurmukhi:
      "ਜੇ learner ਨੂੰ ਜਲਦੀ job entry ਚਾਹੀਦੀ ਹੈ, short certificate ਵਧੀਆ ਸ਼ੁਰੂਆਤ ਹੈ; ਪਰ long-term license ਲਈ college program ਜ਼ਿਆਦਾ ਮਜ਼ਬੂਤ ਰਾਹ ਹੈ। ਪਹਿਲਾਂ fees, schedule ਅਤੇ practicum requirement compare ਕਰਨੇ ਚਾਹੀਦੇ ਹਨ।",
    modelAnswer_romanization:
      "Je learner nu jaldi job entry chaahiidii hai, short certificate vadhiiaa shuruaat hai; par long-term license lai college program ziaadaa mazbuut raah hai. Pahilan fees, schedule ate practicum requirement compare karne chaahiide han.",
    modelAnswer_vi:
      "Nếu learner cần vào việc nhanh, short certificate là khởi đầu tốt; nhưng với license dài hạn, college program mạnh hơn. Trước hết so sánh fees, schedule và practicum.",
    modelAnswer_en:
      "If the learner needs quick job entry, a short certificate is a good start; for long-term licensing, a college program is stronger. First compare fees, schedule, and practicum requirements.",
    reasoningLines: [
      {
        move: "tradeoff",
        line_gurmukhi: "Certificate ਤੇਜ਼ ਹੈ, ਪਰ degree pathway ਵਧੇਰੇ doors ਖੋਲ੍ਹ ਸਕਦਾ ਹੈ।",
        line_romanization: "Certificate tez hai, par degree pathway vadere doors kholh sakdaa hai.",
        line_vi: "Certificate nhanh hon, nhung degree pathway co the mo nhieu co hoi hon.",
        line_en: "A certificate is faster, but a degree pathway may open more doors.",
      },
      {
        move: "evidence",
        line_gurmukhi: "Fees, schedule ਅਤੇ practicum hours decision ਨੂੰ real ਬਣਾਉਂਦੇ ਹਨ।",
        line_romanization: "Fees, schedule ate practicum hours decision nu real banaaunde han.",
        line_vi: "Fees, schedule va practicum hours lam cho quyet dinh thuc te hon.",
        line_en: "Fees, schedule, and practicum hours make the decision realistic.",
      },
      {
        move: "recommendation",
        line_gurmukhi: "ਪਹਿਲਾਂ advisor ਨਾਲ transfer options confirm ਕਰੋ।",
        line_romanization: "Pahilan advisor naal transfer options confirm karo.",
        line_vi: "Truoc het hay confirm transfer options voi advisor.",
        line_en: "First confirm transfer options with an advisor.",
      },
    ],
    bundleChecks_vi: [
      "Pre-A11 bundle giữ recommendation có điều kiện.",
      "Receipt check giữ fees, schedule và practicum.",
      "Ledger check không biến advice thành lời hứa chắc chắn.",
    ],
    bundleChecks_en: [
      "Pre-A11 bundle keeps the conditional recommendation.",
      "Receipt check keeps fees, schedule, and practicum.",
      "Ledger check does not turn advice into a guarantee.",
    ],
    learnerTrap_vi: "Không dùng 'best' tuyệt đối; B2 nên nói 'nếu mục tiêu là...' rồi giải thích tradeoff.",
    learnerTrap_en: "Avoid absolute 'best'; B2 should say 'if the goal is...' and explain the tradeoff.",
    canadaPracticalExample_vi: "Ví dụ Canada: hỏi college advisor về transfer credit và practicum placement.",
    canadaPracticalExample_en: "Canada-practical example: ask a college advisor about transfer credits and practicum placement.",
    nativeReview: "deferred",
  },
  {
    id: "pa_b2_bundle_healthcare_wait",
    level: "B2",
    bundleFocus: "counterpoint",
    topic: "healthcare",
    prompt_gurmukhi: "Clinic wait time ਬਾਰੇ complaint ਵਿੱਚ counterpoint ਅਤੇ respectful settlement ਸ਼ਾਮਲ ਕਰੋ।",
    prompt_romanization: "Clinic wait time baare complaint vich counterpoint ate respectful settlement shaamal karo.",
    prompt_vi: "Trong complaint về thời gian chờ ở clinic, hãy thêm counterpoint và cách giải quyết respectful.",
    prompt_en: "In a complaint about clinic wait time, include a counterpoint and a respectful settlement.",
    modelAnswer_gurmukhi:
      "ਮੈਂ ਸਮਝਦਾ ਹਾਂ ਕਿ urgent patients ਪਹਿਲਾਂ ਵੇਖੇ ਜਾਂਦੇ ਹਨ, ਪਰ ਜਦੋਂ wait time ਬਹੁਤ ਲੰਮਾ ਹੋਵੇ ਤਾਂ front desk ਨੂੰ update ਦੇਣਾ ਚਾਹੀਦਾ ਹੈ। Settlement ਵਜੋਂ clinic text alert ਜਾਂ callback option ਦੇ ਸਕਦੀ ਹੈ।",
    modelAnswer_romanization:
      "Main samajhdaa haan ki urgent patients pahilan vekhe jaande han, par jadon wait time bahut lammaa hove taan front desk nu update denaa chaahiidaa hai. Settlement vajon clinic text alert jaan callback option de sakdii hai.",
    modelAnswer_vi:
      "Tôi hiểu urgent patients được xem trước, nhưng nếu wait time quá dài thì front desk nên cập nhật. Settlement có thể là text alert hoặc callback option.",
    modelAnswer_en:
      "I understand urgent patients are seen first, but when wait time is very long the front desk should provide updates. A settlement could be text alerts or a callback option.",
    reasoningLines: [
      {
        move: "counterpoint",
        line_gurmukhi: "Emergency cases ਨੂੰ priority ਮਿਲਣੀ ਠੀਕ ਹੈ।",
        line_romanization: "Emergency cases nu priority milnii thiik hai.",
        line_vi: "Emergency cases duoc uu tien la dieu hop ly.",
        line_en: "It is reasonable for emergency cases to get priority.",
      },
      {
        move: "evidence",
        line_gurmukhi: "ਜੇ wait time ਦੋ ਘੰਟੇ ਤੋਂ ਵੱਧ ਹੈ, update ਜ਼ਰੂਰੀ ਹੈ।",
        line_romanization: "Je wait time do ghante ton vadh hai, update zaruurii hai.",
        line_vi: "Neu thoi gian cho hon hai gio, update la can thiet.",
        line_en: "If the wait is over two hours, an update is necessary.",
      },
      {
        move: "settlement_step",
        line_gurmukhi: "Text alert ਜਾਂ callback ਨਾਲ patient ਦਾ ਸਮਾਂ ਬਚਦਾ ਹੈ।",
        line_romanization: "Text alert jaan callback naal patient daa samaan bachd aa hai.",
        line_vi: "Text alerts hoac callbacks giup tiet kiem thoi gian cua patient.",
        line_en: "Text alerts or callbacks save the patient's time.",
      },
    ],
    bundleChecks_vi: [
      "Pre-A11 bundle giữ counterpoint trước complaint.",
      "Receipt check giữ settlement step cụ thể.",
      "Ledger check giữ healthcare tone respectful.",
    ],
    bundleChecks_en: [
      "Pre-A11 bundle keeps the counterpoint before the complaint.",
      "Receipt check keeps the concrete settlement step.",
      "Ledger check keeps the healthcare tone respectful.",
    ],
    learnerTrap_vi: "Đừng nói clinic 'must always'; B2 nên thừa nhận urgent priority rồi đề xuất update rõ ràng.",
    learnerTrap_en: "Do not say the clinic 'must always'; B2 should acknowledge urgent priority and propose clear updates.",
    canadaPracticalExample_vi: "Ví dụ Canada: walk-in clinic có thể ưu tiên emergency-like symptoms trước.",
    canadaPracticalExample_en: "Canada-practical example: a walk-in clinic may prioritize emergency-like symptoms first.",
    nativeReview: "deferred",
  },
  {
    id: "pa_b2_bundle_housing_rent",
    level: "B2",
    bundleFocus: "tradeoff",
    topic: "housing",
    prompt_gurmukhi: "ਸਸਤੇ basement suite ਅਤੇ ਮਹਿੰਗੇ apartment ਵਿਚਕਾਰ tradeoff ਸਮਝਾਓ।",
    prompt_romanization: "Saste basement suite ate mahinge apartment vichkaar tradeoff samjhaao.",
    prompt_vi: "Giải thích tradeoff giữa basement suite rẻ và apartment đắt hơn.",
    prompt_en: "Explain the tradeoff between a cheaper basement suite and a more expensive apartment.",
    modelAnswer_gurmukhi:
      "Basement suite rent ਘਟਾਉਂਦਾ ਹੈ, ਪਰ light, laundry ਅਤੇ transit access ਕਈ ਵਾਰ ਕਮਜ਼ੋਰ ਹੁੰਦੇ ਹਨ। Apartment ਮਹਿੰਗਾ ਹੈ, ਪਰ lease clarity ਅਤੇ commute reliability ਬਿਹਤਰ ਹੋ ਸਕਦੇ ਹਨ।",
    modelAnswer_romanization:
      "Basement suite rent ghataaundaa hai, par light, laundry ate transit access kai vaar kamzor hunde han. Apartment mahingaa hai, par lease clarity ate commute reliability bihatar ho sakde han.",
    modelAnswer_vi:
      "Basement suite giảm rent, nhưng light, laundry và transit access có thể yếu. Apartment đắt hơn, nhưng lease clarity và commute reliability có thể tốt hơn.",
    modelAnswer_en:
      "A basement suite lowers rent, but light, laundry, and transit access may be weaker. An apartment costs more, but lease clarity and commute reliability may be better.",
    reasoningLines: [
      {
        move: "tradeoff",
        line_gurmukhi: "ਘੱਟ rent ਨਾਲ ਕੁਝ comfort ਅਤੇ access ਘਟ ਸਕਦੇ ਹਨ।",
        line_romanization: "Ghatt rent naal kujh comfort ate access ghat sakde han.",
        line_vi: "Rent thap hon co the lam giam mot phan comfort va access.",
        line_en: "Lower rent can reduce some comfort and access.",
      },
      {
        move: "evidence",
        line_gurmukhi: "Lease, utilities ਅਤੇ bus stop distance compare ਕਰੋ।",
        line_romanization: "Lease, utilities ate bus stop distance compare karo.",
        line_vi: "Hay compare lease, utilities va khoang cach den bus stop.",
        line_en: "Compare the lease, utilities, and distance to the bus stop.",
      },
      {
        move: "recommendation",
        line_gurmukhi: "Viewing ਤੋਂ ਪਹਿਲਾਂ written costs ਮੰਗੋ।",
        line_romanization: "Viewing ton pahilan written costs mango.",
        line_vi: "Hay hoi written costs truoc khi di viewing.",
        line_en: "Ask for written costs before the viewing.",
      },
    ],
    bundleChecks_vi: [
      "Pre-A11 bundle giữ cả hai lựa chọn.",
      "Receipt check giữ rent, utilities và transit.",
      "Ledger check giữ housing recommendation thực tế.",
    ],
    bundleChecks_en: [
      "Pre-A11 bundle keeps both options.",
      "Receipt check keeps rent, utilities, and transit.",
      "Ledger check keeps the housing recommendation practical.",
    ],
    learnerTrap_vi: "Không chỉ nói 'cheap is good'; B2 cần cost plus quality-of-life tradeoff.",
    learnerTrap_en: "Do not only say 'cheap is good'; B2 needs cost plus quality-of-life tradeoff.",
    canadaPracticalExample_vi: "Ví dụ Canada: hỏi utilities có included trong rent không.",
    canadaPracticalExample_en: "Canada-practical example: ask whether utilities are included in the rent.",
    nativeReview: "deferred",
  },
  {
    id: "pa_b2_bundle_transport_bus_lane",
    level: "B2",
    bundleFocus: "evidence",
    topic: "transport",
    prompt_gurmukhi: "Bus lane proposal ਲਈ evidence-based public comment ਲਿਖੋ।",
    prompt_romanization: "Bus lane proposal lai evidence-based public comment likho.",
    prompt_vi: "Viết public comment dựa trên evidence cho proposal về bus lane.",
    prompt_en: "Write an evidence-based public comment for a bus lane proposal.",
    modelAnswer_gurmukhi:
      "Bus lane ਦਾ support ਤਦ ਮਜ਼ਬੂਤ ਹੈ ਜਦੋਂ data ਦਿਖਾਵੇ ਕਿ buses peak time ਵਿੱਚ ਦੇਰ ਨਾਲ ਆ ਰਹੀਆਂ ਹਨ। ਫਿਰ ਵੀ parking loss ਅਤੇ small business deliveries ਲਈ limited loading windows ਰੱਖਣੇ ਚਾਹੀਦੇ ਹਨ।",
    modelAnswer_romanization:
      "Bus lane daa support tad mazbuut hai jadon data dikhaave ki buses peak time vich der naal aa rahiiaan han. Phir vii parking loss ate small business deliveries lai limited loading windows rakhne chaahiide han.",
    modelAnswer_vi:
      "Support bus lane mạnh hơn khi data cho thấy buses trễ vào peak time. Tuy vậy, cần limited loading windows cho parking loss và small business deliveries.",
    modelAnswer_en:
      "Support for a bus lane is stronger when data shows buses are late at peak times. Still, limited loading windows should address parking loss and small business deliveries.",
    reasoningLines: [
      {
        move: "evidence",
        line_gurmukhi: "Peak-time delay data claim ਨੂੰ support ਕਰਦਾ ਹੈ।",
        line_romanization: "Peak-time delay data claim nu support kardaa hai.",
        line_vi: "Peak-time delay data support claim nay.",
        line_en: "Peak-time delay data supports the claim.",
      },
      {
        move: "counterpoint",
        line_gurmukhi: "Businesses ਲਈ delivery access ਵੀ ਜ਼ਰੂਰੀ ਹੈ।",
        line_romanization: "Businesses lai delivery access vii zaruurii hai.",
        line_vi: "Delivery access cung can thiet cho businesses.",
        line_en: "Delivery access is also necessary for businesses.",
      },
      {
        move: "settlement_step",
        line_gurmukhi: "Loading windows compromise ਨੂੰ practical ਬਣਾਉਂਦੇ ਹਨ।",
        line_romanization: "Loading windows compromise nu practical banaaunde han.",
        line_vi: "Loading windows lam cho compromise thuc te hon.",
        line_en: "Loading windows make the compromise practical.",
      },
    ],
    bundleChecks_vi: [
      "Pre-A11 bundle giữ data claim trước opinion.",
      "Receipt check giữ business counterpoint.",
      "Ledger check giữ settlement step thay vì one-sided support.",
    ],
    bundleChecks_en: [
      "Pre-A11 bundle keeps the data claim before the opinion.",
      "Receipt check keeps the business counterpoint.",
      "Ledger check keeps a settlement step instead of one-sided support.",
    ],
    learnerTrap_vi: "Learner thường viết opinion trước rồi mới thêm data; B2 nên đưa evidence làm nền cho claim.",
    learnerTrap_en: "Learners often write the opinion first and add data later; B2 should make evidence the basis for the claim.",
    canadaPracticalExample_vi: "Ví dụ Canada: city consultation có thể hỏi feedback về transit priority lanes.",
    canadaPracticalExample_en: "Canada-practical example: a city consultation may ask for feedback on transit priority lanes.",
    nativeReview: "deferred",
  },
  {
    id: "pa_b2_bundle_public_service_form",
    level: "B2",
    bundleFocus: "settlement",
    topic: "public_service",
    prompt_gurmukhi: "Public-service form reject ਹੋਣ ਤੇ fair settlement ਸੁਝਾਓ।",
    prompt_romanization: "Public-service form reject hon te fair settlement sujhaao.",
    prompt_vi: "Đề xuất settlement công bằng khi public-service form bị reject.",
    prompt_en: "Suggest a fair settlement when a public-service form is rejected.",
    modelAnswer_gurmukhi:
      "ਜੇ form missing document ਕਰਕੇ reject ਹੋਇਆ ਹੈ, applicant ਨੂੰ clear checklist ਅਤੇ resubmission deadline ਮਿਲਣੀ ਚਾਹੀਦੀ ਹੈ। Office policy ਰਹਿ ਸਕਦੀ ਹੈ, ਪਰ communication ਹੋਰ ਸਾਫ਼ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।",
    modelAnswer_romanization:
      "Je form missing document karke reject hoiaa hai, applicant nu clear checklist ate resubmission deadline milnii chaahiidii hai. Office policy rahi sakdii hai, par communication hor saaf honaa chaahiidaa hai.",
    modelAnswer_vi:
      "Nếu form bị reject vì missing document, applicant nên nhận checklist rõ và deadline nộp lại. Policy vẫn giữ, nhưng communication cần rõ hơn.",
    modelAnswer_en:
      "If a form was rejected for a missing document, the applicant should receive a clear checklist and resubmission deadline. The office policy can remain, but communication should be clearer.",
    reasoningLines: [
      {
        move: "counterpoint",
        line_gurmukhi: "Office ਦੀ document policy valid ਹੋ ਸਕਦੀ ਹੈ।",
        line_romanization: "Office di document policy valid ho sakdii hai.",
        line_vi: "Document policy cua office co the hop le.",
        line_en: "The office document policy may be valid.",
      },
      {
        move: "settlement_step",
        line_gurmukhi: "Checklist ਅਤੇ deadline applicant ਨੂੰ fair chance ਦਿੰਦੇ ਹਨ।",
        line_romanization: "Checklist ate deadline applicant nu fair chance dinde han.",
        line_vi: "Checklist va deadline cho applicant mot fair chance.",
        line_en: "A checklist and deadline give the applicant a fair chance.",
      },
      {
        move: "recommendation",
        line_gurmukhi: "Reject notice ਵਿੱਚ missing item bold ਕਰਨਾ ਚਾਹੀਦਾ ਹੈ।",
        line_romanization: "Reject notice vich missing item bold karnaa chaahiidaa hai.",
        line_vi: "Reject notice nen in dam missing item.",
        line_en: "The rejection notice should bold the missing item.",
      },
    ],
    bundleChecks_vi: [
      "Pre-A11 bundle giữ public-service discussion không thành legal claim.",
      "Receipt check giữ checklist, deadline và respectful tone.",
      "Ledger check giữ settlement cụ thể trước pre-integration.",
    ],
    bundleChecks_en: [
      "Pre-A11 bundle keeps public-service discussion from becoming a legal claim.",
      "Receipt check keeps checklist, deadline, and respectful tone.",
      "Ledger check keeps the concrete settlement before pre-integration.",
    ],
    learnerTrap_vi: "Không viết như đòi quyền tuyệt đối; B2 cần fair process và clear next step.",
    learnerTrap_en: "Do not write as if demanding an absolute right; B2 needs fair process and a clear next step.",
    canadaPracticalExample_vi: "Ví dụ Canada: service counter có thể yêu cầu proof of address hoặc ID.",
    canadaPracticalExample_en: "Canada-practical example: a service counter may ask for proof of address or ID.",
    scriptAwareness_en: "Shahmukhi awareness only; no Shahmukhi course content is included here.",
    nativeReview: "deferred",
  },
];

export const punjabiB2BundleSamplesAlias = punjabiB2BundleSamples;

export default punjabiB2BundleSamplesAlias;
