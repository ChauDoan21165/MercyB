// Punjabi A1 micro-lessons for Vietnamese-speaking and English-speaking learners.
// Gurmukhi is primary; romanization is practical support. Native review is deferred.

export type PunjabiMicroLessonTopic =
  | "greetings"
  | "identity"
  | "family"
  | "numbers"
  | "food"
  | "directions"
  | "time"
  | "polite_requests"
  | "canada_survival";

export type PunjabiMicroLesson = {
  id: string;
  topic: PunjabiMicroLessonTopic;
  title_vi: string;
  title_en: string;
  goal_vi: string;
  goal_en: string;
  key_phrase: {
    pa: string;
    romanization: string;
    vi: string;
    en: string;
  };
  explanation_vi: string;
  explanation_en: string;
  examples: {
    pa: string;
    romanization: string;
    vi: string;
    en: string;
    canada_practical?: boolean;
  }[];
  learner_traps: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  }[];
  quick_check: {
    prompt_vi: string;
    prompt_en: string;
    answer_pa: string;
    answer_romanization: string;
  };
};

export const microLessonScriptAwareness =
  "Gurmukhi is the primary script in these micro-lessons. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1MicroLessons: PunjabiMicroLesson[] = [
  {
    id: "pa_a1_micro_greetings_001",
    topic: "greetings",
    title_vi: "Chào lịch sự",
    title_en: "Respectful hello",
    goal_vi: "Nói xin chào và đáp lại lịch sự.",
    goal_en: "Say hello and reply politely.",
    key_phrase: { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।", romanization: "sat sri akal", vi: "Xin chào.", en: "Hello." },
    explanation_vi: "Đây là lời chào Punjabi phổ biến và lịch sự. Có thể thêm ਜੀ để mềm hơn.",
    explanation_en: "This is a common respectful Punjabi greeting. Add ਜੀ to make it softer.",
    examples: [
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
      { pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", romanization: "sat sri akal. tusi kive ho?", vi: "Xin chào. Bạn khỏe không?", en: "Hello. How are you?" },
    ],
    learner_traps: [
      { audience: "vi", vi: "Không thêm nguyên âm sau phụ âm cuối trong ਸਤ.", en: "Vietnamese speakers should not add a vowel after final ਤ." },
      { audience: "en", vi: "Dùng ਤੁਸੀਂ với người mới gặp, không dùng ਤੂੰ.", en: "Use polite ਤੁਸੀਂ with new adults, not intimate ਤੂੰ." },
    ],
    quick_check: { prompt_vi: "Viết 'Xin chào' bằng Gurmukhi.", prompt_en: "Write 'Hello' in Gurmukhi.", answer_pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ।", answer_romanization: "sat sri akal" },
  },
  {
    id: "pa_a1_micro_identity_001",
    topic: "identity",
    title_vi: "Tên của tôi",
    title_en: "My name",
    goal_vi: "Nói tên và hỏi tên.",
    goal_en: "Say your name and ask someone else's name.",
    key_phrase: { pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ।", romanization: "mera nam Lan hai", vi: "Tên tôi là Lan.", en: "My name is Lan." },
    explanation_vi: "ਮੇਰਾ ਨਾਮ ... ਹੈ là mẫu an toàn cho giới thiệu tên ở A1.",
    explanation_en: "ਮੇਰਾ ਨਾਮ ... ਹੈ is a safe A1 pattern for introducing your name.",
    examples: [
      { pa: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?", romanization: "tuhada nam ki hai?", vi: "Tên bạn là gì?", en: "What is your name?" },
      { pa: "ਮੈਂ ਵੀਅਤਨਾਮ ਤੋਂ ਹਾਂ।", romanization: "main Vietnam ton han", vi: "Tôi đến từ Việt Nam.", en: "I am from Vietnam.", canada_practical: true },
    ],
    learner_traps: [
      { audience: "vi", vi: "Đừng bỏ ਹੈ vì tiếng Việt đôi khi không cần 'là'.", en: "Vietnamese speakers may drop 'is'; keep ਹੈ." },
      { audience: "both", vi: "Gurmukhi là chính; romanization chỉ hỗ trợ đọc.", en: "Gurmukhi is primary; romanization is only reading support." },
    ],
    quick_check: { prompt_vi: "Hỏi 'Tên bạn là gì?'", prompt_en: "Ask 'What is your name?'", answer_pa: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?", answer_romanization: "tuhada nam ki hai?" },
  },
  {
    id: "pa_a1_micro_family_001",
    topic: "family",
    title_vi: "Gia đình",
    title_en: "Family",
    goal_vi: "Giới thiệu mẹ, cha, anh/chị/em.",
    goal_en: "Introduce mother, father, and siblings.",
    key_phrase: { pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।", romanization: "ih meri man hai", vi: "Đây là mẹ tôi.", en: "This is my mother." },
    explanation_vi: "ਮੇਰਾ/ਮੇਰੀ có thể đổi theo danh từ. Học theo cụm trước ở A1.",
    explanation_en: "ਮੇਰਾ/ਮੇਰੀ can change with the noun. Learn chunks first at A1.",
    examples: [
      { pa: "ਇਹ ਮੇਰਾ ਭਰਾ ਹੈ।", romanization: "ih mera bhara hai", vi: "Đây là anh/em trai tôi.", en: "This is my brother." },
      { pa: "ਮੇਰੇ ਕੋਲ ਇੱਕ ਭੈਣ ਹੈ।", romanization: "mere kol ikk bhain hai", vi: "Tôi có một chị/em gái.", en: "I have one sister." },
    ],
    learner_traps: [
      { audience: "en", vi: "Tiếng Anh có một dạng 'my'; Punjabi có ਮੇਰਾ/ਮੇਰੀ.", en: "English has one 'my'; Punjabi uses ਮੇਰਾ/ਮੇਰੀ." },
      { audience: "vi", vi: "Tiếng Việt không có giống danh từ; chú ý cụm mẫu.", en: "Vietnamese lacks noun gender; watch the model phrase." },
    ],
    quick_check: { prompt_vi: "Nói 'Đây là mẹ tôi.'", prompt_en: "Say 'This is my mother.'", answer_pa: "ਇਹ ਮੇਰੀ ਮਾਂ ਹੈ।", answer_romanization: "ih meri man hai" },
  },
  {
    id: "pa_a1_micro_numbers_001",
    topic: "numbers",
    title_vi: "Số 1-5",
    title_en: "Numbers 1-5",
    goal_vi: "Nhận diện và dùng số nhỏ.",
    goal_en: "Recognize and use small numbers.",
    key_phrase: { pa: "ਇੱਕ, ਦੋ, ਤਿੰਨ, ਚਾਰ, ਪੰਜ", romanization: "ikk, do, tin, char, panj", vi: "Một, hai, ba, bốn, năm.", en: "One, two, three, four, five." },
    explanation_vi: "Học số bằng Gurmukhi để đọc menu, vé, số quầy và số điện thoại.",
    explanation_en: "Learn numbers in Gurmukhi for menus, tickets, counters, and phone numbers.",
    examples: [
      { pa: "ਦੋ ਟਿਕਟਾਂ।", romanization: "do ticktan", vi: "Hai vé.", en: "Two tickets.", canada_practical: true },
      { pa: "ਪੰਜ ਡਾਲਰ।", romanization: "panj dollar", vi: "Năm đô la.", en: "Five dollars.", canada_practical: true },
    ],
    learner_traps: [
      { audience: "both", vi: "Đừng học chỉ bằng chữ Latin; cần nhận diện Gurmukhi.", en: "Do not study only Latin letters; recognize Gurmukhi." },
    ],
    quick_check: { prompt_vi: "Viết 'hai vé'.", prompt_en: "Write 'two tickets'.", answer_pa: "ਦੋ ਟਿਕਟਾਂ।", answer_romanization: "do ticktan" },
  },
  {
    id: "pa_a1_micro_food_001",
    topic: "food",
    title_vi: "Gọi món đơn giản",
    title_en: "Simple food order",
    goal_vi: "Yêu cầu nước, trà hoặc món ăn.",
    goal_en: "Ask for water, tea, or food.",
    key_phrase: { pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani chahida hai", vi: "Tôi cần nước.", en: "I need water." },
    explanation_vi: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ là mẫu rất hữu ích khi cần thứ gì đó.",
    explanation_en: "ਮੈਨੂੰ ... ਚਾਹੀਦਾ ਹੈ is useful when you need something.",
    examples: [
      { pa: "ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu chah chahidi hai", vi: "Tôi muốn trà.", en: "I want tea." },
      { pa: "ਕੀ ਇਹ ਸ਼ਾਕਾਹਾਰੀ ਹੈ?", romanization: "ki ih shakahari hai?", vi: "Món này có phải chay không?", en: "Is this vegetarian?", canada_practical: true },
    ],
    learner_traps: [
      { audience: "vi", vi: "Không dịch từng chữ theo thứ tự 'tôi cần nước'.", en: "Vietnamese speakers should keep the Punjabi frame, not word-for-word order." },
      { audience: "en", vi: "ਚਾਹੀਦਾ/ਚਾਹੀਦੀ có thể đổi theo danh từ.", en: "ਚਾਹੀਦਾ/ਚਾਹੀਦੀ can change with the noun." },
    ],
    quick_check: { prompt_vi: "Nói 'Tôi cần nước.'", prompt_en: "Say 'I need water.'", answer_pa: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ।", answer_romanization: "mainu pani chahida hai" },
  },
  {
    id: "pa_a1_micro_directions_001",
    topic: "directions",
    title_vi: "Hỏi đường",
    title_en: "Ask directions",
    goal_vi: "Hỏi nhà ga, bến xe, văn phòng ở đâu.",
    goal_en: "Ask where a station, bus stop, or office is.",
    key_phrase: { pa: "ਸਟੇਸ਼ਨ ਕਿੱਥੇ ਹੈ?", romanization: "station kithe hai?", vi: "Nhà ga ở đâu?", en: "Where is the station?" },
    explanation_vi: "ਕਿੱਥੇ nghĩa là 'ở đâu'. Trong mẫu này ਹੈ đứng cuối.",
    explanation_en: "ਕਿੱਥੇ means 'where'. In this pattern, ਹੈ stays at the end.",
    examples: [
      { pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?", romanization: "bas adda kithe hai?", vi: "Bến xe ở đâu?", en: "Where is the bus stand?", canada_practical: true },
      { pa: "ਦਫ਼ਤਰ ਇੱਥੇ ਹੈ।", romanization: "daftar ithe hai", vi: "Văn phòng ở đây.", en: "The office is here." },
    ],
    learner_traps: [
      { audience: "en", vi: "Không đảo như 'where is' trong tiếng Anh.", en: "Do not invert like English 'where is'." },
      { audience: "both", vi: "Phân biệt ਕਿੱਥੇ 'ở đâu' và ਕਿੱਥੋਂ 'từ đâu'.", en: "Distinguish ਕਿੱਥੇ 'where' and ਕਿੱਥੋਂ 'from where'." },
    ],
    quick_check: { prompt_vi: "Hỏi 'Bến xe ở đâu?'", prompt_en: "Ask 'Where is the bus stand?'", answer_pa: "ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?", answer_romanization: "bas adda kithe hai?" },
  },
  {
    id: "pa_a1_micro_time_001",
    topic: "time",
    title_vi: "Hỏi giờ",
    title_en: "Ask the time",
    goal_vi: "Hỏi và nói giờ đơn giản.",
    goal_en: "Ask and say simple clock times.",
    key_phrase: { pa: "ਹੁਣ ਕਿੰਨੇ ਵਜੇ ਹਨ?", romanization: "hun kinne vaje han?", vi: "Bây giờ mấy giờ?", en: "What time is it now?" },
    explanation_vi: "ਕਿੰਨੇ ਵਜੇ là cụm hỏi giờ. ਹੁਣ nghĩa là bây giờ.",
    explanation_en: "ਕਿੰਨੇ ਵਜੇ asks clock time. ਹੁਣ means now.",
    examples: [
      { pa: "ਹੁਣ ਦੋ ਵਜੇ ਹਨ।", romanization: "hun do vaje han", vi: "Bây giờ là hai giờ.", en: "It is two o'clock now." },
      { pa: "ਮੇਰੀ ਬੱਸ ਛੇ ਵਜੇ ਹੈ।", romanization: "meri bus chhe vaje hai", vi: "Xe buýt của tôi lúc sáu giờ.", en: "My bus is at six.", canada_practical: true },
    ],
    learner_traps: [
      { audience: "both", vi: "ਕਿੰਨੇ cũng có thể hỏi giá; ਵਜੇ cho biết đây là giờ.", en: "ਕਿੰਨੇ can also ask price; ਵਜੇ signals time." },
    ],
    quick_check: { prompt_vi: "Hỏi 'Bây giờ mấy giờ?'", prompt_en: "Ask 'What time is it now?'", answer_pa: "ਹੁਣ ਕਿੰਨੇ ਵਜੇ ਹਨ?", answer_romanization: "hun kinne vaje han?" },
  },
  {
    id: "pa_a1_micro_polite_001",
    topic: "polite_requests",
    title_vi: "Lời nhờ lịch sự",
    title_en: "Polite requests",
    goal_vi: "Nhờ người khác nói chậm, giúp đỡ hoặc đưa đồ.",
    goal_en: "Ask someone to speak slowly, help, or give something.",
    key_phrase: { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", romanization: "kirpa karke hauli bolo", vi: "Làm ơn nói chậm.", en: "Please speak slowly." },
    explanation_vi: "ਕਿਰਪਾ ਕਰਕੇ là 'làm ơn'. ਜੀ cũng giúp câu nghe lịch sự hơn.",
    explanation_en: "ਕਿਰਪਾ ਕਰਕੇ means please. ਜੀ also makes a sentence more respectful.",
    examples: [
      { pa: "ਮਦਦ ਕਰੋ ਜੀ।", romanization: "madad karo ji", vi: "Vui lòng giúp tôi.", en: "Please help." },
      { pa: "ਮੈਨੂੰ ਫਾਰਮ ਦਿਓ ਜੀ।", romanization: "mainu form dio ji", vi: "Vui lòng đưa tôi mẫu đơn.", en: "Please give me the form.", canada_practical: true },
    ],
    learner_traps: [
      { audience: "vi", vi: "ਜੀ giống sắc thái 'ạ' trong vài ngữ cảnh, nhưng không thay thế 1-1.", en: "ਜੀ can feel like Vietnamese 'ạ' sometimes, but it is not one-to-one." },
      { audience: "en", vi: "Tránh mệnh lệnh cụt khi nói với người lạ.", en: "Avoid bare commands with strangers." },
    ],
    quick_check: { prompt_vi: "Nói 'Làm ơn nói chậm.'", prompt_en: "Say 'Please speak slowly.'", answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ।", answer_romanization: "kirpa karke hauli bolo" },
  },
  {
    id: "pa_a1_micro_canada_001",
    topic: "canada_survival",
    title_vi: "Cụm sinh tồn ở Canada",
    title_en: "Canada survival phrases",
    goal_vi: "Dùng câu ngắn trong xe buýt, phòng khám, văn phòng công.",
    goal_en: "Use short phrases on buses, at clinics, and in public offices.",
    key_phrase: { pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu madad chahidi hai", vi: "Tôi cần giúp đỡ.", en: "I need help." },
    explanation_vi: "Ở Canada, các tình huống thực tế thường cần hỏi đường, giấy tờ, giờ hẹn và giúp đỡ.",
    explanation_en: "In Canada, practical situations often involve directions, forms, appointment times, and help.",
    examples: [
      { pa: "ਮੇਰਾ ਅਪਾਇੰਟਮੈਂਟ ਕਿੰਨੇ ਵਜੇ ਹੈ?", romanization: "mera appointment kinne vaje hai?", vi: "Lịch hẹn của tôi lúc mấy giờ?", en: "What time is my appointment?", canada_practical: true },
      { pa: "ਕੀ ਮੈਨੂੰ ਪਛਾਣ ਪੱਤਰ ਚਾਹੀਦਾ ਹੈ?", romanization: "ki mainu pachhan pattar chahida hai?", vi: "Tôi có cần giấy tờ tùy thân không?", en: "Do I need ID?", canada_practical: true },
      { pa: "ਮੈਂ ਅੰਗਰੇਜ਼ੀ ਥੋੜ੍ਹੀ ਬੋਲਦਾ ਹਾਂ।", romanization: "main angrezi thori bolda han", vi: "Tôi nói tiếng Anh một chút.", en: "I speak a little English.", canada_practical: true },
    ],
    learner_traps: [
      { audience: "both", vi: "Không tuyên bố đã được người bản ngữ duyệt; phần này cần native review sau.", en: "Do not claim native review; native review is deferred." },
      { audience: "en", vi: "ID có thể nói bằng cụm ਪਛਾਣ ਪੱਤਰ trong bối cảnh giấy tờ.", en: "ID can be expressed as ਪਛਾਣ ਪੱਤਰ in document contexts." },
    ],
    quick_check: { prompt_vi: "Nói 'Tôi cần giúp đỡ.'", prompt_en: "Say 'I need help.'", answer_pa: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", answer_romanization: "mainu madad chahidi hai" },
  },
];

export default punjabiA1MicroLessons;
