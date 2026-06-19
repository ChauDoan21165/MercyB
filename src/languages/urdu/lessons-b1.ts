// Urdu B1 lessons for Vietnamese and English learners.
//
// W2 A8 scope: local advanced Urdu arrays only. Urdu script is canonical;
// romanization is a learner aid. No page, route, hub, tutor, audio, Supabase,
// database, or package work is included here.

export type UrduCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type UrduSentence = {
  ur: string;
  romanization: string;
  vi: string;
  en: string;
  pronunciation_focus?: string[];
  pronunciation_focus_en?: string[];
  note_vi?: string;
  note_en?: string;
};

export type UrduVocabEntry = {
  ur: string;
  romanization: string;
  vi: string;
  en: string;
  pos?: string;
};

export type UrduDialogueLine = {
  speaker: string;
  ur: string;
  romanization: string;
  vi: string;
  en: string;
  register?: "neutral" | "formal" | "polite";
};

export type UrduExercise =
  | {
      type: "fill-blank";
      question: string;
      answer: string;
      hint_vi?: string;
      hint_en?: string;
    }
  | {
      type: "matching";
      instruction_vi: string;
      instruction_en: string;
      pairs: Array<{ ur: string; meaning_vi: string; meaning_en?: string }>;
    }
  | {
      type: "translation";
      vi: string;
      en: string;
      ur: string;
      romanization?: string;
    };

export type UrduLesson = {
  id: string;
  level: UrduCefrLevel;
  category: string;
  title_vi: string;
  title_en: string;
  intro_vi: string;
  intro_en: string;
  sentences: UrduSentence[];
  vocabulary?: UrduVocabEntry[];
  dialogue?: UrduDialogueLine[];
  exercises?: UrduExercise[];
  cultural_notes_vi?: string;
  cultural_notes_en?: string;
  tip_advice_vi?: string;
  tip_advice_en?: string;
  register_notes_vi?: string;
  register_notes_en?: string;
};

export const lessons: UrduLesson[] = [
  {
    id: "urdu_b1_workplace_tasks",
    level: "B1",
    category: "workplace_tasks",
    title_vi: "Công việc: nhiệm vụ, tiến độ và thời hạn",
    title_en: "Workplace tasks, progress, and deadlines",
    intro_vi:
      "Bài này luyện Urdu công sở thực dụng: nói việc đã xong, việc đang làm, cần thêm thời gian, và xác nhận thời hạn.",
    intro_en:
      "This lesson practices practical workplace Urdu: completed work, work in progress, asking for more time, and confirming deadlines.",
    sentences: [
      {
        ur: "میں نے رپورٹ مکمل کر لی ہے۔",
        romanization: "main ne report mukammal kar li hai.",
        vi: "Tôi đã hoàn thành báo cáo.",
        en: "I have completed the report.",
        pronunciation_focus: ["نے đánh dấu chủ thể trong quá khứ hoàn thành.", "مکمل là từ trang trọng vừa phải."],
        pronunciation_focus_en: ["نے marks the doer in many perfective past clauses.", "مکمل is moderately formal for 'complete'."],
      },
      {
        ur: "کام ابھی جاری ہے، لیکن میں شام تک بھیج دوں گا۔",
        romanization: "kaam abhi jaari hai, lekin main shaam tak bhej duun ga.",
        vi: "Công việc vẫn đang tiếp diễn, nhưng tôi sẽ gửi trước buổi tối.",
        en: "The work is still in progress, but I will send it by evening.",
      },
      {
        ur: "مجھے مزید وقت چاہیے۔",
        romanization: "mujhe mazeed waqt chahiye.",
        vi: "Tôi cần thêm thời gian.",
        en: "I need more time.",
      },
    ],
    vocabulary: [
      { ur: "رپورٹ", romanization: "report", vi: "báo cáo", en: "report", pos: "noun" },
      { ur: "مکمل", romanization: "mukammal", vi: "hoàn thành", en: "complete", pos: "adjective" },
      { ur: "جاری", romanization: "jaari", vi: "đang tiếp diễn", en: "ongoing", pos: "adjective" },
      { ur: "مزید وقت", romanization: "mazeed waqt", vi: "thêm thời gian", en: "more time", pos: "phrase" },
    ],
    dialogue: [
      {
        speaker: "A",
        ur: "کیا رپورٹ تیار ہے؟",
        romanization: "kya report tayyar hai?",
        vi: "Báo cáo đã sẵn sàng chưa?",
        en: "Is the report ready?",
        register: "neutral",
      },
      {
        speaker: "B",
        ur: "جی، میں نے رپورٹ مکمل کر لی ہے۔",
        romanization: "ji, main ne report mukammal kar li hai.",
        vi: "Vâng, tôi đã hoàn thành báo cáo.",
        en: "Yes, I have completed the report.",
        register: "polite",
      },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "میں نے رپورٹ ___ کر لی ہے۔",
        answer: "مکمل",
        hint_vi: "từ nghĩa là hoàn thành",
        hint_en: "the word meaning complete",
      },
      {
        type: "translation",
        vi: "Tôi cần thêm thời gian.",
        en: "I need more time.",
        ur: "مجھے مزید وقت چاہیے۔",
        romanization: "mujhe mazeed waqt chahiye.",
      },
    ],
    cultural_notes_vi:
      "Trong Urdu công sở, thêm `جی` và cách nói gián tiếp làm câu mềm hơn. Tránh ra lệnh trống nếu đang nói với cấp trên hoặc người chưa thân.",
    cultural_notes_en:
      "In workplace Urdu, `جی` and indirect phrasing soften the sentence. Avoid bare commands with supervisors or people you do not know well.",
    tip_advice_vi:
      "Học cụm `میں نے... کر لی ہے` cho việc đã hoàn thành. `نے` là dấu hiệu quan trọng trong quá khứ hoàn thành.",
    tip_advice_en:
      "Learn the chunk `میں نے... کر لی ہے` for completed work. `نے` is a key marker in perfective past clauses.",
    register_notes_vi:
      "`مجھے مزید وقت چاہیے` trung tính. Trong email trang trọng, thêm `براہ کرم` hoặc giải thích lý do.",
    register_notes_en:
      "`مجھے مزید وقت چاہیے` is neutral. In a formal email, add `براہ کرم` or give a reason.",
  },
  {
    id: "urdu_b1_past_narration_sequence",
    level: "B1",
    category: "past_narration",
    title_vi: "Kể chuyện quá khứ theo trình tự",
    title_en: "Past narration in sequence",
    intro_vi:
      "Bài này luyện kể sự việc theo thứ tự bằng `پہلے`, `پھر`, `آخر میں` và mẫu quá khứ có `نے`.",
    intro_en:
      "This lesson practices sequencing events with `پہلے`, `پھر`, `آخر میں` and past clauses with `نے`.",
    sentences: [
      {
        ur: "پہلے میں دفتر گیا، پھر میں نے فارم جمع کیا۔",
        romanization: "pehle main daftar gaya, phir main ne form jama kiya.",
        vi: "Trước hết tôi đến văn phòng, rồi tôi nộp mẫu đơn.",
        en: "First I went to the office, then I submitted the form.",
      },
      {
        ur: "آخر میں مجھے رسید مل گئی۔",
        romanization: "aakhir main mujhe raseed mil gayi.",
        vi: "Cuối cùng tôi đã nhận được biên lai.",
        en: "Finally, I received the receipt.",
      },
      {
        ur: "میں نے غلطی دیکھی اور فوراً اطلاع دی۔",
        romanization: "main ne ghalati dekhi aur foran ittela di.",
        vi: "Tôi thấy lỗi và báo ngay lập tức.",
        en: "I saw the error and reported it immediately.",
      },
    ],
    vocabulary: [
      { ur: "پہلے", romanization: "pehle", vi: "trước hết", en: "first", pos: "connector" },
      { ur: "پھر", romanization: "phir", vi: "rồi / sau đó", en: "then", pos: "connector" },
      { ur: "آخر میں", romanization: "aakhir main", vi: "cuối cùng", en: "finally", pos: "connector" },
      { ur: "رسید", romanization: "raseed", vi: "biên lai", en: "receipt", pos: "noun" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối từ nối với nghĩa tiếng Việt.",
        instruction_en: "Match the sequence connector with its Vietnamese meaning.",
        pairs: [
          { ur: "پہلے", meaning_vi: "trước hết", meaning_en: "first" },
          { ur: "پھر", meaning_vi: "sau đó", meaning_en: "then" },
          { ur: "آخر میں", meaning_vi: "cuối cùng", meaning_en: "finally" },
        ],
      },
    ],
    cultural_notes_vi:
      "Khi kể việc hành chính, trình tự rõ ràng giúp người nghe hiểu vấn đề nhanh hơn. Urdu thường dùng các cụm nối ngắn thay vì câu quá dài.",
    cultural_notes_en:
      "When narrating an administrative task, clear sequencing helps the listener understand the issue quickly. Urdu often uses short connectors instead of one very long sentence.",
    tip_advice_vi:
      "Đừng bỏ `نے` trong câu quá khứ chuyển tác như `میں نے فارم جمع کیا`.",
    tip_advice_en:
      "Do not drop `نے` in transitive perfective clauses like `میں نے فارم جمع کیا`.",
  },
  {
    id: "urdu_b1_health_public_services",
    level: "B1",
    category: "health",
    title_vi: "Sức khỏe và dịch vụ công: hỏi an toàn, không tư vấn chuyên môn",
    title_en: "Health and public services: safe questions, no professional advice",
    intro_vi:
      "Bài này cung cấp ngôn ngữ để mô tả vấn đề, hỏi quy trình và xin hướng dẫn tại phòng khám, hiệu thuốc hoặc quầy dịch vụ.",
    intro_en:
      "This lesson gives language for describing a problem, asking about procedure, and requesting guidance at a clinic, pharmacy, or service counter.",
    sentences: [
      {
        ur: "مجھے ڈاکٹر سے مشورہ چاہیے۔",
        romanization: "mujhe doctor se mashwara chahiye.",
        vi: "Tôi cần lời tư vấn từ bác sĩ.",
        en: "I need advice from a doctor.",
      },
      {
        ur: "یہ فارم کہاں جمع کرنا ہے؟",
        romanization: "yeh form kahan jama karna hai?",
        vi: "Mẫu đơn này phải nộp ở đâu?",
        en: "Where should this form be submitted?",
      },
      {
        ur: "براہ کرم مجھے اگلا قدم بتا دیجیے۔",
        romanization: "barah-e-karam mujhe agla qadam bata dijiye.",
        vi: "Xin vui lòng cho tôi biết bước tiếp theo.",
        en: "Please tell me the next step.",
      },
    ],
    vocabulary: [
      { ur: "مشورہ", romanization: "mashwara", vi: "lời khuyên / tư vấn", en: "advice", pos: "noun" },
      { ur: "نسخہ", romanization: "nuskha", vi: "đơn thuốc", en: "prescription", pos: "noun" },
      { ur: "درخواست", romanization: "darkhwast", vi: "đơn yêu cầu", en: "application/request", pos: "noun" },
      { ur: "اگلا قدم", romanization: "agla qadam", vi: "bước tiếp theo", en: "next step", pos: "phrase" },
    ],
    dialogue: [
      {
        speaker: "Learner",
        ur: "براہ کرم مجھے اگلا قدم بتا دیجیے۔",
        romanization: "barah-e-karam mujhe agla qadam bata dijiye.",
        vi: "Xin vui lòng cho tôi biết bước tiếp theo.",
        en: "Please tell me the next step.",
        register: "polite",
      },
      {
        speaker: "Clerk",
        ur: "پہلے یہ فارم جمع کر دیجیے۔",
        romanization: "pehle yeh form jama kar dijiye.",
        vi: "Trước hết xin nộp mẫu đơn này.",
        en: "First, please submit this form.",
        register: "polite",
      },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Mẫu đơn này phải nộp ở đâu?",
        en: "Where should this form be submitted?",
        ur: "یہ فارم کہاں جمع کرنا ہے؟",
        romanization: "yeh form kahan jama karna hai?",
      },
    ],
    cultural_notes_vi:
      "Bài này chỉ dạy ngôn ngữ giao tiếp ở dịch vụ. Không dùng các câu này như lời khuyên y tế hoặc pháp lý.",
    cultural_notes_en:
      "This lesson teaches service-counter language only. Do not treat these sentences as medical or legal advice.",
    tip_advice_vi:
      "`براہ کرم... دیجیے` là khung lịch sự hữu ích khi xin hướng dẫn.",
    tip_advice_en:
      "`براہ کرم... دیجیے` is a useful polite frame for requesting guidance.",
    register_notes_vi:
      "`دیجیے` lịch sự hơn mệnh lệnh ngắn. Dùng tốt với nhân viên dịch vụ.",
    register_notes_en:
      "`دیجیے` is more polite than a short command. It works well with service staff.",
  },
  {
    id: "urdu_b1_opinions_reasons",
    level: "B1",
    category: "opinions_reasons",
    title_vi: "Nêu ý kiến và lý do",
    title_en: "Giving opinions and reasons",
    intro_vi:
      "Bài này luyện cách nói ý kiến cá nhân bằng Urdu mềm, có lý do, không quá trực diện.",
    intro_en:
      "This lesson practices giving personal opinions in softer Urdu, with reasons and without sounding too blunt.",
    sentences: [
      {
        ur: "میرے خیال میں یہ حل بہتر ہے۔",
        romanization: "mere khayal main yeh hal behtar hai.",
        vi: "Theo tôi, giải pháp này tốt hơn.",
        en: "In my view, this solution is better.",
      },
      {
        ur: "مجھے لگتا ہے کہ ہمیں مزید معلومات چاہیے۔",
        romanization: "mujhe lagta hai ke hamein mazeed malumat chahiye.",
        vi: "Tôi nghĩ rằng chúng ta cần thêm thông tin.",
        en: "I think we need more information.",
      },
      {
        ur: "اس لیے کہ وقت بہت کم ہے۔",
        romanization: "is liye ke waqt bahut kam hai.",
        vi: "Bởi vì thời gian rất ít.",
        en: "Because time is very limited.",
      },
    ],
    vocabulary: [
      { ur: "میرے خیال میں", romanization: "mere khayal main", vi: "theo tôi", en: "in my view", pos: "frame" },
      { ur: "مجھے لگتا ہے", romanization: "mujhe lagta hai", vi: "tôi nghĩ / tôi cảm thấy", en: "I think", pos: "frame" },
      { ur: "اس لیے کہ", romanization: "is liye ke", vi: "bởi vì", en: "because", pos: "connector" },
      { ur: "بہتر", romanization: "behtar", vi: "tốt hơn", en: "better", pos: "adjective" },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "میرے ___ میں یہ حل بہتر ہے۔",
        answer: "خیال",
        hint_vi: "cụm nghĩa là 'theo tôi'",
        hint_en: "part of the frame 'in my view'",
      },
    ],
    cultural_notes_vi:
      "Trong bất đồng nhẹ, Urdu thường bắt đầu bằng khung ý kiến như `میرے خیال میں` thay vì phủ định trực tiếp.",
    cultural_notes_en:
      "In mild disagreement, Urdu often starts with an opinion frame like `میرے خیال میں` rather than a direct negation.",
    tip_advice_vi:
      "Ghép `میرے خیال میں...` với `اس لیے کہ...` để tạo câu ý kiến có lý do.",
    tip_advice_en:
      "Pair `میرے خیال میں...` with `اس لیے کہ...` to build an opinion with a reason.",
  },
  {
    id: "urdu_b1_relative_correlative",
    level: "B1",
    category: "public_services",
    title_vi: "Cấu trúc tương liên `جو... وہ...`",
    title_en: "Relative-correlative frames with `جو... وہ...`",
    intro_vi:
      "Bài này giới thiệu một mẫu Hindustani quan trọng: `جو... وہ...`, dùng để nối ý giống 'cái/người nào... thì...'.",
    intro_en:
      "This lesson introduces an important Hindustani pattern: `جو... وہ...`, used like 'whoever/whatever... that...'.",
    sentences: [
      {
        ur: "جو فارم مکمل ہے، وہ آج جمع ہو سکتا ہے۔",
        romanization: "jo form mukammal hai, woh aaj jama ho sakta hai.",
        vi: "Mẫu nào đã hoàn chỉnh thì có thể nộp hôm nay.",
        en: "The form that is complete can be submitted today.",
      },
      {
        ur: "جہاں مسئلہ ہے، وہاں وضاحت بھی چاہیے۔",
        romanization: "jahan masla hai, wahan wazahat bhi chahiye.",
        vi: "Ở đâu có vấn đề thì ở đó cũng cần giải thích.",
        en: "Where there is a problem, explanation is also needed there.",
      },
      {
        ur: "جب وقت ملے، تب مجھے پیغام بھیج دیجیے۔",
        romanization: "jab waqt mile, tab mujhe paigham bhej dijiye.",
        vi: "Khi nào có thời gian, lúc đó xin gửi tin nhắn cho tôi.",
        en: "When you have time, please send me a message.",
      },
    ],
    vocabulary: [
      { ur: "جو... وہ...", romanization: "jo... woh...", vi: "cái/người nào... thì...", en: "which/who... that...", pos: "frame" },
      { ur: "جہاں... وہاں...", romanization: "jahan... wahan...", vi: "ở đâu... ở đó...", en: "where... there...", pos: "frame" },
      { ur: "جب... تب...", romanization: "jab... tab...", vi: "khi... lúc đó...", en: "when... then...", pos: "frame" },
    ],
    exercises: [
      {
        type: "matching",
        instruction_vi: "Nối khung tương liên với nghĩa.",
        instruction_en: "Match each correlative frame with its meaning.",
        pairs: [
          { ur: "جو... وہ...", meaning_vi: "cái/người nào... thì...", meaning_en: "which/who... that..." },
          { ur: "جہاں... وہاں...", meaning_vi: "ở đâu... ở đó...", meaning_en: "where... there..." },
          { ur: "جب... تب...", meaning_vi: "khi... lúc đó...", meaning_en: "when... then..." },
        ],
      },
    ],
    cultural_notes_vi:
      "Mẫu tương liên xuất hiện nhiều trong Urdu/Hindi hơn trong tiếng Việt. Học như một khung nguyên cụm thay vì dịch từng từ.",
    cultural_notes_en:
      "Correlative frames are more common in Urdu/Hindi than in English. Learn them as whole frames instead of translating word by word.",
    tip_advice_vi:
      "Đừng bỏ nửa thứ hai `وہ/وہاں/تب`; nó làm câu cân bằng và tự nhiên hơn.",
    tip_advice_en:
      "Do not drop the second half `وہ/وہاں/تب`; it makes the sentence balanced and natural.",
  },
];

export default lessons;
