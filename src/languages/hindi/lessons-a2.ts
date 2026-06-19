// Hindi A2 elementary lessons for Vietnamese and English learners.
//
// W2 A5 scope: local lesson data only. Devanagari remains the canonical target
// script; romanization supports reading but is not an answer source of truth.

export type HindiCategoryId =
  | "daily_routine"
  | "food_shopping"
  | "transport_directions"
  | "health_appointments"
  | "housing_public_services"
  | "public_services";

export type HindiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type HindiSentence = {
  hi: string;
  romanization: string;
  en: string;
  vi: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type HindiVocabEntry = {
  hi: string;
  romanization: string;
  en: string;
  vi: string;
  pos?: string;
};

export type HindiDialogueLine = {
  speaker: string;
  hi: string;
  romanization: string;
  en: string;
  vi: string;
};

export type HindiExercise =
  | {
      type: "fill-blank";
      question: string;
      answer: string;
      accepted_answers?: string[];
      hint_vi?: string;
      hint_en?: string;
    }
  | {
      type: "matching";
      instruction_vi: string;
      instruction_en: string;
      pairs: Array<{ hi: string; meaning_vi: string; meaning_en?: string }>;
    }
  | {
      type: "translation";
      vi: string;
      en: string;
      hi: string;
      romanization?: string;
      accepted_answers?: string[];
    };

export type HindiLesson = {
  id: string;
  level: HindiCefrLevel;
  category: HindiCategoryId;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  vocabulary: HindiVocabEntry[];
  sentences: HindiSentence[];
  dialogue?: HindiDialogueLine[];
  exercises?: HindiExercise[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export const lessons: HindiLesson[] = [
  {
    id: "hindi_a2_daily_routine",
    level: "A2",
    category: "daily_routine",
    title_vi: "Sinh hoạt hằng ngày",
    title_en: "Daily routine",
    intro_vi:
      "Bài này luyện thói quen hằng ngày với thì hiện tại thói quen: karta/karti hoon.",
    intro_en:
      "This lesson practices daily habits with the present habitual: karta/karti hoon.",
    vocabulary: [
      { hi: "सुबह", romanization: "subah", vi: "buổi sáng", en: "morning", pos: "n.f." },
      { hi: "उठना", romanization: "uthna", vi: "thức dậy", en: "to wake up", pos: "v." },
      { hi: "काम", romanization: "kaam", vi: "công việc", en: "work", pos: "n.m." },
      { hi: "पढ़ना", romanization: "padhna", vi: "học/đọc", en: "to study/read", pos: "v." },
      { hi: "रोज़", romanization: "roz", vi: "mỗi ngày", en: "every day", pos: "adv." },
    ],
    sentences: [
      {
        hi: "मैं सुबह सात बजे उठता हूँ।",
        romanization: "main subah saat baje uthta hoon.",
        vi: "Tôi thức dậy lúc bảy giờ sáng. (người nói nam)",
        en: "I wake up at seven in the morning. (male speaker)",
        pronunciation_focus: [
          "Nam nói उठता हूँ; nữ nói उठती हूँ.",
          "Hindi đặt động từ ở cuối câu.",
        ],
        pronunciation_focus_en: [
          "A male speaker says उठता हूँ; a female speaker says उठती हूँ.",
          "Hindi places the verb at the end.",
        ],
      },
      {
        hi: "मैं रोज़ हिंदी पढ़ती हूँ।",
        romanization: "main roz Hindi padhti hoon.",
        vi: "Tôi học tiếng Hindi mỗi ngày. (người nói nữ)",
        en: "I study Hindi every day. (female speaker)",
        note_vi: "Người nói nam dùng पढ़ता हूँ.",
        note_en: "A male speaker uses पढ़ता हूँ.",
      },
      {
        hi: "आप कब काम करते हैं?",
        romanization: "aap kab kaam karte hain?",
        vi: "Bạn làm việc khi nào?",
        en: "When do you work?",
        pronunciation_focus: [
          "आप đi với करते हैं trong câu lịch sự/chung.",
          "कब là 'khi nào' và thường đứng trước cụm động từ.",
        ],
        pronunciation_focus_en: [
          "आप pairs with करते हैं in polite/general speech.",
          "कब means 'when' and usually stands before the verb phrase.",
        ],
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "मैं रोज़ हिंदी ___ हूँ।",
        answer: "पढ़ती",
        accepted_answers: ["पढ़ता"],
        hint_vi: "Dùng dạng thói quen; nam/nữ khác nhau.",
        hint_en: "Use the habitual form; male/female forms differ.",
      },
      {
        type: "translation",
        vi: "Bạn làm việc khi nào?",
        en: "When do you work?",
        hi: "आप कब काम करते हैं?",
        romanization: "aap kab kaam karte hain?",
      },
    ],
    cultural_notes_vi:
      "Hindi thường yêu cầu người nói chọn dạng nam/nữ cho một số cấu trúc. Điều này khác tiếng Việt, nơi động từ không đổi theo giới.",
    cultural_notes_en:
      "Hindi often requires the speaker to choose masculine or feminine forms. This differs from English, where verbs do not usually mark speaker gender.",
    tip_advice_vi:
      "Học cặp nam/nữ cùng lúc: करता हूँ / करती हूँ.",
    tip_advice_en:
      "Learn masculine/feminine pairs together: करता हूँ / करती हूँ.",
  },
  {
    id: "hindi_a2_shopping_prices",
    level: "A2",
    category: "food_shopping",
    title_vi: "Mua sắm và hỏi giá",
    title_en: "Shopping and asking prices",
    intro_vi:
      "Bài này mở rộng câu hỏi giá A1 sang màu sắc, số lượng và yêu cầu lịch sự trong cửa hàng.",
    intro_en:
      "This lesson expands A1 price questions into colors, quantity, and polite store requests.",
    vocabulary: [
      { hi: "दुकान", romanization: "dukaan", vi: "cửa hàng", en: "shop", pos: "n.f." },
      { hi: "सस्ता", romanization: "sasta", vi: "rẻ", en: "cheap", pos: "adj." },
      { hi: "महँगा", romanization: "mahanga", vi: "đắt", en: "expensive", pos: "adj." },
      { hi: "लाल", romanization: "laal", vi: "màu đỏ", en: "red", pos: "adj." },
      { hi: "दो", romanization: "do", vi: "hai", en: "two", pos: "number" },
    ],
    sentences: [
      {
        hi: "यह बहुत महँगा है।",
        romanization: "yah bahut mahanga hai.",
        vi: "Cái này rất đắt.",
        en: "This is very expensive.",
        pronunciation_focus: [
          "बहुत thường đọc gần như bahut/bahot tùy người nói; giữ chữ viết Devanagari.",
          "महँगा có dấu nasalization; đừng bỏ hoàn toàn khi đọc.",
        ],
        pronunciation_focus_en: [
          "बहुत may sound close to bahut/bahot depending on the speaker; preserve the Devanagari spelling.",
          "महँगा has nasalization; do not ignore it entirely in speech.",
        ],
      },
      {
        hi: "क्या आपके पास सस्ता विकल्प है?",
        romanization: "kya aapke paas sasta vikalp hai?",
        vi: "Bạn có lựa chọn rẻ hơn không?",
        en: "Do you have a cheaper option?",
        pronunciation_focus: [
          "आपके पास... है là khung 'bạn có...'.",
          "विकल्प là từ hơi trang trọng; trong cửa hàng vẫn hiểu được.",
        ],
        pronunciation_focus_en: [
          "आपके पास... है is the frame for 'do you have...?'",
          "विकल्प is slightly formal but understandable in a shop.",
        ],
      },
      {
        hi: "मुझे दो लाल सेब चाहिए।",
        romanization: "mujhe do laal seb chahiye.",
        vi: "Tôi muốn hai quả táo đỏ.",
        en: "I want two red apples.",
      },
    ],
    dialogue: [
      {
        speaker: "Customer",
        hi: "यह कितना है?",
        romanization: "yah kitna hai?",
        vi: "Cái này bao nhiêu?",
        en: "How much is this?",
      },
      {
        speaker: "Shopkeeper",
        hi: "यह सौ रुपये है।",
        romanization: "yah sau rupaye hai.",
        vi: "Cái này một trăm rupee.",
        en: "It is one hundred rupees.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "क्या आपके पास सस्ता ___ है?",
        answer: "विकल्प",
        hint_vi: "Từ nghĩa là lựa chọn/phương án.",
        hint_en: "The word meaning option/choice.",
      },
      {
        type: "translation",
        vi: "Tôi muốn hai quả táo đỏ.",
        en: "I want two red apples.",
        hi: "मुझे दो लाल सेब चाहिए।",
        romanization: "mujhe do laal seb chahiye.",
      },
    ],
    cultural_notes_vi:
      "Ở chợ hoặc cửa hàng nhỏ, câu ngắn lịch sự thường hiệu quả. Tránh dịch trực tiếp kiểu tiếng Anh dài dòng.",
    cultural_notes_en:
      "In markets or small shops, short polite sentences often work best. Avoid long English-style direct translations.",
    tip_advice_vi:
      "Khung cần nhớ: क्या आपके पास ___ है? và मुझे ___ चाहिए।",
    tip_advice_en:
      "Key frames: क्या आपके पास ___ है? and मुझे ___ चाहिए।",
  },
  {
    id: "hindi_a2_transport_station",
    level: "A2",
    category: "transport_directions",
    title_vi: "Đi lại và nhà ga",
    title_en: "Transport and stations",
    intro_vi:
      "Hỏi xe buýt/tàu, thời gian khởi hành và nơi cần đến bằng câu A2 rõ ràng.",
    intro_en:
      "Ask about buses/trains, departure time, and destination with clear A2 sentences.",
    vocabulary: [
      { hi: "बस", romanization: "bas", vi: "xe buýt", en: "bus", pos: "n.f." },
      { hi: "ट्रेन", romanization: "train", vi: "tàu", en: "train", pos: "n.f." },
      { hi: "स्टेशन", romanization: "station", vi: "nhà ga", en: "station", pos: "n.m." },
      { hi: "कहाँ", romanization: "kahaan", vi: "ở đâu", en: "where", pos: "question" },
      { hi: "कब", romanization: "kab", vi: "khi nào", en: "when", pos: "question" },
    ],
    sentences: [
      {
        hi: "बस स्टेशन कहाँ है?",
        romanization: "bas station kahaan hai?",
        vi: "Bến xe buýt ở đâu?",
        en: "Where is the bus station?",
        pronunciation_focus: [
          "कहाँ có nasalization; romanization kahaan chỉ là gần đúng.",
          "Câu hỏi vẫn kết thúc bằng है.",
        ],
        pronunciation_focus_en: [
          "कहाँ has nasalization; kahaan is only an approximation.",
          "The question still ends with है.",
        ],
      },
      {
        hi: "ट्रेन कब आती है?",
        romanization: "train kab aati hai?",
        vi: "Tàu đến khi nào?",
        en: "When does the train arrive?",
        note_vi: "ट्रेन thường được dùng như danh từ giống cái, nên आती.",
        note_en: "ट्रेन is often treated as feminine, so आती is used.",
      },
      {
        hi: "मुझे दिल्ली जाना है।",
        romanization: "mujhe Dilli jaana hai.",
        vi: "Tôi cần đi Delhi.",
        en: "I need to go to Delhi.",
        pronunciation_focus: [
          "मुझे ... जाना है là khung 'tôi cần/phải đi...'.",
          "Tên địa điểm có thể giữ cách viết quen thuộc tùy ngữ cảnh.",
        ],
        pronunciation_focus_en: [
          "मुझे ... जाना है is the frame 'I need/have to go...'.",
          "Place names may keep familiar spellings depending on context.",
        ],
      },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Bến xe buýt ở đâu?",
        en: "Where is the bus station?",
        hi: "बस स्टेशन कहाँ है?",
        romanization: "bas station kahaan hai?",
      },
      {
        type: "fill-blank",
        question: "मुझे दिल्ली ___ है।",
        answer: "जाना",
        hint_vi: "Động từ nguyên mẫu nghĩa là đi.",
        hint_en: "The infinitive meaning to go.",
      },
    ],
    cultural_notes_vi:
      "Tên địa điểm và từ mượn như स्टेशन rất phổ biến trong Hindi hiện đại. Không phải mọi từ đều có dạng Sanskrit hóa trong giao tiếp thường ngày.",
    cultural_notes_en:
      "Place names and loanwords like स्टेशन are common in modern Hindi. Not every everyday word needs a Sanskritized alternative.",
    tip_advice_vi:
      "Khi đi lại, ưu tiên câu ngắn: कहाँ है? कब आती है? मुझे ___ जाना है।",
    tip_advice_en:
      "For transport, prioritize short frames: कहाँ है? कब आती है? मुझे ___ जाना है।",
  },
  {
    id: "hindi_a2_appointments_time",
    level: "A2",
    category: "health_appointments",
    title_vi: "Đặt lịch hẹn",
    title_en: "Making appointments",
    intro_vi:
      "Luyện cách hỏi lịch hẹn, ngày giờ, và nói mình rảnh hay bận bằng Hindi lịch sự.",
    intro_en:
      "Practice asking for appointments, dates/times, and saying whether you are free or busy in polite Hindi.",
    vocabulary: [
      { hi: "मुलाकात", romanization: "mulaaqaat", vi: "cuộc hẹn/gặp", en: "meeting/appointment", pos: "n.f." },
      { hi: "समय", romanization: "samay", vi: "thời gian", en: "time", pos: "n.m." },
      { hi: "आज", romanization: "aaj", vi: "hôm nay", en: "today", pos: "adv." },
      { hi: "कल", romanization: "kal", vi: "ngày mai / hôm qua", en: "tomorrow / yesterday", pos: "adv." },
      { hi: "व्यस्त", romanization: "vyast", vi: "bận", en: "busy", pos: "adj." },
    ],
    sentences: [
      {
        hi: "क्या मुझे मुलाकात का समय मिल सकता है?",
        romanization: "kya mujhe mulaaqaat ka samay mil sakta hai?",
        vi: "Tôi có thể có một lịch hẹn không?",
        en: "Can I get an appointment time?",
        pronunciation_focus: [
          "मिल सकता है là khung 'có thể nhận/được không'.",
          "Câu này lịch sự và phù hợp với văn phòng hoặc phòng khám.",
        ],
        pronunciation_focus_en: [
          "मिल सकता है is a frame for 'can get/receive'.",
          "This sentence is polite and fits an office or clinic.",
        ],
      },
      {
        hi: "मैं आज व्यस्त हूँ।",
        romanization: "main aaj vyast hoon.",
        vi: "Hôm nay tôi bận.",
        en: "I am busy today.",
      },
      {
        hi: "क्या कल सुबह ठीक है?",
        romanization: "kya kal subah theek hai?",
        vi: "Sáng mai có được không?",
        en: "Is tomorrow morning okay?",
        note_vi: "कल có thể nghĩa là hôm qua hoặc ngày mai; ngữ cảnh quyết định.",
        note_en: "कल can mean yesterday or tomorrow; context decides.",
      },
    ],
    dialogue: [
      {
        speaker: "A",
        hi: "क्या कल सुबह ठीक है?",
        romanization: "kya kal subah theek hai?",
        vi: "Sáng mai có được không?",
        en: "Is tomorrow morning okay?",
      },
      {
        speaker: "B",
        hi: "हाँ, दस बजे ठीक है।",
        romanization: "haan, das baje theek hai.",
        vi: "Vâng, mười giờ được.",
        en: "Yes, ten o'clock is okay.",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "मैं आज ___ हूँ।",
        answer: "व्यस्त",
        hint_vi: "Tính từ nghĩa là bận.",
        hint_en: "The adjective meaning busy.",
      },
      {
        type: "translation",
        vi: "Sáng mai có được không?",
        en: "Is tomorrow morning okay?",
        hi: "क्या कल सुबह ठीक है?",
        romanization: "kya kal subah theek hai?",
      },
    ],
    cultural_notes_vi:
      "Trong lịch hẹn, dùng आप và câu hỏi mềm sẽ an toàn hơn câu mệnh lệnh. कल cần ngữ cảnh để tránh nhầm hôm qua/ngày mai.",
    cultural_notes_en:
      "For appointments, आप and soft questions are safer than commands. कल needs context to avoid yesterday/tomorrow ambiguity.",
    tip_advice_vi:
      "Học cụm मिल सकता है như một khung lịch sự, chưa cần phân tích từng phần ở A2.",
    tip_advice_en:
      "Learn मिल सकता है as a polite frame; A2 learners do not need to analyze every part yet.",
  },
  {
    id: "hindi_a2_housing_public_services",
    level: "A2",
    category: "housing_public_services",
    title_vi: "Nhà ở và dịch vụ công cơ bản",
    title_en: "Housing and basic public services",
    intro_vi:
      "Bài này luyện cách nói địa chỉ, giấy tờ đơn giản, và hỏi văn phòng/dịch vụ ở đâu.",
    intro_en:
      "This lesson practices address, simple documents, and asking where an office/service is.",
    vocabulary: [
      { hi: "पता", romanization: "pata", vi: "địa chỉ", en: "address", pos: "n.m." },
      { hi: "घर", romanization: "ghar", vi: "nhà", en: "home/house", pos: "n.m." },
      { hi: "कमरा", romanization: "kamra", vi: "phòng", en: "room", pos: "n.m." },
      { hi: "दफ़्तर", romanization: "daftar", vi: "văn phòng", en: "office", pos: "n.m." },
      { hi: "दस्तावेज़", romanization: "dastaavez", vi: "giấy tờ/tài liệu", en: "document", pos: "n.m." },
    ],
    sentences: [
      {
        hi: "मेरा पता यहाँ है।",
        romanization: "mera pata yahaan hai.",
        vi: "Địa chỉ của tôi ở đây.",
        en: "My address is here.",
        pronunciation_focus: [
          "पता là giống đực, nên मेरा.",
          "यहाँ có nasalization.",
        ],
        pronunciation_focus_en: [
          "पता is masculine, so use मेरा.",
          "यहाँ is nasalized.",
        ],
      },
      {
        hi: "दफ़्तर कहाँ है?",
        romanization: "daftar kahaan hai?",
        vi: "Văn phòng ở đâu?",
        en: "Where is the office?",
      },
      {
        hi: "मुझे यह दस्तावेज़ चाहिए।",
        romanization: "mujhe yah dastaavez chahiye.",
        vi: "Tôi cần giấy tờ này.",
        en: "I need this document.",
        pronunciation_focus: [
          "दस्तावेज़ có nukta trong ज़; đừng tự bỏ trong chữ hiển thị.",
          "मुझे ... चाहिए dùng cho cả muốn và cần ở mức A2.",
        ],
        pronunciation_focus_en: [
          "दस्तावेज़ has nukta in ज़; do not remove it in display text.",
          "मुझे ... चाहिए covers both want and need at A2.",
        ],
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ Hindi với nghĩa.",
        instruction_en: "Match each Hindi word with its meaning.",
        pairs: [
          { hi: "पता", meaning_vi: "địa chỉ", meaning_en: "address" },
          { hi: "दफ़्तर", meaning_vi: "văn phòng", meaning_en: "office" },
          { hi: "दस्तावेज़", meaning_vi: "giấy tờ", meaning_en: "document" },
        ],
      },
      {
        type: "translation",
        vi: "Tôi cần giấy tờ này.",
        en: "I need this document.",
        hi: "मुझे यह दस्तावेज़ चाहिए।",
        romanization: "mujhe yah dastaavez chahiye.",
      },
    ],
    cultural_notes_vi:
      "Hindi có nhiều từ hành chính có thể nghe trang trọng. Ở A2, hãy ưu tiên câu hỏi rõ ràng thay vì cố dùng văn phong công sở phức tạp.",
    cultural_notes_en:
      "Hindi has many administrative words that can sound formal. At A2, prioritize clear questions over complex office style.",
    tip_advice_vi:
      "Ba câu sinh tồn: मेरा पता यहाँ है। / दफ़्तर कहाँ है? / मुझे यह दस्तावेज़ चाहिए।",
    tip_advice_en:
      "Three survival lines: मेरा पता यहाँ है। / दफ़्तर कहाँ है? / मुझे यह दस्तावेज़ चाहिए।",
  },
  {
    id: "hindi_a2_directions_places",
    level: "A2",
    category: "public_services",
    title_vi: "Hỏi đường và vị trí",
    title_en: "Directions and location",
    intro_vi:
      "Luyện các từ trái/phải/thẳng, gần/xa và cách hỏi một nơi ở đâu.",
    intro_en:
      "Practice left/right/straight, near/far, and asking where a place is.",
    vocabulary: [
      { hi: "बाएँ", romanization: "baayen", vi: "bên trái", en: "left", pos: "adv." },
      { hi: "दाएँ", romanization: "daayen", vi: "bên phải", en: "right", pos: "adv." },
      { hi: "सीधे", romanization: "seedhe", vi: "đi thẳng", en: "straight", pos: "adv." },
      { hi: "पास", romanization: "paas", vi: "gần / ở chỗ", en: "near / at", pos: "postposition" },
      { hi: "दूर", romanization: "door", vi: "xa", en: "far", pos: "adj." },
    ],
    sentences: [
      {
        hi: "बैंक कहाँ है?",
        romanization: "bank kahaan hai?",
        vi: "Ngân hàng ở đâu?",
        en: "Where is the bank?",
      },
      {
        hi: "सीधे जाइए, फिर दाएँ मुड़िए।",
        romanization: "seedhe jaiye, phir daayen mudiye.",
        vi: "Đi thẳng, rồi rẽ phải.",
        en: "Go straight, then turn right.",
        pronunciation_focus: [
          "जाइए và मुड़िए là dạng yêu cầu lịch sự.",
          "फिर nghĩa là rồi/sau đó.",
        ],
        pronunciation_focus_en: [
          "जाइए and मुड़िए are polite request forms.",
          "फिर means then/after that.",
        ],
      },
      {
        hi: "यहाँ से दूर नहीं है।",
        romanization: "yahaan se door nahin hai.",
        vi: "Không xa từ đây.",
        en: "It is not far from here.",
        pronunciation_focus: [
          "नहीं thường đứng trước động từ cuối.",
          "से đứng sau यहाँ trong cụm 'từ đây'.",
        ],
        pronunciation_focus_en: [
          "नहीं usually stands before the final verb.",
          "से comes after यहाँ in the phrase 'from here'.",
        ],
      },
    ],
    dialogue: [
      {
        speaker: "A",
        hi: "बैंक कहाँ है?",
        romanization: "bank kahaan hai?",
        vi: "Ngân hàng ở đâu?",
        en: "Where is the bank?",
      },
      {
        speaker: "B",
        hi: "सीधे जाइए, फिर बाएँ मुड़िए।",
        romanization: "seedhe jaiye, phir baayen mudiye.",
        vi: "Đi thẳng, rồi rẽ trái.",
        en: "Go straight, then turn left.",
      },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối hướng đi với nghĩa.",
        instruction_en: "Match each direction with its meaning.",
        pairs: [
          { hi: "बाएँ", meaning_vi: "trái", meaning_en: "left" },
          { hi: "दाएँ", meaning_vi: "phải", meaning_en: "right" },
          { hi: "सीधे", meaning_vi: "thẳng", meaning_en: "straight" },
        ],
      },
      {
        type: "translation",
        vi: "Đi thẳng, rồi rẽ phải.",
        en: "Go straight, then turn right.",
        hi: "सीधे जाइए, फिर दाएँ मुड़िए।",
        romanization: "seedhe jaiye, phir daayen mudiye.",
      },
    ],
    cultural_notes_vi:
      "Khi hỏi đường, một câu ngắn với कहाँ है? thường đủ. Người mới học không cần mô tả đường quá dài.",
    cultural_notes_en:
      "When asking directions, a short कहाँ है? question is often enough. Beginners do not need long route descriptions.",
    tip_advice_vi:
      "Khung chỉ đường an toàn: सीधे जाइए, फिर ___ मुड़िए।",
    tip_advice_en:
      "Safe direction frame: सीधे जाइए, फिर ___ मुड़िए।",
  },
];

export default lessons;
