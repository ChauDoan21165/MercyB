// src/languages/punjabi/scriptVocabularyCanDoStatements.ts
//
// Punjabi script and vocabulary can-do statements for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization is a bridge.
// Native review is deferred.

export type PunjabiCanDoArea =
  | "gurmukhi_recognition"
  | "vowel_signs"
  | "addak_tippi_bindi"
  | "survival_signage"
  | "thematic_vocabulary"
  | "verbs"
  | "collocations"
  | "romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiCanDoBand = "foundation" | "survival" | "independent";

export type PunjabiCanDoStatement = {
  id: string;
  area: PunjabiCanDoArea;
  band: PunjabiCanDoBand;
  gurmukhiAnchor: string;
  romanization?: string;
  canDo_vi: string;
  canDo_en: string;
  evidence_vi: string;
  evidence_en: string;
  nextStep_vi: string;
  nextStep_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  checkpoint?: boolean;
  readiness?: boolean;
};

export type PunjabiCanDoSection = {
  area: PunjabiCanDoArea;
  title_vi: string;
  title_en: string;
  summary_vi: string;
  summary_en: string;
  statements: ReadonlyArray<PunjabiCanDoStatement>;
};

export const PUNJABI_SCRIPT_VOCABULARY_CAN_DO_SCOPE = {
  vi: "Các can-do này mô tả điều người học có thể làm với Gurmukhi, dấu nguyên âm, dấu phụ, biển hiệu, từ vựng, động từ, collocation và romanization. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "These can-do statements describe what learners can do with Gurmukhi, vowel signs, marks, signage, vocabulary, verbs, collocations, and romanization. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiCanDoSection> = [
  {
    area: "gurmukhi_recognition",
    title_vi: "Can-do nhận diện Gurmukhi",
    title_en: "Gurmukhi Recognition Can-Do",
    summary_vi: "Người học nhận diện chữ và cặp dễ nhầm trong từ thật.",
    summary_en: "Learners recognize letters and confusing pairs inside real words.",
    statements: [
      { id: "pa-cando-gurmukhi-001", area: "gurmukhi_recognition", band: "foundation", gurmukhiAnchor: "ਕ / ਖ", romanization: "k / kh", canDo_vi: "Tôi có thể phân biệt ਕ và ਖ khi đọc từ ngắn.", canDo_en: "I can distinguish ਕ and ਖ when reading short words.", evidence_vi: "Chọn ਖ là chữ bật hơi trong cặp ਕ/ਖ.", evidence_en: "Select ਖ as the aspirated letter in ਕ/ਖ.", nextStep_vi: "Tiếp tục với các cặp ਗ/ਘ và ਚ/ਛ.", nextStep_en: "Continue with ਗ/ਘ and ਚ/ਛ pairs.", learnerTrap: { vi: "kh trong Latin không thay thế việc nhìn chữ ਖ.", en: "Latin kh does not replace seeing ਖ." }, readiness: true },
      { id: "pa-cando-gurmukhi-002", area: "gurmukhi_recognition", band: "foundation", gurmukhiAnchor: "ਤ / ਟ", romanization: "t / tt", canDo_vi: "Tôi có thể nhận ra t răng và t quặt lưỡi trong Gurmukhi.", canDo_en: "I can recognize dental and retroflex t in Gurmukhi.", evidence_vi: "Tách ਤ khỏi ਟ trong một danh sách chữ.", evidence_en: "Separate ਤ from ਟ in a letter list.", nextStep_vi: "Ôn thêm ਦ/ਡ trước khi đọc câu.", nextStep_en: "Review ਦ/ਡ before reading sentences.", learnerTrap: { vi: "Một chữ t Latin có thể che mất khác biệt.", en: "One Latin t can hide the difference." } },
      { id: "pa-cando-gurmukhi-003", area: "gurmukhi_recognition", band: "survival", gurmukhiAnchor: "ਸ / ਸ਼", romanization: "s / sh", canDo_vi: "Tôi có thể chú ý dấu dưới trong chữ ਸ਼ trên biển hoặc từ mượn.", canDo_en: "I can notice the lower mark in ਸ਼ on signs or loanwords.", evidence_vi: "Giải thích ਸ਼ khác ਸ khi đọc nhanh.", evidence_en: "Explain that ਸ਼ differs from ਸ during quick reading.", nextStep_vi: "Dùng kỹ năng này với ਸ਼ਹਿਰ và từ mượn.", nextStep_en: "Use this skill with ਸ਼ਹਿਰ and loanwords.", learnerTrap: { vi: "Đừng bỏ dấu dưới khi scan biển.", en: "Do not drop the lower mark when scanning signs." }, canadaPractical: true },
    ],
  },
  {
    area: "vowel_signs",
    title_vi: "Can-do dấu nguyên âm",
    title_en: "Vowel Sign Can-Do",
    summary_vi: "Người học đọc dấu nguyên âm theo âm trị, không chỉ theo vị trí viết.",
    summary_en: "Learners read vowel signs by sound value, not only written position.",
    statements: [
      { id: "pa-cando-vowel-001", area: "vowel_signs", band: "foundation", gurmukhiAnchor: "ਕਿ / ਕੀ", romanization: "ki / kii", canDo_vi: "Tôi có thể đọc i ngắn và i dài trong Gurmukhi.", canDo_en: "I can read short i and long ii in Gurmukhi.", evidence_vi: "Đọc ਕਿ khác ਕੀ và nói dấu nào dài.", evidence_en: "Read ਕਿ differently from ਕੀ and name the long sign.", nextStep_vi: "Ôn vị trí đặc biệt của ਿ trước phụ âm.", nextStep_en: "Review the special written position of ਿ before the consonant.", learnerTrap: { vi: "ਿ viết trước nhưng đọc sau phụ âm.", en: "ਿ is written before but read after the consonant." }, readiness: true },
      { id: "pa-cando-vowel-002", area: "vowel_signs", band: "foundation", gurmukhiAnchor: "ਕੁ / ਕੂ", romanization: "ku / kuu", canDo_vi: "Tôi có thể phân biệt u ngắn và u dài trong từ.", canDo_en: "I can distinguish short u and long uu in words.", evidence_vi: "Chọn ੁ cho ਕੁ và ੂ cho ਕੂ.", evidence_en: "Choose ੁ for ਕੁ and ੂ for ਕੂ.", nextStep_vi: "Đọc các từ dịch vụ có dấu u.", nextStep_en: "Read service words that contain u signs." },
      { id: "pa-cando-vowel-003", area: "vowel_signs", band: "survival", gurmukhiAnchor: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", canDo_vi: "Tôi có thể đọc e, ai/ae và au trong biển ngắn.", canDo_en: "I can read e, ai/ae, and au in short signs.", evidence_vi: "Không nhầm ੇ, ੈ và ੌ khi đọc âm tiết.", evidence_en: "Do not confuse ੇ, ੈ, and ੌ when reading syllables.", nextStep_vi: "Áp dụng vào từ nơi chốn và giao thông.", nextStep_en: "Apply this to place and transit words.", learnerTrap: { vi: "Romanization ai/ae thay đổi theo nguồn.", en: "ai/ae romanization changes by source." }, canadaPractical: true },
    ],
  },
  {
    area: "addak_tippi_bindi",
    title_vi: "Can-do addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi Can-Do",
    summary_vi: "Người học nhận diện dấu phụ phổ biến trước khi đọc từ sinh tồn.",
    summary_en: "Learners recognize common marks before reading survival words.",
    statements: [
      { id: "pa-cando-mark-001", area: "addak_tippi_bindi", band: "survival", gurmukhiAnchor: "ਬੱਸ", romanization: "bass/bus", canDo_vi: "Tôi có thể nhận ra addak ੱ trong từ giao thông.", canDo_en: "I can recognize addak ੱ in a transit word.", evidence_vi: "Chỉ ra ੱ trong ਬੱਸ khi thấy biển xe buýt.", evidence_en: "Point to ੱ in ਬੱਸ when seeing a bus sign.", nextStep_vi: "Ôn thêm ਅੱਡਾ trong cụm ਬੱਸ ਅੱਡਾ.", nextStep_en: "Review ਅੱਡਾ in the phrase ਬੱਸ ਅੱਡਾ.", learnerTrap: { vi: "Bỏ addak làm người học đọc thiếu nhịp chữ.", en: "Skipping addak makes learners miss the doubled cue." }, canadaPractical: true, checkpoint: true },
      { id: "pa-cando-mark-002", area: "addak_tippi_bindi", band: "foundation", gurmukhiAnchor: "ਮਾਂ", romanization: "maan", canDo_vi: "Tôi có thể nhận ra bindi trong từ gia đình quen thuộc.", canDo_en: "I can recognize bindi in a familiar family word.", evidence_vi: "Chỉ ra ਂ ở trên trong ਮਾਂ.", evidence_en: "Point to ਂ above in ਮਾਂ.", nextStep_vi: "So sánh bindi với tippi trong ਪੰਜਾਬ.", nextStep_en: "Compare bindi with tippi in ਪੰਜਾਬ.", learnerTrap: { vi: "Mục tiêu là nhận diện dấu, không phải đánh giá giọng.", en: "The goal is mark recognition, not accent evaluation." } },
      { id: "pa-cando-mark-003", area: "addak_tippi_bindi", band: "foundation", gurmukhiAnchor: "ਪੰਜਾਬ", romanization: "panjab/punjab", canDo_vi: "Tôi có thể nhận ra tippi ੰ trong tên Punjabi.", canDo_en: "I can recognize tippi ੰ in the name Punjabi.", evidence_vi: "Tìm ੰ trong ਪੰਜਾਬ và nối với romanization Punjab.", evidence_en: "Find ੰ in ਪੰਜਾਬ and connect it with the romanization Punjab.", nextStep_vi: "Đọc thêm từ có tippi trong chủ đề cộng đồng.", nextStep_en: "Read more tippi words in community themes.", learnerTrap: { vi: "Latin Punjab không hiển thị rõ dấu ੰ.", en: "Latin Punjab does not show ੰ clearly." } },
    ],
  },
  {
    area: "survival_signage",
    title_vi: "Can-do biển hiệu sinh tồn",
    title_en: "Survival Signage Can-Do",
    summary_vi: "Người học đọc biển thực tế ở Canada trong tình huống cần hành động.",
    summary_en: "Learners read practical Canadian signs in action-oriented situations.",
    statements: [
      { id: "pa-cando-sign-001", area: "survival_signage", band: "survival", gurmukhiAnchor: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", canDo_vi: "Tôi có thể nhận ra biển cấp cứu trong bệnh viện hoặc phòng khám.", canDo_en: "I can recognize an emergency sign in a hospital or clinic.", evidence_vi: "Nói rằng ਐਮਰਜੈਂਸੀ báo tình huống khẩn cấp.", evidence_en: "Say that ਐਮਰਜੈਂਸੀ signals an urgent situation.", nextStep_vi: "Ôn thêm từ ਡਾਕਟਰ và ਦਵਾਈ.", nextStep_en: "Review ਡਾਕਟਰ and ਦਵਾਈ next.", canadaPractical: true, checkpoint: true },
      { id: "pa-cando-sign-002", area: "survival_signage", band: "survival", gurmukhiAnchor: "ਨਿਕਾਸ", romanization: "nikaas", canDo_vi: "Tôi có thể đi theo biển lối ra khi thấy ਨਿਕਾਸ.", canDo_en: "I can follow an exit sign when I see ਨਿਕਾਸ.", evidence_vi: "Chọn hành động đi ra ngoài hoặc tìm lối ra.", evidence_en: "Choose the action of leaving or finding the exit.", nextStep_vi: "Ôn biển ghép như ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਨਿਕਾਸ.", nextStep_en: "Review combined signs like ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਨਿਕਾਸ.", canadaPractical: true, checkpoint: true },
      { id: "pa-cando-sign-003", area: "survival_signage", band: "survival", gurmukhiAnchor: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", canDo_vi: "Tôi có thể nhận ra nhà thuốc dù romanization dùng ph hoặc f.", canDo_en: "I can recognize pharmacy even when romanization uses ph or f.", evidence_vi: "Xác nhận bằng chữ ਫ trong ਫਾਰਮੇਸੀ.", evidence_en: "Confirm with the letter ਫ in ਫਾਰਮੇਸੀ.", nextStep_vi: "Ôn thêm từ ਦਵਾਈ để hỏi thuốc.", nextStep_en: "Review ਦਵਾਈ to ask about medicine.", learnerTrap: { vi: "Đừng chỉ dựa vào chữ pharmacy tiếng Anh.", en: "Do not rely only on the English word pharmacy." }, canadaPractical: true },
    ],
  },
  {
    area: "thematic_vocabulary",
    title_vi: "Can-do từ vựng theo chủ đề",
    title_en: "Thematic Vocabulary Can-Do",
    summary_vi: "Người học xếp từ Gurmukhi vào nhóm đời sống để nhớ và dùng nhanh.",
    summary_en: "Learners sort Gurmukhi words into life domains for quicker use.",
    statements: [
      { id: "pa-cando-theme-001", area: "thematic_vocabulary", band: "foundation", gurmukhiAnchor: "ਪਰਿਵਾਰ", romanization: "parivaar", canDo_vi: "Tôi có thể xếp ਪਰਿਵਾਰ vào chủ đề gia đình.", canDo_en: "I can sort ਪਰਿਵਾਰ into the family theme.", evidence_vi: "Nối ਪਰਿਵਾਰ với mẹ, cha, nhà và quan hệ.", evidence_en: "Connect ਪਰਿਵਾਰ with mother, father, home, and relationships.", nextStep_vi: "Ôn từ gia đình có bindi hoặc tippi.", nextStep_en: "Review family words with bindi or tippi." },
      { id: "pa-cando-theme-002", area: "thematic_vocabulary", band: "survival", gurmukhiAnchor: "ਦਵਾਈ", romanization: "davai", canDo_vi: "Tôi có thể nhận ra ਦਵਾਈ trong tình huống sức khỏe.", canDo_en: "I can recognize ਦਵਾਈ in a health situation.", evidence_vi: "Xếp ਦਵਾਈ vào phòng khám hoặc nhà thuốc.", evidence_en: "Sort ਦਵਾਈ under clinic or pharmacy.", nextStep_vi: "Kết hợp với ਫਾਰਮੇਸੀ và ਡਾਕਟਰ.", nextStep_en: "Combine it with ਫਾਰਮੇਸੀ and ਡਾਕਟਰ.", canadaPractical: true },
      { id: "pa-cando-theme-003", area: "thematic_vocabulary", band: "survival", gurmukhiAnchor: "ਕਿਰਾਇਆ", romanization: "kiraya", canDo_vi: "Tôi có thể nhận ra ਕਿਰਾਇਆ trong chủ đề nhà ở và tiền.", canDo_en: "I can recognize ਕਿਰਾਇਆ in housing and money topics.", evidence_vi: "Nói rằng ਕਿਰਾਇਆ là tiền thuê.", evidence_en: "Say that ਕਿਰਾਇਆ means rent.", nextStep_vi: "Ôn câu hỏi về số tiền và địa chỉ.", nextStep_en: "Review questions about amount and address.", canadaPractical: true },
    ],
  },
  {
    area: "verbs",
    title_vi: "Can-do động từ",
    title_en: "Verb Can-Do",
    summary_vi: "Người học nhận diện động từ lõi trong câu ngắn và cụm dịch vụ.",
    summary_en: "Learners recognize core verbs in short sentences and service phrases.",
    statements: [
      { id: "pa-cando-verb-001", area: "verbs", band: "foundation", gurmukhiAnchor: "ਕਰਨਾ", romanization: "karna", canDo_vi: "Tôi có thể nhận ra ਕਰਨਾ như động từ làm trong cụm đơn giản.", canDo_en: "I can recognize ਕਰਨਾ as the verb do/make in simple phrases.", evidence_vi: "Giải thích vì sao ਅਨੁਵਾਦ ਕਰਨਾ là dịch.", evidence_en: "Explain why ਅਨੁਵਾਦ ਕਰਨਾ means to translate.", nextStep_vi: "Ôn collocation danh từ + ਕਰਨਾ.", nextStep_en: "Review noun + ਕਰਨਾ collocations." },
      { id: "pa-cando-verb-002", area: "verbs", band: "survival", gurmukhiAnchor: "ਲੈਣਾ", romanization: "laina", canDo_vi: "Tôi có thể hiểu ਲੈਣਾ theo ngữ cảnh lấy, nhận hoặc đặt.", canDo_en: "I can understand ਲੈਣਾ by context as take, receive, or book.", evidence_vi: "Nhận ra ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ là đặt lịch hẹn.", evidence_en: "Recognize ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ as booking an appointment.", nextStep_vi: "Dùng cụm này trong tình huống phòng khám.", nextStep_en: "Use this phrase in a clinic situation.", canadaPractical: true, checkpoint: true },
      { id: "pa-cando-verb-003", area: "verbs", band: "survival", gurmukhiAnchor: "ਸਮਝਣਾ", romanization: "samajhna", canDo_vi: "Tôi có thể dùng ý chưa hiểu bằng cụm có ਸਮਝ.", canDo_en: "I can express not understanding with a phrase using ਸਮਝ.", evidence_vi: "Nhận ra ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ.", evidence_en: "Recognize ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ.", nextStep_vi: "Ôn yêu cầu nói chậm hoặc lặp lại.", nextStep_en: "Review requests to speak slowly or repeat.", canadaPractical: true, checkpoint: true },
    ],
  },
  {
    area: "collocations",
    title_vi: "Can-do collocation",
    title_en: "Collocation Can-Do",
    summary_vi: "Người học đọc cụm tự nhiên thay vì dịch từng từ rời.",
    summary_en: "Learners read natural chunks instead of translating isolated words.",
    statements: [
      { id: "pa-cando-collocation-001", area: "collocations", band: "survival", gurmukhiAnchor: "ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "madad chahidi hai", canDo_vi: "Tôi có thể nhận ra cụm cần giúp đỡ trong tình huống công cộng.", canDo_en: "I can recognize the need-help phrase in a public situation.", evidence_vi: "Dùng ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ khi cần hỗ trợ.", evidence_en: "Use ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ when help is needed.", nextStep_vi: "Ôn thêm cách nói lịch sự với ਕਿਰਪਾ ਕਰਕੇ.", nextStep_en: "Review polite phrasing with ਕਿਰਪਾ ਕਰਕੇ.", canadaPractical: true, checkpoint: true },
      { id: "pa-cando-collocation-002", area: "collocations", band: "survival", gurmukhiAnchor: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", canDo_vi: "Tôi có thể hiểu ਫਾਰਮ ਭਰਨਾ trong dịch vụ hành chính.", canDo_en: "I can understand ਫਾਰਮ ਭਰਨਾ in administrative services.", evidence_vi: "Nói rằng cụm này nghĩa là điền mẫu đơn.", evidence_en: "Say that the phrase means to fill out a form.", nextStep_vi: "Ôn từ địa chỉ, tên và số điện thoại.", nextStep_en: "Review address, name, and phone-number words.", canadaPractical: true },
      { id: "pa-cando-collocation-003", area: "collocations", band: "independent", gurmukhiAnchor: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", canDo_vi: "Tôi có thể đọc cụm sửa lỗi và chú ý chữ ਠ.", canDo_en: "I can read the fix-a-mistake phrase and notice ਠ.", evidence_vi: "Giải thích ਠ trong ਠੀਕ không phải th tiếng Anh.", evidence_en: "Explain that ਠ in ਠੀਕ is not English th.", nextStep_vi: "Ôn nhóm chữ bật hơi quặt lưỡi.", nextStep_en: "Review retroflex aspirated letters.", learnerTrap: { vi: "th trong romanization dễ gây đọc theo tiếng Anh.", en: "th in romanization can trigger English-style reading." } },
    ],
  },
  {
    area: "romanization_bridge",
    title_vi: "Can-do cầu nối romanization",
    title_en: "Romanization Bridge Can-Do",
    summary_vi: "Người học dùng Latin để tìm kiếm nhưng xác nhận bằng Gurmukhi.",
    summary_en: "Learners use Latin for search while confirming with Gurmukhi.",
    statements: [
      { id: "pa-cando-roman-001", area: "romanization_bridge", band: "foundation", gurmukhiAnchor: "ਫਲ", romanization: "phal/fal", canDo_vi: "Tôi có thể thử phal và fal rồi xác nhận bằng ਫਲ.", canDo_en: "I can try phal and fal, then confirm with ਫਲ.", evidence_vi: "Nêu hai cách Latin cho cùng một từ Gurmukhi.", evidence_en: "Name two Latin forms for the same Gurmukhi word.", nextStep_vi: "Ôn thêm ਫਾਰਮੇਸੀ với ph/f.", nextStep_en: "Review ਫਾਰਮੇਸੀ with ph/f.", learnerTrap: { vi: "Không biến mỗi spelling Latin thành một từ mới.", en: "Do not turn each Latin spelling into a new word." } },
      { id: "pa-cando-roman-002", area: "romanization_bridge", band: "foundation", gurmukhiAnchor: "ਵੱਡਾ", romanization: "vadda/wadda", canDo_vi: "Tôi có thể hiểu vadda và wadda cùng trỏ về ਵੱਡਾ.", canDo_en: "I can understand vadda and wadda as pointing to ਵੱਡਾ.", evidence_vi: "Chọn Gurmukhi ਵੱਡਾ làm dạng chuẩn khi học.", evidence_en: "Choose Gurmukhi ਵੱਡਾ as the study form.", nextStep_vi: "Ôn chữ ਵ trong từ khác.", nextStep_en: "Review ਵ in other words.", learnerTrap: { vi: "v/w thay đổi theo nguồn và giọng.", en: "v/w varies by source and accent." } },
      { id: "pa-cando-roman-003", area: "romanization_bridge", band: "independent", gurmukhiAnchor: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", canDo_vi: "Tôi có thể tìm bằng shahir hoặc shehar rồi xác nhận ਸ਼ਹਿਰ.", canDo_en: "I can search shahir or shehar, then confirm ਸ਼ਹਿਰ.", evidence_vi: "So sánh hai romanization mà không đổi nghĩa.", evidence_en: "Compare two romanizations without changing meaning.", nextStep_vi: "Ôn các từ nơi chốn có ਸ਼.", nextStep_en: "Review place words with ਸ਼.", learnerTrap: { vi: "Search Latin hữu ích nhưng không phải chữ chính.", en: "Latin search is useful but not the primary script." }, readiness: true },
    ],
  },
  {
    area: "shahmukhi_awareness",
    title_vi: "Can-do nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness Can-Do",
    summary_vi: "Người học biết có hệ chữ khác nhưng khóa này vẫn dùng Gurmukhi.",
    summary_en: "Learners know another script exists while this course stays with Gurmukhi.",
    statements: [
      { id: "pa-cando-shahmukhi-001", area: "shahmukhi_awareness", band: "foundation", gurmukhiAnchor: "ਗੁਰਮੁਖੀ", romanization: "gurmukhi", canDo_vi: "Tôi có thể nói Gurmukhi là hệ chữ chính trong bộ học này.", canDo_en: "I can state that Gurmukhi is the primary script in this learning set.", evidence_vi: "Giải thích Shahmukhi chỉ là nhận biết, không phải khóa đầy đủ.", evidence_en: "Explain that Shahmukhi is awareness only, not a full course.", nextStep_vi: "Tiếp tục đọc và ôn bằng Gurmukhi.", nextStep_en: "Continue reading and reviewing with Gurmukhi.", checkpoint: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_CAN_DO_STATEMENTS = sections;

export const PUNJABI_SCRIPT_VOCABULARY_CAN_DO_ITEMS: ReadonlyArray<PunjabiCanDoStatement> =
  sections.flatMap((section) => section.statements);

export default PUNJABI_SCRIPT_VOCABULARY_CAN_DO_STATEMENTS;
