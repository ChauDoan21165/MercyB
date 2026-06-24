// src/languages/punjabi/skillDependencyGraph.ts
//
// App-consumable Punjabi skill dependency graph. Gurmukhi is primary;
// romanization is a support layer. Native review is deferred.

export type PunjabiSkillNodeKind =
  | "script"
  | "vocabulary"
  | "grammar"
  | "register"
  | "survival"
  | "workplace"
  | "healthcare"
  | "public_service"
  | "remediation";

export type PunjabiSkillNode = {
  id: string;
  kind: PunjabiSkillNodeKind;
  title_pa: string;
  romanization: string;
  title_vi: string;
  title_en: string;
  learner_value_vi: string;
  learner_value_en: string;
  example: {
    gurmukhi: string;
    romanization: string;
    vi: string;
    en: string;
  };
  common_trap_vi?: string;
  common_trap_en?: string;
  canada_practical?: boolean;
};

export type PunjabiSkillEdge = {
  from: string;
  to: string;
  relation:
    | "unlocks"
    | "supports"
    | "requires"
    | "remediates"
    | "prepares_for";
  reason_vi: string;
  reason_en: string;
};

export type PunjabiRemediationPath = {
  id: string;
  trigger_vi: string;
  trigger_en: string;
  steps: string[];
  outcome_vi: string;
  outcome_en: string;
};

export const PUNJABI_SKILL_GRAPH_SCOPE = {
  script_note_vi:
    "Đồ thị kỹ năng dùng Gurmukhi làm chữ chính. Shahmukhi chỉ được nhắc để nhận biết, không phải khóa Shahmukhi đầy đủ.",
  script_note_en:
    "This skill graph uses Gurmukhi as the primary script. Shahmukhi is awareness-only, not a full Shahmukhi course.",
  native_review_vi: "Native review được hoãn; không tuyên bố đã có kiểm duyệt bản ngữ.",
  native_review_en: "Native review is deferred; completed native review is not claimed.",
  audio_vi: "Không có audio, ghi âm, chấm điểm phát âm, Azure, auth, billing, RLS, Supabase, hoặc CI trong Wave 7.",
  audio_en: "Wave 7 includes no audio, recording, pronunciation scoring, Azure, auth, billing, RLS, Supabase, or CI work.",
};

export const PUNJABI_SKILL_NODES: PunjabiSkillNode[] = [
  {
    id: "gurmukhi-recognition",
    kind: "script",
    title_pa: "ਗੁਰਮੁਖੀ ਪਛਾਣ",
    romanization: "Gurmukhi pachhan",
    title_vi: "Nhận diện Gurmukhi",
    title_en: "Gurmukhi recognition",
    learner_value_vi: "Mở khóa việc đọc Punjabi trực tiếp thay vì phụ thuộc romanization.",
    learner_value_en: "Unlocks direct Punjabi reading instead of romanization dependence.",
    example: { gurmukhi: "ਪੰਜਾਬੀ", romanization: "Punjabi", vi: "tiếng Punjabi", en: "Punjabi" },
    common_trap_vi: "Nhìn romanization trước làm chậm khả năng nhận diện chữ.",
    common_trap_en: "Looking at romanization first slows script recognition.",
  },
  {
    id: "basic-politeness",
    kind: "register",
    title_pa: "ਜੀ ਅਤੇ ਨਮਰਤਾ",
    romanization: "ji ate namrata",
    title_vi: "ਜੀ và lịch sự",
    title_en: "ji and politeness",
    learner_value_vi: "Giúp câu chào, yêu cầu, dịch vụ công và nơi làm việc nghe lịch sự hơn.",
    learner_value_en: "Makes greetings, requests, public-service, and workplace language more polite.",
    example: { gurmukhi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
    common_trap_vi: "Bỏ ਜੀ trong tình huống trang trọng có thể nghe cụt.",
    common_trap_en: "Dropping ji in formal situations can sound abrupt.",
  },
  {
    id: "need-pattern",
    kind: "grammar",
    title_pa: "ਮੈਨੂੰ ਚਾਹੀਦਾ ਹੈ",
    romanization: "mainu chahida hai",
    title_vi: "Mẫu 'tôi cần'",
    title_en: "I need pattern",
    learner_value_vi: "Cần cho nước, mẫu đơn, lịch hẹn, giúp đỡ và dịch vụ hằng ngày.",
    learner_value_en: "Needed for water, forms, appointments, help, and daily services.",
    example: { gurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai", vi: "Tôi cần nước.", en: "I need water." },
    common_trap_vi: "ਮੈਨੂੰ không giống ਮੈਂ; đừng dùng sai trong mẫu cần đồ.",
    common_trap_en: "Mainu is not main; do not swap them in need patterns.",
  },
  {
    id: "price-and-number-vocab",
    kind: "vocabulary",
    title_pa: "ਕੀਮਤ ਅਤੇ ਨੰਬਰ",
    romanization: "kimat ate number",
    title_vi: "Giá tiền và số",
    title_en: "Prices and numbers",
    learner_value_vi: "Hỗ trợ mua sắm, số điện thoại, địa chỉ và lịch hẹn.",
    learner_value_en: "Supports shopping, phone numbers, addresses, and appointment times.",
    example: { gurmukhi: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "ih kinne da hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?" },
    canada_practical: true,
  },
  {
    id: "yes-no-questions",
    kind: "grammar",
    title_pa: "ਕੀ ਨਾਲ ਪ੍ਰਸ਼ਨ",
    romanization: "ki nal prashan",
    title_vi: "Câu hỏi với ਕੀ",
    title_en: "Questions with ki",
    learner_value_vi: "Mở khóa câu hỏi có/không trong ăn uống, lịch hẹn, công việc.",
    learner_value_en: "Unlocks yes/no questions for food, appointments, and work.",
    example: { gurmukhi: "ਕੀ ਅੱਜ ਸਮਾਂ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki ajj sama mil sakda hai?", vi: "Hôm nay có lịch được không?", en: "Can I get a time today?" },
    common_trap_vi: "ਕੀ đầu câu không phải lúc nào cũng là 'gì'.",
    common_trap_en: "Sentence-initial ki is not always 'what'.",
  },
  {
    id: "survival-shopping",
    kind: "survival",
    title_pa: "ਖਰੀਦਦਾਰੀ",
    romanization: "khariddari",
    title_vi: "Mua sắm sinh tồn",
    title_en: "Survival shopping",
    learner_value_vi: "Dùng giá tiền, số lượng, túi, kích cỡ trong tình huống thực tế.",
    learner_value_en: "Uses prices, quantities, bags, and sizes in practical situations.",
    example: { gurmukhi: "ਕੀ ਮੈਨੂੰ ਇੱਕ ਥੈਲਾ ਮਿਲ ਸਕਦਾ ਹੈ?", romanization: "ki mainu ikk thaila mil sakda hai?", vi: "Cho tôi một cái túi được không?", en: "Can I get a bag?" },
    canada_practical: true,
  },
  {
    id: "address-and-contact",
    kind: "vocabulary",
    title_pa: "ਪਤਾ ਅਤੇ ਸੰਪਰਕ",
    romanization: "pata ate sampark",
    title_vi: "Địa chỉ và liên hệ",
    title_en: "Address and contact",
    learner_value_vi: "Cần cho định cư Canada, trường học, phòng khám và dịch vụ công.",
    learner_value_en: "Needed for Canada settlement, school, clinics, and public services.",
    example: { gurmukhi: "ਇਹ ਮੇਰਾ ਫੋਨ ਨੰਬਰ ਹੈ।", romanization: "ih mera phone number hai", vi: "Đây là số điện thoại của tôi.", en: "This is my phone number." },
    common_trap_vi: "ਪਤਾ là địa chỉ, không phải ਪਿਤਾ 'bố'.",
    common_trap_en: "Pata means address, not pita 'father'.",
    canada_practical: true,
  },
  {
    id: "healthcare-symptoms",
    kind: "healthcare",
    title_pa: "ਲੱਛਣ",
    romanization: "lachhan",
    title_vi: "Triệu chứng",
    title_en: "Symptoms",
    learner_value_vi: "Liên kết từ cơ thể, thời lượng, thuốc và lịch hẹn khám.",
    learner_value_en: "Links body words, duration, medicine, and clinic appointments.",
    example: { gurmukhi: "ਮੈਨੂੰ ਦੋ ਦਿਨ ਤੋਂ ਬੁਖਾਰ ਹੈ।", romanization: "mainu do din ton bukhar hai", vi: "Tôi bị sốt hai ngày rồi.", en: "I have had a fever for two days." },
    common_trap_vi: "Trong y tế, romanization không thay thế tên thuốc bằng chữ viết.",
    common_trap_en: "In healthcare, romanization does not replace written medicine names.",
    canada_practical: true,
  },
  {
    id: "workplace-schedule",
    kind: "workplace",
    title_pa: "ਕੰਮ ਦਾ ਸਮਾਂ",
    romanization: "kamm da sama",
    title_vi: "Lịch làm việc",
    title_en: "Work schedule",
    learner_value_vi: "Dùng thời gian, lịch sự, câu hỏi và từ công việc trong nơi làm việc Canada.",
    learner_value_en: "Uses time, politeness, questions, and work vocabulary in Canadian workplaces.",
    example: { gurmukhi: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਿੰਨੇ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", romanization: "meri shift kinne vaje shuru hundi hai", vi: "Ca của tôi bắt đầu lúc mấy giờ?", en: "What time does my shift start?" },
    common_trap_vi: "ਕੱਲ੍ਹ có thể là hôm qua hoặc ngày mai; xác nhận ngày cụ thể.",
    common_trap_en: "Kall can mean yesterday or tomorrow; confirm the date.",
    canada_practical: true,
  },
  {
    id: "public-documents",
    kind: "public_service",
    title_pa: "ਦਸਤਾਵੇਜ਼",
    romanization: "dastavez",
    title_vi: "Giấy tờ dịch vụ công",
    title_en: "Public-service documents",
    learner_value_vi: "Kết nối câu hỏi, lịch sự, địa chỉ và từ giấy tờ trong cơ quan công quyền.",
    learner_value_en: "Connects questions, politeness, address, and document vocabulary in public offices.",
    example: { gurmukhi: "ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਲੋੜੀਂਦੇ ਹਨ?", romanization: "kihre dastavez lorinde han", vi: "Cần những giấy tờ nào?", en: "Which documents are required?" },
    common_trap_vi: "ਕਿਹੜੇ hợp với danh sách nhiều giấy tờ.",
    common_trap_en: "Kihre fits a list of several documents.",
    canada_practical: true,
  },
  {
    id: "formal-clarification",
    kind: "register",
    title_pa: "ਰਸਮੀ ਸਪਸ਼ਟੀਕਰਨ",
    romanization: "rasmi spashtikaran",
    title_vi: "Làm rõ trang trọng",
    title_en: "Formal clarification",
    learner_value_vi: "Cần cho họp, quyết định, dịch vụ công và bất đồng lịch sự.",
    learner_value_en: "Needed for meetings, decisions, public services, and polite disagreement.",
    example: { gurmukhi: "ਕੀ ਤੁਸੀਂ ਫੈਸਲੇ ਦਾ ਕਾਰਨ ਸਮਝਾ ਸਕਦੇ ਹੋ?", romanization: "ki tusi faisle da karan samjha sakde ho?", vi: "Bạn có thể giải thích lý do của quyết định không?", en: "Can you explain the reason for the decision?" },
    common_trap_vi: "Yêu cầu trực tiếp quá ngắn có thể nghe gắt; dùng ਕਿਰਪਾ ਕਰਕੇ hoặc ਸਕਦੇ ਹੋ.",
    common_trap_en: "A very short direct request can sound sharp; use kirpa karke or sakde ho.",
    canada_practical: true,
  },
  {
    id: "remediate-romanization-dependence",
    kind: "remediation",
    title_pa: "ਲਿਪੀ ਦੁਹਰਾਈ",
    romanization: "lipi duhrai",
    title_vi: "Sửa phụ thuộc romanization",
    title_en: "Repair romanization dependence",
    learner_value_vi: "Quay lại Gurmukhi khi người học đọc được romanization nhưng không nhận ra chữ.",
    learner_value_en: "Returns to Gurmukhi when learners can read romanization but not the script.",
    example: { gurmukhi: "ਗੁਰਮੁਖੀ", romanization: "Gurmukhi", vi: "chữ Gurmukhi", en: "Gurmukhi script" },
    common_trap_vi: "Không thêm nội dung mới khi chữ nền tảng còn yếu.",
    common_trap_en: "Do not add new content while core script recognition is weak.",
  },
  {
    id: "remediate-politeness-gap",
    kind: "remediation",
    title_pa: "ਨਮਰਤਾ ਦੁਹਰਾਈ",
    romanization: "namrata duhrai",
    title_vi: "Sửa thiếu lịch sự",
    title_en: "Repair politeness gaps",
    learner_value_vi: "Ôn register khi câu đúng nghĩa nhưng nghe thiếu lịch sự.",
    learner_value_en: "Reviews register when sentences are meaningful but sound impolite.",
    example: { gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ", romanization: "kirpa karke", vi: "làm ơn", en: "please" },
    common_trap_vi: "Đừng chỉ sửa từ vựng; nhiều lỗi là register.",
    common_trap_en: "Do not only fix vocabulary; many errors are register errors.",
  },
];

export const PUNJABI_SKILL_EDGES: PunjabiSkillEdge[] = [
  {
    from: "gurmukhi-recognition",
    to: "basic-politeness",
    relation: "supports",
    reason_vi: "Đọc được ਜੀ trong chữ thật giúp nhận ra mức lịch sự.",
    reason_en: "Reading ji in real script helps learners notice politeness.",
  },
  {
    from: "gurmukhi-recognition",
    to: "price-and-number-vocab",
    relation: "unlocks",
    reason_vi: "Số, tiền, địa chỉ cần đọc Gurmukhi để dùng ngoài lớp.",
    reason_en: "Numbers, money, and address items need Gurmukhi for use outside class.",
  },
  {
    from: "need-pattern",
    to: "survival-shopping",
    relation: "unlocks",
    reason_vi: "Mẫu ਮੈਨੂੰ...ਚਾਹੀਦਾ ਹੈ dùng để xin đồ, túi, nước, mẫu đơn.",
    reason_en: "The mainu...chahida hai pattern asks for items, bags, water, and forms.",
  },
  {
    from: "yes-no-questions",
    to: "healthcare-symptoms",
    relation: "supports",
    reason_vi: "Câu hỏi có/không giúp đặt lịch và xác nhận triệu chứng.",
    reason_en: "Yes/no questions help book appointments and confirm symptoms.",
  },
  {
    from: "address-and-contact",
    to: "public-documents",
    relation: "prepares_for",
    reason_vi: "Dịch vụ công thường cần địa chỉ, số điện thoại, người liên hệ.",
    reason_en: "Public services often require address, phone number, and contact person.",
  },
  {
    from: "price-and-number-vocab",
    to: "workplace-schedule",
    relation: "supports",
    reason_vi: "Giờ làm và ca làm cần số và thời gian.",
    reason_en: "Work hours and shifts require numbers and time.",
  },
  {
    from: "basic-politeness",
    to: "formal-clarification",
    relation: "requires",
    reason_vi: "Yêu cầu làm rõ trong họp hoặc dịch vụ công cần nền lịch sự.",
    reason_en: "Clarification in meetings or public services requires a politeness base.",
  },
  {
    from: "public-documents",
    to: "formal-clarification",
    relation: "supports",
    reason_vi: "Khi giấy tờ thiếu, người học cần hỏi lý do quyết định.",
    reason_en: "When documents are incomplete, learners need to ask for decision reasons.",
  },
  {
    from: "remediate-romanization-dependence",
    to: "gurmukhi-recognition",
    relation: "remediates",
    reason_vi: "Đường sửa lỗi đưa người học về nhận diện chữ.",
    reason_en: "The remediation path returns learners to script recognition.",
  },
  {
    from: "remediate-politeness-gap",
    to: "basic-politeness",
    relation: "remediates",
    reason_vi: "Ôn lại ਜੀ và ਕਿਰਪਾ ਕਰਕੇ trước khi làm nhiệm vụ trang trọng.",
    reason_en: "Review ji and kirpa karke before formal tasks.",
  },
];

export const PUNJABI_REMEDIATION_PATHS: PunjabiRemediationPath[] = [
  {
    id: "script-first-repair",
    trigger_vi: "Người học đọc romanization được nhưng không nhận ra Gurmukhi.",
    trigger_en: "Learner can read romanization but does not recognize Gurmukhi.",
    steps: ["remediate-romanization-dependence", "gurmukhi-recognition", "price-and-number-vocab"],
    outcome_vi: "Quay lại đọc chữ trước nghĩa, rồi mới mở rộng số và giá.",
    outcome_en: "Return to script-before-meaning, then expand into numbers and prices.",
  },
  {
    id: "polite-service-repair",
    trigger_vi: "Câu đúng nghĩa nhưng quá trực tiếp trong công việc hoặc dịch vụ công.",
    trigger_en: "Sentence is meaningful but too direct in work or public-service contexts.",
    steps: ["remediate-politeness-gap", "basic-politeness", "formal-clarification"],
    outcome_vi: "Người học thêm register lịch sự trước khi yêu cầu giải thích.",
    outcome_en: "Learner adds polite register before asking for clarification.",
  },
  {
    id: "canada-readiness-bridge",
    trigger_vi: "Người học biết câu lẻ nhưng chưa kết nối định cư, y tế, công việc, giấy tờ.",
    trigger_en: "Learner knows isolated sentences but has not connected settlement, health, work, and documents.",
    steps: ["address-and-contact", "healthcare-symptoms", "workplace-schedule", "public-documents"],
    outcome_vi: "Tạo cầu nối thực dụng cho bối cảnh Canada mà không thêm audio hay chấm phát âm.",
    outcome_en: "Builds a practical Canada bridge without adding audio or pronunciation scoring.",
  },
];

export const PUNJABI_SKILL_DEPENDENCY_GRAPH = {
  code: "pa",
  name_pa: "ਪੰਜਾਬੀ",
  primary_script: "Gurmukhi",
  scope: PUNJABI_SKILL_GRAPH_SCOPE,
  nodes: PUNJABI_SKILL_NODES,
  edges: PUNJABI_SKILL_EDGES,
  remediation_paths: PUNJABI_REMEDIATION_PATHS,
} as const;

export default PUNJABI_SKILL_DEPENDENCY_GRAPH;
