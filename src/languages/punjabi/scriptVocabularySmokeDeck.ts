// src/languages/punjabi/scriptVocabularySmokeDeck.ts
//
// Punjabi script and vocabulary smoke deck for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization is a bridge.
// Native review is deferred.

export type PunjabiSmokeDeckArea =
  | "gurmukhi_recognition"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "service_words"
  | "thematic_vocabulary"
  | "high_frequency_verbs"
  | "collocations"
  | "romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiSmokeDeckUse = "smoke_check" | "final_qa" | "integration_readiness";

export type PunjabiSmokeDeckItem = {
  id: string;
  area: PunjabiSmokeDeckArea;
  use: PunjabiSmokeDeckUse;
  gurmukhi: string;
  romanization?: string;
  prompt_vi: string;
  prompt_en: string;
  passSignal_vi: string;
  passSignal_en: string;
  repairPath_vi: string;
  repairPath_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  finalQA?: boolean;
  integrationReady?: boolean;
};

export type PunjabiSmokeDeckSection = {
  area: PunjabiSmokeDeckArea;
  title_vi: string;
  title_en: string;
  smokeGoal_vi: string;
  smokeGoal_en: string;
  items: ReadonlyArray<PunjabiSmokeDeckItem>;
};

export const PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_SCOPE = {
  vi: "Smoke deck này kiểm tra nhanh các mảng đại diện: nhận diện Gurmukhi, dấu nguyên âm, addak/tippi/bindi, biển sinh tồn, từ dịch vụ, từ vựng chủ đề, động từ, collocation và romanization bridge. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This smoke deck quickly checks representative areas: Gurmukhi recognition, vowel signs, addak/tippi/bindi, survival signs, service words, thematic vocabulary, verbs, collocations, and the romanization bridge. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiSmokeDeckSection> = [
  {
    area: "gurmukhi_recognition",
    title_vi: "Smoke check chữ Gurmukhi",
    title_en: "Gurmukhi Recognition Smoke Check",
    smokeGoal_vi: "Kiểm tra nhanh các chữ và cặp dễ nhầm trước khi vào deck khác.",
    smokeGoal_en: "Quickly check letters and confusing pairs before other decks.",
    items: [
      { id: "pa-smoke-gurmukhi-001", area: "gurmukhi_recognition", use: "smoke_check", gurmukhi: "ਕ / ਖ", romanization: "k / kh", prompt_vi: "Chọn chữ bật hơi trong cặp này.", prompt_en: "Choose the aspirated letter in this pair.", passSignal_vi: "Pass nếu chọn ਖ và không tách kh thành hai chữ.", passSignal_en: "Pass if ਖ is chosen and kh is not split into two letters.", repairPath_vi: "Nếu sai, quay lại Gurmukhi script drills.", repairPath_en: "If missed, return to Gurmukhi script drills.", learnerTrap: { vi: "kh Latin không phải hai chữ Gurmukhi.", en: "Latin kh is not two Gurmukhi letters." }, finalQA: true },
      { id: "pa-smoke-gurmukhi-002", area: "gurmukhi_recognition", use: "final_qa", gurmukhi: "ਤ / ਟ", romanization: "t / tt", prompt_vi: "Phân biệt t răng và t quặt lưỡi.", prompt_en: "Distinguish dental t and retroflex t.", passSignal_vi: "Pass nếu phân loại ਤ và ਟ bằng hình chữ.", passSignal_en: "Pass if ਤ and ਟ are sorted by Gurmukhi shape.", repairPath_vi: "Nếu nhầm, ôn lại script error deck.", repairPath_en: "If confused, review the script error deck.", learnerTrap: { vi: "Một chữ t Latin che mất khác biệt.", en: "One Latin t hides the distinction." } },
      { id: "pa-smoke-gurmukhi-003", area: "gurmukhi_recognition", use: "integration_readiness", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", prompt_vi: "Nhận ra ਸ਼ có dấu dưới trong từ này.", prompt_en: "Recognize lower-mark ਸ਼ in this word.", passSignal_vi: "Pass nếu xác nhận bằng ਸ਼ਹਿਰ thay vì chỉ Latin.", passSignal_en: "Pass if ਸ਼ਹਿਰ confirms the word instead of Latin only.", repairPath_vi: "Nếu bỏ dấu dưới, ôn quick recognition.", repairPath_en: "If the lower mark is skipped, review quick recognition.", learnerTrap: { vi: "Bỏ dấu dưới làm sai chữ.", en: "Skipping the lower mark changes the letter." }, integrationReady: true },
    ],
  },
  {
    area: "vowel_signs",
    title_vi: "Smoke check dấu nguyên âm",
    title_en: "Vowel Sign Smoke Check",
    smokeGoal_vi: "Kiểm tra nhanh dấu nguyên âm thường gây lỗi đọc.",
    smokeGoal_en: "Quickly check vowel signs that often cause reading errors.",
    items: [
      { id: "pa-smoke-vowel-001", area: "vowel_signs", use: "smoke_check", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", prompt_vi: "Đọc i ngắn và i dài.", prompt_en: "Read short i and long ii.", passSignal_vi: "Pass nếu biết ਿ viết trước nhưng đọc sau.", passSignal_en: "Pass if ਿ is known as written before but read after.", repairPath_vi: "Nếu đảo thứ tự, quay lại reading ladder.", repairPath_en: "If order reverses, return to the reading ladder.", learnerTrap: { vi: "ਿ dễ làm người học đảo thứ tự.", en: "ਿ can make learners reverse order." }, finalQA: true },
      { id: "pa-smoke-vowel-002", area: "vowel_signs", use: "final_qa", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", prompt_vi: "Chọn u ngắn và u dài.", prompt_en: "Choose short u and long uu.", passSignal_vi: "Pass nếu phân biệt ੁ và ੂ.", passSignal_en: "Pass if ੁ and ੂ are distinguished.", repairPath_vi: "Nếu nhầm, ôn cặp dấu dưới.", repairPath_en: "If missed, review the under-consonant pair." },
      { id: "pa-smoke-vowel-003", area: "vowel_signs", use: "integration_readiness", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", prompt_vi: "Đọc e, ai/ae và au.", prompt_en: "Read e, ai/ae, and au.", passSignal_vi: "Pass nếu ba âm tiết không bị lẫn.", passSignal_en: "Pass if the three syllables are not mixed.", repairPath_vi: "Nếu lẫn, ôn vowel sign review.", repairPath_en: "If mixed, review vowel sign practice.", learnerTrap: { vi: "ai/ae thay đổi theo romanization.", en: "ai/ae varies by romanization." }, integrationReady: true },
    ],
  },
  {
    area: "addak_tippi_bindi",
    title_vi: "Smoke check dấu phụ",
    title_en: "Mark Awareness Smoke Check",
    smokeGoal_vi: "Kiểm tra addak, tippi và bindi bằng từ ngắn quen thuộc.",
    smokeGoal_en: "Check addak, tippi, and bindi through short familiar words.",
    items: [
      { id: "pa-smoke-mark-001", area: "addak_tippi_bindi", use: "smoke_check", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", prompt_vi: "Tìm addak trong cụm giao thông.", prompt_en: "Find addak in the transport phrase.", passSignal_vi: "Pass nếu chỉ ra ੱ trong cả hai từ.", passSignal_en: "Pass if ੱ is found in both words.", repairPath_vi: "Nếu bỏ dấu, ôn script error deck.", repairPath_en: "If skipped, review the script error deck.", learnerTrap: { vi: "Addak nhỏ nhưng quan trọng.", en: "Addak is small but important." }, canadaPractical: true },
      { id: "pa-smoke-mark-002", area: "addak_tippi_bindi", use: "final_qa", gurmukhi: "ਮਾਂ", romanization: "maan", prompt_vi: "Nhận diện bindi ở phía trên.", prompt_en: "Recognize bindi above the word.", passSignal_vi: "Pass nếu thấy ਂ trong ਮਾਂ.", passSignal_en: "Pass if ਂ is noticed in ਮਾਂ.", repairPath_vi: "Nếu không thấy, ôn bindi/tippi chậm.", repairPath_en: "If missed, slowly review bindi/tippi." },
      { id: "pa-smoke-mark-003", area: "addak_tippi_bindi", use: "integration_readiness", gurmukhi: "ਪੰਜਾਬ", romanization: "panjab/punjab", prompt_vi: "Nhận diện tippi trong tên Punjabi.", prompt_en: "Recognize tippi in the name Punjabi.", passSignal_vi: "Pass nếu thấy ੰ dù Latin không hiện rõ.", passSignal_en: "Pass if ੰ is seen even when Latin hides it.", repairPath_vi: "Nếu chỉ nhìn Punjab, quay lại Gurmukhi.", repairPath_en: "If only Punjab is seen, return to Gurmukhi.", learnerTrap: { vi: "Latin Punjab không hiện rõ tippi.", en: "Latin Punjab does not show tippi clearly." } },
    ],
  },
  {
    area: "survival_signage",
    title_vi: "Smoke check biển sinh tồn",
    title_en: "Survival Sign Smoke Check",
    smokeGoal_vi: "Kiểm tra biển có hành động thực tế ở Canada.",
    smokeGoal_en: "Check signs that require practical action in Canada.",
    items: [
      { id: "pa-smoke-sign-001", area: "survival_signage", use: "smoke_check", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", prompt_vi: "Bạn thấy biển này ở ga.", prompt_en: "You see this sign at a station.", passSignal_vi: "Pass nếu chọn hành động đi theo lối ra.", passSignal_en: "Pass if following the exit is chosen.", repairPath_vi: "Nếu dịch chậm, ôn survival signage.", repairPath_en: "If translation is slow, review survival signage.", canadaPractical: true, finalQA: true },
      { id: "pa-smoke-sign-002", area: "survival_signage", use: "final_qa", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", prompt_vi: "Bạn thấy biển này trong bệnh viện.", prompt_en: "You see this sign in a hospital.", passSignal_vi: "Pass nếu hiểu đây là cấp cứu.", passSignal_en: "Pass if this is understood as emergency.", repairPath_vi: "Nếu chưa nhớ, ôn nhóm y tế.", repairPath_en: "If forgotten, review the health set.", canadaPractical: true },
      { id: "pa-smoke-sign-003", area: "survival_signage", use: "integration_readiness", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", prompt_vi: "Xác nhận nhà thuốc bằng Gurmukhi.", prompt_en: "Confirm pharmacy through Gurmukhi.", passSignal_vi: "Pass nếu dùng ਫ để xác nhận nghĩa.", passSignal_en: "Pass if ਫ is used to confirm meaning.", repairPath_vi: "Nếu dựa vào English, ôn ph/f bridge.", repairPath_en: "If relying on English, review the ph/f bridge.", learnerTrap: { vi: "English pharmacy không thay thế Gurmukhi.", en: "English pharmacy does not replace Gurmukhi." }, canadaPractical: true, integrationReady: true },
    ],
  },
  {
    area: "service_words",
    title_vi: "Smoke check từ dịch vụ",
    title_en: "Service Word Smoke Check",
    smokeGoal_vi: "Kiểm tra các từ dùng ở quầy, trường, phòng khám và giấy tờ.",
    smokeGoal_en: "Check words used at counters, schools, clinics, and paperwork.",
    items: [
      { id: "pa-smoke-service-001", area: "service_words", use: "smoke_check", gurmukhi: "ਫਾਰਮ", romanization: "form", prompt_vi: "Từ này xuất hiện khi điền giấy.", prompt_en: "This word appears when completing paperwork.", passSignal_vi: "Pass nếu hiểu là mẫu đơn.", passSignal_en: "Pass if understood as a form.", repairPath_vi: "Nếu quên chữ, ôn service counter bridge.", repairPath_en: "If script is forgotten, review service counter bridge.", canadaPractical: true },
      { id: "pa-smoke-service-002", area: "service_words", use: "final_qa", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ", romanization: "appointment", prompt_vi: "Từ này dùng khi đặt lịch.", prompt_en: "This word is used when booking.", passSignal_vi: "Pass nếu nối với lịch hẹn phòng khám.", passSignal_en: "Pass if linked to a clinic appointment.", repairPath_vi: "Nếu nhầm, ôn clinic words.", repairPath_en: "If confused, review clinic words.", canadaPractical: true, finalQA: true, integrationReady: true },
      { id: "pa-smoke-service-003", area: "service_words", use: "integration_readiness", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", prompt_vi: "Đọc từ mượn này bằng Gurmukhi.", prompt_en: "Read this loanword through Gurmukhi.", passSignal_vi: "Pass nếu hiểu là trường học nhưng vẫn đọc chữ.", passSignal_en: "Pass if understood as school while still reading script.", repairPath_vi: "Nếu chỉ nhìn English, ôn loanword drills.", repairPath_en: "If only English is seen, review loanword drills.", learnerTrap: { vi: "Từ mượn vẫn cần đọc Gurmukhi.", en: "Loanwords still require Gurmukhi reading." }, canadaPractical: true },
    ],
  },
  {
    area: "thematic_vocabulary",
    title_vi: "Smoke check từ vựng chủ đề",
    title_en: "Thematic Vocabulary Smoke Check",
    smokeGoal_vi: "Kiểm tra từ đại diện cho gia đình, sức khỏe, nhà ở và tiền.",
    smokeGoal_en: "Check representative words for family, health, housing, and money.",
    items: [
      { id: "pa-smoke-theme-001", area: "thematic_vocabulary", use: "smoke_check", gurmukhi: "ਪਰਿਵਾਰ", romanization: "parivaar", prompt_vi: "Xếp từ này vào chủ đề.", prompt_en: "Sort this word into a theme.", passSignal_vi: "Pass nếu xếp vào gia đình.", passSignal_en: "Pass if sorted into family.", repairPath_vi: "Nếu nhầm, ôn thematic vocabulary.", repairPath_en: "If missed, review thematic vocabulary." },
      { id: "pa-smoke-theme-002", area: "thematic_vocabulary", use: "final_qa", gurmukhi: "ਦਵਾਈ", romanization: "davai", prompt_vi: "Từ này hữu ích ở nhà thuốc.", prompt_en: "This word is useful at a pharmacy.", passSignal_vi: "Pass nếu hiểu là thuốc.", passSignal_en: "Pass if understood as medicine.", repairPath_vi: "Nếu chưa nhớ, ôn chủ đề sức khỏe.", repairPath_en: "If forgotten, review the health theme.", canadaPractical: true },
      { id: "pa-smoke-theme-003", area: "thematic_vocabulary", use: "integration_readiness", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", prompt_vi: "Từ này thuộc nhà ở và tiền.", prompt_en: "This word belongs to housing and money.", passSignal_vi: "Pass nếu hiểu là tiền thuê.", passSignal_en: "Pass if understood as rent.", repairPath_vi: "Nếu nhầm chủ đề, ôn housing vocabulary.", repairPath_en: "If the theme is missed, review housing vocabulary.", canadaPractical: true, integrationReady: true },
    ],
  },
  {
    area: "high_frequency_verbs",
    title_vi: "Smoke check động từ",
    title_en: "High-Frequency Verb Smoke Check",
    smokeGoal_vi: "Kiểm tra động từ lõi trong cụm và câu dịch vụ.",
    smokeGoal_en: "Check core verbs in service chunks and sentences.",
    items: [
      { id: "pa-smoke-verb-001", area: "high_frequency_verbs", use: "smoke_check", gurmukhi: "ਕਰਨਾ", romanization: "karna", prompt_vi: "Động từ này tạo cụm hành động.", prompt_en: "This verb forms action chunks.", passSignal_vi: "Pass nếu hiểu là làm và ghép với danh từ.", passSignal_en: "Pass if understood as do/make with nouns.", repairPath_vi: "Nếu đứng riêng khó nhớ, ôn collocations.", repairPath_en: "If isolated form is hard, review collocations." },
      { id: "pa-smoke-verb-002", area: "high_frequency_verbs", use: "final_qa", gurmukhi: "ਲੈਣਾ", romanization: "laina", prompt_vi: "Đọc động từ trong đặt lịch hẹn.", prompt_en: "Read the verb in appointment booking.", passSignal_vi: "Pass nếu hiểu ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ.", passSignal_en: "Pass if ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ is understood.", repairPath_vi: "Nếu nhầm, ôn high-frequency verb deck.", repairPath_en: "If missed, review the high-frequency verb deck.", canadaPractical: true, finalQA: true },
      { id: "pa-smoke-verb-003", area: "high_frequency_verbs", use: "integration_readiness", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", prompt_vi: "Câu này dùng khi chưa hiểu.", prompt_en: "This sentence is used when you did not understand.", passSignal_vi: "Pass nếu dùng câu để xin hỗ trợ.", passSignal_en: "Pass if used to ask for support.", repairPath_vi: "Nếu quên, ôn verb ਸਮਝਣਾ.", repairPath_en: "If forgotten, review the verb ਸਮਝਣਾ.", canadaPractical: true, integrationReady: true },
    ],
  },
  {
    area: "collocations",
    title_vi: "Smoke check collocation",
    title_en: "Collocation Smoke Check",
    smokeGoal_vi: "Kiểm tra cụm tự nhiên cần dùng nhanh trong dịch vụ và nơi công cộng.",
    smokeGoal_en: "Check natural chunks needed quickly in services and public places.",
    items: [
      { id: "pa-smoke-collocation-001", area: "collocations", use: "integration_readiness", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", prompt_vi: "Dùng câu này khi cần giúp đỡ.", prompt_en: "Use this sentence when help is needed.", passSignal_vi: "Pass nếu dùng cả câu, không chỉ ਮਦਦ.", passSignal_en: "Pass if using the whole sentence, not only ਮਦਦ.", repairPath_vi: "Nếu thiếu cụm, ôn collocation deck.", repairPath_en: "If the chunk is incomplete, review the collocation deck.", canadaPractical: true, finalQA: true, integrationReady: true },
      { id: "pa-smoke-collocation-002", area: "collocations", use: "smoke_check", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", prompt_vi: "Cụm này là một hành động dịch vụ.", prompt_en: "This chunk is a service action.", passSignal_vi: "Pass nếu hiểu là điền mẫu đơn.", passSignal_en: "Pass if understood as filling out a form.", repairPath_vi: "Nếu dịch từng từ, ôn word chunks.", repairPath_en: "If translated word by word, review word chunks.", canadaPractical: true },
      { id: "pa-smoke-collocation-003", area: "collocations", use: "final_qa", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", prompt_vi: "Cụm này có bẫy chữ ਠ.", prompt_en: "This chunk has the ਠ letter trap.", passSignal_vi: "Pass nếu hiểu là sửa lỗi và không đọc th kiểu English.", passSignal_en: "Pass if understood as correct a mistake without English th.", repairPath_vi: "Nếu đọc th sai, ôn script error deck.", repairPath_en: "If th is misread, review the script error deck.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    area: "romanization_bridge",
    title_vi: "Smoke check romanization bridge",
    title_en: "Romanization Bridge Smoke Check",
    smokeGoal_vi: "Kiểm tra khả năng dùng Latin để tìm kiếm nhưng xác nhận bằng Gurmukhi.",
    smokeGoal_en: "Check using Latin for search while confirming with Gurmukhi.",
    items: [
      { id: "pa-smoke-roman-001", area: "romanization_bridge", use: "smoke_check", gurmukhi: "ਫਲ", romanization: "phal/fal", prompt_vi: "Nếu phal không ra, thử fal.", prompt_en: "If phal fails, try fal.", passSignal_vi: "Pass nếu xác nhận bằng Gurmukhi ਫਲ.", passSignal_en: "Pass if confirmed with Gurmukhi ਫਲ.", repairPath_vi: "Nếu chỉ tin Latin, ôn bridge reduction.", repairPath_en: "If Latin is overtrusted, review bridge reduction.", learnerTrap: { vi: "ਫ có thể ghi ph hoặc f.", en: "ਫ may be written ph or f." } },
      { id: "pa-smoke-roman-002", area: "romanization_bridge", use: "final_qa", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", prompt_vi: "Hai spelling Latin trỏ về một chữ.", prompt_en: "Two Latin spellings point to one script form.", passSignal_vi: "Pass nếu cả hai trỏ về ਵੱਡਾ.", passSignal_en: "Pass if both point to ਵੱਡਾ.", repairPath_vi: "Nếu tách thành hai từ, ôn v/w.", repairPath_en: "If split into two words, review v/w.", learnerTrap: { vi: "v/w thay đổi theo nguồn.", en: "v/w varies by source." }, finalQA: true },
      { id: "pa-smoke-roman-003", area: "romanization_bridge", use: "integration_readiness", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", prompt_vi: "Tìm bằng Latin rồi xác nhận Gurmukhi.", prompt_en: "Search with Latin, then confirm Gurmukhi.", passSignal_vi: "Pass nếu dùng ਸ਼ਹਿਰ làm đáp án cuối.", passSignal_en: "Pass if ਸ਼ਹਿਰ is used as the final answer.", repairPath_vi: "Nếu cần Latin trước, ôn quick recognition ਸ਼.", repairPath_en: "If Latin is needed first, review quick recognition for ਸ਼.", learnerTrap: { vi: "Romanization khác nhau không luôn đổi nghĩa.", en: "Different romanization does not always change meaning." }, integrationReady: true },
    ],
  },
  {
    area: "shahmukhi_awareness",
    title_vi: "Smoke check Shahmukhi",
    title_en: "Shahmukhi Smoke Check",
    smokeGoal_vi: "Giữ phạm vi rõ: Gurmukhi là chính và Shahmukhi chỉ là nhận biết.",
    smokeGoal_en: "Keep scope clear: Gurmukhi is primary and Shahmukhi is awareness only.",
    items: [
      { id: "pa-smoke-shahmukhi-001", area: "shahmukhi_awareness", use: "final_qa", gurmukhi: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ", romanization: "gurmukhi vich parho", prompt_vi: "Deck này dùng hệ chữ nào làm chính?", prompt_en: "Which script is primary in this deck?", passSignal_vi: "Pass nếu trả lời Gurmukhi là chính.", passSignal_en: "Pass if the answer is Gurmukhi primary.", repairPath_vi: "Nếu hỏi Shahmukhi, nhắc rằng chỉ là nhận biết.", repairPath_en: "If Shahmukhi comes up, note awareness only.", finalQA: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK = sections;

export const PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK_ITEMS: ReadonlyArray<PunjabiSmokeDeckItem> =
  sections.flatMap((section) => section.items);

export default PUNJABI_SCRIPT_VOCABULARY_SMOKE_DECK;
