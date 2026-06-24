// src/languages/punjabi/collocationDeck.ts
//
// Punjabi collocation deck for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is a reading/search bridge only.
// No audio, pronunciation scoring, or native-review claim.

export type PunjabiCollocationDomain =
  | "verb_noun_pairs"
  | "service_phrases"
  | "workplace_phrases"
  | "health_phrases"
  | "school_phrases"
  | "housing_phrases"
  | "transport_phrases"
  | "gurmukhi_romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiCollocationLevel = "A1" | "A2" | "B1" | "B2";

export type PunjabiCollocationEntry = {
  id: string;
  domain: PunjabiCollocationDomain;
  level: PunjabiCollocationLevel;
  gurmukhi: string;
  romanization: string;
  vi: string;
  en: string;
  pattern_vi: string;
  pattern_en: string;
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

export type PunjabiCollocationSection = {
  domain: PunjabiCollocationDomain;
  title_vi: string;
  title_en: string;
  purpose_vi: string;
  purpose_en: string;
  entries: ReadonlyArray<PunjabiCollocationEntry>;
};

export const PUNJABI_COLLOCATION_SCOPE = {
  vi: "Bộ collocation này dùng Gurmukhi làm chính. Romanization giúp đọc và tìm kiếm, không phải phát âm chấm điểm. Shahmukhi chỉ được nhắc để nhận biết Punjabi có hệ chữ khác; đây không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This collocation deck uses Gurmukhi as primary. Romanization supports reading and search, not pronunciation scoring. Shahmukhi is mentioned only so learners know Punjabi has another script; this is not a full Shahmukhi course. Native review is deferred.",
} as const;

const sections: ReadonlyArray<PunjabiCollocationSection> = [
  {
    domain: "verb_noun_pairs",
    title_vi: "Cặp động từ + danh từ",
    title_en: "Verb-Noun Pairs",
    purpose_vi: "Những cụm lõi dùng để tự tạo câu ngắn.",
    purpose_en: "Core chunks for building short sentences.",
    entries: [
      { id: "pa-collocation-vn-001", domain: "verb_noun_pairs", level: "A1", gurmukhi: "ਕੰਮ ਕਰਨਾ", romanization: "kamm karna", vi: "làm việc", en: "to work", pattern_vi: "danh từ + ਕਰਨਾ tạo cụm hành động", pattern_en: "noun + ਕਰਨਾ forms an action phrase", exampleGurmukhi: "ਮੈਂ ਅੱਜ ਕੰਮ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main ajj kamm karda haan", example_vi: "Hôm nay tôi làm việc.", example_en: "I work today.", canadaPractical: true },
      { id: "pa-collocation-vn-002", domain: "verb_noun_pairs", level: "A1", gurmukhi: "ਮਦਦ ਕਰਨਾ", romanization: "madad karna", vi: "giúp đỡ", en: "to help", pattern_vi: "ਮਦਦ + ਕਰਨਾ nghĩa là giúp", pattern_en: "ਮਦਦ + ਕਰਨਾ means to help", exampleGurmukhi: "ਉਹ ਮਦਦ ਕਰਦਾ ਹੈ", exampleRomanization: "oh madad karda hai", example_vi: "Anh ấy giúp đỡ.", example_en: "He helps." },
      { id: "pa-collocation-vn-003", domain: "verb_noun_pairs", level: "A1", gurmukhi: "ਸਵਾਲ ਪੁੱਛਣਾ", romanization: "savaal puchhna", vi: "hỏi câu hỏi", en: "to ask a question", pattern_vi: "ਸਵਾਲ + ਪੁੱਛਣਾ là cụm hỏi tự nhiên", pattern_en: "ਸਵਾਲ + ਪੁੱਛਣਾ is the natural asking phrase", exampleGurmukhi: "ਮੈਂ ਸਵਾਲ ਪੁੱਛਦਾ ਹਾਂ", exampleRomanization: "main savaal puchhda haan", example_vi: "Tôi hỏi một câu hỏi.", example_en: "I ask a question.", learnerTrap: { vi: "ੱ trong ਪੁੱਛਣਾ dễ bị bỏ khi đọc nhanh.", en: "ੱ in ਪੁੱਛਣਾ is easy to skip when reading quickly." } },
      { id: "pa-collocation-vn-004", domain: "verb_noun_pairs", level: "A2", gurmukhi: "ਜਵਾਬ ਦੇਣਾ", romanization: "javaab dena", vi: "trả lời", en: "to answer", pattern_vi: "ਜਵਾਬ + ਦੇਣਾ là đưa câu trả lời", pattern_en: "ਜਵਾਬ + ਦੇਣਾ means to give an answer", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਜਵਾਬ ਦਿਓ", exampleRomanization: "kirpa karke javaab dio", example_vi: "Vui lòng trả lời.", example_en: "Please answer." },
      { id: "pa-collocation-vn-005", domain: "verb_noun_pairs", level: "A2", gurmukhi: "ਫੈਸਲਾ ਕਰਨਾ", romanization: "faisla karna", vi: "quyết định", en: "to decide", pattern_vi: "ਫੈਸਲਾ + ਕਰਨਾ tạo động từ quyết định", pattern_en: "ਫੈਸਲਾ + ਕਰਨਾ creates the verb decide", exampleGurmukhi: "ਅਸੀਂ ਫੈਸਲਾ ਕਰਦੇ ਹਾਂ", exampleRomanization: "asi faisla karde haan", example_vi: "Chúng ta quyết định.", example_en: "We decide." },
      { id: "pa-collocation-vn-006", domain: "verb_noun_pairs", level: "A2", gurmukhi: "ਕੋਸ਼ਿਸ਼ ਕਰਨਾ", romanization: "koshish karna", vi: "cố gắng", en: "to try", pattern_vi: "ਕੋਸ਼ਿਸ਼ + ਕਰਨਾ nghĩa là cố gắng", pattern_en: "ਕੋਸ਼ਿਸ਼ + ਕਰਨਾ means to try", exampleGurmukhi: "ਮੈਂ ਕੋਸ਼ਿਸ਼ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main koshish karda haan", example_vi: "Tôi cố gắng.", example_en: "I try.", learnerTrap: { vi: "ਸ਼/ਸ਼ có thể romanize là sh; hãy ưu tiên Gurmukhi.", en: "ਸ਼/ਸ਼ may romanize as sh; prioritize Gurmukhi." } },
      { id: "pa-collocation-vn-007", domain: "verb_noun_pairs", level: "B1", gurmukhi: "ਗਲਤੀ ਕਰਨਾ", romanization: "galti karna", vi: "mắc lỗi", en: "to make a mistake", pattern_vi: "ਗਲਤੀ + ਕਰਨਾ nói về việc mắc lỗi", pattern_en: "ਗਲਤੀ + ਕਰਨਾ describes making a mistake", exampleGurmukhi: "ਮੈਂ ਗਲਤੀ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main galti karda haan", example_vi: "Tôi mắc lỗi.", example_en: "I make a mistake." },
      { id: "pa-collocation-vn-008", domain: "verb_noun_pairs", level: "B1", gurmukhi: "ਤਿਆਰੀ ਕਰਨਾ", romanization: "tiari karna", vi: "chuẩn bị", en: "to prepare", pattern_vi: "ਤਿਆਰੀ + ਕਰਨਾ là chuẩn bị", pattern_en: "ਤਿਆਰੀ + ਕਰਨਾ means to prepare", exampleGurmukhi: "ਮੈਂ ਮੀਟਿੰਗ ਦੀ ਤਿਆਰੀ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main meeting di tiari karda haan", example_vi: "Tôi chuẩn bị cho cuộc họp.", example_en: "I prepare for the meeting.", canadaPractical: true },
    ],
  },
  {
    domain: "service_phrases",
    title_vi: "Cụm dịch vụ",
    title_en: "Service Phrases",
    purpose_vi: "Cụm để xin, mua, nhận và hỏi trong dịch vụ hằng ngày.",
    purpose_en: "Chunks for requesting, buying, receiving, and asking in daily services.",
    entries: [
      { id: "pa-collocation-service-001", domain: "service_phrases", level: "A1", gurmukhi: "ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ", romanization: "pani chahida hai", vi: "cần nước", en: "need water", pattern_vi: "danh từ + ਚਾਹੀਦਾ ਹੈ để nói cần", pattern_en: "noun + ਚਾਹੀਦਾ ਹੈ expresses need", exampleGurmukhi: "ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ", exampleRomanization: "mainu pani chahida hai", example_vi: "Tôi cần nước.", example_en: "I need water.", canadaPractical: true },
      { id: "pa-collocation-service-002", domain: "service_phrases", level: "A1", gurmukhi: "ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "madad chahidi hai", vi: "cần giúp đỡ", en: "need help", pattern_vi: "ਮਦਦ + ਚਾਹੀਦੀ ਹੈ là cụm cần giúp", pattern_en: "ਮਦਦ + ਚਾਹੀਦੀ ਹੈ means need help", exampleGurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", exampleRomanization: "mainu madad chahidi hai", example_vi: "Tôi cần giúp đỡ.", example_en: "I need help.", canadaPractical: true },
      { id: "pa-collocation-service-003", domain: "service_phrases", level: "A1", gurmukhi: "ਟਿਕਟ ਲੈਣਾ", romanization: "tikat laina", vi: "mua/lấy vé", en: "to get a ticket", pattern_vi: "ਟਿਕਟ + ਲੈਣਾ dùng khi mua vé", pattern_en: "ਟਿਕਟ + ਲੈਣਾ is used for getting a ticket", exampleGurmukhi: "ਮੈਂ ਟਿਕਟ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main tikat lainda haan", example_vi: "Tôi mua vé.", example_en: "I get a ticket.", canadaPractical: true },
      { id: "pa-collocation-service-004", domain: "service_phrases", level: "A2", gurmukhi: "ਰਸੀਦ ਲੈਣਾ", romanization: "rasid laina", vi: "lấy biên lai", en: "to get a receipt", pattern_vi: "ਰਸੀਦ + ਲੈਣਾ dùng sau khi trả tiền", pattern_en: "ਰਸੀਦ + ਲੈਣਾ is used after paying", exampleGurmukhi: "ਮੈਂ ਰਸੀਦ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main rasid lainda haan", example_vi: "Tôi lấy biên lai.", example_en: "I get a receipt.", canadaPractical: true },
      { id: "pa-collocation-service-005", domain: "service_phrases", level: "A2", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", vi: "điền mẫu đơn", en: "to fill out a form", pattern_vi: "ਫਾਰਮ + ਭਰਨਾ là cụm giấy tờ rất thường gặp", pattern_en: "ਫਾਰਮ + ਭਰਨਾ is a very common paperwork phrase", exampleGurmukhi: "ਮੈਂ ਫਾਰਮ ਭਰਦਾ ਹਾਂ", exampleRomanization: "main form bharda haan", example_vi: "Tôi điền mẫu đơn.", example_en: "I fill out the form.", canadaPractical: true, learnerTrap: { vi: "ਫ có thể tìm bằng ph hoặc f trong Latin.", en: "ਫ may be searched with ph or f in Latin." } },
      { id: "pa-collocation-service-006", domain: "service_phrases", level: "A2", gurmukhi: "ਰਸਤਾ ਦਿਖਾਉਣਾ", romanization: "rasta dikhauna", vi: "chỉ đường", en: "to show the way", pattern_vi: "ਰਸਤਾ + ਦਿਖਾਉਣਾ dùng khi hỏi đường", pattern_en: "ਰਸਤਾ + ਦਿਖਾਉਣਾ is used when asking directions", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਰਸਤਾ ਦਿਖਾਓ", exampleRomanization: "kirpa karke rasta dikhao", example_vi: "Vui lòng chỉ đường.", example_en: "Please show the way.", canadaPractical: true },
      { id: "pa-collocation-service-007", domain: "service_phrases", level: "B1", gurmukhi: "ਸਮਾਂ ਲੈਣਾ", romanization: "sama laina", vi: "lấy/đặt giờ hẹn", en: "to take/book a time", pattern_vi: "ਸਮਾਂ + ਲੈਣਾ có thể dùng khi đặt lịch", pattern_en: "ਸਮਾਂ + ਲੈਣਾ can be used for booking a time", exampleGurmukhi: "ਮੈਂ ਡਾਕਟਰ ਲਈ ਸਮਾਂ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main daaktar lai sama lainda haan", example_vi: "Tôi đặt giờ với bác sĩ.", example_en: "I book a time with the doctor.", canadaPractical: true },
    ],
  },
  {
    domain: "workplace_phrases",
    title_vi: "Cụm nơi làm việc",
    title_en: "Workplace Phrases",
    purpose_vi: "Cụm giúp nói về lịch, họp, báo cáo và sửa việc.",
    purpose_en: "Chunks for schedules, meetings, reporting, and fixing work.",
    entries: [
      { id: "pa-collocation-work-001", domain: "workplace_phrases", level: "A2", gurmukhi: "ਮੀਟਿੰਗ ਸ਼ੁਰੂ ਹੋਣਾ", romanization: "meeting shuru hona", vi: "cuộc họp bắt đầu", en: "meeting starts", pattern_vi: "sự kiện + ਸ਼ੁਰੂ ਹੋਣਾ nói bắt đầu", pattern_en: "event + ਸ਼ੁਰੂ ਹੋਣਾ means starts", exampleGurmukhi: "ਮੀਟਿੰਗ ਨੌਂ ਵਜੇ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ", exampleRomanization: "meeting naun vaje shuru hundi hai", example_vi: "Cuộc họp bắt đầu lúc chín giờ.", example_en: "The meeting starts at nine.", canadaPractical: true },
      { id: "pa-collocation-work-002", domain: "workplace_phrases", level: "A2", gurmukhi: "ਕੰਮ ਖਤਮ ਕਰਨਾ", romanization: "kamm khatam karna", vi: "hoàn thành công việc", en: "to finish work", pattern_vi: "ਕੰਮ + ਖਤਮ ਕਰਨਾ là hoàn thành việc", pattern_en: "ਕੰਮ + ਖਤਮ ਕਰਨਾ means finish work", exampleGurmukhi: "ਮੈਂ ਕੰਮ ਖਤਮ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main kamm khatam karda haan", example_vi: "Tôi hoàn thành công việc.", example_en: "I finish the work." },
      { id: "pa-collocation-work-003", domain: "workplace_phrases", level: "B1", gurmukhi: "ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰਨਾ", romanization: "samassia report karna", vi: "báo cáo vấn đề", en: "to report a problem", pattern_vi: "ਸਮੱਸਿਆ + ਰਿਪੋਰਟ ਕਰਨਾ dùng ở nơi làm việc", pattern_en: "ਸਮੱਸਿਆ + ਰਿਪੋਰਟ ਕਰਨਾ is used at work", exampleGurmukhi: "ਮੈਂ ਸਮੱਸਿਆ ਰਿਪੋਰਟ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main samassia report karda haan", example_vi: "Tôi báo cáo vấn đề.", example_en: "I report the problem.", canadaPractical: true },
      { id: "pa-collocation-work-004", domain: "workplace_phrases", level: "B1", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", vi: "sửa lỗi", en: "to fix a mistake", pattern_vi: "ਗਲਤੀ + ਠੀਕ ਕਰਨਾ là sửa lỗi", pattern_en: "ਗਲਤੀ + ਠੀਕ ਕਰਨਾ means fix a mistake", exampleGurmukhi: "ਮੈਂ ਗਲਤੀ ਠੀਕ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main galti theek karda haan", example_vi: "Tôi sửa lỗi.", example_en: "I fix the mistake.", learnerTrap: { vi: "ਠ romanize là th nhưng không phải âm th tiếng Anh.", en: "ਠ romanizes as th but is not English th." } },
      { id: "pa-collocation-work-005", domain: "workplace_phrases", level: "B1", gurmukhi: "ਛੁੱਟੀ ਲੈਣਾ", romanization: "chhutti laina", vi: "xin nghỉ / lấy ngày nghỉ", en: "to take leave", pattern_vi: "ਛੁੱਟੀ + ਲੈਣਾ dùng cho ngày nghỉ", pattern_en: "ਛੁੱਟੀ + ਲੈਣਾ is used for leave/day off", exampleGurmukhi: "ਮੈਂ ਕੱਲ੍ਹ ਛੁੱਟੀ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main kallh chhutti lainda haan", example_vi: "Ngày mai tôi nghỉ.", example_en: "I take leave tomorrow.", canadaPractical: true, learnerTrap: { vi: "ੱ trong ਛੁੱਟੀ báo phụ âm mạnh.", en: "ੱ in ਛੁੱਟੀ marks a strengthened consonant." } },
      { id: "pa-collocation-work-006", domain: "workplace_phrases", level: "B2", gurmukhi: "ਸਮਾਂ ਪੁਸ਼ਟੀ ਕਰਨਾ", romanization: "sama pushti karna", vi: "xác nhận thời gian", en: "to confirm the time", pattern_vi: "ਸਮਾਂ + ਪੁਸ਼ਟੀ ਕਰਨਾ dùng khi xác nhận lịch", pattern_en: "ਸਮਾਂ + ਪੁਸ਼ਟੀ ਕਰਨਾ is used to confirm scheduling", exampleGurmukhi: "ਮੈਂ ਸਮਾਂ ਪੁਸ਼ਟੀ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main sama pushti karda haan", example_vi: "Tôi xác nhận thời gian.", example_en: "I confirm the time.", canadaPractical: true },
    ],
  },
  {
    domain: "health_phrases",
    title_vi: "Cụm sức khỏe",
    title_en: "Health Phrases",
    purpose_vi: "Cụm để mô tả triệu chứng và xử lý phòng khám/nhà thuốc.",
    purpose_en: "Chunks for symptoms, clinics, and pharmacies.",
    entries: [
      { id: "pa-collocation-health-001", domain: "health_phrases", level: "A1", gurmukhi: "ਦਰਦ ਹੋਣਾ", romanization: "darad hona", vi: "bị đau", en: "to have pain", pattern_vi: "bộ phận/cơ thể + ਦਰਦ ਹੋਣਾ", pattern_en: "body area + ਦਰਦ ਹੋਣਾ means have pain", exampleGurmukhi: "ਮੇਰੇ ਸਿਰ ਵਿੱਚ ਦਰਦ ਹੈ", exampleRomanization: "mere sir vich darad hai", example_vi: "Tôi bị đau đầu.", example_en: "I have a headache.", canadaPractical: true },
      { id: "pa-collocation-health-002", domain: "health_phrases", level: "A1", gurmukhi: "ਬਿਮਾਰ ਹੋਣਾ", romanization: "bimaar hona", vi: "bị ốm", en: "to be sick", pattern_vi: "tính từ/trạng thái + ਹੋਣਾ", pattern_en: "adjective/state + ਹੋਣਾ expresses being", exampleGurmukhi: "ਮੈਂ ਬਿਮਾਰ ਹਾਂ", exampleRomanization: "main bimaar haan", example_vi: "Tôi bị ốm.", example_en: "I am sick.", canadaPractical: true },
      { id: "pa-collocation-health-003", domain: "health_phrases", level: "A2", gurmukhi: "ਦਵਾਈ ਲੈਣਾ", romanization: "davai laina", vi: "uống/nhận thuốc", en: "to take medicine", pattern_vi: "ਦਵਾਈ + ਲੈਣਾ dùng ở nhà thuốc/phòng khám", pattern_en: "ਦਵਾਈ + ਲੈਣਾ is used at pharmacy/clinic", exampleGurmukhi: "ਮੈਂ ਦਵਾਈ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main davai lainda haan", example_vi: "Tôi uống thuốc.", example_en: "I take medicine.", canadaPractical: true },
      { id: "pa-collocation-health-004", domain: "health_phrases", level: "A2", gurmukhi: "ਸਾਹ ਲੈਣਾ", romanization: "saah laina", vi: "thở", en: "to breathe", pattern_vi: "ਸਾਹ + ਲੈਣਾ là cụm thở", pattern_en: "ਸਾਹ + ਲੈਣਾ means to breathe", exampleGurmukhi: "ਮੈਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੈ", exampleRomanization: "mainu saah lain vich mushkal hai", example_vi: "Tôi khó thở.", example_en: "I have trouble breathing.", canadaPractical: true },
      { id: "pa-collocation-health-005", domain: "health_phrases", level: "B1", gurmukhi: "ਡਾਕਟਰ ਨੂੰ ਵੇਖਣਾ", romanization: "daaktar nu vekhna", vi: "đi gặp bác sĩ", en: "to see a doctor", pattern_vi: "người + ਨੂੰ + ਵੇਖਣਾ trong ngữ cảnh gặp ai", pattern_en: "person + ਨੂੰ + ਵੇਖਣਾ can mean see someone", exampleGurmukhi: "ਮੈਂ ਡਾਕਟਰ ਨੂੰ ਵੇਖਦਾ ਹਾਂ", exampleRomanization: "main daaktar nu vekhda haan", example_vi: "Tôi gặp bác sĩ.", example_en: "I see a doctor.", canadaPractical: true, learnerTrap: { vi: "ਵੇਖਣਾ/dekhna có biến thể romanization; xem Gurmukhi.", en: "ਵੇਖਣਾ/dekhna has romanization variation; check Gurmukhi." } },
      { id: "pa-collocation-health-006", domain: "health_phrases", level: "B2", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", vi: "đặt lịch hẹn", en: "to book an appointment", pattern_vi: "ਐਪਾਇੰਟਮੈਂਟ + ਲੈਣਾ là cụm rất thực dụng ở Canada", pattern_en: "ਐਪਾਇੰਟਮੈਂਟ + ਲੈਣਾ is very practical in Canada", exampleGurmukhi: "ਮੈਂ ਡਾਕਟਰ ਦੀ ਐਪਾਇੰਟਮੈਂਟ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main daaktar di appointment lainda haan", example_vi: "Tôi đặt lịch hẹn bác sĩ.", example_en: "I book a doctor's appointment.", canadaPractical: true },
    ],
  },
  {
    domain: "school_phrases",
    title_vi: "Cụm trường học",
    title_en: "School Phrases",
    purpose_vi: "Cụm để nói việc học, bài tập, lớp và giáo viên.",
    purpose_en: "Chunks for study, homework, class, and teachers.",
    entries: [
      { id: "pa-collocation-school-001", domain: "school_phrases", level: "A1", gurmukhi: "ਪੰਜਾਬੀ ਪੜ੍ਹਨਾ", romanization: "punjabi parhna", vi: "học/đọc Punjabi", en: "to study/read Punjabi", pattern_vi: "môn học + ਪੜ੍ਹਨਾ", pattern_en: "subject + ਪੜ੍ਹਨਾ", exampleGurmukhi: "ਮੈਂ ਪੰਜਾਬੀ ਪੜ੍ਹਦਾ ਹਾਂ", exampleRomanization: "main punjabi parhda haan", example_vi: "Tôi học Punjabi.", example_en: "I study Punjabi." },
      { id: "pa-collocation-school-002", domain: "school_phrases", level: "A1", gurmukhi: "ਨਾਮ ਲਿਖਣਾ", romanization: "naam likhna", vi: "viết tên", en: "to write a name", pattern_vi: "danh từ + ਲਿਖਣਾ là viết thứ đó", pattern_en: "noun + ਲਿਖਣਾ means write that thing", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਨਾਮ ਲਿਖੋ", exampleRomanization: "kirpa karke naam likho", example_vi: "Vui lòng viết tên.", example_en: "Please write the name.", canadaPractical: true },
      { id: "pa-collocation-school-003", domain: "school_phrases", level: "A2", gurmukhi: "ਹੋਮਵਰਕ ਕਰਨਾ", romanization: "homework karna", vi: "làm bài tập về nhà", en: "to do homework", pattern_vi: "từ mượn + ਕਰਨਾ tạo cụm hành động", pattern_en: "loanword + ਕਰਨਾ creates an action phrase", exampleGurmukhi: "ਬੱਚਾ ਹੋਮਵਰਕ ਕਰਦਾ ਹੈ", exampleRomanization: "bachcha homework karda hai", example_vi: "Đứa trẻ làm bài tập.", example_en: "The child does homework.", canadaPractical: true },
      { id: "pa-collocation-school-004", domain: "school_phrases", level: "A2", gurmukhi: "ਕਲਾਸ ਜਾਣਾ", romanization: "kalaas jana", vi: "đi lớp", en: "to go to class", pattern_vi: "nơi chốn + ਜਾਣਾ để nói đi đến", pattern_en: "place + ਜਾਣਾ means go to a place", exampleGurmukhi: "ਮੈਂ ਕਲਾਸ ਜਾਂਦਾ ਹਾਂ", exampleRomanization: "main kalaas janda haan", example_vi: "Tôi đi lớp.", example_en: "I go to class.", canadaPractical: true },
      { id: "pa-collocation-school-005", domain: "school_phrases", level: "B1", gurmukhi: "ਸਵਾਲ ਸਮਝਣਾ", romanization: "savaal samajhna", vi: "hiểu câu hỏi", en: "to understand a question", pattern_vi: "danh từ + ਸਮਝਣਾ là hiểu thứ đó", pattern_en: "noun + ਸਮਝਣਾ means understand that thing", exampleGurmukhi: "ਮੈਂ ਸਵਾਲ ਸਮਝਦਾ ਹਾਂ", exampleRomanization: "main savaal samajhda haan", example_vi: "Tôi hiểu câu hỏi.", example_en: "I understand the question." },
      { id: "pa-collocation-school-006", domain: "school_phrases", level: "B1", gurmukhi: "ਅਧਿਆਪਕ ਨੂੰ ਪੁੱਛਣਾ", romanization: "adhiaapak nu puchhna", vi: "hỏi giáo viên", en: "to ask the teacher", pattern_vi: "người + ਨੂੰ + ਪੁੱਛਣਾ", pattern_en: "person + ਨੂੰ + ਪੁੱਛਣਾ", exampleGurmukhi: "ਮੈਂ ਅਧਿਆਪਕ ਨੂੰ ਪੁੱਛਦਾ ਹਾਂ", exampleRomanization: "main adhiaapak nu puchhda haan", example_vi: "Tôi hỏi giáo viên.", example_en: "I ask the teacher.", learnerTrap: { vi: "ਨੂੰ đánh dấu người nhận/hướng tới trong cụm này.", en: "ਨੂੰ marks the person targeted in this phrase." } },
    ],
  },
  {
    domain: "housing_phrases",
    title_vi: "Cụm nhà ở",
    title_en: "Housing Phrases",
    purpose_vi: "Cụm khi thuê nhà, sửa chữa và nói tiện ích.",
    purpose_en: "Chunks for renting, repairs, and utilities.",
    entries: [
      { id: "pa-collocation-housing-001", domain: "housing_phrases", level: "A2", gurmukhi: "ਕਿਰਾਇਆ ਦੇਣਾ", romanization: "kiraya dena", vi: "trả tiền thuê", en: "to pay rent", pattern_vi: "ਕਿਰਾਇਆ + ਦੇਣਾ dùng khi trả tiền thuê", pattern_en: "ਕਿਰਾਇਆ + ਦੇਣਾ is used for paying rent", exampleGurmukhi: "ਮੈਂ ਕਿਰਾਇਆ ਦਿੰਦਾ ਹਾਂ", exampleRomanization: "main kiraya dinda haan", example_vi: "Tôi trả tiền thuê.", example_en: "I pay rent.", canadaPractical: true },
      { id: "pa-collocation-housing-002", domain: "housing_phrases", level: "A2", gurmukhi: "ਮੁਰੰਮਤ ਕਰਨਾ", romanization: "murammat karna", vi: "sửa chữa", en: "to repair", pattern_vi: "ਮੁਰੰਮਤ + ਕਰਨਾ là sửa chữa", pattern_en: "ਮੁਰੰਮਤ + ਕਰਨਾ means to repair", exampleGurmukhi: "ਮਾਲਕ ਮੁਰੰਮਤ ਕਰਦਾ ਹੈ", exampleRomanization: "maalak murammat karda hai", example_vi: "Chủ nhà sửa chữa.", example_en: "The landlord repairs.", canadaPractical: true },
      { id: "pa-collocation-housing-003", domain: "housing_phrases", level: "B1", gurmukhi: "ਸਮੱਸਿਆ ਦੱਸਣਾ", romanization: "samassia dassna", vi: "nói/báo vấn đề", en: "to state a problem", pattern_vi: "ਸਮੱਸਿਆ + ਦੱਸਣਾ dùng khi báo lỗi nhà ở", pattern_en: "ਸਮੱਸਿਆ + ਦੱਸਣਾ is used for reporting housing issues", exampleGurmukhi: "ਮੈਂ ਸਮੱਸਿਆ ਦੱਸਦਾ ਹਾਂ", exampleRomanization: "main samassia dassda haan", example_vi: "Tôi báo vấn đề.", example_en: "I state the problem.", canadaPractical: true },
      { id: "pa-collocation-housing-004", domain: "housing_phrases", level: "B1", gurmukhi: "ਬਿਜਲੀ ਬੰਦ ਹੋਣਾ", romanization: "bijli band hona", vi: "mất điện", en: "electricity goes out", pattern_vi: "tiện ích + ਬੰਦ ਹੋਣਾ báo ngừng hoạt động", pattern_en: "utility + ਬੰਦ ਹੋਣਾ reports service stopping", exampleGurmukhi: "ਬਿਜਲੀ ਬੰਦ ਹੈ", exampleRomanization: "bijli band hai", example_vi: "Điện bị mất.", example_en: "The electricity is out.", canadaPractical: true },
      { id: "pa-collocation-housing-005", domain: "housing_phrases", level: "B1", gurmukhi: "ਪਾਣੀ ਆਉਣਾ", romanization: "pani auna", vi: "nước chạy/có nước", en: "water comes/runs", pattern_vi: "ਪਾਣੀ + ਆਉਣਾ nói có dòng nước", pattern_en: "ਪਾਣੀ + ਆਉਣਾ means water is running/available", exampleGurmukhi: "ਪਾਣੀ ਨਹੀਂ ਆਉਂਦਾ", exampleRomanization: "pani nahi aunda", example_vi: "Không có nước.", example_en: "The water is not running.", canadaPractical: true },
      { id: "pa-collocation-housing-006", domain: "housing_phrases", level: "B2", gurmukhi: "ਲੀਜ਼ ਸਾਈਨ ਕਰਨਾ", romanization: "lease sign karna", vi: "ký hợp đồng thuê", en: "to sign a lease", pattern_vi: "từ mượn + ਸਾਈਨ ਕਰਨਾ dùng cho giấy tờ", pattern_en: "loanword + ਸਾਈਨ ਕਰਨਾ is used for paperwork", exampleGurmukhi: "ਮੈਂ ਲੀਜ਼ ਸਾਈਨ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main lease sign karda haan", example_vi: "Tôi ký hợp đồng thuê.", example_en: "I sign the lease.", canadaPractical: true },
    ],
  },
  {
    domain: "transport_phrases",
    title_vi: "Cụm giao thông",
    title_en: "Transport Phrases",
    purpose_vi: "Cụm để đi xe buýt, tàu, nhà ga và sân bay.",
    purpose_en: "Chunks for buses, trains, stations, and airports.",
    entries: [
      { id: "pa-collocation-transport-001", domain: "transport_phrases", level: "A1", gurmukhi: "ਬੱਸ ਲੈਣਾ", romanization: "bus laina", vi: "đi/lấy xe buýt", en: "to take the bus", pattern_vi: "phương tiện + ਲੈਣਾ có thể nói đi phương tiện", pattern_en: "vehicle + ਲੈਣਾ can mean take transport", exampleGurmukhi: "ਮੈਂ ਬੱਸ ਲੈਂਦਾ ਹਾਂ", exampleRomanization: "main bus lainda haan", example_vi: "Tôi đi xe buýt.", example_en: "I take the bus.", canadaPractical: true },
      { id: "pa-collocation-transport-002", domain: "transport_phrases", level: "A1", gurmukhi: "ਬੱਸ ਦੀ ਉਡੀਕ ਕਰਨਾ", romanization: "bus di udik karna", vi: "chờ xe buýt", en: "to wait for the bus", pattern_vi: "X ਦੀ ਉਡੀਕ ਕਰਨਾ là chờ X", pattern_en: "X ਦੀ ਉਡੀਕ ਕਰਨਾ means wait for X", exampleGurmukhi: "ਮੈਂ ਬੱਸ ਦੀ ਉਡੀਕ ਕਰਦਾ ਹਾਂ", exampleRomanization: "main bus di udik karda haan", example_vi: "Tôi chờ xe buýt.", example_en: "I wait for the bus.", canadaPractical: true },
      { id: "pa-collocation-transport-003", domain: "transport_phrases", level: "A2", gurmukhi: "ਸਟੇਸ਼ਨ ਜਾਣਾ", romanization: "station jana", vi: "đi đến nhà ga/trạm", en: "to go to the station", pattern_vi: "nơi chốn + ਜਾਣਾ để nói điểm đến", pattern_en: "place + ਜਾਣਾ means go to a destination", exampleGurmukhi: "ਮੈਂ ਸਟੇਸ਼ਨ ਜਾਂਦਾ ਹਾਂ", exampleRomanization: "main station janda haan", example_vi: "Tôi đi đến nhà ga.", example_en: "I go to the station.", canadaPractical: true, learnerTrap: { vi: "ਸ਼ trong ਸਟੇਸ਼ਨ thường romanize là sh.", en: "ਸ਼ in ਸਟੇਸ਼ਨ is often romanized as sh." } },
      { id: "pa-collocation-transport-004", domain: "transport_phrases", level: "A2", gurmukhi: "ਟਿਕਟ ਖਰੀਦਣਾ", romanization: "tikat kharidna", vi: "mua vé", en: "to buy a ticket", pattern_vi: "ਵਸਤੂ + ਖਰੀਦਣਾ là mua thứ đó", pattern_en: "item + ਖਰੀਦਣਾ means buy that item", exampleGurmukhi: "ਮੈਂ ਟਿਕਟ ਖਰੀਦਦਾ ਹਾਂ", exampleRomanization: "main tikat kharidda haan", example_vi: "Tôi mua vé.", example_en: "I buy a ticket.", canadaPractical: true },
      { id: "pa-collocation-transport-005", domain: "transport_phrases", level: "B1", gurmukhi: "ਰਸਤਾ ਪੁੱਛਣਾ", romanization: "rasta puchhna", vi: "hỏi đường", en: "to ask directions", pattern_vi: "ਰਸਤਾ + ਪੁੱਛਣਾ dùng khi hỏi đường", pattern_en: "ਰਸਤਾ + ਪੁੱਛਣਾ is used for asking directions", exampleGurmukhi: "ਮੈਂ ਰਸਤਾ ਪੁੱਛਦਾ ਹਾਂ", exampleRomanization: "main rasta puchhda haan", example_vi: "Tôi hỏi đường.", example_en: "I ask directions.", canadaPractical: true },
      { id: "pa-collocation-transport-006", domain: "transport_phrases", level: "B1", gurmukhi: "ਹਵਾਈ ਅੱਡਾ ਜਾਣਾ", romanization: "havaai adda jana", vi: "đi sân bay", en: "to go to the airport", pattern_vi: "địa điểm + ਜਾਣਾ dùng cho điểm đến", pattern_en: "place + ਜਾਣਾ is used for destinations", exampleGurmukhi: "ਮੈਂ ਹਵਾਈ ਅੱਡਾ ਜਾਂਦਾ ਹਾਂ", exampleRomanization: "main havaai adda janda haan", example_vi: "Tôi đi sân bay.", example_en: "I go to the airport.", canadaPractical: true },
    ],
  },
  {
    domain: "gurmukhi_romanization_bridge",
    title_vi: "Cầu nối Gurmukhi và romanization",
    title_en: "Gurmukhi and Romanization Bridge",
    purpose_vi: "Cụm dễ tìm sai nếu chỉ dựa vào chữ Latin.",
    purpose_en: "Phrases that are easy to mis-search using Latin letters only.",
    entries: [
      { id: "pa-collocation-bridge-001", domain: "gurmukhi_romanization_bridge", level: "A1", gurmukhi: "ਹੌਲੀ ਬੋਲਣਾ", romanization: "hauli bolna", vi: "nói chậm", en: "to speak slowly", pattern_vi: "trạng từ + ਬੋਲਣਾ để nói cách nói", pattern_en: "adverb + ਬੋਲਣਾ describes how to speak", exampleGurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ", exampleRomanization: "kirpa karke hauli bolo", example_vi: "Vui lòng nói chậm.", example_en: "Please speak slowly.", canadaPractical: true },
      { id: "pa-collocation-bridge-002", domain: "gurmukhi_romanization_bridge", level: "A2", gurmukhi: "ਫਲ ਖਰੀਦਣਾ", romanization: "phal/fal kharidna", vi: "mua trái cây", en: "to buy fruit", pattern_vi: "ਫ có thể tìm bằng ph hoặc f", pattern_en: "ਫ may be searched as ph or f", exampleGurmukhi: "ਮੈਂ ਫਲ ਖਰੀਦਦਾ ਹਾਂ", exampleRomanization: "main phal kharidda haan", example_vi: "Tôi mua trái cây.", example_en: "I buy fruit.", learnerTrap: { vi: "Thử phal và fal khi tìm bằng Latin.", en: "Try phal and fal when searching in Latin." } },
      { id: "pa-collocation-bridge-003", domain: "gurmukhi_romanization_bridge", level: "A2", gurmukhi: "ਵੱਡਾ ਕਮਰਾ", romanization: "vadda/wadda kamra", vi: "phòng lớn", en: "big room", pattern_vi: "ਵ có thể gần v/w theo giọng", pattern_en: "ਵ may be v/w depending on accent", exampleGurmukhi: "ਇਹ ਵੱਡਾ ਕਮਰਾ ਹੈ", exampleRomanization: "ih vadda kamra hai", example_vi: "Đây là phòng lớn.", example_en: "This is a big room.", learnerTrap: { vi: "vadda/wadda là biến thể romanization, không phải hai từ Gurmukhi.", en: "vadda/wadda are romanization variants, not two Gurmukhi words." } },
      { id: "pa-collocation-bridge-004", domain: "gurmukhi_romanization_bridge", level: "A2", gurmukhi: "ਕੀ ਚਾਹੀਦਾ ਹੈ", romanization: "ki/kii chahida hai", vi: "cần gì", en: "what is needed", pattern_vi: "ਕੀ có ੀ; romanization có thể là ki/kii", pattern_en: "ਕੀ has ੀ; romanization may be ki/kii", exampleGurmukhi: "ਤੁਹਾਨੂੰ ਕੀ ਚਾਹੀਦਾ ਹੈ", exampleRomanization: "tuhanu ki chahida hai", example_vi: "Bạn cần gì?", example_en: "What do you need?", canadaPractical: true },
      { id: "pa-collocation-bridge-005", domain: "gurmukhi_romanization_bridge", level: "B1", gurmukhi: "ਸ਼ਹਿਰ ਜਾਣਾ", romanization: "shahir/shehar jana", vi: "đi thành phố", en: "to go to the city", pattern_vi: "ਸ਼ có thể romanize sh và nguyên âm có biến thể", pattern_en: "ਸ਼ may romanize as sh and vowels can vary", exampleGurmukhi: "ਮੈਂ ਸ਼ਹਿਰ ਜਾਂਦਾ ਹਾਂ", exampleRomanization: "main shahir janda haan", example_vi: "Tôi đi thành phố.", example_en: "I go to the city.", learnerTrap: { vi: "shahir/shehar là biến thể tìm kiếm.", en: "shahir/shehar are search variants." } },
      { id: "pa-collocation-bridge-006", domain: "gurmukhi_romanization_bridge", level: "B1", gurmukhi: "ਕੱਲ੍ਹ ਆਉਣਾ", romanization: "kallh/kal auna", vi: "đến ngày mai/hôm qua theo ngữ cảnh", en: "to come tomorrow/yesterday by context", pattern_vi: "ਕੱਲ੍ਹ phụ thuộc ngữ cảnh; cần câu đầy đủ", pattern_en: "ਕੱਲ੍ਹ depends on context; use the full sentence", exampleGurmukhi: "ਮੈਂ ਕੱਲ੍ਹ ਆਉਂਦਾ ਹਾਂ", exampleRomanization: "main kallh aunda haan", example_vi: "Tôi đến ngày mai/hôm qua theo ngữ cảnh.", example_en: "I come tomorrow/yesterday by context.", learnerTrap: { vi: "Không dịch ਕੱਲ੍ਹ một mình nếu thiếu ngữ cảnh.", en: "Do not translate ਕੱਲ੍ਹ alone without context." } },
    ],
  },
  {
    domain: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness",
    purpose_vi: "Nhắc hệ chữ khác nhưng giữ bài học này ở Gurmukhi.",
    purpose_en: "Mention the other script while keeping this lesson in Gurmukhi.",
    entries: [
      { id: "pa-collocation-shahmukhi-001", domain: "shahmukhi_awareness", level: "A1", gurmukhi: "ਗੁਰਮੁਖੀ ਪੜ੍ਹਨਾ", romanization: "gurmukhi parhna", vi: "đọc Gurmukhi", en: "to read Gurmukhi", pattern_vi: "hệ chữ + ਪੜ੍ਹਨਾ để nói đọc chữ", pattern_en: "script + ਪੜ੍ਹਨਾ means read a script", exampleGurmukhi: "ਅਸੀਂ ਗੁਰਮੁਖੀ ਪੜ੍ਹਦੇ ਹਾਂ", exampleRomanization: "asi gurmukhi parhde haan", example_vi: "Chúng ta đọc Gurmukhi.", example_en: "We read Gurmukhi.", learnerTrap: { vi: "Punjabi cũng có Shahmukhi trong một số cộng đồng, nhưng đây không phải khóa Shahmukhi đầy đủ.", en: "Punjabi also has Shahmukhi in some communities, but this is not a full Shahmukhi course." } },
    ],
  },
];

export const PUNJABI_COLLOCATION_DECK = sections;

export const PUNJABI_COLLOCATION_ENTRIES: ReadonlyArray<PunjabiCollocationEntry> =
  sections.flatMap((section) => section.entries);

export default PUNJABI_COLLOCATION_DECK;
