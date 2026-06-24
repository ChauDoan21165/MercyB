// src/languages/punjabi/gurmukhiFluencyDrills.ts
//
// Punjabi Gurmukhi fluency drills for Vietnamese-speaking and English-speaking
// learners. Gurmukhi is primary; romanization is gradually reduced.
// Native review is deferred.

export type PunjabiFluencyFocus =
  | "quick_recognition"
  | "word_chunks"
  | "vowel_sign_contrast"
  | "addak_tippi_bindi"
  | "survival_signs"
  | "service_words"
  | "high_frequency_verbs"
  | "romanization_reduction"
  | "shahmukhi_awareness";

export type PunjabiFluencyPace = "flash" | "guided" | "review" | "readiness";

export type PunjabiFluencyDrill = {
  id: string;
  focus: PunjabiFluencyFocus;
  pace: PunjabiFluencyPace;
  gurmukhi: string;
  romanization?: string;
  prompt_vi: string;
  prompt_en: string;
  target_vi: string;
  target_en: string;
  remediation_vi: string;
  remediation_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  readiness?: boolean;
  finalQuality?: boolean;
  reduceRomanization?: boolean;
};

export type PunjabiFluencySection = {
  focus: PunjabiFluencyFocus;
  title_vi: string;
  title_en: string;
  fluencyGoal_vi: string;
  fluencyGoal_en: string;
  drills: ReadonlyArray<PunjabiFluencyDrill>;
};

export const PUNJABI_GURMUKHI_FLUENCY_DRILLS_SCOPE = {
  vi: "Các drill này xây fluency Gurmukhi qua nhận diện nhanh, word chunks, đối lập dấu nguyên âm, addak/tippi/bindi, biển sinh tồn, từ dịch vụ, động từ tần suất cao và giảm dần romanization. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "These drills build Gurmukhi fluency through quick recognition, word chunks, vowel-sign contrast, addak/tippi/bindi, survival signs, service words, high-frequency verbs, and gradual romanization reduction. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiFluencySection> = [
  {
    focus: "quick_recognition",
    title_vi: "Nhận diện nhanh",
    title_en: "Quick Recognition",
    fluencyGoal_vi: "Tăng tốc nhận diện chữ Gurmukhi mà không dựa vào Latin trước.",
    fluencyGoal_en: "Speed up Gurmukhi recognition without relying on Latin first.",
    drills: [
      { id: "pa-fluency-quick-001", focus: "quick_recognition", pace: "flash", gurmukhi: "ਕ / ਖ", romanization: "k / kh", prompt_vi: "Trong ba giây, chọn chữ bật hơi.", prompt_en: "In three seconds, choose the aspirated letter.", target_vi: "Chọn ਖ, rồi đọc lại cặp bằng Gurmukhi.", target_en: "Choose ਖ, then reread the pair in Gurmukhi.", remediation_vi: "Nếu chọn ਕ, quay lại drill cặp bật hơi.", remediation_en: "If ਕ is chosen, return to aspirated-pair drills.", learnerTrap: { vi: "kh không phải hai chữ Gurmukhi.", en: "kh is not two Gurmukhi letters." }, finalQuality: true },
      { id: "pa-fluency-quick-002", focus: "quick_recognition", pace: "flash", gurmukhi: "ਤ / ਟ", romanization: "t / tt", prompt_vi: "Phân biệt t răng và t quặt lưỡi thật nhanh.", prompt_en: "Quickly separate dental t and retroflex t.", target_vi: "Tách ਤ khỏi ਟ trước khi đọc từ.", target_en: "Separate ਤ from ਟ before reading words.", remediation_vi: "Nếu nhầm, ôn vị trí lưỡi trong bảng phụ âm.", remediation_en: "If missed, review tongue position in the consonant table.", learnerTrap: { vi: "Latin t che mất khác biệt hình chữ.", en: "Latin t hides the shape difference." } },
      { id: "pa-fluency-quick-003", focus: "quick_recognition", pace: "review", gurmukhi: "ਸ / ਸ਼", romanization: "s / sh", prompt_vi: "Chỉ ra chữ có dấu dưới trong nháy mắt.", prompt_en: "Spot the letter with the lower mark at a glance.", target_vi: "Nhận ra ਸ਼ khác ਸ trước khi dùng romanization.", target_en: "Recognize ਸ਼ as different from ਸ before using romanization.", remediation_vi: "Nếu bỏ dấu dưới, ôn lại ਸ਼ trong ਸ਼ਹਿਰ.", remediation_en: "If the lower mark is skipped, review ਸ਼ in ਸ਼ਹਿਰ.", learnerTrap: { vi: "Dấu dưới nhỏ nhưng đổi nhận diện.", en: "The lower mark is small but changes recognition." } },
    ],
  },
  {
    focus: "word_chunks",
    title_vi: "Word chunks",
    title_en: "Word Chunks",
    fluencyGoal_vi: "Đọc cụm Gurmukhi thành đơn vị nghĩa thay vì từng chữ rời.",
    fluencyGoal_en: "Read Gurmukhi chunks as meaning units rather than isolated letters.",
    drills: [
      { id: "pa-fluency-chunk-001", focus: "word_chunks", pace: "guided", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", prompt_vi: "Đọc cả cụm như một yêu cầu giúp đỡ.", prompt_en: "Read the whole chunk as a help request.", target_vi: "Hiểu nghĩa là tôi cần giúp đỡ.", target_en: "Understand it as I need help.", remediation_vi: "Nếu chỉ nhớ ਮਦਦ, ôn collocation đầy đủ.", remediation_en: "If only ਮਦਦ is remembered, review the full collocation.", canadaPractical: true, readiness: true, finalQuality: true },
      { id: "pa-fluency-chunk-002", focus: "word_chunks", pace: "guided", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", prompt_vi: "Đọc cụm dịch vụ này như một hành động.", prompt_en: "Read this service chunk as one action.", target_vi: "Hiểu là điền mẫu đơn ở quầy dịch vụ.", target_en: "Understand it as filling out a form at a counter.", remediation_vi: "Nếu dịch từng từ rời, ôn collocation deck.", remediation_en: "If translating word by word, review the collocation deck.", canadaPractical: true },
      { id: "pa-fluency-chunk-003", focus: "word_chunks", pace: "review", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", prompt_vi: "Đọc cụm sửa lỗi và chú ý chữ ਠ.", prompt_en: "Read the correction chunk and notice ਠ.", target_vi: "Hiểu là sửa lỗi, không đọc th theo English.", target_en: "Understand it as correcting a mistake, not English th.", remediation_vi: "Nếu đọc th kiểu English, quay lại script error deck.", remediation_en: "If th is read like English, return to the script error deck.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    focus: "vowel_sign_contrast",
    title_vi: "Đối lập dấu nguyên âm",
    title_en: "Vowel-Sign Contrast",
    fluencyGoal_vi: "Tự động nhận ra dấu nguyên âm đối lập trong âm tiết ngắn.",
    fluencyGoal_en: "Automatically recognize contrasting vowel signs in short syllables.",
    drills: [
      { id: "pa-fluency-vowel-001", focus: "vowel_sign_contrast", pace: "flash", gurmukhi: "ਕਿ / ਕੀ", romanization: "ki / kii", prompt_vi: "Đọc i ngắn và i dài không đảo thứ tự.", prompt_en: "Read short i and long ii without reversing order.", target_vi: "ਕਿ là i ngắn; ਕੀ là i dài.", target_en: "ਕਿ is short i; ਕੀ is long ii.", remediation_vi: "Nếu đảo thứ tự, ôn quy tắc ਿ viết trước đọc sau.", remediation_en: "If order reverses, review that ਿ is written before but read after.", learnerTrap: { vi: "ਿ viết trước nhưng đọc sau phụ âm.", en: "ਿ is written before but read after the consonant." }, finalQuality: true },
      { id: "pa-fluency-vowel-002", focus: "vowel_sign_contrast", pace: "flash", gurmukhi: "ਕੁ / ਕੂ", romanization: "ku / kuu", prompt_vi: "Chọn dấu u ngắn và u dài thật nhanh.", prompt_en: "Quickly choose short u and long uu.", target_vi: "Phân biệt ੁ trong ਕੁ và ੂ trong ਕੂ.", target_en: "Distinguish ੁ in ਕੁ and ੂ in ਕੂ.", remediation_vi: "Nếu nhầm, lặp lại cặp dấu dưới phụ âm.", remediation_en: "If missed, repeat the under-consonant sign pair." },
      { id: "pa-fluency-vowel-003", focus: "vowel_sign_contrast", pace: "readiness", gurmukhi: "ਕੇ / ਕੈ / ਕੌ", romanization: "ke / kai / kau", prompt_vi: "Đọc ba dấu trước khi vào biển hiệu.", prompt_en: "Read the three signs before signage work.", target_vi: "Không nhầm e, ai/ae và au.", target_en: "Do not confuse e, ai/ae, and au.", remediation_vi: "Nếu lẫn, quay lại reading ladder dấu nguyên âm.", remediation_en: "If mixed, return to the vowel-sign reading ladder.", learnerTrap: { vi: "ai/ae thay đổi theo romanization.", en: "ai/ae changes across romanization systems." }, readiness: true },
    ],
  },
  {
    focus: "addak_tippi_bindi",
    title_vi: "Addak, tippi, bindi",
    title_en: "Addak, Tippi, Bindi",
    fluencyGoal_vi: "Nhận ra dấu phụ nhỏ trong từ quen thuộc trước khi đọc nhanh.",
    fluencyGoal_en: "Recognize small marks in familiar words before fast reading.",
    drills: [
      { id: "pa-fluency-mark-001", focus: "addak_tippi_bindi", pace: "review", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", prompt_vi: "Tìm addak trong cả hai từ giao thông.", prompt_en: "Find addak in both transport words.", target_vi: "Chỉ ra ੱ trong ਬੱਸ và ਅੱਡਾ.", target_en: "Point to ੱ in ਬੱਸ and ਅੱਡਾ.", remediation_vi: "Nếu bỏ dấu, ôn addak trước survival signage.", remediation_en: "If skipped, review addak before survival signage.", learnerTrap: { vi: "Addak nhỏ nhưng không được bỏ qua.", en: "Addak is small but should not be skipped." }, canadaPractical: true },
      { id: "pa-fluency-mark-002", focus: "addak_tippi_bindi", pace: "guided", gurmukhi: "ਮਾਂ", romanization: "maan", prompt_vi: "Nhận ra bindi trong từ gia đình.", prompt_en: "Recognize bindi in a family word.", target_vi: "Chỉ ra ਂ ở trên trong ਮਾਂ.", target_en: "Point to ਂ above in ਮਾਂ.", remediation_vi: "Nếu không thấy dấu, phóng to chữ và ôn chậm.", remediation_en: "If the mark is missed, enlarge the script and review slowly." },
      { id: "pa-fluency-mark-003", focus: "addak_tippi_bindi", pace: "guided", gurmukhi: "ਪੰਜਾਬ", romanization: "panjab/punjab", prompt_vi: "Nhận ra tippi trong tên Punjabi.", prompt_en: "Recognize tippi in the name Punjabi.", target_vi: "Tìm ੰ trong ਪੰਜਾਬ dù Latin không hiện rõ.", target_en: "Find ੰ in ਪੰਜਾਬ even when Latin hides it.", remediation_vi: "Nếu chỉ nhìn Punjab, quay lại Gurmukhi.", remediation_en: "If only Punjab is seen, return to Gurmukhi.", learnerTrap: { vi: "Latin Punjab không hiện rõ tippi.", en: "Latin Punjab does not show tippi clearly." } },
    ],
  },
  {
    focus: "survival_signs",
    title_vi: "Biển sinh tồn",
    title_en: "Survival Signs",
    fluencyGoal_vi: "Đọc nhanh biển Gurmukhi có hành động thực tế ở Canada.",
    fluencyGoal_en: "Quickly read Gurmukhi signs with practical actions in Canada.",
    drills: [
      { id: "pa-fluency-sign-001", focus: "survival_signs", pace: "flash", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", prompt_vi: "Nhìn biển và chọn hành động ngay.", prompt_en: "See the sign and choose the action immediately.", target_vi: "Đi theo biển để tìm lối ra.", target_en: "Follow the sign to find the exit.", remediation_vi: "Nếu chỉ dịch chậm, ôn survival signage deck.", remediation_en: "If translation is slow, review the survival signage deck.", canadaPractical: true, readiness: true },
      { id: "pa-fluency-sign-002", focus: "survival_signs", pace: "flash", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", prompt_vi: "Nhận ra biển cấp cứu trong bệnh viện.", prompt_en: "Recognize the emergency sign in a hospital.", target_vi: "Hiểu đây là nơi cần trợ giúp khẩn cấp.", target_en: "Understand this as a place for urgent help.", remediation_vi: "Nếu chưa nhớ, ôn nhóm y tế và biển bệnh viện.", remediation_en: "If not remembered, review health and hospital signs.", canadaPractical: true },
      { id: "pa-fluency-sign-003", focus: "survival_signs", pace: "review", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", prompt_vi: "Đọc nhà thuốc bằng Gurmukhi trước English.", prompt_en: "Read pharmacy in Gurmukhi before English.", target_vi: "Xác nhận nghĩa nhà thuốc bằng chữ ਫ.", target_en: "Confirm pharmacy meaning through ਫ.", remediation_vi: "Nếu dựa vào English spelling, ôn bridge ph/f.", remediation_en: "If relying on English spelling, review the ph/f bridge.", learnerTrap: { vi: "English pharmacy không thay thế Gurmukhi.", en: "English pharmacy does not replace Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    focus: "service_words",
    title_vi: "Từ dịch vụ",
    title_en: "Service Words",
    fluencyGoal_vi: "Đọc nhanh từ dịch vụ, trường học, phòng khám và giấy tờ.",
    fluencyGoal_en: "Quickly read service, school, clinic, and paperwork words.",
    drills: [
      { id: "pa-fluency-service-001", focus: "service_words", pace: "guided", gurmukhi: "ਦਵਾਈ", romanization: "davai", prompt_vi: "Xếp từ này vào tình huống phòng khám.", prompt_en: "Sort this word into a clinic situation.", target_vi: "ਦਵਾਈ nghĩa là thuốc.", target_en: "ਦਵਾਈ means medicine.", remediation_vi: "Nếu quên, ôn thematic vocabulary sức khỏe.", remediation_en: "If forgotten, review health thematic vocabulary.", canadaPractical: true },
      { id: "pa-fluency-service-002", focus: "service_words", pace: "guided", gurmukhi: "ਕਿਰਾਇਆ", romanization: "kiraya", prompt_vi: "Đọc từ này trong mẫu nhà ở.", prompt_en: "Read this word in a housing form.", target_vi: "ਕਿਰਾਇਆ nghĩa là tiền thuê.", target_en: "ਕਿਰਾਇਆ means rent.", remediation_vi: "Nếu nhớ nghĩa nhưng không đọc chữ, ôn reading ladder.", remediation_en: "If meaning is remembered but script is not, review the reading ladder.", canadaPractical: true },
      { id: "pa-fluency-service-003", focus: "service_words", pace: "review", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", prompt_vi: "Đọc từ mượn này bằng Gurmukhi.", prompt_en: "Read this loanword through Gurmukhi.", target_vi: "ਸਕੂਲ nghĩa là trường học.", target_en: "ਸਕੂਲ means school.", remediation_vi: "Nếu chỉ nhìn English, ôn từ mượn trong Gurmukhi.", remediation_en: "If only English is seen, review loanwords in Gurmukhi.", learnerTrap: { vi: "Từ mượn vẫn cần đọc chữ Gurmukhi.", en: "Loanwords still need Gurmukhi reading." }, canadaPractical: true },
    ],
  },
  {
    focus: "high_frequency_verbs",
    title_vi: "Động từ tần suất cao",
    title_en: "High-Frequency Verbs",
    fluencyGoal_vi: "Nhận ra động từ lõi trong cụm hành động và câu hỗ trợ.",
    fluencyGoal_en: "Recognize core verbs in action chunks and support sentences.",
    drills: [
      { id: "pa-fluency-verb-001", focus: "high_frequency_verbs", pace: "review", gurmukhi: "ਕਰਨਾ", romanization: "karna", prompt_vi: "Nhìn động từ và tạo cụm hành động.", prompt_en: "See the verb and form an action chunk.", target_vi: "ਕਰਨਾ nghĩa là làm và ghép với danh từ.", target_en: "ਕਰਨਾ means do/make and combines with nouns.", remediation_vi: "Nếu đứng riêng khó nhớ, ôn ਅਨੁਵਾਦ ਕਰਨਾ.", remediation_en: "If isolated form is hard, review ਅਨੁਵਾਦ ਕਰਨਾ." },
      { id: "pa-fluency-verb-002", focus: "high_frequency_verbs", pace: "review", gurmukhi: "ਲੈਣਾ", romanization: "laina", prompt_vi: "Đọc động từ trong cụm đặt lịch.", prompt_en: "Read the verb inside an appointment chunk.", target_vi: "ਲੈਣਾ trong ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ là đặt/lấy lịch.", target_en: "ਲੈਣਾ in ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ means book/take an appointment.", remediation_vi: "Nếu nhầm, ôn clinic scenario.", remediation_en: "If missed, review the clinic scenario.", canadaPractical: true, readiness: true },
      { id: "pa-fluency-verb-003", focus: "high_frequency_verbs", pace: "readiness", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", prompt_vi: "Đọc câu báo chưa hiểu trong dịch vụ.", prompt_en: "Read the sentence for not understanding in service settings.", target_vi: "Dùng câu này khi cần hỗ trợ thêm.", target_en: "Use this sentence when more support is needed.", remediation_vi: "Nếu quên, ôn verb ਸਮਝਣਾ và câu hỗ trợ.", remediation_en: "If forgotten, review ਸਮਝਣਾ and support sentences.", canadaPractical: true, finalQuality: true },
    ],
  },
  {
    focus: "romanization_reduction",
    title_vi: "Giảm romanization",
    title_en: "Romanization Reduction",
    fluencyGoal_vi: "Giảm dần gợi ý Latin để tăng fluency Gurmukhi thật.",
    fluencyGoal_en: "Gradually reduce Latin hints to build real Gurmukhi fluency.",
    drills: [
      { id: "pa-fluency-roman-001", focus: "romanization_reduction", pace: "guided", gurmukhi: "ਫਲ", romanization: "phal/fal", prompt_vi: "Lần đầu xem phal/fal, lần sau chỉ xem ਫਲ.", prompt_en: "First see phal/fal, next time see only ਫਲ.", target_vi: "Xác nhận bằng Gurmukhi thay vì Latin.", target_en: "Confirm through Gurmukhi instead of Latin.", remediation_vi: "Nếu chỉ nhớ phal, ôn chữ ਫ.", remediation_en: "If only phal is remembered, review ਫ.", learnerTrap: { vi: "Romanization là cầu nối tạm thời.", en: "Romanization is a temporary bridge." }, reduceRomanization: true },
      { id: "pa-fluency-roman-002", focus: "romanization_reduction", pace: "review", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", prompt_vi: "Ẩn vadda/wadda rồi chọn dạng Gurmukhi.", prompt_en: "Hide vadda/wadda and choose the Gurmukhi form.", target_vi: "Giữ ਵੱਡਾ làm dạng chính.", target_en: "Keep ਵੱਡਾ as the primary form.", remediation_vi: "Nếu tách thành hai từ, ôn v/w bridge.", remediation_en: "If split into two words, review the v/w bridge.", learnerTrap: { vi: "v/w thay đổi theo nguồn.", en: "v/w varies by source." }, reduceRomanization: true },
      { id: "pa-fluency-roman-003", focus: "romanization_reduction", pace: "readiness", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", prompt_vi: "Đọc ਸ਼ਹਿਰ trước khi xem shahir/shehar.", prompt_en: "Read ਸ਼ਹਿਰ before seeing shahir/shehar.", target_vi: "Nhận ra chữ ਸ਼ và nghĩa thành phố/thị trấn.", target_en: "Recognize ਸ਼ and the meaning city/town.", remediation_vi: "Nếu cần Latin trước, ôn quick recognition ਸ਼.", remediation_en: "If Latin is needed first, review quick recognition for ਸ਼.", learnerTrap: { vi: "Latin khác nhau không luôn đổi nghĩa.", en: "Different Latin spellings do not always change meaning." }, readiness: true, reduceRomanization: true, finalQuality: true },
    ],
  },
  {
    focus: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness",
    fluencyGoal_vi: "Giữ fluency drill tập trung vào Gurmukhi và chỉ nhận biết Shahmukhi.",
    fluencyGoal_en: "Keep fluency drills focused on Gurmukhi with Shahmukhi awareness only.",
    drills: [
      { id: "pa-fluency-shahmukhi-001", focus: "shahmukhi_awareness", pace: "readiness", gurmukhi: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ", romanization: "gurmukhi vich parho", prompt_vi: "Xác nhận hệ chữ chính của bộ drill này.", prompt_en: "Confirm the primary script of this drill set.", target_vi: "Gurmukhi là chính; Shahmukhi chỉ là nhận biết.", target_en: "Gurmukhi is primary; Shahmukhi is awareness only.", remediation_vi: "Nếu muốn Shahmukhi đầy đủ, ghi chú là ngoài phạm vi.", remediation_en: "If full Shahmukhi is wanted, note that it is out of scope.", readiness: true },
    ],
  },
];

export const PUNJABI_GURMUKHI_FLUENCY_DRILLS = sections;

export const PUNJABI_GURMUKHI_FLUENCY_DRILL_ITEMS: ReadonlyArray<PunjabiFluencyDrill> =
  sections.flatMap((section) => section.drills);

export default PUNJABI_GURMUKHI_FLUENCY_DRILLS;
