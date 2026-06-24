// src/languages/punjabi/highFrequencyVerbDeck.ts
//
// High-frequency Punjabi verb deck for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a reading/search bridge only.
// No audio, pronunciation scoring, or native-review claim.

export type PunjabiVerbDomain =
  | "daily_actions"
  | "service_needs"
  | "workplace_actions"
  | "health_descriptions"
  | "public_service_requests"
  | "gurmukhi_romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiVerbLevel = "A1" | "A2" | "B1" | "B2";

export type PunjabiVerbEntry = {
  id: string;
  domain: PunjabiVerbDomain;
  level: PunjabiVerbLevel;
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
  exampleGurmukhi: string;
  exampleRomanization: string;
  example_vi: string;
  example_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
};

export type PunjabiVerbSection = {
  domain: PunjabiVerbDomain;
  title_vi: string;
  title_en: string;
  purpose_vi: string;
  purpose_en: string;
  entries: ReadonlyArray<PunjabiVerbEntry>;
};

export const PUNJABI_HIGH_FREQUENCY_VERB_SCOPE = {
  vi: "Bộ động từ này dùng Gurmukhi làm chính. Romanization giúp đọc và tìm kiếm, không phải phát âm chấm điểm. Shahmukhi chỉ được nhắc để nhận biết Punjabi có hệ chữ khác; đây không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This verb deck uses Gurmukhi as primary. Romanization supports reading and search, not pronunciation scoring. Shahmukhi is mentioned only so learners know Punjabi has another script; this is not a full Shahmukhi course. Native review is deferred.",
} as const;

const sections: ReadonlyArray<PunjabiVerbSection> = [
  {
    domain: "daily_actions",
    title_vi: "Hành động hằng ngày",
    title_en: "Daily Actions",
    purpose_vi: "Động từ lõi để nói các việc làm mỗi ngày.",
    purpose_en: "Core verbs for everyday actions.",
    entries: [
      { id: "pa-verb-daily-001", domain: "daily_actions", level: "A1", gurmukhi: "ਹੋਣਾ", romanization: "hona", vi: "là / tồn tại", en: "to be", exampleGurmukhi: "ਮੈਂ ਘਰ ਹਾਂ", exampleRomanization: "main ghar haan", example_vi: "Tôi ở nhà.", example_en: "I am at home." },
      { id: "pa-verb-daily-002", domain: "daily_actions", level: "A1", gurmukhi: "ਕਰਨਾ", romanization: "karna", vi: "làm", en: "to do / make", exampleGurmukhi: "ਮੈਂ ਕੰਮ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main kamm karda haan", example_vi: "Tôi làm việc.", example_en: "I work.", learnerTrap: { vi: "ਕਰਨਾ thường đi với danh từ để tạo cụm động từ.", en: "ਕਰਨਾ often combines with a noun to form a verb phrase." } },
      { id: "pa-verb-daily-003", domain: "daily_actions", level: "A1", gurmukhi: "ਜਾਣਾ", romanization: "jana", vi: "đi", en: "to go", exampleGurmukhi: "ਮੈਂ ਸਕੂਲ ਜਾਂਦਾ ਹਾਂ", exampleRomanization: "main school janda haan", example_vi: "Tôi đi học.", example_en: "I go to school." },
      { id: "pa-verb-daily-004", domain: "daily_actions", level: "A1", gurmukhi: "ਆਉਣਾ", romanization: "auna", vi: "đến", en: "to come", exampleGurmukhi: "ਤੁਸੀਂ ਕਦੋਂ ਆਉਂਦੇ ਹੋ", exampleRomanization: "tusi kadon aunde ho", example_vi: "Khi nào bạn đến?", example_en: "When do you come?" },
      { id: "pa-verb-daily-005", domain: "daily_actions", level: "A1", gurmukhi: "ਖਾਣਾ", romanization: "khana", vi: "ăn", en: "to eat", exampleGurmukhi: "ਮੈਂ ਰੋਟੀ ਖਾਂਦਾ ਹਾਂ", exampleRomanization: "main roti khanda haan", example_vi: "Tôi ăn roti.", example_en: "I eat roti.", learnerTrap: { vi: "ਖ là kh bật hơi; đừng đọc như ਕ.", en: "ਖ is aspirated kh; do not read it like ਕ." } },
      { id: "pa-verb-daily-006", domain: "daily_actions", level: "A1", gurmukhi: "ਪੀਣਾ", romanization: "pina", vi: "uống", en: "to drink", exampleGurmukhi: "ਮੈਂ ਪਾਣੀ ਪੀਂਦਾ ਹਾਂ", exampleRomanization: "main pani pinda haan", example_vi: "Tôi uống nước.", example_en: "I drink water." },
      { id: "pa-verb-daily-007", domain: "daily_actions", level: "A1", gurmukhi: "ਸੌਣਾ", romanization: "sauna", vi: "ngủ", en: "to sleep", exampleGurmukhi: "ਬੱਚਾ ਸੌਂਦਾ ਹੈ", exampleRomanization: "bachcha saunda hai", example_vi: "Đứa trẻ ngủ.", example_en: "The child sleeps." },
      { id: "pa-verb-daily-008", domain: "daily_actions", level: "A2", gurmukhi: "ਜਾਗਣਾ", romanization: "jaagna", vi: "thức dậy", en: "to wake up", exampleGurmukhi: "ਮੈਂ ਸਵੇਰੇ ਜਾਗਦਾ ਹਾਂ", exampleRomanization: "main savere jaagda haan", example_vi: "Tôi thức dậy buổi sáng.", example_en: "I wake up in the morning." },
      { id: "pa-verb-daily-009", domain: "daily_actions", level: "A1", gurmukhi: "ਪੜ੍ਹਨਾ", romanization: "parhna", vi: "đọc / học", en: "to read / study", exampleGurmukhi: "ਮੈਂ ਪੰਜਾਬੀ ਪੜ੍ਹਦਾ ਹਾਂ", exampleRomanization: "main punjabi parhda haan", example_vi: "Tôi học Punjabi.", example_en: "I study Punjabi.", learnerTrap: { vi: "ੜ੍ਹ có thể romanize rh; hãy nhìn Gurmukhi trước.", en: "ੜ੍ਹ may romanize as rh; look at Gurmukhi first." } },
      { id: "pa-verb-daily-010", domain: "daily_actions", level: "A1", gurmukhi: "ਲਿਖਣਾ", romanization: "likhna", vi: "viết", en: "to write", exampleGurmukhi: "ਮੈਂ ਨਾਮ ਲਿਖਦਾ ਹਾਂ", exampleRomanization: "main naam likhda haan", example_vi: "Tôi viết tên.", example_en: "I write the name." },
    ],
  },
  {
    domain: "service_needs",
    title_vi: "Nhu cầu dịch vụ",
    title_en: "Service Needs",
    purpose_vi: "Động từ để hỏi, xin, mua và nhận trợ giúp.",
    purpose_en: "Verbs for asking, requesting, buying, and getting help.",
    entries: [
      { id: "pa-verb-service-001", domain: "service_needs", level: "A1", gurmukhi: "ਚਾਹੁਣਾ", romanization: "chahuna", vi: "muốn", en: "to want", exampleGurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ", exampleRomanization: "mainu pani chahida hai", example_vi: "Tôi cần nước.", example_en: "I need water.", canadaPractical: true },
      { id: "pa-verb-service-002", domain: "service_needs", level: "A1", gurmukhi: "ਲੈਣਾ", romanization: "laina", vi: "lấy / nhận / mua", en: "to take / receive / buy", exampleGurmukhi: "ਮੈਂ ਟਿਕਟ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main tikat lainda haan", example_vi: "Tôi mua vé.", example_en: "I buy a ticket.", canadaPractical: true },
      { id: "pa-verb-service-003", domain: "service_needs", level: "A1", gurmukhi: "ਦੇਣਾ", romanization: "dena", vi: "đưa / cho", en: "to give", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਾਰਮ ਦਿਓ", exampleRomanization: "kirpa karke form dio", example_vi: "Vui lòng đưa tôi mẫu đơn.", example_en: "Please give me the form.", canadaPractical: true },
      { id: "pa-verb-service-004", domain: "service_needs", level: "A2", gurmukhi: "ਮੰਗਣਾ", romanization: "mangna", vi: "xin / yêu cầu", en: "to ask for / request", exampleGurmukhi: "ਮੈਂ ਮਦਦ ਮੰਗਦਾ ਹਾਂ", exampleRomanization: "main madad mangda haan", example_vi: "Tôi xin giúp đỡ.", example_en: "I ask for help.", canadaPractical: true },
      { id: "pa-verb-service-005", domain: "service_needs", level: "A2", gurmukhi: "ਲੱਭਣਾ", romanization: "labbhna", vi: "tìm", en: "to find / search", exampleGurmukhi: "ਮੈਂ ਫਾਰਮੇਸੀ ਲੱਭਦਾ ਹਾਂ", exampleRomanization: "main pharmacy labbhda haan", example_vi: "Tôi tìm nhà thuốc.", example_en: "I am looking for a pharmacy.", canadaPractical: true, learnerTrap: { vi: "ੱ trong ਲੱਭਣਾ báo phụ âm mạnh; đừng bỏ qua.", en: "ੱ in ਲੱਭਣਾ marks a strengthened consonant; do not skip it." } },
      { id: "pa-verb-service-006", domain: "service_needs", level: "A2", gurmukhi: "ਦਿਖਾਉਣਾ", romanization: "dikhauna", vi: "chỉ / cho xem", en: "to show", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਰਸਤਾ ਦਿਖਾਓ", exampleRomanization: "kirpa karke rasta dikhao", example_vi: "Vui lòng chỉ đường.", example_en: "Please show the way.", canadaPractical: true },
      { id: "pa-verb-service-007", domain: "service_needs", level: "A2", gurmukhi: "ਭੇਜਣਾ", romanization: "bhejna", vi: "gửi", en: "to send", exampleGurmukhi: "ਮੈਂ ਸੁਨੇਹਾ ਭੇਜਦਾ ਹਾਂ", exampleRomanization: "main suneha bhejda haan", example_vi: "Tôi gửi tin nhắn.", example_en: "I send a message." },
      { id: "pa-verb-service-008", domain: "service_needs", level: "A2", gurmukhi: "ਉਡੀਕਣਾ", romanization: "udikna", vi: "chờ", en: "to wait", exampleGurmukhi: "ਮੈਂ ਬੱਸ ਦੀ ਉਡੀਕ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main bus di udik karda haan", example_vi: "Tôi chờ xe buýt.", example_en: "I wait for the bus.", canadaPractical: true },
    ],
  },
  {
    domain: "workplace_actions",
    title_vi: "Hành động nơi làm việc",
    title_en: "Workplace Actions",
    purpose_vi: "Động từ để nói lịch làm, họp, báo cáo và sửa việc.",
    purpose_en: "Verbs for schedules, meetings, reporting, and fixing work.",
    entries: [
      { id: "pa-verb-work-001", domain: "workplace_actions", level: "A1", gurmukhi: "ਕੰਮ ਕਰਨਾ", romanization: "kamm karna", vi: "làm việc", en: "to work", exampleGurmukhi: "ਮੈਂ ਅੱਜ ਕੰਮ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main ajj kamm karda haan", example_vi: "Hôm nay tôi làm việc.", example_en: "I work today.", canadaPractical: true },
      { id: "pa-verb-work-002", domain: "workplace_actions", level: "A2", gurmukhi: "ਸ਼ੁਰੂ ਕਰਨਾ", romanization: "shuru karna", vi: "bắt đầu", en: "to start", exampleGurmukhi: "ਮੀਟਿੰਗ ਨੌਂ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ", exampleRomanization: "meeting naun vaje shuru hundi hai", example_vi: "Cuộc họp bắt đầu lúc chín giờ.", example_en: "The meeting starts at nine.", canadaPractical: true },
      { id: "pa-verb-work-003", domain: "workplace_actions", level: "A2", gurmukhi: "ਖਤਮ ਕਰਨਾ", romanization: "khatam karna", vi: "kết thúc / hoàn thành", en: "to finish", exampleGurmukhi: "ਮੈਂ ਕੰਮ ਖਤਮ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main kamm khatam karda haan", example_vi: "Tôi hoàn thành công việc.", example_en: "I finish the work." },
      { id: "pa-verb-work-004", domain: "workplace_actions", level: "B1", gurmukhi: "ਰਿਪੋਰਟ ਕਰਨਾ", romanization: "report karna", vi: "báo cáo", en: "to report", exampleGurmukhi: "ਮੈਂ ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main samassia report karda haan", example_vi: "Tôi báo cáo vấn đề.", example_en: "I report the problem.", canadaPractical: true },
      { id: "pa-verb-work-005", domain: "workplace_actions", level: "B1", gurmukhi: "ਸਮਝਾਉਣਾ", romanization: "samjhauna", vi: "giải thích", en: "to explain", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਫਿਰ ਸਮਝਾਓ", exampleRomanization: "kirpa karke fir samjhao", example_vi: "Vui lòng giải thích lại.", example_en: "Please explain again." },
      { id: "pa-verb-work-006", domain: "workplace_actions", level: "B1", gurmukhi: "ਠੀਕ ਕਰਨਾ", romanization: "theek karna", vi: "sửa / làm đúng", en: "to fix / correct", exampleGurmukhi: "ਮੈਂ ਗਲਤੀ ਠੀਕ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main galti theek karda haan", example_vi: "Tôi sửa lỗi.", example_en: "I fix the mistake.", learnerTrap: { vi: "ਠ là âm bật hơi/quặt lưỡi; romanization th không phải tiếng Anh th.", en: "ਠ is aspirated/retroflex; romanized th is not English th." } },
      { id: "pa-verb-work-007", domain: "workplace_actions", level: "B2", gurmukhi: "ਪੁਸ਼ਟੀ ਕਰਨਾ", romanization: "pushti karna", vi: "xác nhận", en: "to confirm", exampleGurmukhi: "ਮੈਂ ਸਮਾਂ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main sama pushti karda haan", example_vi: "Tôi xác nhận thời gian.", example_en: "I confirm the time.", canadaPractical: true },
      { id: "pa-verb-work-008", domain: "workplace_actions", level: "B2", gurmukhi: "ਮੁਲਾਕਾਤ ਰੱਖਣਾ", romanization: "mulaqat rakhna", vi: "đặt cuộc hẹn", en: "to schedule an appointment", exampleGurmukhi: "ਮੈਂ ਮੁਲਾਕਾਤ ਰੱਖਦਾ ਹਾਂ", exampleRomanization: "main mulaqat rakhda haan", example_vi: "Tôi đặt cuộc hẹn.", example_en: "I schedule an appointment.", canadaPractical: true },
    ],
  },
  {
    domain: "health_descriptions",
    title_vi: "Mô tả sức khỏe",
    title_en: "Health Descriptions",
    purpose_vi: "Động từ và cụm động từ để nói triệu chứng và nhu cầu y tế.",
    purpose_en: "Verbs and verb phrases for symptoms and medical needs.",
    entries: [
      { id: "pa-verb-health-001", domain: "health_descriptions", level: "A1", gurmukhi: "ਦਰਦ ਹੋਣਾ", romanization: "darad hona", vi: "bị đau", en: "to hurt / have pain", exampleGurmukhi: "ਮੇਰੇ ਸਿਰ ਵਿੱਚ ਦਰਦ ਹੈ", exampleRomanization: "mere sir vich darad hai", example_vi: "Tôi bị đau đầu.", example_en: "I have a headache.", canadaPractical: true },
      { id: "pa-verb-health-002", domain: "health_descriptions", level: "A1", gurmukhi: "ਬਿਮਾਰ ਹੋਣਾ", romanization: "bimaar hona", vi: "bị ốm", en: "to be sick", exampleGurmukhi: "ਮੈਂ ਬਿਮਾਰ ਹਾਂ", exampleRomanization: "main bimaar haan", example_vi: "Tôi bị ốm.", example_en: "I am sick.", canadaPractical: true },
      { id: "pa-verb-health-003", domain: "health_descriptions", level: "A2", gurmukhi: "ਖੰਘਣਾ", romanization: "khanghna", vi: "ho", en: "to cough", exampleGurmukhi: "ਬੱਚਾ ਖੰਘਦਾ ਹੈ", exampleRomanization: "bachcha khanghda hai", example_vi: "Đứa trẻ ho.", example_en: "The child coughs.", learnerTrap: { vi: "ੰ trong ਖੰਘਣਾ báo âm mũi; đừng bỏ dấu.", en: "ੰ in ਖੰਘਣਾ marks nasalization; do not drop it." } },
      { id: "pa-verb-health-004", domain: "health_descriptions", level: "A2", gurmukhi: "ਸਾਹ ਲੈਣਾ", romanization: "saah laina", vi: "thở", en: "to breathe", exampleGurmukhi: "ਮੈਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੈ", exampleRomanization: "mainu saah lain vich mushkal hai", example_vi: "Tôi khó thở.", example_en: "I have trouble breathing.", canadaPractical: true },
      { id: "pa-verb-health-005", domain: "health_descriptions", level: "A2", gurmukhi: "ਦਵਾਈ ਲੈਣਾ", romanization: "davai laina", vi: "uống/nhận thuốc", en: "to take medicine", exampleGurmukhi: "ਮੈਂ ਦਵਾਈ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main davai lainda haan", example_vi: "Tôi uống thuốc.", example_en: "I take medicine.", canadaPractical: true },
      { id: "pa-verb-health-006", domain: "health_descriptions", level: "B1", gurmukhi: "ਮਹਿਸੂਸ ਕਰਨਾ", romanization: "mahisus karna", vi: "cảm thấy", en: "to feel", exampleGurmukhi: "ਮੈਂ ਥੱਕਿਆ ਮਹਿਸੂਸ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main thakkia mahisus karda haan", example_vi: "Tôi cảm thấy mệt.", example_en: "I feel tired." },
      { id: "pa-verb-health-007", domain: "health_descriptions", level: "B1", gurmukhi: "ਜਾਂਚ ਕਰਨਾ", romanization: "jaanch karna", vi: "kiểm tra / khám", en: "to check / examine", exampleGurmukhi: "ਡਾਕਟਰ ਜਾਂਚ ਕਰਦਾ ਹੈ", exampleRomanization: "daaktar jaanch karda hai", example_vi: "Bác sĩ kiểm tra.", example_en: "The doctor examines.", canadaPractical: true },
      { id: "pa-verb-health-008", domain: "health_descriptions", level: "B2", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", vi: "đặt lịch hẹn", en: "to book an appointment", exampleGurmukhi: "ਮੈਂ ਡਾਕਟਰ ਦੀ ਐਪਾਇੰਟਮੈਂਟ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main daaktar di appointment lainda haan", example_vi: "Tôi đặt lịch hẹn bác sĩ.", example_en: "I book a doctor's appointment.", canadaPractical: true },
    ],
  },
  {
    domain: "public_service_requests",
    title_vi: "Yêu cầu dịch vụ công",
    title_en: "Public-Service Requests",
    purpose_vi: "Động từ để điền mẫu, hỏi thông tin và xử lý giấy tờ.",
    purpose_en: "Verbs for forms, information requests, and paperwork.",
    entries: [
      { id: "pa-verb-public-001", domain: "public_service_requests", level: "A2", gurmukhi: "ਭਰਨਾ", romanization: "bharna", vi: "điền", en: "to fill in", exampleGurmukhi: "ਮੈਂ ਫਾਰਮ ਭਰਦਾ ਹਾਂ", exampleRomanization: "main form bharda haan", example_vi: "Tôi điền mẫu đơn.", example_en: "I fill in the form.", canadaPractical: true },
      { id: "pa-verb-public-002", domain: "public_service_requests", level: "A2", gurmukhi: "ਦਸਤਖਤ ਕਰਨਾ", romanization: "dastakhat karna", vi: "ký tên", en: "to sign", exampleGurmukhi: "ਇੱਥੇ ਦਸਤਖਤ ਕਰੋ", exampleRomanization: "itthe dastakhat karo", example_vi: "Ký ở đây.", example_en: "Sign here.", canadaPractical: true },
      { id: "pa-verb-public-003", domain: "public_service_requests", level: "B1", gurmukhi: "ਅਰਜ਼ੀ ਦੇਣਾ", romanization: "arzi dena", vi: "nộp đơn", en: "to apply / submit an application", exampleGurmukhi: "ਮੈਂ ਅਰਜ਼ੀ ਦਿੰਦਾ ਹਾਂ", exampleRomanization: "main arzi dinda haan", example_vi: "Tôi nộp đơn.", example_en: "I submit an application.", canadaPractical: true },
      { id: "pa-verb-public-004", domain: "public_service_requests", level: "B1", gurmukhi: "ਪਛਾਣ ਦਿਖਾਉਣਾ", romanization: "pachhan dikhauna", vi: "xuất trình giấy tờ tùy thân", en: "to show identification", exampleGurmukhi: "ਮੈਂ ਪਛਾਣ ਦਿਖਾਉਂਦਾ ਹਾਂ", exampleRomanization: "main pachhan dikhaonda haan", example_vi: "Tôi xuất trình giấy tờ tùy thân.", example_en: "I show identification.", canadaPractical: true },
      { id: "pa-verb-public-005", domain: "public_service_requests", level: "B1", gurmukhi: "ਜਾਣਕਾਰੀ ਲੈਣਾ", romanization: "jaankari laina", vi: "lấy thông tin", en: "to get information", exampleGurmukhi: "ਮੈਂ ਜਾਣਕਾਰੀ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main jaankari lainda haan", example_vi: "Tôi lấy thông tin.", example_en: "I get information.", canadaPractical: true },
      { id: "pa-verb-public-006", domain: "public_service_requests", level: "B2", gurmukhi: "ਅਨੁਵਾਦ ਕਰਨਾ", romanization: "anuvaad karna", vi: "dịch", en: "to translate", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਅਨੁਵਾਦ ਕਰੋ", exampleRomanization: "kirpa karke ih anuvaad karo", example_vi: "Vui lòng dịch cái này.", example_en: "Please translate this.", canadaPractical: true },
      { id: "pa-verb-public-007", domain: "public_service_requests", level: "B2", gurmukhi: "ਸਪਸ਼ਟ ਕਰਨਾ", romanization: "spasht karna", vi: "làm rõ", en: "to clarify", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਨਿਯਮ ਸਪਸ਼ਟ ਕਰੋ", exampleRomanization: "kirpa karke niyam spasht karo", example_vi: "Vui lòng làm rõ quy định.", example_en: "Please clarify the rule.", canadaPractical: true },
      { id: "pa-verb-public-008", domain: "public_service_requests", level: "B2", gurmukhi: "ਰਸੀਦ ਲੈਣਾ", romanization: "rasid laina", vi: "lấy biên lai", en: "to get a receipt", exampleGurmukhi: "ਮੈਂ ਰਸੀਦ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main rasid lainda haan", example_vi: "Tôi lấy biên lai.", example_en: "I get a receipt.", canadaPractical: true },
    ],
  },
  {
    domain: "gurmukhi_romanization_bridge",
    title_vi: "Cầu nối Gurmukhi và romanization",
    title_en: "Gurmukhi and Romanization Bridge",
    purpose_vi: "Những động từ dễ bị tìm sai khi chỉ dùng chữ Latin.",
    purpose_en: "Verbs that are easy to mis-search using Latin letters only.",
    entries: [
      { id: "pa-verb-bridge-001", domain: "gurmukhi_romanization_bridge", level: "A2", gurmukhi: "ਵੇਖਣਾ", romanization: "vekhna/dekhna", vi: "nhìn / xem", en: "to see / look", exampleGurmukhi: "ਮੈਂ ਪਤਾ ਵੇਖਦਾ ਹਾਂ", exampleRomanization: "main pata vekhda haan", example_vi: "Tôi xem địa chỉ.", example_en: "I look at the address.", learnerTrap: { vi: "ਵੇਖਣਾ và ਦੇਖਣਾ đều gặp trong tài liệu; hãy tìm theo Gurmukhi khi có thể.", en: "ਵੇਖਣਾ and ਦੇਖਣਾ both appear in materials; search by Gurmukhi when possible." } },
      { id: "pa-verb-bridge-002", domain: "gurmukhi_romanization_bridge", level: "A1", gurmukhi: "ਸੁਣਨਾ", romanization: "sunna", vi: "nghe", en: "to listen / hear", exampleGurmukhi: "ਮੈਂ ਤੁਹਾਨੂੰ ਸੁਣਦਾ ਹਾਂ", exampleRomanization: "main tuhanu sunda haan", example_vi: "Tôi nghe bạn.", example_en: "I hear you." },
      { id: "pa-verb-bridge-003", domain: "gurmukhi_romanization_bridge", level: "A1", gurmukhi: "ਬੋਲਣਾ", romanization: "bolna", vi: "nói", en: "to speak", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ", exampleRomanization: "kirpa karke hauli bolo", example_vi: "Vui lòng nói chậm.", example_en: "Please speak slowly.", canadaPractical: true },
      { id: "pa-verb-bridge-004", domain: "gurmukhi_romanization_bridge", level: "A1", gurmukhi: "ਸਮਝਣਾ", romanization: "samajhna", vi: "hiểu", en: "to understand", exampleGurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", exampleRomanization: "mainu samajh nahi aai", example_vi: "Tôi chưa hiểu.", example_en: "I did not understand.", canadaPractical: true },
      { id: "pa-verb-bridge-005", domain: "gurmukhi_romanization_bridge", level: "A2", gurmukhi: "ਪੁੱਛਣਾ", romanization: "puchhna", vi: "hỏi", en: "to ask", exampleGurmukhi: "ਮੈਂ ਸਵਾਲ ਪੁੱਛਦਾ ਹਾਂ", exampleRomanization: "main savaal puchhda haan", example_vi: "Tôi hỏi một câu hỏi.", example_en: "I ask a question.", learnerTrap: { vi: "ੱ và ਛ/ਚ romanization có thể làm puchhna khó tìm.", en: "ੱ and ਛ/ਚ romanization can make puchhna hard to search." } },
      { id: "pa-verb-bridge-006", domain: "gurmukhi_romanization_bridge", level: "A2", gurmukhi: "ਖੋਲ੍ਹਣਾ", romanization: "kholhna", vi: "mở", en: "to open", exampleGurmukhi: "ਦਰਵਾਜ਼ਾ ਖੋਲ੍ਹੋ", exampleRomanization: "darvaza kholho", example_vi: "Mở cửa.", example_en: "Open the door.", learnerTrap: { vi: "੍ਹ có thể biến mất trong romanization đơn giản.", en: "੍ਹ may disappear in simplified romanization." } },
      { id: "pa-verb-bridge-007", domain: "gurmukhi_romanization_bridge", level: "A2", gurmukhi: "ਬੰਦ ਕਰਨਾ", romanization: "band karna", vi: "đóng / tắt", en: "to close / turn off", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਦਰਵਾਜ਼ਾ ਬੰਦ ਕਰੋ", exampleRomanization: "kirpa karke darvaza band karo", example_vi: "Vui lòng đóng cửa.", example_en: "Please close the door." },
      { id: "pa-verb-bridge-008", domain: "gurmukhi_romanization_bridge", level: "B1", gurmukhi: "ਸੁਧਾਰਨਾ", romanization: "sudharna", vi: "cải thiện / sửa cho tốt hơn", en: "to improve / correct", exampleGurmukhi: "ਮੈਂ ਆਪਣੀ ਪੰਜਾਬੀ ਸੁਧਾਰਦਾ ਹਾਂ", exampleRomanization: "main apni punjabi sudharda haan", example_vi: "Tôi cải thiện tiếng Punjabi của mình.", example_en: "I improve my Punjabi." },
    ],
  },
  {
    domain: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness",
    purpose_vi: "Giữ trọng tâm Gurmukhi và chỉ nhắc hệ chữ khác để nhận biết.",
    purpose_en: "Keep Gurmukhi primary and mention the other script only for awareness.",
    entries: [
      { id: "pa-verb-shahmukhi-001", domain: "shahmukhi_awareness", level: "A1", gurmukhi: "ਪੜ੍ਹਨਾ", romanization: "parhna", vi: "đọc / học", en: "to read / study", exampleGurmukhi: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ", exampleRomanization: "asi gurmukhi parhde haan", example_vi: "Chúng ta đọc Gurmukhi.", example_en: "We read Gurmukhi.", learnerTrap: { vi: "Punjabi cũng có Shahmukhi trong một số cộng đồng, nhưng bộ này không phải khóa Shahmukhi đầy đủ.", en: "Punjabi also has Shahmukhi in some communities, but this is not a full Shahmukhi course." } },
    ],
  },
];

export const PUNJABI_HIGH_FREQUENCY_VERB_DECK = sections;

export const PUNJABI_HIGH_FREQUENCY_VERB_ENTRIES: ReadonlyArray<PunjabiVerbEntry> =
  sections.flatMap((section) => section.entries);

export default PUNJABI_HIGH_FREQUENCY_VERB_DECK;
