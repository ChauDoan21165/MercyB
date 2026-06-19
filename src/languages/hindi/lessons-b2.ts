// Hindi B2 lessons — Standard Hindi in Devanagari.
// B2 focus: meetings, formal complaints, disagreement, media summaries, and professional writing.

export type HindiCefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type HindiB2Category =
  | "meetings"
  | "formal_request_complaint"
  | "professional_email"
  | "polite_disagreement"
  | "media_summary";

export type HindiSentence = {
  hi: string;
  romanization: string;
  vi: string;
  en: string;
  note_vi?: string;
  note_en?: string;
};

export type HindiVocabEntry = {
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
  category: HindiB2Category;
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
    id: "hindi_b2_meetings_agenda",
    level: "B2",
    category: "meetings",
    title_vi: "Cuộc họp: chương trình, chuyển mục và quyết định",
    title_en: "Meetings: agenda, transitions, and decisions",
    intro_vi:
      "Bài này luyện cách điều hành phần cơ bản của cuộc họp bằng Hindi chuyên nghiệp, không quá hành chính.",
    intro_en:
      "This lesson practices basic meeting facilitation in professional Hindi without sounding overly bureaucratic.",
    sentences: [
      {
        hi: "चलिए, पहले कार्यसूची पर नज़र डालते हैं।",
        romanization: "chaliye, pahle kaaryasuuchii par nazar daalte hain",
        vi: "Nào, trước tiên chúng ta xem qua chương trình làm việc.",
        en: "Let's first look at the agenda.",
      },
      {
        hi: "अब हम अगले मुद्दे पर आते हैं।",
        romanization: "ab ham agle mudde par aate hain",
        vi: "Bây giờ chúng ta chuyển sang vấn đề tiếp theo.",
        en: "Now we move to the next issue.",
      },
      {
        hi: "इस निर्णय को बैठक के नोट्स में लिख लीजिए।",
        romanization: "is nirnay ko baithak ke notes men likh liijiye",
        vi: "Xin ghi quyết định này vào ghi chú cuộc họp.",
        en: "Please write this decision in the meeting notes.",
      },
    ],
    vocabulary: [
      { hi: "कार्यसूची", romanization: "kaaryasuuchii", vi: "chương trình làm việc", en: "agenda", pos: "n." },
      { hi: "मुद्दा", romanization: "muddaa", vi: "vấn đề", en: "issue", pos: "n." },
      { hi: "निर्णय", romanization: "nirnay", vi: "quyết định", en: "decision", pos: "n." },
      { hi: "सुझाव", romanization: "sujhaav", vi: "đề xuất", en: "suggestion", pos: "n." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "अब हम अगले ___ पर आते हैं।",
        answer: "मुद्दे",
        hint_vi: "dạng oblique của 'vấn đề'",
        hint_en: "oblique form of 'issue'",
      },
    ],
    cultural_notes_vi:
      "Hindi công sở có thể dùng notes, agenda, update cùng với từ Hindi. Bài này ưu tiên Devanagari và cụm Hindi chuẩn.",
    cultural_notes_en:
      "Workplace Hindi may mix words like notes, agenda, and update. This lesson prioritizes Devanagari and standard Hindi chunks.",
    tip_advice_vi:
      "चलिए là cách mở mềm và tự nhiên hơn một mệnh lệnh trực tiếp.",
    tip_advice_en:
      "चलिए is a soft, natural way to open a shared action instead of issuing a direct command.",
  },
  {
    id: "hindi_b2_formal_request_complaint",
    level: "B2",
    category: "formal_request_complaint",
    title_vi: "Yêu cầu và khiếu nại trang trọng",
    title_en: "Formal requests and complaints",
    intro_vi:
      "Bài này luyện thư khiếu nại: nêu vấn đề, bằng chứng và yêu cầu giải pháp một cách lịch sự.",
    intro_en:
      "This lesson practices complaint writing: stating the issue, evidence, and requested solution politely.",
    sentences: [
      {
        hi: "मैं सेवा में हुई देरी के संबंध में शिकायत दर्ज कराना चाहता हूँ।",
        romanization: "main sevaa men huii derii ke sambandh men shikaayat darj karaanaa chaahtaa huun",
        vi: "Tôi muốn gửi khiếu nại liên quan đến sự chậm trễ trong dịch vụ.",
        en: "I would like to file a complaint regarding the delay in service.",
      },
      {
        hi: "कृपया इस समस्या का समाधान जल्द कीजिए।",
        romanization: "kripyaa is samasyaa kaa samaadhaan jald kiijiye",
        vi: "Vui lòng giải quyết vấn đề này sớm.",
        en: "Please resolve this problem soon.",
      },
      {
        hi: "मैंने रसीद की प्रति संलग्न की है।",
        romanization: "maine rasiid kii prati sanlagn kii hai",
        vi: "Tôi đã đính kèm bản sao biên lai.",
        en: "I have attached a copy of the receipt.",
      },
    ],
    vocabulary: [
      { hi: "शिकायत", romanization: "shikaayat", vi: "khiếu nại", en: "complaint", pos: "n." },
      { hi: "समाधान", romanization: "samaadhaan", vi: "giải pháp", en: "solution", pos: "n." },
      { hi: "रसीद", romanization: "rasiid", vi: "biên lai", en: "receipt", pos: "n." },
      { hi: "संलग्न", romanization: "sanlagn", vi: "đính kèm", en: "attached", pos: "adj." },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Tôi đã đính kèm bản sao biên lai.",
        en: "I have attached a copy of the receipt.",
        hi: "मैंने रसीद की प्रति संलग्न की है।",
      },
    ],
    cultural_notes_vi:
      "Văn khiếu nại Hindi tốt tách sự việc khỏi cảm xúc: vấn đề, bằng chứng, yêu cầu. Tránh công kích cá nhân.",
    cultural_notes_en:
      "Effective Hindi complaint writing separates facts from emotion: issue, evidence, request. Avoid personal attacks.",
    tip_advice_vi:
      "के संबंध में là cụm trang trọng nghĩa là 'liên quan đến'. Không dùng nó quá nhiều trong hội thoại thường ngày.",
    tip_advice_en:
      "के संबंध में is a formal phrase meaning 'regarding'. Avoid overusing it in casual speech.",
    register_notes_vi:
      "निवेदन है कि... trang trọng hơn कृपया..., phù hợp với đơn từ nhưng có thể nặng trong email công sở ngắn.",
    register_notes_en:
      "निवेदन है कि... is more formal than कृपया..., suitable for applications but heavy in short workplace emails.",
  },
  {
    id: "hindi_b2_polite_disagreement",
    level: "B2",
    category: "polite_disagreement",
    title_vi: "Bất đồng lịch sự và phản biện",
    title_en: "Polite disagreement and rebuttal",
    intro_vi:
      "Bài này luyện cách phản biện mà không nói thẳng 'bạn sai', dùng công nhận một phần và dữ liệu.",
    intro_en:
      "This lesson practices disagreeing without bluntly saying 'you are wrong', using partial acknowledgement and evidence.",
    sentences: [
      {
        hi: "मैं आपकी बात समझता हूँ, लेकिन पूरी तरह सहमत नहीं हूँ।",
        romanization: "main aapkii baat samajhtaa huun, lekin puurii tarah sahamat nahiin huun",
        vi: "Tôi hiểu ý của bạn, nhưng tôi không hoàn toàn đồng ý.",
        en: "I understand your point, but I do not fully agree.",
      },
      {
        hi: "दूसरी ओर, आँकड़े कुछ अलग संकेत देते हैं।",
        romanization: "duusrii or, aankde kuchh alag sanket dete hain",
        vi: "Mặt khác, số liệu cho thấy một tín hiệu hơi khác.",
        en: "On the other hand, the data suggests something different.",
      },
      {
        hi: "शायद हमें निर्णय से पहले और जानकारी चाहिए।",
        romanization: "shaayad hamen nirnay se pahle aur jaankaarii chaahiye",
        vi: "Có lẽ chúng ta cần thêm thông tin trước quyết định.",
        en: "Perhaps we need more information before the decision.",
      },
    ],
    vocabulary: [
      { hi: "सहमत", romanization: "sahamat", vi: "đồng ý", en: "in agreement", pos: "adj." },
      { hi: "दूसरी ओर", romanization: "duusrii or", vi: "mặt khác", en: "on the other hand", pos: "phr." },
      { hi: "आँकड़े", romanization: "aankde", vi: "số liệu", en: "data", pos: "n.pl." },
      { hi: "संकेत देना", romanization: "sanket denaa", vi: "cho thấy, gợi ý", en: "to indicate", pos: "v." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "मैं आपकी बात समझता हूँ, लेकिन पूरी तरह ___ नहीं हूँ।",
        answer: "सहमत",
        hint_vi: "từ nghĩa là 'đồng ý'",
        hint_en: "word meaning 'in agreement'",
      },
    ],
    cultural_notes_vi:
      "Trong trao đổi chuyên nghiệp, phản biện thường bắt đầu bằng việc công nhận ý của người kia. आप गलत हैं nghe rất nặng.",
    cultural_notes_en:
      "In professional discussion, disagreement often starts by acknowledging the other person's point. आप गलत हैं lands very bluntly.",
    tip_advice_vi:
      "Khung an toàn: मैं आपकी बात समझता हूँ + लेकिन + dữ liệu/lý do + đề xuất bước tiếp theo.",
    tip_advice_en:
      "Safe frame: मैं आपकी बात समझता हूँ + लेकिन + data/reason + proposed next step.",
  },
  {
    id: "hindi_b2_media_summary",
    level: "B2",
    category: "media_summary",
    title_vi: "Tóm tắt bản tin trung lập",
    title_en: "Summarizing a neutral news item",
    intro_vi:
      "Bài này luyện tóm tắt bản tin về giáo dục, giao thông hoặc dịch vụ công, không đưa kết luận chính trị.",
    intro_en:
      "This lesson practices summarizing news about education, transport, or public services without political conclusions.",
    sentences: [
      {
        hi: "रिपोर्ट के अनुसार, नई बस सेवा अगले महीने शुरू होगी।",
        romanization: "riport ke anusaar, naii bas sevaa agle mahiine shuruu hogii",
        vi: "Theo báo cáo, dịch vụ xe buýt mới sẽ bắt đầu vào tháng tới.",
        en: "According to the report, the new bus service will start next month.",
      },
      {
        hi: "अधिकारियों ने कहा कि इससे यात्रा का समय कम होगा।",
        romanization: "adhikaariyon ne kahaa ki isse yaatraa kaa samay kam hogaa",
        vi: "Các quan chức nói rằng điều này sẽ giảm thời gian đi lại.",
        en: "Officials said this will reduce travel time.",
      },
      {
        hi: "हालाँकि, कुछ यात्रियों ने अधिक जानकारी माँगी।",
        romanization: "haalaanki, kuchh yaatriyon ne adhik jaankaarii maangii",
        vi: "Tuy nhiên, một số hành khách đã yêu cầu thêm thông tin.",
        en: "However, some passengers asked for more information.",
      },
    ],
    vocabulary: [
      { hi: "के अनुसार", romanization: "ke anusaar", vi: "theo", en: "according to", pos: "postp. phr." },
      { hi: "अधिकारी", romanization: "adhikaarii", vi: "quan chức, viên chức", en: "official", pos: "n." },
      { hi: "यात्री", romanization: "yaatrii", vi: "hành khách", en: "passenger", pos: "n." },
      { hi: "हालाँकि", romanization: "haalaanki", vi: "tuy nhiên", en: "however", pos: "adv." },
    ],
    exercises: [
      {
        type: "translation",
        vi: "Theo báo cáo, dịch vụ xe buýt mới sẽ bắt đầu vào tháng tới.",
        en: "According to the report, the new bus service will start next month.",
        hi: "रिपोर्ट के अनुसार, नई बस सेवा अगले महीने शुरू होगी।",
      },
    ],
    cultural_notes_vi:
      "Tóm tắt bản tin nên phân biệt nguồn nói gì và người học nhận xét gì. Dùng के अनुसार để gắn thông tin với nguồn.",
    cultural_notes_en:
      "A news summary should distinguish what a source says from the learner's own commentary. Use के अनुसार for attribution.",
    tip_advice_vi:
      "Ở B2, hãy tóm tắt bằng ba bước: nguồn, sự kiện, phản ứng/giới hạn.",
    tip_advice_en:
      "At B2, summarize in three moves: source, event, response/limitation.",
  },
  {
    id: "hindi_b2_professional_email_update",
    level: "B2",
    category: "professional_email",
    title_vi: "Email công việc: cập nhật và bước tiếp theo",
    title_en: "Professional email: update and next steps",
    intro_vi:
      "Bài này luyện email ngắn: thông báo tiến độ, nêu chậm trễ và yêu cầu xác nhận.",
    intro_en:
      "This lesson practices short emails: giving progress, naming a delay, and requesting confirmation.",
    sentences: [
      {
        hi: "मैं आपको परियोजना की वर्तमान स्थिति से अवगत कराना चाहता हूँ।",
        romanization: "main aapko pariyojanaa kii vartamaan sthiti se avgat karaanaa chaahtaa huun",
        vi: "Tôi muốn thông báo cho bạn về tình trạng hiện tại của dự án.",
        en: "I would like to inform you about the current status of the project.",
      },
      {
        hi: "हमें दो दिन अतिरिक्त चाहिए होंगे।",
        romanization: "hamen do din atirikt chaahiye honge",
        vi: "Chúng tôi sẽ cần thêm hai ngày.",
        en: "We will need two additional days.",
      },
      {
        hi: "कृपया इस परिवर्तन की पुष्टि कर दीजिए।",
        romanization: "kripyaa is parivartan kii pushti kar diijiye",
        vi: "Vui lòng xác nhận thay đổi này.",
        en: "Please confirm this change.",
      },
    ],
    vocabulary: [
      { hi: "परियोजना", romanization: "pariyojanaa", vi: "dự án", en: "project", pos: "n." },
      { hi: "वर्तमान स्थिति", romanization: "vartamaan sthiti", vi: "tình trạng hiện tại", en: "current status", pos: "n." },
      { hi: "अतिरिक्त", romanization: "atirikt", vi: "thêm, bổ sung", en: "additional", pos: "adj." },
      { hi: "पुष्टि", romanization: "pushti", vi: "xác nhận", en: "confirmation", pos: "n." },
    ],
    exercises: [
      {
        type: "fill-blank",
        question: "कृपया इस परिवर्तन की ___ कर दीजिए।",
        answer: "पुष्टि",
        hint_vi: "danh từ nghĩa là 'xác nhận'",
        hint_en: "noun meaning 'confirmation'",
      },
    ],
    cultural_notes_vi:
      "Email Hindi rất trang trọng có thể nghe nặng. Với đồng nghiệp, hãy giữ câu ngắn và rõ.",
    cultural_notes_en:
      "Very formal Hindi email style can sound heavy. With colleagues, keep sentences short and clear.",
    tip_advice_vi:
      "अवगत कराना là cụm trang trọng nghĩa là 'thông báo cho'. Hãy dùng trong email, không cần trong hội thoại thường ngày.",
    tip_advice_en:
      "अवगत कराना is a formal phrase meaning 'to inform'. Use it in email, not everyday speech.",
  },
];

export default lessons;
