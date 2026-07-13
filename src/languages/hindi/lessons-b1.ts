// Hindi B1 lessons — Standard Hindi in Devanagari.
// B1 focus: work, health, public services, opinions, and past narration.

export type HindiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type HindiB1Category =
  | "work_tasks"
  | "health_pharmacy"
  | "public_services"
  | "opinions_reasons"
  | "past_narration";

export type HindiSentence = {
  hi: string;
  romanization: string;
  vi: string;
  en: string;
  note_vi?: string;
  note_en?: string;
};

export type HindiVocabEntry = {
  cell_id?: string;
  hi: string;
  romanization: string;
  vi: string;
  en: string;
  pos?: string;
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
  category: HindiB1Category;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  sentences: HindiSentence[];
  vocabulary: HindiVocabEntry[];
  exercises?: HindiExercise[];
  cultural_notes_vi: string;
  cultural_notes_en: string;
  tip_advice_vi: string;
  tip_advice_en: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export const lessons: HindiLesson[] = [
  {
    id: "hindi_b1_work_tasks_deadlines",
    level: "B1",
    category: "work_tasks",
    title_vi: "Công việc: nhiệm vụ, hạn chót và tiến độ",
    title_en: "Work: tasks, deadlines, and progress",
    intro_vi:
      "Bài này luyện cách nói về việc cần làm, hạn chót và tiến độ bằng Hindi chuẩn, gần với môi trường công sở.",
    intro_en:
      "This lesson practices talking about tasks, deadlines, and progress in standard workplace Hindi.",
    sentences: [
      {
        hi: "मुझे यह काम शुक्रवार तक पूरा करना होगा।",
        romanization: "mujhe yah kaam shukravaar tak pooraa karnaa hogaa",
        vi: "Tôi sẽ phải hoàn thành việc này trước thứ Sáu.",
        en: "I will have to complete this work by Friday.",
        note_vi: "मुझे + करना होगा diễn tả nghĩa 'tôi phải', không dịch từng chữ là 'tôi đến tôi'.",
        note_en: "मुझे + करना होगा expresses obligation; it is not a literal subject-verb pattern.",
      },
      {
        hi: "टीम ने आधा काम पूरा कर लिया है।",
        romanization: "tiim ne aadhaa kaam pooraa kar liyaa hai",
        vi: "Nhóm đã hoàn thành một nửa công việc.",
        en: "The team has completed half of the work.",
      },
      {
        hi: "अगर समय मिला, तो मैं रिपोर्ट आज भेज दूँगा।",
        romanization: "agar samay milaa, to main riport aaj bhej duungaa",
        vi: "Nếu có thời gian, tôi sẽ gửi báo cáo hôm nay.",
        en: "If I get time, I will send the report today.",
      },
    ],
    vocabulary: [
      { cell_id: "c73ceac4-aabe-41a8-a724-4b281644e301", hi: "काम", romanization: "kaam", vi: "công việc", en: "work", pos: "n." },
      { cell_id: "6efb4d43-28e2-499b-af80-029fced44bc5", hi: "समय सीमा", romanization: "samay siimaa", vi: "hạn chót", en: "deadline", pos: "n." },
      { cell_id: "f226da98-201d-4203-8987-4a18204d87d2", hi: "रिपोर्ट", romanization: "riport", vi: "báo cáo", en: "report", pos: "n." },
      { cell_id: "5165eb74-1fbf-4839-ae7a-4f6ec4f495f5", hi: "पूरा करना", romanization: "pooraa karnaa", vi: "hoàn thành", en: "to complete", pos: "v." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "मुझे यह काम शुक्रवार ___ पूरा करना होगा।",
        answer: "तक",
        hint_vi: "postposition nghĩa là 'đến/trước thời điểm'",
        hint_en: "postposition meaning 'by/until'",
      },
      {
        type: "translation",
        vi: "Nhóm đã hoàn thành một nửa công việc.",
        en: "The team has completed half of the work.",
        hi: "टीम ने आधा काम पूरा कर लिया है।",
      },
    ],
    cultural_notes_vi:
      "Trong công sở Ấn Độ, Hindi thường trộn từ tiếng Anh như टीम và रिपोर्ट. Bài này vẫn giữ Devanagari làm dạng chính để người học đọc được chữ Hindi.",
    cultural_notes_en:
      "Indian workplaces often mix English words such as टीम and रिपोर्ट into Hindi. This lesson keeps Devanagari as the main form so learners can read Hindi script.",
    tip_advice_vi:
      "Hãy học cụm पूरा करना và करना होगा như khối cố định. Người Việt dễ bỏ phần होगा khi muốn nói nghĩa 'phải'.",
    tip_advice_en:
      "Learn पूरा करना and करना होगा as chunks. English speakers should not force a literal 'must' before the main verb.",
  },
  {
    id: "hindi_b1_health_pharmacy_followup",
    level: "B1",
    category: "health_pharmacy",
    title_vi: "Sức khỏe: tái khám và nhà thuốc",
    title_en: "Health: follow-up visit and pharmacy",
    intro_vi:
      "Bài này chỉ luyện ngôn ngữ mô tả triệu chứng, thay đổi và hướng dẫn thuốc; không đưa lời khuyên y tế.",
    intro_en:
      "This lesson only practices language for symptoms, changes, and medicine instructions; it gives no medical advice.",
    sentences: [
      {
        hi: "दर्द कल से थोड़ा कम है।",
        romanization: "dard kal se thodaa kam hai",
        vi: "Cơn đau đã giảm một chút từ hôm qua.",
        en: "The pain has been a little less since yesterday.",
      },
      {
        hi: "मुझे दवा दिन में दो बार लेनी है।",
        romanization: "mujhe davaa din men do baar lenii hai",
        vi: "Tôi phải uống thuốc hai lần một ngày.",
        en: "I have to take the medicine twice a day.",
      },
      {
        hi: "क्या इस दवा से नींद आ सकती है?",
        romanization: "kyaa is davaa se niind aa saktii hai?",
        vi: "Thuốc này có thể gây buồn ngủ không?",
        en: "Can this medicine cause sleepiness?",
      },
    ],
    vocabulary: [
      { cell_id: "22fd5c5f-8992-4207-9c8a-9568da443ff2", hi: "दर्द", romanization: "dard", vi: "đau", en: "pain", pos: "n." },
      { cell_id: "05068dd9-f59d-41b8-8470-b86ecabd3089", hi: "दवा", romanization: "davaa", vi: "thuốc", en: "medicine", pos: "n." },
      { cell_id: "9fb8cc57-5078-4e27-93ae-5129e8ea044b", hi: "कम", romanization: "kam", vi: "ít hơn, giảm", en: "less", pos: "adj./adv." },
      { cell_id: "97719163-9ce3-436b-a5fe-a35bb85307a4", hi: "दिन में दो बार", romanization: "din men do baar", vi: "hai lần một ngày", en: "twice a day", pos: "phr." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "दर्द कल ___ थोड़ा कम है।",
        answer: "से",
        hint_vi: "postposition dùng với mốc bắt đầu thời gian",
        hint_en: "postposition used for a starting point in time",
      },
    ],
    cultural_notes_vi:
      "Trong bối cảnh y tế, hãy nói rõ triệu chứng và thời gian. Không tự chẩn đoán trong bài học ngôn ngữ.",
    cultural_notes_en:
      "In health contexts, state symptoms and timing clearly. Do not self-diagnose in a language lesson.",
    tip_advice_vi:
      "Mẫu मुझे ... लेनी है dùng cho 'tôi phải uống/lấy thuốc'. लेनी đổi theo danh từ दवा giống cái.",
    tip_advice_en:
      "मुझे ... लेनी है means 'I have to take...' लेनी agrees with the feminine noun दवा.",
  },
  {
    id: "hindi_b1_public_services_documents",
    level: "B1",
    category: "public_services",
    title_vi: "Dịch vụ công: giấy tờ và biểu mẫu",
    title_en: "Public services: documents and forms",
    intro_vi:
      "Bài này luyện cách hỏi về giấy tờ, biểu mẫu, địa chỉ và thời hạn tại văn phòng dịch vụ.",
    intro_en:
      "This lesson practices asking about documents, forms, addresses, and deadlines at a service office.",
    sentences: [
      {
        hi: "मुझे यह फॉर्म कहाँ जमा करना है?",
        romanization: "mujhe yah form kahaan jama karnaa hai?",
        vi: "Tôi phải nộp mẫu này ở đâu?",
        en: "Where do I have to submit this form?",
      },
      {
        hi: "कृपया आवश्यक दस्तावेज़ों की सूची दीजिए।",
        romanization: "kripyaa aavashyak dastaavezon kii suuchii diijiye",
        vi: "Vui lòng cho tôi danh sách các giấy tờ cần thiết.",
        en: "Please give me the list of required documents.",
      },
      {
        hi: "कार्यालय सोमवार से शुक्रवार तक खुला रहता है।",
        romanization: "kaaryaalay somvaar se shukravaar tak khulaa rahtaa hai",
        vi: "Văn phòng mở cửa từ thứ Hai đến thứ Sáu.",
        en: "The office is open from Monday to Friday.",
      },
    ],
    vocabulary: [
      { cell_id: "040892b1-b1cf-4256-b12a-04573f79200d", hi: "फॉर्म", romanization: "form", vi: "biểu mẫu", en: "form", pos: "n." },
      { cell_id: "8fdd5348-fcce-4515-ba8a-3d2c23a961f7", hi: "दस्तावेज़", romanization: "dastaavez", vi: "giấy tờ, tài liệu", en: "document", pos: "n." },
      { cell_id: "1e38af55-b4c2-48fa-81aa-7c645f9394fd", hi: "सूची", romanization: "suuchii", vi: "danh sách", en: "list", pos: "n." },
      { cell_id: "b3eca060-3c21-40f0-abf0-183114e4625b", hi: "कार्यालय", romanization: "kaaryaalay", vi: "văn phòng", en: "office", pos: "n." },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Tôi phải nộp mẫu này ở đâu?",
        en: "Where do I have to submit this form?",
        hi: "मुझे यह फॉर्म कहाँ जमा करना है?",
      },
    ],
    cultural_notes_vi:
      "Hindi hành chính có thể dùng từ Sanskrit hóa như आवश्यक và कार्यालय. B1 chỉ cần nhận biết và dùng các cụm thường gặp.",
    cultural_notes_en:
      "Administrative Hindi may use Sanskrit-derived words such as आवश्यक and कार्यालय. At B1, recognition and common chunks are enough.",
    tip_advice_vi:
      "Học cặp कहाँ जमा करना है và आवश्यक दस्तावेज़. Đây là hai khối rất hữu ích tại quầy dịch vụ.",
    tip_advice_en:
      "Learn कहाँ जमा करना है and आवश्यक दस्तावेज़ as service-counter chunks.",
  },
  {
    id: "hindi_b1_opinions_reasons_preferences",
    level: "B1",
    category: "opinions_reasons",
    title_vi: "Ý kiến, lý do và sở thích",
    title_en: "Opinions, reasons, and preferences",
    intro_vi:
      "Bài này luyện cách nói quan điểm đơn giản, đưa lý do và so sánh lựa chọn trong cuộc trò chuyện trung cấp.",
    intro_en:
      "This lesson practices simple opinions, reasons, and comparing choices in intermediate conversation.",
    sentences: [
      {
        hi: "मुझे लगता है कि यह योजना बेहतर है।",
        romanization: "mujhe lagtaa hai ki yah yojanaa behtar hai",
        vi: "Tôi nghĩ kế hoạch này tốt hơn.",
        en: "I think this plan is better.",
      },
      {
        hi: "क्योंकि इसमें समय कम लगेगा।",
        romanization: "kyonki ismen samay kam lagegaa",
        vi: "Bởi vì cách này sẽ mất ít thời gian hơn.",
        en: "Because it will take less time.",
      },
      {
        hi: "मैं शहर में रहना पसंद करता हूँ, लेकिन किराया महँगा है।",
        romanization: "main shahar men rahnaa pasand kartaa huun, lekin kiraayaa mahangaa hai",
        vi: "Tôi thích sống trong thành phố, nhưng tiền thuê đắt.",
        en: "I like living in the city, but rent is expensive.",
      },
    ],
    vocabulary: [
      { cell_id: "b9933390-92fe-4b1f-96bd-4e711e39dc85", hi: "मुझे लगता है", romanization: "mujhe lagtaa hai", vi: "tôi nghĩ", en: "I think", pos: "phr." },
      { cell_id: "3a7e1635-e293-4dc0-8e58-82298b623b3e", hi: "बेहतर", romanization: "behtar", vi: "tốt hơn", en: "better", pos: "adj." },
      { cell_id: "6236f6ad-6c74-4651-b2b7-cdd8adff2685", hi: "क्योंकि", romanization: "kyonki", vi: "bởi vì", en: "because", pos: "conj." },
      { cell_id: "c8d4dd54-7ced-4d34-8b30-c794594b1140", hi: "पसंद करना", romanization: "pasand karnaa", vi: "thích", en: "to like", pos: "v." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "मुझे लगता है ___ यह योजना बेहतर है।",
        answer: "कि",
        hint_vi: "từ nối sau 'tôi nghĩ rằng'",
        hint_en: "connector after 'I think that'",
      },
    ],
    cultural_notes_vi:
      "Khung मुझे लगता है कि... mềm hơn phát biểu chắc nịch. Dùng nó khi bạn muốn nêu ý kiến, không phải sự thật tuyệt đối.",
    cultural_notes_en:
      "मुझे लगता है कि... softens a statement. Use it for an opinion rather than an absolute fact.",
    tip_advice_vi:
      "Người Việt dễ đặt lý do ở đầu theo thói quen. Hindi B1 nên luyện khối ý kiến + क्योंकि + lý do.",
    tip_advice_en:
      "Practice the chunk opinion + क्योंकि + reason instead of translating English clauses word for word.",
  },
  {
    id: "hindi_b1_past_narration_events",
    level: "B1",
    category: "past_narration",
    title_vi: "Kể chuyện quá khứ và giải thích sự cố",
    title_en: "Past narration and explaining what happened",
    intro_vi:
      "Bài này luyện kể chuỗi sự kiện ngắn trong quá khứ, dùng फिर, उसके बाद và अंत में.",
    intro_en:
      "This lesson practices narrating short past event sequences with फिर, उसके बाद, and अंत में.",
    sentences: [
      {
        hi: "कल मैं बस देर से पहुँचा।",
        romanization: "kal main bas der se pahuncha",
        vi: "Hôm qua tôi đến trễ bằng xe buýt.",
        en: "Yesterday I arrived late by bus.",
      },
      {
        hi: "फिर मैंने कार्यालय को संदेश भेजा।",
        romanization: "phir maine kaaryaalay ko sandesh bhejaa",
        vi: "Sau đó tôi đã gửi tin nhắn cho văn phòng.",
        en: "Then I sent a message to the office.",
      },
      {
        hi: "अंत में बैठक ऑनलाइन हुई।",
        romanization: "ant men baithak online huii",
        vi: "Cuối cùng cuộc họp diễn ra trực tuyến.",
        en: "In the end, the meeting happened online.",
      },
    ],
    vocabulary: [
      { cell_id: "ad721644-90d4-49ea-a8cd-383cab74261c", hi: "देर से", romanization: "der se", vi: "trễ", en: "late", pos: "adv." },
      { cell_id: "b2bd52ac-8c63-4f87-84aa-98ed7583968b", hi: "संदेश", romanization: "sandesh", vi: "tin nhắn", en: "message", pos: "n." },
      { cell_id: "959ec7d9-afb2-425f-8017-29590c7118c1", hi: "बैठक", romanization: "baithak", vi: "cuộc họp", en: "meeting", pos: "n." },
      { cell_id: "c6a29700-c8ac-41e7-8e3c-c94b10386ed6", hi: "अंत में", romanization: "ant men", vi: "cuối cùng", en: "in the end", pos: "phr." },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Sau đó tôi đã gửi tin nhắn cho văn phòng.",
        en: "Then I sent a message to the office.",
        hi: "फिर मैंने कार्यालय को संदेश भेजा।",
      },
    ],
    cultural_notes_vi:
      "Ở B1, chỉ cần nhận diện rằng मैंने là dạng quá khứ có ने. Quy tắc ergative chi tiết nên luyện dần qua mẫu câu.",
    cultural_notes_en:
      "At B1, it is enough to notice that मैंने is a past-tense form with ने. Detailed ergative rules should be built through examples.",
    tip_advice_vi:
      "Dùng ba mốc फिर, उसके बाद, अंत में để câu chuyện không rời rạc.",
    tip_advice_en:
      "Use फिर, उसके बाद, and अंत में to keep a past story connected.",
  },
];

export default lessons;
