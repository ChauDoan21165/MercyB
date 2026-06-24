// src/languages/punjabi/scriptVocabularyScenarioBridge.ts
//
// Punjabi script and vocabulary scenario bridge for Vietnamese-speaking and
// English-speaking learners. Gurmukhi is primary; romanization supports search.
// Native review is deferred.

export type PunjabiScenarioBridgeDomain =
  | "signage"
  | "service_counters"
  | "workplace_safety"
  | "school_notes"
  | "clinic_words"
  | "transport_words"
  | "high_frequency_verbs"
  | "collocations"
  | "romanization_bridge"
  | "shahmukhi_awareness";

export type PunjabiScenarioBridgeAction = "recognize" | "ask" | "follow" | "explain" | "route_to_review";

export type PunjabiScenarioBridgeItem = {
  id: string;
  domain: PunjabiScenarioBridgeDomain;
  action: PunjabiScenarioBridgeAction;
  scenario_vi: string;
  scenario_en: string;
  gurmukhi: string;
  romanization?: string;
  meaning_vi: string;
  meaning_en: string;
  learnerResponse_vi: string;
  learnerResponse_en: string;
  routing_vi: string;
  routing_en: string;
  learnerTrap?: {
    vi: string;
    en: string;
  };
  canadaPractical?: boolean;
  integrationReadiness?: boolean;
  review?: boolean;
};

export type PunjabiScenarioBridgeSection = {
  domain: PunjabiScenarioBridgeDomain;
  title_vi: string;
  title_en: string;
  bridgeGoal_vi: string;
  bridgeGoal_en: string;
  items: ReadonlyArray<PunjabiScenarioBridgeItem>;
};

export const PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_SCOPE = {
  vi: "Scenario bridge này nối chữ Gurmukhi và từ vựng Punjabi với biển hiệu, quầy dịch vụ, an toàn lao động, ghi chú trường học, phòng khám, giao thông, động từ và collocation. Shahmukhi chỉ là nhận biết, không phải khóa Shahmukhi đầy đủ. Native review được hoãn.",
  en: "This scenario bridge connects Gurmukhi script and Punjabi vocabulary to signage, service counters, workplace safety, school notes, clinics, transport, verbs, and collocations. Shahmukhi is awareness only, not a full Shahmukhi course. Native review is deferred.",
  noAudioScoringOrIntegration: true,
} as const;

const sections: ReadonlyArray<PunjabiScenarioBridgeSection> = [
  {
    domain: "signage",
    title_vi: "Bridge biển hiệu",
    title_en: "Signage Bridge",
    bridgeGoal_vi: "Chuyển nhận diện Gurmukhi thành hành động khi thấy biển nơi công cộng.",
    bridgeGoal_en: "Turn Gurmukhi recognition into action when seeing public signs.",
    items: [
      { id: "pa-scenario-sign-001", domain: "signage", action: "follow", scenario_vi: "Bạn ở ga tàu tại Canada và thấy biển lối ra.", scenario_en: "You are at a Canadian train station and see an exit sign.", gurmukhi: "ਨਿਕਾਸ", romanization: "nikaas", meaning_vi: "ਨਿਕਾਸ nghĩa là lối ra.", meaning_en: "ਨਿਕਾਸ means exit.", learnerResponse_vi: "Tôi đi theo biển để ra khỏi khu vực.", learnerResponse_en: "I follow the sign to leave the area.", routing_vi: "Nếu nhầm, ôn lại bộ survival signage.", routing_en: "If missed, review the survival signage deck.", canadaPractical: true, integrationReadiness: true },
      { id: "pa-scenario-sign-002", domain: "signage", action: "recognize", scenario_vi: "Bạn thấy chữ Punjabi cạnh chữ Emergency trong bệnh viện.", scenario_en: "You see Punjabi beside Emergency in a hospital.", gurmukhi: "ਐਮਰਜੈਂਸੀ", romanization: "emergency", meaning_vi: "Đây là khu cấp cứu hoặc tình huống khẩn cấp.", meaning_en: "This marks emergency care or an urgent situation.", learnerResponse_vi: "Tôi nhận ra đây là nơi cần trợ giúp khẩn cấp.", learnerResponse_en: "I recognize this as a place for urgent help.", routing_vi: "Nếu chưa nhận ra, ôn từ y tế và biển bệnh viện.", routing_en: "If not recognized, review health words and hospital signs.", canadaPractical: true, review: true },
      { id: "pa-scenario-sign-003", domain: "signage", action: "explain", scenario_vi: "Bạn cần giải thích vì sao ph/f đều có thể xuất hiện khi tìm nhà thuốc.", scenario_en: "You need to explain why ph/f may both appear when searching pharmacy.", gurmukhi: "ਫਾਰਮੇਸੀ", romanization: "pharmacy/farmacy", meaning_vi: "ਫਾਰਮੇਸੀ nghĩa là nhà thuốc.", meaning_en: "ਫਾਰਮੇਸੀ means pharmacy.", learnerResponse_vi: "Tôi xác nhận bằng chữ ਫ thay vì chỉ dựa vào Latin.", learnerResponse_en: "I confirm with ਫ instead of relying only on Latin.", routing_vi: "Nếu sai, quay lại romanization bridge cho ਫ.", routing_en: "If missed, return to the romanization bridge for ਫ.", learnerTrap: { vi: "English spelling không thay thế chữ Gurmukhi.", en: "English spelling does not replace Gurmukhi." }, canadaPractical: true },
    ],
  },
  {
    domain: "service_counters",
    title_vi: "Bridge quầy dịch vụ",
    title_en: "Service Counter Bridge",
    bridgeGoal_vi: "Dùng cụm và động từ Punjabi khi gặp mẫu đơn hoặc nhân viên dịch vụ.",
    bridgeGoal_en: "Use Punjabi chunks and verbs around forms and service staff.",
    items: [
      { id: "pa-scenario-service-001", domain: "service_counters", action: "ask", scenario_vi: "Bạn ở quầy dịch vụ và cần điền giấy.", scenario_en: "You are at a service counter and need to complete paperwork.", gurmukhi: "ਫਾਰਮ ਭਰਨਾ", romanization: "form bharna", meaning_vi: "Cụm này nghĩa là điền mẫu đơn.", meaning_en: "This phrase means to fill out a form.", learnerResponse_vi: "Tôi nhận ra nhiệm vụ là điền thông tin vào mẫu.", learnerResponse_en: "I recognize the task as entering information on a form.", routing_vi: "Nếu nhầm, ôn collocation với ਭਰਨਾ.", routing_en: "If missed, review collocations with ਭਰਨਾ.", canadaPractical: true, integrationReadiness: true },
      { id: "pa-scenario-service-002", domain: "service_counters", action: "ask", scenario_vi: "Bạn không hiểu câu hỏi của nhân viên.", scenario_en: "You do not understand the staff member's question.", gurmukhi: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਬੋਲੋ", romanization: "kirpa karke hauli bolo", meaning_vi: "Câu này là yêu cầu lịch sự: vui lòng nói chậm.", meaning_en: "This is a polite request: please speak slowly.", learnerResponse_vi: "Tôi dùng câu này để yêu cầu nói chậm hơn.", learnerResponse_en: "I use this sentence to ask for slower speech.", routing_vi: "Nếu khó đọc, ôn cụm lịch sự và từ ਹੌਲੀ.", routing_en: "If hard to read, review polite chunks and ਹੌਲੀ.", canadaPractical: true, review: true },
      { id: "pa-scenario-service-003", domain: "service_counters", action: "route_to_review", scenario_vi: "Bạn thấy câu sửa lỗi trên mẫu đơn.", scenario_en: "You see a correction phrase on a form.", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", meaning_vi: "Cụm này nghĩa là sửa lỗi.", meaning_en: "This phrase means to correct a mistake.", learnerResponse_vi: "Tôi chú ý chữ ਠ trong ਠੀਕ trước khi dùng romanization.", learnerResponse_en: "I notice ਠ in ਠੀਕ before using romanization.", routing_vi: "Nếu đọc th theo tiếng Anh, ôn script error deck.", routing_en: "If th is read like English, review the script error deck.", learnerTrap: { vi: "ਠ không phải th tiếng Anh.", en: "ਠ is not English th." }, canadaPractical: true },
    ],
  },
  {
    domain: "workplace_safety",
    title_vi: "Bridge an toàn lao động",
    title_en: "Workplace Safety Bridge",
    bridgeGoal_vi: "Nhận ra từ cảnh báo và hành động an toàn cơ bản ở nơi làm việc.",
    bridgeGoal_en: "Recognize warning words and basic safety actions at work.",
    items: [
      { id: "pa-scenario-work-001", domain: "workplace_safety", action: "recognize", scenario_vi: "Bạn thấy ghi chú an toàn gần khu vực nguy hiểm.", scenario_en: "You see a safety note near a hazardous area.", gurmukhi: "ਖਤਰਾ", romanization: "khatra", meaning_vi: "ਖਤਰਾ nghĩa là nguy hiểm.", meaning_en: "ਖਤਰਾ means danger.", learnerResponse_vi: "Tôi dừng lại và tìm hướng dẫn an toàn.", learnerResponse_en: "I stop and look for safety instructions.", routing_vi: "Nếu nhầm ਖ với ਕ, ôn cặp bật hơi.", routing_en: "If ਖ is confused with ਕ, review aspirated pairs.", learnerTrap: { vi: "ਖ có hơi; đừng đọc như ਕ.", en: "ਖ is aspirated; do not read it as ਕ." }, canadaPractical: true, integrationReadiness: true },
      { id: "pa-scenario-work-002", domain: "workplace_safety", action: "follow", scenario_vi: "Bạn thấy yêu cầu đeo đồ bảo hộ.", scenario_en: "You see an instruction to wear protective gear.", gurmukhi: "ਸੁਰੱਖਿਆ", romanization: "surakhia", meaning_vi: "ਸੁਰੱਖਿਆ nghĩa là an toàn hoặc bảo vệ.", meaning_en: "ਸੁਰੱਖਿਆ means safety or protection.", learnerResponse_vi: "Tôi liên hệ từ này với quy tắc an toàn lao động.", learnerResponse_en: "I connect this word with workplace safety rules.", routing_vi: "Nếu bỏ addak trong ਰੱਖ, ôn dấu ੱ.", routing_en: "If addak in ਰੱਖ is missed, review ੱ.", learnerTrap: { vi: "Addak trong ਸੁਰੱਖਿਆ dễ bị bỏ qua.", en: "The addak in ਸੁਰੱਖਿਆ is easy to skip." }, canadaPractical: true },
    ],
  },
  {
    domain: "school_notes",
    title_vi: "Bridge ghi chú trường học",
    title_en: "School Note Bridge",
    bridgeGoal_vi: "Đọc từ trường học và gia đình trong ghi chú ngắn.",
    bridgeGoal_en: "Read school and family words in short notes.",
    items: [
      { id: "pa-scenario-school-001", domain: "school_notes", action: "recognize", scenario_vi: "Bạn nhận ghi chú từ trường của con.", scenario_en: "You receive a note from a child's school.", gurmukhi: "ਸਕੂਲ", romanization: "school/skul", meaning_vi: "ਸਕੂਲ nghĩa là trường học.", meaning_en: "ਸਕੂਲ means school.", learnerResponse_vi: "Tôi xếp từ này vào chủ đề giáo dục.", learnerResponse_en: "I sort this word into the education theme.", routing_vi: "Nếu dựa quá nhiều vào English, ôn từ mượn Gurmukhi.", routing_en: "If relying too much on English, review Gurmukhi loanwords.", learnerTrap: { vi: "Từ mượn vẫn cần đọc bằng Gurmukhi.", en: "Loanwords still need Gurmukhi reading." }, canadaPractical: true },
      { id: "pa-scenario-school-002", domain: "school_notes", action: "explain", scenario_vi: "Ghi chú nhắc phụ huynh hoặc gia đình.", scenario_en: "A note mentions parents or family.", gurmukhi: "ਪਰਿਵਾਰ", romanization: "parivaar", meaning_vi: "ਪਰਿਵਾਰ nghĩa là gia đình.", meaning_en: "ਪਰਿਵਾਰ means family.", learnerResponse_vi: "Tôi nối từ này với chủ đề gia đình và trường học.", learnerResponse_en: "I connect this word with family and school themes.", routing_vi: "Nếu nhầm chủ đề, ôn thematic vocabulary.", routing_en: "If the theme is missed, review thematic vocabulary.", canadaPractical: true, review: true },
    ],
  },
  {
    domain: "clinic_words",
    title_vi: "Bridge phòng khám",
    title_en: "Clinic Word Bridge",
    bridgeGoal_vi: "Nhận diện từ y tế cần thiết khi đặt lịch hoặc nhận thuốc.",
    bridgeGoal_en: "Recognize essential health words when booking or receiving medicine.",
    items: [
      { id: "pa-scenario-clinic-001", domain: "clinic_words", action: "ask", scenario_vi: "Bạn cần đặt lịch khám ở phòng khám.", scenario_en: "You need to book a clinic visit.", gurmukhi: "ਐਪਾਇੰਟਮੈਂਟ ਲੈਣਾ", romanization: "appointment laina", meaning_vi: "Cụm này nghĩa là đặt hoặc lấy lịch hẹn.", meaning_en: "This phrase means to book or take an appointment.", learnerResponse_vi: "Tôi nhận ra ਲੈਣਾ theo ngữ cảnh dịch vụ.", learnerResponse_en: "I recognize ਲੈਣਾ by service context.", routing_vi: "Nếu nhầm động từ, ôn high-frequency verbs.", routing_en: "If the verb is missed, review high-frequency verbs.", canadaPractical: true, integrationReadiness: true },
      { id: "pa-scenario-clinic-002", domain: "clinic_words", action: "recognize", scenario_vi: "Bạn ở nhà thuốc sau khi gặp bác sĩ.", scenario_en: "You are at the pharmacy after seeing a doctor.", gurmukhi: "ਦਵਾਈ", romanization: "davai", meaning_vi: "ਦਵਾਈ nghĩa là thuốc.", meaning_en: "ਦਵਾਈ means medicine.", learnerResponse_vi: "Tôi nối từ này với phòng khám và nhà thuốc.", learnerResponse_en: "I connect this word with clinics and pharmacies.", routing_vi: "Nếu chưa nhớ, ôn chủ đề sức khỏe.", routing_en: "If not remembered, review the health theme.", canadaPractical: true, review: true },
    ],
  },
  {
    domain: "transport_words",
    title_vi: "Bridge giao thông",
    title_en: "Transport Word Bridge",
    bridgeGoal_vi: "Đọc từ xe buýt, ga tàu và lối ra trong di chuyển hằng ngày.",
    bridgeGoal_en: "Read bus, station, and exit words in daily transport.",
    items: [
      { id: "pa-scenario-transport-001", domain: "transport_words", action: "follow", scenario_vi: "Bạn tìm bến xe buýt gần nhà.", scenario_en: "You are looking for a bus stop.", gurmukhi: "ਬੱਸ ਅੱਡਾ", romanization: "bus adda", meaning_vi: "ਬੱਸ ਅੱਡਾ nghĩa là bến xe buýt.", meaning_en: "ਬੱਸ ਅੱਡਾ means bus stop or bus stand.", learnerResponse_vi: "Tôi nhận ra addak trong cả hai từ và đi đến bến.", learnerResponse_en: "I notice addak in the words and go to the stop.", routing_vi: "Nếu bỏ addak, ôn addak/tippi/bindi awareness.", routing_en: "If addak is missed, review addak/tippi/bindi awareness.", learnerTrap: { vi: "ਬੱਸ và ਅੱਡਾ đều có addak.", en: "ਬੱਸ and ਅੱਡਾ both have addak." }, canadaPractical: true },
      { id: "pa-scenario-transport-002", domain: "transport_words", action: "recognize", scenario_vi: "Bạn đọc biển ghép ở nhà ga.", scenario_en: "You read a combined sign at a station.", gurmukhi: "ਰੇਲਵੇ ਸਟੇਸ਼ਨ ਨਿਕਾਸ", romanization: "railway station nikaas", meaning_vi: "Cụm này nghĩa là lối ra ga tàu.", meaning_en: "This phrase means railway station exit.", learnerResponse_vi: "Tôi đi theo biển để ra khỏi ga.", learnerResponse_en: "I follow the sign to exit the station.", routing_vi: "Nếu chỉ hiểu từng từ, ôn final review biển ghép.", routing_en: "If only individual words are understood, review combined signs.", canadaPractical: true, integrationReadiness: true },
    ],
  },
  {
    domain: "high_frequency_verbs",
    title_vi: "Bridge động từ tần suất cao",
    title_en: "High-Frequency Verb Bridge",
    bridgeGoal_vi: "Dùng động từ lõi để hiểu hành động trong tình huống thật.",
    bridgeGoal_en: "Use core verbs to understand actions in real situations.",
    items: [
      { id: "pa-scenario-verb-001", domain: "high_frequency_verbs", action: "explain", scenario_vi: "Bạn thấy một cụm có danh từ cộng ਕਰਨਾ.", scenario_en: "You see a phrase with a noun plus ਕਰਨਾ.", gurmukhi: "ਅਨੁਵਾਦ ਕਰਨਾ", romanization: "anuvaad karna", meaning_vi: "Cụm này nghĩa là dịch.", meaning_en: "This phrase means to translate.", learnerResponse_vi: "Tôi nhận ra ਕਰਨਾ tạo cụm hành động với danh từ.", learnerResponse_en: "I recognize ਕਰਨਾ forming an action phrase with a noun.", routing_vi: "Nếu nhầm, ôn collocation danh từ + ਕਰਨਾ.", routing_en: "If missed, review noun + ਕਰਨਾ collocations.", canadaPractical: true },
      { id: "pa-scenario-verb-002", domain: "high_frequency_verbs", action: "ask", scenario_vi: "Bạn cần báo rằng mình chưa hiểu.", scenario_en: "You need to say that you did not understand.", gurmukhi: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ", romanization: "mainu samajh nahi aai", meaning_vi: "Câu này nghĩa là tôi chưa hiểu.", meaning_en: "This sentence means I did not understand.", learnerResponse_vi: "Tôi dùng câu này rồi xin nói chậm hơn.", learnerResponse_en: "I use this sentence and then ask for slower speech.", routing_vi: "Nếu khó đọc, ôn verb ਸਮਝਣਾ và cụm hỗ trợ.", routing_en: "If hard to read, review ਸਮਝਣਾ and support phrases.", canadaPractical: true, review: true },
    ],
  },
  {
    domain: "collocations",
    title_vi: "Bridge collocation",
    title_en: "Collocation Bridge",
    bridgeGoal_vi: "Chuyển cụm đã học thành phản ứng ngắn trong dịch vụ và nơi công cộng.",
    bridgeGoal_en: "Turn learned chunks into short responses in services and public places.",
    items: [
      { id: "pa-scenario-collocation-001", domain: "collocations", action: "ask", scenario_vi: "Bạn cần giúp ở nơi công cộng.", scenario_en: "You need help in a public place.", gurmukhi: "ਮੈਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ", romanization: "mainu madad chahidi hai", meaning_vi: "Câu này nghĩa là tôi cần giúp đỡ.", meaning_en: "This sentence means I need help.", learnerResponse_vi: "Tôi dùng câu này ở dịch vụ, y tế hoặc giao thông.", learnerResponse_en: "I use this sentence in service, health, or transport settings.", routing_vi: "Nếu thiếu ਚਾਹੀਦੀ ਹੈ, ôn collocation sinh tồn.", routing_en: "If ਚਾਹੀਦੀ ਹੈ is missing, review survival collocations.", canadaPractical: true, integrationReadiness: true },
      { id: "pa-scenario-collocation-002", domain: "collocations", action: "follow", scenario_vi: "Nhân viên yêu cầu bạn sửa lỗi trên giấy.", scenario_en: "A staff member asks you to correct an error on paper.", gurmukhi: "ਗਲਤੀ ਠੀਕ ਕਰਨਾ", romanization: "galti theek karna", meaning_vi: "Cụm này nghĩa là sửa lỗi.", meaning_en: "This phrase means to correct a mistake.", learnerResponse_vi: "Tôi hiểu cần sửa thông tin sai.", learnerResponse_en: "I understand that incorrect information needs fixing.", routing_vi: "Nếu nhầm ਠ, quay lại script error deck.", routing_en: "If ਠ is missed, return to the script error deck.", learnerTrap: { vi: "Romanization th không phải âm th tiếng Anh.", en: "Romanized th is not English th." }, canadaPractical: true },
    ],
  },
  {
    domain: "romanization_bridge",
    title_vi: "Bridge romanization",
    title_en: "Romanization Bridge",
    bridgeGoal_vi: "Dùng romanization để tìm kiếm nhưng xác nhận bằng chữ Gurmukhi.",
    bridgeGoal_en: "Use romanization for search but confirm with Gurmukhi script.",
    items: [
      { id: "pa-scenario-roman-001", domain: "romanization_bridge", action: "explain", scenario_vi: "Bạn tìm từ trái cây bằng chữ Latin.", scenario_en: "You search a fruit word using Latin letters.", gurmukhi: "ਫਲ", romanization: "phal/fal", meaning_vi: "ਫਲ nghĩa là trái cây hoặc quả.", meaning_en: "ਫਲ means fruit in context.", learnerResponse_vi: "Tôi thử phal hoặc fal rồi xác nhận bằng ਫਲ.", learnerResponse_en: "I try phal or fal and then confirm with ਫਲ.", routing_vi: "Nếu chỉ tin Latin, ôn vai trò bridge của romanization.", routing_en: "If Latin is overtrusted, review romanization as a bridge.", learnerTrap: { vi: "ਫ có thể ghi ph hoặc f.", en: "ਫ may be written ph or f." }, review: true },
      { id: "pa-scenario-roman-002", domain: "romanization_bridge", action: "recognize", scenario_vi: "Bạn thấy hai spelling vadda và wadda trong tài liệu học.", scenario_en: "You see vadda and wadda in learning materials.", gurmukhi: "ਵੱਡਾ", romanization: "vadda/wadda", meaning_vi: "ਦੋਵੇਂ dạng Latin có thể trỏ về ਵੱਡਾ.", meaning_en: "Both Latin forms can point to ਵੱਡਾ.", learnerResponse_vi: "Tôi giữ Gurmukhi ਵੱਡਾ làm chuẩn.", learnerResponse_en: "I keep Gurmukhi ਵੱਡਾ as the standard.", routing_vi: "Nếu tách thành hai từ, ôn bridge v/w.", routing_en: "If treated as two words, review the v/w bridge.", learnerTrap: { vi: "v/w thay đổi theo nguồn và giọng.", en: "v/w varies by source and accent." } },
      { id: "pa-scenario-roman-003", domain: "romanization_bridge", action: "route_to_review", scenario_vi: "Bạn tìm tên thành phố/khu vực bằng shehar hoặc shahir.", scenario_en: "You search a city/place word as shehar or shahir.", gurmukhi: "ਸ਼ਹਿਰ", romanization: "shahir/shehar", meaning_vi: "ਸ਼ਹਿਰ nghĩa là thành phố hoặc đô thị.", meaning_en: "ਸ਼ਹਿਰ means city or town.", learnerResponse_vi: "Tôi xác nhận kết quả bằng Gurmukhi ਸ਼ਹਿਰ.", learnerResponse_en: "I confirm the result with Gurmukhi ਸ਼ਹਿਰ.", routing_vi: "Nếu nhầm ਸ਼ với ਸ, ôn Gurmukhi recognition.", routing_en: "If ਸ਼ is confused with ਸ, review Gurmukhi recognition.", learnerTrap: { vi: "Romanization khác nhau không luôn đổi nghĩa.", en: "Different romanization does not always change meaning." }, integrationReadiness: true },
    ],
  },
  {
    domain: "shahmukhi_awareness",
    title_vi: "Nhận biết Shahmukhi",
    title_en: "Shahmukhi Awareness",
    bridgeGoal_vi: "Giữ phạm vi học: Gurmukhi là chính, Shahmukhi chỉ để nhận biết.",
    bridgeGoal_en: "Keep scope clear: Gurmukhi is primary, Shahmukhi is awareness only.",
    items: [
      { id: "pa-scenario-shahmukhi-001", domain: "shahmukhi_awareness", action: "explain", scenario_vi: "Bạn thấy nhắc đến một hệ chữ Punjabi khác.", scenario_en: "You see a mention of another Punjabi script.", gurmukhi: "ਗੁਰਮੁਖੀ ਵਿੱਚ ਪੜ੍ਹੋ", romanization: "gurmukhi vich parho", meaning_vi: "Bài này tiếp tục đọc bằng Gurmukhi.", meaning_en: "This material continues reading in Gurmukhi.", learnerResponse_vi: "Tôi biết Shahmukhi chỉ là nhận biết, không phải khóa đầy đủ.", learnerResponse_en: "I know Shahmukhi is awareness only, not a full course.", routing_vi: "Tiếp tục học các scenario bằng Gurmukhi.", routing_en: "Continue studying scenarios through Gurmukhi.", review: true },
    ],
  },
];

export const PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE = sections;

export const PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE_ITEMS: ReadonlyArray<PunjabiScenarioBridgeItem> =
  sections.flatMap((section) => section.items);

export default PUNJABI_SCRIPT_VOCABULARY_SCENARIO_BRIDGE;
