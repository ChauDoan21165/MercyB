// Punjabi survival lessons for Vietnamese-speaking and English-speaking
// learners in travel, newcomer, and Canada practical situations.
//
// Gurmukhi is primary. Romanization is a learning aid, not a native-reviewed
// transcription. Shahmukhi is mentioned only for awareness: it is used by many
// Punjabi speakers in Pakistan, but this pack teaches Gurmukhi survival lines.
//
// Language support only: clinic, pharmacy, public office, bank, housing, school,
// and document lessons help learners request help and explain basic facts. They
// do not provide medical, legal, immigration, banking, or tenancy advice.

export type PunjabiSurvivalCategory =
  | "emergency"
  | "clinic_pharmacy"
  | "school"
  | "workplace"
  | "transit"
  | "housing"
  | "bank"
  | "public_office"
  | "interpreter_request"
  | "forms"
  | "food_allergy"
  | "lost_documents";

export type PunjabiSurvivalPhrase = {
  /** Gurmukhi script: the line learners can say or show. */
  pa: string;
  /** Practical romanization for Vietnamese and English readers. */
  roman: string;
  /** Vietnamese meaning or explanation. */
  vi: string;
  /** English meaning or explanation. */
  en: string;
  note_vi?: string;
  note_en?: string;
};

export type PunjabiSurvivalVocab = {
  cell_id?: string;
  pa: string;
  roman: string;
  vi: string;
  en: string;
};

export type PunjabiSurvivalLesson = {
  id: string;
  category: PunjabiSurvivalCategory;
  title_pa: string;
  title_vi: string;
  title_en: string;
  scenario_vi: string;
  scenario_en: string;
  phrases: PunjabiSurvivalPhrase[];
  vocab: PunjabiSurvivalVocab[];
  copy_paste: string[];
  practice_prompts_vi: string[];
  practice_prompts_en: string[];
};

export const punjabiSurvivalLessons: PunjabiSurvivalLesson[] = [
  {
    id: "pa-surv-01",
    category: "emergency",
    title_pa: "ਐਮਰਜੈਂਸੀ — ਮਦਦ ਮੰਗਣਾ",
    title_vi: "Khẩn cấp — xin giúp đỡ",
    title_en: "Emergency — asking for help",
    scenario_vi:
      "Dùng khi có tai nạn, nguy hiểm, hoặc bạn cần người khác gọi 911 ở Canada. Đây chỉ là ngôn ngữ để xin trợ giúp.",
    scenario_en:
      "Use when there is an accident, danger, or you need someone to call 911 in Canada. This is language support only.",
    phrases: [
      { pa: "ਮਦਦ ਕਰੋ!", roman: "madad karo!", vi: "Cứu với! / Giúp tôi!", en: "Help me!" },
      { pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ।", roman: "ih emergency hai.", vi: "Đây là trường hợp khẩn cấp.", en: "This is an emergency." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।", roman: "kirpa karke nau-ikk-ikk te call karo.", vi: "Làm ơn gọi 911.", en: "Please call 911." },
      { pa: "ਮੈਨੂੰ ਪੰਜਾਬੀ ਥੋੜ੍ਹੀ ਆਉਂਦੀ ਹੈ।", roman: "mainu Punjabi thori aundi hai.", vi: "Tôi biết một ít tiếng Punjabi.", en: "I know a little Punjabi." },
      { pa: "ਮੈਂ ਅੰਗਰੇਜ਼ੀ/ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।", roman: "main angrezi/vietnammi bolda/boldi han.", vi: "Tôi nói tiếng Anh/tiếng Việt.", en: "I speak English/Vietnamese." },
    ],
    vocab: [
      { pa: "ਮਦਦ", roman: "madad", vi: "sự giúp đỡ", en: "help" },
      { pa: "ਐਮਰਜੈਂਸੀ", roman: "emergency", vi: "khẩn cấp", en: "emergency" },
      { pa: "ਪੁਲਿਸ", roman: "pulis", vi: "cảnh sát", en: "police" },
      { pa: "ਐਂਬੂਲੈਂਸ", roman: "ambulance", vi: "xe cấp cứu", en: "ambulance" },
    ],
    copy_paste: ["ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।"],
    practice_prompts_vi: ["Tập nói câu nhờ người khác gọi 911 và chỉ vào nơi xảy ra sự việc."],
    practice_prompts_en: ["Practice asking someone to call 911 and pointing to where the incident happened."],
  },
  {
    id: "pa-surv-02",
    category: "clinic_pharmacy",
    title_pa: "ਕਲਿਨਿਕ ਅਤੇ ਫਾਰਮੇਸੀ",
    title_vi: "Phòng khám và nhà thuốc",
    title_en: "Clinic and pharmacy",
    scenario_vi:
      "Dùng để mô tả triệu chứng đơn giản, hỏi dược sĩ/bác sĩ, và yêu cầu giải thích dễ hiểu. Không tự chẩn đoán hoặc tự quyết định điều trị từ bài học này.",
    scenario_en:
      "Use to describe simple symptoms, speak to a pharmacist/clinician, and request plain explanations. Do not use this lesson as diagnosis or treatment advice.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।", roman: "mainu theek nahin lag riha.", vi: "Tôi thấy không khỏe.", en: "I do not feel well." },
      { pa: "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।", roman: "mainu ithe dard hai.", vi: "Tôi đau ở đây.", en: "It hurts here." },
      { pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।", roman: "mainu davai ton allergy hai.", vi: "Tôi bị dị ứng với thuốc.", en: "I am allergic to medicine." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।", roman: "kirpa karke hauli hauli samjhao.", vi: "Làm ơn giải thích chậm hơn.", en: "Please explain slowly." },
      { pa: "ਕੀ ਇਹ ਫਾਰਮਾਸਿਸਟ ਨਾਲ ਗੱਲ ਕਰਨ ਲਈ ਹੈ?", roman: "ki ih pharmacist nal gall karan lai hai?", vi: "Cái này là để nói với dược sĩ phải không?", en: "Is this for speaking with the pharmacist?" },
    ],
    vocab: [
      { pa: "ਕਲਿਨਿਕ", roman: "clinic", vi: "phòng khám", en: "clinic" },
      { pa: "ਫਾਰਮੇਸੀ", roman: "pharmacy", vi: "nhà thuốc", en: "pharmacy" },
      { pa: "ਦਰਦ", roman: "dard", vi: "đau", en: "pain" },
      { pa: "ਐਲਰਜੀ", roman: "allergy", vi: "dị ứng", en: "allergy" },
    ],
    copy_paste: ["ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ। ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।"],
    practice_prompts_vi: ["Chỉ vào chỗ đau và nói một câu ngắn với nhân viên phòng khám."],
    practice_prompts_en: ["Point to where it hurts and say one short sentence to clinic staff."],
  },
  {
    id: "pa-surv-03",
    category: "school",
    title_pa: "ਸਕੂਲ — ਮਾਪੇ ਅਤੇ ਵਿਦਿਆਰਥੀ",
    title_vi: "Trường học — phụ huynh và học sinh",
    title_en: "School — parents and students",
    scenario_vi:
      "Dùng khi nói với văn phòng trường, giáo viên, hoặc buổi họp phụ huynh về lịch, vắng mặt, và hỗ trợ ngôn ngữ.",
    scenario_en:
      "Use with a school office, teacher, or parent meeting about schedules, absences, and language support.",
    phrases: [
      { pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।", roman: "mera bacha aj gair-hazar hai.", vi: "Con tôi hôm nay vắng mặt.", en: "My child is absent today." },
      { pa: "ਮੀਟਿੰਗ ਕਦੋਂ ਹੈ?", roman: "meeting kadon hai?", vi: "Cuộc họp khi nào?", en: "When is the meeting?" },
      { pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?", roman: "ki tusin ih note angrezi vich de sakde ho?", vi: "Bạn có thể đưa ghi chú này bằng tiếng Anh không?", en: "Can you provide this note in English?" },
      { pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ।", roman: "mainu dubhashiye di lor hai.", vi: "Tôi cần thông dịch viên.", en: "I need an interpreter." },
    ],
    vocab: [
      { pa: "ਸਕੂਲ", roman: "school", vi: "trường học", en: "school" },
      { pa: "ਅਧਿਆਪਕ", roman: "adhyapak", vi: "giáo viên", en: "teacher" },
      { pa: "ਮੀਟਿੰਗ", roman: "meeting", vi: "cuộc họp", en: "meeting" },
      { pa: "ਗੈਰਹਾਜ਼ਰ", roman: "gair-hazar", vi: "vắng mặt", en: "absent" },
    ],
    copy_paste: ["ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕੀ ਅਸੀਂ ਮੀਟਿੰਗ ਲਈ ਸਮਾਂ ਬਦਲ ਸਕਦੇ ਹਾਂ?"],
    practice_prompts_vi: ["Tập báo với văn phòng trường rằng con bạn vắng mặt hôm nay."],
    practice_prompts_en: ["Practice telling the school office that your child is absent today."],
  },
  {
    id: "pa-surv-04",
    category: "workplace",
    title_pa: "ਕੰਮ ਦੀ ਥਾਂ",
    title_vi: "Nơi làm việc",
    title_en: "Workplace",
    scenario_vi:
      "Dùng trong ngày đầu đi làm, khi cần hỏi lịch, nhiệm vụ, an toàn, hoặc xin người quản lý nói chậm hơn.",
    scenario_en:
      "Use on the first day at work when asking about schedule, tasks, safety, or asking a supervisor to speak more slowly.",
    phrases: [
      { pa: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਦੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?", roman: "meri shift kadon shuru hundi hai?", vi: "Ca làm của tôi bắt đầu khi nào?", en: "When does my shift start?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।", roman: "kirpa karke ih dubara dikhao.", vi: "Làm ơn chỉ lại việc này.", en: "Please show this again." },
      { pa: "ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?", roman: "surakhia niyam ki han?", vi: "Quy tắc an toàn là gì?", en: "What are the safety rules?" },
      { pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।", roman: "mainu samajh nahin aia.", vi: "Tôi chưa hiểu.", en: "I did not understand." },
    ],
    vocab: [
      { pa: "ਕੰਮ", roman: "kamm", vi: "công việc", en: "work" },
      { pa: "ਸ਼ਿਫਟ", roman: "shift", vi: "ca làm", en: "shift" },
      { pa: "ਮੈਨੇਜਰ", roman: "manager", vi: "quản lý", en: "manager" },
      { pa: "ਸੁਰੱਖਿਆ", roman: "surakhia", vi: "an toàn", en: "safety" },
    ],
    copy_paste: ["ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ ਅਤੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।"],
    practice_prompts_vi: ["Tập hỏi quản lý ca làm bắt đầu lúc mấy giờ."],
    practice_prompts_en: ["Practice asking a manager what time your shift starts."],
  },
  {
    id: "pa-surv-05",
    category: "transit",
    title_pa: "ਬੱਸ ਅਤੇ ਟ੍ਰਾਂਜ਼ਿਟ",
    title_vi: "Xe buýt và giao thông công cộng",
    title_en: "Bus and transit",
    scenario_vi:
      "Dùng khi hỏi tuyến xe, điểm dừng, vé, hoặc khi bạn đi lạc trong thành phố Canada.",
    scenario_en:
      "Use when asking about routes, stops, fares, or when you are lost in a Canadian city.",
    phrases: [
      { pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?", roman: "ih bus kithe jandi hai?", vi: "Xe buýt này đi đâu?", en: "Where does this bus go?" },
      { pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ?", roman: "ki ih bus downtown jandi hai?", vi: "Xe này có đi trung tâm không?", en: "Does this bus go downtown?" },
      { pa: "ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।", roman: "mainu ithe utarna hai.", vi: "Tôi cần xuống ở đây.", en: "I need to get off here." },
      { pa: "ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।", roman: "main rasta bhul gaya/gai han.", vi: "Tôi bị lạc đường.", en: "I am lost." },
    ],
    vocab: [
      { pa: "ਬੱਸ", roman: "bus", vi: "xe buýt", en: "bus" },
      { pa: "ਸਟਾਪ", roman: "stop", vi: "trạm dừng", en: "stop" },
      { pa: "ਟਿਕਟ", roman: "ticket", vi: "vé", en: "ticket" },
      { pa: "ਰਸਤਾ", roman: "rasta", vi: "đường đi", en: "route / way" },
    ],
    copy_paste: ["ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ। ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ?"],
    practice_prompts_vi: ["Tập hỏi xe buýt này có đi đến nơi bạn muốn không."],
    practice_prompts_en: ["Practice asking whether this bus goes to your destination."],
  },
  {
    id: "pa-surv-06",
    category: "housing",
    title_pa: "ਕਿਰਾਏ ਦਾ ਘਰ",
    title_vi: "Nhà thuê",
    title_en: "Rental housing",
    scenario_vi:
      "Dùng khi xem nhà, nói với chủ nhà/người quản lý, hoặc báo vấn đề sửa chữa. Đây chỉ là ngôn ngữ giao tiếp, không phải tư vấn pháp lý về thuê nhà.",
    scenario_en:
      "Use when viewing a rental, speaking with a landlord/property manager, or reporting repairs. This is communication language, not tenancy legal advice.",
    phrases: [
      { pa: "ਕਿਰਾਇਆ ਕਿੰਨਾ ਹੈ?", roman: "kiraya kinna hai?", vi: "Tiền thuê là bao nhiêu?", en: "How much is the rent?" },
      { pa: "ਕੀ ਪਾਣੀ ਅਤੇ ਬਿਜਲੀ ਸ਼ਾਮਲ ਹਨ?", roman: "ki pani ate bijli shamil han?", vi: "Nước và điện có bao gồm không?", en: "Are water and electricity included?" },
      { pa: "ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।", roman: "heating kamm nahin kar rahi.", vi: "Máy sưởi không hoạt động.", en: "The heating is not working." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।", roman: "kirpa karke ih likh ke bhejo.", vi: "Làm ơn gửi điều này bằng văn bản.", en: "Please send this in writing." },
    ],
    vocab: [
      { pa: "ਕਿਰਾਇਆ", roman: "kiraya", vi: "tiền thuê", en: "rent" },
      { pa: "ਮਕਾਨ ਮਾਲਕ", roman: "makan malak", vi: "chủ nhà", en: "landlord" },
      { pa: "ਬਿਜਲੀ", roman: "bijli", vi: "điện", en: "electricity" },
      { pa: "ਮੁਰੰਮਤ", roman: "murammat", vi: "sửa chữa", en: "repair" },
    ],
    copy_paste: ["ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ। ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ।"],
    practice_prompts_vi: ["Tập báo một vấn đề trong căn hộ và xin câu trả lời bằng văn bản."],
    practice_prompts_en: ["Practice reporting a problem in the apartment and asking for a written reply."],
  },
  {
    id: "pa-surv-07",
    category: "bank",
    title_pa: "ਬੈਂਕ — ਖਾਤਾ ਅਤੇ ਕਾਰਡ",
    title_vi: "Ngân hàng — tài khoản và thẻ",
    title_en: "Bank — account and card",
    scenario_vi:
      "Dùng khi mở tài khoản, hỏi về thẻ, hoặc báo mất thẻ. Đây là ngôn ngữ giao tiếp, không phải tư vấn tài chính.",
    scenario_en:
      "Use when opening an account, asking about a card, or reporting a lost card. This is communication language, not financial advice.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ।", roman: "mainu bank khata kholhna hai.", vi: "Tôi muốn mở tài khoản ngân hàng.", en: "I want to open a bank account." },
      { pa: "ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ।", roman: "main nava aia/navi ai han.", vi: "Tôi mới đến.", en: "I am new here." },
      { pa: "ਮੇਰਾ ਕਾਰਡ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ।", roman: "mera card gumm ho gaya hai.", vi: "Thẻ của tôi bị mất.", en: "My card is lost." },
      { pa: "ਫੀਸ ਕਿੰਨੀ ਹੈ?", roman: "fees kinni hai?", vi: "Phí là bao nhiêu?", en: "How much is the fee?" },
    ],
    vocab: [
      { pa: "ਬੈਂਕ", roman: "bank", vi: "ngân hàng", en: "bank" },
      { pa: "ਖਾਤਾ", roman: "khata", vi: "tài khoản", en: "account" },
      { pa: "ਕਾਰਡ", roman: "card", vi: "thẻ", en: "card" },
      { pa: "ਫੀਸ", roman: "fees", vi: "phí", en: "fee" },
    ],
    copy_paste: ["ਮੈਨੂੰ ਬੈਂਕ ਖਾਤਾ ਖੋਲ੍ਹਣਾ ਹੈ। ਮੈਂ ਨਵਾਂ ਆਇਆ/ਆਈ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਫੀਸ ਸਮਝਾਓ।"],
    practice_prompts_vi: ["Tập nói bạn muốn mở tài khoản và hỏi phí hàng tháng."],
    practice_prompts_en: ["Practice saying you want to open an account and asking about monthly fees."],
  },
  {
    id: "pa-surv-08",
    category: "public_office",
    title_pa: "ਸਰਕਾਰੀ ਦਫ਼ਤਰ",
    title_vi: "Cơ quan công quyền",
    title_en: "Public office",
    scenario_vi:
      "Dùng ở thư viện, trung tâm dịch vụ, văn phòng thành phố, hoặc cơ quan công quyền khi hỏi quầy, giấy tờ, và lịch hẹn.",
    scenario_en:
      "Use at libraries, service centres, city offices, or public offices when asking about counters, documents, and appointments.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?", roman: "mainu kis counter te jana chahida hai?", vi: "Tôi nên đến quầy nào?", en: "Which counter should I go to?" },
      { pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਹੈ।", roman: "meri appointment hai.", vi: "Tôi có lịch hẹn.", en: "I have an appointment." },
      { pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?", roman: "mainu kihre dastavez chahide han?", vi: "Tôi cần giấy tờ nào?", en: "Which documents do I need?" },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।", roman: "kirpa karke number likh dio.", vi: "Làm ơn viết số xuống.", en: "Please write the number down." },
    ],
    vocab: [
      { pa: "ਦਫ਼ਤਰ", roman: "daftar", vi: "văn phòng", en: "office" },
      { pa: "ਕਾਊਂਟਰ", roman: "counter", vi: "quầy", en: "counter" },
      { pa: "ਅਪਾਇੰਟਮੈਂਟ", roman: "appointment", vi: "lịch hẹn", en: "appointment" },
      { pa: "ਦਸਤਾਵੇਜ਼", roman: "dastavez", vi: "giấy tờ", en: "documents" },
    ],
    copy_paste: ["ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਹੈ। ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?"],
    practice_prompts_vi: ["Tập hỏi bạn cần đến quầy nào và cần giấy tờ gì."],
    practice_prompts_en: ["Practice asking which counter to visit and which documents are needed."],
  },
  {
    id: "pa-surv-09",
    category: "interpreter_request",
    title_pa: "ਦੁਭਾਸ਼ੀਆ ਮੰਗਣਾ",
    title_vi: "Yêu cầu thông dịch viên",
    title_en: "Requesting an interpreter",
    scenario_vi:
      "Dùng ở bệnh viện, trường học, ngân hàng, văn phòng công quyền, hoặc cuộc hẹn quan trọng khi bạn cần hỗ trợ ngôn ngữ.",
    scenario_en:
      "Use at hospitals, schools, banks, public offices, or important appointments when you need language support.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ।", roman: "mainu dubhashiye di lor hai.", vi: "Tôi cần thông dịch viên.", en: "I need an interpreter." },
      { pa: "ਕੀ ਵਿਯਤਨਾਮੀ ਦੁਭਾਸ਼ੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?", roman: "ki vietnammi dubhashiya mil sakda hai?", vi: "Có thông dịch viên tiếng Việt không?", en: "Is a Vietnamese interpreter available?" },
      { pa: "ਕੀ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਗੱਲ ਕਰ ਸਕਦੇ ਹੋ?", roman: "ki angrezi vich gall kar sakde ho?", vi: "Bạn có thể nói bằng tiếng Anh không?", en: "Can we speak in English?" },
      { pa: "ਮੈਂ ਦਸਤਖ਼ਤ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਮਝਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।", roman: "main dastkhat karan ton pehlan samajhna chaunda/chaundi han.", vi: "Tôi muốn hiểu trước khi ký.", en: "I want to understand before signing." },
    ],
    vocab: [
      { pa: "ਦੁਭਾਸ਼ੀਆ", roman: "dubhashiya", vi: "thông dịch viên", en: "interpreter" },
      { pa: "ਭਾਸ਼ਾ", roman: "bhasha", vi: "ngôn ngữ", en: "language" },
      { pa: "ਸਮਝਣਾ", roman: "samajhna", vi: "hiểu", en: "to understand" },
      { pa: "ਦਸਤਖ਼ਤ", roman: "dastkhat", vi: "chữ ký / ký tên", en: "signature / to sign" },
    ],
    copy_paste: ["ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕੀ ਵਿਯਤਨਾਮੀ ਦੁਭਾਸ਼ੀਆ ਮਿਲ ਸਕਦਾ ਹੈ?"],
    practice_prompts_vi: ["Tập yêu cầu thông dịch viên trước khi ký giấy tờ."],
    practice_prompts_en: ["Practice requesting an interpreter before signing paperwork."],
  },
  {
    id: "pa-surv-10",
    category: "forms",
    title_pa: "ਫਾਰਮ ਭਰਨਾ",
    title_vi: "Điền biểu mẫu",
    title_en: "Filling out forms",
    scenario_vi:
      "Dùng khi điền đơn ở trường, phòng khám, ngân hàng, nhà thuê, hoặc cơ quan công quyền. Hỏi nghĩa của ô trống trước khi ký.",
    scenario_en:
      "Use when filling forms at school, a clinic, bank, rental office, or public office. Ask what a field means before signing.",
    phrases: [
      { pa: "ਇਸ ਦਾ ਕੀ ਮਤਲਬ ਹੈ?", roman: "is da ki matlab hai?", vi: "Cái này nghĩa là gì?", en: "What does this mean?" },
      { pa: "ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।", roman: "mainu ih form bharan vich madad chahidi hai.", vi: "Tôi cần giúp điền mẫu này.", en: "I need help filling out this form." },
      { pa: "ਕੀ ਇਹ ਲਾਜ਼ਮੀ ਹੈ?", roman: "ki ih lazmi hai?", vi: "Mục này có bắt buộc không?", en: "Is this required?" },
      { pa: "ਕੀ ਮੈਂ ਇਸ ਦੀ ਕਾਪੀ ਰੱਖ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?", roman: "ki main is di copy rakh sakda/sakdi han?", vi: "Tôi có thể giữ bản sao không?", en: "Can I keep a copy of this?" },
    ],
    vocab: [
      { pa: "ਫਾਰਮ", roman: "form", vi: "biểu mẫu", en: "form" },
      { pa: "ਨਾਮ", roman: "naam", vi: "tên", en: "name" },
      { pa: "ਪਤਾ", roman: "pata", vi: "địa chỉ", en: "address" },
      { pa: "ਜਨਮ ਤਾਰੀਖ", roman: "janam tarikh", vi: "ngày sinh", en: "date of birth" },
    ],
    copy_paste: ["ਮੈਨੂੰ ਇਹ ਫਾਰਮ ਭਰਨ ਵਿੱਚ ਮਦਦ ਚਾਹੀਦੀ ਹੈ। ਮੈਂ ਦਸਤਖ਼ਤ ਕਰਨ ਤੋਂ ਪਹਿਲਾਂ ਸਮਝਣਾ ਚਾਹੁੰਦਾ/ਚਾਹੁੰਦੀ ਹਾਂ।"],
    practice_prompts_vi: ["Tập hỏi nghĩa của một ô trong biểu mẫu và hỏi có bắt buộc không."],
    practice_prompts_en: ["Practice asking what a form field means and whether it is required."],
  },
  {
    id: "pa-surv-11",
    category: "food_allergy",
    title_pa: "ਖਾਣਾ ਅਤੇ ਐਲਰਜੀ",
    title_vi: "Đồ ăn và dị ứng",
    title_en: "Food and allergy",
    scenario_vi:
      "Dùng ở nhà hàng, quán ăn, trường học, hoặc nơi làm việc khi bạn cần nói dị ứng hoặc hạn chế ăn uống.",
    scenario_en:
      "Use at restaurants, school, work, or community meals when you need to state an allergy or food restriction.",
    phrases: [
      { pa: "ਮੈਨੂੰ ਮੂੰਗਫਲੀ ਤੋਂ ਐਲਰਜੀ ਹੈ।", roman: "mainu mungfali ton allergy hai.", vi: "Tôi dị ứng đậu phộng.", en: "I am allergic to peanuts." },
      { pa: "ਕੀ ਇਸ ਵਿੱਚ ਦੁੱਧ ਹੈ?", roman: "ki is vich duddh hai?", vi: "Trong món này có sữa không?", en: "Does this contain milk?" },
      { pa: "ਮੈਂ ਮਾਸ ਨਹੀਂ ਖਾਂਦਾ/ਖਾਂਦੀ।", roman: "main maas nahin khanda/khandi.", vi: "Tôi không ăn thịt.", en: "I do not eat meat." },
      { pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਮੱਗਰੀ ਦੱਸੋ।", roman: "kirpa karke samagri dasso.", vi: "Làm ơn cho biết nguyên liệu.", en: "Please tell me the ingredients." },
    ],
    vocab: [
      { pa: "ਖਾਣਾ", roman: "khana", vi: "đồ ăn", en: "food" },
      { pa: "ਮੂੰਗਫਲੀ", roman: "mungfali", vi: "đậu phộng", en: "peanuts" },
      { pa: "ਦੁੱਧ", roman: "duddh", vi: "sữa", en: "milk" },
      { pa: "ਸਮੱਗਰੀ", roman: "samagri", vi: "nguyên liệu", en: "ingredients" },
    ],
    copy_paste: ["ਮੈਨੂੰ ਮੂੰਗਫਲੀ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕੀ ਇਸ ਵਿੱਚ ਮੂੰਗਫਲੀ ਜਾਂ ਮੂੰਗਫਲੀ ਦਾ ਤੇਲ ਹੈ?"],
    practice_prompts_vi: ["Tập nói dị ứng của bạn và hỏi món ăn có nguyên liệu đó không."],
    practice_prompts_en: ["Practice stating your allergy and asking whether the food contains that ingredient."],
  },
  {
    id: "pa-surv-12",
    category: "lost_documents",
    title_pa: "ਗੁੰਮ ਹੋਏ ਦਸਤਾਵੇਜ਼",
    title_vi: "Mất giấy tờ",
    title_en: "Lost documents",
    scenario_vi:
      "Dùng khi mất hộ chiếu, giấy tờ tùy thân, thẻ ngân hàng, hoặc giấy tờ quan trọng và cần báo sự việc. Đây chỉ là ngôn ngữ để trình bày vấn đề, không phải tư vấn pháp lý.",
    scenario_en:
      "Use when a passport, ID, bank card, or important document is lost and you need to report the situation. This is reporting language, not legal advice.",
    phrases: [
      { pa: "ਮੇਰਾ ਪਾਸਪੋਰਟ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ।", roman: "mera passport gumm ho gaya hai.", vi: "Hộ chiếu của tôi bị mất.", en: "My passport is lost." },
      { pa: "ਮੇਰੇ ਦਸਤਾਵੇਜ਼ ਚੋਰੀ ਹੋ ਗਏ ਹਨ।", roman: "mere dastavez chori ho gaye han.", vi: "Giấy tờ của tôi bị đánh cắp.", en: "My documents were stolen." },
      { pa: "ਮੈਨੂੰ ਰਿਪੋਰਟ ਬਣਵਾਉਣੀ ਹੈ।", roman: "mainu report banvauni hai.", vi: "Tôi cần lập báo cáo.", en: "I need to make a report." },
      { pa: "ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਹੈ।", roman: "mere kol copy hai.", vi: "Tôi có bản sao.", en: "I have a copy." },
    ],
    vocab: [
      { pa: "ਪਾਸਪੋਰਟ", roman: "passport", vi: "hộ chiếu", en: "passport" },
      { pa: "ਦਸਤਾਵੇਜ਼", roman: "dastavez", vi: "giấy tờ", en: "documents" },
      { pa: "ਚੋਰੀ", roman: "chori", vi: "trộm cắp", en: "theft" },
      { pa: "ਰਿਪੋਰਟ", roman: "report", vi: "báo cáo", en: "report" },
    ],
    copy_paste: ["ਮੇਰਾ ਪਾਸਪੋਰਟ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ। ਮੈਨੂੰ ਰਿਪੋਰਟ ਬਣਵਾਉਣੀ ਹੈ। ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਹੈ।"],
    practice_prompts_vi: ["Tập báo mất hộ chiếu và nói rằng bạn có bản sao."],
    practice_prompts_en: ["Practice reporting a lost passport and saying you have a copy."],
  },
];

export default punjabiSurvivalLessons;
