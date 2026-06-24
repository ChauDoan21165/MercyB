// Punjabi A1 guided practice for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is practical learner support. Native review is deferred.

export type PunjabiGuidedPracticeType =
  | "choose_phrase"
  | "fill_gap"
  | "reorder_sentence"
  | "match_gurmukhi"
  | "polite_request"
  | "canada_service_task";

export type PunjabiGuidedPracticeTopic =
  | "greetings"
  | "identity"
  | "needs"
  | "price"
  | "location"
  | "time"
  | "help"
  | "politeness"
  | "canada_services";

export type PunjabiGuidedPracticeItem = {
  id: string;
  type: PunjabiGuidedPracticeType;
  topic: PunjabiGuidedPracticeTopic;
  level: "A1";
  prompt_vi: string;
  prompt_en: string;
  prompt_pa?: string;
  romanization?: string;
  options?: string[];
  answer: string | string[];
  explanation_vi: string;
  explanation_en: string;
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
};

export const guidedPracticeScriptAwareness =
  "Gurmukhi is primary for Punjabi A1 guided practice. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1GuidedPractice: PunjabiGuidedPracticeItem[] = [
  {
    id: "pa_a1_guided_choose_001",
    type: "choose_phrase",
    topic: "greetings",
    level: "A1",
    prompt_vi: "Chọn câu chào lịch sự.",
    prompt_en: "Choose the respectful greeting.",
    options: ["ਸਤ ਸ੍ਰੀ ਅਕਾਲ।", "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।"],
    answer: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।",
    explanation_vi: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ là lời chào lịch sự phổ biến.",
    explanation_en: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ is a common respectful greeting.",
    learner_trap: { audience: "vi", vi: "Không thêm nguyên âm sau ਸਤ.", en: "Vietnamese speakers should not add a vowel after final ਤ." },
  },
  {
    id: "pa_a1_guided_choose_002",
    type: "choose_phrase",
    topic: "help",
    level: "A1",
    prompt_vi: "Bạn cần giúp đỡ ở quầy dịch vụ. Chọn câu phù hợp.",
    prompt_en: "You need help at a service counter. Choose the right phrase.",
    options: ["ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", "ਫਿਰ ਮਿਲਾਂਗੇ।", "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।"],
    answer: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
    explanation_vi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ nghĩa là 'Tôi cần giúp đỡ'.",
    explanation_en: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ means 'I need help'.",
    canada_practical: true,
  },
  {
    id: "pa_a1_guided_choose_003",
    type: "choose_phrase",
    topic: "price",
    level: "A1",
    prompt_vi: "Chọn câu hỏi giá.",
    prompt_en: "Choose the price question.",
    options: ["ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", "ਕਲਿਨਿਕ ਕਿੱਥੇ ਹੈ?", "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?"],
    answer: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?",
    explanation_vi: "ਕਿੰਨੇ ਦਾ ਹੈ? hỏi 'bao nhiêu tiền?'.",
    explanation_en: "ਕਿੰਨੇ ਦਾ ਹੈ? asks 'how much is it?'.",
    learner_trap: { audience: "both", vi: "ਕਿੰਨੇ cũng xuất hiện trong hỏi giờ; ਦਾ cho biết đây là giá.", en: "ਕਿੰਨੇ also appears in time questions; ਦਾ signals price here." },
  },
  {
    id: "pa_a1_guided_fill_001",
    type: "fill_gap",
    topic: "identity",
    level: "A1",
    prompt_vi: "Điền từ còn thiếu: Tên tôi là Lan.",
    prompt_en: "Fill the missing word: My name is Lan.",
    prompt_pa: "ਮੇਰਾ ___ ਲਾਨ ਹੈ।",
    romanization: "mera ___ Lan hai",
    answer: "ਨਾਮ",
    explanation_vi: "ਮੇਰਾ ਨਾਮ ... ਹੈ là mẫu giới thiệu tên.",
    explanation_en: "ਮੇਰਾ ਨਾਮ ... ਹੈ is the name-introduction frame.",
    learner_trap: { audience: "vi", vi: "Đừng bỏ ਹੈ ở cuối.", en: "Vietnamese speakers may drop ਹੈ; keep it." },
  },
  {
    id: "pa_a1_guided_fill_002",
    type: "fill_gap",
    topic: "needs",
    level: "A1",
    prompt_vi: "Điền 'nước'.",
    prompt_en: "Fill in 'water'.",
    prompt_pa: "ਮੈਨੂੰ ___ ਚਾਹੀਦਾ ਹੈ।",
    romanization: "mainu ___ chahida hai",
    answer: "ਪਾਣੀ",
    explanation_vi: "ਪਾਣੀ nghĩa là nước.",
    explanation_en: "ਪਾਣੀ means water.",
  },
  {
    id: "pa_a1_guided_fill_003",
    type: "fill_gap",
    topic: "politeness",
    level: "A1",
    prompt_vi: "Thêm dấu lịch sự vào câu.",
    prompt_en: "Add the respect marker to the sentence.",
    prompt_pa: "ਧੰਨਵਾਦ ___।",
    romanization: "dhanvad ___",
    answer: "ਜੀ",
    explanation_vi: "ਜੀ làm lời cảm ơn lịch sự hơn.",
    explanation_en: "ਜੀ makes the thanks more respectful.",
    learner_trap: { audience: "vi", vi: "ਜੀ không phải lúc nào cũng thay thế 'ạ' 1-1.", en: "ਜੀ is not always a one-to-one equivalent of Vietnamese 'ạ'." },
  },
  {
    id: "pa_a1_guided_reorder_001",
    type: "reorder_sentence",
    topic: "location",
    level: "A1",
    prompt_vi: "Sắp xếp thành 'Nhà ga ở đâu?'",
    prompt_en: "Reorder into 'Where is the station?'",
    options: ["ਸਟੇਸ਼ਨ", "ਕਿੱਥੇ", "ਹੈ"],
    answer: "ਸਟੇਸ਼ਨ ਕਿੱਥੇ ਹੈ?",
    explanation_vi: "Trong mẫu vị trí, ਕਿੱਥੇ đứng trước ਹੈ.",
    explanation_en: "In this location question, ਕਿੱਥੇ comes before ਹੈ.",
    learner_trap: { audience: "en", vi: "Không đảo như tiếng Anh 'where is'.", en: "Do not invert like English 'where is'." },
  },
  {
    id: "pa_a1_guided_reorder_002",
    type: "reorder_sentence",
    topic: "needs",
    level: "A1",
    prompt_vi: "Sắp xếp thành 'Tôi cần mẫu đơn.'",
    prompt_en: "Reorder into 'I need a form.'",
    options: ["ਮੈਨੂੰ", "ਫਾਰਮ", "ਚਾਹੀਦਾ ਹੈ"],
    answer: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।",
    explanation_vi: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ là khung nói nhu cầu.",
    explanation_en: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ is the need frame.",
    canada_practical: true,
  },
  {
    id: "pa_a1_guided_reorder_003",
    type: "reorder_sentence",
    topic: "time",
    level: "A1",
    prompt_vi: "Sắp xếp thành 'Bây giờ mấy giờ?'",
    prompt_en: "Reorder into 'What time is it now?'",
    options: ["ਹੁਣ", "ਕਿੰਨੇ ਵਜੇ", "ਹਨ"],
    answer: "ਹੁਣ ਕਿੰਨੇ ਵਜੇ ਹਨ?",
    explanation_vi: "ਕਿੰਨੇ ਵਜੇ là cụm hỏi giờ.",
    explanation_en: "ਕਿੰਨੇ ਵਜੇ is the time-question phrase.",
  },
  {
    id: "pa_a1_guided_match_001",
    type: "match_gurmukhi",
    topic: "greetings",
    level: "A1",
    prompt_vi: "Nối Gurmukhi với nghĩa.",
    prompt_en: "Match Gurmukhi to meaning.",
    options: ["ਸਤ ਸ੍ਰੀ ਅਕਾਲ = Xin chào / Hello", "ਧੰਨਵਾਦ = Cảm ơn / Thank you", "ਮਾਫ਼ ਕਰਨਾ = Xin lỗi / Sorry"],
    answer: ["ਸਤ ਸ੍ਰੀ ਅਕਾਲ = Xin chào / Hello", "ਧੰਨਵਾਦ = Cảm ơn / Thank you", "ਮਾਫ਼ ਕਰਨਾ = Xin lỗi / Sorry"],
    explanation_vi: "Ba cụm này là chức năng giao tiếp A1 cốt lõi.",
    explanation_en: "These three phrases are core A1 communication functions.",
  },
  {
    id: "pa_a1_guided_match_002",
    type: "match_gurmukhi",
    topic: "location",
    level: "A1",
    prompt_vi: "Nối câu hỏi địa điểm với nghĩa.",
    prompt_en: "Match the location questions to meanings.",
    options: ["ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ? = Bến xe ở đâu? / Where is the bus stand?", "ਕਲਿਨਿਕ ਕਿੱਥੇ ਹੈ? = Phòng khám ở đâu? / Where is the clinic?", "ਵਾਸ਼ਰੂਮ ਕਿੱਥੇ ਹੈ? = Nhà vệ sinh ở đâu? / Where is the washroom?"],
    answer: ["ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ? = Bến xe ở đâu? / Where is the bus stand?", "ਕਲਿਨਿਕ ਕਿੱਥੇ ਹੈ? = Phòng khám ở đâu? / Where is the clinic?", "ਵਾਸ਼ਰੂਮ ਕਿੱਥੇ ਹੈ? = Nhà vệ sinh ở đâu? / Where is the washroom?"],
    explanation_vi: "ਕਿੱਥੇ ਹੈ? là đuôi hỏi địa điểm rất hữu ích.",
    explanation_en: "ਕਿੱਥੇ ਹੈ? is a very useful location-question ending.",
    canada_practical: true,
  },
  {
    id: "pa_a1_guided_match_003",
    type: "match_gurmukhi",
    topic: "needs",
    level: "A1",
    prompt_vi: "Nối nhu cầu với nghĩa.",
    prompt_en: "Match the needs to meanings.",
    options: ["ਪਾਣੀ = nước / water", "ਟਿਕਟ = vé / ticket", "ਫਾਰਮ = mẫu đơn / form"],
    answer: ["ਪਾਣੀ = nước / water", "ਟਿਕਟ = vé / ticket", "ਫਾਰਮ = mẫu đơn / form"],
    explanation_vi: "Đây là từ cần thiết trong tình huống dịch vụ cơ bản.",
    explanation_en: "These are necessary words in basic service situations.",
    canada_practical: true,
  },
  {
    id: "pa_a1_guided_polite_001",
    type: "polite_request",
    topic: "politeness",
    level: "A1",
    prompt_vi: "Biến 'giúp' thành lời nhờ lịch sự.",
    prompt_en: "Turn 'help' into a polite request.",
    prompt_pa: "ਮਦਦ ਕਰੋ",
    romanization: "madad karo",
    options: ["ਮਦਦ ਕਰੋ ਜੀ।", "ਮਦਦ ਨਹੀਂ ਹੈ।", "ਮੈਂ ਮਦਦ ਹਾਂ।"],
    answer: "ਮਦਦ ਕਰੋ ਜੀ।",
    explanation_vi: "Thêm ਜੀ làm mệnh lệnh mềm hơn.",
    explanation_en: "Adding ਜੀ softens the command.",
    learner_trap: { audience: "en", vi: "Tránh mệnh lệnh cụt với người lạ.", en: "Avoid bare commands with strangers." },
  },
  {
    id: "pa_a1_guided_polite_002",
    type: "polite_request",
    topic: "politeness",
    level: "A1",
    prompt_vi: "Chọn lời nhờ 'Làm ơn nói chậm.'",
    prompt_en: "Choose 'Please speak slowly.'",
    options: ["ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", "ਫਿਰ ਮਿਲਾਂਗੇ।", "ਇਹ ਸਸਤਾ ਹੈ।"],
    answer: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।",
    explanation_vi: "ਕਿਰਪਾ ਕਰਕੇ nghĩa là làm ơn; ਹੌਲੀ ਬੋਲੋ là nói chậm.",
    explanation_en: "ਕਿਰਪਾ ਕਰਕੇ means please; ਹੌਲੀ ਬੋਲੋ means speak slowly.",
  },
  {
    id: "pa_a1_guided_polite_003",
    type: "polite_request",
    topic: "help",
    level: "A1",
    prompt_vi: "Bạn cần người khác nói lại. Chọn câu lịch sự.",
    prompt_en: "You need someone to repeat. Choose the polite phrase.",
    options: ["ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਕਹੋ।", "ਇਹ ਮੇਰਾ ਭਰਾ ਹੈ।", "ਹੁਣ ਦੋ ਵਜੇ ਹਨ।"],
    answer: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਕਹੋ।",
    explanation_vi: "ਫਿਰ ਕਹੋ nghĩa là nói lại.",
    explanation_en: "ਫਿਰ ਕਹੋ means say it again.",
  },
  {
    id: "pa_a1_guided_canada_001",
    type: "canada_service_task",
    topic: "canada_services",
    level: "A1",
    prompt_vi: "Ở phòng khám Canada, hỏi lịch hẹn lúc mấy giờ.",
    prompt_en: "At a Canadian clinic, ask what time your appointment is.",
    answer: "ਮੇਰਾ ਅਪਾਇੰਟਮੈਂਟ ਕਿੰਨੇ ਵਜੇ ਹੈ?",
    explanation_vi: "ਅਪਾਇੰਟਮੈਂਟ và ਕਿੰਨੇ ਵਜੇ giúp hỏi giờ hẹn.",
    explanation_en: "ਅਪਾਇੰਟਮੈਂਟ and ਕਿੰਨੇ ਵਜੇ help ask appointment time.",
    canada_practical: true,
  },
  {
    id: "pa_a1_guided_canada_002",
    type: "canada_service_task",
    topic: "canada_services",
    level: "A1",
    prompt_vi: "Ở văn phòng dịch vụ, hỏi có cần giấy tờ tùy thân không.",
    prompt_en: "At a service office, ask whether you need ID.",
    answer: "ਕੀ ਮੈਨੂੰ ਪਛਾਣ ਪੱਤਰ ਚਾਹੀਦਾ ਹੈ?",
    explanation_vi: "ਕੀ mở câu hỏi yes/no; ਪਛਾਣ ਪੱਤਰ là giấy tờ tùy thân.",
    explanation_en: "ਕੀ opens a yes/no question; ਪਛਾਣ ਪੱਤਰ means ID document.",
    learner_trap: { audience: "en", vi: "Không thêm do/does khi đã dùng ਕੀ.", en: "Do not add do/does when using ਕੀ." },
    canada_practical: true,
  },
  {
    id: "pa_a1_guided_canada_003",
    type: "canada_service_task",
    topic: "canada_services",
    level: "A1",
    prompt_vi: "Ở máy bán vé, nói 'Cái này không hoạt động.'",
    prompt_en: "At a ticket machine, say 'This is not working.'",
    answer: "ਇਹ ਕੰਮ ਨਹੀਂ ਕਰ ਰਿਹਾ।",
    explanation_vi: "Câu này hữu ích khi máy, thẻ hoặc điện thoại gặp vấn đề.",
    explanation_en: "This is useful when a machine, card, or phone has a problem.",
    canada_practical: true,
  },
];

export default punjabiA1GuidedPractice;
