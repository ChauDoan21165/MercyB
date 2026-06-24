// Punjabi emergency cards for Vietnamese-speaking and English-speaking
// learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.
//
// Language support only: these cards help learners ask for urgent help,
// describe what is happening, and show a clear line to a local helper.

export type PunjabiEmergencyTopic =
  | "medical_emergency"
  | "allergy"
  | "lost_passport_id"
  | "police_help"
  | "accident"
  | "lost_child"
  | "domestic_danger"
  | "cannot_speak_punjabi"
  | "need_interpreter"
  | "call_embassy_office"
  | "address_taxi"
  | "urgent_pharmacy";

export type PunjabiEmergencyCard = {
  id: string;
  topic: PunjabiEmergencyTopic;
  pa: string;
  roman: string;
  vi: string;
  en: string;
  show_text: string;
  note_vi?: string;
  note_en?: string;
};

type Entry = readonly [
  pa: string,
  roman: string,
  vi: string,
  en: string,
  show_text: string,
  note_vi?: string,
  note_en?: string,
];

let CARD_SEQ = 0;

function build(topic: PunjabiEmergencyTopic, entries: readonly Entry[]): PunjabiEmergencyCard[] {
  return entries.map((entry) => {
    const [pa, roman, vi, en, show_text, note_vi, note_en] = entry;
    CARD_SEQ += 1;
    const card: PunjabiEmergencyCard = {
      id: `punjabi-emerg-${String(CARD_SEQ).padStart(3, "0")}`,
      topic,
      pa,
      roman,
      vi,
      en,
      show_text,
    };
    if (note_vi) card.note_vi = note_vi;
    if (note_en) card.note_en = note_en;
    return card;
  });
}

export const PUNJABI_EMERGENCY_TOPICS: PunjabiEmergencyTopic[] = [
  "medical_emergency",
  "allergy",
  "lost_passport_id",
  "police_help",
  "accident",
  "lost_child",
  "domestic_danger",
  "cannot_speak_punjabi",
  "need_interpreter",
  "call_embassy_office",
  "address_taxi",
  "urgent_pharmacy",
];

const MEDICAL_EMERGENCY: Entry[] = [
  [
    "ਮਦਦ ਕਰੋ!",
    "madad karo!",
    "Cứu với!",
    "Help me!",
    "ਮਦਦ ਕਰੋ! ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
    "Ở Canada, 911 là số khẩn cấp.",
    "In Canada, 911 is the emergency line.",
  ],
  [
    "ਮੈਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੋ ਰਹੀ ਹੈ।",
    "mainu saah lain vich mushkil ho rahi hai.",
    "Tôi đang khó thở.",
    "I am having trouble breathing.",
    "ਮੈਨੂੰ ਸਾਹ ਲੈਣ ਵਿੱਚ ਮੁਸ਼ਕਲ ਹੋ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਨੂੰ ਕਾਲ ਕਰੋ।",
    "Nói câu này ngay nếu hô hấp không ổn.",
    "Use this immediately if breathing is not okay.",
  ],
  [
    "ਮੇਰੀ ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਹੈ।",
    "meri chhati vich dard hai.",
    "Tôi đau ngực.",
    "I have chest pain.",
    "ਮੇਰੀ ਛਾਤੀ ਵਿੱਚ ਦਰਦ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ।",
    "Dùng ở Canada khi bạn cần người khác gọi cấp cứu.",
    "Use this in Canada when someone should call an ambulance.",
  ],
];

const ALLERGY: Entry[] = [
  [
    "ਮੈਨੂੰ ਮੂੰਗਫਲੀ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    "mainu mungfali ton allergy hai.",
    "Tôi bị dị ứng đậu phộng.",
    "I am allergic to peanuts.",
    "ਮੈਨੂੰ ਮੂੰਗਫਲੀ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਨਾ ਦਿਓ।",
    "Ở Canada, báo dị ứng trước khi ăn hoặc nhận thuốc.",
    "In Canada, state the allergy before eating or taking medicine.",
  ],
  [
    "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
    "mainu davai ton allergy hai.",
    "Tôi bị dị ứng với thuốc.",
    "I am allergic to medicine.",
    "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
    "Dùng khi quầy thuốc hoặc phòng khám hỏi nhanh.",
    "Use this when the pharmacy or clinic asks quickly.",
  ],
  [
    "ਕੀ ਇਸ ਵਿੱਚ ਦੁੱਧ ਹੈ?",
    "ki is vich duddh hai?",
    "Trong này có sữa không?",
    "Does this contain milk?",
    "ਕੀ ਇਸ ਵਿੱਚ ਦੁੱਧ ਹੈ? ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।",
    "Hỏi rõ thành phần nếu bạn không chắc.",
    "Ask about ingredients if you are not sure.",
  ],
];

const LOST_PASSPORT_ID: Entry[] = [
  [
    "ਮੇਰਾ ਪਾਸਪੋਰਟ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ।",
    "mera passport gumm ho gaya hai.",
    "Hộ chiếu của tôi bị mất.",
    "My passport is lost.",
    "ਮੇਰਾ ਪਾਸਪੋਰਟ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ। ਮੈਨੂੰ ਰਿਪੋਰਟ ਬਣਵਾਉਣੀ ਹੈ।",
    "Giữ sẵn ảnh hộ chiếu và bản sao nếu có.",
    "Keep a photo copy of your passport if you have one.",
  ],
  [
    "ਮੇਰਾ ਆਈਡੀ ਕਾਰਡ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ।",
    "mera ID card gumm ho gaya hai.",
    "Thẻ căn cước của tôi bị mất.",
    "My ID card is lost.",
    "ਮੇਰਾ ਆਈਡੀ ਕਾਰਡ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    "Dùng khi bạn cần nói về giấy tờ tùy thân đã mất.",
    "Use this when you need to report a lost identity document.",
  ],
  [
    "ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਹੈ।",
    "mere kol copy hai.",
    "Tôi có bản sao.",
    "I have a copy.",
    "ਮੇਰੇ ਕੋਲ ਕਾਪੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਵੇਖੋ।",
    "Canada: một bản sao thường giúp khi bạn cần xác minh bước đầu.",
    "In Canada, a copy can help with initial verification.",
  ],
];

const POLICE_HELP: Entry[] = [
  [
    "ਕਿਰਪਾ ਕਰਕੇ ਪੁਲਿਸ ਨੂੰ ਕਾਲ ਕਰੋ।",
    "kirpa karke pulis nu call karo.",
    "Làm ơn gọi cảnh sát.",
    "Please call the police.",
    "ਕਿਰਪਾ ਕਰਕੇ ਪੁਲਿਸ ਨੂੰ ਕਾਲ ਕਰੋ। ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ।",
    "Ở Canada, đây là câu dùng khi có nguy hiểm ngay.",
    "In Canada, use this when there is immediate danger.",
  ],
  [
    "ਮੈਨੂੰ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ।",
    "mainu sahaita chahidi hai.",
    "Tôi cần hỗ trợ.",
    "I need help.",
    "ਮੈਨੂੰ ਸਹਾਇਤਾ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਗੱਲ ਸੁਣੋ।",
    "Câu ngắn này hữu ích khi bạn chưa thể kể dài.",
    "This short line helps when you cannot explain much yet.",
  ],
  [
    "ਮੈਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਵਾਉਣੀ ਹੈ।",
    "main shikait darj karvauni hai.",
    "Tôi muốn nộp đơn trình báo.",
    "I need to file a report.",
    "ਮੈਂ ਸ਼ਿਕਾਇਤ ਦਰਜ ਕਰਵਾਉਣੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਸਹੀ ਥਾਂ ਦਿਖਾਓ।",
    "Dùng sau khi bạn đã an toàn hơn.",
    "Use this after you are safer.",
  ],
];

const ACCIDENT: Entry[] = [
  [
    "ਹਾਦਸਾ ਹੋ ਗਿਆ ਹੈ।",
    "hadsa ho gaya hai.",
    "Đã xảy ra tai nạn.",
    "There has been an accident.",
    "ਹਾਦਸਾ ਹੋ ਗਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ 911 ਨੂੰ ਕਾਲ ਕਰੋ।",
    "Ở Canada, câu này phù hợp cho tai nạn xe hoặc tai nạn khác.",
    "In Canada, this works for car accidents or other incidents.",
  ],
  [
    "ਮੈਨੂੰ ਚੋਟ ਲੱਗੀ ਹੈ।",
    "mainu chot laggi hai.",
    "Tôi bị thương.",
    "I am injured.",
    "ਮੈਨੂੰ ਚੋਟ ਲੱਗੀ ਹੈ। ਮੈਨੂੰ ਡਾਕਟਰ ਚਾਹੀਦਾ ਹੈ।",
    "Nói câu này nếu bạn cần người khác đánh giá mức độ chấn thương.",
    "Use this if you need someone to assess the injury.",
  ],
  [
    "ਮੇਰੇ ਸਿਰ ਤੋਂ ਖੂਨ ਆ ਰਿਹਾ ਹੈ।",
    "mere sir ton khoon aa riha hai.",
    "Tôi đang chảy máu ở đầu.",
    "I am bleeding from the head.",
    "ਮੇਰੇ ਸਿਰ ਤੋਂ ਖੂਨ ਆ ਰਿਹਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਐਂਬੂਲੈਂਸ ਬੁਲਾਓ।",
    "Canada-practical: đi thẳng tới cấp cứu nếu tình trạng nặng.",
    "Canada-practical: go to emergency care if this is serious.",
  ],
];

const LOST_CHILD: Entry[] = [
  [
    "ਮੇਰਾ ਬੱਚਾ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ।",
    "mera bacha gumm ho gaya hai.",
    "Con tôi bị lạc.",
    "My child is missing.",
    "ਮੇਰਾ ਬੱਚਾ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    "Ở Canada, nói ngay với nhân viên an ninh hoặc cảnh sát.",
    "In Canada, tell security or police right away.",
  ],
  [
    "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੇ ਬੱਚੇ ਨੂੰ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰੋ।",
    "kirpa karke mere bache nu labhan vich madad karo.",
    "Làm ơn giúp tôi tìm con tôi.",
    "Please help me find my child.",
    "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੇ ਬੱਚੇ ਨੂੰ ਲੱਭਣ ਵਿੱਚ ਮਦਦ ਕਰੋ।",
    "Câu này phù hợp ở trung tâm mua sắm, công viên, hoặc ga tàu.",
    "This line works in malls, parks, or transit stations.",
  ],
  [
    "ਮੈਂ ਇੱਥੇ ਹੀ ਰਹਾਂਗਾ/ਰਹਾਂਗੀ।",
    "main ithe hi rahanga/rahangi.",
    "Tôi sẽ ở ngay đây.",
    "I will stay right here.",
    "ਮੈਂ ਇੱਥੇ ਹੀ ਰਹਾਂਗਾ/ਰਹਾਂਗੀ। ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਲਿਆਓ।",
    "Giữ vị trí để nhân viên có thể quay lại tìm bạn.",
    "Stay put so staff can return to you.",
  ],
];

const DOMESTIC_DANGER: Entry[] = [
  [
    "ਮੈਂ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹਾਂ।",
    "main surakhit nahin han.",
    "Tôi không an toàn.",
    "I am not safe.",
    "ਮੈਂ ਸੁਰੱਖਿਅਤ ਨਹੀਂ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਪੁਲਿਸ ਨੂੰ ਕਾਲ ਕਰੋ।",
    "Ở Canada, dùng câu này nếu bạn đang cần rời khỏi nguy hiểm.",
    "In Canada, use this if you need to leave danger now.",
  ],
  [
    "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੇ ਨਾਲ ਰਹੋ।",
    "kirpa karke mere nal raho.",
    "Làm ơn ở lại với tôi.",
    "Please stay with me.",
    "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੇ ਨਾਲ ਰਹੋ। ਮੈਨੂੰ ਡਰ ਲੱਗ ਰਿਹਾ ਹੈ।",
    "Dùng khi bạn cần một người lớn/nhân viên ở bên.",
    "Use this when you need a staff member or adult to stay with you.",
  ],
  [
    "ਮੈਨੂੰ ਹੁਣੇ ਜਾਣਾ ਹੈ।",
    "mainu huney jana hai.",
    "Tôi cần đi ngay bây giờ.",
    "I need to leave now.",
    "ਮੈਨੂੰ ਹੁਣੇ ਜਾਣਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਰਸਤਾ ਦਿਖਾਓ।",
    "Đây là câu ngắn để thoát khỏi tình huống nguy hiểm.",
    "This is a short line for getting out of danger.",
  ],
];

const CANNOT_SPEAK_PUNJABI: Entry[] = [
  [
    "ਮੈਨੂੰ ਪੰਜਾਬੀ ਨਹੀਂ ਆਉਂਦੀ।",
    "mainu Punjabi nahin aundi.",
    "Tôi không biết tiếng Punjabi.",
    "I do not speak Punjabi.",
    "ਮੈਨੂੰ ਪੰਜਾਬੀ ਨਹੀਂ ਆਉਂਦੀ। ਕਿਰਪਾ ਕਰਕੇ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਬੋਲੋ।",
    "Nói rõ để người đối diện đổi sang ngôn ngữ khác.",
    "Say this to switch the conversation to another language.",
  ],
  [
    "ਮੈਂ ਅੰਗਰੇਜ਼ੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।",
    "main angrezi bolda/boldi han.",
    "Tôi nói tiếng Anh.",
    "I speak English.",
    "ਮੈਂ ਅੰਗਰੇਜ਼ੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।",
    "Có ích khi bạn có thể dùng tiếng Anh tốt hơn Punjabi.",
    "Useful when English is easier than Punjabi.",
  ],
  [
    "ਮੈਂ ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ।",
    "main vietnammi bolda/boldi han.",
    "Tôi nói tiếng Việt.",
    "I speak Vietnamese.",
    "ਮੈਂ ਵਿਯਤਨਾਮੀ ਬੋਲਦਾ/ਬੋਲਦੀ ਹਾਂ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਭਾਸ਼ੀਆ ਦਿਓ।",
    "Dùng nếu bạn cần người hỗ trợ biết ngôn ngữ của bạn.",
    "Use this when you need support in your own language.",
  ],
];

const NEED_INTERPRETER: Entry[] = [
  [
    "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ।",
    "mainu dubhashiye di lor hai.",
    "Tôi cần thông dịch viên.",
    "I need an interpreter.",
    "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    "Ở Canada, đây là câu yêu cầu hỗ trợ ngôn ngữ rõ ràng.",
    "In Canada, this clearly requests language support.",
  ],
  [
    "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
    "kirpa karke hauli hauli bolo.",
    "Làm ơn nói chậm hơn.",
    "Please speak slowly.",
    "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ। ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਈ।",
    "Dùng khi bạn nghe được một phần nhưng chưa đủ.",
    "Use this when you heard part of it but not enough.",
  ],
  [
    "ਕੀ ਤੁਸੀਂ ਇਹ ਲਿਖ ਸਕਦੇ ਹੋ?",
    "ki tusi ih likh sakde ho?",
    "Bạn có thể viết ra không?",
    "Can you write it down?",
    "ਕੀ ਤੁਸੀਂ ਇਹ ਲਿਖ ਸਕਦੇ ਹੋ? ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ।",
    "Hữu ích ở bệnh viện, trường học, hoặc quầy dịch vụ.",
    "Helpful at a hospital, school, or service counter.",
  ],
];

const CALL_EMBASSY_OFFICE: Entry[] = [
  [
    "ਮੈਨੂੰ ਦੂਤਾਵਾਸ ਨਾਲ ਸੰਪਰਕ ਕਰਨਾ ਹੈ।",
    "mainu dutavas nal sampark karna hai.",
    "Tôi cần liên hệ với đại sứ quán.",
    "I need to contact the embassy.",
    "ਮੈਨੂੰ ਦੂਤਾਵਾਸ ਨਾਲ ਸੰਪਰਕ ਕਰਨਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਮਦਦ ਕਰੋ।",
    "Ở Canada, câu này dùng khi bạn cần hỗ trợ lãnh sự.",
    "In Canada, this is for consular support.",
  ],
  [
    "ਮੇਰਾ ਪਾਸਪੋਰਟ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ। ਮੈਨੂੰ ਦੂਤਾਵਾਸ ਜਾਣਾ ਹੈ।",
    "mera passport gumm ho gaya hai. mainu dutavas jana hai.",
    "Hộ chiếu của tôi bị mất. Tôi cần đến đại sứ quán.",
    "My passport is lost. I need to go to the embassy.",
    "ਮੇਰਾ ਪਾਸਪੋਰਟ ਗੁੰਮ ਹੋ ਗਿਆ ਹੈ। ਮੈਨੂੰ ਦੂਤਾਵਾਸ ਜਾਣਾ ਹੈ।",
    "Dùng khi bạn đang xử lý giấy tờ khẩn.",
    "Use this when you are handling urgent document issues.",
  ],
  [
    "ਕੀ ਤੁਸੀਂ ਪਤਾ ਲਿਖ ਸਕਦੇ ਹੋ?",
    "ki tusi pata likh sakde ho?",
    "Bạn có thể viết địa chỉ không?",
    "Can you write the address?",
    "ਕੀ ਤੁਸੀਂ ਪਤਾ ਲਿਖ ਸਕਦੇ ਹੋ? ਮੈਨੂੰ ਇਹ ਦੂਤਾਵਾਸ ਲਈ ਚਾਹੀਦਾ ਹੈ।",
    "Giúp bạn ghi đúng địa chỉ hoặc số điện thoại.",
    "Useful for writing down the address or phone number.",
  ],
];

const ADDRESS_TAXI: Entry[] = [
  [
    "ਮੈਨੂੰ ਇਸ ਪਤੇ ਤੇ ਜਾਣਾ ਹੈ।",
    "mainu is pate te jana hai.",
    "Tôi cần đến địa chỉ này.",
    "I need to go to this address.",
    "ਮੈਨੂੰ ਇਸ ਪਤੇ ਤੇ ਜਾਣਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇੱਥੇ ਲੈ ਚੱਲੋ।",
    "Ở Canada, câu này rất hữu ích khi lên taxi hoặc rideshare.",
    "In Canada, this is useful in a taxi or rideshare.",
  ],
  [
    "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਇਸ ਪਤੇ ਤੇ ਲੈ ਚੱਲੋ।",
    "kirpa karke mainu is pate te lai chalo.",
    "Làm ơn chở tôi đến địa chỉ này.",
    "Please take me to this address.",
    "ਕਿਰਪਾ ਕਰਕੇ ਮੈਨੂੰ ਇਸ ਪਤੇ ਤੇ ਲੈ ਚੱਲੋ। ਇਹ ਪਤਾ ਹੈ।",
    "Dùng khi bạn chỉ địa chỉ trên màn hình hoặc giấy.",
    "Use this while showing the address on a screen or paper.",
  ],
  [
    "ਇਹ ਪਤਾ ਹੈ।",
    "ih pata hai.",
    "Đây là địa chỉ.",
    "This is the address.",
    "ਇਹ ਪਤਾ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਇਸਨੂੰ ਪੜ੍ਹੋ।",
    "Giữ ngắn để tài xế đọc nhanh hơn.",
    "Keep it short so the driver can read it quickly.",
  ],
];

const URGENT_PHARMACY: Entry[] = [
  [
    "ਮੈਨੂੰ ਫਾਰਮੇਸੀ ਚਾਹੀਦੀ ਹੈ।",
    "mainu pharmacy chahidi hai.",
    "Tôi cần đến nhà thuốc.",
    "I need a pharmacy.",
    "ਮੈਨੂੰ ਫਾਰਮੇਸੀ ਚਾਹੀਦੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਨੇੜੇ ਦੀ ਫਾਰਮੇਸੀ ਦੱਸੋ।",
    "Ở Canada, câu này hữu ích khi bạn cần thuốc gấp.",
    "In Canada, this helps when you need medicine urgently.",
  ],
  [
    "ਮੈਨੂੰ ਆਪਣੀ ਦਵਾਈ ਤੁਰੰਤ ਚਾਹੀਦੀ ਹੈ।",
    "mainu apni davai turant chahidi hai.",
    "Tôi cần thuốc của tôi ngay.",
    "I need my medicine right away.",
    "ਮੈਨੂੰ ਆਪਣੀ ਦਵਾਈ ਤੁਰੰਤ ਚਾਹੀਦੀ ਹੈ।",
    "Dùng khi bạn cần tiếp cận thuốc sớm nhất có thể.",
    "Use this when you need access to your medicine as soon as possible.",
  ],
  [
    "ਕੀ ਇਹ ਸਹੀ ਦਵਾਈ ਹੈ?",
    "ki ih sahi davai hai?",
    "Đây có phải là thuốc đúng không?",
    "Is this the right medicine?",
    "ਕੀ ਇਹ ਸਹੀ ਦਵਾਈ ਹੈ? ਮੈਨੂੰ ਐਲਰਜੀ ਹੈ।",
    "Hỏi lại trước khi dùng nếu có bất kỳ nghi ngờ nào.",
    "Confirm before using if you have any doubt.",
  ],
];

export const PUNJABI_EMERGENCY_CARDS: PunjabiEmergencyCard[] = [
  ...build("medical_emergency", MEDICAL_EMERGENCY),
  ...build("allergy", ALLERGY),
  ...build("lost_passport_id", LOST_PASSPORT_ID),
  ...build("police_help", POLICE_HELP),
  ...build("accident", ACCIDENT),
  ...build("lost_child", LOST_CHILD),
  ...build("domestic_danger", DOMESTIC_DANGER),
  ...build("cannot_speak_punjabi", CANNOT_SPEAK_PUNJABI),
  ...build("need_interpreter", NEED_INTERPRETER),
  ...build("call_embassy_office", CALL_EMBASSY_OFFICE),
  ...build("address_taxi", ADDRESS_TAXI),
  ...build("urgent_pharmacy", URGENT_PHARMACY),
];

export const punjabiEmergencyCards = PUNJABI_EMERGENCY_CARDS;

export default punjabiEmergencyCards;
