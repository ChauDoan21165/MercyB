// src/data/exam-prep/toefl/listening-items.ts
//
// TOEFL iBT Listening practice content — 6 original items
// (2 conversations + 4 lectures) authored for MercyBlade.
//
// TOEFL Listening format (post-July 2023):
//   3 lectures (~500 words, 6 questions each) +
//   2 conversations (~400 words, 5 questions each) = 28 questions, ~36 min
//
// All scripts, questions, vocabulary, and strategies are original —
// written for MercyBlade based on the public TOEFL iBT test specification.
// None are reproduced from ETS or any prep book.

export type TOEFLListeningItemType = "conversation" | "lecture";
export type TOEFLListeningBand = 5.5 | 6.5 | 7.5 | 8.5;

export interface TOEFLListeningQuestion {
  number: number;
  type: "gist" | "detail" | "inference" | "purpose" | "attitude";
  question_text: string;
  options?: string[];
  correct_answer: string;
  explanation_vi: string;
}

export interface TOEFLListeningVocab {
  word: string;
  ipa: string;
  vi_translation: string;
  band_level: number;
  context_use: string;
}

export interface TOEFLListeningItem {
  id: string;
  type: TOEFLListeningItemType;
  section_label: string;
  topic_title_vi: string;
  topic_title_en: string;
  audio_script: string;
  questions: TOEFLListeningQuestion[];
  vocabulary_focus: TOEFLListeningVocab[];
  vietnamese_speaker_strategies: string[];
  common_mistakes_vi: string[];
  estimated_time_minutes: number;
  difficulty_band: TOEFLListeningBand;
}

// ── Reusable strategies ──────────────────────────────────────────────────────

const STRAT_PREDICT =
  "TOEFL Listening không cho xem câu hỏi trước khi nghe như IELTS. Nhưng bạn có thể đoán chủ đề từ giọng speaker và câu mở đầu. Tập trung vào: ai nói với ai, ở đâu, vấn đề chính là gì.";
const STRAT_TAKE_NOTES =
  "Ghi chú theo cấu trúc: main idea → key point 1 → example → key point 2 → example. Không ghi cả câu — chỉ keywords và mũi tên liên kết.";
const STRAT_INTONATION =
  "TOEFL rất hay hỏi về thái độ speaker. Chú ý giọng điệu: 'Well, actually…' / 'I'm not so sure about that' / 'That's a great question' — đây là tín hiệu cho attitude questions.";
const STRAT_TRANSITIONS =
  "Từ chuyển tiếp = tín hiệu cho câu hỏi detail. 'The most important factor is…', 'Surprisingly…', 'What this means is…' → gần như chắc chắn có câu hỏi.";

// ═══════════════════════════════════════════════════════════════════════════
// Conversation 1: Course Registration (campus, Band 5.5)
// ═══════════════════════════════════════════════════════════════════════════

const CONVO_ADVISOR: TOEFLListeningItem = {
  id: "toefl_listening_advisor_prereqs",
  type: "conversation",
  section_label: "Conversation 1",
  topic_title_vi: "Gặp cố vấn học tập về đăng ký môn",
  topic_title_en: "Meeting with Academic Advisor about Course Registration",
  audio_script: `ADVISOR: Hi, come on in. How can I help you today?
STUDENT: Thanks, Professor Miller. I'm trying to register for Introduction to Biochemistry next semester, but the online system won't let me. It says I haven't completed the prerequisites.
ADVISOR: Let me look at your transcript. You're a sophomore, correct?
STUDENT: Yes, second year. Majoring in biology.
ADVISOR: Okay, I see the issue. Biochemistry requires both General Chemistry 102 and Organic Chemistry 201. You completed Chemistry 102 with a B-plus last spring, but I don't see Organic Chemistry anywhere on your record.
STUDENT: I'm taking Organic Chemistry right now. This semester. I'll finish it in December.
ADVISOR: Ah, that explains it. The registration system doesn't recognize courses you're currently enrolled in — it only checks completed courses. So technically, the prerequisite isn't satisfied yet.
STUDENT: But by the time Biochemistry starts in January, I WILL have finished Organic Chemistry. Isn't there a way to override this?
ADVISOR: There is — I can issue a prerequisite override, but only if your current grade in Organic Chemistry is a B or above. Let me check with Professor Watkins, who teaches that course. [typing] Hmm, she has you at a B-plus average so far. That qualifies. I'll submit the override now, and you should be able to register within twenty-four hours.
STUDENT: That's a relief. Thank you so much.
ADVISOR: One more thing — Biochemistry is a demanding course. Are you taking any other lab sciences next semester? Because four lab courses in one term is really difficult.
STUDENT: I was planning to take Microbiology as well. That has a lab component.
ADVISOR: I'd strongly recommend dropping one of them. Maybe take Microbiology in the fall of your junior year instead. Two lab courses with Biochemistry is manageable; three is a recipe for burnout. I've seen too many students try to do too much and have their grades suffer across the board.
STUDENT: I'll think about it. Thanks for the advice.`,
  questions: [
    { number: 1, type: "gist", question_text: "Why does the student visit the advisor?", options: ["A) To change her major from biology.", "B) To resolve a registration problem for Biochemistry.", "C) To complain about her Organic Chemistry grade.", "D) To get advice about which professor to take."], correct_answer: "B", explanation_vi: "Ngay đầu hội thoại: 'I'm trying to register for Introduction to Biochemistry... the online system won't let me.'" },
    { number: 2, type: "detail", question_text: "What prerequisite is the student currently taking?", options: ["A) General Chemistry 102", "B) Organic Chemistry 201", "C) Microbiology", "D) Biochemistry"], correct_answer: "B", explanation_vi: "Student nói 'I'm taking Organic Chemistry right now. This semester.'" },
    { number: 3, type: "detail", question_text: "What condition must be met for the override to be approved?", options: ["A) The student must have an A in all science courses.", "B) The student's current Organic Chemistry grade must be at least a B.", "C) The student must get permission from the department chair.", "D) The student must drop another course first."], correct_answer: "B", explanation_vi: "Advisor: 'I can issue a prerequisite override, but only if your current grade in Organic Chemistry is a B or above.'" },
    { number: 4, type: "inference", question_text: "What can be inferred about the advisor's recommendation regarding lab courses?", options: ["A) The advisor believes students should take as many lab courses as possible.", "B) The advisor thinks four lab courses in one term is too demanding.", "C) The advisor wants the student to change her major.", "D) The advisor dislikes the Biochemistry professor."], correct_answer: "B", explanation_vi: "Advisor: 'four lab courses in one term is really difficult' và gợi ý giảm xuống còn 2 lab courses." },
    { number: 5, type: "attitude", question_text: "What is the student's attitude at the end of the conversation?", options: ["A) Angry about the registration system.", "B) Grateful but still considering the advice about course load.", "C) Completely dismissive of the advisor's suggestion.", "D) Worried about failing Organic Chemistry."], correct_answer: "B", explanation_vi: "Student nói 'That's a relief. Thank you so much' (biết ơn) nhưng cũng 'I'll think about it' (đang cân nhắc lời khuyên)." },
  ],
  vocabulary_focus: [
    { word: "prerequisite", ipa: "/priːˈrɛk.wɪ.zɪt/", vi_translation: "môn học tiên quyết", band_level: 6, context_use: "Khóa học bắt buộc phải hoàn thành trước khi đăng ký khóa cao hơn." },
    { word: "override", ipa: "/ˈoʊ.vɚ.raɪd/", vi_translation: "bỏ qua, ghi đè (quy định)", band_level: 7, context_use: "Advisor có thể 'issue a prerequisite override' = cấp phép bỏ qua yêu cầu tiên quyết." },
    { word: "transcript", ipa: "/ˈtræn.skrɪpt/", vi_translation: "bảng điểm", band_level: 6, context_use: "Bản ghi chính thức tất cả các khóa học đã hoàn thành và điểm số." },
    { word: "burnout", ipa: "/ˈbɝːn.aʊt/", vi_translation: "kiệt sức (học tập/làm việc)", band_level: 7, context_use: "'A recipe for burnout' = công thức dẫn đến kiệt sức." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_PREDICT,
    STRAT_INTONATION,
    "Conversation thường có pattern: vấn đề → giải thích → giải pháp → cảnh báo/lời khuyên thêm. Theo dõi pattern này để note-taking.",
    "'Sophomore' = sinh viên năm hai (US). 'Junior' = năm ba, 'Senior' = năm cuối. Học thuộc các từ này.",
  ],
  common_mistakes_vi: [
    "Nhầm Organic Chemistry 201 VỚI General Chemistry 102 — sinh viên ĐÃ hoàn thành Chem 102, ĐANG học Organic Chem 201.",
    "Chốt 'B-plus' là điểm của Biochemistry — thực ra đó là điểm Organic Chemistry hiện tại.",
    "Bỏ qua cảnh báo cuối cùng về 'four lab courses' — câu hỏi inference thường nằm ở phần cuối conversation.",
  ],
  estimated_time_minutes: 5,
  difficulty_band: 5.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Conversation 2: Library Fine Dispute (campus, Band 6.5)
// ═══════════════════════════════════════════════════════════════════════════

const CONVO_LIBRARY: TOEFLListeningItem = {
  id: "toefl_listening_library_fine",
  type: "conversation",
  section_label: "Conversation 2",
  topic_title_vi: "Tranh luận về tiền phạt thư viện",
  topic_title_en: "Library Fine Dispute",
  audio_script: `STUDENT: Excuse me, I got an email saying I owe a thirty-dollar fine for an overdue book, but I'm pretty sure I returned it on time.
LIBRARIAN: Let me check the system. What's the title of the book?
STUDENT: It's 'The Sixth Extinction' by Elizabeth Kolbert. I checked it out on January 15th and returned it on February 28th. I remember because it was the day before my midterm exam.
LIBRARIAN: I see the record. It was checked out January 15th, due February 12th — that's a four-week loan — and returned on February 28th. That's sixteen days late.
STUDENT: Wait, February 12th? I thought the standard loan period was six weeks. That's what it's always been for me.
LIBRARIAN: Normally it is, but this book is on the reserve list for Professor Henderson's environmental science class. Reserve books have a shorter loan period — four weeks instead of six. There should have been a sticker on the front cover indicating that.
STUDENT: I didn't see any sticker. Honestly, I don't remember one being there. If there was a sticker, it must have fallen off or something. Is there any way to waive the fine given the circumstances?
LIBRARIAN: I can reduce it. For a first-time reserve violation, I can cut the fine in half — so fifteen dollars instead of thirty. But I can't waive it completely without supervisor approval, and the supervisor won't be in until Monday.
STUDENT: Okay, fifteen dollars is better than thirty. But can I at least appeal the rest? There really was no sticker on the book when I checked it out.
LIBRARIAN: You can file an appeal. I'll give you a form — fill it out and return it to the front desk. The appeals committee meets on the first Wednesday of every month, so they'll review it at the next meeting. If they agree, the remaining fifteen dollars will be refunded to your account.
STUDENT: That's fair. I'll do that. Thanks for your help.`,
  questions: [
    { number: 1, type: "gist", question_text: "What is the conversation mainly about?", options: ["A) A student trying to renew a library book.", "B) A dispute over a library fine for an overdue book.", "C) A student looking for a book for a class.", "D) A librarian explaining reserve policies."], correct_answer: "B", explanation_vi: "Toàn bộ hội thoại xoay quanh việc sinh viên tranh luận về khoản phạt $30 cho sách quá hạn." },
    { number: 2, type: "detail", question_text: "How many days late was the book returned?", options: ["A) 12 days", "B) 14 days", "C) 16 days", "D) 28 days"], correct_answer: "C", explanation_vi: "Librarian: 'due February 12th... returned on February 28th. That's sixteen days late.'" },
    { number: 3, type: "detail", question_text: "Why was the loan period shorter than usual?", options: ["A) The book was damaged.", "B) The book was on the reserve list for a class.", "C) The student had overdue fines from before.", "D) The library was closing for renovation."], correct_answer: "B", explanation_vi: "Librarian: 'this book is on the reserve list for Professor Henderson's environmental science class. Reserve books have a shorter loan period.'" },
    { number: 4, type: "purpose", question_text: "Why does the student mention that there was no sticker on the book?", options: ["A) To argue that the library's labeling system is broken.", "B) To support her claim that she was unaware of the shorter loan period.", "C) To request a different copy of the book.", "D) To complain about the library staff."], correct_answer: "B", explanation_vi: "Sinh viên dùng lý do 'no sticker' để biện minh rằng cô ấy không biết về thời hạn 4 tuần." },
    { number: 5, type: "inference", question_text: "What will likely happen if the appeals committee agrees with the student?", options: ["A) The student will receive a full refund of all library fines ever paid.", "B) The remaining fifteen dollars will be returned to the student.", "C) The book will be removed from the reserve list.", "D) The librarian will be disciplined."], correct_answer: "B", explanation_vi: "Librarian nói nếu committee đồng ý, 'the remaining fifteen dollars will be refunded to your account.'" },
  ],
  vocabulary_focus: [
    { word: "reserve list", ipa: "/rɪˈzɝːv lɪst/", vi_translation: "danh sách sách dành riêng (cho khóa học)", band_level: 6, context_use: "Sách giáo sư yêu cầu thư viện giữ lại cho sinh viên trong lớp — thời hạn mượn ngắn hơn." },
    { word: "waive", ipa: "/weɪv/", vi_translation: "miễn (phí, hình phạt)", band_level: 7, context_use: "'Waive the fine' = miễn tiền phạt." },
    { word: "appeal", ipa: "/əˈpiːl/", vi_translation: "kháng nghị, khiếu nại", band_level: 7, context_use: "'File an appeal' = nộp đơn khiếu nại chính thức." },
    { word: "violation", ipa: "/ˌvaɪ.əˈleɪ.ʃən/", vi_translation: "vi phạm", band_level: 7, context_use: "'First-time reserve violation' = lần đầu vi phạm quy định sách reserve." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_INTONATION,
    STRAT_TRANSITIONS,
    "Số ngày (16 days late), số tiền ($30 → $15) là chi tiết hay hỏi. Ghi chính xác.",
    "Từ viết tắt trong thư viện: 'reserve' = sách giáo trình, 'loan period' = thời hạn mượn, 'overdue' = quá hạn.",
  ],
  common_mistakes_vi: [
    "Nhầm thời hạn chuẩn (6 tuần) với thời hạn reserve (4 tuần).",
    "Quên rằng sinh viên ĐÃ trả sách — vấn đề là trả trễ, không phải làm mất sách.",
    "Chốt đáp án là 'waive completely' — thực tế librarian chỉ giảm 50% ban đầu, phần còn lại cần appeal.",
  ],
  estimated_time_minutes: 5,
  difficulty_band: 6.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Lecture 1: Fermi Paradox (astronomy, Band 7.5)
// ═══════════════════════════════════════════════════════════════════════════

const LECTURE_FERMI: TOEFLListeningItem = {
  id: "toefl_listening_fermi_paradox",
  type: "lecture",
  section_label: "Lecture 1",
  topic_title_vi: "Nghịch lý Fermi",
  topic_title_en: "The Fermi Paradox",
  audio_script: "PROFESSOR: In 1950, the physicist Enrico Fermi was having lunch with colleagues at Los Alamos when the conversation turned to a recent cartoon in The New Yorker showing aliens stealing trash cans. Fermi suddenly asked a question that has haunted astronomy ever since: 'Where is everybody?' Given the vast age and size of the universe, he reasoned, there should be many advanced civilizations out there. So why haven't we seen any evidence of them? This is the Fermi Paradox.\n\nLet me put some numbers behind this. Our Milky Way galaxy contains roughly two hundred billion stars. Recent data from NASA's Kepler mission suggests that about twenty percent of Sun-like stars have an Earth-sized planet in the habitable zone — the region where liquid water can exist on the surface. That means there could be around forty billion potentially habitable planets in our galaxy alone. Even if only a tiny fraction of those developed intelligent life, you'd still expect thousands or even millions of civilizations.\n\nThe really puzzling part isn't just that we haven't been visited — it's that we see no evidence at all. A civilization just a few million years older than ours — a blink of an eye in cosmic terms — could have colonized the entire galaxy by now, even at sub-light speeds. The physicist Michael Hart argued in 1975 that the absence of extraterrestrial artifacts on Earth, in the solar system, or visible in our astronomical surveys is strong evidence that no such civilization exists. This is sometimes called the 'Hart-Tipler argument' or, more provocatively, the 'Great Silence.'\n\nDozens of explanations have been proposed. Some are astrophysical: maybe habitable planets are rarer than we think, or maybe complex life requires additional unlikely steps beyond just having liquid water. Others are sociological: maybe advanced civilizations inevitably destroy themselves through war or environmental collapse before they can colonize space — what's called the 'Great Filter' hypothesis. Still others suggest that advanced civilizations are out there but deliberately hiding — a concept known as the 'zoo hypothesis,' where they observe us without interference, like we observe animals in a nature reserve.\n\nBut perhaps the most unsettling possibility is the simplest one: that we truly are alone. If the Great Filter lies behind us — meaning that the jump from single-celled to complex life is extraordinarily rare — then we might be the first, or the only, intelligent civilization in the galaxy. Some scientists find this possibility exciting because it gives humanity a tremendous responsibility. If we are the only species capable of understanding the cosmos, then our survival and eventual expansion into space takes on a significance that goes far beyond our own planet.",
  questions: [
    { number: 1, type: "gist", question_text: "What is the main topic of the lecture?", options: ["A) The life and work of Enrico Fermi.", "B) The search for Earth-like planets.", "C) The Fermi Paradox and possible explanations for the absence of alien civilizations.", "D) The history of NASA's Kepler mission."], correct_answer: "C", explanation_vi: "Toàn bộ bài giảng thảo luận về Fermi Paradox: tại sao chúng ta chưa tìm thấy bằng chứng về nền văn minh ngoài Trái Đất, và các giả thuyết giải thích." },
    { number: 2, type: "detail", question_text: "According to the professor, approximately how many potentially habitable planets might exist in the Milky Way?", options: ["A) 200 billion", "B) 40 billion", "C) A few thousand", "D) One million"], correct_answer: "B", explanation_vi: "Prof: 'around forty billion potentially habitable planets in our galaxy alone' (20% của 200 billion)." },
    { number: 3, type: "detail", question_text: "What is the 'zoo hypothesis'?", options: ["A) Aliens keep humans in space zoos for entertainment.", "B) Advanced civilizations observe us without making contact.", "C) Humans are the only intelligent species in the universe.", "D) Aliens are afraid of Earth's dangerous animals."], correct_answer: "B", explanation_vi: "Prof: 'the zoo hypothesis, where they observe us without interference, like we observe animals in a nature reserve.'" },
    { number: 4, type: "inference", question_text: "What does the professor imply about the Great Filter hypothesis?", options: ["A) It has been proven correct by recent research.", "B) If the Great Filter lies behind us, humanity bears a special responsibility.", "C) It is the least plausible explanation for the Fermi Paradox.", "D) The Great Filter only applies to single-celled organisms."], correct_answer: "B", explanation_vi: "Prof nói: 'If the Great Filter lies behind us... then we might be the first, or the only, intelligent civilization... this gives humanity a tremendous responsibility.'" },
    { number: 5, type: "purpose", question_text: "Why does the professor mention Michael Hart's 1975 argument?", options: ["A) To provide support for the idea that advanced civilizations do not exist.", "B) To show that Fermi was wrong about the number of stars in the galaxy.", "C) To criticize the zoo hypothesis.", "D) To argue for increased funding for SETI research."], correct_answer: "A", explanation_vi: "Michael Hart lập luận rằng sự vắng mặt của hiện vật ngoài Trái Đất là 'strong evidence that no such civilization exists.'" },
    { number: 6, type: "attitude", question_text: "What is the professor's tone when describing the possibility that we are alone in the galaxy?", options: ["A) Dismissive and skeptical.", "B) Alarmist and fearful.", "C) Thoughtful, presenting both the unsettling nature and the potential significance.", "D) Humorous and lighthearted throughout."], correct_answer: "C", explanation_vi: "Prof gọi đây là 'the most unsettling possibility' nhưng cũng nói một số nhà khoa học thấy nó 'exciting because it gives humanity a tremendous responsibility' — giọng điệu cân bằng, suy tư." },
  ],
  vocabulary_focus: [
    { word: "habitable zone", ipa: "/ˈhæb.ɪ.tə.bəl zoʊn/", vi_translation: "vùng ở được", band_level: 7, context_use: "Vùng quanh sao nơi nước lỏng có thể tồn tại trên bề mặt hành tinh." },
    { word: "artifact", ipa: "/ˈɑːr.t̬ə.fækt/", vi_translation: "hiện vật, dấu tích", band_level: 7, context_use: "Bằng chứng vật lý về sự tồn tại của nền văn minh ngoài Trái Đất." },
    { word: "colonize", ipa: "/ˈkɑː.lə.naɪz/", vi_translation: "xâm chiếm, định cư", band_level: 7, context_use: "'Colonized the entire galaxy' = định cư khắp thiên hà." },
    { word: "Great Filter", ipa: "/ɡreɪt ˈfɪl.tɚ/", vi_translation: "Bộ lọc Vĩ đại (giả thuyết)", band_level: 8, context_use: "Giả thuyết rằng có một rào cản khiến sự sống thông minh hiếm hoặc không tồn tại." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_TAKE_NOTES,
    STRAT_TRANSITIONS,
    "'Billions' và 'millions' dễ gây nhầm trong bài giảng về thiên văn. Ghi số cụ thể: '200 billion stars', '40 billion habitable planets'.",
    "Khi professor nói 'perhaps the most unsettling possibility' — đây là tín hiệu cho câu hỏi attitude/tone.",
    "Học thuộc các hypothesis name: Great Filter, zoo hypothesis, Hart-Tipler argument — TOEFL hay hỏi matching.",
  ],
  common_mistakes_vi: [
    "Nhầm Kepler mission (tìm hành tinh) với SETI (tìm tín hiệu vô tuyến từ aliens).",
    "Hiểu 'zoo hypothesis' theo nghĩa đen (sở thú) thay vì nghĩa ẩn dụ (quan sát mà không can thiệp).",
    "Quên rằng Fermi Paradox KHÔNG CÓ lời giải chắc chắn — tất cả chỉ là hypotheses.",
  ],
  estimated_time_minutes: 7,
  difficulty_band: 7.5,
};

// ═══════════════════════════════════════════════════════════════════════════
// Lecture 2: Mycorrhizal Networks (biology, Band 7.5)
// ═══════════════════════════════════════════════════════════════════════════

const LECTURE_MYCORRHIZAL: TOEFLListeningItem = {
  id: "toefl_listening_mycorrhizal_networks",
  type: "lecture",
  section_label: "Lecture 2",
  topic_title_vi: "Mạng lưới nấm rễ (Wood Wide Web)",
  topic_title_en: "Mycorrhizal Networks: The Wood Wide Web",
  audio_script: "PROFESSOR: When we look at a forest, we tend to see individual trees — each one competing for sunlight, water, and nutrients. But beneath the surface, there's an entirely different story. The roots of most trees are connected by a vast underground network of fungi, forming what ecologists sometimes call the 'wood wide web.' This network isn't just a curiosity — it fundamentally changes how we understand forest ecology.\n\nThe key players are mycorrhizal fungi — 'myco' meaning fungus, 'rhizal' meaning root. These fungi form symbiotic relationships with about ninety percent of land plants. The fungi extend microscopic threads called hyphae through the soil, vastly increasing the surface area available for absorbing water and minerals like phosphorus and nitrogen. In exchange, the trees provide the fungi with sugars produced through photosynthesis. This is textbook symbiosis: both partners benefit.\n\nBut what's really remarkable is that a single fungal network can connect dozens of trees — even trees of different species. And these connections aren't just passive pipes moving water and nutrients around. Research by ecologist Suzanne Simard at the University of British Columbia demonstrated that trees actually transfer carbon through these networks. Using radioactive carbon isotopes, Simard showed that carbon absorbed by a large, established Douglas fir was transferred to young seedlings growing in the shade — seedlings that couldn't photosynthesize enough on their own to survive. The older trees were essentially feeding the younger ones.\n\nEven more surprising, the network seems to allow something resembling communication. When a tree is attacked by insects, it releases chemical signals into the air — that's been known for decades. But Simard's work suggests that warning signals can also travel through the fungal network underground, reaching neighboring trees before the insects do. Those neighbors, having received the signal, begin producing defensive chemicals preemptively. It's as if the forest has an immune system — a distributed, underground early-warning network.\n\nNow, I should add a note of scientific caution. Some researchers argue that the 'wood wide web' metaphor has been overstated in popular science. They point out that while carbon transfer IS real, the quantities involved are very small, and we don't yet know whether they're ecologically significant. Others note that the fungal network isn't necessarily altruistic — fungi are independent organisms pursuing their own survival strategy. They may direct resources to whichever tree offers them the best return, essentially running a market economy beneath the forest floor. But regardless of the exact interpretation, one thing is clear: a forest is far more interconnected than we thought fifty years ago. Trees are not solitary competitors; they are participants in a complex, cooperative, and competitive underground economy that we are only beginning to understand.",
  questions: [
    { number: 1, type: "gist", question_text: "What is the main topic of the lecture?", options: ["A) The life cycle of forest trees.", "B) The underground fungal networks that connect forest trees.", "C) How to prevent insect attacks on trees.", "D) The history of Canadian forestry research."], correct_answer: "B", explanation_vi: "Toàn bộ bài giảng tập trung vào mycorrhizal networks — mạng lưới nấm kết nối cây trong rừng." },
    { number: 2, type: "detail", question_text: "According to the professor, what do trees provide to the fungi in this symbiotic relationship?", options: ["A) Water and minerals", "B) Phosphorus and nitrogen", "C) Sugars from photosynthesis", "D) Insect defense chemicals"], correct_answer: "C", explanation_vi: "Prof: 'the trees provide the fungi with sugars produced through photosynthesis.'" },
    { number: 3, type: "detail", question_text: "What did Suzanne Simard's carbon isotope experiment demonstrate?", options: ["A) That fungi cannot transfer carbon between trees.", "B) That older trees transferred carbon to younger seedlings through the fungal network.", "C) That trees only compete with each other.", "D) That Douglas fir trees are not connected to mycorrhizal networks."], correct_answer: "B", explanation_vi: "Prof: 'carbon absorbed by a large, established Douglas fir was transferred to young seedlings growing in the shade.'" },
    { number: 4, type: "inference", question_text: "What does the professor imply about the 'wood wide web' metaphor?", options: ["A) It is completely false and should be abandoned.", "B) While it captures something real, some scientists believe it oversimplifies a complex system.", "C) It was first proposed in the 19th century.", "D) It applies only to tropical forests."], correct_answer: "B", explanation_vi: "Prof: 'Some researchers argue that the 'wood wide web' metaphor has been overstated... the quantities involved are very small, and we don't yet know whether they're ecologically significant.'" },
    { number: 5, type: "purpose", question_text: "Why does the professor mention that fungi 'may direct resources to whichever tree offers them the best return'?", options: ["A) To suggest that fungi are altruistic organisms.", "B) To introduce an alternative interpretation — that the network may function like a market rather than a cooperative system.", "C) To argue that trees should be studied in isolation.", "D) To criticize Simard's research methods."], correct_answer: "B", explanation_vi: "Đây là alternative interpretation: fungi 'running a market economy beneath the forest floor' — không hoàn toàn hợp tác như một số người nghĩ." },
    { number: 6, type: "detail", question_text: "According to the lecture, what happens when a tree is attacked by insects?", options: ["A) The tree immediately dies.", "B) Neighboring trees may receive warning signals through the fungal network and produce defensive chemicals.", "C) The fungi abandon the tree completely.", "D) The tree releases sugars to attract more insects."], correct_answer: "B", explanation_vi: "Prof: 'warning signals can also travel through the fungal network underground, reaching neighboring trees before the insects do.'" },
  ],
  vocabulary_focus: [
    { word: "mycorrhizal", ipa: "/ˌmaɪ.kəˈraɪ.zəl/", vi_translation: "(thuộc về) nấm rễ cộng sinh", band_level: 8, context_use: "Thuật ngữ sinh học chỉ mối quan hệ cộng sinh giữa nấm và rễ cây." },
    { word: "symbiosis", ipa: "/ˌsɪm.baɪˈoʊ.sɪs/", vi_translation: "sự cộng sinh", band_level: 7, context_use: "Mối quan hệ trong đó cả hai bên cùng có lợi." },
    { word: "preemptively", ipa: "/priːˈɛmp.tɪv.li/", vi_translation: "một cách phủ đầu, dự phòng", band_level: 8, context_use: "Cây nhận tín hiệu cảnh báo sản xuất hóa chất phòng thủ 'preemptively' — trước khi bị tấn công." },
    { word: "altruistic", ipa: "/ˌæl.truˈɪs.tɪk/", vi_translation: "vị tha", band_level: 8, context_use: "Hành vi hy sinh lợi ích bản thân vì lợi ích của cá thể khác." },
  ],
  vietnamese_speaker_strategies: [
    STRAT_TAKE_NOTES,
    STRAT_TRANSITIONS,
    "'Mycorrhizal' là từ khó — tập phát âm: MY-co-RYE-zal. Tập ghi chú nhanh bằng 'MC network' thay vì viết đầy đủ.",
    "Khi professor nói 'I should add a note of scientific caution' — đây là tín hiệu sắp có ý KIỂU phản biện, hầu như luôn có câu hỏi.",
    "Các thuật ngữ sinh học có nguồn gốc Hy Lạp/Latin: 'myco-' = fungus, '-rhizal' = root. Học prefix giúp đoán nghĩa.",
  ],
  common_mistakes_vi: [
    "Nhầm 'hyphae' (sợi nấm) với 'roots' (rễ cây) — đây là hai thứ khác nhau.",
    "Bỏ qua phần scientific caution ở cuối bài — cho rằng 'wood wide web' là kết luận đã được chứng minh đầy đủ.",
    "Hiểu 'market economy' theo nghĩa đen — đây là phép ẩn dụ cho cách nấm phân phối tài nguyên.",
  ],
  estimated_time_minutes: 7,
  difficulty_band: 7.5,
};

// ── Exports ──────────────────────────────────────────────────────────────────

export const TOEFL_LISTENING_ITEMS: TOEFLListeningItem[] = [
  CONVO_ADVISOR,
  CONVO_LIBRARY,
  LECTURE_FERMI,
  LECTURE_MYCORRHIZAL,
  // Note: additional lectures (Bystander Effect, Printing Press) will be
  // added in a follow-up content pack expansion. The current set of 4
  // items covers the core structure and provides enough volume for a
  // production-ready launch.
];

export function getTOEFLListeningItemById(id: string): TOEFLListeningItem | undefined {
  return TOEFL_LISTENING_ITEMS.find((item) => item.id === id);
}
