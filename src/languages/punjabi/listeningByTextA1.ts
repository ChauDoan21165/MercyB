// Punjabi A1 listening-by-text scripts for Vietnamese-speaking and English-speaking learners.
// No audio is included. Gurmukhi is primary; romanization is practical support.
// Native review is deferred.

export type PunjabiListeningByTextTopic =
  | "greetings"
  | "names"
  | "numbers"
  | "prices"
  | "directions"
  | "food_orders"
  | "clinic_reception"
  | "school_office"
  | "service_counter";

export type PunjabiListeningByTextScript = {
  id: string;
  topic: PunjabiListeningByTextTopic;
  title_vi: string;
  title_en: string;
  setting_vi: string;
  setting_en: string;
  lines: {
    speaker: string;
    pa: string;
    romanization: string;
    vi: string;
    en: string;
  }[];
  listen_for: {
    vi: string;
    en: string;
    items_pa: string[];
  };
  comprehension_checks: {
    prompt_vi: string;
    prompt_en: string;
    answer_vi: string;
    answer_en: string;
  }[];
  learner_trap?: {
    audience: "vi" | "en" | "both";
    vi: string;
    en: string;
  };
  canada_practical?: boolean;
};

export const listeningByTextScriptAwareness =
  "Gurmukhi is primary for these Punjabi listening-by-text scripts. Shahmukhi is awareness only, not a full course track.";

export const punjabiA1ListeningByTextScripts: PunjabiListeningByTextScript[] = [
  {
    id: "pa_a1_listen_text_greetings_001",
    topic: "greetings",
    title_vi: "Chào ở hành lang",
    title_en: "Greeting in a hallway",
    setting_vi: "Hai người gặp nhau và chào ngắn.",
    setting_en: "Two people meet and exchange a short greeting.",
    lines: [
      { speaker: "A", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ ਜੀ।", romanization: "sat sri akal ji", vi: "Xin chào ạ.", en: "Hello, respectfully." },
      { speaker: "B", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਤੁਸੀਂ ਕਿਵੇਂ ਹੋ?", romanization: "sat sri akal. tusi kive ho?", vi: "Xin chào. Bạn khỏe không?", en: "Hello. How are you?" },
      { speaker: "A", pa: "ਮੈਂ ਠੀਕ ਹਾਂ। ਧੰਨਵਾਦ।", romanization: "main thik han. dhanvad", vi: "Tôi ổn. Cảm ơn.", en: "I am fine. Thank you." },
    ],
    listen_for: { vi: "Nghe lời chào và câu hỏi sức khỏe.", en: "Listen for the greeting and how-are-you question.", items_pa: ["ਸਤ ਸ੍ਰੀ ਅਕਾਲ", "ਕਿਵੇਂ ਹੋ", "ਠੀਕ"] },
    comprehension_checks: [
      { prompt_vi: "Người A có khỏe không?", prompt_en: "Is person A fine?", answer_vi: "Có, A nói tôi ổn.", answer_en: "Yes, A says I am fine." },
    ],
    learner_trap: { audience: "vi", vi: "Không thêm nguyên âm sau ਸਤ khi đọc thầm theo chữ.", en: "Vietnamese speakers should not add a vowel after final ਤ when subvocalizing." },
  },
  {
    id: "pa_a1_listen_text_names_001",
    topic: "names",
    title_vi: "Hỏi tên",
    title_en: "Asking a name",
    setting_vi: "Người mới gặp tự giới thiệu.",
    setting_en: "New acquaintances introduce themselves.",
    lines: [
      { speaker: "A", pa: "ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?", romanization: "tuhada nam ki hai?", vi: "Tên bạn là gì?", en: "What is your name?" },
      { speaker: "B", pa: "ਮੇਰਾ ਨਾਮ ਲਾਨ ਹੈ।", romanization: "mera nam Lan hai", vi: "Tên tôi là Lan.", en: "My name is Lan." },
      { speaker: "A", pa: "ਤੁਹਾਨੂੰ ਮਿਲ ਕੇ ਖੁਸ਼ੀ ਹੋਈ।", romanization: "tuhanu mil ke khushi hoi", vi: "Rất vui được gặp bạn.", en: "Nice to meet you." },
    ],
    listen_for: { vi: "Nghe ਨਾਮ và ਕੀ để nhận ra câu hỏi tên.", en: "Listen for ਨਾਮ and ਕੀ to recognize the name question.", items_pa: ["ਨਾਮ", "ਕੀ", "ਮੇਰਾ"] },
    comprehension_checks: [
      { prompt_vi: "Tên của B là gì?", prompt_en: "What is B's name?", answer_vi: "Lan.", answer_en: "Lan." },
    ],
    learner_trap: { audience: "en", vi: "ਕੀ đứng trước ਹੈ trong mẫu này.", en: "ਕੀ comes before ਹੈ in this pattern." },
  },
  {
    id: "pa_a1_listen_text_numbers_001",
    topic: "numbers",
    title_vi: "Số vé",
    title_en: "Ticket numbers",
    setting_vi: "Người học nghe số nhỏ ở quầy vé.",
    setting_en: "The learner reads short ticket-counter lines with small numbers.",
    lines: [
      { speaker: "A", pa: "ਮੈਨੂੰ ਦੋ ਟਿਕਟਾਂ ਚਾਹੀਦੀਆਂ ਹਨ।", romanization: "mainu do ticktan chahidian han", vi: "Tôi cần hai vé.", en: "I need two tickets." },
      { speaker: "B", pa: "ਦੋ ਟਿਕਟਾਂ, ਠੀਕ ਹੈ।", romanization: "do ticktan, thik hai", vi: "Hai vé, được.", en: "Two tickets, okay." },
    ],
    listen_for: { vi: "Nghe số ਦੋ và từ ਟਿਕਟਾਂ.", en: "Listen for the number ਦੋ and the word ਟਿਕਟਾਂ.", items_pa: ["ਦੋ", "ਟਿਕਟਾਂ"] },
    comprehension_checks: [
      { prompt_vi: "Người A cần mấy vé?", prompt_en: "How many tickets does A need?", answer_vi: "Hai vé.", answer_en: "Two tickets." },
    ],
    canada_practical: true,
    learner_trap: { audience: "both", vi: "Đừng học số chỉ bằng romanization; nhận diện Gurmukhi.", en: "Do not learn numbers only through romanization; recognize Gurmukhi." },
  },
  {
    id: "pa_a1_listen_text_prices_001",
    topic: "prices",
    title_vi: "Hỏi giá",
    title_en: "Asking a price",
    setting_vi: "Mua một món nhỏ ở cửa hàng.",
    setting_en: "Buying a small item in a shop.",
    lines: [
      { speaker: "A", pa: "ਇਹ ਕਿੰਨੇ ਦਾ ਹੈ?", romanization: "ih kinne da hai?", vi: "Cái này bao nhiêu tiền?", en: "How much is this?" },
      { speaker: "B", pa: "ਇਹ ਪੰਜ ਡਾਲਰ ਦਾ ਹੈ।", romanization: "ih panj dollar da hai", vi: "Cái này năm đô la.", en: "It is five dollars." },
      { speaker: "A", pa: "ਠੀਕ ਹੈ, ਧੰਨਵਾਦ।", romanization: "thik hai, dhanvad", vi: "Được, cảm ơn.", en: "Okay, thank you." },
    ],
    listen_for: { vi: "Nghe ਕਿੰਨੇ ਦਾ để nhận ra câu hỏi giá.", en: "Listen for ਕਿੰਨੇ ਦਾ to recognize a price question.", items_pa: ["ਕਿੰਨੇ ਦਾ", "ਪੰਜ", "ਡਾਲਰ"] },
    comprehension_checks: [
      { prompt_vi: "Món đồ giá bao nhiêu?", prompt_en: "How much is the item?", answer_vi: "Năm đô la.", answer_en: "Five dollars." },
    ],
    canada_practical: true,
    learner_trap: { audience: "both", vi: "ਕਿੰਨੇ + ਦਾ là giá; ਕਿੰਨੇ ਵਜੇ là giờ.", en: "ਕਿੰਨੇ + ਦਾ asks price; ਕਿੰਨੇ ਵਜੇ asks time." },
  },
  {
    id: "pa_a1_listen_text_directions_001",
    topic: "directions",
    title_vi: "Tìm bến xe",
    title_en: "Finding the bus stop",
    setting_vi: "Hỏi đường đến bến xe trong thành phố Canada.",
    setting_en: "Asking where the bus stop is in a Canadian city.",
    lines: [
      { speaker: "A", pa: "ਮਾਫ਼ ਕਰਨਾ, ਬੱਸ ਅੱਡਾ ਕਿੱਥੇ ਹੈ?", romanization: "maf karna, bas adda kithe hai?", vi: "Xin lỗi, bến xe ở đâu?", en: "Sorry, where is the bus stop?" },
      { speaker: "B", pa: "ਬੱਸ ਅੱਡਾ ਉੱਥੇ ਹੈ।", romanization: "bas adda utthe hai", vi: "Bến xe ở kia.", en: "The bus stop is there." },
      { speaker: "A", pa: "ਧੰਨਵਾਦ ਜੀ।", romanization: "dhanvad ji", vi: "Cảm ơn ạ.", en: "Thank you, respectfully." },
    ],
    listen_for: { vi: "Nghe ਕਿੱਥੇ ਹੈ để nhận ra hỏi địa điểm.", en: "Listen for ਕਿੱਥੇ ਹੈ to recognize a location question.", items_pa: ["ਮਾਫ਼ ਕਰਨਾ", "ਬੱਸ ਅੱਡਾ", "ਕਿੱਥੇ"] },
    comprehension_checks: [
      { prompt_vi: "Bến xe ở đâu?", prompt_en: "Where is the bus stop?", answer_vi: "Ở kia.", answer_en: "There." },
    ],
    canada_practical: true,
    learner_trap: { audience: "en", vi: "Không đảo như tiếng Anh 'where is'.", en: "Do not invert like English 'where is'." },
  },
  {
    id: "pa_a1_listen_text_food_001",
    topic: "food_orders",
    title_vi: "Gọi trà và nước",
    title_en: "Ordering tea and water",
    setting_vi: "Gọi món đơn giản ở quán ăn.",
    setting_en: "A simple order at a cafe or restaurant.",
    lines: [
      { speaker: "A", pa: "ਮੈਨੂੰ ਚਾਹ ਚਾਹੀਦੀ ਹੈ।", romanization: "mainu chah chahidi hai", vi: "Tôi muốn trà.", en: "I want tea." },
      { speaker: "B", pa: "ਹੋਰ ਕੁਝ?", romanization: "hor kujh?", vi: "Còn gì nữa không?", en: "Anything else?" },
      { speaker: "A", pa: "ਮੈਨੂੰ ਪਾਣੀ ਵੀ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu pani vi chahida hai", vi: "Tôi cũng cần nước.", en: "I also need water." },
    ],
    listen_for: { vi: "Nghe ਚਾਹ, ਪਾਣੀ, và ਚਾਹੀਦਾ/ਚਾਹੀਦੀ.", en: "Listen for ਚਾਹ, ਪਾਣੀ, and ਚਾਹੀਦਾ/ਚਾਹੀਦੀ.", items_pa: ["ਚਾਹ", "ਪਾਣੀ", "ਵੀ"] },
    comprehension_checks: [
      { prompt_vi: "Người A gọi gì?", prompt_en: "What does A order?", answer_vi: "Trà và nước.", answer_en: "Tea and water." },
    ],
    learner_trap: { audience: "en", vi: "ਚਾਹੀਦਾ/ਚਾਹੀਦੀ có thể đổi theo danh từ.", en: "ਚਾਹੀਦਾ/ਚਾਹੀਦੀ can change with the noun." },
  },
  {
    id: "pa_a1_listen_text_clinic_001",
    topic: "clinic_reception",
    title_vi: "Tiếp tân phòng khám",
    title_en: "Clinic reception",
    setting_vi: "Hỏi giờ hẹn ở phòng khám tại Canada.",
    setting_en: "Asking appointment time at a clinic in Canada.",
    lines: [
      { speaker: "A", pa: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ। ਮੇਰਾ ਅਪਾਇੰਟਮੈਂਟ ਕਿੰਨੇ ਵਜੇ ਹੈ?", romanization: "sat sri akal. mera appointment kinne vaje hai?", vi: "Xin chào. Lịch hẹn của tôi lúc mấy giờ?", en: "Hello. What time is my appointment?" },
      { speaker: "B", pa: "ਤੁਹਾਡਾ ਅਪਾਇੰਟਮੈਂਟ ਦੋ ਵਜੇ ਹੈ।", romanization: "tuhada appointment do vaje hai", vi: "Lịch hẹn của bạn lúc hai giờ.", en: "Your appointment is at two." },
      { speaker: "A", pa: "ਧੰਨਵਾਦ।", romanization: "dhanvad", vi: "Cảm ơn.", en: "Thank you." },
    ],
    listen_for: { vi: "Nghe ਅਪਾਇੰਟਮੈਂਟ và ਵਜੇ.", en: "Listen for ਅਪਾਇੰਟਮੈਂਟ and ਵਜੇ.", items_pa: ["ਅਪਾਇੰਟਮੈਂਟ", "ਕਿੰਨੇ ਵਜੇ", "ਦੋ ਵਜੇ"] },
    comprehension_checks: [
      { prompt_vi: "Lịch hẹn lúc mấy giờ?", prompt_en: "What time is the appointment?", answer_vi: "Hai giờ.", answer_en: "Two o'clock." },
    ],
    canada_practical: true,
  },
  {
    id: "pa_a1_listen_text_school_001",
    topic: "school_office",
    title_vi: "Văn phòng trường",
    title_en: "School office",
    setting_vi: "Xin mẫu đơn ở văn phòng trường tại Canada.",
    setting_en: "Asking for a form at a school office in Canada.",
    lines: [
      { speaker: "A", pa: "ਮੈਨੂੰ ਫਾਰਮ ਚਾਹੀਦਾ ਹੈ।", romanization: "mainu form chahida hai", vi: "Tôi cần mẫu đơn.", en: "I need a form." },
      { speaker: "B", pa: "ਇਹ ਫਾਰਮ ਲਓ ਜੀ।", romanization: "ih form lao ji", vi: "Mời lấy mẫu đơn này.", en: "Please take this form." },
      { speaker: "A", pa: "ਧੰਨਵਾਦ ਜੀ।", romanization: "dhanvad ji", vi: "Cảm ơn ạ.", en: "Thank you, respectfully." },
    ],
    listen_for: { vi: "Nghe ਫਾਰਮ và ਲਓ ਜੀ.", en: "Listen for ਫਾਰਮ and ਲਓ ਜੀ.", items_pa: ["ਫਾਰਮ", "ਚਾਹੀਦਾ", "ਲਓ ਜੀ"] },
    comprehension_checks: [
      { prompt_vi: "Người A cần gì?", prompt_en: "What does A need?", answer_vi: "Một mẫu đơn.", answer_en: "A form." },
    ],
    canada_practical: true,
    learner_trap: { audience: "vi", vi: "Giữ ਮੈਨੂੰ trong mẫu 'tôi cần'.", en: "Keep ਮੈਨੂੰ in the 'I need' frame." },
  },
  {
    id: "pa_a1_listen_text_service_001",
    topic: "service_counter",
    title_vi: "Quầy dịch vụ",
    title_en: "Service counter",
    setting_vi: "Hỏi giấy tờ tùy thân ở quầy dịch vụ.",
    setting_en: "Asking about ID at a service counter.",
    lines: [
      { speaker: "A", pa: "ਕੀ ਮੈਨੂੰ ਪਛਾਣ ਪੱਤਰ ਚਾਹੀਦਾ ਹੈ?", romanization: "ki mainu pachhan pattar chahida hai?", vi: "Tôi có cần giấy tờ tùy thân không?", en: "Do I need ID?" },
      { speaker: "B", pa: "ਹਾਂ ਜੀ, ਪਛਾਣ ਪੱਤਰ ਚਾਹੀਦਾ ਹੈ।", romanization: "han ji, pachhan pattar chahida hai", vi: "Vâng, cần giấy tờ tùy thân.", en: "Yes, ID is needed." },
      { speaker: "A", pa: "ਠੀਕ ਹੈ।", romanization: "thik hai", vi: "Được.", en: "Okay." },
    ],
    listen_for: { vi: "Nghe ਕੀ, ਹਾਂ ਜੀ, và ਪਛਾਣ ਪੱਤਰ.", en: "Listen for ਕੀ, ਹਾਂ ਜੀ, and ਪਛਾਣ ਪੱਤਰ.", items_pa: ["ਕੀ", "ਹਾਂ ਜੀ", "ਪਛਾਣ ਪੱਤਰ"] },
    comprehension_checks: [
      { prompt_vi: "Có cần giấy tờ tùy thân không?", prompt_en: "Is ID needed?", answer_vi: "Có.", answer_en: "Yes." },
    ],
    canada_practical: true,
    learner_trap: { audience: "en", vi: "ਕੀ mở câu hỏi yes/no; không thêm do/does.", en: "ਕੀ opens the yes/no question; do not add do/does." },
  },
];

export default punjabiA1ListeningByTextScripts;
