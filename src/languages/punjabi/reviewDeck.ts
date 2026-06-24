// Punjabi review deck seed data for Vietnamese-speaking and English-speaking
// learners.
//
// Gurmukhi is primary. Romanization is a learner bridge only. Shahmukhi is
// awareness only, not a full course. Native review is deferred.

export type PunjabiReviewTopic =
  | "survival"
  | "health"
  | "work"
  | "public_services"
  | "food"
  | "housing"
  | "school"
  | "family"
  | "transit";

export type PunjabiReviewLevel = "A1" | "A2" | "B1" | "B2";

export type PunjabiReviewCard = {
  id: string;
  topic: PunjabiReviewTopic;
  topic_vi: string;
  topic_en: string;
  level: PunjabiReviewLevel;
  prompt_vi: string;
  prompt_en: string;
  answer_pa: string;
  answer_romanization: string;
  answer_vi: string;
  answer_en: string;
  hint_vi: string;
  hint_en: string;
  common_mistake_vi: string;
  common_mistake_en: string;
};

type PunjabiReviewTopicMeta = {
  topic_vi: string;
  topic_en: string;
  hint_vi: string;
  hint_en: string;
  common_mistake_vi: string;
  common_mistake_en: string;
};

type PunjabiReviewEntry = {
  answer_pa: string;
  answer_romanization: string;
  answer_vi: string;
  answer_en: string;
};

type PunjabiReviewTopicData = {
  topic: PunjabiReviewTopic;
  meta: PunjabiReviewTopicMeta;
  entries: PunjabiReviewEntry[];
};

export type PunjabiReviewDeckScope = {
  name: string;
  audience: string[];
  scriptPolicy: string;
  reviewStatus: string;
  boundaries: string[];
};

export const PUNJABI_REVIEW_DECK_SCOPE: PunjabiReviewDeckScope = {
  name: "Punjabi Review Deck",
  audience: ["Vietnamese-speaking learners", "English-speaking learners"],
  scriptPolicy:
    "Gurmukhi is primary. Romanization supports recognition. Shahmukhi is awareness only, not a full course.",
  reviewStatus: "Native review is deferred.",
  boundaries: [
    "Language support only for review-card seed data.",
    "No medical, legal, financial, tenancy, or workplace safety advice.",
  ],
};

export const PUNJABI_REVIEW_TOPICS: PunjabiReviewTopic[] = [
  "survival",
  "health",
  "work",
  "public_services",
  "food",
  "housing",
  "school",
  "family",
  "transit",
];

const LEVELS: PunjabiReviewLevel[] = ["A1", "A2", "B1", "B2"];

const TOPIC_DATA: PunjabiReviewTopicData[] = [
  {
    topic: "survival",
    meta: {
      topic_vi: "Khẩn cấp / sinh tồn",
      topic_en: "Survival / emergency",
      hint_vi: "Giữ câu ngắn, rõ, và xin hỗ trợ ngay ở Canada.",
      hint_en: "Keep the line short, clear, and ask for help right away in Canada.",
      common_mistake_vi: "Đừng kể quá dài trước khi nói bạn cần giúp.",
      common_mistake_en: "Do not tell a long story before saying you need help.",
    },
    entries: [
      {
        answer_pa: "ਮਦਦ ਕਰੋ!",
        answer_romanization: "madad karo!",
        answer_vi: "Cứu với! / Giúp tôi!",
        answer_en: "Help me!",
      },
      {
        answer_pa: "ਇਹ ਐਮਰਜੈਂਸੀ ਹੈ।",
        answer_romanization: "ih emergency hai.",
        answer_vi: "Đây là trường hợp khẩn cấp.",
        answer_en: "This is an emergency.",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ 911 ਤੇ ਕਾਲ ਕਰੋ।",
        answer_romanization: "kirpa karke nau-ikk-ikk te call karo.",
        answer_vi: "Làm ơn gọi 911.",
        answer_en: "Please call 911.",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
        answer_romanization: "mainu samajh nahin aaya.",
        answer_vi: "Tôi chưa hiểu.",
        answer_en: "I did not understand.",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਬੋਲੋ।",
        answer_romanization: "kirpa karke hauli hauli bolo.",
        answer_vi: "Làm ơn nói chậm hơn.",
        answer_en: "Please speak slowly.",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ।",
        answer_romanization: "mainu dubhashiye di lor hai.",
        answer_vi: "Tôi cần thông dịch viên.",
        answer_en: "I need an interpreter.",
      },
    ],
  },
  {
    topic: "health",
    meta: {
      topic_vi: "Sức khỏe",
      topic_en: "Health",
      hint_vi: "Nói triệu chứng, dị ứng, và xin giải thích chậm.",
      hint_en: "State symptoms, allergies, and ask for a slow explanation.",
      common_mistake_vi: "Đừng tự chẩn đoán hoặc tự đổi thuốc trong câu này.",
      common_mistake_en: "Do not diagnose yourself or change medicine in this line.",
    },
    entries: [
      {
        answer_pa: "ਮੈਨੂੰ ਠੀਕ ਨਹੀਂ ਲੱਗ ਰਿਹਾ।",
        answer_romanization: "mainu theek nahin lag riha.",
        answer_vi: "Tôi thấy không khỏe.",
        answer_en: "I do not feel well.",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਇੱਥੇ ਦਰਦ ਹੈ।",
        answer_romanization: "mainu ithe dard hai.",
        answer_vi: "Tôi đau ở đây.",
        answer_en: "It hurts here.",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਦਵਾਈ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
        answer_romanization: "mainu davai ton allergy hai.",
        answer_vi: "Tôi bị dị ứng với thuốc.",
        answer_en: "I am allergic to medicine.",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਦਿਓ।",
        answer_romanization: "kirpa karke ih likh dio.",
        answer_vi: "Làm ơn viết điều này ra.",
        answer_en: "Please write this down.",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਹੌਲੀ ਹੌਲੀ ਸਮਝਾਓ।",
        answer_romanization: "kirpa karke hauli hauli samjhao.",
        answer_vi: "Làm ơn giải thích chậm hơn.",
        answer_en: "Please explain slowly.",
      },
      {
        answer_pa: "ਕੀ ਇਹ ਫਾਰਮਾਸਿਸਟ ਨਾਲ ਗੱਲ ਕਰਨ ਲਈ ਹੈ?",
        answer_romanization: "ki ih pharmacist nal gall karan lai hai?",
        answer_vi: "Câu này là để nói với dược sĩ phải không?",
        answer_en: "Is this for speaking with the pharmacist?",
      },
    ],
  },
  {
    topic: "work",
    meta: {
      topic_vi: "Công việc",
      topic_en: "Work",
      hint_vi: "Hỏi lịch, nhiệm vụ, và an toàn ở chỗ làm.",
      hint_en: "Ask about schedule, tasks, and safety at work.",
      common_mistake_vi: "Đừng đoán quy tắc an toàn nếu chưa được hướng dẫn.",
      common_mistake_en: "Do not guess safety rules if you have not been shown them.",
    },
    entries: [
      {
        answer_pa: "ਮੇਰੀ ਸ਼ਿਫਟ ਕਦੋਂ ਸ਼ੁਰੂ ਹੁੰਦੀ ਹੈ?",
        answer_romanization: "meri shift kadon shuru hundi hai?",
        answer_vi: "Ca làm của tôi bắt đầu khi nào?",
        answer_en: "When does my shift start?",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਦੁਬਾਰਾ ਦਿਖਾਓ।",
        answer_romanization: "kirpa karke ih dubara dikhao.",
        answer_vi: "Làm ơn chỉ lại việc này.",
        answer_en: "Please show this again.",
      },
      {
        answer_pa: "ਸੁਰੱਖਿਆ ਨਿਯਮ ਕੀ ਹਨ?",
        answer_romanization: "surakhia niyam ki han?",
        answer_vi: "Quy tắc an toàn là gì?",
        answer_en: "What are the safety rules?",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਸਮਝ ਨਹੀਂ ਆਇਆ।",
        answer_romanization: "mainu samajh nahin aaya.",
        answer_vi: "Tôi chưa hiểu.",
        answer_en: "I did not understand.",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਬਰੇਕ ਕਦੋਂ ਮਿਲੇਗੀ?",
        answer_romanization: "mainu break kadon milegi?",
        answer_vi: "Tôi sẽ được nghỉ khi nào?",
        answer_en: "When will I get a break?",
      },
      {
        answer_pa: "ਕੀ ਮੈਂ ਇਹ ਲਿਖ ਕੇ ਲੈ ਸਕਦਾ/ਸਕਦੀ ਹਾਂ?",
        answer_romanization: "ki main ih likh ke lai sakda/sakdi han?",
        answer_vi: "Tôi có thể mang câu này ra giấy không?",
        answer_en: "Can I have this in writing?",
      },
    ],
  },
  {
    topic: "public_services",
    meta: {
      topic_vi: "Dịch vụ công",
      topic_en: "Public services",
      hint_vi: "Hỏi quầy, giấy tờ, số thứ tự, và biểu mẫu ở Canada.",
      hint_en: "Ask about the counter, documents, queue number, and forms in Canada.",
      common_mistake_vi: "Đừng tự điền form nếu một phần còn mơ hồ.",
      common_mistake_en: "Do not fill in a form if one section is still unclear.",
    },
    entries: [
      {
        answer_pa: "ਮੈਨੂੰ ਕਿਸ ਕਾਊਂਟਰ ਤੇ ਜਾਣਾ ਚਾਹੀਦਾ ਹੈ?",
        answer_romanization: "mainu kis counter te jana chahida hai?",
        answer_vi: "Tôi nên đến quầy nào?",
        answer_en: "Which counter should I go to?",
      },
      {
        answer_pa: "ਮੇਰੀ ਅਪਾਇੰਟਮੈਂਟ ਹੈ।",
        answer_romanization: "meri appointment hai.",
        answer_vi: "Tôi có lịch hẹn.",
        answer_en: "I have an appointment.",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਕਿਹੜੇ ਦਸਤਾਵੇਜ਼ ਚਾਹੀਦੇ ਹਨ?",
        answer_romanization: "mainu kihre dastavez chahide han?",
        answer_vi: "Tôi cần giấy tờ nào?",
        answer_en: "Which documents do I need?",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਨੰਬਰ ਲਿਖ ਦਿਓ।",
        answer_romanization: "kirpa karke number likh dio.",
        answer_vi: "Làm ơn viết số xuống.",
        answer_en: "Please write the number down.",
      },
      {
        answer_pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਫਾਰਮ ਸਮਝਾ ਸਕਦੇ ਹੋ?",
        answer_romanization: "ki tusin ih form samjha sakde ho?",
        answer_vi: "Bạn có thể giải thích mẫu đơn này không?",
        answer_en: "Can you explain this form?",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਕਿਹੜਾ ਫਾਰਮ ਭਰਨਾ ਹੈ?",
        answer_romanization: "mainu kihra form bharna hai?",
        answer_vi: "Tôi phải điền mẫu nào?",
        answer_en: "Which form do I need to fill out?",
      },
    ],
  },
  {
    topic: "food",
    meta: {
      topic_vi: "Đồ ăn",
      topic_en: "Food",
      hint_vi: "Nêu dị ứng hoặc món bạn tránh trước khi ăn ở Canada.",
      hint_en: "State an allergy or food restriction before eating in Canada.",
      common_mistake_vi: "Đừng nói 'một chút thôi' nếu dị ứng là nghiêm trọng.",
      common_mistake_en: "Do not say 'just a little' if the allergy is serious.",
    },
    entries: [
      {
        answer_pa: "ਮੈਨੂੰ ਮੂੰਗਫਲੀ ਤੋਂ ਐਲਰਜੀ ਹੈ।",
        answer_romanization: "mainu mungfali ton allergy hai.",
        answer_vi: "Tôi dị ứng đậu phộng.",
        answer_en: "I am allergic to peanuts.",
      },
      {
        answer_pa: "ਕੀ ਇਸ ਵਿੱਚ ਦੁੱਧ ਹੈ?",
        answer_romanization: "ki is vich duddh hai?",
        answer_vi: "Trong món này có sữa không?",
        answer_en: "Does this contain milk?",
      },
      {
        answer_pa: "ਮੈਂ ਮਾਸ ਨਹੀਂ ਖਾਂਦਾ/ਖਾਂਦੀ।",
        answer_romanization: "main maas nahin khanda/khandi.",
        answer_vi: "Tôi không ăn thịt.",
        answer_en: "I do not eat meat.",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਸਮੱਗਰੀ ਦੱਸੋ।",
        answer_romanization: "kirpa karke samagri daso.",
        answer_vi: "Làm ơn cho biết nguyên liệu.",
        answer_en: "Please tell me the ingredients.",
      },
      {
        answer_pa: "ਕੀ ਇਹ ਬਹੁਤ ਮਸਾਲੇਦਾਰ ਹੈ?",
        answer_romanization: "ki ih bahut masaledar hai?",
        answer_vi: "Món này có cay nhiều không?",
        answer_en: "Is this very spicy?",
      },
      {
        answer_pa: "ਕੀ ਤੁਹਾਡੇ ਕੋਲ ਵੀਗਨ ਚੋਣ ਹੈ?",
        answer_romanization: "ki tuhade kol vegan chon hai?",
        answer_vi: "Bạn có món chay thuần không?",
        answer_en: "Do you have a vegan option?",
      },
    ],
  },
  {
    topic: "housing",
    meta: {
      topic_vi: "Nhà ở",
      topic_en: "Housing",
      hint_vi: "Báo vấn đề và xin phản hồi bằng văn bản từ chủ nhà ở Canada.",
      hint_en: "Report a problem and ask for a written reply from a landlord in Canada.",
      common_mistake_vi: "Đừng để một lời hứa chung thay cho thời gian sửa cụ thể.",
      common_mistake_en: "Do not let a vague promise replace a specific repair time.",
    },
    entries: [
      {
        answer_pa: "ਕਿਰਾਇਆ ਕਿੰਨਾ ਹੈ?",
        answer_romanization: "kiraya kinna hai?",
        answer_vi: "Tiền thuê là bao nhiêu?",
        answer_en: "How much is the rent?",
      },
      {
        answer_pa: "ਕੀ ਪਾਣੀ ਅਤੇ ਬਿਜਲੀ ਸ਼ਾਮਲ ਹਨ?",
        answer_romanization: "ki pani ate bijli shamil han?",
        answer_vi: "Nước và điện có bao gồm không?",
        answer_en: "Are water and electricity included?",
      },
      {
        answer_pa: "ਹੀਟਿੰਗ ਕੰਮ ਨਹੀਂ ਕਰ ਰਹੀ।",
        answer_romanization: "heating kamm nahin kar rahi.",
        answer_vi: "Máy sưởi không hoạt động.",
        answer_en: "The heating is not working.",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੁਰੰਮਤ ਲਈ ਸਮਾਂ ਦੱਸੋ।",
        answer_romanization: "kirpa karke murammat lai samah daso.",
        answer_vi: "Làm ơn cho biết thời gian sửa chữa.",
        answer_en: "Please give the repair time.",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਲਿਖ ਕੇ ਭੇਜੋ।",
        answer_romanization: "kirpa karke ih likh ke bhejo.",
        answer_vi: "Làm ơn gửi điều này bằng văn bản.",
        answer_en: "Please send this in writing.",
      },
      {
        answer_pa: "ਕੀ ਇਹ ਸੁਰੱਖਿਅਤ ਇਲਾਕਾ ਹੈ?",
        answer_romanization: "ki ih surakhit ilaka hai?",
        answer_vi: "Đây có phải khu vực an toàn không?",
        answer_en: "Is this a safe area?",
      },
    ],
  },
  {
    topic: "school",
    meta: {
      topic_vi: "Trường học",
      topic_en: "School",
      hint_vi: "Nói về điểm danh, họp phụ huynh, và hỗ trợ ngôn ngữ ở trường.",
      hint_en: "Talk about attendance, parent meetings, and language support at school.",
      common_mistake_vi: "Đừng ký nếu bạn vẫn chưa hiểu thông báo.",
      common_mistake_en: "Do not sign if you still do not understand the notice.",
    },
    entries: [
      {
        answer_pa: "ਮੇਰਾ ਬੱਚਾ ਅੱਜ ਗੈਰਹਾਜ਼ਰ ਹੈ।",
        answer_romanization: "mera bacha aj gair-hazar hai.",
        answer_vi: "Con tôi hôm nay vắng mặt.",
        answer_en: "My child is absent today.",
      },
      {
        answer_pa: "ਮੀਟਿੰਗ ਕਦੋਂ ਹੈ?",
        answer_romanization: "meeting kadon hai?",
        answer_vi: "Cuộc họp khi nào?",
        answer_en: "When is the meeting?",
      },
      {
        answer_pa: "ਕੀ ਤੁਸੀਂ ਇਹ ਨੋਟ ਅੰਗਰੇਜ਼ੀ ਵਿੱਚ ਦੇ ਸਕਦੇ ਹੋ?",
        answer_romanization: "ki tusin ih note angrezi vich de sakde ho?",
        answer_vi: "Bạn có thể đưa ghi chú này bằng tiếng Anh không?",
        answer_en: "Can you provide this note in English?",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਦੁਭਾਸ਼ੀਏ ਦੀ ਲੋੜ ਹੈ।",
        answer_romanization: "mainu dubhashiye di lor hai.",
        answer_vi: "Tôi cần thông dịch viên.",
        answer_en: "I need an interpreter.",
      },
      {
        answer_pa: "ਮੇਰੇ ਬੱਚੇ ਨੂੰ ਮਦਦ ਚਾਹੀਦੀ ਹੈ।",
        answer_romanization: "mere bache nu madad chahidi hai.",
        answer_vi: "Con tôi cần giúp đỡ.",
        answer_en: "My child needs help.",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਇਹ ਘਰ ਭੇਜ ਦਿਓ।",
        answer_romanization: "kirpa karke ih ghar bhej dio.",
        answer_vi: "Làm ơn gửi điều này về nhà.",
        answer_en: "Please send this home.",
      },
    ],
  },
  {
    topic: "family",
    meta: {
      topic_vi: "Gia đình",
      topic_en: "Family",
      hint_vi: "Nói về người thân, đón con, hoặc liên hệ khẩn cấp.",
      hint_en: "Talk about relatives, pickup, or emergency contact.",
      common_mistake_vi: "Đừng dùng từ gia đình khi bạn đang nói về nhân viên.",
      common_mistake_en: "Do not use family words when you mean staff.",
    },
    entries: [
      {
        answer_pa: "ਮੇਰਾ ਪਰਿਵਾਰ ਇੱਥੇ ਨਵਾਂ ਹੈ।",
        answer_romanization: "mera parivar ithe nava hai.",
        answer_vi: "Gia đình tôi mới đến đây.",
        answer_en: "My family is new here.",
      },
      {
        answer_pa: "ਮੇਰਾ ਬੱਚਾ ਮੇਰੇ ਨਾਲ ਹੈ।",
        answer_romanization: "mera bacha mere nal hai.",
        answer_vi: "Con tôi đang đi cùng tôi.",
        answer_en: "My child is with me.",
      },
      {
        answer_pa: "ਕਿਰਪਾ ਕਰਕੇ ਮੇਰੇ ਸਾਥੀ ਨਾਲ ਗੱਲ ਕਰੋ।",
        answer_romanization: "kirpa karke mere sathi nal gall karo.",
        answer_vi: "Làm ơn nói chuyện với người bạn đời của tôi.",
        answer_en: "Please speak with my partner.",
      },
      {
        answer_pa: "ਅਸੀਂ ਵਿਆਹੇ ਹੋਏ ਹਾਂ।",
        answer_romanization: "asi viahe hoye han.",
        answer_vi: "Chúng tôi đã kết hôn.",
        answer_en: "We are married.",
      },
      {
        answer_pa: "ਕੀ ਤੁਸੀਂ ਮੇਰੇ ਰਿਸ਼ਤੇਦਾਰ ਨੂੰ ਫੋਨ ਕਰ ਸਕਦੇ ਹੋ?",
        answer_romanization: "ki tusin mere rishtedar nu phone kar sakde ho?",
        answer_vi: "Bạn có thể gọi cho người thân của tôi không?",
        answer_en: "Can you call my relative?",
      },
      {
        answer_pa: "ਮੇਰਾ ਐਮਰਜੈਂਸੀ ਸੰਪਰਕ ਕੌਣ ਹੈ?",
        answer_romanization: "mera emergency sampark kaun hai?",
        answer_vi: "Ai là liên hệ khẩn cấp của tôi?",
        answer_en: "Who is my emergency contact?",
      },
    ],
  },
  {
    topic: "transit",
    meta: {
      topic_vi: "Di chuyển",
      topic_en: "Transit",
      hint_vi: "Hỏi tuyến, điểm dừng, và nơi xuống ở Canada.",
      hint_en: "Ask about the route, stop, and where to get off in Canada.",
      common_mistake_vi: "Đừng hỏi quá chung nếu bạn chỉ cần một trạm cụ thể.",
      common_mistake_en: "Do not ask too generally if you need one exact stop.",
    },
    entries: [
      {
        answer_pa: "ਇਹ ਬੱਸ ਕਿੱਥੇ ਜਾਂਦੀ ਹੈ?",
        answer_romanization: "ih bus kithe jandi hai?",
        answer_vi: "Xe buýt này đi đâu?",
        answer_en: "Where does this bus go?",
      },
      {
        answer_pa: "ਕੀ ਇਹ ਬੱਸ ਡਾਊਨਟਾਊਨ ਜਾਂਦੀ ਹੈ?",
        answer_romanization: "ki ih bus downtown jandi hai?",
        answer_vi: "Xe này có đi trung tâm không?",
        answer_en: "Does this bus go downtown?",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਇੱਥੇ ਉਤਰਨਾ ਹੈ।",
        answer_romanization: "mainu ithe utarna hai.",
        answer_vi: "Tôi cần xuống ở đây.",
        answer_en: "I need to get off here.",
      },
      {
        answer_pa: "ਮੈਂ ਰਸਤਾ ਭੁੱਲ ਗਿਆ/ਗਈ ਹਾਂ।",
        answer_romanization: "main rasta bhul gaya/gai han.",
        answer_vi: "Tôi bị lạc đường.",
        answer_en: "I am lost.",
      },
      {
        answer_pa: "ਕੀ ਇਹ ਸਟਾਪ ਅੱਗੇ ਹੈ?",
        answer_romanization: "ki ih stop agge hai?",
        answer_vi: "Trạm này ở phía trước phải không?",
        answer_en: "Is the stop ahead?",
      },
      {
        answer_pa: "ਮੈਨੂੰ ਟਿਕਟ ਚਾਹੀਦੀ ਹੈ।",
        answer_romanization: "mainu ticket chahidi hai.",
        answer_vi: "Tôi cần vé.",
        answer_en: "I need a ticket.",
      },
    ],
  },
];

function buildDeck(): PunjabiReviewCard[] {
  return TOPIC_DATA.flatMap((topicData, topicIndex) =>
    topicData.entries.flatMap((entry, entryIndex) =>
      [0, 1, 2].map((variantIndex) => {
        const sequence = topicIndex * 18 + entryIndex * 3 + variantIndex + 1;
        const level = LEVELS[(topicIndex + entryIndex + variantIndex) % LEVELS.length];
        const promptVariant =
          variantIndex === 0
            ? {
                prompt_vi: `Dịch sang Punjabi: "${entry.answer_vi}"`,
                prompt_en: `Translate to Punjabi: "${entry.answer_en}"`,
              }
            : variantIndex === 1
              ? {
                  prompt_vi: `Dùng câu này cho chủ đề ${topicData.meta.topic_vi}: "${entry.answer_vi}"`,
                  prompt_en: `Use this line for the ${topicData.meta.topic_en} topic: "${entry.answer_en}"`,
                }
              : {
                  prompt_vi: `Tránh lỗi này: ${topicData.meta.common_mistake_vi}. Câu Punjabi đúng là gì?`,
                  prompt_en: `Avoid this mistake: ${topicData.meta.common_mistake_en}. What is the correct Punjabi line?`,
                };

        return {
          id: `pa-review-${String(sequence).padStart(3, "0")}`,
          topic: topicData.topic,
          topic_vi: topicData.meta.topic_vi,
          topic_en: topicData.meta.topic_en,
          level,
          prompt_vi: promptVariant.prompt_vi,
          prompt_en: promptVariant.prompt_en,
          answer_pa: entry.answer_pa,
          answer_romanization: entry.answer_romanization,
          answer_vi: entry.answer_vi,
          answer_en: entry.answer_en,
          hint_vi: topicData.meta.hint_vi,
          hint_en: topicData.meta.hint_en,
          common_mistake_vi: topicData.meta.common_mistake_vi,
          common_mistake_en: topicData.meta.common_mistake_en,
        } satisfies PunjabiReviewCard;
      }),
    ),
  );
}

export const PUNJABI_REVIEW_DECK = buildDeck();

export const punjabiReviewDeck = PUNJABI_REVIEW_DECK;

export default punjabiReviewDeck;
